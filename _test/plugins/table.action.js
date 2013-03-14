/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-25
 * Time: 下午4:40
 * To change this template use File | Settings | File Templates.
 */
test( '注册del/backspace事件:删除caption', function() {
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
test( '注册del/backspace事件:deleterow', function() {
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
test( '注册del/backspace事件:deletecol', function() {
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
test( '注册del/backspace事件:delcells', function() {
   //TODO
});