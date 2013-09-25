///import core
///commands 引用
///commandsName  BlockQuote
///commandsTitle  引用
/**
 * 
 * 引用模块实现
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     blockquote引用
 */


UE.plugins['blockquote'] = function(){
    var me = this;
    function getObj(editor){
        return domUtils.filterNodeList(editor.selection.getStartElementPath(),'blockquote');
    }
    me.commands['blockquote'] = {
        execCommand : function( cmdName, attrs ) {
            var range = this.selection.getRange(),
                obj = getObj(this),
                blockquote = dtd.blockquote,
                wkQuote = UE.BLOCKQUOTE_FLAG;

            if ( obj ) {

                var start = range.startContainer,
                    startBlock = domUtils.isBlockElm(start) ? start : domUtils.findParent(start,function(node){return domUtils.isBlockElm(node)}),

                    end = range.endContainer,
                    endBlock = domUtils.isBlockElm(end) ? end :  domUtils.findParent(end,function(node){return domUtils.isBlockElm(node)});

                    //处理一下li
                    startBlock = domUtils.findParentByTagName(startBlock,'li',true) || startBlock;
                    endBlock = domUtils.findParentByTagName(endBlock,'li',true) || endBlock;


                    if(startBlock.tagName == 'LI' || startBlock.tagName == 'TD' || startBlock === obj || domUtils.isBody(startBlock)){
                        domUtils.remove(obj,true);
                    }else{
                        domUtils.breakParent(startBlock,obj);
                    }

                    if(startBlock !== endBlock){
                        obj = domUtils.findParentByTagName(endBlock,'blockquote');
                        if(obj){
                            if(endBlock.tagName == 'LI' || endBlock.tagName == 'TD'|| domUtils.isBody(endBlock)){
                                obj.parentNode && domUtils.remove(obj,true);
                            }else{
                                domUtils.breakParent(endBlock,obj);
                            }

                        }
                    }

                    var blockquotes = domUtils.getElementsByTagName(this.document,'blockquote');
                    for(var i=0,bi;bi=blockquotes[i++];){
                        if(!bi.childNodes.length){
                            domUtils.remove(bi);
                        }else if(domUtils.getPosition(bi,startBlock)&domUtils.POSITION_FOLLOWING && domUtils.getPosition(bi,endBlock)&domUtils.POSITION_PRECEDING){
                            domUtils.remove(bi,true);
                        }
                    }




            } else {

                var tmpRange = range.cloneRange(),
                    node = tmpRange.startContainer.nodeType == 1 ? tmpRange.startContainer : tmpRange.startContainer.parentNode,
                    preNode = node,
                    doEnd = 1;

                //调整开始
                while ( 1 ) {
                    if ( domUtils.isBody(node) ) {
                        if ( preNode !== node ) {
                            if ( range.collapsed ) {
                                tmpRange.selectNode( preNode );
                                doEnd = 0;
                            } else {
                                tmpRange.setStartBefore( preNode );
                            }
                        }else{
                            tmpRange.setStart(node,0);
                        }

                        break;
                    }
                    if ( !blockquote[node.tagName] ) {
                        if ( range.collapsed ) {
                            tmpRange.selectNode( preNode );
                        } else{
                            tmpRange.setStartBefore( preNode);
                        }
                        break;
                    }

                    preNode = node;
                    node = node.parentNode;
                }

                //调整结束
                if ( doEnd ) {
                    preNode = node =  node = tmpRange.endContainer.nodeType == 1 ? tmpRange.endContainer : tmpRange.endContainer.parentNode;
                    while ( 1 ) {

                        if ( domUtils.isBody( node ) ) {
                            if ( preNode !== node ) {

                                tmpRange.setEndAfter( preNode );

                            } else {
                                tmpRange.setEnd( node, node.childNodes.length );
                            }

                            break;
                        }
                        if ( !blockquote[node.tagName] ) {
                            tmpRange.setEndAfter( preNode );
                            break;
                        }

                        preNode = node;
                        node = node.parentNode;
                    }

                }


                node = range.document.createElement( 'blockquote' );
                domUtils.setAttributes( node, attrs );

                /* 文库的引用特殊处理 */
                var childContents = tmpRange.extractContents(),
                    childs = childContents.childNodes;

                //为每一个子节点改标签名以及添加样式名
                for( var i = 0, chi; chi = childs[i]; i++ ) {
                    if( chi.nodeType !== 1 ) {
                        continue;
                    }

                    var isImagePara = false, ii;
                    if(domUtils.hasClass(chi, UE.PICNOTE_FLAG)) isImagePara = true;
                    for (ii in UE.singleImageFloat) {
                        if(domUtils.hasClass(chi, UE.singleImageFloat[ii])) isImagePara = true;
                    }
                    if(isImagePara) continue;

                    if( chi.nodeName.toLowerCase() !== 'p' ) {
                        //改名字
                        var tmp = document.createElement('p');
                        tmp.className = chi.className;
                        tmp.innerHTML = chi.innerHTML;
                        //替换节点
                        childContents.replaceChild( tmp, chi );
                        chi = tmp;
                    }


                    //互斥class
                    for( var key in UE.singleType ) {

                        chi.classList.remove( UE.singleType[ key ] );

                    }

                    chi.classList.add( wkQuote );

                }

//                node.appendChild( tmpRange.extractContents() );
                tmpRange.insertNode( childContents );
//                //去除重复的
//                var childs = domUtils.getElementsByTagName(node,'blockquote');
//                for(var i=0,ci;ci=childs[i++];){
//                    if(ci.parentNode){
//                        domUtils.remove(ci,true);
//                    }
//                }

            }
        },
        queryCommandState : function() {
            var paragraph = domUtils.findParentByTagName(this.selection.getStart(),'p', true),
                range = this.selection.getRange(),
                closeNode = range.getClosedNode(),
                isimg = (closeNode && closeNode.tagName == "IMG" ? true:false);

            return isimg ? -1: (paragraph && domUtils.hasClass( paragraph, UE.BLOCKQUOTE_FLAG )  ? 1 : 0);
        }
    };
};

