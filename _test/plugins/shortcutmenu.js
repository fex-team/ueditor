/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 13-6-13
 * Time: 下午12:38
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.contextmenu' );

test( '基本的shortcutmenu', function() {
//设置菜单内容\
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor("ue", { shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]});
    stop();
    editor.ready(function () {
        ua.contextmenu(editor.body);
        setTimeout(function () {
            var menu = document.getElementsByClassName("edui-shortcutmenu")[0];
            equal(!!menu, true, '右键检查菜单是否存在');

            ok(menu.style.display == "" || menu.style.display == "block", '右键检查菜单是否显示');

            ua.mousedown(editor.body.firstChild);

            equal(menu.style.display, "none", '鼠标按下检查菜单是否隐藏');

            UE.delEditor('ue');

            te.dom.push(document.getElementById('ue'));
            te.dom.push(document.getElementById('edui_fixedlayer'));
            start()

        }, 100);
    });
});
test( '键盘操作,隐藏shortcutmenu', function() {
//设置菜单内容\
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor("ue" ,{ shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]});
    stop();
    editor.ready(function () {
        ua.contextmenu(editor.body);
        setTimeout(function(){
            var menu=document.getElementsByClassName("edui-shortcutmenu")[0];
            equal(!!menu,true,'右键检查菜单是否存在');
            ok(menu.style.display==""||menu.style.display=="block",'右键检查菜单是否显示');
            ua.keydown(editor.body.firstChild);
            equal(menu.style.display,"none",'键盘按下检查菜单是否隐藏');
            UE.delEditor('ue');
            te.dom.push(document.getElementById('ue'));
            te.dom.push(document.getElementById('edui_fixedlayer'));
            start()
        },100);
    });
} );
test( '框选内容', function() {
//设置菜单内容\
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor("ue" ,{ shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]});
    stop();
    editor.ready(function () {
        editor.setContent('<p>hello</p>');
        var range = new baidu.editor.dom.Range(editor.document);
        range.setStart(editor.body.firstChild.firstChild,0).setEnd(editor.body.firstChild.firstChild,2).select();
        var sc =editor.selection.getRange().startContainer;
        var ec =editor.selection.getRange().endContainer;
        var so =editor.selection.getRange().startOffset;
        var eo =editor.selection.getRange().endOffset;
        var collapsed =editor.selection.getRange().collapsed;
        ua.contextmenu(editor.body);
        setTimeout(function(){
            var menu=document.getElementsByClassName("edui-shortcutmenu")[0];
            equal(!!menu,true,'右键检查菜单是否存在');
            ok(menu.style.display==""||menu.style.display=="block",'右键检查菜单是否显示');
            ua.checkResult(editor.selection.getRange(), sc, ec, so, eo, collapsed,'检查range不变');
            ua.keydown(editor.body.firstChild);
            UE.delEditor('ue');
            te.dom.push(document.getElementById('ue'));
            te.dom.push(document.getElementById('edui_fixedlayer'));
            start()
        },100);
    });
} );