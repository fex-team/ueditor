module('plugins.autotypeset');
//todo
test('文本居中',function(){
    var editor = te.obj[0];
    editor.setContent('<p>p文本<br></p>');
    setTimeout(function(){
        editor.options.autotypeset.textAlign = 'center';
         editor.execCommand('autotypeset');
        equal($(editor.body.firstChild).css('text-align'),'center','文本居中');
        start();
    }, 50 );
    stop();
});

test('trace:2183 h1标题居中',function(){
    var editor = te.obj[0];
    editor.setContent('<h1>h1标题<br /></h1>');
    setTimeout(function(){
        editor.options.autotypeset.textAlign = 'center';
        editor.execCommand('autotypeset');
        equal($(editor.body.firstChild).css('text-align'),'center','h1标题居中');
        start();
    }, 50 );
    stop();
});

test('合并空行',function(){
    var editor = te.obj[0];
    editor.setContent('<p>欢迎使用</p><p><br /></p><p><br /></p><p>ueditor!</p>');
    setTimeout(function(){
        editor.options.autotypeset.mergeEmptyline = true;
        delete editor.options.autotypeset.textAlign;
        editor.execCommand('autotypeset');
        ua.manualDeleteFillData(editor.body);
        var html =editor.body.innerHTML.toLowerCase().replace(/\r\n/ig,'');
        equal(html,'<p>欢迎使用</p><p><br></p><p>ueditor!</p>','合并空行');
        start();
    }, 50 );
    stop();
});

test('带有图片表情',function(){
    var editor = te.obj[0];
    editor.setContent('<p>欢迎使用ueditor!<img src="http://img.baidu.com/hi/jx2/j_0015.gif" /></p>');
    editor.execCommand('autotypeset');
    equal($(editor.body.lastChild).css('text-align'),'center','图片居中');
    editor.options.autotypeset.imageBlockLine = 'left';
    editor.execCommand('autotypeset');
    equal($(editor.body.lastChild).css('text-align'),'left','图片居左');
});

test('删除空行',function(){
    var editor = te.obj[0];
    editor.setContent('<p>欢迎使用</p><p><br /></p><p><br /></p><p>ueditor!</p>');
    setTimeout(function(){
        editor.options.autotypeset.mergeEmptyline = false;//removeEmptyline
        editor.options.autotypeset.removeEmptyline = true;
        delete editor.options.autotypeset.textAlign;
        editor.execCommand('autotypeset');
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.innerHTML.toLowerCase().replace(/\r\n/ig,''),'<p>欢迎使用</p><p>ueditor!</p>','删除空行');
        start();
    }, 50 );
    stop();
});

test('首行缩进',function(){
    var editor = te.obj[0];
    editor.setContent('<p>欢迎使用ueditor!</p>');
    setTimeout(function(){
        editor.options.autotypeset.indent = true;
        editor.options.autotypeset.textAlign= "left";
        editor.execCommand('autotypeset');
        ua.manualDeleteFillData(editor.body);
        var html = '<p style=\"text-indent: 2em; text-align: left; \">欢迎使用ueditor!</p>';
        ua.checkHTMLSameStyle(html ,editor.document,editor.body,'首行缩进');
        start();
    }, 50 );
    stop();
});

/*trace 2650*/
test( 'trace 3277：图像对齐', function () {
    var editor = te.obj[0];
    editor.setContent( '<p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" width="50" height="51" _src="http://img.baidu.com/hi/jx2/j_0001.gif"></p>' );
    setTimeout(function(){
        editor.options.autotypeset.imageBlockLine = 'center';
        delete editor.options.autotypeset.textAlign;//imageBlockLine
        var html= '<p style="text-align:center"><img src="http://img.baidu.com/hi/jx2/j_0001.gif" width="50" height="51" _src="http://img.baidu.com/hi/jx2/j_0001.gif"/></p>';
        editor.execCommand('autotypeset');
        ua.checkHTMLSameStyle(html ,editor.document,editor.body,'图像对齐');
        start();
    }, 50 );
    stop();
} );

//ie下
test('trace 2651：字体样式',function(){
    var editor = te.obj[0];
    editor.setContent('<p><span style="font-size:24px;font-family:黑体, simhei;">欢迎使用ue</span>ditor!</p>');
    setTimeout(function(){
        editor.options.autotypeset.clearFontSize = editor.options.autotypeset.clearFontFamily = true;
        delete editor.options.autotypeset.textAlign;
        editor.execCommand('autotypeset');
        equal(ua.getChildHTML(editor.body),'<p>欢迎使用ueditor!</p>','恢复字体默认样式');
        start();
    }, 50 );
    stop();
});

test('去掉class,去掉多余节点',function(){
    var editor = te.obj[0];
    editor.setContent('<p class="noBorder">欢迎使用ueditor!</p>');
    editor.options.autotypeset.removeClass = true;
    delete editor.options.autotypeset.textAlign;
    editor.execCommand('autotypeset');
    equal(ua.getChildHTML(editor.body),'<p>欢迎使用ueditor!</p>','去掉class');
});

test('粘贴过滤',function(){
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    editor.setContent('');
    editor.options.autotypeset.pasteFilter = true;
    editor.options.autotypeset.removeEmptyline = true;
    delete editor.options.autotypeset.textAlign;
    editor.execCommand('autotypeset');
    var html ={html:'<img src="http://img.baidu.com/hi/jx2/j_0015.gif" />hello1'};
    editor.fireEvent('beforepaste',html);
    editor.execCommand( 'insertHtml',html.html,true);
    editor.fireEvent("afterpaste");
    var txt='<p style="text-align:center;"><img src="http://img.baidu.com/hi/jx2/j_0015.gif"></p>hello1';
    ua.checkHTMLSameStyle(txt, editor.document, editor.body, '文字左对齐，表情居中');

    editor.setContent('');
    editor.options.autotypeset.imageBlockLine = 'none';
    editor.options.autotypeset.textAlign = 'center';
    editor.options.autotypeset.removeEmptyline = true;
    editor.options.autotypeset.pasteFilter = true;
    editor.execCommand('autotypeset');
    html ={html:'<p>hello1</p><p style="text-align:center;"><img src="http://img.baidu.com/hi/jx2/j_0001.gif"/></p><p>hello2</p>'};
    editor.fireEvent('beforepaste',html);
    editor.execCommand( 'insertHtml',html.html,true);
    editor.fireEvent("afterpaste");
    txt='<p style="text-align:center;">hello1<img src="http://img.baidu.com/hi/jx2/j_0001.gif" style="float: none;">hello2</p>';
    ua.checkHTMLSameStyle(txt, editor.document, editor.body, '文字居中，表情居左');
});