//splitbutton 类
UE.ui.define('splitbutton',{
    tmpl :'<div class="btn-group"><button class="btn"><%=text%></button>'+
            '<button class="btn splitbutton dropdown-toggle" <%if(tooltip){%>data-original-title="<%=tooltip%>"<%}%>>'+
                '<span class="caret"><\/span>'+
            '</button>'+
        '</div>',
    default:{
        text:'',
        tooltip:'',
        btnclick:function(){},
        menuclick:function(){}

    },
    init : function(options){
        var me = this;
        me.root( $($.parseTmpl(this.tmpl,options)));
        if(options.data){

            me.data('dropmenu',$.dropmenu({'data':options.data,click:options.menuclick}));
            me.root().append(me.data('dropmenu'));
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