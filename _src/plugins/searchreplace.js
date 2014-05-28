///import core
///commands 查找替换
///commandsName  SearchReplace
///commandsTitle  查询替换
///commandsDialog  dialogs\searchreplace
/**
 * @description 查找替换
 * @author zhanyi
 */

UE.plugin.register('searchreplace',function(){
    var me = this;

    var _blockElm = {'table':1,'tbody':1,'tr':1,'ol':1,'ul':1};

    function findTextInString(textContent,opt,currentIndex){
        var str = opt.searchStr;
        if(opt.dir == -1){
            textContent = textContent.split('').reverse().join('');
            str = str.split('').reverse().join('');
            currentIndex = textContent.length - currentIndex;

        }
        var reg = new RegExp(str,'g' + (opt.casesensitive ? '' : 'i')),match;

        while(match = reg.exec(textContent)){
            if(match.index >= currentIndex){
                return opt.dir == -1 ? textContent.length - match.index - opt.searchStr.length : match.index;
            }
        }
        return  -1
    }
    function findTextBlockElm(node,currentIndex,opt){
        var textContent,index,methodName = opt.all || opt.dir == 1 ? 'getNextDomNode' : 'getPreDomNode';
        if(domUtils.isBody(node)){
            node = node.firstChild;
        }
        var first = 1;
        while(node){
            textContent = node.nodeType == 3 ? node.nodeValue : node[browser.ie ? 'innerText' : 'textContent'];
            index = findTextInString(textContent,opt,currentIndex );
            first = 0;
            if(index!=-1){
                return {
                    'node':node,
                    'index':index
                }
            }
            node = domUtils[methodName](node);
            while(node && _blockElm[node.nodeName.toLowerCase()]){
                node = domUtils[methodName](node,true);
            }
            if(node){
                currentIndex = opt.dir == -1 ? (node.nodeType == 3 ? node.nodeValue : node[browser.ie ? 'innerText' : 'textContent']).length : 0;
            }

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

        rng.shrinkBoundary(true);

        //判断是不是第一次选中
        if(!rng.collapsed){
            rng.select();
            var rngText = me.selection.getText();
            if(new RegExp('^' + opt.searchStr + '$',(opt.casesensitive ? '' : 'i')).test(rngText)){
                if(opt.replaceStr != undefined){
                    replaceText(rng,opt.replaceStr);
                    rng.select();
                    return true;
                }else{
                    rng.collapse(opt.dir == -1)
                }

            }
        }


        rng.insertNode(span);
        rng.enlargeToBlockElm(true);
        startBlockNode = rng.startContainer;
        var currentIndex = startBlockNode[browser.ie ? 'innerText' : 'textContent'].indexOf('$$ueditor_searchreplace_key$$');
        rng.setStartBefore(span);
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
        }else{
            rng.setCursor()
        }

    }
    function replaceText(rng,str){

        str = me.document.createTextNode(str);
        rng.deleteContents().insertNode(str);

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
                            first = me.body.firstChild;
                        if(first && first.nodeType == 1){
                            rng.setStart(first,0);
                            rng.shrinkBoundary(true);
                        }else if(first.nodeType == 3){
                            rng.setStartBefore(first)
                        }
                        rng.collapse(true).select(true);
                        if(opt.replaceStr !== undefined){
                            me.fireEvent('saveScene');
                        }
                        while(searchReplace(this,opt)){
                            num++;
                        }
                        if(num){
                            me.fireEvent('saveScene');
                        }
                    }else{
                        if(opt.replaceStr !== undefined){
                            me.fireEvent('saveScene');
                        }
                        if(searchReplace(this,opt)){
                            num++
                        }
                        if(num){
                            me.fireEvent('saveScene');
                        }

                    }

                    return num;
                },
                notNeedUndo:1
            }
        }
    }
});