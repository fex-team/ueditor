/**
 * @file rowspacing_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['rowspacingtop', 'rowspacingbottom'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            menu = new uiView.Menu(editor.ui, name),
            cmd = 'rowspacing',
            dir = name.replace(cmd, '');

        btn.onopen = function(){
            menu.show(this.dom);
        }
        btn.addListener('click', function(){
            editor.execCommand(cmd, btn.value, dir);
        });

        menu.addListener('select', function(t, val){
            editor.execCommand(cmd, val, dir);
            btn.value = val;
        });

        editor.addListener('click', function(){menu.hide()});

        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(cmd, dir);

            btn.state!==state && btn.reflectState(btn.state=state);
            if(-1 !== state){
                menu.setValue( editor.queryCommandValue(cmd, dir) );
            }
        });

        return btn;
    }
);