/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register('simpleupload', function (){
    var me = this;

    function initWebUploader() {

        // 创建webupoaler实例
        var uploader = me.webuploader = WebUploader.create({

            // swf文件路径
            swf: me.options.uploaderSwfUrl,

            // 文件接收服务端。
            server: me.options.imageUrl,

            // 选择文件的按钮。可选。
            // 内部根据当前运行是创建，可能是input元素，也可能是flash.
            // pick: '#' + id,

            // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            resize: false,

            threads: 3,
            fileVal: me.options.imageFieldName,
            formdata: {},
            duplicate: true

        });

        // 当有文件被添加进队列的时候
        uploader.on('filesQueued', function (a, b) {
            uploader.upload();
        });
        uploader.on('uploadSuccess', function (file, ret) {
            try{
                var json = (new Function("return " + ret._raw))();
                var picLink = me.options.imagePath + json.url;
                if(json.url) {
                    me.execCommand('insertimage', {
                        src: picLink,
                        _src: picLink
                    });
                } else {
                    showError('server error: ' + json.state);
                }
            }catch(er){
                showError('parseError: ' + ret._raw);
            }
        });
        uploader.on('uploadError', function (file) {
            showError('uploadError!');
        });
        uploader.on('uploadComplete', function (file) {
        });

        me.fireEvent('initWebUploader');

        function showError(msg){
            alert(msg || '上传错误!');
        }

    }

    me.setOpt({
        'uploaderSwfUrl': me.options.UEDITOR_HOME_URL + 'third-party/webuploader/Uploader.swf',
        'uploaderJsUrl': me.options.UEDITOR_HOME_URL + 'third-party/webuploader/webuploader.min.js',
        'uploaderJsCss': me.options.UEDITOR_HOME_URL + 'third-party/webuploader/webuploader.css'
    });

    return {
        bindEvents:{
            /* 初始化简单上传按钮 */
            'ready': function () {
                var doc = me.container.ownerDocument,
                    loadWebUploaderJs = function(){
                        /* 加载webuploader */
                        utils.loadFile(doc, {
                            src: me.options.uploaderJsUrl,
                            tag: "script",
                            type: "text/javascript",
                            defer: "defer"
                        }, initWebUploader);
                    };

                /* 加载jquery */
                if(!window.jQuery) {
                    utils.loadFile(doc, {
                        src: me.options.UEDITOR_HOME_URL + 'third-party/jquery-1.10.2.min.js',
                        tag: "script",
                        type: "text/javascript",
                        defer: "defer"
                    }, loadWebUploaderJs);
                } else {
                    loadWebUploaderJs();
                }
            }
        }
    }
});