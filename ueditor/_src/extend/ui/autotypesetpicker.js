///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase;

    var AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker = function (options) {
        this.initOptions(options);
        this.initAutoTypeSetPicker();
    };
    AutoTypeSetPicker.prototype = {
        initAutoTypeSetPicker:function () {
            this.initUIBase();
        },
        getHtmlTpl:function () {
            var me = this.editor,
                opt = me.options.autotypeset,
                lang = me.getLang("autoTypeSet");

            return '<div id="##" class="edui-autotypesetpicker %%">' +
                '<div class="edui-autotypesetpicker-body">' +
                '<table >' +
                '<tr><td nowrap><input type="checkbox" name="removeEmptyline" ' + (opt["removeEmptyline"] ? "checked" : "" ) + '>' + lang.delLine + '</td></td><td nowrap><input type="checkbox" name="indent" ' + (opt["indent"] ? "checked" : "" ) + '>' + lang.indent + '</td></tr>' +
                '<tr><td nowrap><input type="checkbox" name="trimSpace" ' + (opt["trimSpace"] ? "checked" : "" ) + '>' + lang.trimSpace + '</td></tr>' +
                '<tr><td nowrap colspan="2" align="right"><button >' + lang.run + '</button></td></tr>' +
                '</table>' +
                '</div>' +
                '</div>';


        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(AutoTypeSetPicker, UIBase);
})();
