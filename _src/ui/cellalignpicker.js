///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    /**
     * 该参数将新增一个参数： selected， 参数类型为一个Object， 形如{ 'align': 'center', 'valign': 'top' }， 表示单元格的初始
     * 对齐状态为： 竖直居上，水平居中; 其中 align的取值为：'center', 'left', 'right'; valign的取值为: 'top', 'middle', 'bottom'
     * @update 2013/4/2 hancong03@baidu.com
     */
    var CellAlignPicker = baidu.editor.ui.CellAlignPicker = function (options) {
        this.initOptions(options);
        this.initSelected();
        this.initCellAlignPicker();
    };
    CellAlignPicker.prototype = {
        //初始化选中状态， 该方法将根据传递进来的参数获取到应该选中的对齐方式图标的索引
        initSelected: function(){

            var status = {

                valign: {
                    top: 0,
                    middle: 1,
                    bottom: 2
                },
                align: {
                    left: 0,
                    center: 1,
                    right: 2
                },
                count: 3

                },
                result = -1;

            if( this.selected ) {
                this.selectedIndex = status.valign[ this.selected.valign ] * status.count + status.align[ this.selected.align ];
            }

        },
        initCellAlignPicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {

            var alignType = [ 'left', 'center', 'right' ],
                COUNT = 9,
                tempClassName = null,
                tempIndex = -1,
                tmpl = [];


            for( var i= 0; i<COUNT; i++ ) {

                tempClassName = this.selectedIndex === i ? ' class="edui-cellalign-selected" ' : '';
                tempIndex = i % 3;

                tempIndex === 0 && tmpl.push('<tr>');

                tmpl.push( '<td index="'+ i +'" ' + tempClassName + ' stateful><div class="edui-icon edui-'+ alignType[ tempIndex ] +'"></div></td>' );

                tempIndex === 2 && tmpl.push('</tr>');

            }

            return '<div id="##" class="edui-cellalignpicker %%">' +
                '<div class="edui-cellalignpicker-body">' +
                '<table onclick="$$._onClick(event);">' +
                tmpl.join('') +
                '</table>' +
                '</div>' +
                '</div>';
        },
        getStateDom: function (){
            return this.target;
        },
        _onClick: function (evt){
            var target= evt.target || evt.srcElement;
            if(/icon/.test(target.className)){
                this.items[target.parentNode.getAttribute("index")].onclick();
                Popup.postHide(evt);
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(CellAlignPicker, UIBase);
    utils.extend(CellAlignPicker.prototype, Stateful,true);
})();



