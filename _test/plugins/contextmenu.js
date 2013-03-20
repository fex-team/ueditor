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
    var menuparagraphBody = document.getElementsByClassName("edui-menu-body")[1];
    equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'none','第二个menu隐藏');
    var menutableBody = document.getElementsByClassName("edui-menu-body")[2];
    if(ua.browser.ie){
        ua.mouseenter(menuBody.childNodes[3]);
    }    else{
        ua.mouseover(menuBody.childNodes[3]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display,'none','显示submenu,检查submenu的display值:""');
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
        setTimeout(function(){
            var menuDiv = document.getElementById("edui_fixedlayer");
            menuDiv.parentNode.removeChild(menuDiv);
            start();
        },200);
    }, 200);
    stop();
} );

test( '表格右键菜单', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var lang = editor.getLang( "contextMenu" );
    editor.setContent('<table width="100%" border="1" bordercolor="#000000"><tbody><tr><td style="width:50%;"><br /></td><td style="width:50%;"><br /></td></tr><tr><td style="width:50%;"></td><td style="width:50%;"><br /></td></tr></tbody></table>');
    range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    equal(document.getElementsByClassName("edui-menu-body").length,5,'获得edui-menu-body名称的class个数5');
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    equal(menuBody.childNodes.length,14,'第一个menu12个items2个分隔线');
    var innerText = lang.selectall+lang.cleardoc+lang.table+"表格排序"+"边框底纹"+lang.aligntd+lang.aligntable+lang.insertparagraphbefore+lang.insertparagraphafter+lang['copy']+lang['paste']+lang.highlightcode;
    if(browser.gecko){
        equal(menuBody.textContent,innerText,'检查menu显示的字符');
    }
    else{
        equal(menuBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
    }

    var menutableBody = document.getElementsByClassName("edui-menu-body")[1];
    var forTable = document.getElementsByClassName('edui-for-table');
    if(ua.browser.ie){
        ua.mouseenter(forTable[forTable.length-1]);
    }    else{
        ua.mouseover(forTable[forTable.length-1]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        equal(menutableBody.parentNode.parentNode.parentNode.style.display,'none','显示submenu,检查submenu的display值:""');
        equal(menutableBody.childNodes.length,15,'11个items4个分隔线');
        var innerText = lang.deletetable+lang.insertcol+lang.insertcolnext+lang.insertrow+lang.insertrownext+lang.insertcaption+lang.inserttitle+lang.mergeright+lang.mergedown+lang.edittd+lang.edittable;
        if(browser.gecko){
            equal(menutableBody.textContent,innerText,'检查menu显示的字符');
        }
        else{
            equal(menutableBody.innerText.replace( /[\r\n\t\u200b\ufeff]/g, '' ),innerText,'检查menu显示的字符');
        }
        ua.click(menutableBody.childNodes[0]);
        equal(editor.body.getElementsByTagName('table').length,0,'删除表格');
        setTimeout(function(){
            var menuDiv = document.getElementById("edui_fixedlayer");
            menuDiv.parentNode.removeChild(menuDiv);
            start();
        },200);
    }, 200);
    stop();
} );

/*trace 3210*/
test( 'trace 3210：添加单元格背景色', function() {
    var editor = te.obj[2];
    var div = document.body.appendChild( document.createElement( 'div' ) );
    var lang = editor.getLang( "contextMenu" );
    $( div ).css( 'width', '500px' ).css( 'height', '500px' ).css( 'border', '1px solid #ccc' );
    editor.render(div);
    var range = new baidu.editor.dom.Range( editor.document );
    stop();
    setTimeout(function(){
        editor.execCommand('inserttable');
        var tds = editor.body.getElementsByTagName('td');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(tds[0],tds[6]);
        ut.setSelected(cellsRange);
        range.setStart( tds[0], 0 ).collapse( true ).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[1];
        var forTable = document.getElementsByClassName('edui-for-table');
        if(ua.browser.ie){
            ua.mouseenter(forTable[forTable.length-1]);
        }else{
            ua.mouseover(forTable[forTable.length-1]);
        }
        lang = editor.getLang( "contextMenu" );
        ua.click(menutable.childNodes[12]);
        var iframe  = document.getElementById('edui351_iframe');        //取对话框的iframe，随着用例位置的变化会引起id号改变
        setTimeout(function (){
            iframe.contentDocument.getElementById('J_tone').value = '#ff0000';
            var buttonBody = document.getElementById('edui353_body');
            ua.click(buttonBody);
            equal(tds[0].style.backgroundColor,'rgb(255, 0, 0)','背景色不变');
            equal(tds[2].style.backgroundColor,'','背景色不变');
            equal(tds[6].style.backgroundColor,'rgb(255, 0, 0)','背景色不变');
            setTimeout(function() {
                editor.execCommand('source');
                setTimeout(function() {
                    editor.execCommand('source');
                    equal(tds[0].style.backgroundColor,'rgb(255, 0, 0)','背景色不变');
                    equal(tds[2].style.backgroundColor,'','背景色不变');
                    equal(tds[6].style.backgroundColor,'rgb(255, 0, 0)','背景色不变');
                    setTimeout(function(){
                        var menuDiv = document.getElementById("edui_fixedlayer");
                        menuDiv.parentNode.removeChild(menuDiv);
                        div.parentNode.removeChild(div);
                        start();
                    },200);
                },20);
            },20);
        },200);
    },50);
} );

/*trace 3216*/
test( 'trace 3216：前插入行', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var lang = editor.getLang( "contextMenu" );
    editor.execCommand('inserttable');
    var tds = editor.body.getElementsByTagName('td');
    tds[0].innerHTML = 'asd';
    range.setStart(tds[0]).collapse(true).select();
    ua.contextmenu(editor.body.firstChild);
    var menutable = document.getElementsByClassName("edui-menu-body")[1];
    var forTable = document.getElementsByClassName('edui-for-table');
    if(ua.browser.ie){
        ua.mouseenter(forTable[forTable.length-1]);
    }else{
        ua.mouseover(forTable[forTable.length-1]);
    }
    setTimeout(function (){
        lang = editor.getLang( "contextMenu" );
        ua.click(menutable.childNodes[4]);
        equal(editor.body.getElementsByTagName('tr').length,6,'前插入行后有6行');
        equal(ua.getChildHTML(editor.body.getElementsByTagName('td')[5]),'asd','原单元格中文本未改变');
        setTimeout(function(){
            var menuDiv = document.getElementById("edui_fixedlayer");
            menuDiv.parentNode.removeChild(menuDiv);
            start();
        },200);
    }, 200);
    stop();
} );