/**
 * 开发版本的文件导入
 */
(function (){
    var paths  = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'extend/core/Editor.js',
            'core/ajax.js',
            'core/filterword.js',
            'extend/core/wk-config.js',//文库配置
            'extend/core/node.js',//文库扩展
            'core/htmlparser.js',
            'core/filternode.js',
            'extend/core/SourceParser.js',//文库parse支持
            'extend/core/bdjson.js', //内容to bdjson支持
            'extend/plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'extend/plugins/autotypeset.js',
            'extend/plugins/image.js',
            'extend/plugins/justify.js', //文库文本对齐
            'extend/plugins/font.js', //文库加粗、斜线、下划线、字体颜色、字体大小
            'extend/plugins/blockquote.js',
            'extend/plugins/indent.js', //文库缩进插件
            'extend/plugins/noindent.js',
            'plugins/paragraph.js',
            'extend/plugins/wenku/baseextend.js',//文库 向上合并 插件
            'plugins/wordcount.js',
            'plugins/pagebreak.js',
            'plugins/undo.js',
            'plugins/paste.js',     //粘贴时候的提示依赖了UI
            'plugins/list.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/autoheight.js',
            'plugins/fiximgclick.js',
            'extend/plugins/autofloat.js',  //依赖UEditor UI,在IE6中，会覆盖掉body的背景图属性
            'plugins/puretxtpaste.js',
            'plugins/insertparagraph.js',
            'extend/plugins/searchreplace.js',
            'extend/plugins/wenku/input/classname-filter.js', //文库输入className过滤器
            'extend/plugins/wenku/output/classname-filter.js', //文库输出className过滤器
            'extend/plugins/wenku/output/empty-filter.js', //空节点输出过滤
            'extend/plugins/remark.js', //添加和修改注释
            'extend/plugins/fullscreenmark.js', //添加全屏标记
            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'extend/ui/colorpicker.js',
            'ui/tablepicker.js',
            'ui/stateful.js',
            'ui/button.js',
            'ui/splitbutton.js',
            'ui/colorbutton.js',
            'ui/tablebutton.js',
            'extend/ui/autotypesetpicker.js',
            'ui/autotypesetbutton.js',
            'ui/cellalignpicker.js',
            'ui/pastepicker.js',
            'ui/toolbar.js',
            'ui/menu.js',
            'ui/combox.js',
            'ui/dialog.js',
            'ui/menubutton.js',
            'extend/ui/editorui.js',//加载文库所需ui
            'extend/ui/editor.js',
            'ui/multiMenu.js',
            'ui/shortcutmenu.js',
            'ui/breakline.js'
        ],
        baseURL = 'ueditor/_src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
