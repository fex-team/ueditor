module('core.ajax');
var ajax_request_baseurl = upath + 'ajax.php';


test("post请求，无数据", function () {
    UE.ajax.request(ajax_request_baseurl, {
        onsuccess: function (xhr) {
            equals(xhr.responseText, "", "post请求，无数据");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("get请求，无数据,url中有数据", function () {
    UE.ajax.request(ajax_request_baseurl + "?get1=ueditor&get2=baidu", {
        method: 'GET',
        onsuccess: function (xhr) {
            equals(xhr.responseText, "get1='ueditor'&get2='baidu'", "post请求，数据放在url中传递");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});


test("get请求,有数据,url中有数据", function () {
    UE.ajax.request(ajax_request_baseurl + "?get1=ueditor&get2=baidu", {
        method: 'GET',
        content: "img1=http://www.baidu.com&img2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "get1='ueditor'&get2='baidu'&img1=http://www.baidu.com&img2=http://ueditor.baidu.com", "post请求，数据放在url中传递");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("get请求，有data字段，无数据,url中有数据", function () {
    UE.ajax.request(ajax_request_baseurl + "?get1=ueditor&get2=baidu", {
        method: 'GET',
        data: {
            img1: 'http://www.baidu.com', img2: 'http://www.google.com'
        },
        onsuccess: function (xhr) {
            equals(xhr.responseText, "get1='ueditor'&get2='baidu'&img1='http://www.baidu.com'&img2='http://www.google.com'", "post请求，数据放在url中传递");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("post请求，有data字段", function () {
    UE.ajax.request(ajax_request_baseurl, {
        data: {
            img1: 'http://www.baidu.com', img2: 'http://www.google.com'
        },
        onsuccess: function (xhr) {
            equals(xhr.responseText, "img1='http://www.baidu.com'&img2='http://www.google.com'", "post请求，有data字段");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("post请求，没有data字段，有其他数据", function () {
    UE.ajax.request(ajax_request_baseurl, {
        content: "img1=http://www.baidu.com&img2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "img1=http://www.baidu.com&img2=http://ueditor.baidu.com", "没有data字段，有其他数据");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("post请求，有data字段，有其他数据", function () {
    UE.ajax.request(ajax_request_baseurl, {
        data: {
            img1: 'http://www.baidu.com', img2: 'http://www.google.com'
        },
        content: "i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "img1='http://www.baidu.com'&img2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("get请求，有data字段，有其他数据", function () {
    UE.ajax.request(ajax_request_baseurl, {
        method: 'GET',
        data: {
            get1: 'http://www.baidu.com', get2: 'http://www.google.com'
        },
        content: "i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "get1='http://www.baidu.com'&get2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});


test("并发多个post请求", function () {

    UE.ajax.request(ajax_request_baseurl, {
        data: {
            img1: 'http://ueditor.baidu.com', img2: 'http://www.google.com'
        },
        content: "i1=http://www.baidu.com&i2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "img1='http://ueditor.baidu.com'&img2='http://www.google.com'&i1=http://www.baidu.com&i2=http://ueditor.baidu.com", "有data字段，有其他数据");
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
        }
    });

    UE.ajax.request(ajax_request_baseurl, {
        data: {
            img1: 'http://map.baidu.com', img2: 'http://www.google.com'
        },
        content: "p1=http://www.baidu.com&p2=http://ueditor.baidu.com",
        onsuccess: function (xhr) {
            equals(xhr.responseText, "img1='http://map.baidu.com'&img2='http://www.google.com'&p1=http://www.baidu.com&p2=http://ueditor.baidu.com", "有data字段，有其他数据");
            start();
        },
        onerror: function () {
            ok(false, 'fail to send ajax request');
            start();
        }
    });
    stop();
});

test("jsonp请求,无数据", function () {

    UE.ajax.request(ajax_request_baseurl, {
        dataType: 'jsonp',
        onsuccess: function (r) {
            notDeepEqual(r, null, '返回内容不为空');
            notEqual(r.callback, null, '返回内容有callback参数');
            start();
        },
        onerror: function () {
            ok(false, 'fail to send jsonp request');
            start();
        }
    });
    stop();

});

test("jsonp请求,无数据,url上有数据", function () {

    UE.ajax.request(ajax_request_baseurl + '?get1=getcontent1&get2=getcontent2', {
        dataType: 'jsonp',
        onsuccess: function (r) {
            equal(r.get1, 'getcontent1', 'url上的参数1正常');
            equal(r.get2, 'getcontent2', 'url上的参数2正常');
            start();
        },
        onerror: function () {
            ok(false, 'fail to send jsonp request');
            start();
        }
    });
    stop();

});

test("jsonp请求,有数据,url上有数据", function () {

    UE.ajax.request(ajax_request_baseurl + '?get1=getcontent1&get2=getcontent2', {
        key1: 'keycontent1',
        key2: 'keycontent2',
        dataType: 'jsonp',
        onsuccess: function (r) {
            equal(r.get1, 'getcontent1', 'url上的参数1正常');
            equal(r.get2, 'getcontent2', 'url上的参数2正常');
            equal(r.key1, 'keycontent1', '数据上的参数1正常');
            equal(r.key2, 'keycontent2', '数据上的参数2正常');
            start();
        },
        onerror: function () {
            ok(false, 'fail to send jsonp request');
            start();
        }
    });
    stop();

});

test("jsonp请求,有数据,data上有数据,url上有数据", function () {

    UE.ajax.request(ajax_request_baseurl + '?get1=getcontent1&get2=getcontent2', {
        key1: 'keycontent1',
        key2: 'keycontent2',
        data: {
            'datakey1': 'datakeycontent1',
            'datakey2': 'datakeycontent2'
        },
        dataType: 'jsonp',
        onsuccess: function (r) {
            equal(r.get1, 'getcontent1', 'url上的参数1正常');
            equal(r.get2, 'getcontent2', 'url上的参数2正常');
            equal(r.key1, 'keycontent1', '数据上的参数1正常');
            equal(r.key2, 'keycontent2', '数据上的参数2正常');
            equal(r.datakey1, 'datakeycontent1', 'data数据上的参数1正常');
            equal(r.datakey2, 'datakeycontent2', 'data数据上的参数2正常');
            start();
        },
        onerror: function () {
            ok(false, 'fail to send jsonp request');
            start();
        }
    });
    stop();

});

test("通过getJSONP方法发送jsonp请求", function () {

    UE.ajax.getJSONP(ajax_request_baseurl + '?get1=getcontent1&get2=getcontent2', {
        'datakey1': 'datakeycontent1',
        'datakey2': 'datakeycontent2'
    }, function (r) {
        equal(r.get1, 'getcontent1', 'url上的参数1正常');
        equal(r.get2, 'getcontent2', 'url上的参数2正常');
        equal(r.datakey1, 'datakeycontent1', 'data数据上的参数1正常');
        equal(r.datakey2, 'datakeycontent2', 'data数据上的参数2正常');
        start();
    });
    stop();

});
