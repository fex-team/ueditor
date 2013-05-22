//toolbar 类
UE.ui.define('toolbar',{

    init : function(options){
        var me = this,
            btn = UE.ui.button(options),
            dropcont = options.cont ? UE.ui.popup(options) : UE.ui.dropmenu({'list':options.list});
        btn.on('click',function(evt){
            if(!btn.disabled()){
                if(!dropcont.root().parent().length){
                    btn.root().parent().append(dropcont.root())
                }
                me.show();
                evt.stopPropagation();
            }
        });

        this.root(btn.root());
        this.data('btn',btn).data('dropcont',dropcont);
        $(document).click(function(){
            me.hide()
        })
    },
    show:function(){
        var $dropcont = this.data('dropcont').root(),
            offset = this.root().position();
        $dropcont.css({
            'display':'block',
            'top':offset.top + this.root().outerHeight(),
            'left':offset.left
        })

    },
    hide : function(){
        var $dropcont = this.data('dropcont').root();
        $dropcont.css({
            'display':'none'
        })
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