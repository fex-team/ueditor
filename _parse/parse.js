(function(){
    UE = window.UE || {};
    var isIE = !!window.ActiveXObject;
    //定义utils工具
    var utils = {
            removeLastbs : function(url){
                return url.replace(/\/$/,'')
            },
            extend : function(t,s){
                var a = arguments,
                    notCover = this.isBoolean(a[a.length - 1]) ? a[a.length - 1] : false,
                    len = this.isBoolean(a[a.length - 1]) ? a.length - 1 : a.length;
                for (var i = 1; i < len; i++) {
                    var x = a[i];
                    for (var k in x) {
                        if (!notCover || !t.hasOwnProperty(k)) {
                            t[k] = x[k];
                        }
                    }
                }
                return t;
            },
            isIE : isIE,
            cssRule : isIE ? function(key,style,doc){
                var indexList,index;
                doc = doc || document;
                if(doc.indexList){
                    indexList = doc.indexList;
                }else{
                    indexList = doc.indexList =  {};
                }
                var sheetStyle;
                if(!indexList[key]){
                    if(style === undefined){
                        return ''
                    }
                    sheetStyle = doc.createStyleSheet('',index = doc.styleSheets.length);
                    indexList[key] = index;
                }else{
                    sheetStyle = doc.styleSheets[indexList[key]];
                }
                if(style === undefined){
                    return sheetStyle.cssText
                }
                sheetStyle.cssText = sheetStyle.cssText + '\n' + (style || '')
            } : function(key,style,doc){
                doc = doc || document;
                var head = doc.getElementsByTagName('head')[0],node;
                if(!(node = doc.getElementById(key))){
                    if(style === undefined){
                        return ''
                    }
                    node = doc.createElement('style');
                    node.id = key;
                    head.appendChild(node)
                }
                if(style === undefined){
                    return node.innerHTML
                }
                if(style !== ''){
                    node.innerHTML = node.innerHTML + '\n' + style;
                }else{
                    head.removeChild(node)
                }
            },
            domReady : function (onready) {
                var doc = window.document;
                if (doc.readyState === "complete") {
                    onready();
                }else{
                    if (isIE) {
                        (function () {
                            if (doc.isReady) return;
                            try {
                                doc.documentElement.doScroll("left");
                            } catch (error) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            onready();
                        })();
                        window.attachEvent('onload', function(){
                            onready()
                        });
                    } else {
                        doc.addEventListener("DOMContentLoaded", function () {
                            doc.removeEventListener("DOMContentLoaded", arguments.callee, false);
                            onready();
                        }, false);
                        window.addEventListener('load', function(){onready()}, false);
                    }
                }

            },
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
            inArray : function(arr,item){
                var index = -1;
                this.each(arr,function(v,i){
                    if(v === item){
                        index = i;
                        return false;
                    }
                });
                return index;
            },
            pushItem : function(arr,item){
                if(this.inArray(arr,item)==-1){
                    arr.push(item)
                }
            },
            trim: function (str) {
                return str.replace(/(^[ \t\n\r]+)|([ \t\n\r]+$)/g, '');
            },
            indexOf: function (array, item, start) {
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
            hasClass: function (element, className) {
                className = className.replace(/(^[ ]+)|([ ]+$)/g, '').replace(/[ ]{2,}/g, ' ').split(' ');
                for (var i = 0, ci, cls = element.className; ci = className[i++];) {
                    if (!new RegExp('\\b' + ci + '\\b', 'i').test(cls)) {
                        return false;
                    }
                }
                return i - 1 == className.length;
            },
            addClass:function (elm, classNames) {
                if(!elm)return;
                classNames = this.trim(classNames).replace(/[ ]{2,}/g,' ').split(' ');
                for(var i = 0,ci,cls = elm.className;ci=classNames[i++];){
                    if(!new RegExp('\\b' + ci + '\\b').test(cls)){
                        cls += ' ' + ci;
                    }
                }
                elm.className = utils.trim(cls);
            },
            removeClass:function (elm, classNames) {
                classNames = this.isArray(classNames) ? classNames :
                    this.trim(classNames).replace(/[ ]{2,}/g,' ').split(' ');
                for(var i = 0,ci,cls = elm.className;ci=classNames[i++];){
                    cls = cls.replace(new RegExp('\\b' + ci + '\\b'),'')
                }
                cls = this.trim(cls).replace(/[ ]{2,}/g,' ');
                elm.className = cls;
                !cls && elm.removeAttribute('className');
            },
            on: function (element, type, handler) {
                var types = this.isArray(type) ? type : type.split(/\s+/),
                    k = types.length;
                if (k) while (k--) {
                    type = types[k];
                    if (element.addEventListener) {
                        element.addEventListener(type, handler, false);
                    } else {
                        if (!handler._d) {
                            handler._d = {
                                els : []
                            };
                        }
                        var key = type + handler.toString(),index = utils.indexOf(handler._d.els,element);
                        if (!handler._d[key] || index == -1) {
                            if(index == -1){
                                handler._d.els.push(element);
                            }
                            if(!handler._d[key]){
                                handler._d[key] = function (evt) {
                                    return handler.call(evt.srcElement, evt || window.event);
                                };
                            }


                            element.attachEvent('on' + type, handler._d[key]);
                        }
                    }
                }
                element = null;
            },
            off: function (element, type, handler) {
                var types = this.isArray(type) ? type : type.split(/\s+/),
                    k = types.length;
                if (k) while (k--) {
                    type = types[k];
                    if (element.removeEventListener) {
                        element.removeEventListener(type, handler, false);
                    } else {
                        var key = type + handler.toString();
                        try{
                            element.detachEvent('on' + type, handler._d ? handler._d[key] : handler);
                        }catch(e){}
                        if (handler._d && handler._d[key]) {
                            var index = utils.indexOf(handler._d.els,element);
                            if(index!=-1){
                                handler._d.els.splice(index,1);
                            }
                            handler._d.els.length == 0 && delete handler._d[key];
                        }
                    }
                }
            },
            loadFile : function () {
                var tmpList = [];
                function getItem(doc,obj){
                    try{
                        for(var i= 0,ci;ci=tmpList[i++];){
                            if(ci.doc === doc && ci.url == (obj.src || obj.href)){
                                return ci;
                            }
                        }
                    }catch(e){
                        return null;
                    }

                }
                return function (doc, obj, fn) {
                    var item = getItem(doc,obj);
                    if (item) {
                        if(item.ready){
                            fn && fn();
                        }else{
                            item.funs.push(fn)
                        }
                        return;
                    }
                    tmpList.push({
                        doc:doc,
                        url:obj.src||obj.href,
                        funs:[fn]
                    });
                    if (!doc.body) {
                        var html = [];
                        for(var p in obj){
                            if(p == 'tag')continue;
                            html.push(p + '="' + obj[p] + '"')
                        }
                        doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></'+obj.tag+'>');
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
                            item = getItem(doc,obj);
                            if (item.funs.length > 0) {
                                item.ready = 1;
                                for (var fi; fi = item.funs.pop();) {
                                    fi();
                                }
                            }
                            element.onload = element.onreadystatechange = null;
                        }
                    };
                    element.onerror = function(){
                        throw Error('The load '+(obj.href||obj.src)+' fails,check the url')
                    };
                    doc.getElementsByTagName("head")[0].appendChild(element);
                }
            }()
    };
    utils.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object','Boolean'], function (v) {
        utils['is' + v] = function (obj) {
            return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
        }
    });
    var parselist = {};
    UE.parse = {
        register : function(parseName,fn){
            parselist[parseName] = fn;
        },
        load : function(opt){
            utils.each(parselist,function(v){
                v.call(opt,utils);
            })
        }
    };
    uParse = function(selector,opt){
        utils.domReady(function(){
            var contents;
            if(document.querySelectorAll){
                contents = document.querySelectorAll(selector)
            }else{
                if(/^#/.test(selector)){
                    contents = [document.getElementById(selector.replace(/^#/,''))]
                }else if(/^\./.test(selector)){
                    var contents = [];
                    utils.each(document.getElementsByTagName('*'),function(node){
                        if(node.className && new RegExp('\\b' + selector.replace(/^\./,'') + '\\b','i').test(node.className)){
                            contents.push(node)
                        }
                    })
                }else{
                    contents = document.getElementsByTagName(selector)
                }
            }
            utils.each(contents,function(v){
                UE.parse.load(utils.extend({root:v,selector:selector},opt))
            })
        })
    }
})();
