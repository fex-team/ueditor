/**
 * @date     2015/2/11
 * @author   Dolphin<dolphin.w.e@gmail.com>
 * UEditor 对粘贴的文本中的链接自动转换
 */

UE.plugin.register('linkconverter', function () {
    if (browser.ie) return;
    var me = this,
        uNode = UE.uNode,
        utils = UE.utils,
        domUtils = UE.dom.domUtils,
        PATTERN = /(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)[^\s]*/ig,
        getText = browser.ie9below ? 'innerText' : 'textContent';

    var keyMap = {
        9: 'tab',
        13: 'enter',
        32: 'space'
    };

    /**
     * 拆分 textNode
     * @param {textNode} textNode: 目标文字节点
     * @param {Boolean} uNodeMode: 是否 uNode 模式
     */
    var splitTextNode = function (textNode, uNodeMode) {
        var str = textNode.nodeValue,
            parentNode = textNode.parentNode,
            lastPos = 0;

        // 利用 replace 来迭代替换链接文本
        str.replace(PATTERN, function (url, pos) {
            var len = url.length,
                link = textNode.splitText(pos - lastPos),
                a = document.createElement('a');

            textNode = link.splitText(len);
            a[getText] = url;

            lastPos = len + pos;

            domUtils.setAttributes(a, {
                href: /^www/.test(url) ? 'http://' + url : url,
                title: url,
                target: '_blank'
            });

            if (!uNodeMode) {
                a.id = 'new-link';
            }

            parentNode.replaceChild(a, link);
        });
    };

    /**
     * 迭代所有子节点
     * @param {Node} node: 目标节点
     * @param {Boolean} uNodeMode: 是否 uNode 模式
     */
    var iterateNode = function (node, uNodeMode) {
        if (node.nodeType === 3) {
            return splitTextNode(node, uNodeMode);
        }

        (function it(children) {
            var i, max, child, nodeType;

            for (i = 0, max = children.length; i < max; i++) {
                child = children[i];
                nodeType = child.nodeType;

                if (child.nodeName === 'A' || child._hasMovedLink) {
                    // 跳过 <a> 元素和取消链接的元素
                    continue;
                }

                if (nodeType === 1) {
                    // element
                    it(child.childNodes);
                }
                if (nodeType === 3) {
                    // textNode
                    splitTextNode(child, uNodeMode);
                }
            }
        })(node.childNodes);
    };

    /**
     * 替换节点内容
     * @param {uNode | Element} node: 目标节点
     */
    var converter = function (node) {
        if (node instanceof UE.uNode) {
            // uNode

            var html = node.toHtml(),
                div = document.createElement('div');

            div.innerHTML = html;
            iterateNode(div, true);

            if (div.innerHTML === html) {
                return;
            }

            var container = uNode.createElement('div');

            container.innerHTML(div.innerHTML);

            // 替换 uNode 所有子节点
            node.children = undefined;
            node.appendChild(container);
            node.removeChild(container, true);
        } else {
            // Element
            iterateNode(node, false);
            var a = me.document.getElementById('new-link');
            if (a) {
                a.removeAttribute('id');

                var range = me.selection.getRange();
                range.setEndAfter(a).collapse().select();
            }
        }
    };

    me.addListener('keydown', function (type, event) {
        var keyCode = event.keyCode || event.which;

        if (!keyMap[keyCode]) {
            return;
        }

        var range = this.selection.getRange(),
            node = range.startContainer;

        if (domUtils.findParentByTagName(node, 'a', true)) {
            return;
        }

        // 创建一个新的空白文本节点，避免之后的文本也被圈入链接
        range.insertNode(document.createTextNode(''));

        converter(node);
    });

    me.addInputRule(function (root) {
        var range = me.selection.getRange(),
            node = range.startContainer;

        if (domUtils.findParentByTagName(node, 'a', true)) {
            return;
        }

        converter(root);
    });
});