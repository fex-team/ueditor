///import core
///commands 锚点
///commandsName  Anchor
///commandsTitle  锚点
///commandsDialog  dialogs\anchor
/**
 * 锚点
 * @function
 * @name baidu.editor.execCommands
 * @param {String} cmdName     cmdName="anchor"插入锚点
 */
UE.plugins['anchor'] = function (){
    var me = this;

    me.ready(function(){
        utils.cssRule('anchor',
            '.anchorclass{background: url(\''
                + me.options.UEDITOR_HOME_URL +
                'themes/default/images/anchor.gif\') no-repeat scroll left center transparent;border: 1px dotted #0000FF;cursor: auto;display: inline-block;height: 16px;width: 15px;}',
            me.document)
    });
    me.addOutputRule(function(root){
        utils.each(root.getNodesByTagName('img'),function(a){
            var val;
            if(val = a.getAttr('anchorname')){
                a.tagName = 'a';
                a.setAttr({
                    anchorname : '',
                    name : val,
                    'class' : ''
                })
            }
        })
    });
    me.addInputRule(function(root){
        utils.each(root.getNodesByTagName('a'),function(a){
            var val;
            if((val = a.getAttr('name')) && !a.getAttr('href')){
                a.tagName = 'img';
                a.setAttr({
                    anchorname :a.getAttr('name'),
                    'class' : 'anchorclass'
                });
                a.setAttr('name')

            }
        })
    });
    me.commands['anchor'] = {
        execCommand:function (cmd, name) {
            var range = this.selection.getRange(),img = range.getClosedNode();
            if (img && img.getAttribute('anchorname')) {
                if (name) {
                    img.setAttribute('anchorname', name);
                } else {
                    range.setStartBefore(img).setCursor();
                    domUtils.remove(img);
                }
            } else {
                if (name) {
                    //只在选区的开始插入
                    var anchor = this.document.createElement('img');
                    range.collapse(true);
                    domUtils.setAttributes(anchor,{
                        'anchorname':name,
                        'class':'anchorclass'
                    });
                    range.insertNode(anchor).setStartAfter(anchor).setCursor(false,true);
                }
            }
        }

    };


};
