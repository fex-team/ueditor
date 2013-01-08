///import core
///commands 自动提交
///commandsName  autosubmit
///commandsTitle  自动提交
UE.commands['autosubmit'] = {
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