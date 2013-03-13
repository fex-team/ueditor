/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午4:45
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.menu' );
test( 'menu,submenu的显示', function() {
//设置菜单内容\
    var editor = new te.obj[0].Editor();
    var items=[
            {
                label:'删除',
                cmdName:'delete'
            },
            {
                label:'全选',
                cmdName:'selectall'
            },
            {
                label:'删除代码',
                cmdName:'highlightcode',
                icon:'deletehighlightcode'
            },
            {
                label:'清空文档',
                cmdName:'cleardoc',
                exec:function () {

                    if ( confirm( '确定清空文档吗？' ) ) {

                        this.execCommand( 'cleardoc' );
                    }
                }
            },
            '-',
            {
                label:'取消链接',
                cmdName:'unlink'
            },
            '-',
            {
                label:'段落格式',
                icon:'justifyjustify',
                subMenu:{
                        items: [{
                            label:'居左对齐',
                            cmdName:'justify',
                            value:'left',
                            editor:editor
                        },
                        {
                            label:'居右对齐',
                            cmdName:'justify',
                            value:'right',
                            editor:editor
                        },
                        {
                            label:'居中对齐',
                            cmdName:'justify',
                            value:'center',
                            editor:editor
                        },
                        {
                            label:'两端对齐',
                            cmdName:'justify',
                            value:'justify',
                            editor:editor
                        }],
                        editor:editor
                }
            }
    ];
    var menu = new te.obj[0].Menu({className : 'edui-for-lineheight',items :items,editor:te.obj[0].Editor()});
    menu.render(te.dom[0]);
    menu.postRender();
    menu.show();
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    equal(menuBody.childNodes[0].className,"edui-menuitem  edui-"+editor.options.theme,'menu窗口显示');
    equal(menuBody.childNodes[0].firstChild.lastChild.innerHTML,"删除",'menu窗口显示');
//edui-menuitem edui-menuseparator
    equal(menuBody.childNodes[4].className,"edui-menuitem edui-menuseparator edui-"+editor.options.theme,'menu窗口显示');
    equal(menuBody.childNodes[4].firstChild.className,"edui-menuseparator-inner edui-"+editor.options.theme,'menu窗口显示');//edui-menuitem  edui-hassubmenu
    equal(menuBody.childNodes[7].className,"edui-menuitem  edui-"+editor.options.theme + " edui-hassubmenu edui-hassubmenu",'第7个menu有子menu');
    //submenu
    var menuid1 = menu.items[7].id;
    var submenu1 = menu.items[7].subMenu.id;
    equal(document.getElementById(submenu1).style.display,'none','submenu初始的display值："none"');
    if(ua.browser.ie){
        ua.mouseenter(menuBody.childNodes[7]);
    }
    else{
        ua.mouseover(menuBody.childNodes[7]);    }
    setTimeout(function (){
        equal(document.getElementById(submenu1).style.display,'','显示submenu,检查submenu的display值:""');
        equal(getElementsByClassName_2(document.getElementById(submenu1),'div','edui-menu-body')[0].childNodes.length,4,'检查submenu的menuitems数量');
        equal(getElementsByClassName_2(document.getElementById(submenu1),'div','edui-menu-body')[0].firstChild.className,'edui-menuitem  edui-'+editor.options.theme,'检查submenu的内容');
        equal(getElementsByClassName_2(document.getElementById(submenu1),'div','edui-menuitem')[0].firstChild.lastChild.innerHTML,'居左对齐','检查menuitem的内容');
        var menuClass = document.getElementById(menuid1).className;
        equal(menuClass,"edui-menuitem  edui-"+editor.options.theme+" edui-hassubmenu edui-hassubmenu edui-state-hover edui-state-opened",'');
        if(ua.browser.ie){
            ua.mouseleave(document.getElementById(menuid1));
        }
        else{
            ua.mouseout(document.getElementById(menuid1));
        }
        setTimeout(function (){
            equal(document.getElementById(submenu1).style.display,'none','显示submenu,检查submenu的display值:""');
            menuClass = document.getElementById(menuid1).className;
            ok(menuClass.indexOf('edui-state-hover')==-1&&menuClass.indexOf('edui-state-opened')==-1,'');
            document.getElementById(submenu1).parentNode.removeChild(document.getElementById(submenu1));
            start();
        }, 450);
    }, 300);
 stop();
    function getElementsByClassName_2(oElm, strTagName, strClassName){
            var arrElements = (strTagName == "*" && oElm.all)? oElm.all :
            oElm.getElementsByTagName(strTagName);
            var arrReturnElements = new Array();
            strClassName = strClassName.replace(/\-/g, "\\-");
            var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
            var oElement;
            for(var i=0; i < arrElements.length; i++){
                oElement = arrElements[i];
                if(oRegExp.test(oElement.className)){
                        arrReturnElements.push(oElement);
                }
            }
            return (arrReturnElements);
        }
} );
test( '先打开一个submenu，再打开另一个submenu', function() {
var editor = new te.obj[0].Editor();
//设置菜单内容
    var items=[
            {
                label:'删除',
                cmdName:'delete'
            },
            {
                label:'段落格式',
                icon:'justifyjustify',
                subMenu:{
                        items: [{
                            label:'居左对齐',
                            cmdName:'justify',
                            value:'left'

                        },
                        {
                            label:'居右对齐',
                            cmdName:'justify',
                            value:'right'
                        },
                        {
                            label:'居中对齐',
                            cmdName:'justify',
                            value:'center'
                        },
                        {
                            label:'两端对齐',
                            cmdName:'justify',
                            value:'justify'
                        }],
                    editor:editor
                }
            },
            {
                label:'表格',
                subMenu:{
                        items: [{
                            label:'居左对齐',
                            cmdName:'justify',
                            value:'left'
                        },
                        {
                            label:'居右对齐',
                            cmdName:'justify',
                            value:'right'
                        }],
                    editor:editor
                }
            }
    ];
    var menu = new te.obj[0].Menu({className : 'edui-for-lineheight',items :items,editor:editor});
    menu.render(te.dom[0]);
    menu.postRender();
    menu.show();
    var menuBody = document.getElementsByClassName("edui-menu-body")[0];
    //submenu
    var menuid1 = menu.items[1].id;
    var menuid2 = menu.items[2].id;
    var submenu1 = menu.items[1].subMenu.id;
    var submenu2 = menu.items[2].subMenu.id;
    equal(document.getElementById(submenu1).style.display,'none','submenu初始的display值："none"');
    //打开一个submenu
    if(ua.browser.ie){
        ua.mouseenter(document.getElementById(menuid1));
    }
    else{
        ua.mouseover(document.getElementById(menuid1));
    }
    setTimeout(function (){
        //检查第一个submenu的内容显示
        equal(document.getElementById(submenu1).style.display,'','显示第一个submenu,检查submenu的display值:""');
        var menuClass = document.getElementById(menuid1).className;
        equal(menuClass,"edui-menuitem  edui-"+editor.options.theme+" edui-hassubmenu edui-hassubmenu edui-state-hover edui-state-opened",'检查第一个submenu的打开状态');
        //打开第二个submenu
        if(ua.browser.ie){
            ua.mouseenter(document.getElementById(menuid2));
        }
        else{
            ua.mouseover(document.getElementById(menuid2));
        }
        setTimeout(function (){
            equal(document.getElementById(submenu1).style.display,'none','第一个submenu关闭,display值:"none"');
            menuClass = document.getElementById(menuid1).className;
            ok(menuClass.indexOf('edui-state-opened')==-1,'检查第一个submenu的关闭状态');
            equal(document.getElementById(submenu2).style.display,'','第二个submenu显示,检查submenu的display值:""');
            var menuClass = document.getElementById(menuid2).className;
            equal(menuClass,"edui-menuitem  edui-"+editor.options.theme+" edui-hassubmenu edui-hassubmenu edui-state-hover edui-state-opened",'检查第二个submenu的打开状态');
            document.getElementById(submenu1).parentNode.removeChild(document.getElementById(submenu2));
            start();
        }, 450);
    }, 300);
 stop();
} );
test( 'dispose', function() {
    var editor = new te.obj[0].Editor();
//设置菜单内容
    var items=[
            {
                label:'删除',
                cmdName:'delete'
            },
            {
                label:'全选',
                cmdName:'selectall'
            },
            {
                label:'删除代码',
                cmdName:'highlightcode',
                icon:'deletehighlightcode'
            },
            {
                label:'清空文档',
                cmdName:'cleardoc',
                exec:function () {
                    if ( confirm( '确定清空文档吗？' ) ) {
                        this.execCommand( 'cleardoc' );
                    }
                }
            },
            '-',
            {
                label:'取消链接',
                cmdName:'unlink'
            },
            {
                label:'表格',
                subMenu:{
                        items: [{
                            label:'居左对齐',
                            cmdName:'justify',
                            value:'left'
                        },
                        {
                            label:'居右对齐',
                            cmdName:'justify',
                            value:'right'
                        }],
                    editor:editor
                }
            }
    ];
    var menu = new te.obj[0].Menu({className : 'edui-for-lineheight',items :items,editor:editor});
    te.dom[0].innerHTML = menu.renderHtml();
    menu.postRender();
    menu.show();
    equal(menu.items.length,7,'检查menu里的items');
    equal(document.getElementById(menu.id).style.display,'','显示menu,检查menu的display值:""');
    menu.dispose();
    equal(menu.items.length,0,'dispose后，检查menu里的items');
    equal(document.getElementById(menu.id),null,'menu不在页面中');
} );
test( '_onClick', function() {
    var editor = new te.obj[0].Editor();
//设置菜单内容
    var items=[
            {
                label:'取消链接',
                cmdName:'unlink'
            },
            {
                label:'表格',
                subMenu:{
                        items: [{
                            label:'居左对齐',
                            cmdName:'justify',
                            value:'left'
                        },
                        {
                            label:'居右对齐',
                            cmdName:'justify',
                            value:'right'
                        }],
                    editor:editor

                }
            }
    ];
    var menu = new te.obj[0].Menu({className : 'edui-for-lineheight',items :items,editor:editor});
    menu.render(te.dom[0]);
    menu.postRender();
    menu.show();
    var menuid1 = menu.items[1].id;
    var submenu1 = menu.items[1].subMenu.id;
     equal(document.getElementById(submenu1).style.display,'none','submenu初始的display值："none"');
    ua.click(document.getElementById(menuid1));
    setTimeout(function (){
        equal(document.getElementById(submenu1).style.display,'','显示submenu,检查submenu的display值:""');
         document.getElementById(submenu1).parentNode.removeChild(document.getElementById(submenu1));
        start();
    }, 300);
   stop();
} );