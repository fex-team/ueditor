/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-19
 * Time: 下午4:19
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.contextmenu' );
test( '基本右键菜单', function() {
    var editor = te.obj[0];
//触发右键的方法
//    var event = document.createEvent("MouseEvents");
//    event.initMouseEvent('contextmenu', true, true, false,
//        0, 0, 0, 0, 0, false, false, false, false, 0, null);
//editor.body.dispatchEvent( event );
    ua.contextmenu(editor.body);
    var lang = editor.getLang( "contextMenu" );
    equal(document.getElementsByClassName("edui-menu-body").length,3,'默认3个menu,一个主的，一个段落格式，一个表格');
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    equal(menuBody.parentNode.parentNode.parentNode.style.display,'','第一个menu显示');
    equal(menuBody.childNodes.length,10,'第一个menu9个items');
//    var space = browser.webkit||ua.browser.ie==9?"\n":'';
    var innerText = lang['selectall']+lang.cleardoc+lang.paragraph+lang.table+lang['copy']+lang['paste']+lang.highlightcode;
    if(browser.gecko){
        equal(menuBody.textContent,innerText,'检查menu显示的字符');
    }
    else{
        equal(menuBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
    }
    ok(menuBody.childNodes[0].className.indexOf("edui-for-selectall")>-1,'检查menu样式');
    var menuparagraphBody = document.getElementsByClassName("edui-menu-body")[1];
    equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'none','第二个menu隐藏');
    if(ua.browser.ie){
        ua.mouseenter(menuBody.childNodes[3]);
    }    else{
        ua.mouseover(menuBody.childNodes[3]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'','显示submenu,检查submenu的display值:""');
        equal(menuparagraphBody.childNodes.length,4,'检查submenu的menuitems数量');
        innerText = lang["justifyleft" ]+lang["justifyright" ]+lang["justifycenter" ]+lang[ "justifyjustify" ];
        if(browser.gecko){
            equal(menuparagraphBody.textContent,innerText,'检查menu显示的字符');
        }
        else{
            equal(menuparagraphBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
        }
        ua.click(menuparagraphBody.childNodes[1]);
        equal(editor.body.firstChild.style.textAlign,'right','文本右对齐');
        start();
    }, 300);
    stop();
} );
test( '表格右键菜单', function() {
    var editor = te.obj[0];
    var lang = editor.getLang( "contextMenu" );
    editor.setContent('<table width="100%" border="1" bordercolor="#000000"><tbody><tr><td style="width:50%;"><br /></td><td style="width:50%;"><br /></td></tr><tr><td style="width:50%;"></td><td style="width:50%;"><br /></td></tr></tbody></table>');
    ua.contextmenu(editor.body.firstChild);
    var menutableBody = document.getElementsByClassName("edui-menu-body")[document.getElementsByClassName("edui-menu-body").length-1];
    var forTable = document.getElementsByClassName('edui-for-table');
    if(ua.browser.ie){
        ua.mouseenter(forTable[forTable.length-1]);
    }    else{
        ua.mouseover(forTable[forTable.length-1]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menutableBody.parentNode.parentNode.parentNode.style.display,'','显示submenu,检查submenu的display值:""');
        equal(menutableBody.childNodes.length,8,'检查submenu的menuitems数量');
//        var space = browser.webkit||ua.browser.ie==9?"\n":'';
        var innerText = lang["deletetable" ]+lang["insertparagraphbeforetable" ]+lang["deleterow" ]+lang["deletecol" ]+lang["insertrow" ]+lang["insertcol" ]+lang[ "mergeright" ]+lang[ "mergedown" ];
        if(browser.gecko){
            equal(menutableBody.textContent,innerText,'检查menu显示的字符');
        }
        else{
            equal(menutableBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
        }
        ua.click(menutableBody.childNodes[0]);
        equal(editor.body.getElementsByTagName('table').length,0,'删除表格');
        start();
    }, 300);
    stop();
} );