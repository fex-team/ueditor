module("core.Selection");

/*
 * 因为编辑器是必定会放在一个iframe中，所以在测试的过程中我们也放在iframe中测试，以防一些他们没有做容错处理导致的问题出现
 * */

//test( 'getRange--简单', function() {
//    stop();
//    /*防止frame没有加载好导致无法取到document*/
//    setTimeout( function() {
//        var doc = te.dom[1].contentWindow.document;
//        var range = new baidu.editor.dom.Range( doc );
//        var div = doc.createElement( 'div' );
//        doc.body.appendChild( div );
//        div.innerHTML = '<strong>first</strong>second';
//        /*必须调用select函数，否则这个选择不会映射到浏览器上，导致selection得到的rangeCount为0
//         * select后会把文本节点切开
//         * */
//        range.setStart( div.firstChild, 0 ).setEnd( div.lastChild, 1 ).select();
//        var selection = new baidu.editor.dom.Selection( doc );
//        var nativeRange = selection.getRange();
//        var sc = nativeRange.startContainer;
//        var so = nativeRange.startOffset;
//        var ec = nativeRange.endContainer;
//        var eo = nativeRange.endOffset;
//        /*sc和ec的位置有多个，只能无奈地穷举*/
//        // ok(  (sc === div) && so == 0   , 'check startContainer/offset' ); (ec === div) && eo == 2 ||好像这种情况在浏览器中不会遇到
//        ok( (sc === div.firstChild.firstChild) && so == 0 || (sc === div) && so == 0 || (sc === div.firstChild) && so == 0, 'check startContainer/offset' );
//        ok( (ec === div.firstChild.nextSibling) && eo == 1 || (ec === div.lastChild) && eo == 0, 'check endContainer/offset' );
//        equal( nativeRange.collapsed, false, 'check collapse status' );
//        start();
//    }, 20 );
//} );
//
//test( 'getText', function() {
//    stop();
//    setTimeout( function() {
//        var doc = te.dom[1].contentWindow.document;
//        var range = new baidu.editor.dom.Range( doc );
//        var div = doc.createElement( 'div' );
//        doc.body.appendChild( div );
//        div.innerHTML = '<em></em><span>spanText</span><strong>first</strong>second';
//
//        range.setStart( div.firstChild, 0 ).setEnd( div.lastChild, 1 ).select();
//        var selection = new baidu.editor.dom.Selection( doc );
//
//        var text = selection.getText();
//        equal( text, 'spanTextfirsts', 'check getText function' );
//        start();
//    }, 20 );
//} );
//
//
//test( 'getstart--文本', function() {
//    stop();
//    setTimeout( function() {
//        var doc = te.dom[1].contentWindow.document;
//        var range = new baidu.editor.dom.Range( doc );
//        var div = doc.createElement( 'div' );
//        doc.body.appendChild( div );
//        div.innerHTML = '<em>em<strong><span>spanText</span></strong></em><strong>first</strong>second';
//
//        range.setStart( div.firstChild.lastChild.lastChild.firstChild, 0 ).setEnd( div.lastChild, 1 ).select();
//        var selection = new baidu.editor.dom.Selection( doc );
//        var startNode = selection.getStart();
//        /*textNode*/
//        ok( startNode === div.firstChild.lastChild.lastChild, 'check startNode' );
//        start();
//    }, 20 );
//} );
//
//test( 'getstart--边界情况', function() {
//    stop();
//    setTimeout( function() {
//        var doc = te.dom[1].contentWindow.document;
//        var range = new baidu.editor.dom.Range( doc );
//        var div = doc.createElement( 'div' );
//        doc.body.appendChild( div );
//        div.innerHTML = '<em>em<strong><span>spanText</span></strong></em><strong>first</strong>second';
//
//        range.setStart( div.firstChild.lastChild, 0 ).collapse().select();
//        var selection = new baidu.editor.dom.Selection( doc );
//        var startNode = selection.getStart();
//        /*边界情况，ie下好像会尽量贴文本，因此startNode为em*/
//        ok( startNode === div.firstChild.lastChild || startNode === div.firstChild, 'check startNode' );
//        start();
//    }, 20 );
//} );

test('getRange--闭合选区的边界情况', function () {
    var div_new = document.createElement('div');
    document.body.appendChild(div_new);
    var editor = new baidu.editor.Editor({'autoFloatEnabled': false});
    stop();
    setTimeout(function () {
        editor.render(div_new);
        editor.ready(function () {
            setTimeout(function () {
                var range = new baidu.editor.dom.Range(editor.document);
                editor.setContent('<p><strong>xxx</strong></p>');
                range.setStart(editor.body.firstChild.firstChild, 0).collapse(true).select();
                range = editor.selection.getRange();
                var strong = editor.body.firstChild.firstChild;
                    /*startContainer:ie is xxx,others are strong.firstChild*/
                if(ua.browser.ie>8){
                    ok(( range.startContainer === strong) && range.startOffset === 1, 'startContainer是xxx左边的占位符或者xxx');
                }

                 else{
                    ok(range.startContainer.nodeType == 3, 'startContainer是文本节点');

                    ok(( range.startContainer === strong.firstChild) && strong.firstChild.length == 1 || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.lastChild), 'startContainer是xxx左边的占位符或者xxx');
                }

                ua.manualDeleteFillData(editor.body);
                range.setStart(editor.body.firstChild.firstChild, 1).collapse(true).select();
                /*去掉占位符*/
                range = editor.selection.getRange();
                /*可能为(strong，1)或者(xxx，3)*/
                ok(( range.startContainer === strong) || ( range.startContainer === strong.lastChild) && strong.lastChild.length == 1 || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.firstChild), 'startContainer是xxx或者xxx右边的占位符');
//    ok( range.startContainer.nodeType == 1 ? range.startContainer.tagName.toLowerCase() == 'strong' && range.startOffset == 1 : range.startContainer.data == 'xxx' && range.startOffset == 3, 'strong,1或xxx,3' );

                ua.manualDeleteFillData(editor.body);
                /*p,0*/
                range.setStart(editor.body.firstChild, 0).collapse(true).select();
                range = editor.selection.getRange();
                /*startContainer:ie is xxx,ff is p, chrome is strong*/
//    ok( ( range.startContainer === strong.parentNode.firstChild)&& strong.parentNode.firstChild.length == 1  || (range.startContainer.nodeValue.length == 3 && range.startContainer === strong.firstChild.nextSibling), 'startContainer是第一个占位符或者xxx' );
//    ua.manualDeleteFillData( editor.body );
//    range.setStart( editor.body.firstChild, 1 ).collapse( true ).select();
//    equal( range.startContainer.tagName.toLowerCase(), 'p', 'p,1' );


                te.dom.push(div_new);
                te.obj.push(editor);
                start();
            }, 50);
        });
    }, 50);
});

//test( '不闭合选区的边界情况', function () {
//
//} );
//
test('trace 1742  isFocus', function () {
    if (!ua.browser.opera) {
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        document.body.appendChild(div1);
        document.body.appendChild(div2);
        var editor1 = new UE.Editor({'initialContent': '<span>hello</span>', 'autoFloatEnabled': false});
        var editor2 = new UE.Editor({'initialContent': '<span>hello</span>', 'autoFloatEnabled': false});
        editor1.render(div1);
        stop();
        editor1.ready(function () {
            editor2.render(div2);
            editor2.ready(function () {
                editor1.focus();
                ok(editor1.selection.isFocus(), '设editor内容是<span> editor1 is focused');
                ok(!editor2.selection.isFocus(), '设editor内容是<span> editor2 is not focused');
                editor2.focus();
                ok(editor2.selection.isFocus(), '设editor内容是<span> editor2 is focused');
                ok(!editor1.selection.isFocus(), '设editor内容是<span> editor1 is not focused');
                div1.parentNode.removeChild(div1);
                div2.parentNode.removeChild(div2);

                var div3 = document.createElement('div');
                var div4 = document.createElement('div');
                document.body.appendChild(div3);
                document.body.appendChild(div4);
                var editor3 = new UE.Editor({'initialContent': '<h1>hello</h1>', 'autoFloatEnabled': false});
                var editor4 = new UE.Editor({'initialContent': '<h1>hello</h1>', 'autoFloatEnabled': false});
                editor3.render(div3);
                editor3.ready(function () {
                    editor4.render(div4);
                    editor4.ready(function () {
                        editor3.focus();
                        ok(editor3.selection.isFocus(), '设editor内容是<h1> editor1 is focused');
                        ok(!editor4.selection.isFocus(), '设editor内容是<h1> editor2 is not focused');
                        editor4.focus();
                        ok(editor4.selection.isFocus(), '设editor内容是<h1> editor2 is focused');
                        ok(!editor3.selection.isFocus(), '设editor内容是<h1> editor1 is not focused');
                        setTimeout(function () {
                            div3.parentNode.removeChild(div3);
                            div4.parentNode.removeChild(div4);
                            start();
                        }, 50);
                    });
                });
            });
        });
    }
});





