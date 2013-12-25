/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-18
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.autofloat' );
test( 'trace:3856 检查全屏滚动', function() {//这个用例本来和autofloat关系不大，只是类似的先放一起
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    sc.style.height = "100px";
    document.body.appendChild(sc);
    var me = UE.getEditor('sc',{'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false,'fullscreen' : true});
    stop();
    me.ready(function(){
        setTimeout(function () {
            me.setContent('<p><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>sdf</p>');
            setTimeout(function () {
                var range = new baidu.editor.dom.Range(me.document);
                range.setStart(me.body.firstChild, 1).collapse(1).select();
                me.focus();
                setTimeout(function () {
                    var scrollTop = me.document.documentElement.scrollTop || me.window.pageYOffset || me.document.body.scrollTop;
                    ok(scrollTop===0,'初始offset正确');
                    me.window.scrollBy(0,100);
                    setTimeout(function () {
                        scrollTop = me.document.documentElement.scrollTop || me.window.pageYOffset || me.document.body.scrollTop;//不同浏览器兼容
                        equal(scrollTop,100,'成功相应滚动');
                        setTimeout(function () {
                            UE.delEditor('sc');
                            document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
                            start();
                        }, 500);
                    }, 500);
                }, 500);
            }, 200);
        }, 500);
    });
});
test( '检查toolbar是否浮动在页面顶端', function() {
    te.dom[0].parentNode.removeChild(te.dom[0]);
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    sc.style.height = "100px";
    document.body.appendChild(sc);
    var me = UE.getEditor('sc',{'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
    stop();
    me.ready(function(){
        setTimeout(function () {
            me.setContent('<p><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>sdf</p>');
            var screenX = window.screenX ? window.screenX : window.screenLeft;//不同浏览器兼容
            var screenY = window.screenY ? window.screenY : window.screenTop;
            setTimeout(function () {
                var range = new baidu.editor.dom.Range(me.document);
                range.setStart(me.body.firstChild, 1).collapse(1).select();
                me.focus();
                setTimeout(function () {
                    window.scrollBy(screenX, screenY + $(document.body).height());
                    setTimeout(function () {
                        var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;//不同浏览器兼容
////                //ie6下，工具栏浮动不到正确位置
                        if (ua.browser.ie != 6&&!ua.browser.gecko)
                            equal(scrollTop, $(me.ui.getDom('toolbarbox')).offset().top - 60, '检查toolbar是否在页面顶端');
                        window.scrollTo(screenX, screenY - $(document.body).height());
                        setTimeout(function () {
                            equal(me.ui.getDom().childNodes[0].id, me.ui.getDom('toolbarbox').id, 'toolbar是第一个元素');
                            document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
                            start();
                        }, 500);
                    }, 500);
                }, 1000);
            }, 200);
        }, 800);
    });

});

