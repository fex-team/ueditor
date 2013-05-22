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
    }
});