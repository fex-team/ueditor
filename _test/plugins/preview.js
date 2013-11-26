module('plugins.preview');

test('插入代码后预览',function(){
//    var editor = te.obj[0];
//    var body = editor.body;
//    var html = '<pre _syntax="javascript" style="overflow-x: auto; "><span style=" text-align: right;padding:2px 10px  0;border-right:5px solid #ccc;margin:-2px 10px 0 0;color:#000;">1.&nbsp;&nbsp;</span><span style="color:#0000FF;">function</span>&nbsp;addSpace(linenum){<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">2.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#0000FF;">if</span>(linenum&lt;10){<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">3.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#0000FF;">return</span>&nbsp;<span style="color:#FF00FF;">"&amp;nbsp;&amp;nbsp;"</span>;<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">4.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<span style="color:#0000FF;">else</span>&nbsp;<span style="color:#0000FF;">if</span>(linenum&gt;=10&nbsp;&amp;&amp;&nbsp;linenum&lt;100){<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">5.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#0000FF;">return</span>&nbsp;<span style="color:#FF00FF;">"&amp;nbsp;"</span>;<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">6.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<span style="color:#0000FF;">else</span>&nbsp;<span style="color:#0000FF;">if</span>(linenum&gt;=100&nbsp;&amp;&amp;&nbsp;linenum&lt;1000){<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">7.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#0000FF;">return</span>&nbsp;<span style="color:#FF00FF;">""</span>;<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">8.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br><span style="text-align: right;padding:4px 10px  0;border-right:5px solid #ccc;margin:-5px 10px 0 0;color:#000;">9.&nbsp;&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;}</pre>';
//    editor.setContent(html);
//    editor.execCommand('preview');
//    ua.checkSameHtml(body.innerHTML,html,'预览不会对页面代码产生影响');
    equal('','');
});
//test('设置内容后后预览',function(){
//    if(ua.browser.gecko)return;//ff总不停打开窗口,实际操作没问题
//    var editor = te.obj[0];
//    var body = editor.body;
//    var html = '<p><span style="color:#ff0000">你好，<strong><em>我亲爱</em></strong></span><strong><em>的朋</em></strong>友</p>';
//    var html_ie10 ="<p><span style=\"color: rgb(255, 0, 0);\">你好，<strong><em>我亲爱</em></strong></span><strong><em>的朋</em></strong>友</p>";
//    editor.setContent(html);
//    editor.focus();
//    editor.execCommand('preview');
//    ua.checkSameHtml(body.innerHTML,(ua.browser.ie>8)?html_ie10:html,'预览不会对页面代码产生影响');
//});