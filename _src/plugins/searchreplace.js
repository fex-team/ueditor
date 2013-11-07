///import core
///commands 查找替换
///commandsName  SearchReplace
///commandsTitle  查询替换
///commandsDialog  dialogs\searchreplace
/*
 * @description 查找替换
 * @author zhanyi
 */

UE.plugin.register('searchreplace',function(){
    var first = 1,
        me = this;
    function findTextInString(textContent,opt,currentIndex){
        var reg = new RegExp(opt.searchStr,'g' + (opt.casesensitive ? '' : 'i')),
            indexArr = [],match;
        while(match = reg.exec(textContent)){
            indexArr.push(match.index);
            if(currentIndex !== null){
                if(opt.dir == 1 && match.index >= currentIndex || opt.dir == -1 && match.index <= currentIndex - opt.searchStr.length){
                    return match.index;
                }
            }
        }
        return  !indexArr.length || currentIndex != null ? -1 :
                opt.dir == -1 ? indexArr[indexArr.length-1] : indexArr[0];
    }
    function findTextBlockElm(node,currentIndex,opt){
        var textContent,index,methodName = opt.all || opt.dir == 1 ? 'getNextDomNode' : 'getPreDomNode';
        if(domUtils.isBody(node)){
            node = node.firstChild;
        }
        var first = 1;
        while(node){
            textContent = node.nodeType == 3 ? node.nodeValue : node[browser.ie ? 'innerText' : 'textContent'];
            index = findTextInString(textContent,opt,first ? currentIndex : null );
            first = 0;
            if(index!=-1){
                return {
                    'node':node,
                    'index':index
                }
            }
            node = domUtils[methodName](node);
        }
    }
    function findNTextInBlockElm(node,index,str){
        var currentIndex = 0,
            currentNode = node.firstChild,
            currentNodeLength = 0,
            result;
        while(currentNode){
            if(currentNode.nodeType == 3){
                currentNodeLength = currentNode.nodeValue.replace(/(^[\t\r\n]+)|([\t\r\n]+$)/,'').length;
                currentIndex += currentNodeLength;
                if(currentIndex >= index){
                    return {
                        'node':currentNode,
                        'index': currentNodeLength - (currentIndex - index)
                    }
                }
            }else if(!dtd.$empty[currentNode.tagName]){
                currentNodeLength = currentNode[browser.ie ? 'innerText' : 'textContent'].replace(/(^[\t\r\n]+)|([\t\r\n]+$)/,'').length
                currentIndex += currentNodeLength;
                if(currentIndex >= index){
                    result = findNTextInBlockElm(currentNode,currentNodeLength - (currentIndex - index),str);
                    if(result){
                        return result;
                    }
                }
            }
            currentNode = domUtils.getNextDomNode(currentNode);
        }
    }

    function searchReplace(me,opt){
        var rng = me.selection.getRange(),
            startBlockNode,
            searchStr = opt.searchStr,
            span = me.document.createElement('span');
        span.innerHTML = '$$ueditor_searchreplace_key$$';

        //判断是不是第一次选中
        rng.select();
        var rngText = me.selection.getText();
        if(new RegExp('^' + opt.searchStr + '$',(opt.casesensitive ? '' : 'i')).test(rngText)){
            rng.collapse(opt.dir == -1)
        }

        rng.insertNode(span);
        rng.enlargeToBlockElm(true);
        startBlockNode = rng.startContainer;
        var currentIndex = startBlockNode[browser.ie ? 'innerText' : 'textContent'].indexOf('$$ueditor_searchreplace_key$$');
        domUtils.remove(span);
        var result = findTextBlockElm(startBlockNode,currentIndex,opt);
        if(result){
            var rngStart = findNTextInBlockElm(result.node,result.index,searchStr);
            var rngEnd = findNTextInBlockElm(result.node,result.index + searchStr.length,searchStr);
            rng.setStart(rngStart.node,rngStart.index).setEnd(rngEnd.node,rngEnd.index);

            if(opt.replaceStr !== undefined){
                replaceText(rng,opt.replaceStr)
            }
            rng.select();
            return true;
        }

    }
    function replaceText(rng,str){
        str = me.document.createTextNode(str);
        rng.deleteContents().insertNode(str)
    }
    return {
        commands:{
            'searchreplace':{
                execCommand:function(cmdName,opt){
                    utils.extend(opt,{
                        all : false,
                        casesensitive : false,
                        dir : 1
                    },true);
                    var num = 0;
                    if(opt.all){
                        var rng = me.selection.getRange(),
                            first = me.body.firstChild
                        if(first && first.nodeType == 1){
                            rng.setStart(first,0)
                        }else if(first.nodType == 3){
                            rng.setStartBefore(first)
                        }
                        rng.collapse(true).select(true);

                        while(searchReplace(this,opt)){
                            num++;
                        }
                    }else{
                        if(searchReplace(this,opt)){
                            num++
                        }
                    }

                    return num;
                }
            }
        }
    }
});