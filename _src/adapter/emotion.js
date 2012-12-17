/**
 * @file emotion.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'emotion',
    function(editor, name){
        var uiView = UE.ui.View,
            ui = editor.ui,
            btn = new uiView.Button(name),
            pop;
        btn.addListener('click', function(){
            if(!pop||!pop.dom){
                pop = new uiView.Pop({viewText: '<iframe id="{ID}-iframe" src="'+ ui.getIframeUrlByCmd(name) +'" frameborder="0" width="100%" height="100%"></iframe>'});
                pop.ui = ui;
                pop.className = 'edui-dialog-'+name;
                pop.addClass('edui-pop-' + name);
                pop.addListener('render', function(){
                    pop.editor = editor;
                    UE.getDialog(editor).destroy();
                    UE.dialog = pop;
                });
            }
            pop.show(btn.dom);
        });
        editor.addListener('click', function(){
            pop&&pop.hide()
        });
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });
        return btn;
    }
);