/**
 * @file similar_arrowbutton.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['lineheight', 'insertorderedlist', 'insertunorderedlist'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            menu = new uiView.Menu(editor.ui, name);

        btn.setArrowRelPop(menu);
        btn.addListener('click', function(){
            editor.execCommand(name, btn.value);
        });

        menu.addListener('select', function(t, val){
            editor.execCommand(name, val);
            btn.value = val;
        });

        editor.addListener('click', function(){menu.hide()});

        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
            state !== -1 && menu.setValue( editor.queryCommandValue(name) );
        });

        return btn;
    }
);