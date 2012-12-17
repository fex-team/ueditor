/**
 * @file tooltips.js
 * @import ui.js
 */
UE.registerEditorWidget('edittips', function(){
    var editor = this,
        editTips = new UE.ui.View.Pop;

    editTips.addClass('edit-tips');
    editTips.setProxyListener('click');

    editor.addListener( 'mouseover', (function(){
        var html = '<nobr>'+editor.getLang("property")
                +': <span data-align="-2" class="edui-clickable">'
                +editor.getLang("default")+'</span>&nbsp;&nbsp;<span data-align="-1" class="edui-clickable">'
                +editor.getLang("justifyleft")+'</span>&nbsp;&nbsp;<span data-align="1" class="edui-clickable">'
                +editor.getLang("justifyright")+'</span>&nbsp;&nbsp;'
                +'<span data-align="2" class="edui-clickable">'+editor.getLang("justifycenter")+'</span>'
                +' <span data-align="edit" class="edui-clickable">'+editor.getLang("modify")+'</span></nobr>';
        return function ( t, evt ) {
            var el = evt.target || evt.srcElement;
            if ( /iframe/ig.test( el.tagName ) ) {
                editTips.dom.innerHTML = html;
                editor._iframe = el;
                editTips.show(el);
            }
        }
    })() );

    editor.addListener( 'selectionchange', (function(){
        return function ( t, causeByUi ) {
            if ( !causeByUi ) return;
            var html = '',
                tar = editor.selection.getRange().getClosedNode();
            if ( tar && tar.tagName == 'IMG' ) {
                var dialogName = 'insertimage',
                    clasname = tar.className,
                    imgsrc = tar.src,
                    temp;
                if(-1 !== clasname.indexOf('edui-faked') ){
                    dialogName = {'edui-faked-video': 'insertvideo', 'edui-faked-webapp':'webapp'}[clasname];
                }else if( (temp=/(api\.map\.baidu)|(maps\.google)/.exec(imgsrc) ) !== null ){
                    dialogName = {'api.map.baidu': 'map', 'maps.google': 'gmap'}[temp];
                }else if ( tar.getAttribute( "word_img" ) ) {
                    //todo 放到dialog去做查询
                    editor.word_img = [tar.getAttribute( "word_img" )];
                    dialogName = "wordimage";
                }else if ( tar.getAttribute( "anchorname" ) ) {
                    dialogName = "anchor";
                    html = '<nobr>'+editor.getLang("property")+': <span data-action="edit?anchor" class="edui-clickable">'+editor.getLang("modify")+'</span>&nbsp;&nbsp;' +
                        '<span data-action="delete?anchor" class="edui-clickable">'+editor.getLang("delete")+'</span></nobr>';
                }
                !html && (html = '<nobr>'+editor.getLang("property")+': <span data-action="float?none" class="edui-clickable">'+editor.getLang("default")+'</span>&nbsp;&nbsp;' +
                    '<span data-action="float?left" class="edui-clickable">'+editor.getLang("justifyleft")+'</span>&nbsp;&nbsp;' +
                    '<span data-action="float?right" class="edui-clickable">'+editor.getLang("justifyright")+'</span>&nbsp;&nbsp;' +
                    '<span data-action="float?center" class="edui-clickable">'+editor.getLang("justifycenter")+'</span>&nbsp;&nbsp;' +
                    '<span data-action="edit?' + dialogName + '" class="edui-clickable">'+editor.getLang("modify")+'</span></nobr>' );
            }else {
                tar = domUtils.findParentByTagName( editor.selection.getStart(), "a", true );
                var url;
                if ( tar && (url = (tar.getAttribute( 'data_ue_src' ) || tar.getAttribute( 'href', 2 ))) ) {
                    var txt = url;
                    if ( url.length > 30 ) {
                        txt = url.substring( 0, 20 ) + "...";
                    }
                    if ( html ) {
                        html += '<div style="height:5px;"></div>'
                    }
                    html += '<nobr>'+editor.getLang("anthorMsg")+': <a target="_blank" href="' + url + '" title="' + url + '" >' + txt + '</a>' +
                        ' <span class="edui-clickable" data-action="edit?link">'+editor.getLang("modify")+'</span>' +
                        ' <span class="edui-clickable" data-action="delete?unlink"> '+editor.getLang("clear")+'</span></nobr>' ;
                }
            }
            if(html){
                editTips.dom.innerHTML = html;
                editTips.show(tar);
            }
        }
    })() );

    editTips.addListener('click', function(t, evt){
        var iframeactions = {'-2': '', '-1': 'left', '1': 'right', '2': 'middle'},
                tar = evt.target||evt.srcElement,
            align = tar.getAttribute('data-align')||tar.getAttribute('data-action');
        if(align){
            if(align.indexOf("?")!=-1){
                var tmp = align.split('?');
                switch(tmp[0]){
                    case 'float':
                        editor.execCommand( "imagefloat", tmp[1] );
                        break;
                    case 'edit':
                        UE.getDialog(editor).open(tmp[1]);
                        break;
                    case 'delete':
                        editor.execCommand( tmp[1] );
                        break;
                }
            }else{
                align in iframeactions ? el.setAttribute('align', iframeactions[align]) : UE.getDialog(editor).open('insertframe');
            }
            editTips.hide();
        }
    });
});
