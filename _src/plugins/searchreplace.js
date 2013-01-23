///import core
///commands 查找替换
///commandsName  SearchReplace
///commandsTitle  查询替换
///commandsDialog  dialogs\searchreplace
/**
 * @description 查找替换
 * @author zhanyi
 */
UE.plugins['searchreplace'] = function(){

    var currentRange,
        first,
        me = this;
    me.addListener('reset',function(){
        currentRange = null;
        first = null;
    });
    me.commands['searchreplace'] = {
        execCommand : function(cmdName,opt){
            var me = this,
                sel = me.selection,
                range,
                nativeRange,
                num = 0,
                opt = utils.extend(opt,{
                    all : false,
                    casesensitive : false,
                    dir : 1
                },true);

            if(browser.ie){
                while(1){
                    var tmpRange;
                    nativeRange = me.document.selection.createRange();
                    tmpRange = nativeRange.duplicate();
                    tmpRange.moveToElementText(me.document.body);
                    if(opt.all){
                        first = 0;
                        opt.dir = 1;
                        if(currentRange){
                            tmpRange.setEndPoint(opt.dir == -1 ? 'EndToStart' : 'StartToEnd',currentRange);
                        }
                        tmpRange.moveToElementText(me.document.body);
                    }else{
                        tmpRange.setEndPoint(opt.dir == -1 ? 'EndToStart' : 'StartToEnd',nativeRange);
                        if(opt.hasOwnProperty("replaceStr")){
                            tmpRange.setEndPoint(opt.dir == -1 ? 'StartToEnd' : 'EndToStart',nativeRange);
                        }
                    }
                    nativeRange = tmpRange.duplicate();



                    if(!tmpRange.findText(opt.searchStr,opt.dir,opt.casesensitive ? 4 : 0)){
                        currentRange = null;
                        tmpRange = me.document.selection.createRange();
                        tmpRange.scrollIntoView();
                        return num;
                    }
                    tmpRange.select();
                    //替换
                    if(opt.hasOwnProperty("replaceStr")){
                        range = sel.getRange();
                        range.deleteContents().insertNode(range.document.createTextNode(opt.replaceStr)).select();
                        currentRange = sel.getNative().createRange();

                    }
                    num++;
                    if(!opt.all){
                        break;
                    }
                }
            }else{
                var w = me.window,nativeSel = sel.getNative(),tmpRange;
                while(1){
                    if(opt.all){
                        if(currentRange){
                            currentRange.collapse(false);
                            nativeRange = currentRange;
                        }else{
                            nativeRange  = me.document.createRange();
                        }
                        nativeRange.setStart(me.document.body,0);
                        nativeRange.collapse(true);
                        nativeSel.removeAllRanges();
                        nativeSel.addRange( nativeRange );
                        first = 0;
                        opt.dir = 1;
                    }else{
                        //safari弹出层，原生已经找不到range了，所以需要先选回来，再取原生
                        if(browser.safari){
                            me.selection.getRange().select();

                        }
                        nativeRange = w.getSelection().getRangeAt(0);



                        if(opt.hasOwnProperty("replaceStr")){
                            nativeRange.collapse(opt.dir == 1 ? true : false);
                        }
                    }

                    //如果是第一次并且海选中了内容那就要清除，为find做准备

                    if(!first){
                        nativeRange.collapse( opt.dir <0 ? true : false);
                        nativeSel.removeAllRanges();
                        nativeSel.addRange( nativeRange );
                    }else{
                        nativeSel.removeAllRanges();
                    }

                    if(!w.find(opt.searchStr,opt.casesensitive,opt.dir < 0 ? true : false) ) {
                        currentRange = null;
                        nativeSel.removeAllRanges();
                        return num;
                    }
                    first = 0;
                    range = w.getSelection().getRangeAt(0);
                    if(!range.collapsed){

                        if(opt.hasOwnProperty("replaceStr")){
                            range.deleteContents();
                            var text = w.document.createTextNode(opt.replaceStr);
                            range.insertNode(text);
                            range.selectNode(text);
                            nativeSel.addRange(range);
                            currentRange = range.cloneRange();
                        }
                    }
                    num++;
                    if(!opt.all){
                        break;
                    }
                }

            }
            return true;
        }
    };

};