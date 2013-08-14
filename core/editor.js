function Editor(id,wt,ht){
    var me=this;
    me.init(id,wt,ht);
}
Editor.prototype={
    init:function(id,wt,ht){
        var paper=Raphael(id,wt,ht);
    }
};