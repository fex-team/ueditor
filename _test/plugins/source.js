module('plugins.source');
//test('初始化进入源码模式',function(){
//    if(ua.browser.ie>0 && ua.browser.ie<8)
//        return 0;
//    var div = document.createElement('div');
//    document.body.appendChild(div);
//    div.id = 'e';
//    var editor = UE.getEditor('e');//,{sourceEditorFirst:true}
//    stop();
////    editor.ready(function(){
////        setTimeout(function(){
//////            equal(editor.queryCommandState('source'),1,'源码高亮');
////            equal(editor.queryCommandState('bold'),-1,'加粗灰色');
////////            start();
////        },100);
////    });
//});
test('chrome删除后切换源码再切换回来，光标没了', function () {
    //opera 取不到range值
    if (ua.browser.opera) return 0;
    var editor = te.obj[0];
    var div = te.dom[0];
    editor.render(div);
    editor.setContent('hello');
    var range = editor.selection.getRange();
    range.selectNode(editor.body.firstChild).select();
    editor.execCommand('cleardoc');
    stop();
    expect(2);
    //source 包含超时操作，ie下必须有同步操作，否则会报错
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 20);
    }, 20);
    range = editor.selection.getRange();
    equal(range.startContainer.nodeType, 1, '光标定位在p里');
    equal(range.startContainer.tagName.toLowerCase(), 'p', 'startContainer为p');
    te.dom.push(div);
});
//TODO 1.2.6
/*trace 986*/
//test( '切换源码，视频地址被添加了网站前缀', function () {
//    if ( !ua.browser.ie ) {
//        var editor = te.obj[0];
//        var range = te.obj[1];
//        editor.setContent( '<p><br></p>' );
//        setTimeout(function(){
//            range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
//            /*涉及到video的一些特殊处理，因此直接设置编辑器的html不是很可行，所以这里用了video这个插件*/
//            editor.execCommand( 'insertvideo', {url:'www.baidu.com'} );
//            setTimeout( function () {
//                editor.execCommand( 'source' );
//                range.setStart( editor.body.firstChild, 0 ).collapse( 1 ).select();
//                setTimeout( function () {
//                    editor.execCommand( 'source' );
//                    start();
//                }, 50 );
//            }, 50 );
//
//            var img = editor.document.getElementsByTagName( 'img' )[0];
//            equal( $( img ).attr( '_url' ), 'www.baidu.com', '检查超链接前是否添加了网站的路径' );
//        },50);
//        stop();
//    }
//    else
//        ok( true, 'ie里加了视频节点embed,在节点embed后加bookmark会出错' );
//} );

//trace 852
test('切换源码，源码中多处空行', function () {
    var editor = te.obj[0];
    editor.setContent('<p>hello<a href="http://www.baidu.com/">baidu</a></p>');
    stop();
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                var html = editor.getContent();
                equal(html, '<p>hello<a href="http://www.baidu.com/">baidu</a></p>');
                start();
            }, 100);
        }, 100);
    }, 100);

    //    var html = '<p>\nhello<a href="http://www.baidu.com/">\n\tbaidu\n</a>\n</p>';
    //无奈的验证，有不可见字符
    //多余不可见字符的的bug已经修改了，现在用例字符串长度：53

    // ok(html.length>=58&&html.length<=60,'切换源码不会多空行');
});

/*trace 710*/
test('设置源码内容没有p标签，切换源码后会自动添加', function () {
    var editor = te.obj[0];
    editor.setContent('<strong><em>helloworld你好啊</em></strong>大家好，<strong><i>你在干嘛呢</i></strong><em><strong>。谢谢，不用谢</strong></em>~~%199<p>hello</p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                setTimeout(function () {
                    var childs = editor.body.childNodes;
                    ok(childs.length, 3, '3个p');
                    for (var index = 0; index < 3; index++) {
                        equal(childs[0].tagName.toLowerCase(), 'p', '第' + index + '个孩子为p');
                    }
                    start();
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    stop();
});

test('切换源码去掉空的span', function () {
    var editor = te.obj[0];
    editor.setContent('<p>切换源码<span>去掉空的span</span></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 100);
    }, 100);
    stop();
    equal(editor.getContent(), '<p>切换源码去掉空的span</p>');
});

test('b,i标签，切换源码后自动转换成strong和em', function () {
    var editor = te.obj[0];
    editor.setContent('<p><b>加粗的内容</b><i>斜体的内容<b>加粗且斜体</b></i></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            start();
        }, 100);
    }, 100);
    stop();
    equal(editor.getContent(), '<p><strong>加粗的内容</strong><em>斜体的内容<strong>加粗且斜体</strong></em></p>');
});

test(' trace 3739 trace 1734 range的更新/特殊符号的转换', function () {
    var editor = te.obj[0];
    editor.setContent('<p>"<></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.getContent(), '<p>&quot;&lt;&gt;</p>');
            editor.setContent("<p>'<img src='http://nsclick.baidu.com/u.gif?&asdf=\"sdf&asdfasdfs;asdf'></p>");
//            var range = te.obj[1];
//            range.setStart(editor.body.firstChild,0).collapse(1).select();
            setTimeout(function () {
//                var label = ua.browser.gecko ? 'html' : 'body';
//                var label = 'html';
                ua.manualDeleteFillData(editor.body);
                var sc = (ua.browser.ie==11)?editor.selection.getRange().startContainer.parentNode.tagName.toLowerCase():editor.selection.getRange().startContainer.parentNode.parentNode.tagName.toLowerCase();
                equal(sc, 'html', 'range的更新');
                editor.execCommand('source');
                setTimeout(function () {
                    editor.execCommand('source');
                    equal(editor.getContent(), "<p>&#39;<img src=\"http://nsclick.baidu.com/u.gif?&asdf=&quot;sdf&asdfasdfs;asdf\"/></p>");
                    start();
                }, 100);
            }, 100);
        }, 100);
    }, 100);
    stop();
});

/*trace 1234 */
test('默认插入的占位符', function () {
    var editor = te.obj[0];
    editor.setContent('');
    equal(editor.getContent(), '');
});

test('插入分页符,源码中显示：_baidu_page_break_tag_', function () {
    var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent('<p><br /></p>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild, 0).collapse(1).select();
            editor.execCommand('pagebreak');
            ua.manualDeleteFillData(editor.body);
            var pagebreak = editor.body.getElementsByTagName('hr')[0];

            if (typeof pagebreak.attributes['class'] == "undefined") {
                equal(pagebreak.getAttribute('class'), 'pagebreak', 'pagebreak');
            }
            else {//适用于ie6,7
                equal(pagebreak.attributes['class'].nodeValue, 'pagebreak', 'pagebreak');
            }
            ua.manualDeleteFillData(editor.body);
//        var br = baidu.editor.browser.ie ? '&nbsp;' : '<br />';
            ok(editor.getContent().indexOf('_ueditor_page_break_tag_') >= 0, 'pagebreak被解析');
//        equal( editor.getContent(), '<p>' + br + '</p>_baidu_page_break_tag_<p>' + br + '</p>' );
            start();
        }, 200);
    stop();
});
//TODO 1.2.6
//test( 'trace 1977 1949 插入代码,源码中对应的标签是pre', function () {
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    var editor = te.obj[2];
//    editor.render(div);
//    var range = new baidu.editor.dom.Range( editor.document );
//    var body = editor.body;
//    stop();
//    setTimeout(function(){
//        editor.setContent( '<p><br></p>' );
//        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
//        editor.execCommand( 'highlightcode', '<a href="http://net.tutsplus.com" class="logo">Nettuts+</a>', 'html' );
//        ua.manualDeleteFillData( editor.body );
//
//        var td_gutter = body.getElementsByTagName( 'td' )[0];
//        var td_code = body.getElementsByTagName( 'td' )[1];
//        equal( body.getElementsByTagName( 'td' ).length, 2, '显示代码的table分两列' );
//        if(td_gutter!=''){
//            if ( typeof td_gutter.attributes['class'] == "undefined" ) {
//                equal( td_gutter.getAttribute( 'class' ), 'gutter', '第一列class=gutter' );
//                equal( td_code.getAttribute( 'class' ), 'code', '第一列class=code' );
//            }
//            else {//适用于ie6,7
//                equal( td_gutter.attributes['class'].nodeValue, 'gutter', '第一列class=gutter' );
//                equal( td_code.attributes['class'].nodeValue, 'code', '第一列class=code' );
//            }
//            equal( editor.getContent().substring( 0, 119 ), '<pre class=\"brush: html;toolbar:false;\" >&lt;a href=\"http://net.tutsplus.com\" class=\"logo\"&gt;Nettuts+&lt;/a&gt; </pre>' );
//            //highlightcode空格问题
////            equal( editor.getContent().substring( 0, 116 ), '<pre class=\"brush:html;toolbar:false;\" >&lt;a href=\"http://net.tutsplus.com\" class=\"logo\"&gt;Nettuts+&lt;/a&gt;</pre>' );
//            te.dom.push( div );
//        }
//        start();
//    },50);
//} );

test('不以http://开头的超链接绝对路径网址', function () {
    if (ua.browser.ie == 9)return 0;//TODO 1.2.6
    var editor = te.obj[0];
    editor.setContent('<p><a href="www.baidu.com">绝对路径网址</a></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.getContent(), '<p><a href="www.baidu.com">绝对路径网址</a></p>');
            start();
        }, 100);
    }, 100);
    stop();
});

test('trace 1727:插入超链接后再插入空格，空格不能被删除', function () {
    var editor = te.obj[0];
    editor.setContent('<p> <a href="http://www.baidu.com/">绝对路径网址</a>  ddd</p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.body.innerHTML.toLowerCase(), '<p><a href="http://www.baidu.com/" _href=\"http://www.baidu.com/\">绝对路径网址</a> &nbsp;ddd</p>', '查看空格是否被删除');
            start();
        }, 100);
    }, 100);
    stop();
});
//TODO 1.2.6 空style未删除
//test( '关于空格的问题', function () {
//    var editor = te.obj[0];
//    var html = '<ol>   <li> dd jj </li> <li> ll kdkd <a href = "http://www.baidu.com/"> baidu </a> </li> </ol>';
//    editor.setContent( html );
//    setTimeout(function(){
//        editor.execCommand( 'source' );
//        setTimeout( function () {
//            editor.execCommand( 'source' );
//            setTimeout( function () {
//                ua.manualDeleteFillData( editor.body );
//                equal( editor.body.innerHTML.toLowerCase().replace(/[\r\n\t]/g,''), '<ol class=\" list-paddingleft-2\"><li><p>dd&nbsp;jj</p></li><li><p>ll&nbsp;kdkd<a href="http://www.baidu.com/" >&nbsp;baidu&nbsp;</a></p></li></ol>' );
//                start();
//            }, 150 );
//        }, 100 );
//    },20);
//    stop();
//} );
//TODO 1.2.6
//test('初始化进入源码模式',function(){
//    if(ua.browser.ie>0 && ua.browser.ie<8)
//        return 0;
//    var div = document.createElement('div');
//    document.body.appendChild(div);
//    var editor = UE.getEditor(div);//,{sourceEditorFirst:true}
//    stop();
//    editor.ready(function(){
//        setTimeout(function(){
////            equal(editor.queryCommandState('source'),1,'源码高亮');
//            equal(editor.queryCommandState('bold'),-1,'加粗灰色');
//////            start();
//        },100);
//    });
//});

test('在font,b,i标签中输入，会自动转换标签 ', function () {
//    if(!ua.browser.gecko){
    var editor = te.obj[0];
    editor.body.innerHTML = '<p><font size="3" color="red"><b><i>x</i></b></font></p>';
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            equal(editor.body.firstChild.firstChild.tagName.toLowerCase(), 'span', 'font转换成span');
            if (ua.browser.gecko || ua.browser.ie)
                equal($(editor.body.firstChild.firstChild).css('font-size'), '16px', '检查style');
            else
                equal($(editor.body.firstChild.firstChild).css('font-size'), '16px', '检查style');
            var EMstyle = $(editor.body.firstChild.firstChild).css('color');
            ok(EMstyle == 'rgb(255, 0, 0)' || EMstyle == 'red' || EMstyle == '#ff0000', '检查style');
            equal(ua.getChildHTML(editor.body.firstChild.firstChild), '<strong><em>x</em></strong>', 'b转成strong,i转成em ');
            start();
        }, 20);
    }, 20);
    stop();
//    }
});

test('trace 3334:img和a之间不会产生多余空格', function () {
    var editor = te.obj[0];
    editor.setContent('<p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" /><a href="http://www.baidu.com">http://www.baidu.com</a></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                ua.manualDeleteFillData(editor.body);
                var html = '<p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" _src=\"http://img.baidu.com/hi/jx2/j_0001.gif\"><a href=\"http://www.baidu.com\" _href=\"http://www.baidu.com\">http://www.baidu.com</a></p>';
                ua.checkSameHtml(editor.body.innerHTML.toLowerCase(), html, '查看img和a之间是否会产生多余空格');
                start();
            }, 20);
        }, 20);
    }, 20);
    stop();
});

test('trace 3334:table中td不会产生多余空格', function () {
    if(ua.browser.ie)return ;//todo 1.3.0
    var editor = te.obj[0];
    editor.execCommand('inserttable');
    var br = ua.browser.ie ? '' : '<br>';
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            ua.manualDeleteFillData(editor.body);
            equal(editor.body.getElementsByTagName('table').length, 1, '有1个table');
            equal(editor.body.getElementsByTagName('tr').length, 5, '有5个tr');
            equal(editor.body.getElementsByTagName('td').length, 25, '有25个td');
            equal(editor.body.getElementsByTagName('td')[12].innerHTML, br, '不会产生多余空格');
            start();
        }, 20);
    }, 20);
    stop();
});

test('trace 3349：带颜色的span切到源码再切回，不会丢失span', function () {
    var editor = te.obj[0];
    editor.setContent('<p><span style="color: rgb(255, 0, 0);"></span><br></p>');
    setTimeout(function () {
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            ua.checkSameHtml(editor.body.innerHTML, '<p><span style="color: rgb(255, 0, 0);"></span><br></p>');
            start();
        }, 20);
    }, 20);
    stop();
});