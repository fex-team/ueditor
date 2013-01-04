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
        tabtoolbar = views.TabToolbar,
        toolbar = views.Toolbar = function(ownerui, obj){
            obj = obj || {};
            this.ownerui = ownerui;
            this.itemList = [];
            this.groupList = [];
            this.tabList = [];
            this.makeDom({viewType: (obj.viewType||'toolbar'), viewHtmlTag: obj.viewHtmlTag||'div'});
        };
    toolbar.prototype = {
        //当需要tabtoolbar的时候，先创建一个展示标题的地方
        initTab:function(){
            this.tabhandle = new views({viewType: 'tabhandle', unselectable: true,viewHtmlTag:'div'});
            this.appendChild(this.tabhandle);
            this.setProxyListener('toggletab');
            this.addListener("toggletab",function(t,evt){
                this.currentTab.hide();
            })
        },
        addTool:function(opt){
            this.toollist = opt;
            for(var i= 0;i<this.toollist.length;i++){
                var tool = this.toollist[i],tmp;
                if(utils.isObject(tool)){
                    //obj
                    if(this.tabList.length==0){
                        this.initTab();
                    }
                    this.addTabToolbar(tool);
                }else if(utils.isArray(tool)){
                    //array
                    this.appendChild(this.addGroup(tool));
//                    this.tabbody.appendChild(this.addGroup(tool))
                }else if(utils.isString(tool)){
                    //string
                    this.addItem(tool);
                }
            }
        },
        addTabToolbar:function(tool,index){
            var tmp;
            if(tool instanceof views.TabToolbar){
                tmp = tool;
            }else if(utils.isObject(tool)){
                tmp = new views.TabToolbar(this.ownerui,{
                    tab:tool
                });
            }else{
                return tmp;
            }
            if(index>=0&&index<this.tabList.length){
                var item = this.tabList[index];
                item.dom.parentNode.insertBefore(tmp.dom,item.dom);
                this.tabList.splice(index,0,tmp);
                return tmp;
            }
            this.tabList.push(tmp);
            return tmp;
        },
        removeTabToolbar:function(index){
            if(index>=0&&index<this.tabList.length){
                var item = this.tabList[index];
                if(this.tabList.length != 1){
                    utils.remove(item.tab.dom);
                    utils.remove(item.tabbody.dom);
                    this.tabList[index+1].show();
                    this.tabList.splice(index,1);
                }else{
                    alert("最后一个tab不能删")
                }
            }
        },
        replaceTabToolbar:function(tabtoolbar,index){
            if(index>=0&&index<this.tabList.length&&tabtoolbar){
                this.removeTabToolbar(index);
                this.addTabToolbar(tabtoolbar,index);
            }
        },
        getTabToolbar:function(index){
            if(index>=0&&index<this.tabList.length){
                return this.tabList[index||0];
            }
            return null;
        }
    };
    utils.inherits(toolbar, tabtoolbar);
})(UE);
