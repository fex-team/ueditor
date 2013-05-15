//button 类
UE.ui.define('button',{
    tpl : '<button class="btn" type="button"><i class="icon-{{icon}}"></i>{{text}}</button>',
    init : function(options){
        var html = utils.parseTmpl(this.tpl,options);
        this.root($(html));
        if(options.click){
            var me = this;
            me.root().click(function(evt){
                if(!me.disabled()){
                    options.click.apply(me,evt)
                }
            })
        }
    },
    disabled : function(state){
        if(state === undefined){
            return this.root().hasClass('disabled')
        }
        this.root().toggleClass('disabled',state);
        return this;
    },
    active:function(state){
        if(state === undefined){
            return this.root().hasClass('active')
        }
        this.root().toggleClass('active',state);
        return this;
    }
});