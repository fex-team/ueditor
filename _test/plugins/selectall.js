module( "plugins.selectall" );
test( 'normal', function () {
    var editor = te.obj[0], db = editor.body;
    editor.setContent( '<p><em>xxxx</em></p>ssss' );
    editor.focus();
    editor.execCommand( 'selectAll' );
    //equal( UE.plugins['selectall'].notNeedUndo, 1, "notNeedUndo==1" );
    editor.execCommand( "bold" );
    equal( ua.getChildHTML( db ), "<p><strong><em>xxxx</em></strong></p><p><strong>ssss</strong></p>", "after calling selectAll command" );
} );

test( 'a part of the content is selected', function () {
    var editor = te.obj[0], d = editor.document, range = te.obj[1], db = editor.body;
    editor.setContent( '<p><em>xxxx</em></p>ssss' );
    range.selectNode( db.lastChild.firstChild ).select();
    editor.execCommand( "bold" );
    equal( ua.getChildHTML( db ), "<p><em>xxxx</em></p><p><strong>ssss</strong></p>", "before calling selectAll command" );
    editor.execCommand( 'selectAll' );
    //equal( UE.plugins['selectall'].notNeedUndo, 1, "notNeedUndo==1" );
    editor.execCommand( "bold" );
    equal( ua.getChildHTML( db ), "<p><strong><em>xxxx</em></strong></p><p><strong>ssss</strong></p>", "after calling selectAll command" );
} );

test( 'trace1743 :content is null', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><br></p>' );
    //TODO 现在必须先focus再selectall，trace1743
    editor.execCommand( 'selectAll' );
    equal( ua.getChildHTML( editor.body ), "<p><br></p>", "content is null" );
    //equal(UE.plugins['selectall'].notNeedUndo, 1, "notNeedUndo==1" );
    range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( "bold" );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( editor.body ), "<p><strong></strong><br></p>", "after calling command bold" );
} );

test( 'ctrl+a', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>全选的文本1</p><h1>全选的文本2</h1>' );
    range.selectNode( body.firstChild ).select();
    var p = body.firstChild;
    ua.keydown(editor.body,{'keyCode':65,'ctrlKey':true});
    setTimeout( function() {
        var range = editor.selection.getRange();
//        if ( ua.browser.gecko||ua.browser.ie>8 )
//            ua.checkResult( range, body, body, 0, 2, false, '查看全选后的range' );
//        else
           if(ua.browser.gecko||ua.browser.webkit){
               ua.checkResult( range, body, body, 0, 2, false, '查看全选后的range' );
           }else{
            ua.checkResult( range, body.firstChild.firstChild, body.lastChild.firstChild, 0, 6, false, '查看全选后的range' );
           }
        start();
    }, 150 );
    stop();
} );
test('contextmenu 右键全选', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    stop();
    editor.setContent('asdfg');
    ua.contextmenu(editor.body);
    var lang = editor.getLang("contextMenu");
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    equal(editor.selection.getRange().collapsed, true, '检查选区--闭合');
    ua.click(menuBody.childNodes[0]);
    setTimeout(function () {
        equal(editor.selection.getRange().collapsed, false, '检查选区--非闭合');
        document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
        te.dom.push(editor.container);
        start();
    }, 50);
});