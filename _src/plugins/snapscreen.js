/**
 * 截屏插件，为UEditor提供插入支持
 * @file
 * @since 1.4.2
 */
UE.plugin.register('snapscreen', function (){

    var me = this;
    var snapplugin;

    function getLocation(url){
        var search,
            a = document.createElement('a'),
            params = utils.serializeParam(me.queryCommandValue('serverparam')) || '';

        a.href = url;
        if (browser.ie) {
            a.href = a.href;
        }


        search = a.search;
        if (params) {
            search = search + (search.indexOf('?') == -1 ? '?':'&')+ params;
            search = search.replace(/[&]+/ig, '&');
        }
        return {
            'port': a.port,
            'hostname': a.hostname,
            'path': a.pathname + search ||  + a.hash
        }
    }

    return {
        commands:{
            /**
             * 字体背景颜色
             * @command snapscreen
             * @method execCommand
             * @param { String } cmd 命令字符串
             * @example
             * ```javascript
             * editor.execCommand('snapscreen');
             * ```
             */
            'snapscreen':{
                execCommand:function (cmd) {
                    var url, local, res;
                    var lang = me.getLang("snapScreen_plugin");

                    if(!snapplugin){
                        var container = me.container;
                        var doc = me.container.ownerDocument || me.container.document;
                        snapplugin = doc.createElement("object");
                        try{snapplugin.type = "application/x-pluginbaidusnap";}catch(e){
                            return;
                        }
                        snapplugin.style.cssText = "position:absolute;left:-9999px;width:0;height:0;";
                        snapplugin.setAttribute("width","0");
                        snapplugin.setAttribute("height","0");
                        container.appendChild(snapplugin);
                    }

                    function onSuccess(rs){
                        try{
                            rs = eval("("+ rs +")");
                            if(rs.state == 'SUCCESS'){
                                var opt = me.options;
                                me.execCommand('insertimage', {
                                    src: opt.snapscreenUrlPrefix + rs.url,
                                    _src: opt.snapscreenUrlPrefix + rs.url,
                                    alt: rs.title || '',
                                    floatStyle: opt.snapscreenImgAlign
                                });
                            } else {
                                alert(rs.state);
                            }
                        }catch(e){
                            alert(lang.callBackErrorMsg);
                        }
                    }
                    url = me.getActionUrl(me.getOpt('snapscreenActionName'));
                    local = getLocation(url);
                    setTimeout(function () {
                        try{
                            res =snapplugin.saveSnapshot(local.hostname, local.path, local.port);
                        }catch(e){
                            me.ui._dialogs['snapscreenDialog'].open();
                            return;
                        }

                        onSuccess(res);
                    }, 50);
                },
                queryCommandState: function(){
                    return (navigator.userAgent.indexOf("Windows",0) != -1) ? 0:-1;
                }
            }
        }
    }
});
