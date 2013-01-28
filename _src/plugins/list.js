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
    var customStyle = {
        'cn' : 'cn-1-',
        'cn1' : 'cn-2-',
        'cn2' : 'cn-3-',
        'num':  'num-1-',
        'num1' : 'num-2-',
        'num2' : 'num-3-',
        'dash'  : 'dash',
        'dot':'dot'
    };

    me.setOpt( {
        'insertorderedlist':{
            'num':'',
            'num1':'',
            'num2':'',
            'cn':'',
            'cn1':'',
            'cn2':'',
            'decimal':'',
            'lower-alpha':'',
            'lower-roman':'',
            'upper-alpha':'',
            'upper-roman':''
        },
        'insertunorderedlist':{
            'circle':'',
            'disc':'',
            'square':'',
            'dash' : '',
            'dot':''
        },
        listDefaultPaddingLeft : '30',
        listiconpath : 'http://bs.baidu.com/listicon/',
        maxListLevel : 3//-1不限制
    } );
    var liiconpath = me.options.listiconpath;

    //根据用户配置，调整customStyle
    for(var s in customStyle){
        if(!me.options.insertorderedlist.hasOwnProperty(s) && !me.options.insertunorderedlist.hasOwnProperty(s)){
            delete customStyle[s];
        }
    }

    me.ready(function () {
        var customCss = [];
        for(var p in customStyle){
            if(p == 'dash' || p == 'dot'){
                customCss.push('li.list-' + customStyle[p] + '{background-image:url(' + liiconpath +customStyle[p]+'.gif)}');
                customCss.push('ul.custom_'+p+'{list-style:none;}ul.custom_'+p+' li{background-position:0 3px;background-repeat:no-repeat}');
            }else{
                for(var i= 0;i<99;i++){
                    customCss.push('li.list-' + customStyle[p] + i + '{background-image:url(' + liiconpath + 'list-'+customStyle[p] + i + '.gif)}')
                }
                customCss.push('ol.custom_'+p+'{list-style:none;}ol.custom_'+p+' li{background-position:0 3px;background-repeat:no-repeat}');
            }
            switch(p){
                case 'cn':
                    customCss.push('li.list-'+p+'-paddingleft-1{padding-left:25px}');
                    customCss.push('li.list-'+p+'-paddingleft-2{padding-left:40px}');
                    customCss.push('li.list-'+p+'-paddingleft-3{padding-left:55px}');
                    break;
                case 'cn1':
                    customCss.push('li.list-'+p+'-paddingleft-1{padding-left:30px}');
                    customCss.push('li.list-'+p+'-paddingleft-2{padding-left:40px}');
                    customCss.push('li.list-'+p+'-paddingleft-3{padding-left:55px}');
                    break;
                case 'cn2':
                    customCss.push('li.list-'+p+'-paddingleft-1{padding-left:40px}');
                    customCss.push('li.list-'+p+'-paddingleft-2{padding-left:55px}');
                    customCss.push('li.list-'+p+'-paddingleft-3{padding-left:68px}');
                    break;
                case 'num':
                case 'num1':
                    customCss.push('li.list-'+p+'-paddingleft-1{padding-left:25px}');
                    break;
                case 'num2':
                    customCss.push('li.list-'+p+'-paddingleft-1{padding-left:35px}');
                    customCss.push('li.list-'+p+'-paddingleft-2{padding-left:40px}');
                    break;
                case 'dash':
                    customCss.push('li.list-'+p+'-paddingleft{padding-left:35px}');
                    break;
                case 'dot':
                    customCss.push('li.list-'+p+'-paddingleft{padding-left:20px}');
            }
        }
        customCss.push('.list-paddingleft-1{padding-left:0}');
        customCss.push('.list-paddingleft-2{padding-left:'+me.options.listDefaultPaddingLeft+'px}');
        customCss.push('.list-paddingleft-3{padding-left:'+me.options.listDefaultPaddingLeft*2+'px}');
        //如果不给宽度会在自定应样式里出现滚动条
        utils.cssRule('list', 'ol,ul{margin:0;pading:0;'+(browser.ie ? '' : 'width:95%')+'}li{clear:both;}'+customCss.join('\n'), me.document);
    });

    function getStyle(node){
        var cls = node.className;
        if(domUtils.hasClass(node,/custom_/)){
            return cls.match(/custom_(\w+)/)[1]
        }
        return ''
    }

//    function checkCustomStyle(list){
//        if(domUtils.hasClass(list,/custom_/)){
//            return ''
//        }
//        var style;
//        utils.each(list.childNodes,function(li){
//            if(li.tagName == 'LI'){
//                if(domUtils.hasClass(li,/list-/)){
//                    var tmpStyle = li.className.match(/list-(\w+)-(\d+)?/);
//                    style = tmpStyle[1]+(tmpStyle[2] && tmpStyle[2] != '1'?  tmpStyle[2]:'');
//                    return false
//                }
//            }
//        })
//        return style;
//    }
    //调整索引标签
    me.addListener('contentchange',function(){
        utils.each(domUtils.getElementsByTagName(me.document,'ol ul'),function(node){

            if(!domUtils.inDoc(node,me.document))
                return;
//            var style;
//            if(style = checkCustomStyle(node)){
//                node.className = 'custom_' + style;
//            }
            var index = 0,type = 2,parent = node.parentNode;
            if( domUtils.hasClass(node,/custom_/)){
                if(!(/[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent,/custom_/))){
                    type = 1;
                }
            }else{
                if(/[ou]l/i.test(parent.tagName) && domUtils.hasClass(parent,/custom_/)){
                    type = 3;
                }
            }
            style = domUtils.getStyle(node, 'list-style-type');
            node.style.cssText = style ? 'list-style-type:' + style : '';
            node.className = utils.trim(node.className.replace(/list-paddingleft-\w+/,'')) + ' list-paddingleft-' + type;
            utils.each(domUtils.getElementsByTagName(node,'li'),function(li){
                li.style.cssText && (li.style.cssText = '');
                if(!li.firstChild){
                    domUtils.remove(li);
                    return;
                }
                if(li.parentNode !== node){
                    return;
                }
                index++;
                if(domUtils.hasClass(node,/custom_/) ){
                    var paddingLeft = 1,currentStyle = getStyle(node);
                    if(node.tagName == 'OL'){
                        if(currentStyle){
                            switch(currentStyle){
                                case 'cn' :
                                case 'cn1':
                                case 'cn2':
                                    if(index > 10 && (index % 10 == 0 || index > 10 && index < 20)){
                                        paddingLeft = 2
                                    }else if(index > 20){
                                        paddingLeft = 3
                                    }
                                    break;
                                case 'num2' :
                                    if(index > 9){
                                        paddingLeft = 2
                                    }
                            }
                        }
                        li.className = 'list-'+customStyle[currentStyle]+ index + ' ' + 'list-'+currentStyle+'-paddingleft-' + paddingLeft;
                    }else{
                        li.className = 'list-'+customStyle[currentStyle]  + ' ' + 'list-'+currentStyle+'-paddingleft';
                    }
                }else{
                    li.className = li.className.replace(/list-[\w\-]+/gi,'');
                }
                var className = li.getAttribute('class');
                if(className !== null && !className.replace(/\s/g,'')){
                    domUtils.removeAttributes(li,'class')
                }
            });
            adjustList(node,node.tagName.toLowerCase(),getStyle(node)||domUtils.getStyle(node, 'list-style-type'),true)
        })
    });


    function adjustList(list, tag, style,ignoreEmpty) {
        var nextList = list.nextSibling;
        if (nextList && nextList.nodeType == 1 && nextList.tagName.toLowerCase() == tag && (getStyle(nextList) || domUtils.getStyle(nextList, 'list-style-type') || (tag == 'ol' ? 'decimal' : 'disc')) == style) {
            domUtils.moveChild(nextList, list);
            if (nextList.childNodes.length == 0) {
                domUtils.remove(nextList);
            }
        }
        if(nextList && domUtils.isFillChar(nextList)){
            domUtils.remove(nextList);
        }
        var preList = list.previousSibling;
        if (preList && preList.nodeType == 1 && preList.tagName.toLowerCase() == tag && (getStyle(preList) || domUtils.getStyle(preList, 'list-style-type') || (tag == 'ol' ? 'decimal' : 'disc')) == style) {
            domUtils.moveChild(list, preList);
        }
        if(preList && domUtils.isFillChar(preList)){
            domUtils.remove(preList);
        }
        !ignoreEmpty && domUtils.isEmptyBlock(list) && domUtils.remove(list);
    }

    function setListStyle(list,style){
        if(customStyle[style]){
            list.className = 'custom_' + style;
        }
        try{
            domUtils.setStyle(list, 'list-style-type', style);
        }catch(e){}
    }
    function clearEmptySibling(node) {
        var tmpNode = node.previousSibling;
        if (tmpNode && domUtils.isEmptyBlock(tmpNode)) {
            domUtils.remove(tmpNode);
        }
        tmpNode = node.nextSibling;
        if (tmpNode && domUtils.isEmptyBlock(tmpNode)) {
            domUtils.remove(tmpNode);
        }
    }

    me.addListener('keydown', function (type, evt) {
        function preventAndSave() {
            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
            me.fireEvent('contentchange');
            me.undoManger && me.undoManger.save();
        }
        function findList(node,filterFn){
            while(node && !domUtils.isBody(node)){
                if(filterFn(node)){
                    return null
                }
                if(node.nodeType == 1 && /[ou]l/i.test(node.tagName)){
                    return node;
                }
                node = node.parentNode;
            }
            return null;
        }
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 13 && !evt.shiftKey) {//回车
            var range = me.selection.getRange(),
                start = findList(range.startContainer,function (node) {
                    return node.tagName == 'TABLE';
                }),
                end = range.collapsed ? start : findList(range.endContainer,function (node) {
                    return node.tagName == 'TABLE';
                });

            if (start && end && start === end) {

                if (!range.collapsed) {
                    start = domUtils.findParentByTagName(range.startContainer, 'li', true);
                    end = domUtils.findParentByTagName(range.endContainer, 'li', true);
                    if (start && end && start === end) {
                        range.deleteContents();
                        li = domUtils.findParentByTagName(range.startContainer, 'li', true);
                        if (li && domUtils.isEmptyBlock(li)) {

                            pre = li.previousSibling;
                            next = li.nextSibling;
                            p = me.document.createElement('p');

                            domUtils.fillNode(me.document, p);
                            parentList = li.parentNode;
                            if (pre && next) {
                                range.setStart(next, 0).collapse(true).select(true);
                                domUtils.remove(li);

                            } else {
                                if (!pre && !next || !pre) {

                                    parentList.parentNode.insertBefore(p, parentList);


                                } else {
                                    li.parentNode.parentNode.insertBefore(p, parentList.nextSibling);
                                }
                                domUtils.remove(li);
                                if (!parentList.firstChild) {
                                    domUtils.remove(parentList);
                                }
                                range.setStart(p, 0).setCursor();


                            }
                            preventAndSave();
                            return;

                        }
                    } else {
                        var tmpRange = range.cloneRange(),
                            bk = tmpRange.collapse(false).createBookmark();

                        range.deleteContents();
                        tmpRange.moveToBookmark(bk);
                        var li = domUtils.findParentByTagName(tmpRange.startContainer, 'li', true);

                        clearEmptySibling(li);
                        tmpRange.select();
                        preventAndSave();
                        return;
                    }
                }


                li = domUtils.findParentByTagName(range.startContainer, 'li', true);

                if (li) {
                    if (domUtils.isEmptyBlock(li)) {
                        bk = range.createBookmark();
                        var parentList = li.parentNode;
                        if (li !== parentList.lastChild) {
                            domUtils.breakParent(li, parentList);
                            clearEmptySibling(li);
                        } else {

                            parentList.parentNode.insertBefore(li, parentList.nextSibling);
                            if (domUtils.isEmptyNode(parentList)) {
                                domUtils.remove(parentList);
                            }
                        }
                        //嵌套不处理
                        if (!dtd.$list[li.parentNode.tagName]) {

                            if (!domUtils.isBlockElm(li.firstChild)) {
                                p = me.document.createElement('p');
                                li.parentNode.insertBefore(p, li);
                                while (li.firstChild) {
                                    p.appendChild(li.firstChild);
                                }
                                domUtils.remove(li);
                            } else {
                                domUtils.remove(li, true);
                            }
                        }
                        range.moveToBookmark(bk).select();


                    } else {
                        var first = li.firstChild;
                        if (!first || !domUtils.isBlockElm(first)) {
                            var p = me.document.createElement('p');

                            !li.firstChild && domUtils.fillNode(me.document, p);
                            while (li.firstChild) {

                                p.appendChild(li.firstChild);
                            }
                            li.appendChild(p);
                            first = p;
                        }

                        var span = me.document.createElement('span');

                        range.insertNode(span);
                        domUtils.breakParent(span, li);

                        var nextLi = span.nextSibling;
                        first = nextLi.firstChild;

                        if (!first) {
                            p = me.document.createElement('p');

                            domUtils.fillNode(me.document, p);
                            nextLi.appendChild(p);
                            first = p;
                        }
                        if (domUtils.isEmptyNode(first)) {
                            first.innerHTML = '';
                            domUtils.fillNode(me.document, first);
                        }

                        range.setStart(first, 0).collapse(true).shrinkBoundary().select();
                        domUtils.remove(span);
                        var pre = nextLi.previousSibling;
                        if (pre && domUtils.isEmptyBlock(pre)) {
                            pre.innerHTML = '<p></p>';
                            domUtils.fillNode(me.document, pre.firstChild);
                        }

                    }
//                        }
                    preventAndSave();
                }


            }
        }
        if (keyCode == 8) {

            //修中ie中li下的问题
            range = me.selection.getRange();
            if (range.collapsed && domUtils.isStartInblock(range)) {
                tmpRange = range.cloneRange().trimBoundary();
                li = domUtils.findParentByTagName(range.startContainer, 'li', true);
                //要在li的最左边，才能处理
                if (li && domUtils.isStartInblock(tmpRange)) {
                    start = domUtils.findParentByTagName(range.startContainer, 'p', true);
                    if (start && start !== li.firstChild) {
                        var parentList = domUtils.findParentByTagName(start,['ol','ul']);
                        domUtils.breakParent(start,parentList);
                        clearEmptySibling(start);
                        me.fireEvent('contentchange');
                        range.setStart(start,0).setCursor(false,true);
                        me.fireEvent('saveScene');
                        domUtils.preventDefault(evt);
                        return;
                    }

                    if (li && (pre = li.previousSibling)) {
                        if (keyCode == 46 && li.childNodes.length) {
                            return;
                        }
                        //有可能上边的兄弟节点是个2级菜单，要追加到2级菜单的最后的li
                        if (dtd.$list[pre.tagName]) {
                            pre = pre.lastChild;
                        }
                        me.undoManger && me.undoManger.save();
                        first = li.firstChild;
                        if (domUtils.isBlockElm(first)) {
                            if (domUtils.isEmptyNode(first)) {
//                                    range.setEnd(pre, pre.childNodes.length).shrinkBoundary().collapse().select(true);
                                pre.appendChild(first);
                                range.setStart(first, 0).setCursor(false, true);
                                //first不是唯一的节点
                                while (li.firstChild) {
                                    pre.appendChild(li.firstChild);
                                }
                            } else {

                                span = me.document.createElement('span');
                                range.insertNode(span);
                                //判断pre是否是空的节点,如果是<p><br/></p>类型的空节点，干掉p标签防止它占位
                                if (domUtils.isEmptyBlock(pre)) {
                                    pre.innerHTML = '';
                                }
                                domUtils.moveChild(li, pre);
                                range.setStartBefore(span).collapse(true).select(true);

                                domUtils.remove(span);

                            }
                        } else {
                            if (domUtils.isEmptyNode(li)) {
                                var p = me.document.createElement('p');
                                pre.appendChild(p);
                                range.setStart(p, 0).setCursor();
//                                    range.setEnd(pre, pre.childNodes.length).shrinkBoundary().collapse().select(true);
                            } else {
                                range.setEnd(pre, pre.childNodes.length).collapse().select(true);
                                while (li.firstChild) {
                                    pre.appendChild(li.firstChild);
                                }
                            }
                        }
                        domUtils.remove(li);
                        me.fireEvent('contentchange');
                        me.fireEvent('saveScene');
                        domUtils.preventDefault(evt);
                        return;

                    }
                    //trace:980

                    if (li && !li.previousSibling) {
                        var parentList = li.parentNode;
                        var bk = range.createBookmark();
                        if(domUtils.isTagNode(parentList.parentNode,'ol ul')){
                            parentList.parentNode.insertBefore(li,parentList);
                            if(domUtils.isEmptyNode(parentList)){
                                domUtils.remove(parentList)
                            }
                        }else{

                            while(li.firstChild){
                                parentList.parentNode.insertBefore(li.firstChild,parentList);
                            }

                            domUtils.remove(li);
                            if(domUtils.isEmptyNode(parentList)){
                                domUtils.remove(parentList)
                            }

                        }
                        range.moveToBookmark(bk).setCursor(false,true);
                        me.fireEvent('contentchange');
                        me.fireEvent('saveScene');
                        domUtils.preventDefault(evt);
                        return;

                    }


                }


            }

        }
    });

    //处理tab键
    me.addListener('tabkeydown',function(){
        function listToArray(list){
            var arr = [];
            for(var p in list){
                arr.push(p)
            }
            return arr;
        }
        var range = me.selection.getRange(),
            listStyle = {
                'OL':listToArray(me.options.insertorderedlist),
                'UL':listToArray(me.options.insertunorderedlist)
            };
        //控制级数
        function checkLevel(li){
            if(me.options.maxListLevel != -1){
                var level = li.parentNode,levelNum = 0;
                while(/[ou]l/i.test(level.tagName)){
                    levelNum++;
                    level = level.parentNode;
                }
                if(levelNum >= me.options.maxListLevel){
                    return true;
                }
            }
        }
        //只以开始为准
        //todo 后续改进
        var li = domUtils.findParentByTagName(range.startContainer, 'li', true);
        if(li){

            var bk;
            if(range.collapsed){
                if(checkLevel(li))
                    return true;
                var parentLi = li.parentNode,
                    list = me.document.createElement(parentLi.tagName),
                    index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi)||domUtils.getComputedStyle(parentLi, 'list-style-type'));
                index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
                var currentStyle = listStyle[list.tagName][index];
                setListStyle(list,currentStyle);
                if(domUtils.isStartInblock(range)){
                    me.fireEvent('saveScene');
                    bk = range.createBookmark();
                    parentLi.insertBefore(list, li);
                    list.appendChild(li);
                    adjustList(list,list.tagName.toLowerCase(),currentStyle);
                    me.fireEvent('contentchange');
                    range.moveToBookmark(bk).select(true);
                    return true;
                }
            }else{
                me.fireEvent('saveScene');
                bk = range.createBookmark();
                for(var i= 0,closeList,parents = domUtils.findParents(li),ci;ci=parents[i++];){
                    if(domUtils.isTagNode(ci,'ol ul')){
                        closeList = ci;
                        break;
                    }
                }
                var current = li;
                if(bk.end){
                    while(current && !(domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING)){
                        if(checkLevel(current)){
                            current = domUtils.getNextDomNode(current,false,null,function(node){return node !== closeList});
                            continue;
                        }
                        var parentLi = current.parentNode,
                            list = me.document.createElement(parentLi.tagName),
                            index = utils.indexOf(listStyle[list.tagName], getStyle(parentLi)||domUtils.getComputedStyle(parentLi, 'list-style-type'));
                        var currentIndex = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
                        var currentStyle = listStyle[list.tagName][currentIndex];
                        setListStyle(list,currentStyle);
                        parentLi.insertBefore(list, current);
                        while(current && !(domUtils.getPosition(current, bk.end) & domUtils.POSITION_FOLLOWING)){
                            li = current.nextSibling;
                            list.appendChild(current);
                            if(!li || domUtils.isTagNode(li,'ol ul')){
                                if(li){
                                    while(li = li.firstChild){
                                        if(li.tagName == 'LI'){
                                            break;
                                        }
                                    }
                                }else{
                                    li = domUtils.getNextDomNode(current,false,null,function(node){return node !== closeList});
                                }
                                break;
                            }
                            current = li;
                        }
                        adjustList(list,list.tagName.toLowerCase(),currentStyle);
                        current = li;
                    }
                }
                me.fireEvent('contentchange');
                range.moveToBookmark(bk).select();
                return true;
            }
        }

    });

    me.commands['insertorderedlist'] =
    me.commands['insertunorderedlist'] = {
            execCommand:function (command, style) {

                if (!style) {
                    style = command.toLowerCase() == 'insertorderedlist' ? 'decimal' : 'disc';
                }
                var me = this,
                    range = this.selection.getRange(),
                    filterFn = function (node) {
                        return   node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !domUtils.isWhitespace(node);
                    },
                    tag = command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul',
                    frag = me.document.createDocumentFragment();
                //去掉是因为会出现选到末尾，导致adjustmentBoundary缩到ol/ul的位置
                //range.shrinkBoundary();//.adjustmentBoundary();
                range.adjustmentBoundary().shrinkBoundary();
                var bko = range.createBookmark(true),
                    start = domUtils.findParentByTagName(me.document.getElementById(bko.start), 'li'),
                    modifyStart = 0,
                    end = domUtils.findParentByTagName(me.document.getElementById(bko.end), 'li'),
                    modifyEnd = 0,
                    startParent, endParent,
                    list, tmp;

                if (start || end) {
                    start && (startParent = start.parentNode);
                    if (!bko.end) {
                        end = start;
                    }
                    end && (endParent = end.parentNode);

                    if (startParent === endParent) {
                        while (start !== end) {
                            tmp = start;
                            start = start.nextSibling;
                            if (!domUtils.isBlockElm(tmp.firstChild)) {
                                var p = me.document.createElement('p');
                                while (tmp.firstChild) {
                                    p.appendChild(tmp.firstChild);
                                }
                                tmp.appendChild(p);
                            }
                            frag.appendChild(tmp);
                        }
                        tmp = me.document.createElement('span');
                        startParent.insertBefore(tmp, end);
                        if (!domUtils.isBlockElm(end.firstChild)) {
                            p = me.document.createElement('p');
                            while (end.firstChild) {
                                p.appendChild(end.firstChild);
                            }
                            end.appendChild(p);
                        }
                        frag.appendChild(end);
                        domUtils.breakParent(tmp, startParent);
                        if (domUtils.isEmptyNode(tmp.previousSibling)) {
                            domUtils.remove(tmp.previousSibling);
                        }
                        if (domUtils.isEmptyNode(tmp.nextSibling)) {
                            domUtils.remove(tmp.nextSibling)
                        }
                        var nodeStyle = getStyle(startParent) || domUtils.getComputedStyle(startParent, 'list-style-type') || (command.toLowerCase() == 'insertorderedlist' ? 'decimal' : 'disc');
                        if (startParent.tagName.toLowerCase() == tag && nodeStyle == style) {
                            for (var i = 0, ci, tmpFrag = me.document.createDocumentFragment(); ci = frag.childNodes[i++];) {
                                if(domUtils.isTagNode(ci,'ol ul')){
                                    utils.each(domUtils.getElementsByTagName(ci,'li'),function(li){
                                        while(li.firstChild){
                                            tmpFrag.appendChild(li.firstChild);
                                        }

                                    });
                                }else{
                                    while (ci.firstChild) {
                                        tmpFrag.appendChild(ci.firstChild);
                                    }
                                }

                            }
                            tmp.parentNode.insertBefore(tmpFrag, tmp);
                        } else {
                            list = me.document.createElement(tag);
                            setListStyle(list,style);
                            list.appendChild(frag);
                            tmp.parentNode.insertBefore(list, tmp);
                        }

                        domUtils.remove(tmp);
                        list && adjustList(list, tag, style);
                        range.moveToBookmark(bko).select();
                        return;
                    }
                    //开始
                    if (start) {
                        while (start) {
                            tmp = start.nextSibling;
                            if (domUtils.isTagNode(start, 'ol ul')) {
                                frag.appendChild(start);
                            } else {
                                var tmpfrag = me.document.createDocumentFragment(),
                                    hasBlock = 0;
                                while (start.firstChild) {
                                    if (domUtils.isBlockElm(start.firstChild)) {
                                        hasBlock = 1;
                                    }
                                    tmpfrag.appendChild(start.firstChild);
                                }
                                if (!hasBlock) {
                                    var tmpP = me.document.createElement('p');
                                    tmpP.appendChild(tmpfrag);
                                    frag.appendChild(tmpP);
                                } else {
                                    frag.appendChild(tmpfrag);
                                }
                                domUtils.remove(start);
                            }

                            start = tmp;
                        }
                        startParent.parentNode.insertBefore(frag, startParent.nextSibling);
                        if (domUtils.isEmptyNode(startParent)) {
                            range.setStartBefore(startParent);
                            domUtils.remove(startParent);
                        } else {
                            range.setStartAfter(startParent);
                        }
                        modifyStart = 1;
                    }

                    if (end && domUtils.inDoc(endParent, me.document)) {
                        //结束
                        start = endParent.firstChild;
                        while (start && start !== end) {
                            tmp = start.nextSibling;
                            if (domUtils.isTagNode(start, 'ol ul')) {
                                frag.appendChild(start);
                            } else {
                                tmpfrag = me.document.createDocumentFragment();
                                hasBlock = 0;
                                while (start.firstChild) {
                                    if (domUtils.isBlockElm(start.firstChild)) {
                                        hasBlock = 1;
                                    }
                                    tmpfrag.appendChild(start.firstChild);
                                }
                                if (!hasBlock) {
                                    tmpP = me.document.createElement('p');
                                    tmpP.appendChild(tmpfrag);
                                    frag.appendChild(tmpP);
                                } else {
                                    frag.appendChild(tmpfrag);
                                }
                                domUtils.remove(start);
                            }
                            start = tmp;
                        }
                        var tmpDiv = domUtils.createElement(me.document, 'div', {
                            'tmpDiv':1
                        });
                        domUtils.moveChild(end, tmpDiv);

                        frag.appendChild(tmpDiv);
                        domUtils.remove(end);
                        endParent.parentNode.insertBefore(frag, endParent);
                        range.setEndBefore(endParent);
                        if (domUtils.isEmptyNode(endParent)) {
                            domUtils.remove(endParent);
                        }

                        modifyEnd = 1;
                    }


                }

                if (!modifyStart) {
                    range.setStartBefore(me.document.getElementById(bko.start));
                }
                if (bko.end && !modifyEnd) {
                    range.setEndAfter(me.document.getElementById(bko.end));
                }
                range.enlarge(true, function (node) {
                    return notExchange[node.tagName];
                });

                frag = me.document.createDocumentFragment();

                var bk = range.createBookmark(),
                    current = domUtils.getNextDomNode(bk.start, false, filterFn),
                    tmpRange = range.cloneRange(),
                    tmpNode,
                    block = domUtils.isBlockElm;

                while (current && current !== bk.end && (domUtils.getPosition(current, bk.end) & domUtils.POSITION_PRECEDING)) {

                    if (current.nodeType == 3 || dtd.li[current.tagName]) {
                        if (current.nodeType == 1 && dtd.$list[current.tagName]) {
                            while (current.firstChild) {
                                frag.appendChild(current.firstChild);
                            }
                            tmpNode = domUtils.getNextDomNode(current, false, filterFn);
                            domUtils.remove(current);
                            current = tmpNode;
                            continue;

                        }
                        tmpNode = current;
                        tmpRange.setStartBefore(current);

                        while (current && current !== bk.end && (!block(current) || domUtils.isBookmarkNode(current) )) {
                            tmpNode = current;
                            current = domUtils.getNextDomNode(current, false, null, function (node) {
                                return !notExchange[node.tagName];
                            });
                        }

                        if (current && block(current)) {
                            tmp = domUtils.getNextDomNode(tmpNode, false, filterFn);
                            if (tmp && domUtils.isBookmarkNode(tmp)) {
                                current = domUtils.getNextDomNode(tmp, false, filterFn);
                                tmpNode = tmp;
                            }
                        }
                        tmpRange.setEndAfter(tmpNode);

                        current = domUtils.getNextDomNode(tmpNode, false, filterFn);

                        var li = range.document.createElement('li');

                        li.appendChild(tmpRange.extractContents());
                        if(domUtils.isEmptyNode(li)){
                            var tmpNode = range.document.createElement('p');
                            while(li.firstChild){
                                tmpNode.appendChild(li.firstChild)
                            }
                            li.appendChild(tmpNode);
                        }
                        frag.appendChild(li);
                    } else {
                        current = domUtils.getNextDomNode(current, true, filterFn);
                    }
                }
                range.moveToBookmark(bk).collapse(true);
                list = me.document.createElement(tag);
                setListStyle(list,style);
                list.appendChild(frag);
                range.insertNode(list);
                //当前list上下看能否合并
                adjustList(list, tag, style,true);
                //去掉冗余的tmpDiv
                for (var i = 0, ci, tmpDivs = domUtils.getElementsByTagName(list, 'div'); ci = tmpDivs[i++];) {
                    if (ci.getAttribute('tmpDiv')) {
                        domUtils.remove(ci, true)
                    }
                }
                range.moveToBookmark(bko).select();

            },
            queryCommandState:function (command) {
                return domUtils.filterNodeList(this.selection.getStartElementPath(), command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul') ? 1 : 0;
            },
            queryCommandValue:function (command) {
                var node = domUtils.filterNodeList(this.selection.getStartElementPath(), command.toLowerCase() == 'insertorderedlist' ? 'ol' : 'ul');
                return node ? getStyle(node) || domUtils.getComputedStyle(node, 'list-style-type') : null;
            }
        };
};

