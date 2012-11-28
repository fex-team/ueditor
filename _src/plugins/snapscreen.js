///import core
///commandsName  snapscreen
///commandsTitle  截屏
/**
 * 截屏插件
 */
UE.commands['snapscreen'] = {
    execCommand: function(){
        var me = this,lang = me.getLang("snapScreen_plugin");
        me.setOpt({
               snapscreenServerPort: 80                                    //屏幕截图的server端端口
              ,snapscreenImgAlign: 'left'                                //截图的图片默认的排版方式
        });
        var editorOptions = me.options;

        if(!browser.ie){
            alert(lang.browserMsg);
            return;
        }

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
            var nativeObj = new ActiveXObject('Snapsie.CoSnapsie');
            nativeObj.saveSnapshot(editorOptions.snapscreenHost, editorOptions.snapscreenServerUrl, editorOptions.snapscreenServerPort, onStartUpload,onSuccess,onError);
        }catch(e){
            me.ui._dialogs['snapscreenDialog'].open();
        }
    },
    queryCommandState: function(){
        return this.highlight || !browser.ie ? -1 :0;
    }
};
