module( 'plugins.shortcutkeys' );
//键盘操作取不到range，定不到位，尤其ie里ctrl+b把收藏夹打开了。。。

test( 'ctrl+i', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
//    setTimeout( function() {
        editor.setContent( '<p>没有加粗的文本</p>' );
        range.selectNode( body.firstChild ).select();
        var p = body.firstChild;
        editor.focus();
        setTimeout( function() {
//            te.presskey( 'ctrl', 'i' );
            ua.keydown(editor.body,{'keyCode':73,'ctrlKey':true});
            editor.focus();
            setTimeout( function() {
                equal( ua.getChildHTML( p ), '<em>没有加粗的文本</em>' );
                start();
            }, 150 );
        }, 100 );

//    }, 100 );
    stop();
} );
//
test( 'ctrl+u', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    stop();

        editor.setContent( '<p>没有加粗的文本</p>' );
    setTimeout( function() {
        range.selectNode( body.firstChild ).select();
        var p = body.firstChild;

        editor.focus();
//        setTimeout( function() {
//            editor.focus();
            setTimeout( function() {
                var html = '<span style="text-decoration: underline">没有加粗的文本</span>';
                ua.checkHTMLSameStyle( html, editor.document, body.firstChild, '文本被添加了下划线' );
                start();
            }, 150 );
//        }, 100 );
//        te.presskey( 'ctrl', 'u' );
        ua.keydown(editor.body,{'keyCode':85,'ctrlKey':true});
    }, 150 );
} );
//
test( 'ctrl+z/y', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
//    setTimeout( function() {
        editor.setContent( '<p>没有加粗的文本</p>' );
        range.selectNode( body.firstChild ).select();
        var p = body.firstChild;

        editor.focus();
        setTimeout( function() {
//            te.presskey( 'ctrl', 'b' );
//            editor.focus();
            ua.keydown(editor.body,{'keyCode':66,'ctrlKey':true});
            setTimeout( function() {
                equal( ua.getChildHTML( p ), '<strong>没有加粗的文本</strong>' );
//                editor.focus();
//                te.presskey( 'ctrl', 'z' );
                ua.keydown(editor.body,{'keyCode':90,'ctrlKey':true});
//                editor.focus();
                setTimeout( function() {
                    editor.focus();
                    equal( ua.getChildHTML( body.firstChild ), '没有加粗的文本' );
//                    setTimeout( function() {
//                        te.presskey( 'ctrl', 'y' );
                        ua.keydown(editor.body,{'keyCode':89,'ctrlKey':true});
                        editor.focus();
                        setTimeout( function() {
//                            editor.focus();
                            equal( ua.getChildHTML( body.firstChild ), '<strong>没有加粗的文本</strong>' );
                            start();
                        }, 100 );
//                    }, 100 );
                }, 100 );
            }, 150 );
        }, 100 );

//    }, 150 );
    stop();
} );
//
test( 'ctrl+a', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
//    setTimeout( function() {
        editor.setContent( '<p>全选的文本1</p><h1>全选的文本2</h1>' );
        range.selectNode( body.firstChild ).select();
        var p = body.firstChild;
        ua.keydown(editor.body,{'keyCode':65,'ctrlKey':true});
//        setTimeout( function() {
//            editor.focus();
//            te.presskey( 'ctrl', 'a' );
//            editor.focus();
            setTimeout( function() {
                var range = editor.selection.getRange();
                if ( ua.browser.gecko )
                    ua.checkResult( range, body, body, 0, 2, false, '查看全选后的range' );
                else
                    ua.checkResult( range, body.firstChild.firstChild, body.lastChild.firstChild, 0, 6, false, '查看全选后的range' );
                start();
            }, 150 );
//        }, 100 );
//    }, 100 );

    stop();
} );
//
test( 'ctrl+b', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
//    setTimeout( function() {
        editor.setContent( '<p>没有加粗的文本</p>' );
        range.selectNode( body.firstChild ).select();
        editor.focus();
        setTimeout( function() {
            ua.keydown(editor.body,{'keyCode':66,'ctrlKey':true});
//            te.presskey( 'ctrl', 'b' );
//            editor.focus();
            setTimeout( function() {
                equal( ua.getChildHTML( body.firstChild ), '<strong>没有加粗的文本</strong>' );
                start();
            }, 150 );
        }, 150 );
//    } ,50);
    stop();
} );