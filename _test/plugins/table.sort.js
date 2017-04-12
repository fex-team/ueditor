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
test(" trace 3715 sortTable", function () {
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
test('active trace 3779 sorttable', function () {
    if(ua.browser.ie&&ua.browser.ie>8)return;//todo
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr></tbody></table>');
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        editor.execCommand('sorttable', 1);
        ua.manualDeleteFillData(editor.body);
        tds = editor.body.getElementsByTagName('td');
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
                equal(domUtils.hasClass(editor.body.firstChild.rows[0], 'firstRow'), true, '给第一行添加firstRow的类');
                start();
            }, 20);
        }, 20);
    }, 50);
    stop();
});
test('contextMenu 表格逆序当前', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    stop();
    var lang = editor.getLang("contextMenu");
    editor.execCommand('cleardoc');
    var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
    editor.setContent(html);
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    var menutable = document.getElementsByClassName("edui-menu-body")[2];
    setTimeout(function () {
        lang = editor.getLang("contextMenu");
        equal(menutable.childNodes.length, 7, '7个子项目');
        if (browser.gecko) {
            equal(menutable.textContent, lang.enablesort+lang.reversecurrent+lang.orderbyasc+lang.reversebyasc+lang.orderbynum+lang.reversebynum, '检查menu显示的字符');
        }
        else {
            equal(menutable.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), lang.enablesort+lang.reversecurrent+lang.orderbyasc+lang.reversebyasc+lang.orderbynum+lang.reversebynum, '检查menu显示的字符');
        }
        var reverseIndex = ua.getContextmenuIndexByName(menutable.childNodes,lang.reversecurrent);
        ua.click(menutable.childNodes[reverseIndex]);//逆序
        ua.manualDeleteFillData(editor.body);
        ua.checkSameHtml(editor.body.firstChild.firstChild.innerHTML,'<tr class=\"firstRow\"><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>Michael</td><td>1</td><td>康熙</td></tr>', '表格内容逆序-选区闭合');
        var tds = editor.body.getElementsByTagName('td');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(tds[0], tds[6]);
        ut.setSelected(cellsRange);
        range.setStart(tds[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        menutable = document.getElementsByClassName("edui-menu-body")[2];
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[reverseIndex]);
            ua.manualDeleteFillData(editor.body);
            ua.checkSameHtml(editor.body.innerHTML,'<table><tbody><tr><td class=\"selectTdClass\">ackson</td><td>4</td><td>承祜</td></tr><tr><td class=\"selectTdClass\">{}</td><td>2</td><td>胤礼</td></tr><tr><td class=\"selectTdClass\">&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>Michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '表格内容逆序-选区不闭合');

            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                te.dom.push(editor.container);
                start();
            }, 20);
        },20);
    },20);
});

test('contextMenu 按ASCII字符排序', function () {
    if(ua.browser.ie||ua.browser.gecko)return;////todo 1.2.6.1 #3316
    var editor = te.obj[0];
    var range = te.obj[1];
    stop();
    var lang = editor.getLang("contextMenu");
    editor.execCommand('cleardoc');
    var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
    editor.setContent(html);
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    var menutable = document.getElementsByClassName("edui-menu-body")[2];//表格排序
    setTimeout(function () {
        lang = editor.getLang("contextMenu");
        var AsciiIndex = ua.getContextmenuIndexByName(menutable.childNodes,lang.orderbyasc);
        ua.click(menutable.childNodes[AsciiIndex]);//ASCII升
        ua.checkSameHtml(editor.body.innerHTML,'<table><tbody><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>Michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '选区闭合');
        var tds = editor.body.getElementsByTagName('td');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(tds[0], tds[6]);
        ut.setSelected(cellsRange);
        range.setStart(tds[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        menutable = document.getElementsByClassName("edui-menu-body")[2];
        forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[AsciiIndex+1]);//ASCII降
            ua.manualDeleteFillData(editor.body);
            ua.checkSameHtml(editor.body.innerHTML,'<table><tbody><tr><td class=\" selecttdclass \">ackson</td><td>4</td><td>承祜</td></tr><tr><td class=\" selecttdclass\">&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td class=\" selecttdclass\">{}</td><td>2</td><td>胤礼</td></tr><tr><td>Michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '表格内容逆序-选区不闭合');
            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                te.dom.push(editor.container);
//
                start();
            }, 200);
        }, 200);
    }, 200);
});

test('contextMenu 按数值大小排序', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    stop();
    var lang = editor.getLang("contextMenu");
    editor.execCommand('cleardoc');
    var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
    editor.setContent(html);
    range.setStart(editor.body.getElementsByTagName('td')[1], 0).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    var menutable = document.getElementsByClassName("edui-menu-body")[2];
    setTimeout(function () {
        lang = editor.getLang("contextMenu");
        var numIndex = ua.getContextmenuIndexByName(menutable.childNodes,lang.orderbynum);
        ua.click(menutable.childNodes[numIndex]);//num升
        ua.manualDeleteFillData(editor.body);
        ua.checkSameHtml(editor.body.innerHTML, '<table data-sort-type=\"orderbynum\"><tbody><tr class=\"firstRow\"><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区闭合');
        setTimeout(function () {
            document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
            te.dom.push(editor.container);
            start();
        }, 200);
    }, 200);
});
test('contextMenu trace 3384: 按数值大小排序', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    stop();
    var lang = editor.getLang("contextMenu");
    editor.execCommand('cleardoc');
    var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
    editor.setContent(html);
    range.setStart(editor.body.getElementsByTagName('td')[1], 0).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    var menutable = document.getElementsByClassName("edui-menu-body")[2];
    setTimeout(function () {
        lang = editor.getLang("contextMenu");
        var numIndex = ua.getContextmenuIndexByName(menutable.childNodes,lang.orderbynum);
        ua.click(menutable.childNodes[numIndex]);//num升
        ua.checkSameHtml(editor.body.innerHTML,'<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区不闭合');

        var tds = editor.body.getElementsByTagName('td');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(tds[1], tds[7]);
        ut.setSelected(cellsRange);
        range.setStart(tds[1], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        menutable = document.getElementsByClassName("edui-menu-body")[2];
        forTable = document.getElementsByClassName('edui-for-table');

        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {

            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[numIndex+1]);//num降
            // todo 1.2.6.1 trace 3510
            if(!ua.browser.gecko){
                ua.checkSameHtml(editor.body.innerHTML,'<table><tbody><tr><td>&amp;*</td><td class=\" selecttdclass\">3</td><td>襄嫔</td></tr><tr><td>{}</td><td class=\" selecttdclass\">2</td><td>胤礼</td></tr><tr><td>Michael</td><td class=\" selecttdclass\">1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区不闭合');
            }
            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                te.dom.push(editor.container);

                start();
            }, 200);
        }, 200);
    }, 200);
});