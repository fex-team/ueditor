//button 类
UE.ui.define('button', {
    default: {
        text: '',
        title: '',
        icon: '',
        caret: false,
        click: function(){}
    },
    init: function (options) {
        var me = this;
        me.root($(templates['btn'].render(options))).click(function (evt) {
            me.wrapclick(options.click,evt)
        });
        return me;
    },
    wrapclick:function(fn,evt){
        if(!this.disabled()){
            this.root().trigger('wrapclick');
            $.proxy(fn,this,evt)()
        }
        return this;
    },
    label: function( text ){
        if( text === undefined ) {
            return this.root().find('.edui-button-label').text();
        } else {
            this.root().find('.edui-button-label').text( text );
            return this;
        }
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