/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-21
 * Time: 下午1:31
 * To change this template use File | Settings | File Templates.
 */
function getTable(str) {
    var div = document.getElementById("testTable");
    if(!div){
        div = document.createElement("div");
        div.id = "testTable";
        document.body.appendChild(div);
    }
    div.innerHTML = "<table border='1'>" + str + "</table>";
    return div.firstChild;
}
UT = UE.UETable;
test("create UETable",function(){
    var table = getTable("<tr><td>ddd</td></tr>"),
        ut = new UT(table);
    ok(ut.table === table,"UT对象创建成功");
    ok(ut.colsNum == 1 && ut.rowsNum == 1,"单元格行、列数为1");
});

test("getMaxRows",function(){
    var table = getTable("<tr><td>1</td><td>2</td><td>3</td></tr>" +
                         "<tr><td>1</td><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var maxRows = ut.getMaxRows();
    equal(maxRows,2,"最大行数为2");
    table = getTable("<tr><td rowspan='3'>1</td><td>2</td><td rowspan='2'>3</td></tr>" +
                     "<tr><td>2</td></tr>");
    ut = new UT(table);
    maxRows = ut.getMaxRows();
    equal(maxRows,3,"最大行数为3");
});
test("getMaxCols",function(){
    var table = getTable("<tr><td>1</td><td>2</td><td>3</td></tr>" +
                         "<tr><td>1</td><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var maxCols = ut.getMaxCols();
    equal(maxCols,3,"最大列数为3");

    table = getTable("<tr><td rowspan='3'>1</td><td>2</td><td rowspan='2'>3</td></tr>" +
        "<tr><td>2</td><td colspan='3'></td></tr>");
    ut = new UT(table);
    maxCols = ut.getMaxCols();
    equal(maxCols,6,"最大列数为6");
});

test("getSameEndPosCells",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
                         "<tr><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var cell = table.rows[0].cells[0],
        cells1 = ut.getSameEndPosCells(cell,"x"),
        cells2 = ut.getSameEndPosCells(cell,"y");
    ok(cells1.length == 1, "获取到同样X轴结尾位置的cell1个");
    ok(cells2.length == 2, "获取到同样Y轴结尾位置的cell2个");
});

test("getHSideCell",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
        "<tr><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var rows = table.rows,
        cell = rows[1].cells[1],
        cell1 = ut.getHSideCell(cell),
        cell2 = ut.getHSideCell(cell,true);
    equal(cell1,rows[1].cells[0],"左边单元格");
    equal(cell2,null,"位于右边缘的单元格无右邻居单元格");
    equal(ut.getHSideCell(rows[0][0]),null,"位于左边缘的单元格无左邻居单元格");
});

test("getVSideCell",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var rows = table.rows,
        cell = rows[1].cells[1],
        cell1 = ut.getVSideCell(cell),
        cell2 = ut.getVSideCell(cell,true),
        cell3 = ut.getVSideCell(cell,true,true);
    equal(cell1,rows[0].cells[2],"上边单元格");
    equal(cell2,null,"位于下边缘的单元格无下邻居单元格");
    equal(cell3,null,"位于左边缘的单元格无左邻居单元格");
});
test("setCellContent",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var cell = table.rows[0].cells[0];
    ut.setCellContent(cell,"这是测试内容");
    equal(cell.innerHTML,"这是测试内容","设置了正确的内容");
    ut.setCellContent(cell);
    equal(cell.innerHTML,browser.ie ? domUtils.fillChar : "<br>");
});

test("cloneCell",function(){
    var table = getTable("<tr><td style='border-top-color: red;border-bottom-color: green' rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td class='selectedClass'>2</td><td>3</td></tr>"),
        ut = new UT(table);

    var cell = ut.cloneCell(table.rows[0].cells[0]);
    equal(cell.rowSpan,2,"clone了一个2行一列的单元格");
    equal(cell.style.borderTopColor,"green","上边框的颜色将会被下边框取代");
    cell = ut.cloneCell(table.rows[0].cells[0],true);
    ok(cell.rowSpan,1,"忽略被合并单元格时将会充值单元格的rowspan和colspan为1")
});

test("getSameStartPosXCells",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td class='selectedClass'>2</td><td>3</td></tr>"),
        ut = new UT(table);
    stop();
    setTimeout(function(){
        var cells = ut.getSameStartPosXCells(table.rows[0].cells[1]);
        ok(cells.length === 2 ,"找到2个");
        start();
    },10);

});