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
                //目前ie清空文档后不放空格占位符
                equal( ua.getChildHTML( body ), '<p></p>' );
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
                //目前ie清空文档后不放空格占位符
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
        //目前ie清空文档后不放空格占位符
        equal(ua.getChildHTML(body), '<br>', '清空文档');
    }
    else {
        equal(ua.getChildHTML(body), '<br>', '清空文档');
    }
} );