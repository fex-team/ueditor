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
    ua.contextmenu(editor.body);
    var lang = editor.getLang( "contextMenu" );
    equal(document.getElementsByClassName("edui-menu-body").length,3,'默认3个menu,一个主的，一个段落格式，一个表格');
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    equal(menuBody.parentNode.parentNode.parentNode.style.display,'','第一个menu显示');
    equal(menuBody.childNodes.length,12,'第一个menu9个items3个分隔线');
//    var space = browser.webkit||ua.browser.ie==9?"\n":'';
    var innerText = lang['selectall']+lang.cleardoc+lang.paragraph+lang.table+lang.insertparagraphbefore+lang.insertparagraphafter+lang['copy']+lang['paste']+lang.highlightcode;
    if(browser.gecko){
        equal(menuBody.textContent,innerText,'检查menu显示的字符');
    }
    else{
        equal(menuBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
    }
    ok(menuBody.childNodes[0].className.indexOf("edui-for-selectall")>-1,'检查menu样式');
    var menuparagraphBody = document.getElementsByClassName("edui-menu-body")[1];       //段落格式document.getElementsByClassName("edui-menu-body")[1]
    equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'none','第二个menu隐藏');
    var menutableBody = document.getElementsByClassName("edui-menu-body")[2];           //表格(subItem只有插入表格)document.getElementsByClassName("edui-menu-body")[2]
    if(ua.browser.ie){
        ua.mouseenter(menuBody.childNodes[3]);
    }    else{
        ua.mouseover(menuBody.childNodes[3]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'','显示submenu,检查submenu的display值:""');
        equal(menuparagraphBody.childNodes.length,4,'检查submenu的menuitems数量');
        equal(menutableBody.parentNode.parentNode.parentNode.style.display,'none','显示table submenu,检查submenu的display值:""');
        equal(menutableBody.childNodes.length,1,'只有插入表格选项');
        innerText = lang["justifyleft" ]+lang["justifyright" ]+lang["justifycenter" ]+lang[ "justifyjustify" ];
        if(browser.gecko){
            equal(menuparagraphBody.textContent,innerText,'检查menu显示的字符');
            equal(menutableBody.textContent,lang["inserttable" ],'检查table menu显示的字符');
        }
        else{
            equal(menuparagraphBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
            equal(menutableBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),lang["inserttable" ],'检查table menu显示的字符');
        }
        ua.click(menuparagraphBody.childNodes[1]);
        equal(editor.body.firstChild.style.textAlign,'right','文本右对齐');
        start();
    }, 300);
    stop();
} );

test( '表格右键菜单', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var lang = editor.getLang( "contextMenu" );
    editor.setContent('<table width="100%" border="1" bordercolor="#000000"><tbody><tr><td style="width:50%;"><br /></td><td style="width:50%;"><br /></td></tr><tr><td style="width:50%;"></td><td style="width:50%;"><br /></td></tr></tbody></table>');
    range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    equal(document.getElementsByClassName("edui-menu-body").length,8,'获得edui-menu-body名称的class个数8');
    var menuBody = document.getElementsByClassName("edui-menu-body")[3];
    equal(menuBody.childNodes.length,14,'第一个menu12个items2个分隔线');
    var innerText = lang.selectall+lang.cleardoc+lang.table+"表格排序"+"边框底纹"+lang.aligntd+lang.aligntable+lang.insertparagraphbefore+lang.insertparagraphafter+lang['copy']+lang['paste']+lang.highlightcode;
    if(browser.gecko){
        equal(menuBody.textContent,innerText,'检查menu显示的字符');
    }
    else{
        equal(menuBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
    }

    var menutableBody = document.getElementsByClassName("edui-menu-body")[4];       //表格document.getElementsByClassName("edui-menu-body")[4]
    var forTable = document.getElementsByClassName('edui-for-table');
    if(ua.browser.ie){
        ua.mouseenter(forTable[forTable.length-1]);
    }    else{
        ua.mouseover(forTable[forTable.length-1]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menutableBody.parentNode.parentNode.parentNode.style.display,'','显示submenu,检查submenu的display值:""');
        equal(menutableBody.childNodes.length,15,'11个items4个分隔线');
//        var space = browser.webkit||ua.browser.ie==9?"\n":'';
        var innerText = lang.deletetable+lang.insertcol+lang.insertcolnext+lang.insertrow+lang.insertrownext+lang.insertcaption+lang.inserttitle+lang.mergeright+lang.mergedown+lang.edittd+lang.edittable;
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