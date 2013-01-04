(function(ue){
    var ui = ue.ui,
            utils = ui.Utils,
            views = ui.View,
    group = views.Group = function(ownerui, obj){
        obj = obj || {};
        this.itemList = [];
        this.ownerui = ownerui;
        this.makeDom({viewType: (obj.viewType||'group'), viewHtmlTag: obj.viewHtmlTag||'div'});
        this.initItems(obj.group);
    }
    group.prototype = {
        initItems:function(obj){
            for(var i= 0;i<obj.length;i++){
                var item = obj[i];
                this.addItem(item);
            }
        },
        addItem:function(obj,index){
            var tmp;
            if(utils.isString(obj)){
                tmp = this.ownerui.getButton(obj);
            }else if(obj instanceof views.Button){
                tmp = obj;
            }else{
                return tmp;
            }
            if(index>=0&&index<this.itemList.length){
                var item = this.itemList[index];
                item.dom.parentNode.insertBefore(tmp.dom,item.dom);
                this.itemList.splice(index,0,tmp);
                return tmp;
            }
            this.itemList.push(tmp);
            this.appendChild(tmp);
            //给最后一个item增加last样式，补充右边框
            this.setLast();
            return tmp;
        },
        removeItem:function(index){
            if(index>=0&&index<this.itemList.length){
                var item = this.itemList[index];
                utils.remove(item.dom);
                this.itemList.splice(index,1);
            }
        },
        replaceItem:function(item,index){
            if(index>=0&&index<this.itemList.length&&item){
                this.removeItem(index);
                this.addItem(item,index);
            }
        },
        setLast : function(){
            for(var i= 0,item;item=this.itemList[i++];){
                utils.removeClasses(item.dom,"last");
            }
            utils.addClass(this.itemList[this.itemList.length-1].dom,"last");
        },
        getItem:function(index){
            if(index>=0&&index<this.itemList.length){
                return this.itemList[index||0];
            }
            return null;
        }
    }
    utils.inherits(group,views);
})(UE);