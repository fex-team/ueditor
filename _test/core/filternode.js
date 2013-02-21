module( 'core.filternode' );

test( '', function() {
    var uNode = UE.uNode;
    var node = uNode.createElement('<div id="aa"><p>sdf<b>sdf</b></p><i>sdf</i></div>');
    UE.filterNode(node,{
        'p':{},
        'b':'-'
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p>sdf</p>sdf</div>');
    node.innerHTML('<p style="color:#ccc;border:1px solid #ccc;"><table><tbody><tr><td></td></tr></tbody></table></p><div>sdfasdf</div>');
    UE.filterNode(node,{
        'p':{$:{
            style:['color']
        }},
        'td':{}
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p style="color:#ccc"><td></td></p>sdfasdf</div>');
    node.innerHTML('<p style="color:#ccc;border:1px solid #ccc;"><table><tbody><tr><td>sdfs</td><td>sdfs</td></tr></tbody></table></p><div>sdfasdf</div>');
    UE.filterNode(node,{
        'p':{$:{
            style:['color']
        }},
        'tr':function(node){
            node.tagName = 'p';
            node.setAttr();
        },
        'td':function(node){
            node.parentNode.removeChild(node,true)
        }
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p style="color:#ccc"><p>sdfssdfs</p></p>sdfasdf</div>');

    UE.filterNode(node,{
        'p':{$:{}}
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p><p>sdfssdfs</p></p>sdfasdf</div>');

    node.innerHTML('<p><p>sdfs</p><br/><br/><br/><br/></p>');
    UE.filterNode(node,{
        'p':{},
        'br':'-'
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p><p>sdfs</p></p></div>');

    node.innerHTML('<p style="text-indent:28px;line-height:200%;margin-top:62px;"><strong>sdfs</strong><span style="font-family:宋体">sdfs</span></p>');
    UE.filterNode(node,{
        'p':{$:{
            style:['line-height']
        }},
        'span':{$:{}},
        'strong':'-'
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p style="line-height:200%"><span>sdfs</span></p></div>');

    node.innerHTML('<p><a></a><u class="ad" id="underline">sdfs<sub class="ab">sdfs</sub><i>sdfs</i></u><i>sdfs</i></p>');

    UE.filterNode(node,{
        'p':{},
        'u':{$:{
            'class':['ad']
        }},
        'sub':{$:{}},
        'i':'-'
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><p><u class="ad">sdfs<sub>sdfs</sub></u></p></div>');

    node.innerHTML('<img src="http://img.baidu.com/hi/jx2/j_0020.gif" height="10px"/><script></script>');
    UE.filterNode(node,{
        'img':{$:{
            src:['']
        }},
        'script':function(node){
            var txt = !!node.innerText();
            if(txt){
                node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
            }
            node.parentNode.removeChild(node,node.innerText())
        }
    });
    equals(node.toHtml().replace(/[ ]+>/g,'>'),'<div id="aa"><img src="http://img.baidu.com/hi/jx2/j_0020.gif" /></div>');
});