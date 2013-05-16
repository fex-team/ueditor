//splitbutton 类
UE.ui.define('splitbutton',{
    tpl :'<div class="btn-group"><button class="btn">{{text}}</button>'+
            '<button class="btn splitbutton" data-original-title="{{tooltip}}">'+
                '<span class="caret"><\/span>'+
            '</button>'+
        '</div>',
    init : function(options){
        var html = utils.parseTmpl(this.tpl,options);
        this.root($(html));
        if(options.list){
            var me = this;
            me.data('dropmenu',UE.ui.dropmenu({'list':options.list}));
            me.root().append(me.data('dropmenu').root());
            me.root().find('.splitbutton').click(function(evt){
                me.toggle();
                evt.stopPropagation();
            })
        }
        $(document).click(function(){
            me.toggle(false)
        })
    },
    toggle:function(remove){
        this.root().toggleClass('open',remove)
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