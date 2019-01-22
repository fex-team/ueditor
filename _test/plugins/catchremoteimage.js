module( 'plugins.catchremoteimage' );

test( '成功远程图片抓取', function () {
        UEDITOR_CONFIG.UEDITOR_HOME_URL = '../../../';
        for (var config in window.UEDITOR_CONFIG) {
            if (typeof(window.UEDITOR_CONFIG[config]) == 'string'){
                window.UEDITOR_CONFIG[config] = window.UEDITOR_CONFIG[config].replace('_test/tools/br/', '');
            }
        }
        var editor = new UE.Editor({'autoFloatEnabled':false});
    stop();
    setTimeout(function(){
        var div = document.body.appendChild( document.createElement( 'div' ) );
        editor.render( div );

        editor.ready(function(){
            var body = editor.body;
            editor.setContent( '<p><img src="http://img0.bdstatic.com/static/common/widget/search_box_search/logo/logo_3b6de4c.png"><img src="http://news.baidu.com/resource/img/logo_news_137_46.png"></p>' );
            editor.fireEvent( "catchRemoteImage" );
            var count = 0;
            var handler = setInterval( function () {
                count++;
                var imgs = body.getElementsByTagName( 'img' );
                var src = imgs [1].getAttribute( 'src' );
                if ( /upload/.test( src ) ) {
                        clearInterval( handler );
//                        ok( /upload/.test( imgs[0].getAttribute( 'src' ) ), '图片已经被转存到本地' );
//                        equal( imgs[0].getAttribute( 'src' ), imgs[0].getAttribute( '_src' ), '查看_src' );
//                        equal( imgs[1].getAttribute( 'src' ), imgs[1].getAttribute( '_src' ), '查看_src' );
                        equal( imgs.length, 2, '2个图片' );
                        start();
                } else if ( count > 100 ) {
                        clearInterval( handler );
                        ok( false, '超时，文件获取失败' );
                        start();
                }
            }, 100 );
            te.dom.push( div );
         },50);
    },100);
} );

//test( '失败远程图片抓取', function () {
////超时太长了，而且就是一个alert，alert出来还会影响后面跑用例，先占个坑
//} );