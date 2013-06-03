///import core
///commands 打印
///commandsName  Print
///commandsTitle  打印
/**
 * @description 打印
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     print打印编辑器内容
 * @author zhanyi
 */
UE.plugins['print'] = function(){
    var me = this;
    me.commands['print'] = {
        execCommand : function(){
            this.window.print();
        },
        notNeedUndo : 1
    };
    //快捷键
    me.addshortcutkey({
        "print" : "ctrl+" //手动提交
    });
};