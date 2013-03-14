module( 'plugins.elementpath' );

/*
 <li>表格
 <li>列表
 <li>文本
 <li>图片
 <li>超链接
 <li>加粗加斜
 <li>下划线，删除线
 * */

//1.2的版本中，表格的外面会自动套一个带格式的div

test( '表格', function () {
        var div = document.body.appendChild( document.createElement( 'div' ) );
        var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','elementPathEnabled' : true,'autoFloatEnabled':false});
            stop();
    setTimeout(function(){
        editor.render( div );
        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<table><tbody><tr><td>hello1</td><td><strong>strongText</strong>hello2<span style="text-decoration: underline">spanText</span></td></tr></tbody></table>' );
        var body = editor.body;
        /*选中整个表格*/
        range.selectNode( body.firstChild ).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
//        ua.checkElementPath( eles, ['body', 'div', 'table', 'tbody', 'tr', 'td'], '选中整个表格' );
        ua.checkElementPath( eles, ['body', 'table', 'tbody', 'tr', 'td'], '选中整个表格' );
        /*在单元格中单击*/
        var tds = body.getElementsByTagName( 'td' );
        range.setStart( tds[0].firstChild, 0 ).collapse( true ).select();
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
//           ua.checkElementPath( eles, ['body', 'div', 'table', 'tbody', 'tr', 'td'], '在单元格中单击' );
        ua.checkElementPath( eles, ['body', 'table', 'tbody', 'tr', 'td'], '在单元格中单击' );
        /*在单元格中的加粗文本中单击*/
        ua.manualDeleteFillData( editor.body );
        range.setStart( tds[1].firstChild.firstChild, 1 ).collapse( true ).select();
        eles = editor.queryCommandValue( 'elementpath' );
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
//        ua.checkElementPath( eles, ['body', 'div', 'table', 'tbody', 'tr', 'td', 'strong'], '在单元格中的加粗文本中单击' );
        ua.checkElementPath( eles, ['body', 'table', 'tbody', 'tr', 'td', 'strong'], '在单元格中的加粗文本中单击' );
        /*在单元格中的下划线文本中单击*/
        ua.manualDeleteFillData( editor.body );
        range.setStart( tds[1].lastChild.firstChild, 1 ).collapse( true ).select();
        eles = editor.queryCommandValue( 'elementpath' );
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
//        ua.checkElementPath( eles, ['body', 'div', 'table', 'tbody', 'tr', 'td', 'span'], '在单元格中的下划线文本中单击' );
        ua.checkElementPath( eles, ['body','table', 'tbody', 'tr', 'td', 'span'], '在单元格中的下划线文本中单击' );
        /*选中有下划线的文本*/
        ua.manualDeleteFillData( editor.body );
        range.setStart( tds[1].lastChild.lastChild, 1 ).setEnd( tds[1].lastChild.lastChild, 4 ).select();
        eles = editor.queryCommandValue( 'elementpath' );
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
//        ua.checkElementPath( eles, ['body', 'div', 'table', 'tbody', 'tr', 'td', 'span'], '选中有下划线的文本' );
        ua.checkElementPath( eles, ['body','table', 'tbody', 'tr', 'td', 'span'], '选中有下划线的文本' );
                start();
    },50);
} );
//暂不支持 table
//test('通过选区路径取range',function(){
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.options.elementPathEnabled=true;
//    editor.setContent('<table><tbody><tr><td>1</td><td>2</td></tr><tr><td>3</td><td>45</td></tr></tbody></table>');
//    var tds = editor.body.getElementsByTagName('td');
//    range.setStart(tds[3].firstChild, 0).collapse(1).select();
//    debugger
//    editor.queryCommandValue( 'elementpath' );
//    editor.execCommand('elementpath','4');
//    stop();
//    setTimeout(function(){
//        range = editor.selection.getRange();
//
//        if(ua.browser.gecko){
//            ua.checkResult(range,tds[3],tds[3],0,2,false,'取range--td');
//        }else{
//            ua.checkResult(range,tds[3].firstChild,tds[3].lastChild,0,2,false,'取range--td');
//        }
//        range.setStart(tds[3].firstChild, 1).collapse(1).select();
//        editor.execCommand('elementpath','3');
//        setTimeout(function(){
//            range = editor.selection.getRange();
//            if(ua.browser.gecko){
//                ua.checkResult(range,tds[2],tds[2],0,1,false,'取range--tr');
//            }else{
//                ua.checkResult(range,tds[2].firstChild,tds[2].lastChild,0,1,false,'取range--tr');
//            }
//            range.setStart(tds[3].firstChild, 0).collapse(1).select();
//            editor.execCommand('elementpath','2');
//            setTimeout(function(){
//                range = editor.selection.getRange();
//                if(ua.browser.gecko){
//                    ua.checkResult(range,tds[0],tds[0],0,1,false,'取range--tbody');
//                }else{
//                    ua.checkResult(range,tds[0].firstChild,tds[0].lastChild,0,1,false,'取range--tbody');
//                }
//                editor.setContent('<p>45645</p>');
//                range.selectNode(editor.body.firstChild).select();
//                editor.queryCommandValue( 'elementpath' );
//                editor.execCommand('elementpath',1);
//                setTimeout(function(){
//                    range = editor.selection.getRange();
//                    var p = editor.body.firstChild;
//                    if(ua.browser.gecko){
//                        ua.checkResult(range,p,p,0,1,false,'取range--p');
//                    }else{
//                        ua.checkResult(range,p.firstChild,p.firstChild,0,5,false,'取range--p');
//                    }
//                    start();
//                },50);
//            },50);
//        },50);
//    },50);
//});

//1.2的版本中，表格的外面会自动套一个带格式的div
test( 'trace 1539:列表', function () {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','elementPathEnabled' : true,'autoFloatEnabled':false});
    stop();
    setTimeout(function(){
        editor.render( div );
        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<ol><li>hello1</li><li>hello2<br /><table><tbody><tr><td>hello3</td></tr></tbody></table></li></ol>' );
        var body = editor.body;
        /*选中所有列表*/
        range.selectNode( body.firstChild ).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        ua.checkElementPath( eles, ['body', 'ol', 'li', 'p'], '选中整个列表' );
        /*选中列表中的表格*/
        range.selectNode( body.firstChild.getElementsByTagName( 'table' )[0] ).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        if ( !ua.browser.ie ){
//      ua.checkElementPath( eles, ['body','ol','li','div','table','tbody','tr','td'], '选中列表中的表格' );
        /*TODO 表格拖拽功能暂时被取消了，所以elementpath里先不放div*/
                ua.checkElementPath( eles, ['body', 'ol', 'li','table', 'tbody', 'tr', 'td'], '选中列表中的表格' );
        }
        start();
    },50);
//    /*选中列表中的br*/
//    range.selectNode( body.firstChild.getElementsByTagName( 'br' )[0] ).select();
//    var eles = editor.queryCommandValue( 'elementpath' );
//    ua.checkElementPath( eles, ['body','ol','li','br'], '选中列表中的br' );
} );

test( '文本和超链接', function () {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','elementPathEnabled' : true,'autoFloatEnabled':false});
    editor.render( div );
    stop();
    setTimeout(function(){
    var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<div><p>hello<a>a_link</a></p></div>' );
        var body = editor.body;
        /*选中文本hello*/
        range.selectNode( body.firstChild.firstChild.firstChild ).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        ua.checkElementPath( eles, ['body', 'div', 'p'], '选中文本' );
        /*选中超链接*/
        range.selectNode( body.firstChild.firstChild.lastChild.firstChild ).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        ua.checkElementPath( eles, ['body', 'div', 'p', 'a'], '选中文本' );
        start();
    },50);
} );

//在版本1.2中，如果没有setTimeout在FF（3.6和9都是）中range会出错，其他浏览器没问题
test( '图片', function () {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','elementPathEnabled' : true,'autoFloatEnabled':false});
    editor.render( div );
    stop();
    setTimeout( function () {
        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<div><p>hello<img /></p></div>' );
        var body = editor.body;
        /*选中图片*/
        setTimeout( function () {
            range.selectNode( body.firstChild.firstChild.lastChild ).select();
            var eles = editor.queryCommandValue( 'elementpath' );
            ua.checkElementPath( eles, ['body', 'div', 'p', 'img'], '选中图片' );
            start();
        }, 100 )
    },50)
} );