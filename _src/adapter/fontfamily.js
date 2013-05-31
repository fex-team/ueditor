
UE.registerUI('fontfamily', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字体',
                recordStack: [],
                mode: 'fontFamily',
                items: me.options.fontfamily
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