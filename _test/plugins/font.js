module( "plugins.font" );


//test( 'beforegetContent', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.body.innerHTML = '<p>hello<span></span></p>';
//    range.selectNode( editor.body.firstChild ).select();
//    editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
//    var div = document.createElement( 'div' );
//    var div1 = document.createElement( 'div' );
//    /*getContent会触发beforegetcontent事件*/
//    div1.innerHTML = editor.getContent();
//
//    div.innerHTML = '<p><span style="color:#FF0000">hello</span></p>';
//    ok( ua.haveSameAllChildAttribs( div, div1 ), '查看空span是否被删除' );
//} );

/*为超链接添加删除线，超链接仍然有删除线，trace946*/
test( 'underline and linethrough', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( 'hello<a href="http://www.baidu.com/">baidu</a>test' );

    setTimeout(function(){
        if(!ua.browser.opera){
            editor.focus();
        }
        var body = editor.body;
        ua.manualDeleteFillData(editor.body);
        range.selectNode( body.firstChild.firstChild.nextSibling ).select();
        equal( editor.queryCommandValue( 'underline' ), 'underline', 'query command value is underline' );
        equal( editor.queryCommandValue( 'strikethrough' ), 'underline', 'query command value is not strike' );
        ok( editor.queryCommandState( 'underline' ), 'query underline state' );
        editor.execCommand( 'strikethrough' );
        var html = 'hello<a href="http://www.baidu.com/" data_ue_src = "http://www.baidu.com/" style="text-decoration: line-through">baidu</a>test';
        ua.checkHTMLSameStyle( html, editor.document, body.firstChild, 'check results' );
        start();
    },50);
    stop();


} );

/*为不同字号的文本加背景色，trace981*/
test( 'background--不同字号', function() {
    if(!ua.browser.opera){
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '你好' );
        editor.focus();
        var body = editor.document.body;
        ua.manualDeleteFillData( editor.body );
        range.selectNode( body.firstChild.firstChild ).select();
        editor.execCommand( 'backcolor', 'rgb(255,0,0)' );
        range.setStart( body.firstChild.firstChild, 1 ).collapse( 1 ).select();
        editor.execCommand( 'fontsize', '30px' );
        range = editor.selection.getRange();
        range.insertNode( editor.document.createTextNode( 'hello' ) );
//    te.presskey( '', 'h' );
        setTimeout( function() {
            /*去掉空白字符*/
            ua.manualDeleteFillData( editor.body );
            var color = ua.browser.ie&&ua.browser.ie<9 ? '' : ';background-color: rgb(255, 0, 0); ';
            var h = '<span style=\"background-color: rgb(255, 0, 0); \">你好<span style=\"background-color: rgb(255, 0, 0); font-size: 30px; \">hello</span></span>';
            var html = '<span style="background-color: rgb(255, 0, 0)">你好<span style="font-size: 30px ' + color + '">hello</span></span>';
            ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '检查不同字号的文本背景色是否一致' );
            equal
            start();
        }, 50 );
        stop();
    }
} );

/*trace 937,chrome,safari,maxthon有问题*/
test( 'trace 937：为第一个有样式的字加删除线', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><span style="color: red">欢</span>迎光临</p>' );
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'strikethrough' );
    var p1 = editor.document.createElement( 'p' );
    p1.innerHTML = '<span style="color:red;text-decoration:line-through">欢</span><span style="text-decoration:line-through">迎光临</span>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '查看添加了下划线后的样式' );
} );

/*trace 918*/
test( 'trace 918：字体的状态反射', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>欢迎你回来</p>' );
    var p = editor.body.firstChild;
    range.selectNode( p ).select();
    editor.execCommand( 'underline' );
    var p1 = document.createElement( 'p' );
    p1.innerHTML = '<span style="text-decoration: underline;">欢迎你回来</span>';
    if(!ua.browser.opera){
        ok( ua.haveSameAllChildAttribs( p, p1 ), '检查是否添加了下划线' );
    }
    range.setStart( p.firstChild.firstChild, 3 ).setEnd( p.firstChild.firstChild, 4 ).select();
    editor.execCommand( 'fontfamily', '楷体' );
    var txt='楷体';
    if(ua.browser.opera)
        txt='\"楷体\"';
    equal( editor.queryCommandValue( 'fontfamily' ), txt, '检查字体的状态反射' );
} );

test( ' 选中文本设置前景色为默认', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( 'hello' );
    setTimeout(function(){
    range.selectNode( body.firstChild ).select();
    editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
    ua.checkHTMLSameStyle( '<span style="color:rgb(255, 0, 0)">hello</span>', editor.document, body.firstChild, '文本的前景色设为红色' );
    editor.execCommand( 'forecolor', 'default' );
    equal( ua.getChildHTML( body ), '<p>hello</p>', '设置字体颜色为默认颜色' );
    start();
    },50);
    stop();
} );

/*trace 869*/
//插件相关！！！！！！！！！！
//test( 'trace 869：设置前景色后清除前景色，再输入文本', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '' );
//    stop()
////    alert(navigator.userAgent)
//    setTimeout( function() {
//        range.setStart( editor.body.firstChild, 0 ).select();
//        editor.execCommand( 'forecolor', 'red' );
//        editor.execCommand( 'forecolor', 'default' );
//        range = editor.selection.getRange();
//        editor.focus();
//        setTimeout( function() {
//        //TODO maxthon有2种模式，句柄分为IE的和maxthon两种，需要根据userAgent区别对待，但是貌似还是有问题的
//            te.presskey( '', 'e' );
//            editor.focus();
//            setTimeout( function() {
//                var br = baidu.editor.browser.ie ? '' : '<br />';
//                ua.manualDeleteFillData( editor.body );
//                equal( editor.getContent(), '<p>e' + br + '</p>' );
//            start();
//            }, 250 );
//        }, 100 );
////    range.insertNode( document.createTextNode( 'hello' ) );
//    }, 150 );
//} );


/*trace 823*/
//TODO 涉及文本输入和光标位置移动的结合
// 不好测，采取workaround，不用输入的方式
test( 'trace 823：设置前景色后设置删除线', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><span style="color: rgb(153, 230, 0); ">你好<span style="color: rgb(255, 0, 0); ">​hello</span></span></p>' );
    setTimeout(function(){
    range.selectNode( editor.body.firstChild.firstChild, 0 ).select();
    editor.execCommand( 'strikethrough' );
    var p1 = editor.document.createElement( 'p' );
    p1.innerHTML = '<span style="color: rgb(153, 230, 0)"><span style="color: rgb(153, 230, 0); text-decoration: line-through; ">你好</span><span style="color: rgb(255, 0, 0); text-decoration: line-through; ">hello</span></span>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '检查加入删除线后的样式' );
        start();
    },50);
    stop();
} );


/*trace 819, 765*/
test( 'trace 819, 765：删除线和下划线互斥', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var p1 = editor.document.createElement( 'p' );
    editor.setContent( '<p>你好</p>' );
    setTimeout(function(){
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'underline' );
    p1.innerHTML = '<span style="text-decoration: underline">你好</span>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '下划线' );
    range.selectNode( editor.body.firstChild ).select();

    editor.execCommand( 'strikethrough' );
    p1.innerHTML = '<span style="text-decoration: line-through">你好</span>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '删除线，和下划线互斥' );
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'underline' );
    p1.innerHTML = '<span style="text-decoration: underline">你好</span>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '下划线，和删除线互斥' );
    start();
},50);
stop();
} );


/*trace 810*/
test( 'trace 810：闭合时设置删除线会改变文本前景色', function() {
    if(!ua.browser.opera){
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p><span style="color: rgb(153, 230, 0); ">你好<span style="color: rgb(255, 0, 0); ">​hello</span></span></p>' );
        setTimeout(function(){
        /*光标定在hello后面*/
        range.setStart( editor.body.firstChild.firstChild.lastChild, 1 ).collapse( true ).select();
        editor.execCommand( 'strikethrough' );
        range = editor.selection.getRange();
        range.insertNode( editor.document.createTextNode( 'hey' ) );
        /*ff下会自动加一个空的设置了style的span，比较时不作考虑*/
        if ( baidu.editor.dom.domUtils.isEmptyNode( editor.body.firstChild.lastChild ) && baidu.editor.browser.gecko )
            editor.body.firstChild.removeChild( editor.body.firstChild.lastChild );
        var color = ua.browser.ie&&ua.browser.ie<9 ? '' : 'color: rgb(255, 0, 0)';
        var html = '<span style="color: rgb(153, 230, 0)">你好<span style="color: rgb(255, 0, 0)">hello</span></span><span style="color: rgb(153, 230, 0)"><span style="color: rgb(255, 0, 0)"><span style="text-decoration: line-through;' + color + '">hey</span></span></span>';
        ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '检查插入的删除线前景色是否正确' );
            start();
        },50);
        stop();
    }
} );

/*trace 809*/
test( 'trace 809：闭合时改变前景色和删除线，再输入文本', function() {
    if(!ua.browser.opera){
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p><span style="color: rgb(255, 0, 0); text-decoration: line-through; ">你好</span></p>' );
        setTimeout(function(){
        var p = editor.body.firstChild;
        range.setStart( p.firstChild, 1 ).collapse( true ).select();
        editor.execCommand( 'forecolor', 'rgb(0,255,0)' );
        range = editor.selection.getRange();
        editor.execCommand( 'underline' );
        range = editor.selection.getRange();
        range.insertNode( editor.document.createTextNode( 'hey' ) );
        var p1 = editor.document.createElement( 'p' );
        p1.innerHTML = '<span style="color: rgb(255, 0, 0); text-decoration: line-through; ">你好</span><span style="color: rgb(255, 0, 0); "><span style="color: rgb(0, 255, 0); text-decoration: underline; ">​hey</span></span>';
        ua.manualDeleteFillData( editor.body );
        /*ff下会自动加一个空的设置了style的span，比较时不作考虑*/
        if ( baidu.editor.dom.domUtils.isEmptyNode( editor.body.firstChild.lastChild ) && baidu.editor.browser.gecko )
            editor.body.firstChild.removeChild( editor.body.firstChild.lastChild );
        ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '检查新输入的文本下划线和颜色是否正确' );
        start();
    },50);
    stop();
    }
} );

/*trace 805*/
test( 'trace 805：切换删除线和下划线，前景色没了', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p><strong>你好早安</strong></p>' );
    setTimeout(function(){
    var text = editor.body.firstChild.firstChild.firstChild;
    range.selectNode( text ).select();
    editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
    range.setStart( text, 0 ).setEnd( text, 2 ).select();
    editor.execCommand( 'underline' );
    range.setStart( text, 0 ).setEnd( text, 2 ).select();
    editor.execCommand( 'strikethrough' );
    var p1 = editor.document.createElement( 'p' );
    p1.innerHTML = '<strong><span style="color: rgb(255, 0, 0); text-decoration: line-through; ">你好</span></strong><strong><span style="color: rgb(255, 0, 0); ">早安</span></strong>';
    ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '查看前景色是不是还在' );
        start();
    },50);
    stop();

} );

/*trace 802*/
test( 'trace 802：为设置了字体的文本添加删除线', function() {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var editor = new baidu.editor.Editor( {'plugins':['source'],'autoFloatEnabled':false} );
    stop();
    setTimeout(function(){
        editor.render( div );
        var range = new baidu.editor.dom.Range( editor.document );
        te.dom.push( div );
        te.obj.push( editor );
        editor.setContent( '<p><strong>你好早安</strong></p>' );
        var text = editor.body.firstChild.firstChild.firstChild;
        range.setStart( text, 0 ).setEnd( text, 2 ).select();
        editor.execCommand( 'fontfamily', '隶书' );
        editor.execCommand( 'strikethrough' );
        var p1 = editor.document.createElement( 'p' );
        p1.innerHTML = '<strong><span style="font-family: 隶书; text-decoration: line-through; ">你好</span></strong><strong>早安</strong>';
        ok( ua.haveSameAllChildAttribs( editor.body.firstChild, p1 ), '检查删除线是否正确' );
        editor.execCommand( 'source' );
        var txt='隶书';
        if(ua.browser.opera)
            txt='\"隶书\"';
        equal( editor.queryCommandValue( 'fontfamily' ), txt );
        start();
    },50);

} );

/*trace 744*/
test( 'trace 744：设置超链接背景色后切换到源码再切回来', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello<a href="www.baidu.com">baidu</a></p>' );
    setTimeout(function(){
        range.selectNode( editor.body.firstChild ).select();
        editor.execCommand( 'backcolor', 'rgb(255,0,0)' );
        var html = editor.body.firstChild.innerHTML;
        editor.execCommand( 'source' );
        setTimeout(function(){
        editor.execCommand( 'source' );
            setTimeout(function(){
        /*切换源码前后代码应当相同*/
        ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '切换后html代码不变' );
        start();
            },50);
        },50);
    },50);
    stop();
} );

test( '设置超链接前景色再清除颜色', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello<a href="www.baidu.com">baidu</a></p>' );
    setTimeout(function(){
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
    editor.execCommand( 'backcolor', 'rgb(0,255,0)' );
    editor.execCommand( 'forecolor', 'default' );
    var html = '<span style="background-color: rgb(0,255,0)">hello</span><a href="www.baidu.com" data_ue_src = "www.baidu.com" style="text-decoration: underline; "><span style="background-color: rgb(0, 255, 0); ">baidu</span></a>';
    ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '清除前景色' );
    start();
},50);
stop();

} );

test( '对表格中的文本添加颜色和下划线', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>hello1</td><td>hello2</td></tr><tr><td colspan="2">hello3</td></tr></tbody></table>' );
    setTimeout(function(){
    range.selectNode( editor.body.firstChild );
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    editor.currentSelectedArr = [trs[0].firstChild,trs[0].lastChild,trs[1].firstChild,trs[1].lastChild];
    editor.execCommand( 'forecolor', 'rgb(255,100,100)' );
    editor.currentSelectedArr = [trs[0].firstChild];
    range.selectNode( editor.body.firstChild.firstChild );
    editor.execCommand( 'underline' );
    ua.checkHTMLSameStyle( '<span style="color: rgb(255, 100, 100); text-decoration: underline; ">hello1</span>', editor.document, trs[0].firstChild, '第一个单元格有下划线和前景色' );
    ua.checkHTMLSameStyle( '<span style="color: rgb(255, 100, 100); ">hello2</span>', editor.document, trs[0].lastChild, '第2个单元格有前景色' );
    ua.checkHTMLSameStyle( '<span style="color: rgb(255, 100, 100); ">hello3</span>', editor.document, trs[1].firstChild, '第3个单元格有前景色' );
    equal( trs[1].firstChild.getAttribute( 'colspan' ), 2, 'colspan为2' );
    equal( editor.queryCommandState( 'underline' ), true, '状态是underline' );
    equal( editor.queryCommandState( 'forecolor' ), 0, '非underline和line-through返回0' )
        start();
    },50);
    stop();
} );

/*trace 740*/
test( 'trace 740：设置左右字为红色，修改部分字颜色为蓝色，再修改所有字体', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>你好早安</p>' );
    setTimeout(function(){
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
    var text = editor.body.firstChild.firstChild.firstChild;
    range.setStart( text, 2 ).setEnd( text, 4 ).select();
    editor.execCommand( 'forecolor', 'rgb(0,255,0)' );
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'fontfamily', ' 楷体, 楷体_GB2312, SimKai; ' );
    var html = '<span style="color: rgb(255, 0, 0); "><span style="color: rgb(255, 0, 0); font-family: 楷体, 楷体_GB2312, SimKai; ">你好</span><span style="color: rgb(0, 255, 0); font-family: 楷体, 楷体_GB2312, SimKai; ">早安</span></span>';
    ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '查看字体和颜色是否正确' );
    start();
},50);
stop();
} );

/*trace 721*/
test( 'trace 721：预先设置下划线和字体颜色，再输入文本，查看下划线颜色', function() {
    if(!ua.browser.opera){
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p><br></p>' );
        setTimeout(function(){
        range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
        editor.execCommand( 'underline' );
        editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
        range = editor.selection.getRange();
        range.insertNode( editor.document.createTextNode( 'hello' ) );
        ua.manualDeleteFillData( editor.body );
        var html = '<span style="text-decoration:underline;color:rgb(255,0,0)">hello</span><br>';
        ua.checkHTMLSameStyle( html, editor.document, editor.body.firstChild, '查看下划线颜色是否与字体颜色一致' );
            start();
        },50);
        stop();
    }
} );

