/**
 * 文库文章向上合并插件
 */

UE.plugins['merge'] = function() {

    var me = this,
        MERGE_FLAG = UE.MERGE_FLAG,
        domUtils = UE.dom.domUtils,
        tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

    me.commands['merge'] = {
        execCommand : function( cmdName, style, attrs,sourceCmdName ) {

            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );

            if( !node ) {
                return;
            }

            node.classList.toggle( MERGE_FLAG );

        },
        queryCommandState : function() {
            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true );
            return node && domUtils.hasClass( node, MERGE_FLAG );
        }
    };
};


//基础扩展
/**
 *
 */
UE.plugins['baseextend'] = function() {

    var me = this,
        MERGE_FLAG = UE.MERGE_FLAG,
        domUtils = UE.dom.domUtils,
        CLASS_NAME = {
            inscribed: UE.INSCRIBED_FLAG,
            legends: UE.LEGENDS_FLAG
        },
        tags = [ 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ],
        cmds = [ 'inscribed', 'legends' ];

    utils.each( cmds, function( cmd ){

        me.commands[ cmd ] = {
            execCommand : function( cmdName ) {

                var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true),
                    repNode = null;

                if( !node ) {
                    return;
                }

                //属于互斥类型， 需要删除其他类型
                if( UE.singleType[ cmdName ] ) {

                    for( var key in UE.singleType ) {

                        if( key !== cmdName ) {
                            node.classList.remove( UE.singleType[ key ] );
                        }

                    }

                }

                node.classList.add( CLASS_NAME[ cmdName ] );

                if( node.tagName.toLowerCase() !== 'p' ) {
                    //节点替换

                    repNode = node.ownerDocument.createElement("p");
                    repNode.className = node.className;

                    repNode.innerHTML = node.innerHTML;

                    node.parentNode.replaceChild( repNode, node );

                    node = null;

                }

            },
            queryCommandState : function( cmdName ) {
                var node = domUtils.findParentByTagName( this.selection.getStart(), 'p', true );
                return node && domUtils.hasClass( node, CLASS_NAME[ cmdName ] );
            }
        }

    } );

};