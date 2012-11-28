/*
*   处理特殊键的兼容性问题
*/
UE.plugins['keystrokes'] = function() {
    var me = this,
        flag = 0,
        keys = domUtils.keys,
        trans = {
            'B' : 'strong',
            'I' : 'em',
            'FONT' : 'span'
        },
        sizeMap = [0, 10, 12, 16, 18, 24, 32, 48],
        listStyle = {
            'OL':['decimal','lower-alpha','lower-roman','upper-alpha','upper-roman'],

            'UL':[ 'circle','disc','square']
        };

    //判断列表是否是相似的
    function sameListNode(nodeA,nodeB){
        if(nodeA.tagName !== nodeB.tagName ||
            domUtils.getComputedStyle(nodeA,'list-style-type') !== domUtils.getComputedStyle(nodeB,'list-style-type')
        ){
            return false
        }
        return true;
    }
    me.addListener('keydown', function(type, evt) {
        var keyCode = evt.keyCode || evt.which;

        if(this.selectAll){
            this.selectAll = false;
            if((keyCode == 8 || keyCode == 46)){
                me.undoManger && me.undoManger.save();
                 //trace:1633
                me.body.innerHTML = '<p>'+(browser.ie ? '' : '<br/>')+'</p>';

                new dom.Range(me.document).setStart(me.body.firstChild,0).setCursor(false,true);
                me.undoManger && me.undoManger.save();
                //todo 对性能会有影响
                browser.ie && me._selectionChange();
                domUtils.preventDefault(evt);
                return;
            }


        }

        //处理backspace/del
        if (keyCode == 8 ) {//|| keyCode == 46


            var range = me.selection.getRange(),
                tmpRange,
                start,end;

            //当删除到body最开始的位置时，会删除到body,阻止这个动作
            if(range.collapsed){
                start = range.startContainer;
                //有可能是展位符号
                if(domUtils.isWhitespace(start)){
                    start = start.parentNode;
                }
                if(domUtils.isEmptyNode(start) && start === me.body.firstChild){

                    if(start.tagName != 'P'){
                        p = me.document.createElement('p');
                        me.body.insertBefore(p,start);
                        domUtils.fillNode(me.document,p);
                        range.setStart(p,0).setCursor(false,true);
                        //trace:1645
                        domUtils.remove(start);
                    }
                    domUtils.preventDefault(evt);
                    return;

                }
            }

            if (range.collapsed && range.startContainer.nodeType == 3 && range.startContainer.nodeValue.replace(new RegExp(domUtils.fillChar, 'g'), '').length == 0) {
                range.setStartBefore(range.startContainer).collapse(true);
            }
            //解决选中control元素不能删除的问题
            if (start = range.getClosedNode()) {
                me.undoManger && me.undoManger.save();
                range.setStartBefore(start);
                domUtils.remove(start);
                range.setCursor();
                me.undoManger && me.undoManger.save();
                domUtils.preventDefault(evt);
                return;
            }
            //阻止在table上的删除
            if (!browser.ie) {

                start = domUtils.findParentByTagName(range.startContainer, 'table', true);
                end = domUtils.findParentByTagName(range.endContainer, 'table', true);
                if (start && !end || !start && end || start !== end) {
                    evt.preventDefault();
                    return;
                }
                //表格里回车，删除时，光标被定位到了p外边，导致多次删除才能到上一行，这里的处理忘记是为什么，暂时注视掉
                //解决trace:1966的问题
//                if (browser.webkit && range.collapsed && start) {
//                    tmpRange = range.cloneRange().txtToElmBoundary();
//                    start = tmpRange.startContainer;
//                           debugger
//                    if (domUtils.isBlockElm(start) && !dtd.$tableContent[start.tagName] && !domUtils.getChildCount(start, function(node) {
//                        return node.nodeType == 1 ? node.tagName !== 'BR' : 1;
//                    })) {
//
//                        tmpRange.setStartBefore(start).setCursor();
//                        domUtils.remove(start, true);
//                        evt.preventDefault();
//                        return;
//                    }
//                }
            }


            if (me.undoManger) {

                if (!range.collapsed) {
                    me.undoManger.save();
                    flag = 1;
                }
            }

        }
        //处理tab键的逻辑
        if (keyCode == 9) {
            range = me.selection.getRange();
            me.undoManger && me.undoManger.save();

            for (var i = 0,txt = '',tabSize = me.options.tabSize|| 4,tabNode =  me.options.tabNode || '&nbsp;'; i < tabSize; i++) {
                txt += tabNode;
            }
            var span = me.document.createElement('span');
            span.innerHTML = txt;
            if (range.collapsed) {


                var li = domUtils.findParentByTagName(range.startContainer, 'li', true);

                if (li && domUtils.isStartInblock(range)) {
                    bk = range.createBookmark();
                    var parentLi = li.parentNode,
                        list = me.document.createElement(parentLi.tagName);
                    var index = utils.indexOf(listStyle[list.tagName], domUtils.getComputedStyle(parentLi, 'list-style-type'));
                    index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
                    domUtils.setStyle(list, 'list-style-type', listStyle[list.tagName][index]);
                    parentLi.insertBefore(list, li);
                    list.appendChild(li);

                    //trace:2721
                    //合并上下相同的列表
                    var preList = list.previousSibling;
                    if(preList && sameListNode(preList,list)){
                        domUtils.moveChild(list,preList);
                        domUtils.remove(list);
                        list = preList
                    }
                    var nextList = list.nextSibling;
                    if(nextList && sameListNode(nextList,list)){
                        domUtils.moveChild(nextList,list);
                        domUtils.remove(nextList);
                    }

                    range.moveToBookmark(bk).select();

                } else{
                    range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
                }

            } else {
                //处理table
                start = domUtils.findParentByTagName(range.startContainer, 'table', true);
                end = domUtils.findParentByTagName(range.endContainer, 'table', true);
                if (start || end) {
                    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
                    return;
                }
                //处理列表 再一个list里处理
                start = domUtils.findParentByTagName(range.startContainer, ['ol','ul'], true);
                end = domUtils.findParentByTagName(range.endContainer, ['ol','ul'], true);
                if (start && end && start === end) {
                    var bk = range.createBookmark();
                    start = domUtils.findParentByTagName(range.startContainer, 'li', true);
                    end = domUtils.findParentByTagName(range.endContainer, 'li', true);
                    //在开始单独处理
                    if (start === start.parentNode.firstChild) {
                        var parentList = me.document.createElement(start.parentNode.tagName);

                        start.parentNode.parentNode.insertBefore(parentList, start.parentNode);
                        parentList.appendChild(start.parentNode);
                    } else {
                        parentLi = start.parentNode;
                            list = me.document.createElement(parentLi.tagName);

                        index = utils.indexOf(listStyle[list.tagName], domUtils.getComputedStyle(parentLi, 'list-style-type'));
                        index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
                        domUtils.setStyle(list, 'list-style-type', listStyle[list.tagName][index]);
                        start.parentNode.insertBefore(list, start);
                        var nextLi;
                        while (start !== end) {
                            nextLi = start.nextSibling;
                            list.appendChild(start);
                            start = nextLi;
                        }
                        list.appendChild(end);

                    }
                    range.moveToBookmark(bk).select();

                } else {
                    if (start || end) {
                        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
                        return
                    }
                    //普通的情况
                    start = domUtils.findParent(range.startContainer, filterFn);
                    end = domUtils.findParent(range.endContainer, filterFn);
                    if (start && end && start === end) {
                        range.deleteContents();
                        range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
                    } else {
                        var bookmark = range.createBookmark(),
                            filterFn = function(node) {
                                return domUtils.isBlockElm(node);

                            };

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


            }
            me.undoManger && me.undoManger.save();
            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
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
        var keyCode = evt.keyCode || evt.which;
        //修复ie/chrome <strong><em>x|</em></strong> 当点退格后在输入文字后会出现  <b><i>x</i></b>
        if (!browser.gecko && !keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
            range = me.selection.getRange();
            if (range.collapsed) {
                var start = range.startContainer,
                    isFixed = 0;

                while (!domUtils.isBlockElm(start)) {
                    if (start.nodeType == 1 && utils.indexOf(['FONT','B','I'], start.tagName) != -1) {

                        var tmpNode = me.document.createElement(trans[start.tagName]);
                        if (start.tagName == 'FONT') {
                            //chrome only remember color property
                            tmpNode.style.cssText = (start.getAttribute('size') ? 'font-size:' + (sizeMap[start.getAttribute('size')] || 12) + 'px' : '')
                                + ';' + (start.getAttribute('color') ? 'color:' + start.getAttribute('color') : '')
                                + ';' + (start.getAttribute('face') ? 'font-family:' + start.getAttribute('face') : '')
                                + ';' + start.style.cssText;
                        }
                        while (start.firstChild) {
                            tmpNode.appendChild(start.firstChild)
                        }
                        start.parentNode.insertBefore(tmpNode, start);
                        domUtils.remove(start);
                        if (!isFixed) {
                            range.setEnd(tmpNode, tmpNode.childNodes.length).collapse(true)

                        }
                        start = tmpNode;
                        isFixed = 1;
                    }
                    start = start.parentNode;

                }

                isFixed && range.select()

            }
        }

        if (keyCode == 8 ) {//|| keyCode == 46

            //针对ff下在列表首行退格，不能删除空格行的问题
            if(browser.gecko){
                for(var i=0,li,lis = domUtils.getElementsByTagName(this.body,'li');li=lis[i++];){
                    if(domUtils.isEmptyNode(li) && !li.previousSibling){
                        var liOfPn = li.parentNode;
                        domUtils.remove(li);
                        if(domUtils.isEmptyNode(liOfPn)){
                            domUtils.remove(liOfPn)
                        }

                    }
                }
            }

            var range,start,parent,
                tds = this.currentSelectedArr;
            if (tds && tds.length > 0) {
                for (var i = 0,ti; ti = tds[i++];) {
                    ti.innerHTML = browser.ie ? ( browser.version < 9 ? '&#65279' : '' ) : '<br/>';

                }
                range = new dom.Range(this.document);
                range.setStart(tds[0], 0).setCursor();
                if (flag) {
                    me.undoManger.save();
                    flag = 0;
                }
                //阻止chrome执行默认的动作
                if (browser.webkit) {
                    evt.preventDefault();
                }
                return;
            }

            range = me.selection.getRange();

            //ctrl+a 后全部删除做处理
//
//            if (domUtils.isEmptyBlock(me.body) && !range.startOffset) {
//                //trace:1633
//                me.body.innerHTML = '<p>'+(browser.ie ? '&nbsp;' : '<br/>')+'</p>';
//                range.setStart(me.body.firstChild,0).setCursor(false,true);
//                me.undoManger && me.undoManger.save();
//                //todo 对性能会有影响
//                browser.ie && me._selectionChange();
//                return;
//            }

            //处理删除不干净的问题

            start = range.startContainer;
            if(domUtils.isWhitespace(start)){
                start = start.parentNode
            }
            //标志位防止空的p无法删除
            var removeFlag = 0;
            while (start.nodeType == 1 && domUtils.isEmptyNode(start) && dtd.$removeEmpty[start.tagName]) {
                removeFlag = 1;
                parent = start.parentNode;
                domUtils.remove(start);
                start = parent;
            }

            if ( removeFlag && start.nodeType == 1 && domUtils.isEmptyNode(start)) {
                //ie下的问题，虽然没有了相应的节点但一旦你输入文字还是会自动把删除的节点加上，
                if (browser.ie) {
                    var span = range.document.createElement('span');
                    start.appendChild(span);
                    range.setStart(start,0).setCursor();
                    //for ie
                    li = domUtils.findParentByTagName(start,'li',true);
                    if(li){
                        var next = li.nextSibling;
                        while(next){
                            if(domUtils.isEmptyBlock(next)){
                                li = next;
                                next = next.nextSibling;
                                domUtils.remove(li);
                                continue;

                            }
                            break;
                        }
                    }
                } else {
                    start.innerHTML = '<br/>';
                    range.setStart(start, 0).setCursor(false,true);
                }

                setTimeout(function() {
                    if (browser.ie) {
                        domUtils.remove(span);
                    }

                    if (flag) {
                        me.undoManger.save();
                        flag = 0;
                    }
                }, 0)
            } else {

                if (flag) {
                    me.undoManger.save();
                    flag = 0;
                }

            }
        }
    })
};