/**
 * Created by JetBrains PhpStorm.
 * User: shenlixia01
 * Date: 11-8-15
 * Time: 下午3:47
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.cleardoc' );

test( '取得焦点后清空后查看range', function () {
    var editor = te.obj[0];
    editor.setContent( '<p>hello1</p><table><tr><td>hello2</td></tr></table>' );
    editor.focus();
    var body = editor.body;
    editor.execCommand( 'cleardoc' );
    ua.manualDeleteFillData( editor.body );
    if ( UE.browser.ie ) {
        equal( ua.getChildHTML( body ), '<p></p>' );         //目前ie清空文档后不放空格占位符
    }
    else {
        equal( ua.getChildHTML( body ), '<p><br></p>', '清空文档' );
    }
} );

test( '编辑器没有焦点，清空', function () {
    var editor = te.obj[0];
    editor.setContent( '<p>hello1</p><table><tr><td>hello2</td></tr></table>' );
    var body = editor.body;
    editor.execCommand( 'cleardoc' );
    ua.manualDeleteFillData( editor.body );
    if ( UE.browser.ie ) {
        equal( ua.getChildHTML( body ), '<p></p>' );
    }
    else {
        equal( ua.getChildHTML( body ), '<p><br></p>', '清空文档' );
    }
} );

test( 'enterTag为br', function () {
    var editor = te.obj[0];
    editor.options.enterTag='br';
    editor.setContent( '<table><tr><td>hello</td></tr></table>' );
    var body = editor.body;
    editor.execCommand( 'cleardoc' );
    ua.manualDeleteFillData( editor.body );
    if (UE.browser.ie) {
        equal(ua.getChildHTML(body), '<br>', '清空文档');
    }
    else {
        equal(ua.getChildHTML(body), '<br>', '清空文档');
    }
} );

/*trace1061*/
test( '删除时不会删除block元素', function() {
    if(ua.browser.opera) return 0;
    var editor = te.obj[0];
    editor.setContent( '<h1>hello</h1>' );
    setTimeout(function() {
        var range = te.obj[1];
        range.selectNode( editor.body.firstChild ).select();
        editor.execCommand( 'cleardoc' );
        equal( editor.body.lastChild.tagName.toLowerCase(), 'p', 'h1替换为p' );
        ua.manualDeleteFillData(editor.body);
        if ( !baidu.editor.browser.ie )
            equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
        else
            equal( editor.body.lastChild.innerHTML, '', '内容被删除了' );
//        if(!ua.browser.opera){
//            range = editor.selection.getRange();
//            equal( range.startContainer.tagName.toLowerCase(), 'p', '光标位置' );
//        }
        start();
    },50);
    stop();
} );

test('选中文本，清空',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>hello</p><p>hello1</p>')
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('cleardoc');
    var br = ua.browser.ie?'':'<br>';
    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','');
});

/*trace 1104*/
test( '全选后删除', function() {
    var editor = te.obj[0];
    if ( baidu.editor.browser.ie )
        editor.setContent( '<p>dsafds&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>' );
    else
        editor.setContent( '<p><br></p><p><br></p><p><br></p><p>d<br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>' );
    setTimeout(function() {
        editor.focus();
        editor.execCommand( 'selectall' );
        editor.execCommand( 'cleardoc' );
        ua.manualDeleteFillData(editor.body);
        equal( editor.body.childNodes.length, 1, '删除后只剩一个bolock元素' );
        equal( editor.body.firstChild.tagName.toLowerCase(), 'p', '删除后只剩一个p' );
        if ( !UE.browser.ie )
            equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
        else
            equal( editor.body.lastChild.innerHTML, '', '内容被删除了' );
        start();
    },50);
    stop();
} );

test( '删除所有列表', function() {
    var editor = te.obj[0];
    editor.setContent('<ol><li>hello1</li><li>你好</li></ol>');
    setTimeout(function() {
        var body = editor.body;
        editor.focus();
        editor.execCommand( 'selectall' );
        editor.execCommand( 'cleardoc' );
        equal( body.childNodes.length, 1, '删除后只剩一个ol元素' );
        var br = UE.browser.ie?"":"<br>";
        equal( ua.getChildHTML(body), '<p>'+br+'</p>', '删除后只剩一个p' );
        start();
    },50);
    stop();
} );