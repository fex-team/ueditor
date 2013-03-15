module( "plugins.paragraph" );
/**
 * h1和p之间的转换
 * 表格中添加p和h1
 * 列表里加h1
 * 传入2个参数，style和attrs
 */

test( '不闭合h1和p之间的转换', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p>' );
    setTimeout(function(){
    range.selectNode( body.firstChild.firstChild ).select();
    /*p===>h1*/
    editor.execCommand( 'paragraph', 'h1' );
    equal( ua.getChildHTML( body ), '<h1>hello</h1>' );
    equal( editor.queryCommandValue( 'paragraph' ), 'h1', '当前的blcok元素为h1' );
    /*h1===>p*/
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'paragraph', 'p' );
    equal( ua.getChildHTML( body ), '<p>hello</p>' );
    /*多个段落的部分文本*/
    editor.setContent( '<p>hello</p><h2>hello2</h2>' );
        setTimeout(function(){
    range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.lastChild.firstChild, 1 ).select();
    editor.execCommand( 'paragraph', 'h3' );
    equal( ua.getChildHTML( body ), '<h3>hello</h3><h3>hello2</h3>' );
    equal( editor.queryCommandValue( 'paragraph' ), 'h3', '当前的blcok元素为h3' );
        start();
    },50);
    },50);
    stop();
} );

test( '闭合h1和p之间的转换', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p><p>hello2</p>' );
    setTimeout(function(){
    range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
    /*p===>h1*/
    editor.execCommand( 'paragraph', 'h1' );
    equal( ua.getChildHTML( body ), '<h1>hello</h1><p>hello2</p>' );
    /*h1===>p*/
    range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
    editor.execCommand( 'paragraph', 'p' );
    equal( ua.getChildHTML( body ), '<p>hello</p><p>hello2</p>' );
    equal( editor.queryCommandValue( 'paragraph' ), 'p', '当前的blcok元素为p' );
        start();
    },50);

stop();
} );


/*如果是h1===>p并且传参的话，h1不会变化。因为这段代码的操作是为了indent和justify做的，传入参数p只是为了好处理，所以不支持h1变为p*/
test( '传入段落的样式', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p><p>hello2</p>' );
    setTimeout(function(){
    range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
    /*p===>p，但是变化了样式*/
    editor.execCommand( 'paragraph', 'p', {style:'text-indent:2em'} );
    equal( body.firstChild.style.textIndent, '2em', '改变了第一个孩子的缩进量' );
    equal( body.firstChild.tagName.toLowerCase(), 'p', 'tagName仍然是p' );

    /*p===>h4，但是变化了样式*/
    editor.execCommand( 'paragraph', 'h4', {style:'text-indent:3em'} );
    equal( body.firstChild.style['textIndent'], '3em', '改变了第一个孩子的缩进量' );
    equal( body.firstChild.tagName.toLowerCase(), 'h4', 'tagName是h4' );
    start();
},50);

stop();
} );


test( '对表格设置样式', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<table><tbody><tr><td><h1>hello1</h1></td></tr><tr><td></td></tr></tbody></table>' );
    setTimeout(function(){
    var tds = body.getElementsByTagName( 'td' );
    range.setStart( tds[0].firstChild, 0 ).collapse( 1 ).select();
    editor.currentSelectedArr = [tds[0]];
    /*h4===>p，但是变化了样式*/
    editor.execCommand( 'paragraph', 'p', {style:'text-indent:3em'} );
    equal( tds[0].firstChild.style['textIndent'], '3em', '改变了第一个孩子的缩进量' );
    equal( tds[0].firstChild.tagName.toLowerCase(), 'h1', 'tagName仍然是h1' );
    range.setStart( tds[1], 0 ).collapse( 1 ).select();
    editor.currentSelectedArr = [tds[1]];
    editor.execCommand( 'paragraph', 'p', {style:'text-indent:3em'} );
//    ua.manualDeleteFillData( editor.body );
    ua.clearWhiteNode(tds[1]);
    equal( tds[1].firstChild.style['textIndent'], '3em', '改变了第一个孩子的缩进量' );
    equal( tds[1].firstChild.tagName.toLowerCase(), 'p', 'tagName是p' );
        start();
    },50);

    stop();
} );
