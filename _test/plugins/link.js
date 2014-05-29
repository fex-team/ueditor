module( "plugins.link" );

/*trace 879*/
test( '同时去多个超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><a href="http://www.baidu.com/">hello</a>first<a href="http://www.google.com/">second</a></p><p>third<a href="http://www.sina.com/">sina</a></p><table><tbody><tr><td><a href="http://www.baidu.com/">baidu</a></td></tr></tbody></table>' );
    stop();
    setTimeout(function () {
    range.selectNode( editor.body ).select();
    editor.execCommand( 'unlink' );
    equal( editor.body.firstChild.innerHTML, 'hellofirstsecond', '第一段去掉超链接' );
    equal( editor.body.firstChild.nextSibling.innerHTML, 'thirdsina', '第二段去掉超链接' );
    equal( editor.body.lastChild.getElementsByTagName( 'td' )[0].innerHTML, 'baidu', '表格内的超链接被去掉' );
        start();
    }, 100);
} );

test( '光标闭合且没有超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'unlink' );
    equal( ua.getChildHTML( editor.body ), '<p>hello</p>', '没有超链接什么都不做' );
} );

/*trace 833*/
test( '在超链接前加一个超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello<a href="http://www.baidu.com/">baidu</a></p>' );
    range.selectNode( editor.body.firstChild.firstChild ).select();
    editor.execCommand( 'link', {href:'http://www.google.com/'} );
    ua.manualDeleteFillData( editor.body );
    ua.checkSameHtml( editor.getContent(), '<p><a href="http://www.google.com/" >hello</a><a href="http://www.baidu.com/" >baidu</a></p>');
} );

/*trace 798*/
test( '给图片添加超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><img  style="width: 200px;height: 200px" src="http://ueditor.baidu.com/img/logo.png">hello</p>' );
    range.selectNode( editor.body.firstChild.firstChild ).select();
    editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
    var html = '<a  href="http://www.baidu.com/" ><img  src="http://ueditor.baidu.com/img/logo.png" _src=\"http://ueditor.baidu.com/img/logo.png" style="width: 200px;height: 200px" ></a>hello';
    ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '给图片添加超链接' );
//    equal(html,editor.body.firstChild.innerHTML);
} );

/*trace 758
 *并不是真的选中所有单元格，是假选
 * 先设置startContainer和endContainer为第一个单元格中的文本或占位符
 * 再在editor的currentSelectedArr设置当前选中的内容，使得看上去是选中了所有的td*/
test( '选中多个单元格插入超链接', function () {
    if(ua.browser.ie>8)return ;//TODO 1.2.6
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr><tr><td>hello</td></tr></tbody></table>' );
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
        var br = ua.browser.ie ? '' : '<br>';
        equal( ua.getChildHTML( trs[0].cells[0] ), '<a href="http://www.baidu.com/">http://www.baidu.com/</a>'+(ua.browser.ie>8?' ':br), '第一个单元格中插入超链接' );//原来空单元格的br不去掉
        equal( ua.getChildHTML( trs[0].cells[1] ), br, '第二个单元格中未插入超链接' );
        equal( ua.getChildHTML( trs[1].cells[0] ), '<a href="http://www.baidu.com/">hello</a>', '第三个单元格中插入超链接' );
        start();
    },50);
    stop();
} );

test( '去除表格中的链接', function () {
    if(ua.browser.ie>8)return ;//TODO 1.2.6
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr><tr><td colspan="2">hello</td></tr></tbody></table>' );
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[1].cells[0]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
        var br = ua.browser.ie ? '' : '<br>';
        equal( editor.queryCommandValue( 'link' ), trs[0].cells[0].firstChild, '查询多个单元格的command value为a' );
        editor.execCommand( 'unlink' );
        equal( ua.getChildHTML( trs[0].cells[0] ), 'http://www.baidu.com/'+(ua.browser.ie>8?' ':br), '第一个单元格中插入超链接' );
        equal( ua.getChildHTML( trs[0].cells[1] ), br, '第二个单元格中未插入超链接' );
        equal( ua.getChildHTML( trs[1].cells[0] ), 'hello', '第三个单元格中插入超链接' );
        equal( editor.queryCommandValue( 'link' ), null, '查询多个单元格的command value为null' );
        start();
    },50);
    stop();
} );

/*1.2.5+不支持此功能*/
//test( 'trace 1728 去除链接--表格第一个单元格没有超链接', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<table><tbody><tr><td></td><td><a href="www.google.com">google</a></td></tbody></table>' );
//    var body = editor.body;
//    var tds = body.firstChild.getElementsByTagName( 'td' );
//    range.selectNode( body.firstChild ).select();
//    editor.currentSelectedArr = [tds[0], tds[1]];
//    editor.execCommand( 'unlink' );
//    if ( UE.browser.ie )
//        equal( tds[0].childNodes.length, 1, '第一个表格中有一个占位文本节点' );
//    range = editor.selection.getRange();
//    tds = body.firstChild.getElementsByTagName( 'td' );
//    equal( ua.getChildHTML( tds[1] ), 'google', 'a标签被删除' );
//    if ( UE.browser.gecko )
//        ua.checkResult( range, tds[0], tds[0], 0, 0, true, 'check unlink result' );
//    else if(UE.browser.opera)
//        ua.checkResult( range, tds[0].firstChild, tds[0].firstChild, 0, 0, true, 'check unlink result' );
//    else{
//        ua.checkResult( range, tds[0].firstChild, tds[0].firstChild, 1, 1, true, 'check unlink result' );
//    }
//    var br = ua.browser.ie ? '' : "<br>";
//    ua.manualDeleteFillData( tds[0] );
//    equal( ua.getChildHTML( tds[0] ), br, 'td 1 is empty' );
//} );

test( '添加链接--表格第一个单元格没有超链接', function () {
    if(!ua.browser.ie){//TODO 1.2.6
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<table><tbody><tr><td></td><td><a href="www.google.com">google</a></td></tbody></table>' );
        setTimeout(function(){
            var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[1]);
            ut.setSelected(cellsRange);
//        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
//        range.selectNode( body.firstChild ).select();
//        var tds = body.firstChild.getElementsByTagName( 'td' );
//        editor.currentSelectedArr = [tds[0], tds[1]];
            editor.execCommand( 'link', {href:'www.baidu.com'} );
            range = editor.selection.getRange();
            equal( ua.getChildHTML( trs[0].cells[1] ), '<a href="www.baidu.com">google</a>', 'a标签的地址被修改了' );
            var br = ua.browser.ie ? '' : '<br>';
            equal( ua.getChildHTML( trs[0].cells[0] ), '<a href="www.baidu.com">www.baidu.com</a>'+br, 'td 1 被添加了超链接' );
            if ( (!baidu.editor.browser.gecko)&&(!baidu.editor.browser.webkit))
                ua.checkResult( range, trs[0].cells[0].firstChild.firstChild, trs[0].cells[0].firstChild.firstChild, 0, 0, true, 'check link result' );
            else
                ua.checkResult( range, trs[0].cells[0].firstChild, trs[0].cells[0].firstChild, 0, 0, true, 'check link result' );
            start();
        },50);
        stop();
    }
} );

test( '光标在超链接中间去除超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><a href="www.google.com">hello</a></p>' );
    var a_text = editor.body.getElementsByTagName( 'a' )[0].firstChild;
    range.setStart( a_text, 2 ).collapse( 1 ).select();
    same( editor.queryCommandValue( 'link' ), editor.body.firstChild.firstChild, 'command value is a' );
    editor.execCommand( 'unlink' );
    equal( ua.getChildHTML( editor.body ), '<p>hello</p>', '去除超链接后' );
    equal( editor.queryCommandState( 'unlink' ), -1, 'link state is -1' );
} );

test( '去除链接--选中区域包含超链接和非超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p><p>hello2<a href="www.fanfou.com">famfou</a>hello3</p>' );
    var body = editor.body;
    range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 3 ).select();
    equal( editor.queryCommandValue( 'link' ), body.lastChild.firstChild.nextSibling, 'queryCommandvalue' );
} );

/*trace 1111*/
test( '插入超链接', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p>' );
    range.setStart( editor.body.firstChild, 1 ).collapse( 1 ).select();
    editor.execCommand( 'link', {href:'www.baidu.com'} );
    var a = editor.body.getElementsByTagName( 'a' )[0];
    range.selectNode( a ).select();
    range = editor.selection.getRange();
    same( editor.queryCommandValue( 'link' ), a, 'link value is a' );
    equal( ua.getChildHTML( editor.body ), '<p>hello<a href="www.baidu.com">www.baidu.com</a></p>' );
    equal( editor.queryCommandState( 'unlink' ), 0, 'link state is 0' );
} );

test( '对现有的超链接修改超链接地址', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><a href="http://www.baidu.com">http://www.baidu.com</a>hello<a href="www.google.com">google</a></p>' );
    var a1 = body.firstChild.firstChild;
    range.selectNode( a1 ).select();

    editor.execCommand( 'link', {href:'ueditor.baidu.com'} );
    a1 = body.firstChild.firstChild;
    equal( a1.getAttribute( 'href' ), 'ueditor.baidu.com', 'check href' );
    equal( a1.innerHTML, 'ueditor.baidu.com', 'innerHTML也相应变化' );

    var a2 = body.firstChild.getElementsByTagName( 'a' )[1];
    range.selectNode( a2 ).select();
    editor.execCommand( 'link', {href:'mp3.baidu.com'} );
    a2 = body.firstChild.getElementsByTagName( 'a' )[1];

    equal( a2.getAttribute( 'href' ), 'mp3.baidu.com', 'check href for second a link' );
    equal( a2.innerHTML, 'google', 'innerHTML不变' );
} );


