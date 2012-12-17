/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function(){
    var utils = UE.utils,
        _editorui = {},
        instances = {},
        _editorWidget = {};

    /**
     * @name registerEditorui
     * @desc 注册一个（组）编辑器按钮
     */
    UE.registerEditorui = function(names, fn){
        names = utils.isArray(names) ? names : [names];
        var len = names.length;
        while(len--){
            _editorui[names[len]] = fn;
        }
    };

    /**
     *
     * @name registerEditorWidget
     * @desc 注册编辑器挂件
     */
    UE.registerEditorWidget = function(name, fn){
        _editorWidget[name] = fn;
    };

    /**
     * @name getDialog
     * @desc 返回公用的dialog
     * @grammar UE.getDialog()
     * */
    UE.getDialog = function(editor){
        var dlg = UE.dialog,
            uiView = UE.ui.View;
        if(!dlg||dlg instanceof UE.ui.View.Pop){
            dlg = new uiView.Dialog(editor.ui);
        }
        dlg.editor = editor;
        UE.dialog = dlg;
        return dlg;
    };
    /**
     * @name getColorPicker
     * @desc 返回公用的colorpicker
     * @grammar UE.getColorPicker()
     * */
    UE.getColorPicker = function(editor){
        var cp = UE.colorpicker,
            uiView = UE.ui.View;
        if(!cp){
            cp = new uiView.ColorPicker(editor.ui);
        }
        UE.colorpicker = cp;
        return cp;
    };
    /**
     * @name getEditor
     * @desc 返回一个包装过的editor实例
     * @grammar UE.getEditor(options, renderId) //options-同配置文件， renderId-自动渲染时的元素id
     */
    UE.getEditor = function(id,options){
        var editor= {},oldRender,aui;
        if(UE.utils.isString(id)){
            //字符串
            editor = instances[id];
            if (!editor) {
                editor = instances[id] = new baidu.editor.Editor( options);
                oldRender = editor.render;
                aui = editor.ui = new UE.ui(editor);
                !!id && newrender(id);
                utils.loadFile(document, {
                    href:editor.options.themePath + editor.options.theme + "/_css/ueditor.css",
                    tag:"link",
                    type:"text/css",
                    rel:"stylesheet"
                });
            }
        }else{
            //元素
        }
        function newrender ( holder ) {
            if(!(holder=document.getElementById(holder))){
                alert('cannot render editor in '+holder);
                return false;
            }

            UE.utils.domReady( function () {
                editor.langIsReady ? renderui() : editor.addListener( "langReady", renderui);

                function renderui() {
                    UE.adapt(editor, aui);//adapt after language loaded
                    var editorOptions = editor.options;
                    editor.setOpt({
                        labelMap:editorOptions.labelMap||UE.I18N[editorOptions.lang].labelMap
                    });

                    if ( /script|textarea/i.test( holder.tagName ) ) {
                        var newDiv = document.createElement( 'div'),
                            cont = holder.value || holder.innerHTML;

                        !/^[\t\r\n ]*$/.test( cont ) && (editorOptions.initialContent=cont);

                        //so as follows, what about other attributes?
                        newDiv.id = holder.id;
                        editor.key = holder.id
                        holder.className && (newDiv.className = holder.className);
                        holder.style.cssText && (newDiv.style.cssText = holder.style.cssText);
                        editorOptions.textarea = holder.getAttribute( 'name' )||'';

                        if ( 'textarea' === holder.tagName.toLowerCase() ) {
                            holder.style.display = 'none';
                            editor.textarea = holder;
                            holder.parentNode.insertBefore( newDiv, holder );
                        } else {
                            holder.parentNode.replaceChild( newDiv, holder );
                        }
                    }

                    aui.render( newDiv||holder );
                    editor.container = aui.wrapper.dom;
                    editor.container.style.zIndex = editorOptions.zIndex;
                    oldRender.call( editor, aui.editorHolder.dom );
                    editor.fireEvent('render');

                    oldRender = aui = holder = newDiv = renderui = null;
                }
            } )
        }
        return editor;
    };
    UE.delEditor = function (id) {
        var editor;
        if (editor = instances[id]) {
            editor.key && editor.destroy();
            delete instances[id]
        }
    }
    /**
     * @name adapt
     * @desc 适配editor和ui
     * @grammar UE.adapt(editor, ui.bak)
     */
    UE.adapt = function(editor, ui){
        var uiView = UE.ui.View,
            editorOptions = editor.options;

        ui.getButton = function(name){
            var btn = name in _editorui ? _editorui[name](editor, name) : new uiView({viewType: name.toLowerCase()} );

            btn.setTips( editorOptions['labelMap'][name] || editor.getLang("labelMap."+name) || name );
            return btn;
        };

        /**
         * @name getIframeUrlByCmd
         * @desc 通过options配置的cmd获取iframe的url
         * @grammar ui.getIframeUrlByCmd(cmd)
         */
        ui.getIframeUrlByCmd = function(cmd){
            var iframeUrlMap = {
                'anchor':'~/dialogs/anchor/anchor.html',
                'insertimage':'~/dialogs/image/image.html',
                'inserttable':'~/dialogs/table/table.html',
                'link':'~/dialogs/link/link.html',
                'spechars':'~/dialogs/spechars/spechars.html',
                'searchreplace':'~/dialogs/searchreplace/searchreplace.html',
                'map':'~/dialogs/map/map.html',
                'gmap':'~/dialogs/gmap/gmap.html',
                'insertvideo':'~/dialogs/video/video.html',
                'help':'~/dialogs/help/help.html',
                'highlightcode':'~/dialogs/highlightcode/highlightcode.html',
                'emotion':'~/dialogs/emotion/emotion.html',
                'wordimage':'~/dialogs/wordimage/wordimage.html',
                'attachment':'~/dialogs/attachment/attachment.html',
                'insertframe':'~/dialogs/insertframe/insertframe.html',
                'edittd':'~/dialogs/table/edittd.html',
                'webapp':'~/dialogs/webapp/webapp.html',
                'snapscreen':'~/dialogs/snapscreen/snapscreen.html',
                'scrawl':'~/dialogs/scrawl/scrawl.html',
                'template':'~/dialogs/template/template.html',
                'background':'~/dialogs/background/background.html'
            },
            url = (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd];

            return url ? url.replace( '~/', editor.options.UEDITOR_HOME_URL || '' ) : '';
        };

        /**
         * @name getDialogTitleByCmd
         * @desc 通过options配置的cmd
         * @grammar ui.getDialogTitleByCmd(cmd)
         */
        ui.getDialogTitleByCmd = function(cmd){
            return editor.options.labelMap[cmd] || editor.getLang( "labelMap." + cmd ) || '';
        }

        /**
         * @name getLang
         * @desc 获取多语言文字
         * @grammar ui.getLang("ok") //英文返回ok 中文返回确定
         */
        ui.getLang = function(text){
            return editor.getLang(text);
        }

        /**
         * @name getEditorOptions
         * @desc 获取editor的选项值
         * @grammar ui.getEditorOptions("focus") //获取editor配置项focus的值
         */
        ui.getEditorOptions = function(opt){
            return editor.options[opt];
        }

        var widgets = editorOptions.widgets,
            len = widgets.length;

        while(len--){
            widgets[len] in _editorWidget && _editorWidget[ widgets[len] ].call(editor);
        }

    };

})();


