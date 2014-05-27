///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        uiUtils = baidu.editor.ui.uiUtils,
        domUtils = baidu.editor.dom.domUtils,
        UIBase = baidu.editor.ui.UIBase,
        Message = baidu.editor.ui.Message = function (options){
            this.initOptions(options);
            this.initMessage();
        };

    Message.prototype = {
        initMessage: function (){
            this.initUIBase();
        },
        getHtmlTpl: function (){
            return '<div id="##" class="edui-message %%">' +
            ' <div id="##_closer" class="edui-message-closer">×</div>' +
            ' <div id="##_body" class="edui-message-body edui-message-type-info">' +
            ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
            ' <div class="edui-shadow"></div>' +
            ' <div id="##_title" class="edui-message-title">' +
            '  </div>' +
            ' </div>' +
            '</div>';
        },
        reset: function(opt){
            var me = this;
            if (!opt.keepshow) {
                clearTimeout(this.timer);
                me.timer = setTimeout(function(){
                    me.hide();
                }, opt.timeout || 4000);
            }

            opt.title !== undefined && me.setTitle(opt.title);
            opt.type !== undefined && me.setType(opt.type);

            me.show();
        },
        postRender: function(){
            var me = this,
                closer = this.getDom('closer');
            closer && domUtils.on(closer, 'click', function(){
                me.hide();
            });
        },
        setTitle: function(title){
            this.getDom('title').innerHTML = title;
        },
        setType: function(type){
            type = type || 'info';
            var body = this.getDom('body');
            body.className = body.className.replace(/edui-message-type-[\w-]+/, 'edui-message-type-' + type);
        },
        getTitle: function(){
            return this.getDom('title').innerHTML;
        },
        getType: function(){
            var arr = this.getDom('body').match(/edui-message-type-([\w-]+)/);
            return arr ? arr[1]:'';
        },
        show: function (){
            this.getDom().style.display = 'block';
        },
        hide: function (){
            this.getDom().style.display = 'none';
        }
    };

    utils.inherits(Message, UIBase);

})();
