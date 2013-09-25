///import core
///import plugins\paragraph.js
///commands 首行缩进
///commandsName  Outdent,Indent
///commandsTitle  取消缩进,首行缩进
/**
 * 取消首行缩进
 * @function
 * @name baidu.editor.execCommand
 */
UE.plugins['noindent'] = function(){

    var tags = [ 'p', ',h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ];

    UE.commands[ 'noindent' ] = {
        execCommand : function() {

            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );

            if( !node ) {
                return;
            }

            for( var key in UE.singleIndent ) {
                node.classList.remove( UE.singleIndent[ key ] );
            }

            node.classList.add( UE.NO_INDENT_FLAG );

        },
        queryCommandState : function() {

            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );

            if( !node ) {
                return false;
            }

            return node.classList.contains( UE.NO_INDENT_FLAG );

        }

    }
};
