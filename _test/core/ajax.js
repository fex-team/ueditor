module( 'core.ajax' );
var ajax_request_baseurl = upath + 'ajax.php';


test( "post请求，无数据", function () {
        UE.ajax.request( ajax_request_baseurl, {
                onsuccess:function ( xhr ) {
                        equals( xhr.responseText, "", "post请求，无数据" );
                        start();
                },
                onerror:function () {
                        ok( false, 'fail to send ajax request' );
                        start();
                }
        } );
        stop();
} );

test( "get请求，无数据,url中有数据", function () {
        UE.ajax.request( ajax_request_baseurl+"?get1=ueditor&get2=baidu", {
                method:'GET',
                onsuccess:function ( xhr ) {
                        equals( xhr.responseText, "get1='ueditor'&get2='baidu'", "post请求，数据放在url中传递" );
                        start();
                },
                onerror:function () {
                        ok( false, 'fail to send ajax request' );
                        start();
                }
        } );
        stop();
} );



test( "get请求,有数据,url中有数据", function () {
        UE.ajax.request( ajax_request_baseurl+"?get1=ueditor&get2=baidu", {
                method:'GET',
                content:"img1=http://www.baidu.com&img2=http://ueditor.baidu.com",
                onsuccess:function ( xhr ) {
                        equals( xhr.responseText, "get1='ueditor'&get2='baidu'&img1=http://www.baidu.com&img2=http://ueditor.baidu.com", "post请求，数据放在url中传递" );
                        start();
                },
                onerror:function () {
                        ok( false, 'fail to send ajax request' );
                        start();
                }
        } );
        stop();
} );

test( "get请求，有data字段，无数据,url中有数据", function () {
        UE.ajax.request( ajax_request_baseurl+"?get1=ueditor&get2=baidu", {
                method:'GET',
                data:{
                        img1:'http://www.baidu.com', img2:'http://www.google.com'
                },
                onsuccess:function ( xhr ) {
                        equals( xhr.responseText, "get1='ueditor'&get2='baidu'&img1='http://www.baidu.com'&img2='http://www.google.com'", "post请求，数据放在url中传递" );
                        start();
                },
                onerror:function () {
                        ok( false, 'fail to send ajax request' );
                        start();
                }
        } );
        stop();
} );

test( "post请求，有data字段", function () {
        UE.ajax.request( ajax_request_baseurl,
            {
                    data:{
                            img1:'http://www.baidu.com', img2:'http://www.google.com'
                    },
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "img1='http://www.baidu.com'&img2='http://www.google.com'", "post请求，有data字段" );
                            start();
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                            start();
                    }
            } );
        stop();
} );

test( "post请求，没有data字段，有其他数据", function () {
        UE.ajax.request( ajax_request_baseurl,
            {
                    content:"img1=http://www.baidu.com&img2=http://ueditor.baidu.com",
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "img1=http://www.baidu.com&img2=http://ueditor.baidu.com", "没有data字段，有其他数据" );
                            start();
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                            start();
                    }
            } );
        stop();
} );

test( "post请求，有data字段，有其他数据", function () {
        UE.ajax.request( ajax_request_baseurl,
            {
                    data:{
                            img1:'http://www.baidu.com', img2:'http://www.google.com'
                    },
                    content:"i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "img1='http://www.baidu.com'&img2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据" );
                            start();
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                            start();
                    }
            } );
        stop();
} );

test( "get请求，有data字段，有其他数据", function () {
        UE.ajax.request( ajax_request_baseurl,
            {
                    method:'GET',
                    data:{
                            get1:'http://www.baidu.com', get2:'http://www.google.com'
                    },
                    content:"i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "get1='http://www.baidu.com'&get2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据" );
                            start();
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                            start();
                    }
            } );
        stop();
} );


test( "并发多个post请求", function () {
        UE.ajax.request( ajax_request_baseurl,
            {
                    data:{
                            img1:'http://ueditor.baidu.com', img2:'http://www.google.com'
                    },
                    content:"i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "img1='http://ueditor.baidu.com'&img2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据" );
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                    }
            } );

        UE.ajax.request( ajax_request_baseurl,
            {
                    data:{
                            img1:'http://map.baidu.com', img2:'http://www.google.com'
                    },
                    content:"p1=http://www.baidu.com&p2=http://ueditor.baidu.com",
                    onsuccess:function ( xhr ) {
                            equals( xhr.responseText, "img1='http://map.baidu.com'&img2='http://www.google.com'&p1=http://www.baidu.com&p2=http://ueditor.baidu.com", "有data字段，有其他数据" );
                            start();
                    },
                    onerror:function () {
                            ok( false, 'fail to send ajax request' );
                            start();
                    }
            } );
        stop();
} );

