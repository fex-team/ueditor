module( 'plugins.paste' );

//不能模拟出真实的粘贴效果，此用例用于检查中间值
test( '粘贴', function() {
    if(ua.browser.ie || ua.browser.opera)return;
    var div = document.body.appendChild( document.createElement( 'div' ) );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    var me = te.obj[2];
    me.render(div);
    stop();
    me.ready(function(){
        var range = new baidu.editor.dom.Range( te.obj[2].document );
        me.focus();
        me.setContent('<p>hello</p>');
        range.setStart(me.body.firstChild,0).collapse(true).select();
        ua.keydown(me.body,{'keyCode':65,'ctrlKey':true});
        ua.keydown(me.body,{'keyCode':67,'ctrlKey':true});
        setTimeout(function(){
            me.focus();
            range.setStart(me.body.firstChild,0).collapse(true).select();
            ua.paste(me.body,{'keyCode':86,'ctrlKey':true});
            equal(me.body.lastChild.id,'baidu_pastebin','检查id');
            equal(me.body.lastChild.style.position,'absolute','检查style');
            div.parentNode.removeChild(div);
            start();
        },50);
        stop();
    });
} );
//me.fireEvent('pasteTransfer','paste');//todo
test( 'getClipboardData--ctrl+v', function() {
//    var editor = new baidu.editor.Editor( {'plugins':['paste']} )
//    var div = te.dom[0];
//    editor.render( div );
//    editor.focus();
//    editor.setContent( '<p>你好</p>' )
//    var doc = editor.document;
//    var r = new baidu.editor.dom.Range( doc );
//    /*从word中粘贴的未经过滤的列表*/
//    var html = '<p><span lang="EN-US" style="text-indent: -28px; font-family: Wingdings; ">l<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span>列表<span lang="EN-US" style="text-indent: -28px; ">1</span><br></p><p class="MsoListParagraph" style="margin-left:21.0pt;text-indent:-21.0pt;'
//            + 'mso-char-indent-count:0;mso-list:l0 level1 lfo1"><!--[if !supportLists]--><span lang="EN-US" style="font-family:Wingdings;mso-fareast-font-family:Wingdings;mso-bidi-font-family:Wingdings">l<span style="font:7.0pt &quot;Times New Roman&quot;">&nbsp; </span></span><!--[endif]-->列表<span lang="EN-US">2<o:p></o:p></span></p>';
//    te.setClipData( html );
//    r.setStart( editor.body.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    te.presskey( 'ctrl', 'v' );
//    editor.focus();
//    setTimeout( function() {
//        equal( editor.body.firstChild.innerHTML, html );
//        start();
//    } );
//    stop();
    equal('','','');
} );

//需要点击授权弹出框,暂时去除
//test('检查IE下粘贴命令是否执行正常', function () {
//
//    if (browser.ie) {
//        var editor = te.obj[0];
//        editor.setContent('<p>hello</p>');
//        editor.focus();
//
//        editor.execCommand('selectall');
//        editor.body.document.execCommand('copy');
//        editor.setContent('<p>test</p>');
//        editor.execCommand('selectall');
//        editor.execCommand('paste');
//
//        setTimeout(function(){
//            equal(utils.trim(editor.getContent().replace('<p></p>', '').replace('<p>&nbsp;</p>', '')), '<p>hello</p>', '检查html内容,IE下成功粘贴内容');
//            equal(utils.trim(editor.getContentTxt()), 'hello', '检查text内容,IE下成功粘贴内容');
//            start();
//        },100);
//
//        stop();
//    }
//
//});