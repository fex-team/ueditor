///import core
///import plugins/inserthtml.js
///commands 插入代码
///commandsName  code
///commandsTitle  插入代码
UE.plugins['insertcode'] = function() {
    var me = this;
    me.ready(function(){
        utils.cssRule('pre','pre{margin:.5em 0;padding:.4em .6em;border-radius:8px;background:#f8f8f8;}',
            me.document)
    });
    me.setOpt('insertcode',{
            'as3':'ActionScript3',
            'bash':'Bash/Shell',
            'cpp':'C/C++',
            'css':'Css',
            'cf':'CodeFunction',
            'c#':'C#',
            'delphi':'Delphi',
            'diff':'Diff',
            'erlang':'Erlang',
            'groovy':'Groovy',
            'html':'Html',
            'java':'Java',
            'jfx':'JavaFx',
            'js':'Javascript',
            'pl':'Perl',
            'php':'Php',
            'plain':'Plain Text',
            'ps':'PowerShell',
            'python':'Python',
            'ruby':'Ruby',
            'scala':'Scala',
            'sql':'Sql',
            'vb':'Vb',
            'xml':'Xml'
    });
    me.commands['insertcode'] = {
        execCommand : function(cmd,lang){

            var me = this,
                rng = me.selection.getRange(),
                pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
            if(pre){
                pre.className = 'brush:'+lang+';toolbar:false;';
            }else{
                var code = '';
                if(rng.collapsed){
                    code = browser.ie?'&nbsp;':'<br/>';
                }else{
                    var frag = rng.extractContents();
                    var div = me.document.createElement('div');
                    div.appendChild(frag);

                    utils.each(UE.filterNode(UE.htmlparser(div.innerHTML),me.options.filterTxtRules).children,function(node){
                        code += (node.type == 'element' ? (dtd.$empty[node.tagName] ?  '' : node.innerText()) : node.data) + '<br/>'
                    });
                }
                me.execCommand('inserthtml','<pre id="coder"class="brush:'+lang+';toolbar:false">'+code+'</pre>',true);
                pre = me.document.getElementById('coder');
                domUtils.removeAttributes(pre,'id');
                me.selection.getRange().setStart(pre,0).setCursor(false,true);
            }



        },
        queryCommandValue : function(){
            var path = this.selection.getStartElementPath();
            var lang = '';
            utils.each(path,function(node){
                if(node.nodeName =='PRE'){
                    var match = node.className.match(/brush:([^;]+)/);
                    lang = match && match[1] ? match[1] : '';
                    return false;
                }
            });
            return lang;
        }
    };

    me.addInputRule(function(root){
       utils.each(root.getNodesByTagName('pre'),function(pre){
            if(pre.getNodesByTagName('br').length){
                return;
            }
            var code = pre.innerText().split(/\n/);
            pre.innerHTML('');
            utils.each(code,function(c){
                if(c.length){
                    pre.appendChild(UE.uNode.createText(c));
                }
                pre.appendChild(UE.uNode.createElement('br'))
            })
       })
    });
    me.addOutputRule(function(root){
        utils.each(root.getNodesByTagName('pre'),function(pre){
            var code = '';
            utils.each(pre.children,function(n){
               if(n.type == 'text'){
                   code += n.data;
               }else{
                   code  += '\n'
               }

            });
            pre.innerText(code)
        })
    });
    //不需要判断highlight的command列表
    me.notNeedCodeQuery ={
        help:1,
        undo:1,
        redo:1,
        source:1,
        print:1,
        searchreplace:1,
        fullscreen:1,
        preview:1,
        insertparagraph:1,
        elementpath:1,
        highlightcode:1,
        insertcode:1,
        inserthtml:1,
        selectall:1
    };
    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function(cmd){
        var me = this;

        if(!me.notNeedCodeQuery[cmd.toLowerCase()] && me.selection && me.queryCommandValue('insertcode')){
            return -1;
        }
        return orgQuery.apply(this,arguments)
    };
    me.addListener('beforeenterkeydown',function(){
        var rng = me.selection.getRange();
        var pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
        if(pre){
            me.fireEvent('saveScene');
            if(!rng.collapsed){
               rng.deleteContents();
            }
            if(!browser.ie){
                var tmpNode = me.document.createElement('br'),pre;
                rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(true);
                var next = tmpNode.nextSibling;
                if(!next){
                    rng.insertNode(tmpNode.cloneNode(false));
                }else{
                    rng.setStartAfter(tmpNode);
                }
                pre = tmpNode.previousSibling;
                var tmp;
                while(pre ){
                    tmp = pre;
                    pre = pre.previousSibling;
                    if(!pre || pre.nodeName == 'BR'){
                        pre = tmp;
                        break;
                    }
                }
                if(pre){
                    var str = '';
                    while(pre && pre.nodeName != 'BR' &&  new RegExp('^[ '+domUtils.fillChar+']*$').test(pre.nodeValue)){
                        str += pre.nodeValue;
                        pre = pre.nextSibling;
                    }
                    if(pre.nodeName != 'BR'){
                        var match = pre.nodeValue.match(new RegExp('^([ '+domUtils.fillChar+']+)'));
                        if(match && match[1]){
                            str += match[1]
                        }

                    }
                    if(str){
                        str = me.document.createTextNode(str);
                        rng.insertNode(str).setStartAfter(str);
                    }
                }
                rng.collapse(true).select(true);
            }else{
                var tmpNode = me.document.createElement('br');
                rng.insertNode(tmpNode).setStartAfter(tmpNode);
                pre = tmpNode.previousSibling;
                var tmp;
                while(pre ){
                    tmp = pre;
                    pre = pre.previousSibling;
                    if(!pre || pre.nodeName == 'BR'){
                        pre = tmp;
                        break;
                    }
                }
                if(pre){
                    var str = '';
                    while(pre && pre.nodeName != 'BR' &&  new RegExp('^[ '+domUtils.fillChar+']*$').test(pre.nodeValue)){
                        str += pre.nodeValue;
                        pre = pre.nextSibling;
                    }
                    if(pre.nodeName != 'BR'){
                        var match = pre.nodeValue.match(new RegExp('^([ '+domUtils.fillChar+']+)'));
                        if(match && match[1]){
                            str += match[1]
                        }

                    }
                    if(str){
                        str = me.document.createTextNode(str);
                        rng.insertNode(str).setStartAfter(str);
                    }
                }
                rng.collapse(true).select(true);
            }
            me.fireEvent('saveScene');
            return true;
        }


    });

    me.addListener('tabkeydown',function(){
        var rng = me.selection.getRange();
        var pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
        if(pre){
            me.fireEvent('saveScene');
            if(!rng.collapsed){
                var bk = rng.createBookmark();
                var start = bk.start.previousSibling;

                while(start){
                    if(pre.firstChild === start && !domUtils.isBr(start)){
                        pre.insertBefore(me.document.createTextNode('    '),start);

                        break;
                    }
                    if(domUtils.isBr(start)){
                        pre.insertBefore(me.document.createTextNode('    '),start.nextSibling);

                        break;
                    }
                    start = start.previousSibling;
                }
                var end = bk.end;
                start = bk.start.nextSibling;
                if(pre.firstChild === bk.start){
                    pre.insertBefore(me.document.createTextNode('    '),start.nextSibling)

                }
                while(start && start !== end){
                    if(domUtils.isBr(start) && start.nextSibling){
                        if(start.nextSibling === end){
                            break;
                        }
                        pre.insertBefore(me.document.createTextNode('    '),start.nextSibling)
                    }

                    start = start.nextSibling;
                }
                rng.moveToBookmark(bk).select();
            }else{
                var tmpNode = me.document.createTextNode('    ');
                rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(true).select(true);
            }

            me.fireEvent('saveScene');
            return true;
        }


    });


    me.addListener('beforeinserthtml',function(evtName,html){
        var me = this,
            rng = me.selection.getRange(),
            pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
        if(pre){
            var br = '',frag = me.document.createDocumentFragment();
            utils.each(UE.filterNode(UE.htmlparser(html),me.options.filterTxtRules).children,function(node){
                if(node.type == 'element' && node.tagName == 'br'){
                    return;
                }
                var html = node.type == 'element' ? node.innerText() : node.getData();
                frag.appendChild(me.document.createTextNode(utils.html(html.replace(/&nbsp;/g,' '))));
                br = me.document.createElement('br');
                frag.appendChild(br);
            });
            rng.insertNode(frag).setStartBefore(br);
            domUtils.remove(br);
            rng.setCursor(false,true);
            return true;
        }
    });
    //方向键的处理
    me.addListener('keyup',function(cmd,evt){
        var me = this,keyCode = evt.keyCode || evt.which;
        if(keyCode == 40){
            var rng = me.selection.getRange();
            if(rng.collapsed && domUtils.findParentByTagName(rng.startContainer,'pre',true)){
                me.execCommand('insertparagraph')
            }
        }
    })
};
