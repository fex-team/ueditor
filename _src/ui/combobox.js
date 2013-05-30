/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var widgetName = 'combobox';

    UE.ui.define( widgetName, ( function(){

        return {
            tpl: function(){
                return '<ul class="dropdown-menu edui-combobox-menu" role="menu" aria-labelledby="dropdownMenu"><li><a href="#"><em><i class="icon-ok"></i></em>没什么</a></li></ul>';
            },
            init: function( options ){

                var me = this;

                var btnWidget = $.eduibutton({
                    caret: true,
                    text: '正常文本',
                    click: $.proxy( me.open, me )
                });

                me.root( $( $.parseTmpl( me.tpl(options), options ) ) );

                me.attachTo( btnWidget );

                this.data( 'box', btnWidget );

            },
            getbox: function(){
                return this.data( 'box' );
            },
            open: function(){
                this.show();
            }
        };

    } )(), 'menu' );

})();