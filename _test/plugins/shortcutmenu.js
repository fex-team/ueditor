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
    var editor = UE.getEditor("ue" ,{ shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"]});
    stop();
    editor.ready(function () {
        ua.contextmenu(editor.body);
        setTimeout(function(){
            var menu=document.getElementsByClassName("edui-shortcutmenu")[0];
            equal(!!menu,true,'右键检查菜单是否存在');

            ok(menu.style.display==""||menu.style.display=="block",'右键检查菜单是否显示');

            ua.mousedown(editor.body.firstChild);

            equal(menu.style.display,"none",'鼠标按下检查菜单是否隐藏');

            start()

        },100);
    });
} );