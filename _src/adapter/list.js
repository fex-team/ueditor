UE.registerUI('insertorderedlist insertunorderedlist',
    function(name) {

        var me = this;
        var $btn = $.eduisplitbutton({
            icon : name,
            caret:true,
            click : function(){

                me.execCommand(name)
            }
        });
        var data = [];
        $.each(me.options[name],function(key,value){
            data.push({
                value : key,
                label:value
            })
        });

        var $dropmenu = $.eduidropmenu({'data':data});

        $btn.edui().mergeWith($dropmenu);

        this.addListener('selectionchange',function(){
            var state = this.queryCommandState(name,para);
            $btn.edui().disabled(state == -1).active(state == 1)
        });
        return $btn;
    }
);

