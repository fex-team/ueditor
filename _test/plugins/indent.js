module( 'plugins.indent' );

/*trace 1030*/
test( '同时加缩进和段前距', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>hello1</p><p>hello2</p>');
    /*selectNode不能直接选body，否则在ff下回冒到外面去了，一直回冒到外面的html上去了*/
//    range.selectNode( editor.body ).select();
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('rowspacing', 15, 'top');
        editor.execCommand('indent');
//    stop()

        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        equal(editor.queryCommandValue('rowspacing', 'top'), 15, '查询段前距');
        start();
    }, 50);
    stop();
} );

test( 'trace1241--首行缩进的状态反射', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<h1>hello1</h1>' );
    setTimeout(function(){
        range.setStart( editor.body.firstChild, 1 ).collapse( 1 ).select();
        equal( editor.queryCommandState( 'indent' ), 0, '开始没有缩进' );
        editor.execCommand( 'indent' );
        equal( editor.queryCommandState( 'indent' ), 1, '有缩进' );
        editor.execCommand( 'indent' );
        equal( editor.queryCommandState( 'indent' ), 0, '没有缩进' );
        start();
    },50);
    stop();
} );

/*trace 1031*/
test( '缩进后再h1', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('indent');
        editor.execCommand('paragraph', 'h1');
        equal(editor.queryCommandValue('paragraph'), 'h1', '段落格式为h1');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        start();
    }, 50);
    stop();
} );


test( '先设h1再缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('paragraph', 'h1');
        editor.execCommand('indent');
//        equal(editor.queryCommandValue('paragraph'), 'h1', '段落格式为h1');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        start();
    }, 50);
    stop();
} );
/*trace 1479 首行缩进按钮功能有效*/
test('trace 1479 首行缩进按钮功能有效',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>hello</p>');
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        editor.execCommand('indent');
        equal(editor.body.firstChild.style['textIndent'], '2em', '选择文字，首行缩进');//text-indent:2em
        equal(editor.queryCommandState('indent'), 1, '缩进按钮高亮');
        start();
    }, 50);
    stop();
});
/*trace 1516 选Heading格式的文字首行缩进按钮高亮*/
test('trace 1516 选Heading格式的文字首行缩进按钮高亮',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<h1>hello</h1>' );
    setTimeout(function(){
        range.setStart(editor.body.firstChild,0).collapse(true).select();
        editor.execCommand( 'indent' );
        equal(editor.body.firstChild.style['textIndent'], '2em', '选Heading格式的文字首行缩进');//text-indent:2em
        equal(editor.queryCommandState('indent'), 1, '缩进按钮高亮');
        start();
    },50);
    stop();
});
test( '先对齐方式再缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('justify', 'right');
        editor.execCommand('indent');
        equal(editor.queryCommandValue('justify'), 'right', '段落格式为h1');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        start();
    }, 50);
    stop();
} );

test( '先缩进再对齐方式', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('indent');
        editor.execCommand('justify', 'right');
        equal(editor.queryCommandValue('justify'), 'right', '段落格式为h1');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        start();
    }, 50);
    stop();
} );

/*trace 1033*/
test( '非闭合取消缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>hello1</p><p>hello2</p>');
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('indent');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        editor.execCommand('indent');
        equal(editor.body.firstChild.style['textIndent'], '0em', '查看缩进量');
        start();
    }, 50);
    stop();
} );

test( '闭合取消缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('indent');
        equal(editor.body.firstChild.style['textIndent'], '2em', '查看缩进量');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.manualDeleteFillData(editor.body);
        editor.execCommand('indent');
        equal(editor.body.firstChild.style['textIndent'], '0em', '查看缩进量');
        start();
    }, 50);
    stop();
} );

//test( '表格内闭合缩进和取消缩进', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<table><tbody><tr><td></td><td></td></tr><tr><td><p>hello</p></td><td></td></tr></tbody></table>' );
//    var tds = editor.body.firstChild.getElementsByTagName( 'td' );
//    range.setStart( tds[0], 0 ).collapse( true ).select();
//    editor.execCommand( 'indent' );
//    ua.manualDeleteFillData( editor.body );
//    equal( tds[0].firstChild.tagName.toLowerCase(), 'p', '插入一个p标签' );
//    equal( tds[0].firstChild.style['textIndent'], '2em', '查看缩进量' );
//    range.setStart( tds[0].firstChild, 0 ).collapse( true ).select();
//    te.presskey( '', 'h' );
//    setTimeout( function() {
//        equal( tds[0].firstChild.style['textIndent'], '2em', '插入文本节点后查看缩进量' );
//        range.setStart( tds[0].firstChild, 0 ).collapse( true ).select();
//        editor.execCommand( 'indent' );
//        ua.manualDeleteFillData( editor.body );
//        equal( tds[0].firstChild.style['textIndent'], '0em', '取消缩进' );
//        /*选中一个单元格设置缩进*/
//        range.selectNode( tds[2] ).select();
//        editor.execCommand( 'indent' );
//        ua.manualDeleteFillData( editor.body );
//        equal( tds[2].firstChild.style['textIndent'], '2em', '查看缩进量' );
//        start();
//    }, 30 );
//    stop();
//} );

test( '多个单元格缩进和取消缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>hello1</td><td>hello2<img /></td></tr><tr><td><div>hello3</div></td><td><p>hello4</p></td></tr></tbody></table>' );
    setTimeout(function () {
        var tds = editor.body.firstChild.getElementsByTagName('td');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('indent');
        ua.manualDeleteFillData(editor.body);
        /*会自动在非block元素外面套p*/
        equal(tds[0].firstChild.tagName.toLowerCase(), 'p', '插入一个p标签');
        for (var index = 0; index < tds.length; index++) {
            equal(tds[index].firstChild.style['textIndent'], '2em', '查看第' + (index + 1) + '个单元格的缩进量');
        }
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('indent');
        for (index = 0; index < tds.length; index++) {
            equal(tds[index].firstChild.style['textIndent'], '0em', '查看第' + (index + 1) + '个单元格的缩进是否被取消');
        }
        start();
    }, 50);
    stop();
} );

/*trace 1097*/
test( '列表中缩进', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<ul><li>nihao</li><li>hello</li></ul>' );
    setTimeout(function () {
        range.setStart(editor.body.firstChild.firstChild, 0).collapse(true).select();
        editor.execCommand('indent');
        var p = editor.body.firstChild.firstChild.firstChild;
        equal(p.tagName.toLowerCase(), 'p', '自动创建一个p');
        equal(p.style['textIndent'], '2em', '设置缩进为2em');
        /*在有文本的列表中缩进*/
        range.setStart(editor.body.firstChild.lastChild.firstChild, 1).collapse(true).select();
        editor.execCommand('indent');
        p = editor.body.firstChild.lastChild.firstChild;
        equal(p.tagName.toLowerCase(), 'p', '自动创建一个p');
        equal(p.style['textIndent'], '2em', '设置缩进为2em');
        start();
    }, 50);
    stop();
} )