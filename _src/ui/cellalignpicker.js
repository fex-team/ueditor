///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var AlignCellPicker = baidu.editor.ui.AlignCellPicker = function (options) {
        this.initOptions(options);
        this.initAlignCellPicker();
    };
    AlignCellPicker.prototype = {
        initAlignCellPicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            var items=this.items;
            return '<div id="##" class="edui-aligncellpicker %%">' +
                '<div class="edui-aligncellpicker-body">' +
                '<table onclick="$$._onClick(event);">' +
                '<tr><td index="0" stateful>'+items[0].label+'</td><td index="1" stateful>'+items[1].label+'</td><td index="2" stateful>'+items[2].label+'</td></tr>' +
                '<tr><td index="3" stateful>'+items[3].label+'</td><td index="4" stateful>'+items[4].label+'</td><td index="5" stateful>'+items[5].label+'</td></tr>' +
                '<tr><td index="6" stateful>'+items[6].label+'</td><td index="7" stateful>'+items[7].label+'</td><td index="8" stateful>'+items[8].label+'</td></tr>' +
                '</table>' +
                '</div>' +
                '</div>';
        },
        getStateDom: function (){
            return this.target;
        },
        _onClick: function (evt){
            var target= evt.target || evt.srcElement;
            if(target.tagName.toLowerCase()=="td"){
                this.items[target.getAttribute("index")].onclick();
                Popup.postHide();
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(AlignCellPicker, UIBase);
    utils.extend(AlignCellPicker.prototype, Stateful,true);
})();



