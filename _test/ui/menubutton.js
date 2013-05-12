/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-27
 * Time: 下午5:46
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.menubutton' );
test( 'menubutton', function() {
    var editor = new baidu.editor.ui.Editor();
    editor.render("editor");
//设置菜单内容
    var val=['1', '1.5','1.75','2', '3', '4', '5'];
    for(var i=0,ci,items=[];ci = val[i++];){
            items.push({
                label : ci,
                value: ci,
                onclick:function(){
                }
            })
    }
    editor.ready(function(){
        var menuButton = new te.obj[0].MenuButton({editor:editor,className : 'edui-for-lineheight',items :items});
        var value = val[1];
        menuButton.setValue(value);
        te.dom[0].innerHTML = menuButton.renderHtml();
        menuButton.postRender();
        menuButton.showPopup();
        equal(menuButton.popup.getDom().style.display,"",'窗口显示');
        equal(document.getElementsByClassName("edui-popup edui-menu")[0].style.display,"",'menu窗口显示');
//检查初始化的显示
        equal(document.getElementsByClassName("edui-menuitem  edui-"+editor.options.theme+" edui-state-checked").length,1,'设定已经选中一个value');
        equal(document.getElementsByClassName('edui-menuitem  edui-'+editor.options.theme+' edui-state-checked')[0].firstChild.lastChild.innerHTML,value,'检查选中的value');
//click
        ua.click(document.getElementsByClassName("edui-menu-body")[0].childNodes[2]);
        equal(menuButton.popup.getDom().style.display,"none",'窗口关闭');
        equal(document.getElementsByClassName("edui-popup edui-menu")[0].style.display,"none",'menu窗口关闭');
        menuButton.showPopup();
        if(ua.browser.ie){
            ua.mouseenter(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mouseover加上hover样式');
            ua.mousedown(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mousedown加上active样式');//edui-state-active
            ua.mouseleave(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),' mouseout去掉hover和active样式');
////////mouseover->mouseout
            ua.mouseenter(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ua.mouseleave(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mouseout去掉hover和active样式');
        }
        else{
//mouseover->mousedown->mouseout
            ua.mouseover(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mouseover加上hover样式');
            ua.mousedown(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mousedown加上active样式');//edui-state-active
            ua.mouseout(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),' mouseout去掉hover和active样式');
////////mouseover->mouseout
            ua.mouseover(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ua.mouseout(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
            ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mouseout去掉hover和active样式');
        }
     /////mousedown->mouseup
        ua.mousedown(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
        ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mousedown加上active样式');
        ua.mouseup(document.getElementsByClassName("edui-menu-body")[0].childNodes[2],{relatedTarget:document.getElementsByClassName('edui-popup edui-menu')[0]});
        ok(!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-hover')&&!document.getElementsByClassName("edui-menu-body")[0].childNodes[2].className.match('edui-state-active'),'mouseup去掉active样式');
        menuButton.popup.hide();
        start();
    });
    stop();
} );