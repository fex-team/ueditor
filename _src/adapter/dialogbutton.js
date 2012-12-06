/**
 * @file dialog_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['insertimage', 'searchreplace', 'gmap', 'insertvideo', 'attachment', 'map', 'gmap', 'insertframe','highlightcode', 'link', 'anchor', 'spechars', 'scrawl', 'webapp', 'template', 'background', 'wordimage', 'help', 'edittd'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.Button(name);

        btn.addListener('click', function(){
            var dlg = UE.getDialog(editor);
            dlg.open(name);
        });
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });

        return btn;
    }
);