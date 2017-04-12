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
                            showErrorMsg(me.getLang('loadconfigFormatError'));
                        }
                    },
                    'onerror':function(){
                        showErrorMsg(me.getLang('loadconfigHttpError'));
                    }
                });
            } catch(e){
                showErrorMsg(me.getLang('loadconfigError'));
            }
        });

        function showErrorMsg(msg) {
            console && console.error(msg);
            //me.fireEvent('showMessage', {
            //    'title': msg,
            //    'type': 'error'
            //});
        }
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
