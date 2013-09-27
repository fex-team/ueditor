module( 'plugins.fiximgclick' );

test( 'webkit下图片可以被选中', function() {
    if ( ua.browser.webkit ) {
        var editor = te.obj[0];
        editor.setContent( '<p>修正webkit下图片选择的问题<img src="" />修正webkit下图片选择的问题</p>' );
        var img = editor.body.getElementsByTagName( 'img' )[0];
        var range = editor.selection.getRange();
        var p = editor.body.firstChild;
        ua.click( img );
        range = editor.selection.getRange();
        ua.checkResult( range, p, p, 1, 2, false, '检查当前的range是否为img' );
    }

} );