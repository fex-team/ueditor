///import core
///commandsName  attachment
///commandsTitle  附件上传
UE.commands["attachment"] = {
    queryCommandState:function(){
        return this.highlight ? -1 :0;
    }
};