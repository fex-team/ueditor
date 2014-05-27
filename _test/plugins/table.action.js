/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-25
 * Time: 下午4:40
 * To change this template use File | Settings | File Templates.
 */

//test('', function () {
//    stop()
//});
test('框选', function () {
    var editor = te.obj[0];
    var range = te.obj[1];

        editor.setContent('<p></p>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols: 3, numRows: 3});
            var tds = editor.body.getElementsByTagName('td');
            ua.mousedown(tds[0]);
            ua.mouseover(tds[4]);
            ua.mouseup(tds[4]);
            setTimeout(function () {
                var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
                var tds = editor.body.getElementsByTagName('td');
                equal(selectedTds.length, 4, '框选');
                if ( ua.browser.ie >8 && ua.browser.ie<11)
                    ua.checkResult(editor.selection.getRange(), tds[0].firstChild, tds[0].firstChild, 1, 1, true, '检查选中的range')
                else
                    ua.checkResult(editor.selection.getRange(), tds[0], tds[0], 0, 0, true, '检查选中的range');
                range.setStart(tds[4], 0).collapse(true).select();
                ua.mousedown(tds[4], {button: 2});
                setTimeout(function () {
                    var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
                    var tds = editor.body.getElementsByTagName('td');
                    equal(selectedTds.length, 4, '右键框选不变');
                    if ( ua.browser.ie >8 && ua.browser.ie<11)
                        ua.checkResult(editor.selection.getRange(), tds[0].firstChild, tds[0].firstChild, 1, 1, true, '检查选中的range')
                    else
                        ua.checkResult(editor.selection.getRange(), tds[0], tds[0], 0, 0, true, '检查选中的range');
                        start();
                }, 50);
            }, 50);
        }, 80);
    stop();
});

test('tableDragable-显示和消失', function () {
    if (browser.ie && browser.version < 8) return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue', {tableDragable: true});
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent('<p></p>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols: 3, numRows: 3});
            var tds = editor.body.getElementsByTagName('td');
            ua.mousemove(editor.body.firstChild);
            var pos = domUtils.getXY(editor.body.firstChild);
            var select = ua.browser.webkit ? '-webkit-user-select: none;' : ua.browser.gecko ? '-moz-user-select: none;' : ua.browser.ie >8?'-ms-user-select: none':'';//-ms-user-select: none
            var html = '<div contenteditable=\"false\" style=\"width:15px;height:15px;background-image:url(' + editor.options.UEDITOR_HOME_URL + 'dialogs/table/dragicon.png);position: absolute;cursor:move;top:' + (pos.y - 15) + 'px;left:' + pos.x + 'px; ' + select + '\"' + (ua.browser.ie && ua.browser.ie<9 ? 'unselectable=\"on\"' : '') + '></div>';
            setTimeout(function () {
                var button = editor.body.lastChild;
                ua.checkSameHtml(button.outerHTML.replace('&quot;', ''), html, 'DragButton显示');
                ua.mouseout(button);
                ua.mousemove(editor.body);
                setTimeout(function () {
                    equal(editor.body.getElementsByTagName('div').length, 0, '按钮没有了');
                    UE.delEditor('ue');
                    te.dom.push(document.getElementById('ue'));
                    te.dom.push(document.getElementById('edui_fixedlayer'));
                    start();
                }, 2100);
            }, 20);
        }, 50);
    });
    stop();
});
test('tableDragable-单击', function () {//tableClicked
    if (browser.ie && browser.version < 8) return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue', {tableDragable: true});
    expect(1);
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent('<p></p>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols: 3, numRows: 3});
            var tds = editor.body.getElementsByTagName('td');
            ua.mousemove(editor.body.firstChild);
            setTimeout(function () {
                var button = editor.body.lastChild;
                editor.addListener("tableClicked", function (type, table, buttonOn) {
                    same(table, editor.body.getElementsByTagName('table')[0], 'tableClicked事件,传入的参数正确');
                    setTimeout(function () {
                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        te.dom.push(document.getElementById('edui_fixedlayer'));
                        start();
                    }, 500);
                });
                ua.click(button);
            }, 20);
        }, 50);
    });
    stop();
});
test('tableDragable-双击', function () {//tableClicked
    if (browser.ie && browser.version < 8) return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue', {tableDragable: true});
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent('<p></p>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols: 3, numRows: 3});
            var tds = editor.body.getElementsByTagName('td');
            ua.mousemove(editor.body.firstChild);
            setTimeout(function () {
                var button = editor.body.lastChild;
                ua.dblclick(button);
                setTimeout(function () {
                    var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
                    var tds = editor.body.getElementsByTagName('td');
                    equal(selectedTds.length, 9, '全选');
                    if (ua.browser.ie > 8 && ua.browser.ie<11)
                        ua.checkResult(editor.selection.getRange(), tds[0].firstChild, tds[0].firstChild, 1, 1, true, '检查选中的range');
                    else
                    ua.checkResult(editor.selection.getRange(), tds[0], tds[0], 0, 0, true, '检查选中的range');
                    setTimeout(function () {
                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        te.dom.push(document.getElementById('edui_fixedlayer'));
                        start();
                    }, 500);
                }, 100);
            }, 100);
        }, 100);
    });
    stop();
});
test('从外面粘贴表格', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');

    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    var html = {html: '<table style="width:992px"><tbody><tr><td style="border-color: rgb(247, 150, 70);width:198px" >hello1</td><td  style="background-color: rgb(255, 0, 0); border-color: rgb(247, 150, 70);width:198px" ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table><p>hello2</p>'};
    editor.fireEvent('beforepaste', html);
    //**//*粘贴*//**//*
    stop();
    setTimeout(function () {
        var space = ua.browser.ie ? '' : '<br/>';
        var border = (ua.browser.ie && ua.browser.ie < 9) ? 'border-bottom-color: rgb(247,150,70); border-top-color: rgb(247,150,70); border-right-color: rgb(247,150,70); border-left-color: rgb(247,150,70)' : 'border-color: rgb(247, 150, 70)';
        var resultHtml = '<table width="992"><tbody><tr><td  style="' + border + ';" width="198">hello1</td><td  style="background-color: rgb(255, 0, 0); ' + border + ';" width="198">' + space + '</td></tr><tr><td>hello2</td><td>' + space + '</td></tr></tbody></table><p>hello2</p>';
        ua.checkSameHtml(html.html.toLowerCase(), resultHtml.toLowerCase(), '粘贴的表格规范格式');
        start();
    }, 50);
});
test('从外面粘贴表格到表格-表格中不能粘完整的表格', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    //**//*插入表格*//**//*
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    var html = {html: '<table><tbody><tr><td>hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table><p>hello2</p>'};
    editor.fireEvent('beforepaste', html);
    //**//*粘贴*//**//*
    stop();
    setTimeout(function () {
        equal(html.html, '<p>hello2</p>', '表格中不能粘完整的表格');
        start();
    }, 50);
});
test('  trace 3729 从外面粘贴表格到表格-在caption中粘贴,只粘贴文本内容', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    //**//*插入表格*//**//*
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
    var html = {html: '<table><tbody><tr><td>hello1</td><td ></td></tr></tbody></table>'};
    editor.fireEvent('beforepaste', html);
    //**//*粘贴*//**//*
    stop();
    setTimeout(function () {
        //todo ie9 使用 div[browser.ie ? 'innerText' : 'textContent'] 会多一个换行,用textContent没有 trace 3729
        equal(html.html, 'hello1', '在caption中粘贴,只粘贴文本内容');
        start();
    }, 50);
});
test('getText,取表格内的文本', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table><tbody><tr><td>  hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>');
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        range.setStart(trs[0].cells[0],0).collapse(true).select();
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
        ut.setSelected(cellsRange);
        setTimeout(function () {
            ua.manualDeleteFillData(editor.body);
            equal(editor.selection.getText(), 'hello1hello2');
            start();
        }, 50);
    }, 50);
});
test('在第一个单元格里最前面回车,且表格前面没有内容', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});

    var trs = editor.body.firstChild.getElementsByTagName('tr');

    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    ua.keydown(editor.body, {'keyCode': 13});
    stop();
    setTimeout(function () {
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML, ua.browser.ie ? '&nbsp;' : '<br>', '表格前插入空行');
        equal(editor.body.firstChild.tagName.toLowerCase(), 'p', '表格前插入空行');
        equal(editor.body.childNodes[1].tagName.toLowerCase(), 'table', '表格在空行后面');
        start();
    }, 50);
});
test('delete 事件', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    expect(4);
    editor.addListener('saveScene', function () {
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    trs[0].cells[0].innerHTML = 'hello';
    trs[1].cells[0].innerHTML = 'hello';
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    ua.keydown(editor.body, {'keyCode': 46});
    stop();
    setTimeout(function () {
        ua.manualDeleteFillData(editor.body);
        trs = editor.body.firstChild.getElementsByTagName('tr');
        equal(trs[0].cells[0].innerHTML, ua.browser.ie ? '' : '<br>', '内容');
        equal(trs[1].cells[0].innerHTML, ua.browser.ie ? '' : '<br>', '内容');
        start();
    }, 20);
});
//**//*trace 3047,3545*//**//*
test('trace 3047 ,3545 全屏插入表格', function () {
    if (ua.browser.gecko)return;//TODO 1.2.6
    if (ua.browser.ie && ua.browser.ie < 9)return;//TODO 1.2.6
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    var editor = te.obj[2];
    editor.render(div);
    stop();
    editor.ready(function () {
        editor.setContent('<p></p>');
        editor.ui.setFullScreen(!editor.ui.isFullScreen());
        editor.execCommand('inserttable');
        var width1 = editor.body.getElementsByTagName('td')[0].width;
        setTimeout(function () {
            editor.ui.setFullScreen(!editor.ui.isFullScreen());
            setTimeout(function () {
                var width2 = editor.body.getElementsByTagName('td')[0].width;
                ok((width1 - width2) > 10, '页面宽度自适应');
                div.parentNode.removeChild(div);
                start();
            }, 500);
        }, 500);
    });
});

test('backspace事件:删除caption', function () {
    if(ua.browser.ie&&ua.browser.ie>8)return ;//todo 1.3.0

    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('insertcaption');
        ua.keydown(editor.body, {'keyCode': 8});
        setTimeout(function () {
            equal(editor.body.getElementsByTagName('caption').length, 0, '删除caption');
            equal(editor.selection.getRange().collapsed, true, '检查光标');
            equal(editor.selection.getRange().startContainer, editor.body.getElementsByTagName('td')[0], '检查光标');
            start();
        }, 500);
    }, 50);
});

test('backspace事件:deleterow', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[2]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode': 8});
        setTimeout(function () {
            equal(editor.body.getElementsByTagName('tr').length, 2, '删除整行');
            if(!ua.browser.ie||ua.browser.ie<9){//todo
            equal(editor.selection.getRange().collapsed, true, '检查光标');
            equal(editor.selection.getRange().startContainer, editor.body.getElementsByTagName('td')[0], '检查光标');
            }
            start();
        }, 100);
    }, 50);
});

test('backspace事件:deletecol', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[2].cells[0]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        setTimeout(function () {
            ua.keydown(trs[0].cells[0], {'keyCode': 8});
            setTimeout(function () {
                equal(editor.body.getElementsByTagName('tr')[0].getElementsByTagName('td').length, 2, '删除整列');
                if(!ua.browser.ie||ua.browser.ie<9){//todo
                    equal(editor.selection.getRange().collapsed, true, '检查光标');
                    equal(editor.selection.getRange().startContainer, editor.body.getElementsByTagName('td')[0], '检查光标');
                }
                start();
            }, 100);
        }, 50);
    }, 100);
});

//test('backspace事件:delcells', function () {
//    //TODO
//});
test('表格名称中backspace键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('insertcaption');
        range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode': 8});
        setTimeout(function () {
            equal(editor.body.getElementsByTagName('caption').length, 0, '删除caption');
            equal(editor.body.getElementsByTagName('table').length, 1, '不会增加表格数量');
            equal(editor.body.getElementsByTagName('tr').length, 3, '不会增加表格行数量');
            equal(editor.body.getElementsByTagName('tr')[0].cells.length, 3, '不会增加表格列数量');
            if(!ua.browser.ie||ua.browser.ie<9){//todo
            equal(editor.selection.getRange().collapsed, true, '检查光标');
            equal(editor.selection.getRange().startContainer, editor.body.getElementsByTagName('td')[0], '检查光标');
            }
            start();
        }, 100);
    }, 200);
});
test('trace 3097 标题行中backspace键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
    var x = range.cloneRange();
        editor.execCommand('inserttitle');
    range.setStart(editor.body.getElementsByTagName('th')[0], 0).collapse(true).select();
    ua.keydown(editor.body, {'keyCode': 8});
    stop();
    setTimeout(function () {
        editor = te.obj[0];
        equal(editor.body.getElementsByTagName('caption').length, 1, '不会删除caption');
        equal(editor.body.getElementsByTagName('th').length, 3, '不会误删除标题行');
        equal(editor.body.getElementsByTagName('table').length, 1, '不会增加表格数量');
        equal(editor.body.getElementsByTagName('tr').length, 4, '不会增加表格行数量');
        equal(editor.body.getElementsByTagName('tr')[0].cells.length, 3, '不会增加表格列数量');
        equal(editor.selection.getRange().collapsed, true, '检查光标');
        trs[0].cells[0].innerHTML = 'hello';
//        equal(editor.selection.getRange().startContainer, te.obj[0].body.getElementsByTagName('th')[0], '检查光标');
        equal(trs[0].cells[0].innerHTML,'hello', '检查光标');
        start();
    }, 50);
});

test('拖拽', function () {
    if (ua.browser.ie && ua.browser.ie < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[1].width;
    ua.mousemove(tds[1], {clientX: 199, clientY: 100});
    equal(editor.body.style.cursor, 'col-resize', '检查鼠标显示');
    ua.mousedown(tds[1], {clientX: 199, clientY: 100});
    setTimeout(function () {
    ua.mousemove(tds[1], {clientX: 299, clientY: 100});
    ua.mouseup(tds[1], {clientX: 299, clientY: 100});
    var p = ua.getMousePosition;
    setTimeout(function () {
        var width2 = tds[1].width;
        ok(width2 - width1 > 50, '拖拽后单元格宽度改变');
        start();
    }, 50);
    }, 400);
    stop();
});
test('拖拽_row-resize鼠标显示', function () {
    if (ua.browser.ie && ua.browser.ie < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[1].width;
    ua.mousemove(tds[4], {clientX: 450, clientY: 39});
    equal(editor.body.style.cursor, 'row-resize', 'row-resize鼠标显示');

    expect(3);
    setTimeout(function () {
        editor.addListener("tablemouseout", function (type, table, buttonOn) {
            same(table, editor.body.getElementsByTagName('table')[0], 'tablemouseout事件,传入的参数正确');
        });
        ua.mouseout(tds[1], {clientX: 299, clientY: 35});
        setTimeout(function () {
            equal(editor.body.style.cursor, 'text', '焦点转移,row-resize不显示');
            start();
        }, 50);
    }, 20);
    stop();
});
test('拖拽-最右边的单元格', function () {
    if (ua.browser.ie && ua.browser.ie < 8) return;

    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[4].width;
    ua.mousemove(tds[4], {clientX: 492, clientY: 21});
    equal(editor.body.style.cursor, 'col-resize', '检查鼠标显示');

    ua.mousedown(tds[4], {clientX: 492, clientY: 21});
    setTimeout(function () {
        ua.mousemove(tds[4], {clientX: 481, clientY: 21});
        ua.mouseup(tds[4], {clientX: 481, clientY: 21});
        setTimeout(function () {
            var width2 = te.obj[0].body.getElementsByTagName('td')[4].width;
            ok(width1 != width2 , '拖拽后单元格宽度改变');
            start();
        }, 50);
    }, 400);
    stop();
});
test('拖拽-最下边的单元格', function () {
//    if (ua.browser.ie ) return;//todo 1.3.0

    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    var tds = te.obj[0].body.getElementsByTagName('td');
    var height1 = tds[20].height;
    ua.mousemove(tds[24], {clientX: 439, clientY: 512});
    ua.mousedown(tds[24], {clientX: 439, clientY: 512});
    equal(editor.body.style.cursor, 'row-resize', '检查鼠标显示');

    setTimeout(function () {
        ua.mousemove(tds[24], {clientX: 439, clientY: 562});
        ua.mouseup(tds[24], {clientX: 439, clientY: 562});
        setTimeout(function () {
            var height2 = te.obj[0].body.getElementsByTagName('td')[20].height;
            ok(height2 - height1 > 10, '拖拽后单元格宽度改变');
            start();
        }, 50);
    }, 400);
    stop();
});
test('trace 3022 表格名称中backspace、ctrl+z、enter', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
//    expect(9);
    editor.addListener('saveScene', function () {
        ok(true);
    });
    stop();
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        editor.execCommand('insertcaption');
        ua.keydown(editor.body, {'keyCode': 8});
        setTimeout(function () {

            range.setStart(trs[0].cells[0], 0).collapse(true).select();
            ua.keydown(editor.body, {'keyCode': 90, 'ctrlKey': true});
            setTimeout(function () {
                ua.keydown(editor.body, {'keyCode': 13});
                equal(te.obj[0].body.getElementsByTagName('caption').length, 1, '撤销删除caption');
                equal(te.obj[0].body.getElementsByTagName('th').length, 0, '不会误插入标题行');
                equal(te.obj[0].body.getElementsByTagName('table').length, 1, '不会增加表格数量');
                equal(te.obj[0].body.getElementsByTagName('tr').length, 3, '不会增加表格行数量');
                equal(te.obj[0].body.getElementsByTagName('tr')[0].cells.length, 3, '不会增加表格列数量');
                equal(te.obj[0].selection.getRange().collapsed, true, '检查光标');

                if(!ua.browser.gecko && !ua.browser.webkit)//todo 1.3.6 ff 回退后光标找不好
                    equal(te.obj[0].selection.getRange().startContainer.parentNode, te.obj[0].body.getElementsByTagName('td')[0], '检查光标');
                start();
            }, 20);
        }, 20);
    }, 50);
});



/*trace 3067*/
test('trace 3067 向右合并--tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 2, numRows: 2});
    ua.manualDeleteFillData(editor.body);

    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('mergeright');
    range.setStart(tds[0], 0).collapse(true).select();
    range = editor.selection.getRange();
    var common = range.getCommonAncestor(true, true);
    equal(common.colSpan, 2, 'tab键前光标位于合并后的单元格中');
    ua.keydown(editor.body, {'keyCode': 9});
    setTimeout(function () {
        range = editor.selection.getRange();
        common = range.getCommonAncestor(true, true);
        equal(common.colSpan, 1, 'tab键前光标跳到合并后单元格的下一个单元格中');
        start();
    }, 20);
    stop();
});

/*trace 3100*/
test('trace 3100 表格名称中tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    var trs = editor.body.firstChild.getElementsByTagName('tr');
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    editor.execCommand('insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
    ua.keydown(editor.body, {'keyCode': 9});
    stop();
    setTimeout(function () {
        editor = te.obj[0];
        equal(editor.body.getElementsByTagName('caption').length, 1, '不会删除caption');
        equal(editor.body.getElementsByTagName('th').length, 0, '不会误插入标题行');
        equal(editor.body.getElementsByTagName('table').length, 1, '不会增加表格数量');
        equal(editor.body.getElementsByTagName('tr').length, 3, '不会增加表格行数量');
        equal(editor.body.getElementsByTagName('tr')[0].cells.length, 3, '不会增加表格列数量');
        equal(editor.selection.getRange().collapsed, true, '检查光标');
        if (!ua.browser.ie) //ie8下会导致堆栈溢出，奇葩的bug，以后不溢出再检查ie8
            equal(editor.selection.getRange().startContainer, te.obj[0].body.getElementsByTagName('td')[0], '检查光标');
        start();
    }, 50);
});

/*trace 3059*/
test('trace 3059 表格右浮动', function () {
    if (ua.browser.ie)return;//TODO 1.2.6
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    var tds = te.obj[0].body.getElementsByTagName('td');
    var oldWidth = tds[0].offsetWidth;
    ua.mousemove(tds[0], {clientX: 105, clientY: 20});
    ua.mousedown(tds[0], {clientX: 105, clientY: 20});
    ua.mouseup(tds[0], {clientX: 105, clientY: 20});
    setTimeout(function () {

        ua.mousedown(tds[0], {clientX: 105, clientY: 20});
        ua.mouseup(tds[0], {clientX: 105, clientY: 20});

        setTimeout(function () {
            tds = editor.body.firstChild.getElementsByTagName('td');
            ok(tds[0].offsetWidth < oldWidth, '第一列宽度变小');
            range.setStart(tds[0], 0).collapse(true).select();
            editor.execCommand('tablealignment', 'right');
            var table = te.obj[0].body.getElementsByTagName('table')[0];
            equal(table.align, 'right', '表格右浮动');

            start();

        }, 500);

    }, 50);

    stop();

});

test('trace 3378：拖拽后tab，不影响表格样式', function () {
    if (ua.browser.ie && ua.browser.ie < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('inserttable');
    ua.manualDeleteFillData(editor.body);
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[1].width;
    ua.mousemove(tds[1], {clientX: 199, clientY: 100});
    ua.mousedown(tds[1], {clientX: 199, clientY: 100});
    setTimeout(function () {
        ua.mousemove(tds[1], {clientX: 299, clientY: 100});
        ua.mouseup(tds[1], {clientX: 299, clientY: 100});
        var width2 = tds[1].width;
        ok(width2 - width1 > 50, '拖拽后单元格宽度改变');
        range.setStart(tds[24], 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode': 9});
        setTimeout(function () {
            equal(tds[1].width, width2, 'tab键不影响单元格宽度');
            start();
        }, 20);
    }, 400);
    stop();
});

//超时，暂时注掉
test('表格粘贴', function () {
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    /*插入表格*/
    var tds = editor.body.getElementsByTagName('td');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[24]);
    ut.setSelected(cellsRange);
    /*确定选区*/
    range.setStart(tds[0], 0).collapse(true).select();
    /*定光标*/
    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    /*ctrl+c*/
    var html = {html: editor.body.innerHTML};
    range.setStart(editor.body.lastChild, 0).collapse(true).select();
    equal(editor.body.getElementsByTagName('table').length, '1', '触发粘贴事件前有1个table');
    editor.fireEvent('beforepaste', html);
    /*粘贴*/
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length, '2', '触发粘贴事件后有2个table');
});
//
//test('trace 3104 粘贴后合并单元格',function(){
//    var div = document.body.appendChild(document.createElement('div'));
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent('');
//    editor.execCommand('inserttable');
//    var trs = editor.body.getElementsByTagName('tr');
//    var ut = editor.getUETable(editor.body.firstChild);
//    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[4].cells[0]);
//    ut.setSelected(cellsRange);
//    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
//    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});
//    ut.clearSelected();
//    var html ={html:editor.body.innerHTML};
//    range.setStart(editor.body.lastChild,0).collapse(true).select();
//    editor.fireEvent('beforepaste',html);
//    editor.fireEvent("afterpaste");
//    var table = editor.body.getElementsByTagName('table');
//    equal(table.length,'2','触发粘贴事件后有2个table');
//    equal(table[1].firstChild.childNodes.length,'5','5行');
//    equal(table[1].firstChild.firstChild.childNodes.length,'1','1列');
//
//    var tds = editor.body.getElementsByTagName('td');
//    ut = editor.getUETable(editor.body.firstChild.nextSibling);
//    cellsRange = ut.getCellsRange(tds[25],tds[29]);
//    ut.setSelected(cellsRange);
//    range.setStart(tds[25], 0 ).collapse( true ).select();
//    editor.execCommand('mergecells');
//    table = editor.body.getElementsByTagName('table');
//    equal(table[1].firstChild.childNodes.length,'1','1行');
//    equal(table[1].firstChild.firstChild.childNodes.length,'1','1列');
//});
//
test('trace 3105 在表格名称中粘贴', function () {
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 2, numRows: 2});
    range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
    editor.execCommand('insertcaption');
    var str = ua.getChildHTML(editor.body);
    var ut = editor.getUETable(editor.body.firstChild);
    var tds = editor.body.getElementsByTagName('td');
    var cellsRange = ut.getCellsRange(tds[0], tds[1]);
    ut.setSelected(cellsRange);
    range.setStart(tds[0], 0).collapse(true).select();

    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    var html = {html: editor.body.innerHTML};
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
    editor.fireEvent('beforepaste', html);
    editor.fireEvent("afterpaste");
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('table').length, '1', '触发粘贴事件后有1个table');
    equal(ua.getChildHTML(editor.body), str, '粘贴无效');
});

test('trace 3106 粘贴标题行', function () {
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('inserttitle');
    var ut = editor.getUETable(editor.body.firstChild);
    var ths = editor.body.getElementsByTagName('th');
    var cellsRange = ut.getCellsRange(ths[0], ths[4]);
    ut.setSelected(cellsRange);
    range.setStart(ths[0], 0).collapse(true).select();

    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    var html = {html: editor.body.innerHTML};
    range.setStart(editor.body.lastChild, 0).collapse(true).select();
    editor.fireEvent('beforepaste', html);
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length, '2', '触发粘贴事件后有2个table');
    if (ua.browser.gecko) {
        //这个比较没意义
//        equal(editor.body.firstChild.firstChild.firstChild.firstChild.tagName.toLowerCase(),'td','不是th，是td');
        range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild, 0).collapse(true).select();
        equal(editor.queryCommandState('inserttable'), -1, '应当不可以插入表格');
        equal(editor.queryCommandState('mergeright'), 0, '应当可以右合并单元格');
    }
    else {
//        equal(editor.body.firstChild.nextSibling.firstChild.firstChild.firstChild.tagName.toLowerCase(),'td','不是th，是td');
        range.setStart(editor.body.firstChild.nextSibling.firstChild.firstChild.firstChild, 0).collapse(true).select();
        equal(editor.queryCommandState('inserttable'), -1, '应当不可以插入表格');
        equal(editor.queryCommandState('mergeright'), 0, '应当可以右合并单元格');
    }
});

test('trace 3114 在单元格内粘贴行', function () {
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');

    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[9]);
    ut.setSelected(cellsRange);
    range.setStart(tds[0], 0).collapse(true).select();
    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    var html = {html: editor.body.innerHTML};
    range.setStart(tds[0], 0).collapse(true).select();
    editor.fireEvent('beforepaste', html);
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length, '1', '触发粘贴事件后有1个table');
    stop();
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.body.getElementsByTagName('tr').length, '7', '触发粘贴事件后有7个tr');
            start();
        }, 50);
    }, 50);
});
test('在单元格中粘贴_粘到最后', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    /*插入表格*/
    var tds = editor.body.getElementsByTagName('td');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[4]);
    ut.setSelected(cellsRange);
    /*确定选区*/
    range.setStart(tds[0], 0).collapse(true).select();
    /*定光标*/
    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    /*ctrl+c*/
    var html = {html: editor.body.innerHTML};
    range.setStart(tds[8], 0).collapse(true).select();
    equal(editor.body.getElementsByTagName('tr').length, 3, '触发粘贴事件前有3个tr');
    equal(editor.body.getElementsByTagName('td').length, 9, '触发粘贴事件前有9个td');
    editor.fireEvent('beforepaste', html);
    /*粘贴*/
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('tr').length, 4, '触发粘贴事件后有4个tr');
    equal(editor.body.getElementsByTagName('td').length, 16, '触发粘贴事件后有12个td');
});
test('在单元格中粘贴_整列', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});
    /*插入表格*/
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0], 0).collapse(true).select();
    editor.execCommand('inserttitle');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0], tds[6]);
    ut.setSelected(cellsRange);
    /*确定选区*/
    range.setStart(tds[0], 0).collapse(true).select();
    /*定光标*/
    ua.keydown(editor.body, {'keyCode': 67, 'ctrlKey': true});
    /*ctrl+c*/
    var html = {html: editor.body.innerHTML};
    range.setStart(tds[6], 0).collapse(true).select();
    equal(editor.body.getElementsByTagName('tr').length, 4, '触发粘贴事件前有4个tr');
    equal(editor.body.getElementsByTagName('th').length, 3, '触发粘贴事件前有3个th');
    equal(editor.body.getElementsByTagName('td').length, 9, '触发粘贴事件前有9个td');
    editor.fireEvent('beforepaste', html);
    /*粘贴*/
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('tr').length, 4, '触发粘贴事件后有4个tr');
    equal(editor.body.getElementsByTagName('th').length, 4, '触发粘贴事件前有4个th');
    equal(editor.body.getElementsByTagName('td').length, 12, '触发粘贴事件后有12个td');
});
test('点击一行的最左边,选中一行', function () {
    if (ua.browser.ie && ua.browser.ie < 9)return;//todo click事件模拟有问题
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 2, numRows: 3});
    /*插入表格*/
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        tds[0].innerHTML = 'hello1';
        tds[1].innerHTML = 'hello2';
        ua.mousemove(tds[0], {clientX: 8, clientY: 24});
        ua.click(tds[0], {clientX: 8, clientY: 24});
        setTimeout(function () {
            var space = ua.browser.ie ? '' : ' ';
            var quot = ua.browser.gecko ? '\"' : '';
            equal(editor.body.style.cursor, 'url(' + quot + editor.options.cursorpath + 'v.png' + quot + '),' + space + 'pointer');
//            //me.body.style.cursor
            var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
            equal(selectedTds.length, 2, '选中一行');
            equal(selectedTds[0].className, 'selectTdClass', '检查样式');
            equal(selectedTds[1].className, 'selectTdClass', '检查样式');
            equal(selectedTds[0].innerHTML, 'hello1', '检查内容');
            equal(selectedTds[1].innerHTML, 'hello2', '检查内容');
            //todo trace 3571
//    ua.click(tds[2],{clientX:12,clientY:24,shiftKey:true});
//    equal(editor.getUETable(editor.body.firstChild).selectedTds.length,6,'');
            start();
        }, 50);
    }, 50);
    stop();
});

test('点击一行的最左边,但是每行只有一列,这时选中单元格中的内容', function () {
    if (ua.browser.ie && ua.browser.ie < 9)return;//todo click事件模拟有问题
    var editor = te.obj[0];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 1, numRows: 1});
    /*插入表格*/
    var tds = editor.body.getElementsByTagName('td');
    tds[0].innerHTML = 'hello';
    setTimeout(function () {
        window.scrollTo(0,0);//保证位置准确

        ua.click(tds[0], {clientX: 10, clientY: 23});
        setTimeout(function () {
            var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
            equal(selectedTds.length, 0, '不选中行');
            if (ua.browser.ie>8) {
                ua.checkResult(editor.selection.getRange(), tds[0].firstChild, tds[0].firstChild, 0, 5, false, '检查选中的range');
            } else {
                ua.checkResult(editor.selection.getRange(), tds[0], tds[0], 0, 1, false, '检查选中的range');
            }
            start();
        }, 500);
    }, 500);
    stop();
});
test('点击一列的最上边,但是每列只有一行,这时选中单元格中的内容', function () {
    if (ua.browser.ie && ua.browser.ie < 9)return;//todo click事件模拟有问题
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 1, numRows: 1});
    /*插入表格*/
    stop();
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        tds[0].innerHTML = 'hello';
        window.scrollTo(0,0);//保证位置准确
        ua.click(tds[0], {clientX: 81, clientY: 9,pageX: 81, pageY: 9});
        setTimeout(function () {
            var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
            equal(selectedTds.length, 0, '不选中列');
            if (ua.browser.ie>8) {
                ua.checkResult(editor.selection.getRange(), tds[0].firstChild, tds[0].firstChild, 0, 5, false, '检查选中的range');
            } else {
                ua.checkResult(editor.selection.getRange(), tds[0], tds[0], 0, 1, false, '检查选中的range');
            }
            start();
        },10);
    }, 50);
});
test('点击一列的最上边,选中一列', function () {
    if (ua.browser.ie && ua.browser.ie < 9)return;//todo click事件模拟有问题
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable', {numCols: 3, numRows: 3});

    /*插入表格*/
    stop();
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        tds[0].innerHTML = 'hello';
        window.scrollTo(0,0);
        ua.mousemove(tds[0], {clientX: 81, clientY: 9});
        var space = ua.browser.ie ? '' : ' ';
        var quot = ua.browser.gecko ? '\"' : '';
        equal(editor.body.style.cursor, 'url(' + quot + editor.options.cursorpath + 'h.png' + quot + '),' + space + 'pointer');
        ua.click(tds[0], {clientX: 81, clientY: 9});
        setTimeout(function () {
            var selectedTds = editor.getUETable(editor.body.firstChild).selectedTds;
            equal(selectedTds.length, 3, '选中一列');
            equal(selectedTds[0].innerHTML, 'hello', '检查内容');
            equal(selectedTds[0].className, 'selectTdClass', '检查样式');
            equal(selectedTds[1].className, 'selectTdClass', '检查样式');
            equal(selectedTds[2].className, 'selectTdClass', '检查样式');

            //todo trace 3571
//    ua.click(tds[2],{clientX:370,clientY:9,shiftKey:true});
//    equal(editor.getUETable(editor.body.firstChild).selectedTds.length,9,'');
            start();
        }, 500);
    }, 50);
});
