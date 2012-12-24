///import core
///import plugins/inserthtml.js
///commands 插入代码
///commandsName  HighlightCode
///commandsTitle  插入代码
///commandsDialog  dialogs\code\code.html
UE.plugins['highlightcode'] = function() {
    var me = this;
    if(!/highlightcode/i.test(me.options.toolbars.join(''))){
        return;
    }

    me.commands['highlightcode'] = {
        execCommand: function (cmdName, code, syntax) {
            if(code && syntax){
                me.execCommand('inserthtml','<pre id="highlightcode_id" class="brush: '+syntax+';toolbar:false;">'+code+'</pre>',true);
                var pre = me.document.getElementById('highlightcode_id');
                domUtils.removeAttributes(pre,'id');
                me.window.SyntaxHighlighter.highlight(pre);
                adjustHeight(me);
            }else{
                var range = this.selection.getRange(),
                   start = domUtils.findParentByTagName(range.startContainer, 'table', true),
                   end = domUtils.findParentByTagName(range.endContainer, 'table', true),
                   codediv;
                if(start && end && start === end && start.parentNode.className.indexOf("syntaxhighlighter")>-1){
                    codediv = start.parentNode;
                    //需要判断一下后边有没有节点，没有的化才添加新的标签
                    if(domUtils.isBody(codediv.parentNode) && !codediv.nextSibling){
                        var p = me.document.createElement('p');
                        p.innerHTML = browser.ie ? '' : '<br/>';
                        me.body.insertBefore(p,codediv);
                        range.setStart(p,0);
                    }else{
                        range.setStartBefore(codediv)
                    }
                    range.setCursor();
                    domUtils.remove(codediv);
                }
            }
        },
        queryCommandState: function(){
            return queryHighlight.call(this);
        }
    };

    function queryHighlight(){
        try{
            var range = this.selection.getRange(),start,end;
            range.adjustmentBoundary();
            start = domUtils.findParent(range.startContainer,function(node){
                return node.nodeType == 1 && node.tagName == 'DIV' && domUtils.hasClass(node,'syntaxhighlighter');
            },true);
            end = domUtils.findParent(range.endContainer,function(node){
                return node.nodeType == 1 && node.tagName == 'DIV' && domUtils.hasClass(node,'syntaxhighlighter');
            },true);
            return start && end && start == end  ? 1 : 0;
        }catch(e){
            return 0;
        }
    }

    //不需要判断highlight的command列表
    me.notNeedHighlightQuery ={
        help:1,
        undo:1,
        redo:1,
        source:1,
        print:1,
        searchreplace:1,
        fullscreen:1,
        autotypeset:1,
        pasteplain:1,
        preview:1,
        insertparagraph:1
    };
    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function(cmd){
        if(!me.notNeedHighlightQuery[cmd.toLowerCase()] && queryHighlight.call(this) == 1){
            return -1;
        }
        return orgQuery.apply(this,arguments)
    };

    me.addListener('beforeselectionchange afterselectionchange',function(type){
        me.highlight = /^b/.test(type) ? me.queryCommandState('highlightcode') : 0;
    });


    me.addListener("ready",function(){
        //避免重复加载高亮文件
        if(typeof XRegExp == "undefined"){
            utils.loadFile(me.document,{
                id : "syntaxhighlighter_js",
                src : me.options.highlightJsUrl || me.options.UEDITOR_HOME_URL + "third-party/SyntaxHighlighter/shCore.js",
                tag : "script",
                type : "text/javascript",
                defer : "defer"
            },function(){
                changePre.call(me);
            });
        }
        if(!me.document.getElementById("syntaxhighlighter_css")){
            utils.loadFile(me.document,{
                id : "syntaxhighlighter_css",
                tag : "link",
                rel : "stylesheet",
                type : "text/css",
                href : me.options.highlightCssUrl ||me.options.UEDITOR_HOME_URL + "third-party/SyntaxHighlighter/shCoreDefault.css"
            });
        }

    });
    me.addListener("beforegetcontent",function(){
        utils.each(domUtils.getElementsByTagName(me.body,'div','syntaxhighlighter'),function(di){
            var str = [];
            utils.each(di.getElementsByTagName('code'),function(ci){
                str.push(ci[browser.ie?'innerText':'textContent'])
            });
            var pre = domUtils.createElement(me.document,'pre',{
                innerHTML : str.join('\n'),
                'class' : 'brush: '+di.className.match(/[\w-]+$/)[0]+';toolbar:false;'
            });
            di.parentNode.replaceChild(pre,di);
        });
    });
    me.addListener("aftergetcontent aftersetcontent",changePre);

    function adjustHeight(editor){
        setTimeout(function(){
            var div = editor.document.getElementById(editor.window.SyntaxHighlighter.getHighlighterDivId());
            if(div){
                var tds = div.getElementsByTagName('td');
                for(var i=0,li,ri;li=tds[0].childNodes[i];i++){
                    ri = tds[1].firstChild.childNodes[i];
                    //trace:1949
                    if(ri){
                        ri.style.height = li.style.height = ri.offsetHeight + 'px';
                    }
                }

            }
        });

    }
    function changePre(){
        var me = this;
        utils.each(domUtils.getElementsByTagName(me.document,"pre"),function(pi){
            if(pi.className.indexOf("brush")>-1){
                me.window.SyntaxHighlighter.highlight(pi);
            }
        });
    }

    me.addListener('getAllHtml',function(type,html){
        var coreHtml = '';

        for(var i= 0,ci,divs=domUtils.getElementsByTagName(me.document,'div');ci=divs[i++];){
            if(domUtils.hasClass(ci,'syntaxhighlighter')){
                if(!me.document.getElementById('syntaxhighlighter_css')){
                    coreHtml = '<link id="syntaxhighlighter_css" rel="stylesheet" type="text/css" href="' +
                        (me.options.highlightCssUrl ||me.options.UEDITOR_HOME_URL + 'third-party/SyntaxHighlighter/shCoreDefault.css"') + ' ></link>'
                }
                if(!me.window.XRegExp){
                    coreHtml += '<script id="syntaxhighlighter_js"  type="text/javascript" src="' +
                        (me.options.highlightJsUrl || me.options.UEDITOR_HOME_URL + 'third-party/SyntaxHighlighter/shCore.js"') + ' ></script>'+
                        '<script type="text/javascript">window.onload = function(){SyntaxHighlighter.highlight();' +

                        'setTimeout(function(){' +
                            'for(var i=0,di;di=SyntaxHighlighter.highlightContainers[i++];){' +
                            'var tds = di.getElementsByTagName("td");' +
                            'for(var j=0,li,ri;li=tds[0].childNodes[j];j++){' +
                            'ri = tds[1].firstChild.childNodes[j];' +
                            'ri.style.height = li.style.height = ri.offsetHeight + "px";' +
                            '}' +
                        '}},100)}</script>'
                }
                break;
            }
        }
        if(!coreHtml){
            var tmpNode;
            if(tmpNode = me.document.getElementById('syntaxhighlighter_css')){
                domUtils.remove(tmpNode)
            }
            if(tmpNode = me.document.getElementById('syntaxhighlighter_js')){
                domUtils.remove(tmpNode)

            }
        }
        html.html += coreHtml;
    });
    //全屏时，重新算一下宽度
    me.addListener('fullscreenchanged',function(){
        var div = domUtils.getElementsByTagName(me.document,'div');
        for(var j=0,di;di=div[j++];){
            if(/^highlighter/.test(di.id)){
                var tds = di.getElementsByTagName('td');
                for(var i=0,li,ri;li=tds[0].childNodes[i];i++){
                    ri = tds[1].firstChild.childNodes[i];

                    ri.style.height = li.style.height = ri.offsetHeight + 'px';
                }
            }
        }
    });
};
