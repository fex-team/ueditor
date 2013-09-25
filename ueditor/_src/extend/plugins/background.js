/**
 * 背景颜色
 * @function
 * @name baidu.editor.execCommands
 * @param {String} cmdName cmdName="background"插入注释
 */
UE.commands['background'] = {
    execCommand: function (cmd, color) {
    var me = this, bodyClassList = me.body.classList;
    for(var key in UE.singleBackground){
        bodyClassList.remove(UE.singleBackground[key]);
    }
    bodyClassList.add(UE.singleBackground[color]);
},
queryCommandValue: function () {
    for(var key in UE.singleBackground){
        if( domUtils.hasClass(this.body, UE.singleBackground[key])){
            return key;
        }
    }
    return null;
}

};