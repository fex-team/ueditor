module('plugins.autolink');


//test('', function () {
//    stop()
//});
//自动添加的功能是针对非ie的，单测用例同样只针对非ie,仍需手动测试检验ie与非ie下效果是否一致
test('输入超链接后回车', function () {
    if (!ua.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>http://www.baidu.com</p>');
        stop();
        setTimeout(function () {
            range.setStart(body.firstChild.firstChild, body.firstChild.firstChild.length).collapse(1).select();
            setTimeout(function () {
                ua.keydown(editor.body, {'keyCode': 13});
                ua.keyup(editor.body, {'keyCode': 13});
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                equal(ua.getChildHTML(a), 'http://www.baidu.com', '检查a的内容');
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                ok(a && $(a).attr('_src').indexOf('http://www.baidu.com') != -1, '检查a的_src');
                }else{
                    var text = editor.getContent();
                    equal(text, '<p>http://www.baidu.com</p>', '检查p的内容');
                }
                start();
            }, 20);
        }, 20);
    }
});

test('输入超链接后按空格', function () {
    if (!ua.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        setTimeout(function () {
            editor.setContent('<p>http://www.baidu.com</p>');
            range.setStart(body.firstChild, 1).collapse(1).select();
            ua.keydown(editor.body, {'keyCode': 32});
            setTimeout(function () {
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                    equal(ua.getChildHTML(a), 'http://www.baidu.com', '检查a的内容');
                    ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                    ok(a && $(a).attr('_src').indexOf('http://www.baidu.com') != -1, '检查a的_src');
                }else{
                    var text = editor.getContent();
                    equal(text, '<p>http://www.baidu.com</p>', '检查p的内容');
                }
                start();
            }, 20);
        }, 20);
        stop();
    }
});

test('字符前面有内容', function () {
    if (!ua.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p><img src="" alt=""><span style="color: red">http://www.baidu.com</span></p>');
        range.setStart(body.firstChild, 2).collapse(1).select();
        stop();
        setTimeout(function () {
            ua.keydown(editor.body, {'keyCode': 32});
            setTimeout(function () {
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                var html = 'http://www.baidu.com';
                equal(ua.getChildHTML(a), 'http://www.baidu.com', '检查a的内容');
                }else{
                    var x= body.firstChild.firstChild.nextSibling.innerHTML;
                    equal(x, 'http://www.baidu.com', '检查a的内容');
                }
                start();
            }, 20);
        }, 20);
    }
});

test('在p后面回车', function () {
    if (!UE.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>www.baidu.com</p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 1).collapse(1).select();
            ua.keydown(editor.body, {'keyCode': 13});
            setTimeout(function () {
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                equal(ua.getChildHTML(a), 'www.baidu.com', '检查a的内容');
                }else{
                    var p =body.firstChild.innerHTML;
                    equal(p,'www.baidu.com', '检查a的内容');
                }
                start();
            }, 20);
        }, 20);
        stop();
    }
});
///*trace 1709 在“你好http://www.baidu.com”后回车／空格，各浏览器表现不一致*/
////这种情况，在ie中可以生成自动连接，非ie不可，现在以生成连接为期望结果
test('trace 1709 在与其他文本相连的链接后空格', function () {
    if (!UE.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>你好http://www.baidu.com</p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 1).collapse(1).select();
            ua.keydown(editor.body, {'keyCode': 32});
            setTimeout(function () {
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                equal(ua.getChildHTML(a), 'http://www.baidu.com', '检查a的内容');
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                }else{
                    var p =body.firstChild.innerHTML;
                    equal(p,'你好http://www.baidu.com', '检查a的内容');
                }
                start();
            }, 20);
        }, 20);
        stop();
    }
});
////修改：对P中的文字内容，原：<p>你好htp://ww.baidu.com</p>
test('你好htp://ww.baidu.com  后面回车', function () {
    if (!UE.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>你好http://www.baidu.com</p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 1).collapse(1).select();
            ua.keydown(editor.body, {'keyCode': 32});
            setTimeout(function () {
                equal(body.firstChild.firstChild.nodeValue, '你好', '你好http://www.baidu.com 转换成文字+超链接');
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                equal(ua.getChildHTML(a), 'http://www.baidu.com', '检查a的内容');
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                }else{
                    var p =body.firstChild.innerHTML;
                    equal(p,'你好http://www.baidu.com', '检查a的内容');
                }
                start();
            }, 20);
        }, 20);
        stop();
    }
});
//<p>欢迎<strong>使用</strong>ueditor!</p>
test('trace 2121', function () {
    if (!UE.browser.ie) {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p><span style="color:#ff0000;">欢迎<strong>使用</strong></span>ueditor!www.baidu.com</p>');
        stop();
        setTimeout(function () {
            range.setStart(body.firstChild.lastChild, body.firstChild.lastChild.length).collapse(1).select();
            setTimeout(function () {
                ua.keydown(editor.body, {'keyCode': 13});
                var a = body.firstChild.getElementsByTagName('a')[0];
                if(a){
                equal(ua.getChildHTML(a), 'www.baidu.com', '检查a的内容');
                ok(a && $(a).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                ok(a && $(a).attr('_src').indexOf('http://www.baidu.com') != -1, '检查a的_src');
                }else{
                    var p = body.firstChild.innerHTML;
                    equal(p,'<span style="color:#ff0000;">欢迎<strong>使用</strong></span>ueditor!www.baidu.com','内容未改变');
                }
                start();
            }, 20);
        }, 20);
    }
});
test('autofloat:false 禁用IE中的自动加超链接功能', function () {
    if(ua.browser.ie==8)return;
    //在IE中回车/空格自动加连接,这里模拟加连接以后,测试keyup时把添加的链接去掉
    if (ua.browser.ie>8) {//这个用例中,ie8不好模拟startContainer.nodeName = p,用下面的用例测是一样的
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'ue';
        var editor = UE.getEditor('ue', {autolink: false});
        editor.ready(function () {
            var range = new baidu.editor.dom.Range(editor.document);
            var body = editor.body;
            editor.body.innerHTML = '<p><a href="http://www.baidu.com">www.baidu.com</a></p><p>&nbsp;</p>';
            setTimeout(function () {
                range.selectNode(body.lastChild.firstChild).select();
                setTimeout(function () {
                    ua.keyup(editor.body, {'keyCode': 13});
                    setTimeout(function () {
                        equal(body.firstChild.getElementsByTagName('a').length, 0, 'a 标签被去掉了');
                        equal(body.childNodes.length, 2, '结果正确');
                        equal(body.firstChild.tagName.toLowerCase(), 'p', '结果正确');
                        equal(body.firstChild.innerHTML, 'www.baidu.com', '结果正确');
                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        start();
                    }, 60);
                }, 20);
            }, 20);
        });
        stop();
    }
});
test('autofloat:false 禁用IE中的自动加超链接功能--回车', function () {
    if(ua.browser.ie==8)return;
    //在IE中回车/空格自动加连接,这里模拟加连接以后,测试keyup时把添加的链接去掉
    if (ua.browser.ie) {
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'ue';
        var editor = UE.getEditor('ue', {autolink: false});
        editor.ready(function () {
            var range = new baidu.editor.dom.Range(editor.document);
            var body = editor.body;
            editor.body.innerHTML = '<p><a href="http://www.baidu.com">www.baidu.com</a></p><p><img></p>';
            setTimeout(function () {
                range.selectNode(body.lastChild.firstChild).select();
                setTimeout(function () {
                    ua.keyup(editor.body, {'keyCode': 13});
                    setTimeout(function () {
                        equal(body.firstChild.getElementsByTagName('a').length, 0, 'a 标签被去掉了');
                        equal(body.childNodes.length, 2, '结果正确');
                        equal(body.firstChild.tagName.toLowerCase(), 'p', '结果正确');
                        equal(body.firstChild.innerHTML, 'www.baidu.com', '结果正确');
                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        start();
                    }, 60);
                }, 20);
            }, 20);
        });
        stop();
    }
});

test('autofloat:false 禁用IE中的自动加超链接功能--空格', function () {
    if(ua.browser.ie==8)return;
    //在IE中回车/空格自动加连接,这里模拟加连接以后,测试keyup时把添加的链接去掉
    if (ua.browser.ie) {
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'ue';
        var editor = UE.getEditor('ue', {autolink: false});
        editor.ready(function () {
            var range = new baidu.editor.dom.Range(editor.document);
            var body = editor.body;
            var space = ua.browser.ie>8?'&nbsp;':' ';
            editor.body.innerHTML = '<p><a href="http://www.baidu.com">www.baidu.com</a>'+space+'<img></p>';
            setTimeout(function () {
//                if(ua.browser.ie>8){
//                    range.setStart(body.firstChild.childNodes[1], 1).collapse(true).select();
//                }
//                else{
                    range.selectNode(body.firstChild.childNodes[1]).select();
//                }
                setTimeout(function () {
                    ua.keyup(editor.body, {'keyCode': 32});
                    equal(body.firstChild.getElementsByTagName('a').length, 0, 'a 标签被去掉了');
                    equal(body.childNodes.length, 1, '结果正确');
                    equal(body.firstChild.tagName.toLowerCase(), 'p', '结果正确');
                    equal(body.firstChild.innerHTML.toLowerCase(), 'www.baidu.com'+space+'<img>', '结果正确');
                    setTimeout(function () {
                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        start();
                    }, 100);
                }, 20);
            }, 20);
        });
        stop();
    }
});
//对于手动添加的,不会误删
test('autofloat:false 禁用IE中的自动加超链接功能--对于手动添加的,不会误删', function () {
    //在IE中回车/空格自动加连接,这里模拟加连接以后,测试keyup时把添加的链接去掉
    if (ua.browser.ie) {
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'ue';
        var editor = UE.getEditor('ue', {autolink: false});
        editor.ready(function () {
            var range = new baidu.editor.dom.Range(editor.document);
            var body = editor.body;
            var space = ua.browser.ie>8?'&nbsp;':' ';
            editor.setContent('<p><a href="http://www.baidu.com">www.baidu.com</a>'+space+'<img></p>');
            setTimeout(function () {
                if(ua.browser.ie>8){
                    range.setStart(body.firstChild.childNodes[1], 1).collapse(true).select();
                }
                else{
                    range.selectNode(body.firstChild.childNodes[1]).select();
                }
                setTimeout(function () {
                    ua.keyup(editor.body, {'keyCode': 32});
                    var a = body.firstChild.getElementsByTagName('a');
                    ok(a&&a.length==1, 'a 标签没去掉');
                    ok(a[0] && $(a[0]).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                    setTimeout(function () {
                        editor.execCommand('cleardoc');
                        editor.setContent('<p><a href="http://www.baidu.com">www.baidu.com</a></p><p><img></p>');
                        setTimeout(function () {
                            range.selectNode(body.lastChild.firstChild).select();
                            setTimeout(function () {
                                ua.keyup(editor.body, {'keyCode': 13});
                                setTimeout(function () {
                                    a = body.firstChild.getElementsByTagName('a');
                                    ok(a&&a.length==1, 'a 标签没去掉');
                                    ok(a[0] && $(a[0]).attr('href').indexOf('http://www.baidu.com') != -1, '检查a的href');
                                    UE.delEditor('ue');
                                    te.dom.push(document.getElementById('ue'));
                                    start();
                                }, 500);
                            }, 20);
                        }, 20);
                    }, 20);
                }, 20);
            }, 20);
        });
        stop();
    }
});
//test( '粘贴进来的http文本后回车', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    setTimeout( function() {
//        editor.setContent( '<p><br></p>' );
//        editor.focus();
//        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
//        te.setClipData( "http://www.google.com" );
//        setTimeout( function() {
//            editor.focus();
//            setTimeout( function() {
//                editor.focus();
//                te.presskey( "ctrl", "v" );
//                editor.focus();
//                setTimeout( function() {
//                    te.presskey( "enter", "" );
//                    editor.focus();
//                    setTimeout( function() {
//                        var a = body.firstChild.getElementsByTagName( 'a' )[0];
//                        equal( ua.getChildHTML( a ), 'http://www.google.com', '检查a的内容' );
//                        start();
//                    }, 100 );
//
//                }, 100 );
//            }, 100 );
//        }, 100 );
//    } );
//    stop();
//} );
//
