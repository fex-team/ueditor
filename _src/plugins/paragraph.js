/**
 * 段落样式
 * @file
 * @since 1.2.6.1
 */

/**
 * 段落格式
 * @command paragraph
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param {String}   style               标签值为：'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
 * @param {Object}   attrs               标签的属性
 * @example
 * ```javascript
 * editor.execCommand( 'Paragraph','h1','{
 *     class:'test'
 * }' );
 * ```
 */

/**
 * 返回选区内节点标签名
 * @command paragraph
 * @method queryCommandValue
 * @param { String } cmd 命令字符串
 * @return { String } 节点标签名
 * @example
 * ```javascript
 * editor.queryCommandValue( 'Paragraph' );
 * ```
 */

UE.plugins['paragraph'] = function() {
    var me = this,
        block = domUtils.isBlockElm,
        notExchange = ['TD','LI','PRE'],

        doParagraph = function(range,style,attrs,sourceCmdName){
            var bookmark = range.createBookmark(),
                filterFn = function( node ) {
                    return   node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' &&  !domUtils.isBookmarkNode(node) : !domUtils.isWhitespace( node );
                },
                para;

            range.enlarge( true );
            var bookmark2 = range.createBookmark(),
                current = domUtils.getNextDomNode( bookmark2.start, false, filterFn ),
                tmpRange = range.cloneRange(),
                tmpNode;
            while ( current && !(domUtils.getPosition( current, bookmark2.end ) & domUtils.POSITION_FOLLOWING) ) {
                if ( current.nodeType == 3 || !block( current ) ) {
                    tmpRange.setStartBefore( current );
                    while ( current && current !== bookmark2.end && !block( current ) ) {
                        tmpNode = current;
                        current = domUtils.getNextDomNode( current, false, null, function( node ) {
                            return !block( node );
                        } );
                    }
                    tmpRange.setEndAfter( tmpNode );
                    
                    para = range.document.createElement( style );
                    if(attrs){
                        domUtils.setAttributes(para,attrs);
                        if(sourceCmdName && sourceCmdName == 'customstyle' && attrs.style){
                            para.style.cssText = attrs.style;
                        }
                    }
                    para.appendChild( tmpRange.extractContents() );
                    //需要内容占位
                    if(domUtils.isEmptyNode(para)){
                        domUtils.fillChar(range.document,para);
                        
                    }

                    tmpRange.insertNode( para );

                    var parent = para.parentNode;
                    //如果para上一级是一个block元素且不是body,td就删除它
                    if ( block( parent ) && !domUtils.isBody( para.parentNode ) && utils.indexOf(notExchange,parent.tagName)==-1) {
                        //存储dir,style
                        if(!(sourceCmdName && sourceCmdName == 'customstyle')){
                            parent.getAttribute('dir') && para.setAttribute('dir',parent.getAttribute('dir'));
                            //trace:1070
                            parent.style.cssText && (para.style.cssText = parent.style.cssText + ';' + para.style.cssText);
                            //trace:1030
                            parent.style.textAlign && !para.style.textAlign && (para.style.textAlign = parent.style.textAlign);
                            parent.style.textIndent && !para.style.textIndent && (para.style.textIndent = parent.style.textIndent);
                            parent.style.padding && !para.style.padding && (para.style.padding = parent.style.padding);
                        }

                        //trace:1706 选择的就是h1-6要删除
                        if(attrs && /h\d/i.test(parent.tagName) && !/h\d/i.test(para.tagName) ){
                            domUtils.setAttributes(parent,attrs);
                            if(sourceCmdName && sourceCmdName == 'customstyle' && attrs.style){
                                parent.style.cssText = attrs.style;
                            }
                            domUtils.remove(para,true);
                            para = parent;
                        }else{
                            domUtils.remove( para.parentNode, true );
                        }

                    }
                    if(  utils.indexOf(notExchange,parent.tagName)!=-1){
                        current = parent;
                    }else{
                       current = para;
                    }


                    current = domUtils.getNextDomNode( current, false, filterFn );
                } else {
                    current = domUtils.getNextDomNode( current, true, filterFn );
                }
            }
            return range.moveToBookmark( bookmark2 ).moveToBookmark( bookmark );
        };
    me.setOpt('paragraph',{'p':'', 'h1':'', 'h2':'', 'h3':'', 'h4':'', 'h5':'', 'h6':''});
    me.commands['paragraph'] = {
        execCommand : function( cmdName, style,attrs,sourceCmdName ) {
            var range = this.selection.getRange();
             //闭合时单独处理
            if(range.collapsed){
                var txt = this.document.createTextNode('p');
                range.insertNode(txt);
                //去掉冗余的fillchar
                if(browser.ie){
                    var node = txt.previousSibling;
                    if(node && domUtils.isWhitespace(node)){
                        domUtils.remove(node);
                    }
                    node = txt.nextSibling;
                    if(node && domUtils.isWhitespace(node)){
                        domUtils.remove(node);
                    }
                }

            }
            range = doParagraph(range,style,attrs,sourceCmdName);
            if(txt){
                range.setStartBefore(txt).collapse(true);
                pN = txt.parentNode;

                domUtils.remove(txt);

                if(domUtils.isBlockElm(pN)&&domUtils.isEmptyNode(pN)){
                    domUtils.fillNode(this.document,pN);
                }

            }

            if(browser.gecko && range.collapsed && range.startContainer.nodeType == 1){
                var child = range.startContainer.childNodes[range.startOffset];
                if(child && child.nodeType == 1 && child.tagName.toLowerCase() == style){
                    range.setStart(child,0).collapse(true);
                }
            }
            //trace:1097 原来有true，原因忘了，但去了就不能清除多余的占位符了
            range.select();


            return true;
        },
        queryCommandValue : function() {
            var node = domUtils.filterNodeList(this.selection.getStartElementPath(),'p h1 h2 h3 h4 h5 h6');
            return node ? node.tagName.toLowerCase() : '';
        }
    };
};
