(function() {
    UEDITOR_CONFIG = window.UEDITOR_CONFIG || {};

    var baidu = window.baidu || {};

    window.baidu = baidu;

    window.UE = baidu.editor = {};

    UE.plugins = {};

    UE.commands = {};

    UE.instants = {};

    UE.I18N = {};

    UE.version = "1.2.4.0";

    var dom = UE.dom = {};
    /**
 * @file
 * @name UE.browser
 * @short Browser
 * @desc UEditor中采用的浏览器判断模块
 */
    var browser = UE.browser = function() {
        var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
            /**
         * 检测浏览器是否为IE
         * @name ie
         * @grammar UE.browser.ie  => true|false
         */
            ie: !!window.ActiveXObject,

            /**
         * 检测浏览器是否为Opera
         * @name opera
         * @grammar UE.browser.opera  => true|false
         */
            opera: (!!opera && opera.version),

            /**
         * 检测浏览器是否为webkit内核
         * @name webkit
         * @grammar UE.browser.webkit  => true|false
         */
            webkit: (agent.indexOf(' applewebkit/') > -1),

            /**
         * 检测浏览器是否为mac系统下的浏览器
         * @name mac
         * @grammar UE.browser.mac  => true|false
         */
            mac: (agent.indexOf('macintosh') > -1),

            /**
         * 检测浏览器是否处于怪异模式
         * @name quirks
         * @grammar UE.browser.quirks  => true|false
         */
            quirks: (document.compatMode == 'BackCompat')
        };
        /**
     * 检测浏览器是否处为gecko内核
     * @name gecko
     * @grammar UE.browser.gecko  => true|false
     */
        browser.gecko = (navigator.product == 'Gecko' && !browser.webkit && !browser.opera);

        var version = 0;

        // Internet Explorer 6.0+
        if (browser.ie) {
            version = parseFloat(agent.match(/msie (\d+)/)[1]);
            /**
         * 检测浏览器是否为 IE9 模式
         * @name ie9Compat
         * @grammar UE.browser.ie9Compat  => true|false
         */
            browser.ie9Compat = document.documentMode == 9;
            /**
         * 检测浏览器是否为 IE8 浏览器
         * @name ie8
         * @grammar     UE.browser.ie8  => true|false
         */
            browser.ie8 = !!document.documentMode;

            /**
         * 检测浏览器是否为 IE8 模式
         * @name ie8Compat
         * @grammar     UE.browser.ie8Compat  => true|false
         */
            browser.ie8Compat = document.documentMode == 8;

            /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name ie7Compat
         * @grammar     UE.browser.ie7Compat  => true|false
         */
            browser.ie7Compat = ((version == 7 && !document.documentMode)
            || document.documentMode == 7);

            /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name ie6Compat
         * @grammar     UE.browser.ie6Compat  => true|false
         */
            browser.ie6Compat = (version < 7 || browser.quirks);

        }

        // Gecko.
        if (browser.gecko) {
            var geckoRelease = agent.match(/rv:([\d\.]+)/);
            if (geckoRelease)
            {
                geckoRelease = geckoRelease[1].split('.');
                version = geckoRelease[0] * 10000 + (geckoRelease[1] || 0) * 100 + (geckoRelease[2] || 0) * 1;
            }
        }
        /**
     * 检测浏览器是否为chrome
     * @name chrome
     * @grammar     UE.browser.chrome  => true|false
     */
        if (/chrome\/(\d+\.\d)/i.test(agent)) {
            browser.chrome = +RegExp['\x241'];
        }
        /**
     * 检测浏览器是否为safari
     * @name safari
     * @grammar     UE.browser.safari  => true|false
     */
        if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
            browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
        }


        // Opera 9.50+
        if (browser.opera)
            version = parseFloat(opera.version());

        // WebKit 522+ (Safari 3+)
        if (browser.webkit)
            version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);

        /**
     * 浏览器版本判断
     * IE系列返回值为5,6,7,8,9,10等
     * gecko系列会返回10900，158900等.
     * webkit系列会返回其build号 (如 522等).
     * @name version
     * @grammar     UE.browser.version  => number
     * @example
     * if ( UE.browser.ie && UE.browser.version == 6 ){
     *     alert( "Ouch!居然是万恶的IE6!" );
     * }
     */
        browser.version = version;

        /**
     * 是否是兼容模式的浏览器
     * @name isCompatible
     * @grammar  UE.browser.isCompatible  => true|false
     * @example
     * if ( UE.browser.isCompatible ){
     *     alert( "你的浏览器相当不错哦！" );
     * }
     */
        browser.isCompatible =
        !browser.mobile && (
        (browser.ie && version >= 6) ||
        (browser.gecko && version >= 10801) ||
        (browser.opera && version >= 9.5) ||
        (browser.air && version >= 1) ||
        (browser.webkit && version >= 522) ||
        false);
        return browser;
    }();
    //快捷方式
    var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;
    /**
 * @file
 * @name UE.Utils
 * @short Utils
 * @desc UEditor封装使用的静态工具函数
 * @import editor.js
 */
    var utils = UE.utils = {
        /**
     * 遍历数组，对象，nodeList
     * @name each
     * @grammar UE.utils.each(obj,iterator,[context])
     * @since 1.2.4+
     * @desc
     * * obj 要遍历的对象
     * * iterator 遍历的方法,方法的第一个是遍历的值，第二个是索引，第三个是obj
     * * context  iterator的上下文
     * @example
     * UE.utils.each([1,2],function(v,i){
     *     console.log(v)//值
     *     console.log(i)//索引
     * })
     * UE.utils.each(document.getElementsByTagName('*'),function(n){
     *     console.log(n.tagName)
     * })
     */
        each: function(obj, iterator, context) {
            if (obj == null)
                return;
            if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
                obj.forEach(iterator, context);
            } else if (obj.length === +obj.length) {
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === false)
                        return;
                }
            } else {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (iterator.call(context, obj[key], key, obj) === false)
                            return
                    }
                }
            }
        },

        makeInstance: function(obj) {
            var noop = new Function();
            noop.prototype = obj;
            obj = new noop;
            noop.prototype = null;
            return obj;
        },
        /**
     * 将source对象中的属性扩展到target对象上
     * @name extend
     * @grammar UE.utils.extend(target,source)  => Object  //覆盖扩展
     * @grammar UE.utils.extend(target,source,true)  ==> Object  //保留扩展
     */
        extend: function(t, s, b) {
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
     * 模拟继承机制，subClass继承superClass
     * @name inherits
     * @grammar UE.utils.inherits(subClass,superClass) => subClass
     * @example
     * function SuperClass(){
     *     this.name = "小李";
     * }
     * SuperClass.prototype = {
     *     hello:function(str){
     *         console.log(this.name + str);
     *     }
     * }
     * function SubClass(){
     *     this.name = "小张";
     * }
     * UE.utils.inherits(SubClass,SuperClass);
     * var sub = new SubClass();
     * sub.hello("早上好!"); ==> "小张早上好！"
     */
        inherits: function(subClass, superClass) {
            var oldP = subClass.prototype,
            newP = utils.makeInstance(superClass.prototype);
            utils.extend(newP, oldP, true);
            subClass.prototype = newP;
            return (newP.constructor = subClass);
        },

        /**
     * 用指定的context作为fn上下文，也就是this
     * @name bind
     * @grammar UE.utils.bind(fn,context)  =>  fn
     */
        bind: function(fn, context) {
            return function() {
                return fn.apply(context, arguments);
            };
        },

        /**
     * 创建延迟delay执行的函数fn
     * @name defer
     * @grammar UE.utils.defer(fn,delay)  =>fn   //延迟delay毫秒执行fn，返回fn
     * @grammar UE.utils.defer(fn,delay,exclusion)  =>fn   //延迟delay毫秒执行fn，若exclusion为真，则互斥执行fn
     * @example
     * function test(){
     *     console.log("延迟输出！");
     * }
     * //非互斥延迟执行
     * var testDefer = UE.utils.defer(test,1000);
     * testDefer();   =>  "延迟输出！";
     * testDefer();   =>  "延迟输出！";
     * //互斥延迟执行
     * var testDefer1 = UE.utils.defer(test,1000,true);
     * testDefer1();   =>  //本次不执行
     * testDefer1();   =>  "延迟输出！";
     */
        defer: function(fn, delay, exclusion) {
            var timerID;
            return function() {
                if (exclusion) {
                    clearTimeout(timerID);
                }
                timerID = setTimeout(fn, delay);
            };
        },

        /**
     * 查找元素item在数组array中的索引, 若找不到返回-1
     * @name indexOf
     * @grammar UE.utils.indexOf(array,item)  => index|-1  //默认从数组开头部开始搜索
     * @grammar UE.utils.indexOf(array,item,start)  => index|-1  //start指定开始查找的位置
     */
        indexOf: function(array, item, start) {
            var index = -1;
            start = this.isNumber(start) ? start : 0;
            this.each(array, function(v, i) {
                if (i >= start && v === item) {
                    index = i;
                    return false;
                }
            });
            return index;
        },

        /**
     * 移除数组array中的元素item
     * @name removeItem
     * @grammar UE.utils.removeItem(array,item)
     */
        removeItem: function(array, item) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (array[i] === item) {
                    array.splice(i, 1);
                    i--;
                }
            }
        },

        /**
     * 删除字符串str的首尾空格
     * @name trim
     * @grammar UE.utils.trim(str) => String
     */
        trim: function(str) {
            return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
        },

        /**
     * 将字符串list(以','分隔)或者数组list转成哈希对象
     * @name listToMap
     * @grammar UE.utils.listToMap(list)  => Object  //Object形如{test:1,br:1,textarea:1}
     */
        listToMap: function(list) {
            if (!list)
                return {};
            list = utils.isArray(list) ? list : list.split(',');
            for (var i = 0, ci, obj = {}; ci = list[i++]; ) {
                obj[ci.toUpperCase()] = obj[ci] = 1;
            }
            return obj;
        },

        /**
     * 将str中的html符号转义,默认将转义''&<">''四个字符，可自定义reg来确定需要转义的字符
     * @name unhtml
     * @grammar UE.utils.unhtml(str);  => String
     * @grammar UE.utils.unhtml(str,reg)  => String
     * @example
     * var html = '<body>You say:"你好！Baidu & UEditor!"</body>';
     * UE.utils.unhtml(html);   ==>  &lt;body&gt;You say:&quot;你好！Baidu &amp; UEditor!&quot;&lt;/body&gt;
     * UE.utils.unhtml(html,/[<>]/g)  ==>  &lt;body&gt;You say:"你好！Baidu & UEditor!"&lt;/body&gt;
     */
        unhtml: function(str, reg) {
            return str ? str.replace(reg || /[&<">]/g, function(m) {
                return {
                    '<': '&lt;',
                    '&': '&amp;',
                    '"': '&quot;',
                    '>': '&gt;'
                }[m]
            }) : '';
        },
        /**
     * 将str中的转义字符还原成html字符
     * @name html
     * @grammar UE.utils.html(str)  => String   //详细参见<code><a href = '#unhtml'>unhtml</a></code>
     */
        html: function(str) {
            return str ? str.replace(/&((g|l|quo)t|amp);/g, function(m) {
                return {
                    '&lt;': '<',
                    '&amp;': '&',
                    '&quot;': '"',
                    '&gt;': '>'
                }[m]
            }) : '';
        },
        /**
     * 将css样式转换为驼峰的形式。如font-size => fontSize
     * @name cssStyleToDomStyle
     * @grammar UE.utils.cssStyleToDomStyle(cssName)  => String
     */
        cssStyleToDomStyle: function() {
            var test = document.createElement('div').style,
            cache = {
                'float': test.cssFloat != undefined ? 'cssFloat' : test.styleFloat != undefined ? 'styleFloat' : 'float'
            };

            return function(cssName) {
                return cache[cssName] || (cache[cssName] = cssName.toLowerCase().replace(/-./g, function(match) {
                    return match.charAt(1).toUpperCase();
                }));
            };
        }(),
        /**
     * 动态加载文件到doc中，并依据obj来设置属性，加载成功后执行回调函数fn
     * @name loadFile
     * @grammar UE.utils.loadFile(doc,obj)
     * @grammar UE.utils.loadFile(doc,obj,fn)
     * @example
     * //指定加载到当前document中一个script文件，加载成功后执行function
     * utils.loadFile( document, {
     *     src:"test.js",
     *     tag:"script",
     *     type:"text/javascript",
     *     defer:"defer"
     * }, function () {
     *     console.log('加载成功！')
     * });
     */
        loadFile: function() {
            var tmpList = [];
            function getItem(doc, obj) {
                for (var i = 0, ci; ci = tmpList[i++]; ) {
                    try {
                        if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                            return ci;
                        }
                    } catch (e) {
                        //在ie9下，如果doc不是一个页面的，会导致拒绝访问的错误
                        continue
                    }

                }
            }
            return function(doc, obj, fn) {

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
                    doc: doc,
                    url: obj.src || obj.href,
                    funs: [fn]
                });
                if (!doc.body) {
                    var html = [];
                    for (var p in obj) {
                        if (p == 'tag')
                            continue;
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
                element.onload = element.onreadystatechange = function() {
                    if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                        item = getItem(doc, obj)
                        if (item.funs.length > 0) {
                            item.ready = 1;
                            for (var fi; fi = item.funs.pop(); ) {
                                fi();
                            }
                        }
                        element.onload = element.onreadystatechange = null;
                    }
                };
                doc.getElementsByTagName("head")[0].appendChild(element);
            }
        }(),
        /**
     * 判断obj对象是否为空
     * @name isEmptyObject
     * @grammar UE.utils.isEmptyObject(obj)  => true|false
     * @example
     * UE.utils.isEmptyObject({}) ==>true
     * UE.utils.isEmptyObject([]) ==>true
     * UE.utils.isEmptyObject("") ==>true
     */
        isEmptyObject: function(obj) {
            if (obj == null)
                return true;
            if (this.isArray(obj) || this.isString(obj))
                return obj.length === 0;
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    return false;
            return true;
        },

        /**
     * 统一将颜色值使用16进制形式表示
     * @name fixColor
     * @grammar UE.utils.fixColor(name,value) => value
     * @example
     * rgb(255,255,255)  => "#ffffff"
     */
        fixColor: function(name, value) {
            if (/color/i.test(name) && /rgba?/.test(value)) {
                var array = value.split(",");
                if (array.length > 3)
                    return "";
                value = "#";
                for (var i = 0, color; color = array[i++]; ) {
                    color = parseInt(color.replace(/[^\d]/gi, ''), 10).toString(16);
                    value += color.length == 1 ? "0" + color : color;
                }
                value = value.toUpperCase();
            }
            return value;
        },
        /**
     * 只针对border,padding,margin做了处理，因为性能问题
     * @public
     * @function
     * @param {String}    val style字符串
     */
        optCss: function(val) {
            var padding, margin, border;
            val = val.replace(/(padding|margin|border)\-([^:]+):([^;]+);?/gi, function(str, key, name, val) {
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
                var t = obj.top, b = obj.bottom, l = obj.left, r = obj.right, val = '';
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
            .replace(/(&((l|g)t|quot|#39))?;{2,}/g, function(a, b) {
                return b ? b + ";;" : ';'
            });
        },
        /**
     * 深度克隆对象，从source到target
     * @name clone
     * @grammar UE.utils.clone(source) => anthorObj 新的对象是完整的source的副本
     * @grammar UE.utils.clone(source,target) => target包含了source的所有内容，重名会覆盖
     */
        clone: function(source, target) {
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
     * 转换cm/pt到px
     * @name transUnitToPx
     * @grammar UE.utils.transUnitToPx('20pt') => '27px'
     * @grammar UE.utils.transUnitToPx('0pt') => '0'
     */
        transUnitToPx: function(val) {
            if (!/(pt|cm)/.test(val)) {
                return val
            }
            var unit;
            val.replace(/([\d.]+)(\w+)/, function(str, v, u) {
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
     * DomReady方法，回调函数将在dom树ready完成后执行
     * @name domReady
     * @grammar UE.utils.domReady(fn)  => fn  //返回一个延迟执行的方法
     */
        domReady: function() {

            var fnArr = [];

            function doReady(doc) {
                //确保onready只执行一次
                doc.isReady = true;
                for (var ci; ci = fnArr.pop(); ci()) {
                }
            }

            return function(onready, win) {
                win = win || window;
                var doc = win.document;
                onready && fnArr.push(onready);
                if (doc.readyState === "complete") {
                    doReady(doc);
                } else {
                    doc.isReady && doReady(doc);
                    if (browser.ie) {
                        (function() {
                            if (doc.isReady)
                                return;
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (error) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            doReady(doc);
                        })();
                        win.attachEvent('onload', function() {
                            doReady(doc)
                        });
                    } else {
                        doc.addEventListener("DOMContentLoaded", function() {
                            doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                            doReady(doc);
                        }, false);
                        win.addEventListener('load', function() {
                            doReady(doc)
                        }, false);
                    }
                }

            }
        }(),
        /**
     * 动态添加css样式
     * @name cssRule
     * @grammar UE.utils.cssRule('添加的样式的节点名称',['样式'，'放到哪个document上'])
     * @grammar UE.utils.cssRule('body','body{background:#ccc}') => null  //给body添加背景颜色
     * @grammar UE.utils.cssRule('body') =>样式的字符串  //取得key值为body的样式的内容,如果没有找到key值先关的样式将返回空，例如刚才那个背景颜色，将返回 body{background:#ccc}
     * @grammar UE.utils.cssRule('body','') =>null //清空给定的key值的背景颜色
     */
        cssRule: browser.ie ? function(key, style, doc) {
            var indexList, index;
            doc = doc || document;
            if (doc.indexList) {
                indexList = doc.indexList;
            } else {
                indexList = doc.indexList = {};
            }
            var sheetStyle;
            if (!indexList[key]) {
                if (style === undefined) {
                    return ''
                }
                sheetStyle = doc.createStyleSheet('', index = doc.styleSheets.length);
                indexList[key] = index;
            } else {
                sheetStyle = doc.styleSheets[indexList[key]];
            }
            if (style === undefined) {
                return sheetStyle.cssText
            }
            sheetStyle.cssText = style || ''
        } : function(key, style, doc) {
            doc = doc || document;
            var head = doc.getElementsByTagName('head')[0], node;
            if (!(node = doc.getElementById(key))) {
                if (style === undefined) {
                    return ''
                }
                node = doc.createElement('style');
                node.id = key;
                head.appendChild(node)
            }
            if (style === undefined) {
                return node.innerHTML
            }
            if (style !== '') {
                node.innerHTML = style;
            } else {
                head.removeChild(node)
            }
        }

    };
    /**
 * 判断str是否为字符串
 * @name isString
 * @grammar UE.utils.isString(str) => true|false
 */
    /**
 * 判断array是否为数组
 * @name isArray
 * @grammar UE.utils.isArray(obj) => true|false
 */
    /**
 * 判断obj对象是否为方法
 * @name isFunction
 * @grammar UE.utils.isFunction(obj)  => true|false
 */
    /**
 * 判断obj对象是否为数字
 * @name isNumber
 * @grammar UE.utils.isNumber(obj)  => true|false
 */

    utils.each(['String', 'Function', 'Array', 'Number'], function(v) {
        UE.utils['is' + v] = function(obj) {
            return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
        }
    });
    /**
 * @file
 * @name UE.EventBase
 * @short EventBase
 * @import editor.js,core/utils.js
 * @desc UE采用的事件基类，继承此类的对应类将获取addListener,removeListener,fireEvent方法。
 * 在UE中，Editor以及所有ui实例都继承了该类，故可以在对应的ui对象以及editor对象上使用上述方法。
 */
    var EventBase = UE.EventBase = function() {
    };

    EventBase.prototype = {
        /**
     * 注册事件监听器
     * @name addListener
     * @grammar editor.addListener(types,fn)  //types为事件名称，多个可用空格分隔
     * @example
     * editor.addListener('selectionchange',function(){
     *      console.log("选区已经变化！");
     * })
     * editor.addListener('beforegetcontent aftergetcontent',function(type){
     *         if(type == 'beforegetcontent'){
     *             //do something
     *         }else{
     *             //do something
     *         }
     *         console.log(this.getContent) // this是注册的事件的编辑器实例
     * })
     */
        addListener: function(types, listener) {
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++]; ) {
                getListener(this, ti, true).push(listener);
            }
        },
        /**
     * 移除事件监听器
     * @name removeListener
     * @grammar editor.removeListener(types,fn)  //types为事件名称，多个可用空格分隔
     * @example
     * //changeCallback为方法体
     * editor.removeListener("selectionchange",changeCallback);
     */
        removeListener: function(types, listener) {
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++]; ) {
                utils.removeItem(getListener(this, ti) || [], listener);
            }
        },
        /**
     * 触发事件
     * @name fireEvent
     * @grammar editor.fireEvent(types)  //types为事件名称，多个可用空格分隔
     * @example
     * editor.fireEvent("selectionchange");
     */
        fireEvent: function(types) {
            types = utils.trim(types).split(' ');
            for (var i = 0, ti; ti = types[i++]; ) {
                var listeners = getListener(this, ti),
                r, t, k;
                if (listeners) {
                    k = listeners.length;
                    while (k--) {
                        t = listeners[k].apply(this, arguments);
                        if (t !== undefined) {
                            r = t;
                        }
                    }
                }
                if (t = this['on' + ti.toLowerCase()]) {
                    r = t.apply(this, arguments);
                }
            }
            return r;
        }
    };
    /**
 * 获得对象所拥有监听类型的所有监听器
 * @public
 * @function
 * @param {Object} obj  查询监听器的对象
 * @param {String} type 事件类型
 * @param {Boolean} force  为true且当前所有type类型的侦听器不存在时，创建一个空监听器数组
 * @returns {Array} 监听器数组
 */
    function getListener(obj, type, force) {
        var allListeners;
        type = type.toLowerCase();
        return ((allListeners = (obj.__allListeners || force && (obj.__allListeners = {})))
        && (allListeners[type] || force && (allListeners[type] = [])));
    }


    ///import editor.js
    ///import core/dom/dom.js
    /**
 * dtd html语义化的体现类
 * @constructor
 * @namespace dtd
 */
    var dtd = dom.dtd = (function() {
        function _(s) {
            for (var k in s) {
                s[k.toUpperCase()] = s[k];
            }
            return s;
        }
        function X(t) {
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
        }
        var A = _({isindex: 1,fieldset: 1}),
        B = _({input: 1,button: 1,select: 1,textarea: 1,label: 1}),
        C = X(_({a: 1}), B),
        D = X({iframe: 1}, C),
        E = _({hr: 1,ul: 1,menu: 1,div: 1,blockquote: 1,noscript: 1,table: 1,center: 1,address: 1,dir: 1,pre: 1,h5: 1,dl: 1,h4: 1,noframes: 1,h6: 1,ol: 1,h1: 1,h3: 1,h2: 1}),
        F = _({ins: 1,del: 1,script: 1,style: 1}),
        G = X(_({b: 1,acronym: 1,bdo: 1,'var': 1,'#': 1,abbr: 1,code: 1,br: 1,i: 1,cite: 1,kbd: 1,u: 1,strike: 1,s: 1,tt: 1,strong: 1,q: 1,samp: 1,em: 1,dfn: 1,span: 1}), F),
        H = X(_({sub: 1,img: 1,embed: 1,object: 1,sup: 1,basefont: 1,map: 1,applet: 1,font: 1,big: 1,small: 1}), G),
        I = X(_({p: 1}), H),
        J = X(_({iframe: 1}), H, B),
        K = _({img: 1,embed: 1,noscript: 1,br: 1,kbd: 1,center: 1,button: 1,basefont: 1,h5: 1,h4: 1,samp: 1,h6: 1,ol: 1,h1: 1,h3: 1,h2: 1,form: 1,font: 1,'#': 1,select: 1,menu: 1,ins: 1,abbr: 1,label: 1,code: 1,table: 1,script: 1,cite: 1,input: 1,iframe: 1,strong: 1,textarea: 1,noframes: 1,big: 1,small: 1,span: 1,hr: 1,sub: 1,bdo: 1,'var': 1,div: 1,object: 1,sup: 1,strike: 1,dir: 1,map: 1,dl: 1,applet: 1,del: 1,isindex: 1,fieldset: 1,ul: 1,b: 1,acronym: 1,a: 1,blockquote: 1,i: 1,u: 1,s: 1,tt: 1,address: 1,q: 1,pre: 1,p: 1,em: 1,dfn: 1}),

        L = X(_({a: 0}), J),  //a不能被切开，所以把他
        M = _({tr: 1}),
        N = _({'#': 1}),
        O = X(_({param: 1}), K),
        P = X(_({form: 1}), A, D, E, I),
        Q = _({li: 1}),
        R = _({style: 1,script: 1}),
        S = _({base: 1,link: 1,meta: 1,title: 1}),
        T = X(S, R),
        U = _({head: 1,body: 1}),
        V = _({html: 1});

        var block = _({address: 1,blockquote: 1,center: 1,dir: 1,div: 1,dl: 1,fieldset: 1,form: 1,h1: 1,h2: 1,h3: 1,h4: 1,h5: 1,h6: 1,hr: 1,isindex: 1,menu: 1,noframes: 1,ol: 1,p: 1,pre: 1,table: 1,ul: 1}),
        //针对优酷的embed他添加了结束标识，导致粘贴进来会变成两个，暂时去掉 ,embed:1
        empty = _({area: 1,base: 1,br: 1,col: 1,hr: 1,img: 1,input: 1,link: 1,meta: 1,param: 1,embed: 1});

        return _({

            // $ 表示自定的属性

            // body外的元素列表.
            $nonBodyContent: X(V, U, S),

            //块结构元素列表
            $block: block,

            //内联元素列表
            $inline: L,

            $body: X(_({script: 1,style: 1}), block),

            $cdata: _({script: 1,style: 1}),

            //自闭和元素
            $empty: empty,

            //不是自闭合，但不能让range选中里边
            $nonChild: _({iframe: 1,textarea: 1}),
            //列表元素列表
            $listItem: _({dd: 1,dt: 1,li: 1}),

            //列表根元素列表
            $list: _({ul: 1,ol: 1,dl: 1}),

            //不能认为是空的元素
            $isNotEmpty: _({table: 1,ul: 1,ol: 1,dl: 1,iframe: 1,area: 1,base: 1,col: 1,hr: 1,img: 1,embed: 1,input: 1,link: 1,meta: 1,param: 1}),

            //如果没有子节点就可以删除的元素列表，像span,a
            $removeEmpty: _({a: 1,abbr: 1,acronym: 1,address: 1,b: 1,bdo: 1,big: 1,cite: 1,code: 1,del: 1,dfn: 1,em: 1,font: 1,i: 1,ins: 1,label: 1,kbd: 1,q: 1,s: 1,samp: 1,small: 1,span: 1,strike: 1,strong: 1,sub: 1,sup: 1,tt: 1,u: 1,'var': 1}),

            $removeEmptyBlock: _({'p': 1,'div': 1}),

            //在table元素里的元素列表
            $tableContent: _({caption: 1,col: 1,colgroup: 1,tbody: 1,td: 1,tfoot: 1,th: 1,thead: 1,tr: 1,table: 1}),
            //不转换的标签
            $notTransContent: _({pre: 1,script: 1,style: 1,textarea: 1}),
            html: U,
            head: T,
            style: N,
            script: N,
            body: P,
            base: {},
            link: {},
            meta: {},
            title: N,
            col: {},
            tr: _({td: 1,th: 1}),
            img: {},
            embed: {},
            colgroup: _({thead: 1,col: 1,tbody: 1,tr: 1,tfoot: 1}),
            noscript: P,
            td: P,
            br: {},
            th: P,
            center: P,
            kbd: L,
            button: X(I, E),
            basefont: {},
            h5: L,
            h4: L,
            samp: L,
            h6: L,
            ol: Q,
            h1: L,
            h3: L,
            option: N,
            h2: L,
            form: X(A, D, E, I),
            select: _({optgroup: 1,option: 1}),
            font: L,
            ins: L,
            menu: Q,
            abbr: L,
            label: L,
            table: _({thead: 1,col: 1,tbody: 1,tr: 1,colgroup: 1,caption: 1,tfoot: 1}),
            code: L,
            tfoot: M,
            cite: L,
            li: P,
            input: {},
            iframe: P,
            strong: L,
            textarea: N,
            noframes: P,
            big: L,
            small: L,
            span: _({'#': 1,br: 1}),
            hr: L,
            dt: L,
            sub: L,
            optgroup: _({option: 1}),
            param: {},
            bdo: L,
            'var': L,
            div: P,
            object: O,
            sup: L,
            dd: P,
            strike: L,
            area: {},
            dir: Q,
            map: X(_({area: 1,form: 1,p: 1}), A, F, E),
            applet: O,
            dl: _({dt: 1,dd: 1}),
            del: L,
            isindex: {},
            fieldset: X(_({legend: 1}), K),
            thead: M,
            ul: Q,
            acronym: L,
            b: L,
            a: X(_({a: 1}), J),
            blockquote: X(_({td: 1,tr: 1,tbody: 1,li: 1}), P),
            caption: L,
            i: L,
            u: L,
            tbody: M,
            s: L,
            address: X(D, I),
            tt: L,
            legend: L,
            q: L,
            pre: X(G, C),
            p: X(_({'a': 1}), L),
            em: L,
            dfn: L
        });
    })();

    /**
 * @file
 * @name UE.dom.domUtils
 * @short DomUtils
 * @import editor.js, core/utils.js,core/browser.js,core/dom/dtd.js
 * @desc UEditor封装的底层dom操作库
 */
    function getDomNode(node, start, ltr, startFromChild, fn, guard) {
        var tmpNode = startFromChild && node[start],
        parent;
        !tmpNode && (tmpNode = node[ltr]);
        while (!tmpNode && (parent = (parent || node).parentNode)) {
            if (parent.tagName == 'BODY' || guard && !guard(parent)) {
                return null;
            }
            tmpNode = parent[ltr];
        }
        if (tmpNode && fn && !fn(tmpNode)) {
            return getDomNode(tmpNode, start, ltr, false, fn);
        }
        return tmpNode;
    }
    var attrFix = ie && browser.version < 9 ? {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder"
    } : {
        tabindex: "tabIndex",
        readonly: "readOnly"
    },
    styleBlock = utils.listToMap([
        '-webkit-box', '-moz-box', 'block',
        'list-item', 'table', 'table-row-group',
        'table-header-group', 'table-footer-group',
        'table-row', 'table-column-group', 'table-column',
        'table-cell', 'table-caption'
    ]);
    var domUtils = dom.domUtils = {
        //节点常量
        NODE_ELEMENT: 1,
        NODE_DOCUMENT: 9,
        NODE_TEXT: 3,
        NODE_COMMENT: 8,
        NODE_DOCUMENT_FRAGMENT: 11,

        //位置关系
        POSITION_IDENTICAL: 0,
        POSITION_DISCONNECTED: 1,
        POSITION_FOLLOWING: 2,
        POSITION_PRECEDING: 4,
        POSITION_IS_CONTAINED: 8,
        POSITION_CONTAINS: 16,
        //ie6使用其他的会有一段空白出现
        fillChar: ie && browser.version == '6' ? '\ufeff' : '\u200B',
        //-------------------------Node部分--------------------------------
        keys: {
            /*Backspace*/8: 1, /*Delete*/46: 1,
            /*Shift*/16: 1, /*Ctrl*/17: 1, /*Alt*/18: 1,
            37: 1,38: 1,39: 1,40: 1,
            13: 1 /*enter*/
        },
        /**
     * 获取节点A相对于节点B的位置关系
     * @name getPosition
     * @grammar UE.dom.domUtils.getPosition(nodeA,nodeB)  =>  Number
     * @example
     *  switch (returnValue) {
     *      case 0: //相等，同一节点
     *      case 1: //无关，节点不相连
     *      case 2: //跟随，即节点A头部位于节点B头部的后面
     *      case 4: //前置，即节点A头部位于节点B头部的前面
     *      case 8: //被包含，即节点A被节点B包含
     *      case 10://组合类型，即节点A满足跟随节点B且被节点B包含。实际上，如果被包含，必定跟随，所以returnValue事实上不会存在8的情况。
     *      case 16://包含，即节点A包含节点B
     *      case 20://组合类型，即节点A满足前置节点A且包含节点B。同样，如果包含，必定前置，所以returnValue事实上也不会存在16的情况
     *  }
     */
        getPosition: function(nodeA, nodeB) {
            // 如果两个节点是同一个节点
            if (nodeA === nodeB) {
                // domUtils.POSITION_IDENTICAL
                return 0;
            }
            var node,
            parentsA = [nodeA],
            parentsB = [nodeB];
            node = nodeA;
            while (node = node.parentNode) {
                // 如果nodeB是nodeA的祖先节点
                if (node === nodeB) {
                    // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
                    return 10;
                }
                parentsA.push(node);
            }
            node = nodeB;
            while (node = node.parentNode) {
                // 如果nodeA是nodeB的祖先节点
                if (node === nodeA) {
                    // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
                    return 20;
                }
                parentsB.push(node);
            }
            parentsA.reverse();
            parentsB.reverse();
            if (parentsA[0] !== parentsB[0]) {
                // domUtils.POSITION_DISCONNECTED
                return 1;
            }
            var i = -1;
            while (i++, parentsA[i] === parentsB[i]) {
            }
            nodeA = parentsA[i];
            nodeB = parentsB[i];
            while (nodeA = nodeA.nextSibling) {
                if (nodeA === nodeB) {
                    // domUtils.POSITION_PRECEDING
                    return 4
                }
            }
            // domUtils.POSITION_FOLLOWING
            return 2;
        },

        /**
     * 返回节点node在父节点中的索引位置
     * @name getNodeIndex
     * @grammar UE.dom.domUtils.getNodeIndex(node)  => Number  //索引值从0开始
     */
        getNodeIndex: function(node, ignoreTextNode) {
            var preNode = node,
            i = 0;
            while (preNode = preNode.previousSibling) {
                if (ignoreTextNode && preNode.nodeType == 3) {
                    continue;
                }
                i++;
            }
            return i;
        },

        /**
     * 检测节点node是否在节点doc的树上，实质上是检测是否被doc包含
     * @name inDoc
     * @grammar UE.dom.domUtils.inDoc(node,doc)   =>  true|false
     */
        inDoc: function(node, doc) {
            return domUtils.getPosition(node, doc) == 10;
        },
        /**
     * 查找node节点的祖先节点
     * @name findParent
     * @grammar UE.dom.domUtils.findParent(node)  => Element  // 直接返回node节点的父节点
     * @grammar UE.dom.domUtils.findParent(node,filterFn)  => Element  //filterFn为过滤函数，node作为参数，返回true时才会将node作为符合要求的节点返回
     * @grammar UE.dom.domUtils.findParent(node,filterFn,includeSelf)  => Element  //includeSelf指定是否包含自身
     */
        findParent: function(node, filterFn, includeSelf) {
            if (node && !domUtils.isBody(node)) {
                node = includeSelf ? node : node.parentNode;
                while (node) {
                    if (!filterFn || filterFn(node) || domUtils.isBody(node)) {
                        return filterFn && !filterFn(node) && domUtils.isBody(node) ? null : node;
                    }
                    node = node.parentNode;
                }
            }
            return null;
        },
        /**
     * 通过tagName查找node节点的祖先节点
     * @name findParentByTagName
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames)   =>  Element  //tagNames支持数组，区分大小写
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames,includeSelf)   =>  Element  //includeSelf指定是否包含自身
     * @grammar UE.dom.domUtils.findParentByTagName(node,tagNames,includeSelf,excludeFn)   =>  Element  //excludeFn指定例外过滤条件，返回true时忽略该节点
     */
        findParentByTagName: function(node, tagNames, includeSelf, excludeFn) {
            tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]);
            return domUtils.findParent(node, function(node) {
                return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
            }, includeSelf);
        },
        /**
     * 查找节点node的祖先节点集合
     * @name findParents
     * @grammar UE.dom.domUtils.findParents(node)  => Array  //返回一个祖先节点数组集合，不包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf)  => Array  //返回一个祖先节点数组集合，includeSelf指定是否包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn)  => Array  //返回一个祖先节点数组集合，filterFn指定过滤条件，返回true的node将被选取
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn,closerFirst)  => Array  //返回一个祖先节点数组集合，closerFirst为true的话，node的直接父亲节点是数组的第0个
     */
        findParents: function(node, includeSelf, filterFn, closerFirst) {
            var parents = includeSelf && (filterFn && filterFn(node) || !filterFn) ? [node] : [];
            while (node = domUtils.findParent(node, filterFn)) {
                parents.push(node);
            }
            return closerFirst ? parents : parents.reverse();
        },

        /**
     * 在节点node后面插入新节点newNode
     * @name insertAfter
     * @grammar UE.dom.domUtils.insertAfter(node,newNode)  => newNode
     */
        insertAfter: function(node, newNode) {
            return node.parentNode.insertBefore(newNode, node.nextSibling);
        },

        /**
     * 删除节点node，并根据keepChildren指定是否保留子节点
     * @name remove
     * @grammar UE.dom.domUtils.remove(node)  =>  node
     * @grammar UE.dom.domUtils.remove(node,keepChildren)  =>  node
     */
        remove: function(node, keepChildren) {
            var parent = node.parentNode,
            child;
            if (parent) {
                if (keepChildren && node.hasChildNodes()) {
                    while (child = node.firstChild) {
                        parent.insertBefore(child, node);
                    }
                }
                parent.removeChild(node);
            }
            return node;
        },

        /**
     * 取得node节点在dom树上的下一个节点,即多叉树遍历
     * @name  getNextDomNode
     * @grammar UE.dom.domUtils.getNextDomNode(node)  => Element
     * @example
     */
        getNextDomNode: function(node, startFromChild, filterFn, guard) {
            return getDomNode(node, 'firstChild', 'nextSibling', startFromChild, filterFn, guard);
        },
        /**
     * 检测节点node是否属于bookmark节点
     * @name isBookmarkNode
     * @grammar UE.dom.domUtils.isBookmarkNode(node)  => true|false
     */
        isBookmarkNode: function(node) {
            return node.nodeType == 1 && node.id && /^_baidu_bookmark_/i.test(node.id);
        },
        /**
     * 获取节点node所在的window对象
     * @name  getWindow
     * @grammar UE.dom.domUtils.getWindow(node)  => window对象
     */
        getWindow: function(node) {
            var doc = node.ownerDocument || node;
            return doc.defaultView || doc.parentWindow;
        },
        /**
     * 得到nodeA与nodeB公共的祖先节点
     * @name  getCommonAncestor
     * @grammar UE.dom.domUtils.getCommonAncestor(nodeA,nodeB)  => Element
     */
        getCommonAncestor: function(nodeA, nodeB) {
            if (nodeA === nodeB)
                return nodeA;
            var parentsA = [nodeA], parentsB = [nodeB], parent = nodeA, i = -1;
            while (parent = parent.parentNode) {
                if (parent === nodeB) {
                    return parent;
                }
                parentsA.push(parent);
            }
            parent = nodeB;
            while (parent = parent.parentNode) {
                if (parent === nodeA)
                    return parent;
                parentsB.push(parent);
            }
            parentsA.reverse();
            parentsB.reverse();
            while (i++, parentsA[i] === parentsB[i]) {
            }
            return i == 0 ? null : parentsA[i - 1];

        },
        /**
     * 清除node节点左右兄弟为空的inline节点
     * @name clearEmptySibling
     * @grammar UE.dom.domUtils.clearEmptySibling(node)
     * @grammar UE.dom.domUtils.clearEmptySibling(node,ignoreNext)  //ignoreNext指定是否忽略右边空节点
     * @grammar UE.dom.domUtils.clearEmptySibling(node,ignoreNext,ignorePre)  //ignorePre指定是否忽略左边空节点
     * @example
     * <b></b><i></i>xxxx<b>bb</b> --> xxxx<b>bb</b>
     */
        clearEmptySibling: function(node, ignoreNext, ignorePre) {
            function clear(next, dir) {
                var tmpNode;
                while (next && !domUtils.isBookmarkNode(next) && (domUtils.isEmptyInlineElement(next)
                //这里不能把空格算进来会吧空格干掉，出现文字间的空格丢掉了
                || !new RegExp('[^\t\n\r' + domUtils.fillChar + ']').test(next.nodeValue))) {
                    tmpNode = next[dir];
                    domUtils.remove(next);
                    next = tmpNode;
                }
            }
            !ignoreNext && clear(node.nextSibling, 'nextSibling');
            !ignorePre && clear(node.previousSibling, 'previousSibling');
        },
        /**
     * 将一个文本节点node拆分成两个文本节点，offset指定拆分位置
     * @name split
     * @grammar UE.dom.domUtils.split(node,offset)  =>  TextNode  //返回从切分位置开始的后一个文本节点
     */
        split: function(node, offset) {
            var doc = node.ownerDocument;
            if (browser.ie && offset == node.nodeValue.length) {
                var next = doc.createTextNode('');
                return domUtils.insertAfter(node, next);
            }
            var retval = node.splitText(offset);
            //ie8下splitText不会跟新childNodes,我们手动触发他的更新
            if (browser.ie8) {
                var tmpNode = doc.createTextNode('');
                domUtils.insertAfter(retval, tmpNode);
                domUtils.remove(tmpNode);
            }
            return retval;
        },

        /**
     * 检测节点node是否为空节点（包括空格、换行、占位符等字符）
     * @name  isWhitespace
     * @grammar  UE.dom.domUtils.isWhitespace(node)  => true|false
     */
        isWhitespace: function(node) {
            return !new RegExp('[^ \t\n\r' + domUtils.fillChar + ']').test(node.nodeValue);
        },
        /**
     * 获取元素element相对于viewport的位置坐标
     * @name getXY
     * @grammar UE.dom.domUtils.getXY(element)  => Object //返回坐标对象{x:left,y:top}
     */
        getXY: function(element) {
            var x = 0, y = 0;
            while (element.offsetParent) {
                y += element.offsetTop;
                x += element.offsetLeft;
                element = element.offsetParent;
            }
            return {'x': x,'y': y};
        },
        /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @name on
     * @grammar UE.dom.domUtils.on(element,type,handler)   //type支持数组传入
     * @example
     * UE.dom.domUtils.on(document.body,"click",function(e){
     *     //e为事件对象，this为被点击元素对戏那个
     * })
     * @example
     * UE.dom.domUtils.on(document.body,["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * })
     */
        on: function(element, type, handler) {
            var types = utils.isArray(type) ? type : [type],
            k = types.length;
            if (k)
                while (k--) {
                    type = types[k];
                    if (element.addEventListener) {
                        element.addEventListener(type, handler, false);
                    } else {
                        if (!handler._d) {
                            handler._d = {
                                els: []
                            };
                        }
                        var key = type + handler.toString(), index = utils.indexOf(handler._d.els, element);
                        if (!handler._d[key] || index == -1) {
                            if (index == -1) {
                                handler._d.els.push(element);
                            }
                            if (!handler._d[key]) {
                                handler._d[key] = function(evt) {
                                    return handler.call(evt.srcElement, evt || window.event);
                                };
                            }


                            element.attachEvent('on' + type, handler._d[key]);
                        }
                    }
                }
            element = null;
        },
        /**
     * 解除原生DOM事件绑定
     * @name un
     * @grammar  UE.dom.donUtils.un(element,type,handler)  //参见<code><a href="#on">on</a></code>
     */
        un: function(element, type, handler) {
            var types = utils.isArray(type) ? type : [type],
            k = types.length;
            if (k)
                while (k--) {
                    type = types[k];
                    if (element.removeEventListener) {
                        element.removeEventListener(type, handler, false);
                    } else {
                        var key = type + handler.toString();
                        try {
                            element.detachEvent('on' + type, handler._d ? handler._d[key] : handler);
                        } catch (e) {
                        }
                        if (handler._d && handler._d[key]) {
                            var index = utils.indexOf(handler._d.els, element);
                            if (index != -1) {
                                handler._d.els.splice(index, 1);
                            }
                            handler._d.els.length == 0 && delete handler._d[key];
                        }
                    }
                }
        },

        /**
     * 比较节点nodeA与节点nodeB是否具有相同的标签名、属性名以及属性值
     * @name  isSameElement
     * @grammar UE.dom.domUtils.isSameElement(nodeA,nodeB) => true|false
     * @example
     * <span  style="font-size:12px">ssss</span> and <span style="font-size:12px">bbbbb</span>   => true
     * <span  style="font-size:13px">ssss</span> and <span style="font-size:12px">bbbbb</span>   => false
     */
        isSameElement: function(nodeA, nodeB) {
            if (nodeA.tagName != nodeB.tagName) {
                return false;
            }
            var thisAttrs = nodeA.attributes,
            otherAttrs = nodeB.attributes;
            if (!ie && thisAttrs.length != otherAttrs.length) {
                return false;
            }
            var attrA, attrB, al = 0, bl = 0;
            for (var i = 0; attrA = thisAttrs[i++]; ) {
                if (attrA.nodeName == 'style') {
                    if (attrA.specified) {
                        al++;
                    }
                    if (domUtils.isSameStyle(nodeA, nodeB)) {
                        continue;
                    } else {
                        return false;
                    }
                }
                if (ie) {
                    if (attrA.specified) {
                        al++;
                        attrB = otherAttrs.getNamedItem(attrA.nodeName);
                    } else {
                        continue;
                    }
                } else {
                    attrB = nodeB.attributes[attrA.nodeName];
                }
                if (!attrB.specified || attrA.nodeValue != attrB.nodeValue) {
                    return false;
                }
            }
            // 有可能attrB的属性包含了attrA的属性之外还有自己的属性
            if (ie) {
                for (i = 0; attrB = otherAttrs[i++]; ) {
                    if (attrB.specified) {
                        bl++;
                    }
                }
                if (al != bl) {
                    return false;
                }
            }
            return true;
        },

        /**
     * 判断节点nodeA与节点nodeB的元素属性是否一致
     * @name isSameStyle
     * @grammar UE.dom.domUtils.isSameStyle(nodeA,nodeB) => true|false
     */
        isSameStyle: function(nodeA, nodeB) {
            var styleA = nodeA.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':'),
            styleB = nodeB.style.cssText.replace(/( ?; ?)/g, ';').replace(/( ?: ?)/g, ':');
            if (browser.opera) {
                styleA = nodeA.style;
                styleB = nodeB.style;
                if (styleA.length != styleB.length)
                    return false;
                for (var p in styleA) {
                    if (/^(\d+|csstext)$/i.test(p)) {
                        continue;
                    }
                    if (styleA[p] != styleB[p]) {
                        return false;
                    }
                }
                return true;
            }
            if (!styleA || !styleB) {
                return styleA == styleB;
            }
            styleA = styleA.split(';');
            styleB = styleB.split(';');
            if (styleA.length != styleB.length) {
                return false;
            }
            for (var i = 0, ci; ci = styleA[i++]; ) {
                if (utils.indexOf(styleB, ci) == -1) {
                    return false;
                }
            }
            return true;
        },
        /**
     * 检查节点node是否为块元素
     * @name isBlockElm
     * @grammar UE.dom.domUtils.isBlockElm(node)  => true|false
     */
        isBlockElm: function(node) {
            return node.nodeType == 1 && (dtd.$block[node.tagName] || styleBlock[domUtils.getComputedStyle(node, 'display')]) && !dtd.$nonChild[node.tagName];
        },
        /**
     * 检测node节点是否为body节点
     * @name isBody
     * @grammar UE.dom.domUtils.isBody(node)   => true|false
     */
        isBody: function(node) {
            return node && node.nodeType == 1 && node.tagName.toLowerCase() == 'body';
        },
        /**
     * 以node节点为中心，将该节点的指定祖先节点parent拆分成2块
     * @name  breakParent
     * @grammar UE.dom.domUtils.breakParent(node,parent) => node
     * @desc
     * <code type="html"><b>ooo</b>是node节点
     * <p>xxxx<b>ooo</b>xxx</p> ==> <p>xxx</p><b>ooo</b><p>xxx</p>
     * <p>xxxxx<span>xxxx<b>ooo</b>xxxxxx</span></p>   =>   <p>xxxxx<span>xxxx</span></p><b>ooo</b><p><span>xxxxxx</span></p></code>
     */
        breakParent: function(node, parent) {
            var tmpNode,
            parentClone = node,
            clone = node,
            leftNodes,
            rightNodes;
            do {
                parentClone = parentClone.parentNode;
                if (leftNodes) {
                    tmpNode = parentClone.cloneNode(false);
                    tmpNode.appendChild(leftNodes);
                    leftNodes = tmpNode;
                    tmpNode = parentClone.cloneNode(false);
                    tmpNode.appendChild(rightNodes);
                    rightNodes = tmpNode;
                } else {
                    leftNodes = parentClone.cloneNode(false);
                    rightNodes = leftNodes.cloneNode(false);
                }
                while (tmpNode = clone.previousSibling) {
                    leftNodes.insertBefore(tmpNode, leftNodes.firstChild);
                }
                while (tmpNode = clone.nextSibling) {
                    rightNodes.appendChild(tmpNode);
                }
                clone = parentClone;
            } while (parent !== parentClone);
            tmpNode = parent.parentNode;
            tmpNode.insertBefore(leftNodes, parent);
            tmpNode.insertBefore(rightNodes, parent);
            tmpNode.insertBefore(node, rightNodes);
            domUtils.remove(parent);
            return node;
        },
        /**
     * 检查节点node是否是空inline节点
     * @name  isEmptyInlineElement
     * @grammar   UE.dom.domUtils.isEmptyInlineElement(node)  => 1|0
     * @example
     * <b><i></i></b> => 1
     * <b><i></i><u></u></b> => 1
     * <b></b> => 1
     * <b>xx<i></i></b> => 0
     */
        isEmptyInlineElement: function(node) {
            if (node.nodeType != 1 || !dtd.$removeEmpty[node.tagName]) {
                return 0;
            }
            node = node.firstChild;
            while (node) {
                //如果是创建的bookmark就跳过
                if (domUtils.isBookmarkNode(node)) {
                    return 0;
                }
                if (node.nodeType == 1 && !domUtils.isEmptyInlineElement(node) ||
                node.nodeType == 3 && !domUtils.isWhitespace(node)
                ) {
                    return 0;
                }
                node = node.nextSibling;
            }
            return 1;

        },

        /**
     * 删除node节点下的左右空白文本子节点
     * @name trimWhiteTextNode
     * @grammar UE.dom.domUtils.trimWhiteTextNode(node)
     */
        trimWhiteTextNode: function(node) {
            function remove(dir) {
                var child;
                while ((child = node[dir]) && child.nodeType == 3 && domUtils.isWhitespace(child)) {
                    node.removeChild(child);
                }
            }
            remove('firstChild');
            remove('lastChild');
        },

        /**
     * 合并node节点下相同的子节点
     * @name mergeChild
     * @desc
     * UE.dom.domUtils.mergeChild(node,tagName) //tagName要合并的子节点的标签
     * @example
     * <p><span style="font-size:12px;">xx<span style="font-size:12px;">aa</span>xx</span></p>
     * ==> UE.dom.domUtils.mergeChild(node,'span')
     * <p><span style="font-size:12px;">xxaaxx</span></p>
     */
        mergeChild: function(node, tagName, attrs) {
            var list = domUtils.getElementsByTagName(node, node.tagName.toLowerCase());
            for (var i = 0, ci; ci = list[i++]; ) {
                if (!ci.parentNode || domUtils.isBookmarkNode(ci)) {
                    continue;
                }
                //span单独处理
                if (ci.tagName.toLowerCase() == 'span') {
                    if (node === ci.parentNode) {
                        domUtils.trimWhiteTextNode(node);
                        if (node.childNodes.length == 1) {
                            node.style.cssText = ci.style.cssText + ";" + node.style.cssText;
                            domUtils.remove(ci, true);
                            continue;
                        }
                    }
                    ci.style.cssText = node.style.cssText + ';' + ci.style.cssText;
                    if (attrs) {
                        var style = attrs.style;
                        if (style) {
                            style = style.split(';');
                            for (var j = 0, s; s = style[j++]; ) {
                                ci.style[utils.cssStyleToDomStyle(s.split(':')[0])] = s.split(':')[1];
                            }
                        }
                    }
                    if (domUtils.isSameStyle(ci, node)) {
                        domUtils.remove(ci, true);
                    }
                    continue;
                }
                if (domUtils.isSameElement(node, ci)) {
                    domUtils.remove(ci, true);
                }
            }
        },

        /**
     * 原生方法getElementsByTagName的封装
     * @name getElementsByTagName
     * @grammar UE.dom.domUtils.getElementsByTagName(node,tagName)  => Array  //节点集合数组
     */
        getElementsByTagName: function(node, name) {
            var list = node.getElementsByTagName(name), arr = [];
            for (var i = 0, ci; ci = list[i++]; ) {
                arr.push(ci);
            }
            return arr;
        },
        /**
     * 将节点node合并到父节点上
     * @name mergeToParent
     * @grammar UE.dom.domUtils.mergeToParent(node)
     * @example
     * <span style="color:#fff"><span style="font-size:12px">xxx</span></span> ==> <span style="color:#fff;font-size:12px">xxx</span>
     */
        mergeToParent: function(node) {
            var parent = node.parentNode;
            while (parent && dtd.$removeEmpty[parent.tagName]) {
                if (parent.tagName == node.tagName || parent.tagName == 'A') { //针对a标签单独处理
                    domUtils.trimWhiteTextNode(parent);
                    //span需要特殊处理  不处理这样的情况 <span stlye="color:#fff">xxx<span style="color:#ccc">xxx</span>xxx</span>
                    if (parent.tagName == 'SPAN' && !domUtils.isSameStyle(parent, node)
                    || (parent.tagName == 'A' && node.tagName == 'SPAN')) {
                        if (parent.childNodes.length > 1 || parent !== node.parentNode) {
                            node.style.cssText = parent.style.cssText + ";" + node.style.cssText;
                            parent = parent.parentNode;
                            continue;
                        } else {
                            parent.style.cssText += ";" + node.style.cssText;
                            //trace:952 a标签要保持下划线
                            if (parent.tagName == 'A') {
                                parent.style.textDecoration = 'underline';
                            }
                        }
                    }
                    if (parent.tagName != 'A') {
                        parent === node.parentNode && domUtils.remove(node, true);
                        break;
                    }
                }
                parent = parent.parentNode;
            }
        },
        /**
     * 合并节点node的左右兄弟节点
     * @name mergeSibling
     * @grammar UE.dom.domUtils.mergeSibling(node)
     * @grammar UE.dom.domUtils.mergeSibling(node,ignorePre)    //ignorePre指定是否忽略左兄弟
     * @grammar UE.dom.domUtils.mergeSibling(node,ignorePre,ignoreNext)  //ignoreNext指定是否忽略右兄弟
     * @example
     * <b>xxxx</b><b>ooo</b><b>xxxx</b> ==> <b>xxxxoooxxxx</b>
     */
        mergeSibling: function(node, ignorePre, ignoreNext) {
            function merge(rtl, start, node) {
                var next;
                if ((next = node[rtl]) && !domUtils.isBookmarkNode(next) && next.nodeType == 1 && domUtils.isSameElement(node, next)) {
                    while (next.firstChild) {
                        if (start == 'firstChild') {
                            node.insertBefore(next.lastChild, node.firstChild);
                        } else {
                            node.appendChild(next.firstChild);
                        }
                    }
                    domUtils.remove(next);
                }
            }
            !ignorePre && merge('previousSibling', 'firstChild', node);
            !ignoreNext && merge('nextSibling', 'lastChild', node);
        },

        /**
     * 设置节点node及其子节点不会被选中
     * @name unSelectable
     * @grammar UE.dom.domUtils.unSelectable(node)
     */
        unSelectable: ie || browser.opera ? function(node) {
            //for ie9
            node.onselectstart = function() {
                return false;
            };
            node.onclick = node.onkeyup = node.onkeydown = function() {
                return false;
            };
            node.unselectable = 'on';
            node.setAttribute("unselectable", "on");
            for (var i = 0, ci; ci = node.all[i++]; ) {
                switch (ci.tagName.toLowerCase()) {
                    case 'iframe':
                    case 'textarea':
                    case 'input':
                    case 'select':
                        break;
                    default:
                        ci.unselectable = 'on';
                        node.setAttribute("unselectable", "on");
                }
            }
        } : function(node) {
            node.style.MozUserSelect =
            node.style.webkitUserSelect =
            node.style.KhtmlUserSelect = 'none';
        },
        /**
     * 删除节点node上的属性attrNames，attrNames为属性名称数组
     * @name  removeAttributes
     * @grammar UE.dom.domUtils.removeAttributes(node,attrNames)
     * @example
     * //Before remove
     * <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * //Remove
     * UE.dom.domUtils.removeAttributes(node,["id","name"]);
     * //After remove
     * <span style="font-size:14px;">xxxxx</span>
     */
        removeAttributes: function(node, attrNames) {
            for (var i = 0, ci; ci = attrNames[i++]; ) {
                ci = attrFix[ci] || ci;
                switch (ci) {
                    case 'className':
                        node[ci] = '';
                        break;
                    case 'style':
                        node.style.cssText = '';
                        !browser.ie && node.removeAttributeNode(node.getAttributeNode('style'))
                }
                node.removeAttribute(ci);
            }
        },
        /**
     * 在doc下创建一个标签名为tag，属性为attrs的元素
     * @name createElement
     * @grammar UE.dom.domUtils.createElement(doc,tag,attrs)  =>  Node  //返回创建的节点
     */
        createElement: function(doc, tag, attrs) {
            return domUtils.setAttributes(doc.createElement(tag), attrs)
        },
        /**
     * 为节点node添加属性attrs，attrs为属性键值对
     * @name setAttributes
     * @grammar UE.dom.domUtils.setAttributes(node,attrs)  => node
     */
        setAttributes: function(node, attrs) {
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    var value = attrs[attr];
                    switch (attr) {
                        case 'class':
                            //ie下要这样赋值，setAttribute不起作用
                            node.className = value;
                            break;
                        case 'style':
                            node.style.cssText = node.style.cssText + ";" + value;
                            break;
                        case 'innerHTML':
                            node[attr] = value;
                            break;
                        case 'value':
                            node.value = value;
                            break;
                        default:
                            node.setAttribute(attrFix[attr] || attr, value);
                    }
                }
            }
            return node;
        },

        /**
     * 获取元素element的计算样式
     * @name getComputedStyle
     * @grammar UE.dom.domUtils.getComputedStyle(element,styleName)  => String //返回对应样式名称的样式值
     * @example
     * getComputedStyle(document.body,"font-size")  =>  "15px"
     * getComputedStyle(form,"color")  =>  "#ffccdd"
     */
        getComputedStyle: function(element, styleName) {

            //忽略文本节点
            if (element.nodeType == 3) {
                element = element.parentNode;
            }
            //ie下font-size若body下定义了font-size，则从currentStyle里会取到这个font-size. 取不到实际值，故此修改.
            if (browser.ie && browser.version < 9 && styleName == 'font-size' && !element.style.fontSize &&
            !dtd.$empty[element.tagName] && !dtd.$nonChild[element.tagName]) {
                var span = element.ownerDocument.createElement('span');
                span.style.cssText = 'padding:0;border:0;font-family:simsun;';
                span.innerHTML = '.';
                element.appendChild(span);
                var result = span.offsetHeight;
                element.removeChild(span);
                span = null;
                return result + 'px';
            }
            try {
                var value = domUtils.getStyle(element, styleName) ||
                (window.getComputedStyle ? domUtils.getWindow(element).getComputedStyle(element, '').getPropertyValue(styleName) :
                (element.currentStyle || element.style)[utils.cssStyleToDomStyle(styleName)]);

            } catch (e) {
                return "";
            }
            return utils.transUnitToPx(utils.fixColor(styleName, value));
        },
        /**
     * 在元素element上删除classNames，支持同时删除多个
     * @name removeClasses
     * @grammar UE.dom.domUtils.removeClasses(element,classNames)
     * @example
     * //执行方法前的dom结构
     * <span class="test1 test2 test3">xxx</span>
     * //执行方法
     * UE.dom.domUtils.removeClasses(element,["test1","test3"])
     * //执行方法后的dom结构
     * <span class="test2">xxx</span>
     */
        removeClasses: function(elm, classNames) {
            classNames = utils.isArray(classNames) ? classNames :
            utils.trim(classNames).replace(/[ ]{2,}/g, ' ').split(' ');
            for (var i = 0, ci, cls = elm.className; ci = classNames[i++]; ) {
                cls = cls.replace(new RegExp('\\b' + ci + '\\b'), '')
            }
            cls = utils.trim(cls).replace(/[ ]{2,}/g, ' ');
            if (cls) {
                elm.className = cls;
            } else {
                domUtils.removeAttributes(elm, ['class']);
            }
        },
        /**
     * 在元素element上增加一个样式类className，支持以空格分开的多个类名
     * 如果相同的类名将不会添加
     * @name addClass
     * @grammar UE.dom.domUtils.addClass(element,classNames)
     */
        addClass: function(elm, classNames) {
            if (!elm)
                return;
            classNames = utils.trim(classNames).replace(/[ ]{2,}/g, ' ').split(' ');
            for (var i = 0, ci, cls = elm.className; ci = classNames[i++]; ) {
                if (!new RegExp('\\b' + ci + '\\b').test(cls)) {
                    elm.className += ' ' + ci;
                }
            }
        },
        /**
     * 判断元素element是否包含样式类名className,支持以空格分开的多个类名,多个类名顺序不同也可以比较
     * @name hasClass
     * @grammar UE.dom.domUtils.hasClass(element,className)  =>true|false
     */
        hasClass: function(element, className) {
            className = utils.trim(className).replace(/[ ]{2,}/g, ' ').split(' ');
            for (var i = 0, ci, cls = element.className; ci = className[i++]; ) {
                if (!new RegExp('\\b' + ci + '\\b').test(cls)) {
                    return false;
                }
            }
            return i - 1 == className.length;
        },

        /**
     * 阻止事件默认行为
     * @param {Event} evt    需要组织的事件对象
     */
        preventDefault: function(evt) {
            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
        },
        /**
     * 删除元素element的样式
     * @grammar UE.dom.domUtils.removeStyle(element,name)        删除的样式名称
     */
        removeStyle: function(element, name) {
            if (element.style.removeProperty) {
                element.style.removeProperty(name);
            } else {
                element.style.removeAttribute(utils.cssStyleToDomStyle(name));
            }

            if (!element.style.cssText) {
                domUtils.removeAttributes(element, ['style']);
            }
        },
        /**
     * 获取元素element的某个样式值
     * @name getStyle
     * @grammar UE.dom.domUtils.getStyle(element,name)  => String
     */
        getStyle: function(element, name) {
            var value = element.style[utils.cssStyleToDomStyle(name)];
            return utils.fixColor(name, value);
        },
        /**
     * 为元素element设置样式属性值
     * @name setStyle
     * @grammar UE.dom.domUtils.setStyle(element,name,value)
     */
        setStyle: function(element, name, value) {
            element.style[utils.cssStyleToDomStyle(name)] = value;
        },
        /**
     * 为元素element设置样式属性值
     * @name setStyles
     * @grammar UE.dom.domUtils.setStyle(element,styles)  //styles为样式键值对
     */
        setStyles: function(element, styles) {
            for (var name in styles) {
                if (styles.hasOwnProperty(name)) {
                    domUtils.setStyle(element, name, styles[name]);
                }
            }
        },
        /**
     * 删除_moz_dirty属性
     * @function
     */
        removeDirtyAttr: function(node) {
            for (var i = 0, ci, nodes = node.getElementsByTagName('*'); ci = nodes[i++]; ) {
                ci.removeAttribute('_moz_dirty');
            }
            node.removeAttribute('_moz_dirty');
        },
        /**
     * 返回子节点的数量
     * @function
     * @param {Node}    node    父节点
     * @param  {Function}    fn    过滤子节点的规则，若为空，则得到所有子节点的数量
     * @return {Number}    符合条件子节点的数量
     */
        getChildCount: function(node, fn) {
            var count = 0, first = node.firstChild;
            fn = fn || function() {
                return 1;
            };
            while (first) {
                if (fn(first)) {
                    count++;
                }
                first = first.nextSibling;
            }
            return count;
        },

        /**
     * 判断是否为空节点
     * @function
     * @param {Node}    node    节点
     * @return {Boolean}    是否为空节点
     */
        isEmptyNode: function(node) {
            return !node.firstChild || domUtils.getChildCount(node, function(node) {
                return !domUtils.isBr(node) && !domUtils.isBookmarkNode(node) && !domUtils.isWhitespace(node)
            }) == 0
        },
        /**
     * 清空节点所有的className
     * @function
     * @param {Array}    nodes    节点数组
     */
        clearSelectedArr: function(nodes) {
            var node;
            while (node = nodes.pop()) {
                domUtils.removeAttributes(node, ['class']);
            }
        },
        /**
     * 将显示区域滚动到显示节点的位置
     * @function
     * @param    {Node}   node    节点
     * @param    {window}   win      window对象
     * @param    {Number}    offsetTop    距离上方的偏移量
     */
        scrollToView: function(node, win, offsetTop) {
            var getViewPaneSize = function() {
                var doc = win.document,
                mode = doc.compatMode == 'CSS1Compat';
                return {
                    width: (mode ? doc.documentElement.clientWidth : doc.body.clientWidth) || 0,
                    height: (mode ? doc.documentElement.clientHeight : doc.body.clientHeight) || 0
                };
            },
            getScrollPosition = function(win) {
                if ('pageXOffset' in win) {
                    return {
                        x: win.pageXOffset || 0,
                        y: win.pageYOffset || 0
                    };
                }
                else {
                    var doc = win.document;
                    return {
                        x: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
                        y: doc.documentElement.scrollTop || doc.body.scrollTop || 0
                    };
                }
            };
            var winHeight = getViewPaneSize().height, offset = winHeight * -1 + offsetTop;
            offset += (node.offsetHeight || 0);
            var elementPosition = domUtils.getXY(node);
            offset += elementPosition.y;
            var currentScroll = getScrollPosition(win).y;
            // offset += 50;
            if (offset > currentScroll || offset < currentScroll - winHeight) {
                win.scrollTo(0, offset + (offset < 0 ? -20 : 20));
            }
        },
        /**
     * 判断节点是否为br
     * @function
     * @param {Node}    node   节点
     */
        isBr: function(node) {
            return node.nodeType == 1 && node.tagName == 'BR';
        },
        isFillChar: function(node) {
            return node.nodeType == 3 && !node.nodeValue.replace(new RegExp(domUtils.fillChar), '').length
        },
        isStartInblock: function(range) {
            var tmpRange = range.cloneRange(),
            flag = 0,
            start = tmpRange.startContainer,
            tmp;
            while (start && domUtils.isFillChar(start)) {
                tmp = start;
                start = start.previousSibling
            }
            if (tmp) {
                tmpRange.setStartBefore(tmp);
                start = tmpRange.startContainer;
            }
            if (start.nodeType == 1 && domUtils.isEmptyNode(start) && tmpRange.startOffset == 1) {
                tmpRange.setStart(start, 0).collapse(true);
            }
            while (!tmpRange.startOffset) {
                start = tmpRange.startContainer;
                if (domUtils.isBlockElm(start) || domUtils.isBody(start)) {
                    flag = 1;
                    break;
                }
                var pre = tmpRange.startContainer.previousSibling,
                tmpNode;
                if (!pre) {
                    tmpRange.setStartBefore(tmpRange.startContainer);
                } else {
                    while (pre && domUtils.isFillChar(pre)) {
                        tmpNode = pre;
                        pre = pre.previousSibling;
                    }
                    if (tmpNode) {
                        tmpRange.setStartBefore(tmpNode);
                    } else {
                        tmpRange.setStartBefore(tmpRange.startContainer);
                    }
                }
            }
            return flag && !domUtils.isBody(tmpRange.startContainer) ? 1 : 0;
        },
        isEmptyBlock: function(node) {
            var reg = new RegExp('[ \t\r\n' + domUtils.fillChar + ']', 'g');
            if (node[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').length > 0) {
                return 0;
            }
            for (var n in dtd.$isNotEmpty) {
                if (node.getElementsByTagName(n).length) {
                    return 0;
                }
            }
            return 1;
        },

        setViewportOffset: function(element, offset) {
            var left = parseInt(element.style.left) | 0;
            var top = parseInt(element.style.top) | 0;
            var rect = element.getBoundingClientRect();
            var offsetLeft = offset.left - rect.left;
            var offsetTop = offset.top - rect.top;
            if (offsetLeft) {
                element.style.left = left + offsetLeft + 'px';
            }
            if (offsetTop) {
                element.style.top = top + offsetTop + 'px';
            }
        },
        fillNode: function(doc, node) {
            var tmpNode = browser.ie ? doc.createTextNode(domUtils.fillChar) : doc.createElement('br');
            node.innerHTML = '';
            node.appendChild(tmpNode);
        },
        moveChild: function(src, tag, dir) {
            while (src.firstChild) {
                if (dir && tag.firstChild) {
                    tag.insertBefore(src.lastChild, tag.firstChild);
                } else {
                    tag.appendChild(src.firstChild);
                }
            }
        },
        //判断是否有额外属性
        hasNoAttributes: function(node) {
            return browser.ie ? /^<\w+\s*?>/.test(node.outerHTML) : node.attributes.length == 0;
        },
        //判断是否是编辑器自定义的参数
        isCustomeNode: function(node) {
            return node.nodeType == 1 && node.getAttribute('_ue_custom_node_');
        },
        isTagNode: function(node, tagName) {
            return node.nodeType == 1 && new RegExp(node.tagName, 'i').test(tagName)
        },
        /**
     * 对于nodelist用filter进行过滤
     * @name filterNodeList
     * @since 1.2.4+
     * @grammar UE.dom.domUtils.filterNodeList(nodelist,filter,onlyFirst)  => 节点
     * @example
     * UE.dom.domUtils.filterNodeList(document.getElementsByTagName('*'),'div p') //返回第一个是div或者p的节点
     * UE.dom.domUtils.filterNodeList(document.getElementsByTagName('*'),function(n){return n.getAttribute('src')})
     * //返回第一个带src属性的节点
     * UE.dom.domUtils.filterNodeList(document.getElementsByTagName('*'),'i',true) //返回数组，里边都是i节点
     */
        filterNodeList: function(nodelist, filter, forAll) {
            var results = [];
            if (!utils.isFunction(filter)) {
                var str = filter;
                filter = function(n) {
                    return utils.indexOf(utils.isArray(str) ? str : str.split(' '), n.tagName.toLowerCase()) != -1
                };
            }
            utils.each(nodelist, function(n) {
                filter(n) && results.push(n)
            });
            return results.length == 0 ? null : results.length == 1 || !forAll ? results[0] : results
        },

        isInNodeEndBoundary: function(rng, node) {
            var start = rng.startContainer;
            if (start.nodeType == 3 && rng.startOffset != start.nodeValue.length) {
                return 0;
            }
            if (start.nodeType == 1 && rng.startOffset != start.childNodes.length) {
                return 0;
            }
            while (start !== node) {
                if (start.nextSibling) {
                    return 0
                }
                ;
                start = start.parentNode;
            }
            return 1;
        }
    };
    var fillCharReg = new RegExp(domUtils.fillChar, 'g');
    ///import editor.js
    ///import core/utils.js
    ///import core/browser.js
    ///import core/dom/dom.js
    ///import core/dom/dtd.js
    ///import core/dom/domUtils.js
    /**
 * @file
 * @name UE.dom.Range
 * @anthor zhanyi
 * @short Range
 * @import editor.js,core/utils.js,core/browser.js,core/dom/domUtils.js,core/dom/dtd.js
 * @desc Range范围实现类，本类是UEditor底层核心类，统一w3cRange和ieRange之间的差异，包括接口和属性
 */
    (function() {
        var guid = 0,
        fillChar = domUtils.fillChar,
        fillData;

        /**
     * 更新range的collapse状态
     * @param  {Range}   range    range对象
     */
        function updateCollapse(range) {
            range.collapsed =
            range.startContainer && range.endContainer &&
            range.startContainer === range.endContainer &&
            range.startOffset == range.endOffset;
        }

        function selectOneNode(rng) {
            return !rng.collapsed && rng.startContainer.nodeType == 1 && rng.startContainer === rng.endContainer && rng.endOffset - rng.startOffset == 1
        }
        function setEndPoint(toStart, node, offset, range) {
            //如果node是自闭合标签要处理
            if (node.nodeType == 1 && (dtd.$empty[node.tagName] || dtd.$nonChild[node.tagName])) {
                offset = domUtils.getNodeIndex(node) + (toStart ? 0 : 1);
                node = node.parentNode;
            }
            if (toStart) {
                range.startContainer = node;
                range.startOffset = offset;
                if (!range.endContainer) {
                    range.collapse(true);
                }
            } else {
                range.endContainer = node;
                range.endOffset = offset;
                if (!range.startContainer) {
                    range.collapse(false);
                }
            }
            updateCollapse(range);
            return range;
        }

        function execContentsAction(range, action) {
            //调整边界
            //range.includeBookmark();
            var start = range.startContainer,
            end = range.endContainer,
            startOffset = range.startOffset,
            endOffset = range.endOffset,
            doc = range.document,
            frag = doc.createDocumentFragment(),
            tmpStart, tmpEnd;
            if (start.nodeType == 1) {
                start = start.childNodes[startOffset] || (tmpStart = start.appendChild(doc.createTextNode('')));
            }
            if (end.nodeType == 1) {
                end = end.childNodes[endOffset] || (tmpEnd = end.appendChild(doc.createTextNode('')));
            }
            if (start === end && start.nodeType == 3) {
                frag.appendChild(doc.createTextNode(start.substringData(startOffset, endOffset - startOffset)));
                //is not clone
                if (action) {
                    start.deleteData(startOffset, endOffset - startOffset);
                    range.collapse(true);
                }
                return frag;
            }
            var current, currentLevel, clone = frag,
            startParents = domUtils.findParents(start, true), endParents = domUtils.findParents(end, true);
            for (var i = 0; startParents[i] == endParents[i]; ) {
                i++;
            }
            for (var j = i, si; si = startParents[j]; j++) {
                current = si.nextSibling;
                if (si == start) {
                    if (!tmpStart) {
                        if (range.startContainer.nodeType == 3) {
                            clone.appendChild(doc.createTextNode(start.nodeValue.slice(startOffset)));
                            //is not clone
                            if (action) {
                                start.deleteData(startOffset, start.nodeValue.length - startOffset);
                            }
                        } else {
                            clone.appendChild(!action ? start.cloneNode(true) : start);
                        }
                    }
                } else {
                    currentLevel = si.cloneNode(false);
                    clone.appendChild(currentLevel);
                }
                while (current) {
                    if (current === end || current === endParents[j]) {
                        break;
                    }
                    si = current.nextSibling;
                    clone.appendChild(!action ? current.cloneNode(true) : current);
                    current = si;
                }
                clone = currentLevel;
            }
            clone = frag;
            if (!startParents[i]) {
                clone.appendChild(startParents[i - 1].cloneNode(false));
                clone = clone.firstChild;
            }
            for (var j = i, ei; ei = endParents[j]; j++) {
                current = ei.previousSibling;
                if (ei == end) {
                    if (!tmpEnd && range.endContainer.nodeType == 3) {
                        clone.appendChild(doc.createTextNode(end.substringData(0, endOffset)));
                        //is not clone
                        if (action) {
                            end.deleteData(0, endOffset);
                        }
                    }
                } else {
                    currentLevel = ei.cloneNode(false);
                    clone.appendChild(currentLevel);
                }
                //如果两端同级，右边第一次已经被开始做了
                if (j != i || !startParents[i]) {
                    while (current) {
                        if (current === start) {
                            break;
                        }
                        ei = current.previousSibling;
                        clone.insertBefore(!action ? current.cloneNode(true) : current, clone.firstChild);
                        current = ei;
                    }
                }
                clone = currentLevel;
            }
            if (action) {
                range.setStartBefore(!endParents[i] ? endParents[i - 1] : !startParents[i] ? startParents[i - 1] : endParents[i]).collapse(true);
            }
            tmpStart && domUtils.remove(tmpStart);
            tmpEnd && domUtils.remove(tmpEnd);
            return frag;
        }

        /**
     * @name Range
     * @grammar new UE.dom.Range(document)  => Range 实例
     * @desc 创建一个跟document绑定的空的Range实例
     * - ***startContainer*** 开始边界的容器节点,可以是elementNode或者是textNode
     * - ***startOffset*** 容器节点中的偏移量，如果是elementNode就是childNodes中的第几个，如果是textNode就是nodeValue的第几个字符
     * - ***endContainer*** 结束边界的容器节点,可以是elementNode或者是textNode
     * - ***endOffset*** 容器节点中的偏移量，如果是elementNode就是childNodes中的第几个，如果是textNode就是nodeValue的第几个字符
     * - ***document*** 跟range关联的document对象
     * - ***collapsed*** 是否是闭合状态
     */
        var Range = dom.Range = function(document) {
            var me = this;
            me.startContainer =
            me.startOffset =
            me.endContainer =
            me.endOffset = null;
            me.document = document;
            me.collapsed = true;
        };

        /**
     * 删除fillData
     * @param doc
     * @param excludeNode
     */
        function removeFillData(doc, excludeNode) {
            try {
                if (fillData && domUtils.inDoc(fillData, doc)) {
                    if (!fillData.nodeValue.replace(fillCharReg, '').length) {
                        var tmpNode = fillData.parentNode;
                        domUtils.remove(fillData);
                        while (tmpNode && domUtils.isEmptyInlineElement(tmpNode) &&
                        //safari的contains有bug
                        (browser.safari ? !(domUtils.getPosition(tmpNode, excludeNode) & domUtils.POSITION_CONTAINS) : !tmpNode.contains(excludeNode))
                        ) {
                            fillData = tmpNode.parentNode;
                            domUtils.remove(tmpNode);
                            tmpNode = fillData;
                        }
                    } else {
                        fillData.nodeValue = fillData.nodeValue.replace(fillCharReg, '');
                    }
                }
            } catch (e) {
            }
        }

        /**
     *
     * @param node
     * @param dir
     */
        function mergeSibling(node, dir) {
            var tmpNode;
            node = node[dir];
            while (node && domUtils.isFillChar(node)) {
                tmpNode = node[dir];
                domUtils.remove(node);
                node = tmpNode;
            }
        }

        Range.prototype = {
            /**
         * @name cloneContents
         * @grammar range.cloneContents()  => DocumentFragment
         * @desc 克隆选中的内容到一个fragment里，如果选区是空的将返回null
         */
            cloneContents: function() {
                return this.collapsed ? null : execContentsAction(this, 0);
            },
            /**
         * @name deleteContents
         * @grammar range.deleteContents()  => Range
         * @desc 删除当前选区范围中的所有内容并返回range实例，这时的range已经变成了闭合状态
         * @example
         * DOM Element :
         * <b>x<i>x[x<i>xx]x</b>
         * //执行方法后
         * <b>x<i>x<i>|x</b>
         * 注意range改变了
         * range.startContainer => b
         * range.startOffset  => 2
         * range.endContainer => b
         * range.endOffset => 2
         * range.collapsed => true
         */
            deleteContents: function() {
                var txt;
                if (!this.collapsed) {
                    execContentsAction(this, 1);
                }
                if (browser.webkit) {
                    txt = this.startContainer;
                    if (txt.nodeType == 3 && !txt.nodeValue.length) {
                        this.setStartBefore(txt).collapse(true);
                        domUtils.remove(txt);
                    }
                }
                return this;
            },
            /**
         * @name extractContents
         * @grammar range.extractContents()  => DocumentFragment
         * @desc 将当前的内容放到一个fragment里并返回这个fragment，这时的range已经变成了闭合状态
         * @example
         * DOM Element :
         * <b>x<i>x[x<i>xx]x</b>
         * //执行方法后
         * 返回的fragment里的 dom结构是
         * <i>x<i>xx
         * dom树上的结构是
         * <b>x<i>x<i>|x</b>
         * 注意range改变了
         * range.startContainer => b
         * range.startOffset  => 2
         * range.endContainer => b
         * range.endOffset => 2
         * range.collapsed => true
         */
            extractContents: function() {
                return this.collapsed ? null : execContentsAction(this, 2);
            },
            /**
         * @name  setStart
         * @grammar range.setStart(node,offset)  => Range
         * @desc    设置range的开始位置位于node节点内，偏移量为offset
         * 如果node是elementNode那offset指的是childNodes中的第几个，如果是textNode那offset指的是nodeValue的第几个字符
         */
            setStart: function(node, offset) {
                return setEndPoint(true, node, offset, this);
            },
            /**
         * 设置range的结束位置位于node节点，偏移量为offset
         * 如果node是elementNode那offset指的是childNodes中的第几个，如果是textNode那offset指的是nodeValue的第几个字符
         * @name  setEnd
         * @grammar range.setEnd(node,offset)  => Range
         */
            setEnd: function(node, offset) {
                return setEndPoint(false, node, offset, this);
            },
            /**
         * 将Range开始位置设置到node节点之后
         * @name  setStartAfter
         * @grammar range.setStartAfter(node)  => Range
         * @example
         * <b>xx<i>x|x</i>x</b>
         * 执行setStartAfter(i)后
         * range.startContainer =>b
         * range.startOffset =>2
         */
            setStartAfter: function(node) {
                return this.setStart(node.parentNode, domUtils.getNodeIndex(node) + 1);
            },
            /**
         * 将Range开始位置设置到node节点之前
         * @name  setStartBefore
         * @grammar range.setStartBefore(node)  => Range
         * @example
         * <b>xx<i>x|x</i>x</b>
         * 执行setStartBefore(i)后
         * range.startContainer =>b
         * range.startOffset =>1
         */
            setStartBefore: function(node) {
                return this.setStart(node.parentNode, domUtils.getNodeIndex(node));
            },
            /**
         * 将Range结束位置设置到node节点之后
         * @name  setEndAfter
         * @grammar range.setEndAfter(node)  => Range
         * @example
         * <b>xx<i>x|x</i>x</b>
         * setEndAfter(i)后
         * range.endContainer =>b
         * range.endtOffset =>2
         */
            setEndAfter: function(node) {
                return this.setEnd(node.parentNode, domUtils.getNodeIndex(node) + 1);
            },
            /**
         * 将Range结束位置设置到node节点之前
         * @name  setEndBefore
         * @grammar range.setEndBefore(node)  => Range
         * @example
         * <b>xx<i>x|x</i>x</b>
         * 执行setEndBefore(i)后
         * range.endContainer =>b
         * range.endtOffset =>1
         */
            setEndBefore: function(node) {
                return this.setEnd(node.parentNode, domUtils.getNodeIndex(node));
            },
            /**
         * 将Range开始位置设置到node节点内的开始位置
         * @name  setStartAtFirst
         * @grammar range.setStartAtFirst(node)  => Range
         */
            setStartAtFirst: function(node) {
                return this.setStart(node, 0);
            },
            /**
         * 将Range开始位置设置到node节点内的结束位置
         * @name  setStartAtLast
         * @grammar range.setStartAtLast(node)  => Range
         */
            setStartAtLast: function(node) {
                return this.setStart(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);
            },
            /**
         * 将Range结束位置设置到node节点内的开始位置
         * @name  setEndAtFirst
         * @grammar range.setEndAtFirst(node)  => Range
         */
            setEndAtFirst: function(node) {
                return this.setEnd(node, 0);
            },
            /**
         * 将Range结束位置设置到node节点内的结束位置
         * @name  setEndAtLast
         * @grammar range.setEndAtLast(node)  => Range
         */
            setEndAtLast: function(node) {
                return this.setEnd(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);
            },

            /**
         * 选中完整的指定节点,并返回包含该节点的range
         * @name  selectNode
         * @grammar range.selectNode(node)  => Range
         */
            selectNode: function(node) {
                return this.setStartBefore(node).setEndAfter(node);
            },
            /**
         * 选中node内部的所有节点，并返回对应的range
         * @name selectNodeContents
         * @grammar range.selectNodeContents(node)  => Range
         * @example
         * <b>xx[x<i>xxx</i>]xxx</b>
         * 执行后
         * <b>[xxx<i>xxx</i>xxx]</b>
         * range.startContainer =>b
         * range.startOffset =>0
         * range.endContainer =>b
         * range.endOffset =>3
         */
            selectNodeContents: function(node) {
                return this.setStart(node, 0).setEndAtLast(node);
            },

            /**
         * 克隆一个新的range对象
         * @name  cloneRange
         * @grammar range.cloneRange() => Range
         */
            cloneRange: function() {
                var me = this;
                return new Range(me.document).setStart(me.startContainer, me.startOffset).setEnd(me.endContainer, me.endOffset);

            },

            /**
         * 让选区闭合到尾部，若toStart为真，则闭合到头部
         * @name  collapse
         * @grammar range.collapse() => Range
         * @grammar range.collapse(true) => Range   //闭合选区到头部
         */
            collapse: function(toStart) {
                var me = this;
                if (toStart) {
                    me.endContainer = me.startContainer;
                    me.endOffset = me.startOffset;
                } else {
                    me.startContainer = me.endContainer;
                    me.startOffset = me.endOffset;
                }
                me.collapsed = true;
                return me;
            },

            /**
         * 调整range的边界，使其"收缩"到最小的位置
         * @name  shrinkBoundary
         * @grammar range.shrinkBoundary()  => Range  //range开始位置和结束位置都调整，参见<code><a href="#adjustmentboundary">adjustmentBoundary</a></code>
         * @grammar range.shrinkBoundary(true)  => Range  //仅调整开始位置，忽略结束位置
         * @example
         * <b>xx[</b>xxxxx] ==> <b>xx</b>[xxxxx]
         * <b>x[xx</b><i>]xxx</i> ==> <b>x[xx]</b><i>xxx</i>
         * [<b><i>xxxx</i>xxxxxxx</b>] ==> <b><i>[xxxx</i>xxxxxxx]</b>
         */
            shrinkBoundary: function(ignoreEnd) {
                var me = this, child,
                collapsed = me.collapsed;
                function check(node) {
                    return node.nodeType == 1 && !domUtils.isBookmarkNode(node) && !dtd.$empty[node.tagName] && !dtd.$nonChild[node.tagName]
                }
                while (me.startContainer.nodeType == 1  //是element
                && (child = me.startContainer.childNodes[me.startOffset])  //子节点也是element
                && check(child)) {
                    me.setStart(child, 0);
                }
                if (collapsed) {
                    return me.collapse(true);
                }
                if (!ignoreEnd) {
                    while (me.endContainer.nodeType == 1  //是element
                    && me.endOffset > 0  //如果是空元素就退出 endOffset=0那么endOffst-1为负值，childNodes[endOffset]报错
                    && (child = me.endContainer.childNodes[me.endOffset - 1])  //子节点也是element
                    && check(child)) {
                        me.setEnd(child, child.childNodes.length);
                    }
                }
                return me;
            },
            /**
         * 获取当前range所在位置的公共祖先节点，当前range位置可以位于文本节点内，也可以包含整个元素节点，也可以位于两个节点之间
         * @name  getCommonAncestor
         * @grammar range.getCommonAncestor([includeSelf, ignoreTextNode])  => Element
         * @example
         * <b>xx[xx<i>xx]x</i>xxx</b> ==>getCommonAncestor() ==> b
         * <b>[<img/>]</b>
         * range.startContainer ==> b
         * range.startOffset ==> 0
         * range.endContainer ==> b
         * range.endOffset ==> 1
         * range.getCommonAncestor() ==> b
         * range.getCommonAncestor(true) ==> img
         * <b>xxx|xx</b>
         * range.startContainer ==> textNode
         * range.startOffset ==> 3
         * range.endContainer ==> textNode
         * range.endOffset ==> 3
         * range.getCommonAncestor() ==> textNode
         * range.getCommonAncestor(null,true) ==> b
         */
            getCommonAncestor: function(includeSelf, ignoreTextNode) {
                var me = this,
                start = me.startContainer,
                end = me.endContainer;
                if (start === end) {
                    if (includeSelf && selectOneNode(this)) {
                        start = start.childNodes[me.startOffset];
                        if (start.nodeType == 1)
                            return start;
                    }
                    //只有在上来就相等的情况下才会出现是文本的情况
                    return ignoreTextNode && start.nodeType == 3 ? start.parentNode : start;
                }
                return domUtils.getCommonAncestor(start, end);
            },
            /**
         * 调整边界容器，如果是textNode,就调整到elementNode上
         * @name trimBoundary
         * @grammar range.trimBoundary([ignoreEnd])  => Range //true忽略结束边界
         * @example
         * DOM Element :
         * <b>|xxx</b>
         * startContainer = xxx; startOffset = 0
         * //执行后本方法后
         * startContainer = <b>;  startOffset = 0
         * @example
         * Dom Element :
         * <b>xx|x</b>
         * startContainer = xxx;  startOffset = 2
         * //执行本方法后，xxx被实实在在地切分成两个TextNode
         * startContainer = <b>; startOffset = 1
         */
            trimBoundary: function(ignoreEnd) {
                this.txtToElmBoundary();
                var start = this.startContainer,
                offset = this.startOffset,
                collapsed = this.collapsed,
                end = this.endContainer;
                if (start.nodeType == 3) {
                    if (offset == 0) {
                        this.setStartBefore(start);
                    } else {
                        if (offset >= start.nodeValue.length) {
                            this.setStartAfter(start);
                        } else {
                            var textNode = domUtils.split(start, offset);
                            //跟新结束边界
                            if (start === end) {
                                this.setEnd(textNode, this.endOffset - offset);
                            } else if (start.parentNode === end) {
                                this.endOffset += 1;
                            }
                            this.setStartBefore(textNode);
                        }
                    }
                    if (collapsed) {
                        return this.collapse(true);
                    }
                }
                if (!ignoreEnd) {
                    offset = this.endOffset;
                    end = this.endContainer;
                    if (end.nodeType == 3) {
                        if (offset == 0) {
                            this.setEndBefore(end);
                        } else {
                            offset < end.nodeValue.length && domUtils.split(end, offset);
                            this.setEndAfter(end);
                        }
                    }
                }
                return this;
            },
            /**
         * 如果选区在文本的边界上，就扩展选区到文本的父节点上
         * @name  txtToElmBoundary
         * @example
         * Dom Element :
         * <b> |xxx</b>
         * startContainer = xxx;  startOffset = 0
         * //本方法执行后
         * startContainer = <b>; startOffset = 0
         * @example
         * Dom Element :
         * <b> xxx| </b>
         * startContainer = xxx; startOffset = 3
         * //本方法执行后
         * startContainer = <b>; startOffset = 1
         */
            txtToElmBoundary: function() {
                function adjust(r, c) {
                    var container = r[c + 'Container'],
                    offset = r[c + 'Offset'];
                    if (container.nodeType == 3) {
                        if (!offset) {
                            r['set' + c.replace(/(\w)/, function(a) {
                                return a.toUpperCase();
                            }) + 'Before'](container);
                        } else if (offset >= container.nodeValue.length) {
                            r['set' + c.replace(/(\w)/, function(a) {
                                return a.toUpperCase();
                            }) + 'After'](container);
                        }
                    }
                }

                if (!this.collapsed) {
                    adjust(this, 'start');
                    adjust(this, 'end');
                }
                return this;
            },

            /**
         * 在当前选区的开始位置前插入一个节点或者fragment，range的开始位置会在插入节点的前边
         * @name  insertNode
         * @grammar range.insertNode(node)  => Range //node可以是textNode,elementNode,fragment
         * @example
         * Range :
         * xxx[x<p>xxxx</p>xxxx]x<p>sdfsdf</p>
         * 待插入Node :
         * <p>ssss</p>
         * 执行本方法后的Range :
         * xxx[<p>ssss</p>x<p>xxxx</p>xxxx]x<p>sdfsdf</p>
         */
            insertNode: function(node) {
                var first = node, length = 1;
                if (node.nodeType == 11) {
                    first = node.firstChild;
                    length = node.childNodes.length;
                }
                this.trimBoundary(true);
                var start = this.startContainer,
                offset = this.startOffset;
                var nextNode = start.childNodes[offset];
                if (nextNode) {
                    start.insertBefore(node, nextNode);
                } else {
                    start.appendChild(node);
                }
                if (first.parentNode === this.endContainer) {
                    this.endOffset = this.endOffset + length;
                }
                return this.setStartBefore(first);
            },
            /**
         * 设置光标闭合位置,toEnd设置为true时光标将闭合到选区的结尾
         * @name  setCursor
         * @grammar range.setCursor([toEnd])  =>  Range   //toEnd为true时，光标闭合到选区的末尾
         */
            setCursor: function(toEnd, noFillData) {
                return this.collapse(!toEnd).select(noFillData);
            },
            /**
         * 创建当前range的一个书签，记录下当前range的位置，方便当dom树改变时，还能找回原来的选区位置
         * @name createBookmark
         * @grammar range.createBookmark([serialize])  => Object  //{start:开始标记,end:结束标记,id:serialize} serialize为真时，开始结束标记是插入节点的id，否则是插入节点的引用
         */
            createBookmark: function(serialize, same) {
                var endNode,
                startNode = this.document.createElement('span');
                startNode.style.cssText = 'display:none;line-height:0px;';
                startNode.appendChild(this.document.createTextNode('\uFEFF'));
                startNode.id = '_baidu_bookmark_start_' + (same ? '' : guid++);

                if (!this.collapsed) {
                    endNode = startNode.cloneNode(true);
                    endNode.id = '_baidu_bookmark_end_' + (same ? '' : guid++);
                }
                this.insertNode(startNode);
                if (endNode) {
                    this.collapse().insertNode(endNode).setEndBefore(endNode);
                }
                this.setStartAfter(startNode);
                return {
                    start: serialize ? startNode.id : startNode,
                    end: endNode ? serialize ? endNode.id : endNode : null,
                    id: serialize
                }
            },
            /**
         *  移动边界到书签位置，并删除插入的书签节点
         *  @name  moveToBookmark
         *  @grammar range.moveToBookmark(bookmark)  => Range //让当前的range选到给定bookmark的位置,bookmark对象是由range.createBookmark创建的
         */
            moveToBookmark: function(bookmark) {
                var start = bookmark.id ? this.document.getElementById(bookmark.start) : bookmark.start,
                end = bookmark.end && bookmark.id ? this.document.getElementById(bookmark.end) : bookmark.end;
                this.setStartBefore(start);
                domUtils.remove(start);
                if (end) {
                    this.setEndBefore(end);
                    domUtils.remove(end);
                } else {
                    this.collapse(true);
                }
                return this;
            },
            /**
         * 调整range的边界，使其"放大"到最近的父block节点
         * @name  enlarge
         * @grammar range.enlarge()  =>  Range
         * @example
         * <p><span>xxx</span><b>x[x</b>xxxxx]</p><p>xxx</p> ==> [<p><span>xxx</span><b>xx</b>xxxxx</p>]<p>xxx</p>
         */
            enlarge: function(toBlock, stopFn) {
                var isBody = domUtils.isBody,
                pre, node, tmp = this.document.createTextNode('');
                if (toBlock) {
                    node = this.startContainer;
                    if (node.nodeType == 1) {
                        if (node.childNodes[this.startOffset]) {
                            pre = node = node.childNodes[this.startOffset]
                        } else {
                            node.appendChild(tmp);
                            pre = node = tmp;
                        }
                    } else {
                        pre = node;
                    }
                    while (1) {
                        if (domUtils.isBlockElm(node)) {
                            node = pre;
                            while ((pre = node.previousSibling) && !domUtils.isBlockElm(pre)) {
                                node = pre;
                            }
                            this.setStartBefore(node);
                            break;
                        }
                        pre = node;
                        node = node.parentNode;
                    }
                    node = this.endContainer;
                    if (node.nodeType == 1) {
                        if (pre = node.childNodes[this.endOffset]) {
                            node.insertBefore(tmp, pre);
                        } else {
                            node.appendChild(tmp);
                        }
                        pre = node = tmp;
                    } else {
                        pre = node;
                    }
                    while (1) {
                        if (domUtils.isBlockElm(node)) {
                            node = pre;
                            while ((pre = node.nextSibling) && !domUtils.isBlockElm(pre)) {
                                node = pre;
                            }
                            this.setEndAfter(node);
                            break;
                        }
                        pre = node;
                        node = node.parentNode;
                    }
                    if (tmp.parentNode === this.endContainer) {
                        this.endOffset--;
                    }
                    domUtils.remove(tmp);
                }

                // 扩展边界到最大
                if (!this.collapsed) {
                    while (this.startOffset == 0) {
                        if (stopFn && stopFn(this.startContainer)) {
                            break;
                        }
                        if (isBody(this.startContainer)) {
                            break;
                        }
                        this.setStartBefore(this.startContainer);
                    }
                    while (this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length)) {
                        if (stopFn && stopFn(this.endContainer)) {
                            break;
                        }
                        if (isBody(this.endContainer)) {
                            break;
                        }
                        this.setEndAfter(this.endContainer);
                    }
                }
                return this;
            },
            /**
         * 调整Range的边界，使其"缩小"到最合适的位置
         * @name adjustmentBoundary
         * @grammar range.adjustmentBoundary() => Range   //参见<code><a href="#shrinkboundary">shrinkBoundary</a></code>
         * @example
         * <b>xx[</b>xxxxx] ==> <b>xx</b>[xxxxx]
         * <b>x[xx</b><i>]xxx</i> ==> <b>x[xx</b>]<i>xxx</i>
         */
            adjustmentBoundary: function() {
                if (!this.collapsed) {
                    while (!domUtils.isBody(this.startContainer) &&
                    this.startOffset == this.startContainer[this.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
                    ) {
                        this.setStartAfter(this.startContainer);
                    }
                    while (!domUtils.isBody(this.endContainer) && !this.endOffset) {
                        this.setEndBefore(this.endContainer);
                    }
                }
                return this;
            },
            /**
         * 给range选区中的内容添加给定的标签，主要用于inline标签
         * @name applyInlineStyle
         * @grammar range.applyInlineStyle(tagName)        =>  Range    //tagName为需要添加的样式标签名
         * @grammar range.applyInlineStyle(tagName,attrs)  =>  Range    //attrs为属性json对象
         * @desc
         * <code type="html"><p>xxxx[xxxx]x</p>  ==>  range.applyInlineStyle("strong")  ==>  <p>xxxx[<strong>xxxx</strong>]x</p>
         * <p>xx[dd<strong>yyyy</strong>]x</p>  ==>  range.applyInlineStyle("strong")  ==>  <p>xx[<strong>ddyyyy</strong>]x</p>
         * <p>xxxx[xxxx]x</p>  ==>  range.applyInlineStyle("strong",{"style":"font-size:12px"})  ==>  <p>xxxx[<strong style="font-size:12px">xxxx</strong>]x</p></code>
         */
            applyInlineStyle: function(tagName, attrs, list) {
                if (this.collapsed)
                    return this;
                this.trimBoundary().enlarge(false,
                function(node) {
                    return node.nodeType == 1 && domUtils.isBlockElm(node)
                }).adjustmentBoundary();
                var bookmark = this.createBookmark(),
                end = bookmark.end,
                filterFn = function(node) {
                    return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !domUtils.isWhitespace(node);
                },
                current = domUtils.getNextDomNode(bookmark.start, false, filterFn),
                node,
                pre,
                range = this.cloneRange();
                while (current && (domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING)) {
                    if (current.nodeType == 3 || dtd[tagName][current.tagName]) {
                        range.setStartBefore(current);
                        node = current;
                        while (node && (node.nodeType == 3 || dtd[tagName][node.tagName]) && node !== end) {
                            pre = node;
                            node = domUtils.getNextDomNode(node, node.nodeType == 1, null, function(parent) {
                                return dtd[tagName][parent.tagName];
                            });
                        }
                        var frag = range.setEndAfter(pre).extractContents(), elm;
                        if (list && list.length > 0) {
                            var level, top;
                            top = level = list[0].cloneNode(false);
                            for (var i = 1, ci; ci = list[i++]; ) {
                                level.appendChild(ci.cloneNode(false));
                                level = level.firstChild;
                            }
                            elm = level;
                        } else {
                            elm = range.document.createElement(tagName);
                        }
                        if (attrs) {
                            domUtils.setAttributes(elm, attrs);
                        }
                        elm.appendChild(frag);
                        range.insertNode(list ? top : elm);
                        //处理下滑线在a上的情况
                        var aNode;
                        if (tagName == 'span' && attrs.style && /text\-decoration/.test(attrs.style) && (aNode = domUtils.findParentByTagName(elm, 'a', true))) {
                            domUtils.setAttributes(aNode, attrs);
                            domUtils.remove(elm, true);
                            elm = aNode;
                        } else {
                            domUtils.mergeSibling(elm);
                            domUtils.clearEmptySibling(elm);
                        }
                        //去除子节点相同的
                        domUtils.mergeChild(elm, attrs);
                        current = domUtils.getNextDomNode(elm, false, filterFn);
                        domUtils.mergeToParent(elm);
                        if (node === end) {
                            break;
                        }
                    } else {
                        current = domUtils.getNextDomNode(current, true, filterFn);
                    }
                }
                return this.moveToBookmark(bookmark);
            },
            /**
         * 对当前range选中的节点，去掉给定的标签节点，但标签中的内容保留，主要用于处理inline元素
         * @name removeInlineStyle
         * @grammar range.removeInlineStyle(tagNames)  => Range  //tagNames 为需要去掉的样式标签名,支持"b"或者["b","i","u"]
         * @desc
         * <code type="html">xx[x<span>xxx<em>yyy</em>zz]z</span>  => range.removeInlineStyle(["em"])  => xx[x<span>xxxyyyzz]z</span></code>
         */
            removeInlineStyle: function(tagNames) {
                if (this.collapsed)
                    return this;
                tagNames = utils.isArray(tagNames) ? tagNames : [tagNames];
                this.shrinkBoundary().adjustmentBoundary();
                var start = this.startContainer, end = this.endContainer;
                while (1) {
                    if (start.nodeType == 1) {
                        if (utils.indexOf(tagNames, start.tagName.toLowerCase()) > -1) {
                            break;
                        }
                        if (start.tagName.toLowerCase() == 'body') {
                            start = null;
                            break;
                        }
                    }
                    start = start.parentNode;
                }
                while (1) {
                    if (end.nodeType == 1) {
                        if (utils.indexOf(tagNames, end.tagName.toLowerCase()) > -1) {
                            break;
                        }
                        if (end.tagName.toLowerCase() == 'body') {
                            end = null;
                            break;
                        }
                    }
                    end = end.parentNode;
                }
                var bookmark = this.createBookmark(),
                frag,
                tmpRange;
                if (start) {
                    tmpRange = this.cloneRange().setEndBefore(bookmark.start).setStartBefore(start);
                    frag = tmpRange.extractContents();
                    tmpRange.insertNode(frag);
                    domUtils.clearEmptySibling(start, true);
                    start.parentNode.insertBefore(bookmark.start, start);
                }
                if (end) {
                    tmpRange = this.cloneRange().setStartAfter(bookmark.end).setEndAfter(end);
                    frag = tmpRange.extractContents();
                    tmpRange.insertNode(frag);
                    domUtils.clearEmptySibling(end, false, true);
                    end.parentNode.insertBefore(bookmark.end, end.nextSibling);
                }
                var current = domUtils.getNextDomNode(bookmark.start, false, function(node) {
                    return node.nodeType == 1;
                }), next;
                while (current && current !== bookmark.end) {
                    next = domUtils.getNextDomNode(current, true, function(node) {
                        return node.nodeType == 1;
                    });
                    if (utils.indexOf(tagNames, current.tagName.toLowerCase()) > -1) {
                        domUtils.remove(current, true);
                    }
                    current = next;
                }
                return this.moveToBookmark(bookmark);
            },
            /**
         * 得到一个自闭合的节点,常用于获取自闭和的节点，例如图片节点
         * @name  getClosedNode
         * @grammar range.getClosedNode()  => node|null
         * @example
         * <b>xxxx[<img />]xxx</b>
         */
            getClosedNode: function() {
                var node;
                if (!this.collapsed) {
                    var range = this.cloneRange().adjustmentBoundary().shrinkBoundary();
                    if (selectOneNode(range)) {
                        var child = range.startContainer.childNodes[range.startOffset];
                        if (child && child.nodeType == 1 && (dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName])) {
                            node = child;
                        }
                    }
                }
                return node;
            },
            /**
         * 根据当前range选中内容节点（在页面上表现为反白显示）
         * @name select
         * @grammar range.select();  => Range
         */
            select: browser.ie ? function(noFillData, textRange) {
                var nativeRange;
                if (!this.collapsed)
                    this.shrinkBoundary();
                var node = this.getClosedNode();
                if (node && !textRange) {
                    try {
                        nativeRange = this.document.body.createControlRange();
                        nativeRange.addElement(node);
                        nativeRange.select();
                    } catch (e) {
                    }
                    return this;
                }
                var bookmark = this.createBookmark(),
                start = bookmark.start,
                end;
                nativeRange = this.document.body.createTextRange();
                nativeRange.moveToElementText(start);
                nativeRange.moveStart('character', 1);
                if (!this.collapsed) {
                    var nativeRangeEnd = this.document.body.createTextRange();
                    end = bookmark.end;
                    nativeRangeEnd.moveToElementText(end);
                    nativeRange.setEndPoint('EndToEnd', nativeRangeEnd);
                } else {
                    if (!noFillData && this.startContainer.nodeType != 3) {
                        //使用<span>|x<span>固定住光标
                        var tmpText = this.document.createTextNode(fillChar),
                        tmp = this.document.createElement('span');
                        tmp.appendChild(this.document.createTextNode(fillChar));
                        start.parentNode.insertBefore(tmp, start);
                        start.parentNode.insertBefore(tmpText, start);
                        //当点b,i,u时，不能清除i上边的b
                        removeFillData(this.document, tmpText);
                        fillData = tmpText;
                        mergeSibling(tmp, 'previousSibling');
                        mergeSibling(start, 'nextSibling');
                        nativeRange.moveStart('character', -1);
                        nativeRange.collapse(true);
                    }
                }
                this.moveToBookmark(bookmark);
                tmp && domUtils.remove(tmp);
                //IE在隐藏状态下不支持range操作，catch一下
                try {
                    nativeRange.select();
                } catch (e) {
                }
                return this;
            } : function(notInsertFillData) {
                var win = domUtils.getWindow(this.document),
                sel = win.getSelection(),
                txtNode;
                //FF下关闭自动长高时滚动条在关闭dialog时会跳
                //ff下如果不body.focus将不能定位闭合光标到编辑器内
                browser.gecko ? this.document.body.focus() : win.focus();
                if (sel) {
                    sel.removeAllRanges();
                    // trace:870 chrome/safari后边是br对于闭合得range不能定位 所以去掉了判断
                    // this.startContainer.nodeType != 3 &&! ((child = this.startContainer.childNodes[this.startOffset]) && child.nodeType == 1 && child.tagName == 'BR'
                    if (this.collapsed) {
                        //opear如果没有节点接着，原生的不能够定位,不能在body的第一级插入空白节点
                        if (notInsertFillData && browser.opera && !domUtils.isBody(this.startContainer) && this.startContainer.nodeType == 1) {
                            var tmp = this.document.createTextNode('');
                            this.insertNode(tmp).setStart(tmp, 0).collapse(true);
                        }

                        //处理光标落在文本节点的情况
                        //处理以下的情况
                        //<b>|xxxx</b>
                        //<b>xxxx</b>|xxxx
                        //xxxx<b>|</b>
                        if (!notInsertFillData && (
                        this.startContainer.nodeType != 3 ||
                        this.startOffset == 0 && (!this.startContainer.previousSibling || this.startContainer.previousSibling.nodeType != 3)
                        )) {
                            txtNode = this.document.createTextNode(fillChar);
                            //跟着前边走
                            this.insertNode(txtNode);
                            removeFillData(this.document, txtNode);
                            mergeSibling(txtNode, 'previousSibling');
                            mergeSibling(txtNode, 'nextSibling');
                            fillData = txtNode;
                            this.setStart(txtNode, browser.webkit ? 1 : 0).collapse(true);
                        }
                    }
                    var nativeRange = this.document.createRange();
                    nativeRange.setStart(this.startContainer, this.startOffset);
                    nativeRange.setEnd(this.endContainer, this.endOffset);
                    sel.addRange(nativeRange);
                }
                return this;
            },
            /**
         * 滚动条跳到当然range开始的位置
         * @name scrollToView
         * @grammar range.scrollToView([win,offset]) => Range //针对window对象，若不指定，将以编辑区域的窗口为准,offset偏移量
         */
            scrollToView: function(win, offset) {
                win = win ? window : domUtils.getWindow(this.document);
                var me = this,
                span = me.document.createElement('span');
                //trace:717
                span.innerHTML = '&nbsp;';
                me.cloneRange().insertNode(span);
                domUtils.scrollToView(span, win, offset);
                domUtils.remove(span);
                return me;
            }
        };
    })();
    ///import editor.js
    ///import core/browser.js
    ///import core/dom/dom.js
    ///import core/dom/dtd.js
    ///import core/dom/domUtils.js
    ///import core/dom/Range.js
    /**
 * @class baidu.editor.dom.Selection    Selection类
 */
    (function() {

        function getBoundaryInformation(range, start) {
            var getIndex = domUtils.getNodeIndex;
            range = range.duplicate();
            range.collapse(start);
            var parent = range.parentElement();
            //如果节点里没有子节点，直接退出
            if (!parent.hasChildNodes()) {
                return {container: parent,offset: 0};
            }
            var siblings = parent.children,
            child,
            testRange = range.duplicate(),
            startIndex = 0, endIndex = siblings.length - 1, index = -1,
            distance;
            while (startIndex <= endIndex) {
                index = Math.floor((startIndex + endIndex) / 2);
                child = siblings[index];
                testRange.moveToElementText(child);
                var position = testRange.compareEndPoints('StartToStart', range);
                if (position > 0) {
                    endIndex = index - 1;
                } else if (position < 0) {
                    startIndex = index + 1;
                } else {
                    //trace:1043
                    return {container: parent,offset: getIndex(child)};
                }
            }
            if (index == -1) {
                testRange.moveToElementText(parent);
                testRange.setEndPoint('StartToStart', range);
                distance = testRange.text.replace(/(\r\n|\r)/g, '\n').length;
                siblings = parent.childNodes;
                if (!distance) {
                    child = siblings[siblings.length - 1];
                    return {container: child,offset: child.nodeValue.length};
                }

                var i = siblings.length;
                while (distance > 0) {
                    distance -= siblings[--i].nodeValue.length;
                }
                return {container: siblings[i],offset: -distance};
            }
            testRange.collapse(position > 0);
            testRange.setEndPoint(position > 0 ? 'StartToStart' : 'EndToStart', range);
            distance = testRange.text.replace(/(\r\n|\r)/g, '\n').length;
            if (!distance) {
                return dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName] ?
                {container: parent,offset: getIndex(child) + (position > 0 ? 0 : 1)} :
                {container: child,offset: position > 0 ? 0 : child.childNodes.length}
            }
            while (distance > 0) {
                try {
                    var pre = child;
                    child = child[position > 0 ? 'previousSibling' : 'nextSibling'];
                    distance -= child.nodeValue.length;
                } catch (e) {
                    return {container: parent,offset: getIndex(pre)};
                }
            }
            return {container: child,offset: position > 0 ? -distance : child.nodeValue.length + distance}
        }

        /**
     * 将ieRange转换为Range对象
     * @param {Range}   ieRange    ieRange对象
     * @param {Range}   range      Range对象
     * @return  {Range}  range       返回转换后的Range对象
     */
        function transformIERangeToRange(ieRange, range) {
            if (ieRange.item) {
                range.selectNode(ieRange.item(0));
            } else {
                var bi = getBoundaryInformation(ieRange, true);
                range.setStart(bi.container, bi.offset);
                if (ieRange.compareEndPoints('StartToEnd', ieRange) != 0) {
                    bi = getBoundaryInformation(ieRange, false);
                    range.setEnd(bi.container, bi.offset);
                }
            }
            return range;
        }

        /**
     * 获得ieRange
     * @param {Selection} sel    Selection对象
     * @return {ieRange}    得到ieRange
     */
        function _getIERange(sel) {
            var ieRange;
            //ie下有可能报错
            try {
                ieRange = sel.getNative().createRange();
            } catch (e) {
                return null;
            }
            var el = ieRange.item ? ieRange.item(0) : ieRange.parentElement();
            if ((el.ownerDocument || el) === sel.document) {
                return ieRange;
            }
            return null;
        }

        var Selection = dom.Selection = function(doc) {
            var me = this, iframe;
            me.document = doc;
            if (ie) {
                iframe = domUtils.getWindow(doc).frameElement;
                domUtils.on(iframe, 'beforedeactivate', function() {
                    me._bakIERange = me.getIERange();
                });
                domUtils.on(iframe, 'activate', function() {
                    try {
                        if (!_getIERange(me) && me._bakIERange) {
                            me._bakIERange.select();
                        }
                    } catch (ex) {
                    }
                    me._bakIERange = null;
                });
            }
            iframe = doc = null;
        };

        Selection.prototype = {
            /**
         * 获取原生seleciton对象
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getNative
         * @return {Selection}    获得selection对象
         */
            getNative: function() {
                var doc = this.document;
                try {
                    return !doc ? null : ie ? doc.selection : domUtils.getWindow(doc).getSelection();
                } catch (e) {
                    return null;
                }
            },
            /**
         * 获得ieRange
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getIERange
         * @return {ieRange}    返回ie原生的Range
         */
            getIERange: function() {
                var ieRange = _getIERange(this);
                if (!ieRange) {
                    if (this._bakIERange) {
                        return this._bakIERange;
                    }
                }
                return ieRange;
            },

            /**
         * 缓存当前选区的range和选区的开始节点
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.cache
         */
            cache: function() {
                this.clear();
                this._cachedRange = this.getRange();
                this._cachedStartElement = this.getStart();
                this._cachedStartElementPath = this.getStartElementPath();
            },

            getStartElementPath: function() {
                if (this._cachedStartElementPath) {
                    return this._cachedStartElementPath;
                }
                var start = this.getStart();
                if (start) {
                    return domUtils.findParents(start, true, null, true)
                }
                return [];
            },
            /**
         * 清空缓存
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.clear
         */
            clear: function() {
                this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null;
            },
            /**
         * 编辑器是否得到了选区
         */
            isFocus: function() {
                try {
                    return browser.ie && _getIERange(this) || !browser.ie && this.getNative().rangeCount ? true : false;
                } catch (e) {
                    return false;
                }

            },
            /**
         * 获取选区对应的Range
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getRange
         * @returns {baidu.editor.dom.Range}    得到Range对象
         */
            getRange: function() {
                var me = this;
                function optimze(range) {
                    var child = me.document.body.firstChild,
                    collapsed = range.collapsed;
                    while (child && child.firstChild) {
                        range.setStart(child, 0);
                        child = child.firstChild;
                    }
                    if (!range.startContainer) {
                        range.setStart(me.document.body, 0)
                    }
                    if (collapsed) {
                        range.collapse(true);
                    }
                }

                if (me._cachedRange != null) {
                    return this._cachedRange;
                }
                var range = new baidu.editor.dom.Range(me.document);
                if (ie) {
                    var nativeRange = me.getIERange();
                    if (nativeRange) {
                        transformIERangeToRange(nativeRange, range);
                    } else {
                        optimze(range);
                    }
                } else {
                    var sel = me.getNative();
                    if (sel && sel.rangeCount) {
                        var firstRange = sel.getRangeAt(0);
                        var lastRange = sel.getRangeAt(sel.rangeCount - 1);
                        range.setStart(firstRange.startContainer, firstRange.startOffset).setEnd(lastRange.endContainer, lastRange.endOffset);
                        if (range.collapsed && domUtils.isBody(range.startContainer) && !range.startOffset) {
                            optimze(range);
                        }
                    } else {
                        //trace:1734 有可能已经不在dom树上了，标识的节点
                        if (this._bakRange && domUtils.inDoc(this._bakRange.startContainer, this.document)) {
                            return this._bakRange;
                        }
                        optimze(range);
                    }
                }
                return this._bakRange = range;
            },

            /**
         * 获取开始元素，用于状态反射
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getStart
         * @return {Element}     获得开始元素
         */
            getStart: function() {
                if (this._cachedStartElement) {
                    return this._cachedStartElement;
                }
                var range = ie ? this.getIERange() : this.getRange(),
                tmpRange,
                start, tmp, parent;
                if (ie) {
                    if (!range) {
                        //todo 给第一个值可能会有问题
                        return this.document.body.firstChild;
                    }
                    //control元素
                    if (range.item) {
                        return range.item(0);
                    }
                    tmpRange = range.duplicate();
                    //修正ie下<b>x</b>[xx] 闭合后 <b>x|</b>xx
                    tmpRange.text.length > 0 && tmpRange.moveStart('character', 1);
                    tmpRange.collapse(1);
                    start = tmpRange.parentElement();
                    parent = tmp = range.parentElement();
                    while (tmp = tmp.parentNode) {
                        if (tmp == start) {
                            start = parent;
                            break;
                        }
                    }
                } else {
                    range.shrinkBoundary();
                    start = range.startContainer;
                    if (start.nodeType == 1 && start.hasChildNodes()) {
                        start = start.childNodes[Math.min(start.childNodes.length - 1, range.startOffset)];
                    }
                    if (start.nodeType == 3) {
                        return start.parentNode;
                    }
                }
                return start;
            },
            /**
         * 得到选区中的文本
         * @public
         * @function
         * @name    baidu.editor.dom.Selection.getText
         * @return  {String}    选区中包含的文本
         */
            getText: function() {
                var nativeSel, nativeRange;
                if (this.isFocus() && (nativeSel = this.getNative())) {
                    nativeRange = browser.ie ? nativeSel.createRange() : nativeSel.getRangeAt(0);
                    return browser.ie ? nativeRange.text : nativeRange.toString();
                }
                return '';
            }
        };
    })();
    /**
 * @file
 * @name UE.Editor
 * @short Editor
 * @import editor.js,core/utils.js,core/EventBase.js,core/browser.js,core/dom/dtd.js,core/dom/domUtils.js,core/dom/Range.js,core/dom/Selection.js,plugins/serialize.js
 * @desc 编辑器主类，包含编辑器提供的大部分公用接口
 */
    (function() {
        var uid = 0, _selectionChangeTimer;

        /**
     * 替换src和href
     * @private
     * @ignore
     * @param div
     */
        function replaceSrc(div) {
            var imgs = div.getElementsByTagName("img"),
            orgSrc;
            for (var i = 0, img; img = imgs[i++]; ) {
                if (orgSrc = img.getAttribute("orgSrc")) {
                    img.src = orgSrc;
                    img.removeAttribute("orgSrc");
                }
            }
            var as = div.getElementsByTagName("a");
            for (var i = 0, ai; ai = as[i++]; i++) {
                if (ai.getAttribute('data_ue_src')) {
                    ai.setAttribute('href', ai.getAttribute('data_ue_src'))
                }
            }
        }

        /**
     * @private
     * @ignore
     * @param form  编辑器所在的form元素
     * @param editor  编辑器实例对象
     */
        function setValue(form, editor) {
            var textarea;
            if (editor.textarea) {
                if (utils.isString(editor.textarea)) {
                    for (var i = 0, ti, tis = domUtils.getElementsByTagName(form, 'textarea'); ti = tis[i++]; ) {
                        if (ti.id == 'ueditor_textarea_' + editor.options.textarea) {
                            textarea = ti;
                            break;
                        }
                    }
                } else {
                    textarea = editor.textarea;
                }
            }
            if (!textarea) {
                form.appendChild(textarea = domUtils.createElement(document, 'textarea', {
                    'name': editor.options.textarea,
                    'id': 'ueditor_textarea_' + editor.options.textarea,
                    'style': "display:none"
                }));
                //不要产生多个textarea
                editor.textarea = textarea;
            }
            textarea.value = editor.hasContents() ?
            (editor.options.allHtmlEnabled ? editor.getAllHtml() : editor.getContent(null, null, true)) :
            ''
        }

        /**
     * UEditor编辑器类
     * @name Editor
     * @desc 创建一个跟编辑器实例
     * - ***container*** 编辑器容器对象
     * - ***iframe*** 编辑区域所在的iframe对象
     * - ***window*** 编辑区域所在的window
     * - ***document*** 编辑区域所在的document对象
     * - ***body*** 编辑区域所在的body对象
     * - ***selection*** 编辑区域的选区对象
     */
        var Editor = UE.Editor = function(options) {
            var me = this;
            me.uid = uid++;
            EventBase.call(me);
            me.commands = {};
            me.options = utils.extend(options || {}, UEDITOR_CONFIG, true);
            //设置默认的常用属性
            me.setOpt({
                isShow: true,
                initialContent: '欢迎使用ueditor!',
                autoClearinitialContent: false,
                iframeCssUrl: me.options.UEDITOR_HOME_URL + 'themes/iframe.css',
                textarea: 'editorValue',
                focus: false,
                initialFrameWidth: 1000,
                initialFrameHeight: me.options.minFrameHeight || 320, //兼容老版本配置项
                minFrameWidth: 800,
                minFrameHeight: 220,
                autoClearEmptyNode: true,
                fullscreen: false,
                readonly: false,
                zIndex: 999,
                imagePopup: true,
                enterTag: 'p',
                pageBreakTag: '_baidu_page_break_tag_',
                customDomain: false,
                lang: 'zh-cn',
                langPath: me.options.UEDITOR_HOME_URL + 'lang/',
                theme: 'default',
                themePath: me.options.UEDITOR_HOME_URL + 'themes/',
                allHtmlEnabled: false,
                scaleEnabled: false,
                tableNativeEditInFF: false
            });

            utils.loadFile(document, {
                src: me.options.langPath + me.options.lang + "/" + me.options.lang + ".js",
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            }, function() {
                //初始化插件
                for (var pi in UE.plugins) {
                    UE.plugins[pi].call(me);
                }
                me.langIsReady = true;

                me.fireEvent("langReady");
            });
            UE.instants['ueditorInstant' + me.uid] = me;
        };
        Editor.prototype = {
            /**
         * 当编辑器ready后执行传入的fn,如果编辑器已经完成ready，就马上执行fn，fn的中的this是编辑器实例。
         * 大部分的实例接口都需要放在该方法内部执行，否则在IE下可能会报错。
         * @name ready
         * @grammar editor.ready(fn) fn是当编辑器渲染好后执行的function
         * @example
         * var editor = new UE.ui.Editor();
         * editor.render("myEditor");
         * editor.ready(function(){
         *     editor.setContent("欢迎使用UEditor！");
         * })
         */
            ready: function(fn) {
                var me = this;
                if (fn) {
                    me.isReady ? fn.apply(me) : me.addListener('ready', fn);
                }
            },
            /**
         * 为编辑器设置默认参数值。若用户配置为空，则以默认配置为准
         * @grammar editor.setOpt(key,value);      //传入一个键、值对
         * @grammar editor.setOpt({ key:value});   //传入一个json对象
         */
            setOpt: function(key, val) {
                var obj = {};
                if (utils.isString(key)) {
                    obj[key] = val
                } else {
                    obj = key;
                }
                utils.extend(this.options, obj, true);
            },
            /**
         * 销毁编辑器实例对象
         * @name destroy
         * @grammar editor.destroy();
         */
            destroy: function(bool) {
                var me = this;
                me.fireEvent('destroy');
                var container = me.container;
                if (bool) {
                    var textarea = me.textarea;
                    if (!textarea) {
                        textarea = document.createElement('textarea');
                        container.parentNode.insertBefore(textarea, container);
                    } else {
                        textarea.style.display = ''
                    }
                    textarea.style.width = container.offsetWidth + 'px';
                    textarea.style.height = container.offsetHeight + 'px';
                    textarea.value = me.getContent();
                    textarea.id = me.key;
                }
                container.innerHTML = '';
                domUtils.remove(container);
                var key = me.key;
                //trace:2004
                for (var p in me) {
                    if (me.hasOwnProperty(p)) {
                        delete this[p];
                    }
                }
                UE.delEditor(key);

            },
            /**
         * 渲染编辑器的DOM到指定容器，必须且只能调用一次
         * @name render
         * @grammar editor.render(containerId);    //可以指定一个容器ID
         * @grammar editor.render(containerDom);   //也可以直接指定容器对象
         */
            render: function(container) {
                var me = this, options = me.options;
                if (utils.isString(container)) {
                    container = document.getElementById(container);
                }
                if (container) {
                    var useBodyAsViewport = ie && browser.version < 9,
                    html = (ie && browser.version < 9 ? '' : '<!DOCTYPE html>') +
                    '<html xmlns=\'http://www.w3.org/1999/xhtml\'' + (!useBodyAsViewport ? ' class=\'view\'' : '') + '><head>' +
                    (options.iframeCssUrl ? '<link rel=\'stylesheet\' type=\'text/css\' href=\'' + utils.unhtml(options.iframeCssUrl) + '\'/>' : '') +
                    '<style type=\'text/css\'>' +
                    //设置四周的留边
                    '.view{padding:0;word-wrap:break-word;cursor:text;height:100%;}\n' +
                    //设置默认字体和字号
                    //font-family不能呢随便改，在safari下fillchar会有解析问题
                    'body{margin:8px;font-family:sans-serif;font-size:16px;}' +
                    //设置段落间距
                    'p{margin:5px 0;}'
                    + (options.initialStyle || '') +
                    '</style></head><body' + (useBodyAsViewport ? ' class=\'view\'' : '') + '></body>';
                    if (options.customDomain && document.domain != location.hostname) {
                        html += '<script>window.parent.UE.instants[\'ueditorInstant' + me.uid + '\']._setup(document);</script></html>';
                        container.appendChild(domUtils.createElement(document, 'iframe', {
                            id: 'baidu_editor_' + me.uid,
                            width: "100%",
                            height: "100%",
                            frameborder: "0",
                            src: 'javascript:void(function(){document.open();document.domain="' + document.domain + '";' +
                            'document.write("' + html + '");document.close();}())'
                        }));
                    } else {
                        container.innerHTML = '<iframe id="' + 'baidu_editor_' + this.uid + '"' + 'width="100%" height="100%" scroll="no" frameborder="0" ></iframe>';
                        var doc = container.firstChild.contentWindow.document;
                        //去掉了原来的判断!browser.webkit，因为会导致onload注册的事件不触发
                        doc.open();
                        doc.write(html + '</html>');
                        doc.close();
                        me._setup(doc);
                    }
                    container.style.overflow = 'hidden';
                }
            },
            /**
         * 编辑器初始化
         * @private
         * @ignore
         * @param {Element} doc 编辑器Iframe中的文档对象
         */
            _setup: function(doc) {
                var me = this,
                options = me.options;
                if (ie) {
                    doc.body.disabled = true;
                    doc.body.contentEditable = true;
                    doc.body.disabled = false;
                } else {
                    doc.body.contentEditable = true;
                    doc.body.spellcheck = false;
                }
                me.document = doc;
                me.window = doc.defaultView || doc.parentWindow;
                me.iframe = me.window.frameElement;
                me.body = doc.body;
                //设置编辑器最小高度
                me.setHeight(Math.max(options.minFrameHeight, options.initialFrameHeight));
                me.selection = new dom.Selection(doc);
                //gecko初始化就能得到range,无法判断isFocus了
                var geckoSel;
                if (browser.gecko && (geckoSel = this.selection.getNative())) {
                    geckoSel.removeAllRanges();
                }
                this._initEvents();
                if (options.initialContent) {
                    if (options.autoClearinitialContent) {
                        var oldExecCommand = me.execCommand;
                        me.execCommand = function() {
                            me.fireEvent('firstBeforeExecCommand');
                            return oldExecCommand.apply(me, arguments);
                        };
                        this._setDefaultContent(options.initialContent);
                    } else
                        this.setContent(options.initialContent, true);
                }
                //为form提交提供一个隐藏的textarea
                for (var form = this.iframe.parentNode; !domUtils.isBody(form); form = form.parentNode) {
                    if (form.tagName == 'FORM') {
                        domUtils.on(form, 'submit', function() {
                            setValue(this, me);
                        });
                        break;
                    }
                }
                //编辑器不能为空内容
                if (domUtils.isEmptyNode(me.body)) {
                    me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';
                }
                //如果要求focus, 就把光标定位到内容开始
                if (options.focus) {
                    setTimeout(function() {
                        me.focus();
                        //如果自动清除开着，就不需要做selectionchange;
                        !me.options.autoClearinitialContent && me._selectionChange();
                    }, 0);
                }
                if (!me.container) {
                    me.container = this.iframe.parentNode;
                }
                if (options.fullscreen && me.ui) {
                    me.ui.setFullScreen(true);
                }
                //解决ff下点击图片会复制问题
                //ff下的table不能编辑
                if (browser.gecko) {
                    me.document.execCommand('enableObjectResizing', false, false);
                    me.document.execCommand('enableInlineTableEditing', false, options.tableNativeEditInFF);
                }
                me.isReady = 1;
                me.fireEvent('ready');
                options.onready && options.onready.call(me);
                if (!browser.ie) {
                    domUtils.on(me.window, ['blur', 'focus'], function(e) {
                        //chrome下会出现alt+tab切换时，导致选区位置不对
                        if (e.type == 'blur') {
                            me._bakRange = me.selection.getRange();
                            try {
                                me.selection.getNative().removeAllRanges();
                            } catch (e) {
                            }

                        } else {
                            try {
                                me._bakRange && me._bakRange.select();
                            } catch (e) {
                            }
                        }
                    });
                }
                //trace:1518 ff3.6body不够寛，会导致点击空白处无法获得焦点
                if (browser.gecko && browser.version <= 10902) {
                    //修复ff3.6初始化进来，不能点击获得焦点
                    me.body.contentEditable = false;
                    setTimeout(function() {
                        me.body.contentEditable = true;
                    }, 100);
                    setInterval(function() {
                        me.body.style.height = me.iframe.offsetHeight - 20 + 'px'
                    }, 100)
                }
                !options.isShow && me.setHide();
                options.readonly && me.setDisabled();
            },
            /**
         * 同步编辑器的数据，为提交数据做准备，主要用于你是手动提交的情况
         * @name sync
         * @grammar editor.sync(); //从编辑器的容器向上查找，如果找到就同步数据
         * @grammar editor.sync(formID); //formID制定一个要同步数据的form的id,编辑器的数据会同步到你指定form下
         * @desc
         * 后台取得数据得键值使用你容器上得''name''属性，如果没有就使用参数传入的''textarea''
         * @example
         * editor.sync();
         * form.sumbit(); //form变量已经指向了form元素
         *
         */
            sync: function(formId) {
                var me = this,
                form = formId ? document.getElementById(formId) :
                domUtils.findParent(me.iframe.parentNode, function(node) {
                    return node.tagName == 'FORM'
                }, true);
                form && setValue(form, me);
            },
            /**
         * 设置编辑器高度
         * @name setHeight
         * @grammar editor.setHeight(number);  //纯数值，不带单位
         */
            setHeight: function(height) {
                if (height !== parseInt(this.iframe.parentNode.style.height)) {
                    this.iframe.parentNode.style.height = height + 'px';
                }
                this.document.body.style.height = height - 20 + 'px';
            },

            /**
         * 获取编辑器内容
         * @name getContent
         * @grammar editor.getContent()  => String //若编辑器中只包含字符"&lt;p&gt;&lt;br /&gt;&lt;/p/&gt;"会返回空。
         * @grammar editor.getContent(fn)  => String
         * @example
         * getContent默认是会现调用hasContents来判断编辑器是否为空，如果是，就直接返回空字符串
         * 你也可以传入一个fn来接替hasContents的工作，定制判断的规则
         * editor.getContent(function(){
         *     return false //编辑器没有内容 ，getContent直接返回空
         * })
         */
            getContent: function(cmd, fn, isPreview) {
                var me = this;
                if (cmd && utils.isFunction(cmd)) {
                    fn = cmd;
                    cmd = '';
                }
                if (fn ? !fn() : !this.hasContents()) {
                    return '';
                }
                me.fireEvent('beforegetcontent', cmd);
                var reg = new RegExp(domUtils.fillChar, 'g'),
                //ie下取得的html可能会有\n存在，要去掉，在处理replace(/[\t\r\n]*/g,'');代码高量的\n不能去除
                html = me.body.innerHTML.replace(reg, '').replace(/>[\t\r\n]*?</g, '><');
                me.fireEvent('aftergetcontent', cmd);
                if (me.serialize) {
                    var node = me.serialize.parseHTML(html);
                    node = me.serialize.transformOutput(node);
                    html = me.serialize.toHTML(node);
                }

                if (ie && isPreview) {
                    //trace:2471
                    //两个br会导致空行，所以这里先注视掉
                    html = html //.replace(/<\s*br\s*\/?\s*>/gi,'<br/><br/>')
                    .replace(/<p>\s*?<\/p>/g, '<p>&nbsp;</p>');
                } else {
                    //多个&nbsp;要转换成空格加&nbsp;的形式，要不预览时会所成一个
                    html = html.replace(/(&nbsp;)+/g, function(s) {
                        for (var i = 0, str = [], l = s.split(';').length - 1; i < l; i++) {
                            str.push(i % 2 == 0 ? ' ' : '&nbsp;');
                        }
                        return str.join('');
                    });
                }

                return html;

            },
            /**
         * 取得完整的html代码，可以直接显示成完整的html文档
         * @name getAllHtml
         * @grammar editor.getAllHtml()  => String
         */
            getAllHtml: function() {
                var me = this,
                headHtml = {html: ''},
                html = '';
                me.fireEvent('getAllHtml', headHtml);
                return '<html><head>' + (me.options.charset ? '<meta http-equiv="Content-Type" content="text/html; charset=' + me.options.charset + '"/>' : '') + me.document.getElementsByTagName('head')[0].innerHTML + headHtml.html + '</head>'
                + '<body ' + (ie && browser.version < 9 ? 'class="view"' : '') + '>' + me.getContent(null, null, true) + '</body></html>';
            },
            /**
         * 得到编辑器的纯文本内容，但会保留段落格式
         * @name getPlainTxt
         * @grammar editor.getPlainTxt()  => String
         */
            getPlainTxt: function() {
                var reg = new RegExp(domUtils.fillChar, 'g'),
                html = this.body.innerHTML.replace(/[\n\r]/g, ''); //ie要先去了\n在处理
                html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
                .replace(/<br\/?>/gi, '\n')
                .replace(/<[^>/]+>/g, '')
                .replace(/(\n)?<\/([^>]+)>/g, function(a, b, c) {
                    return dtd.$block[c] ? '\n' : b ? b : '';
                });
                //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
                return html.replace(reg, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
            },

            /**
         * 获取编辑器中的纯文本内容,没有段落格式
         * @name getContentTxt
         * @grammar editor.getContentTxt()  => String
         */
            getContentTxt: function() {
                var reg = new RegExp(domUtils.fillChar, 'g');
                //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
                return this.body[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').replace(/\u00a0/g, ' ');
            },

            /**
         * 将html设置到编辑器中, 如果是用于初始化时给编辑器赋初值，则必须放在ready方法内部执行
         * @name setContent
         * @grammar editor.setContent(html)
         * @example
         * var editor = new UE.ui.Editor()
         * editor.ready(function(){
         *     //需要ready后执行，否则可能报错
         *     editor.setContent("欢迎使用UEditor！");
         * })
         */
            setContent: function(html, notFireSelectionchange) {
                var me = this,
                inline = utils.extend({a: 1,A: 1}, dtd.$inline, true),
                lastTagName;

                html = html
                .replace(/^[ \t\r\n]*?</, '<')
                .replace(/>[ \t\r\n]*?$/, '>')
                .replace(/>[\t\r\n]*?</g, '><') //代码高量的\n不能去除
                .replace(/[\s\/]?(\w+)?>[ \t\r\n]*?<\/?(\w+)/gi, function(a, b, c) {
                    if (b) {
                        lastTagName = c;
                    } else {
                        b = lastTagName;
                    }
                    return !inline[b] && !inline[c] ? a.replace(/>[ \t\r\n]*?</, '><') : a;
                });
                html = {'html': html};
                me.fireEvent('beforesetcontent', html);
                html = html.html;
                var serialize = this.serialize;
                if (serialize) {
                    var node = serialize.parseHTML(html);
                    node = serialize.transformInput(node);
                    node = serialize.filter(node);
                    html = serialize.toHTML(node);
                }
                //html.replace(new RegExp('[\t\n\r' + domUtils.fillChar + ']*','g'),'');
                //去掉了\t\n\r 如果有插入的代码，在源码切换所见即所得模式时，换行都丢掉了
                //\r在ie下的不可见字符，在源码切换时会变成多个&nbsp;
                //trace:1559
                this.body.innerHTML = html.replace(new RegExp('[\r' + domUtils.fillChar + ']*', 'g'), '');
                //处理ie6下innerHTML自动将相对路径转化成绝对路径的问题
                if (browser.ie && browser.version < 7) {
                    replaceSrc(this.document.body);
                }
                //给文本或者inline节点套p标签
                if (me.options.enterTag == 'p') {

                    var child = this.body.firstChild, tmpNode;
                    if (!child || child.nodeType == 1 &&
                    (dtd.$cdata[child.tagName] ||
                    domUtils.isCustomeNode(child)
                    )
                    && child === this.body.lastChild) {
                        this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>' + this.body.innerHTML;

                    } else {
                        var p = me.document.createElement('p');
                        while (child) {
                            while (child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName])) {
                                tmpNode = child.nextSibling;
                                p.appendChild(child);
                                child = tmpNode;
                            }
                            if (p.firstChild) {
                                if (!child) {
                                    me.body.appendChild(p);
                                    break;
                                } else {
                                    me.body.insertBefore(p, child);
                                    p = me.document.createElement('p');
                                }
                            }
                            child = child.nextSibling;
                        }
                    }
                }
                me.fireEvent('aftersetcontent');
                me.fireEvent('contentchange');
                !notFireSelectionchange && me._selectionChange();
                //清除保存的选区
                me._bakRange = me._bakIERange = null;
                //trace:1742 setContent后gecko能得到焦点问题
                var geckoSel;
                if (browser.gecko && (geckoSel = this.selection.getNative())) {
                    geckoSel.removeAllRanges();
                }
            },

            /**
         * 让编辑器获得焦点，toEnd确定focus位置
         * @name focus
         * @grammar editor.focus([toEnd])   //默认focus到编辑器头部，toEnd为true时focus到内容尾部
         */
            focus: function(toEnd) {
                try {
                    var me = this,
                    rng = me.selection.getRange();
                    if (toEnd) {
                        rng.setStartAtLast(me.body.lastChild).setCursor(false, true);
                    } else {
                        rng.select(true);
                    }
                } catch (e) {
                }
            },

            /**
         * 初始化UE事件及部分事件代理
         * @private
         * @ignore
         */
            _initEvents: function() {
                var me = this,
                doc = me.document,
                win = me.window;
                me._proxyDomEvent = utils.bind(me._proxyDomEvent, me);
                domUtils.on(doc, ['click', 'contextmenu', 'mousedown', 'keydown', 'keyup', 'keypress', 'mouseup', 'mouseover', 'mouseout', 'selectstart'], me._proxyDomEvent);
                domUtils.on(win, ['focus', 'blur'], me._proxyDomEvent);
                domUtils.on(doc, ['mouseup', 'keydown'], function(evt) {
                    //特殊键不触发selectionchange
                    if (evt.type == 'keydown' && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                        return;
                    }
                    if (evt.button == 2)
                        return;
                    me._selectionChange(250, evt);
                });
                //处理拖拽
                //ie ff不能从外边拖入
                //chrome只针对从外边拖入的内容过滤
                var innerDrag = 0, source = browser.ie ? me.body : me.document, dragoverHandler;
                domUtils.on(source, 'dragstart', function() {
                    innerDrag = 1;
                });
                domUtils.on(source, browser.webkit ? 'dragover' : 'drop', function() {
                    return browser.webkit ?
                    function() {
                        clearTimeout(dragoverHandler);
                        dragoverHandler = setTimeout(function() {
                            if (!innerDrag) {
                                var sel = me.selection,
                                range = sel.getRange();
                                if (range) {
                                    var common = range.getCommonAncestor();
                                    if (common && me.serialize) {
                                        var f = me.serialize,
                                        node =
                                        f.filter(
                                        f.transformInput(
                                        f.parseHTML(
                                        f.word(common.innerHTML)
                                        )
                                        )
                                        );
                                        common.innerHTML = f.toHTML(node);
                                    }
                                }
                            }
                            innerDrag = 0;
                        }, 200);
                    } :
                    function(e) {
                        if (!innerDrag) {
                            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                        }
                        innerDrag = 0;
                    }
                }());
            },
            /**
         * 触发事件代理
         * @private
         * @ignore
         */
            _proxyDomEvent: function(evt) {
                return this.fireEvent(evt.type.replace(/^on/, ''), evt);
            },
            /**
         * 变化选区
         * @private
         * @ignore
         */
            _selectionChange: function(delay, evt) {
                var me = this;
                //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
                //            if ( !me.selection.isFocus() ){
                //                return;
                //            }
                var hackForMouseUp = false;
                var mouseX, mouseY;
                if (browser.ie && browser.version < 9 && evt && evt.type == 'mouseup') {
                    var range = this.selection.getRange();
                    if (!range.collapsed) {
                        hackForMouseUp = true;
                        mouseX = evt.clientX;
                        mouseY = evt.clientY;
                    }
                }
                clearTimeout(_selectionChangeTimer);
                _selectionChangeTimer = setTimeout(function() {
                    if (!me.selection || !me.selection.getNative()) {
                        return;
                    }
                    //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
                    //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
                    var ieRange;
                    if (hackForMouseUp && me.selection.getNative().type == 'None') {
                        ieRange = me.document.body.createTextRange();
                        try {
                            ieRange.moveToPoint(mouseX, mouseY);
                        } catch (ex) {
                            ieRange = null;
                        }
                    }
                    var bakGetIERange;
                    if (ieRange) {
                        bakGetIERange = me.selection.getIERange;
                        me.selection.getIERange = function() {
                            return ieRange;
                        };
                    }
                    me.selection.cache();
                    if (bakGetIERange) {
                        me.selection.getIERange = bakGetIERange;
                    }
                    if (me.selection._cachedRange && me.selection._cachedStartElement) {
                        me.fireEvent('beforeselectionchange');
                        // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
                        me.fireEvent('selectionchange', !!evt);
                        me.fireEvent('afterselectionchange');
                        me.selection.clear();
                    }
                }, delay || 50);
            },
            _callCmdFn: function(fnName, args) {
                var cmdName = args[0].toLowerCase(),
                cmd, cmdFn;
                cmd = this.commands[cmdName] || UE.commands[cmdName];
                cmdFn = cmd && cmd[fnName];
                //没有querycommandstate或者没有command的都默认返回0
                if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
                    return 0;
                } else if (cmdFn) {
                    return cmdFn.apply(this, args);
                }
            },

            /**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @name execCommand
         * @grammar editor.execCommand(cmdName)   => {*}
         */
            execCommand: function(cmdName) {
                cmdName = cmdName.toLowerCase();
                var me = this,
                result,
                cmd = me.commands[cmdName] || UE.commands[cmdName];
                if (!cmd || !cmd.execCommand) {
                    return null;
                }
                if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {
                    me.__hasEnterExecCommand = true;
                    if (me.queryCommandState(cmdName) != -1) {
                        me.fireEvent('beforeexeccommand', cmdName);
                        result = this._callCmdFn('execCommand', arguments);
                        me.fireEvent('afterexeccommand', cmdName);
                    }
                    me.__hasEnterExecCommand = false;
                } else {
                    result = this._callCmdFn('execCommand', arguments);
                }
                !me.__hasEnterExecCommand && me._selectionChange();
                return result;
            },
            /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @name  queryCommandState
         * @grammar editor.queryCommandState(cmdName)  => (-1|0|1)
         * @desc
         * * ''-1'' 当前命令不可用
         * * ''0'' 当前命令可用
         * * ''1'' 当前命令已经执行过了
         */
            queryCommandState: function(cmdName) {
                return this._callCmdFn('queryCommandState', arguments);
            },

            /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @name  queryCommandValue
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         */
            queryCommandValue: function(cmdName) {
                return this._callCmdFn('queryCommandValue', arguments);
            },
            /**
         * 检查编辑区域中是否有内容，若包含tags中的节点类型，直接返回true
         * @name  hasContents
         * @desc
         * 默认有文本内容，或者有以下节点都不认为是空
         * <code>{table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}</code>
         * @grammar editor.hasContents()  => (true|false)
         * @grammar editor.hasContents(tags)  =>  (true|false)  //若文档中包含tags数组里对应的tag，直接返回true
         * @example
         * editor.hasContents(['span']) //如果编辑器里有这些，不认为是空
         */
            hasContents: function(tags) {
                if (tags) {
                    for (var i = 0, ci; ci = tags[i++]; ) {
                        if (this.document.getElementsByTagName(ci).length > 0) {
                            return true;
                        }
                    }
                }
                if (!domUtils.isEmptyBlock(this.body)) {
                    return true
                }
                //随时添加,定义的特殊标签如果存在，不能认为是空
                tags = ['div'];
                for (i = 0; ci = tags[i++]; ) {
                    var nodes = domUtils.getElementsByTagName(this.document, ci);
                    for (var n = 0, cn; cn = nodes[n++]; ) {
                        if (domUtils.isCustomeNode(cn)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            /**
         * 重置编辑器，可用来做多个tab使用同一个编辑器实例
         * @name  reset
         * @desc
         * * 清空编辑器内容
         * * 清空回退列表
         * @grammar editor.reset()
         */
            reset: function() {
                this.fireEvent('reset');
            },
            setEnabled: function() {
                var me = this, range;
                if (me.body.contentEditable == 'false') {
                    me.body.contentEditable = true;
                    range = me.selection.getRange();
                    //有可能内容丢失了
                    try {
                        range.moveToBookmark(me.lastBk);
                        delete me.lastBk
                    } catch (e) {
                        range.setStartAtFirst(me.body).collapse(true)
                    }
                    range.select(true);
                    if (me.bkqueryCommandState) {
                        me.queryCommandState = me.bkqueryCommandState;
                        delete me.bkqueryCommandState;
                    }
                    me.fireEvent('selectionchange');
                }
            },
            /**
         * 设置当前编辑区域可以编辑
         * @name enable
         * @grammar editor.enable()
         */
            enable: function() {
                return this.setEnabled();
            },
            setDisabled: function(except) {
                var me = this;
                except = except ? utils.isArray(except) ? except : [except] : [];
                if (me.body.contentEditable == 'true') {
                    if (!me.lastBk) {
                        me.lastBk = me.selection.getRange().createBookmark(true);
                    }
                    me.body.contentEditable = false;
                    me.bkqueryCommandState = me.queryCommandState;
                    me.queryCommandState = function(type) {
                        if (utils.indexOf(except, type) != -1) {
                            return me.bkqueryCommandState.apply(me, arguments);
                        }
                        return -1;
                    };
                    me.fireEvent('selectionchange');
                }
            },
            /** 设置当前编辑区域不可编辑,except中的命令除外
         * @name disable
         * @grammar editor.disable()
         * @grammar editor.disable(except)  //例外的命令，也即即使设置了disable，此处配置的命令仍然可以执行
         * @example
         * //禁用工具栏中除加粗和插入图片之外的所有功能
         * editor.disable(['bold','insertimage']);//可以是单一的String,也可以是Array
        */
            disable: function(except) {
                return this.setDisabled(except);
            },
            /**
         * 设置默认内容
         * @ignore
         * @private
         * @param  {String} cont 要存入的内容
         */
            _setDefaultContent: function() {
                function clear() {
                    var me = this;
                    if (me.document.getElementById('initContent')) {
                        me.body.innerHTML = '<p>' + (ie ? '' : '<br/>') + '</p>';
                        me.removeListener('firstBeforeExecCommand focus', clear);
                        setTimeout(function() {
                            me.focus();
                            me._selectionChange();
                        }, 0)
                    }
                }
                return function(cont) {
                    var me = this;
                    me.body.innerHTML = '<p id="initContent">' + cont + '</p>';
                    if (browser.ie && browser.version < 7) {
                        replaceSrc(me.body);
                    }
                    me.addListener('firstBeforeExecCommand focus', clear);
                }
            }(),
            /**
         * show方法的兼容版本
         * @private
         * @ignore
         */
            setShow: function() {
                var me = this, range = me.selection.getRange();
                if (me.container.style.display == 'none') {
                    //有可能内容丢失了
                    try {
                        range.moveToBookmark(me.lastBk);
                        delete me.lastBk
                    } catch (e) {
                        range.setStartAtFirst(me.body).collapse(true)
                    }
                    //ie下focus实效，所以做了个延迟
                    setTimeout(function() {
                        range.select(true);
                    }, 100);
                    me.container.style.display = '';
                }

            },
            /**
         * 显示编辑器
         * @name show
         * @grammar editor.show()
         */
            show: function() {
                return this.setShow();
            },
            /**
         * hide方法的兼容版本
         * @private
         * @ignore
         */
            setHide: function() {
                var me = this;
                if (!me.lastBk) {
                    me.lastBk = me.selection.getRange().createBookmark(true);
                }
                me.container.style.display = 'none'
            },
            /**
         * 隐藏编辑器
         * @name hide
         * @grammar editor.hide()
         */
            hide: function() {
                return this.setHide();
            },
            /**
         * 根据制定的路径，获取对应的语言资源
         * @name  getLang
         * @grammar editor.getLang(path)  =>  （JSON|String) 路径根据的是lang目录下的语言文件的路径结构
         * @example
         * editor.getLang('contextMenu.delete') //如果当前是中文，那返回是的是删除
         */
            getLang: function(path) {
                var lang = UE.I18N[this.options.lang];
                path = (path || "").split(".");
                for (var i = 0, ci; ci = path[i++]; ) {
                    lang = lang[ci];
                    if (!lang)
                        break;
                }
                return lang;
            }
        /**
         * 得到dialog实例对象
         * @name getDialog
         * @grammar editor.getDialog(dialogName) => Object
         * @example
         * var dialog = editor.getDialog("insertimage");
         * dialog.open();   //打开dialog
         * dialog.close();  //关闭dialog
         */
        };
        utils.inherits(Editor, EventBase);
    })();


    /**
 * @file
 * @name UE.ajax
 * @short Ajax
 * @desc UEditor内置的ajax请求模块
 * @import core/utils.js
 * @user: taoqili
 * @date: 11-8-18
 * @time: 下午3:18
 */
    UE.ajax = function() {
        /**
     * 创建一个ajaxRequest对象
     */
        var fnStr = 'XMLHttpRequest()';
        try {
            new ActiveXObject("Msxml2.XMLHTTP");
            fnStr = 'ActiveXObject(\'Msxml2.XMLHTTP\')';
        } catch (e) {
            try {
                new ActiveXObject("Microsoft.XMLHTTP");
                fnStr = 'ActiveXObject(\'Microsoft.XMLHTTP\')'
            } catch (e) {
            }
        }
        var creatAjaxRequest = new Function('return new ' + fnStr);


        /**
     * 将json参数转化成适合ajax提交的参数列表
     * @param json
     */
        function json2str(json) {
            var strArr = [];
            for (var i in json) {
                //忽略默认的几个参数
                if (i == "method" || i == "timeout" || i == "async")
                    continue;
                //传递过来的对象和函数不在提交之列
                if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
                    strArr.push(encodeURIComponent(i) + "=" + encodeURIComponent(json[i]));
                }
            }
            return strArr.join("&");

        }


        return {
            /**
         * @name request
         * @desc 发出ajax请求，ajaxOpt中默认包含method，timeout，async，data，onsuccess以及onerror等六个，支持自定义添加参数
         * @grammar UE.ajax.request(url,ajaxOpt);
         * @example
         * UE.ajax.request('http://www.xxxx.com/test.php',{
         *     //可省略，默认POST
         *     method:'POST',
         *     //可以自定义参数
         *     content:'这里是提交的内容',
         *     //也可以直接传json，但是只能命名为data，否则当做一般字符串处理
         *     data:{
         *         name:'UEditor',
         *         age:'1'
         *     }
         *     onsuccess:function(xhr){
         *         console.log(xhr.responseText);
         *     },
         *     onerror:function(xhr){
         *         console.log(xhr.responseText);
         *     }
         * })
		 * @param ajaxOptions
		 */
            request: function(url, ajaxOptions) {
                var ajaxRequest = creatAjaxRequest(),
                //是否超时
                timeIsOut = false,
                //默认参数
                defaultAjaxOptions = {
                    method: "POST",
                    timeout: 5000,
                    async: true,
                    data: {}, //需要传递对象的话只能覆盖
                    onsuccess: function() {
                    },
                    onerror: function() {
                    }
                };

                if (typeof url === "object") {
                    ajaxOptions = url;
                    url = ajaxOptions.url;
                }
                if (!ajaxRequest || !url)
                    return;
                var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions, ajaxOptions) : defaultAjaxOptions;

                var submitStr = json2str(ajaxOpts); // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
                //如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
                if (!utils.isEmptyObject(ajaxOpts.data)) {
                    submitStr += (submitStr ? "&" : "") + json2str(ajaxOpts.data);
                }
                //超时检测
                var timerID = setTimeout(function() {
                    if (ajaxRequest.readyState != 4) {
                        timeIsOut = true;
                        ajaxRequest.abort();
                        clearTimeout(timerID);
                    }
                }, ajaxOpts.timeout);

                var method = ajaxOpts.method.toUpperCase();
                var str = url + (url.indexOf("?") == -1 ? "?" : "&") + (method == "POST" ? "" : submitStr + "&noCache=" + +new Date);
                ajaxRequest.open(method, str, ajaxOpts.async);
                ajaxRequest.onreadystatechange = function() {
                    if (ajaxRequest.readyState == 4) {
                        if (!timeIsOut && ajaxRequest.status == 200) {
                            ajaxOpts.onsuccess(ajaxRequest);
                        } else {
                            ajaxOpts.onerror(ajaxRequest);
                        }
                    }
                };
                if (method == "POST") {
                    ajaxRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    ajaxRequest.send(submitStr);
                } else {
                    ajaxRequest.send(null);
                }
            }
        };


    }();

    /**
 * @file
 * @name UE.filterWord
 * @short filterWord
 * @desc 用来过滤word粘贴过来的字符串
 * @import editor.js,core/utils.js
 * @anthor zhanyi
 */
    var filterWord = UE.filterWord = function() {

        //是否是word过来的内容
        function isWordDocument(str) {
            return /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<v:)/ig.test(str);
        }
        //去掉小数
        function transUnit(v) {
            v = v.replace(/[\d.]+\w+/g, function(m) {
                return utils.transUnitToPx(m);
            });
            return v;
        }

        function filterPasteWord(str) {
            return str.replace(/[\t\r\n]+/g, "")
            .replace(/<!--[\s\S]*?-->/ig, "")
            //转换图片
            .replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi, function(str) {
                //opera能自己解析出image所这里直接返回空
                if (browser.opera) {
                    return '';
                }
                try {
                    var width = str.match(/width:([ \d.]*p[tx])/i)[1],
                    height = str.match(/height:([ \d.]*p[tx])/i)[1],
                    src = str.match(/src=\s*"([^"]*)"/i)[1];
                    return '<img width="' + transUnit(width) + '" height="' + transUnit(height) + '" src="' + src + '" />';
                } catch (e) {
                    return '';
                }
            })
            //针对wps添加的多余标签处理
            .replace(/<\/?div[^>]*>/g, '')
            //去掉多余的属性
            .replace(/v:\w+=(["']?)[^'"]+\1/g, '')
            .replace(/<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi, "")
            .replace(/<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi, "<p><strong>$1</strong></p>")
            //去掉多余的属性
            .replace(/\s+(class|lang|align)\s*=\s*(['"]?)[\w-]+\2/ig, "")
            //清除多余的font/span不能匹配&nbsp;有可能是空格
            .replace(/<(font|span)[^>]*>\s*<\/\1>/gi, '')
            //处理style的问题
            .replace(/(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function(str, tag, tmp, style) {
                var n = [],
                s = style.replace(/^\s+|\s+$/, '')
                .replace(/&#39;/g, '\'')
                .replace(/&quot;/gi, "'")
                .split(/;\s*/g);

                for (var i = 0, v; v = s[i]; i++) {

                    var name, value,
                    parts = v.split(":");

                    if (parts.length == 2) {
                        name = parts[0].toLowerCase();
                        value = parts[1].toLowerCase();
                        if (/^(background)\w*/.test(name) && value.replace(/(initial|\s)/g, '').length == 0
                        ||
                        /^(margin)\w*/.test(name) && /^0\w+$/.test(value)
                        ) {
                            continue;
                        }

                        switch (name) {
                            case "mso-padding-alt":
                            case "mso-padding-top-alt":
                            case "mso-padding-right-alt":
                            case "mso-padding-bottom-alt":
                            case "mso-padding-left-alt":
                            case "mso-margin-alt":
                            case "mso-margin-top-alt":
                            case "mso-margin-right-alt":
                            case "mso-margin-bottom-alt":
                            case "mso-margin-left-alt":
                            //ie下会出现挤到一起的情况
                            //case "mso-table-layout-alt":
                            case "mso-height":
                            case "mso-width":
                            case "mso-vertical-align-alt":
                                //trace:1819 ff下会解析出padding在table上
                                if (!/<table/.test(tag))
                                    n[i] = name.replace(/^mso-|-alt$/g, "") + ":" + transUnit(value);
                                continue;
                            case "horiz-align":
                                n[i] = "text-align:" + value;
                                continue;

                            case "vert-align":
                                n[i] = "vertical-align:" + value;
                                continue;

                            case "font-color":
                            case "mso-foreground":
                                n[i] = "color:" + value;
                                continue;

                            case "mso-background":
                            case "mso-highlight":
                                n[i] = "background:" + value;
                                continue;

                            case "mso-default-height":
                                n[i] = "min-height:" + transUnit(value);
                                continue;

                            case "mso-default-width":
                                n[i] = "min-width:" + transUnit(value);
                                continue;

                            case "mso-padding-between-alt":
                                n[i] = "border-collapse:separate;border-spacing:" + transUnit(value);
                                continue;

                            case "text-line-through":
                                if ((value == "single") || (value == "double")) {
                                    n[i] = "text-decoration:line-through";
                                }
                                continue;
                            case "mso-zero-height":
                                if (value == "yes") {
                                    n[i] = "display:none";
                                }
                                continue;
                            case 'background':
                                if (value == 'initial') {

                                }
                                break;
                            case 'margin':
                                if (!/[1-9]/.test(value)) {
                                    continue;
                                }

                        }

                        if (/^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test(name)
                        ||
                        /text\-indent|padding|margin/.test(name) && /\-[\d.]+/.test(value)
                        ) {
                            continue;
                        }

                        n[i] = name + ":" + parts[1];
                    }
                }
                return tag + (n.length ? ' style="' + n.join(';').replace(/;{2,}/g, ';') + '"' : '');
            })
            .replace(/[\d.]+(cm|pt)/g, function(str) {
                return utils.transUnitToPx(str)
            })

        }

        return function(html) {
            return (isWordDocument(html) ? filterPasteWord(html) : html).replace(/>[ \t\r\n]*</g, '><');
        };
    }();
    /*
*   处理特殊键的兼容性问题
*/
    UE.plugins['keystrokes'] = function() {
        var me = this,
        flag = 0,
        keys = domUtils.keys,
        trans = {
            'B': 'strong',
            'I': 'em',
            'FONT': 'span'
        },
        sizeMap = [0, 10, 12, 16, 18, 24, 32, 48],
        listStyle = {
            'OL': ['decimal', 'lower-alpha', 'lower-roman', 'upper-alpha', 'upper-roman'],

            'UL': ['circle', 'disc', 'square']
        };

        //判断列表是否是相似的
        function sameListNode(nodeA, nodeB) {
            if (nodeA.tagName !== nodeB.tagName ||
            domUtils.getComputedStyle(nodeA, 'list-style-type') !== domUtils.getComputedStyle(nodeB, 'list-style-type')
            ) {
                return false
            }
            return true;
        }
        me.addListener('keydown', function(type, evt) {
            var keyCode = evt.keyCode || evt.which;

            if (this.selectAll) {
                this.selectAll = false;
                if ((keyCode == 8 || keyCode == 46)) {
                    me.undoManger && me.undoManger.save();
                    //trace:1633
                    me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';

                    new dom.Range(me.document).setStart(me.body.firstChild, 0).setCursor(false, true);
                    me.undoManger && me.undoManger.save();
                    //todo 对性能会有影响
                    browser.ie && me._selectionChange();
                    domUtils.preventDefault(evt);
                    return;
                }


            }

            //处理backspace/del
            if (keyCode == 8) { //|| keyCode == 46


                var range = me.selection.getRange(),
                tmpRange,
                start, end;

                //当删除到body最开始的位置时，会删除到body,阻止这个动作
                if (range.collapsed) {
                    start = range.startContainer;
                    //有可能是展位符号
                    if (domUtils.isWhitespace(start)) {
                        start = start.parentNode;
                    }
                    if (domUtils.isEmptyNode(start) && start === me.body.firstChild) {

                        if (start.tagName != 'P') {
                            p = me.document.createElement('p');
                            me.body.insertBefore(p, start);
                            domUtils.fillNode(me.document, p);
                            range.setStart(p, 0).setCursor(false, true);
                            //trace:1645
                            domUtils.remove(start);
                        }
                        domUtils.preventDefault(evt);
                        return;

                    }
                }

                if (range.collapsed && range.startContainer.nodeType == 3 && range.startContainer.nodeValue.replace(new RegExp(domUtils.fillChar, 'g'), '').length == 0) {
                    range.setStartBefore(range.startContainer).collapse(true);
                }
                //解决选中control元素不能删除的问题
                if (start = range.getClosedNode()) {
                    me.undoManger && me.undoManger.save();
                    range.setStartBefore(start);
                    domUtils.remove(start);
                    range.setCursor();
                    me.undoManger && me.undoManger.save();
                    domUtils.preventDefault(evt);
                    return;
                }
                //阻止在table上的删除
                if (!browser.ie) {

                    start = domUtils.findParentByTagName(range.startContainer, 'table', true);
                    end = domUtils.findParentByTagName(range.endContainer, 'table', true);
                    if (start && !end || !start && end || start !== end) {
                        evt.preventDefault();
                        return;
                    }
                //表格里回车，删除时，光标被定位到了p外边，导致多次删除才能到上一行，这里的处理忘记是为什么，暂时注视掉
                //解决trace:1966的问题
                //                if (browser.webkit && range.collapsed && start) {
                //                    tmpRange = range.cloneRange().txtToElmBoundary();
                //                    start = tmpRange.startContainer;
                //                           debugger
                //                    if (domUtils.isBlockElm(start) && !dtd.$tableContent[start.tagName] && !domUtils.getChildCount(start, function(node) {
                //                        return node.nodeType == 1 ? node.tagName !== 'BR' : 1;
                //                    })) {
                //
                //                        tmpRange.setStartBefore(start).setCursor();
                //                        domUtils.remove(start, true);
                //                        evt.preventDefault();
                //                        return;
                //                    }
                //                }
                }


                if (me.undoManger) {

                    if (!range.collapsed) {
                        me.undoManger.save();
                        flag = 1;
                    }
                }

            }
            //处理tab键的逻辑
            if (keyCode == 9) {
                me.fireEvent("clicktab", evt);
            //            var doc = this.iframe.contentWindow.document.body;
            //            if(doc.detachEvent){
            //                doc.detachEvent("keydown");
            //            }else{
            //                doc.dispatchEvent(evt);
            //            }
            //            range = me.selection.getRange();
            //            me.undoManger && me.undoManger.save();
            //
            //            for (var i = 0,txt = '',tabSize = me.options.tabSize|| 4,tabNode =  me.options.tabNode || '&nbsp;'; i < tabSize; i++) {
            //                txt += tabNode;
            //            }
            //            var span = me.document.createElement('span');
            //            span.innerHTML = txt;
            //            if (range.collapsed) {
            //
            //
            //                var li = domUtils.findParentByTagName(range.startContainer, 'li', true);
            //
            //                if (li && domUtils.isStartInblock(range)) {
            //                    bk = range.createBookmark();
            //                    var parentLi = li.parentNode,
            //                        list = me.document.createElement(parentLi.tagName);
            //                    var index = utils.indexOf(listStyle[list.tagName], domUtils.getComputedStyle(parentLi, 'list-style-type'));
            //                    index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
            //                    domUtils.setStyle(list, 'list-style-type', listStyle[list.tagName][index]);
            //                    parentLi.insertBefore(list, li);
            //                    list.appendChild(li);
            //
            //                    //trace:2721
            //                    //合并上下相同的列表
            //                    var preList = list.previousSibling;
            //                    if(preList && sameListNode(preList,list)){
            //                        domUtils.moveChild(list,preList);
            //                        domUtils.remove(list);
            //                        list = preList
            //                    }
            //                    var nextList = list.nextSibling;
            //                    if(nextList && sameListNode(nextList,list)){
            //                        domUtils.moveChild(nextList,list);
            //                        domUtils.remove(nextList);
            //                    }
            //
            //                    range.moveToBookmark(bk).select();
            //
            //                } else{
            //                    range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
            //                }
            //
            //            } else {
            //                //处理table
            //                start = domUtils.findParentByTagName(range.startContainer, 'table', true);
            //                end = domUtils.findParentByTagName(range.endContainer, 'table', true);
            //                if (start || end) {
            //                    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
            //                    return;
            //                }
            //                //处理列表 再一个list里处理
            //                start = domUtils.findParentByTagName(range.startContainer, ['ol','ul'], true);
            //                end = domUtils.findParentByTagName(range.endContainer, ['ol','ul'], true);
            //                if (start && end && start === end) {
            //                    var bk = range.createBookmark();
            //                    start = domUtils.findParentByTagName(range.startContainer, 'li', true);
            //                    end = domUtils.findParentByTagName(range.endContainer, 'li', true);
            //                    //在开始单独处理
            //                    if (start === start.parentNode.firstChild) {
            //                        var parentList = me.document.createElement(start.parentNode.tagName);
            //
            //                        start.parentNode.parentNode.insertBefore(parentList, start.parentNode);
            //                        parentList.appendChild(start.parentNode);
            //                    } else {
            //                        parentLi = start.parentNode;
            //                            list = me.document.createElement(parentLi.tagName);
            //
            //                        index = utils.indexOf(listStyle[list.tagName], domUtils.getComputedStyle(parentLi, 'list-style-type'));
            //                        index = index + 1 == listStyle[list.tagName].length ? 0 : index + 1;
            //                        domUtils.setStyle(list, 'list-style-type', listStyle[list.tagName][index]);
            //                        start.parentNode.insertBefore(list, start);
            //                        var nextLi;
            //                        while (start !== end) {
            //                            nextLi = start.nextSibling;
            //                            list.appendChild(start);
            //                            start = nextLi;
            //                        }
            //                        list.appendChild(end);
            //
            //                    }
            //                    range.moveToBookmark(bk).select();
            //
            //                } else {
            //                    if (start || end) {
            //                        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
            //                        return
            //                    }
            //                    //普通的情况
            //                    start = domUtils.findParent(range.startContainer, filterFn);
            //                    end = domUtils.findParent(range.endContainer, filterFn);
            //                    if (start && end && start === end) {
            //                        range.deleteContents();
            //                        range.insertNode(span.cloneNode(true).firstChild).setCursor(true);
            //                    } else {
            //                        var bookmark = range.createBookmark(),
            //                            filterFn = function(node) {
            //                                return domUtils.isBlockElm(node);
            //
            //                            };
            //
            //                        range.enlarge(true);
            //                        var bookmark2 = range.createBookmark(),
            //                            current = domUtils.getNextDomNode(bookmark2.start, false, filterFn);
            //
            //
            //                        while (current && !(domUtils.getPosition(current, bookmark2.end) & domUtils.POSITION_FOLLOWING)) {
            //
            //
            //                            current.insertBefore(span.cloneNode(true).firstChild, current.firstChild);
            //
            //                            current = domUtils.getNextDomNode(current, false, filterFn);
            //
            //                        }
            //
            //                        range.moveToBookmark(bookmark2).moveToBookmark(bookmark).select();
            //                    }
            //
            //                }
            //
            //
            //            }
            //            me.undoManger && me.undoManger.save();
            //            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
            }
            //trace:1634
            //ff的del键在容器空的时候，也会删除
            if (browser.gecko && keyCode == 46) {
                range = me.selection.getRange();
                if (range.collapsed) {
                    start = range.startContainer;
                    if (domUtils.isEmptyBlock(start)) {
                        var parent = start.parentNode;
                        while (domUtils.getChildCount(parent) == 1 && !domUtils.isBody(parent)) {
                            start = parent;
                            parent = parent.parentNode;
                        }
                        if (start === parent.lastChild)
                            evt.preventDefault();
                        return;
                    }
                }
            }
        });
        me.addListener('keyup', function(type, evt) {
            var keyCode = evt.keyCode || evt.which;
            //修复ie/chrome <strong><em>x|</em></strong> 当点退格后在输入文字后会出现  <b><i>x</i></b>
            if (!browser.gecko && !keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
                range = me.selection.getRange();
                if (range.collapsed) {
                    var start = range.startContainer,
                    isFixed = 0;

                    while (!domUtils.isBlockElm(start)) {
                        if (start.nodeType == 1 && utils.indexOf(['FONT', 'B', 'I'], start.tagName) != -1) {

                            var tmpNode = me.document.createElement(trans[start.tagName]);
                            if (start.tagName == 'FONT') {
                                //chrome only remember color property
                                tmpNode.style.cssText = (start.getAttribute('size') ? 'font-size:' + (sizeMap[start.getAttribute('size')] || 12) + 'px' : '')
                                + ';' + (start.getAttribute('color') ? 'color:' + start.getAttribute('color') : '')
                                + ';' + (start.getAttribute('face') ? 'font-family:' + start.getAttribute('face') : '')
                                + ';' + start.style.cssText;
                            }
                            while (start.firstChild) {
                                tmpNode.appendChild(start.firstChild)
                            }
                            start.parentNode.insertBefore(tmpNode, start);
                            domUtils.remove(start);
                            if (!isFixed) {
                                range.setEnd(tmpNode, tmpNode.childNodes.length).collapse(true)

                            }
                            start = tmpNode;
                            isFixed = 1;
                        }
                        start = start.parentNode;

                    }

                    isFixed && range.select()

                }
            }

            if (keyCode == 8) { //|| keyCode == 46

                //针对ff下在列表首行退格，不能删除空格行的问题
                if (browser.gecko) {
                    for (var i = 0, li, lis = domUtils.getElementsByTagName(this.body, 'li'); li = lis[i++]; ) {
                        if (domUtils.isEmptyNode(li) && !li.previousSibling) {
                            var liOfPn = li.parentNode;
                            domUtils.remove(li);
                            if (domUtils.isEmptyNode(liOfPn)) {
                                domUtils.remove(liOfPn)
                            }

                        }
                    }
                }

                var range, start, parent,
                tds = this.currentSelectedArr;
                if (tds && tds.length > 0) {
                    for (var i = 0, ti; ti = tds[i++]; ) {
                        ti.innerHTML = browser.ie ? (browser.version < 9 ? '&#65279' : '') : '<br/>';

                    }
                    range = new dom.Range(this.document);
                    range.setStart(tds[0], 0).setCursor();
                    if (flag) {
                        me.undoManger.save();
                        flag = 0;
                    }
                    //阻止chrome执行默认的动作
                    if (browser.webkit) {
                        evt.preventDefault();
                    }
                    return;
                }

                range = me.selection.getRange();

                //ctrl+a 后全部删除做处理
                //
                //            if (domUtils.isEmptyBlock(me.body) && !range.startOffset) {
                //                //trace:1633
                //                me.body.innerHTML = '<p>'+(browser.ie ? '&nbsp;' : '<br/>')+'</p>';
                //                range.setStart(me.body.firstChild,0).setCursor(false,true);
                //                me.undoManger && me.undoManger.save();
                //                //todo 对性能会有影响
                //                browser.ie && me._selectionChange();
                //                return;
                //            }

                //处理删除不干净的问题

                start = range.startContainer;
                if (domUtils.isWhitespace(start)) {
                    start = start.parentNode
                }
                //标志位防止空的p无法删除
                var removeFlag = 0;
                while (start.nodeType == 1 && domUtils.isEmptyNode(start) && dtd.$removeEmpty[start.tagName]) {
                    removeFlag = 1;
                    parent = start.parentNode;
                    domUtils.remove(start);
                    start = parent;
                }

                if (removeFlag && start.nodeType == 1 && domUtils.isEmptyNode(start)) {
                    //ie下的问题，虽然没有了相应的节点但一旦你输入文字还是会自动把删除的节点加上，
                    if (browser.ie) {
                        var span = range.document.createElement('span');
                        start.appendChild(span);
                        range.setStart(start, 0).setCursor();
                        //for ie
                        li = domUtils.findParentByTagName(start, 'li', true);
                        if (li) {
                            var next = li.nextSibling;
                            while (next) {
                                if (domUtils.isEmptyBlock(next)) {
                                    li = next;
                                    next = next.nextSibling;
                                    domUtils.remove(li);
                                    continue;

                                }
                                break;
                            }
                        }
                    } else {
                        start.innerHTML = '<br/>';
                        range.setStart(start, 0).setCursor(false, true);
                    }

                    setTimeout(function() {
                        if (browser.ie) {
                            domUtils.remove(span);
                        }

                        if (flag) {
                            me.undoManger.save();
                            flag = 0;
                        }
                    }, 0)
                } else {

                    if (flag) {
                        me.undoManger.save();
                        flag = 0;
                    }

                }
            }
        })
    };
    ///import core
    ///commands 加粗,斜体,上标,下标
    ///commandsName  Bold,Italic,Subscript,Superscript
    ///commandsTitle  加粗,加斜,下标,上标
    /**
 * b u i等基础功能实现
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName    bold加粗。italic斜体。subscript上标。superscript下标。
*/
    UE.plugins['basestyle'] = function() {
        var basestyles = {
            'bold': ['strong', 'b'],
            'italic': ['em', 'i'],
            'subscript': ['sub'],
            'superscript': ['sup']
        },
        getObj = function(editor, tagNames) {
            return domUtils.filterNodeList(editor.selection.getStartElementPath(), tagNames);
        },
        me = this;
        for (var style in basestyles) {
            (function(cmd, tagNames) {
                me.commands[cmd] = {
                    execCommand: function(cmdName) {

                        var range = new dom.Range(me.document), obj = '';
                        //table的处理
                        if (me.currentSelectedArr && me.currentSelectedArr.length > 0) {
                            for (var i = 0, ci; ci = me.currentSelectedArr[i++]; ) {
                                if (ci.style.display != 'none') {
                                    range.selectNodeContents(ci).select();
                                    //trace:943
                                    !obj && (obj = getObj(this, tagNames));
                                    if (cmdName == 'superscript' || cmdName == 'subscript') {

                                        if (!obj || obj.tagName.toLowerCase() != cmdName) {
                                            range.removeInlineStyle(['sub', 'sup']);
                                        }

                                    }
                                    obj ? range.removeInlineStyle(tagNames) : range.applyInlineStyle(tagNames[0]);
                                }

                            }
                            range.selectNodeContents(me.currentSelectedArr[0]).select();
                        } else {
                            range = me.selection.getRange();
                            obj = getObj(this, tagNames);

                            if (range.collapsed) {
                                if (obj) {
                                    var tmpText = me.document.createTextNode('');
                                    range.insertNode(tmpText).removeInlineStyle(tagNames);

                                    range.setStartBefore(tmpText);
                                    domUtils.remove(tmpText);
                                } else {

                                    var tmpNode = range.document.createElement(tagNames[0]);
                                    if (cmdName == 'superscript' || cmdName == 'subscript') {
                                        tmpText = me.document.createTextNode('');
                                        range.insertNode(tmpText)
                                        .removeInlineStyle(['sub', 'sup'])
                                        .setStartBefore(tmpText)
                                        .collapse(true);

                                    }
                                    range.insertNode(tmpNode).setStart(tmpNode, 0);



                                }
                                range.collapse(true);

                            } else {
                                if (cmdName == 'superscript' || cmdName == 'subscript') {
                                    if (!obj || obj.tagName.toLowerCase() != cmdName) {
                                        range.removeInlineStyle(['sub', 'sup']);
                                    }

                                }
                                obj ? range.removeInlineStyle(tagNames) : range.applyInlineStyle(tagNames[0]);
                            }

                            range.select();

                        }

                        return true;
                    },
                    queryCommandState: function() {
                        if (this.highlight) {
                            return -1;
                        }
                        return getObj(this, tagNames) ? 1 : 0;
                    }
                };
            })(style, basestyles[style]);

        }
    };


    ///import core
    /**
 * @description 插入内容
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     inserthtml插入内容的命令
 * @param   {String}   html                要插入的内容
 * @author zhanyi
    */
    UE.commands['inserthtml'] = {
        execCommand: function(command, html, notSerialize) {
            var me = this,
            range,
            div,
            tds = me.currentSelectedArr;

            range = me.selection.getRange();

            div = range.document.createElement('div');
            div.style.display = 'inline';
            var serialize = me.serialize;
            if (!notSerialize && serialize) {
                var node = serialize.parseHTML(html);
                node = serialize.transformInput(node);
                node = serialize.filter(node);
                html = serialize.toHTML(node);
            }
            div.innerHTML = utils.trim(html);
            try {
                me.adjustTable && me.adjustTable(div);
            } catch (e) {
            }


            if (tds && tds.length) {
                for (var i = 0, ti; ti = tds[i++]; ) {
                    ti.className = '';
                }
                tds[0].innerHTML = '';
                range.setStart(tds[0], 0).collapse(true);
                me.currentSelectedArr = [];
            }

            if (!range.collapsed) {

                range.deleteContents();
                if (range.startContainer.nodeType == 1) {
                    var child = range.startContainer.childNodes[range.startOffset], pre;
                    if (child && domUtils.isBlockElm(child) && (pre = child.previousSibling) && domUtils.isBlockElm(pre)) {
                        range.setEnd(pre, pre.childNodes.length).collapse();
                        while (child.firstChild) {
                            pre.appendChild(child.firstChild);

                        }
                        domUtils.remove(child);
                    }
                }

            }


            var child, parent, pre, tmp, hadBreak = 0;
            while (child = div.firstChild) {
                range.insertNode(child);
                if (!hadBreak && child.nodeType == domUtils.NODE_ELEMENT && domUtils.isBlockElm(child)) {

                    parent = domUtils.findParent(child, function(node) {
                        return domUtils.isBlockElm(node);
                    });
                    if (parent && parent.tagName.toLowerCase() != 'body' && !(dtd[parent.tagName][child.nodeName] && child.parentNode === parent)) {
                        if (!dtd[parent.tagName][child.nodeName]) {
                            pre = parent;
                        } else {
                            tmp = child.parentNode;
                            while (tmp !== parent) {
                                pre = tmp;
                                tmp = tmp.parentNode;

                            }
                        }


                        domUtils.breakParent(child, pre || tmp);
                        //去掉break后前一个多余的节点  <p>|<[p> ==> <p></p><div></div><p>|</p>
                        var pre = child.previousSibling;
                        domUtils.trimWhiteTextNode(pre);
                        if (!pre.childNodes.length) {
                            domUtils.remove(pre);
                        }
                        //trace:2012,在非ie的情况，切开后剩下的节点有可能不能点入光标添加br占位

                        if (!browser.ie &&
                        (next = child.nextSibling) &&
                        domUtils.isBlockElm(next) &&
                        next.lastChild &&
                        !domUtils.isBr(next.lastChild)) {
                            next.appendChild(me.document.createElement('br'));
                        }
                        hadBreak = 1;
                    }
                }
                var next = child.nextSibling;
                if (!div.firstChild && next && domUtils.isBlockElm(next)) {

                    range.setStart(next, 0).collapse(true);
                    break;
                }
                range.setEndAfter(child).collapse();

            }


            child = range.startContainer;

            //用chrome可能有空白展位符
            if (domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)) {
                child.innerHTML = browser.ie ? '' : '<br/>';
            }
            //加上true因为在删除表情等时会删两次，第一次是删的fillData
            range.select(true);


            setTimeout(function() {
                if (!me.body)
                    return
                range = me.selection.getRange();
                range.scrollToView(me.autoHeightEnabled, me.autoHeightEnabled ? domUtils.getXY(me.iframe).y : 0);
            }, 200);




        }
    };

    ///import core
    ///commands 大小写转换
    ///commandsName touppercase
    ///commandsName tolowercase
    ///commandsTitle  大小写转换
    /**
 * 大小写转换
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName     cmdName="convertcase"
 */
    UE.commands['touppercase'] =
    UE.commands['tolowercase'] = {
        execCommand: function(cmd) {
            var me = this, rng = new dom.Range(me.document),
            convertCase = function() {
                var rng = me.selection.getRange();

                if (rng.collapsed) {
                    return rng;
                }

                var bk = rng.createBookmark(),
                bkEnd = bk.end,
                filterFn = function(node) {
                    return !domUtils.isBr(node) && !domUtils.isWhitespace(node);
                },
                curNode = domUtils.getNextDomNode(bk.start, false, filterFn);

                while (curNode && (domUtils.getPosition(curNode, bkEnd) & domUtils.POSITION_PRECEDING)) {

                    if (curNode.nodeType == 3) {
                        curNode.nodeValue = curNode.nodeValue[cmd == 'touppercase' ? 'toUpperCase' : 'toLowerCase']();
                    }
                    curNode = domUtils.getNextDomNode(curNode, true, filterFn);
                    if (curNode === bkEnd) {
                        break;
                    }

                }
                return rng.moveToBookmark(bk);

            };

            //table的处理
            if (me.currentSelectedArr && me.currentSelectedArr.length > 0) {
                for (var i = 0, ci; ci = me.currentSelectedArr[i++]; ) {
                    if (ci.style.display != 'none' && !domUtils.isEmptyBlock(ci)) {
                        rng.selectNodeContents(ci).select();
                        convertCase();
                    }

                }
                rng.selectNodeContents(me.currentSelectedArr[0]).select();
            } else {
                convertCase().select();
            }
        },
        queryCommandState: function() {
            return this.highlight ? -1 : 0;
        }
    };


    ///import core
    ///commands 全选
    ///commandsName  SelectAll
    ///commandsTitle  全选
    /**
 * 选中所有
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName    selectall选中编辑器里的所有内容
 * @author zhanyi
*/
    UE.plugins['selectall'] = function() {
        var me = this;
        me.commands['selectall'] = {
            execCommand: function() {
                //去掉了原生的selectAll,因为会出现报错和当内容为空时，不能出现闭合状态的光标
                var me = this, body = me.body,
                range = me.selection.getRange();
                range.selectNodeContents(body);
                if (domUtils.isEmptyBlock(body)) {
                    //opera不能自动合并到元素的里边，要手动处理一下
                    if (browser.opera && body.firstChild && body.firstChild.nodeType == 1) {
                        range.setStartAtFirst(body.firstChild);
                    }
                    range.collapse(true);
                }

                range.select(true);
                this.selectAll = true;
            },
            notNeedUndo: 1
        };

        me.addListener('ready', function() {

            domUtils.on(me.document, 'click', function(evt) {

                me.selectAll = false;
            });
        });

    };

    ///import core
    ///commands 删除
    ///commandsName  Delete
    ///commandsTitle  删除
    /**
 * 删除
 * @function
 * @name baidu.editor.execCommand
 * @param  {String}    cmdName    delete删除
 * @author zhanyi
 */
    UE.commands['delete'] = {
        execCommand: function() {

            var range = this.selection.getRange(),
            mStart = 0,
            mEnd = 0,
            me = this;
            if (this.selectAll) {
                //trace:1633
                me.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>';

                range.setStart(me.body.firstChild, 0).setCursor(false, true);

                me.selectAll = false;
                return;
            }
            if (me.currentSelectedArr && me.currentSelectedArr.length > 0) {
                for (var i = 0, ci; ci = me.currentSelectedArr[i++]; ) {
                    if (ci.style.display != 'none') {
                        ci.innerHTML = browser.ie ? domUtils.fillChar : '<br/>';
                    }

                }
                range.setStart(me.currentSelectedArr[0], 0).setCursor();
                return;
            }
            if (range.collapsed) {
                return;
            }
            range.txtToElmBoundary();
            //&& !domUtils.isBlockElm(range.startContainer)
            while (!range.startOffset && !domUtils.isBody(range.startContainer) && !dtd.$tableContent[range.startContainer.tagName]) {
                mStart = 1;
                range.setStartBefore(range.startContainer);
            }
            //&& !domUtils.isBlockElm(range.endContainer)
            //不对文本节点进行操作
            //trace:2428
            while (range.endContainer.nodeType != 3 && !domUtils.isBody(range.endContainer) && !dtd.$tableContent[range.endContainer.tagName]) {
                var child, endContainer = range.endContainer, endOffset = range.endOffset;
                //                if(endContainer.nodeType == 3 &&  endOffset == endContainer.nodeValue.length){
                //                    range.setEndAfter(endContainer);
                //                    continue;
                //                }

                child = endContainer.childNodes[endOffset];
                if (!child || domUtils.isBr(child) && endContainer.lastChild === child) {
                    range.setEndAfter(endContainer);
                    continue;
                }
                break;

            }
            if (mStart) {
                var start = me.document.createElement('span');
                start.innerHTML = 'start';
                start.id = '_baidu_cut_start';
                range.insertNode(start).setStartBefore(start);
            }
            if (mEnd) {
                var end = me.document.createElement('span');
                end.innerHTML = 'end';
                end.id = '_baidu_cut_end';
                range.cloneRange().collapse(false).insertNode(end);
                range.setEndAfter(end);

            }



            range.deleteContents();


            if (domUtils.isBody(range.startContainer) && domUtils.isEmptyBlock(me.body)) {
                me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';
                range.setStart(me.body.firstChild, 0).collapse(true);
            } else if (!browser.ie && domUtils.isEmptyBlock(range.startContainer)) {
                range.startContainer.innerHTML = '<br/>';
            }

            range.select(true);
        },
        queryCommandState: function() {

            if (this.currentSelectedArr && this.currentSelectedArr.length > 0) {
                return 0;
            }
            return this.highlight || this.selection.getRange().collapsed ? -1 : 0;
        }
    };

    ///import core
    ///commands 撤销和重做
    ///commandsName  Undo,Redo
    ///commandsTitle  撤销,重做
    /**
* @description 回退
* @author zhanyi
*/

    UE.plugins['undo'] = function() {
        var me = this,
        maxUndoCount = me.options.maxUndoCount || 20,
        maxInputCount = me.options.maxInputCount || 20,
        fillchar = new RegExp(domUtils.fillChar + '|<\/hr>', 'gi'),  // ie会产生多余的</hr>
        //在比较时，需要过滤掉这些属性
        specialAttr = /\b(?:href|src|name)="[^"]*?"/gi;

        //场景的range实例
        function sceneRange(rng) {
            var me = this;
            me.collapsed = rng.collapsed;
            me.startAddr = getAddr(rng.startContainer, rng.startOffset);
            me.endAddr = rng.collapsed ? me.startAddr : getAddr(rng.endContainer, rng.endOffset)

        }
        sceneRange.prototype = {
            compare: function(obj) {
                var me = this;
                if (me.collapsed !== obj.collapsed) {
                    return 0;
                }
                if (!compareAddr(me.startAddr, obj.startAddr) || !compareAddr(me.endAddr, obj.endAddr)) {
                    return 0;
                }
                return 1;
            },
            transformRange: function(rng) {
                var me = this;
                rng.collapsed = me.collapsed;
                setAddr(rng, 'start', me.startAddr);
                rng.collapsed ? rng.collapse(true) : setAddr(rng, 'end', me.endAddr)

            }
        };
        function getAddr(node, index) {
            for (var i = 0, parentsIndex = [index], ci,
            parents = domUtils.findParents(node, true, function(node) {
                return !domUtils.isBody(node)
            }, true);
            ci = parents[i++]; ) {
                //修正偏移位置
                if (i == 1 && ci.nodeType == 3) {

                    var tmpNode = ci;
                    while (tmpNode = tmpNode.previousSibling) {
                        if (tmpNode.nodeType == 3) {
                            //                        console.log(index)
                            index += tmpNode.nodeValue.replace(fillCharReg, '').length;
                        } else {
                            break;
                        }
                    }
                    parentsIndex[0] = index;
                }

                parentsIndex.push(domUtils.getNodeIndex(ci, true));

            }

            return parentsIndex.reverse();

        }

        function compareAddr(indexA, indexB) {
            if (indexA.length != indexB.length)
                return 0;
            for (var i = 0, l = indexA.length; i < l; i++) {
                if (indexA[i] != indexB[i])
                    return 0
            }
            return 1;
        }
        function setAddr(range, boundary, addr) {

            node = range.document.body;
            for (var i = 0, node, l = addr.length - 1; i < l; i++) {
                node = node.childNodes[addr[i]];
            }
            range[boundary + 'Container'] = node;
            range[boundary + 'Offset'] = addr[addr.length - 1];
        }
        function UndoManager() {

            this.list = [];
            this.index = 0;
            this.hasUndo = false;
            this.hasRedo = false;
            this.undo = function() {

                if (this.hasUndo) {
                    var currentScene = this.getScene(),
                    lastScene = this.list[this.index];
                    if (lastScene.content.replace(specialAttr, '') != currentScene.content.replace(specialAttr, '')) {
                        this.save();
                    }
                    if (!this.list[this.index - 1] && this.list.length == 1) {
                        this.reset();
                        return;
                    }
                    while (this.list[this.index].content == this.list[this.index - 1].content) {
                        this.index--;
                        if (this.index == 0) {
                            return this.restore(0);
                        }
                    }
                    this.restore(--this.index);
                }
            };
            this.redo = function() {
                if (this.hasRedo) {
                    while (this.list[this.index].content == this.list[this.index + 1].content) {
                        this.index++;
                        if (this.index == this.list.length - 1) {
                            return this.restore(this.index);
                        }
                    }
                    this.restore(++this.index);
                }
            };

            this.restore = function() {
                var scene = this.list[this.index];
                //trace:873
                //去掉展位符
                me.document.body.innerHTML = scene.bookcontent.replace(fillchar, '');
                //处理undo后空格不展位的问题
                if (browser.ie) {
                    for (var i = 0, pi, ps = me.document.getElementsByTagName('p'); pi = ps[i++]; ) {
                        if (pi.innerHTML == '') {
                            domUtils.fillNode(me.document, pi);
                        }
                    }
                }

                var range = new dom.Range(me.document);


                //有可能再save时没有bookmark
                try {
                    if (browser.opera || browser.safari) {
                        scene.senceRange.transformRange(range)
                    } else {
                        range.moveToBookmark({
                            start: '_baidu_bookmark_start_',
                            end: '_baidu_bookmark_end_',
                            id: true
                        //去掉true 是为了<b>|</b>，回退后还能在b里
                        });
                    }

                    //trace:1278 ie9block元素为空，将出现光标定位的问题，必须填充内容
                    if (browser.ie && browser.version == 9 && range.collapsed && domUtils.isBlockElm(range.startContainer) && domUtils.isEmptyNode(range.startContainer)) {
                        domUtils.fillNode(range.document, range.startContainer);

                    }
                    range.select(!browser.gecko);
                    if (!(browser.opera || browser.safari)) {
                        setTimeout(function() {
                            range.scrollToView(me.autoHeightEnabled, me.autoHeightEnabled ? domUtils.getXY(me.iframe).y : 0);
                        }, 200);
                    }

                } catch (e) {
                }

                this.update();
                //table的单独处理
                if (me.currentSelectedArr) {
                    me.currentSelectedArr = [];
                    var tds = me.document.getElementsByTagName('td');
                    for (var i = 0, td; td = tds[i++]; ) {
                        if (td.className == me.options.selectedTdClass) {
                            me.currentSelectedArr.push(td);
                        }
                    }
                }
                this.clearKey();
                //不能把自己reset了
                me.fireEvent('reset', true);
            };

            this.getScene = function() {
                var range = me.selection.getRange(),
                cont = me.body.innerHTML.replace(fillchar, '');
                //有可能边界落到了<table>|<tbody>这样的位置，所以缩一下位置
                range.shrinkBoundary();
                browser.ie && (cont = cont.replace(/>&nbsp;</g, '><').replace(/\s*</g, '').replace(/>\s*/g, '>'));

                if (browser.opera || browser.safari) {
                    return {
                        senceRange: new sceneRange(range),
                        content: cont,
                        bookcontent: cont
                    }
                } else {
                    var bookmark = range.createBookmark(true, true),
                    bookCont = me.body.innerHTML.replace(fillchar, '');
                    bookmark && range.moveToBookmark(bookmark).select(true);
                    return {
                        bookcontent: bookCont,
                        content: cont
                    };
                }

            };
            this.save = function(notCompareRange) {

                var currentScene = this.getScene(),
                lastScene = this.list[this.index];
                //内容相同位置相同不存
                if (lastScene && lastScene.content == currentScene.content &&
                (
                notCompareRange ? 1 :
                ((browser.opera || browser.safari) ? lastScene.senceRange.compare(currentScene.senceRange) : lastScene.bookcontent == currentScene.bookcontent)
                )
                ) {
                    return;
                }

                this.list = this.list.slice(0, this.index + 1);
                this.list.push(currentScene);
                //如果大于最大数量了，就把最前的剔除
                if (this.list.length > maxUndoCount) {
                    this.list.shift();
                }
                this.index = this.list.length - 1;
                this.clearKey();
                //跟新undo/redo状态
                this.update();
            };
            this.update = function() {
                this.hasRedo = this.list[this.index + 1] ? true : false;
                this.hasUndo = this.list[this.index - 1] || this.list.length == 1 ? true : false;
            };
            this.reset = function() {
                this.list = [];
                this.index = 0;
                this.hasUndo = false;
                this.hasRedo = false;
                this.clearKey();
            };
            this.clearKey = function() {
                keycont = 0;
                lastKeyCode = null;
                me.fireEvent('contentchange');
            };
        }

        me.undoManger = new UndoManager();
        function saveScene() {
            this.undoManger.save();
        }

        me.addListener('beforeexeccommand', saveScene);
        me.addListener('afterexeccommand', saveScene);

        me.addListener('reset', function(type, exclude) {
            if (!exclude) {
                me.undoManger.reset();
            }
        });
        me.commands['redo'] = me.commands['undo'] = {
            execCommand: function(cmdName) {
                me.undoManger[cmdName]();
            },
            queryCommandState: function(cmdName) {
                return me.undoManger['has' + (cmdName.toLowerCase() == 'undo' ? 'Undo' : 'Redo')] ? 0 : -1;
            },
            notNeedUndo: 1
        };

        var keys = {
            //  /*Backspace*/ 8:1, /*Delete*/ 46:1,
            /*Shift*/16: 1, /*Ctrl*/17: 1, /*Alt*/18: 1,
            37: 1,38: 1,39: 1,40: 1,
            13: 1 /*enter*/
        },
        keycont = 0,
        lastKeyCode;

        me.addListener('keydown', function(type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
                if (me.undoManger.list.length == 0 || ((keyCode == 8 || keyCode == 46) && lastKeyCode != keyCode)) {
                    me.undoManger.save(true);
                    lastKeyCode = keyCode;
                    return;
                }
                //trace:856
                //修正第一次输入后，回退，再输入要到keycont>maxInputCount才能在回退的问题
                if (me.undoManger.list.length == 2 && me.undoManger.index == 0 && keycont == 0) {
                    me.undoManger.list.splice(1, 1);
                    me.undoManger.update();
                }
                lastKeyCode = keyCode;
                keycont++;
                if (keycont >= maxInputCount) {
                    if (me.selection.getRange().collapsed)
                        me.undoManger.save();
                }
            }
        });
    };

    ///import core
    ///import plugins/inserthtml.js
    ///import plugins/undo.js
    ///import plugins/serialize.js
    ///commands 粘贴
    ///commandsName  PastePlain
    ///commandsTitle  纯文本粘贴模式
    /*
 ** @description 粘贴
 * @author zhanyi
 */
    (function() {
        function getClipboardData(callback) {

            var doc = this.document;

            if (doc.getElementById('baidu_pastebin')) {
                return;
            }

            var range = this.selection.getRange(),
            bk = range.createBookmark(),
            //创建剪贴的容器div
            pastebin = doc.createElement('div');

            pastebin.id = 'baidu_pastebin';


            // Safari 要求div必须有内容，才能粘贴内容进来
            browser.webkit && pastebin.appendChild(doc.createTextNode(domUtils.fillChar + domUtils.fillChar));
            doc.body.appendChild(pastebin);
            //trace:717 隐藏的span不能得到top
            //bk.start.innerHTML = '&nbsp;';
            bk.start.style.display = '';
            pastebin.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;left:-1000px;white-space:nowrap;top:" +
            //要在现在光标平行的位置加入，否则会出现跳动的问题
            domUtils.getXY(bk.start).y + 'px';

            range.selectNodeContents(pastebin).select(true);

            setTimeout(function() {

                if (browser.webkit) {

                    for (var i = 0, pastebins = doc.querySelectorAll('#baidu_pastebin'), pi; pi = pastebins[i++]; ) {
                        if (domUtils.isEmptyNode(pi)) {
                            domUtils.remove(pi);
                        } else {
                            pastebin = pi;
                            break;
                        }
                    }


                }

                try {
                    pastebin.parentNode.removeChild(pastebin);
                } catch (e) {
                }

                range.moveToBookmark(bk).select(true);
                callback(pastebin);
            }, 0);


        }

        UE.plugins['paste'] = function() {
            var me = this;
            var word_img_flag = {flag: ""};

            var pasteplain = me.options.pasteplain === true;
            var modify_num = {flag: ""};
            me.commands['pasteplain'] = {
                queryCommandState: function() {
                    return pasteplain;
                },
                execCommand: function() {
                    pasteplain = !pasteplain | 0;
                },
                notNeedUndo: 1
            };

            function filter(div) {

                var html;
                if (div.firstChild) {
                    //去掉cut中添加的边界值
                    var nodes = domUtils.getElementsByTagName(div, 'span');
                    for (var i = 0, ni; ni = nodes[i++]; ) {
                        if (ni.id == '_baidu_cut_start' || ni.id == '_baidu_cut_end') {
                            domUtils.remove(ni);
                        }
                    }

                    if (browser.webkit) {

                        var brs = div.querySelectorAll('div br');
                        for (var i = 0, bi; bi = brs[i++]; ) {
                            var pN = bi.parentNode;
                            if (pN.tagName == 'DIV' && pN.childNodes.length == 1) {
                                pN.innerHTML = '<p><br/></p>';

                                domUtils.remove(pN);
                            }
                        }
                        var divs = div.querySelectorAll('#baidu_pastebin');
                        for (var i = 0, di; di = divs[i++]; ) {
                            var tmpP = me.document.createElement('p');
                            di.parentNode.insertBefore(tmpP, di);
                            while (di.firstChild) {
                                tmpP.appendChild(di.firstChild);
                            }
                            domUtils.remove(di);
                        }



                        var metas = div.querySelectorAll('meta');
                        for (var i = 0, ci; ci = metas[i++]; ) {
                            domUtils.remove(ci);
                        }

                        var brs = div.querySelectorAll('br');
                        for (i = 0; ci = brs[i++]; ) {
                            if (/^apple-/.test(ci)) {
                                domUtils.remove(ci);
                            }
                        }

                    }
                    if (browser.gecko) {
                        var dirtyNodes = div.querySelectorAll('[_moz_dirty]');
                        for (i = 0; ci = dirtyNodes[i++]; ) {
                            ci.removeAttribute('_moz_dirty');
                        }
                    }
                    if (!browser.ie) {
                        var spans = div.querySelectorAll('span.Apple-style-span');
                        for (var i = 0, ci; ci = spans[i++]; ) {
                            domUtils.remove(ci, true);
                        }
                    }


                    html = div.innerHTML;

                    var f = me.serialize;
                    if (f) {
                        //如果过滤出现问题，捕获它，直接插入内容，避免出现错误导致粘贴整个失败
                        try {
                            var node = f.transformInput(
                            f.parseHTML(
                            //todo: 暂时不走dtd的过滤
                            f.word(html) //, true
                            ), word_img_flag
                            );
                            //trace:924
                            //纯文本模式也要保留段落
                            node = f.filter(node, pasteplain ? {
                                whiteList: {
                                    'p': {'br': 1,'BR': 1,$: {}},
                                    'br': {'$': {}},
                                    'div': {'br': 1,'BR': 1,'$': {}},
                                    'li': {'$': {}},
                                    'tr': {'td': 1,'$': {}},
                                    'td': {'$': {}}

                                },
                                blackList: {
                                    'style': 1,
                                    'script': 1,
                                    'object': 1
                                }
                            } : null, !pasteplain ? modify_num : null);

                            if (browser.webkit) {
                                var length = node.children.length,
                                child;
                                while ((child = node.children[length - 1]) && child.tag == 'br') {
                                    node.children.splice(length - 1, 1);
                                    length = node.children.length;
                                }
                            }
                            html = f.toHTML(node, pasteplain);

                        } catch (e) {
                        }

                    }


                    //自定义的处理
                    html = {'html': html};

                    me.fireEvent('beforepaste', html);
                    //不用在走过滤了
                    me.execCommand('insertHtml', html.html, true);

                    me.fireEvent("afterpaste");

                }
            }

            me.addListener('ready', function() {
                domUtils.on(me.body, 'cut', function() {

                    var range = me.selection.getRange();
                    if (!range.collapsed && me.undoManger) {
                        me.undoManger.save();
                    }

                });
                //ie下beforepaste在点击右键时也会触发，所以用监控键盘才处理
                domUtils.on(me.body, browser.ie || browser.opera ? 'keydown' : 'paste', function(e) {

                    if ((browser.ie || browser.opera) && (!e.ctrlKey || e.keyCode != '86')) {
                        return;
                    }

                    getClipboardData.call(me, function(div) {
                        filter(div);
                    });


                });

            });

        };

    })();


    ///import core
    ///commands 快捷键
    ///commandsName  ShortCutKeys
    ///commandsTitle  快捷键
    //配置快捷键
    UE.plugins['shortcutkeys'] = function() {
        var me = this,
        shortcutkeys = {
            "ctrl+66": "Bold", //^B
            "ctrl+90": "Undo", //undo
            "ctrl+89": "Redo", //redo
            "ctrl+73": "Italic", //^I
            "ctrl+85": "Underline", //^U
            "ctrl+shift+67": "removeformat", //清除格式
            "ctrl+shift+76": "justify:left", //居左
            "ctrl+shift+82": "justify:right", //居右
            "ctrl+65": "selectAll",
            "ctrl+13": "autosubmit" //手动提交
        //        	,"9"	   : "indent" //tab
        };
        me.addListener('keydown', function(type, e) {

            var keyCode = e.keyCode || e.which, value;
            for (var i in shortcutkeys) {
                if (/^(ctrl)(\+shift)?\+(\d+)$/.test(i.toLowerCase()) || /^(\d+)$/.test(i)) {
                    if (((RegExp.$1 == 'ctrl' ? (e.ctrlKey || e.metaKey || browser.opera && keyCode == 17) : 0)
                    && (RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1)
                    && keyCode == RegExp.$3
                    ) ||
                    keyCode == RegExp.$1
                    ) {

                        value = shortcutkeys[i].split(':');
                        me.execCommand(value[0], value[1]);
                        domUtils.preventDefault(e);
                    }
                }
            }
        });
    };
    ///import core
    ///import plugins/undo.js
    ///commands 设置回车标签p或br
    ///commandsName  EnterKey
    ///commandsTitle  设置回车标签p或br
    /**
 * @description 处理回车
 * @author zhanyi
 */
    UE.plugins['enterkey'] = function() {
        var hTag,
        me = this,
        tag = me.options.enterTag;
        me.addListener('keyup', function(type, evt) {

            var keyCode = evt.keyCode || evt.which;
            if (keyCode == 13) {
                var range = me.selection.getRange(),
                start = range.startContainer,
                doSave;

                //修正在h1-h6里边回车后不能嵌套p的问题
                if (!browser.ie) {

                    if (/h\d/i.test(hTag)) {
                        if (browser.gecko) {
                            var h = domUtils.findParentByTagName(start, ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'], true);
                            if (!h) {
                                me.document.execCommand('formatBlock', false, '<p>');
                                doSave = 1;
                            }
                        } else {
                            //chrome remove div
                            if (start.nodeType == 1) {
                                var tmp = me.document.createTextNode(''), div;
                                range.insertNode(tmp);
                                div = domUtils.findParentByTagName(tmp, 'div', true);
                                if (div) {
                                    var p = me.document.createElement('p');
                                    while (div.firstChild) {
                                        p.appendChild(div.firstChild);
                                    }
                                    div.parentNode.insertBefore(p, div);
                                    domUtils.remove(div);
                                    range.setStartBefore(tmp).setCursor();
                                    doSave = 1;
                                }
                                domUtils.remove(tmp);

                            }
                        }

                        if (me.undoManger && doSave) {
                            me.undoManger.save();
                        }
                    }
                    //没有站位符，会出现多行的问题
                    browser.opera && range.select();
                }



                setTimeout(function() {
                    me.selection.getRange().scrollToView(me.autoHeightEnabled, me.autoHeightEnabled ? domUtils.getXY(me.iframe).y : 0);
                }, 50);
                //给经验自己增加的需求，回车后祛除ie下默认行为产生的a标签
                var alist = me.body.getElementsByTagName("a");
                for(var i= 0,a;a=alist[i++];){
                    domUtils.remove(a,true);
                }
            }
        });

        me.addListener('keydown', function(type, evt) {
            var keyCode = evt.keyCode || evt.which;
            if (keyCode == 13) { //回车
                if (me.undoManger) {
                    me.undoManger.save();
                }
                hTag = '';


                var range = me.selection.getRange();

                if (!range.collapsed) {
                    //跨td不能删
                    var start = range.startContainer,
                    end = range.endContainer,
                    startTd = domUtils.findParentByTagName(start, 'td', true),
                    endTd = domUtils.findParentByTagName(end, 'td', true);
                    if (startTd && endTd && startTd !== endTd || !startTd && endTd || startTd && !endTd) {
                        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
                        return;
                    }
                }
                me.currentSelectedArr && domUtils.clearSelectedArr(me.currentSelectedArr);

                if (tag == 'p') {


                    if (!browser.ie) {

                        start = domUtils.findParentByTagName(range.startContainer, ['ol', 'ul', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'], true);

                        //opera下执行formatblock会在table的场景下有问题，回车在opera原生支持很好，所以暂时在opera去掉调用这个原生的command
                        //trace:2431
                        if (!start && !browser.opera) {

                            me.document.execCommand('formatBlock', false, '<p>');
                            if (browser.gecko) {
                                range = me.selection.getRange();
                                start = domUtils.findParentByTagName(range.startContainer, 'p', true);
                                start && domUtils.removeDirtyAttr(start);
                            }


                        } else {
                            hTag = start.tagName;
                            start.tagName.toLowerCase() == 'p' && browser.gecko && domUtils.removeDirtyAttr(start);
                        }

                    }

                } else {
                    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

                    if (!range.collapsed) {
                        range.deleteContents();
                        start = range.startContainer;
                        if (start.nodeType == 1 && (start = start.childNodes[range.startOffset])) {
                            while (start.nodeType == 1) {
                                if (dtd.$empty[start.tagName]) {
                                    range.setStartBefore(start).setCursor();
                                    if (me.undoManger) {
                                        me.undoManger.save();
                                    }
                                    return false;
                                }
                                if (!start.firstChild) {
                                    var br = range.document.createElement('br');
                                    start.appendChild(br);
                                    range.setStart(start, 0).setCursor();
                                    if (me.undoManger) {
                                        me.undoManger.save();
                                    }
                                    return false;
                                }
                                start = start.firstChild;
                            }
                            if (start === range.startContainer.childNodes[range.startOffset]) {
                                br = range.document.createElement('br');
                                range.insertNode(br).setCursor();

                            } else {
                                range.setStart(start, 0).setCursor();
                            }


                        } else {
                            br = range.document.createElement('br');
                            range.insertNode(br).setStartAfter(br).setCursor();
                        }


                    } else {
                        br = range.document.createElement('br');
                        range.insertNode(br);
                        var parent = br.parentNode;
                        if (parent.lastChild === br) {
                            br.parentNode.insertBefore(br.cloneNode(true), br);
                            range.setStartBefore(br);
                        } else {
                            range.setStartAfter(br);
                        }
                        range.setCursor();

                    }

                }


            }
        });
    };

    ///import core
    ///commands 修复chrome下图片不能点击的问题
    ///commandsName  FixImgClick
    ///commandsTitle  修复chrome下图片不能点击的问题
    //修复chrome下图片不能点击的问题
    //todo 可以改大小
    UE.plugins['fiximgclick'] = function() {
        var me = this;
        if (browser.webkit) {
            me.addListener('click', function(type, e) {
                if (e.target.tagName == 'IMG') {
                    var range = new dom.Range(me.document);
                    range.selectNode(e.target).select();

                }
            });
        }
    };
    ///import core
    ///commands 当输入内容超过编辑器高度时，编辑器自动增高
    ///commandsName  AutoHeight,autoHeightEnabled
    ///commandsTitle  自动增高
    /**
 * @description 自动伸展
 * @author zhanyi
 */
    UE.plugins['autoheight'] = function() {
        var me = this;
        //提供开关，就算加载也可以关闭
        me.autoHeightEnabled = me.options.autoHeightEnabled !== false;
        if (!me.autoHeightEnabled) {
            return;
        }

        var bakOverflow,
        span, tmpNode,
        lastHeight = 0,
        options = me.options,
        currentHeight,
        timer;

        function adjustHeight() {
            var me = this;
            clearTimeout(timer);
            timer = setTimeout(function() {
                if (me.body && me.queryCommandState('source') != 1) {
                    if (!span) {
                        span = me.document.createElement('span');
                        //trace:1764
                        span.style.cssText = 'display:block;width:0;margin:0;padding:0;border:0;clear:both;';
                        span.innerHTML = '.';
                    }
                    tmpNode = span.cloneNode(true);
                    me.body.appendChild(tmpNode);

                    currentHeight = Math.max(domUtils.getXY(tmpNode).y + tmpNode.offsetHeight, Math.max(options.minFrameHeight, options.initialFrameHeight));

                    if (currentHeight != lastHeight) {

                        me.setHeight(currentHeight);

                        lastHeight = currentHeight;
                    }

                    domUtils.remove(tmpNode);

                }
            }, 100);
        }

        me.addListener('destroy', function() {
            me.removeListener('contentchange', adjustHeight);
            me.removeListener('keyup', adjustHeight);
            me.removeListener('mouseup', adjustHeight);
        });
        me.enableAutoHeight = function() {
            if (!me.autoHeightEnabled) {
                return;
            }
            var doc = me.document;
            me.autoHeightEnabled = true;
            bakOverflow = doc.body.style.overflowY;
            doc.body.style.overflowY = 'hidden';
            me.addListener('contentchange', adjustHeight);
            me.addListener('keyup', adjustHeight);
            me.addListener('mouseup', adjustHeight);
            //ff不给事件算得不对
            setTimeout(function() {
                adjustHeight.call(me);
            }, browser.gecko ? 100 : 0);
            me.fireEvent('autoheightchanged', me.autoHeightEnabled);
        };
        me.disableAutoHeight = function() {

            me.body.style.overflowY = bakOverflow || '';

            me.removeListener('contentchange', adjustHeight);
            me.removeListener('keyup', adjustHeight);
            me.removeListener('mouseup', adjustHeight);
            me.autoHeightEnabled = false;
            me.fireEvent('autoheightchanged', me.autoHeightEnabled);
        };
        me.addListener('ready', function() {
            me.enableAutoHeight();
            //trace:1764
            var timer;
            domUtils.on(browser.ie ? me.body : me.document, browser.webkit ? 'dragover' : 'drop', function() {
                clearTimeout(timer);
                timer = setTimeout(function() {
                    adjustHeight.call(me);
                }, 100);

            });
        });


    };


    ///import core
    ///commands 悬浮工具栏
    ///commandsName  AutoFloat,autoFloatEnabled
    ///commandsTitle  悬浮工具栏
    /*
 *  modified by chengchao01
 *
 *  注意： 引入此功能后，在IE6下会将body的背景图片覆盖掉！
 */
    UE.plugins['autofloat'] = function() {
        var me = this,
        lang = me.getLang();
        me.setOpt({
            topOffset: 0
        });
        var optsAutoFloatEnabled = me.options.autoFloatEnabled !== false,
        topOffset = me.options.topOffset;

        //如果不固定toolbar的位置，则直接退出
        if (!optsAutoFloatEnabled) {
            return;
        }
        var uiUtils = UE.ui.uiUtils,
        LteIE6 = browser.ie && browser.version <= 6,
        quirks = browser.quirks;

        function checkHasUI(editor) {
            if (!editor.ui) {
                alert(lang.autofloatMsg);
                return 0;
            }
            return 1;
        }
        function fixIE6FixedPos() {
            var docStyle = document.body.style;
            docStyle.backgroundImage = 'url("about:blank")';
            docStyle.backgroundAttachment = 'fixed';
        }
        var bakCssText,
        placeHolder = document.createElement('div'),
        toolbarBox, orgTop,
        getPosition,
        flag = true; //ie7模式下需要偏移
        function setFloating() {
            var toobarBoxPos = domUtils.getXY(toolbarBox),
            origalFloat = domUtils.getComputedStyle(toolbarBox, 'position'),
            origalLeft = domUtils.getComputedStyle(toolbarBox, 'left');
            toolbarBox.style.width = toolbarBox.offsetWidth + 'px';
            toolbarBox.style.zIndex = me.options.zIndex * 1 + 1;
            toolbarBox.parentNode.insertBefore(placeHolder, toolbarBox);
            if (LteIE6 || (quirks && browser.ie)) {
                if (toolbarBox.style.position != 'absolute') {
                    toolbarBox.style.position = 'absolute';
                }
                //                alert(document.body.scrollTop||document.documentElement.scrollTop+"|"+orgTop)
                toolbarBox.style.top = (document.body.scrollTop || document.documentElement.scrollTop) - orgTop + topOffset + 'px';
            } else {
                if (browser.ie7Compat && flag) {
                    flag = false;
                    toolbarBox.style.left = domUtils.getXY(toolbarBox).x - document.documentElement.getBoundingClientRect().left + 2 + 'px';
                }
                if (toolbarBox.style.position != 'fixed') {
                    toolbarBox.style.position = 'fixed';
                    toolbarBox.style.top = topOffset + "px";
                    ((origalFloat == 'absolute' || origalFloat == 'relative') && parseFloat(origalLeft)) && (toolbarBox.style.left = toobarBoxPos.x + 'px');
                }
            }
        }
        function unsetFloating() {
            flag = true;
            if (placeHolder.parentNode) {
                placeHolder.parentNode.removeChild(placeHolder);
            }
            toolbarBox.style.cssText = bakCssText;
        }

        function updateFloating() {
            if (me.container) {
                var rect3 = getPosition(me.container);
                if (rect3.top < 0 && rect3.bottom - toolbarBox.offsetHeight > 0) {
                    setFloating();
                } else {
                    unsetFloating();
                }
            }

        }
        var defer_updateFloating = utils.defer(function() {
            updateFloating();
        }, browser.ie ? 200 : 100, true);

        me.addListener('destroy', function() {
            domUtils.un(window, ['scroll', 'resize'], updateFloating);
            me.removeListener('keydown', defer_updateFloating);
        });
        me.addListener('ready', function() {
            if (checkHasUI(me)) {

                getPosition = uiUtils.getClientRect;
                toolbarBox = me.ui.getDom('toolbarbox');
                orgTop = (document.body.scrollTop || document.documentElement.scrollTop) + getPosition(toolbarBox).top;
                bakCssText = toolbarBox.style.cssText;
                placeHolder.style.height = toolbarBox.offsetHeight + 'px';
                if (LteIE6) {
                    fixIE6FixedPos();
                }
                me.addListener('autoheightchanged', function(t, enabled) {
                    if (enabled) {
                        domUtils.on(window, ['scroll', 'resize'], updateFloating);
                        me.addListener('keydown', defer_updateFloating);
                    } else {
                        domUtils.un(window, ['scroll', 'resize'], updateFloating);
                        me.removeListener('keydown', defer_updateFloating);
                    }
                });

                me.addListener('beforefullscreenchange', function(t, enabled) {
                    if (enabled) {
                        unsetFloating();
                    }
                });
                me.addListener('fullscreenchanged', function(t, enabled) {
                    if (!enabled) {
                        updateFloating();
                    }
                });
                me.addListener('sourcemodechanged', function(t, enabled) {
                    setTimeout(function() {
                        updateFloating();
                    }, 0);
                });
            }
        });
    };

    ///import core
    ///commands 定制过滤规则
    ///commandsName  Serialize
    ///commandsTitle  定制过滤规则
    UE.plugins['serialize'] = function() {
        var ie = browser.ie,
        version = browser.version;

        function ptToPx(value) {
            return /pt/.test(value) ? value.replace(/([\d.]+)pt/g, function(str) {
                return Math.round(parseFloat(str) * 96 / 72) + "px";
            }) : value;
        }
        var me = this, autoClearEmptyNode = me.options.autoClearEmptyNode,
        EMPTY_TAG = dtd.$empty,
        parseHTML = function() {
            //干掉<a> 后便变得空格，保留</a>  这样的空格
            var RE_PART = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g,
            RE_ATTR = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g,
            EMPTY_ATTR = {checked: 1,compact: 1,declare: 1,defer: 1,disabled: 1,ismap: 1,multiple: 1,nohref: 1,noresize: 1,noshade: 1,nowrap: 1,readonly: 1,selected: 1},
            CDATA_TAG = {script: 1,style: 1},
            NEED_PARENT_TAG = {
                "li": {"$": 'ul',"ul": 1,"ol": 1},
                "dd": {"$": "dl","dl": 1},
                "dt": {"$": "dl","dl": 1},
                "option": {"$": "select","select": 1},
                "td": {"$": "tr","tr": 1},
                "th": {"$": "tr","tr": 1},
                "tr": {"$": "tbody","tbody": 1,"thead": 1,"tfoot": 1,"table": 1},
                "tbody": {"$": "table",'table': 1,"colgroup": 1},
                "thead": {"$": "table","table": 1},
                "tfoot": {"$": "table","table": 1},
                "col": {"$": "colgroup","colgroup": 1}
            };
            var NEED_CHILD_TAG = {
                "table": "td","tbody": "td","thead": "td","tfoot": "td","tr": "td",
                "colgroup": "col",
                "ul": "li","ol": "li",
                "dl": "dd",
                "select": "option"
            };

            function parse(html, callbacks) {

                var match,
                nextIndex = 0,
                tagName,
                cdata;
                RE_PART.exec("");
                while ((match = RE_PART.exec(html))) {

                    var tagIndex = match.index;
                    if (tagIndex > nextIndex) {
                        var text = html.slice(nextIndex, tagIndex);
                        if (cdata) {
                            cdata.push(text);
                        } else {
                            callbacks.onText(text);
                        }
                    }
                    nextIndex = RE_PART.lastIndex;
                    if ((tagName = match[1])) {
                        tagName = tagName.toLowerCase();
                        if (cdata && tagName == cdata._tag_name) {
                            callbacks.onCDATA(cdata.join(''));
                            cdata = null;
                        }
                        if (!cdata) {
                            callbacks.onTagClose(tagName);
                            continue;
                        }
                    }
                    if (cdata) {
                        cdata.push(match[0]);
                        continue;
                    }
                    if ((tagName = match[3])) {
                        if (/="/.test(tagName)) {
                            continue;
                        }
                        tagName = tagName.toLowerCase();
                        var attrPart = match[4],
                        attrMatch,
                        attrMap = {},
                        selfClosing = attrPart && attrPart.slice(-1) == '/';
                        if (attrPart) {
                            RE_ATTR.exec("");
                            while ((attrMatch = RE_ATTR.exec(attrPart))) {
                                var attrName = attrMatch[1].toLowerCase(),
                                attrValue = attrMatch[2] || attrMatch[3] || attrMatch[4] || '';
                                if (!attrValue && EMPTY_ATTR[attrName]) {
                                    attrValue = attrName;
                                }
                                if (attrName == 'style') {
                                    if (ie && version <= 6) {
                                        attrValue = attrValue.replace(/(?!;)\s*([\w-]+):/g, function(m, p1) {
                                            return p1.toLowerCase() + ':';
                                        });
                                    }
                                }
                                //没有值的属性不添加
                                if (attrValue) {
                                    attrMap[attrName] = attrValue.replace(/:\s*/g, ':')
                                }

                            }
                        }
                        callbacks.onTagOpen(tagName, attrMap, selfClosing);
                        if (!cdata && CDATA_TAG[tagName]) {
                            cdata = [];
                            cdata._tag_name = tagName;
                        }
                        continue;
                    }
                    if ((tagName = match[2])) {
                        callbacks.onComment(tagName);
                    }
                }
                if (html.length > nextIndex) {
                    callbacks.onText(html.slice(nextIndex, html.length));
                }
            }

            return function(html, forceDtd) {

                var fragment = {
                    type: 'fragment',
                    parent: null,
                    children: []
                };
                var currentNode = fragment;

                function addChild(node) {
                    node.parent = currentNode;
                    currentNode.children.push(node);
                }

                function addElement(element, open) {
                    var node = element;
                    // 遇到结构化标签的时候
                    if (NEED_PARENT_TAG[node.tag]) {
                        // 考虑这种情况的时候, 结束之前的标签
                        // e.g. <table><tr><td>12312`<tr>`4566
                        while (NEED_PARENT_TAG[currentNode.tag] && NEED_PARENT_TAG[currentNode.tag][node.tag]) {
                            currentNode = currentNode.parent;
                        }
                        // 如果前一个标签和这个标签是同一级, 结束之前的标签
                        // e.g. <ul><li>123<li>
                        if (currentNode.tag == node.tag) {
                            currentNode = currentNode.parent;
                        }
                        // 向上补齐父标签
                        while (NEED_PARENT_TAG[node.tag]) {
                            if (NEED_PARENT_TAG[node.tag][currentNode.tag])
                                break;
                            node = node.parent = {
                                type: 'element',
                                tag: NEED_PARENT_TAG[node.tag]['$'],
                                attributes: {},
                                children: [node]
                            };
                        }
                    }
                    if (forceDtd) {
                        // 如果遇到这个标签不能放在前一个标签内部，则结束前一个标签,span单独处理
                        while (dtd[node.tag] && !(currentNode.tag == 'span' ? utils.extend(dtd['strong'], {'a': 1,'A': 1}) : (dtd[currentNode.tag] || dtd['div']))[node.tag]) {
                            if (tagEnd(currentNode))
                                continue;
                            if (!currentNode.parent)
                                break;
                            currentNode = currentNode.parent;
                        }
                    }
                    node.parent = currentNode;
                    currentNode.children.push(node);
                    if (open) {
                        currentNode = element;
                    }
                    if (element.attributes.style) {
                        element.attributes.style = element.attributes.style.toLowerCase();
                    }
                    return element;
                }

                // 结束一个标签的时候，需要判断一下它是否缺少子标签
                // e.g. <table></table>
                function tagEnd(node) {
                    var needTag;
                    if (!node.children.length && (needTag = NEED_CHILD_TAG[node.tag])) {
                        addElement({
                            type: 'element',
                            tag: needTag,
                            attributes: {},
                            children: []
                        }, true);
                        return true;
                    }
                    return false;
                }

                parse(html, {
                    onText: function(text) {

                        while (!(dtd[currentNode.tag] || dtd['div'])['#']) {
                            //节点之间的空白不能当作节点处理
                            //                                if(/^[ \t\r\n]+$/.test( text )){
                            //                                    return;
                            //                                }
                            if (tagEnd(currentNode))
                                continue;
                            currentNode = currentNode.parent;
                        }
                        //if(/^[ \t\n\r]*/.test(text))
                        addChild({
                            type: 'text',
                            data: text
                        });

                    },
                    onComment: function(text) {
                        addChild({
                            type: 'comment',
                            data: text
                        });
                    },
                    onCDATA: function(text) {
                        while (!(dtd[currentNode.tag] || dtd['div'])['#']) {
                            if (tagEnd(currentNode))
                                continue;
                            currentNode = currentNode.parent;
                        }
                        addChild({
                            type: 'cdata',
                            data: text
                        });
                    },
                    onTagOpen: function(tag, attrs, closed) {
                        closed = closed || EMPTY_TAG[tag];
                        addElement({
                            type: 'element',
                            tag: tag,
                            attributes: attrs,
                            closed: closed,
                            children: []
                        }, !closed);
                    },
                    onTagClose: function(tag) {
                        var node = currentNode;
                        // 向上找匹配的标签, 这里不考虑dtd的情况是因为tagOpen的时候已经处理过了, 这里不会遇到
                        while (node && tag != node.tag) {
                            node = node.parent;
                        }
                        if (node) {
                            // 关闭中间的标签
                            for (var tnode = currentNode; tnode !== node.parent; tnode = tnode.parent) {
                                tagEnd(tnode);
                            }
                            //去掉空白的inline节点
                            //分页，锚点保留
                            //|| dtd.$removeEmptyBlock[node.tag])
                            //                                if ( !node.children.length && dtd.$removeEmpty[node.tag] && !node.attributes.anchorname && node.attributes['class'] != 'pagebreak' && node.tag != 'a') {
                            //
                            //                                    node.parent.children.pop();
                            //                                }
                            currentNode = node.parent;
                        } else {
                            // 如果没有找到开始标签, 则创建新标签
                            // eg. </div> => <div></div>
                            //针对视屏网站embed会给结束符，这里特殊处理一下
                            if (!(dtd.$removeEmpty[tag] || dtd.$removeEmptyBlock[tag] || tag == 'embed')) {
                                node = {
                                    type: 'element',
                                    tag: tag,
                                    attributes: {},
                                    children: []
                                };
                                addElement(node, true);
                                tagEnd(node);
                                currentNode = node.parent;
                            }


                        }
                    }
                });
                // 处理这种情况, 只有开始标签没有结束标签的情况, 需要关闭开始标签
                // eg. <table>
                while (currentNode !== fragment) {
                    tagEnd(currentNode);
                    currentNode = currentNode.parent;
                }
                return fragment;
            };
        }();
        var unhtml1 = function() {
            var map = {'<': '&lt;','>': '&gt;','"': '&quot;',"'": '&#39;'};

            function rep(m) {
                return map[m];
            }

            return function(str) {
                str = str + '';
                return str ? str.replace(/[<>"']/g, rep) : '';
            };
        }();
        var toHTML = function() {
            function printChildren(node, pasteplain) {
                var children = node.children;

                var buff = [];
                for (var i = 0, ci; ci = children[i]; i++) {

                    buff.push(toHTML(ci, pasteplain));
                }
                return buff.join('');
            }

            function printAttrs(attrs) {
                var buff = [];
                for (var k in attrs) {
                    var value = attrs[k];

                    if (k == 'style') {

                        //pt==>px
                        value = ptToPx(value);
                        //color rgb ==> hex
                        if (/rgba?\s*\([^)]*\)/.test(value)) {
                            value = value.replace(/rgba?\s*\(([^)]*)\)/g, function(str) {
                                return utils.fixColor('color', str);
                            })
                        }
                        //过滤掉所有的white-space,在纯文本编辑器里粘贴过来的内容，到chrome中会带有span和white-space属性，导致出现不能折行的情况
                        //所以在这里去掉这个属性
                        attrs[k] = utils.optCss(value.replace(/windowtext/g, '#000'))
                        .replace(/white-space[^;]+;/g, '');

                    }

                    buff.push(k + '="' + unhtml1(attrs[k]) + '"');
                }
                return buff.join(' ')
            }

            function printData(node, notTrans) {
                //trace:1399 输入html代码时空格转换成为&nbsp;
                //node.data.replace(/&nbsp;/g,' ') 针对pre中的空格和出现的&nbsp;把他们在得到的html代码中都转换成为空格，为了在源码模式下显示为空格而不是&nbsp;
                return notTrans ? node.data.replace(/&nbsp;/g, ' ') : unhtml1(node.data).replace(/ /g, '&nbsp;');
            }

            //纯文本模式下标签转换
            var transHtml = {
                'div': 'p',
                'li': 'p',
                'tr': 'p',
                'br': 'br',
                'p': 'p' //trace:1398 碰到p标签自己要加上p,否则transHtml[tag]是undefined

            };

            function printElement(node, pasteplain) {
                if (node.type == 'element' && !node.children.length && (dtd.$removeEmpty[node.tag]) && node.tag != 'a' && utils.isEmptyObject(node.attributes) && autoClearEmptyNode) { // 锚点保留
                    return html;
                }
                var tag = node.tag;
                if (pasteplain && tag == 'td') {
                    if (!html)
                        html = '';
                    html += printChildren(node, pasteplain) + '&nbsp;&nbsp;&nbsp;';
                } else {
                    var attrs = printAttrs(node.attributes);
                    var html = '<' + (pasteplain && transHtml[tag] ? transHtml[tag] : tag) + (attrs ? ' ' + attrs : '') + (EMPTY_TAG[tag] ? ' />' : '>');
                    if (!EMPTY_TAG[tag]) {
                        //trace:1627 ,2070
                        //p标签为空，将不占位这里占位符不起作用，用&nbsp;或者br
                        if (tag == 'p' && !node.children.length) {
                            html += browser.ie ? '&nbsp;' : '<br/>';
                        }
                        html += printChildren(node, pasteplain);
                        html += '</' + (pasteplain && transHtml[tag] ? transHtml[tag] : tag) + '>';
                    }
                }

                return html;
            }

            return function(node, pasteplain) {
                if (node.type == 'fragment') {
                    return printChildren(node, pasteplain);
                } else if (node.type == 'element') {
                    return printElement(node, pasteplain);
                } else if (node.type == 'text' || node.type == 'cdata') {
                    return printData(node, dtd.$notTransContent[node.parent.tag]);
                } else if (node.type == 'comment') {
                    return '<!--' + node.data + '-->';
                }
                return '';
            };
        }();

        var NODE_NAME_MAP = {
            'text': '#text',
            'comment': '#comment',
            'cdata': '#cdata-section',
            'fragment': '#document-fragment'
        };


        //写入编辑器时，调用，进行转换操作
        function transNode(node, word_img_flag) {

            var sizeMap = [0, 10, 12, 16, 18, 24, 32, 48],
            attr,
            indexOf = utils.indexOf;
            switch (node.tag) {
                case 'script':
                    node.tag = 'div';
                    node.attributes._ue_org_tagName = 'script';
                    node.attributes._ue_div_script = 1;
                    node.attributes._ue_script_data = node.children[0] ? encodeURIComponent(node.children[0].data) : '';
                    node.attributes._ue_custom_node_ = 1;
                    node.children = [];
                    break;
                case 'style':
                    node.tag = 'div';
                    node.attributes._ue_div_style = 1;
                    node.attributes._ue_org_tagName = 'style';
                    node.attributes._ue_style_data = node.children[0] ? encodeURIComponent(node.children[0].data) : '';
                    node.attributes._ue_custom_node_ = 1;
                    node.children = [];
                    break;
                case 'img':
                    //todo base64暂时去掉，后边做远程图片上传后，干掉这个
                    if (node.attributes.src && /^data:/.test(node.attributes.src)) {
                        return {
                            type: 'fragment',
                            children: []
                        }
                    }
                    if (node.attributes.src && /^(?:file)/.test(node.attributes.src)) {
                        if (!/(gif|bmp|png|jpg|jpeg)$/.test(node.attributes.src)) {
                            return {
                                type: 'fragment',
                                children: []
                            }
                        }
                        node.attributes.word_img = node.attributes.src;
                        node.attributes.src = me.options.UEDITOR_HOME_URL + 'themes/default/images/spacer.gif';
                        var flag = parseInt(node.attributes.width) < 128 || parseInt(node.attributes.height) < 43;
                        node.attributes.style = "background:url(" + (flag ? me.options.themePath + me.options.theme + "/images/word.gif" : me.options.langPath + me.options.lang + "/images/localimage.png") + ") no-repeat center center;border:1px solid #ddd";
                        //node.attributes.style = 'width:395px;height:173px;';
                        word_img_flag && (word_img_flag.flag = 1);
                    }
                    if (browser.ie && browser.version < 7)
                        node.attributes.orgSrc = node.attributes.src;
                    node.attributes.data_ue_src = node.attributes.data_ue_src || node.attributes.src;
                    break;
                case 'li':
                    var child = node.children[0];

                    if (!child || child.type != 'element' || child.tag != 'p' && dtd.p[child.tag]) {
                        var tmpPNode = {
                            type: 'element',
                            tag: 'p',
                            attributes: {},

                            parent: node
                        };
                        tmpPNode.children = child ? node.children : [
                            browser.ie ? {
                                type: 'text',
                                data: domUtils.fillChar,
                                parent: tmpPNode

                            } :
                            {
                                type: 'element',
                                tag: 'br',
                                attributes: {},
                                closed: true,
                                children: [],
                                parent: tmpPNode
                            }
                        ];
                        node.children = [tmpPNode];
                    }
                    break;
                case 'table':
                case 'td':
                    optStyle(node);
                    break;
                case 'a': //锚点，a==>img
                    if (node.attributes['anchorname']) {
                        node.tag = 'img';
                        node.attributes = {
                            'class': 'anchorclass',
                            'anchorname': node.attributes['name']
                        };
                        node.closed = 1;
                    }
                    node.attributes.href && (node.attributes.data_ue_src = node.attributes.href);
                    break;
                case 'b':
                    node.tag = node.name = 'strong';
                    break;
                case 'i':
                    node.tag = node.name = 'em';
                    break;
                case 'u':
                    node.tag = node.name = 'span';
                    node.attributes.style = (node.attributes.style || '') + ';text-decoration:underline;';
                    break;
                case 's':
                case 'del':
                    node.tag = node.name = 'span';
                    node.attributes.style = (node.attributes.style || '') + ';text-decoration:line-through;';
                    if (node.children.length == 1) {
                        child = node.children[0];
                        if (child.tag == node.tag) {
                            node.attributes.style += ";" + child.attributes.style;
                            node.children = child.children;

                        }
                    }
                    break;
                case 'span':

                    var style = node.attributes.style;
                    if (style) {
                        if (!node.attributes.style || browser.webkit && style == "white-space:nowrap;") {
                            delete node.attributes.style;
                        }
                    }

                    //针对ff3.6span的样式不能正确继承的修复

                    if (browser.gecko && browser.version <= 10902 && node.parent) {
                        var parent = node.parent;
                        if (parent.tag == 'span' && parent.attributes && parent.attributes.style) {
                            node.attributes.style = parent.attributes.style + ';' + node.attributes.style;
                        }
                    }
                    if (utils.isEmptyObject(node.attributes) && autoClearEmptyNode) {
                        node.type = 'fragment'
                    }
                    break;
                case 'font':
                    node.tag = node.name = 'span';
                    attr = node.attributes;
                    node.attributes = {
                        'style': (attr.size ? 'font-size:' + (sizeMap[attr.size] || 12) + 'px' : '')
                        + ';' + (attr.color ? 'color:' + attr.color : '')
                        + ';' + (attr.face ? 'font-family:' + attr.face : '')
                        + ';' + (attr.style || '')
                    };

                    while (node.parent.tag == node.tag && node.parent.children.length == 1) {
                        node.attributes.style && (node.parent.attributes.style ? (node.parent.attributes.style += ";" + node.attributes.style) : (node.parent.attributes.style = node.attributes.style));
                        node.parent.children = node.children;
                        node = node.parent;

                    }
                    break;
                case 'p':
                    if (node.attributes.align) {
                        node.attributes.style = (node.attributes.style || '') + ';text-align:' +
                        node.attributes.align + ';';
                        delete node.attributes.align;
                    }

            }
            return node;
        }

        function optStyle(node) {
            if (ie && node.attributes.style) {
                var style = node.attributes.style;
                node.attributes.style = style.replace(/;\s*/g, ';');
                node.attributes.style = node.attributes.style.replace(/^\s*|\s*$/, '')
            }
        }
        //getContent调用转换
        function transOutNode(node) {

            switch (node.tag) {
                case 'div':
                    if (node.attributes._ue_div_script) {
                        node.tag = 'script';
                        node.children = [{type: 'cdata',data: node.attributes._ue_script_data ? decodeURIComponent(node.attributes._ue_script_data) : '',parent: node}];
                        delete node.attributes._ue_div_script;
                        delete node.attributes._ue_script_data;
                        delete node.attributes._ue_custom_node_;
                        delete node.attributes._ue_org_tagName;

                    }
                    if (node.attributes._ue_div_style) {
                        node.tag = 'style';
                        node.children = [{type: 'cdata',data: node.attributes._ue_style_data ? decodeURIComponent(node.attributes._ue_style_data) : '',parent: node}];
                        delete node.attributes._ue_div_style;
                        delete node.attributes._ue_style_data;
                        delete node.attributes._ue_custom_node_;
                        delete node.attributes._ue_org_tagName;

                    }
                    break;
                case 'table':
                    !node.attributes.style && delete node.attributes.style;
                    if (ie && node.attributes.style) {

                        optStyle(node);
                    }
                    if (node.attributes['class'] == 'noBorderTable') {
                        delete node.attributes['class'];
                    }
                    break;
                case 'td':
                case 'th':
                    if (/display\s*:\s*none/i.test(node.attributes.style)) {
                        return {
                            type: 'fragment',
                            children: []
                        };
                    }
                    if (ie && !node.children.length) {
                        var txtNode = {
                            type: 'text',
                            data: domUtils.fillChar,
                            parent: node
                        };
                        node.children[0] = txtNode;
                    }
                    if (ie && node.attributes.style) {
                        optStyle(node);

                    }
                    if (node.attributes['class'] == 'selectTdClass') {
                        delete node.attributes['class']
                    }
                    break;
                case 'img': //锚点，img==>a
                    if (node.attributes.anchorname) {
                        node.tag = 'a';
                        node.attributes = {
                            name: node.attributes.anchorname,
                            anchorname: 1
                        };
                        node.closed = null;
                    } else {
                        if (node.attributes.data_ue_src) {
                            node.attributes.src = node.attributes.data_ue_src;
                            delete node.attributes.data_ue_src;
                        }
                    }
                    break;

                case 'a':
                    if (node.attributes.data_ue_src) {
                        node.attributes.href = node.attributes.data_ue_src;
                        delete node.attributes.data_ue_src;
                    }
            }

            return node;
        }

        function childrenAccept(node, visit, ctx) {

            if (!node.children || !node.children.length) {
                return node;
            }
            var children = node.children;
            for (var i = 0; i < children.length; i++) {
                var newNode = visit(children[i], ctx);
                if (newNode.type == 'fragment') {
                    var args = [i, 1];
                    args.push.apply(args, newNode.children);
                    children.splice.apply(children, args);
                    //节点为空的就干掉，不然后边的补全操作会添加多余的节点
                    if (!children.length) {
                        node = {
                            type: 'fragment',
                            children: []
                        }
                    }
                    i--;
                } else {
                    children[i] = newNode;
                }
            }
            return node;
        }

        function Serialize(rules) {
            this.rules = rules;
        }


        Serialize.prototype = {
            // NOTE: selector目前只支持tagName
            rules: null,
            // NOTE: node必须是fragment
            filter: function(node, rules, modify) {
                rules = rules || this.rules;
                var whiteList = rules && rules.whiteList;
                var blackList = rules && rules.blackList;

                function visitNode(node, parent) {
                    node.name = node.type == 'element' ?
                    node.tag : NODE_NAME_MAP[node.type];
                    if (parent == null) {
                        return childrenAccept(node, visitNode, node);
                    }

                    if (blackList && (blackList[node.name] || (node.attributes && node.attributes._ue_org_tagName && blackList[node.attributes._ue_org_tagName]))) {
                        modify && (modify.flag = 1);
                        return {
                            type: 'fragment',
                            children: []
                        };
                    }
                    if (whiteList) {
                        if (node.type == 'element') {
                            if (parent.type == 'fragment' ? whiteList[node.name] : whiteList[node.name] && whiteList[parent.name][node.name]) {

                                var props;
                                if ((props = whiteList[node.name].$)) {
                                    var oldAttrs = node.attributes;
                                    var newAttrs = {};
                                    for (var k in props) {
                                        if (oldAttrs[k]) {
                                            newAttrs[k] = oldAttrs[k];
                                        }
                                    }
                                    node.attributes = newAttrs;
                                }


                            } else {
                                modify && (modify.flag = 1);
                                node.type = 'fragment';
                                // NOTE: 这里算是一个hack
                                node.name = parent.name;
                            }
                        } else {
                        // NOTE: 文本默认允许
                        }
                    }
                    if (blackList || whiteList) {
                        childrenAccept(node, visitNode, node);
                    }
                    return node;
                }

                return visitNode(node, null);
            },
            transformInput: function(node, word_img_flag) {

                function visitNode(node) {
                    node = transNode(node, word_img_flag);

                    node = childrenAccept(node, visitNode, node);

                    if (me.options.pageBreakTag && node.type == 'text' && node.data.replace(/\s/g, '') == me.options.pageBreakTag) {

                        node.type = 'element';
                        node.name = node.tag = 'hr';

                        delete node.data;
                        node.attributes = {
                            'class': 'pagebreak',
                            noshade: "noshade",
                            size: "5",
                            'unselectable': 'on',
                            'style': 'moz-user-select:none;-khtml-user-select: none;'
                        };

                        node.children = [];

                    }
                    //去掉多余的空格和换行
                    if (node.type == 'text' && !dtd.$notTransContent[node.parent.tag]) {
                        node.data = node.data.replace(/[\r\t\n]*/g, '') //.replace(/[ ]*$/g,'')
                    }
                    return node;
                }

                return visitNode(node);
            },
            transformOutput: function(node) {
                function visitNode(node) {

                    if (node.tag == 'hr' && node.attributes['class'] == 'pagebreak') {
                        delete node.tag;
                        node.type = 'text';
                        node.data = me.options.pageBreakTag;
                        delete node.children;

                    }
                    node = transOutNode(node);
                    node = childrenAccept(node, visitNode, node);
                    return node;
                }

                return visitNode(node);
            },
            toHTML: toHTML,
            parseHTML: parseHTML,
            word: UE.filterWord
        };
        me.serialize = new Serialize(me.options.serialize || {});
        UE.serialize = new Serialize({});
    };

    var baidu = baidu || {};
    baidu.editor = baidu.editor || {};
    baidu.editor.ui = {};
    (function() {
        var browser = baidu.editor.browser,
        domUtils = baidu.editor.dom.domUtils;

        var magic = '$EDITORUI';
        var root = window[magic] = {};
        var uidMagic = 'ID' + magic;
        var uidCount = 0;

        var uiUtils = baidu.editor.ui.uiUtils = {
            uid: function(obj) {
                return (obj ? obj[uidMagic] || (obj[uidMagic] = ++uidCount) : ++uidCount);
            },
            hook: function(fn, callback) {
                var dg;
                if (fn && fn._callbacks) {
                    dg = fn;
                } else {
                    dg = function() {
                        var q;
                        if (fn) {
                            q = fn.apply(this, arguments);
                        }
                        var callbacks = dg._callbacks;
                        var k = callbacks.length;
                        while (k--) {
                            var r = callbacks[k].apply(this, arguments);
                            if (q === undefined) {
                                q = r;
                            }
                        }
                        return q;
                    };
                    dg._callbacks = [];
                }
                dg._callbacks.push(callback);
                return dg;
            },
            createElementByHtml: function(html) {
                var el = document.createElement('div');
                el.innerHTML = html;
                el = el.firstChild;
                el.parentNode.removeChild(el);
                return el;
            },
            getViewportElement: function() {
                return (browser.ie && browser.quirks) ?
                document.body : document.documentElement;
            },
            getClientRect: function(element) {
                var bcr;
                //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
                try {
                    bcr = element.getBoundingClientRect();
                } catch (e) {
                    bcr = {left: 0,top: 0,height: 0,width: 0}
                }
                var rect = {
                    left: Math.round(bcr.left),
                    top: Math.round(bcr.top),
                    height: Math.round(bcr.bottom - bcr.top),
                    width: Math.round(bcr.right - bcr.left)
                };
                var doc;
                while ((doc = element.ownerDocument) !== document &&
                (element = domUtils.getWindow(doc).frameElement)) {
                    bcr = element.getBoundingClientRect();
                    rect.left += bcr.left;
                    rect.top += bcr.top;
                }
                rect.bottom = rect.top + rect.height;
                rect.right = rect.left + rect.width;
                return rect;
            },
            getViewportRect: function() {
                var viewportEl = uiUtils.getViewportElement();
                var width = (window.innerWidth || viewportEl.clientWidth) | 0;
                var height = (window.innerHeight || viewportEl.clientHeight) | 0;
                return {
                    left: 0,
                    top: 0,
                    height: height,
                    width: width,
                    bottom: height,
                    right: width
                };
            },
            setViewportOffset: function(element, offset) {
                var rect;
                var fixedLayer = uiUtils.getFixedLayer();
                if (element.parentNode === fixedLayer) {
                    element.style.left = offset.left + 'px';
                    element.style.top = offset.top + 'px';
                } else {
                    domUtils.setViewportOffset(element, offset);
                }
            },
            getEventOffset: function(evt) {
                var el = evt.target || evt.srcElement;
                var rect = uiUtils.getClientRect(el);
                var offset = uiUtils.getViewportOffsetByEvent(evt);
                return {
                    left: offset.left - rect.left,
                    top: offset.top - rect.top
                };
            },
            getViewportOffsetByEvent: function(evt) {
                var el = evt.target || evt.srcElement;
                var frameEl = domUtils.getWindow(el).frameElement;
                var offset = {
                    left: evt.clientX,
                    top: evt.clientY
                };
                if (frameEl && el.ownerDocument !== document) {
                    var rect = uiUtils.getClientRect(frameEl);
                    offset.left += rect.left;
                    offset.top += rect.top;
                }
                return offset;
            },
            setGlobal: function(id, obj) {
                root[id] = obj;
                return magic + '["' + id + '"]';
            },
            unsetGlobal: function(id) {
                delete root[id];
            },
            copyAttributes: function(tgt, src) {
                var attributes = src.attributes;
                var k = attributes.length;
                while (k--) {
                    var attrNode = attributes[k];
                    if (attrNode.nodeName != 'style' && attrNode.nodeName != 'class' && (!browser.ie || attrNode.specified)) {
                        tgt.setAttribute(attrNode.nodeName, attrNode.nodeValue);
                    }
                }
                if (src.className) {
                    domUtils.addClass(tgt, src.className);
                }
                if (src.style.cssText) {
                    tgt.style.cssText += ';' + src.style.cssText;
                }
            },
            removeStyle: function(el, styleName) {
                if (el.style.removeProperty) {
                    el.style.removeProperty(styleName);
                } else if (el.style.removeAttribute) {
                    el.style.removeAttribute(styleName);
                } else
                    throw '';
            },
            contains: function(elA, elB) {
                return elA && elB && (elA === elB ? false : (
                elA.contains ? elA.contains(elB) :
                elA.compareDocumentPosition(elB) & 16
                ));
            },
            startDrag: function(evt, callbacks, doc) {
                var doc = doc || document;
                var startX = evt.clientX;
                var startY = evt.clientY;
                function handleMouseMove(evt) {
                    var x = evt.clientX - startX;
                    var y = evt.clientY - startY;
                    callbacks.ondragmove(x, y);
                    if (evt.stopPropagation) {
                        evt.stopPropagation();
                    } else {
                        evt.cancelBubble = true;
                    }
                }
                if (doc.addEventListener) {
                    function handleMouseUp(evt) {
                        doc.removeEventListener('mousemove', handleMouseMove, true);
                        doc.removeEventListener('mouseup', handleMouseMove, true);
                        window.removeEventListener('mouseup', handleMouseUp, true);
                        callbacks.ondragstop();
                    }
                    doc.addEventListener('mousemove', handleMouseMove, true);
                    doc.addEventListener('mouseup', handleMouseUp, true);
                    window.addEventListener('mouseup', handleMouseUp, true);

                    evt.preventDefault();
                } else {
                    var elm = evt.srcElement;
                    elm.setCapture();
                    function releaseCaptrue() {
                        elm.releaseCapture();
                        elm.detachEvent('onmousemove', handleMouseMove);
                        elm.detachEvent('onmouseup', releaseCaptrue);
                        elm.detachEvent('onlosecaptrue', releaseCaptrue);
                        callbacks.ondragstop();
                    }
                    elm.attachEvent('onmousemove', handleMouseMove);
                    elm.attachEvent('onmouseup', releaseCaptrue);
                    elm.attachEvent('onlosecaptrue', releaseCaptrue);
                    evt.returnValue = false;
                }
                callbacks.ondragstart();
            },
            getFixedLayer: function() {
                var layer = document.getElementById('edui_fixedlayer');
                if (layer == null) {
                    layer = document.createElement('div');
                    layer.id = 'edui_fixedlayer';
                    document.body.appendChild(layer);
                    if (browser.ie && browser.version <= 8) {
                        layer.style.position = 'absolute';
                        bindFixedLayer();
                        setTimeout(updateFixedOffset);
                    } else {
                        layer.style.position = 'fixed';
                    }
                    layer.style.left = '0';
                    layer.style.top = '0';
                    layer.style.width = '0';
                    layer.style.height = '0';
                }
                return layer;
            },
            makeUnselectable: function(element) {
                if (browser.opera || (browser.ie && browser.version < 9)) {
                    element.unselectable = 'on';
                    if (element.hasChildNodes()) {
                        for (var i = 0; i < element.childNodes.length; i++) {
                            if (element.childNodes[i].nodeType == 1) {
                                uiUtils.makeUnselectable(element.childNodes[i]);
                            }
                        }
                    }
                } else {
                    if (element.style.MozUserSelect !== undefined) {
                        element.style.MozUserSelect = 'none';
                    } else if (element.style.WebkitUserSelect !== undefined) {
                        element.style.WebkitUserSelect = 'none';
                    } else if (element.style.KhtmlUserSelect !== undefined) {
                        element.style.KhtmlUserSelect = 'none';
                    }
                }
            }
        };
        function updateFixedOffset() {
            var layer = document.getElementById('edui_fixedlayer');
            uiUtils.setViewportOffset(layer, {
                left: 0,
                top: 0
            });
        //        layer.style.display = 'none';
        //        layer.style.display = 'block';

        //#trace: 1354
        //        setTimeout(updateFixedOffset);
        }
        function bindFixedLayer(adjOffset) {
            domUtils.on(window, 'scroll', updateFixedOffset);
            domUtils.on(window, 'resize', baidu.editor.utils.defer(updateFixedOffset, 0, true));
        }
    })();

    (function() {
        var utils = baidu.editor.utils,
        uiUtils = baidu.editor.ui.uiUtils,
        EventBase = baidu.editor.EventBase,
        UIBase = baidu.editor.ui.UIBase = function() {
        };

        UIBase.prototype = {
            className: '',
            uiName: '',
            initOptions: function(options) {
                var me = this;
                for (var k in options) {
                    me[k] = options[k];
                }
                this.id = this.id || 'edui' + uiUtils.uid();
            },
            initUIBase: function() {
                this._globalKey = utils.unhtml(uiUtils.setGlobal(this.id, this));
            },
            render: function(holder) {
                var html = this.renderHtml();
                var el = uiUtils.createElementByHtml(html);

                //by xuheng 给每个node添加class
                var list = domUtils.getElementsByTagName(el, "*");
                var theme = "edui-" + (this.theme || this.editor.options.theme);
                var layer = document.getElementById('edui_fixedlayer');
                for (var i = 0, node; node = list[i++]; ) {
                    domUtils.addClass(node, theme);
                }
                domUtils.addClass(el, theme);
                if (layer) {
                    layer.className = "";
                    domUtils.addClass(layer, theme);
                }

                var seatEl = this.getDom();
                if (seatEl != null) {
                    seatEl.parentNode.replaceChild(el, seatEl);
                    uiUtils.copyAttributes(el, seatEl);
                } else {
                    if (typeof holder == 'string') {
                        holder = document.getElementById(holder);
                    }
                    holder = holder || uiUtils.getFixedLayer();
                    domUtils.addClass(holder, theme);
                    holder.appendChild(el);
                }
                this.postRender();
            },
            getDom: function(name) {
                if (!name) {
                    return document.getElementById(this.id);
                } else {
                    return document.getElementById(this.id + '_' + name);
                }
            },
            postRender: function() {
                this.fireEvent('postrender');
            },
            getHtmlTpl: function() {
                return '';
            },
            formatHtml: function(tpl) {
                var prefix = 'edui-' + this.uiName;
                return (tpl
                .replace(/##/g, this.id)
                .replace(/%%-/g, this.uiName ? prefix + '-' : '')
                .replace(/%%/g, (this.uiName ? prefix : '') + ' ' + this.className)
                .replace(/\$\$/g, this._globalKey));
            },
            renderHtml: function() {
                return this.formatHtml(this.getHtmlTpl());
            },
            dispose: function() {
                var box = this.getDom();
                if (box)
                    baidu.editor.dom.domUtils.remove(box);
                uiUtils.unsetGlobal(this.id);
            }
        };
        utils.inherits(UIBase, EventBase);
    })();

    (function() {
        var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase,
        Separator = baidu.editor.ui.Separator = function(options) {
            this.initOptions(options);
            this.initSeparator();
        };
        Separator.prototype = {
            uiName: 'separator',
            initSeparator: function() {
                this.initUIBase();
            },
            getHtmlTpl: function() {
                return '<div id="##" class="edui-box %%"></div>';
            }
        };
        utils.inherits(Separator, UIBase);

    })();

    (function() {
        var browser = baidu.editor.browser,
        domUtils = baidu.editor.dom.domUtils,
        uiUtils = baidu.editor.ui.uiUtils;

        var TPL_STATEFUL = 'onmousedown="$$.Stateful_onMouseDown(event, this);"' +
        ' onmouseup="$$.Stateful_onMouseUp(event, this);"' +
        (browser.ie ? (
        ' onmouseenter="$$.Stateful_onMouseEnter(event, this);"' +
        ' onmouseleave="$$.Stateful_onMouseLeave(event, this);"')
        : (
        ' onmouseover="$$.Stateful_onMouseOver(event, this);"' +
        ' onmouseout="$$.Stateful_onMouseOut(event, this);"'));

        baidu.editor.ui.Stateful = {
            alwalysHoverable: false,
            Stateful_init: function() {
                this._Stateful_dGetHtmlTpl = this.getHtmlTpl;
                this.getHtmlTpl = this.Stateful_getHtmlTpl;
            },
            Stateful_getHtmlTpl: function() {
                var tpl = this._Stateful_dGetHtmlTpl();
                // 使用function避免$转义
                return tpl.replace(/stateful/g, function() {
                    return TPL_STATEFUL;
                });
            },
            Stateful_onMouseEnter: function(evt, el) {
                if (!this.isDisabled() || this.alwalysHoverable) {
                    this.addState('hover');
                    this.fireEvent('over');
                }
            },
            Stateful_onMouseLeave: function(evt, el) {
                if (!this.isDisabled() || this.alwalysHoverable) {
                    this.removeState('hover');
                    this.removeState('active');
                    this.fireEvent('out');
                }
            },
            Stateful_onMouseOver: function(evt, el) {
                var rel = evt.relatedTarget;
                if (!uiUtils.contains(el, rel) && el !== rel) {
                    this.Stateful_onMouseEnter(evt, el);
                }
            },
            Stateful_onMouseOut: function(evt, el) {
                var rel = evt.relatedTarget;
                if (!uiUtils.contains(el, rel) && el !== rel) {
                    this.Stateful_onMouseLeave(evt, el);
                }
            },
            Stateful_onMouseDown: function(evt, el) {
                if (!this.isDisabled()) {
                    this.addState('active');
                }
            },
            Stateful_onMouseUp: function(evt, el) {
                if (!this.isDisabled()) {
                    this.removeState('active');
                }
            },
            Stateful_postRender: function() {
                if (this.disabled && !this.hasState('disabled')) {
                    this.addState('disabled');
                }
            },
            hasState: function(state) {
                return domUtils.hasClass(this.getStateDom(), 'edui-state-' + state);
            },
            addState: function(state) {
                if (!this.hasState(state)) {
                    this.getStateDom().className += ' edui-state-' + state;
                }
            },
            removeState: function(state) {
                if (this.hasState(state)) {
                    domUtils.removeClasses(this.getStateDom(), ['edui-state-' + state]);
                }
            },
            getStateDom: function() {
                return this.getDom('state');
            },
            isChecked: function() {
                return this.hasState('checked');
            },
            setChecked: function(checked) {
                if (!this.isDisabled() && checked) {
                    this.addState('checked');
                } else {
                    this.removeState('checked');
                }
            },
            isDisabled: function() {
                return this.hasState('disabled');
            },
            setDisabled: function(disabled) {
                if (disabled) {
                    this.removeState('hover');
                    this.removeState('checked');
                    this.removeState('active');
                    this.addState('disabled');
                } else {
                    this.removeState('disabled');
                }
            }
        };
    })();

    ///import core
    ///import uicore
    ///import ui/stateful.js
    (function() {
        var utils = baidu.editor.utils,
        UIBase = baidu.editor.ui.UIBase,
        Stateful = baidu.editor.ui.Stateful,
        Button = baidu.editor.ui.Button = function(options) {
            this.initOptions(options);
            this.initButton();
        };
        Button.prototype = {
            uiName: 'button',
            label: '',
            title: '',
            showIcon: true,
            showText: true,
            initButton: function() {
                this.initUIBase();
                this.Stateful_init();
            },
            getHtmlTpl: function() {
                return '<div id="##" class="edui-box %%">' +
                '<div id="##_state" stateful>' +
                '<div class="%%-wrap"><div id="##_body" unselectable="on" ' + (this.title ? 'title="' + this.title + '"' : '') +
                ' class="%%-body" onmousedown="return false;" onclick="return $$._onClick();">' +
                (this.showIcon ? '<div class="edui-box edui-icon"></div>' : '') +
                (this.showText ? '<div class="edui-box edui-label">' + this.label + '</div>' : '') +
                '</div>' +
                '</div>' +
                '</div></div>';
            },
            postRender: function() {
                this.Stateful_postRender();
                this.setDisabled(this.disabled)
            },
            _onClick: function() {
                if (!this.isDisabled()) {
                    this.fireEvent('click');
                }
            }
        };
        utils.inherits(Button, UIBase);
        utils.extend(Button.prototype, Stateful);

    })();

    (function() {
        var utils = baidu.editor.utils,
        uiUtils = baidu.editor.ui.uiUtils,
        UIBase = baidu.editor.ui.UIBase,
        Toolbar = baidu.editor.ui.Toolbar = function(options) {
            this.initOptions(options);
            this.initToolbar();
        };
        Toolbar.prototype = {
            items: null,
            initToolbar: function() {
                this.items = this.items || [];
                this.initUIBase();
            },
            add: function(item) {
                this.items.push(item);
            },
            getHtmlTpl: function() {
                var buff = [];
                for (var i = 0; i < this.items.length; i++) {
                    buff[i] = this.items[i].renderHtml();
                }
                return '<div id="##" class="edui-toolbar %%" onselectstart="return false;" onmousedown="return $$._onMouseDown(event, this);">' +
                buff.join('') +
                '</div>'
            },
            postRender: function() {
                var box = this.getDom();
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].postRender();
                }
                uiUtils.makeUnselectable(box);
            },
            _onMouseDown: function() {
                return false;
            }
        };
        utils.inherits(Toolbar, UIBase);

    })();

    //ui跟编辑器的适配層
    //那个按钮弹出是dialog，是下拉筐等都是在这个js中配置
    //自己写的ui也要在这里配置，放到baidu.editor.ui下边，当编辑器实例化的时候会根据editor_config中的toolbars找到相应的进行实例化
    (function() {
        var utils = baidu.editor.utils;
        var editorui = baidu.editor.ui;
        var _Dialog = editorui.Dialog;
        editorui.Dialog = function(options) {
            var dialog = new _Dialog(options);
            dialog.addListener('hide', function() {

                if (dialog.editor) {
                    var editor = dialog.editor;
                    try {
                        if (browser.gecko) {
                            var y = editor.window.scrollY,
                            x = editor.window.scrollX;
                            editor.body.focus();
                            editor.window.scrollTo(x, y);
                        } else {
                            editor.focus();
                        }


                    } catch (ex) {
                    }
                }
            });
            return dialog;
        };

        var iframeUrlMap = {
            'anchor': '~/dialogs/anchor/anchor.html',
            'insertimage': '~/dialogs/image/image.html',
            'inserttable': '~/dialogs/table/table.html',
            'link': '~/dialogs/link/link.html',
            'spechars': '~/dialogs/spechars/spechars.html',
            'searchreplace': '~/dialogs/searchreplace/searchreplace.html',
            'map': '~/dialogs/map/map.html',
            'gmap': '~/dialogs/gmap/gmap.html',
            'insertvideo': '~/dialogs/video/video.html',
            'help': '~/dialogs/help/help.html',
            'highlightcode': '~/dialogs/highlightcode/highlightcode.html',
            'emotion': '~/dialogs/emotion/emotion.html',
            'wordimage': '~/dialogs/wordimage/wordimage.html',
            'attachment': '~/dialogs/attachment/attachment.html',
            'insertframe': '~/dialogs/insertframe/insertframe.html',
            'edittd': '~/dialogs/table/edittd.html',
            'webapp': '~/dialogs/webapp/webapp.html',
            'snapscreen': '~/dialogs/snapscreen/snapscreen.html',
            'scrawl': '~/dialogs/scrawl/scrawl.html',
            'music': '~/dialogs/music/music.html',
            'template': '~/dialogs/template/template.html',
            'background': '~/dialogs/background/background.html'
        };
        //为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
        var btnCmds = ['undo', 'redo', 'formatmatch',
            'bold', 'italic', 'underline', 'touppercase', 'tolowercase',
            'strikethrough', 'subscript', 'superscript', 'source', 'indent', 'outdent',
            'blockquote', 'pasteplain', 'pagebreak',
            'selectall', 'print', 'preview', 'horizontal', 'removeformat', 'time', 'date', 'unlink',
            'insertparagraphbeforetable', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow',
            'deletecol', 'splittorows', 'splittocols', 'splittocells', 'mergecells', 'deletetable'];

        for (var i = 0, ci; ci = btnCmds[i++]; ) {
            ci = ci.toLowerCase();
            editorui[ci] = function(cmd) {
                return function(editor) {
                    var ui = new editorui.Button({
                        className: 'edui-for-' + cmd,
                        title: editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '',
                        onclick: function() {
                            editor.execCommand(cmd);
                        },
                        theme: editor.options.theme,
                        showText: false
                    });
                    editor.addListener('selectionchange', function(type, causeByUi, uiReady) {
                        var state = editor.queryCommandState(cmd);
                        if (state == -1) {
                            ui.setDisabled(true);
                            ui.setChecked(false);
                        } else {
                            if (!uiReady) {
                                ui.setDisabled(false);
                                ui.setChecked(state);
                            }
                        }
                    });
                    return ui;
                };
            }(ci);
        }

        //清除文档
        editorui.cleardoc = function(editor) {
            var ui = new editorui.Button({
                className: 'edui-for-cleardoc',
                title: editor.options.labelMap.cleardoc || editor.getLang("labelMap.cleardoc") || '',
                theme: editor.options.theme,
                onclick: function() {
                    if (confirm(editor.getLang("confirmClear"))) {
                        editor.execCommand('cleardoc');
                    }
                }
            });
            editor.addListener('selectionchange', function() {
                ui.setDisabled(editor.queryCommandState('cleardoc') == -1);
            });
            return ui;
        };

        //排版，图片排版，文字方向
        var typeset = {
            'justify': ['left', 'right', 'center', 'justify'],
            'imagefloat': ['none', 'left', 'center', 'right'],
            'directionality': ['ltr', 'rtl']
        };

        for (var p in typeset) {

            (function(cmd, val) {
                for (var i = 0, ci; ci = val[i++]; ) {
                    (function(cmd2) {
                        editorui[cmd.replace('float', '') + cmd2] = function(editor) {
                            var ui = new editorui.Button({
                                className: 'edui-for-' + cmd.replace('float', '') + cmd2,
                                title: editor.options.labelMap[cmd.replace('float', '') + cmd2] || editor.getLang("labelMap." + cmd.replace('float', '') + cmd2) || '',
                                theme: editor.options.theme,
                                onclick: function() {
                                    editor.execCommand(cmd, cmd2);
                                }
                            });
                            editor.addListener('selectionchange', function(type, causeByUi, uiReady) {
                                ui.setDisabled(editor.queryCommandState(cmd) == -1);
                                ui.setChecked(editor.queryCommandValue(cmd) == cmd2 && !uiReady);
                            });
                            return ui;
                        };
                    })(ci)
                }
            })(p, typeset[p])
        }





    })();
})();

///import core
///commands 全屏
///commandsName FullScreen
///commandsTitle  全屏
(function() {
    var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase,
    domUtils = baidu.editor.dom.domUtils;
    var nodeStack = [];

    function EditorUI(options) {
        this.initOptions(options);
        this.initEditorUI();
    }

    EditorUI.prototype = {
        uiName: 'editor',
        initEditorUI: function() {
            this.editor.ui = this;
            this._dialogs = {};
            this.initUIBase();
            this._initToolbars();
            var editor = this.editor,
            me = this;

            editor.addListener('ready', function() {
                //提供getDialog方法
                editor.getDialog = function(name) {
                    return editor.ui._dialogs[name + "Dialog"];
                };

                //display bottom-bar label based on config
                if (editor.options.elementPathEnabled) {
                    editor.ui.getDom('elementpath').innerHTML = '<div class="edui-editor-breadcrumb">' + editor.getLang("elementPathTip") + ':</div>';
                }
                if (editor.options.wordCount) {
                    editor.ui.getDom('wordcount').innerHTML = editor.getLang("wordCountTip");
                    //为wordcount捕获中文输入法的空格
                    editor.addListener('keyup', function(type, evt) {
                        var keyCode = evt.keyCode || evt.which;
                        if (keyCode == 32) {
                            me._wordCount();
                        }
                    });
                }
                editor.ui._scale();
                if (editor.options.scaleEnabled) {
                    if (editor.autoHeightEnabled) {
                        editor.disableAutoHeight();
                    }
                    me.enableScale();
                } else {
                    me.disableScale();
                }
                if (!editor.options.elementPathEnabled && !editor.options.wordCount && !editor.options.scaleEnabled) {
                    editor.ui.getDom('elementpath').style.display = "none";
                    editor.ui.getDom('wordcount').style.display = "none";
                    editor.ui.getDom('scale').style.display = "none";
                }

                if (!editor.selection.isFocus())
                    return;
                editor.fireEvent('selectionchange', false, true);


            });
            editor.addListener('selectionchange', function() {
                //if(!editor.selection.isFocus())return;
                if (editor.options.elementPathEnabled) {
                    me[(editor.queryCommandState('elementpath') == -1 ? 'dis' : 'en') + 'ableElementPath']()
                }
                if (editor.options.wordCount) {
                    me[(editor.queryCommandState('wordcount') == -1 ? 'dis' : 'en') + 'ableWordCount']()
                }
                if (editor.options.scaleEnabled) {
                    me[(editor.queryCommandState('scale') == -1 ? 'dis' : 'en') + 'ableScale']();

                }
            });

        },
        _initToolbars: function() {
            var editor = this.editor;
            var toolbars = this.toolbars || [];
            var toolbarUis = [];
            for (var i = 0; i < toolbars.length; i++) {
                var toolbar = toolbars[i];
                var toolbarUi = new baidu.editor.ui.Toolbar({theme: editor.options.theme});
                for (var j = 0; j < toolbar.length; j++) {
                    var toolbarItem = toolbar[j];
                    var toolbarItemUi = null;
                    if (typeof toolbarItem == 'string') {
                        toolbarItem = toolbarItem.toLowerCase();
                        if (toolbarItem == '|') {
                            toolbarItem = 'Separator';
                        }

                        if (baidu.editor.ui[toolbarItem]) {
                            toolbarItemUi = new baidu.editor.ui[toolbarItem](editor);
                        }

                        //fullscreen这里单独处理一下，放到首行去
                        if (toolbarItem == 'fullscreen') {
                            if (toolbarUis && toolbarUis[0]) {
                                toolbarUis[0].items.splice(0, 0, toolbarItemUi);
                            } else {
                                toolbarItemUi && toolbarUi.items.splice(0, 0, toolbarItemUi);
                            }

                            continue;


                        }
                    } else {
                        toolbarItemUi = toolbarItem;
                    }
                    if (toolbarItemUi && toolbarItemUi.id) {

                        toolbarUi.add(toolbarItemUi);
                    }
                }
                toolbarUis[i] = toolbarUi;
            }
            this.toolbars = toolbarUis;
        },
        getHtmlTpl: function() {
            return '<div id="##" class="%%">' +
            '<div id="##_toolbarbox" class="%%-toolbarbox">' +
            (this.toolbars.length ?
            '<div id="##_toolbarboxouter" class="%%-toolbarboxouter"><div class="%%-toolbarboxinner">' +
            this.renderToolbarBoxHtml() +
            '</div></div>' : '') +
            '<div id="##_toolbarmsg" class="%%-toolbarmsg" style="display:none;">' +
            '<div id = "##_upload_dialog" class="%%-toolbarmsg-upload" onclick="$$.showWordImageDialog();">' + this.editor.getLang("clickToUpload") + '</div>' +
            '<div class="%%-toolbarmsg-close" onclick="$$.hideToolbarMsg();">x</div>' +
            '<div id="##_toolbarmsg_label" class="%%-toolbarmsg-label"></div>' +
            '<div style="height:0;overflow:hidden;clear:both;"></div>' +
            '</div>' +
            '</div>' +
            '<div id="##_iframeholder" class="%%-iframeholder"></div>' +
            //modify wdcount by matao
            '<div id="##_bottombar" class="%%-bottomContainer"><table><tr>' +
            '<td id="##_elementpath" class="%%-bottombar"></td>' +
            '<td id="##_wordcount" class="%%-wordcount"></td>' +
            '<td id="##_scale" class="%%-scale"><div class="%%-icon"></div></td>' +
            '</tr></table></div>' +
            '<div id="##_scalelayer"></div>' +
            '</div>';
        },
        showWordImageDialog: function() {
            this.editor.execCommand("wordimage", "word_img");
            this._dialogs['wordimageDialog'].open();
        },
        renderToolbarBoxHtml: function() {
            var buff = [];
            for (var i = 0; i < this.toolbars.length; i++) {
                buff.push(this.toolbars[i].renderHtml());
            }
            return buff.join('');
        },
        setFullScreen: function(fullscreen) {

            var editor = this.editor,
            container = editor.container.parentNode.parentNode;
            if (this._fullscreen != fullscreen) {
                this._fullscreen = fullscreen;
                this.editor.fireEvent('beforefullscreenchange', fullscreen);
                if (baidu.editor.browser.gecko) {
                    var bk = editor.selection.getRange().createBookmark();
                }
                if (fullscreen) {
                    while (container.tagName != "BODY") {
                        var position = baidu.editor.dom.domUtils.getComputedStyle(container, "position");
                        nodeStack.push(position);
                        container.style.position = "static";
                        container = container.parentNode;
                    }
                    this._bakHtmlOverflow = document.documentElement.style.overflow;
                    this._bakBodyOverflow = document.body.style.overflow;
                    this._bakAutoHeight = this.editor.autoHeightEnabled;
                    this._bakScrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                    if (this._bakAutoHeight) {
                        //当全屏时不能执行自动长高
                        editor.autoHeightEnabled = false;
                        this.editor.disableAutoHeight();
                    }
                    document.documentElement.style.overflow = 'hidden';
                    document.body.style.overflow = 'hidden';
                    this._bakCssText = this.getDom().style.cssText;
                    this._bakCssText1 = this.getDom('iframeholder').style.cssText;
                    this._updateFullScreen();
                } else {
                    while (container.tagName != "BODY") {
                        container.style.position = nodeStack.shift();
                        container = container.parentNode;
                    }
                    this.getDom().style.cssText = this._bakCssText;
                    this.getDom('iframeholder').style.cssText = this._bakCssText1;
                    if (this._bakAutoHeight) {
                        editor.autoHeightEnabled = true;
                        this.editor.enableAutoHeight();
                    }

                    document.documentElement.style.overflow = this._bakHtmlOverflow;
                    document.body.style.overflow = this._bakBodyOverflow;
                    window.scrollTo(0, this._bakScrollTop);
                }
                if (baidu.editor.browser.gecko) {
                    var input = document.createElement('input');
                    document.body.appendChild(input);
                    editor.body.contentEditable = false;
                    setTimeout(function() {
                        input.focus();
                        setTimeout(function() {
                            editor.body.contentEditable = true;
                            editor.selection.getRange().moveToBookmark(bk).select(true);
                            baidu.editor.dom.domUtils.remove(input);
                            fullscreen && window.scroll(0, 0);
                        }, 0)
                    }, 0)
                }
                this.editor.fireEvent('fullscreenchanged', fullscreen);
                this.triggerLayout();
            }
        },
        _wordCount: function() {
            var wdcount = this.getDom('wordcount');
            if (!this.editor.options.wordCount) {
                wdcount.style.display = "none";
                return;
            }
            wdcount.innerHTML = this.editor.queryCommandValue("wordcount");
        },
        disableWordCount: function() {
            var w = this.getDom('wordcount');
            w.innerHTML = '';
            w.style.display = 'none';
            this.wordcount = false;

        },
        enableWordCount: function() {
            var w = this.getDom('wordcount');
            w.style.display = '';
            this.wordcount = true;
            this._wordCount();
        },
        _updateFullScreen: function() {
            if (this._fullscreen) {
                var vpRect = uiUtils.getViewportRect();
                this.getDom().style.cssText = 'border:0;position:absolute;left:0;top:' + (this.editor.options.topOffset || 0) + 'px;width:' + vpRect.width + 'px;height:' + vpRect.height + 'px;z-index:' + (this.getDom().style.zIndex * 1 + 100);
                uiUtils.setViewportOffset(this.getDom(), {left: 0,top: this.editor.options.topOffset || 0});
                this.editor.setHeight(vpRect.height - this.getDom('toolbarbox').offsetHeight - this.getDom('bottombar').offsetHeight - (this.editor.options.topOffset || 0));

            }
        },
        _updateElementPath: function() {
            var bottom = this.getDom('elementpath'), list;
            if (this.elementPathEnabled && (list = this.editor.queryCommandValue('elementpath'))) {

                var buff = [];
                for (var i = 0, ci; ci = list[i]; i++) {
                    buff[i] = this.formatHtml('<span unselectable="on" onclick="$$.editor.execCommand(&quot;elementpath&quot;, &quot;' + i + '&quot;);">' + ci + '</span>');
                }
                bottom.innerHTML = '<div class="edui-editor-breadcrumb" onmousedown="return false;">' + this.editor.getLang("elementPathTip") + ': ' + buff.join(' &gt; ') + '</div>';

            } else {
                bottom.style.display = 'none'
            }
        },
        disableElementPath: function() {
            var bottom = this.getDom('elementpath');
            bottom.innerHTML = '';
            bottom.style.display = 'none';
            this.elementPathEnabled = false;

        },
        enableElementPath: function() {
            var bottom = this.getDom('elementpath');
            bottom.style.display = '';
            this.elementPathEnabled = true;
            this._updateElementPath();
        },
        _scale: function() {
            var doc = document,
            editor = this.editor,
            editorHolder = editor.container,
            editorDocument = editor.document,
            toolbarBox = this.getDom("toolbarbox"),
            bottombar = this.getDom("bottombar"),
            scale = this.getDom("scale"),
            scalelayer = this.getDom("scalelayer");

            var isMouseMove = false,
            position = null,
            minEditorHeight = 0,
            minEditorWidth = editor.options.minFrameWidth,
            pageX = 0,
            pageY = 0,
            scaleWidth = 0,
            scaleHeight = 0;

            function down() {
                position = domUtils.getXY(editorHolder);

                if (!minEditorHeight) {
                    minEditorHeight = editor.options.minFrameHeight + toolbarBox.offsetHeight + bottombar.offsetHeight;
                }

                scalelayer.style.cssText = "position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:" + editorHolder.offsetWidth + "px;height:"
                + editorHolder.offsetHeight + "px;z-index:" + (editor.options.zIndex + 1);

                domUtils.on(doc, "mousemove", move);
                domUtils.on(editorDocument, "mouseup", up);
                domUtils.on(doc, "mouseup", up);
            }
            var me = this;
            //by xuheng 全屏时关掉缩放
            this.editor.addListener('fullscreenchanged', function(e, fullScreen) {
                if (fullScreen) {
                    me.disableScale();

                } else {
                    if (me.editor.options.scaleEnabled) {
                        me.enableScale();
                        var tmpNode = me.editor.document.createElement('span');
                        me.editor.body.appendChild(tmpNode);
                        me.editor.body.style.height = Math.max(domUtils.getXY(tmpNode).y, me.editor.iframe.offsetHeight - 20) + 'px';
                        domUtils.remove(tmpNode)
                    }
                }
            });
            function move(event) {
                clearSelection();
                var e = event || window.event;
                pageX = e.pageX || (doc.documentElement.scrollLeft + e.clientX);
                pageY = e.pageY || (doc.documentElement.scrollTop + e.clientY);
                scaleWidth = pageX - position.x;
                scaleHeight = pageY - position.y;

                if (scaleWidth >= minEditorWidth) {
                    isMouseMove = true;
                    scalelayer.style.width = scaleWidth + 'px';
                }
                if (scaleHeight >= minEditorHeight) {
                    isMouseMove = true;
                    scalelayer.style.height = scaleHeight + "px";
                }
            }

            function up() {
                if (isMouseMove) {
                    isMouseMove = false;
                    editorHolder.style.width = scalelayer.offsetWidth - 2 + 'px';
                    editor.setHeight(scalelayer.offsetHeight - bottombar.offsetHeight - toolbarBox.offsetHeight - 2);
                }
                if (scalelayer) {
                    scalelayer.style.display = "none";
                }
                clearSelection();
                domUtils.un(doc, "mousemove", move);
                domUtils.un(editorDocument, "mouseup", up);
                domUtils.un(doc, "mouseup", up);
            }

            function clearSelection() {
                if (browser.ie)
                    doc.selection.clear();
                else
                    window.getSelection().removeAllRanges();
            }

            this.enableScale = function() {
                //trace:2868
                if (editor.queryCommandState("source") == 1)
                    return;
                scale.style.display = "";
                this.scaleEnabled = true;
                domUtils.on(scale, "mousedown", down);
            };
            this.disableScale = function() {
                scale.style.display = "none";
                this.scaleEnabled = false;
                domUtils.un(scale, "mousedown", down);
            };
        },
        isFullScreen: function() {
            return this._fullscreen;
        },
        postRender: function() {
            UIBase.prototype.postRender.call(this);
            for (var i = 0; i < this.toolbars.length; i++) {
                this.toolbars[i].postRender();
            }
            var me = this;
            var timerId,
            domUtils = baidu.editor.dom.domUtils,
            updateFullScreenTime = function() {
                clearTimeout(timerId);
                timerId = setTimeout(function() {
                    me._updateFullScreen();
                });
            };
            domUtils.on(window, 'resize', updateFullScreenTime);

            me.addListener('destroy', function() {
                domUtils.un(window, 'resize', updateFullScreenTime);
                clearTimeout(timerId);
            })
        },
        showToolbarMsg: function(msg, flag) {
            this.getDom('toolbarmsg_label').innerHTML = msg;
            this.getDom('toolbarmsg').style.display = '';
            //
            if (!flag) {
                var w = this.getDom('upload_dialog');
                w.style.display = 'none';
            }
        },
        hideToolbarMsg: function() {
            this.getDom('toolbarmsg').style.display = 'none';
        },
        mapUrl: function(url) {
            return url ? url.replace('~/', this.editor.options.UEDITOR_HOME_URL || '') : ''
        },
        triggerLayout: function() {
            var dom = this.getDom();
            if (dom.style.zoom == '1') {
                dom.style.zoom = '100%';
            } else {
                dom.style.zoom = '1';
            }
        }
    };
    utils.inherits(EditorUI, baidu.editor.ui.UIBase);


    var instances = {};


    UE.ui.Editor = function(options) {
        var editor = new baidu.editor.Editor(options);
        editor.options.editor = editor;
        utils.loadFile(document, {
            href: editor.options.themePath + editor.options.theme + "/_css/ueditor.css",
            tag: "link",
            type: "text/css",
            rel: "stylesheet"
        });

        var oldRender = editor.render;
        editor.render = function(holder) {
            if (holder.constructor === String) {
                editor.key = holder;
                instances[holder] = editor;
            }
            utils.domReady(function() {
                editor.langIsReady ? renderUI() : editor.addListener("langReady", renderUI);
                function renderUI() {
                    editor.setOpt({
                        labelMap: editor.options.labelMap || editor.getLang('labelMap')
                    });
                    new EditorUI(editor.options);
                    if (holder) {
                        if (holder.constructor === String) {
                            holder = document.getElementById(holder);
                        }
                        holder && holder.getAttribute('name') && (editor.options.textarea = holder.getAttribute('name'));
                        if (holder && /script|textarea/ig.test(holder.tagName)) {
                            var newDiv = document.createElement('div');
                            holder.parentNode.insertBefore(newDiv, holder);
                            var cont = holder.value || holder.innerHTML;
                            editor.options.initialContent = /^[\t\r\n ]*$/.test(cont) ? editor.options.initialContent :
                            cont.replace(/>[\n\r\t]+([ ]{4})+/g, '>')
                            .replace(/[\n\r\t]+([ ]{4})+</g, '<')
                            .replace(/>[\n\r\t]+</g, '><');
                            holder.className && (newDiv.className = holder.className);
                            holder.style.cssText && (newDiv.style.cssText = holder.style.cssText);
                            if (/textarea/i.test(holder.tagName)) {
                                editor.textarea = holder;
                                editor.textarea.style.display = 'none';

                            } else {
                                holder.parentNode.removeChild(holder);
                                holder.id && (newDiv.id = holder.id);
                            }
                            holder = newDiv;
                            holder.innerHTML = '';
                        }

                    }
                    domUtils.addClass(holder, "edui-" + editor.options.theme);
                    editor.ui.render(holder);
                    var iframeholder = editor.ui.getDom('iframeholder');
                    //给实例添加一个编辑器的容器引用
                    editor.container = editor.ui.getDom();
                    editor.container.style.cssText = "z-index:" + editor.options.zIndex + ";";
                    oldRender.call(editor, iframeholder);

                }
            })
        };
        return editor;
    };



    /**
     * @file
     * @name UE
     * @short UE
     * @desc UEditor的顶部命名空间
     */
    /**
     * @name getEditor
     * @since 1.2.4+
     * @grammar UE.getEditor(id,[opt])  =>  Editor实例
     * @desc 提供一个全局的方法得到编辑器实例
     *
     * * ''id''  放置编辑器的容器id, 如果容器下的编辑器已经存在，就直接返回
     * * ''opt'' 编辑器的可选参数
     * @example
     *  UE.getEditor('containerId',{onready:function(){//创建一个编辑器实例
     *      this.setContent('hello')
     *  }});
     *  UE.getEditor('containerId'); //返回刚创建的实例
     *
     */
    UE.getEditor = function(id, opt) {
        var editor;
        if (id.constructor !== String) {
            editor = new UE.ui.Editor(opt);
            editor.render(id);
        } else {
            editor = instances[id];
            if (!editor) {
                editor = instances[id] = new UE.ui.Editor(opt);
                editor.render(id);
            }
        }
        return editor;
    };


    UE.delEditor = function(id) {
        var editor;
        if (editor = instances[id]) {
            editor.key && editor.destroy();
            delete instances[id]
        }
    }
})();
