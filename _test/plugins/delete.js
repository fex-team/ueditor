/**
 * Created by JetBrains WebStorm.
 * User: shenlixia01
 * Date: 11-8-12
 * Time: 下午3:45
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.delete' );

test( 'chrome删除后切换源码再切换回来，光标没了', function() {
    //opera 取不到range值
    if(ua.browser.opera) return 0;
        var editor = te.obj[0];
        var div = te.dom[0];
        editor.render( div );
        editor.setContent( 'hello' );
        var range = editor.selection.getRange();
        range.selectNode( editor.body.firstChild ).select();
        editor.execCommand( 'delete' );
        stop();
        expect( 2 );
        //source 包含超时操作，ie下必须有同步操作，否则会报错
        setTimeout(function() {
            editor.execCommand('source');
            setTimeout(function() {
                editor.execCommand('source');
                start();
            },20);
        },20);
        range = editor.selection.getRange();
        equal( range.startContainer.nodeType, 1, '光标定位在p里' );
        equal( range.startContainer.tagName.toLowerCase(), 'p', 'startContainer为p' );
        te.dom.push( div );
        start();
} );

/*trace1061*/
test( '删除时不会删除block元素', function() {
    if(ua.browser.opera) return 0;
    var editor = te.obj[0];
    editor.setContent( '<h1>hello</h1>' );
    setTimeout(function() {
        var range = te.obj[1];
        range.selectNode( editor.body.firstChild ).select();
        editor.execCommand( 'delete' );
        equal( editor.body.lastChild.tagName.toLowerCase(), 'p', 'h1替换为p' );
        if ( !baidu.editor.browser.ie )
            equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
        else
            equal( editor.body.lastChild.innerHTML, '', '内容被删除了' );
        if(!ua.browser.opera){
            range = editor.selection.getRange();
            equal( range.startContainer.tagName.toLowerCase(), 'p', '光标位置' );
        }
        start();
    },50);
    stop();
} );


test( '闭合的时候删除不可用', function() {
    var editor = te.obj[0];
    editor.setContent( '<h1>hello</h1>' );
    setTimeout(function() {
    var range = te.obj[1];
    range.setStart( editor.body.firstChild, 0 ).collapse().select();
    equal( editor.queryCommandState( 'delete' ), -1, '闭合时state为-1' );
        start();
    },50);
    stop();
} );

test( '删除部分文本', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong>hello world</strong></p>' );
    setTimeout(function() {
    var range = te.obj[1];
    var strong = editor.body.firstChild.firstChild;
    range.setStart( strong.firstChild, 3 ).setEnd( strong.firstChild, 5 ).select();
    equal( editor.queryCommandState( 'delete' ), 0, '不闭合时state为0' );
    editor.execCommand( 'delete' );
    ua.manualDeleteFillData( editor.body );
    equal( strong.innerHTML, 'hel&nbsp;world' );
    start();
},50);
stop();
} );

test( '删除inline的标签', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong><em>hello world</em><span>wasai</span></strong></p>' );
    setTimeout(function() {
    var range = te.obj[1];
    var strong = editor.body.firstChild.firstChild;
    range.selectNode( strong ).select();
    equal( editor.queryCommandState( 'delete' ), 0, '不闭合时state为0' );
    editor.execCommand( 'delete' );
    ua.manualDeleteFillData( editor.body );
    equal( editor.body.firstChild.tagName.toLowerCase(), 'p', 'strong 以及子inline节点都被删除' );
    if ( !baidu.editor.browser.ie )
        equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
    else
        equal( editor.body.lastChild.innerHTML, '', '内容被删除了' );
        start();
    },50);
    stop();
} );

/*trace 1089*/
test( '跨行选择2个块元素', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong>hello world<span>wasai</span></strong></p><div><em><span>hello 2</span></em></div>' );
    setTimeout(function() {
    var range = te.obj[1];
    var body = editor.body;
    range.setStart( body.firstChild, 0 ).setEnd( body.lastChild,1 ).select();
    editor.execCommand( 'delete' );
//    if(!ua.browser.opera){
        range = editor.selection.getRange();
        equal( body.childNodes.length, 1, 'div被删除，保留p' );
        var br = baidu.editor.browser.ie?"":"<br>";
        equal( ua.getChildHTML( body ), '<p>'+br+'</p>' );
    start();
},50);
stop();
//    }
} );

test( 'trace 1272:跨行选择，选择后面块元素的部分内容', function() {
    var editor = te.obj[0];
    editor.setContent( '<p><strong>hello world<span>wasai</span></strong></p><div><em><span class="span">hello 2</span></em></div>' );
    setTimeout(function() {
    var range = te.obj[1];
    var body = editor.body;
    range.setStart( body.firstChild, 0 ).setEnd( body.lastChild.firstChild.firstChild.firstChild, 2 ).select();
    editor.execCommand( 'delete' );
    range = editor.selection.getRange();
    equal( body.childNodes.length, 1, 'p被删除，保留div' );
    if ( baidu.editor.browser.gecko )
        equal( range.startContainer.innerHTML, 'llo&nbsp;2', 'llo 2为startContainer' );
    else
        equal( range.startContainer.parentNode.innerHTML, 'llo&nbsp;2', 'llo 2为startContainer' );
    equal( body.firstChild.tagName.toLowerCase(), 'div', 'tagname is p' );
    equal( ua.getChildHTML( body.firstChild ), '<em><span class="span">llo&nbsp;2</span></em>' );
        start();
    },50);
    stop();
} );

/*trace 1104*/
test( ' 全选后删除', function() {
    var editor = te.obj[0];
    if ( baidu.editor.browser.ie )
        editor.setContent( '<p>dsafds&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>' );
    else
        editor.setContent( '<p><br></p><p><br></p><p><br></p><p>d<br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p>' );
    setTimeout(function() {
    editor.focus();
    editor.execCommand( 'selectall' );
    editor.execCommand( 'delete' );
    equal( editor.body.childNodes.length, 1, '删除后只剩一个bolock元素' );
    equal( editor.body.firstChild.tagName.toLowerCase(), 'p', '删除后只剩一个p' );
    if ( !baidu.editor.browser.ie )
        equal( editor.body.lastChild.innerHTML, '<br>', '内容被删除了' );
    else
        equal( editor.body.lastChild.innerHTML, '&nbsp;', '内容被删除了' );
    start();
},50);
stop();
} );


test( ' 删除所有列表', function() {
    var editor = te.obj[0];
    editor.setContent('<ol><li>hello1</li><li>你好</li></ol>');
    setTimeout(function() {
    var body = editor.body;
        editor.focus();
    editor.execCommand( 'selectall' );
    editor.execCommand( 'delete' );
    equal( body.childNodes.length, 1, '删除后只剩一个ol元素' );
    var br = baidu.editor.browser.ie?"&nbsp;":"<br>";
    equal( ua.getChildHTML(body), '<p>'+br+'</p>', '删除后只剩一个p' );
        start();
    },50);
    stop();
} );

test( ' 删除部分列表', function() {
    var editor = te.obj[0];
    editor.setContent('<ol><li>hello1</li><li>你好</li><li>hello3</li></ol>');
    var body = editor.body;
    var range = te.obj[1];
    setTimeout(function(){
        range.setStart(body.firstChild,1).setEnd(body.firstChild,2).select();
        editor.execCommand( 'delete' );
        equal( body.childNodes.length, 1, '删除后只剩一个ol元素' );
//    var br = baidu.editor.browser.ie?"":"<br>";
        var br = "";
        equal( ua.getChildHTML(body), '<ol><li><p>hello1'+br+'</p></li><li><p>hello3'+br+'</p></li></ol>', '第二个li被删除' );
        start();
    },50);
    stop();

} );

/*在chrome下右键删除td里的图片会把整个td删除的问题*/
test( ' chrome下右键删除td里的图片会把整个td删除', function() {
    var editor = te.obj[0];
    editor.setContent('<table><tbody><tr><td><img src="http://ueditor.baidu.com/img/logo.png" alt=""></td><td>hello</td></tr></tbody></table>');
    setTimeout(function(){
    var body = editor.body;
    var range = te.obj[1];
    var img = editor.document.getElementsByTagName('img')[0];
    range.selectNode(img).select();
    editor.execCommand( 'delete' );
    var tds = body.getElementsByTagName('td');
    equal(tds.length,2,'td数量没有少');
    equal(body.getElementsByTagName('img').length,0,'img被删除');
    start();
},50);
stop();
} );
/*trace 1632 清空编辑器，输入回车，再输入文字，将光标放入第一行回车处，按delete键*/
//test('trace 1632 清空编辑器，输入回车，再输入文字，将光标放入第一行回车处，按delete键',function(){
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<p><br></p><p>hello</p>' );
////    equal(editor.body.firstChild.outerHTML,'');
////    editor.execCommand('delete');
////    equal(editor.body.firstChild.outerHTML,'');
////    equal(editor.body.childNodes.length,1);
//    //range.setStart(editor.body.firstChild, 0).collapse(true).select();
//    range.setEnd(editor.body.firstChild, 0).collapse(true).select();
//    editor.focus();
//    setTimeout(function() {
//        te.presskey("delete", "");
//       ua.manualDeleteFillData( editor.body );
//        editor.focus();
//        setTimeout(function() {
////            te.presskey("delete", "");
//                //var br = ua.browser.ie?'&nbsp;':'<br>';
//            setTimeout(function() {
//                editor.focus();
//                equal(editor.body.getElementsByTagName('p').length,1);
//                //start();
//            }, 20);
//        }, 20);
//    }, 20);
//    stop();
//});

test('删除SelectedArr',function(){
    var editor = te.obj[0];
    editor.setContent('<p>hello</p><p>hello1</p>')
    editor.selectNode(editor.body.firstChild).select();
    editor.execCommand('delete');
    var br = ua.browser.ie?'':'<br>';
    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p><p>hello1</p>','');
});