module('plugins.autotypeset');

test('全角半角转换',function(){
    window.localStorage.clear();
    var editor = te.obj[0];
    editor.setContent('<p>Mayday123,.Ｍａｙｄａｙ１２３，．</p>');
    var text = editor.getContent();
    equal(text,'<p>Mayday123,.Ｍａｙｄａｙ１２３，．</p>','半角全角内容输入正确');
    editor.execCommand('autotypeset');
    var text2 = editor.body.firstChild.innerHTML;
    equal(text2,'Mayday123,.Ｍａｙｄａｙ１２３，．','半角全角内容输入正确2');
    editor.options.autotypeset.tobdc=true;
    editor.execCommand('autotypeset');
    equal(editor.body.firstChild.innerHTML,'Ｍａｙｄａｙ１２３，．Ｍａｙｄａｙ１２３，．','内容转为全角：正确');
    editor.options.autotypeset.tobdc=false;
    editor.setContent('<p>Mayday123,.Ｍａｙｄａｙ１２３，．</p>');
    editor.options.autotypeset.bdc2sb=true;
    editor.execCommand('autotypeset');
    equal(editor.body.firstChild.innerHTML,'Mayday123,.Mayday123,.','内容转为半角：正确');
    editor.options.autotypeset.bdc2sb=false;
});
//todo
test('文本居中',function(){
    var editor = te.obj[0];
    editor.setContent('<p>p文本<br></p>');
    setTimeout(function(){
        editor.options.autotypeset.textAlign = 'center';
         editor.execCommand('autotypeset');
        equal($(editor.body.firstChild).css('text-align'),'center','文本居中');
        start();
    }, 100 );
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

test('trace:4018，4012',function(){
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue2';
    var editor2 = UE.getEditor('ue2');
    editor2.ready(function(){
        editor2.setContent('Mayday123,.Ｍａｙｄａｙ１２３，．');
        var c = $('#edui18_state div');
        ua.click(c[4]);
        ua.click($("input")[19]);
        var d = $(".edui-autotypesetpicker-body tr");
        var e = d[7].getElementsByTagName('input');
        ua.click(e[0]);
        var button = $(".edui-autotypesetpicker-body button");
        ua.click(button[0]);
        if(ua.browser.ie&&ua.browser.ie==8){
            equal(editor2.getContent(),"<p style=\"TEXT-ALIGN: left\">Ｍａｙｄａｙ１２３，．Ｍａｙｄａｙ１２３，．</p>","未执行半角转全角");
        }else{
            equal(editor2.getContent(),'<p style="text-align: left;">Mayday123,.Ｍａｙｄａｙ１２３，．</p>',"未执行半角转全角");
        }
        setTimeout(function () {
            UE.delEditor('ue2');
            window.localStorage.clear();
            start();
        }, 100);
    });
    stop();
});

test('trace:3991',function(){
    var editor3 = te.obj[0];
    setTimeout(function(){
        editor3.setContent('');
        editor3.execCommand('inserttable', {numCols: 3, numRows: 3});
        var text =editor3.body.getElementsByTagName('td')[0];
        var range = new baidu.editor.dom.Range(editor3.document);
        range.setStart(text,0).collapse(1).select();
        editor3.execCommand("inserttitlecol");
        equal(editor3.queryCommandState("inserttitlecol"),-1,'标题列不能向右合并');
        var f = $("#edui538_state")[0];
        start();
    }, 100);
    stop();
});

test('trace:3967',function(){
    var editor = te.obj[0];
    editor.setContent('123<br/>');
    editor.execCommand('insertorderedlist','decimal');
    editor.execCommand('source');
    setTimeout(function(){
        editor.execCommand('source');
        setTimeout(function(){
            editor.execCommand('source');
            var x = editor.getContent();
            ok(x.indexOf('br')== x.lastIndexOf('br'),'只有一个<br/>');
            start();
        },50)
    },50)
    stop();
});