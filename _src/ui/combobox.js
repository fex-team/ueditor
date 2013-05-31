/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function(){

    var widgetName = 'combobox',
        itemClassName = 'edui-combobox-item',
        stackItemClassName = 'edui-combobox-stack-item';

    UE.ui.define( widgetName, ( function(){

        return {
            tpl: function( options ){

                return  '<ul class="dropdown-menu edui-combobox-menu" role="menu" aria-labelledby="dropdownMenu">' +
                        '<%for( var i=0, len=recordStack.length; i<len; i++ ){%>' +
                        '<li class="' + stackItemClassName + '" style="<%=itemStyles[i]%>" data-stack-item-index="<%=mapping[recordStack[i]]%>"><a href="#"><em class="edui-combobox-checkbox"><i class="icon-ok"></i></em><span class="edui-combobox-label"><%=recordStack[i]%></span></a></li>' +
                        '<%}%>' +
                        '<%if(recordStack.length){%>' +
                        '<li class="divider edui-combobox-stack-separator"></li>' +
                        '<%} else {%>' +
                        '<li class="divider edui-combobox-stack-separator edui-common-dis-none"></li>' +
                        '<%}%>' +
                        '<%for( var i=0, len=items.length; i<len; i++){%>' +
                        '<li class="' + itemClassName + '" style="<%=itemStyles[i]%>" data-item-index="<%=i%>"><a href="#"><em class="edui-combobox-checkbox"><i class="icon-ok"></i></em><span class="edui-combobox-label"><%=items[i]%></span></a></li>' +
                        '<%}%>' +
                        '</ul>';

            },
            default: {
                //按钮初始文字
                label: '',
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
                itemCount: 0,
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function( options ){

                var me = this;

                var btnWidget = $.eduibutton({
                    caret: true,
                    text: options.label,
                    click: $.proxy( me.open, me )
                });

                //参数适配转换一下
                optionAdaptation( options );

                options.itemCount = options.items.length;

                $.extend( options, createItemMapping( options.recordStack, options.items ) );

                me.root( $( $.parseTmpl( me.tpl(options), options ) ) );

                me.attachTo( btnWidget );

                this.data( 'options', options );
                this.data( 'box', btnWidget );

                this.initEvent();

            },
            box: function(){
                return this.data( 'box' );
            },
            open: function(){
                this.show();
            },
            close: function(){
                this.hide();
            },
            initEvent: function(){

                var me = this;

                this.root().delegate('li', 'click', function(){

                    var $li = $(this),
                        index = $li.hasClass( itemClassName ) ? $li.attr('data-item-index') : $li.attr('data-stack-item-index');

                    me.selectItem( index );
                    me.close();

                    return false;

                });

            },
            selectItem: function( index ){

                var itemCount = this.data('options').itemCount,
                    currentItem = null,
                    selector = null;

                if( itemCount == 0 ) {
                    return null;
                }

                if( index < 0 ) {

                    index = itemCount + index % itemCount;

                } else if ( index >= itemCount ) {

                    index = itemCount-1;

                }

                selector = '.'+itemClassName+':eq('+ index +')';

                currentItem = this.root().find( selector );

                if( currentItem.length ) {

                    //更改按钮标签内容
                    this.box().eduibutton('label', currentItem.find(".edui-combobox-label").text() );
                    this.selectByItemNode( currentItem[0] );

                }

                return currentItem[0];

                return null;

            },
            selectByItemNode: function( itemNode ){

                if( !itemNode ) {
                    return null;
                }

                var $itemNode = $(itemNode);

                this.root().find('.edui-combobox-checked').removeClass('edui-combobox-checked');
                $itemNode.find('.edui-combobox-checkbox').addClass('edui-combobox-checked');

                if( this.data('options').autoRecord ) {
                    selectRecordItem.call( this, itemNode );
                }

                return itemNode;

            },
            //更新记录区域
            updaterecordArea: function(){

                var $recordItems = this.root().find('.'+stackItemClassName);

                if( $recordItems.length > this.data('options').recordCount ) {

                    for( var i = $recordItems.length - 1, len = this.data('options').recordCount; i >= len; i-- ) {
                        $( $recordItems.get( i ) ).remove();
                    }

                }

            }
        };

        function optionAdaptation( options ) {

            switch( options.mode ) {
                case 'fontFamily':
                    //字体参数适配
                    fontAdaptation( options );
                    break;

            }

            return options;

        }

        function fontAdaptation( options ) {

            var fontFamily = options.items,
                temp = null,
                tempItems = [];

            options.itemStyles = [];

            for( var i = 0, len = fontFamily.length; i < len; i++ ) {

                temp = fontFamily[ i ].val;
                tempItems.push( temp.split(/\s*,\s*/)[0] );
                options.itemStyles.push('font-family: ' + temp);

            }

            options.items = tempItems;

        }

        function createItemMapping( stackItem, items ) {

            var temp = {},
                result = {
                    recordStack: [],
                    mapping: {}
                };

            $.each( items, function( index, item ){
                temp[ item ] = index;
            } );

            $.each( stackItem, function( index, item ){

                if( temp[ item ] !== undefined ) {
                    result.recordStack.push( item );
                    result.mapping[ item ] = temp[ item ];
                }

            } );

            return result;

        }

        function showStackSeparator() {

            this.root().find(".edui-combobox-stack-separator").removeClass("edui-common-dis-none");

        }

        function selectRecordItem( itemNode ) {

            var index = $(itemNode).attr('data-item-index'),
                me = this,
                $stackItem = null,
                selector = null;

            if( !$.isNumeric( index ) ) {
                return null;
            }

            showStackSeparator.call( this );

            selector = '.' + stackItemClassName + '[data-stack-item-index="'+ index +'"]';

            $stackItem = this.root().find( selector );

            if( $stackItem.length ) {

                $stackItem.insertBefore( $stackItem.parent().children()[0] );
                $stackItem.find('.edui-combobox-checkbox').addClass('edui-combobox-checked');

            } else {

                var stackItemTpl = '<li class="' + stackItemClassName + '" style="'+ itemNode.style.cssText +'" data-stack-item-index="<%=recordStackIndex%>"><a href="#"><em class="edui-combobox-checkbox edui-combobox-checked"><i class="icon-ok"></i></em><span class="edui-combobox-label"><%=recordStackLabel%></span></a></li>';
                    $newStackItem = $( $.parseTmpl( stackItemTpl , {
                        recordStackIndex: index,
                        recordStackLabel: me.data('options').items[ index ]
                    } ) );

                $newStackItem.insertBefore( this.root().children().first() );

                this.updaterecordArea();

            }

            return null;

        }

    } )(), 'menu' );

})();