module("core.utils");

test('cssRule', function () {
    var utils = te.obj[0];
    utils.cssRule('test1', '.test{width:300px;}');
    var style = utils.cssRule('test1');
    ok(/^\.test/.test(style));
    utils.cssRule('test1', '');
    style = utils.cssRule('test1');
    ok(!style);
    var div = te.dom[2];
    div.innerHTML = '<span class="test">sdfsdf</span>';
    utils.cssRule('style_test', '.test{display:block}');
    utils.cssRule('style_test', '.test{font-size:48px}');
    var block = UE.dom.domUtils.getComputedStyle(div.firstChild, 'display');
    equals(block, 'inline');
    //删除样式
    utils.cssRule('style_test', '');
    equals(UE.dom.domUtils.getComputedStyle(div.firstChild, 'font-size'), '16px');
});

test("makeInstance", function () {
    var utils = te.obj[0];
    var obj = {
        s: 1,
        str: "makeInstance"
    }, str = "makeInstance";
    var ins = utils.makeInstance(obj);
    var ins1 = utils.makeInstance(str);
    equals(ins.s, 1, "ins.s");
    equals(ins.str, "makeInstance", "ins.str");
    same(ins1, {}, "null");
    same(utils.makeInstance(null), {}, "null");
});
test("isArray--普通对象", function () {
    var utils = te.obj[0];
    var arr = [ '1', '2' ], ob = {}, str = "array", fun = function () {
    };
    var div = te.dom[0];
    ok(utils.isArray(arr), 'arr is a array');
    ok(!utils.isArray(ob), 'ob is not a array');
    ok(!utils.isArray(str), 'str is not a array');
    ok(!utils.isArray(fun), 'fun is not a array');
    ok(!utils.isArray(null), 'null is not a array');
    ok(!utils.isArray(div), 'dom element is not a array');
});

test("isArray--类数组对象", function () {
    var utils = te.obj[0];
    var arrayLike = {
        0: '0',
        1: '1',
        2: '2',
        length: 3
    };
    var div = te.dom[0];
    div.innerHTML = '<span><label></label></span>xxxxx<p></p>';
    ok(!utils.isArray(arrayLike), '类数组对象不是数组');
    ok(!utils.isArray(div.childNodes), 'nodeList 不是数组');

});

test("inherits", function () {
    var utils = te.obj[0];
    var superClass = function () {
    };
    var subClass = function () {
    };
    expect(4);
    var index = 0;
    superClass.prototype.name = "superClass";
    superClass.prototype.methodSuper = function () {
        ok(true, "method in superClass is called");
    };
    superClass.prototype.method = function () {
        ok(false, "I am in superClass");
    };
    subClass.prototype.name = "subClass";
    subClass.prototype.methodSub = function () {
        ok(true, "method in subClass is called");
    };
    subClass.prototype.method = function () {
        ok(true, "I am in subClass");
    };
    utils.inherits(subClass, superClass);
    var sub = new subClass();
    /*子类自己的名字，父类的被覆盖*/
    equal(sub.name, "subClass", "the name of subClass");
    /*从父类中继承的方法*/
    sub.methodSuper();
    /*子类自己的方法*/
    sub.methodSub();
    /*覆盖父类中的method方法*/
    sub.method();
});


test("bind", function () {
    var utils = te.obj[0];
    var first_object = { num: 4 };
    var second_object = { num: 2 };

    function multiply(mult) {
        return this.num * mult;
    }

    var first_multiply = utils.bind(multiply, first_object);
    equal(first_multiply(5), 20, "first_object"); // returns 4 * 5
    var second_multiply = utils.bind(multiply, second_object);
    equal(second_multiply(5), 10, "second_object");
});

test('defer--一个defer', function () {
    var utils = te.obj[0];
    var delay = 100;
    expect(1);
    stop();
    /*defer返回一个闭包，算defer不准，chrome下会 相差300多ms，没办法判断延时是否准确*/
    var stime = +new Date();
    utils.defer(function () {
        ok(1, '检查回调函数是否触发');
        start();
    }, delay)();
});

test('defer--多个defer', function () {
    var utils = te.obj[0];
    var delay = 40;
    stop();
    expect(2);
    utils.defer(function () {
        ok(true, '第一个触发');
    }, delay)();

    utils.defer(function () {
        ok(true, '第二个触发');
        start();
    }, delay)();
});

/*若互斥，则前一个注册的setTimeout事件被删除*/
test('defer--考虑互斥', function () {
    var utils = te.obj[0];
    var delay = 20;
    stop();
    expect(1);
    /*exclusion=true*/
    var defer = utils.defer(function () {
        ok(1, '检查回调函数是否在规定的时间内触发');
    }, delay, true);
    defer();
    //第一个defer会被删掉
    defer();
    setTimeout(function () {
        start();
    }, 100);
});

test("extend--true", function () {
    var utils = te.obj[0];
    var obj1 = {a: 3, b: "str", fun: function () {
        ok(true, "fun");
    }, n: null};
    var obj2 = {a: 2, c: 1};
    utils.extend(obj2, obj1, true);
    equal(obj2.a, 2, "obj2 a");
    equal(obj2.b, "str", "obj2 str");
    equal(obj2.c, 1, "obj2 c");
    obj2.fun();
    equal(obj2.n, null, "obj2 n null");
});
test("extend--false", function () {
    var utils = te.obj[0];
    var obj1 = {a: 3, b: "str", fun: function () {
        ok(true, "fun");
    }, n: null};
    var obj2 = {a: 2, c: 1};
    utils.extend(obj2, obj1, false);
    equal(obj2.a, 3, "obj2 a");
    equal(obj2.b, "str", "obj2 str");
    equal(obj2.c, 1, "obj2 c");
    obj2.fun();
    equal(obj2.n, null, "obj2 n null");
});
test('indexOf', function () {
    var utils = te.obj[0];
    var s = [ 1, 2, 3, 4, 5 ];
    equals(utils.indexOf(s, 3), 2);
    equals(utils.indexOf(s, 6), -1);
    equals(utils.indexOf(s, 5), 4);
    equals(utils.indexOf(s, 3, 3), -1);
    equals(utils.indexOf(s, 3, 3), -1);
});
test('removeItem&&itemexist', function () {
    var utils = te.obj[0];
    var s = [ 1, 2, 3, 4, 5 , 4, 3];
    equal(s[5], 4, "before remove 4");
    utils.removeItem(s, 4);
    equal(s.length, 5, "4 be removed");
    equal(s[4], 3, "4 be removed");
});

test('removeItem&&itemnotexist', function () {
    var utils = te.obj[0];
    var s = [ 1, 2, 3, 4, 5 , 4];
    utils.removeItem(s, 6);
    equal(s.length, 6, "itemnotexist");
});

test("trim", function () {
    var utils = te.obj[0];
    var s = ' sss ';
    equals(utils.trim(s), 'sss', "两端有空格");
    s = "&nbsp;xxx ";
    equal(utils.trim(s), '&nbsp;xxx', "包含&nbsp;");//&nbsp;不能被捕获
    s = "string";
    equal(utils.trim(s), "string", '没有&nbsp;和空格');
});
test('listToMap', function () {
    var utils = te.obj[0];
    var s = "listToMap";
    var re = utils.listToMap(s);
    equal(re.listToMap, 1, "listToMap");
});
test('list,To,Map', function () {
    var utils = te.obj[0];
    var s = "list,To,Map";
    var re = utils.listToMap(s);
    equal(re.list, 1, "list");
    equal(re.To, 1, "list");
    equal(re.Map, 1, "Map");
});
test('listToMap ""', function () {
    var utils = te.obj[0];
    var s = "";
    var re = utils.listToMap(s);
    equal(re.toString(), {}, "{}");
});
test('listToMap null', function () {
    var utils = te.obj[0];
    var s = null;
    var re = utils.listToMap(s);
    equal(re.toString(), {}, "{}");
});
test('listToMap numstring', function () {
    var utils = te.obj[0];
    var s = "123333";
    var re = utils.listToMap(s);
    equal(re[123333], 1, "num");
});
test('unhtml 字符转义', function () {
    var utils = te.obj[0];
    var str = '<p>"as&cd"</p>';
    var str_html = utils.unhtml(str);
    equal(str_html, '&lt;p&gt;&quot;as&amp;cd&quot;&lt;/p&gt;', '转义字符成功');
    str = 'border:&lt;script&gt;alert(&quot;&quot;)&lt;/script&gt;"'
    equal(utils.unhtml(str), 'border:&lt;script&gt;alert(&quot;&quot;)&lt;/script&gt;&quot;', '转义字符成功');
    str = "'";
    equal(utils.unhtml('比如&#23567;这个汉字的unicode编码'), '比如&#23567;这个汉字的unicode编码');
    equal(utils.unhtml('比如&#<23567;这个汉字的unicode编码<>'), '比如&amp;#&lt;23567;这个汉字的unicode编码&lt;&gt;')
});
test('html 反转义', function () {
    var utils = te.obj[0];
    var str_html = '&lt;p&gt;&quot;as&amp;cd&quot;&lt;/p&gt;';
    var str = utils.html(str_html);
    equal(str, '<p>"as&cd"</p>', '反转义成功');
});
test('unhtml null ""', function () {
    var utils = te.obj[0];
    var s = null;
    equal(utils.unhtml(s), "", "unhtml null");
    s = '';
    equal(utils.unhtml(s), "", "unhtml null");
});
test('cssStyleToDomStyle', function () {
    var utils = te.obj[0];
    equal(utils.cssStyleToDomStyle("cssFloat").toLowerCase(), "cssfloat", "cssFloat");
    if (ua.browser.ie && ua.browser.ie < 9) {
        equal(utils.cssStyleToDomStyle("float").toLowerCase(), "stylefloat", "float");
    } else {
        equal(utils.cssStyleToDomStyle("float").toLowerCase(), "cssfloat", "float");
    }
    equal(utils.cssStyleToDomStyle("styleFloat").toLowerCase(), "stylefloat", "styleFloat");
});

//zhuwenxuan add
test("isEmptyObject", function () {
    var utils = te.obj[0];
    var obj = {
        n: 1
    };
    equal(false, utils.isEmptyObject(obj));
    equal(true, utils.isEmptyObject([]));
    equal(true, utils.isEmptyObject(""));
});
//dong
test("fixColor", function () {
    var utils = te.obj[0];
    equal('#953734', utils.fixColor("color", 'rgb(149, 55, 52)'), 'fixColor');
});
test("sort", function () {
    var utils = te.obj[0];
    same(["a", "df", "sdf", "asdf"], utils.sort(['a', 'asdf', 'df', 'sdf'], function (a, b) {
        if (a.length > b.length)
            return 1;
        else return 0;
    }), 'sort');
});
test("domReady", function () {
    var utils = te.obj[0];
    expect(1);
    utils.domReady(function () {
        ok(1, 'domReady')
    });
});
test('4个padding属性', function () {
//    var css = 'padding-bottom:0px; margin:0px 0px 20px; padding-left:0px; padding-right:4px; padding-top:0px';
    /*上下相同，左右相同*/
    var css = 'padding-bottom:3px;padding-left:2px;padding-right:2px;padding-top:3px';
    var result = UE.utils.optCss(css);
    equal(result, 'padding:3px 2px;', '上下相同，左右相同');
    /*上下不同，左右相同*/
    css = 'padding-bottom:2px;padding-left:2px;padding-right:2px;padding-top:3px';
    result = UE.utils.optCss(css);
    equal(result, 'padding:3px 2px 2px;', '上下不同，左右相同');
    /*只有2个属性*/
    css = 'padding-bottom:2px;padding-left:2px;';
    result = UE.utils.optCss(css);
    equal(result, 'padding-bottom:2px;padding-left:2px;', '2个属性就不合');
});

test('4个margin属性', function () {
    /*上下相同，左右相同*/
    var css = 'margin-bottom:3px;margin-left:2px;margin-right:2px;margin-top:3px';
    var result = UE.utils.optCss(css);
    equal(result, 'margin:3px 2px;', '上下相同，左右相同');
    css = 'margin-bottom:2px;margin-left:2px;margin-right:2px;margin-top:2px';
    result = UE.utils.optCss(css);
    equal(result, 'margin:2px;', '全相同');
    /*上下不同，左右相同*/
    css = 'margin-bottom:2px;margin-left:2px;margin-right:2px;margin-top:3px';
    result = UE.utils.optCss(css);
    equal(result, 'margin:3px 2px 2px;', '上下不同，左右相同');
    /*只有1个属性*/
    css = 'margin-top:2px;';
    result = UE.utils.optCss(css);
    equal(result, 'margin-top:2px;', '1个属性就不合');
});

test('合并;的问题', function () {
    equal(UE.utils.optCss('font-size:12px;&quot;;&lt;dssdfs&gt;;;'), 'font-size:12px;&quot;;&lt;dssdfs&gt;;', '');
});
//test( '合并border相关属性', function () {
////    var css = 'border-width:thin medium;' + //只有border-width
////        'border-top-color:red;border-bottom-color:red;border-left-color:red;' + //3个分属性相同，不应当合
////        'border-right-style:hidden;border-bottom-style:hidden;border-left-style:hidden;border-top-style:hidden';         //4个分属性相同，应当合
////    var result = UE.utils.optCss( css );
////    equal( result, 'border-width:thin medium;border-top-color:red;border-bottom-color:red;border-left-color:red;border-style:hidden' );
////    /*border属性， border不能分别定义4个边框的宽度,颜色和样式,
////    只能统一定义,不可以对四个边设置不同的值,和margin与padding是不同的(后两者可以分别定义四个边的值).*/
////    css = 'border-top:2px hidden red;border-right:2px hidden red';
////    result = UE.utils.optCss(css );
////    equal(result,css,'border2个属性不合');
////    /*4个属性都相同，合*/
////    css = 'border-top:2px hidden red;border-right:2px hidden red;border-left:2px hidden red;border-bottom:2px hidden red';
////    result = UE.utils.optCss(css );
////    equal(result,'border:2px hidden red;','4个属性都相同，合');
////        /*4个属性不同，不合*/
////    css = 'border-top:2px hidden red;border-right:3px hidden red;border-left:2px hidden red;border-bottom:2px hidden red';
////    result = UE.utils.optCss(css );
////    equal(result,'border:2px hidden red;','4个属性不同，不合');
//    var css = 'border-image:initial;'
//} )  ;
//
test('margin，border，padding属性混杂', function () {
    var css = 'margin-bottom:3px;margin-left:2px;margin-right:2px;margin-top:3px;padding:4px;border-image:initial;border-top-color:red;';
    var result = UE.utils.optCss(css);
    equal(result, 'padding:4px;border-top-color:red;margin:3px 2px;', 'margin，border，padding属性混同');

});

test('each 遍历方法', function () {
    var div = te.dom[0];
    div.innerHTML = '<span></span><span></span><span id="a"></span><span></span>';
    UE.utils.each(div.getElementsByTagName('span'), function (node, i) {
        equal(node.tagName, 'SPAN', '遍历nodelist');
    });
    var count = 0;
    UE.utils.each(div.getElementsByTagName('span'), function (node, i) {
        count++;
        if (node.id == 'a')
            return false
    });
    equal(count, 3);
    UE.utils.each(['a', 'b'], function (v, i) {
        equal(v, ['a', 'b'][i], '遍历数组');
    });
    UE.utils.each({a: 1, b: 2}, function (v, k) {
        equal(v, {a: 1, b: 2}[k], '遍历对象');
    });
});
test('clone 转换', function () {
    var obj = {a: 1};
    var obj1 = UE.utils.clone({a: 1});
    obj.a = 2;
    equal(obj1.a, 1);
    obj = {
        a: {
            b: 1
        },
        c: [1, 2]
    }
    obj1 = UE.utils.clone(obj);
    obj.a.b = 2;
    equal(obj1.a.b, 1);
    obj.c[1] = 3;
    equal(obj1.c[1], 2);


});
test('transUnitToPx 转换', function () {
    equal(UE.utils.transUnitToPx('20pt'), '27px');
    equal(UE.utils.transUnitToPx('0pt'), '0');
});

test('RegExp', function () {
    var reg = new RegExp(".*");
    equal(ok(utils.isRegExp(reg), 'reg is a RegExp'));
});

test('isDate', function () {
    var date = new Date();
    equal(ok(utils.isDate(date), 'date is a Date'));
});

test('isCrossDomainUrl', function () {

    var l = location;

    ok(!utils.isCrossDomainUrl(location.href), 'location.href 不跨域');

    if (l.port == '') {
        ok(!utils.isCrossDomainUrl(l.protocol + '//' + l.hostname + ':80/ueditor/'), '本地没端口,80端口不跨域');
    }

    if (l.port == '80') {
        ok(!utils.isCrossDomainUrl(l.protocol + '//' + l.hostname + '/ueditor/'), '本地没80端口,无端口不跨域');
    }

    if (l.protocol == 'http:') {
        ok(utils.isCrossDomainUrl('https://' + l.host + '/ueditor/'), '本地http协议,https协议跨域');
    } else {
        ok(utils.isCrossDomainUrl('http://' + l.host + '/ueditor/'), '本地不是http协议,http协议跨域');
    }

    ok(utils.isCrossDomainUrl(l.protocol + '//www.baidu.com' + ':' + l.port), '域名不一致跨域');

});

test('formatUrl', function () {

    var url1 = 'http://localhost/a.html?&key1=value1&&key2=value2&&&&&&&&&key3=value3&#hash';
    var url2 = 'http://localhost/a.html?&key1=value1&&key2=value2&&&&&&&&&key3=value3&';

    equal(utils.formatUrl(url1), 'http://localhost/a.html?key1=value1&key2=value2&key3=value3#hash', '格式化url');
    equal(utils.formatUrl(url2), 'http://localhost/a.html?key1=value1&key2=value2&key3=value3', '格式化url');

});

test('str2json', function () {

    same(utils.str2json('{"a":11,"b":"22","c":"cc","d":[1,"2","a",{"a":"aa"}],"e":{"k1":1,"k2":"2","k3":"a","k4":{"a":"aa"}}}'),
        {"a": 11, "b": "22", "c": "cc", "d": [1, "2", "a", {"a": "aa"}], "e": {"k1": 1, "k2": "2", "k3": "a", "k4": {"a": "aa"}}},
        '字符串转json对象');

});

test('json2str', function () {

    equal(utils.json2str({"a": 11, "b": "22", "c": "cc", "d": [1, "2", "a", {"a": "aa"}], "e": {"k1": 1, "k2": "2", "k3": "a", "k4": {"a": "aa"}}}),
        '{"a":11,"b":"22","c":"cc","d":[1,"2","a",{"a":"aa"}],"e":{"k1":1,"k2":"2","k3":"a","k4":{"a":"aa"}}}',
        'json对象转字符串');

});
test('json2str 不使用原生方法', function () {
    stop();
    var j = window.JSON;
    var flag = 0;
    ua.readFile("../../../_test/coverage/core/utils.js", function (s) {
        if(s===null)flag = 1;
        window.JSON = null;
        eval(s);
        equal(utils.json2str({"a": 11, "b": "22", "c": "cc", "d": [1, "2", "a", {"a": "aa"}], "e": {"k1": 1, "k2": "2", "k3": "a", "k4": {"a": "aa"}}}),
            '{"a":11,"b":"22","c":"cc","d":[1,"2","a",{"a":"aa"}],"e":{"k1":1,"k2":"2","k3":"a","k4":{"a":"aa"}}}',
            'json对象转字符串');

        window.JSON = j;

    });
    if(flag){
        ua.readFile("../../../_src/core/utils.js", function (s) {
            window.JSON = null;
            eval(s);
            equal(utils.json2str({"a": 11, "b": "22", "c": "cc", "d": [1, "2", "a", {"a": "aa"}], "e": {"k1": 1, "k2": "2", "k3": "a", "k4": {"a": "aa"}}}),
                '{"a":11,"b":"22","c":"cc","d":[1,"2","a",{"a":"aa"}],"e":{"k1":1,"k2":"2","k3":"a","k4":{"a":"aa"}}}',
                'json对象转字符串');

            window.JSON = j;

        });
    }

    setTimeout(function(){start();},50);
});

test('clearEmptyAttrs', function () {
    var utils = te.obj[0];
    var ob = utils.clearEmptyAttrs({a: 1, b: ''});
    ok(!ob.hasOwnProperty('b'), 'clearEmptyAttrs');
});
test('serializeParam', function () {

    equal(utils.serializeParam({
        key1: 'value1',
        key2: 'value2',
        key3: 33,
        key4: '44',
        key5: true,
        key6: null,
        key7: undefined,
        key8: [11, 22, '33', 'aa', true, null]
    }),
        'key1=value1&' +
            'key2=value2&' +
            'key3=33&' +
            'key4=44&' +
            'key5=true&' +
            'key7=undefined&' +
            'key8[]=11&' +
            'key8[]=22&' +
            'key8[]=33&' +
            'key8[]=aa&' +
            'key8[]=true&' +
            'key8[]=null',
        '序列化obj对象为GET请求字符串');

});
