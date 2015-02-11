/**
 * @date     2015/2/11
 * @author   Dolphin<dolphin.w.e@gmail.com>
 * UEditor 对粘贴的文本中的链接自动转换
 * todo: URL 键入识别
 */

UE.plugin.register('linkconverter', function () {
    var utils = UE.utils,
        domUtils = UE.dom.domUtils,
        PATTERN = /(?:https?:\/\/|ssh:\/\/|ftp:\/\/|file:\/|www\.)[^\s]*/ig;

    /**
     * 粘贴文本时，替换其中的链接文本为 <a> 标签
     * @param {UE Node} uNode
     */
    var replaceUrl = function (uNode) {
        if (uNode.type !== 'text' && uNode.tagName !== 'a' && uNode.children) {
            return utils.each(uNode.children, replaceUrl);
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
    };

    return {
        inputRule: replaceUrl
    }
});
