/**
 * @file
 * @name ui.View.Dialog
 * @import ui/ui.view.pop.js
 * @desc 对话框类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.Dialog
         * @grammar dlg = new ui.View.Dialog(ui, cmd)// ui实例，cmd-命令名
         */
        dlg = views.Dialog = function(ui){
            this.ui = ui;
            this.zindex = (this.ui.getEditorOptions('zIndex') || 1) + 10;
        };
    dlg.prototype = {
        init: function(){
            var me = this,
                    ui = this.ui;
            this.addListener('render', function(){
                var titlebar = me.getInnerDom('titlebar'),
                    closebtn = me.getInnerDom('closeBtn');
                utils.on(titlebar, 'mousedown', function(evt){
                    var rect;
                    utils.startDrag(evt, {
                        ondragstart: function (){
                            rect = utils.getClientRect(me.dom);
                            me.getInnerDom('contmask').style.visibility = 'visible';
                        },
                        ondragmove: function (x, y){
                            var left = rect.left + x;
                            var top = rect.top + y;
                            me.safeSetOffset({
                                left: left,
                                top: top
                            });
                        },
                        ondragstop: function (){
                            me.getInnerDom('contmask').style.visibility = 'hidden';
                        }
                    });
                });

                utils.on(closebtn, 'click', function(){
                    me.close();
                });

                var ok = ui.getLang( "ok"),
                    cancel = ui.getLang("cancel"),
                    okBtn = me.confirmBtn = new views({viewType: 'dialog-confirm', viewText:ok}),
                    noBtn = me.cancelBtn = new views({viewType:'dialog-cancel', viewText:cancel}),
                    ftbar = me.getInnerDom('footbar');

                okBtn.startReflectByMouse();
                okBtn.setProxyListener('click');
                okBtn.addListener('click', function(){
                    if(okBtn.state===0){
                        me.fireEvent('ok');
                        me.close();
                    }
                });

                noBtn.startReflectByMouse();
                noBtn.setProxyListener('click');
                noBtn.addListener('click', function(){
                    me.fireEvent('cancel');
                    me.close();
                });

                ftbar.appendChild(okBtn.dom);
                ftbar.appendChild(noBtn.dom);
            });
            var html = '<div class="edui-dialog-shadow"></div>' +
                    '<div class="edui-dialog-wrap"><a id="{ID}-closeBtn" class="edui-dialog-closebutton">close</a><div id="{ID}-titlebar" class="edui-dialog-titlebar"></div>' +
                    '<div class="edui-dialog-content"><div id="{ID}-contmask" style="cursor: move;visibility: hidden;position: absolute;width: 100%;height: 100%;opacity: 0;filter: alpha(opacity=0);"></div>' +
                        '<iframe width="100%" height="100%" id="{ID}-iframe" frameborder="0"></iframe></div>' +
                    '<div class="edui-dialog-footbar" id="{ID}-footbar"></div></div>';
            this.makeDom({viewText: html, viewType: 'dialog'});
            !utils.ie && (this.dom.style.position='fixed');
        },
        getMask: function(){
            var mask;
            return function(){
                if(!mask){
                    mask = new views({viewType: 'dialog-mask', viewHtmlTag: 'div'});
                    !utils.ie && (mask.dom.style.position='fixed');
                    mask.dom.style.zIndex = this.zindex-1;
                }
                return mask;
            };
        }(),

        /**
         * @name open
         * @grammar dialog.open()
         * @desc 对话框打开
         */
        open: function(cmd){
            var me = this;
            utils.unLinster(this);
            this.destroy();
            me.cmd = cmd || "";
            this.init();
            views.prototype.show.call(this);
            this.dom.style.zIndex = this.zindex;
            this.fireEvent('render');
            utils.on(window, 'resize', function(){
                var timer;
                return function(){
                    timer && clearTimeout(timer);
                    timer = setTimeout(function(){me.updateRect2Win()}, 50);
                }
            }());
            utils.ie && utils.on(window, 'scroll', function(){
                var timer;
                return function(){
                    timer && clearTimeout(timer);
                    timer = setTimeout(function(){me.updateRect2Win()}, 50);
                }
            }());
            this.className = 'edui-for-'+me.cmd;
            this.setClass('edui-dialog edui-dialog-'+me.cmd);
            this.getInnerDom('titlebar').innerHTML = this.ui.getDialogTitleByCmd(me.cmd);
            this.getInnerDom('iframe').src = this.ui.getIframeUrlByCmd(me.cmd);
            this.getMask().show();
            me.updateRect2Win();
            me.fireEvent('open');
        },

        /**
         * @name close
         * @grammar dialog.close()
         * @desc 对话框关闭
         */
        close: function(){
            this.getMask().hide();
            this.hide();
            this.fireEvent('close');
            var dom = this.dom,
                style = dom.style;
            style.marginLeft = -(dom.offsetWidth + dom.offsetLeft) + 'px';
        },

        /**
         * @name submitDisabled
         * @grammar dialog.submitDisabled([true, false]) //设置对话框的提交按钮是否可用
         */
        submitDisabled: function(disable){
            var okbtn = this.confirmBtn,
                state = disable?-1:0;
            okbtn.state = state;
            okbtn.reflectState(state);
        },

        updateRect2Win: function(){
            var m = this.getMask().dom,
                d = this.dom,
                viewportEl = utils.getViewportElement(),
                w = window.innerWidth || viewportEl.clientWidth ,
                h = window.innerHeight || viewportEl.clientHeight ;
            m.style.width = w+'px';
            m.style.height = h+'px';
            d.style.left = Math.round((w - d.offsetWidth)/2) + 'px';
            d.style.top = Math.round((h - d.offsetHeight)/2) + 'px';
        },

        safeSetOffset: function (offset){
            var el = this.dom,
                vpRect = utils.getViewportRect(),
                rect = utils.getClientRect(el),
                left = offset.left;

            if (left + rect.width > vpRect.right) {
                left = vpRect.right - rect.width;
            }

            var top = offset.top;
            if (top + rect.height > vpRect.bottom) {
                top = vpRect.bottom - rect.height;
            }
            el.style.left = Math.max(left, 0) + 'px';
            el.style.top = Math.max(top, 0) + 'px';
        }
    };
    utils.inherits(dlg, views);
})(UE.ui);
