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
});