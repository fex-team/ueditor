///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var PastePicker = baidu.editor.ui.PastePicker = function (options) {
        this.initOptions(options);
        this.initPastePicker();
    };
    PastePicker.prototype = {
        initPastePicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            return '<div class="edui-pasteicon" onclick="$$._onClick(this)"></div>' +
                '<div class="edui-pastecontainer">' +
                '<div class="edui-title">'+this.editor.getLang("pasteOpt")+'</div>'+
                '<div class="edui-button">' +
                '<div class="edui-richtxticon" title="'+this.editor.getLang("pasteSourceFormat")+'" onclick="$$.format(false)" stateful></div>'+
                '<div class="edui-plaintxticon" title="'+this.editor.getLang("pasteTextFormat")+'" onclick="$$.format(true)" stateful></div>' +
                '</div>' +
                '</div>'
        },
        getStateDom: function (){
            return this.target;
        },
        format:function(isTransfer){
            this.editor.fireEvent('pasteTransfer',isTransfer)
        },
        _onClick: function (obj){
            var tmp=domUtils.getNextDomNode(obj);
            if(/none/ig.test(domUtils.getComputedStyle(tmp,"display"))){
                tmp.style.display="block";
                domUtils.addClass(obj,"edui-state-opened")
            }else{
                tmp.style.display="none";
                domUtils.removeClasses(obj,"edui-state-opened")
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(PastePicker, UIBase);
    utils.extend(PastePicker.prototype, Stateful,true);
})();




