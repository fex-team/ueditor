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
            'core/Editor.js',
            'core/ajax.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'plugins/basestyle.js',
            'plugins/inserthtml.js',
            'plugins/list.js',
            'plugins/font.js',
            'ui/widget.js',
            'ui/jq.extend.js',
            'ui/button.js',
            'ui/toolbar.js',
            'ui/menu.js',
            'ui/dropmenu.js',
            'ui/contextmenu.js',
            'ui/splitbutton.js',
            'ui/popup.js',
            'ui/colorpicker.js',
            'ui/tablepicker.js',
            'ui/combobox.js',
            'ui/modal.js',
            'ui/tooltip.js',
            'ui/tab.js',
            'adapter/adapter.js',
            'adapter/button.js',
            'adapter/list.js',
            'adapter/tablepicker.js',
            'adapter/fontfamily.js'
        ],
        baseURL = '../_src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
