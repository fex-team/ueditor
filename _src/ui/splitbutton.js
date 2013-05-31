//splitbutton 类
///import button
UE.ui.define('splitbutton',{
    tpl :'<div class="splitbutton" <%if(title){%>data-original-title="<%=title%>"<%}%>><button class="btn"><%if(icon){%><i class="icon-<%=icon%>"></i><%}%><%if(text){%><%=text%><%}%></button>'+
            '<button class="btn dropdown-toggle" >'+
                '<span class="caret"><\/span>'+
            '</button>'+
        '</div>',
    default:{
        text:'',
        title:'',
        click:function(){}
    },
    init : function(options){
        var me = this;
        me.root( $($.parseTmpl(me.tpl,options)));
        me.root().find('button:first').click(function(evt){
            if(!me.disabled()){
                $.proxy(options.click,me)();
            }
        });
        return me;
    },
    wrapclick:function(fn,evt){
        if(!this.disabled()){
            $.proxy(fn,this,evt)()
        }
        return this;
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
    },
    mergeWith:function($obj){
        var me = this;
        me.data('$mergeObj',$obj);
        $obj.edui().data('$mergeObj',me.root());
        if(!$.contains(document.body,$obj[0])){
            $obj.appendTo(me.root());
        }
        me.root().on('click','.dropdown-toggle',function(){
            me.wrapclick(function(){
                $obj.edui().show();
            })
        });
        me.register('click',me.root().find('.dropdown-toggle'),function(evt){
            $obj.hide()
        });
    }
});