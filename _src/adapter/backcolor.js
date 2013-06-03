UE.registerUI('backcolor',
    function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

//            updateColor( this.queryCommandValue( name ) );

        });

        $btn = $.eduisplitbutton({
            icon: 'font',
            caret: true,
            click: function() {
                me.execCommand( name, getCurrentColor() );
            }
        });

        fontIcon = $btn.find(".icon-font");

        colorPickerWidget = $.eduicolorpicker({
            lang_clearColor: me.getLang('clearColor') || '',
            lang_themeColor: me.getLang('themeColor') || '',
            lang_standardColor: me.getLang('standardColor') || ''
        }).eduitablepicker( "attachTo", $btn ).edui().on('pickcolor', function( evt, color ){
        });

        $btn.edui().mergeWith( colorPickerWidget.root() );

        return $btn;

        function getCurrentColor() {
            return domUtils.getComputedStyle( fontIcon[0], 'color' );
        }

    }

);