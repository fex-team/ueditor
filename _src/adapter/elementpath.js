/**
 * @file elementpath.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'elementpath',
    function(editor, name){
        var btn = new UE.ui.View({viewType: 'elementpath', viewText:'<div id="{ID}-wraper"></div>', viewHtmlTag:'div'});

        btn.setProxyListener('click');
        btn.addListener('click', function(type,evt){
            var evt = evt || event,
                el = evt.srcElement||evt.target;
            if(el.getAttribute("_val")){
                editor.execCommand('elementpath', el.getAttribute("_val"));
            }
        });

        editor.addListener('render', function(){
            var epwarp = btn.getInnerDom("wraper");

            if(editor.options.elementPathEnabled){
                editor.addListener("selectionchange",function(){
                    var els = editor.queryCommandValue(name);
                    var buff = [];
                    for ( var i = 0, ci; ci = els[i]; i++ ) {
                        buff[i] = '<span unselectable="on" _val="'+i+'">' + ci + '</span>' ;
                    }
                    epwarp.innerHTML = editor.getLang("elementPathTip")+":"+buff.join(' &gt; ' );
                })
            }else{
                epwarp.style.display = "none";
            }
        });

        return btn;
    }
);