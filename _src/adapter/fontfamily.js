
UE.registerUI('fontfamily', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字体',
                recordStack: [],
                mode: 'fontFamily',
                items: me.options.fontfamily
            }).eduicombobox('on', 'comboboxselect', function( evt, res ){
                    me.execCommand( name, res.value );
            }),
            $btn = $fontCombobox.eduicombobox('box');

        //querycommand
        this.addListener('selectionchange',function(){

            //设置按钮状态
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //设置当前字体
            var fontFamily = this.queryCommandValue( name );

            fontFamily = fontFamily.replace(/^\s*['|"]|['|"]\s*$/g, '');

            $fontCombobox.eduicombobox( 'selectItemByLabel', fontFamily.split(/['|"]?\s*,\s*[\1]?/) );

        });

        return $btn;

    }

);