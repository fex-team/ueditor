///import core
///plugin 编辑器默认的过滤转换机制

UE.plugins['defaultfilter'] = function () {
    var me = this;
    me.setOpt('allowDivTransToP',true);
    //默认的过滤处理
    //进入编辑器的内容处理
    me.addInputRule(function (root) {
        var allowDivTransToP = this.options.allowDivTransToP;
        var val;
        //进行默认的处理
        root.traversal(function (node) {
            if (node.type == 'element') {
                if (!dtd.$cdata[node.tagName] && me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && (!node.attrs || utils.isEmptyObject(node.attrs))) {
                    if (!node.firstChild()) node.parentNode.removeChild(node);
                    else if (node.tagName == 'span' && (!node.attrs || utils.isEmptyObject(node.attrs))) {
                        node.parentNode.removeChild(node, true)
                    }
                    return;
                }
                switch (node.tagName) {
                    case 'style':
                    case 'script':
                        node.setAttr({
                            cdata_tag: node.tagName,
                            cdata_data: encodeURIComponent(node.innerText() || '')
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
                        if (val = node.getAttr('src')) {
                            if (/^data:/.test(val)) {
                                node.parentNode.removeChild(node);
                                break;
                            }
                        }
                        node.setAttr('_src', node.getAttr('src'));
                        break;
                    case 'span':
                        if (browser.webkit && (val = node.getStyle('white-space'))) {
                            if (/nowrap|normal/.test(val)) {
                                node.setStyle('white-space', '');
                                if (me.options.autoClearEmptyNode && utils.isEmptyObject(node.attrs)) {
                                    node.parentNode.removeChild(node, true)
                                }
                            }
                        }
                        break;
                    case 'p':
                        if (val = node.getAttr('align')) {
                            node.setAttr('align');
                            node.setStyle('text-align', val)
                        }
                        //trace:3431
//                        var cssStyle = node.getAttr('style');
//                        if (cssStyle) {
//                            cssStyle = cssStyle.replace(/(margin|padding)[^;]+/g, '');
//                            node.setAttr('style', cssStyle)
//
//                        }
                        if (!node.firstChild()) {
                            node.innerHTML(browser.ie ? '&nbsp;' : '<br/>')
                        }
                        break;
                    case 'div':
                        if(node.getAttr('cdata_tag')){
                            break;
                        }
                        //针对代码这里不处理插入代码的div
                        val = node.getAttr('class');
                        if(val && /^line number\d+/.test(val)){
                            break;
                        }
                        if(!allowDivTransToP){
                            break;
                        }
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
                        UE.utils.each(tmpNodes, function (n) {
                            node.parentNode.insertAfter(n, node);
                        });
                        break;
                    case 'td':
                    case 'th':
                    case 'caption':
                        if(!node.children || !node.children.length){

                            node.appendChild(browser.ie ? UE.uNode.createText(' ') : UE.uNode.createElement('br'))
                        }
                }

            }
            if(node.type == 'comment'){
                node.parentNode.removeChild(node);
            }
        })

    });

    //从编辑器出去的内容处理
    me.addOutputRule(function (root) {

        var val;
        root.traversal(function (node) {
            if (node.type == 'element') {

                if (me.options.autoClearEmptyNode && dtd.$inline[node.tagName] && !dtd.$empty[node.tagName] && (!node.attrs || utils.isEmptyObject(node.attrs))) {

                    if (!node.firstChild()) node.parentNode.removeChild(node);
                    else if (node.tagName == 'span' && (!node.attrs || utils.isEmptyObject(node.attrs))) {
                        node.parentNode.removeChild(node, true)
                    }
                    return;
                }
                switch (node.tagName) {
                    case 'div':
                        if (val = node.getAttr('cdata_tag')) {
                            node.tagName = val;
                            node.appendChild(UE.uNode.createText(node.getAttr('cdata_data')));
                            node.setAttr({cdata_tag: '', cdata_data: ''});
                        }
                        break;
                    case 'a':
                        if (val = node.getAttr('_href')) {
                            node.setAttr({
                                'href': val,
                                '_href': ''
                            })
                        }
                        break;
                    case 'img':
                        if (val = node.getAttr('_src')) {
                            node.setAttr({
                                'src': node.getAttr('_src'),
                                '_src': ''
                            })
                        }


                }
            }

        })


    });
};
