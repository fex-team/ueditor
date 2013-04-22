///import core
///import plugins/inserthtml.js
///commands 插入代码
///commandsName  code
///commandsTitle  插入代码
UE.plugins['insertcode'] = function() {
    var me = this;
    me.ready(function(){
        utils.cssRule('pre','pre{margin:.5em 0;padding:.4em .6em;border-radius:2px;background:#f8f8f8;}',
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
                pre.className = lang;
            }else{
                var code = '';
                if(rng.collapsed){
                    code = browser.ie?'&nbsp;':'<br/>';
                }else{
                    var frag = rng.extractContents();
                    var div = me.document.createElement();
                    div.appendChild(frag);
                    var code = '';
                    utils.each(UE.filterNode(UE.htmlparser(div.innerHTML),me.options.filterTxtRules).children,function(node){
                        code += node.innerText() + '\n'
                    });

                }
                me.execCommand('inserthtml','<pre id="coder"class="'+lang+'">'+code+'</pre>',true);
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
                    lang = node.className;
                    return false;
                }
            });
            return lang;
        }
    }

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
        inserthtml:1
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
    me.addListener('beforeenterkeydown',function(cmd){
        var rng = me.selection.getRange();
        var pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
        if(pre){
           if(!rng.collapsed){
               rng.deleteContents();
               rng.setCursor(false,true);

           }
           var tmpNode = me.document.createTextNode('\n\r');
           rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(true).select(true);

           return true;
        }


    });
    me.addListener('beforeinserthtml',function(evtName,html){
        var me = this,
            rng = me.selection.getRange(),
            pre = domUtils.findParentByTagName(rng.startContainer,'pre',true);
        if(pre){
            var code = '';
            utils.each(UE.filterNode(UE.htmlparser(html),me.options.filterTxtRules).children,function(node){
                code += node.innerText() + '\n'
            });
            var txtNode = me.document.createTextNode(utils.trim(code.replace(/&nbsp;/g,' ')));
            rng.insertNode(txtNode).setStartAfter(txtNode).setCursor(false,true);
            return true;
        }


    })
};
