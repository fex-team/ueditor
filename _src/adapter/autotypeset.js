/**
 * @file autotypeset.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'autotypeset',
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            typeset = new uiView.AutoTypeset(editor.ui);

        btn.onopen = function(){
            typeset.show(this.dom);
        }
        typeset.addListener('setoption', function(t, opt){
            editor.execCommand(name, opt);
        });

        btn.addListener('click', function(){
            editor.execCommand(name);
        });
        editor.addListener('click', function(){typeset.hide()});
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });

        return btn;
    }
);