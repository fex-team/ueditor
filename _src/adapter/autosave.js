UE.registerUI('autosave', function(editor) {
    editor.on('afterautosave',function(eventname){
        editor.trigger('showmessage',editor.getLang('autosave.success'))
    })

});
