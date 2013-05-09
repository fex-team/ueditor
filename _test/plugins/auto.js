/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-11-8
 * Time: 下午3:37
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.autosubmit' );

//这个插件是针对非ie的，单测用例同样只针对非ie,仍需手动测试检验ie与非ie下效果是否一致
test( '输入超链接后回车', function() {
    var form = document.body.appendChild( document.createElement( 'form' ) );
    var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','autoFloatEnabled':false});
    editor.render(form);
//    form.body.appendChild(editor);
    editor.focus();
    var range = new baidu.editor.dom.Range( editor.document );
    range.setStart(editor.body.firstChild.firstChild,1).collapse(true).select();
    editor.execCommand('autosubmit');
    equal(editor.textarea.value,'<p>欢迎使用ueditor</p>','');
} );