module( "plugins.inserthtml" );

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
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[1]);
        ut.setSelected(cellsRange);
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

test( '选中多个单元格插入超链接', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<table><tbody><tr><td></td><td></td></tr></tbody></table>' );
    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        var tds = body.firstChild.getElementsByTagName( 'td' );

        editor.execCommand( 'link', {href:'http://www.baidu.com/'} );
        equal( tds[0].firstChild.tagName.toLowerCase(), 'a', '插入超链接' );
        equal( tds[0].firstChild.tagName.toLowerCase(), 'a', '插入超链接' );
        equal( ua.getChildHTML(tds[0]), '<a href="http://www.baidu.com/">http://www.baidu.com/</a>', '查询第一个表格插入的超链接' );
        var br = ua.browser.ie?'':'<br>';
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
