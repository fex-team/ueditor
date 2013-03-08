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

test("getCellsRange、getCells",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td class='selectedClass'>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var range = ut.getCellsRange(table.rows[0].cells[1],table.rows[1].cells[0]);
    ok(range.beginRowIndex===0 && range.beginColIndex===1 && range.endRowIndex===1 && range.endColIndex===1,"获取到range")
    var cells = ut.getCells(range);
    ok(cells.length ==2,"获取到2个单元格");
    ok(cells[0] == table.rows[0].cells[1],"第一个单元格存在");
});

test("insertRow、deleterRow",function(){
    var table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td>3</td></tr>" +
            "<tr><td class='selectedClass'>2</td><td>3</td></tr>"),
        ut = new UT(table);
    var cellPrototype = document.createElement("td");
    cellPrototype.innerHTML = "aa";
    cellPrototype.setAttribute("vAlign","top");
    ut.insertRow(2,cellPrototype);
    ok(table.rows.length ===3,"行数变成3行");
    ok(table.rows[2].cells[0].getAttribute("vAlign") =="top","新插入的单元格中包含原型单元格中的属性");
});

test( 'parseHTML,toHTML---table相关', function () {
    var serialize = te.obj[0].serialize;
    var parseHTML = serialize.parseHTML;
    var toHTML = serialize.toHTML;
    /*补child，补table的孩子时不会补tbody*/
    var node = parseHTML( '<table>' );
    equal( toHTML( node ).toLowerCase(), '<table><tr><td></td></tr></table>', '<table>--补孩子' );
    /*补parent*/
    node = parseHTML( '<td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>', '<td>--补父亲' );
    /*补parent和child*/
    node = parseHTML( '<tr>hello' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>hello</td></tr></tbody></table>', '<tr>hello--孩子父亲都补' );

    node = parseHTML( '<td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<td>123' );

    node = parseHTML( '123<td>' );
    equal( toHTML( node ).toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123<td>' );

    node = parseHTML( '<tr><td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<tr><td>123' );

    node = parseHTML( '<td>123<tr>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td></tr><tr><td></td></tr></tbody></table>', '<td>123<tr>' );

    /*补充为2个td*/
    node = parseHTML( '<tr>123<td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td><td></td></tr></tbody></table>', '<tr>123<td>--tr和td之间有文字' );

    node = parseHTML( '<td><td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td><td>123</td></tr></tbody></table>', '<td><td>123' );

    node = parseHTML( '<td>123<td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td><td></td></tr></tbody></table>', '<td>123<td>' );

    /*补2个table*/
    node = parseHTML( '<td>123</td>132<tr>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>132<table><tbody><tr><td></td></tr></tbody></table>', '<td>123</td>132<tr>--补全2个table' );

    /*开标签、文本与闭标签混合*/
    node = parseHTML( '<tr>123</td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<tr>123</td>--tr和td之间有文字' );

    node = parseHTML( '<tr></td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123', '<tr></td>123--td闭标签后面有文字' );

    node = parseHTML( '123</tr><td>' );
    equal( toHTML( node ).toLowerCase(), '123<table><tbody><tr><td></td></tr><tr><td></td></tr></tbody></table>', '123</tr><td>' );

    node = parseHTML( '</tr><td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr><tr><td>123</td></tr></tbody></table>', '</tr><td>123' );

    node = parseHTML( '</tr>123<td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</tr>123<td>' );
    /*闭标签、文本与闭标签混合*/
    node = parseHTML( '</td>123</tr>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>' );

    node = parseHTML( '</tr>123</td>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>' );

    node = parseHTML( '</tr>123<tr>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>', '</tr>123<tr>' );

    /*补前面的标签*/
    node = parseHTML( '</td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123', '</td>123--补全td前面的标签' );
    node = parseHTML( '123</td>' );
    equal( toHTML( node ).toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123</td>--补全td前面的标签，有文本' );
    /*补全tr前面的标签*/
    node = parseHTML( '123</tr>' );
    equal( toHTML( node ).toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123</tr>--补全tr前后的标签，前面有文本' );
    /*补全table前面的标签*/
    node = parseHTML( '123</table>' );
    equal( toHTML( node ).toLowerCase(), '123<table><tr><td></td></tr></table>', '123</table>--补全trable前后的标签，前面有文本' );
    /*复杂结构*/
    node = parseHTML( '<table><tr><td>123<tr>456' );
    equal( toHTML( node ).toLowerCase(), '<table><tr><td>123</td></tr><tr><td>456</td></tr></table>', '<table><tr><td>123<tr>456' );

    node = parseHTML( '<td><span>hello1</span>hello2</tbody>' );
    equal( toHTML( node ).toLowerCase(), '<table><tbody><tr><td><span>hello1</span>hello2</td></tr></tbody></table>', '解析<td><span>hello1</span>hello2</tbody>' );

    node = parseHTML( '<table><td><span>hello1</span>hello2</tbody>' );
    equal( toHTML( node ).toLowerCase(), '<table><tr><td><span>hello1</span>hello2<table><tbody><tr><td></td></tr></tbody></table></td></tr></table>', '解析<table><td><span>hello1</span>hello2</tbody>' );

    node = parseHTML( '<table><tr></td>123' );
    equal( toHTML( node ).toLowerCase(), '<table><tr><td></td></tr></table>123', '<table><tr></td>123' );
} );