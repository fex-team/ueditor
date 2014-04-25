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
            swf: me.options.uploaderSwfUrl,
            accept: {
                title: 'Images',
                extensions: me.getOpt('imageAllowFiles').join('').replace(/\./g, ',').replace(/^[,]/, ''),
                mimeTypes: 'image/*'
            },
            chunked: true,
            server: me.getActionUrl(me.getOpt('imageActionName')),
            resize: false,
            fileVal: me.getOpt('imageFieldName'),
            duplicate: true,
            formdata: {},
            threads: 3,
            fileSingleSizeLimit: me.getOpt('imageMaxSize'),    // 默认 2 M
            compress: me.getOpt('imageCompressEnable') ? {
                width: me.getOpt('imageCompressBorder'),
                height: me.getOpt('imageCompressBorder'),
                // 图片质量，只有type为`image/jpeg`的时候才有效。
                quality: 90,
                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                allowMagnify: false,
                // 是否允许裁剪。
                crop: false,
                // 是否保留头部meta信息。
                preserveHeaders: true
            }:false

        });

        // 当有文件被添加进队列的时候
        uploader.on('fileQueued', function (file) {
            file.on('statuschange', function (cur, prev) {
                if (cur === 'error' || cur === 'invalid' || cur === 'cancelled') {
                    var msg = file.statusText;
                    if(msg == 'exceed_size') {
                        showError(me.getLang('simpleupload.exceedSizeError'));
                    } else if(cur == 'error') {
                        showError(msg + ' Error!');
                    } else {
                        showError(msg);
                    }
                }
            });
        });
        uploader.on('filesQueued', function (files) {
            uploader.upload();
        });
        uploader.on('uploadSuccess', function (file, ret) {
            try{
                var json = (new Function("return " + utils.trim(ret._raw)))();
                var picLink = me.getOpt('imageUrlPrefix') + json.url;
                if(json.state == 'SUCCESS' && json.url) {
                    me.execCommand('insertimage', {
                        src: picLink,
                        _src: picLink
                    });
                } else {
                    showError(json.state);
                }
            }catch(er){
                showError(me.getLang('simpleupload.jsonEncodeError'));
            }
        });
        uploader.on('uploadError', function (file, msg) {
        });
        uploader.on('uploadComplete', function (file) {
        });

        me.fireEvent('initWebUploader');

        function showError(msg){
            alert(msg);
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
                        }, function(){
                            if(me._serverConfigLoaded) {
                                initWebUploader();
                            } else {
                                me.addListener('serverConfigLoaded', function(){
                                    initWebUploader();
                                });
                            }
                        });
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