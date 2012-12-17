/**
 * @file insert_table.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'inserttable',
    function(editor, name){
        var uiView = UE.ui.View,
            ui = editor.ui,
            btn = new uiView.ArrowButton(name),
            table = new uiView.Tableset(ui),
            cmd = 'inserttable';

        btn.onopen = function(){
            table.show(this.dom);
        }
        table.addListener(cmd, function(t, prop){
            editor.execCommand(cmd , prop );
        } );
        btn.addListener('click', function(){
            UE.getDialog(editor).open(name);
        });
        editor.addListener('click', function(){table.hide()});
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            if(btn.state!==state){
                btn.reflectState(btn.state=state);
                var arrow = btn.arrow;
                arrow.reflectState(arrow.state=state);
            }
        });

        return btn;
    }
);