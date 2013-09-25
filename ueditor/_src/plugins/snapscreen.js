///import core
///import plugins\inserthtml.js
///import plugins\image.js
///commandsName  snapscreen
///commandsTitle  截屏
/**
 * 截屏插件
 */
UE.plugins['snapscreen'] = function(){
    var me = this,
        doc,
        snapplugin;

    me.setOpt({
        snapscreenServerPort: location.port                                    //屏幕截图的server端端口
        ,snapscreenImgAlign: ''                                //截图的图片默认的排版方式
        ,snapscreenHost: location.hostname                                 //屏幕截图的server端文件所在的网站地址或者ip，请不要加http://

    });
    me.commands['snapscreen'] = {
        execCommand: function(){
            var me = this,lang = me.getLang("snapScreen_plugin");
            if(!snapplugin){
                var container = me.container;
                doc = container.ownerDocument || container.document;
                snapplugin = doc.createElement("object");
                try{snapplugin.type = "application/x-pluginbaidusnap";}catch(e){
                    return;
                }
                snapplugin.style.cssText = "position:absolute;left:-9999px;";
                snapplugin.setAttribute("width","0");
                snapplugin.setAttribute("height","0");
                container.appendChild(snapplugin);
            }


           var editorOptions = me.options;

            var onSuccess = function(rs){
                try{
                    rs = eval("("+ rs +")");
                }catch(e){
                    alert(lang.callBackErrorMsg);
                    return;
                }

                if(rs.state != 'SUCCESS'){
                    alert(rs.state);
                    return;
                }
                me.execCommand('insertimage', {
                    src: editorOptions.snapscreenPath + rs.url,
                    floatStyle: editorOptions.snapscreenImgAlign,
                    _src:editorOptions.snapscreenPath + rs.url
                });
            };
            var onStartUpload = function(){
                //开始截图上传
            };
            var onError = function(){
                alert(lang.uploadErrorMsg);
            };
            try{
                var port = editorOptions.snapscreenServerPort + '';
                editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl.split( editorOptions.snapscreenHost );
                editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl[1] || editorOptions.snapscreenServerUrl[0];
                if( editorOptions.snapscreenServerUrl.indexOf(":"+port) === 0 ) {
                    editorOptions.snapscreenServerUrl = editorOptions.snapscreenServerUrl.substring( port.length+1 );
                }
                var ret =snapplugin.saveSnapshot(editorOptions.snapscreenHost, editorOptions.snapscreenServerUrl, port);
                onSuccess(ret);
            }catch(e){
                me.ui._dialogs['snapscreenDialog'].open();
            }
        }
    };
}

