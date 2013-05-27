/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function(){
    var _editorUI = {};
    UE.registerUI = function(name,fn){
        _editorUI[name] = fn;
    }

})();


