module( 'plugins.time' );

test( '插入时间和日期', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<p><br></p>' );
    range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
    var date = new Date();
    var h = date.getHours();
    h = (h < 10) ? ('0' + h) : h;
    var min = date.getMinutes();
    min = (min < 10) ? ('0' + min) : min;
    var sec = date.getSeconds();
    sec = (sec < 10) ? ('0' + sec) : sec;
    editor.execCommand( 'time' );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( body.firstChild ), h + ':' + min + ':' + sec);
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'time','hh.ii.ss' );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( body.firstChild ), h + '.' + min + '.' + sec);

    range.selectNode( body.firstChild.firstChild ).select();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10) ? ('0' + month) : month;
    var date = date.getDate();
    date = (date < 10) ? ('0' + date) : date;
    editor.execCommand( 'date' );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( body.firstChild ), year + '-' + month + '-' + date);
    range.selectNode( body.firstChild.firstChild ).select();
    editor.execCommand( 'date','yyyy/mm/dd' );
    ua.manualDeleteFillData( editor.body );
    equal( ua.getChildHTML( body.firstChild ), year + '/' + month + '/' + date);
} );

test( '表格插入时间和日期', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var br = UE.browser.ie ? "" : "<br>";
    editor.setContent( '<table><tbody><tr><td></td><td></td><td></td><td></td></tr></tbody></table>' );
    var td = body.firstChild.getElementsByTagName( 'td' );
    range.setStart( td[0], 0 ).collapse( 1 ).select();
    var date = new Date();
    var h = date.getHours();
    h = (h < 10) ? ('0' + h) : h;
    var min = date.getMinutes();
    min = (min < 10) ? ('0' + min) : min;
    var sec = date.getSeconds();
    sec = (sec < 10) ? ('0' + sec) : sec;
    editor.execCommand( 'time' );
    ua.manualDeleteFillData(td[0]);
    debugger
    equal( td[0].innerHTML, h + ':' + min + ':' + sec+(ua.browser.ie==9||ua.browser.ie==10?' ':''));
    range.setStart( td[1], 0 ).collapse( 1 ).select();
    editor.execCommand( 'time','hh.ii.ss' );
    ua.manualDeleteFillData(td[1]);
    equal( td[1].innerHTML, h + '.' + min + '.' + sec+(ua.browser.ie==9||ua.browser.ie==10?' ':''));
    /*选中一段内容插入日期*/
    range.setStart( td[2], 0 ).collapse( 1 ).select();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10) ? ('0' + month) : month;
    date = date.getDate();
    date = (date < 10) ? ('0' + date) : date;
    editor.execCommand( 'date' );
    ua.manualDeleteFillData(td[2]);
    equal( td[2].innerHTML,  year + '-' + month + '-' + date+(ua.browser.ie==9||ua.browser.ie==10?' ':''));
    range.setStart( td[3], 0 ).collapse( 1 ).select();
    editor.execCommand( 'date','yyyy/mm/dd' );
    ua.manualDeleteFillData(td[3]);
    equal( td[3].innerHTML,  year + '/' + month + '/' + date+(ua.browser.ie==9||ua.browser.ie==10?' ':''));
} );