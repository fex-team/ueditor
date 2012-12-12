///import core
///commands 选区路径
///commandsName  ElementPath,elementPathEnabled
///commandsTitle  选区路径
/**
 * 选区路径
 * @function
 * @name baidu.editor.execCommand
 * @param {String}     cmdName     elementpath选区路径
 */
UE.plugins['elementpath'] = function(){

    var currentLevel,
        tagNames,
        me = this;
    me.setOpt('elementPathEnabled',true);
    if(!me.options.elementPathEnabled){
        return;
    }
    me.commands['elementpath'] = {
        execCommand : function( cmdName, level ) {
            var start = tagNames[level],
                range = me.selection.getRange();
            me.currentSelectedArr && domUtils.clearSelectedArr(me.currentSelectedArr);
            currentLevel = level*1;
            if(dtd.$tableContent[start.tagName]){
                switch (start.tagName){
                    case 'TD':me.currentSelectedArr = [start];
                            start.className = me.options.selectedTdClass;
                            break;
                    case 'TR':
                        var cells = start.cells;
                        for(var i=0,ti;ti=cells[i++];){
                            me.currentSelectedArr.push(ti);
                            ti.className = me.options.selectedTdClass;
                        }
                        break;
                    case 'TABLE':
                    case 'TBODY':

                        var rows = start.rows;
                        for(var i=0,ri;ri=rows[i++];){
                            cells = ri.cells;
                            for(var j=0,tj;tj=cells[j++];){
                                 me.currentSelectedArr.push(tj);
                                tj.className = me.options.selectedTdClass;
                            }
                        }

                }
                start = me.currentSelectedArr[0];
                if(domUtils.isEmptyNode(start)){
                    range.setStart(start,0).setCursor();
                }else{
                   range.selectNodeContents(start).select();
                }
            }else{
                range.selectNode(start).select();

            }
        },
        queryCommandValue : function() {
            //产生一个副本，不能修改原来的startElementPath;
            var parents = [].concat(this.selection.getStartElementPath()).reverse(),
                names = [];
            tagNames = parents;
            for(var i=0,ci;ci=parents[i];i++){
                if(ci.nodeType == 3) {
                    continue;
                }
                var name = ci.tagName.toLowerCase();
                if(name == 'img' && ci.getAttribute('anchorname')){
                    name = 'anchor';
                }
                names[i] = name;
                if(currentLevel == i){
                   currentLevel = -1;
                    break;
                }
            }
            return names;
        }
    };
};

