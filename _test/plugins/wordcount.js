module( 'plugins.wordcount' );

test( 'trace 1743 右键删除后计算字数', function () {
    var html = '          \t  \n    \b  \t  \n \b  \b\ufeff\u200B  <h1>   \t\n\b\t\n\b\b    ueditor编辑器完整功能     \ufeff\u200B\t\t\n\n   </h1>   \t\n\b\t    \n    ' +
        '\b    \b<h2 style="display: block">\t\n\b\t\n\b\b<a href="http://ueditor.baidu.com">    \t  \n  \b \t  \n  \b  \b' +
        '<img style="margin-left: 10px; margin-right: 10px; float: left;border: 0px" src="../../../themes/default/images/logo.png" />\ufeff\u200B\t\t\n\n\t\n\b\t\n\b\b</a>欢迎使用UEditor编辑器\t\n\b\t\n\b\b</h2>' +
        '<p style="font-size: 14px">      \t\n   ' +
        '我们的目标：提供轻巧的，稳定的，易用的，高效的编辑器。</p><p style="font-size: 14px">优点：</p><table cellpadding="0" cellspacing="0" width="500" height="40" bordercolor="#ffa900" border="1" style="background-color: rgb(217, 255, 224); "><tbody><tr style="text-align: left; "><td width="250" class="" rowspan="1" colspan="2">我们的qq群是<br /></td> <td width="250" class="" rowspan="1" colspan="1" style="display: none; " rootrowindex="0" rootcellindex="0"><br></td></tr><tr style="text-align: left; "><td width="250" class="">①群132714357(满)<br /></td><td width="250" class="">②群166914291\ufeff\u200B</td></tr> </tbody></table>    \n\n<p style="font-size: 14px">希望大家多多提意见\ufeff\u200B    <br />     \ufeff\u200B</p>\ufeff\u200B\t\t\n\n    ';
    var editor = new baidu.editor.Editor( {'initialContent':html, 'UEDITOR_HOME_URL':'../../../','wordCount':true,'autoFloatEnabled':false} );
    stop();
    setTimeout(function(){
        var div = document.body.appendChild( document.createElement( 'div' ) );
        editor.render( div );
        editor.focus();
        editor.execCommand( 'selectall' );
        editor.execCommand( 'delete' );
        ok( editor.queryCommandValue( 'wordcount' ).indexOf( '已输入0个字符' ), '清空后编辑器中没有字符' );
        te.dom.push( div );
        start();
    },50);
} );


test( '空格', function () {
    var html = '           \ufeff\u200B\t\t    \n\n\t\n\b\t\n\b\u200B\t\t\n\n    ';
    var editor = new baidu.editor.Editor( {'initialContent':html, 'UEDITOR_HOME_URL':'../../../','wordCount':true,'maximumWords':100,'autoFloatEnabled':false,'lang':'zh-cn'} );
    stop();
    setTimeout(function(){
        var div = document.body.appendChild( document.createElement( 'div' ) );
        editor.render( div );
        if(ua.browser.ie!=6)
            ok( editor.queryCommandValue( 'wordcount' ).indexOf( '已输入22个字符' )!=-1, '清空后编辑器中22个空格' );
//        else
//            ok( editor.queryCommandValue( 'wordcount' ).indexOf( '已输入22个字符' )!=-1, '清空后编辑器中22个空格' );
        te.dom.push( div );
        start();
    },50);
} );

test('超出最大',function(){
    var html = 'hello hello hello';
    var editor = new baidu.editor.Editor( {'UEDITOR_HOME_URL':'../../../','wordCount':true,'maximumWords':10,'autoFloatEnabled':false,'lang':'zh-cn'} );
    stop();
    setTimeout(function(){
        var div = document.body.appendChild( document.createElement( 'div' ) );
        editor.render( div );
        editor.setContent(html);
        ok( editor.queryCommandValue('wordcount').indexOf('字数超出最大')!=-1, '超出最大' );
        equal( editor.queryCommandValue('wordcount',true),'17', '仅统计字数' );
        te.dom.push( div );
        start();
    },50);
});
