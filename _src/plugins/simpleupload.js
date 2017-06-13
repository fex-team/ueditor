/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register('simpleupload', function (){
    var me = this,
        isLoaded = false,
        containerBtn;

    function initUploadBtn(){
        var w = containerBtn.offsetWidth || 20,
            h = containerBtn.offsetHeight || 20,
            btnIframe = document.createElement('iframe'),
            btnStyle = 'display:block;width:' + w + 'px;height:' + h + 'px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;';

        domUtils.on(btnIframe, 'load', function(){

            var timestrap = (+new Date()).toString(36),
                wrapper,
                btnIframeDoc,
                btnIframeBody;

            btnIframeDoc = (btnIframe.contentDocument || btnIframe.contentWindow.document);
            btnIframeBody = btnIframeDoc.body;
            wrapper = btnIframeDoc.createElement('div');

            // 将input改为multiple， 同时增加一个taskId， 上传时同时提交到服务器
            wrapper.innerHTML = '<form id="edui_form_' + timestrap + '" target="edui_iframe_' + timestrap + '" method="POST" enctype="multipart/form-data" action="' + me.getOpt('serverUrl') + '" ' +
            'style="' + btnStyle + '">' +
            '<input id="edui_input_' + timestrap + '" type="file" multiple="true" accept="image/*" name="' + me.options.imageFieldName + '" ' + 'style="' + btnStyle + '">' +
            '<input id="task_' + timestrap + '" type="hidden" name="taskId" value="">' +
            '</form>' +
            '<iframe id="edui_iframe_' + timestrap + '" name="edui_iframe_' + timestrap + '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>';

            wrapper.className = 'edui-' + me.options.theme;
            wrapper.id = me.ui.id + '_iframeupload';
            btnIframeBody.style.cssText = btnStyle;
            btnIframeBody.style.width = w + 'px';
            btnIframeBody.style.height = h + 'px';
            btnIframeBody.appendChild(wrapper);

            if (btnIframeBody.parentNode) {
                btnIframeBody.parentNode.style.width = w + 'px';
                btnIframeBody.parentNode.style.height = w + 'px';
            }

            var form = btnIframeDoc.getElementById('edui_form_' + timestrap);
            var input = btnIframeDoc.getElementById('edui_input_' + timestrap);
            var iframe = btnIframeDoc.getElementById('edui_iframe_' + timestrap);
            var task = btnIframeDoc.getElementById('task_' + timestrap);

            domUtils.on(input, 'change', function(){
                if(!input.value) return;
                
                var now =  (+new Date()).toString(36);
                var taskId = "task_" + now;
                task.value=taskId;
                
                var params = utils.serializeParam(me.queryCommandValue('serverparam')) || '';
                var imageActionUrl = me.getActionUrl(me.getOpt('imageActionName'));
                var allowFiles = me.getOpt('imageAllowFiles');
                
                var files = input.files;
                var loadingId = 'loading_' + now;

                me.focus();
                
                for(var i=0; i<files.length; i++){
                    var html = '<img class="loadingclass" id="' + loadingId + '_' + i + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('simpleupload.loading') || '') + '" >';
                    me.execCommand('inserthtml', html);
                }

                var serverUrl = me.getOpt('serverUrl');
                var taskUrl = utils.formatUrl(serverUrl + (serverUrl.indexOf('?') == -1 ? '?':'&') + '&action=query&taskId=' + taskId) ;

                // 查询上传进度： 服务器需要支持 serverUrl?action=query&taskId=xxx , 返回已成功上传的结果， 样例如下:
                // {"0":"http://example.com/xxx0.jpg", "1":"http://example.com/xxx1.jpg"}
                // 当返回的结果size与上传时选定的文件size相等， 表示上传结束
                function uploading(){
                    UE.ajax.request(taskUrl, {
                        'method': 'GET',
                        'async' : 'true',
                        'onsuccess':function(r){
                            try {
                                var data = eval("("+r.responseText+")");
                                var cnt = 0;
                                for(var idx in data){
                                    cnt ++;
                                    var link = data[idx];
                                    var loader = me.document.getElementById(loadingId + '_' + idx);
                                    if(loader){
                                        loader.setAttribute('src', link);
                                        loader.setAttribute('_src', link);
                                        loader.removeAttribute('id');
                                        domUtils.removeClasses(loader, 'loadingclass');
                                    }
                                }

                                // 只要文件未上传完，则每隔1秒调用一次
                                if(cnt<files.length){
                                    setTimeout(function(){
                                        uploading();
                                    }, 1000);
                                }
                            } catch (e) {
                                showErrorLoader && showErrorLoader(me.getLang('simpleupload.loadError'));
                            }
                        },
                        'onerror':function(){
                            showErrorLoader && showErrorLoader(me.getLang('simpleupload.loadError'));
                        }
                    });
                }

                function callback(){
                    try{
                        var  json,
                            body = (iframe.contentDocument || iframe.contentWindow.document).body,
                            result = body.innerText || body.textContent || '';
                        json = (new Function("return " + result))();
                        if(json.state == 'SUCCESS') {
                        } else {
                            showErrorLoader && showErrorLoader(json.state);
                        }
                    }catch(er){
                        showErrorLoader && showErrorLoader(me.getLang('simpleupload.loadError'));
                    }
                    form.reset();
                    domUtils.un(iframe, 'load', callback);
                }

                function showErrorLoader(title){
                    if(loadingId) {
                        var loader = me.document.getElementById(loadingId);
                        loader && domUtils.remove(loader);
                        me.fireEvent('showmessage', {
                            'id': loadingId,
                            'content': title,
                            'type': 'error',
                            'timeout': 4000
                        });
                    }
                }

                /* 判断后端配置是否没有加载成功 */
                if (!me.getOpt('imageActionName')) {
                    errorHandler(me.getLang('autoupload.errorLoadConfig'));
                    return;
                }
                
                // 判断文件格式是否错误
                for(var i=0;i<files.length; i++){
                    var filename = files[i].name,
                        fileext = filename ? filename.substr(filename.lastIndexOf('.')):'';
                    if (!fileext || (allowFiles && (allowFiles.join('') + '.').indexOf(fileext.toLowerCase() + '.') == -1)) {
                        showErrorLoader(me.getLang('simpleupload.exceedTypeError'));
                        return;
                    }
                }

                domUtils.on(iframe, 'load', callback);
                form.action = utils.formatUrl(imageActionUrl + (imageActionUrl.indexOf('?') == -1 ? '?':'&') + params);
                form.submit();
                
                setTimeout(function(){
                    uploading();
                }, 1000);
                
            });

            var stateTimer;
            me.addListener('selectionchange', function () {
                clearTimeout(stateTimer);
                stateTimer = setTimeout(function() {
                    var state = me.queryCommandState('simpleupload');
                    if (state == -1) {
                        input.disabled = 'disabled';
                    } else {
                        input.disabled = false;
                    }
                }, 400);
            });
            isLoaded = true;
        });

        btnIframe.style.cssText = btnStyle;
        containerBtn.appendChild(btnIframe);
    }

    return {
        bindEvents:{
            'ready': function() {
                //设置loading的样式
                utils.cssRule('loading',
                    '.loadingclass{display:inline-block;cursor:default;background: url(\''
                    + this.options.themePath
                    + this.options.theme +'/images/loading.gif\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n' +
                    '.loaderrorclass{display:inline-block;cursor:default;background: url(\''
                    + this.options.themePath
                    + this.options.theme +'/images/loaderror.png\') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;' +
                    '}',
                    this.document);
            },
            /* 初始化简单上传按钮 */
            'simpleuploadbtnready': function(type, container) {
                containerBtn = container;
                me.afterConfigReady(initUploadBtn);
            }
        },
        outputRule: function(root){
            utils.each(root.getNodesByTagName('img'),function(n){
                if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            });
        },
        commands: {
            'simpleupload': {
                queryCommandState: function () {
                    return isLoaded ? 0:-1;
                }
            }
        }
    }
});
