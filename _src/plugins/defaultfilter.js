///import core
///plugin 编辑器默认的过滤转换机制

UE.plugins['defaultfilter'] = function (){
    var me = this;
    //默认的过滤处理
    //进入编辑器的内容处理
    me.addInputRule(function (root) {
        utils.each(root.getNodesByTagName('script style a img span p'), function (node) {
            var val;
            switch (node.tagName){
                case 'style':
                case 'script':
                    node.setAttr({
                        cdata_tag:node.tagName,
                        cdata_data:encodeURIComponent(node.innerText() || '')
                    });
                    node.tagName = 'div';
                    node.removeChild(node.firstChild());
                    break;
                case 'a':
                    if (val = node.getAttr('href')) {
                        node.setAttr('_href', val)
                    }
                    break;
                case 'img':
                    //todo base64暂时去掉，后边做远程图片上传后，干掉这个
                    if(val = node.getAttr('src')){
                        if(/^data:/.test(val)){
                            node.parentNode.removeChild(node);
                            break;
                        }
                    }
                    node.setAttr('_src',node.getAttr('src'));
                    break;
                case 'span':
                    if(browser.webkit && (val = node.getStyle('white-space'))){
                        if(/nowrap|normal/.test(val)){
                            node.setStyle('white-space','');
                            if(utils.isEmptyObject(node.attrs)){
                                node.parentNode.removeChild(node,true)
                            }
                        }
                    }
                    break;
                case 'p':
                    if(val = node.getAttr('align')){
                        node.setAttr('align');
                        node.setStyle('text-align',val)
                    }
            }

        });
        if(me.options.autoClearEmptyNode){
            root.traversal(function(node){
                if(node.type=='element' && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && !node.attrs){
                    if( !node.firstChild()) node.parentNode.removeChild(node);
                    else if(node.tagName == 'span'&& !node.attrs){
                        node.parentNode.removeChild(node,true)
                    }
                }
            })
        }
        //进行默认的处理
        root.traversal(function(node){
            if(node.type == 'element'){
                switch(node.tagName){
                    case 'p':
                        var cssStyle = node.getAttr('style');
                        if(cssStyle){
                            cssStyle = cssStyle.replace(/(margin|padding)[^;]+/,'');
                            node.setAttr('style',cssStyle)

                        }
                        if(!node.firstChild()){
                            node.innerHTML(UE.browser.ie ? '&nbsp;' : '<br>')
                        }
                        break;
                    case 'div':
                        var tmpNode, p = UE.uNode.createElement('p');
                        while (tmpNode = node.firstChild()) {
                            if (tmpNode.type == 'text' || !UE.dom.dtd.$block[tmpNode.tagName]) {
                                p.appendChild(tmpNode);
                            } else {
                                if (p.firstChild()) {
                                    node.parentNode.insertBefore(p, node);
                                    p = UE.uNode.createElement('p');
                                } else {
                                    node.parentNode.insertBefore(tmpNode, node);
                                }
                            }
                        }
                        if (p.firstChild()) {
                            node.parentNode.insertBefore(p, node);
                        }
                        node.parentNode.removeChild(node);
                        break;
                    case 'dl':
                        node.tagName = 'ul';
                        break;
                    case 'dt':
                    case 'dd':
                        node.tagName = 'li';
                        break;
                    case 'li':
                        var className = node.getAttr('class');
                        if (!className || !/list\-/.test(className)) {
                            node.setAttr()
                        }
                        var tmpNodes = node.getNodesByTagName('ol ul');
                        UE.utils.each(tmpNodes,function(n){
                            node.parentNode.insertAfter(n,node);

                        });
                        break;
                    case 'table':
                        UE.utils.each(node.getNodesByTagName('table'), function (t) {
                            UE.utils.each(t.getNodesByTagName('tr'), function (tr) {
                                var p = UE.uNode.createElement('p'), child, html = [];
                                while (child = tr.firstChild()) {
                                    html.push(child.innerHTML());
                                    tr.removeChild(child);
                                }
                                p.innerHTML(html.join('&nbsp;&nbsp;'));
                                t.parentNode.insertBefore(p, t);
                            });
                            t.parentNode.removeChild(t)
                        });

                }

            }
        })

    });

    //从编辑器出去的内容处理
    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('div a img'), function (node) {
            var val;
            switch (node.tagName){
                case 'div':
                    if (val = node.getAttr('cdata_tag')) {
                        node.tagName = val;
                        node.appendChild(UE.uNode.createText(node.getAttr('cdata_data')));
                        node.setAttr({cdata_tag:'', cdata_data:''});
                    }
                    break;
                case 'a':
                    if (val = node.getAttr('_href')) {
                        node.setAttr({
                            'href':val,
                            '_href':''
                        })
                    }
                    break;
                case 'img':
                    if(val = node.getAttr('_src')){
                        node.setAttr({
                            'src':node.getAttr('_src'),
                            '_src':''
                        })
                    }

            }
        });
        if(me.options.autoClearEmptyNode){
            root.traversal(function(node){
                if(node.type=='element' && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && !node.attrs){
                    if( !node.firstChild()) node.parentNode.removeChild(node);
                    else if(node.tagName == 'span'&& !node.attrs ){
                        node.parentNode.removeChild(node,true)
                    }
                }
            })
        }

    });
};
