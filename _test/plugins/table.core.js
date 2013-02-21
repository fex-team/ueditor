/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-21
 * Time: 下午1:31
 * To change this template use File | Settings | File Templates.
 */
test("create UETable",function(){
    var div = document.createElement("div");
    div.innerHTML="<table id='table'><tr><td>ddd</td></tr></table>";
    document.body.appendChild(div);
    var ut = new UE.UETable(div.firstChild);
    ok(ut.table === div.firstChild,"UT对象创建成功");
    equal(ut.colsNum,1,"单元格列数为1");
    equal(ut.rowsNum,1,"单元格行数为1");
});

test("getMaxCols",function(){

});