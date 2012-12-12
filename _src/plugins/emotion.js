///import core
///import plugins\image.js
///commands 插入表情
///commandsName  Emotion
///commandsTitle  表情
///commandsDialog  dialogs\emotion\emotion.html
UE.commands['emotion'] = {
    queryCommandState : function(){
        return this.highlight ? -1 :0;
    }
};
