//button 类
UE.ui.define('button', {
    tpl: '<button class="btn" <% if(title) {%> data-original-title="<%=title%>" <%};%>> ' +
        '<% if(icon) {%><i class="icon-<%=icon%>"></i><% }; %><%=text%>' +
        '<% if(caret) {%><span class="caret"></span><% };%></button>',
    default: {
        text: '',
        title: '',
        icon: '',
        caret: false,
        click: function(){}
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options))).click(function (evt) {
            me.wrapclick(options.click,evt)
        });
        return me;
    },
    wrapclick:function(fn,evt){
        if(!this.disabled()){
            $.proxy(fn,this,evt)()
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('disabled')
        }
        this.root().toggleClass('disabled', state);
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('active')
        }
        this.root().toggleClass('active', state);
        return this;
    },
    mergeWith:function($obj){
        var me = this;
        me.data('$mergeObj',$obj);
        $obj.edui().data('$mergeObj',me.root());
        if(!$.contains(document.body,$obj[0])){
            $obj.appendTo(me.root());
        }
        me.on('click',function(){
            me.wrapclick(function(){
                $obj.edui().show();
            })
        }).register('click',me.root(),function(evt){
            $obj.hide()
        });
    }
});