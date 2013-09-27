<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <title></title>
        <script type="text/javascript" src="../internal.js"></script>
        <style type="text/css">
            html,body{
                _overflow:hidden;
            }
            *{margin: 0;padding: 0;line-height: 20px;}
            .wrapper{width: 520px;height: 300px; margin: 10px 15px;font-size: 12px}
            textarea{width:510px ;height: 300px;resize: none;margin:5px;*margin-left:-12px;}
        </style>
    </head>
    <body>
    <div class="wrapper">
        <p>
            <label for="language"><var id="lang_input_selectLang"></var></label>
            <select id="language">
                <option value="as3">ActionScript3</option>
                <option value="bash">Bash/Shell</option>
                <option value="cpp">C/C++</option>
                <option value="css">Css</option>
                <option value="cf">CodeFunction</option>
                <option value="c#">C#</option>
                <option value="delphi">Delphi</option>
                <option value="diff">Diff</option>
                <option value="erlang">Erlang</option>
                <option value="groovy">Groovy</option>
                <option value="html">Html</option>
                <option value="java">Java</option>
                <option value="jfx">JavaFx</option>
                <option value="js">Javascript</option>
                <option value="pl">Perl</option>
                <option value="php">Php</option>
                <option value="plain">Plain Text</option>
                <option value="ps">PowerShell</option>
                <option value="python">Python</option>
                <option value="ruby">Ruby</option>
                <option value="scala">Scala</option>
                <option value="sql">Sql</option>
                <option value="vb">Vb</option>
                <option value="xml">Xml</option>
            </select>
        </p>
        <label for="code"></label><textarea id="code" cols="" rows=""></textarea>
    </div>
        <script type="text/javascript">
            var sels = $G("language"),
                code = $G('code');
            var state = editor.queryCommandState("highlightcode");
            if(state){
                var pN = domUtils.findParent(editor.selection.getRange().startContainer,function(node){
                    return /syntaxhighlighter/ig.test(node.className);
                });
                if(pN){
                    var divs = pN.getElementsByTagName("div"),di;
                    for(var i = divs.length-1,container;container = divs[i--];){
                        if(container.className == "container"){
                            di = container;
                            break;
                        }
                    }
                    for(var str=[],c=0,ci;ci=di.childNodes[c++];){
                        str.push(ci[parent.baidu.editor.browser.ie?'innerText':'textContent']);
                    }
                    $G("code").value = str.join("\n");
                    $G("language").value = pN.className.match(/highlighter[\s]+([a-z\d]*#?)/)[1];
                }
            }
            code.onkeydown= function(evt){
                evt = evt || event;
                if(evt.keyCode == 9){
                    if (('selectionStart' in code) && code.selectionStart == code.selectionEnd) {
                            var offset = code.selectionStart;
                            code.value = code.value.substring (0, code.selectionStart) +
                                "    " + code.value.substring  (code.selectionStart);
                        code.selectionStart =  code.selectionEnd = offset + 4;
                        $focus(code);
                    }
                    else {
                        var textRange = document.selection.createRange();
                        textRange.text = "    " + textRange.text ;
                        textRange.collapse(false);
                        textRange.select();
                        $focus(code);
                    }
                    evt.returnValue = false;
                    evt.preventDefault();
                }
                if((evt.ctrlKey||evt.metaKey) && evt.keyCode == 13){
                    dialog.onok();
                }
            };
            dialog.onok = function(){
                var language = sels.value;
                if(code.value.replace(/^\s*|\s*$/ig,"")){
                    editor.execCommand("highlightcode",code.value,language);
                    dialog.close();
                }else{
                    alert(lang.importCode);
                }
            };
            $focus(code);
            sels.onchange = function(){
                $focus(code);
            }

        </script>
    </body>
</html>
