UE.registerUI('forecolor',
    function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange',function(){

            //更新按钮状态
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //更新颜色
            fontIcon.css( "color", this.queryCommandValue( name ) );


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
            fontIcon.css("color", color);
            me.execCommand( name, color );
        });

        $btn.edui().mergeWith( colorPickerWidget.root() );

        return $btn;

        function getCurrentColor() {
            return domUtils.getComputedStyle( fontIcon[0], 'color' );
        }

    }

);