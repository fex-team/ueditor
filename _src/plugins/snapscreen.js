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
    me.addListener("ready",function(){
        var container = me.container;
        doc = container.ownerDocument || container.document;
        snapplugin = doc.createElement("object");
        snapplugin.type = "application/x-pluginbaidusnap";
        snapplugin.style.cssText = "position:absolute;left:-9999px;";
        snapplugin.setAttribute("width","0");
        snapplugin.setAttribute("height","0");
        container.appendChild(snapplugin);
    });
    me.commands['snapscreen'] = {
        execCommand: function(){
            var me = this,lang = me.getLang("snapScreen_plugin");
            me.setOpt({
                  snapscreenServerPort: 80                                    //屏幕截图的server端端口
                 ,snapscreenImgAlign: ''                                //截图的图片默认的排版方式
           });
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
                    data_ue_src:editorOptions.snapscreenPath + rs.url
                });
            };
            var onStartUpload = function(){
                //开始截图上传
            };
            var onError = function(){
                alert(lang.uploadErrorMsg);
            };
            try{
                var ret =snapplugin.saveSnapshot(editorOptions.snapscreenHost, editorOptions.snapscreenServerUrl, editorOptions.snapscreenServerPort.toString());
                onSuccess(ret);
            }catch(e){
                me.ui._dialogs['snapscreenDialog'].open();
            }
        },
        queryCommandState: function(){
            return this.highlight ? -1 :0;
        }
    };
}

