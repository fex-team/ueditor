/**
 * @file similar_button.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    ['directionalityltr', 'directionalityrtl','imagenone', 'imageleft', 'imageright', 'imagecenter','justifyleft', 'justifycenter', 'justifyright', 'justifyjustify'],
    function(editor, name){
        var btn = new UE.ui.View.Button(name),
            ret = name.match(/(image|justify|directionality)(.*)/);

        if(3 === ret.length){
            var cmd = ret[1]==='image'?'imagefloat':ret[1];
            btn.addListener('click', function(){
                editor.execCommand(cmd, ret[2]);
            });

            editor.addListener('selectionchange', function(){
                var state = editor.queryCommandState(cmd);

                if(-1 !== state){
                    state = editor.queryCommandValue(cmd) === name.replace(ret[1], '') ? 1 : 0;
                }
                btn.reflectState(btn.state=state);
            });
        }

        return btn;
    }
);