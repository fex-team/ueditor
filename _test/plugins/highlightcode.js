/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-9-26
 * Time: 下午1:16
 * To change this template use File | Settings | File Templates.
 */
//module('plugins.highlightcode');
//var toolbars_ = [
//    [ 'source','inserthtml','highlightcode']
//];
///*trace 3290*/
//test('插入代码',function(){
//    var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../','autoFloatEnabled':false,'toolbars':toolbars_});
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
//    var range = new baidu.editor.dom.Range( editor.document );
//    stop();
//    editor.ready(function(){
//        var br = baidu.editor.browser.ie ? '&nbsp;' : '<br />';
//        editor.setContent('<p>' + br + '</p>');
//        range.setStart(editor.body.firstChild,0).collapse(1).select();
//        setTimeout(function(){
//            editor.execCommand('highlightcode','<?php echo "Hello World"; ?>','php');
//            var s = '<pre class=\"brush: php;toolbar:false;\" >&lt;?php echo "Hello World"; ?&gt;\n</pre>';
//            equal( editor.getContent().substring(0,81),s,'代码高亮');
//            var tds = editor.body.firstChild.getElementsByTagName('td');
//            range.selectNode(tds[0]).select();
//            equal(editor.queryCommandState('highlightcode'),1,'插入代码高亮');
//            editor.execCommand('highlightcode','<?php echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; ?>','php');
//            stop();
//            setTimeout(function(){
//                equal( editor.getContent().substring(0,161),'<pre class="brush: php;toolbar:false;" >&lt;?php echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; echo "Hello World"; ?&gt;\n</pre>','代码修改');
//                editor.fireEvent('fullscreenchanged');
//                var html = [];
//                editor.fireEvent('getAllHtml',html);
//                ok(html[1].indexOf('SyntaxHighlighter')!=-1,'加载SyntaxHighlighter');
//                ua.manualDeleteFillData(editor.body);
//                tds = editor.body.getElementsByTagName('td');
//                range.selectNode(tds[0]).select();
//                editor.execCommand('highlightcode');
//                var br = ua.browser.ie?'&nbsp;':'<br>'
//                equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','去掉代码高亮');
//                div.parentNode.removeChild(div);
//                start();
//            },50);
//        },500);
//    },50);
//});
//
///*trace 2648*/
///*trace 3142*/
////test('切换源码不插入br',function(){
////    var div = document.body.appendChild( document.createElement( 'div' ) );
////    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
////    te.obj[2].render(div);
////    var range = new baidu.editor.dom.Range( te.obj[2].document );
////    stop();
////    setTimeout(function(){
////        te.obj[2].setContent('<p></p>');
////        range.setStart(te.obj[2].body.firstChild,0).collapse(true).select();
////        te.obj[2].execCommand('highlightcode','<?php echo "Hello World"; ?>','php');
////        var length=te.obj[2].body.childNodes.length;
////        ua.manualDeleteFillData(te.obj[2].body);
////        te.obj[2].execCommand('source');
////        setTimeout(function(){
////            te.obj[2].execCommand('source');
////            ok(length==te.obj[2].body.childNodes.length,'不增加br');
////            div.parentNode.removeChild(div);
////            start();
////        },50);
////    },50);
////});
//
///*trace 2472*/
//test('插入两个字符',function(){
//    var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../','autoFloatEnabled':false,'toolbars':toolbars_});
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
//    var range = new baidu.editor.dom.Range( editor.document );
//    stop();
//        setTimeout(function(){
//            editor.setContent('<p></p>');
//            range.setStart(editor.body.firstChild,0).collapse(true).select();
//            editor.execCommand('highlightcode','aaa','php');
//            ua.manualDeleteFillData(editor.body);
//            var br = ua.browser.ie?' ':'<br/>';
//            equal( editor.getContent().substring(0, 158),'<pre class=\"brush: php;toolbar:false;\" >aaa\n</pre><p>'+br+'</p>','插入成功');
//            div.parentNode.removeChild(div);
//            start();
//    },50);
//});
//
///*trace 3138*/
///*trace 3203*/
//test('插入代码后撤销',function(){
//    var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../','autoFloatEnabled':false,'toolbars':toolbars_});
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
//    var range = new baidu.editor.dom.Range( editor.document );
//    stop();
//    editor.ready(function(){
//        var br = baidu.editor.browser.ie ? '' : '<br />';
//        editor.setContent('<p>' + br + '</p>');
//        range.setStart(editor.body.firstChild,0).collapse(1).select();
//        setTimeout(function(){
//            editor.execCommand('highlightcode','<body><table><tbody><tr><td><br></td></tr></tbody></table></body>','html');
//            ua.manualDeleteFillData(editor.body);
//            equal( editor.getContent(),'<pre class="brush: html;toolbar:false;" >&lt;body&gt;&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;&lt;br&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;&lt;/body&gt;\n</pre><p><br/></p>','内容未被改变');
//            equal( editor.body.style.cursor,'text','检查光标样式');
//            ua.keydown(editor.body,{'keyCode':90,'ctrlKey':true});
//            equal( editor.getContent(),'','插入的代码被撤销');
//            equal( editor.body.style.cursor,'text','检查光标样式');
//            div.parentNode.removeChild(div);
//            start();
//        },500);
//    },50);
//});
//
///*trace 3202*/
////超时，暂时注掉--luqiong
////test('插入两段代码后修改第一段代码',function(){
////    var div = document.body.appendChild( document.createElement( 'div' ) );
////    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
////    te.obj[2].render(div);
////    var range = new baidu.editor.dom.Range( te.obj[2].document );
////    stop();
////    te.obj[2].ready(function(){
////        var br = baidu.editor.browser.ie ? '' : '<br />';
////        te.obj[2].setContent('<p>' + br + '</p>');
////        range.setStart(te.obj[2].body.firstChild,0).collapse(1).select();
////        setTimeout(function(){
////            te.obj[2].execCommand('highlightcode','<body><table><tbody><tr><td><br></td></tr></tbody></table></body>','html');
////            ua.manualDeleteFillData(te.obj[2].body);
////            range.setStart(te.obj[2].body.lastChild,0).collapse(1).select();
////            setTimeout(function(){
////                te.obj[2].execCommand('highlightcode','<body><table><tbody><tr><td><br></td></tr></tbody></table></body>','java');
////                ua.manualDeleteFillData(te.obj[2].body);
////                var tds = te.obj[2].body.firstChild.getElementsByTagName('td');
////                range.setStart(tds[0],0).collapse(1).select();
////                te.obj[2].execCommand('highlightcode','123<body><table><tbody><tr><td><br></td></tr></tbody></table></body>','html');
////                equal( te.obj[2].body.getElementsByTagName('table').length,2,'2段代码');
////                equal( te.obj[2].body.getElementsByTagName('code')[0].innerHTML,'123&lt;body&gt;&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;&lt;br&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;&lt;/body&gt;','第一段代码被修改');
////                equal( te.obj[2].body.getElementsByTagName('code')[1].innerHTML,'&lt;body&gt;&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td&gt;&lt;br&gt;&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;&lt;/body&gt;','第二段代码内容不变');
////                /*trace 3221*/
////                range.selectNode(tds[0]).select();
////                equal(te.obj[2].queryCommandState('autotypeset'),-1,'自动排版不可用');
////                equal(te.obj[2].queryCommandState('pasteplain'),-1,'纯文本粘贴不可用');
////                div.parentNode.removeChild(div);
////                start();
////            },500);
////        },500);
////    },50);
////});
