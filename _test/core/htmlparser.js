module( 'core.htmlparser' );

test( '普通标签处理', function() {
    var root = UE.htmlparser('<i>sdfsdfsdfsf</i>');
    equals(root.toHtml(),'<i>sdfsdfsdfsf</i>','单个普通标签');
    root = UE.htmlparser('<i>sdf<b>sdfsdsd</b>fsdfsf</i>');
    equals(root.toHtml(),'<i>sdf<b>sdfsdsd</b>fsdfsf</i>','多个普通标签');
    root = UE.htmlparser('<i dsf="sdf" sdf="wewe" readonly >sdf</i>');
    equals(root.toHtml(),'<i dsf="sdf" sdf="wewe" readonly >sdf</i>','添加属性的标签');
    root = UE.htmlparser('<img src="file:///C:/DOCUME~1/DONGYA~1/LOCALS~1/Temp/msohtmlclip1/01/clip_image002.jpg" width="553" height="275" />');
    equals(root.toHtml(),'<img src="file:///C:/DOCUME~1/DONGYA~1/LOCALS~1/Temp/msohtmlclip1/01/clip_image002.jpg" width="553" height="275" />','img标签');
});

test( '特殊标签处理', function() {
    var root = UE.htmlparser('<i dsf="sdf" sdf="wewe" readonly >sd<!--fasdf-->f</i>');
    equals(root.toHtml(),'<i dsf="sdf" sdf="wewe" readonly >sd<!--fasdf-->f</i>','包含注释');
    root = UE.htmlparser('<script type="text/javascript" charset="utf-8" src="editor_api.js"></script>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<script type="text/javascript" charset="utf-8" src="editor_api.js"></script>','script标签');
    root = UE.htmlparser('<table width="960"><tbody><tr><td width="939" valign="top"><br></td></tr></tbody></table><p><br></p>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<table width="960"><tbody><tr><td width="939" valign="top"><br/></td></tr></tbody></table><p><br/></p>','br标签');
    root = UE.htmlparser('<li>sdfsdfsdf<li>sdfsdfsdfsdf');
    equals(root.toHtml(),'<ul><li>sdfsdfsdf</li><li>sdfsdfsdfsdf</li></ul>','以文本结束的html');
});

test( '补全不完整table', function() {
    var root = UE.htmlparser('<p><td></td></p>');
    equals(root.toHtml(),'<p><table><tbody><tr><td></td></tr></tbody></table></p>','td完整，补全table');
    root = UE.htmlparser('<p><td>sdfsdfsdf</p>');
    equals(root.toHtml(),'<p><table><tbody><tr><td>sdfsdfsdf</td></tr></tbody></table></p>','td不完整，补全table');
    root = UE.htmlparser('<td></td>' + '\n\r' + '<td></td>');
    equals(root.toHtml(),'<table><tbody><tr><td></td><td></td></tr></tbody></table>','包含\n，补全table');
    root = UE.htmlparser('<table>');
    equals( root.toHtml().toLowerCase(), '<table><tr><td></td></tr></table>', '<table>--补孩子' );
    /*补parent*/
    root = UE.htmlparser('<td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>', '<td>--补父亲' );
    /*补parent和child*/
    root = UE.htmlparser('<tr>hello');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>hello</td></tr></tbody></table>', '<tr>hello--孩子父亲都补' );

    root = UE.htmlparser('<td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<td>123' );

    root = UE.htmlparser('123<td>');
    equals( root.toHtml().toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123<td>' );

    root = UE.htmlparser('<tr><td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<tr><td>123' );

    root = UE.htmlparser('<td>123<tr>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td></tr><tr><td></td></tr></tbody></table>', '<td>123<tr>' );

    /*补充为2个td*/
    root = UE.htmlparser('<tr>123<td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td><td></td></tr></tbody></table>', '<tr>123<td>--tr和td之间有文字' );

    root = UE.htmlparser('<td><td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td><td>123</td></tr></tbody></table>', '<td><td>123' );

    root = UE.htmlparser('<td>123<td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td><td></td></tr></tbody></table>', '<td>123<td>' );

    /*补2个table*/
    root = UE.htmlparser('<td>123</td>132<tr>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>132<table><tbody><tr><td></td></tr></tbody></table>', '<td>123</td>132<tr>--补全2个table' );

    /*开标签、文本与闭标签混合*/
    root = UE.htmlparser('<tr>123</td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td>123</td></tr></tbody></table>', '<tr>123</td>--tr和td之间有文字' );

    root = UE.htmlparser('<tr></td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123', '<tr></td>123--td闭标签后面有文字' );

    root = UE.htmlparser('123</tr><td>');
    equals( root.toHtml().toLowerCase(), '123<table><tbody><tr><td></td></tr><tr><td></td></tr></tbody></table>', '123</tr><td>' );

    root = UE.htmlparser('</tr><td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr><tr><td>123</td></tr></tbody></table>', '</tr><td>123' );

    root = UE.htmlparser('</tr>123<td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</tr>123<td>' );
    /*闭标签、文本与闭标签混合*/
    root = UE.htmlparser('</td>123</tr>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>' );

    root = UE.htmlparser('</tr>123</td>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>' );

    root = UE.htmlparser('</tr>123<tr>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123<table><tbody><tr><td></td></tr></tbody></table>', '</td>123</tr>', '</tr>123<tr>' );

    /*补前面的标签*/
    root = UE.htmlparser('</td>123');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td></td></tr></tbody></table>123', '</td>123--补全td前面的标签' );

    root = UE.htmlparser('123</td>');
    equals( root.toHtml().toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123</td>--补全td前面的标签，有文本' );
    /*补全tr前面的标签*/
    root = UE.htmlparser('123</tr>');
    equals( root.toHtml().toLowerCase(), '123<table><tbody><tr><td></td></tr></tbody></table>', '123</tr>--补全tr前后的标签，前面有文本' );
    /*补全table前面的标签*/
    root = UE.htmlparser('123</table>');
    equals( root.toHtml().toLowerCase(), '123<table><tr><td></td></tr></table>', '123</table>--补全trable前后的标签，前面有文本' );
    /*复杂结构*/
    root = UE.htmlparser('<table><tr><td>123<tr>456');
    equals( root.toHtml().toLowerCase(), '<table><tr><td>123</td></tr><tr><td>456</td></tr></table>', '<table><tr><td>123<tr>456' );

    root = UE.htmlparser('<td><span>hello1</span>hello2</tbody>');
    equals( root.toHtml().toLowerCase(), '<table><tbody><tr><td><span>hello1</span>hello2</td></tr></tbody></table>', '解析<td><span>hello1</span>hello2</tbody>' );

    root = UE.htmlparser('<table><td><span>hello1</span>hello2</tbody>');
    equals( root.toHtml().toLowerCase(), '<table><tr><td><span>hello1</span>hello2<table><tbody><tr><td></td></tr></tbody></table></td></tr></table>', '解析<table><td><span>hello1</span>hello2</tbody>' );

    root = UE.htmlparser('<table><tr></td>123');
    equals( root.toHtml().toLowerCase(), '<table><tr><td></td></tr></table>123', '<table><tr></td>123' );
});

test( '补全不完整li', function() {
    var root = UE.htmlparser('<ol><li><em><u>sdf<li>sdfsdf</ol>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<ol><li><em><u>sdf</u></em></li><li>sdfsdf</li></ol>','补全u，em');
    root = UE.htmlparser('<ol><li><em>sdf</em></li><ul><li>a</li><li>b</li><li>c</ul><li>jkl</ol>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<ol><li><em>sdf</em></li><ul><li>a</li><li>b</li><li>c</li></ul><li>jkl</li></ol>','补全li');
    root = UE.htmlparser('<li>123');
    equals(root.toHtml().replace(/[ ]+>/g,'>'), '<ul><li>123</li></ul>', '<li>123--补全li的parent--ul，前面有文本' );
    /*补ul的child*/
    root = UE.htmlparser('<ul>123');
    equals(root.toHtml().replace(/[ ]+>/g,'>'), '<ul><li>123</li></ul>', '<ul>123--补全ul的child--li，前面有文本' );
    /*补li开始标签*/
    root = UE.htmlparser('</li>123');
    equals(root.toHtml().replace(/[ ]+>/g,'>'), '<ul><li></li></ul>123', '</li>123--补全li开始标签，前面有文本' );
});

test( '属性引号问题', function() {
    var root = UE.htmlparser('<img width=200 height=200 />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
    root = UE.htmlparser("<img width='200' height='200' />");
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
    root = UE.htmlparser('<img width="200" height="200" />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
});

test( '大小写', function() {
    var root = UE.htmlparser('<p><TD></TD></p>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p>');
    root = UE.htmlparser('<OL><LI><em><u>sdf<LI>sdfsdf</OL>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<ol><li><em><u>sdf</u></em></li><li>sdfsdf</li></ol>','补全u，em');
    root = UE.htmlparser('<IMG width=200 height=200 />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
});

test( '裸字', function() {
    var root = UE.htmlparser('sdfasdfasdf');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'sdfasdfasdf');

});
test( '只有结束标签的情况', function() {
    var root = UE.htmlparser('<p>hello1</a></p><p>hello2</p>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<p>hello1</p><p>hello2</p>');
});

test( '开始标签与后面文本的空格过滤，其他不过滤inline节点之间的空格，过滤block节点之间的空格', function () {
    /*inline节点之间的空格要留着*/
    var root = UE.htmlparser('<a href="www.baidu.com">baidu</a> <a> hello </a>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<a href="www.baidu.com">baidu</a>&nbsp;<a>&nbsp;hello&nbsp;</a>');
    root = UE.htmlparser('<span> <span> hello </span></span> <span> he llo2<span> hello </span> </span>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<span>&nbsp;<span>&nbsp;hello&nbsp;</span></span>&nbsp;<span>&nbsp;he&nbsp;llo2<span>&nbsp;hello&nbsp;</span>&nbsp;</span>' );
    /*block节点之间的空格不要留着     这个太纠结，不必了。会把ol拆开，后面的变成ul*/
//        html = '<ol>   <li> li_test </li> <li> li test2 </li> </ol> ';
//        node = serialize.parseHTML( html );
//        node = serialize.filter( node );
//        equal( serialize.toHTML( node ), '<ol><li>li_test&nbsp;</li><li>li&nbsp;test2&nbsp;</li></ol>&nbsp;' );
} );

/*特殊字符需要转义*/
test( '文本包含特殊字符，如尖括号', function () {
    var root = UE.htmlparser('<span><td  hello</span>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<span>&lt;td&nbsp;&nbsp;hello</span>', '字符转义' );
} );

test( '转换script标签', function () {
    var root = UE.htmlparser('<script type="text/javascript">ueditor</script>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<div type="text/javascript"></div>', '转换script标签' );
} );

test( '转换style标签', function () {
    var root = UE.htmlparser('<style type="text/css"></style>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<div type="text/css"></div>' , '转换script标签');
} );

test( 'br', function () {
    var root = UE.htmlparser('<br />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<br/>', '对br不操作');
    root = UE.htmlparser('<br>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<br/>', '补充br后面的斜杠');
} );

/*考察标签之间嵌套关系*/
test( '复杂标签嵌套', function() {
    var root = UE.htmlparser('<span>hello1<p><img>hello2<div>hello3<p>hello4');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<span>hello1</span><p><img/>hello2</p><div>hello3<p>hello4</p></div>');
} );

test( 'bi转换为strong，em', function() {
    var root = UE.htmlparser('<b><i>hello</i>hello</b>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<strong><em>hello</em>hello</strong>','转化b和i');
} );

test( '转换font标签', function () {
    var root = UE.htmlparser('<font size="3" color="red"><b><i>x</i></b></font>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<span style="font-size:16px;color:red;"><strong><em>x</em></strong></span>' , '转换font标签');
} );

test( 'font转span', function() {
    var root = UE.htmlparser('<font size="20" color="red" lang="en" face="arial"><b><i>hello</i>hello</b>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<span style="font-size:12px;color:red;font-family:arial;"><strong><em>hello</em>hello</strong></span>','转换font标签');
    /*size的值在sizeMap中有对应的值*/
    root = UE.htmlparser('<b><font size="1" color="#ff0000" lang="en" face="楷体">hello');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<strong><span style="font-size:10px;color:#ff0000;font-family:楷体;">hello</span></strong>','转换font标签');
} );

test( 'trace 1727:过滤超链接后面的空格', function () {
    var root = UE.htmlparser('<a href="www.baidu.com">baidu</a> ddd');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<a href="www.baidu.com">baidu</a>&nbsp;ddd','过滤超链接后面的空格');
} );

test( '转换img标签', function () {
    var root = UE.htmlparser('<img src="file:///C:/DOCUME~1/DONGYA~1/LOCALS~1/Temp/msohtmlclip1/01/clip_image002.jpg" width="553" height="275" />');
    var spa=ua.browser.ie==6?' orgSrc="'+te.obj[1].options.UEDITOR_HOME_URL+'themes/default/images/spacer.gif"':'';
    equals(root.toHtml().replace(/[ ]+>/g,'>'), '<img src="'+te.obj[1].options.UEDITOR_HOME_URL+'themes/default/images/spacer.gif" width="553" height="275" word_img="file:///C:/DOCUME~1/DONGYA~1/LOCALS~1/Temp/msohtmlclip1/01/clip_image002.jpg" style="background:url('+te.obj[1].options.UEDITOR_HOME_URL+'lang/'+te.obj[1].options.lang+'/images/localimage.png) no-repeat center center;border:1px solid #ddd"'+spa+' />' , '转换img标签');
} );