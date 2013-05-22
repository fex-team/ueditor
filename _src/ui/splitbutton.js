//splitbutton 类
///import button
UE.ui.define('splitbutton',{
    tpl :'<div class="btn-group"><button class="btn"><%=text%></button>'+
            '<button class="btn splitbutton dropdown-toggle" <%if(tooltip){%>data-original-title="<%=tooltip%>"<%}%>>'+
                '<span class="caret"><\/span>'+
            '</button>'+
        '</div>',
    default:{
        text:'',
        tooltip:'',
        click:function(){}
    },
    init : function(options){
        var me = this;
        me.root( $($.parseTmpl(me.tpl,options)));
        me.root().first().click(function(evt){
            if(!me.disabled()){
                if(evt.target === evt.target.parentNode.firstChild){
                    $.proxy(options.click,me)();
                    var $dropmenu = $(this).data('dropmenu');
                    setTimeout(function(){
                        $dropmenu && $dropmenu.dropmenu('hide')
                    })
                }

            }
        })

    },
    disabled : function(state){
        if(state === undefined){
            return this.root().hasClass('disabled')
        }
        this.root().toggleClass('disabled',state).find('.btn').toggleClass('disabled',state);
        return this;
    },
    active:function(state){
        if(state === undefined){
            return this.root().hasClass('active')
        }
        this.root().toggleClass('active',state).find('.btn:first').toggleClass('active',state);
        return this;
    }
});