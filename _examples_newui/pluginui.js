//未获得编辑器实例之前添加按钮
UE.pluginui['getcontent'] = function () {
    var me = this;
    var btn = new UE.ui.View.Button("getcontent");
    btn.addListener('click', function () {
        me.execCommand("bold")
    });
    me.addItem(btn,{
        tabnum : 2,
        groupnum : 1,
        indexnum : 1
    });
}