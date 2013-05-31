
UE.registerUI('fontsize', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字号',
                recordStack: [],
                mode: 'fontsize',
                items: me.options.fontsize
            }),
            $btn = $fontCombobox.eduicombobox('box');

        //querycommand
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );
        });

        return $btn;

    }

);