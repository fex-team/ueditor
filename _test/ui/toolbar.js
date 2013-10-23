/**
* Created by JetBrains PhpStorm.
* User: dongyancen
* Date: 12-4-12
* Time: 下午4:46
* To change this template use File | Settings | File Templates.
*/
module( 'ui.toolbar' );
test( 'toolbar显示', function() {
    var editor = new baidu.editor.ui.Editor();
    var toolbar =[ 'link','unlink','|'];
    baidu.editor.ui['link'] = function (cmd){
            return function (editor, title){
                var ui = new baidu.editor.ui.Button({
                    className: 'edui-for-' + cmd,
                    title: title || editor.options.labelMap || editor.getLang('labelMap') || '',
                    onclick: function (){
                        editor.execCommand(cmd);
                    },
                    showText: false,
                    editor:editor
                });
                editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if(!uiReady){
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
    }('link');
    baidu.editor.ui['unlink'] = function (cmd){
            return function (editor, title){
                var ui = new baidu.editor.ui.Button({
                    className: 'edui-for-' + cmd,
                    title: title || editor.options.labelMap || editor.getLang('labelMap')  || '',
                    onclick: function (){
                        editor.execCommand(cmd);
                    },
                    showText: false,
                    editor:editor
                });
                editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if(!uiReady){
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
    }('unlink');


    var toolbarUi = new baidu.editor.ui.Toolbar({theme:editor.options.theme});
    for ( var j = 0; j < toolbar.length; j++ ) {
    var toolbarItem = toolbar[j].toLowerCase();
    var toolbarItemUi = null;
    if ( typeof toolbarItem == 'string' ) {
        if ( toolbarItem == '|' ) {
            toolbarItem = 'Separator';
        }
        if ( baidu.editor.ui[toolbarItem] ) {
            toolbarItemUi = new baidu.editor.ui[toolbarItem]( editor );
        }
        } else {
            toolbarItemUi = toolbarItem;
        }
        if ( toolbarItemUi ) {
            toolbarUi.add( toolbarItemUi );
        }
    }

    var theme = ' edui-'+editor.options.theme;
    toolbarUi.render(te.dom[0]);
    toolbarUi.postRender();
    var toolbarShow  = document.getElementById('editor').firstChild;

    equal(toolbarShow.className,'edui-toolbar  '+theme,'检查toolbar的显示');
    equal(toolbarShow.childNodes.length ,toolbar.length,'检查toolbar的显示');
    for(var i=0;i<toolbar.length;i++){
        if(toolbar[i] =='|'){
            equal(toolbarShow.childNodes[i].className,'edui-box edui-separator '+theme,'检查toolbar的显示');
        }
        else{
            equal(toolbarShow.childNodes[i].className,'edui-box edui-button edui-for-' + toolbar[i] + theme,'检查toolbar的显示');
        }
    }
    var link = toolbarShow.childNodes[0].firstChild;
    equal(link.className,'edui-'+editor.options.theme,'mouseover效果');
    if(ua.browser.ie){
        ua.mouseenter(link);
    }
    else{
        ua.mouseover(link);
    }
    setTimeout(function (){
        link = document.getElementById('editor').firstChild.childNodes[0].firstChild;
        equal(link.className,'edui-'+editor.options.theme+' edui-state-hover','mouseover效果');
        if(ua.browser.ie){
            ua.mouseleave(link);
        }
        else{
            ua.mouseout(link);
        }
        setTimeout(function (){
            link = document.getElementById('editor').firstChild.childNodes[0].firstChild;
            equal(link.className,'edui-'+editor.options.theme ,'mouseout效果');
            toolbarUi.dispose();
            equal(document.getElementById('editor').childNodes.length,0,'成功销毁');
            start();
        }, 400);
    }, 300);
    stop();
} );
test( 'toolbar点击', function() {
    var toolbar =[ 'link','unlink'];
    baidu.editor.ui['link'] = function (cmd){
            return function (editor, title){
                var ui = new baidu.editor.ui.Button({
                    className: 'edui-for-' + cmd,
                    title: title || editor.options.labelMap || editor.getLang('labelMap') || '',
                    onclick: function (){
                        editor.execCommand(cmd, {href:'http://www.google.com/'});
                    },
                    showText: false,
                    editor:editor
                });
                editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if(!uiReady){
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
    }('link');
    baidu.editor.ui['unlink'] = function (cmd){
            return function (editor, title){
                var ui = new baidu.editor.ui.Button({
                    className: 'edui-for-' + cmd,
                    title: title ||editor.options.labelMap || editor.getLang('labelMap') || '',
                    onclick: function (){
                        editor.execCommand(cmd);
                    },
                    showText: false,
                    editor:editor
                });
                editor.addListener('selectionchange', function (type, causeByUi, uiReady){
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if(!uiReady){
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
    }('unlink');

    var editor = new baidu.editor.ui.Editor();
//    editor.render('editor');
    var toolbarUi = new baidu.editor.ui.Toolbar({theme:editor.options.theme});
    for ( var j = 0; j < toolbar.length; j++ ) {
    var toolbarItem = toolbar[j].toLowerCase();
    var toolbarItemUi = null;
    if ( typeof toolbarItem == 'string' ) {
        if ( toolbarItem == '|' ) {
            toolbarItem = 'Separator';
        }
        if ( baidu.editor.ui[toolbarItem] ) {
            toolbarItemUi = new baidu.editor.ui[toolbarItem]( editor );
        }
        } else {
            toolbarItemUi = toolbarItem;
        }
        if ( toolbarItemUi ) {
            toolbarUi.add( toolbarItemUi );
        }
    }
    toolbarUi.render(te.dom[0]);
    toolbarUi.postRender();
    var toolbarShow  = document.getElementById('editor').firstChild;
    var linkButton = toolbarShow.childNodes[0].firstChild.firstChild.firstChild;

    var content = document.createElement('div');
    content.innerHTML = '<p>hello</p>';
    document.body.appendChild(content);
    //要使用link,先要设置range和editor.body等内容
    editor.selection = new dom.Selection( document );
    var range = new baidu.editor.dom.Range( document );
    editor.body = document.getElementById('editor').nextSibling;
    range.selectNode(document.body.lastChild).select();
    editor.document = editor.body;
    ua.click(linkButton);
    setTimeout(function (){
        equal(document.body.lastChild.firstChild.firstChild.attributes['href'].nodeValue,'http://www.google.com/','点击link按钮后，生成连接');
        equal(document.body.lastChild.firstChild.firstChild.innerHTML,'hello','点击link按钮后，生成连接');
        toolbarUi.dispose();
        content.parentNode.removeChild(content);
        start();
    }, 300);
    stop();
} );