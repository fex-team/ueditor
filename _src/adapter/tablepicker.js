UE.registerUI('inserttable',
    function(name) {
        var me = this;
        var $btn = $.eduibutton({
            icon : 'bold',
            click : function(){

                var btn = this;

                tablePickerWidget = btn.root().data( 'tablepicker' );

                if( !tablePickerWidget ) {
                    tablePickerWidget = $.eduitablepicker({
                        mode: 'button'
                    }).eduitablepicker( "attachTo", btn.root() ).on('select', function( evt, row, col ){
                            alert( row + ' , ' + col )
                    }).edui();
                    btn.root().data( 'tablepicker', tablePickerWidget );
                }

                tablePickerWidget.show();

            }
        });
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState();
            $btn.disabled(state == -1).active(state == 1)
        });

        return $btn;
    }
);