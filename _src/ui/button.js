//button 类
UE.ui.define('button',{
    tpl : '<button class="btn" type="button"><i class="icon-{{icon}}"></i>{{text}}</button>',
    init : function(options){
        var html = utils.parseTmpl(this.tpl,options);
        this.root($(html));
    },
    disabled : function(state){
        this.root().toggleClass('disabled',state);
        return this;
    },
    active:function(state){
        this.root().toggleClass('active',state);
        return this;
    }
});