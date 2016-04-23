/**
 * 工具函数包
 * @file
 * @module UE.utils
 * @since 1.2.6.1
 */

/**
 * UEditor封装使用的静态工具函数
 * @module UE.utils
 * @unfile
 */

var utils = UE.utils = {

    /**
     * 用给定的迭代器遍历对象
     * @method each
     * @param { Object } obj 需要遍历的对象
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var demoObj = {
     *     key1: 1,
     *     key2: 2
     * };
     *
     * //output: key1: 1, key2: 2
     * UE.utils.each( demoObj, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value );
     *
     * } );
     * ```
     */

    /**
     * 用给定的迭代器遍历数组或类数组对象
     * @method each
     * @param { Array } array 需要遍历的数组或者类数组
     * @param { Function } iterator 迭代器， 该方法接受两个参数， 第一个参数是当前所处理的value， 第二个参数是当前遍历对象的key
     * @example
     * ```javascript
     * var divs = document.getElmentByTagNames( "div" );
     *
     * //output: 0: DIV, 1: DIV ...
     * UE.utils.each( divs, funciton ( value, key ) {
     *
     *     console.log( key + ":" + value.tagName );
     *
     * } );
     * ```
     */
    each : function(obj, iterator, context) {
        if (obj == null) return;
        if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if(iterator.call(context, obj[i], i, obj) === false)
                    return false;
            }
        } else {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if(iterator.call(context, obj[key], key, obj) === false)
                        return false;
                }
            }
        }
    },

    /**
     * 以给定对象作为原型创建一个新对象
     * @method makeInstance
     * @param { Object } protoObject 该对象将作为新创建对象的原型
     * @return { Object } 新的对象， 该对象的原型是给定的protoObject对象
     * @example
     * ```javascript
     *
     * var protoObject = { sayHello: function () { console.log('Hello UEditor!'); } };
     *
     * var newObject = UE.utils.makeInstance( protoObject );
     * //output: Hello UEditor!
     * newObject.sayHello();
     * ```
     */
    makeInstance:function (obj) {
        var noop = new Function();
        noop.prototype = obj;
        obj = new noop;
        noop.prototype = null;
        return obj;
    },

    /**
     * 将source对象中的属性扩展到target对象上
     * @method extend
     * @remind 该方法将强制把source对象上的属性复制到target对象上
     * @see UE.utils.extend(Object,Object,Boolean)
     * @param { Object } target 目标对象， 新的属性将附加到该对象上
     * @param { Object } source 源对象， 该对象的属性会被附加到target对象上
     * @return { Object } 返回target对象
     * @example
     * ```javascript
     *
     * var target = { name: 'target', sex: 1 },
     *      source = { name: 'source', age: 17 };
     *
     * UE.utils.extend( target, source );
     *
     * //output: { name: 'source', sex: 1, age: 17 }
     * console.log( target );
     *
     * ```
     */

    /**
     * 将source对象中的属性扩展到target对象上， 根据指定的isKeepTarget值决定是否保留目标对象中与
     * 源对象属性名相同的属性值。
     * @method extend
     * @param { Object } target 目标对象， 新的属性将附加到该对象上
     * @param { Object } source 源对象， 该对象的属性会被附加到target对象上
     * @param { Boolean } isKeepTarget 是否保留目标对象中与源对象中属性名相同的属性
     * @return { Object } 返回target对象
     * @example
     * ```javascript
     *
     * var target = { name: 'target', sex: 1 },
     *      source = { name: 'source', age: 17 };
     *
     * UE.utils.extend( target, source, true );
     *
     * //output: { name: 'target', sex: 1, age: 17 }
     * console.log( target );
     *
     * ```
     */
    extend:function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },

    /**
     * 将给定的多个对象的属性复制到目标对象target上
     * @method extend2
     * @remind 该方法将强制把源对象上的属性复制到target对象上
     * @remind 该方法支持两个及以上的参数， 从第二个参数开始， 其属性都会被复制到第一个参数上。 如果遇到同名的属性，
     *          将会覆盖掉之前的值。
     * @param { Object } target 目标对象， 新的属性将附加到该对象上
     * @param { Object... } source 源对象， 支持多个对象， 该对象的属性会被附加到target对象上
     * @return { Object } 返回target对象
     * @example
     * ```javascript
     *
     * var target = {},
     *     source1 = { name: 'source', age: 17 },
     *     source2 = { title: 'dev' };
     *
     * UE.utils.extend2( target, source1, source2 );
     *
     * //output: { name: 'source', age: 17, title: 'dev' }
     * console.log( target );
     *
     * ```
     */
    extend2:function (t) {
        var a = arguments;
        for (var i = 1; i < a.length; i++) {
            var x = a[i];
            for (var k in x) {
                if (!t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    },

    /**
     * 模拟继承机制， 使得subClass继承自superClass
     * @method inherits
     * @param { Object } subClass 子类对象
     * @param { Object } superClass 超类对象
     * @warning 该方法只能让subClass继承超类的原型， subClass对象自身的属性和方法不会被继承
     * @return { Object } 继承superClass后的子类对象
     * @example
     * ```javascript
     * function SuperClass(){
     *     this.name = "小李";
     * }
     *
     * SuperClass.prototype = {
     *     hello:function(str){
     *         console.log(this.name + str);
     *     }
     * }
     *
     * function SubClass(){
     *     this.name = "小张";
     * }
     *
     * UE.utils.inherits(SubClass,SuperClass);
     *
     * var sub = new SubClass();
     * //output: '小张早上好!
     * sub.hello("早上好!");
     * ```
     */
    inherits:function (subClass, superClass) {
        var oldP = subClass.prototype,
            newP = utils.makeInstance(superClass.prototype);
        utils.extend(newP, oldP, true);
        subClass.prototype = newP;
        return (newP.constructor = subClass);
    },

    /**
     * 用指定的context对象作为函数fn的上下文
     * @method bind
     * @param { Function } fn 需要绑定上下文的函数对象
     * @param { Object } content 函数fn新的上下文对象
     * @return { Function } 一个新的函数， 该函数作为原始函数fn的代理， 将完成fn的上下文调换工作。
     * @example
     * ```javascript
     *
     * var name = 'window',
     *     newTest = null;
     *
     * function test () {
     *     console.log( this.name );
     * }
     *
     * newTest = UE.utils.bind( test, { name: 'object' } );
     *
     * //output: object
     * newTest();
     *
     * //output: window
     * test();
     *
     * ```
     */
    bind:function (fn, context) {
        return function () {
            return fn.apply(context, arguments);
        };
    },

    /**
     * 创建延迟指定时间后执行的函数fn
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     * var start = 0;
     *
     * function test(){
     *     console.log( new Date() - start );
     * }
     *
     * var testDefer = UE.utils.defer( test, 1000 );
     * //
     * start = new Date();
     * //output: (大约在1000毫秒之后输出) 1000
     * testDefer();
     * ```
     */

    /**
     * 创建延迟指定时间后执行的函数fn, 如果在延迟时间内再次执行该方法， 将会根据指定的exclusion的值，
     * 决定是否取消前一次函数的执行， 如果exclusion的值为true， 则取消执行，反之，将继续执行前一个方法。
     * @method defer
     * @param { Function } fn 需要延迟执行的函数对象
     * @param { int } delay 延迟的时间， 单位是毫秒
     * @param { Boolean } exclusion 如果在延迟时间内再次执行该函数，该值将决定是否取消执行前一次函数的执行，
     *                     值为true表示取消执行， 反之则将在执行前一次函数之后才执行本次函数调用。
     * @warning 该方法的时间控制是不精确的，仅仅只能保证函数的执行是在给定的时间之后，
     *           而不能保证刚好到达延迟时间时执行。
     * @return { Function } 目标函数fn的代理函数， 只有执行该函数才能起到延时效果
     * @example
     * ```javascript
     *
     * function test(){
     *     console.log(1);
     * }
     *
     * var testDefer = UE.utils.defer( test, 1000, true );
     *
     * //output: (两次调用仅有一次输出) 1
     * testDefer();
     * testDefer();
     * ```
     */
    defer:function (fn, delay, exclusion) {
        var timerID;
        return function () {
            if (exclusion) {
                clearTimeout(timerID);
            }
            timerID = setTimeout(fn, delay);
        };
    },

    /**
     * 获取元素item在数组array中首次出现的位置, 如果未找到item， 则返回-1
     * @method indexOf
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @param { Array } array 需要查找的数组对象
     * @param { * } item 需要在目标数组中查找的值
     * @return { int } 返回item在目标数组array中首次出现的位置， 如果在数组中未找到item， 则返回-1
     * @example
     * ```javascript
     * var item = 1,
     *     arr = [ 3, 4, 6, 8, 1, 1, 2 ];
     *
     * //output: 4
     * console.log( UE.utils.indexOf( arr, item ) );
     * ```
     */

    /**
     * 获取元素item数组array中首次出现的位置, 如果未找到item， 则返回-1。通过start的值可以指定搜索的起始位置。
     * @method indexOf
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @param { Array } array 需要查找的数组对象
     * @param { * } item 需要在目标数组中查找的值
     * @param { int } start 搜索的起始位置
     * @return { int } 返回item在目标数组array中的start位置之后首次出现的位置， 如果在数组中未找到item， 则返回-1
     * @example
     * ```javascript
     * var item = 1,
     *     arr = [ 3, 4, 6, 8, 1, 2, 8, 3, 2, 1, 1, 4 ];
     *
     * //output: 9
     * console.log( UE.utils.indexOf( arr, item, 5 ) );
     * ```
     */
    indexOf:function (array, item, start) {
        var index = -1;
        start = this.isNumber(start) ? start : 0;
        this.each(array, function (v, i) {
            if (i >= start && v === item) {
                index = i;
                return false;
            }
        });
        return index;
    },

    /**
     * 移除数组array中所有的元素item
     * @method removeItem
     * @param { Array } array 要移除元素的目标数组
     * @param { * } item 将要被移除的元素
     * @remind 该方法的匹配过程使用的是恒等“===”
     * @example
     * ```javascript
     * var arr = [ 4, 5, 7, 1, 3, 4, 6 ];
     *
     * UE.utils.removeItem( arr, 4 );
     * //output: [ 5, 7, 1, 3, 6 ]
     * console.log( arr );
     *
     * ```
     */
    removeItem:function (array, item) {
        for (var i = 0, l = array.length; i < l; i++) {
            if (array[i] === item) {
                array.splice(i, 1);
                i--;
            }
        }
    },

    /**
     * 删除字符串str的首尾空格
     * @method trim
     * @param { String } str 需要删除首尾空格的字符串
     * @return { String } 删除了首尾的空格后的字符串
     * @example
     * ```javascript
     *
     * var str = " UEdtior ";
     *
     * //output: 9
     * console.log( str.length );
     *
     * //output: 7
     * console.log( UE.utils.trim( " UEdtior " ).length );
     *
     * //output: 9
     * console.log( str.length );
     *
     *  ```
     */
    trim:function (str) {
        return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
    },

    /**
     * 将字符串str以','分隔成数组后，将该数组转换成哈希对象， 其生成的hash对象的key为数组中的元素， value为1
     * @method listToMap
     * @warning 该方法在生成的hash对象中，会为每一个key同时生成一个另一个全大写的key。
     * @param { String } str 该字符串将被以','分割为数组， 然后进行转化
     * @return { Object } 转化之后的hash对象
     * @example
     * ```javascript
     *
     * //output: Object {UEdtior: 1, UEDTIOR: 1, Hello: 1, HELLO: 1}
     * console.log( UE.utils.listToMap( 'UEdtior,Hello' ) );
     *
     * ```
     */

    /**
     * 将字符串数组转换成哈希对象， 其生成的hash对象的key为数组中的元素， value为1
     * @method listToMap
     * @warning 该方法在生成的hash对象中，会为每一个key同时生成一个另一个全大写的key。
     * @param { Array } arr 字符串数组
     * @return { Object } 转化之后的hash对象
     * @example
     * ```javascript
     *
     * //output: Object {UEdtior: 1, UEDTIOR: 1, Hello: 1, HELLO: 1}
     * console.log( UE.utils.listToMap( [ 'UEdtior', 'Hello' ] ) );
     *
     * ```
     */
    listToMap:function (list) {
        if (!list)return {};
        list = utils.isArray(list) ? list : list.split(',');
        for (var i = 0, ci, obj = {}; ci = list[i++];) {
            obj[ci.toUpperCase()] = obj[ci] = 1;
        }
        return obj;
    },

    /**
     * 将str中的html符号转义,将转义“'，&，<，"，>，”，“”七个字符
     * @method unhtml
     * @param { String } str 需要转义的字符串
     * @return { String } 转义后的字符串
     * @example
     * ```javascript
     * var html = '<body>&</body>';
     *
     * //output: &lt;body&gt;&amp;&lt;/body&gt;
     * console.log( UE.utils.unhtml( html ) );
     *
     * ```
     */
    unhtml:function (str, reg) {
        return str ? str.replace(reg || /[&<">'](?:(amp|lt|ldquo|rdquo|quot|gt|#39|nbsp|#\d+);)?/g, function (a, b) {
            if (b) {
                return a;
            } else {
                return {
                    '<':'&lt;',
                    '&':'&amp;',
                    '"':'&quot;',
                     '“':'&ldquo;',
                    '”':'&rdquo;',
                    '>':'&gt;',
                    "'":'&#39;'
                }[a]
            }

        }) : '';
    },

    /**
     * 将str中的转义字符还原成html字符
     * @see UE.utils.unhtml(String);
     * @method html
     * @param { String } str 需要逆转义的字符串
     * @return { String } 逆转义后的字符串
     * @example
     * ```javascript
     *
     * var str = '&lt;body&gt;&amp;&lt;/body&gt;';
     *
     * //output: <body>&</body>
     * console.log( UE.utils.html( str ) );
     *
     * ```
     */
    html:function (str) {
        return str ? str.replace(/&((g|l|quo|ldquo|rdquo)t|amp|#39|nbsp);/g, function (m) {
            return {
                '&lt;':'<',
                '&amp;':'&',
                '&quot;':'"',
                '&ldquo;':'“',
                '&rdquo;':'”',  
                '&gt;':'>',
                '&#39;':"'",
                '&nbsp;':' '
            }[m]
        }) : '';
    },

    /**
     * 将css样式转换为驼峰的形式
     * @method cssStyleToDomStyle
     * @param { String } cssName 需要转换的css样式名
     * @return { String } 转换成驼峰形式后的css样式名
     * @example
     * ```javascript
     *
     * var str = 'border-top';
     *
     * //output: borderTop
     * console.log( UE.utils.cssStyleToDomStyle( str ) );
     *
     * ```
     */
    cssStyleToDomStyle:function () {
        var test = document.createElement('div').style,
            cache = {
                'float':test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat' : 'float'
            };

        return function (cssName) {
            return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function (match) {
                return match.charAt(1).toUpperCase();
            }));
        };
    }(),

    /**
     * 动态加载文件到doc中
     * @method loadFile
     * @param { DomDocument } document 需要加载资源文件的文档对象
     * @param { Object } options 加载资源文件的属性集合， 取值请参考代码示例
     * @example
     * ```javascript
     *
     * UE.utils.loadFile( document, {
     *     src:"test.js",
     *     tag:"script",
     *     type:"text/javascript",
     *     defer:"defer"
     * } );
     *
     * ```
     */

    /**
     * 动态加载文件到doc中，加载成功后执行的回调函数fn
     * @method loadFile
     * @param { DomDocument } document 需要加载资源文件的文档对象
     * @param { Object } options 加载资源文件的属性集合， 该集合支持的值是script标签和style标签支持的所有属性。
     * @param { Function } fn 资源文件加载成功之后执行的回调
     * @warning 对于在同一个文档中多次加载同一URL的文件， 该方法会在第一次加载之后缓存该请求，
     *           在此之后的所有同一URL的请求， 将会直接触发回调。
     * @example
     * ```javascript
     *
     * UE.utils.loadFile( document, {
     *     src:"test.js",
     *     tag:"script",
     *     type:"text/javascript",
     *     defer:"defer"
     * }, function () {
     *     console.log('加载成功');
     * } );
     *
     * ```
     */
    loadFile:function () {
        var tmpList = [];

        function getItem(doc, obj) {
            try {
                for (var i = 0, ci; ci = tmpList[i++];) {
                    if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                        return ci;
                    }
                }
            } catch (e) {
                return null;
            }

        }

        return function (doc, obj, fn) {
            var item = getItem(doc, obj);
            if (item) {
                if (item.ready) {
                    fn && fn();
                } else {
                    item.funs.push(fn)
                }
                return;
            }
            tmpList.push({
                doc:doc,
                url:obj.src || obj.href,
                funs:[fn]
            });
            if (!doc.body) {
                var html = [];
                for (var p in obj) {
                    if (p == 'tag')continue;
                    html.push(p + '="' + obj[p] + '"')
                }
                doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
                return;
            }
            if (obj.id && doc.getElementById(obj.id)) {
                return;
            }
            var element = doc.createElement(obj.tag);
            delete obj.tag;
            for (var p in obj) {
                element.setAttribute(p, obj[p]);
            }
            element.onload = element.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    item = getItem(doc, obj);
                    if (item.funs.length > 0) {
                        item.ready = 1;
                        for (var fi; fi = item.funs.pop();) {
                            fi();
                        }
                    }
                    element.onload = element.onreadystatechange = null;
                }
            };
            element.onerror = function () {
                throw Error('The load ' + (obj.href || obj.src) + ' fails,check the url settings of file ueditor.config.js ')
            };
            doc.getElementsByTagName("head")[0].appendChild(element);
        }
    }(),

    /**
     * 判断obj对象是否为空
     * @method isEmptyObject
     * @param { * } obj 需要判断的对象
     * @remind 如果判断的对象是NULL， 将直接返回true， 如果是数组且为空， 返回true， 如果是字符串， 且字符串为空，
     *          返回true， 如果是普通对象， 且该对象没有任何实例属性， 返回true
     * @return { Boolean } 对象是否为空
     * @example
     * ```javascript
     *
     * //output: true
     * console.log( UE.utils.isEmptyObject( {} ) );
     *
     * //output: true
     * console.log( UE.utils.isEmptyObject( [] ) );
     *
     * //output: true
     * console.log( UE.utils.isEmptyObject( "" ) );
     *
     * //output: false
     * console.log( UE.utils.isEmptyObject( { key: 1 } ) );
     *
     * //output: false
     * console.log( UE.utils.isEmptyObject( [1] ) );
     *
     * //output: false
     * console.log( UE.utils.isEmptyObject( "1" ) );
     *
     * ```
     */
    isEmptyObject:function (obj) {
        if (obj == null) return true;
        if (this.isArray(obj) || this.isString(obj)) return obj.length === 0;
        for (var key in obj) if (obj.hasOwnProperty(key)) return false;
        return true;
    },

    /**
     * 把rgb格式的颜色值转换成16进制格式
     * @method fixColor
     * @param { String } rgb格式的颜色值
     * @param { String }
     * @example
     * rgb(255,255,255)  => "#ffffff"
     */
    fixColor:function (name, value) {
        if (/color/i.test(name) && /rgba?/.test(value)) {
            var array = value.split(",");
            if (array.length > 3)
                return "";
            value = "#";
            for (var i = 0, color; color = array[i++];) {
                color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                value += color.length == 1 ? "0" + color : color;
            }
            value = value.toUpperCase();
        }
        return  value;
    },
    /**
     * 只针对border,padding,margin做了处理，因为性能问题
     * @public
     * @function
     * @param {String}    val style字符串
     */
    optCss:function (val) {
        var padding, margin, border;
        val = val.replace(/(padding|margin|border)\-([^:]+):([^;]+);?/gi, function (str, key, name, val) {
            if (val.split(' ').length == 1) {
                switch (key) {
                    case 'padding':
                        !padding && (padding = {});
                        padding[name] = val;
                        return '';
                    case 'margin':
                        !margin && (margin = {});
                        margin[name] = val;
                        return '';
                    case 'border':
                        return val == 'initial' ? '' : str;
                }
            }
            return str;
        });

        function opt(obj, name) {
            if (!obj) {
                return '';
            }
            var t = obj.top , b = obj.bottom, l = obj.left, r = obj.right, val = '';
            if (!t || !l || !b || !r) {
                for (var p in obj) {
                    val += ';' + name + '-' + p + ':' + obj[p] + ';';
                }
            } else {
                val += ';' + name + ':' +
                    (t == b && b == l && l == r ? t :
                        t == b && l == r ? (t + ' ' + l) :
                            l == r ? (t + ' ' + l + ' ' + b) : (t + ' ' + r + ' ' + b + ' ' + l)) + ';'
            }
            return val;
        }

        val += opt(padding, 'padding') + opt(margin, 'margin');
        return val.replace(/^[ \n\r\t;]*|[ \n\r\t]*$/, '').replace(/;([ \n\r\t]+)|\1;/g, ';')
            .replace(/(&((l|g)t|quot|#39))?;{2,}/g, function (a, b) {
                return b ? b + ";;" : ';'
            });
    },

    /**
     * 克隆对象
     * @method clone
     * @param { Object } source 源对象
     * @return { Object } source的一个副本
     */

    /**
     * 深度克隆对象，将source的属性克隆到target对象， 会覆盖target重名的属性。
     * @method clone
     * @param { Object } source 源对象
     * @param { Object } target 目标对象
     * @return { Object } 附加了source对象所有属性的target对象
     */
    clone:function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = utils.isArray(tmp) ? [] : {};
                    utils.clone(source[i], target[i])
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },

    /**
     * 把cm／pt为单位的值转换为px为单位的值
     * @method transUnitToPx
     * @param { String } 待转换的带单位的字符串
     * @return { String } 转换为px为计量单位的值的字符串
     * @example
     * ```javascript
     *
     * //output: 500px
     * console.log( UE.utils.transUnitToPx( '20cm' ) );
     *
     * //output: 27px
     * console.log( UE.utils.transUnitToPx( '20pt' ) );
     *
     * ```
     */
    transUnitToPx:function (val) {
        if (!/(pt|cm)/.test(val)) {
            return val
        }
        var unit;
        val.replace(/([\d.]+)(\w+)/, function (str, v, u) {
            val = v;
            unit = u;
        });
        switch (unit) {
            case 'cm':
                val = parseFloat(val) * 25;
                break;
            case 'pt':
                val = Math.round(parseFloat(val) * 96 / 72);
        }
        return val + (val ? 'px' : '');
    },

    /**
     * 在dom树ready之后执行给定的回调函数
     * @method domReady
     * @remind 如果在执行该方法的时候， dom树已经ready， 那么回调函数将立刻执行
     * @param { Function } fn dom树ready之后的回调函数
     * @example
     * ```javascript
     *
     * UE.utils.domReady( function () {
     *
     *     console.log('123');
     *
     * } );
     *
     * ```
     */
    domReady:function () {

        var fnArr = [];

        function doReady(doc) {
            //确保onready只执行一次
            doc.isReady = true;
            for (var ci; ci = fnArr.pop(); ci()) {
            }
        }

        return function (onready, win) {
            win = win || window;
            var doc = win.document;
            onready && fnArr.push(onready);
            if (doc.readyState === "complete") {
                doReady(doc);
            } else {
                doc.isReady && doReady(doc);
                if (browser.ie && browser.version != 11) {
                    (function () {
                        if (doc.isReady) return;
                        try {
                            doc.documentElement.doScroll("left");
                        } catch (error) {
                            setTimeout(arguments.callee, 0);
                            return;
                        }
                        doReady(doc);
                    })();
                    win.attachEvent('onload', function () {
                        doReady(doc)
                    });
                } else {
                    doc.addEventListener("DOMContentLoaded", function () {
                        doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                        doReady(doc);
                    }, false);
                    win.addEventListener('load', function () {
                        doReady(doc)
                    }, false);
                }
            }

        }
    }(),

    /**
     * 动态添加css样式
     * @method cssRule
     * @param { String } 节点名称
     * @grammar UE.utils.cssRule('添加的样式的节点名称',['样式'，'放到哪个document上'])
     * @grammar UE.utils.cssRule('body','body{background:#ccc}') => null  //给body添加背景颜色
     * @grammar UE.utils.cssRule('body') =>样式的字符串  //取得key值为body的样式的内容,如果没有找到key值先关的样式将返回空，例如刚才那个背景颜色，将返回 body{background:#ccc}
     * @grammar UE.utils.cssRule('body',document) => 返回指定key的样式，并且指定是哪个document
     * @grammar UE.utils.cssRule('body','') =>null //清空给定的key值的背景颜色
     */
    cssRule:browser.ie && browser.version != 11 ? function (key, style, doc) {
        var indexList, index;
        if(style === undefined || style && style.nodeType && style.nodeType == 9){
            //获取样式
            doc = style && style.nodeType && style.nodeType == 9 ? style : (doc || document);
            indexList = doc.indexList || (doc.indexList = {});
            index = indexList[key];
            if(index !==  undefined){
                return doc.styleSheets[index].cssText
            }
            return undefined;
        }
        doc = doc || document;
        indexList = doc.indexList || (doc.indexList = {});
        index = indexList[key];
        //清除样式
        if(style === ''){
            if(index!== undefined){
                doc.styleSheets[index].cssText = '';
                delete indexList[key];
                return true
            }
            return false;
        }

        //添加样式
        if(index!== undefined){
            sheetStyle =  doc.styleSheets[index];
        }else{
            sheetStyle = doc.createStyleSheet('', index = doc.styleSheets.length);
            indexList[key] = index;
        }
        sheetStyle.cssText = style;
    }: function (key, style, doc) {
        var head, node;
        if(style === undefined || style && style.nodeType && style.nodeType == 9){
            //获取样式
            doc = style && style.nodeType && style.nodeType == 9 ? style : (doc || document);
            node = doc.getElementById(key);
            return node ? node.innerHTML : undefined;
        }
        doc = doc || document;
        node = doc.getElementById(key);

        //清除样式
        if(style === ''){
            if(node){
                node.parentNode.removeChild(node);
                return true
            }
            return false;
        }

        //添加样式
        if(node){
            node.innerHTML = style;
        }else{
            node = doc.createElement('style');
            node.id = key;
            node.innerHTML = style;
            doc.getElementsByTagName('head')[0].appendChild(node);
        }
    },
    sort:function(array,compareFn){
        compareFn = compareFn || function(item1, item2){ return item1.localeCompare(item2);};
        for(var i= 0,len = array.length; i<len; i++){
            for(var j = i,length = array.length; j<length; j++){
                if(compareFn(array[i], array[j]) > 0){
                    var t = array[i];
                    array[i] = array[j];
                    array[j] = t;
                }
            }
        }
        return array;
    },
    serializeParam:function (json) {
        var strArr = [];
        for (var i in json) {
            //忽略默认的几个参数
            if(i=="method" || i=="timeout" || i=="async") continue;
            //传递过来的对象和函数不在提交之列
            if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
                strArr.push( encodeURIComponent(i) + "="+encodeURIComponent(json[i]) );
            } else if (utils.isArray(json[i])) {
                //支持传数组内容
                for(var j = 0; j < json[i].length; j++) {
                    strArr.push( encodeURIComponent(i) + "[]="+encodeURIComponent(json[i][j]) );
                }
            }
        }
        return strArr.join("&");
    },
    formatUrl:function (url) {
        var u = url.replace(/&&/g, '&');
        u = u.replace(/\?&/g, '?');
        u = u.replace(/&$/g, '');
        u = u.replace(/&#/g, '#');
        u = u.replace(/&+/g, '&');
        return u;
    },
    isCrossDomainUrl:function (url) {
        var a = document.createElement('a');
        a.href = url;
        if (browser.ie) {
            a.href = a.href;
        }
        return !(a.protocol == location.protocol && a.hostname == location.hostname &&
        (a.port == location.port || (a.port == '80' && location.port == '') || (a.port == '' && location.port == '80')));
    },
    clearEmptyAttrs : function(obj){
        for(var p in obj){
            if(obj[p] === ''){
                delete obj[p]
            }
        }
        return obj;
    },
    str2json : function(s){

        if (!utils.isString(s)) return null;
        if (window.JSON) {
            return JSON.parse(s);
        } else {
            return (new Function("return " + utils.trim(s || '')))();
        }

    },
    json2str : (function(){

        if (window.JSON) {

            return JSON.stringify;

        } else {

            var escapeMap = {
                "\b": '\\b',
                "\t": '\\t',
                "\n": '\\n',
                "\f": '\\f',
                "\r": '\\r',
                '"' : '\\"',
                "\\": '\\\\'
            };

            function encodeString(source) {
                if (/["\\\x00-\x1f]/.test(source)) {
                    source = source.replace(
                        /["\\\x00-\x1f]/g,
                        function (match) {
                            var c = escapeMap[match];
                            if (c) {
                                return c;
                            }
                            c = match.charCodeAt();
                            return "\\u00"
                            + Math.floor(c / 16).toString(16)
                            + (c % 16).toString(16);
                        });
                }
                return '"' + source + '"';
            }

            function encodeArray(source) {
                var result = ["["],
                    l = source.length,
                    preComma, i, item;

                for (i = 0; i < l; i++) {
                    item = source[i];

                    switch (typeof item) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if(preComma) {
                                result.push(',');
                            }
                            result.push(utils.json2str(item));
                            preComma = 1;
                    }
                }
                result.push("]");
                return result.join("");
            }

            function pad(source) {
                return source < 10 ? '0' + source : source;
            }

            function encodeDate(source){
                return '"' + source.getFullYear() + "-"
                + pad(source.getMonth() + 1) + "-"
                + pad(source.getDate()) + "T"
                + pad(source.getHours()) + ":"
                + pad(source.getMinutes()) + ":"
                + pad(source.getSeconds()) + '"';
            }

            return function (value) {
                switch (typeof value) {
                    case 'undefined':
                        return 'undefined';

                    case 'number':
                        return isFinite(value) ? String(value) : "null";

                    case 'string':
                        return encodeString(value);

                    case 'boolean':
                        return String(value);

                    default:
                        if (value === null) {
                            return 'null';
                        } else if (utils.isArray(value)) {
                            return encodeArray(value);
                        } else if (utils.isDate(value)) {
                            return encodeDate(value);
                        } else {
                            var result = ['{'],
                                encode = utils.json2str,
                                preComma,
                                item;

                            for (var key in value) {
                                if (Object.prototype.hasOwnProperty.call(value, key)) {
                                    item = value[key];
                                    switch (typeof item) {
                                        case 'undefined':
                                        case 'unknown':
                                        case 'function':
                                            break;
                                        default:
                                            if (preComma) {
                                                result.push(',');
                                            }
                                            preComma = 1;
                                            result.push(encode(key) + ':' + encode(item));
                                    }
                                }
                            }
                            result.push('}');
                            return result.join('');
                        }
                }
            };
        }

    })()

};
/**
 * 判断给定的对象是否是字符串
 * @method isString
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是字符串
 */

/**
 * 判断给定的对象是否是数组
 * @method isArray
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是数组
 */

/**
 * 判断给定的对象是否是一个Function
 * @method isFunction
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Function
 */

/**
 * 判断给定的对象是否是Number
 * @method isNumber
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是Number
 */

/**
 * 判断给定的对象是否是一个正则表达式
 * @method isRegExp
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是正则表达式
 */

/**
 * 判断给定的对象是否是一个普通对象
 * @method isObject
 * @param { * } object 需要判断的对象
 * @return { Boolean } 给定的对象是否是普通对象
 */
utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Date'], function (v) {
    UE.utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    }
});
