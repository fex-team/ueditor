//button 类
UE.ui.define('button',{
    tpl :  '<button class="btn" >' +
        '<% if(icon) {%><i class="icon-<%=icon%>"></i><% }; %><%=text%>'+
        '<% if(caret) {%><span class="caret"></span><% };%></button>',
    default:{
        text:'',
        icon:'',
        caret:false,
        click:function(){}
    },
    init : function(options){
        var me = this;
        me.root($($.parseTmpl(me.tpl,options))).click(function(evt){
            !me.disabled() && $.proxy(options.click,me,evt)()
        });
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