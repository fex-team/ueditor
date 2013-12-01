module( 'plugins.rowspacing' );

/*trace 1029*/
test( '设置段前距查看状态反射', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    stop();
    setTimeout(function () {
    range.setStart( editor.body.firstChild, 0 ).setEnd( editor.body.lastChild, 1 ).select();
    editor.execCommand( 'rowspacing', 15 ,'top');
    equal( editor.queryCommandValue( 'rowspacing' ,'top'), 15, '查看段前距' );
    /*光标闭合时查看状态反射*/
    range.setStart( editor.body.firstChild.firstChild, 1 ).collapse( true ).select();
    equal( editor.queryCommandValue( 'rowspacing','top' ), 15, '查看段前距' );
        start();
    }, 50);
} );

/*trace 1035*/
test( '非闭合清除段前距等样式，查看状态反射', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );

        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.lastChild, 1).select();
        editor.execCommand('rowspacing', 20, 'top');
        equal(editor.queryCommandValue('rowspacing', 'top'), 20, '段前距为2.0');

} );

test( '闭合清除段前距等样式，查看状态反射', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello1</p><p>hello2</p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'rowspacing', 20 ,'top');
    equal( editor.queryCommandValue( 'rowspacing','top' ), 20, '段前距为2.0' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'removeformat' );
    equal( editor.queryCommandValue( 'rowspacing' ,'top'), 5, '闭合清除格式后，段前距为5' );
} );

/*trace 1026*/
test( '设置段后距后设置字体颜色', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
//    var editor = te.obj[2];
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
    stop();
//    setTimeout(function(){
//        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<p>hello1<a href="">hello</a></p><p>hello2</p>' );
        range.setStart( editor.body.firstChild, 0 ).setEnd( editor.body.lastChild, 1 ).select();
        editor.execCommand( 'rowspacing', 15 ,'bottom');
        setTimeout(function(){
            editor.execCommand( 'forecolor', 'rgb(255,0,0)' );
            equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
            /*闭合的方式去查看行距的状态反射*/
            range.setStart( editor.body.firstChild.firstChild, 1 ).collapse( true ).select();
            equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
//            div.parentNode.removeChild(div);
            start();
        },50);
//    },50);
} );

test( '设置段后距后设置加粗等多种样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
//    var editor = te.obj[2];
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
    stop();
//    editor.ready(function(){
        setTimeout(function(){
//            var range = new baidu.editor.dom.Range( editor.document );
            editor.setContent( '<p>hello1</p><p>hello2</p>' );
            setTimeout(function(){
            range.setStart( editor.body.firstChild, 0 ).setEnd( editor.body.lastChild, 1 ).select();
            editor.execCommand( 'rowspacing', 15 ,'bottom');
            setTimeout(function(){
                editor.execCommand( 'bold' );
                editor.execCommand( 'underline' );
                equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
//                div.parentNode.removeChild(div);
                start();
            },50);
            },50);
        },100);
//    });
} );

test( '非闭合去除加粗等样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
//    var editor = te.obj[2];
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
    stop();
//    editor.ready(function(){
//        setTimeout(function(){
//            var range = new baidu.editor.dom.Range( editor.document );
            editor.setContent( '<p>hello1</p><p>hello2</p>' );
            setTimeout(function(){
            range.setStart( editor.body.firstChild, 0 ).setEnd( editor.body.lastChild, 1 ).select();
            editor.execCommand( 'rowspacing', 15 ,'bottom');
            setTimeout(function(){
                editor.execCommand( 'bold' );
                editor.execCommand( 'underline' );
                equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
                editor.execCommand( 'removeformat' );
                equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 5, '去除样式后查看段后距' );
//                div.parentNode.removeChild(div);
                start();
            },50);
            },50);
//        },100);
//    });
} );

test( '闭合去除样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
//    var editor = te.obj[2];
//    var div = document.body.appendChild( document.createElement( 'div' ) );
//    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
//    editor.render(div);
    stop();
//    editor.ready(function(){
//
//        var range = new baidu.editor.dom.Range( editor.document );
        editor.setContent( '<p>hello1</p><p>hello2</p>' );
        setTimeout(function(){
        range.setStart( editor.body.firstChild, 0 ).setEnd( editor.body.lastChild, 1 ).select();
        editor.execCommand( 'rowspacing', 15 ,'bottom');
        setTimeout(function(){
            editor.execCommand( 'bold' );
            editor.execCommand( 'underline' );
            /*采用闭合的方式查询段后距，
             介个好像用手选不太能选的出来，总是会选到<strong><span>里面去*/
            range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
            equal( editor.queryCommandValue( 'rowspacing','bottom' ), 15, '查看段后距' );
            /*闭合方式鼠标放在第二个p中*/
            range.setStart( editor.body.lastChild, 0 ).collapse( true ).select();
            equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
            editor.execCommand( 'removeformat' );
            //1.2后改
            equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 5, '去除样式后查看段后距' );
            /*第一行的样式应当仍然在*/
            range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
            equal( editor.queryCommandValue( 'rowspacing' ,'bottom'), 15, '查看段后距' );
//            div.parentNode.removeChild(div);
            start();
        },50);
        },50);
//    });
} );

test( '表格中设置段距', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td>hello1</td><td>hello2</td></tr><tr><td></td><td></td></tr></tbody></table>' );
    stop();
    setTimeout(function () {
        var tds = editor.body.firstChild.getElementsByTagName('td');
        /*选中表格中的文本设置段前距*/
        range.selectNode(tds[0].firstChild).select();
        editor.execCommand('rowspacing', 20, 'top');
        equal(editor.queryCommandValue('rowspacing', 'top'), 20, '设置表格中文本段前距为2');
        /*采用闭合的方式查询段前距*/
        setTimeout(function () {
            range.setStart(tds[0].firstChild.firstChild, 1).collapse(true).select();
            equal(editor.queryCommandValue('rowspacing', 'top'), 20, '设置表格中文本段前距为2');

            /*闭合在表格中的文本设置段后距*/
            range.setStart(tds[1].firstChild, 1).collapse(true).select();
            editor.execCommand('rowspacing', 15, 'bottom');
            /*选中整个单元格查询段后距*/
            range.selectNode(tds[1]).select();
            equal(editor.queryCommandValue('rowspacing', 'bottom'), 15, '设置表格中文本段后距为1.5');
            /*闭合在空白单元格中设置段后距*/
            range.setStart(tds[2], 0).collapse(true).select();
            editor.execCommand('rowspacing', 25, 'bottom');
            equal(editor.queryCommandValue('rowspacing', 'bottom'), 25, '设置表格中文本段后距为2.5');
            start();
        }, 50);
    }, 50);
});

test('跨多个单元格设置段前距', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<table><tbody><tr><td>hello1</td><td>hello2<img /></td></tr><tr><td><div>hello3</div></td><td><p>hello4</p></td></tr></tbody></table>');
    stop();
    setTimeout(function () {
        var tds = editor.body.firstChild.getElementsByTagName('td');
        var p = editor.body.getElementsByTagName('p');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('rowspacing', 15, 'top');
        for (var index = 0; index < tds.length; index++) {
            range.selectNode(tds[index]).select();
            equal(editor.queryCommandValue('rowspacing', 'top'), 15, '设置表格中文本段前距为1.5');
            /*会自动在非block元素外面套p*/
            //1.2版本，加在p上
            equal(p[index].style['marginTop'], '15px', '段前距属性都是加在第一个孩子节点上');
        }
        start();
    }, 50);
} );

/*trace 1052*/
test( '对插入的代码设置多倍段前距', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    stop();
    setTimeout(function () {
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    var stylecode = "var tds = editor.body.firstChild.getElementsByTagName( 'td' );\n range.selectNode( editor.body.firstChild ).select();";
    editor.execCommand( 'inserthtml', "<pre style='background-color: #F8F8F8;border: 1px solid #CCCCCC;padding:10px 10px'>" + stylecode + "</pre>" );
    equal( editor.body.firstChild.tagName.toLowerCase(), 'pre', '第一个孩子节点为pre' );
    range.selectNode( editor.body.firstChild ).select();
    editor.execCommand( 'rowspacing', 20,'top' );
    var pre = editor.body.firstChild;
    equal( pre.tagName.toLowerCase(), 'pre', '不允许将p换成pre' );
    equal( pre.style['borderWidth'], '1px', '宽度' );
    ok( pre.style['borderColor'].toUpperCase() == '#CCCCCC' || pre.style['borderColor'] == 'rgb(204, 204, 204)', '颜色' );
        start();
    }, 50);
} );

test( '在合并单元格中设置多倍段前距', function () {
    var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
    stop();
    setTimeout( function () {
        var div = document.body.appendChild( document.createElement( 'div' ) );
        te.dom.push( div );
        editor.render( div );

        setTimeout(function () {
            editor.setContent('<p></p>');
            var range = new baidu.editor.dom.Range(editor.document);
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols:3, numRows:3});
            stop();
            /*insertHTML有一个200ms的超时函数*/
            setTimeout(function () {
                ua.manualDeleteFillData(editor.body);
                var trs = editor.body.getElementsByTagName('tr');
                range.setStart(trs[0].firstChild, 0).setEnd(trs[1].firstChild, 0).select();
                editor.currentSelectedArr = [trs[0].firstChild, trs[1].firstChild];
                editor.execCommand('mergecells');
                /*合并单元格后设置这个单元格多倍段前距*/
                ua.manualDeleteFillData(editor.body);
                range.setStart(trs[0].firstChild, 0).collapse(true).select();
                editor.execCommand('rowspacing', 20, 'top');
                ua.manualDeleteFillData(editor.body);
                equal(trs[0].firstChild.firstChild.tagName.toLowerCase(), 'p', 'td下面创建了一个p');
                equal(trs[0].firstChild.firstChild.style['marginTop'], '20px', 'p设置了2倍行距');
                trs = editor.body.firstChild.getElementsByTagName('tr');
                equal(trs.length, 3, '3行');
                var tbodyChild = editor.body.getElementsByTagName('tbody')[0].childNodes;
                for (var index = 0; index < tbodyChild.length; index++) {
                    equal(tbodyChild[index].tagName.toLowerCase(), 'tr', 'tbody下面都是tr');
                }
                start();
            }, 30);
        }, 300);
    },50);
} );

/*trace 1079*/
test( '合并单元格后设置多个单元格多倍段前距', function () {
    var editor = new baidu.editor.Editor( {'plugins':['table'],'autoFloatEnabled':false} );
    stop();
    setTimeout(function () {
        var div = document.body.appendChild(document.createElement('div'));
        te.dom.push(div);
        editor.render(div);
        setTimeout(function () {
            editor.setContent('<p></p>');
            var range = new baidu.editor.dom.Range(editor.document);
            range.setStart(editor.body.firstChild, 0).collapse(true).select();
            editor.execCommand('inserttable', {numCols:3, numRows:3});

            setTimeout(function () {
                ua.manualDeleteFillData(editor.body);
                var trs = editor.body.firstChild.getElementsByTagName('tr');
                /*合并第一列前2个单元格*/
                range.setStart(trs[0].firstChild, 0).setEnd(trs[1].firstChild, 0).select();
                editor.currentSelectedArr = [trs[0].firstChild, trs[1].firstChild];
                editor.execCommand('mergecells');
                /*设置多倍段前距*/
                range.setStart(trs[0].firstChild, 0).setEnd(trs[2].firstChild, 0).select();
                editor.currentSelectedArr = [trs[0].firstChild, trs[1].firstChild, trs[2].firstChild];
                editor.execCommand('rowspacing', 20, 'top');
                trs = editor.body.firstChild.getElementsByTagName('tr');
                equal(trs.length, 3, '3行');
                var tbodyChild = editor.body.getElementsByTagName('tbody')[0].childNodes;
                for (var index = 0; index < tbodyChild.length; index++) {
                    equal(tbodyChild[index].tagName.toLowerCase(), 'tr', 'tbody下面都是tr');
                }
                start();
            }, 50);
        }, 300);
    },50);
} );
