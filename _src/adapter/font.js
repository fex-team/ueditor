
UE.registerUI('font', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字体',
                recordStack: [],
                mode: 'font',
                items: me.options.fontfamily
            });

//        $fontCombobox.eduicombobox('selectItem', 4);

        return $fontCombobox.eduicombobox('box');

    }

);