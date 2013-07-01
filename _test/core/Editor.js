module("core.Editor");
test("autoSyncData:true,textarea容器(由setcontent触发的)", function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<form id="form" method="post" target="_blank"><textarea id="myEditor" name="myEditor">这里的内容将会和html，body等标签一块提交</textarea></form>';
    equal(document.getElementById('form').childNodes.length, 1, 'form里只有一个子节点');
    var editor_a = UE.getEditor('myEditor');

    stop();
    editor_a.ready(function () {
        equal(document.getElementById('form').childNodes.length, 2, 'form里有2个子节点');
        editor_a.setContent('<p>设置内容autoSyncData 1<br/></p>');
        setTimeout(function () {
            var form = document.getElementById('form');
            equal(form.childNodes.length, 2, '失去焦点,form里多了textarea');
            equal(form.lastChild.tagName.toLowerCase(), 'textarea', '失去焦点,form里多了textarea');
            equal(form.lastChild.value, '<p>设置内容autoSyncData 1<br/></p>', 'textarea内容正确');
            div = form.parentNode;
            editor_a.destroy();
            div.parentNode.removeChild(div);
            start();
        }, 100);
    });
});
test("autoSyncData:true（由blur触发的）", function () {
    //todo ie8里事件触发有问题，暂用手动测
    if (ua.browser.ie > 8 || !ua.browser.ie) {
        var div = document.body.appendChild(document.createElement('div'));
        div.innerHTML = '<form id="form" method="post" ><script type="text/plain" id="myEditor" name="myEditor"></script></form>';
        var editor_a = UE.getEditor('myEditor');
        stop();
        editor_a.ready(function () {
            editor_a.body.innerHTML = '<p>设置内容autoSyncData 2<br/></p>';
            equal(document.getElementsByTagName('textarea').length, 0, '内容空没有textarea');
            ua.blur(editor_a.body);
            stop();
            setTimeout(function () {
                var form = document.getElementById('form');
                equal(form.childNodes.length, 2, '失去焦点,form里多了textarea');
                equal(form.lastChild.tagName.toLowerCase(), 'textarea', '失去焦点,form里多了textarea');
                equal(form.lastChild.value, '<p>设置内容autoSyncData 2<br/></p>', 'textarea内容正确');
                editor_a.destroy();
                form.parentNode.removeChild(form);
                start();
            }, 100);
        });
    }
});
test("sync", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.innerHTML = '<form id="form" method="post" target="_blank"><textarea id="myEditor" name="myEditor">这里的内容将会和html，body等标签一块提交</textarea></form>';
    var editor_a = UE.getEditor('myEditor');
    stop();
    editor_a.ready(function () {
        editor_a.body.innerHTML = '<p>hello</p>';
        editor_a.sync("form");
        setTimeout(function () {
            var form = document.getElementById('form');
            equal(form.lastChild.value, '<p>hello</p>', '同步内容正确');
            div = form.parentNode;
            editor_a.destroy();
            div.parentNode.removeChild(div);
            start();
        }, 100);
    });
});
test("hide,show", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor(div);
    editor.ready(function () {
        equal(editor.body.getElementsByTagName('span').length, 0, '初始没有书签');
        editor.hide();
        setTimeout(function () {
            equal($(editor.container).css('display'), 'none', '隐藏编辑器');
            equal(editor.body.getElementsByTagName('span').length, 1, '插入书签');
            ok(/_baidu_bookmark_start/.test(editor.body.getElementsByTagName('span')[0].id), '书签');
            editor.show();
            setTimeout(function () {
                equal($(te.dom[0]).css('display'), 'block', '显示编辑器');
                var br = ua.browser.ie ? '' : '<br>';
                equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', '删除书签');
                UE.delEditor('ue');
                start();
            }, 50);
        }, 50);
    });
    stop();
});
//
test("_setDefaultContent--focus", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor(div);
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('focus');
        var br = ua.browser.ie ? '' : '<br>';
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'focus');
        setTimeout(function () {
        UE.delEditor('ue');
        start();
        }, 50);
    });
    stop();
});

test("_setDefaultContent--firstBeforeExecCommand", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor(div);
    editor.ready(function () {
        editor._setDefaultContent('hello');
        editor.fireEvent('firstBeforeExecCommand');
        var br = ua.browser.ie ? '' : '<br>';
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', 'firstBeforeExecCommand');
        setTimeout(function () {
        UE.delEditor('ue');
        start();
    }, 50);
    });
    stop();
});

test("setDisabled,setEnabled", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function(){
        editor.setContent('<p>欢迎使用ueditor!</p>');
        editor.focus();
        setTimeout(function () {
            var startContainer = editor.selection.getRange().startContainer.outerHTML;
            var startOffset = editor.selection.getRange().startOffset;
            var collapse = editor.selection.getRange().collapsed;
            editor.setDisabled();
            equal(editor.body.contentEditable, 'false', 'setDisabled');
            equal(editor.body.firstChild.firstChild.tagName.toLowerCase(), 'span', '插入书签');
            equal($(editor.body.firstChild.firstChild).css('display'), 'none', '检查style');
            equal($(editor.body.firstChild.firstChild).css('line-height'), '0px', '检查style');
            ok(/_baidu_bookmark_start/.test(editor.body.firstChild.firstChild.id), '书签');///_baidu_bookmark_start/.test()
            editor.setEnabled();
            equal(editor.body.contentEditable, 'true', 'setEnabled');
            equal(ua.getChildHTML(editor.body), '<p>欢迎使用ueditor!</p>', '内容恢复');
            equal(editor.selection.getRange().startContainer.outerHTML, startContainer, '检查range');
            equal(editor.selection.getRange().startOffset, startOffset, '检查range');
            equal(editor.selection.getRange().collapsed, collapse, '检查range');
            setTimeout(function () {
                UE.delEditor('ue');
                start();
            }, 50);
        }, 20);
    });
    stop();
});
test("render-- element", function () {
    var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../', 'autoFloatEnabled':false});
    var div = document.body.appendChild(document.createElement('div'));
    equal(div.innerHTML, "", "before render");
    editor.render(div);
    equal(div.firstChild.tagName.toLocaleLowerCase(), 'iframe', 'check iframe');
    ok(/ueditor_/.test(div.firstChild.id), 'check iframe id');
    te.dom.push(div);
});

test("render-- elementid", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div.id);
    equal(div.firstChild.tagName.toLocaleLowerCase(), 'iframe', 'check iframe');
    ok(/ueditor_/.test(div.firstChild.id), 'check iframe id');
});

test("render-- options", function () {
    var options = {'initialContent':'<span class="span">xxx</span><div>xxx<p></p></div>', 'UEDITOR_HOME_URL':'../../../', autoClearinitialContent:false, 'autoFloatEnabled':false};
    var editor = new baidu.editor.Editor(options);
    stop();
    setTimeout(function () {
        var div = document.body.appendChild(document.createElement('div'));
        editor.render(div);
        /*会自动用p标签包围*/
        var space = baidu.editor.browser.ie ? '&nbsp;' : '<br>';
        //策略变化，自1.2.6，div 标签都会被过滤
        setTimeout(function () {
            equal(ua.getChildHTML(editor.body), '<p><span class="span">xxx</span></p><p>xxx</p><p>' + space + '</p>', 'check initialContent');
            te.dom.push(div);
            start();
        }, 50);
    }, 50);
});

//test( 'destroy', function() {
////    var editor = new baidu.editor.Editor( {'autoFloatEnabled':false} );
//    var editor = new UE.ui.Editor( {'autoFloatEnabled':false} );
//    editor.key = 'ed';
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    div.id = 'edu';
//    editor.render( div );
//    editor.ready(function(){
//        editor.destroy();
//        equal( document.getElementById( 'ed' ).tagName.toLowerCase(),'textarea', '容器被删掉了' );
//    });
//} );

//test( "setup--ready event", function() {
//    //todo
//} );

test("getContent--转换空格，nbsp与空格相间显示", function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    setTimeout(function () {
        editor.focus();
        var innerHTML = '<div> x  x   x&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;  &nbsp;</div>';
        editor.setContent(innerHTML);
        equal(editor.getContent(), '<p>x &nbsp;x &nbsp; x&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp; &nbsp;&nbsp;</p>', "转换空格，nbsp与空格相间显示，原nbsp不变");
        UE.delEditor('test1');
        start();
    }, 50);
});

test('getContent--参数为函数', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    setTimeout(function () {
        editor.focus();
        editor.setContent("<p><br/>dd</p>");
        equal(editor.getContent(), "<p><br/>dd</p>", 'hasContents判断不为空');
        equal(editor.getContent(function () {
            return false
        }), "", '为空');
        UE.delEditor('test1');
        start();
    }, 50);
});

test('getContent--2个参数，第一个参数为参数为函数', function () {
    var editor = te.obj[1];
    var div = te.dom[0];
    editor.render(div);
    stop();
    setTimeout(function () {
        editor.focus();
        editor.setContent("<p><br/>dd</p>");
        equal(editor.getContent(), "<p><br/>dd</p>", 'hasContents判断不为空');
        equal(editor.getContent("", function () {
            return false
        }), "", '为空');
        UE.delEditor('test1');
        start();
    }, 50);
});


/*ie自动把左边的空格去掉，所以就不测这个了*/
//test( "getContent--空格不会被去掉", function() {
//    var editor = te.obj[1];
//    var div = te.dom[0];
//    editor.render( div );
//    editor.focus();
//    var innerHTML = '你好  ';
//    editor.setContent( innerHTML );
//    equal( editor.getContent().toLowerCase(), '<p>你好  </p>', "删除不可见字符" );
//} );

test("setContent", function () {
    var editor = UE.getEditor('test1');
    stop();
    editor.ready(function () {
        editor.focus();
        expect(2);
        editor.addListener("beforesetcontent", function () {
            ok(true, "beforesetcontent");
        });
        editor.addListener("aftersetcontent", function () {
            ok(true, "aftersetcontent");
        });
        var html = '<span><span></span><strong>xx</strong><em>em</em><em></em><u></u></span><div>xxxx</div>';
        editor.setContent(html);
        var div_new = document.createElement('div');
        div_new.innerHTML = '<p><span><span></span><strong>xx</strong><em>em</em><em></em><span style="text-decoration: underline"></span></span></p><div>xxxx</div>';
        var div2 = document.createElement('div');
        div2.innerHTML = editor.body.innerHTML;
        ua.haveSameAllChildAttribs(div2, div_new, 'check contents');
        UE.delEditor('test1');
        start();
    });
});

test("setContent 追加", function () {
    var editor = UE.getEditor('test1');
    stop();
    editor.ready(function () {
        editor.focus();
        expect(2);
        editor.addListener("beforesetcontent", function () {
            ok(true, "beforesetcontent");
        });
        editor.addListener("aftersetcontent", function () {
            ok(true, "aftersetcontent");
        });
        var html = '<span><span></span><strong>xx</strong><em>em</em><em></em><u></u></span><div>xxxx</div>';
        editor.setContent(html);
        var div_new = document.createElement('div');
        div_new.innerHTML = '<p><span><span></span><strong>xx</strong><em>em</em><em></em><span style="text-decoration: underline"></span></span></p><div>xxxx</div>';
        var div2 = document.createElement('div');
        div2.innerHTML = editor.body.innerHTML;
        ua.haveSameAllChildAttribs(div2, div_new, 'check contents');
        UE.delEditor('test1');
        start();
    }, 50);
});
//test( "focus", function() {
//    var editor = te.obj[1];
//    expect( 1 );
//    /*设置onfocus事件,必须同步处理，否则在ie下onfocus会在用例执行结束后才会触发*/
//    stop();
//    editor.window.onfocus = function() {
//        ok( true, 'onfocus event dispatched' );
//        start();
//    };
//    editor.focus();
//} );

test("focus(false)", function () {
    var editor = UE.getEditor('test1');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(false);
        if (ua.browser.gecko) {
            equal(editor.selection.getRange().startContainer, editor.body.firstChild, "focus(false)焦点在最前面");
            equal(editor.selection.getRange().endContainer, editor.body.firstChild, "focus(false)焦点在最前面");
        }
        else {
            equal(editor.selection.getRange().startContainer, editor.body.firstChild.firstChild, "focus(false)焦点在最前面");
            equal(editor.selection.getRange().endContainer, editor.body.firstChild.firstChild, "focus(false)焦点在最前面");
        }
        equal(editor.selection.getRange().startOffset, 0, "focus(false)焦点在最前面");
        equal(editor.selection.getRange().endOffset, 0, "focus(false)焦点在最前面");
        UE.delEditor('test1');
        start();
    });
});

test("focus(true)", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent("<p>hello1</p><p>hello2</p>");
        editor.focus(true);
        if (ua.browser.gecko) {
            equal(editor.selection.getRange().startContainer, editor.body.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endContainer, editor.body.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().startOffset, editor.body.lastChild.childNodes.length, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endOffset, editor.body.lastChild.childNodes.length, "focus( true)焦点在最后面");
        }
        else {
            equal(editor.selection.getRange().startContainer, editor.body.lastChild.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endContainer, editor.body.lastChild.lastChild, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().startOffset, editor.body.lastChild.lastChild.length, "focus( true)焦点在最后面");
            equal(editor.selection.getRange().endOffset, editor.body.lastChild.lastChild.length, "focus( true)焦点在最后面");
        }
        UE.delEditor('ue');
        start();
    });
});

test("_initEvents,_proxyDomEvent--click", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        expect(1);
        stop();
        editor.addListener('click', function () {
            ok(true, 'click event dispatched');
            start();
        });
        ua.click(editor.document);
        UE.delEditor('ue');
    });
});

//test("_initEvents,_proxyDomEvent--focus", function() {
//    var editor = te.obj[1];
//
//    expect(1);   stop();
//    editor.addListener('focus', function() {
//        ok(true, 'focus event dispatched');
//        start();
//    });
//    editor.setContent("<p>hello1</p><p>hello2</p>");
//    editor.focus();
//});


//TODO
//test( "_selectionChange--测试event是否被触发", function() {
//    var editor = te.obj[1];
//    var div = te.dom[0];
//    editor.render( div );
//    editor.focus();
//    expect( 2 );
//    stop();
//    editor.addListener( 'beforeselectionchange', function() {
//        ok( true, 'before selection change' );
//    } );
//    editor.addListener( 'selectionchange', function() {
//        ok( true, 'selection changed' );
//    } );
//
//    ua.mousedown( editor.document, {clientX:0,clientY:0} );
//    setTimeout( function() {
//        ua.mouseup( editor.document, {clientX:0,clientY:0} );
//    }, 50 );
//
//    /*_selectionChange有一定的延时才会触发，所以需要等一会*/
//    setTimeout( function() {
//        start();
//    }, 200 );
//} );

//test("_selectionChange--fillData", function() {
//    var editor = te.obj[1];
//    var div = te.dom[0];
//    editor.focus();
//    //TODO fillData干嘛用的
//});

/*按钮高亮、正常和灰色*/
test("queryCommandState", function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent("<p><b>xxx</b>xxx</p>");
        var p = editor.document.getElementsByTagName('p')[0];
        var r = new baidu.editor.dom.Range(editor.document);
        r.setStart(p.firstChild, 0).setEnd(p.firstChild, 1).select();
        equal(editor.queryCommandState('bold'), 1, '加粗状态为1');
        r.setStart(p, 1).setEnd(p, 2).select();
        equal(editor.queryCommandState('bold'), 0, '加粗状态为0');
        UE.delEditor('ue');
        start();
    });
});

test("queryCommandValue", function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p style="text-align:left">xxx</p>');
        var range = new baidu.editor.dom.Range(editor.document);
        var p = editor.document.getElementsByTagName("p")[0];
        range.selectNode(p).select();
        equal(editor.queryCommandValue('justify'), 'left', 'text align is left');
        UE.delEditor('ue');
        start();
    });
});

test("execCommand", function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();

        editor.setContent("<p>xx</p><p>xxx</p>");
        var doc = editor.document;
        var range = new baidu.editor.dom.Range(doc);
        var p = doc.getElementsByTagName('p')[1];
        range.setStart(p, 0).setEnd(p, 1).select();
        editor.execCommand('justify', 'right');
        equal($(p).css('text-align'), 'right', 'execCommand align');
        /*给span加style不会重复添加span*/
        range.selectNode(p).select();
        editor.execCommand("forecolor", "red");
        /*span发生了变化，需要重新获取*/

        var span = doc.getElementsByTagName('span')[0];
        equal(span.style['color'], 'red', 'check execCommand color');
        var div_new = document.createElement('div');
        div_new.innerHTML = '<p><span style="color: red; ">xx</span></p><p style="text-align: right; ">xxx</p>';

        var div1 = document.createElement('div');
        div1.innerHTML = editor.body.innerHTML;
        ok(ua.haveSameAllChildAttribs(div_new, div1), 'check style');
        UE.delEditor('ue');
        start();
    });
});

test("hasContents", function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('');
        ok(!editor.hasContents(), "have't content");
        editor.setContent("xxx");
        ok(editor.hasContents(), "has contents");
        editor.setContent('<p><br/></p>');
        ok(!editor.hasContents(), '空p认为是空');
        UE.delEditor('ue');
        start();
    });
});


//test( "hasContents--只有空格", function() {
//    var editor = te.obj[1];
//    editor.focus();
//    editor.setContent( '    ' );
//    ok( editor.hasContents(), "空格不被过滤" );
//    editor.setContent( "<p> \t\n      </p>" );
//    ok( editor.hasContents(), "空格不过滤" );
//} );

/*参数是对原有认为是空的标签的一个扩展，即原来的dtd认为br为空，加上这个参数可以认为br存在时body也不是空*/
test("hasContents--有参数", function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p><img src="" alt="">你好<ol><li>ddd</li></ol></p>');
        ok(editor.hasContents(['ol', 'li', 'table']), "有ol和li");
        ok(editor.hasContents(['td', 'li', 'table']), "有li");
        editor.setContent('<p><br></p>');
        ok(!editor.hasContents(['']), "为空");
        ok(editor.hasContents(['br']), "不为空");
        UE.delEditor('ue');
        start();
    });
});

//test( 'getContentTxt--文本前后中间有空格', function() {
//    var editor = te.obj[1];
//    editor.focus();
//    editor.setContent( '你 好\t\n' );
//    equal( editor.getContentTxt(), '你 好\t\n' )
//    equal( editor.getContentTxt().length, 3, '3个字符，空格不会被过滤' )
//} );

test('trace 1964 getPlainTxt--得到有格式的编辑器的纯文本内容', function () {
    if (ua.browser.ie > 0 && ua.browser.ie < 9)return;//TODO 1.2.6

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('<p>&nbsp;</p><p>&nbsp; hell\no<br/>hello</p>');

        equal(editor.getPlainTxt(), "\n  hello\nhello\n", '得到编辑器的纯文本内容，但会保留段落格式');
        UE.delEditor('ue');
        start();
    });
});

test('getContentTxt--文本前后的空格,&nbs p转成空格', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        editor.setContent('&nbsp;&nbsp;你 好&nbsp;&nbsp; ');
        equal(editor.getContentTxt(), '  你 好   ');
        equal(editor.getContentTxt().length, 8, '8个字符，空格不被过滤');
        UE.delEditor('ue');
        start();
    });
});
test('getAllHtml', function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.focus();
        var html = editor.getAllHtml();
        ok(/iframe.css/.test(html), '引入样式');
        UE.delEditor('ue');
        start();
    });
});
test('2个实例采用2个配置文件', function () {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '../../editor_config.js';
    head.appendChild(script);
    expect(6);
    stop();
    /*动态加载js需要时间，用这个ueditor.config.js覆盖默认的配置文件*/
    setTimeout(function () {
        var div1 = document.body.appendChild(document.createElement('div'));
        div1.id = 'div1';
        div1.style.height = '200px';
        var div2 = document.body.appendChild(document.createElement('div'));
        div2.id = 'div2';
        var editor1 = UE.getEditor('div1',{'UEDITOR_HOME_URL':'../../../', 'initialContent':'欢迎使用ueditor', 'autoFloatEnabled':false});
        editor1.ready(function(){
            var editor2 = UE.getEditor('div2',UEDITOR_CONFIG2);
            editor2.ready(function () {
                //1.2.6 高度是iframe容器的高度
                equal(editor1.ui.getDom('iframeholder').style.height, '200px', '编辑器高度为200px');
                equal(editor2.ui.getDom('iframeholder').style.height, '400px', '自定义div高度为400px');
                var html = UEDITOR_CONFIG2.initialContent;
                ua.checkHTMLSameStyle(html, editor2.document, editor2.body.firstChild, '初始内容为自定制的');
                equal(editor2.options.enterTag, 'br', 'enterTag is br');
                html = '欢迎使用ueditor';
                equal(html, editor1.body.firstChild.innerHTML, '内容和ueditor.config一致');
                equal(editor1.options.enterTag, 'p', 'enterTag is p');
                UE.delEditor('div1');
                UE.delEditor('div2');
                start();
            });
        });
    }, 100);
});
test('绑定事件', function () {
    document.onmouseup = function (event) {
        ok(true, "mouseup is fired");
    };
    document.onmousedown = function (event) {
        ok(true, "mousedown is fired");
    };
    document.onmouseover = function (event) {
        ok(true, "mouseover is fired");
    };
    document.onkeydown = function (event) {
        ok(true, "keydown is fired");
    };
    document.onkeyup = function (event) {
        ok(true, "keyup is fired");
    };
    var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
    var div = document.body.appendChild(document.createElement('div'));
    editor.render(div);
    expect(5);
    editor.ready(function () {
        setTimeout(function () {
            editor.focus();
            ua.mousedown(document.body);
            ua.mouseup(document.body);
            ua.mouseover(document.body);
            ua.keydown(document.body, {'keyCode':13});
            ua.keyup(document.body, {'keyCode':13});
            setTimeout(function () {
                start();
            }, 1000);
        }, 50);
    });
    stop();
});


////.fireMouseEvent(target, "contextmenu", options);
//test('dragover',function(){
//    var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
//    var div = document.body.appendChild(document.createElement('div'));
//    editor.render(div);
//    editor.ready(function(){
//        editor.focus();
//        ua.fireMouseEvent(document.body, "dragover");
//        setTimeout(function(){
//            expect(5);
//            start();
//        },100);
//    });
//});