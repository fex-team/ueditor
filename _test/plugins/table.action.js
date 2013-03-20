/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-25
 * Time: 下午4:40
 * To change this template use File | Settings | File Templates.
 */
test( 'backspace事件:删除caption', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(5);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('caption').length,0,'删除caption');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },20);
});

test( 'backspace事件:deleterow', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(5);
    editor.addListener('saveScene',function(){
       ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[2]);
    ut.setSelected(cellsRange);
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('tr').length,2,'删除整行');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
      start();
    },20);
});

test( 'backspace事件:deletecol', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(5);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[2].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('tr')[0].getElementsByTagName('td').length,2,'删除整列');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },20);
});

test( 'backspace事件:delcells', function() {
   //TODO
});

/*trace 3022*/
test( 'trace 3022 向右合并--tab键', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(9);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout( function() {
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        ua.keydown(editor.body,{'keyCode':90,'ctrlKey':true});
        setTimeout( function() {
            ua.keydown(editor.body,{'keyCode':13});
            equal(te.obj[0].body.getElementsByTagName('caption').length,1,'撤销删除caption');
            equal(te.obj[0].body.getElementsByTagName('th').length,0,'不会误插入标题行');
            equal(te.obj[0].body.getElementsByTagName('table').length,1,'不会增加表格数量');
            equal(te.obj[0].body.getElementsByTagName('tr').length,3,'不会增加表格行数量');
            equal(te.obj[0].body.getElementsByTagName('tr')[0].cells.length,3,'不会增加表格列数量');
            equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
            equal(te.obj[0].selection.getRange().startContainer.parentNode,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
            start();
        },20);
    },20);
});

/*trace 3067*/
test( 'trace 3067 向右合并--tab键', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    ua.manualDeleteFillData( editor.body );

    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    range = editor.selection.getRange();
    var common = range.getCommonAncestor(true, true);
    equal(common.colSpan,2,'tab键前光标位于合并后的单元格中');
    ua.keydown(editor.body,{'keyCode':9});
    setTimeout(function(){
        range = editor.selection.getRange();
        common = range.getCommonAncestor(true, true);
        equal(common.colSpan,1,'tab键前光标跳到合并后单元格的下一个单元格中');
        start();
    },20);
    stop();
} );

test('拖拽',function(){
    if (browser.ie && browser.version < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable');
    ua.manualDeleteFillData( editor.body );
    var tds = te.obj[0].body.getElementsByTagName('td');
    equal(tds[1].width,71,'拖拽前');
    ua.mousemove(tds[1],{clientX:199,clientY:100});
    ua.mousedown(tds[1],{clientX:199,clientY:100});
    setTimeout(function(){
        ua.mousemove(tds[1],{clientX:299,clientY:100});
        ua.mouseup(tds[1],{clientX:299,clientY:100});
        equal(tds[1].width,143,'拖拽后');
        start();
    },20);
    stop();
});