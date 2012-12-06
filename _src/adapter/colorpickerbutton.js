/**
 * @file color_picker_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['forecolor', 'backcolor'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            picker = new uiView.ColorPicker(editor.ui, name);

        btn.setArrowRelPop(picker);
        picker.addListener('setcolor', function(t, val){
            editor.execCommand(name, val );
            var cont = btn.getInnerDom('content');
            if(val==='default'){
                cont.style.borderColor = 'transparent';
                btn.color = 'default';
            }else{
                cont.style.borderColor = btn.color = val;
            }
        });

        btn.addListener('click', function(){editor.execCommand(name, btn.color)} );
        editor.addListener('click', function(){picker.hide()});
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });

        return btn;
    }
);