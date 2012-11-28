///import core
///commands 大小写转换
///commandsName touppercase
///commandsName tolowercase
///commandsTitle  大小写转换
/**
 * 大小写转换
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName     cmdName="convertcase"
 */
UE.commands['touppercase'] =
UE.commands['tolowercase'] = {
    execCommand:function (cmd) {
        var me = this,rng = new dom.Range(me.document),
            convertCase = function(){
                var rng = me.selection.getRange();

                if(rng.collapsed){
                    return rng;
                }

                var bk = rng.createBookmark(),
                    bkEnd = bk.end,
                    filterFn = function( node ) {
                        return !domUtils.isBr(node) && !domUtils.isWhitespace( node );
                    },
                    curNode = domUtils.getNextDomNode( bk.start, false, filterFn );

                while ( curNode && (domUtils.getPosition( curNode, bkEnd ) & domUtils.POSITION_PRECEDING) ) {

                    if ( curNode.nodeType == 3 ) {
                        curNode.nodeValue = curNode.nodeValue[cmd == 'touppercase' ? 'toUpperCase' : 'toLowerCase']();
                    }
                    curNode = domUtils.getNextDomNode( curNode, true, filterFn );
                    if(curNode === bkEnd){
                        break;
                    }

                }
                return rng.moveToBookmark(bk);

            };

        //table的处理
        if(me.currentSelectedArr && me.currentSelectedArr.length > 0){
            for(var i=0,ci;ci=me.currentSelectedArr[i++];){
                if(ci.style.display != 'none' && !domUtils.isEmptyBlock(ci)){
                    rng.selectNodeContents(ci).select();
                    convertCase();
                }

            }
            rng.selectNodeContents(me.currentSelectedArr[0]).select();
        }else{
            convertCase().select();
        }
    },
    queryCommandState:function () {
        return this.highlight ? -1 : 0;
    }
};

