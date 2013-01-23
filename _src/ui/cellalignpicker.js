///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var CellAlignPicker = baidu.editor.ui.CellAlignPicker = function (options) {
        this.initOptions(options);
        this.initCellAlignPicker();
    };
    CellAlignPicker.prototype = {
        initCellAlignPicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            return '<div id="##" class="edui-cellalignpicker %%">' +
                '<div class="edui-cellalignpicker-body">' +
                '<table onclick="$$._onClick(event);">' +
                '<tr><td index="0" stateful><div class="edui-icon edui-left"></div></td>' +
                '<td index="1" stateful><div class="edui-icon edui-center"></div></td>' +
                '<td index="2" stateful><div class="edui-icon edui-right"></div></td>' +
                '</tr>' +
                '<tr><td index="3" stateful><div class="edui-icon edui-left"></div></td>' +
                '<td index="4" stateful><div class="edui-icon edui-center"></div></td>' +
                '<td index="5" stateful><div class="edui-icon edui-right"></div></td>' +
                '</tr>' +
                '<tr><td index="6" stateful><div class="edui-icon edui-left"></div></td>' +
                '<td index="7" stateful><div class="edui-icon edui-center"></div></td>' +
                '<td index="8" stateful><div class="edui-icon edui-right"></div></td>' +
                '</tr>' +
                '</table>' +
                '</div>' +
                '</div>';
        },
        getStateDom: function (){
            return this.target;
        },
        _onClick: function (evt){
            var target= evt.target || evt.srcElement;
            if(/icon/.test(target.className)){
                this.items[target.parentNode.getAttribute("index")].onclick();
                Popup.postHide(evt);
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(CellAlignPicker, UIBase);
    utils.extend(CellAlignPicker.prototype, Stateful,true);
})();



