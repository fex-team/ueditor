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
    div.innerHTML = "<table>" + str + "</table>";
    return div.firstChild;
}
test("create UETable",function(){
    var table = getTable("<tr><td>ddd</td></tr>"),
        ut = new UE.UETable(table);
    ok(ut.table === table,"UT对象创建成功");
    equal(ut.colsNum,1,"单元格列数为1");
    equal(ut.rowsNum,1,"单元格行数为1");
});

test("getMaxRows",function(){
    var table = getTable("<tr><td>1</td><td>2</td><td>3</td></tr>" +
                         "<tr><td>1</td><td>2</td><td>3</td></tr>"),
        ut = new UE.UETable(table);
    var maxRows = ut.getMaxRows();
    equal(maxRows,2,"最大行数为2");

    table = getTable("<tr><td rowspan='2'>1</td><td>2</td><td rowspan='2'>3</td></tr>" +
                     "<tr><td>2</td></tr>");


});