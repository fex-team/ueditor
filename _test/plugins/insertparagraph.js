module( 'plugins.insertparagraph' );

test( '插入空行', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( 'hello' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertparagraph', true );
    var br = ua.browser.ie?'':'<br>'
    equal( ua.getChildHTML( body ), '<p>'+br+'</p><p>hello</p>', '插入空行' );
    range.setStart( body.firstChild.nextSibling, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertparagraph', false );
    equal( ua.getChildHTML( body ), '<p>'+br+'</p><p>hello</p><p>'+br+'</p>', '' );
} );