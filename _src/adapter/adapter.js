/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {};
    function parseMenu(data){

    }
    utils.extend(UE, {
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },
        getActiveEditor: function () {
            var ac;
            utils.each(UE.instants, function (editor) {
                if (editor.selection.isFocus()) {
                    ac = editor;
                    return false;
                }
            });
            return ac;
        },
        getEditor: function (id, options) {
            var editor = _editors[id] || new UE.Editor(options);

        },
        createUI: function (editor) {

        }

    })


})();


