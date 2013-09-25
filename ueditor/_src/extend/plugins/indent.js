///import core
///import plugins\paragraph.js
///commands 首行缩进
///commandsName  Outdent,Indent
///commandsTitle  取消缩进,首行缩进
/**
 * 首行缩进
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     outdent取消缩进，indent缩进
 */
UE.plugins['indent'] = function(){

    var tags = [ 'p', ',h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ];

    UE.commands[ 'indent' ] = {
        execCommand : function() {

            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );

            if( !node ) {
                return;
            }

            for( var key in UE.singleIndent ) {
                node.classList.remove( UE.singleIndent[ key ] );
            }

            node.classList.add( UE.INDENT_FLAG );

        },
        queryCommandState : function() {

            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );

            if( !node ) {
                return false;
            }

            return node.classList.contains( UE.INDENT_FLAG );

        }

    }
};
