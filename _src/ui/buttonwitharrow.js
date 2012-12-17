/**
 * @file
 * @name ui.View.ArrowButton
 * @import ui/ui.view.button.js
 * @desc 带箭头的按钮
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.ArrowButton
         * @grammar btn = new ui.View.ArrowButton(ui, cmd)//ui实例，cmd-命令名
         */
        arrowbtn = views.ArrowButton = function(cmd, opt){
            opt = opt || {viewType: 'arrowbutton'};
            this.init(cmd, opt);
            this.appendChild( this.arrow = new views({'viewType':'arrow'}) );
            var arrow = this.arrow,
                me = this;
            arrow.setProxyListener('click');
            arrow.startReflectByMouse();
            arrow.addListener('click', function(t, e){
                utils.stopPropagation(e);
                me.fireEvent("open");
            });
        };
    utils.inherits(arrowbtn, views.Button);
    arrowbtn = null;
})(UE.ui);
