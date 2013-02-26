/**
* Created by JetBrains PhpStorm.
* User: dongyancen
* Date: 12-4-12
* Time: 下午4:47
* To change this template use File | Settings | File Templates.
*/
module('ui.table');
test('TableButton/TablePicker', function() {
//    var editor = new baidu.editor.ui.Editor();
//    editor.render("editor");
//    stop();
//
//    editor.ready( function() {
//        var tableButton = new te.obj[0].TableButton({editor:editor});
//
//        te.dom[0].innerHTML = tableButton.renderHtml();
//        tableButton.postRender();
//        tableButton.showPopup();
//        equal(tableButton.popup.getDom().style.display, '', '窗口显示');
//
////  onmore
//        ua.click(document.getElementsByClassName('edui-clickable')[0]);
//        equal(tableButton.popup.getDom().style.display, "none", 'onmore 关闭窗口');
//
////    MouseOver
//        tableButton.showPopup();
//
//        var pickarea = document.getElementById(tableButton.popup.content.id).firstChild.lastChild;
//        var startTop = baidu.editor.ui.uiUtils.getClientRect(pickarea).top;//"edui-pickarea"的起始位置
//        var startLeft = baidu.editor.ui.uiUtils.getClientRect(pickarea).left;//"edui-pickarea"的起始位置
//        var cellSize = tableButton.popup.content.lengthOfCellSide;//单元格的大小
//        var col = tableButton.editor.getLang("t_col");
//        var row = tableButton.editor.getLang("t_row");
//        ua.mouseover(pickarea, {clientX:startLeft + 2 * cellSize,clientY:startTop + 2 * cellSize});
//        equal(document.getElementById(tableButton.popup.content.id+'_label').innerHTML, "0"+col+" x 0"+row, 'MouseOver');
//        equal(document.getElementById(tableButton.popup.content.id+'_overlay').style.visibility, '', 'MouseOver');
//
////    MouseOut
//        ua.mouseout(pickarea);
//        equal(document.getElementById(tableButton.popup.content.id+'_label').innerHTML, "0"+col+" x 0"+row, 'MouseOut');
//        equal(document.getElementById(tableButton.popup.content.id+'_overlay').style.visibility, 'hidden', 'MouseOut');
//
////  MouseMove
//
//        startTop = baidu.editor.ui.uiUtils.getClientRect(pickarea).top;//"edui-pickarea"的起始位置
//        startLeft = baidu.editor.ui.uiUtils.getClientRect(pickarea).left;//"edui-pickarea"的起始位置
//        //  行列的计算：  鼠标和"edui-pickarea"的相对位置/单元格大小
//        ua.mousemove(pickarea, {clientX:startLeft + 2 * cellSize,clientY:startTop + 3 * cellSize});
//        equal(document.getElementById(tableButton.popup.content.id+'_label').innerHTML, "2"+col+" x 3"+row, 'MouseMove');
//        ua.mousemove(pickarea, {clientX:startLeft + 2 * cellSize + 1,clientY:startTop + 3 * cellSize});
//        equal(document.getElementById(tableButton.popup.content.id+'_label').innerHTML, "3"+col+" x 3"+row, 'MouseMove');
//
////    onclick
//        ua.click(pickarea);
//        equal(tableButton.popup.getDom().style.display, "none", 'onclick 关闭窗口');
//        start();
//    });
});