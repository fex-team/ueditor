///import core
///commands 注释
///commandsName  Remark
///commandsTitle  注释
///commandsDialog  dialogs\remark
/**
 * 注释
 * @function
 * @name baidu.editor.execCommands
 * @param {String} cmdName     cmdName="remark"插入注释
 */
UE.plugins['remark'] = function () {
    var me = this;

    me.ready(function () {
        utils.cssRule('remark',
            'img.remarkclass{background: url(\''
                + me.options.UEDITOR_HOME_URL +
                'themes/default/images/remark.gif\') no-repeat scroll left center transparent;float:none;border: 1px dotted #0000FF;cursor: pointer;display: inline-block;height: 12px;width: 9px;}',
            me.document)
    });
    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('img'), function (node) {
            if (node.getAttr('data-remark')) {
                node.tagName = 'span';
                node.setAttr({'class': ''});
                node.innerText('*');
            }
        })
    });
    me.addInputRule(function (root) {
        utils.each(root.getNodesByTagName('span'), function (node) {
            if (node.getAttr('data-remark')) {
                node.removeChild(node.children[0]);
                node.tagName = 'img';
                node.setAttr({'class': 'remarkclass'});
            }
        })
    });
    me.commands['remark'] = {
        execCommand: function (cmd, remarkText) {
            var range = this.selection.getRange(), img = range.getClosedNode();
            if (img && img.getAttribute('data-remark')) {
                if (remarkText) {
                    img.setAttribute('data-remark', remarkText);
                } else {
                    range.setStartBefore(img).setCursor();
                    domUtils.remove(img);
                }
            } else {
                if (remarkText) {
                    //只在选区的开始插入
                    var remark = this.document.createElement('img');
                    range.collapse(true);
                    domUtils.setAttributes(remark, {
                        'data-remark': remarkText,
                        'class': 'remarkclass'
                    });
                    range.insertNode(remark).setStartAfter(remark).setCursor(false, true);
                }
            }
        },
        queryCommandState: function () {
            var range = this.selection.getRange(), img = range.getClosedNode();
            return img && img.getAttribute('data-remark') ? 1:0;
        }

    };


};
