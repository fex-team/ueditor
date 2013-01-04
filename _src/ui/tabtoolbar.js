(function(ue){
    var ui = ue.ui,
            utils = ui.Utils,
            views = ui.View,
            group = views.Group,
    tabtoolbar = views.TabToolbar = function(ownerui, obj){
        obj = obj || {};
        this.ownerui = ownerui;
        this.groupList = [];
        this.handle = this.ownerui.toolbar.tabhandle;
        this.makeDom({viewType: (obj.viewType||'tabtoolbar'), viewHtmlTag: obj.viewHtmlTag||'div'});
        this.addTab(obj.tab);
    }
    tabtoolbar.prototype = {
        addTab:function(tab){
            var me =this;
            //创建tab并且绑定事件
            this.tab = new views({viewType: 'tab', viewText: tab.tab, unselectable: true});
            this.handle.appendChild(this.tab);
            this.tab.setProxyListener("click");
            this.tab.addListener("click",function(t,evt){
                if(tab.onclick){
                    tab.onclick.call(this);
                    return;
                }
                me.ownerui.toolbar.fireEvent("toggletab");
                me.show();
            });
            //创建tabbody
            if(utils.isArray(tab.tools)){
                this.tabbody = new views({viewType: 'tabbody', unselectable: true,viewHtmlTag:'div'});
                for(var i= 0;i<tab.tools.length;i++){
                    this.addGroup(tab.tools[i]);
                }
                this.ownerui.toolbar.appendChild(this.tabbody);
            }
            tab.active?this.show():this.hide();
        },
        hide:function(){
            utils.removeClasses(this.tab.dom,"current");
            this.tabbody.dom.style.display = "none";
        },
        show:function(){
            utils.removeClasses(this.tab.dom,"current");
            utils.addClass(this.tab.dom,"current");
            this.tabbody.dom.style.display = "";
            this.ownerui.toolbar.currentTab = this;
        },
        addGroup:function(obj,index){
            var tmp;
            if(utils.isArray(obj)){
                tmp =new views.Group(this.ownerui,{
                    group:obj
                });
            }else if(obj instanceof views.Group){
                tmp = obj;
            }else{
                return tmp;
            }
            if(index>=0&&index<this.groupList.length){
                var item = this.groupList[index];
                item.dom.parentNode.insertBefore(tmp.dom,item.dom);
                this.groupList.splice(index,0,tmp);
                return tmp;
            }
            this.groupList.push(tmp);
            this.tabbody.appendChild(tmp);
            return tmp;
        },
        removeGroup:function(index){
            if(index>=0&&index<this.groupList.length){
                var item = this.groupList[index];
                utils.remove(item.dom);
                this.groupList.splice(index,1);
            }
        },
        replaceGroup:function(group,index){
            if(index>=0&&index<this.groupList.length&&group){
                this.removeGroup(index);
                this.addGroup(group,index);
            }
        },
        getGroup:function(index){
            if(index>=0&&index<this.groupList.length){
                return this.groupList[index||0];
            }
            return null;
        }
    }
    utils.inherits(tabtoolbar,group);
})(UE);