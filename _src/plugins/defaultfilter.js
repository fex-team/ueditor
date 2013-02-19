///import core
///commands 提供黑白名单功能
///commandsName  filterNode
///commandsTitle  filterNode
/**
 * 提供黑白名单功能
 * @function
 * @name baidu.editor.execCommands
 * @param {uNode} node
 */
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
                        if(val == 'nowrap'){
                            node.setStyle('white-space','')
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
    });
};
