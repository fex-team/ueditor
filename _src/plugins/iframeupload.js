/**
 * @description
 * 简单上传:点击按钮,直接选择文件上传
 * @author Jinqn
 * @date 2014-03-31
 */
UE.plugin.register('iframeupload', function (){
    var me = this,
        uploadInput;

    function initUploadBtn(){
        var container = me.container,
            wrapper = document.createElement('form'),
            form = document.createElement('form'),
            input = uploadInput = document.createElement('input'),
            iframe = document.createElement('iframe'),
            iframeId = 'edui_iframe_' + (+new Date()).toString(36),
            loadingId;

        input.type = 'file';
        input.name = me.options.imageFieldName;
        input.style.cssText = 'display:none;width:0px;height:0px;border:0;margin:0;padding:0;position:absolute;';

        iframe.name = iframe.id = iframeId;
        iframe.style.cssText = 'display:none;width:0px;height:0px;border:0;margin:0;padding:0;position:absolute;';

        form.target = iframeId;
        form.method = 'POST';
        form.enctype = 'multipart/form-data';
        form.action = me.getActionUrl(me.getOpt('imageActionName'));
        form.style.cssText = 'width:20px;height:20px;margin:0;padding:0;position:relative;';

        wrapper.className = 'edui-' + me.options.theme;
        wrapper.id = me.ui.id + '_iframeupload';

        form.appendChild(input);
        form.appendChild(iframe);
        wrapper.appendChild(form);
        container.appendChild(form);

        domUtils.on(input, 'change', function(){
            var loadingId = 'loading_' + (+new Date()).toString(36);
            me.execCommand('inserthtml', '<img class="loadingclass" id="' + loadingId + '" src="' + me.options.themePath + me.options.theme +'/images/spacer.gif" title="' + (me.getLang('loading') || '') + '" >');

            function callback(){
                var link, json, loader, result = (iframe.contentDocument || iframe.contentWindow.contentDocument).body.innerHTML;
                try{
                    json = (new Function("return " + result))();
                    link = me.options.imageUrlPrefix + json.url;
                    if(json.state == 'SUCCESS' && json.url) {
                        loader = me.document.getElementById(loadingId);
                        loader.setAttribute('src', link);
                        loader.setAttribute('_src', link);
                        domUtils.removeClasses(loader, 'loadingclass');
                    } else {
                        showErrorLoader && showErrorLoader(json.state);
                    }
                }catch(er){
                    showErrorLoader && showErrorLoader(me.getLang('loadError'));
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
            form.submit();
        });
    }

    return {
        bindEvents:{
            /* 初始化简单上传按钮 */
            'ready': function(){
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

                initUploadBtn();
            }
        },
        outputRule: function(root){
            utils.each(root.getNodesByTagName('img'),function(n){
                if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr('class'))) {
                    n.parentNode.removeChild(n);
                }
            })
        },
        commands: {
            "iframeupload":{
                execCommand: function(){
                    uploadInput && uploadInput.click();
                }
            }
        }
    }
});