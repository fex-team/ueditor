(function(){

    UE.Editor.prototype.loadServerConfig = function(){
        var me = this;
        setTimeout(function(){
            try{
                me.options.imageUrl && me.setOpt('serverUrl', me.options.imageUrl.replace(/^(.*[\/]).+([\.].+)$/, '$1controller$2'));

                var configUrl = me.getActionUrl('config'),
                    isJsonp = utils.isCrossDomainUrl(configUrl);

                /* 发出ajax请求 */
                me._serverConfigLoaded = false;

                configUrl && UE.ajax.request(configUrl,{
                    'method': 'GET',
                    'dataType': isJsonp ? 'jsonp':'',
                    'onsuccess':function(r){
                        try {
                            var config = isJsonp ? r:eval("("+r.responseText+")");
                            utils.extend(me.options, config);
                            me.fireEvent('serverConfigLoaded');
                            me._serverConfigLoaded = true;
                        } catch (e) {
                            console && console.error('后台配置项返回出错!');
                        }
                    },
                    'onerror':function(){
                        console && console.error('获取后台配置项出错!');
                    }
                });
            } catch(e){
                console && console.log('获取后台配置项请求出错!');
            }
        });
    };

    UE.Editor.prototype.isServerConfigLoaded = function(){
        var me = this;
        return me._serverConfigLoaded || false;
    };

    UE.Editor.prototype.afterConfigReady = function(handler){
        if (!handler || !utils.isFunction(handler)) return;
        var me = this;
        var readyHandler = function(){
            handler.apply(me, arguments);
            me.removeListener('serverConfigLoaded', readyHandler);
        };

        if (me.isServerConfigLoaded()) {
            handler.call(me, 'serverConfigLoaded');
        } else {
            me.addListener('serverConfigLoaded', readyHandler);
        }
    };

})();
