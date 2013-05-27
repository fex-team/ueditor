/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function(){
    var _editorUI = {};
    UE.registerUI = function(name,fn){
        utils.each(name.split(/\s+/),function(uiname){
            _editorUI[uiname] = fn;
        })
    };

    UE.getActiveEditor = function(){
        var ac;
        utils.each(UE.instants,function(editor){
            if(editor.selection.isFocus()){
                ac = editor;
                return false;
            }
        })
        return ac;
    }


})();


