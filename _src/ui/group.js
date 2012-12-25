(function(ue){
    var ui = ue.ui,
            utils = ui.Utils,
            views = ui.View,
    group = views.Group = function(ownerui, obj){
        obj = obj || {};
        this.ownerui = ownerui;
        this.makeDom({viewType: (obj.viewType||'group'), viewHtmlTag: obj.viewHtmlTag||'div'});
        this.addGroup(obj.group);
    }
    group.prototype = {
        btnlist : [],
        addGroup:function(obj){
            var tmp;
            debugger
            for(var i= 0,item;item=obj[i++];){
                if(utils.isArray(item)){

                }else{
                    tmp = this.ownerui.getButton(item);
                }
                this.btnlist.push(tmp);
                this.appendChild(tmp);
            }

        }

    }
    utils.inherits(group,views);
})(UE);