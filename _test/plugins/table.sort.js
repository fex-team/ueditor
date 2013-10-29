module('plugins.table');

function getTable(str) {
    var div = document.getElementById("testTable");
    if (!div) {
        div = document.createElement("div");
        div.id = "testTable";
        document.body.appendChild(div);
    }
    div.innerHTML = "<table border='1'>" + str + "</table>";
    return div.firstChild;
}
UT = UE.UETable;
test("active trace 3715 sortTable", function () {
    var table = getTable("<tr><td>01</td><td>2</td><td>3</td><td>4</td><td>6</td><td>7</td></tr>" +
            "<tr><td>11</td><td>2</td><td>3</td><td>4</td><td>6</td><td>7</td></tr>" +
            "<tr><td>21</td><td>2</td><td>3</td><td>4</td><td>6</td><td>7</td></tr>"),
        ut = new UT(table);
    ut.sortTable(1, function (a, b) {
        return 1;//逆序
    });
    var value = table.rows[0].cells[0].innerHTML;
    equal(value, "21", "单元格被逆序");

    ut.sortTable(0, function (td1, td2) {
        var value1 = parseInt(td1.innerHTML, 10),
            value2 = parseInt(td2.innerHTML, 10);
        return value2 - value1;
    })
    value = table.rows[0].cells[0].innerHTML;
    equal(value, "21", "按数值从大到小排列");

    ut.sortTable(0, 'reversebynum');
    equal(table.getAttribute('data-sort-type'), "reversebynum", "data-sort-type属性是否设置成功");
});
test('sorttable', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr></tbody></table>');
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        editor.execCommand('sorttable', 1);
        ua.manualDeleteFillData(editor.body);
        var tds = editor.body.getElementsByTagName('td');
        equal(tds[0].innerHTML, 2, '');
        equal(tds[2].innerHTML, 1, '');
        start();
    }, 50);
    stop();
});
test('sorttable,框选', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">3</td><td valign="top" colspan="1" rowspan="1" style=""></td></tr></tbody></table>');
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('sorttable', 1);
        ua.manualDeleteFillData(editor.body);
        var tds = editor.body.getElementsByTagName('td');
        equal(tds[0].innerHTML, 2, '');
        equal(tds[2].innerHTML, 1, '');
        equal(tds[4].innerHTML, 3, '');
        start();
    }, 50);
    stop();
});
test('enablesort,disablesort', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr></tbody></table>');
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        editor.execCommand('enablesort');

        setTimeout(function () {
            equal(editor.body.firstChild.attributes['data-sort'].nodeValue, 'sortEnabled', 'sortEnabled');
            equal(domUtils.hasClass(editor.body.firstChild, 'sortEnabled'), true, 'sortEnabled');
            editor.execCommand('disablesort');
            setTimeout(function () {
                equal(editor.body.firstChild.attributes['data-sort'].nodeValue, 'sortDisabled', 'sortDisabled');
                equal(domUtils.hasClass(editor.body.firstChild, 'sortEnabled'), false, 'sortDisabled');
                start();
            }, 20);
        }, 20);
    }, 50);
    stop();
});