/**
 * 全屏标记
 * @function
 * @name baidu.editor.execCommands
 * @param {String} cmdName cmdName="fullscreenmark"插入注释
 */
UE.commands['fullscreenmark'] = {
    execCommand: function (cmdName, value) {
        var me = this,
            tags = [ 'p', 'h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ],
            fClass = UE.FULLSCREENMARK_FLAG;
        var range = me.selection.getRange(),
            start = domUtils.findParentByTagName( range.startContainer, tags, true);

        if( !start ) {
            return;
        }

        var queryState = me.queryCommandState(cmdName);
        travel(range, function(node){
            var classList = node.classList;
            if(!queryState) {
                classList.add(fClass);
            } else {
                classList.remove(fClass);
            }
        })

        function travel(range, callback){
            var current = domUtils.findParentByTagName( range.startContainer, tags, true);

            if(range.collapsed){
                callback(current);
            }else{
                while (current && domUtils.getPosition(range.endContainer,current)&domUtils.POSITION_FOLLOWING ) {
                    callback(current);
                    next = domUtils.getNextDomNode(current, true, function (node) {
                        return node.nodeType == 1;
                    });
                    current = next;
                }

            }
        }
        return true;
    },
    queryCommandState: function (cmdName) {
        var me = this,
            tags = [ 'p', 'h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ],
            fClass = UE.FULLSCREENMARK_FLAG,
            start = domUtils.findParentByTagName( me.selection.getStart(), tags, true);
        if(start && domUtils.hasClass(start, fClass) ){
            return 1;
        }
        return  0;
    }
};