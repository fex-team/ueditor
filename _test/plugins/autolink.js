module( 'plugins.autolink' );

//这个插件是针对非ie的，单测用例同样只针对非ie,仍需手动测试检验ie与非ie下效果是否一致
test( '输入超链接后回车', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>http://www.baidu.com</p>' );
        stop();
        setTimeout( function() {
            range.setStart( body.firstChild.firstChild, body.firstChild.firstChild.length).collapse( 1 ).select();
            setTimeout( function() {
                ua.keydown(editor.body,{'keyCode':13});
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                equal( ua.getChildHTML( a ), 'http://www.baidu.com', '检查a的内容' );
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                ok( a&&$( a ).attr( '_src' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的_src' );
                start();
            }, 20);
        } ,20);
    }
} );

test( '输入超链接后按空格', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        setTimeout( function() {
            editor.setContent( '<p>http://www.baidu.com</p>' );
            range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
            ua.keydown(editor.body,{'keyCode':32});
            setTimeout( function() {
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                equal( ua.getChildHTML( a ), 'http://www.baidu.com', '检查a的内容' );
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                ok( a&&$( a ).attr( '_src' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的_src' );
                start();
            }, 20);
        },20 );
        stop();
    }
} );

test( '字符前面有内容', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p><img src="" alt=""><span style="color: red">http://www.baidu.com</span></p>' );
        range.setStart( body.firstChild, 2 ).collapse( 1 ).select();
        stop();
        setTimeout( function() {
            ua.keydown(editor.body,{'keyCode':32});
            setTimeout( function() {
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                var html = 'http://www.baidu.com';
                equal( ua.getChildHTML( a ), 'http://www.baidu.com', '检查a的内容' );
                start();
            }, 20 );
        }, 20 );
    }
} );

test( '在p后面回车', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>www.baidu.com</p>' );
        setTimeout( function() {
            range.setStart( body.firstChild ,1 ).collapse( 1 ).select();
            ua.keydown(editor.body,{'keyCode':13});
            setTimeout( function() {
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                ok( a&&$( a).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                equal( ua.getChildHTML( a ), 'www.baidu.com', '检查a的内容' );
                start();
            }, 20 );
        }, 20 );
        stop();
    }
} );
///*trace 1709 在“你好http://www.baidu.com”后回车／空格，各浏览器表现不一致*/
////这种情况，在ie中可以生成自动连接，非ie不可，现在以生成连接为期望结果
test( 'trace 1709 在与其他文本相连的链接后空格', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>你好http://www.baidu.com</p>' );
        setTimeout( function() {
            range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
            ua.keydown(editor.body,{'keyCode':32});
            setTimeout( function() {
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                equal( ua.getChildHTML( a ), 'http://www.baidu.com', '检查a的内容' );
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                start();
            }, 20 );
        }, 20);
        stop();
    }
} );
////修改：对P中的文字内容，原：<p>你好htp://ww.baidu.com</p>
test( '你好htp://ww.baidu.com  后面回车', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>你好htp://www.baidu.com</p>' );
        setTimeout( function() {
            range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
            ua.keydown(editor.body,{'keyCode':32});
            setTimeout( function() {
                equal(body.firstChild.firstChild.nodeValue,'你好htp://','你好htp:// 部分没有转换');
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                equal( ua.getChildHTML( a ), 'www.baidu.com', '检查a的内容' );
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                start();
            }, 20 );
        }, 20 );
        stop();
    }
} );
//<p>欢迎<strong>使用</strong>ueditor!</p>
test( 'trace 2121', function() {
    if(!ua.browser.ie){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p><span style="color:#ff0000;">欢迎<strong>使用</strong></span>ueditor!www.baidu.com</p>' );
        stop();
        setTimeout( function() {
            range.setStart( body.firstChild.lastChild, body.firstChild.lastChild.length).collapse( 1 ).select();
            setTimeout( function() {
                ua.keydown(editor.body,{'keyCode':13});
                var a = body.firstChild.getElementsByTagName( 'a' )[0];
                equal( ua.getChildHTML( a ), 'www.baidu.com', '检查a的内容' );
                ok( a&&$( a ).attr( 'href' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的href' );
                ok( a&&$( a ).attr( '_src' ).indexOf( 'http://www.baidu.com' ) != -1, '检查a的_src' );
                start();
            }, 20);
        } ,20);
    }
} );
//test( '粘贴进来的http文本后回车', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    setTimeout( function() {
//        editor.setContent( '<p><br></p>' );
//        editor.focus();
//        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
//        te.setClipData( "http://www.google.com" );
//        setTimeout( function() {
//            editor.focus();
//            setTimeout( function() {
//                editor.focus();
//                te.presskey( "ctrl", "v" );
//                editor.focus();
//                setTimeout( function() {
//                    te.presskey( "enter", "" );
//                    editor.focus();
//                    setTimeout( function() {
//                        var a = body.firstChild.getElementsByTagName( 'a' )[0];
//                        equal( ua.getChildHTML( a ), 'http://www.google.com', '检查a的内容' );
//                        start();
//                    }, 100 );
//
//                }, 100 );
//            }, 100 );
//        }, 100 );
//    } );
//    stop();
//} );
//
