/**
 * @file
 * @name ui.View.Pop
 * @import ui/ui.view.js
 * @desc 弹出框类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        pop = views.Pop = function(opt){
            this.init(opt);
//            this.init.apply(this, arguments);
        };

    pop.prototype = {
        init: function(opt){
            opt = opt || {};
            opt.viewType = opt.viewType || 'popup';
            opt.viewHtmlTag = opt.viewHtmlTag || 'div';
            this.makeDom(opt);
        },

        /**
         * @name show
         * @grammar pop.show(tar) //pop显示在tar元素的下方
         */
        show: function(tar){
            var me = this,
                once = this.once,
                dom = this.dom,
                css = dom.style.cssText,
                rect = utils.getClientRect(tar),
                x = rect.left + utils.getScrollOffsetByDir('left'),
                y = rect.top + tar.offsetHeight + utils.getScrollOffsetByDir('top');

            dom.style.cssText = css.replace(/;$/, '') + ';position:absolute;left:'+x+'px;top:'+y+'px;';

            if(!once){
                document.body.appendChild(dom);
                utils.on(window, 'scroll', function(){
                    var timer;
                    return function(){
                        timer && window.clearTimeout(timer);
                        me.hide();
                        timer = setTimeout(function(){
                            var rect = tar.getBoundingClientRect();

                            dom.style.left = rect.left + utils.getScrollOffsetByDir('left') + 'px';
                            dom.style.top = rect.top + tar.offsetHeight + utils.getScrollOffsetByDir('top') + 'px';
                        }, 50);
                    }
                }());

                utils.on(document.body, 'mousedown', function(e){
                    var parent = me.submenu,//如果有父级菜单，则父级不隐藏
                        tar = e.target || e.srcElement;
                    if(!utils.isContains(dom, tar) ){
                        (!parent || !utils.isContains(parent.dom, tar) ) && me.hide();
                    }
                });
                this.fireEvent('render');
                this.once = 1;
            }
            dom.style.display = 'block';
            this.fireEvent('open');
        }
    };

    utils.inherits(pop, views);
    pop = null;
})(UE.ui);

