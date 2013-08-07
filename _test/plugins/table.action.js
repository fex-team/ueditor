/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-25
 * Time: 下午4:40
 * To change this template use File | Settings | File Templates.
 */
test( '在第一个单元格里最前面回车,且表格前面没有内容', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );

    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );

    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    ua.keydown(editor.body,{'keyCode':13});
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,ua.browser.ie?'&nbsp;':'<br>','表格前插入空行');
        equal(editor.body.firstChild.tagName.toLowerCase(),'p','表格前插入空行');
        equal(editor.body.childNodes[1].tagName.toLowerCase(),'table','表格在空行后面');
        start();
    },50);
});
test( 'delete 事件', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(4);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    trs[0].cells[0].innerHTML = 'hello';
    trs[1].cells[0].innerHTML = 'hello';
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart(trs[0].cells[0], 0).collapse(true).select();
    ua.keydown(editor.body,{'keyCode':46});
    stop();
    setTimeout(function(){
        ua.manualDeleteFillData(editor.body);
        trs = editor.body.firstChild.getElementsByTagName( 'tr' );
        equal(trs[0].cells[0].innerHTML,ua.browser.ie?'':'<br>','内容');
        equal(trs[1].cells[0].innerHTML,ua.browser.ie?'':'<br>','内容');
        start();
    },20);
});
/*trace 3047,3545*/
test('trace 3047 ,3545 全屏插入表格',function(){
    if(ua.browser.gecko)return;//TODO 1.2.6
    if(ua.browser.ie < 9)return;//TODO 1.2.6
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    var editor = te.obj[2];
    editor.render(div);
    stop();
    editor.ready(function(){
        editor.setContent('<p></p>');
        editor.ui.setFullScreen(!editor.ui.isFullScreen());
        editor.execCommand('inserttable');
        var width1 = editor.body.getElementsByTagName('td')[0].width;
        setTimeout(function () {
            editor.ui.setFullScreen(!editor.ui.isFullScreen());
            setTimeout(function () {
                var width2 = editor.body.getElementsByTagName('td')[0].width;
                ok((width1 - width2) > 10, '页面宽度自适应');
                div.parentNode.removeChild(div);
                start();
            }, 500);
        }, 500);
    });
});

test( 'backspace事件:删除caption', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    expect(5);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('caption').length,0,'删除caption');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },20);
});

test( 'backspace事件:deleterow', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
//    expect(5);                    //TODO 1.2.6
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[0].cells[2]);
    ut.setSelected(cellsRange);
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('tr').length,2,'删除整行');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },20);
});

test( 'backspace事件:deletecol', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
//    expect(5);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[2].cells[0]);
    ut.setSelected(cellsRange);
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout(function(){
        equal(te.obj[0].body.getElementsByTagName('tr')[0].getElementsByTagName('td').length,2,'删除整列');
        equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
        equal(te.obj[0].selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },20);
});

test( 'backspace事件:delcells', function() {
    //TODO
});

test( 'trace 3097 标题行中backspace键', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse( true ).select();
    editor.execCommand( 'inserttitle');
    range.setStart(editor.body.getElementsByTagName('th')[0], 0).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout( function() {
        editor = te.obj[0];
        equal(editor.body.getElementsByTagName('caption').length,1,'不会删除caption');
        equal(editor.body.getElementsByTagName('th').length,3,'不会误删除标题行');
        equal(editor.body.getElementsByTagName('table').length,1,'不会增加表格数量');
        equal(editor.body.getElementsByTagName('tr').length,4,'不会增加表格行数量');
        equal(editor.body.getElementsByTagName('tr')[0].cells.length,3,'不会增加表格列数量');
        equal(editor.selection.getRange().collapsed,true,'检查光标');
        equal(editor.selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('th')[0],'检查光标');
        start();
    },50);
});

test('拖拽',function(){
    //todo ie9,10改range bug trace
    if (browser.ie && browser.version < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable');
    ua.manualDeleteFillData( editor.body );
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[1].width;
    ua.mousemove(tds[1],{clientX:199,clientY:100});
    ua.mousedown(tds[1],{clientX:199,clientY:100});
    setTimeout(function(){
        ua.mousemove(tds[1],{clientX:299,clientY:100});
        ua.mouseup(tds[1],{clientX:299,clientY:100});
        var width2 = tds[1].width;
        ok(width2-width1>50,'拖拽后单元格宽度改变');
        start();
    },20);
    stop();
});

/*trace 3022*/
test( 'trace 3022 表格名称中backspace、ctrl+z、enter', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
//    expect(9);
    editor.addListener('saveScene',function(){
        ok(true);
    });
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    ua.keydown(editor.body,{'keyCode':8});
    stop();
    setTimeout( function() {
        range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
        ua.keydown(editor.body,{'keyCode':90,'ctrlKey':true});
        setTimeout( function() {
            ua.keydown(editor.body,{'keyCode':13});
            equal(te.obj[0].body.getElementsByTagName('caption').length,1,'撤销删除caption');
            equal(te.obj[0].body.getElementsByTagName('th').length,0,'不会误插入标题行');
            equal(te.obj[0].body.getElementsByTagName('table').length,1,'不会增加表格数量');
            equal(te.obj[0].body.getElementsByTagName('tr').length,3,'不会增加表格行数量');
            equal(te.obj[0].body.getElementsByTagName('tr')[0].cells.length,3,'不会增加表格列数量');
            equal(te.obj[0].selection.getRange().collapsed,true,'检查光标');
            if(!ua.browser.gecko)
                equal(te.obj[0].selection.getRange().startContainer.parentNode,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
            start();
        },20);
    },20);
});


/*trace 3067*/
test( 'trace 3067 向右合并--tab键', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:2,numRows:2} );
    ua.manualDeleteFillData( editor.body );

    var tds = editor.body.getElementsByTagName( 'td' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    editor.execCommand( 'mergeright' );
    range.setStart( tds[0], 0 ).collapse( true ).select();
    range = editor.selection.getRange();
    var common = range.getCommonAncestor(true, true);
    equal(common.colSpan,2,'tab键前光标位于合并后的单元格中');
    ua.keydown(editor.body,{'keyCode':9});
    setTimeout(function(){
        range = editor.selection.getRange();
        common = range.getCommonAncestor(true, true);
        equal(common.colSpan,1,'tab键前光标跳到合并后单元格的下一个单元格中');
        start();
    },20);
    stop();
} );

/*trace 3100*/
test( 'trace 3100 表格名称中tab键', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable', {numCols:3,numRows:3} );
    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );
    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
    editor.execCommand( 'insertcaption');
    range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':9});
    stop();
    setTimeout( function() {
        editor = te.obj[0];
        equal(editor.body.getElementsByTagName('caption').length,1,'不会删除caption');
        equal(editor.body.getElementsByTagName('th').length,0,'不会误插入标题行');
        equal(editor.body.getElementsByTagName('table').length,1,'不会增加表格数量');
        equal(editor.body.getElementsByTagName('tr').length,3,'不会增加表格行数量');
        equal(editor.body.getElementsByTagName('tr')[0].cells.length,3,'不会增加表格列数量');
        equal(editor.selection.getRange().collapsed,true,'检查光标');
        if(!ua.browser.ie) //ie8下会导致堆栈溢出，奇葩的bug，以后不溢出再检查ie8
            equal(editor.selection.getRange().startContainer,te.obj[0].body.getElementsByTagName('td')[0],'检查光标');
        start();
    },50);
});

/*trace 3059*/
test('trace 3059 表格右浮动',function(){
    if(ua.browser.ie)return;//TODO 1.2.6
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable');
    ua.manualDeleteFillData( editor.body );
    var tds = te.obj[0].body.getElementsByTagName('td');
    var oldWidth = tds[0].offsetWidth;
    ua.mousemove(tds[0],{clientX: 105,clientY:20});
    ua.mousedown(tds[0],{clientX: 105,clientY:20});
    ua.mouseup(tds[0],{clientX: 105,clientY:20});
    setTimeout(function(){

        ua.mousedown(tds[0],{clientX: 105,clientY:20});
        ua.mouseup(tds[0],{clientX: 105,clientY:20});

        setTimeout(function(){
            tds = editor.body.firstChild.getElementsByTagName( 'td' );
            ok(tds[0].offsetWidth<oldWidth, '第一列宽度变小' );
            range.setStart( tds[0], 0 ).collapse( true ).select();
            editor.execCommand( 'tablealignment', 'right');
            var table = te.obj[0].body.getElementsByTagName('table')[0];
            equal( table.align, 'right', '表格右浮动' );

            start();

        },50);

    }, 50);

    stop();

});

test('trace 3378：拖拽后tab，不影响表格样式',function(){
    //todo ie9,10改range bug trace
    if (browser.ie && browser.version < 8) return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p></p>' );
    range.setStart( editor.body.firstChild, 0 ).collapse( true ).select();
    editor.execCommand( 'inserttable');
    ua.manualDeleteFillData( editor.body );
    var tds = te.obj[0].body.getElementsByTagName('td');
    var width1 = tds[1].width;
    ua.mousemove(tds[1],{clientX:199,clientY:100});
    ua.mousedown(tds[1],{clientX:199,clientY:100});
    setTimeout(function(){
        ua.mousemove(tds[1],{clientX:299,clientY:100});
        ua.mouseup(tds[1],{clientX:299,clientY:100});
        var width2 = tds[1].width;
        ok(width2-width1>50,'拖拽后单元格宽度改变');
        range.setStart( tds[24], 0 ).collapse( true ).select();
        ua.keydown(editor.body,{'keyCode':9});
        setTimeout(function(){
            equal(tds[1].width,width2,'tab键不影响单元格宽度');
            start();
        },20);
    },20);
    stop();
});

//超时，暂时注掉
test('表格粘贴',function(){
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');                              /*插入表格*/
    var tds = editor.body.getElementsByTagName('td');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0],tds[24]);
    ut.setSelected(cellsRange);                                     /*确定选区*/
    range.setStart( tds[0], 0 ).collapse( true ).select();          /*定光标*/
    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});       /*ctrl+c*/
    var html ={html:editor.body.innerHTML};
    range.setStart(editor.body.lastChild,0).collapse(true).select();
    equal(editor.body.getElementsByTagName('table').length,'1','触发粘贴事件前有1个table');
    editor.fireEvent('beforepaste',html);                           /*粘贴*/
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length,'2','触发粘贴事件后有2个table');
});
//
//test('trace 3104 粘贴后合并单元格',function(){
//    var div = document.body.appendChild(document.createElement('div'));
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent('');
//    editor.execCommand('inserttable');
//    var trs = editor.body.getElementsByTagName('tr');
//    var ut = editor.getUETable(editor.body.firstChild);
//    var cellsRange = ut.getCellsRange(trs[0].cells[0],trs[4].cells[0]);
//    ut.setSelected(cellsRange);
//    range.setStart( trs[0].cells[0], 0 ).collapse( true ).select();
//    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});
//    ut.clearSelected();
//    var html ={html:editor.body.innerHTML};
//    range.setStart(editor.body.lastChild,0).collapse(true).select();
//    editor.fireEvent('beforepaste',html);
//    editor.fireEvent("afterpaste");
//    var table = editor.body.getElementsByTagName('table');
//    equal(table.length,'2','触发粘贴事件后有2个table');
//    equal(table[1].firstChild.childNodes.length,'5','5行');
//    equal(table[1].firstChild.firstChild.childNodes.length,'1','1列');
//
//    var tds = editor.body.getElementsByTagName('td');
//    ut = editor.getUETable(editor.body.firstChild.nextSibling);
//    cellsRange = ut.getCellsRange(tds[25],tds[29]);
//    ut.setSelected(cellsRange);
//    range.setStart(tds[25], 0 ).collapse( true ).select();
//    editor.execCommand('mergecells');
//    table = editor.body.getElementsByTagName('table');
//    equal(table[1].firstChild.childNodes.length,'1','1行');
//    equal(table[1].firstChild.firstChild.childNodes.length,'1','1列');
//});
//
test('trace 3105 在表格名称中粘贴',function(){
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable',{numCols:2,numRows:2});
    range.setStart(editor.body.getElementsByTagName('td')[0],0).collapse(true).select();
    editor.execCommand('insertcaption');
    var str = ua.getChildHTML(editor.body);
    var ut = editor.getUETable(editor.body.firstChild);
    var tds = editor.body.getElementsByTagName('td');
    var cellsRange = ut.getCellsRange(tds[0],tds[1]);
    ut.setSelected(cellsRange);
    range.setStart( tds[0], 0 ).collapse( true ).select();

    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});
    var html ={html:editor.body.innerHTML};
    range.setStart(editor.body.getElementsByTagName('caption')[0],0).collapse(true).select();
    editor.fireEvent('beforepaste',html);
    editor.fireEvent("afterpaste");
    ut.clearSelected();
    equal(editor.body.getElementsByTagName('table').length,'1','触发粘贴事件后有1个table');
    equal(ua.getChildHTML(editor.body),str,'粘贴无效');
});

test('trace 3106 粘贴标题行',function(){
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    range.setStart(tds[0],0).collapse(true).select();
    editor.execCommand('inserttitle');
    var ut = editor.getUETable(editor.body.firstChild);
    var ths = editor.body.getElementsByTagName('th');
    var cellsRange = ut.getCellsRange(ths[0],ths[4]);
    ut.setSelected(cellsRange);
    range.setStart( ths[0], 0 ).collapse( true ).select();

    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});
    var html ={html:editor.body.innerHTML};
    range.setStart(editor.body.lastChild,0).collapse(true).select();
    editor.fireEvent('beforepaste',html);
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length,'2','触发粘贴事件后有2个table');
    if(ua.browser.gecko){
        //这个比较没意义
//        equal(editor.body.firstChild.firstChild.firstChild.firstChild.tagName.toLowerCase(),'td','不是th，是td');
        range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild, 0 ).collapse( true ).select();
        equal( editor.queryCommandState( 'inserttable' ), -1, '应当不可以插入表格' );
        equal( editor.queryCommandState( 'mergeright' ), 0, '应当可以右合并单元格' );
    }
    else{
//        equal(editor.body.firstChild.nextSibling.firstChild.firstChild.firstChild.tagName.toLowerCase(),'td','不是th，是td');
        range.setStart(editor.body.firstChild.nextSibling.firstChild.firstChild.firstChild, 0 ).collapse( true ).select();
        equal( editor.queryCommandState( 'inserttable' ), -1, '应当不可以插入表格' );
        equal( editor.queryCommandState( 'mergeright' ), 0, '应当可以右合并单元格' );
    }
});

test('trace 3114 在单元格内粘贴行',function(){
    var div = document.body.appendChild(document.createElement('div'));
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    var ut = editor.getUETable(editor.body.firstChild);
    var cellsRange = ut.getCellsRange(tds[0],tds[9]);
    ut.setSelected(cellsRange);
    range.setStart( tds[0], 0 ).collapse( true ).select();
    ua.keydown(editor.body,{'keyCode':67,'ctrlKey':true});
    var html ={html:editor.body.innerHTML};
    range.setStart(tds[0],0).collapse(true).select();
    editor.fireEvent('beforepaste',html);
    editor.fireEvent("afterpaste");
    equal(editor.body.getElementsByTagName('table').length,'1','触发粘贴事件后有1个table');
    stop();
    setTimeout(function() {
        editor.execCommand('source');
        setTimeout(function() {
            editor.execCommand('source');
            equal(editor.body.getElementsByTagName('tr').length,'7','触发粘贴事件后有7个tr');
            start();
        },50);
    },50);
});