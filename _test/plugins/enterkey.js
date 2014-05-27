module( 'plugins.enterkey' );
///*
// 闭合选区
// 1.p末尾或中间回车
// 2.列表中回车(关于列表的回车必须加上li这个插件)
// 2.1 列表标号后面有文本
// 2.2列表标号后没有文本
// 3.h1后回车
// 4.带有BIU样式的文本后面回车
//
// 不闭合选区
// 1.选中部分表格后回车
// 2.选中文本后回车
//

// 复合操作
// 1.回车后撤销
// */
//fixed in future
/*trace 3174*/
//test( 'trace 2864：table中回车,br做回车', function () {
//    te.dom[0].parentNode.removeChild(te.dom[0]);
//    var div2 = document.body.appendChild( document.createElement( 'div' ) );
//    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    te.dom.push(div2);
//    baidu.editor.plugins.table = function(){};
//    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
//    te.obj.push(editor);
//    editor.render(div2);
//    var range = new baidu.editor.dom.Range( editor.document );
//    te.obj.push(range);
//    editor.setContent(' <table width="100%" border="1" bordercolor="#000000"><tbody><tr><td >aa</td></tbody></table>' );
//    stop();
//    setTimeout(function(){
//        te.obj[4].selectNode(editor.body.firstChild.firstChild.firstChild.firstChild).select();
//        ua.keydown(editor.body,{'keyCode':13});
//        setTimeout(function(){
//            equal(ua.getChildHTML(te.obj[3].body.firstChild),'<tbody><tr><td><br></td></tr></tbody>','<br>做回车');
//            te.dom[1].parentNode.removeChild(te.dom[1]);
//            start();
//        },50);
//    },50);
//} );
//test( 'br做回车,选区非闭合', function () {
//    te.dom[0].parentNode.removeChild(te.dom[0]);
//    var div2 = document.body.appendChild( document.createElement( 'div' ) );
//    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    te.dom.push(div2);
//    baidu.editor.plugins.table = function(){};
//    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
//    te.obj.push(editor);
//    editor.render(div2);
//    stop();
//    editor.ready(function(){
//        var range = new baidu.editor.dom.Range( editor.document );
//        te.obj.push(range);
//        editor.setContent('<p>hello1</p><p>hello2</p>' );
//
//        setTimeout(function(){
//            te.obj[4].setStart(editor.body.firstChild,0).setEnd(editor.body.lastChild,1).select();
//            ua.keydown(editor.body,{'keyCode':13});
//            setTimeout(function(){
//                ua.manualDeleteFillData(te.obj[3].body);
//                var html = 'h<br>lo';
//                equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
//                te.dom[1].parentNode.removeChild(te.dom[1]);
//                start();
//            },50);
//        },50);
//    });
//} );

test( 'br做回车,选区非闭合', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    te.dom.push(div2);
    baidu.editor.plugins.table = function(){};
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function(){
        var range = new baidu.editor.dom.Range( editor.document );
        te.obj.push(range);
        editor.setContent('<p>hello</p>' );
        te.obj[4].setStart(editor.body.firstChild.firstChild,1).setEnd(editor.body.firstChild.firstChild,3).select();
        ua.keydown(editor.body,{'keyCode':13});
        setTimeout(function(){
            ua.manualDeleteFillData(te.obj[3].body);
            var html = 'h<br>lo';
            equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
            editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><a href="http://www.baidu.com"></a></p>' );
            te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
            ua.keydown(editor.body,{'keyCode':13});
            setTimeout(function(){
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'hello<br>';
                equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                editor.setContent('<h1>hello<br></h1><p>he<img src="http://img.baidu.com/hi/jx2/j_0015.gif" />oll</p>' );
                te.obj[4].setStart( editor.body.lastChild,1 ).setEnd(editor.body.lastChild,2).select();
                ua.keydown(editor.body,{'keyCode':13});
                setTimeout(function(){
                    ua.manualDeleteFillData(te.obj[3].body);
                    var html = 'hello<br>';
                    equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                    editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><br></p>' );
                    te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
                    ua.keydown(editor.body,{'keyCode':13});
                    setTimeout(function(){
                        ua.manualDeleteFillData(te.obj[3].body);
                        var html = 'hello<br>';
                        equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                        editor.setContent('<h1>hello<br></h1><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif" /><a href="http://www.baidu.com">www.baidu.com</a></p>' );
                        te.obj[4].setStart( editor.body.lastChild,0 ).setEnd(editor.body.lastChild,1).select();
                        ua.keydown(editor.body,{'keyCode':13});
                        setTimeout(function(){
                            ua.manualDeleteFillData(te.obj[3].body);
                            var html = 'hello<br>';
                            equal(ua.getChildHTML(te.obj[3].body.firstChild),html,'<br>做回车');
                            te.dom[1].parentNode.removeChild(te.dom[1]);
                            start();
                        },20);
                    },20);
                },20);
            },20);
        },20);
    });
} );

test( 'br做回车，选区闭合', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    te.dom.push(div2);
    baidu.editor.plugins.table = function(){};
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false,'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        te.obj.push(range);
        editor.setContent('<p>hello</p>');

        setTimeout(function () {
            te.obj[4].setStart(editor.body.firstChild.firstChild, 1).collapse(true).select();
            ua.keydown(editor.body, {'keyCode':13});
            setTimeout(function () {
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'h<br>ello';
                equal(ua.getChildHTML(te.obj[3].body.firstChild), html, '<br>做回车，选区闭合');
                te.dom[1].parentNode.removeChild(te.dom[1]);
                start();
            }, 50);
        }, 50);
    });
} );

test( 'br做回车，选区闭合,在节点尾部输入回车，要插入2个br', function () {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var div2 = document.body.appendChild( document.createElement( 'div' ) );
    $(div2).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    te.dom.push(div2);
    baidu.editor.plugins.table = function () {
    };
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>', 'autoFloatEnabled':false, 'enterTag':'br'});
    te.obj.push(editor);
    editor.render(div2);
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        te.obj.push(range);
        editor.setContent('<p>hello</p>');
        setTimeout(function () {
            te.obj[4].setStart(editor.body.firstChild.firstChild, 5).collapse(true).select();
            ua.keydown(editor.body, {'keyCode':13});
            setTimeout(function () {
                ua.manualDeleteFillData(te.obj[3].body);
                var html = 'hello<br><br>';
                equal(ua.getChildHTML(te.obj[3].body.firstChild), html, '<br>做回车，选区闭合,在节点尾部输入回车');
                te.dom[1].parentNode.removeChild(te.dom[1]);
                start();
            }, 50);
        }, 50);
    });
});

test( 'table首行中回车', function () {
    var editor = te.obj[0];
    if(!ua.browser.ie){
        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent(' <table width="100%" border="1" bordercolor="#000000"><tbody><tr><td ><br /></td></tr></tbody></table>' );
        range.selectNode(editor.body.firstChild.firstChild.firstChild.firstChild).select();
        ua.keydown(editor.body,{'keyCode':13});
        stop();
        setTimeout(function(){
            equal(ua.getChildHTML(te.obj[0].body.firstChild),'<br>','加入p');//opera中，由原生方法实现p标签
            start();
        },20);
    }
} );

test( '去除_moz_dirty', function () {
    if(browser.gecko){
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<strong>迎使</strong><em  _moz_dirty=""><strong  _moz_dirty="">用ued</strong>it</em>' );
        range.selectNode(editor.body.firstChild.lastChild.firstChild).select();
        ua.keydown(editor.body,{'keyCode':13});
        setTimeout( function () {
            equal(ua.getChildHTML(editor.body),'<p><strong>迎使</strong><em><strong>用ued</strong>it</em></p>','');
            start();
        }, 20 );
        stop();
    }
} );

///*不作处理chrome会产生div*/
test( 'chrome删除div', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    if(ua.browser.webkit){
        editor.body.innerHTML = '<h1>一级标题</h1><div><br/></div>';
        range.setStart( body.firstChild.firstChild, 4 ).collapse( 1 ).select();
        ua.keydown(editor.body,{'keyCode':13});
        range.selectNode(body.lastChild.firstChild).select();
        var index = editor.undoManger.index;
        var br = ua.browser.ie ? '' : '<br>';
        ua.keyup(editor.body,{'keyCode':13});
        equal(editor.undoManger.list.length,2,'保存现场');
        setTimeout( function () {
            equal( body.childNodes.length, 2, '2个子节点' );
            equal(body.lastChild.tagName.toLowerCase(),'p','div转成p');
            equal(ua.getChildHTML(body),'<h1>一级标题</h1><p><br></p>','检查内容');
            start();
        }, 60 );
        stop();
    }else{
    }
} );
test( 'formatBlock', function () {
    if(ua.browser.ie)return; //这个处理不针对ie
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>  hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>' );
    setTimeout( function () {
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],1).collapse(true).select();
    ua.keydown(editor.body,{'keyCode':13});
    setTimeout( function () {
    ua.keyup(editor.body,{'keyCode':13});
        setTimeout( function () {
            var td = editor.body.getElementsByTagName('td')[0];
            equal(td.firstChild&&td.firstChild.tagName.toLowerCase(),'p','加上p');
            equal(td.firstChild.innerHTML,'hello1','hello1');
            start();
        }, 60 );
    }, 60 );
    }, 60 );
    stop();
} );
test( '跨td不删', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>  hello1</td><td ></td></tr><tr><td >hello2</td><td ></td></tr></tbody></table>' );
    editor.addListener("keydown", function (type, evt) {
        setTimeout( function () {
            ok(evt.defaultPrevented||!evt.returnValue, "keydown");
            start();
        }, 60 );
    });
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        range.setStart(tds[0], 0).setEnd(tds[2], 1).select();
        ua.keydown(editor.body, {'keyCode': 13});
    }, 60);
    stop();
} );
////presskey相关，先不测
//test( '普通文本<strong><span style="color: red">中间</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p>你好编辑器</p>' );
//    range.setStart( body.firstChild.firstChild, 2 ).collapse( 1 ).select();
//    editor.focus();
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ps = body.childNodes;
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '你好', '第一个p里是你好' );
//            equal( ua.getChildHTML( ps[1] ), '编辑器', '第一个p里是编辑器' );
//            start();
//        }, 30 );
//    }, 100 );
//    stop();
//} );
//
//test( '普通文本<strong><span style="color: red">末尾</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p>你好编辑器</p>' );
//    range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    var br = (ua.browser.ie) ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        ua.keydown( body );
//        editor.focus();
//        setTimeout( function () {
//            var ps = body.childNodes;
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '你好编辑器', '第一个p里是你好编辑器' );
//            equal( ua.getChildHTML( ps[1] ), br, '第一个p里是br' );
//            start();
//        }, 60 );
//    }, 100 );
//    stop();
//} );
//
// //不好检查
//test( 'table中回车', function () {
//    var div2 = document.body.appendChild( document.createElement( 'div' ) );
//    $( div2 ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    baidu.editor.plugins.table = function(){};
//    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false});
//    editor.render(div2);
//    stop();
//    setTimeout(function(){
//        var range = new baidu.editor.dom.Range( editor.document );
//        var body = editor.body;
//        editor.setContent(' <table width="100%" border="1" bordercolor="#000000"><tbody><tr><td ><br /></td><td ><br /></td></tr><tr><td ><br /></td><td ><br /></td></tr></tbody></table>' );
//        var tds = editor.body.getElementsByTagName( 'td' );
//        tds[0].innerHTML = 'hello';
//        tds[1].innerHTML = 'hello';
//        tds[2].innerHTML = 'hello';
//        range.setStart( tds[0].firstChild, 0 ).setEnd(tds[2].lastChild,1).select();
//        var re = ua.keydown(editor.body,{'keyCode':13});
//        setTimeout(function(){
//            start();
//        },20);
//    },20);
//} );
///*不作处理chrome会产生div*/
//test( 'trace766 :<strong><span style="color: red">H1</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<h1><span style="color:red">一级标题</span></h1>' );
//
//    range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//
//            var tagName = body.lastChild.tagName.toLowerCase();
//            ok( tagName == 'p' || tagName == 'h1', '回车后不会产生div' );
//            equal( body.childNodes.length, 2, '2个子节点' );
//            start();
//        }, 60 );
//    }, 100 );
//    stop();
//} );
//
//
//test( 'trace 1382:<strong><span style="color: red">空列表标号后</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<ol><li></li></ol>' );
//    var li = body.getElementsByTagName( 'li' )[0];
//    range.setStart( li, 0 ).collapse( 1 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ol = body.getElementsByTagName( 'ol' );
//            equal( ol.length, 0, '列表被删除了' );
//            start();
//        }, 100 );
//    }, 100 );
//    stop();
//} );
//
//test( '<strong><span style="color: red">列表有内容处</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<ol><li>列表1</li><li>列表2</li></ol>' );
//    var lis = body.getElementsByTagName( 'li' );
//    range.setStart( lis[1].firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ol = body.getElementsByTagName( 'ol' )[0];
//            lis = ol.childNodes;
//            equal( lis.length, 3, '3个li' );
//            for ( var index = 0; index < lis.length; index++ )
//                equal( lis[index].tagName.toLowerCase(), 'li', 'tag名为li' );
//            equal( ua.getChildHTML( lis[1] ), '<p>列表2</p>', '第二个列表自动加了p' );
//            equal( ua.getChildHTML( lis[2] ), '<p>' + br + '</p>', '新增了一个列表项' );
//            start();
//        }, 70 );
//    }, 100 );
//    stop();
//} );
//
//
//test( 'trace766 :<strong><span style="color: red">BIU文本中间</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p><span style="color:red"><em><strong>有样式的文本</strong></em></span></p>' );
//
//    var str = body.getElementsByTagName( 'strong' )[0];
//    range.setStart( str.firstChild, 2 ).collapse( 1 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
////           ua.checkHTMLSameStyle( '<span style="color:red"><em><strong>有样​</strong></em></span>', editor.document, body.firstChild, '查看第1个p的内容' );
//            //1.2版本中，回车/空格只后有不可见的字符，ua.checkHTMLSameStyle检查的话，<strong>的内容不好检查，即<strong>会多出一个子节点，改成如下：
//            baidu.editor.dom.domUtils.removeDirtyAttr( body.lastChild );
//            if ( ua.browser.chrome ) {
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color:red\"><em><strong>有样​</strong></em></span>', '查看第1个p的内容' );
//                ua.checkHTMLSameStyle( '<span  style="color:red"><em><strong>式的文本</strong></em></span>', editor.document, body.lastChild, '查看第2个p的内容' );
//            }
//            else if ( ua.browser.gecko ) {
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color: red;\"><em><strong>有样</strong></em></span>', '查看第1个p的内容' );
//                equal( body.lastChild.innerHTML, '<span style=\"color:red\"><em><strong>​式的文本</strong></em></span>', '查看第2个p的内容' );
//            }
//            else {
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color: red\"><em><strong>有样​</strong></em></span>', '查看第1个p的内容' );
//                ua.checkHTMLSameStyle( '<span  style="color:red"><em><strong>式的文本</strong></em></span>', editor.document, body.lastChild, '查看第2个p的内容' );
//            }
//            start();
//        }, 70 );
//    }, 100 );
//    stop();
//} );
//
//test( 'trace841  :<strong><span style="color: red">BIU文本后面</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p><span style="color:red"><em><strong>有样式的文本</strong></em></span></p>' );
//    var strong = body.getElementsByTagName( 'strong' )[0];
////    range.setStart( strong.firstChild, 6 ).collapse( 1 ).select();
//    range.setStart( strong, 1 ).collapse( 1 ).select();
//    editor.focus();
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            ua.keydown( body, {keyCode:13} );
//            baidu.editor.dom.domUtils.removeDirtyAttr( body.lastChild );
////            ua.checkHTMLSameStyle( '<span style="color:red"><em><strong>有样​</strong></em></span>', editor.document, body.firstChild, '查看第1个p的内容' );
//            //1.2版本中，回车/空格只后有不可见的字符，ua.checkHTMLSameStyle检查的话，<strong>的内容不好检查，即<strong>会多出一个子节点，而且每种浏览器的具体结果不同，改成如下：
//            if ( ua.browser.chrome )
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color:red\"><em><strong>有样式的文本​</strong></em></span>', '查看第1个p的内容' );
//            else if ( ua.browser.gecko )
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color: red;\"><em><strong>有样式的文本</strong></em></span>', '查看第1个p的内容' );
//            else
//                equal( body.firstChild.innerHTML.toLowerCase(), '<span style=\"color: red\"><em><strong>有样式的文本​</strong></em></span>', '查看第1个p的内容' );
//            /*ie中有一个已知bug，trace841，暂时不修的*/
//            var br = ua.browser.gecko ? '' : '<br>';
//            if ( !ua.browser.ie ) {
//                /*firefox不知道为什么用程序的方式回车始终不会产生br，可能太快了，浏览器没来得及处理*/
//                if ( ua.browser.gecko )
//                    equal( body.lastChild.innerHTML, '<span style=\"color:red\"><em><strong>​</strong></em></span>', '查看第2个p的内容' );
//                else
//                    ua.checkHTMLSameStyle( '<span style="color:red"><em><strong>' + br + '</strong></em></span>', editor.document, body.lastChild, '查看第2个p的内容' );
//            }
//            start();
//        }, 500 );
//    }, 100 );
//    stop();
//} );
//
//
//test( '<strong><span style="color: red">不闭合选择</span></strong>普通文本回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p>普通文本回车</p>' );
//    range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.firstChild.firstChild, 4 ).select();
//    editor.focus();
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ps = body.childNodes;
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '普通', '第一个p里是你好编辑器' );
//            equal( ua.getChildHTML( ps[1] ), '回车', '第2个p里是br' );
//            start();
//        }, 60 );
//    }, 100 );
//    stop();
//} );
//
//test( '<strong><span style="color: red">不闭合选择</span></strong>段落回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p>不闭合选择两个段落1</p><p>不闭合选择两个段落2</p>' );
//    range.setStart( body.firstChild.firstChild, 3 ).setEnd( body.lastChild.firstChild, 5 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ps = body.childNodes;
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '不闭合', '第一个p里是你好编辑器' );
//            equal( ua.getChildHTML( ps[1] ), '两个段落2', '第一个p里是br' );
//            start();
//        }, 60 );
//    }, 100 );
//    stop();
//} );
//
//
//test( '撤销<strong><span style="color: red">回车不闭合删除</span></strong>段落', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<p>不闭合选择两个段落1</p><p>不闭合选择两个段落2</p>' );
//    range.setStart( body.firstChild.firstChild, 3 ).setEnd( body.lastChild.firstChild, 5 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        editor.focus();
//        setTimeout( function () {
//            var ps = body.childNodes;
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '不闭合', '第一个p里是你好编辑器' );
//            equal( ua.getChildHTML( ps[1] ), '两个段落2', '第一个p里是br' );
//            editor.undoManger.undo();
//            equal( ps.length, 2, '2个p' );
//            equal( ps[0].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ps[1].tagName.toLowerCase(), 'p', 'tag名为p' );
//            equal( ua.getChildHTML( ps[0] ), '不闭合选择两个段落1', '第一个p里是你好编辑器' );
//            equal( ua.getChildHTML( ps[1] ), '不闭合选择两个段落2', '第一个p里是br' );
//            start();
//        }, 60 );
//    }, 100 );
//    stop();
//} );
//
///*1723 ie 在源码中写<ol><li></li></ol>，自动变成<ol><li><p><br></p></li></ol>，在ie中<br>会导致undo操作多记了一步*/
//test( '撤销<strong><span style="color: red">回车删除空列表</span></strong>', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<ol><li></li></ol>' );
//    var li = body.getElementsByTagName( 'li' )[0];
//    range.setStart( li.firstChild, 0 ).collapse( 1 ).select();
//    editor.focus();
//
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        /*好像用程序控制按回车的速度会比程序捕获的速度快，
//         所以程序还没反应过来时keydown已经触发完了，
//         而keydown中用于进行场景保存的，这样就会导致undo操作失效*/
//        ua.keydown( body );
//        editor.focus();
//        setTimeout( function () {
//            var ol = body.getElementsByTagName( 'ol' );
//            equal( ol.length, 0, '列表被删除了' );
//            setTimeout( function () {
//                editor.undoManger.undo();
//                equal( ua.getChildHTML( body ), '<ol><li><p><br></p></li></ol>', '撤销删除列表' );
//                start();
//            }, 50 );
//
//        }, 150 );
//    }, 100 );
//    stop();
//} );
//
//test( '撤销<strong><span style="color: red">列表中的</span></strong>回车', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<ol><li>列表</li></ol>' );
//    var li = body.getElementsByTagName( 'li' )[0];
//    range.setStart( li.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    var br = ua.browser.ie ? '' : '<br>';
//
//    setTimeout( function () {
//        te.presskey( "enter", "" );
//        ua.keydown( body );
//        editor.focus();
//        setTimeout( function () {
//            var li = body.getElementsByTagName( 'li' );
//            equal( li.length, 2, '2个列表子项' );
//            equal( ua.getChildHTML( li[0] ), '<p>列表</p>' );
//            equal( ua.getChildHTML( li[1] ), '<p>' + br + '</p>' );
//            editor.undoManger.undo();
//            equal( ua.getChildHTML( body ), '<ol><li><p>列表</p></li></ol>', '撤销后列表恢复原状' );
//            start();
//        }, 250 );
//    }, 100 );
//    stop();
//} );