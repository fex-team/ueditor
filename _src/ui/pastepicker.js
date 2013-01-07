///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Stateful = baidu.editor.ui.Stateful,
        uiUtils= baidu.editor.ui.uiUtils,
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
                '<div class="edui-richtxticon edui-icon" title="'+this.editor.getLang("pasteSourceFormat")+'" onclick="$$.format(false)" stateful></div>'+
                '<div class="edui-tagicon edui-icon" title="'+this.editor.getLang("tagFormat")+'" onclick="$$.format(2)" stateful></div>' +
                '<div class="edui-plaintxticon edui-icon" title="'+this.editor.getLang("pasteTextFormat")+'" onclick="$$.format(true)" stateful></div>' +
                '</div>' +
                '</div>'
        },
        getStateDom: function (){
            return this.target;
        },
        format:function(param){
            this.editor.ui._isTransfer=true;
            this.editor.fireEvent('pasteTransfer',param);
        },
        _onClick: function (cur){
            var node=domUtils.getNextDomNode(cur),
                screenHt = uiUtils.getViewportRect().height,
                subPop=uiUtils.getClientRect(node);

            if(/hidden/ig.test(domUtils.getComputedStyle(node,"visibility"))){
                if((subPop.top+subPop.height)>screenHt)
                    node.style.top=(-subPop.height-cur.offsetHeight)+"px";
                else
                    node.style.top="";

                node.style.visibility="visible";
                domUtils.addClass(cur,"edui-state-opened");
            }else{
                node.style.visibility="hidden";
                domUtils.removeClasses(cur,"edui-state-opened")
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(PastePicker, UIBase);
    utils.extend(PastePicker.prototype, Stateful,true);
})();




