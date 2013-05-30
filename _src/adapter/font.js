
UE.registerUI('font', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字体',
                recordStack: [ 'Arial' ],
                items: [ '微软雅黑', 'Arial', '宋体' ]
            });

//        $fontCombobox.eduicombobox('selectItem', 4);

        return $fontCombobox.eduicombobox('box');

    }

);