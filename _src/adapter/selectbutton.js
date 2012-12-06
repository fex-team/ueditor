/**
 * @file select_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['fontfamily', 'fontsize', 'paragraph', 'customstyle'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name, {viewType: 'selectbox'}),
            menu = new uiView.Menu(editor.ui, name);

        btn.addListener('click', function(){menu.show(btn.dom)} );

        menu.addListener('select', function(t, val){
            editor.execCommand(name, val);
        });

        editor.addListener('click', function(){menu.hide()});

        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
            if(state !== -1){
                var val = editor.queryCommandValue(name) || name;
                switch(name){
                    case 'fontsize': val = parseInt(val)+'px'; break;
                    case 'fontfamily': val = val.split(',')[0].replace(/['"]/g,''); break;
                    case 'paragraph': val = menu.getTextByValue(val).replace(/<\/?.*?>/g, '')||val; break;
                }
                btn.getInnerDom('content').innerHTML = val;
            }
        });

        return btn;
    }
);