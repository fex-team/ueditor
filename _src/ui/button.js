/**
 * @file
 * @name ui.View.Button
 * @import ui/ui.view.js
 * @desc 按钮的实现类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.Button
         * @grammar button = new ui.View.Button(cmd) //cmd-命令名
         */
    //修改后
    button = views.Button = function(){
        this.init.apply(this, arguments);
    };

    button.prototype = {
        init: function(cmd, opt){
            opt = opt || {};
            // viewText中的cmd实际上设置的是label
            this.makeDom({viewType:(opt.viewType||'button'), viewText:'<span class="button-content" id="{ID}-content">'+cmd+'</span>'} );
            this.addClass('edui-' + cmd);
            this.startReflectByMouse();
            this.setProxyListener('click');
        }
    };

    utils.inherits(button, views);

    views = button = null;
})(UE.ui);