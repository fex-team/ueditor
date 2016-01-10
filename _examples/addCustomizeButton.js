var getObj = function(editor,tagNames){

    return UE.dom.domUtils.filterNodeList(editor.selection.getStartElementPath(),tagNames);
};
UE.registerUI('h1',function(editor,uiName){
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            var me=this;
            var range = me.selection.getRange();
            var node=range.startContainer;

            if(me.queryCommandState(uiName)==1){
                var parent=$(getObj(me,'h2'));
                parent.after('<p>'+parent.html()+'</p>');
                parent.remove();
            }else{
                //没有选中文本
                if(range.startOffset==range.endOffset){
                    return false;
                }
                var fragment = range.extractContents(),
                    h1 = document.createElement( "h2" );
                h1.className="h1";
                h1.appendChild( fragment );
                $(me.selection.getStartElementPath()[0]).after(h1);
            }

        },
        queryCommandState : function() {
            return getObj(this,'h2') ? 1 : 0;
        }
    });

    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:'一级目录',
        label:'一级目录',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'  background-position: -440px 0;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName);
        }
    });

    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });

    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);
UE.registerUI('h2',function(editor,uiName){
    //注册按钮执行时的command命令，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(){
            var me=this;
            var range = me.selection.getRange();
            var node=range.startContainer;

            if(me.queryCommandState(uiName)==1){
                var parent=$(getObj(me,'h3'));
                parent.after('<p>'+parent.html()+'</p>');
                parent.remove();
            }else{
                //没有选中文本
                if(range.startOffset==range.endOffset){
                    return false;
                }
                var fragment = range.extractContents(),
                    h1 = document.createElement( "h3" );
                h1.className="h2";
                h1.appendChild( fragment );
                $(me.selection.getStartElementPath()[0]).after(h1);
            }

        },
        queryCommandState : function() {
            return getObj(this,'h3') ? 1 : 0;
        }
    });

    //创建一个button
    var btn = new UE.ui.Button({
        //按钮的名字
        name:uiName,
        //提示
        title:'二级目录',
        label:'二级目录',
        //需要添加的额外样式，指定icon图标，这里默认使用一个重复的icon
        cssRules :'  background-position: -440px 0;',
        //点击时执行的命令
        onclick:function () {
            //这里可以不用执行命令,做你自己的操作也可
            editor.execCommand(uiName);
        }
    });

    //当点到编辑内容上时，按钮要做的状态反射
    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState(uiName);
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });

    //因为你是添加button,所以需要返回这个button
    return btn;
}/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);

//自定义引用样式例子
UE.registerUI('myblockquote',function(editor,uiName){
    editor.registerCommand(uiName,{
        execCommand:function(){
            this.execCommand('blockquote',{
                "style":"border-left: 3px solid #E5E6E1; margin-left: 0px; padding-left: 5px; line-height:36px;"
            });
        }
    });

    var btn = new UE.ui.Button({
        name:uiName,
        title:'自定义引用',
        cssRules :"background-position: -220px 0;",
        onclick:function () {
            editor.execCommand(uiName);
        }
    });

    editor.addListener('selectionchange', function () {
//         console.log(this);
        var state = editor.queryCommandState('blockquote');
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });

    return btn;
});



//内链

/*
var linksUrl=baseUrl+'selectWikiPageForNL_WikiPageAction.pdl!';
var link_tpl_str=
    '<div class="links-panel">' +
    '<div>选择义项：<a href="http://'+baseUrl+'wiki/{{text}}">{{text}}</a></div>' +
    '<div class="link-list">' +
    '{{#each list}}' +
    '<div data-id="{{cid}}" class="link-item">' +
    '{{desc}}' +
    '</div>' +
    '{{/each}}' +
    '</div>' +
    '</div>';
var link_tpl=Handlebars.compile(link_tpl_str);

UE.registerUI('baikelink',function(editor,uiName){
    editor.registerCommand(uiName,{
        execCommand:function(){
            var range=this.selection.getRange();
            var text=$.trim(range.cloneContents().textContent);
            var self=this;
            $.post(linksUrl,{
                key:text
            },function(json){
                if(json.type==1){
                    setUrl(json.cid,text)
                }else if(json.type==2){
                    var modal=bootbox.alert(link_tpl({
                        list:json.resultList,
                        text:text
                    }));
                    $('.link-item').click(function(){
                        var item=$(this);
                        setUrl(item.attr('data-id'),text);
                        modal.modal('hide');
                    });
                }else if(json.type==3){
                    bootbox.alert('内链不存在');
                }
            },'json');

        }

    });
    function setUrl(cid,text){
        editor.selection.getRange().applyInlineStyle('a',{
            _href: baseUrl+"baike/entry/index.html?cid="+cid,
            href: baseUrl+"baike/entry/index.html?cid="+cid,
            target: "_self",
            title: text
        });
    }
    var btn = new UE.ui.Button({
        name:uiName,
        title:'内链',
        label:'百科链接',
        cssRules :"background-position: -500px 0;",
        onclick:function () {
            editor.execCommand(uiName);
        }
    });

    editor.addListener('selectionchange', function () {
        var state = editor.queryCommandState('blockquote');
        if (state == -1) {
            btn.setDisabled(true);
            btn.setChecked(false);
        } else {
            btn.setDisabled(false);
            btn.setChecked(state);
        }
    });

    return btn;
});
*/
