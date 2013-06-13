(function (){
    var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase,
        Breakline = baidu.editor.ui.Breakline = function (options){
            this.initOptions(options);
            this.initSeparator();
        };
    Breakline.prototype = {
        uiName: 'Breakline',
        initSeparator: function (){
            this.initUIBase();
        },
        getHtmlTpl: function (){
            return '<br/>';
        }
    };
    utils.inherits(Breakline, UIBase);

})();
