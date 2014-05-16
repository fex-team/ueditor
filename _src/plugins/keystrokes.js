/* 处理特殊键的兼容性问题 */
UE.plugins['keystrokes'] = function() {
    var me = this;
    var collapsed = true;
    me.addListener('keydown', function(type, evt) {
        var keyCode = evt.keyCode || evt.which,
            rng = me.selection.getRange();

        //处理全选的情况
        if(!rng.collapsed && !(evt.ctrlKey || evt.shiftKey || evt.altKey || evt.metaKey) && (keyCode >= 65 && keyCode <=90
            || keyCode >= 48 && keyCode <= 57 ||
            keyCode >= 96 && keyCode <= 111 || {
                    13:1,
                    8:1,
                    46:1
                }[keyCode])
            ){

            var tmpNode = rng.startContainer;
            if(domUtils.isFillChar(tmpNode)){
                rng.setStartBefore(tmpNode)
            }
            tmpNode = rng.endContainer;
            if(domUtils.isFillChar(tmpNode)){
                rng.setEndAfter(tmpNode)
            }
            rng.txtToElmBoundary();
            //结束边界可能放到了br的前边，要把br包含进来
            // x[xxx]<br/>
            if(rng.endContainer && rng.endContainer.nodeType == 1){
                tmpNode = rng.endContainer.childNodes[rng.endOffset];
                if(tmpNode && domUtils.isBr(tmpNode)){
                    rng.setEndAfter(tmpNode);
                }
            }
            if(rng.startOffset == 0){
                tmpNode = rng.startContainer;
                if(domUtils.isBoundaryNode(tmpNode,'firstChild') ){
                    tmpNode = rng.endContainer;
                    if(rng.endOffset == (tmpNode.nodeType == 3 ? tmpNode.nodeValue.length : tmpNode.childNodes.length) && domUtils.isBoundaryNode(tmpNode,'lastChild')){
                        me.fireEvent('saveScene');
                        me.body.innerHTML = '<p>'+(browser.ie ? '' : '<br/>')+'</p>';
                        rng.setStart(me.body.firstChild,0).setCursor(false,true);
                        me._selectionChange();
                        return;
                    }
                }
            }
        }

        //处理backspace
        if (keyCode == keymap.Backspace) {
            rng = me.selection.getRange();
            collapsed = rng.collapsed;
            if(me.fireEvent('delkeydown',evt)){
                return;
            }
            var start,end;
            //避免按两次删除才能生效的问题
            if(rng.collapsed && rng.inFillChar()){
                start = rng.startContainer;

                if(domUtils.isFillChar(start)){
                    rng.setStartBefore(start).shrinkBoundary(true).collapse(true);
                    domUtils.remove(start)
                }else{
                    start.nodeValue = start.nodeValue.replace(new RegExp('^' + domUtils.fillChar ),'');
                    rng.startOffset--;
                    rng.collapse(true).select(true)
                }
            }

            //解决选中control元素不能删除的问题
            if (start = rng.getClosedNode()) {
                me.fireEvent('saveScene');
                rng.setStartBefore(start);
                domUtils.remove(start);
                rng.setCursor();
                me.fireEvent('saveScene');
                domUtils.preventDefault(evt);
                return;
            }
            //阻止在table上的删除
            if (!browser.ie) {
                start = domUtils.findParentByTagName(rng.startContainer, 'table', true);
                end = domUtils.findParentByTagName(rng.endContainer, 'table', true);
                if (start && !end || !start && end || start !== end) {
                    evt.preventDefault();
                    return;
                }
            }

        }
        //处理tab键的逻辑
        if (keyCode == keymap.Tab) {
            //不处理以下标签
            var excludeTagNameForTabKey = {
                'ol' : 1,
                'ul' : 1,
                'table':1
            };
            //处理组件里的tab按下事件
            if(me.fireEvent('tabkeydown',evt)){
                domUtils.preventDefault(evt);
                return;
            }
            var range = me.selection.getRange();
            me.fireEvent('saveScene');
            for (var i = 0,txt = '',tabSize = me.options.tabSize|| 4,tabNode =  me.options.tabNode || '&nbsp;'; i < tabSize; i++) {
                txt += tabNode;
            }
            var span = me.document.createElement('span');
            span.innerHTML = txt + domUtils.fillChar;
            if (range.collapsed) {
                range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
            } else {
                var filterFn = function(node) {
                    return domUtils.isBlockElm(node) && !excludeTagNameForTabKey[node.tagName.toLowerCase()]

                };
                //普通的情况
                start = domUtils.findParent(range.startContainer, filterFn,true);
                end = domUtils.findParent(range.endContainer, filterFn,true);
                if (start && end && start === end) {
                    range.deleteContents();
                    range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
                } else {
                    var bookmark = range.createBookmark();
                    range.enlarge(true);
                    var bookmark2 = range.createBookmark(),
                        current = domUtils.getNextDomNode(bookmark2.start, false, filterFn);
                    while (current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING)) {
                        current.insertBefore(span.cloneNode(true).firstChild, current.firstChild);
                        current = domUtils.getNextDomNode(current, false, filterFn);
                    }
                    range.moveToBookmark(bookmark2).moveToBookmark(bookmark).select();
                }
            }
            domUtils.preventDefault(evt)
        }
        //trace:1634
        //ff的del键在容器空的时候，也会删除
        if(browser.gecko && keyCode == 46){
            range = me.selection.getRange();
            if(range.collapsed){
                start = range.startContainer;
                if(domUtils.isEmptyBlock(start)){
                    var parent = start.parentNode;
                    while(domUtils.getChildCount(parent) == 1 && !domUtils.isBody(parent)){
                        start = parent;
                        parent = parent.parentNode;
                    }
                    if(start === parent.lastChild)
                        evt.preventDefault();
                    return;
                }
            }
        }
    });
    me.addListener('keyup', function(type, evt) {
        var keyCode = evt.keyCode || evt.which,
            rng,me = this;
        if(keyCode == keymap.Backspace){
            if(me.fireEvent('delkeyup')){
                return;
            }
            rng = me.selection.getRange();
            if(rng.collapsed){
                var tmpNode,
                    autoClearTagName = ['h1','h2','h3','h4','h5','h6'];
                if(tmpNode = domUtils.findParentByTagName(rng.startContainer,autoClearTagName,true)){
                    if(domUtils.isEmptyBlock(tmpNode)){
                        var pre = tmpNode.previousSibling;
                        if(pre && pre.nodeName != 'TABLE'){
                            domUtils.remove(tmpNode);
                            rng.setStartAtLast(pre).setCursor(false,true);
                            return;
                        }else{
                            var next = tmpNode.nextSibling;
                            if(next && next.nodeName != 'TABLE'){
                                domUtils.remove(tmpNode);
                                rng.setStartAtFirst(next).setCursor(false,true);
                                return;
                            }
                        }
                    }
                }
                //处理当删除到body时，要重新给p标签展位
                if(domUtils.isBody(rng.startContainer)){
                    var tmpNode = domUtils.createElement(me.document,'p',{
                        'innerHTML' : browser.ie ? domUtils.fillChar : '<br/>'
                    });
                    rng.insertNode(tmpNode).setStart(tmpNode,0).setCursor(false,true);
                }
            }


            //chrome下如果删除了inline标签，浏览器会有记忆，在输入文字还是会套上刚才删除的标签，所以这里再选一次就不会了
            if( !collapsed && (rng.startContainer.nodeType == 3 || rng.startContainer.nodeType == 1 && domUtils.isEmptyBlock(rng.startContainer))){
                if(browser.ie){
                    var span = rng.document.createElement('span');
                    rng.insertNode(span).setStartBefore(span).collapse(true);
                    rng.select();
                    domUtils.remove(span)
                }else{
                    rng.select()
                }

            }
        }


    })
};