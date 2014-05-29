/**
 * 锚点插件，为UEditor提供插入锚点支持
 * @file
 * @since 1.2.6.1
 */
UE.plugin.register('anchor', function (){

    return {
        bindEvents:{
            'ready':function(){
                utils.cssRule('anchor',
                    '.anchorclass{background: url(\''
                        + this.options.themePath
                        + this.options.theme +'/images/anchor.gif\') no-repeat scroll left center transparent;cursor: auto;display: inline-block;height: 16px;width: 15px;}',
                    this.document);
            }
        },
       outputRule: function(root){
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
       },
       inputRule:function(root){
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

       },
       commands:{
           /**
            * 插入锚点
            * @command anchor
            * @method execCommand
            * @param { String } cmd 命令字符串
            * @param { String } name 锚点名称字符串
            * @example
            * ```javascript
            * //editor 是编辑器实例
            * editor.execCommand('anchor', 'anchor1');
            * ```
            */
           'anchor':{
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
           }
       }
    }
});
