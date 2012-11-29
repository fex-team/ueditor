/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-18
 * Time: 下午4:33
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.autofloat' );
test( '检查toolbar是否浮动在页面顶端', function() {
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    document.body.appendChild(sc);
    var me = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
    me.render('sc');
    te.dom[0].parentNode.removeChild(te.dom[0]);
    stop();
//    var me = te.obj[2];
    me.ready(function(){
        me.focus();
        me.setContent('<p><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>sdf</p>');
        var screenX = window.screenX?window.screenX:window.screenLeft;//不同浏览器兼容
        var screenY = window.screenY?window.screenY:window.screenTop;
        setTimeout(function(){
            me.focus();
            window.scrollBy(screenX,screenY+$(document.body).height());
            setTimeout(function(){
                equal(me.ui.getDom().childNodes[1].id,me.ui.getDom('toolbarbox').id,'toolbar是第二个元素');
                var scrollTop = document.documentElement.scrollTop ||window.pageYOffset || document.body.scrollTop;//不同浏览器兼容
                //ie6下，工具栏浮动不到正确位置
                if(ua.browser.ie!=6)
                    equal(scrollTop,$(me.ui.getDom('toolbarbox')).offset().top - 60,'检查toolbar是否在页面顶端');
                window.scrollTo(screenX,screenY-$(document.body).height());
                setTimeout(function(){
                    equal(me.ui.getDom().childNodes[0].id,me.ui.getDom('toolbarbox').id,'toolbar是第一个元素');
                    document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
                    start();
                },100);
            },500);
        },1500);
    });
} );

