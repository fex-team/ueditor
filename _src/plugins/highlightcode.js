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
                var pre = document.createElement("pre");
                pre.className = "brush: "+syntax+";toolbar:false;";
                pre.style.display = "";
                pre.appendChild(document.createTextNode(code));
                document.body.appendChild(pre);
                if(me.queryCommandState("highlightcode")){
                    me.execCommand("highlightcode");
                }
                me.execCommand('inserthtml', SyntaxHighlighter.highlight(pre,null,true),true);
                var div = me.document.getElementById(SyntaxHighlighter.getHighlighterDivId());
                div.setAttribute('highlighter',pre.className);
                domUtils.remove(pre);
                adjustHeight();
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
            var range = this.selection.getRange(),start,end;
            range.adjustmentBoundary();
                start = domUtils.findParent(range.startContainer,function(node){
                    return node.nodeType == 1 && node.tagName == 'DIV' && domUtils.hasClass(node,'syntaxhighlighter');
                },true);
                end = domUtils.findParent(range.endContainer,function(node){
                    return node.nodeType == 1 && node.tagName == 'DIV' && domUtils.hasClass(node,'syntaxhighlighter');
                },true);
            return start && end && start == end  ? 1 : 0;
        }
    };

    me.addListener('beforeselectionchange afterselectionchange',function(type){
        me.highlight = /^b/.test(type) ? me.queryCommandState('highlightcode') : 0;
    });


    me.addListener("ready",function(){
        //避免重复加载高亮文件
        if(typeof XRegExp == "undefined"){
            utils.loadFile(document,{
                id : "syntaxhighlighter_js",
                src : me.options.highlightJsUrl || me.options.UEDITOR_HOME_URL + "third-party/SyntaxHighlighter/shCore.js",
                tag : "script",
                type : "text/javascript",
                defer : "defer"
            },function(){
                changePre();
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
        for(var i=0,di,divs=domUtils.getElementsByTagName(me.body,'div');di=divs[i++];){
            if(di.className == 'container'){
                var pN = di.parentNode;
                while(pN){
                    if(pN.tagName == 'DIV' && /highlighter/.test(pN.id)){
                        break;
                    }
                    pN = pN.parentNode;
                }
                if(!pN){
                    return;
                }
                var pre = me.document.createElement('pre');
                for(var str=[],c=0,ci;ci=di.childNodes[c++];){
                    str.push(ci[browser.ie?'innerText':'textContent']);
                }
                pre.appendChild(me.document.createTextNode(str.join('\n')));
                pre.className = pN.getAttribute('highlighter');
                pN.parentNode.insertBefore(pre,pN);
                domUtils.remove(pN);
            }
        }
    });
    me.addListener("aftergetcontent aftersetcontent",changePre);

    function adjustHeight(){
        setTimeout(function(){
            var div = me.document.getElementById(SyntaxHighlighter.getHighlighterDivId());

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
        for(var i=0,pr,pres = domUtils.getElementsByTagName(me.document,"pre");pr=pres[i++];){
            if(pr.className.indexOf("brush")>-1){
                
                var pre = document.createElement("pre"),txt,div;
                pre.className = pr.className;
                pre.style.display = "none";
                pre.appendChild(document.createTextNode(pr[browser.ie?'innerText':'textContent']));
                document.body.appendChild(pre);
                try{
                    txt = SyntaxHighlighter.highlight(pre,null,true);
                }catch(e){
                    domUtils.remove(pre);
                    return ;
                }

                div = me.document.createElement("div");
                div.innerHTML = txt;

                div.firstChild.setAttribute('highlighter',pre.className);
                pr.parentNode.insertBefore(div.firstChild,pr);

                domUtils.remove(pre);
                domUtils.remove(pr);
                
                adjustHeight();
            }
        }
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
