/**
 * @date     2015/2/11
 * @author   Dolphin<dolphin.w.e@gmail.com>
 * UEditor 对粘贴或键入的文本中的链接自动转换
 */

UE.plugin.register('linkconverter', function () {
    var utils = UE.utils,
        domUtils = UE.dom.domUtils,
        PATTERN = /(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)([^&nbsp;][^\s])*/ig;

    var keyMap = {
        9: 'tab',
        13: 'enter',
        32: 'space'
    };

    var blockElem, bookmark;

    /**
     * 粘贴或键入文本时，替换其中的链接文本为 <a> 标签
     * @param {UE Node} uNode
     */
    var replaceUrl = function (uNode) {
        var me = this;
        if (uNode.type !== 'text' && uNode.tagName !== 'a' && uNode.children) {
            return utils.each(uNode.children, function(childNode) {
                replaceUrl.call(me, childNode);
            });
        }

        var str = uNode.data;
        if (!str) {
            return;
        }

        var hasLink,
            result = str.replace(PATTERN, function (url) {
                hasLink = true;
                if (/^www/.test(url)) {
                    url = 'http://' + url;
                }
                return '<a href="$url" title="$url" target="_blank">$url</a>'.replace(/\$url/g, url);
            });

        if (!hasLink) {
            return;
        }

        if (uNode.type !== 'element') {
            uNode.type = 'element';
            uNode.tagName = 'span';
        }
        uNode.innerHTML(result);

        if (blockElem) {
            blockElem.elem.innerHTML = blockElem.uNode.toHtml();
            var range = me.selection.getRange();
            range.moveToBookmark(bookmark).select();
            blockElem = null;
        }
    };

    /**
     * 获得当前节点最近的块级元素
     * @param {Node} node
     * @return {Obejct} 最近块级元素及其 uNode 化对象
     */
    var getCloestBlockElement = function (node) {
        while (node) {
            if (domUtils.isBlockElm(node)) {
                var uNode = UE.uNode.createElement(node.innerHTML);
                return {
                    uNode: uNode.parentNode,
                    elem: node
                };
            }
            node = node.parentNode;
        }
    };

    return {
        bindEvents: {
            keydown: function (type, event) {
                var keyCode = event.keyCode || event.which;

                if (!keyMap[keyCode]) {
                    return;
                }

                var range = this.selection.getRange(),
                    node = range.getCommonAncestor();
                bookmark = range.createBookmark(true);
                blockElem = getCloestBlockElement(node);
                replaceUrl.call(this, blockElem.uNode);
            }
        },
        inputRule: replaceUrl
    }
});
