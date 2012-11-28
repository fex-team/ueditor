///import core
///import plugins\inserthtml.js
///commands 特殊字符
///commandsName  Spechars
///commandsTitle  特殊字符
///commandsDialog  dialogs\spechars\spechars.html
UE.commands['spechars'] = {
    queryCommandState : function(){
        return this.highlight ? -1 :0;
    }
};
