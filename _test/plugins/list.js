module( "plugins.list" );

/*
 * <li>有序列表切换到无序
 * <li>无序列表切换到有序
 * <li>有序之间相互切换
 * <li>无序之间相互切换
 * <li>先引用后列表
 * <li>表格中插入列表
 * <li>h1套列表
 * <li>去除链接
 *
 * */
test( '多个p，选中其中几个变为列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>' );
    setTimeout(function(){
        range.setStart( body.firstChild, 0 ).setEnd( body.firstChild.nextSibling, 1 ).select();
        editor.execCommand( 'insertorderedlist' );
        equal( ua.getChildHTML( body.firstChild ), '<li><p>hello1</p></li><li><p>hello2</p></li>', '检查列表的内容' );
        equal( body.firstChild.tagName.toLowerCase(), 'ol', '检查列表的类型' );
        equal( body.childNodes.length, 3, '3个孩子' );
        equal( body.lastChild.tagName.toLowerCase(), 'p', '后面的p没有变为列表' );
        equal( body.lastChild.innerHTML.toLowerCase(), 'hello4', 'p里的文本' );
        start();
    },50);
    stop();

} );
//trace 988，有序123切到abc再切到123
test( '有序列表的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>你好</p><p>是的</p>' );
    setTimeout(function(){
        range.setStart( body, 0 ).setEnd( body, 2 ).select();
        editor.execCommand( 'insertorderedlist', 'decimal' );
        equal( editor.queryCommandValue( 'insertorderedlist' ), 'decimal', '查询插入数字列表的结果1' );
        editor.execCommand( 'insertorderedlist', 'lower-alpha' );
        equal( editor.queryCommandValue( 'insertorderedlist' ), 'lower-alpha', '查询插入字母列表的结果' );
        editor.execCommand( 'insertorderedlist', 'decimal' );
        equal( editor.queryCommandValue( 'insertorderedlist' ), 'decimal', '查询插入数字列表的结果2' );
        start();
    },50);
    stop();
} );

//trace 988，无序圆圈切到方块再切到圆圈
test( '无序列表之间的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>你好</p><p>是的</p>' );
    range.setStart( body, 0 ).setEnd( body, 2 ).select();
    editor.execCommand( 'insertunorderedlist', 'circle' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'circle', '查询插入圆圈列表的结果1' );
    editor.execCommand( 'insertunorderedlist', 'square' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'square', '查询插入正方形列表的结果' );
    editor.execCommand( 'insertunorderedlist', 'circle' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'circle', '查询插入圆圈列表的结果1' );
} );

test( '引用中插入列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'blockquote' );
    editor.execCommand( 'insertorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'blockquote', 'firstChild of body is blockquote' );
    equal( body.childNodes.length, 1, '只有一个孩子' );
    equal( body.firstChild.firstChild.tagName.toLowerCase(), 'ol', 'insert an ordered list' );
    equal( body.firstChild.childNodes.length, 1, 'blockquote只有一个孩子' );
    equal( $( body.firstChild.firstChild ).css( 'list-style-type' ), 'decimal', '数字列表' );
    equal( editor.queryCommandValue( 'insertorderedlist' ), 'decimal', 'queryCommand value is decimal' );
} );

/*trace 1118*/
test( '去除无序列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertunorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list' );
    equal( body.childNodes.length, 1, 'body只有一个孩子' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'disc', 'queryCommand value is disc' );
    ok( editor.queryCommandState( 'insertunorderedlist' ), 'state是1' );
    /*去除列表*/
    editor.execCommand( 'insertunorderedlist' );
    ua.manualDeleteFillData( editor.body );
    equal( body.firstChild.tagName.toLowerCase(), 'p', '去除列表' );
    equal( body.childNodes.length, 1, 'body只有一个孩子' );
    ok( !editor.queryCommandState( 'insertunorderedlist' ), 'state是0' );
} );

test( '闭合方式有序和无序列表之间的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertunorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list' );
    equal( body.childNodes.length, 1, 'body只有一个孩子' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'disc', 'queryCommand value is disc' );
    equal( editor.queryCommandValue( 'insertorderedlist' ), null, '有序列表查询结果为null' );
    /*切换为有序列表*/
    editor.execCommand( 'insertorderedlist' );
    ua.manualDeleteFillData( editor.body );
    equal( body.firstChild.tagName.toLowerCase(), 'ol', '变为有序列表' );
    equal( body.childNodes.length, 1, 'body只有一个孩子' );
    equal( editor.queryCommandValue( 'insertorderedlist' ), 'decimal', 'queryCommand value is decimal' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), null, '无序列表查询结果为null' );
    /*切换为圆圈无序列表*/
    editor.execCommand( 'insertunorderedlist', 'circle' );
    ua.manualDeleteFillData( editor.body );
    equal( body.firstChild.tagName.toLowerCase(), 'ul', '变为无序列表' );
    equal( body.childNodes.length, 1, 'body只有一个孩子' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'circle', '无序列表是圆圈' );
    equal( editor.queryCommandValue( 'insertorderedlist' ), null, '有序列表查询结果为null' );
} );


test( '非闭合方式切换有序和无序列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    /*如果只选中hello然后切换有序无序的话，不同浏览器下表现不一样*/
    editor.setContent( '<ol><li>hello</li><li>hello3</li></ol><p>hello2</p>' );
    range.selectNode( body.firstChild ).select();
    editor.execCommand( 'insertunorderedlist', 'square' );
    equal( body.firstChild.tagName.toLowerCase(), 'ul', '有序列表变为无序列表' );
    equal( editor.queryCommandValue( 'insertunorderedlist' ), 'square', '无序列表是方块' );
    equal( ua.getChildHTML( body.firstChild ), '<li><p>hello</p></li><li><p>hello3</p></li>', 'innerHTML 不变' );
    /*切换为有序列表*/
    editor.execCommand( 'insertorderedlist', 'upper-alpha' );
    equal( body.firstChild.tagName.toLowerCase(), 'ol', '无序列表变为有序列表' );
    equal( editor.queryCommandValue( 'insertorderedlist' ), 'upper-alpha', '有序列表是A' );
    equal( ua.getChildHTML( body.firstChild ), '<li><p>hello</p></li><li><p>hello3</p></li>', '变为有序列表后innerHTML 不变' );
} );

test( '将列表下的文本合并到列表中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ul><li>hello1</li></ul><p>是的</p>' );
    setTimeout(function(){
        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
        /*将无序的变为有序，文本也相应变成无序列表的一部分*/
        editor.execCommand( 'insertorderedlist' );
        ua.manualDeleteFillData( editor.body );
        equal( body.firstChild.tagName.toLowerCase(), 'ol', 'ul变为了ol' );
        equal( ua.getChildHTML( body.firstChild ), '<li><p>hello1</p></li><li><p>是的</p></li>' );
        equal( body.childNodes.length, 1, '只有一个孩子是ol' );
        start();
    },50);
    stop();

} );


test( '多个列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol><li>hello1</li></ol><ul><li>hello2</li></ul>' );
    range.selectNode( body.lastChild ).select();
    /*将无序的变为有序*/
    editor.execCommand( 'insertorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol' );
    equal( body.childNodes.length, 1, 'body只有1个孩子ol' );
    equal( body.firstChild.childNodes.length, 2, '下面的列表合并到上面' );
    equal( ua.getChildHTML( body.lastChild ), '<li><p>hello1</p></li><li><p>hello2</p></li>', '2个li子节点' );

} );


test( '修改列表中间某一段列表为另一种列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol><li>hello</li><li>hello2</li><li>hello3</li><li>hello4</li></ol>' );
    var lis = body.firstChild.getElementsByTagName( 'li' );
    range.setStart( lis[1], 0 ).setEnd( lis[2], 1 ).select();
    editor.execCommand( 'insertunorderedlist' );
    equal( body.childNodes.length, 3, '3个列表' );
    equal( ua.getChildHTML( body.firstChild ), '<li><p>hello</p></li>', '第一个列表只有一个li' );
    equal( ua.getChildHTML( body.lastChild ), '<li><p>hello4</p></li>', '最后一个列表只有一个li' );
    equal( body.childNodes[1].tagName.toLowerCase(), 'ul', '第二个孩子是无序列表' );
    equal( ua.getChildHTML( body.childNodes[1] ), '<li><p>hello2</p></li><li><p>hello3</p></li>', '检查第二个列表的内容' );
} );

//改策略了，现在不会合并
//test( '三个列表，将下面的合并上去', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
////    editor.setContent( '<ol><li>hello1</li></ol><ul>hello2</ul>' );
//    editor.setContent( '<ol><li>hello3</li></ol><ol><li>hello1</li></ol><ul><li>hello2</li></ul>' );
//    range.selectNode( body.lastChild ).select();
//    /*将无序的变为有序，有序上面的有序也合并一起了*/
//    editor.execCommand( 'insertorderedlist' );
//    equal( body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol' );
//    equal( body.childNodes.length, 1, 'body只有一个孩子ol' );
//    equal( body.firstChild.childNodes.length, 3, '下面和上面的列表合并到上面去了' );
//    equal( ua.getChildHTML( body.firstChild ), '<li>hello3</li><li>hello1</li><li>hello2</li>', '3个li子节点' );
//} );

test( '列表下的文本合并到列表中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol><li>hello3</li><li>hello1</li></ol><p>文本1</p><p>文本2</p>' );
    range.setStart( body, 1 ).setEnd( body, 3 ).select();
    /*选中文本变为有序列表，和上面的列表合并了*/
    editor.execCommand( 'insertorderedlist' );
    var ol = body.firstChild;
    equal( body.childNodes.length, 1, '所有合并为一个列表' );
    equal( ol.tagName.toLowerCase(), 'ol', '仍然是ol' );
    equal( ol.childNodes.length, 4, '下面和上面的列表合并到上面去了' );
    equal( ua.getChildHTML( body.firstChild ), '<li><p>hello3</p></li><li><p>hello1</p></li><li><p>文本1</p></li><li><p>文本2</p></li>', '4个li子节点' );
} );

test( '2个相同类型的列表合并', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol><li>hello3</li><li>hello1</li></ol><ol style="list-style-type: lower-alpha"><li><p>文本1</p></li><li><p>文本2</p></li></ol>' );
    range.selectNode( body.lastChild ).select();
    editor.execCommand( 'insertorderedlist' );
    var ol = body.firstChild;
    equal( body.childNodes.length, 1, '所有合并为一个列表' );
    equal( ol.tagName.toLowerCase(), 'ol', '仍然是ol' );
    equal( ol.childNodes.length, 4, '下面和上面的列表合并到上面去了' );
    equal( ua.getChildHTML( body.firstChild ), '<li><p>hello3</p></li><li><p>hello1</p></li><li><p>文本1</p></li><li><p>文本2</p></li>', '4个li子节点' );
} );

test( '不闭合情况h1套列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<h1>hello1</h1><h2>hello2</h2>' );
    range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
    /*对h1添加列表*/
    editor.execCommand( 'insertorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol' );
    equal( ua.getChildHTML( body.firstChild ), '<li><h1>hello1</h1></li><li><h2>hello2</h2></li>', '查看插入列表后的结果' );
    equal( body.childNodes.length, 1, 'body只有一个孩子ol' );
    equal( body.firstChild.childNodes.length, 2, '2个li' );
} );

test( '闭合情况h1套列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<h2>hello1</h2>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    /*对h1添加列表*/
    editor.execCommand( 'insertorderedlist' );
    equal( body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol' );
    equal( ua.getChildHTML( body.firstChild ), '<li><h2>hello1</h2></li>', '查看插入列表后的结果' );
    equal( body.childNodes.length, 1, 'body只有一个孩子ol' );
    equal( body.firstChild.childNodes.length, 1, '1个li' );
} );

test('列表内后退',function(){
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if((ua.browser.safari && !ua.browser.chrome))
        return 0;
    var editor = te.obj[0];
    var range = te.obj[1];
    var lis;
    var br = ua.browser.ie?'':'<br>';
    var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':' style=\"padding-left: 30px;\"';

    editor.setContent('<ol><li></li><li><p>hello2</p></li><li></li><li><sss>hello3</sss></li><li><p>hello4</p></li><li><p>hello5</p></li></ol>');
    range.setStart(editor.body.firstChild.lastChild.firstChild.firstChild,0).collapse(1).select();
    ua.manualDeleteFillData(editor.body);
    ua.keydown(editor.body,{keyCode:8});

    var ol = editor.body.getElementsByTagName('ol');
    lis = editor.body.getElementsByTagName('li');
    equal(lis.length,'5','变成5个列表项');
    equal(ua.getChildHTML(editor.body),'<ol'+padding+'><li><p>'+br+'</p></li><li><p>hello2</p></li><li><p>'+br+'</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li></ol>','最后一个列表项');
    range.setStart(lis[0].firstChild,0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:8});

    lis = editor.body.getElementsByTagName('li');
    equal(lis.length,'4','变成4个列表项');
    equal(ua.getChildHTML(editor.body.lastChild),'<li><p>hello2</p></li><li><p>'+br+'</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>','第一个列表项且为空行');
    range.setStart(lis[1].firstChild,0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:8});

    lis = editor.body.getElementsByTagName('li');
    equal(lis.length,'3','变成3个列表项');
    equal(ua.getChildHTML(editor.body.lastChild),'<li><p>hello2</p><p>'+br+'</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>','中间列表项且为空行');
    if(!ua.browser.ie){
        range.setStart(lis[1].firstChild.firstChild,0).collapse(1).select();
        ua.manualDeleteFillData(editor.body);
        ua.keydown(editor.body,{keyCode:8});
        equal(ua.getChildHTML(editor.body),'<p><br></p><ol'+padding+'><li><p>hello2</p><p><br></p><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li></ol>','自定义标签后退');
    }
});

test('列表内回车',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    var lis;
    var br = ua.browser.ie?'':'<br>';
    editor.setContent('<ol><li><sss></sss><sss></sss></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[0],0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:13});
    var spa = ua.browser.opera?'<br>':'';
    equal(ua.getChildHTML(editor.body),spa+'<p><sss></sss><sss></sss></p>','空列表项回车--无列表');
    var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':' style=\"padding-left: 30px;\"';

    editor.setContent('<ol><li><sss>hello1</sss><p>hello2</p></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[0].lastChild,0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:13});
    equal(ua.getChildHTML(editor.body),'<ol'+padding+'><li><p><sss>hello1</sss><p></p></p></li><li><p><p>hello2</p></p></li></ol>','单个列表项内回车');

    editor.setContent('<ol><li></li><li><p>hello5</p></li><li><p></p><p></p></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[2].firstChild.firstChild,0).setEnd(lis[2].lastChild.firstChild,0).select();
    ua.keydown(editor.body,{keyCode:13});
    equal(ua.getChildHTML(editor.body),'<ol'+padding+'><li><p>'+br+'</p></li><li><p>hello5</p></li></ol><p>'+br+'</p>','最后一个列表项为空行回车');

    /*trace 2652*/
    range.setStart(editor.body.firstChild.firstChild.firstChild,0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:13});
    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p><ol'+padding+'><li><p>hello5</p></li></ol><p>'+br+'</p>','第一个列表项为空行下回车');

    /*trace 2653*/
    editor.setContent('<ol><li><p>hello2</p></li><li><p>hello3</p></li><li><p><br /></p><p>hello5</p></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[0].firstChild.firstChild,2).setEnd(lis[1].firstChild.firstChild,4).select();
    ua.keydown(editor.body,{keyCode:13});
    equal(ua.getChildHTML(editor.body),'<ol'+padding+'><li><p>he</p></li><li><p>o3</p></li><li><p><br></p><p>hello5</p></li></ol>','非闭合回车');

    editor.setContent('<ol><li><sss>hello</sss><p>hello4</p></li><li><p>hello5</p></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[0].lastChild.firstChild,1).setEnd(lis[0].lastChild.firstChild,2).select();
    ua.keydown(editor.body,{keyCode:13});
    equal(ua.getChildHTML(editor.body),'<ol'+padding+'><li><p><sss>hello</sss><p>h</p></p></li><li><p><p>llo4</p></p></li><li><p>hello5</p></li></ol>','一个列表项内两行');
});

test('tab键',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    var lis;
    var br = ua.browser.ie?'':'<br>'
    editor.setContent('<ol><li><p>hello1</p></li><li><p>hello2</p></li></ol>');
    lis = editor.body.getElementsByTagName('li');
    range.setStart(lis[1],0).collapse(1).select();
    ua.keydown(editor.body,{keyCode:9});
    ua.keydown(editor.body,{keyCode:9});
//    var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':' style=\"padding-left: 30px;\"';
    var str='<ol style=\"padding-left: 30px\"><li><p>hello1</p></li><ol style=\"list-style-type: lower-alpha; padding-left: 30px\"><ol style=\"list-style-type: lower-roman; padding-left: 30px\"><li><p>hello2</p></li></ol style=\"padding-left: 30px\"></ol></ol>';
    ua.checkHTMLSameStyle(str,editor.document,editor.body,'有序列表---tab键');
});

test( '回车后产生新的li-选区闭合', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    setTimeout(function(){
        range.setStart( body.firstChild, 0 ).setEnd( body.firstChild.nextSibling, 1 ).select();
        editor.execCommand( 'insertorderedlist' );
        var lastLi =  body.firstChild.lastChild.firstChild.firstChild;
        range.setStart(lastLi,lastLi.length).collapse( 1 ).select();
        setTimeout(function(){
            ua.keydown(editor.body,{'keyCode':13});
            equal(body.firstChild.childNodes.length,3,'回车后产生新的li');
            equal(body.firstChild.lastChild.tagName.toLowerCase(),'li','回车后产生新的li');
            var br = ua.browser.ie?'':'<br>';
            equal(ua.getChildHTML(body.firstChild),'<li><p>hello1</p></li><li><p>hello2</p></li><li><p>'+br+'</p></li>','检查内容');
            var lastLi =  body.firstChild.lastChild.firstChild.firstChild;
            range.setStart(lastLi,lastLi.length).collapse( 1 ).select();
            setTimeout(function(){
                ua.keydown(editor.body,{'keyCode':13});
                equal(body.firstChild.childNodes.length,2,'空li后回车，删除此行li');
                equal(body.lastChild.tagName.toLowerCase(),'p','产生p');
                br = ua.browser.ie?'':'<br>';
                ua.manualDeleteFillData(body.lastChild);
                equal(body.lastChild.innerHTML.toLowerCase().replace(/\r\n/ig,''),br,'检查内容');
                start();
            },20);
        },20);
    },50);
    stop();
} );
test( 'trace 1622:表格中插入列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    /*必须加br，否则没办法占位*/
    editor.setContent( '<table><tbody><tr><td><br></td><td>你好</td></tr><tr><td>hello2</td><td>你好2</td></tr></tbody></table>' );
    var tds = body.getElementsByTagName( 'td' );
    /*选中一个单元格*/
    range.setStart( tds[0], 0 ).collapse( 1 ).select();
    editor.execCommand( 'insertorderedlist' );

    equal( tds[0].firstChild.tagName.toLowerCase(), 'ol', '查询列表的类型' );
    equal( tds[0].firstChild.style['listStyleType'], 'decimal', '查询有序列表的类型' );
    var br = baidu.editor.browser.ie ? "" : "<br>";
    equal( ua.getChildHTML( tds[0].firstChild ), '<li>' + br + '</li>' );
    //TODO  用select选择和实际操作的选择结果不一样，实际只会选中第一个单元格，是假选
    /*选中多个单元格*/
    range.setStart( tds[1], 0 ).setEnd( tds[3], 1 ).select();
    editor.currentSelectedArr = [tds[1], tds[3]];
    editor.execCommand( 'insertunorderedlist', 'circle' );
    equal( tds[1].firstChild.tagName.toLowerCase(), 'ul', '查询无序列表' );
    equal( tds[1].firstChild.style['listStyleType'], 'circle', '查询无序列表的类型' );
    /*注释掉，等bug修复后再开*/
//    equal( ua.getChildHTML( tds[1].firstChild ), '<li>你好</li>' );
//    equal( ua.getChildHTML( tds[3].firstChild ), '<li>你好2</li>' );
} );

///*presskey*/
//test( ' trace 1536:删除部分列表', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<ol><li>hello1</li><li>你好</li><li>hello3</li></ol>' );
//    var body = editor.body;
//    var range = te.obj[1];
//    stop();
//    expect( 2 );
//    range.setStart( body.firstChild, 1 ).setEnd( body.firstChild, 2 ).select();
//    editor.focus();
//    te.presskey( 'del', '' );
//    editor.focus();
//    setTimeout( function () {
//        equal( body.childNodes.length, 1, '删除后只剩一个ol元素' );
//        var br = (baidu.editor.browser.ie || baidu.editor.browser.gecko) ? "" : "<br>";
//        //todo 不同浏览器原生选区的差别导致
////        equal( ua.getChildHTML( body ), '<ol><li><p>hello1</p></li><li><p>hello3' + br + '</p></li></ol>', '第二个li被删除' );
//        start();
//    }, 30 );
//
//} );
///*presskey*/
//test( ' trace 1544,1624 :列表中回车后再回退，会产生一个空行', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<ol><li><p>hello1</p></li><li><p>你好</p></li></ol>' );
//    var body = editor.body;
//    var ol = body.firstChild;
//    var range = te.obj[1];
//
//    range.setStart( ol.firstChild.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    te.presskey( 'enter', '' );
//    equal(editor.selection.getRange().startContainer.parentNode.innerHTML,'');
//
//    setTimeout( function () {
//        range.setStart( ol.childNodes[1], 0 ).collapse( 1 ).select();
//        equal(editor.selection.getRange().startContainer.parentNode.innerHTML,'');
//        editor.focus();
//        te.presskey( 'back', '' );
//        setTimeout( function () {
//            editor.focus();
//            var br = ua.browser.ie ? "" : "<br>";
//            equal( ua.getChildHTML( body ), '<ol><li><p>hello1</p><p>' + br + '</p></li><li><p>你好</p></li></ol>', '第二个li被删除' );
//            range.setStart( body, 0 ).setEnd( body, 1 ).select();
//            editor.execCommand( 'insertorderedlist' );
//            equal( ua.getChildHTML( body ), '<p>hello1</p><p>' + br + '</p><p>你好</p>', '应当变为纯文本' );
//            start();
//        }, 70 );
//    }, 50 );
//    stop();
//} );

test( 'trace1620:修改上面的列表与下面的列表一致', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>你好</p><ol><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type:lower-alpha; "><li><p>字母列表2</p></li><li><p>字母列表2</p></li></ol>' );
    range.selectNode( editor.body.firstChild.nextSibling ).select();
    editor.execCommand( 'insertorderedlist', 'lower-alpha' );
//    var padding  = ua.browser.ie&&ua.browser.ie<9?' style=\"padding-left: 30px\"':' style=\"padding-left: 30px;\"';
    var html = '<p>你好</p><ol style="list-style-type:lower-alpha;padding-left: 30px "><li><p>数字列表1</p></li><li><p>数字列表2</p></li><li><p>字母列表1</p></li><li><p>字母列表2</p></li></ol>';
    ua.checkHTMLSameStyle( html, editor.document, editor.body, '检查列表结果' );
});

test( 'trace 1621:选中多重列表，设置为相同类型的列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol style="list-style-type:decimal; "><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type:lower-alpha; "><li><p>字母列表1</p></li><li><p>字母列表2</p></li></ol><ol style="list-style-type: upper-alpha; "><li><p>​大写字母1<br></p></li><li><p>大写字母2</p></li><li><p>大写字母3</p></li></ol>' );
    range.setStart( body, 1 ).setEnd( body.lastChild.firstChild.nextSibling, 1 ).select();
    var html = '<ol style="list-style-type:decimal; padding-left: 30px"><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type: upper-alpha; padding-left: 30px"><li><p>字母列表1</p></li><li><p>字母列表2</p></li><li><p>​大写字母1<br></p></li><li><p>大写字母2</p></li><li><p>大写字母3</p></li></ol>';
    editor.execCommand( 'insertorderedlist', 'upper-alpha' );
    ua.checkHTMLSameStyle( html, editor.document, editor.body, 'trace 1621' );
});