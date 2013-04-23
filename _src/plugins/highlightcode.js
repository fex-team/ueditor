/////import core
/////import plugins/inserthtml.js
/////commands 插入代码
/////commandsName  HighlightCode
/////commandsTitle  插入代码
/////commandsDialog  dialogs\highlightcode
//UE.plugins['highlightcode'] = function() {
//    var me = this;
//    if(!/highlightcode/i.test(me.options.toolbars.join(''))){
//        return;
//    }
//
//    me.commands['highlightcode'] = {
//        execCommand: function (cmdName, code, syntax) {
//            var me = this;
//            var range = this.selection.getRange(),
//                start = domUtils.findParentByTagName(range.startContainer, 'table', true),
//                end = domUtils.findParentByTagName(range.endContainer, 'table', true);
//            if(start && end && start === end && domUtils.hasClass(start,'syntaxhighlighter')){
//                if(start.nextSibling){
//                    range.setStart(start.nextSibling,0)
//                }else{
//                    if(start.previousSibling){
//                        range.setStartAtLast(start.previousSibling)
//                    }else{
//                        var p = me.document.createElement('p');
//                        domUtils.fillNode(me.document,p);
//                        start.parentNode.insertBefore(p,start);
//                        range.setStart(p,0)
//                    }
//                }
//                range.setCursor(false,true);
//                domUtils.remove(start);
//            }
//            if(code && syntax){
//                me.execCommand('inserthtml','<pre id="highlightcode_id" class="brush: '+syntax+';toolbar:false;">'+utils.unhtml(code)+'</pre>',true);
//                var pre = me.document.getElementById('highlightcode_id');
//                if(pre){
//                    domUtils.removeAttributes(pre,'id');
//                    me.window.SyntaxHighlighter.highlight(pre);
//                    adjustHeight(me);
//                }
//            }
//
//        },
//        queryCommandState: function(){
//            return queryHighlight.call(this);
//        }
//    };
//
//
//    function queryHighlight(){
//        try{
//            var range = this.selection.getRange(),start,end;
//            range.adjustmentBoundary();
//            start = domUtils.findParent(range.startContainer,function(node){
//                return node.nodeType == 1 && node.tagName == 'TABLE' && domUtils.hasClass(node,'syntaxhighlighter');
//            },true);
//            end = domUtils.findParent(range.endContainer,function(node){
//                return node.nodeType == 1 && node.tagName == 'TABLE' && domUtils.hasClass(node,'syntaxhighlighter');
//            },true);
//            return start && end && start == end  ? 1 : 0;
//        }catch(e){
//            return 0;
//        }
//    }
//
//    //不需要判断highlight的command列表
//    me.notNeedHighlightQuery ={
//        help:1,
//        undo:1,
//        redo:1,
//        source:1,
//        print:1,
//        searchreplace:1,
//        fullscreen:1,
//        preview:1,
//        insertparagraph:1,
//        elementpath:1,
//        highlightcode:1
//    };
//    //将queyCommamndState重置
//    var orgQuery = me.queryCommandState;
//    me.queryCommandState = function(cmd){
//        var me = this;
//        if(!me.notNeedHighlightQuery[cmd.toLowerCase()] && queryHighlight.call(this) == 1){
//            return -1;
//        }
//        return orgQuery.apply(this,arguments)
//    };
//
//    me.addListener('beforeselectionchange afterselectionchange',function(type){
//        var me = this;
//        me.highlight = /^b/.test(type) ? me.queryCommandState('highlightcode') : 0;
//    });
//
//
//    me.addListener("ready",function(){
//        var me = this;
//        //避免重复加载高亮文件
//        if(typeof me.XRegExp == "undefined"){
//            utils.loadFile(me.document,{
//                id : "syntaxhighlighter_js",
//                src : me.options.highlightJsUrl || me.options.UEDITOR_HOME_URL + "third-party/SyntaxHighlighter/shCore.js",
//                tag : "script",
//                type : "text/javascript",
//                defer : "defer"
//            },function(){
//                changePre.call(me);
//            });
//        }
//        if(!me.document.getElementById("syntaxhighlighter_css")){
//            utils.loadFile(me.document,{
//                id : "syntaxhighlighter_css",
//                tag : "link",
//                rel : "stylesheet",
//                type : "text/css",
//                href : me.options.highlightCssUrl ||me.options.UEDITOR_HOME_URL + "third-party/SyntaxHighlighter/shCoreDefault.css"
//            });
//        }
//        //处理粘贴
//        var codeNode;
//        me.addListener('keydown', function (cmd, evt) {
//            var me = this;
//
//            if ((evt.ctrlKey || evt.metaKey) && evt.keyCode == '67') {
//                codeNode = null;
//                var rng = me.selection.getRange(),common = rng.getCommonAncestor(true,true);
//                var codeContainer;
//                if(!rng.collapsed && (codeContainer = domUtils.findParent(common,function(node){return node.tagName == 'TABLE' && domUtils.hasClass(node,'syntaxhighlighter')}))){
//                    var frag = rng.cloneContents();
//                    var tmpNode = me.document.createElement('div');
//                    tmpNode.appendChild(frag);
//                    var pre = me.document.createElement('pre');
//                    var str = '';
//                    utils.each(tmpNode.getElementsByTagName('div'),function(ci){
//                        var codeStr = ci[browser.ie ? 'innerText' : 'textContent'].replace(/&nbsp;/g,' ');
//                        str += (/^\s+$/.test(codeStr) ? '\n' : codeStr+'\n');
//                    });
//                    if(!str){
//                        str = tmpNode[browser.ie ? 'innerText' : 'textContent'].replace(/&nbsp;/g,' ')
//                    }
//                    var val = codeContainer.className;
//                    pre.className = 'brush: '+val.replace(/\s+/g,' ').split(' ')[1]+';toolbar:false;';
//                    pre.appendChild(me.document.createTextNode(str));
//                    codeNode = pre;
//                    return false;
//                }
//            }
//
//        });
//        me.addListener('beforepaste',function(cmd,html){
//            var me = this;
//            if(codeNode){
//                me.fireEvent('saveScene');
//                var rng = me.selection.getRange(),common = rng.getCommonAncestor(true,true);
//                if(!domUtils.findParent(common,function(node){return node.tagName == 'TABLE' && domUtils.hasClass(node,'syntaxhighlighter')})){
//                    var tmpNode = me.document.createElement('div');
//                    codeNode.id = 'highlightcode_id';
//                    tmpNode.appendChild(codeNode.cloneNode(true));
//                    me.__hasEnterExecCommand = true;
//                    me.execCommand('inserthtml',tmpNode.innerHTML,true);
//                    me.__hasEnterExecCommand = false;
//                    var pre = me.document.getElementById('highlightcode_id');
//                    if(pre){
//                        domUtils.removeAttributes(pre,'id');
//                        me.window.SyntaxHighlighter.highlight(pre);
//                        adjustHeight(me);
//                    }
//                    html.html = '';
//                    me.fireEvent('contentchange');
//                    me.fireEvent('saveScene');
//                    return true;
//                }
//
//            }
//        });
//        me.addListener('blur', function () {
//            codeNode = null;
//        });
//    });
//    me.addOutputRule(function(root){
//        utils.each(root.getNodesByTagName('table'),function(node){
//            var val;
//            if((val = node.getAttr('class')) && /syntaxhighlighter/.test(val)){
//                var divContainer;
//                utils.each(node.getNodesByTagName('div'),function(n){
//                    val = n.getAttr('class');
//                    if(val && /container/.test(val)){
//                        divContainer = n;
//                        return;
//                    }
//                });
//                var str = '';
//                utils.each(divContainer.getNodesByTagName('div'),function(ci){
//                    var codeStr = ci.innerText().replace(/&nbsp;/g,' ');
//                    str += (/^\s+$/.test(codeStr) ? '\n' : codeStr+'\n')
//
//                });
//                node.tagName = 'pre';
//                val = node.getAttr('class');
//                node.setAttr();
//                node.setAttr('class', 'brush: '+val.replace(/\s+/g,' ').split(' ')[1]+';toolbar:false;');
//                node.children = [];
//                node.appendChild(UE.uNode.createText(str))
//            }
//        })
//    });
//    me.addInputRule(function(root){
//        var me = this;
//        if(!me.window||!me.window.SyntaxHighlighter)return;
//        utils.each(root.getNodesByTagName('pre'),function(pi){
//            var val;
//            if(val = pi.getAttr('class')){
//                if(/brush/.test(val)){
//                    var tmpDiv = me.document.createElement('div');
//                    tmpDiv.innerHTML = pi.toHtml();
//                    me.window.SyntaxHighlighter.highlight(null,tmpDiv.firstChild);
//                    var node = UE.uNode.createElement(tmpDiv.innerHTML);
//                    pi.parentNode.replaceChild(node,pi)
//                }
//            }
//        });
//    });
//    me.addListener('afterscencerestore',function(){
//        adjustHeight(this)
//    })
//    function adjustHeight(cont){
//        utils.each(cont.document.getElementsByTagName('table'),function(pi){
//            if(/SyntaxHighlighter/gi.test(pi.className)){
//                var tds = pi.getElementsByTagName('td');
//                for(var i=0,li,ri;li=tds[0].childNodes[i];i++){
//                    if(li.style.height){
//                        return;
//                    }
//                    ri = tds[1].firstChild.childNodes[i];
//                    if(ri && !li.style.height){
//                        li.style.height = ri.offsetHeight - (browser.ie ? 1 : 0) + 'px';
//                        if(browser.chrome){
//                            ri.style.height = li.style.height;
//                        }
//                    }
//                }
//            }
//        });
//    }
//
//    //不能回车在代码高亮里
//    me.addListener('beforeenterkeydown',function(){
//        var range = this.selection.getRange();
//
//        if(domUtils.findParent(range.startContainer,function(node){
//            return node.nodeType == 1 && node.tagName == 'TABLE' && domUtils.hasClass(node,'syntaxhighlighter');
//        },true)){
//            return true;
//        }
//    });
//    //避免table插件对于代码高亮的影响
//    me.addListener('excludetable excludeNodeinautotype',function (cmd,target){
//        if(target && domUtils.findParent(target,function(node){
//            return domUtils.hasClass(node,'syntaxhighlighter');
//        },true)){
//            return true;
//        }
//    });
//
//    function changePre(){
//        var me = this;
//        if(!me.window||!me.window.SyntaxHighlighter)return;
//        utils.each(domUtils.getElementsByTagName(me.document,"pre"),function(pi){
//            if(domUtils.hasClass(pi,'brush')){
//                me.window.SyntaxHighlighter.highlight(pi);
//                adjustHeight(me);
//            }
//        });
//    }
//
//    me.addListener('getAllHtml',function(type,headHtml){
//        var coreHtml = '',me = this;
//        for(var i= 0,ci,divs=domUtils.getElementsByTagName(me.document,'table');ci=divs[i++];){
//            if(domUtils.hasClass(ci,'syntaxhighlighter')){
//                coreHtml = '<script type="text/javascript">window.onload = function(){SyntaxHighlighter.highlight();' +
//                    'setTimeout(function(){ '+
//                     "   var tables = document.getElementsByTagName('table');"+
//                     "   for(var t= 0,ti;ti=tables[t++];){"+
//                     "       if(/SyntaxHighlighter/i.test(ti.className)){"+
//                     "           var tds = ti.getElementsByTagName('td');"+
//                     "           for(var i=0,li,ri;li=tds[0].childNodes[i];i++){"+
//                     "               ri = tds[1].firstChild.childNodes[i];"+
//                     "               if(ri){"+
//                     "                  ri.style.height = li.style.height = ri.offsetHeight + 'px';"+
//                     "               }"+
//                     "           }"+
//                     "       }"+
//                     "   }"+
//                    '},100)' +
//                    '}</script>'
//                break;
//            }
//        }
//        if(!coreHtml){
//            var tmpNode;
//            if(tmpNode = me.document.getElementById('syntaxhighlighter_css')){
//                domUtils.remove(tmpNode)
//            }
//            if(tmpNode = me.document.getElementById('syntaxhighlighter_js')){
//                domUtils.remove(tmpNode)
//
//            }
//        }
//        coreHtml && headHtml.push(coreHtml)
//    });
//
//};
