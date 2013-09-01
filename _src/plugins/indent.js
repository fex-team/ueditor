/**
 * 缩进
 * @file
 * @since 1.2.6.1
 */

/**
 * 给选区内文本添加缩进
 * @command indent
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'indent' );
 * ```
 */

/**
 * 返回当前选区位置是否有缩进
 * @command indent
 * @method queryCommandState
 * @param { String } cmd 命令字符串
 * @return { int } 0为不是，1为是
 * @example
 * ```javascript
 * editor.queryCommandState( 'indent' );
 * ```
 */

UE.commands['indent'] = {
    execCommand : function() {
         var me = this,value = me.queryCommandState("indent") ? "0em" : (me.options.indentValue || '2em');
         me.execCommand('Paragraph','p',{style:'text-indent:'+ value});
    },
    queryCommandState : function() {
        var pN = domUtils.filterNodeList(this.selection.getStartElementPath(),'p h1 h2 h3 h4 h5 h6');
        return pN && pN.style.textIndent && parseInt(pN.style.textIndent) ?  1 : 0;
    }

};
