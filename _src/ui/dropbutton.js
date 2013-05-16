//splitbutton 类
UE.ui.define('dropbutton',{

    init : function(options){
        var me = this,
            btn = UE.ui.button(options),
            dropmenu = UE.ui.dropmenu({'list':options.list});
        btn.on('click',function(evt){
            if(!btn.disabled()){
                me.show();
                evt.stopPropagation();
            }
        });

        this.root(btn.root());
        this.data('btn',btn).data('dropmenu',dropmenu);
        $(document).click(function(){
            me.hide()
        })
    },
    show:function(){
        var $dropmenu = this.data('dropmenu').root(),
            offset = this.root().position();
        $dropmenu.css({
            'display':'block',
            'top':offset.top + this.root().outerHeight(),
            'left':offset.left
        })

    },
    hide : function(){
        var $dropmenu = this.data('dropmenu').root();
        $dropmenu.css({
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