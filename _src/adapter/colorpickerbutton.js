/**
 * @file color_picker_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['forecolor', 'backcolor'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            picker = UE.getColorPicker(editor, name);

        btn.onopen = function(){
            picker.show(this.dom);
            picker.onsetcolor = function(t,color){
                editor.execCommand(name, color );
                var cont = btn.getInnerDom('content');
                btn.color = cont.style.borderColor = color==='default'?'transparent':color;
            }
        };
        btn.addListener('click', function(){editor.execCommand(name, btn.color)} );
        editor.addListener("click",function(){
            picker.hide()
        });
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
        });

        return btn;
    }
);