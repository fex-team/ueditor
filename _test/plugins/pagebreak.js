module( 'plugins.pagebreak' );

/*trace 1179*/
//TODO bug没有修复，暂时注释
test( '对合并过单元格的表格分页', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p></p>' );
        range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
        editor.execCommand( 'inserttable', {numCols:5, numRows:5} );
        var trs = editor.body.getElementsByTagName( 'tr' );
        range.setStart( trs[0].firstChild, 0 ).collapse( 1 ).select();

        editor.currentSelectedArr = [trs[0].firstChild, trs[1].firstChild, trs[2].firstChild, trs[3].firstChild];
        editor.execCommand( 'mergecells' );
        editor.currentSelectedArr = [trs[1].childNodes[2], trs[1].childNodes[3], trs[2].childNodes[2], trs[2].childNodes[3]];
        editor.execCommand( 'mergecells' );
        range.setStart( trs[1].childNodes[1], 0 ).collapse( 1 ).select();

        editor.execCommand( 'pagebreak' );
        var tables = editor.body.getElementsByTagName( 'table' );
        var tr1 = tables[0].getElementsByTagName( 'tr' );
        equal( tables.length, 2, '应当拆为2个table' );
        equal( tr1.length, 1, '第一个table只有一行' );
//    equal( $( tr1 ).attr( 'rowspan' ), 1, 'rowspan为1' );
//
//    tr1 = tables[1].getElementsByTagName( 'tr' );
//    equal( tr1.length, 3, '第2个table有3行' );
//    equal( $( tr1[0] ).attr( 'rowspan' ), 2, 'rowspan为2' );
        setTimeout( function () {
                /*src中有延时操作*/
                start();
        }, 200 );
} );

test( '对第一行的单元格进行分页', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p></p>' );
        range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
        editor.execCommand( 'inserttable', {numCols:5, numRows:5} );
        var tds = editor.body.getElementsByTagName( 'td' );
        range.setStart( tds[1], 0 ).collapse( 1 ).select();
        var table = editor.body.getElementsByTagName( 'table' )[0];
        var tablehtml = ua.getChildHTML( table );

        editor.execCommand( 'pagebreak' );
        var hr = editor.body.firstChild;
        equal( ua.getChildHTML( editor.body.getElementsByTagName( 'table' )[0] ), tablehtml, '表格没发生变化' );
        equal( $( hr ).attr( 'class' ), 'pagebreak', '插入一个分页符' );
        equal( hr.tagName.toLowerCase(), 'hr', 'hr' );
        setTimeout( function () {
/*trace 2383*/
//            range.setStart( tds[1], 0 ).collapse( 1 ).select();
//            editor.execCommand( 'pagebreak' );
//            range.setStart( tds[1], 0 ).collapse( 1 ).select();
//            editor.execCommand( 'pagebreak' );
//            editor.execCommand('source');
//            editor.execCommand('source');
//            var hr = editor.body.getElementsByTagName( 'hr' );
//            equal( ua.getChildHTML( editor.body.getElementsByTagName( 'table' )[0] ), tablehtml, '表格没发生变化' );
//            equal( $( hr[0] ).attr( 'class' ), 'pagebreak', '插入一个分页符' );
//            equal( hr.length, 3, 'hr' );
            start();
        }, 200 );
} );

test( '对最后一行的单元格进行分页', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent( '<p></p>' );
        range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
        editor.execCommand( 'inserttable', {numCols:5, numRows:5} );
        var tds = editor.body.getElementsByTagName( 'td' );
        /*最后一行的单元格*/
        range.setStart( tds[24], 0 ).collapse( 1 ).select();
        editor.execCommand( 'pagebreak' );
        var ts = editor.body.getElementsByTagName( 'table' );
        var hr = editor.body.childNodes[1];
        equal( ts[0].getElementsByTagName( 'tr' ).length, 4, '第一个table 4行' );
        equal( ts[1].getElementsByTagName( 'tr' ).length, 1, '第2个table 1行' );
        equal( $( hr ).attr( 'class' ), 'pagebreak', '插入一个分页符' );
        equal( hr.tagName.toLowerCase(), 'hr', '插入的分页符是hr' );
        setTimeout( function () {
                start();
        }, 200 );
} );

test( '在段落中间闭合插入分页符', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>你好Ueditor</p>' );
        range.setStart( editor.body.firstChild.firstChild, 2 ).collapse( true ).select();
        editor.execCommand( 'pagebreak' );
        ua.manualDeleteFillData( editor.body );
        equal( body.childNodes.length, 3, '3个孩子' );
        equal( ua.getChildHTML( body.firstChild ), '你好' );
        equal( body.firstChild.tagName.toLowerCase(), 'p', '第一个孩子是p' );
        equal( $( body.firstChild.nextSibling ).attr( 'class' ), 'pagebreak' );
        equal( ua.getChildHTML( body.lastChild ), 'ueditor' );
        equal( body.lastChild.tagName.toLowerCase(), 'p', '第二个孩子是p' );
        setTimeout( function () {
                start();
        }, 100 );
} );

test( '选中部分段落再插入分页符', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>你好Ueditor</p><p>hello编辑器</p>' );
        range.setStart( body.firstChild.firstChild, 2 ).setEnd( body.lastChild.firstChild, 5 ).select();
        editor.execCommand( 'pagebreak' );
        ua.manualDeleteFillData( editor.body );
        equal( body.childNodes.length, 3, '3个孩子' );
        equal( ua.getChildHTML( body.firstChild ), '你好' );
        equal( $( body.firstChild.nextSibling ).attr( 'class' ), 'pagebreak' );
        equal( ua.getChildHTML( body.lastChild ), '编辑器' );
        equal( body.firstChild.tagName.toLowerCase(), 'p', '第一个孩子是p' );
        equal( body.lastChild.tagName.toLowerCase(), 'p', '第二个孩子是p' );
        setTimeout( function () {
                start();
        }, 200 );
} );

test( 'trace 1887:连续插入2次分页符，每次插入都在文本后面', function () {
        stop();
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p>你好</p>' );
        range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
        editor.execCommand('pagebreak');
        range.setStart( body.firstChild, 1 ).collapse( 1 ).select();
        editor.execCommand('pagebreak');
        equal(body.childNodes.length,3,'3个孩子');
        //trace 1187,chrome和firefox下都会有br,目前的做法是第二次插入就把前一个删除
        equal(body.childNodes[1].childNodes.length,0,'hr没有孩子节点');
        setTimeout( function () {
                start();
        }, 200 );
} );