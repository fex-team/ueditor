/**
 * @file
 * @module UE.ajax
 * @since 1.2.6.1
 */

/**
 * 提供对ajax请求的支持
 * @module UE.ajax
 */
UE.ajax = function() {

    //创建一个ajaxRequest对象
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
            if(i=="method" || i=="timeout" || i=="async" || i=="dataType" || i=="callback") continue;
            //忽略控制
            if(json[i] == undefined || json[i] == null) continue;
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
    }

    function doAjax(url, ajaxOptions) {
        var xhr = creatAjaxRequest(),
        //是否超时
            timeIsOut = false,
        //默认参数
            defaultAjaxOptions = {
                method:"POST",
                timeout:5000,
                async:true,
                data:{},//需要传递对象的话只能覆盖
                onsuccess:function() {
                },
                onerror:function() {
                }
            };

        if (typeof url === "object") {
            ajaxOptions = url;
            url = ajaxOptions.url;
        }
        if (!xhr || !url) return;
        var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions,ajaxOptions) : defaultAjaxOptions;

        var submitStr = json2str(ajaxOpts);  // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
        //如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
        if (!utils.isEmptyObject(ajaxOpts.data)){
            submitStr += (submitStr? "&":"") + json2str(ajaxOpts.data);
        }
        //超时检测
        var timerID = setTimeout(function() {
            if (xhr.readyState != 4) {
                timeIsOut = true;
                xhr.abort();
                clearTimeout(timerID);
            }
        }, ajaxOpts.timeout);

        var method = ajaxOpts.method.toUpperCase();
        var str = url + (url.indexOf("?")==-1?"?":"&") + (method=="POST"?"":submitStr+ "&noCache=" + +new Date);
        xhr.open(method, str, ajaxOpts.async);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (!timeIsOut && xhr.status == 200) {
                    ajaxOpts.onsuccess(xhr);
                } else {
                    ajaxOpts.onerror(xhr);
                }
            }
        };
        if (method == "POST") {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(submitStr);
        } else {
            xhr.send(null);
        }
    }

    function doJsonp(url, opts) {

        var successhandler = opts.onsuccess || function(){},
            scr = document.createElement('SCRIPT'),
            options = opts || {},
            charset = options['charset'],
            callbackField = options['jsonp'] || 'callback',
            callbackFnName,
            timeOut = options['timeOut'] || 0,
            timer,
            reg = new RegExp('(\\?|&)' + callbackField + '=([^&]*)'),
            matches;

        if (utils.isFunction(successhandler)) {
            callbackFnName = 'bd__editor__' + Math.floor(Math.random() * 2147483648).toString(36);
            window[callbackFnName] = getCallBack(0);
        } else if(utils.isString(successhandler)){
            callbackFnName = successhandler;
        } else {
            if (matches = reg.exec(url)) {
                callbackFnName = matches[2];
            }
        }

        url = url.replace(reg, '\x241' + callbackField + '=' + callbackFnName);

        if (url.search(reg) < 0) {
            url += (url.indexOf('?') < 0 ? '?' : '&') + callbackField + '=' + callbackFnName;
        }

        var queryStr = json2str(opts);  // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
        //如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
        if (!utils.isEmptyObject(opts.data)){
            queryStr += (queryStr? "&":"") + json2str(opts.data);
        }
        if (queryStr) {
            url = url.replace(/\?/, '?' + queryStr + '&');
        }

        scr.onerror = getCallBack(1);
        if( timeOut ){
            timer = setTimeout(getCallBack(1), timeOut);
        }
        createScriptTag(scr, url, charset);

        function createScriptTag(scr, url, charset) {
            scr.setAttribute('type', 'text/javascript');
            scr.setAttribute('defer', 'defer');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        }

        function getCallBack(onTimeOut){
            return function(){
                try {
                    if(onTimeOut){
                        options.onerror && options.onerror();
                    }else{
                        try{
                            clearTimeout(timer);
                            successhandler.apply(window, arguments);
                        } catch (e){}
                    }
                } catch (exception) {
                    options.onerror && options.onerror.call(window, exception);
                } finally {
                    options.oncomplete && options.oncomplete.apply(window, arguments);
                    scr.parentNode && scr.parentNode.removeChild(scr);
                    window[callbackFnName] = null;
                    try {
                        delete window[callbackFnName];
                    }catch(e){}
                }
            }
        }
    }

    return {
        /**
         * 根据给定的参数项，向指定的url发起一个ajax请求。 ajax请求完成后，会根据请求结果调用相应回调： 如果请求
         * 成功， 则调用onsuccess回调， 失败则调用 onerror 回调
         * @method request
         * @param { URLString } url ajax请求的url地址
         * @param { Object } ajaxOptions ajax请求选项的键值对，支持的选项如下：
         * @example
         * ```javascript
         * //向sayhello.php发起一个异步的Ajax GET请求, 请求超时时间为10s， 请求完成后执行相应的回调。
         * UE.ajax.requeset( 'sayhello.php', {
         *
         *     //请求方法。可选值： 'GET', 'POST'，默认值是'POST'
         *     method: 'GET',
         *
         *     //超时时间。 默认为5000， 单位是ms
         *     timeout: 10000,
         *
         *     //是否是异步请求。 true为异步请求， false为同步请求
         *     async: true,
         *
         *     //请求携带的数据。如果请求为GET请求， data会经过stringify后附加到请求url之后。
         *     data: {
         *         name: 'ueditor'
         *     },
         *
         *     //请求成功后的回调， 该回调接受当前的XMLHttpRequest对象作为参数。
         *     onsuccess: function ( xhr ) {
         *         console.log( xhr.responseText );
         *     },
         *
         *     //请求失败或者超时后的回调。
         *     onerror: function ( xhr ) {
         *          alert( 'Ajax请求失败' );
         *     }
         *
         * } );
         * ```
         */

        /**
         * 根据给定的参数项发起一个ajax请求， 参数项里必须包含一个url地址。 ajax请求完成后，会根据请求结果调用相应回调： 如果请求
         * 成功， 则调用onsuccess回调， 失败则调用 onerror 回调。
         * @method request
         * @warning 如果在参数项里未提供一个key为“url”的地址值，则该请求将直接退出。
         * @param { Object } ajaxOptions ajax请求选项的键值对，支持的选项如下：
         * @example
         * ```javascript
         *
         * //向sayhello.php发起一个异步的Ajax POST请求, 请求超时时间为5s， 请求完成后不执行任何回调。
         * UE.ajax.requeset( 'sayhello.php', {
         *
         *     //请求的地址， 该项是必须的。
         *     url: 'sayhello.php'
         *
         * } );
         * ```
         */
		request:function(url, opts) {
            if (opts && opts.dataType == 'jsonp') {
                doJsonp(url, opts);
            } else {
                doAjax(url, opts);
            }
		},
        getJSONP:function(url, data, fn) {
            var opts = {
                'data': data,
                'oncomplete': fn
            };
            doJsonp(url, opts);
		}
	};


}();
