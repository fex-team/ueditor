/**
 * @file
 * @name ui.View.Toolbar
 * @import ui/ui.view.js
 * 工具条Toolbar实现类，负责添加工具
 */
(function(ue){
    var ui = ue.ui,
        utils = ui.Utils,
        views = ui.View,
        toolbar = views.Toolbar = function(ownerui, obj){
            obj = obj || {};
            this.ownerui = ownerui;
            this.makeDom({viewType: (obj.viewType||'toolbar'), viewHtmlTag: obj.viewHtmlTag||'div'});
        };
    toolbar.prototype = {
        addTool:function(opt){
            this.toollist = opt;
            for(var i= 0,tool;tool=this.toollist[i++];){
                var tmp;
                if(utils.isObject(tool)){
                    //obj
                }else if(utils.isArray(tool)){
                    //array
                    var group = new views.Group(this.ownerui,{
                        group:tool
                    });
                    tmp = group;

                }else if(utils.isString(tool)){
                    //string
                    tmp = this.ownerui.getButton(tool);
                }
            }
            this.appendChild(tmp)
        },
        addElement:function(obj){
            if(obj instanceof views.TabToolbar){
                //tabtoolbar
            }else if(obj instanceof views.Group){
                //group
            }else{
                //item
            }
        },
        getElement:function(){

        },
        removeElement:function(){

        }
    };
    utils.inherits(toolbar, views);
})(UE);
