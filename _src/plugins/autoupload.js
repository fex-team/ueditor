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

        //插入loading的占位图片
        var loadingId = 'loading_' + (+new Date()).toString(36);
        if (filetype == 'image') {
            editor.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + editor.options.themePath + editor.options.theme +'/images/spacer.gif" title="' + (editor.getLang('loading') || '') + '" >');

            setTimeout(function(){
                var loader = editor.document.getElementById(loadingId);
                loader && (loader.style.display = 'inline-block');
                var rng = editor.selection.getRange();
                loader && rng.setStartAfter(loader).collapse(true).select();
            }, 100);

            function showErrorLoader(title){
                if(loadingId) {
                    var loader = editor.document.getElementById(loadingId);
                    domUtils.removeClasses(loader, 'loadingclass');
                    domUtils.addClass(loader, 'loaderrorclass');
                    loader.setAttribute('title', title || '');
                }
            }
        }

        xhr.open("post", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xhr.addEventListener('load', function (e) {
            try{
                var json = (new Function("return " + utils.trim(e.target.response)))();
                if (json.state == 'SUCCESS' && json.url) {
                    var link = editor.getOpt(filetype + 'UrlPrefix') + json.url,
                        loader = editor.document.getElementById(loadingId);
                    if (filetype == 'image') {
                        loader.setAttribute('src', link);
                        loader.setAttribute('_src', link);
                        domUtils.removeClasses(loader, 'loadingclass');
                    } else {
                        editor.execCommand('insertfile', {
                            url: link
                        })
                    }
                } else {
                    showErrorLoader && showErrorLoader(json.state);
                }
            }catch(er){
                showErrorLoader && showErrorLoader(editor.getLang('loadError'));
            }
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
        outputRule: function(root){
            utils.each(root.getNodesByTagName('img'),function(n){
                if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            })
        },
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

                    //设置loading的样式
                    utils.cssRule('loading',
                        '.loadingclass{display:inline-block;cursor:default;background: url(\''
                            + this.options.themePath
                            + this.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-left:1px;height: 22px;width: 22px;}\n' +
                            '.loaderrorclass{display:inline-block;cursor:default;background: url(\''
                            + this.options.themePath
                            + this.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
                            '}',
                        this.document);
                }
            }
        }
    }
});