/*tooltip 类*/
UE.ui.define('tooltip', {
    tpl: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    default: {
    },
    init: function (options) {
        var me=this;
        me.root($($.parseTmpl(me.tpl, options||{})));
    },
    enter:function(){
    },
    leave:function(){

    },
    setContent:function(){

    },
    hasContent:function(){

    },
    getTitle:function(){

    },
    show:function(){

    },
    hide:function(){

    },
    attachTo:function($obj){
        var me = this;
        if (!$obj.data('tooltip')) {
            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo(document.body);
            }
            $obj.data('tooltip', me.root());
            $obj.on('mouseenter',  $.proxy(this.enter, this))
                .on('mouseleave', $.proxy(this.leave, this));
        }
    }
});
