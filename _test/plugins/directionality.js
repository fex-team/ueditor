module( "plugins.directionality" );

//1 notblockelement&&collapsed=false
test( '非块元素，不闭合', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( 'xxxx<b><i>gggsiekes</i></b>' );
    range.selectNode( d.getElementsByTagName( "strong" )[0] ).collapse( true ).select();

    equal( editor.queryCommandValue( 'directionality' ), "ltr", "ltr queryCommandValue" );
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\">xxxx<strong><em>gggsiekes</em></strong></p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\">xxxx<strong><em>gggsiekes</em></strong></p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

} );
//2 blockelement&&collapsed=false
test( '块元素，不闭合', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<h1>gggsiekes</h1>' );
    range.selectNode( d.getElementsByTagName( "h1" )[0] ).select();

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<h1 dir=\"ltr\">gggsiekes</h1>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<h1 dir=\"rtl\">gggsiekes</h1>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

} );

test( '非块元素，闭合', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<strong><em>gggsiekes</em></strong>' );
    range.selectNode( d.getElementsByTagName( "strong" )[0].firstChild ).collapse( true ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\"><strong><em>gggsiekes</em></strong></p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\"><strong><em>gggsiekes</em></strong></p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

    editor.setContent( '<strong><em>gggsiekes</em></strong>' );
    range.selectNode( d.getElementsByTagName( "strong" )[0] ).collapse( true ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\"><strong><em>gggsiekes</em></strong></p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "查询文字输入方向为从右向左" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\"><strong><em>gggsiekes</em></strong></p>", "从左向右" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "查询文字输入方向为从左向右" );

} );
//4 range between blockelement and notblockelement
test( '选区包含块和非块元素', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<strong><em>gggsiekes</em></strong><p>xx</p>' );
    range.setStart( d.getElementsByTagName( "strong" )[0].firstChild, 0 ).setEnd( d.getElementsByTagName( "p" )[1].firstChild, 2 ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\"><strong><em>gggsiekes</em></strong></p><p dir=\"rtl\">xx</p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\"><strong><em>gggsiekes</em></strong></p><p dir=\"ltr\">xx</p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

} );
//5  betweenblockelement
test( '选区在两个块元素之间', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<p dir="rtl">sss</p><p>xx</p>' );
    range.setStart( d.getElementsByTagName( "p" )[0].firstChild, 0 ).setEnd( d.getElementsByTagName( "p" )[1].firstChild, 2 ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\">sss</p><p dir=\"rtl\">xx</p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\">sss</p><p dir=\"ltr\">xx</p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

} );
//6 br
test( 'betweenblockelement', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<p>xx</p>br' );
    range.setStart( d.getElementsByTagName( "p" )[0].firstChild, 0 ).setEnd( db.lastChild, 1 ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\">xx</p><p dir=\"rtl\">br</p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\">xx</p><p dir=\"ltr\">br</p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

} );
//7 &nbsp;
test( '空格&nbsp;', function() {
    var editor = te.obj[0],d = editor.document,range = te.obj[1],db = editor.body;
    editor.setContent( '<p>xx</p>&nbsp;' );
    range.setStart( d.getElementsByTagName( "p" )[0].firstChild, 0 ).setEnd( db.lastChild, 1 ).select();
    editor.execCommand( 'directionality', "rtl" );
    equal( ua.getChildHTML( db ), "<p dir=\"rtl\">xx</p><p dir=\"rtl\">&nbsp;</p>", "directionrtl" );
    equal( editor.queryCommandValue( 'directionality' ), "rtl", "directionrtl queryCommandValue" );

    editor.execCommand( 'directionality', "ltr" );
    equal( ua.getChildHTML( db ), "<p dir=\"ltr\">xx</p><p dir=\"ltr\">&nbsp;</p>", "directionltr" );
    equal( editor.queryCommandValue( 'directionality' ), "ltr", "directionltr queryCommandValue" );

} );

//test('body&&currentSelectedArr',function(){
//    var editor=te.obj[0];
//    var range=te.obj[1];
//    editor.setContent('<p>xx</p>');
//    range.setStart(editor.body,0).collapse(1).select();
//    editor.execCommand('directionality', 'rtl');
//    if(!ua.browser.ie){
//        equal( ua.getChildHTML( editor.body ), "<p dir=\"rtl\"></p><p>xx</p>", "directionrtl" );
//        editor.currentSelectedArr=[editor.body.lastChild];
//        editor.execCommand('directionality', 'ltr');
//        debugger
//        equal( ua.getChildHTML( editor.body ), "<p dir=\"rtl\"></p><p dir=\"ltr\">xx</p>", "directionltr" );
//    }
//    else{
//        equal( ua.getChildHTML( editor.body ), "<p dir=\"rtl\">xx</p>", "directionrtl" );
//        editor.currentSelectedArr=[editor.body.lastChild];
//        editor.execCommand('directionality', 'ltr');
//        equal( ua.getChildHTML( editor.body ), "<p dir=\"ltr\">xx</p>", "directionltr" );
//    }
//
//})
