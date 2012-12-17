/**
 * @file simple_button.js
 * @import adapter/adapter.js
 */

UE.registerEditorui(
    ['bold', 'italic', 'redo', 'undo', 'source', 'underline', 'strikethrough', 'superscript', 'subscript', 'pagebreak', 'deletetable', 'insertrow', 'deleterow', 'removeformat', 'cleardoc', 'selectall', 'formatmatch', 'pasteplain', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'unlink', 'date', 'time', 'horizontal', 'blockquote', 'indent', 'touppercase', 'tolowercase', 'snapscreen', 'print', 'preview'],
    function(editor, name){
        var btn = new UE.ui.View.Button(name);

        btn.addListener('click', function(){
            editor.execCommand(name);
        });

        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });

        return btn;
    }
);
