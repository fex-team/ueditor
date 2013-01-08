///import core
///commandsName  attachment
///commandsTitle  附件上传
///commandsDialog  dialogs\attachment
UE.commands["attachment"] = {
    queryCommandState:function(){
        return this.highlight ? -1 :0;
    }
};