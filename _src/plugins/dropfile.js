///import core
///import plugins/undo.js
/**
 * @description 拖放文件到编辑区域，上传并插入到光标处
 * @author Jinqn
 * @date
 */
UE.plugins['dropfile'] = function() {
    var me = this,
        dropFileEnabled = me.options.dropFileEnabled;
    if(dropFileEnabled!==false) dropFileEnabled = true;
    if(dropFileEnabled) {
        me.addListener('ready', function(){
            domUtils.on(me.body, 'drop', function (e) {
                //获取文件列表
                var fileList = e.dataTransfer.files;
                var hasImg = false;
                if(fileList) {
                    for(var i = 0; i<fileList.length; i++) {
                        var f = fileList[i];
                        if (/^image/.test(f.type)) {
                            var xhr = new XMLHttpRequest();
                            xhr.open("post", me.options.imageUrl, true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                            //模拟数据
                            var fd = new FormData();
                            fd.append(me.options.imageFieldName || 'upfile', f);
                            fd.append('type', 'ajax');

                            xhr.send(fd);
                            xhr.addEventListener('load', function (e) {
                                try{
                                    var json = (new Function("return " + e.target.response))(),
                                        picLink = me.options.imagePath + json.url;
                                    me.execCommand('insertimage', {
                                        src: picLink,
                                        _src: picLink
                                    });
                                }catch(er){ }
                            });
                        }
                        hasImg = true;
                    }
                    if(hasImg) e.preventDefault();
                }
            });
            domUtils.on(me.body, 'dragover', function (e) {
                if(e.dataTransfer.types[0] == 'Files') {
                    e.preventDefault();
                }
            });
        });
    }
};