/**
 * @file wordcount.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'wordcount',
    function(editor, name){
        var btn = new UE.ui.View({viewType: 'wordcount', viewText:'<div id="{ID}-wraper"></div>', viewHtmlTag:'div'});

        editor.addListener('render', function(){
            var wcwrap = btn.getInnerDom("wraper");
            if(editor.options.wordCount){
                editor.addListener('selectionchange', function(){
                    wcwrap.innerHTML = editor.getLang("wordCountTip")+":"+editor.queryCommandValue( name );
                });
            }else{
                wcwrap.style.display = "none";
            }
        });

        return btn;
    }
);