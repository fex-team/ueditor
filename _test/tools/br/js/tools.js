var testingElement = {}, te = testingElement;
te.log = function( url ) {
    var img = new Image(),
        key = 'tangram_sio_log_' + Math.floor( Math.random() * 2147483648 ).toString( 36 );

    // 这里一定要挂在window下
    // 在IE中，如果没挂在window下，这个img变量又正好被GC的话，img的请求会abort
    // 导致服务器收不到日志
    window[key] = img;

    img.onload = img.onerror = img.onabort = function() {
        // 下面这句非常重要
        // 如果这个img很不幸正好加载了一个存在的资源，又是个gif动画
        // 则在gif动画播放过程中，img会多次触发onload
        // 因此一定要清空
        img.onload = img.onerror = img.onabort = null;

        window[key] = null;

        // 下面这句非常重要
        // new Image创建的是DOM，DOM的事件中形成闭包环引用DOM是典型的内存泄露
        // 因此这里一定要置为null
        img = null;
    };

    // 一定要在注册了事件之后再设置src
    // 不然如果图片是读缓存的话，会错过事件处理
    // 最后，对于url最好是添加客户端时间来防止缓存
    // 同时服务器也配合一下传递Cache-Control: no-cache;
    img.src = url;
};

(function() {
    function mySetup() {
        /*使用注意，由于实现机理的原因，SendKeyboard方法不能在调试状态下使用
         （应该会导致寻找句柄和编辑器区域错误），关掉调试页面即可正常使用*/
        te.presskey = function( funkey, charkey ) {
            /*必须取到最顶层的窗口的名称，要不然取不到句柄*/
            var title = top.document.getElementsByTagName( 'title' )[0].innerHTML;
            var plugin = document.getElementById( 'plugin' );
            var browser = ua.getBrowser();
//            if(browser=='maxIE'){
//                title+=' - 傲游浏览器 3.1.5.1000';
//            }
            /*ie需要先触发一次空的*/
            if ( browser != "ie9" )
                plugin.sendKeyborad( browser, title, "null", "" );
            plugin.sendKeyborad( browser, title, funkey, charkey );
        };
        te.setClipData = function( pasteData ) {
            /*必须取到最顶层的窗口的名称，要不然取不到句柄*/
            var title = top.document.getElementsByTagName( 'title' )[0].innerHTML;
            var plugin = document.getElementById( 'plugin' );
            var browser = ua.getBrowser();
            plugin.setClipboard( browser, title, pasteData );
        };
        te.dom = [];
        te.obj = [];
    }

    function myTeardown() {
        if ( te ) {
            if ( te.dom && te.dom.length ) {
                for ( var i = 0; i < te.dom.length; i++ )
                    if ( te.dom[i] && te.dom[i].parentNode )
                        te.dom[i].parentNode.removeChild( te.dom[i] );
            }
        }
    }

    var s = QUnit.testStart, e = QUnit.testDone, ms = QUnit.moduleStart, me = QUnit.moduleEnd, d = QUnit.done;
    QUnit.testStart = function() {
        mySetup();
        s.apply( this, arguments );
        ;
    };
    QUnit.testDone = function() {
        e.call( this, arguments );
        myTeardown();
    };
    // QUnit.moduleStart = function() {
    // var h = setInterval(function() {
    // if (window && window['baidu'] && window.document && window.document.body)
    // {
    // clearInterval(h);
    // start();
    // }
    // }, 20);
    // stop();
    // ms.apply(this, arguments);;
    // };
    // QUnit.moduleEnd = function() {
    // me.call(this, arguments);
    // };
    // QUnit.done = function(fail,total) {
    // // d.call(this, arguments);
    // d(fail,total);
    // };
})();

// function Include(src) {
// var url = "http://"
// + location.host
// + location.pathname.substring(0, location.pathname.substring(1)
// .indexOf('/') + 1);
// document.write("<script type='text/javascript' src='" + url
// + "/src/Import.php?f=" + src + "'></script>");
// }
