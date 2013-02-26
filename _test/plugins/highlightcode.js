/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-9-26
 * Time: 下午1:16
 * To change this template use File | Settings | File Templates.
 */
module('plugins.highlightcode');

test('插入代码',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    var div = te.dom[0];
    editor.render( div );
    stop();
    editor.ready(function(){
        var br = baidu.editor.browser.ie ? '&nbsp;' : '<br />';
        editor.setContent('<p>' + br + '</p>');
//        debugger
        range.setStart(editor.body.firstChild,0).collapse(1).select();
//        debugger
        setTimeout(function(){
//            debugger
            editor.execCommand('highlightcode','<?php echo "Hello World"; ?>','php');
            ua.manualDeleteFillData(editor.body);
            equal( editor.getContent().substring(0, 78),'<pre class=\"brush:php;toolbar:false;\">&lt;?php echo "Hello World"; ?&gt;</pre>','代码高亮');
            var tds = editor.body.firstChild.getElementsByTagName('td');
            range.selectNode(tds[0]).select();
            equal(editor.queryCommandState('highlightcode'),1,'插入代码高亮');
            editor.execCommand('highlightcode','<?php echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; ?>','php');
            stop();
            setTimeout(function(){
                equal( editor.getContent().substring(0, 158),'<pre class=\"brush:php;toolbar:false;\">&lt;?php echo \"Hello World\"; echo \"Hello World\"; echo \"Hello World\"; echo \"Hello World\"; echo \"Hello World\"; ?&gt;</pre>','代码修改');
                editor.fireEvent('fullscreenchanged');
                var html = {html:''};
                editor.fireEvent('getAllHtml',html);
                ok(html.html.indexOf('third-party/SyntaxHighlighter/shCoreDefault.css')!=-1,'加载shCoreDefault.css');
                ok(html.html.indexOf('third-party/SyntaxHighlighter/shCore.js')!=-1,'加载shCore.js');
                ua.manualDeleteFillData(editor.body);
                tds = editor.body.getElementsByTagName('td');
                range.selectNode(tds[0]).select();
                editor.execCommand('highlightcode');
                var br = ua.browser.ie?'&nbsp;':'<br>'
                equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','去掉代码高亮');
                start();
            },50);
        },500);
    },50);

});
/*trace 2648*/
test('切换源码不插入br',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>')
    range.setStart(editor.body.firstChild,0).select();
    editor.execCommand('highlightcode','<?php echo "Hello World"; ?>','php');
    var length=editor.body.childNodes.length;
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData(editor.body);
        editor.execCommand('source');
        setTimeout(function(){
            editor.execCommand('source');
            ok(length==editor.body.childNodes.length,'不增加br');
            start();
        },50);
    },50);
});

/*trace 2472*/
test('插入两个字符',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>')
    range.setStart(editor.body.firstChild,0).select();
    editor.execCommand('highlightcode','aa','php');
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData(editor.body);
        var br = ua.browser.ie?' ':'<br />'
        equal( editor.getContent().substring(0, 158),'<pre class=\"brush:php;toolbar:false;\">aa</pre><p>'+br+'</p>','插入成功');
        start();
    },50);
});