///import core
///import uicore
///import ui/colorpicker.js
///import ui/popup.js
///import ui/splitbutton.js
(function (){
    var utils = baidu.editor.utils,
        uiUtils = baidu.editor.ui.uiUtils,
        ColorPicker = baidu.editor.ui.ColorPicker,
        Popup = baidu.editor.ui.Popup,
        SplitButton = baidu.editor.ui.SplitButton,
        ColorButton = baidu.editor.ui.ColorButton = function (options){
            this.initOptions(options);
            this.initColorButton();
        };
    ColorButton.prototype = {
        initColorButton: function (){
            var me = this;
            this.popup = new Popup({
                content: new ColorPicker({
                    noColorText: me.editor.getLang("clearColor"),
                    editor:me.editor,
                    onpickcolor: function (t, color){
                        me._onPickColor(color);
                    },
                    onpicknocolor: function (t, color){
                        me._onPickNoColor(color);
                    },
                    onchangeheight:function(){
                        var color = this.getPreview().style.backgroundColor,
                            popbody = me.popup.getDom("body");
                        domUtils.setStyle(popbody,"height",me.popup.getDom("content").offsetHeight+"px");
                        me.setColor(color);
                    }
                }),
                editor:me.editor,
                onhide:function(){
                    this.content.toggleAdv(1);
                }
            });
            this.initSplitButton();
        },
        _SplitButton_postRender: SplitButton.prototype.postRender,
        postRender: function (){
            this._SplitButton_postRender();
            this.getDom('button_body').appendChild(
                uiUtils.createElementByHtml('<div id="' + this.id + '_colorlump" class="edui-colorlump"></div>')
                );
            this.getDom().className += ' edui-colorbutton';
        },
        setColor: function (color){
            this.getDom('colorlump').style.backgroundColor = color;
            this.color = color;
        },
        _onPickColor: function (color){
            if (this.fireEvent('pickcolor', color) !== false) {
                this.setColor(color);
                this.popup.hide();
            }
        },
        _onPickNoColor: function (color){
            if (this.fireEvent('picknocolor') !== false) {
                this.popup.hide();
            }
        }
    };
    utils.inherits(ColorButton, SplitButton);

})();
