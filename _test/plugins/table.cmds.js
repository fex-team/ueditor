module('plugins.table');

/*trace992，合并单元格后多了一个td*/
test('向右合并--拆分成列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    ua.manualDeleteFillData(editor.body);

    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergeright');
    range.setStart(tds[1], 0).collapse(true).select();
    editor.execCommand('mergeright');
    tds = editor.body.getElementsByTagName('td');
    equal(tds.length, 2, '2个单元格');
    equal(tds[0].getAttribute('colspan'), 2, '第一行的单元格colspan为2');
    equal(tds[1].getAttribute('colspan'), 2, '第二行的单元格colspan为2');
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        editor.execCommand('source');
        start();
    });
    stop();
    tds = editor.body.getElementsByTagName('td');
    equal(tds.length, 2, '2个单元格');
    equal(tds[0].getAttribute('colspan'), 2, '切换到源码后第一个的单元格colspan');
    equal(tds[1].getAttribute('colspan'), 2, '切换到源码后第二行第一个的单元格colspan');

    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('splittocols');
    equal(tds[0].getAttribute('colspan'), 1, '拆分--[0][0]单元格colspan');
    equal(tds[0].rowSpan, 1, '拆分--[0][0]单元格rowspan');
});
test('向右合并--拆分成列:th', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],0).collapse(true).select();
    editor.execCommand('inserttitle');
    var ths = editor.body.getElementsByTagName('th');
    range.setStart(ths[0], 0).collapse(true).select();
    editor.execCommand('mergeright');
    ths = editor.body.getElementsByTagName('th');
    equal(ths.length, 1, '1个th');
    range.setStart(ths[0], 0).collapse(true).select();
    editor.execCommand('splittocols');
    equal(editor.body.getElementsByTagName('th').length, 2, '拆分单元格th');
});
test('向下合并-拆分成行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');

    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergedown');
    range.setStart(tds[1], 0).collapse(true).select();
    editor.execCommand('mergedown');
    tds = editor.body.getElementsByTagName('td');
    equal(tds.length, 2, '2个单元格');
    equal(tds[0].getAttribute('rowspan'), 2, '合并--[0][0]单元格rowspan');
    equal(tds[1].getAttribute('rowspan'), 2, '合并--[0][1]单元格rowspan');

    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('splittorows');
    range.setStart(tds[1], 0).collapse(true).select();
    editor.execCommand('splittorows');
    equal(tds[0].colSpan, 1, '拆分--[0][0]单元格colspan');
    equal(tds[0].getAttribute('rowspan'), 1, '拆分--[0][0]单元格rowspan');
});

test('完全拆分单元格', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    ua.manualDeleteFillData(editor.body);

    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();

        editor.execCommand('mergecells');
        ut.clearSelected();
        var tds = editor.body.getElementsByTagName('td');
        equal(tds.length, 6, '单元格数');
        equal(tds[0].getAttribute('colspan'), 2, '合并--[0][0]单元格colspan');
        equal(tds[0].getAttribute('rowspan'), 2, '合并--[0][0]单元格rowspan');

        editor.execCommand('splittoCells');
        equal(tds.length, 9, '单元格数');
        equal(tds[0].getAttribute('colspan'), 1, '拆分--[0][0]单元格colspan');
        equal(tds[0].getAttribute('rowspan'), 1, '拆分--[0][0]单元格rowspan');
        equal(tds[1].colSpan, 1, '拆分--[0][1]单元格colspan');
        equal(tds[1].getAttribute('rowspan'), 1, '拆分--[0][1]单元格rowspan');

        editor.undoManger.undo();
        equal(tds[0].getAttribute('colspan'), 2, '撤销--[0][0]单元格colspan');
        equal(tds[0].getAttribute('rowspan'), 2, '撤销--[0][0]单元格rowspan');
        start();
    }, 50);
    stop();
});

test('删除table', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    equal(editor.queryCommandState('deletetable'), -1, '删除按钮灰色');

    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('deletetable');
    ua.manualDeleteFillData(editor.body);
    var table = editor.body.getElementsByTagName('table')[0];
    equal(table, undefined, '删除成功');
});

test('平均分配行列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var html = '<table width="267" ><tbody><caption></caption><tr><th></th><th></th><th></th></tr><tr><td width="46" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td><td width="-1" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td></tr><tr><td width="46" valign="top" style="word-break: break-all;" height="134" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="134" ><br/></td><td width="-1" valign="top" style="word-break: break-all;" height="134" ><br/></td></tr><tr><td width="46" valign="top" style="word-break: break-all;" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" ><br/></td><td width="-1" valign="top" style="word-break: break-all;" ><br/></td></tr></tbody></table>';
    editor.setContent(html);
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[1].cells[0], trs[1].cells[2]);
    ut.setSelected(cellsRange);
    range.setStart(trs[1].cells[0], 0).collapse(true).select();
    editor.execCommand('averagedistributecol');
    ut.clearSelected();
    equal(editor.body.firstChild.getElementsByTagName('td')[1].width, editor.body.firstChild.getElementsByTagName('td')[2].width, '平均分配各列');
    cellsRange = ut.getCellsRange(trs[1].cells[0], trs[3].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[1].cells[0], 0).collapse(true).select();
    editor.execCommand('averagedistributerow');
    ut.clearSelected();
    trs = editor.body.firstChild.getElementsByTagName('tr');
    equal(trs[2].cells[0].height, trs[3].cells[0].height, '平均分配各行');
});
test('选部分行时，平均分布行/选部分列时，平均分布列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var html = '<table width="267" ><tbody><tr><td width="46" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td><td width="-1" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="57" ><br/></td></tr><tr><td width="46" valign="top" style="word-break: break-all;" height="134" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" height="134" ><br/></td><td width="-1" valign="top" style="word-break: break-all;" height="134" ><br/></td></tr><tr><td width="46" valign="top" style="word-break: break-all;" ><br/></td><td width="158" valign="top" colspan="1" rowspan="1" style="word-break: break-all;" ><br/></td><td width="-1" valign="top" style="word-break: break-all;" ><br/></td></tr></tbody></table>';
    editor.setContent(html);
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[2]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('averagedistributerow');
    ut.clearSelected();
    trs = editor.body.firstChild.getElementsByTagName('tr');
    equal(trs[1].cells[0].height, trs[0].cells[0].height, '平均分配各行');
    cellsRange = ut.getCellsRange(trs[0].cells[0], trs[2].cells[1]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('averagedistributecol');
    ut.clearSelected();
    equal(editor.body.firstChild.getElementsByTagName('td')[0].width, editor.body.firstChild.getElementsByTagName('td')[1].width, '平均分配各列');
});

test('表格中设置对齐方式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table><caption></caption><tbody><tr><td></td><td><p>hello</p></td></tr></tbody></table>');
    var caption = editor.body.getElementsByTagName('caption');
    range.setStart(caption[0], 0).collapse(true).select();
    editor.execCommand('cellalignment', {align:'right', vAlign:'top'});
    equal(caption[0].style.textAlign, 'right', 'caption对齐方式为右上对齐');
    equal(caption[0].style.verticalAlign, 'top', 'caption对齐方式为右上对齐');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('cellalignment', {align:'right', vAlign:'top'});
    equal(tds[0].align, 'right', 'td对齐方式为右上对齐');
    equal(tds[0].vAlign, 'top', 'td对齐方式为右上对齐');
    /*不闭合设置对齐方式*/
    range.selectNode(tds[1].firstChild, 0).select();
    editor.execCommand('cellalignment', {align:'center', vAlign:'middle'});
    equal(tds[1].align, 'center', 'p对齐方式为居中对齐');
});

test('修改table屬性', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:3});
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('tablealignment', 'center');
    var table = editor.body.getElementsByTagName('table')[0];
    equal(table.align, 'center', '对齐方式居中');
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('edittable', '#ff0000');
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    if (ua.browser.ie && ua.browser.ie < 9) {
        equal(tds[0].style.borderColor, '#ff0000', '边框颜色：红色');
    } else {
        equal(tds[0].style.borderColor, 'rgb(255, 0, 0)', '边框颜色：红色');
    }
    equal(editor.queryCommandState('edittable'), 0, 'state');
});

test('修改单元格', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[2], 0).collapse(true).select();
    editor.execCommand('edittd', '#9bbb59');
    if (ua.browser.ie && ua.browser.ie < 9) {
        equal(tds[2].style.backgroundColor, '#9bbb59', '背景颜色');
    } else {
        equal(tds[2].style.backgroundColor, 'rgb(155, 187, 89)', '背景颜色');
    }
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[6]);
    ut.setSelected(cellsRange);
    range.setStart(tds[0], 0).collapse(true).select();

    editor.execCommand('edittd', '#9bbb59');
    editor.execCommand('cellalignment', {align:'center', vAlign:'bottom'});
    ut.clearSelected();
    tds = editor.body.firstChild.getElementsByTagName('td');
    if (ua.browser.ie && ua.browser.ie < 9) {
        equal(tds[5].style.backgroundColor, '#9bbb59', '背景颜色');
    } else {
        equal(tds[5].style.backgroundColor, 'rgb(155, 187, 89)', '背景颜色');
    }
    equal(tds[5].align, 'center', '水平居中');
    equal(tds[5].vAlign, 'bottom', '下方');
    equal(editor.queryCommandState('edittd'), 0, 'state');
    equal(editor.queryCommandState('cellalignment'), 0, 'state');
});

test('表格前插行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    var tds = editor.body.firstChild.getElementsByTagName('td');
    range.setStart(tds[1], 0).collapse(true).select();
    editor.execCommand('insertparagraphbeforetable');
    ua.manualDeleteFillData(editor.body);
    var br = ua.browser.ie ? '&nbsp;' : '<br>';
    equal(editor.body.firstChild.innerHTML, br, '表格前插行');
});

test('插入行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergedown');
    range.setStart(tds[4], 0).collapse(true).select();
    editor.execCommand('insertrow');
    tds = editor.body.getElementsByTagName('td');
    equal(tds[0].getAttribute('rowspan'), 3, '[0][0]单元格rowspan');
    editor.undoManger.undo();
    equal(tds[0].getAttribute('rowspan'), 2, '[0][0]单元格rowspan');
});
test('选中两行，插入行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="984"><tbody><tr><td width="307" valign="top">hello</td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr><tr><td width="307" valign="top"></td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr><tr><td width="307" valign="top"></td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr></tbody></table>');
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('insertrow');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('tr').length, 5, '选中两行，前插行，3行变5行');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ua.manualDeleteFillData(trs[2]);
    equal(trs[2].cells[0].innerHTML,'hello','原来的第1行变成第3行');
    ut = editor.getUETable(editor.body.firstChild);
    cellsRange = ut.getCellsRange(trs[2].cells[0], trs[3].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[2].cells[0], 0).collapse(true).select();
    editor.execCommand('insertrownext');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('tr').length, 7,'选中两行，前插行，5行变7行');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ua.manualDeleteFillData(trs[2]);
    equal(trs[2].cells[0].innerHTML,'hello','');
});
test('选中两列，插入列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="984"><tbody><tr><td width="307" valign="top">hello</td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr><tr><td width="307" valign="top"></td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr><tr><td width="307" valign="top"></td><td width="307" valign="top"></td><td width="307" valign="top"></td></tr></tbody></table>');
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[1]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('insertcol');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('tr')[0].childNodes.length, 5, '选中两列，前插列，3行变5列');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ua.manualDeleteFillData(trs[0]);
    equal(trs[0].cells[2].innerHTML,'hello','原来的第1列变成第3列');
    ut = editor.getUETable(editor.body.firstChild);
    cellsRange = ut.getCellsRange(trs[0].cells[2], trs[0].cells[3]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[2], 0).collapse(true).select();
    editor.execCommand('insertcolnext');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('tr')[0].childNodes.length, 7,'选中两列，前插列，5列变7列');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ua.manualDeleteFillData(trs[0]);
    equal(trs[0].cells[2].innerHTML,'hello','');
});
test('插入列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergeright');
    range.setStart(tds[3], 0).collapse(true).select();
    editor.execCommand('insertcol');
    tds = editor.body.getElementsByTagName('td');
    equal(tds[0].getAttribute('colspan'), 3, '[0][0]单元格colspan');
    editor.undoManger.undo();
    equal(tds[0].getAttribute('colspan'), 2, '[0][0]单元格colspan');
    range.setStart(tds[1], 0).setCursor();
    editor.execCommand("insertcol");
    equal(tds[0].parentNode.cells.length, 3, "插入了一列")
});
test('带th的表格，插入列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:3});
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],0).collapse(true).select();
    editor.execCommand('inserttitle');
    stop();
    setTimeout(function(){
        var tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(true).select();
        editor.execCommand('insertcol');
        var ths = editor.body.getElementsByTagName('tr')[0].childNodes;
        equal(ths.length,3,'第一行有3个单元');
        for(var i=0;i<ths.length;i++){
            equal(ths[i].tagName.toLowerCase(),'th','第'+i+'个单元tagName是th');
        }
        start();
    },20);
});
test('原表格非第一行带th，插入列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="984"><tbody><tr><td width="471" valign="top"></td><td width="471" valign="top"></td></tr><tr><th width="471" valign="top"></th><td width="471" valign="top"></td></tr></tbody></table>');
    stop();
    setTimeout(function(){
        var trs = editor.body.getElementsByTagName('tr');
        range.setStart(trs[1].cells[0], 0).collapse(true).select();
        editor.execCommand('insertcol');
        trs = editor.body.getElementsByTagName('tr');
        equal(trs[1].childNodes.length, 3, '插入一列');
        equal(trs[1].cells[0].tagName.toLowerCase(), 'td', '除第一行以外，插入的不能是th');
        start();
    }, 20);
});

test('删除行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:3});
    var tds = editor.body.getElementsByTagName('td');

    range.setStart(tds[0], 0).collapse(1).select();
    editor.execCommand('deleterow');
    equal(editor.body.getElementsByTagName('tr').length, 2, '删除行');
    editor.undoManger.undo();
    equal(editor.body.getElementsByTagName('tr').length, 3, '撤销后的行数');
    range.setStart(tds[5], 0).collapse(1).select();
    editor.execCommand('deleterow');
    equal(editor.body.getElementsByTagName('tr').length, 2, '删除行');

    var table = editor.document.getElementsByTagName("table")[0];
    var cell = table.rows[0].cells[0];
    range.setStart(cell, 0).setCursor();
    editor.execCommand("mergeDown");
    equal(cell.rowSpan, 2, "合并了一行");
    editor.execCommand("deleterow");
    equal(table.rows.length, 1, "在合并的单元格中删除行后，表格变成了一行");
});
test('选中部分单元格，删除行列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[1]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('deleterow');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('tr').length, 2, '选中部分单元格，删除行');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ut = editor.getUETable(editor.body.firstChild);
    cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[1]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).setEnd(trs[0].cells[1],1).select();
    editor.execCommand('deletecol');
    ut.clearSelected();
    equal(trs[0].childNodes.length, 1, '选中部分单元格，删除列');
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ut = editor.getUETable(editor.body.firstChild);
    cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    ut.clearSelected();
    editor.execCommand('deletecol');
    equal(editor.body.getElementsByTagName('table').length, 0, '删除列至表格删空');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    trs = editor.body.firstChild.getElementsByTagName('tr');
    ut = editor.getUETable(editor.body.firstChild);
    cellsRange = ut.getCellsRange(trs[0].cells[0], trs[2].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('deleterow');
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('table').length, 0, '删除列至表格删空');
});
test('sorttable', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr></tbody></table>');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(1).select();
    editor.execCommand('sorttable',1);
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    equal(tds[0].innerHTML,2,'');
    equal(tds[2].innerHTML,1,'');
});
test('sorttable,框选', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr><tr><td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">3</td><td valign="top" colspan="1" rowspan="1" style=""></td></tr></tbody></table>');
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('sorttable',1);
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    equal(tds[0].innerHTML,2,'');
    equal(tds[2].innerHTML,1,'');
    equal(tds[4].innerHTML,3,'');
});
test('enablesort,disablesort', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table width="1310"><tbody><tr><td width="634" valign="top">1</td><td width="634" valign="top"></td></tr><tr><td width="634" valign="top">2</td><td width="634" valign="top"></td></tr></tbody></table>');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(1).select();
    editor.execCommand('enablesort');
    stop();
    setTimeout(function(){
        equal(editor.body.firstChild.attributes['data-sort'].nodeValue,'sortEnabled','sortEnabled');
        editor.execCommand('disablesort');
        setTimeout(function(){
            equal(editor.body.firstChild.attributes['data-sort'].nodeValue,'sortDisabled','sortDisabled');
            start();
        },20);
    },20);
});
test('settablebackground', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    var tds = editor.body.firstChild.getElementsByTagName('td');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[2]);
    ut.setSelected(cellsRange);
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand("settablebackground",{repeat:true,colorList:["#bbb","#ccc"]});
    setTimeout(function(){
        var br = ua.browser.ie?'':'<br>';
        var tds = editor.body.firstChild.getElementsByTagName('td');
        if(ua.browser.ie&&ua.browser.ie<9){
            ok( tds[0].style.backgroundColor === '#bbb', '选区隔行变色， 第一列第一行颜色匹配' );
            ok( tds[2].style.backgroundColor === '#ccc', '选区隔行变色， 第一列第二行颜色匹配' );
        }
        else{
            ok( tds[0].style.backgroundColor === 'rgb(187, 187, 187)', '选区隔行变色， 第一列第一行颜色匹配' );
            ok( tds[2].style.backgroundColor === 'rgb(204, 204, 204)', '选区隔行变色， 第一列第二行颜色匹配' );
        }
        range.setStart(tds[0], 0).collapse(true).select();
        editor.execCommand('cleartablebackground');
        setTimeout(function(){
            ok( tds[0].style.backgroundColor === '', '取消选区隔行变色， 第一列第一行颜色匹配' );
            ok( tds[2].style.backgroundColor === '', '取消选区隔行变色， 第一列第二行颜色匹配' );
            start();
        },20);
    },20);
    stop();
});
test('interlacetable', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(1).select();
    editor.execCommand('interlacetable');
    stop();
    setTimeout(function () {
        equal(editor.body.firstChild.attributes['interlaced'].nodeValue, 'enabled', '');
        equal(editor.body.getElementsByTagName('tr')[0].className, 'ue-table-interlace-color-single', '');
        equal(editor.body.getElementsByTagName('tr')[1].className, 'ue-table-interlace-color-double', '');
        tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        editor.execCommand('uninterlacetable');
        setTimeout(function () {
            equal(editor.body.firstChild.attributes['interlaced'].nodeValue, 'disabled', '');
            equal(editor.body.getElementsByTagName('tr')[0].className, '', '');
            start();
        }, 20);
    }, 20);
});
//
/*trace 750，1308*/
//test( 'trace1308：前插入行的样式和原先不同', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<p></p>' );
//    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
//    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
//    ua.manualDeleteFillData( editor.body );
//    range.setStartAfter( editor.body.firstChild ).collapse( true ).select();
//    //cellborder:2,不支持了
//    editor.execCommand( 'inserttable', {border:2,numCols:2,numRows:2} );
//    var table2 = editor.body.getElementsByTagName( 'table' )[1];
//    range.setStart( table2.getElementsByTagName( 'td' )[0], 0 ).collapse( true ).select();
//    editor.execCommand( 'insertrow' );
//    var tds = table2.getElementsByTagName( 'td' );
///*firefox下用jquery的方式去不到border-width*/
//    for(var index = 0;index<tds.length;index++)
///*边框宽度加到table上了*/
//equal(table2.getAttribute('border'),'2','表格边框为2px');
////    equal( $( tds[index] ).css( 'border-width' ) || tds[index].style.borderWidth, '2px', '表格边框为2px' );
////    for ( var index = 0; index < tds.length; index++ ) {
////        equal( $( tds[index ] ).css( 'border-width' ) || tds[index].style.borderWidth, '2px', '查看第' + (index + 1) + '个单元格的边框' )
////    }
//} );

/*trace 749*/
test('trace 749：拆分为列后2列都有文本', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    tds[1].innerHTML = 'hello';
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergeright');
    var tr = editor.body.getElementsByTagName('tr')[0];
    equal($(tr.firstChild).attr('colspan'), '2', '跨度2列');
    editor.execCommand('splittocols');
    ua.manualDeleteFillData(editor.body);
    tds = editor.body.getElementsByTagName('td');
    //1.2版本，合并拆分之后hello前多了空的占位符
    ok(tds[0].innerHTML, '第一个单元格中有内容');
    ok(tds[1].innerHTML == '' || tds[1].innerHTML == '<br>', '第二个单元格中有内容');
});

/*trace 743*/
test('trace 743：合并单元格后删除列再撤销', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:4, numRows:4});
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[3]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();

        editor.execCommand('mergecells');
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('deleterow');
        trs = editor.body.getElementsByTagName('tr');
        equal(trs.length, 3, '删除后只剩3个tr');
        editor.undoManger.undo();
        trs = editor.body.getElementsByTagName('tr');
        equal(trs.length, 4, '撤销后有4个tr');
        equal($(trs[0].cells[0]).attr('colspan'), 4, '第一行的第一个单元格colspan为4');
        start();
    }, 50);
    stop();
});

/*trace 726*/
test('trace 726：选中合并过的单元格和普通单元格，查看完全拆分单元格菜单是否高亮', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:4, numRows:4});
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();

        editor.execCommand('mergecells');
        equal(editor.queryCommandState('splittocells'), 0, '应当可以拆分单元格');
        setTimeout(function () {
            var trs = editor.body.firstChild.getElementsByTagName('tr');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[3].cells[3]);
            ut.setSelected(cellsRange);
            range.setStart(trs[0].cells[0], 0).collapse(true).select();
            editor.queryCommandState('splittocells');
            equal(editor.queryCommandState('splittocells'), -1, '应当不可以拆分单元格');
            start();
        }, 50);
    }, 50);
    stop();
});

/*trace 718*/
test('trace 718：2次撤销删除列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:4, numRows:4});
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[1].cells[1], trs[2].cells[2]);
        ut.setSelected(cellsRange);
        range.setStart(trs[1].cells[1], 0).collapse(true).select();

        editor.execCommand('mergecells');
        equal(trs[1].cells[1].rowSpan, 2, 'rowspan 为2');
        equal(trs[1].cells[1].colSpan, 2, 'colspan 为2');
        editor.execCommand('deletecol');
        equal(trs[1].cells.length, 3, '3个td');
        editor.undoManger.undo();

        trs = editor.body.firstChild.getElementsByTagName('tr');
        equal(trs[1].cells.length, 3, '3个td');
        equal(trs[1].cells[1].rowSpan, 2, 'rowspan 为2');
        equal(trs[1].cells[1].colSpan, 2, 'colspan 为2');

        range.setStart(trs[1].cells[1], 0).collapse(1).select();
        editor.execCommand('deletecol');
        equal(trs[1].cells.length, 3, '3个td');
        equal(trs[1].cells[1].rowSpan, 2, 'rowspan 为2');
        ok(trs[1].cells[1].colSpan == undefined || trs[1].cells[1].colSpan == 1, 'colspan为1或者undefined');
        start();
    }, 50);
    stop();
});

/*trace 1098 */
test('trace 1098:多次合并单元格偶切换到源码再切回来', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[2].cells[0]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('mergecells');

        setTimeout(function () {
            trs = editor.body.firstChild.getElementsByTagName('tr');
            ut = editor.getUETable(editor.body.firstChild);
            cellsRange = ut.getCellsRange(trs[0].cells[1], trs[2].cells[0]);
            ut.setSelected(cellsRange);
            range.setStart(trs[0].cells[1], 0).collapse(true).select();
            editor.execCommand('mergecells');
//
            setTimeout(function () {
                trs = editor.body.firstChild.getElementsByTagName('tr');
                ut = editor.getUETable(editor.body.firstChild);
                cellsRange = ut.getCellsRange(trs[0].cells[2], trs[1].cells[0]);
                ut.setSelected(cellsRange);
                range.setStart(trs[0].cells[2], 0).collapse(true).select();
                editor.execCommand('mergecells');
                editor.execCommand('source');
                setTimeout(function () {
                    editor.execCommand('source');
                    setTimeout(function () {
                        trs = editor.body.firstChild.getElementsByTagName('tr');
                        equal(trs.length, 3, '3个tr');
                        equal(trs[0].cells[0].rowSpan, 3, '第一个单元格rowspan 3');
                        equal(trs[0].cells[1].rowSpan, 3, '第二个单元格rowspan 3');
                        equal(trs[0].cells.length, 3, '3个td');
                        equal(trs[1].cells.length, 0, '0个td');
                        equal(trs[2].cells.length, 1, '1个td');
                        start();
                    }, 50);
                }, 50);
            }, 50);
        }, 50);
    }, 50);
    stop();
});

/*trace 1307*/
test('trace 1307:adjustTable--多次合并单元格切换到源码再切回来--选中单元格浏览器会假死', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:4, numRows:4});
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[1].cells[0], trs[3].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[1].cells[0], 0).collapse(true).select();

        editor.execCommand('mergecells');
        setTimeout(function () {
            var trs = editor.body.firstChild.getElementsByTagName('tr');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[2], trs[2].cells[0]);
            ut.setSelected(cellsRange);
            range.setStart(trs[0].cells[2], 0).collapse(true).select();
            editor.execCommand('mergecells');
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                setTimeout(function () {
                    trs = editor.body.getElementsByTagName('tr');
                    equal(trs[1].rowIndex, 1, '（1,1）行索引');
                    equal(trs[1].cells[0].cellIndex, 0, '（1,0）列索引');
                    equal(trs[1].cells[1].cellIndex, 1, '（1,1）列索引');
                    equal(trs[2].rowIndex, 2, '（2,2）行索引');
                    equal(trs[2].cells[0].cellIndex, 0, '（2,0）列索引');

                    equal(trs[1].cells[0].rowSpan, 3, '第二行第一个单元格rowspan 3');
                    equal(trs[1].cells[0].colSpan, 2, '第二行第一个单元格colspan 2');
                    equal(trs[0].cells[2].rowSpan, 3, '第一行第三个单元格rowspan 3');
                    equal(trs.length, 4, '4个tr');
                    equal(trs[0].cells.length, 4, '4个td');
                    equal(trs[1].cells.length, 2, '2个td');
                    equal(trs[2].cells.length, 1, '1个td');
                    equal(trs[3].cells.length, 2, '2个td');
                    start();
                }, 50);
            }, 50);
        }, 50);
    }, 50);
    stop();
});
///*trace 2378*/
//test('不覆盖原来的class',function(){
//    var editor = te.obj[0];
//    editor.setContent('<table class="asdf" border="0" cellspacing="1" cellpadding="3" width="332"><tbody><tr><td></td></tr></tbody></table>');
//    editor.execCommand('source');
//    editor.execCommand('source');
//    var table = editor.body.getElementsByTagName('table');
//    equal($(table).attr('class'),'asdf noBorderTable','table的class');
//});

/*trace 3121*/
/*trace 3195*/
test('单元格对齐方式-align', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    ua.manualDeleteFillData(editor.body);
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[2]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();

    editor.execCommand('mergecells');
    ut.clearSelected();
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('cellalign', 'center');
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    equal(tds[0].align, 'center', '第一个单元格居中对齐');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('splittocols');
    tds = editor.body.getElementsByTagName('td');
    equal(tds[0].align, 'center', '第一个单元格居中对齐');
    equal(tds[1].align, 'center', '第二个单元格居中对齐');
    equal(tds[2].align, 'center', '第二个单元格居中对齐');
});

test('单元格对齐方式-vAlign', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    ua.manualDeleteFillData(editor.body);

    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('mergedown');
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('cellvalign', 'middle');
    ua.manualDeleteFillData(editor.body);
    var tds = editor.body.getElementsByTagName('td');
    equal(tds[0].vAlign, 'middle', '第一个单元格居中对齐');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('splittorows');
    tds = editor.body.getElementsByTagName('td');
    equal(tds[0].vAlign, 'middle', '第一个单元格居中对齐');
    equal(tds[2].vAlign, 'middle', '第二个单元格居中对齐');
});

test('adaptbytext，adaptbywindow', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    if(ua.browser.ie!=8)
        ok( editor.body.offsetWidth === editor.body.getElementsByTagName('table')[0].offsetWidth ,'默认按窗口计算宽度');//数值不具体计算了
    editor.execCommand('adaptbytext');//parseInt
    stop();
    setTimeout(function(){
        equal(editor.body.firstChild.width,'','按内容自适应')
        editor.execCommand('adaptbywindow');
        setTimeout(function(){
            ok((parseInt(editor.body.firstChild.width)-editor.body.offsetWidth/2)>0,'默认按窗口计算宽度');
            start();
        },20);
    },20);
});

test('deletetitle', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2, numRows:2});
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],0).collapse(true).select();
    editor.execCommand('inserttitle');
    stop();
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        equal(trs.length,3,'表格增加一行');
        for(var i = 0; i< trs[0].childNodes.length;i++){
            equal(trs[0].childNodes[i].tagName.toLowerCase(),'th','增加的th');
        }
        range.setStart(tds[0],0).collapse(true).select();
        editor.execCommand('deletetitle');
        setTimeout(function(){
            equal(editor.body.firstChild.getElementsByTagName('tr').length,2,'表格减少一行');
            equal(editor.body.firstChild.getElementsByTagName('tr')[0].firstChild.tagName.toLowerCase(),'td','第一行不是标题');
            start();
        },20);
    },20);
});

/*trace 3222*/
test('trace 3222：在合并后的单元格中按tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[1].cells[1], trs[2].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[1].cells[1], 0).collapse(true).select();

        editor.execCommand('mergecells');
        trs[1].cells[2].innerHTML = 'asd';
        range.setStart(trs[1].cells[1], 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode':9});
        if (ua.browser.gecko)
            equal(editor.selection.getRange().startContainer.innerHTML, 'asd', '第一次tab键');
        else
            equal(editor.selection.getRange().startContainer.data, 'asd', '第一次tab键');
        range.setStart(trs[1].cells[1], 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode':9});
        if (ua.browser.gecko)
            equal(editor.selection.getRange().startContainer.innerHTML, 'asd', '第二次tab键');
        else
            equal(editor.selection.getRange().startContainer.data, 'asd', '第一次tab键');
        start();
    }, 50);
    stop();
});

/*trace 3191*/
test('trace 3191：删除表格名称', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
    editor.execCommand('deletecaption');
    equal(editor.body.getElementsByTagName('caption').length, '0', '表格名称被删除');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    ua.keydown(editor.body, {keyCode:90, ctrlKey:true});
    equal(editor.body.getElementsByTagName('caption').length, '1', '表格名称被还原');
});

/*trace 3195*/
test('trace 3195：合并单元格后删除列再撤销', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:4, numRows:4});
    ua.manualDeleteFillData(editor.body);
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        trs[0].cells[1].innerHTML = 'asd';
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[2].cells[2]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();

        editor.execCommand('mergecells');
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('splittocols');
        trs = editor.body.getElementsByTagName('tr');
        equal(trs.length, 4, '4个tr');
        equal(trs[0].cells.length, 4, '4个td');
        equal(trs[1].cells.length, 1, '1个td');
        equal(trs[2].cells.length, 1, '1个td');
        equal(trs[3].cells.length, 4, '4个td');
        equal(trs[0].cells[0].vAlign, 'top', '单元格[0][0]的vAlign');
        equal(trs[0].cells[0].align, '', '单元格[0][0]的align');
        equal(trs[0].cells[1].vAlign, 'top', '单元格[0][1]的vAlign');
        equal(trs[0].cells[2].vAlign, 'top', '单元格[0][2]的vAlign');
        if (ua.browser.ie) {
            equal(trs[0].cells[1].align, '', '单元格[0][1]的align');
            equal(trs[0].cells[2].align, '', '单元格[0][2]的align');
        } else {
            equal(trs[0].cells[1].align, 'null', '单元格[0][1]的align');
            equal(trs[0].cells[2].align, 'null', '单元格[0][2]的align');
        }
        start();
    }, 50);
    stop();
});

/*trace 3231*/
test('trace 3231：向右合并--拆分成列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:2, numRows:2});
    ua.manualDeleteFillData(editor.body);

    var tds = editor.body.getElementsByTagName('td');
    tds[1].innerHTML = 'asd';
    range.setStart(tds[1], 0).collapse(true).select();
    editor.execCommand('insertcolnext');
    ua.manualDeleteFillData(editor.body);
    equal(editor.body.getElementsByTagName('tr')[0].cells.length, '3', '3列');
    equal(editor.body.getElementsByTagName('td')[1].innerHTML, 'asd', '后插入行');
    var br = ua.browser.ie ? '' : '<br>';
    equal(editor.body.getElementsByTagName('td')[2].innerHTML, br, '后插入行');
    range.setStart(editor.body.getElementsByTagName('td')[2], 0).collapse(true).select();
    editor.execCommand('insertrownext');
    equal(editor.body.getElementsByTagName('tr').length, 3, '3行');
    editor.execCommand('deletecol');
    equal(editor.body.getElementsByTagName('td')[1].innerHTML, 'asd', '');
    equal(editor.body.getElementsByTagName('td').length, '6', '');
});
//test('标题行中底纹',function(){
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<p></p>' );
//    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
//    editor.execCommand( 'inserttable');
//    var tds = editor.body.getElementsByTagName('td');
//    range.setStart(tds[0],0).collapse(true).select();
//    editor.execCommand('inserttitle');
//
//    var ut = editor.getUETable(editor.body.firstChild);
//    var ths = editor.body.getElementsByTagName('th');
//    var cellsRange = ut.getCellsRange(ths[0],ths[4]);
//    ut.setSelected(cellsRange);
//    range.setStart( ths[0], 0 ).collapse( true ).select();
//    editor.execCommand('interlacetable');
//    ut.clearSelected();
//    equal(ths[0].style.backgroundColor,'red','红色');
////    equal(editor.queryCommandState('settablebackground'),-1,'命令不可用');
//});

/*trace 713*/
test('trace 713：合并最后一列单元格后再前插入列', function () {
    if(ua.browser.ie)//TODO 1.2.6
        return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols:3, numRows:3});
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[2], trs[2].cells[2]);
        /*合并最后一列的单元格*/
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[2], 0).collapse(true).select();

        editor.execCommand('mergecells');
        setTimeout(function () {
            equal($(trs[0].cells[2]).attr('rowspan'), 3, '跨3行');
            editor.execCommand('insertcol');
            setTimeout(function () {
                /*前插入列*/
                trs = editor.body.getElementsByTagName('tr');
                equal(trs[0].cells.length, 4, '4列');
                equal($(trs[0].cells[3]).attr('rowspan'), 3, '跨3行');
                start();
            }, 50);
        }, 50);
    }, 50);
    stop();
});