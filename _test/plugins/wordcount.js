module( 'plugins.wordcount' );

test( 'trace 1743 右键删除后计算字数', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    editor.render(div);
    var range = new baidu.editor.dom.Range( te.obj[2].document );
    stop();
    setTimeout(function(){
        editor.setContent('<p>hello</p>');
        range.setStart(editor.body.firstChild,0).collapse(true).select();
        editor.execCommand( 'selectall' );
        editor.execCommand( 'cleardoc' );
        equal( editor.getContentLength(true),0,'插入成功');
        div.parentNode.removeChild(div);
        start();
    },50);
} );

test( '空格', function () {
    var editor = te.obj[2];
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    editor.render(div);
    stop();
    setTimeout(function(){
        editor.setContent('           \ufeff\u200B\t\t    \n\n\t\n\b\t\n\b\u200B\t\t\n\n    ');
        if(ua.browser.ie!=6)
            equal( editor.getContentLength(true),22,'清空后编辑器中22个空格');
        div.parentNode.removeChild(div);
        start();
    },50);
} );

test('超出最大',function(){
    var editor = new UE.ui.Editor({'UEDITOR_HOME_URL':'../../../','wordCount':true,'maximumWords':10,'autoFloatEnabled':false});
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    editor.render(div);
    expect(2);
    stop();
    setTimeout(function(){
        editor.setContent('hello hello hello');
        equal( editor.getContentLength(true),17,'仅统计字数');
        div.parentNode.removeChild(div);
        start();
    },50);
    editor.addListener( "wordcountoverflow", function() {
        ok( true, "超出最大" );
    } );
});
