/**
 * @date     2015/2/11
 * @author   Dolphin<dolphin.w.e@gmail.com>
 * UEditor 对粘贴或键入的文本中的链接自动转换
 */

UE.plugin.register('linkconverter', function () {
    var uNode = UE.uNode,
        utils = UE.utils,
        domUtils = UE.dom.domUtils,
        PATTERN = /(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)[^\s]*/ig;

    var keyMap = {
        9: 'tab',
        13: 'enter',
        32: 'space'
    };

    /**
     * 替换字符串中的链接为 <a> 标签
     * @param {String} str: 目标字符串
     * @return {String | undefined}: 替换后的字符串
     */
    var replaceLink = function (str) {
        if (!str) {
            return '';
        }

        str = str.replace(/&nbsp;/g, ' '); // 替换 &nbsp;

        var hasLink;
        var result = str.replace(PATTERN, function (url) {
            hasLink = true;
            if (/^www/.test(url)) {
                url = 'http://' + url;
            }
            return '<a href="$url" title="$url" target="_blank">$url</a>'.replace(/\$url/g, url);
        });

        if (!hasLink) {
            return;
        }

        return result.replace(/  /g, ' &nbsp;'); // 还原 &nbsp;
    };

    /**
     * 用一个 <span> 标签包裹文本节点
     * @param {textNode} textNode: 目标文本节点
     */
    var wrapTextNode = function (textNode) {
        var span = document.createElement('span'),
            newValue = replaceLink(textNode.data);

        if (!newValue) {
            return;
        }
        span.innerHTML = newValue;
        textNode.parentNode.replaceChild(span, textNode);
    }

    /**
     * 迭代所有子节点
     * @param {Node} node: 目标节点
     * @param {NodeList} children
     */
    var iterateNode = function (node, children /* internal */) {
        if (node.nodeType === 3) {
            return wrapTextNode(node);
        }

        children = (children || node).childNodes;

        var i, max, child, content;

        for (i = 0, max = children.length; i < max; i++) {
            child = children[i];

            if (child.nodeName === 'A' || child._hasMovedLink) {
                // 跳过 <a> 元素和已经去除链接的节点
                continue;
            }
            if (child.nodeType === 1) {
                // element
                iterateNode(node, child);
            }
            if (child.nodeType === 3) {
                // textNode
                wrapTextNode(child);
            }
        }
    };

    /**
     * 替换节点内容
     * @param {uNode | Node} node: 目标节点
     * @param {UE Bookmark} [bookmark]: UE 节点标签
     */
    var converter = function (node, bookmark) {
        if (node instanceof UE.uNode) {
            // uNode

            var html = node.toHtml(),
                div = document.createElement('div');

            div.innerHTML = html;
            iterateNode(div);

            if (div.innerHTML === html) {
                return;
            }

            var container = uNode.createElement(
                node.children.length > 1 ? 'div' : 'span'
            );

            container.innerHTML(div.innerHTML);

            // 替换 uNode 所有子节点
            node.children = undefined;
            node.appendChild(container);
        } else if (bookmark) {
            // Node
            iterateNode(node);
            var range = this.selection.getRange();
            range.moveToBookmark(bookmark).select();
        }
    };

    /**
     * 获得当前节点最近的块级元素
     * @param {Node} node
     * @return {Node} 最近块级元素及其 uNode 化对象
     */
    var getCloestBlockElement = function (node) {
        while (node) {
            if (domUtils.isBlockElm(node)) {
                return node;
            }
            node = node.parentNode;
        }
    };

    return {
        bindEvents: {
            keydown: function (type, event) {
                if (UE.browser.ie && !UE.browser.ie9above) {
                    return;
                };
                var me = this,
                    keyCode = event.keyCode || event.which;

                if (!keyMap[keyCode]) {
                    return;
                }

                var range = me.selection.getRange(),
                    node = range.startContainer;

                if (domUtils.findParentByTagName(node, 'a', true)) {
                    return;
                }

                var blockElem = getCloestBlockElement(node),
                    bookmark = range.createBookmark(true),
                    bmID = bookmark.start;

                converter.call(this, blockElem, bookmark);
            }
        },
        inputRule: function (root) {
            var range = this.selection.getRange(),
                node = range.startContainer;

            if (domUtils.findParentByTagName(node, 'a', true)) {
                return;
            }

            converter.call(this, root);
        }
    }
});
