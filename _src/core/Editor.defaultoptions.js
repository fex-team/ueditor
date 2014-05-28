//维护编辑器一下默认的不在插件中的配置项
UE.Editor.defaultOptions = function(editor){

    return {
        isShow: true,
        initialContent: '',
        initialStyle:'',
        autoClearinitialContent: false,
        iframeCssUrl: editor.options.UEDITOR_HOME_URL + 'themes/iframe.css',
        textarea: 'editorValue',
        focus: false,
        focusInEnd: true,
        autoClearEmptyNode: true,
        fullscreen: false,
        readonly: false,
        zIndex: 999,
        imagePopup: true,
        enterTag: 'p',
        customDomain: false,
        lang: 'zh-cn',
        langPath: editor.options.UEDITOR_HOME_URL + 'lang/',
        theme: 'default',
        themePath: editor.options.UEDITOR_HOME_URL + 'themes/',
        allHtmlEnabled: false,
        scaleEnabled: false,
        tableNativeEditInFF: false,
        autoSyncData : true,
        fileNameFormat: '{time}{rand:6}'
    }
};