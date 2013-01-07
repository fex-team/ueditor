module( "plugins.blockquote" );

/*trace 967*/
//这个用例暂不测ie，因为ie中输入回车无效
/*
 test( '切换到源码模式再切换回来点引用', function () {
 if(!ua.browser.ie){
 var editor = te.obj[0];
 var body = editor.body;
 editor.setContent( 'hello' );
 editor.execCommand( 'source' );
 var tas = editor.iframe.parentNode.getElementsByTagName( 'textarea' );
 tas[tas.length - 1].value = '';
 stop();
 //source.js中有延时操作
 setTimeout( function () {
 editor.execCommand( 'source' );
 editor.execCommand( 'blockquote' );
 //        //模拟回车,在引用后回车两段都是引用
 setTimeout( function () {
 ////            //firefox竟然要多触发一次。。什么乱七八糟的bug啊
 //////            if ( ua.getBrowser() == "firefox" )
 //////                te.presskey( "enter", "" );
 editor.focus();
 te.presskey( "enter", "" );
 setTimeout( function () {
 editor.focus();
 setTimeout( function () {
 var bq = body.firstChild;
 equal( body.childNodes.length, 1, 'body有1个孩子' );
 equal( bq.childNodes.length, 2, 'blockquote有2个孩子' );
 ok( bq.childNodes[0]&&bq.childNodes[0].tagName.toLowerCase()=='p', '第一个孩子是p' );
 ok(  bq.childNodes[1]&&bq.childNodes[1].tagName.toLowerCase()=='p', '第二个孩子是p' );
 start();
 }, 50 );
 }, 30 );//
 }, 60 );
 }, 50 );
 }
 else
 ok(ua.browser.ie,'这个用例暂不测，因为ie中输入回车无效');
 } );
 */

test( '在表格中添加和去除引用', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( 'hello<table><tbody><tr><td>hello</td></tr></tbody></table>' );
        var body = editor.body;
        /*闭合选取*/
        var tds = body.lastChild.getElementsByTagName( 'td' );
        range.setStart( tds[0].firstChild, 2 ).collapse( true ).select();
        editor.execCommand( 'blockquote' );
        equal( body.lastChild.tagName.toLowerCase(), 'blockquote', '引用加到表格外面去了' );
        equal( tds[0].firstChild.nodeType, 3, 'td里仍然是文本' );
        equal( tds[0].firstChild.data, 'he', 'td里仍然是文本he' );
        /*再执行一次引用，会去掉引用*/
        range.setStart( tds[0].firstChild, 2 ).collapse( true ).select();
        editor.execCommand( 'blockquote' );
        //1.2版本table外加了div
        ok( body.lastChild.tagName.toLowerCase() != 'blockquote', '引用去掉了' );
        /*不闭合选中表格，添加引用*/
        range.selectNode( tds[0] ).select();
        editor.execCommand( 'blockquote' );
        equal( body.lastChild.tagName.toLowerCase(), 'blockquote', '非闭合方式选中添加引用' );

} );


test( '在列表中添加引用', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( 'hello<ol><li><p>hello1</p></li><li><p>hello2</p></li></ol>' );
        var body = editor.body;
        /*闭合选取*/
        var lis = body.lastChild.getElementsByTagName( 'li' );
        range.setStart( lis[0].firstChild, 1 ).collapse( 1 ).select();
        editor.execCommand( 'blockquote' );
        equal( body.lastChild.tagName.toLowerCase(), 'blockquote', '引用加到列表外面去了' );
        equal( lis[0].firstChild.nodeType, 1, '列表里套着p' );
        equal( lis[0].firstChild.firstChild.data, 'hello1', '列表里仍然是文本hello1' );
} );

/*trace 1183*/
test( 'trace1183：选中列表中添加引用，再去掉引用', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p>hello1</p><p>hello2</p>' );
        var body = editor.body;
        range.setStart( body, 0 ).setEnd( body, 2 ).select();
        /*添加列表*/
        editor.execCommand( 'insertorderedlist' );
        ua.manualDeleteFillData( editor.body );
        var ol = body.getElementsByTagName( 'ol' )[0];
        var html = ua.getChildHTML( ol );

        editor.execCommand( 'blockquote' );
        editor.execCommand( 'blockquote' );
        ua.manualDeleteFillData( editor.body );
        equal( ua.getChildHTML( body.getElementsByTagName( 'ol' )[0] ), html, '引用前后列表没有发生变化' );
        equal( body.getElementsByTagName( 'ol' ).length, 1, '只有一个有序列表' );
} );


test( '对段落添加引用和去除引用', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p><strong><em>hello1</em></strong></p><p>hello2 world</p>' );
        var body = editor.body;
        /*不闭合添加引用*/
        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
        editor.execCommand( 'blockquote' );

        equal( ua.getChildHTML( body ), '<blockquote><p><strong><em>hello1</em></strong></p><p>hello2&nbsp;world</p></blockquote>', '不闭合添加引用' );
        equal( editor.queryCommandState( 'blockquote' ), 1, '引用高亮' );
        /*闭合去除引用*/
        range.setStart( body.firstChild.lastChild, 0 ).collapse( true ).select();
        editor.execCommand( 'blockquote' );
        equal( ua.getChildHTML( body ), '<blockquote><p><strong><em>hello1</em></strong></p></blockquote><p>hello2&nbsp;world</p>', '闭合去除引用' );
        equal( editor.queryCommandState( 'blockquote' ), 0, '引用不高亮' );
        /*非闭合去除引用*/
        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
        editor.execCommand( 'blockquote' );
        equal( ua.getChildHTML( body ), '<p><strong><em>hello1</em></strong></p><p>hello2&nbsp;world</p>' );
        equal( editor.queryCommandState( 'blockquote' ), 0, '非闭合去除引用后，引用不高亮' );
        /*闭合添加引用*/
        range.setStart( body.lastChild, 0 ).collapse( true ).select();
        editor.execCommand( 'blockquote' );
        equal( ua.getChildHTML( body ), '<p><strong><em>hello1</em></strong></p><blockquote><p>hello2&nbsp;world</p></blockquote>', '闭合添加引用 ' );
} );


test( 'startContainer为body添加引用', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( 'hello<ol><li>hello1</li><li>hello2</li></ol>' );
        var body = editor.body;
        /*不闭合选取*/
        range.setStart( body, 0 ).setEnd( body, 2 ).select();
        editor.execCommand( 'blockquote' );
        var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':(ua.browser.webkit?' style=\"padding-left: 30px;\"':' style=\"padding-left: 30px;\"');

        equal( ua.getChildHTML( body ), '<blockquote><p>hello</p><ol'+padding+'><li><p>hello1</p></li><li><p>hello2</p></li></ol></blockquote>', '选中body加引用' );
        equal( editor.queryCommandState( 'blockquote' ), 1, '引用高亮' );
        /*闭合选取*/
        editor.undoManger.undo();
        range.setStart( body, 1 ).collapse( true ).select();
        equal( editor.queryCommandState( 'blockquote' ), 0, '引用不高亮' );
} );
//ie 不通过
test('aa标签',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    if(!ua.browser.ie){
        editor.setContent('<aa>hello</aa>');
        range.setStart(editor.body.firstChild.firstChild,0).collapse(1).select();
        editor.execCommand('blockquote');
        equal(ua.getChildHTML(editor.body),'<blockquote><aa>hello</aa></blockquote>','aa标签');
        editor.setContent('hello<aa>hello2</aa>');
        range.setStart(editor.body.lastChild.firstChild,0).setEnd(editor.body.lastChild.firstChild,3).select();
        editor.execCommand('blockquote');
        equal(ua.getChildHTML(editor.body),'<p>hello</p><blockquote><aa>hello2</aa></blockquote>','<aa>');
    }
});

test('列表内引用',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':(ua.browser.webkit?' style=\"padding-left: 30px;\"':' style=\"padding-left: 30px;\"');

    editor.setContent('<ol><li><blockquote><p>hello1</p></blockquote></li><blockquote><li><p>hello2</p></li></blockquote></ol>');
    debugger
    range.selectNode(editor.body).select();
    editor.execCommand('blockquote');
    equal(ua.getChildHTML(editor.body ),'<ol'+padding+'><li><p>hello1</p></li><ul'+padding+'><li><p>hello2</p></li></ul></ol>','引用删除');
});