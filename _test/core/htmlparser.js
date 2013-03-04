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
});


test( '补全不完整li', function() {
    var root = UE.htmlparser('<ol><li><em><u>sdf<li>sdfsdf</ol>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<ol><li><em><u>sdf</u></em></li><li>sdfsdf</li></ol>','补全u，em');
    root = UE.htmlparser('<ol><li><em>sdf</em></li><ul><li>a</li><li>b</li><li>c</ul><li>jkl</ol>');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<ol><li><em>sdf</em></li><ul><li>a</li><li>b</li><li>c</li></ul><li>jkl</li></ol>','补全li');
});

test( '属性引号问题', function() {
    var root = UE.htmlparser('<img width=200 height=200 />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
    var root = UE.htmlparser("<img width='200' height='200' />");
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
    var root = UE.htmlparser('<img width="200" height="200" />');
    equals(root.toHtml().replace(/[ ]+>/g,'>'),'<img width="200" height="200" />');
});