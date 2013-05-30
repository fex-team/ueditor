/**
 * 表格生成器UI组件
 * Date: 13-5-27
 * Time: 下午1:38
 */
(function(){

    var widgetName = 'tablepicker';

    UE.ui.define( widgetName, {

        /**
         * tablepicker模板
         * @param {object} options
         * @see TablePicker.init
         * @returns {string} 根据参数构造的模板
         */
        tpl: function ( options ) {

            var tmpl = [],
                currRow = null,
                colCount = options.maxColNum,
                rowCount = options.maxRowNum;

            while( rowCount-- ) {

                currRow = [];

                for( var i = 0; i <= colCount; i++ ) {

                    currRow.push('');

                }

                tmpl.push( '<tr>' + currRow.join('<td></td>') + '</tr>' );

            }

            return '<div class="edui-tablepicker-createbox"><div class="edui-tablepicker-panel"><div class="edui-tablepicker-controller" style="width: <%=maxColNum*cellWidth+borderWidth%>px; height: <%=maxRowNum*cellWidth+borderWidth%>px;"><div class="edui-tablepicker-selected-box"></div><table><tbody>'+ tmpl.join('') +'</tbody></table></div></div><div class="edui-tablepicker-label"></div>'

        },
        /**
         * tablepicker的默认参数
         * @param {int} maxRowNum 最大行数
         * @param {int} maxColNum 最大列数
         * @param {widget object} target
         * @returns {undefined} undefined
         */
        default: {
            maxRowNum: 20,
            maxColNum: 20,
            rowCount: 10,
            colCount: 10,
            target: null,
            mode: 'menu'
        },
        /**
         * 初始化tablepicker， 该函数是创建tablepicker时的“构造函数”，将由代理自动调用以初始化tablepicker；
         * 该函数内部context是当前新创建的tablepicker对象
         * @param {object} options 创建tabkepicker时的参数项
         * @returns {undefined} undefined
         */
        init: function ( options ) {

            var me = this;

            options.cellWidth = 18;
            options.borderWidth = 0;

            me.root( $( $.parseTmpl( me.supper.mergeTpl( me.tpl(options) ), options ) ) );

            me.data( 'table', me.root().find('table:first')[0] );
            me.data( '$container', me.root().find('.edui-tablepicker-panel:first') );
            me.data( '$selectedBox', me.root().find('.edui-tablepicker-selected-box:first') );
            me.data( 'label', me.root().find('.edui-tablepicker-label:first')[0] );

            me.data( 'curRowCount', options.rowCount )
              .data( 'curColCount', options.colCount )
              .data( 'curHoverRow', options.rowCount )
              .data( 'curHoverCol', options.colCount );

            me.data( 'options', options );

            this.initEvent();

        },
        initEvent: function(){

            var _self = this;

            this.root().delegate("td", "mousemove", function(){

                var rowIndex = this.parentNode.rowIndex + 1,
                    colIndex = this.cellIndex + 1;

                _self._expansion( rowIndex, colIndex );

            });

            /**
             * 行列确认
             */
            this.root().delegate("td", "click", function( evt ){

                var rowIndex = this.parentNode.rowIndex + 1,
                    colIndex = this.cellIndex + 1;

                _self.hide();

                _self.trigger( 'select', [ rowIndex, colIndex ] );



            });

            /**
             * 重置
             */
            this.on("afterhide", function(){

                this.reset();

            });

        },
        /**
         * 选择区域自动扩展
         * @param {int} rowIndex 当前行
         * @param {int} colIndex 当前列
         * @returns {undefined}undefined
         */
        _expansion: function( rowIndex, colIndex ){

            var toWidth = 0,
                toHeight = 0,
                options = this.data('options');

            if( rowIndex !== this.data('curHoverRow') || colIndex !== this.data('curHoverCol') ) {

                this.updateCount( rowIndex, colIndex );

                this.data('$selectedBox').css({
                    width: colIndex * options.cellWidth + 'px',
                    height: rowIndex * options.cellWidth + 'px'
                });

                if( rowIndex == this.data('curRowCount') && rowIndex < options.maxRowNum ) {

                    this.data('curRowCount', ++rowIndex );

                    toHeight = rowIndex * options.cellWidth;

                } else if ( rowIndex < this.data('curRowCount') - 1 && rowIndex > options.rowCount - 2 ) {

                    this.data('curRowCount', ++rowIndex );

                    toHeight = rowIndex * options.cellWidth;

                }

                if( colIndex == this.data('curColCount') && colIndex < options.maxColNum ) {

                    this.data( 'curColCount', ++colIndex );

                    toWidth = colIndex * options.cellWidth;

                } else if ( colIndex < this.data('curColCount') - 1 && colIndex > options.colCount - 2 ) {

                    this.data('curColCount', ++colIndex );

                    toWidth = colIndex * options.cellWidth;

                }

                var styles = {};
                toWidth && ( styles['width'] = toWidth + 'px' );
                toHeight && ( styles['height'] = toHeight + 'px' );

                this.data('$container').css( styles );

            }

        },
        /**
         * 更新当前鼠标指针悬停的行列计数
         * @param {int} rowCount 当前行
         * @param {int} colCount 当前列
         */
        updateCount: function( rowCount, colCount ){

            this.data('curHoverRow', rowCount)
                .data('curHoverCol', colCount);

            this.data('label').innerHTML = rowCount + ' X ' + colCount;

        },
        /**
         * 重置到初始状态
         */
        reset: function(){

            var options = this.data('options'),
                $container = this.data('$container'),
                $selectedBox = this.data('$selectedBox');

            $container.css({
                width: options.rowCount * options.cellWidth + 'px',
                height: options.colCount * options.cellWidth + 'px'
            });

            $selectedBox.css({
                width: 0,
                heihgt: 0
            });

            this.data('label').innerHTML = '';
        }
//        show: function(){
//
//            var $target = this.data('$mergeObj') || null,
//                offset = null;
//
//            if( !$target ) {
//                throw new Error('tablepicker show error, invalid target object');
//            }
//
//            offset = $target.offset();
//
//            this.root().css( $.extend( {display:'block'},  {
//                top : offset.top,
//                left : offset.left + $target.outerWidth()
//            } ) );
//
//        }

    }, 'popup');

})();