//button 类
UE.ui.define('button',{
    tpl : '<button class="btn" ><i class="icon-{{icon}}"></i>{{text}}</button>',
    init : function(options){
        this.root($('<button class="btn" ></button>'));
        if(options.icon){
            this.root().append($('<i class="icon-'+options.icon+'"></i>'))
        }
        if(options.text){
            this.root().append(options.text)
        }
        if(options.caret){
            this.root().append($('<span class="caret"></span>'))
        }

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