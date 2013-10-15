/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UE.plugins['autoupload'] = function() {
    var me = this;
    me.setOpt('dropFileEnabled', true);

    function sendAndInsertImage(file, editor){
        //模拟数据
        var fd = new FormData();
        fd.append(editor.options.imageFieldName || 'upfile', file, file.name || ('blob.' + file.type.substr('image/'.length)));
        fd.append('type', 'ajax');
        var xhr = new XMLHttpRequest();
        xhr.open("post", me.options.imageUrl, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.addEventListener('load', function (e) {
            try{
                var json = (new Function("return " + e.target.response))(),
                    picLink = me.options.imagePath + json.url;
                editor.execCommand('insertimage', {
                    src: picLink,
                    _src: picLink
                });
            }catch(er){ }
        });
        xhr.send(fd);
    }

    if( me.options.dropFileEnabled && window.FormData && window.FileReader) {
        me.addListener('ready', function(){
            //插入粘贴板的图片
            domUtils.on(me.body, 'paste', function (e) {
                var hasImg = false,
                    items = e.clipboardData.items, //获取粘贴板文件列表
                    len = items.length,
                    file;
                while (len--){
                    file = items[len].getAsFile();
                    if(file && file.size > 0 && /image\/\w+/i.test(file.type) ) {
                        sendAndInsertImage(file, me);
                        hasImg = true;
                    }
                }
                hasImg && e.preventDefault();
            });
            //拖拽插入图片
            domUtils.on(me.body, 'drop', function (e) {
                var hasImg = false,
                    items = e.dataTransfer.files, //获取拖放文件列表
                    len = items.length,
                    file;
                while (len--){
                    file = items[len];
                    if(file && file.size > 0 && /image\/\w+/i.test(file.type) ) {
                        sendAndInsertImage(file, me);
                        hasImg = true;
                    }
                }
                hasImg && e.preventDefault();
            });
            //取消拖放图片时出现的文字光标位置提示
            domUtils.on(me.body, 'dragover', function (e) {
                if(e.dataTransfer.types[0] == 'Files') {
                    e.preventDefault();
                }
            });
        });
    }
};