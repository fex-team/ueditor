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