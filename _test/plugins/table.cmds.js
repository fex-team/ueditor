module( 'plugins.table' );

/*trace992，合并单元格后多了一个td*/
test( '向右合并--拆分成列', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    ua.manualDeleteFillData( editor.body );

    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    range.setStart( tds[1], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    tds = editor.body.getElementsByTagName( 'td' );
    equal( tds.length, 2, '2个单元格' );
    equal( tds[0].getAttribute( 'colspan' ), 2, '第一行的单元格colspan为2' );
    equal( tds[1].getAttribute( 'colspan' ), 2, '第二行的单元格colspan为2' );
    ua.manualDeleteFillData( editor.body );
    setTimeout( function(){
        editor.execCommand('source');
        start();
    });
    stop();
    tds = editor.body.getElementsByTagName( 'td' );
    equal( tds.length, 2, '2个单元格' );
    equal( tds[0].getAttribute( 'colspan' ), 2, '切换到源码后第一个的单元格colspan' );
    equal( tds[1].getAttribute( 'colspan' ), 2, '切换到源码后第二行第一个的单元格colspan' );

    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand('splittocols');
    equal( tds[0].getAttribute( 'colspan' ), 1, '拆分--[0][0]单元格colspan' );
    equal( tds[0].rowSpan, 1, '拆分--[0][0]单元格rowspan' );
} );

test('向下合并-拆分成行',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    ua.manualDeleteFillData( editor.body );
    var tds = editor.body.getElementsByTagName( 'td' );

    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergedown' );
    range.setStart( tds[1], 0 ).collapse( true ).select();
    editor.execCommand( 'mergedown' );
    tds = editor.body.getElementsByTagName( 'td' );
    equal( tds.length, 2, '2个单元格' );
    equal( tds[0].getAttribute( 'rowspan' ), 2, '合并--[0][0]单元格rowspan' );
    equal( tds[1].getAttribute( 'rowspan' ), 2, '合并--[0][1]单元格rowspan' );

    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand('splittorows');
    range.setStart( tds[1], 0 ).collapse( true ).select();
    editor.execCommand('splittorows');
    equal( tds[0].colSpan, 1, '拆分--[0][0]单元格colspan' );
    equal( tds[0].getAttribute( 'rowspan' ), 1, '拆分--[0][0]单元格rowspan' );
});

test('完全拆分单元格',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    ua.manualDeleteFillData( editor.body );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        ut.clearSelected();
        var tds = editor.body.getElementsByTagName( 'td' );
        equal( tds.length, 6, '单元格数' );
        equal( tds[0].getAttribute( 'colspan' ), 2, '合并--[0][0]单元格colspan' );
        equal( tds[0].getAttribute( 'rowspan' ), 2, '合并--[0][0]单元格rowspan' );

        editor.execCommand('splittoCells');
        equal( tds.length, 9, '单元格数' );
        equal( tds[0].getAttribute( 'colspan' ), 1, '拆分--[0][0]单元格colspan' );
        equal( tds[0].getAttribute( 'rowspan' ), 1, '拆分--[0][0]单元格rowspan' );
        equal( tds[1].colSpan, 1, '拆分--[0][1]单元格colspan' );
        equal( tds[1].getAttribute( 'rowspan' ), 1, '拆分--[0][1]单元格rowspan' );

        editor.undoManger.undo();
        equal( tds[0].getAttribute( 'colspan' ), 2, '撤销--[0][0]单元格colspan' );
        equal( tds[0].getAttribute( 'rowspan' ), 2, '撤销--[0][0]单元格rowspan' );
        start();
    },50);
    stop();
});

test('删除table',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable');
    ua.manualDeleteFillData(editor.body);
    equal(editor.queryCommandState('deletetable'),-1,'删除按钮灰色');

    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
//    setTimeout(function(){    editor.execCommand( 'deletetable' );
//    },1000);
//
//    ua.manualDeleteFillData(editor.body);
//    var table=editor.body.getElementsByTagName('table')[0];
//    equal(table,undefined,'删除成功');
});
//
//test('修改table屬性',function(){
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent( '<p></p>' );
//    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
//    editor.execCommand( 'inserttable', {numCols:2,numRows:3,align:'center'} );
//    var table = editor.body.getElementsByTagName('table')[0];
//    var align = table.getAttribute('align');
////    var cla = table.getAttribute('class');
//    equal(align,'center','对齐方式居中');
////    equal(cla,' noBorderTable','无边框');
//    var tds = editor.body.getElementsByTagName( 'td' );
//    range.setStart( tds[0], 0 ).collapse( true ).select();
//    editor.execCommand('edittable',{align:'right'});
//    ua.manualDeleteFillData(editor.body);
//    table = editor.body.getElementsByTagName('table')[0];
//    align = table.getAttribute('align');
//    equal(align,'right','对齐方式：向右');
//    equal(editor.queryCommandState('edittable'),0,'state');
//});
//
//test('修改单元格',function(){
//    var editor=te.obj[0];
//    var range=te.obj[1];
//    editor.setContent('<p></p>');
//    range.setStart(editor.body.firstChild,0).collapse(true).select();
//    editor.execCommand('inserttable');
//    var tds = editor.body.firstChild.getElementsByTagName('td');
//    editor.currentSelectedArr.push(tds[1]);
//
//    editor.execCommand('edittd',{bgColor:'#9bbb59',align:'center'});
//    var td = editor.body.firstChild.getElementsByTagName('td')[1];
//    var bg = td.getAttribute('bgColor');
//    var align = td.getAttribute('align');
//    equal(bg,'#9bbb59','背景颜色');
//    equal(align,'center','水平居中');
//    equal(editor.queryCommandState('edittd'),0,'state');
//});

test('表格前插行',function(){
    var editor=te.obj[0];
    var range=te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild,0).collapse(true).select();
    editor.execCommand('inserttable');
    var tds = editor.body.firstChild.getElementsByTagName('td');
    range.setStart(tds[1],0).collapse(true).select();

    editor.execCommand('insertparagraphbeforetable');
    ua.manualDeleteFillData(editor.body);
    var br=ua.browser.ie?'':'<br>';
    equal(editor.body.firstChild.innerHTML,br,'表格前插行');
});

test('插入行',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    ua.manualDeleteFillData( editor.body );
    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergedown' );
    range.setStart( tds[4], 0 ).collapse( true ).select();
    editor.execCommand('insertrow');
    tds = editor.body.getElementsByTagName( 'td' );
    equal( tds[0].getAttribute('rowspan'), 3, '[0][0]单元格rowspan');
    editor.undoManger.undo();
    equal( tds[0].getAttribute('rowspan'), 2, '[0][0]单元格rowspan');
});

test('插入列',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    ua.manualDeleteFillData( editor.body );
    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    range.setStart( tds[3], 0 ).collapse( true ).select();
    editor.execCommand('insertcol');
    tds = editor.body.getElementsByTagName( 'td' );
    equal( tds[0].getAttribute('colspan'), 3, '[0][0]单元格colspan');
    editor.undoManger.undo();
    equal( tds[0].getAttribute('colspan'), 2, '[0][0]单元格colspan');
});

test('删除行',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:3} );
    var tds = editor.body.getElementsByTagName('td');

    range.setStart(tds[0],0).collapse(1).select();
    editor.execCommand('deleterow');
    equal(editor.body.getElementsByTagName('tr').length,2,'删除行');
    editor.undoManger.undo();
    equal(editor.body.getElementsByTagName('tr').length,3,'撤销后的行数');

    range.setStart(tds[5],0).collapse(1).select();
    editor.execCommand('deleterow');
    equal(editor.body.getElementsByTagName('tr').length,2,'删除行');
});

//test('mouse event',function(){
//    var editor=te.obj[0];
//    var range=te.obj[1];
//    editor.setContent('<p></p>');
//    range.setStart(editor.body.firstChild,0).collapse(true).select();
//    editor.execCommand('inserttable');
//
////    setTimeout(function(){
//        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
//        var ut = editor.getUETable(editor.body.firstChild);
//        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[2].cells[4]);
//        ut.setSelected(cellsRange);
//        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
//
//        var td=trs[3].getElementsByTagName('td');
//        ua.mousedown(td[0]);//清空选择的单元格
//        equal(ut.selectedTds.length,'0','mouse down--length');
////        ua.mouseover(td[0]);//选择单元格
////        ua.mouseover(td[1]);
////        ua.mouseup(td[2]);
////        equal(editor.currentSelectedArr.length,'2','mouse over--length');
//    //    editor.currentSelectedArr=[];
//    //    range.setStart(td[2],0).setEnd(td[4],0).select();
//    //    ua.mouseup(td[3]);
//    //    range = editor.selection.getRange();
//    //    ua.checkResult(range,td[2],td[2],0,0,true,'mouse up --range');
////        start();
////    },50);
////    stop();
//});


/*trace 750，1308*/
//test( 'trace1308：前插入行的样式和原先不同', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//
///*不能设置content为空，这样插入表格会有问题
//     * 可以尝试手动地在主demo中清空body所有内容后插入表格，ie下面插入表格的菜单是灰的，光标也没有办法定位到表格外面*/
//
//    editor.setContent( '<p></p>' );
//    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
//    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
//    ua.manualDeleteFillData( editor.body );
//    range.setStartAfter( editor.body.firstChild ).collapse( true ).select();
//    //cellborder:2,不支持了
//    editor.execCommand( 'inserttable', {border:2,numCols:2,numRows:2} );
//    var table2 = editor.body.getElementsByTagName( 'table' )[1];
//    range.setStart( table2.getElementsByTagName( 'td' )[0], 0 ).collapse( true ).select();
//    editor.execCommand( 'insertrow' );
//    var tds = table2.getElementsByTagName( 'td' );
//
///*firefox下用jquery的方式去不到border-width*/
//
//    for(var index = 0;index<tds.length;index++)
//
///*边框宽度加到table上了*/
//equal(table2.getAttribute('border'),'2','表格边框为2px');
////    equal( $( tds[index] ).css( 'border-width' ) || tds[index].style.borderWidth, '2px', '表格边框为2px' );
////    for ( var index = 0; index < tds.length; index++ ) {
////        equal( $( tds[index ] ).css( 'border-width' ) || tds[index].style.borderWidth, '2px', '查看第' + (index + 1) + '个单元格的边框' )
////    }
//} );

/*trace 749*/
test( '拆分为列后2列都有文本', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    ua.manualDeleteFillData( editor.body );
    var tds = editor.body.getElementsByTagName( 'td' );
    tds[1].innerHTML = 'hello';
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    var tr = editor.body.getElementsByTagName( 'tr' )[0];
    equal( $( tr.firstChild ).attr( 'colspan' ), '2', '跨度2列' );
    editor.execCommand( 'splittocols' );
    ua.manualDeleteFillData( editor.body );
    tds = editor.body.getElementsByTagName( 'td' );
    //1.2版本，合并拆分之后hello前多了空的占位符
    ok( tds[0].innerHTML == '<br><br>hello' || tds[0].innerHTML == "​hello", '第一个单元格中有内容' );
    ok( tds[1].innerHTML == '' || tds[1].innerHTML == '<br>', '第二个单元格中有内容' );
} );

/*trace 743*/
test( '合并单元格后删除列再撤销', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:4,numRows:4} );
    ua.manualDeleteFillData( editor.body );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[3]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        editor.execCommand( 'deleterow' );
        trs = editor.body.getElementsByTagName( 'tr' );
        equal( trs.length, 3, '删除后只剩3个tr' );
        editor.undoManger.undo();
        trs = editor.body.getElementsByTagName( 'tr' );
        equal( trs.length, 4, '撤销后有4个tr' );
        equal( $( trs[0].cells[0] ).attr( 'colspan' ), 4, '第一行的第一个单元格colspan为4' );
        start();
    },50);
    stop();
} );

/*trace 726*/
test( '选中合并过的单元格和普通单元格，查看完全拆分单元格菜单是否高亮', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:4,numRows:4} );
    ua.manualDeleteFillData( editor.body );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        equal( editor.queryCommandState( 'splittocells' ), 0, '应当可以拆分单元格' );
        setTimeout(function(){
            var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[3].cells[3]);
            ut.setSelected(cellsRange);
            range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
            editor.queryCommandState( 'splittocells' );
            equal( editor.queryCommandState( 'splittocells' ), -1, '应当不可以拆分单元格' );
            start();
        },50);
    },50);
    stop();
} );

/*trace 718*/
test( '2次撤销删除列', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:4,numRows:4} );
    ua.manualDeleteFillData( editor.body );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[1].cells[1],trs[2].cells[2]);
        ut.setSelected(cellsRange);
        range.setStart( trs[1].cells[1], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        equal( trs[1].cells[1].rowSpan, 2, 'rowspan 为2' );
        equal( trs[1].cells[1].colSpan, 2, 'colspan 为2' );
        editor.execCommand( 'deletecol' );
        equal( trs[1].cells.length, 3, '3个td' );
        editor.undoManger.undo();

        trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        equal( trs[1].cells.length, 3, '3个td' );
        equal( trs[1].cells[1].rowSpan, 2, 'rowspan 为2' );
        equal( trs[1].cells[1].colSpan, 2, 'colspan 为2' );

        range.setStart( trs[1].cells[1], 0 ).collapse(1).select();
        editor.execCommand( 'deletecol' );
        equal( trs[1].cells.length, 3, '3个td' );
        equal( trs[1].cells[1].rowSpan, 2, 'rowspan 为2' );
        ok( trs[1].cells[1].colSpan == undefined || trs[1].cells[1].colSpan == 1, 'colspan为1或者undefined' );
        start();
    },50);
    stop();
} );

/*trace 713*/
test( '合并最后一列单元格后再前插入列', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[2],trs[2].cells[2]); /*合并最后一列的单元格*/
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[2], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        equal( $( trs[0].cells[2] ).attr( 'rowspan' ), 3, '跨3行' );
        editor.execCommand( 'insertcol' );      /*前插入列*/
        trs = editor.body.getElementsByTagName( 'tr' );
        equal( trs[0].cells.length, 4, '4列' );
        equal( $( trs[0].cells[3] ).attr( 'rowspan' ), 3, '跨3行' );
        start();
    },50);
    stop();
} );

/*trace 1098 */
test( 'trace 1098:多次合并单元格偶切换到源码再切回来', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[2].cells[0]);
        ut.setSelected(cellsRange);
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        editor.execCommand( 'mergecells' );

        setTimeout(function(){
            trs = editor.body.firstChild.getElementsByTagName( 'tr' );
            ut = editor.getUETable(editor.body.firstChild);
            cellsRange = ut.getCellsRange(trs[0].cells[1],trs[2].cells[0]);
            ut.setSelected(cellsRange);
            range.setStart( trs[0].cells[1], 0 ).collapse( true ).select();
            editor.execCommand( 'mergecells' );

            setTimeout( function() {
                trs = editor.body.firstChild.getElementsByTagName( 'tr' );
                ut = editor.getUETable(editor.body.firstChild);
                cellsRange = ut.getCellsRange(trs[0].cells[2],trs[1].cells[0]);
                ut.setSelected(cellsRange);
                range.setStart( trs[0].cells[2], 0 ).collapse( true ).select();
                editor.execCommand( 'mergecells' );
                editor.execCommand( 'source' );
                editor.execCommand( 'source' );

                equal( trs.length, 3, '3个tr' );
                equal( trs[0].cells[0].rowSpan, 3, '第一个单元格rowspan 3' );
                equal( trs[0].cells[1].rowSpan, 3, '第二个单元格rowspan 3' );
                equal( trs[0].cells.length, 3, '3个td' );
                equal( trs[1].cells.length, 0, '0个td' );
                equal( trs[2].cells.length, 1, '1个td' );
                start();
            }, 50 );
        },50);
    },50);
    stop();
} );

/*trace 1307*/
test( 'trace 1307:adjustTable--多次合并单元格切换到源码再切回来--选中单元格浏览器会假死', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:4,numRows:4} );

    setTimeout(function(){
        var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[1].cells[0],trs[3].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart( trs[1].cells[0], 0 ).collapse( true ).select();

        editor.execCommand( 'mergecells' );
        setTimeout(function(){
            var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[2],trs[2].cells[0]);
            ut.setSelected(cellsRange);
            range.setStart( trs[0].cells[2], 0 ).collapse( true ).select();
            editor.execCommand( 'mergecells' );
            editor.execCommand( 'source' );
            editor.execCommand( 'source' );

            trs = editor.body.getElementsByTagName( 'tr' );
            equal( trs[1].rowIndex, 1, '（1,1）行索引' );
            equal( trs[1].cells[0].cellIndex, 0, '（1,0）列索引' );
            equal( trs[1].cells[1].cellIndex, 1, '（1,1）列索引' );

            equal( trs[2].rowIndex, 2, '（2,2）行索引' );
            equal( trs[2].cells[0].cellIndex, 0, '（2,0）列索引' );

            equal( trs[1].cells[0].rowSpan, 3, '第二行第一个单元格rowspan 3' );
            equal( trs[1].cells[0].colSpan, 2, '第二行第一个单元格colspan 2' );
            equal( trs[0].cells[2].rowSpan, 3, '第一行第三个单元格rowspan 3' );
            equal( trs.length, 4, '4个tr' );
            equal( trs[0].cells.length, 4, '4个td' );
            equal( trs[1].cells.length, 2, '2个td' );
            equal( trs[2].cells.length, 1, '1个td' );
            equal( trs[3].cells.length, 2, '2个td' );
            start();
        },50);
    },50);
    stop();
} );
///*trace 2378*/
//test('不覆盖原来的class',function(){
//    var editor = te.obj[0];
//    editor.setContent('<table class="asdf" border="0" cellspacing="1" cellpadding="3" width="332"><tbody><tr><td></td></tr></tbody></table>');
//    editor.execCommand('source');
//    editor.execCommand('source');
//    var table = editor.body.getElementsByTagName('table');
//    equal($(table).attr('class'),'asdf noBorderTable','table的class');
//});

test( '表格中设置对齐方式', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<table><tbody><tr><td></td><td><p>hello</p></td></tr></tbody></table>' );
    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'cellalignment', {align:'right',vAlign:'top'} );
    equal( tds[0].align, 'right', 'td对齐方式为右上对齐' );
    equal( tds[0].vAlign, 'top', 'td对齐方式为右上对齐' );

    /*不闭合设置对齐方式*/
    range.selectNode( tds[1].firstChild, 0 ).select();
    editor.execCommand( 'cellalignment', {align:'center',vAlign:'middle'} );
    equal( tds[1].align, 'center', 'p对齐方式为居中对齐' );
} );