//popup 类
UE.ui.define('popup',{
    tpl:'<div class="dropdown-menu"><%=subtpl%></div>',
    mergeTpl:function(data){
        return $.parseTmpl(this.tpl,{subtpl:data});
    },
    show : function($obj,dir,fnname,topOffset,leftOffset){
        fnname = fnname || 'position';
        if(this.trigger('beforeshow') === false){
            return;
        }else{
            this.root().css($.extend({display:'block'},$obj ? {
                top : $obj[fnname]().top + ( dir == 'right' ? 0 : $obj.outerHeight()) - (topOffset || 0),
                left : $obj[fnname]().left + (dir == 'right' ?  $obj.outerWidth() : 0) -  (leftOffset || 0)
            }:{}))
        }
    },
    hide : function(){
        this.root().css('display','none');
    },
    attachTo : function($obj){
        var me = this
        if(!$obj.data('$mergeObj')){
            if(!$.contains(document.body,me.root()[0])){
                me.root().appendTo($obj);
            }
            $obj.data('$mergeObj',me.root());
            $obj.on('click',function(evt){
                me.show()
            });
            me.register('click',$obj,function(evt){
                me.hide()
            });
            me.data('$mergeObj',$obj)
        }
    }
});