module( 'plugins.image' );
/**
 * 插入视频
 * 插入图像
 * 选区闭合和不闭合
 * 表格中插入图像
 */
/*trace1491 修改动图的宽高*/
test( 'trace1491 修改动图的宽高', function () {
    setTimeout(function () {
        expect(3);
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p><br></p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 0).collapse(1).select();
            editor.execCommand('insertimage', {src: '../data/test.JPG'});
            setTimeout(function () {
                ua.manualDeleteFillData(editor.body);
                range.selectNode(body.firstChild.firstChild).select();
                var img = body.getElementsByTagName('img')[0];
                editor.execCommand('insertimage', {src: '../data/test.JPG', width: 50, height: 80});
                setTimeout(function () {
                    equal($(img).attr('width'), '50', '比较width');
                    equal($(img).attr('height'), '80', '比较width');
                    ok(/data\/test\.JPG/.test(img.getAttribute('src')), '比较src');
                    start();
                }, 500);
            }, 100);
        }, 100);
    }, 100);
    stop();
} );
test( '插入新图像', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51} );
    ua.manualDeleteFillData( editor.body );
    var img = body.getElementsByTagName( 'img' )[0];
    equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
    equal( img.getAttribute( 'width' ), '50', '比较width' );
    equal( img.getAttribute( 'height' ), '51', '比较height' );
} );

/*trace 1490 不设宽高，插入图片*/
test( 'trace 1490 不设宽高，插入图片', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif'} );
    ua.manualDeleteFillData( editor.body );
    var img = body.getElementsByTagName( 'img' )[0];
    equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
} );

test( '插入对齐方式为居中对齐的图像，新建一个p，在p上设置居中对齐', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello</p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51, floatStyle:'center'} );
    ua.manualDeleteFillData( editor.body );

    var img = body.getElementsByTagName( 'img' )[0];
    equal( body.childNodes.length, 2, '2个p' );
    var p = body.firstChild;
    equal( p.style['textAlign'], 'center', '居中对齐' );
    ok( p.nextSibling.innerHTML.indexOf( 'hello' ) > -1, '第二个p里面是hello' );      //1.2版本在FF中，hello前有不可见字符
    if ( baidu.editor.browser.ie )
            equal( img.style['styleFloat'], '', 'float为空' );
    else
            equal( img.style['cssFloat'], '', 'float为空' );
    equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0001.gif', '比较src' );
    equal( img.getAttribute( 'width' ), '50', '比较width' );
    equal( img.getAttribute( 'height' ), '51', '比较height' );
} );

test( '修改已有图片的属性', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><img src="http://img.baidu.com/hi/jx2/j_0004.gif" >hello<img src="http://img.baidu.com/hi/jx2/j_0053.gif" ></p>' );
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0018.gif'} );
    equal( ua.getChildHTML( body.firstChild ), '<img src="http://img.baidu.com/hi/jx2/j_0018.gif" _src=\"http://img.baidu.com/hi/jx2/j_0004.gif\">hello<img src="http://img.baidu.com/hi/jx2/j_0053.gif" _src=\"http://img.baidu.com/hi/jx2/j_0053.gif\">', '检查插入的图像地址' );
    equal( body.firstChild.childNodes.length, 3, '2个img孩子' );
} );


test( '选区不闭合插入图像', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2<img src="http://img.baidu.com/hi/jx2/j_0004.gif"></p>' );
    setTimeout(function(){
        range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.lastChild, 2 ).select();
        editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0016.gif', width:'100', height:'100'} );
        ua.manualDeleteFillData( editor.body );
        equal( body.childNodes.length, 1, '只有一个p' );
        ua.clearWhiteNode(body.firstChild);
        var img = body.firstChild.lastChild;
        equal( img.getAttribute( 'src' ), 'http://img.baidu.com/hi/jx2/j_0016.gif', '比较src' );
        equal( img.getAttribute( 'width' ), '100', '比较width' );
        equal( img.getAttribute( 'height' ), '100', '比较height' );
        start();
    },50);
    stop();
} );

test( '图像设置左右浮动', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2<img src="http://img.baidu.com/hi/jx2/j_0004.gif"></p>' );
    range.selectNode( body.lastChild.lastChild ).select();
    editor.execCommand( 'imagefloat', 'left' );
    equal( body.getElementsByTagName( 'img' )[0].style['cssFloat'] || body.getElementsByTagName( 'img' )[0].style['styleFloat'], 'left', '左浮动' );
//        equal( body.getElementsByTagName( 'img' )[0].style['float'], 'left', '左浮动' );
    equal( editor.queryCommandValue( 'imagefloat' ), 'left' );

    editor.execCommand( 'imagefloat', 'right' );
    equal( body.getElementsByTagName( 'img' )[0].style['cssFloat'] || body.getElementsByTagName( 'img' )[0].style['styleFloat'], 'right', '右浮动' );
    equal( editor.queryCommandValue( 'imagefloat' ), 'right' );
    equal( editor.queryCommandState( 'imagefloat' ), 0, '图片被选中，因此图片菜单高亮' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    equal( editor.queryCommandState( 'imagefloat' ), -1, '光标闭合，因此图片菜单高不高亮' );
    equal( editor.queryCommandValue( 'justify' ), 'left', '段落的对齐方式为左对齐' );
    equal( editor.queryCommandValue( 'imagefloat' ), 'none', '图片对齐方式在闭合情况获取为空' )
    range.selectNode( body.firstChild.firstChild ).select();
    equal( editor.queryCommandValue( 'imagefloat' ), 'none', '选中文本，因此图片菜单高不高亮' );
} );

test( '左浮动变为默认的样式和居中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2<img src="http://img.baidu.com/hi/jx2/j_0004.gif" style="float:left"></p>' );
    range.selectNode( body.lastChild.lastChild ).select();
    editor.execCommand( 'imagefloat', 'none' );
    equal( ua.getFloatStyle( body.getElementsByTagName( 'img' )[0] ), '', '没有浮动方式' );
    equal( editor.queryCommandValue( 'imagefloat' ), 'none' );
    $( body.getElementsByTagName( 'img' )[0] ).css( 'float' );
    range.selectNode( body.getElementsByTagName( 'img' )[0] ).select();
    editor.execCommand( 'imagefloat', 'center' );
    equal( editor.queryCommandValue( 'imagefloat' ), 'center' );
    equal( body.childNodes.length, 3, '3个p，image被切出一个p出来了' );
    var p = body.childNodes[2];
    equal( p.tagName.toLowerCase(), 'p', '第2个是p' );
        equal( p.firstChild.tagName.toLowerCase(), 'img', 'p的孩子为image' );
        equal( ua.getFloatStyle( p.firstChild ), '', 'image对齐方式float为空' );
        equal( editor.queryCommandValue( 'justify' ), 'center', '段落的对齐方式为居中' );
} );

test( ' 带有超链接的图片', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2<a href="www.baidu.com"><img src="http://img.baidu.com/hi/jx2/j_0004.gif" style="float:left"></a></p>' );
    range.selectNode( body.lastChild.lastChild ).select();
    editor.execCommand( 'imagefloat', 'center' );
    var p = body.childNodes[2];
    equal( p.firstChild.tagName.toLowerCase(), 'a', 'p的孩子为a' );
    equal( ua.getFloatStyle( p.firstChild ), '', 'image对齐方式float为空' );
    equal( editor.queryCommandValue( 'justify' ), 'center', '段落的对齐方式为居中' );

    editor.execCommand( 'imagefloat', 'left' );
    equal( p.firstChild.tagName.toLowerCase(), 'a', 'p的孩子为a' );
    equal( ua.getFloatStyle( p.firstChild.firstChild ), 'left', 'image对齐方式float为left' );

    editor.execCommand( 'imagefloat', 'none' );
    equal( p.firstChild.tagName.toLowerCase(), 'a', 'p的孩子为a' );
    equal( ua.getFloatStyle( p.firstChild.firstChild ), '', 'image对齐方式float为空' );
} );

test( ' 默认样式切换到居中再切换回默认，会把居中导致的3个p合并', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello2<a href="www.baidu.com"><img src="http://img.baidu.com/hi/jx2/j_0004.gif" style="float:left"></a>hello3</p>' );
    setTimeout( function () {
        range.selectNode( body.getElementsByTagName( 'a' )[0] ).select();
        editor.execCommand( 'imagefloat', 'center' );
        var p = body.childNodes[1];
        equal( p.firstChild.tagName.toLowerCase(), 'a', 'p的孩子为a' );
        equal( ua.getFloatStyle( p.firstChild ), '', 'image对齐方式float为空' );
        equal( editor.queryCommandValue( 'justify' ), 'center', '段落的对齐方式为居中' );
        editor.execCommand( 'imagefloat', 'none' );
        equal( body.childNodes.length, 1, '3个p合并为1个' );

        var a = body.firstChild.firstChild.nextSibling;
        equal( a.tagName.toLowerCase(), 'a', 'p的孩子为a' );
        equal( a.firstChild.tagName.toLowerCase(), 'img', 'a的孩子是img' );
        equal( ua.getFloatStyle( a.firstChild ), '', 'image对齐方式float为空' );
        start();
    }, 50 );
    stop();
} );