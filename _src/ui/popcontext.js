/**
 * User: matao01
 * Date: 12-9-27
 * Time: 下午1:46
 * To change this template use File | Settings | File Templates.
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        context = views.Context = function(items){
            var me = this,
                frag = document.createDocumentFragment(),
                html = '<iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: white;" frameborder="0" width="100%" height="100%" src="javascript:"></iframe>'+
                       '<div class="edui-shadow"></div>'+
                       '<ul id="{ID}-contextBody"></ul>';

            this.itemlist = [];
            var its = this.itemlist;
            for(var i= 0, tmp, view, len=items.length; i<len;){
                tmp = items[i++];
                if(its[its.length-1] === tmp) continue;
                its.push(tmp);
                if(tmp === '-'){
                    view = new views({viewType: 'menuseparator', viewHtmlTag: 'li'});
                }else{
                    view = new views({viewType: 'menuitem', viewHtmlTag: 'li', viewText:(tmp.submenu?'<span class="edui-arrow"></span>':'')+'<span class="edui-icon"></span><span class="edui-label">' + (tmp.label || '') + '</span>'});
                    view.addClass(tmp.className);
                    view.startReflectByMouse();

                    (function(t, v){
                        if(t.submenu){
                            v.addListener('mouseover', function(_, evt){
                                ! utils.isContains(v.dom, evt.fromElement||evt.target) && t.submenu.show(evt, v.dom);
                            });

                            v.addListener('mouseout', function(_, evt){
                                var sub = t.submenu,
                                    tar = evt.toElement||evt.relatedTarget;
                                if(sub){
                                    ! utils.isContains(v.dom, tar) && !utils.isContains(sub.dom, tar) && tar!=sub.dom && sub.dispose();
                                }
                            });
                        }else{
                            v.addListener('mouseover', function(_, evt){
                                var list = me.itemlist,
                                    len = list.length;

                                while(len--){
                                    list[len].submenu && list[len].submenu.dispose();
                                }
                            });

                        }
                    })(tmp, view);

                    view.addListener('mousedown', function(tmp){
                        return function(t, evt){
                            tmp.onclick && tmp.onclick.apply(me, arguments);
                            if(tmp.submenu){
                                utils.stopPropagation(evt);
                            }
                        }
                    }(tmp));

                }
                frag.appendChild(view.dom);
            }
            var me = this;
            this.addListener('render', function(){
                me.getInnerDom('contextBody').appendChild(frag);
            });

            this.init({viewText: html});
            this.addClass('edui-contextmenu');
        };

    context.prototype = {
        show: function(evt, node){
            var dom = this.dom,
                offset = utils.getViewportOffsetByEvent( evt);
            document.body.appendChild(dom);
            this.fireEvent('render');
            if(node ){
                var rect = node.getBoundingClientRect();
                offset.left=rect.left + node.offsetWidth - 10;
                offset.top=rect.top;
            }
            var vw = utils.getViewportRect().width,
                vh = utils.getViewportRect().height,
                left = offset.left,
                top = offset.top,
                ow = dom.clientWidth,
                oh = dom.clientHeight;

            if(left + ow>vw && left-ow>0){
                left = left-ow;
            }
            if(top + oh>vh && top-oh>0){
                top = top-oh;
            }

            dom.style.cssText = 'position:absolute;top:'+(top+utils.getScrollOffsetByDir('top') )+'px;left:'+(left+utils.getScrollOffsetByDir('left') )+'px;';


        },
        dispose: function(){
            var list = this.itemlist,
                len = list.length,
                parent = this.dom.parentElement;

            if(parent){
                parent.removeChild(this.dom);
                while(len--){
                    list[len].submenu && list[len].submenu.dispose();
                }
            }

        }
    };

    utils.inherits(context, views.Pop);
})(UE.ui);
