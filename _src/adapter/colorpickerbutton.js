/**
 * @file color_picker_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['forecolor', 'backcolor'],
    function(editor, name){
        var uiView = UE.ui.View,
            btn = new uiView.ArrowButton(name),
            picker = UE.getColorPicker(editor);

        btn.onopen = function(){
            picker.show(this.dom);
            picker.onsetcolor = function(t,color){
                editor.execCommand(name, color );
                var cont = btn.getInnerDom('content');
                if(color=="default"){
                    color = 'transparent';
                    cont.style.cssText = "border-bottom:2px solid "+color+";_border-color:tomato;_filter:chroma(color=tomato);";
                }else{
                    cont.style.cssText = "border-bottom:2px solid "+color;
                }
                btn.color = color;
            }
        };
        btn.addListener('click', function(){
            editor.execCommand(name, btn.color||"default")
        } );

        editor.addListener("click",function(){
            picker.hide()
        });
        editor.addListener('selectionchange', function(){
            var state = editor.queryCommandState(name);
            btn.state!==state && btn.reflectState(btn.state=state);
//            var color = editor.queryCommandValue(name);
//            var cont = btn.getInnerDom('content');
//            btn.color = cont.style.borderColor = color==='default'?'transparent':color;
        });

        return btn;
    }
);