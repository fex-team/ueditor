
UE.registerUI('fontsize', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字号',
                autorecord: false,
                mode: 'fontsize',
                items: me.options.fontsize
            }),
            $btn = $fontCombobox.eduicombobox('box').eduicombobox('on', 'comboboxselect', function(evt, res) {

                me.execCommand( name, res.value + 'px' );

            });

        //querycommand
        this.addListener('selectionchange',function(){

            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //值反射
            var fontSize = this.queryCommandValue( name );

            $fontCombobox.eduicombobox( 'selectItemByLabel', fontSize.replace('px', '') );

        });

        return $btn;

    }

);