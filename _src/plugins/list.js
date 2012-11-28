///import core
///commands 有序列表,无序列表
///commandsName  InsertOrderedList,InsertUnorderedList
///commandsTitle  有序列表,无序列表
/**
 * 有序列表
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     insertorderlist插入有序列表
 * @param   {String}   style               值为：decimal,lower-alpha,lower-roman,upper-alpha,upper-roman
 * @author zhanyi
 */
/**
 * 无序链接
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     insertunorderlist插入无序列表
 * * @param   {String}   style            值为：circle,disc,square
 * @author zhanyi
 */

UE.plugins['list'] = function () {
    var me = this,
            notExchange = {
                'TD':1,
                'PRE':1,
                'BLOCKQUOTE':1
            };
    me.setOpt( {
        'insertorderedlist':{
            'decimal':'', //'1,2,3...'
            'lower-alpha':'', // 'a,b,c...'
            'lower-roman':'', //'i,ii,iii...'
            'upper-alpha':'', //'A,B,C'
            'upper-roman':''     //'I,II,III...'
        },
        'insertunorderedlist':{
            'circle':'',
            'disc':'',
            'square':''
        }
    } );

    me.ready(function(){
        utils.cssRule('list','li{clear:both}',me.document);
    });



    function adjustList( list, tag, style ) {
        var nextList = list.nextSibling;
        if ( nextList && nextList.nodeType == 1 && nextList.tagName.toLowerCase() == tag && (domUtils.getStyle( nextList, 'list-style-type' ) || (tag == 'ol' ? 'decimal' : 'disc')) == style ) {
            domUtils.moveChild( nextList, list );
            if ( nextList.childNodes.length == 0 ) {
                domUtils.remove( nextList );
            }
        }
        var preList = list.previousSibling;
        if ( preList && preList.nodeType == 1 && preList.tagName.toLowerCase() == tag && (domUtils.getStyle( preList, 'list-style-type' ) || (tag == 'ol' ? 'decimal' : 'disc')) == style ) {
            domUtils.moveChild( list, preList );
        }


        if ( list.childNodes.length == 0 ) {
            domUtils.remove( list );
        }
    }

    function clearEmptySibling(node){
        var tmpNode = node.previousSibling;
        if ( tmpNode && domUtils.isEmptyBlock(tmpNode)) {
            domUtils.remove( tmpNode );
        }
        tmpNode = node.nextSibling;
        if ( tmpNode && domUtils.isEmptyBlock(tmpNode)) {
            domUtils.remove( tmpNode );
        }
    }
    me.addListener( 'keydown', function ( type, evt ) {
        function preventAndSave() {
            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
            me.undoManger && me.undoManger.save();
        }

        var keyCode = evt.keyCode || evt.which;
        if ( keyCode == 13 ) {//回车
            var range = me.selection.getRange(),
                    start = domUtils.findParentByTagName( range.startContainer, ['ol', 'ul'], true, function ( node ) {
                        return node.tagName == 'TABLE';
                    } ),
                    end = domUtils.findParentByTagName( range.endContainer, ['ol', 'ul'], true, function ( node ) {
                        return node.tagName == 'TABLE';
                    } );
            if ( start && end && start === end ) {

                if ( !range.collapsed ) {
                    start = domUtils.findParentByTagName( range.startContainer, 'li', true );
                    end = domUtils.findParentByTagName( range.endContainer, 'li', true );
                    if ( start && end && start === end ) {
                        range.deleteContents();
                        li = domUtils.findParentByTagName( range.startContainer, 'li', true );
                        if ( li && domUtils.isEmptyBlock( li ) ) {

                            pre = li.previousSibling;
                            next = li.nextSibling;
                            p = me.document.createElement( 'p' );

                            domUtils.fillNode( me.document, p );
                            parentList = li.parentNode;
                            if ( pre && next ) {
                                range.setStart( next, 0 ).collapse( true ).select( true );
                                domUtils.remove( li );

                            } else {
                                if ( !pre && !next || !pre ) {

                                    parentList.parentNode.insertBefore( p, parentList );


                                } else {
                                    li.parentNode.parentNode.insertBefore( p, parentList.nextSibling );
                                }
                                domUtils.remove( li );
                                if ( !parentList.firstChild ) {
                                    domUtils.remove( parentList );
                                }
                                range.setStart( p, 0 ).setCursor();


                            }
                            preventAndSave();
                            return;

                        }
                    } else {
                        var tmpRange = range.cloneRange(),
                                bk = tmpRange.collapse( false ).createBookmark();

                        range.deleteContents();
                        tmpRange.moveToBookmark( bk );
                        var li = domUtils.findParentByTagName( tmpRange.startContainer, 'li', true );

                        clearEmptySibling(li);
                        tmpRange.select();
                        preventAndSave();
                        return;
                    }
                }


                li = domUtils.findParentByTagName( range.startContainer, 'li', true );

                if ( li ) {
                    if ( domUtils.isEmptyBlock( li ) ) {
                        bk = range.createBookmark();
                        var parentList = li.parentNode;
                        if ( li !== parentList.lastChild ) {
                            domUtils.breakParent( li, parentList );
                            clearEmptySibling(li);
                        } else {

                            parentList.parentNode.insertBefore( li, parentList.nextSibling );
                            if ( domUtils.isEmptyNode( parentList ) ) {
                                domUtils.remove( parentList );
                            }
                        }
                        //嵌套不处理
                        if ( !dtd.$list[li.parentNode.tagName] ) {

                            if ( !domUtils.isBlockElm( li.firstChild ) ) {
                                p = me.document.createElement( 'p' );
                                li.parentNode.insertBefore( p, li );
                                while ( li.firstChild ) {
                                    p.appendChild( li.firstChild );
                                }
                                domUtils.remove( li );
                            } else {
                                domUtils.remove( li, true );
                            }
                        }
                        range.moveToBookmark( bk ).select();


                    } else {
                        var first = li.firstChild;
                        if ( !first || !domUtils.isBlockElm( first ) ) {
                            var p = me.document.createElement( 'p' );

                            !li.firstChild && domUtils.fillNode( me.document, p );
                            while ( li.firstChild ) {

                                p.appendChild( li.firstChild );
                            }
                            li.appendChild( p );
                            first = p;
                        }

                        var span = me.document.createElement( 'span' );

                        range.insertNode( span );
                        domUtils.breakParent( span, li );

                        var nextLi = span.nextSibling;
                        first = nextLi.firstChild;

                        if ( !first ) {
                            p = me.document.createElement( 'p' );

                            domUtils.fillNode( me.document, p );
                            nextLi.appendChild( p );
                            first = p;
                        }
                        if ( domUtils.isEmptyNode( first ) ) {
                            first.innerHTML = '';
                            domUtils.fillNode( me.document, first );
                        }

                        range.setStart( first, 0 ).collapse( true ).shrinkBoundary().select();
                        domUtils.remove( span );
                        pre = nextLi.previousSibling;
                        if ( pre && domUtils.isEmptyBlock( pre ) ) {
                            pre.innerHTML = '<p></p>';
                            domUtils.fillNode( me.document, pre.firstChild );
                        }

                    }
//                        }

                    preventAndSave();
                }


            }
        }
        if ( keyCode == 8 ) {
            //修中ie中li下的问题
            range = me.selection.getRange();
            if ( range.collapsed && domUtils.isStartInblock( range ) ) {
                tmpRange = range.cloneRange().trimBoundary();
                li = domUtils.findParentByTagName( range.startContainer, 'li', true );

                //要在li的最左边，才能处理
                if ( li && domUtils.isStartInblock( tmpRange ) ) {

                    if ( li && (pre = li.previousSibling) ) {
                        if ( keyCode == 46 && li.childNodes.length ){
                            return;
                        }
                        //有可能上边的兄弟节点是个2级菜单，要追加到2级菜单的最后的li
                        if ( dtd.$list[pre.tagName] ) {
                            pre = pre.lastChild;
                        }
                        me.undoManger && me.undoManger.save();
                        first = li.firstChild;
                        if ( domUtils.isBlockElm( first ) ) {
                            if ( domUtils.isEmptyNode( first ) ) {
//                                    range.setEnd(pre, pre.childNodes.length).shrinkBoundary().collapse().select(true);
                                pre.appendChild( first );
                                range.setStart( first, 0 ).setCursor( false, true );
                                //first不是唯一的节点
                                while ( li.firstChild ) {
                                    pre.appendChild( li.firstChild );
                                }
                            } else {
                                start = domUtils.findParentByTagName( range.startContainer, 'p', true );
                                if ( start && start !== first ) {
                                    return;
                                }
                                span = me.document.createElement( 'span' );
                                range.insertNode( span );
                                //判断pre是否是空的节点,如果是<p><br/></p>类型的空节点，干掉p标签防止它占位
                                if(domUtils.isEmptyBlock(pre)){
                                    pre.innerHTML = '';
                                }
                                domUtils.moveChild( li, pre );
                                range.setStartBefore( span ).collapse( true ).select( true );

                                domUtils.remove( span );

                            }
                        } else {
                            if ( domUtils.isEmptyNode( li ) ) {
                                var p = me.document.createElement( 'p' );
                                pre.appendChild( p );
                                range.setStart( p, 0 ).setCursor();
//                                    range.setEnd(pre, pre.childNodes.length).shrinkBoundary().collapse().select(true);
                            } else {
                                range.setEnd( pre, pre.childNodes.length ).collapse().select( true );
                                while ( li.firstChild ) {
                                    pre.appendChild( li.firstChild );
                                }


                            }
                        }

                        domUtils.remove( li );

                        me.undoManger && me.undoManger.save();
                        domUtils.preventDefault( evt );
                        return;

                    }
                    //trace:980

                    if ( li && !li.previousSibling ) {
                        first = li.firstChild;
                        //trace:1648 要判断li下只有一个节点
                        if ( !first || li.lastChild === first && domUtils.isEmptyNode( domUtils.isBlockElm( first ) ? first : li ) ) {
                            var p = me.document.createElement( 'p' );

                            li.parentNode.parentNode.insertBefore( p, li.parentNode );
                            domUtils.fillNode( me.document, p );
                            range.setStart( p, 0 ).setCursor();
                            domUtils.remove( !li.nextSibling ? li.parentNode : li );
                            me.undoManger && me.undoManger.save();
                            domUtils.preventDefault( evt );
                            return;
                        }


                    }


                }


            }

        }
    } );
    me.commands['insertorderedlist'] =
            me.commands['insertunorderedlist'] = {
                execCommand:function ( command, style ) {
                    if ( !style ) {
                        style = command.toLowerCase() == 'insertorderedlist' ? 'decimal' : 'disc';
                    }
                    var me = this,
                            range = this.selection.getRange(),
                            filterFn = function ( node ) {
                                return   node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !domUtils.isWhitespace( node );
                            },
                            tag = command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul',
                            frag = me.document.createDocumentFragment();
                    //去掉是因为会出现选到末尾，导致adjustmentBoundary缩到ol/ul的位置
                    //range.shrinkBoundary();//.adjustmentBoundary();
                    range.adjustmentBoundary().shrinkBoundary();
                    var bko = range.createBookmark( true ),
                            start = domUtils.findParentByTagName( me.document.getElementById( bko.start ), 'li' ),
                            modifyStart = 0,
                            end = domUtils.findParentByTagName( me.document.getElementById( bko.end ), 'li' ),
                            modifyEnd = 0,
                            startParent, endParent,
                            list, tmp;

                    if ( start || end ) {
                        start && (startParent = start.parentNode);
                        if ( !bko.end ) {
                            end = start;
                        }
                        end && (endParent = end.parentNode);

                        if ( startParent === endParent ) {
                            while ( start !== end ) {
                                tmp = start;
                                start = start.nextSibling;
                                if ( !domUtils.isBlockElm( tmp.firstChild ) ) {
                                    var p = me.document.createElement( 'p' );
                                    while ( tmp.firstChild ) {
                                        p.appendChild( tmp.firstChild );
                                    }
                                    tmp.appendChild( p );
                                }
                                frag.appendChild( tmp );
                            }
                            tmp = me.document.createElement( 'span' );
                            startParent.insertBefore( tmp, end );
                            if ( !domUtils.isBlockElm( end.firstChild ) ) {
                                p = me.document.createElement( 'p' );
                                while ( end.firstChild ) {
                                    p.appendChild( end.firstChild );
                                }
                                end.appendChild( p );
                            }
                            frag.appendChild( end );
                            domUtils.breakParent( tmp, startParent );
                            if ( domUtils.isEmptyNode( tmp.previousSibling ) ) {
                                domUtils.remove( tmp.previousSibling );
                            }
                            if ( domUtils.isEmptyNode( tmp.nextSibling ) ) {
                                domUtils.remove( tmp.nextSibling )
                            }
                            var nodeStyle = domUtils.getComputedStyle( startParent, 'list-style-type' ) || (command.toLowerCase() == 'insertorderedlist' ? 'decimal' : 'disc');
                            if ( startParent.tagName.toLowerCase() == tag && nodeStyle == style ) {
                                for ( var i = 0, ci, tmpFrag = me.document.createDocumentFragment(); ci = frag.childNodes[i++]; ) {
                                    while ( ci.firstChild ) {
                                        tmpFrag.appendChild( ci.firstChild );
                                    }

                                }
                                tmp.parentNode.insertBefore( tmpFrag, tmp );
                            } else {
                                list = me.document.createElement( tag );
                                domUtils.setStyle( list, 'list-style-type', style );
                                list.appendChild( frag );
                                tmp.parentNode.insertBefore( list, tmp );
                            }

                            domUtils.remove( tmp );
                            list && adjustList( list, tag, style );
                            range.moveToBookmark( bko ).select();
                            return;
                        }
                        //开始
                        if ( start ) {
                            while ( start ) {
                                tmp = start.nextSibling;
                                if(domUtils.isTagNode(start,'ol ul')){
                                    frag.appendChild(start);
                                }else{
                                    var tmpfrag = me.document.createDocumentFragment(),
                                        hasBlock = 0;
                                    while ( start.firstChild ) {
                                        if ( domUtils.isBlockElm( start.firstChild ) ){
                                            hasBlock = 1;
                                        }
                                        tmpfrag.appendChild( start.firstChild );
                                    }
                                    if ( !hasBlock ) {
                                        var tmpP = me.document.createElement( 'p' );
                                        tmpP.appendChild( tmpfrag );
                                        frag.appendChild( tmpP );
                                    } else {
                                        frag.appendChild( tmpfrag );
                                    }
                                    domUtils.remove( start );
                                }

                                start = tmp;
                            }
                            startParent.parentNode.insertBefore( frag, startParent.nextSibling );
                            if ( domUtils.isEmptyNode( startParent ) ) {
                                range.setStartBefore( startParent );
                                domUtils.remove( startParent );
                            } else {
                                range.setStartAfter( startParent );
                            }


                            modifyStart = 1;
                        }

                        if ( end && domUtils.inDoc(endParent,me.document)) {
                            //结束
                            start = endParent.firstChild;
                            while ( start && start !== end ) {
                                tmp = start.nextSibling;
                                if(domUtils.isTagNode(start,'ol ul')){
                                    frag.appendChild(start);
                                }else{
                                    tmpfrag = me.document.createDocumentFragment();
                                    hasBlock = 0;
                                    while ( start.firstChild ) {
                                        if ( domUtils.isBlockElm( start.firstChild ) ){
                                            hasBlock = 1;
                                        }
                                        tmpfrag.appendChild( start.firstChild );
                                    }
                                    if ( !hasBlock ) {
                                        tmpP = me.document.createElement( 'p' );
                                        tmpP.appendChild( tmpfrag );
                                        frag.appendChild( tmpP );
                                    } else {
                                        frag.appendChild( tmpfrag );
                                    }
                                    domUtils.remove( start );
                                }
                                start = tmp;
                            }
                            var tmpDiv = domUtils.createElement(me.document,'div',{
                              'tmpDiv': 1
                            });
                            domUtils.moveChild(end,tmpDiv);

                            frag.appendChild( tmpDiv );
                            domUtils.remove( end );
                            endParent.parentNode.insertBefore( frag, endParent );
                            range.setEndBefore( endParent );
                            if ( domUtils.isEmptyNode( endParent ) ) {
                                domUtils.remove( endParent );
                            }

                            modifyEnd = 1;
                        }


                    }

                    if ( !modifyStart ) {
                        range.setStartBefore( me.document.getElementById( bko.start ) );
                    }
                    if ( bko.end && !modifyEnd ) {
                        range.setEndAfter( me.document.getElementById( bko.end ) );
                    }
                    range.enlarge( true, function ( node ) {
                        return notExchange[node.tagName];
                    } );

                    frag = me.document.createDocumentFragment();

                    var bk = range.createBookmark(),
                            current = domUtils.getNextDomNode( bk.start, false, filterFn ),
                            tmpRange = range.cloneRange(),
                            tmpNode,
                            block = domUtils.isBlockElm;

                    while ( current && current !== bk.end && (domUtils.getPosition( current, bk.end ) & domUtils.POSITION_PRECEDING) ) {

                        if ( current.nodeType == 3 || dtd.li[current.tagName] ) {
                            if ( current.nodeType == 1 && dtd.$list[current.tagName] ) {
                                while ( current.firstChild ) {
                                    frag.appendChild( current.firstChild );
                                }
                                tmpNode = domUtils.getNextDomNode( current, false, filterFn );
                                domUtils.remove( current );
                                current = tmpNode;
                                continue;

                            }
                            tmpNode = current;
                            tmpRange.setStartBefore( current );

                            while ( current && current !== bk.end && (!block( current ) || domUtils.isBookmarkNode( current ) ) ) {
                                tmpNode = current;
                                current = domUtils.getNextDomNode( current, false, null, function ( node ) {
                                    return !notExchange[node.tagName];
                                } );
                            }

                            if ( current && block( current ) ) {
                                tmp = domUtils.getNextDomNode( tmpNode, false, filterFn );
                                if ( tmp && domUtils.isBookmarkNode( tmp ) ) {
                                    current = domUtils.getNextDomNode( tmp, false, filterFn );
                                    tmpNode = tmp;
                                }
                            }
                            tmpRange.setEndAfter( tmpNode );

                            current = domUtils.getNextDomNode( tmpNode, false, filterFn );

                            var li = range.document.createElement( 'li' );

                            li.appendChild( tmpRange.extractContents() );
                            frag.appendChild( li );


                        } else {

                            current = domUtils.getNextDomNode( current, true, filterFn );
                        }
                    }
                    range.moveToBookmark( bk ).collapse( true );
                    list = me.document.createElement( tag );
                    domUtils.setStyle( list, 'list-style-type', style );
                    list.appendChild( frag );
                    range.insertNode( list );
                    //当前list上下看能否合并
                    adjustList( list, tag, style );
                    //去掉冗余的tmpDiv
                    for(var i= 0,ci,tmpDivs = domUtils.getElementsByTagName(list,'div');ci=tmpDivs[i++];){
                        if(ci.getAttribute('tmpDiv')){
                            domUtils.remove(ci,true)
                        }
                    }
                    range.moveToBookmark( bko ).select();

                },
                queryCommandState:function ( command ) {
                    return this.highlight ? -1 :
                            domUtils.filterNodeList( this.selection.getStartElementPath(), command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul' ) ? 1 : 0;
                },
                queryCommandValue:function ( command ) {
                    var node = domUtils.filterNodeList( this.selection.getStartElementPath(), command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul' );
                    return node ? domUtils.getComputedStyle( node, 'list-style-type' ) : null;
                }
            };
};

