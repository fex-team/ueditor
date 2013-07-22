/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午1:24
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.button' );

test( 'Button', function () {
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var Button = new te.obj[0].Button( {title:'testButton', label:'test',editor:te.obj[0].Editor()} );
    div.innerHTML = Button.renderHtml();
    var testButton = div.getElementsByTagName( 'div' )[3];
    equal( testButton.attributes['title'].nodeValue, 'testButton', '检查Button的title ' );
} );

test( "工具栏国际化", function () {
    var div = document.createElement( "div" );
    div.id = "editor1";
    div.style.cssText = "width:1px;height:1px;";
    document.body.appendChild( div );
    var editor = top.ueditor = new baidu.editor.ui.Editor( {
        lang:"en"
    } );
    editor.render( "editor1" );
    stop();
    editor.ready(function () {
        var uiItems = editor.ui.toolbars[0].items, flag, paragraph, op;
        for ( var i = 0, ci; ci = uiItems[i++]; ) {
            op = ci.className.split( "-" )[2];
            if ( op == "paragraph" ) {
                var items = ci.items, flag1;
                for ( var j = 0, cj; cj = items[j++]; ) {
                    if ( cj.label != editor.getLang( "paragraph." + cj.value ) ) {
                        flag1 = true;
                        break;
                    }
                }
                ok( !flag1, "段落下拉列表是否符合预期" )
            }
            if ( ci.title !== editor.getLang( "labelMap." + op ) ) {
                flag = true;
                break;
            }
        }
        ok( !flag, "工具按钮Tip是否符合预期" );
        setTimeout( function () {
//            editor.destroy();
            div.parentNode.removeChild(div);
            start();
        }, 100 );
    } )
} );


test( "Dialog国际化", function () {
    var editor = te.obj[0].Editor();
    editor.render( "editor" );
    stop();
    editor.ready( function () {
        editor.setContent( "<span>xx</span><p>xxx</p>" );
        var doc = editor.document,
            range = new baidu.editor.dom.Range( doc ),
            p = doc.getElementsByTagName( 'p' )[1];
        range.setStart( p, 0 ).setEnd( p, 1 ).select();
        var r = editor.selection.getRange();
        var dom = $( '#'+document.getElementsByClassName("edui-for-insertimage")[0].id+'_body' )[0];
        ua.click( dom );
        setTimeout(function(){
            var dialog = editor.ui._dialogs['insertimageDialog'];
            ok(dialog.title===editor.getLang("labelMap.insertimage"),"dialog的标题是否一致");
            ok(dialog.closeDialog === editor.getLang("closeDialog"),"关闭dialog的title是否一致");
            ok(dialog.buttons[0].label === editor.getLang("ok") && dialog.buttons[1].label === editor.getLang("cancel"),"确认取消按钮是否一致");
            setTimeout( function () {
                var dialogDoc = document.getElementById(dialog.id + "_iframe").contentWindow.document;
                var ids = editor.getLang("insertimage.static");
                for(var i in ids){
                    if(i==="imgSearchTxt"){
                        equal(dialogDoc.getElementById(i).value,ids[i].value,"图片搜索文字是否一致")
                    }
                    if(i==="imgSearchBtn"){
                        equal(dialogDoc.getElementById(i).value,ids[i].value,"图片搜索按钮文字是否一致")
                    }
                }
                ua.click(document.getElementById(dialog.closeButton.id+"_body"));
                var newRange = editor.selection.getRange();
                ok( r.startContainer === newRange.startContainer, "dialog开闭前后选区是否一致" );
                start();
            }, 1500 )
        },100);

    } )
} );