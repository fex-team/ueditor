//popup 类
UE.ui.define('popup',{
    tpl:'<div class="dropdown-menu"><%=subtpl%></div>',
    mergeTpl:function(data){
        return $.parseTmpl(this.tpl,{subtpl:data});
    },
    show : function($obj){
        this.root().css($.extend({display:'block'},$obj ? {
            top : $obj.offset().top + $obj.outerHeight(),
            left : $obj.offset().left
        }:{}))
    },
    hide : function(){
        this.root().css('display','none');
    },
    attachTo : function($obj){
        var me = this;
        if(!$obj.data('popup')){
            if(!$.contains(document.body,me.root()[0])){
                me.root().appendTo(document.body);
            }
            $obj.data('popup',me.root());
            $obj.on('click',function(evt){
                if($obj.trigger('beforeclick') === false){
                    return;
                }
                me.show($obj)
            });
            me.register('click',$obj,function(evt){
                me.hide()
            })
        }
    }
});