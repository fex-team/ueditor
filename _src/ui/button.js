//button 类
UE.ui.define('button',{
    tpl : '<button class="btn" type="button"><i class="{{className}}"></i>{{text}}</button>',
    init : function(options){
        var html = utils.parseTmpl(this.tpl,options);
        this.root($(html));

    },
    enable : function(){

    },
    active:function(){

    }

});