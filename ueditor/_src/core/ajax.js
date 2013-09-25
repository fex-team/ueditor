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
            if(i=="method" || i=="timeout" || i=="async") continue;
            //传递过来的对象和函数不在提交之列
            if (!((typeof json[i]).toLowerCase() == "function" || (typeof json[i]).toLowerCase() == "object")) {
                strArr.push( encodeURIComponent(i) + "="+encodeURIComponent(json[i]) );
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
		request:function(url, ajaxOptions) {
            var ajaxRequest = creatAjaxRequest(),
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
			if (!ajaxRequest || !url) return;
			var ajaxOpts = ajaxOptions ? utils.extend(defaultAjaxOptions,ajaxOptions) : defaultAjaxOptions;

			var submitStr = json2str(ajaxOpts);  // { name:"Jim",city:"Beijing" } --> "name=Jim&city=Beijing"
			//如果用户直接通过data参数传递json对象过来，则也要将此json对象转化为字符串
			if (!utils.isEmptyObject(ajaxOpts.data)){
                submitStr += (submitStr? "&":"") + json2str(ajaxOpts.data);
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
            var str = url + (url.indexOf("?")==-1?"?":"&") + (method=="POST"?"":submitStr+ "&noCache=" + +new Date);
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
