/**
 * 截屏插件，为UEditor提供插入支持
 * @file
 * @since 1.4.0
 */
UE.plugin.register('snapscreen', function (){

    var me = this;
    var snapplugin;

    // 设置截屏配置项默认值
    me.setOpt({
        snapscreenServerPort: location.port, // 屏幕截图的server端端口
        snapscreenImgAlign: '', // 截图的图片默认的排版方式
        snapscreenHost: location.hostname // 屏幕截图的server端文件所在的网站地址或者ip，请不要加http://
    });

    function getLocation(url){
        var a = document.createElement('a');

        a.href = url;
        return {
            'port': a.port,
            'hostname': a.hostname,
            'path': a.pathname + a.search + a.hash
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
                    var me = this,
                        lang = me.getLang("snapScreen_plugin");

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
                            res =snapplugin.saveSnapshot(local.hostname, '/ueditor/' + local.path, local.port);
                        }catch(e){
                            me.ui._dialogs['snapscreenDialog'].open();
                            return;
                        }

                        onSuccess(res);
                    }, 50);
                }
            }
        }
    }
});
