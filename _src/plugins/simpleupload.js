/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register('simpleupload', function (){
    var me = this,
        uploadInput;

    function initUploadBtn(container){
        var wrapper = document.createElement('form'),
            form = document.createElement('form'),
            input = uploadInput = document.createElement('input'),
            iframe = document.createElement('iframe'),
            iframeId = 'edui_iframe_' + (+new Date()).toString(36),
            imageActionUrl = me.getActionUrl(me.getOpt('imageActionName'));

        input.type = 'file';
        input.accept = 'image/*';
        input.name = me.options.imageFieldName;
        input.style.cssText = 'background:red;display:block;width:100%;height:100%;border:0;margin:0;padding:0;' +
            'position:absolute;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;';

        iframe.name = iframe.id = iframeId;
        iframe.style.cssText = 'display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;';

        form.target = iframeId;
        form.method = 'POST';
        form.enctype = 'multipart/form-data';
        form.action = imageActionUrl;
        form.style.cssText = 'display:block;width:100%;height:100%;border:0;margin:0;padding:0;position:absolute;';

        wrapper.className = 'edui-' + me.options.theme;
        wrapper.id = me.ui.id + '_iframeupload';

        form.appendChild(input);
        form.appendChild(iframe);
        wrapper.appendChild(form);
        container.appendChild(form);

        var stateTimer;
        me.addListener('selectionchange', function (type, causeByUi, uiReady) {
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

        domUtils.on(input, 'change', function(){
            var loadingId = 'loading_' + (+new Date()).toString(36);
            var params = utils.serializeParam(me.queryCommandValue('serverparam')) || '';
            me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('simpleupload.loading') || '') + '" >');

            function callback(){
                var link, json, loader, body = (iframe.contentDocument || iframe.contentWindow.contentDocument).body, result = body.innerText || body.textContent || '';
                try{
                    json = (new Function("return " + result))();
                    link = me.options.imageUrlPrefix + json.url;
                    if(json.state == 'SUCCESS' && json.url) {
                        loader = me.document.getElementById(loadingId);
                        loader.setAttribute('src', link);
                        loader.setAttribute('_src', link);
                        loader.removeAttribute('title');
                        loader.removeAttribute('id');
                        domUtils.removeClasses(loader, 'loadingclass');
                    } else {
                        showErrorLoader && showErrorLoader(json.state);
                    }
                }catch(er){
                    showErrorLoader && showErrorLoader(me.getLang('simpleupload.loadError'));
                }
                input.value = '';
                domUtils.un(iframe, 'load', callback);
            }
            function showErrorLoader(title){
                if(loadingId) {
                    var loader = me.document.getElementById(loadingId);
                    domUtils.removeClasses(loader, 'loadingclass');
                    domUtils.addClass(loader, 'loaderrorclass');
                    loader.setAttribute('title', title || '');
                }
            }
            domUtils.on(iframe, 'load', callback);
            form.action = utils.formatUrl(imageActionUrl + (imageActionUrl.indexOf('?') == -1 ? '?':'&') + params);
            form.submit();
            me.focus();
        });
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
                initUploadBtn(container);
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
            "simpleupload":{
                execCommand: function(){
                    uploadInput && uploadInput.click();
                }
            }
        }
    }
});