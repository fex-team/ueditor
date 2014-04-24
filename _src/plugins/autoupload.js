/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UE.plugin.register('autoupload', function (){
    var me = this;
    var sendAndInsertImage = function (file, editor) {
        //模拟数据
        var filetype = /image\/\w+/i.test(file.type) ? 'image':'file',
            fd = new FormData();
        fd.append(editor.options.imageFieldName, file, file.name || ('blob.' + file.type.substr('image/'.length)));
        fd.append('type', 'ajax');

        var xhr = new XMLHttpRequest(),
            url = editor.getActionUrl(editor.getOpt(filetype + 'ActionName'));

        xhr.open("post", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.addEventListener('load', function (e) {
            try{
                var json = (new Function("return " + e.target.response))();
                if (json.state == 'SUCCESS' && json.url) {
                    var link = me.getOpt(filetype + 'UrlPrefix') + json.url;
                    filetype == 'image' ? editor.execCommand('insertimage', {
                        src: link,
                        _src: link
                    }) : editor.execCommand('insertfile', {
                        url: link
                    });
                }
            }catch(er){ }
        });
        xhr.send(fd);
    };

    function getPasteImage(e){
        return e.clipboardData && e.clipboardData.items && e.clipboardData.items.length == 1 && /^image\//.test(e.clipboardData.items[0].type) ? e.clipboardData.items:null;
    }
    function getDropImage(e){
        return  e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files:null;
    }

    return {
        bindEvents:{
            //插入粘贴板的图片，拖放插入图片
            'ready':function(e){
                if(window.FormData && window.FileReader) {
                    domUtils.on(me.body, 'paste drop', function(e){
                        var hasImg = false,
                            items;
                        //获取粘贴板文件列表或者拖放文件列表
                        items = e.type == 'paste' ? getPasteImage(e):getDropImage(e);
                        if(items){
                            var len = items.length,
                                file;
                            while (len--){
                                file = items[len];
                                if(file.getAsFile) file = file.getAsFile();
                                if(file && file.size > 0) {
                                    sendAndInsertImage(file, me);
                                    hasImg = true;
                                }
                            }
                            hasImg && e.preventDefault();
                        }

                    });
                    //取消拖放图片时出现的文字光标位置提示
                    domUtils.on(me.body, 'dragover', function (e) {
                        if(e.dataTransfer.types[0] == 'Files') {
                            e.preventDefault();
                        }
                    });
                }
            }
        }
    }
});