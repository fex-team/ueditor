/**
 * 插入段落
 * @file
 * @since 1.2.6.1
 */


/**
 * 插入段落
 * @command insertparagraph
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * //editor是编辑器实例
 * editor.execCommand( 'insertparagraph' );
 * ```
 */

UE.commands['insertparagraph'] = {
    execCommand : function( cmdName,front) {
        var me = this,
            range = me.selection.getRange(),
            start = range.startContainer,tmpNode;
        while(start ){
            if(domUtils.isBody(start)){
                break;
            }
            tmpNode = start;
            start = start.parentNode;
        }
        if(tmpNode){
            var p = me.document.createElement('p');
            if(front){
                tmpNode.parentNode.insertBefore(p,tmpNode)
            }else{
                tmpNode.parentNode.insertBefore(p,tmpNode.nextSibling)
            }
            domUtils.fillNode(me.document,p);
            range.setStart(p,0).setCursor(false,true);
        }
    }
};

