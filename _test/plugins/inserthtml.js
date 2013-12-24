module( "plugins.inserthtml" );
test( '向span里面插入p', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<address><span style="color:#ff0000">hello1</span></address>');
    range.setStart(editor.body.firstChild.firstChild, 0 ).collapse(true).select();
    editor.execCommand( 'inserthtml','<p >hello3</p>' );
    stop();
    setTimeout(function(){
//        equal(editor.body.innerHTML.toLowerCase(),'<address><p >hello3</p><span style="color:#ff0000">hello1</span></address>','向span里面插入p');
        ua.checkSameHtml(editor.body.getElementsByTagName('address')[0].innerHTML.toLowerCase(),'<p >hello3</p><span style="color:#ff0000">hello1</span>','向span里面插入p');
        start();
    },50);
});
//列表中插入列表 TODO 1.2.6 trace 3413
//test( '列表中插入列表 trace 3413', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent('<ol><li><p>hello1</p></li><li><p>hello2</p></li></ol>');
//    var lis = editor.body.getElementsByTagName('li');
//    range.setStart( lis[1], 0 ).collapse(true).select();
//    editor.execCommand( 'inserthtml','<ul><li><p>hello3</p></li></ul>' );
//    stop();
//    setTimeout(function(){
//        lis = editor.body.getElementsByTagName('li');
//        equal(lis.length,3,'列表长度');
//        equal(lis[1].innerHTML.toLowerCase(),'<p>hello3</p>','列表中插入列表');
//        start();
//    },50);
//
//});

test( 'trace 3301：闭合方式插入文本', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'inserthtml', 'hello2' );
    equal( ua.getChildHTML( body ), '<p>hello2</p>', '插入文本节点' );
} );

test( '选中多个单元格插入列表', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr></tbody></table>' );
    setTimeout(function(){

        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[1]);
        ut.setSelected(cellsRange);
        if(ua.browser.ie)
            range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        var tds = body.firstChild.getElementsByTagName( 'td' );
        editor.execCommand( 'inserthtml', '<ol><li>hello</li></ol>' );
        equal( tds[0].firstChild.tagName.toLowerCase(), 'ol', '插入列表' );
        equal( ua.getChildHTML( tds[0].firstChild ), '<li><p>hello</p></li>', '查询列表内容' );
        //空的td有br
        var br = ua.browser.ie?'':'<br>';
        ua.manualDeleteFillData(tds[1]);
        equal( tds[1].innerHTML, br, '第二个单元格没有插入任何东西' );
        start();
    },50);
    stop();
} );

test( '表格中插入图片', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr></tbody></table>' );
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );

        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[1]);
        ut.setSelected(cellsRange);
        if (ua.browser.ie)
            range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        var tds = body.firstChild.getElementsByTagName( 'td' );
        editor.execCommand( 'inserthtml', '<img style="float:left"/>' );
        equal( tds[0].firstChild.tagName.toLowerCase(), 'img', '插入图片' );
        equal( tds[0].firstChild.style['styleFloat']||tds[0].firstChild.style['cssFloat'], 'left', '查询图片浮动方式' );
        var br = ua.browser.ie?'':'<br>';
        ua.manualDeleteFillData(tds[1]);
        equal( tds[1].innerHTML, br, '第二个单元格没有插入任何东西' );
        start();
    },50);
    stop();
} );
//test('',function(){stop()});
test( '选中多个单元格插入超链接', function() {
    if(ua.browser.ie>8)return ;//TODO 1.2.6
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr></tbody></table>' );
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[1]);
        ut.setSelected(cellsRange);
        if(ua.browser.ie&&ua.browser.ie<9)
            range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
        var tds = body.firstChild.getElementsByTagName( 'td' );
        equal( tds[0].firstChild.tagName.toLowerCase(), 'a', '插入超链接' );
        var br = ua.browser.ie?'':'<br>';
        equal( ua.getChildHTML(tds[0]), '<a href="http://www.baidu.com/">http://www.baidu.com/</a>'+(ua.browser.ie>8?' ':br), '查询第一个表格插入的超链接' );

        equal( ua.getChildHTML(tds[1]), br, '第二个单元格也插入超链接' );
        start();
    },50);
    stop();
} );

test( 'trace 3297：notSerialize', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    setTimeout(function(){
        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
        editor.execCommand( 'inserthtml', '<p>b</p>_ueditor_page_break_tag_' ,false);
        equal( editor.body.childNodes.length, 3, 'notSerialize=false 插入分页符' );
        equal( editor.body.childNodes[1].tagName.toLowerCase(), 'hr', '插入分页符 hr class=\"pagebreak\"  ' );
        equal( editor.body.childNodes[1].className.toLowerCase(), "pagebreak", '插入分页符 hr class=\"pagebreak\"  ' );
        editor.setContent( '<p><br></p>' );
        setTimeout(function(){
            range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
            editor.execCommand( 'inserthtml', '<p>b</p>_ueditor_page_break_tag_' ,true);
            equal( editor.body.childNodes.length, 3, 'notSerialize=true 插入分页符' );
            equal( editor.body.childNodes[1].innerHTML , '_ueditor_page_break_tag_', '插入分页符');
            start();
        },50);
    },50);
    stop();
} );

//列表中插入表格
test( '列表中插入表格', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<ol><li><p></p></li></ol>');
    var lis = editor.body.getElementsByTagName('li');
    range.setStart( lis[0], 0 ).collapse(true).select();
    editor.execCommand( 'inserttable', {numCols:2, numRows:2});
    stop();
    setTimeout(function(){
        equal(lis.length,1,'列表长度没有变化');
        equal(lis[0].firstChild.tagName.toLowerCase(),'table','列表中插入表格');
        start();
    },50);
});
//刘表中插入img
test( '列表中插入img', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<ol><li><p></p></li></ol>');
    var lis = editor.body.getElementsByTagName('li');
    range.setStart( lis[0], 0 ).collapse(true).select();
    editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51} );
    stop();
    setTimeout(function(){
        equal(lis.length,1,'列表长度没有变化');
        ua.manualDeleteFillData(lis[0]);
        if(ua.browser.ie){
            equal(lis[0].firstChild.firstChild.tagName.toLowerCase(),'img','列表中插入img');
            equal(lis[0].firstChild.firstChild.attributes['src'].nodeValue,'http://img.baidu.com/hi/jx2/j_0001.gif','列表中插入img');
        }
        else{
            equal(lis[0].firstChild.tagName.toLowerCase(),'img','列表中插入img');
            equal(lis[0].firstChild.attributes['src'].nodeValue,'http://img.baidu.com/hi/jx2/j_0001.gif','列表中插入img');
        }
        start();
    },50);
});