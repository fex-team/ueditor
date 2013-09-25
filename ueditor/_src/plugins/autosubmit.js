///import core
///commands 自动提交
///commandsName  autosubmit
///commandsTitle  自动提交
UE.plugins['autosubmit'] = function(){
    var me = this;
    me.commands['autosubmit'] = {
        execCommand:function () {
            var me=this,
                form = domUtils.findParentByTagName(me.iframe,"form", false);
            if (form)    {
                if(me.fireEvent("beforesubmit")===false){
                    return;
                }
                me.sync();
                form.submit();
            }
        }
    };
    //快捷键
    me.addshortcutkey({
        "autosubmit" : "ctrl+13" //手动提交
    });
};
