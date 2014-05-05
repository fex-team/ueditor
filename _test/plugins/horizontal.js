module( "plugins.horizontal" );
//normal
test( 'horizontal', function() {
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    var db = editor.body;

    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    setTimeout(function(){
        range.setStart( d.getElementsByTagName( 'em' )[0].firstChild, 0 ).setEnd( db.lastChild.firstChild, 5 ).select();
        equal( editor.queryCommandState( "horizontal" ), 0, "边界不在table里" );
        editor.execCommand( 'horizontal' );
        var spase = ua.browser.ie?'':'<br>';
        equal( ua.getChildHTML( db ), "<p><strong><em></em></strong></p><hr><p>m"+spase+"</p>", "边界不在table里" );
        start();
    },50);
    stop();
} );
test( 'horizontal_br', function() {//trace 3854
    var div = document.body.appendChild(document.createElement('div'));
    $(div).css('width', '500px').css('height', '500px').css('border', '1px solid #ccc');
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>', 'autoFloatEnabled':false,enterTag:'br'});

    editor.render(div);
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent( '<ol><li><p>top</p></li></ol>' );
        range.setStart( editor.body.firstChild.firstChild, 1 ).collapse( true ).select();
        editor.execCommand( 'horizontal' );
        range = editor.selection.getRange();
        var containger = (ua.browser.ie&&ua.browser.ie<9)?editor.body.getElementsByTagName('li')[0]:editor.body.getElementsByTagName('hr')[0].nextSibling;
        var offset = (ua.browser.webkit||ua.browser.ie==11)?1:((ua.browser.ie&&ua.browser.ie<9)?3:0);
        if(!ua.browser.opera){
            ua.checkResult( range,containger,containger, offset, offset, true, 'check range' );
        }
        ua.manualDeleteFillData(editor.body);
        equal( ua.getChildHTML( editor.body.firstChild ), "<li><p>top</p><hr><br></li>", "在列表中插入分隔线，在分隔线后面添加p用于定位" );
        setTimeout(function(){
            te.dom.push(div);
            start();
        },50);
    });
    stop();
} );
test( 'horizontal-delkeydown', function() {
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    var db = editor.body;
    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    setTimeout(function(){
        range.setStart( d.getElementsByTagName( 'em' )[0].firstChild, 0 ).setEnd( db.lastChild.firstChild, 5 ).select();
        editor.execCommand( 'horizontal' );
        setTimeout(function(){
            range.setStart( editor.body.lastChild, 0 ).collapse(true).select();
            editor.fireEvent('delkeydown',{});
            var spase = ua.browser.ie?'':'<br>';
            equal( ua.getChildHTML( db ), "<p><strong><em></em></strong></p><p>m"+spase+"</p>", "删除分隔符" );
            start();
        },50);
    },50);
    stop();
} );

test( '在列表中插入分隔线，回车符为p', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent( '<ol><li><p>top</p></li></ol>' );
    range.setStart( body.firstChild.firstChild, 1 ).collapse( true ).select();
    editor.execCommand( 'horizontal' );
    range = editor.selection.getRange();
    var p = body.firstChild.firstChild.lastChild;

    var offset = ((ua.browser.ie&&ua.browser.ie>8&&ua.browser.ie<11)||ua.browser.gecko)?0:1;
    if(!ua.browser.opera){
        ua.checkResult( range, p.firstChild, p.firstChild, offset, offset, true, 'check range' );
    }
    ua.manualDeleteFillData(editor.body);
    equal( ua.getChildHTML( body.firstChild ), "<li><p>top</p><hr><p></p></li>", "在列表中插入分隔线，在分隔线后面添加p用于定位" );

} );

//test( '在列表中插入分隔线，回车符为br', function() {
//
//    var editor = new baidu.editor.Editor({'enterTag':'br'});
//    var div = document.body.appendChild(document.createElement('div'));
//    editor.render(div);
//    var range = new baidu.editor.dom.Range(editor.document);
//    var body = editor.body;
//    editor.setContent( '<ol><li>top</li></ol>' );
//    range.setStart( body.firstChild.firstChild, 1 ).collapse( true ).select();
//
//    editor.execCommand( 'horizontal' );
//
//    var li = body.firstChild.firstChild;
//    if ( !baidu.editor.browser.gecko ) {
//        equal( ua.getChildHTML( body ), "<ol><li><p>top</p><hr><br></li></ol>", "在列表中插入分隔线，在分隔线后面添加p用于定位" );
//    } else {
//        equal( ua.getChildHTML( body ), "<ol><li><p>top</p><hr></li></ol>", "ff在列表中插入分隔线" );
//    }
//    te.dom.push(div);
//} );

//table
test( 'horizontal in table', function() {
    var editor = te.obj[0];
    var d = editor.document;
    var range = te.obj[1];
    editor.setContent( '<table><tr><td>1</td></tr><tr><td>2</td></tr></table>' );
    stop();
    setTimeout(function () {
        range.setStart(d.getElementsByTagName('tr')[0].firstChild, 0).setEnd(d.getElementsByTagName('tr')[1].firstChild, 0).select();
        equal(editor.queryCommandState("horizontal"), -1, "边界在table里");
        start();
    }, 50);
} );
//collapsed=true
test( 'horizontal&&collapsed', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var db = editor.body;
    editor.setContent( '<b><i>top</i></b><p>bottom</p>' );
    range.setStart( db.lastChild.firstChild, 0 ).collapse( true ).select();
    equal( editor.queryCommandState( "horizontal" ), 0, "边界不在table里" );
    editor.execCommand( 'horizontal' );
    var spase = ua.browser.ie?'':'<br>';
    equal( ua.getChildHTML( db ), "<p><strong><em>top</em></strong></p><hr><p>bottom"+spase+"</p>", "边界不在table里" );
} );
//TODO 1.2.6
//test( 'trace 3338：horizontal&&enterTag', function() {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.options.enterTag ='br';
//    editor.setContent( '<ol><li>top</li></ol>' );
//    range.setStartAfter(editor.body.firstChild.firstChild.firstChild).collapse( true ).select();
//    editor.execCommand('horizontal');
//    ua.manualDeleteFillData(editor.body);
//    var br = (ua.browser.ie && ua.browser.ie<9) || ua.browser.webkit?"<br>":"";
//    equal(ua.getChildHTML(editor.body), '<ol><li><p>top</p><hr>'+br+'</li></ol>', 'enterTag=br');
//} );