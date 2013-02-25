module( 'core.node' );

test( '', function() {
    var uNode = UE.uNode;

    //createElement
    var node = uNode.createElement('div');
    equals(node.tagName,'div');
    equals(node.type,'element');
    node = uNode.createElement('<div id="aa">sdfadf</div>');
    equals(node.tagName,'div');
    equals(node.children[0].data,'sdfadf');

    //getNodeById
    node = uNode.createElement('<div id="aa"><div id="bb"></div>sdfadf</div>');
    node = node.getNodeById('bb');
    equals(node.getAttr('id'),'bb');
    node = uNode.createElement('<div id="aa"><div id="bb"><div id="cc"></div> </div>sdfadf</div>');
    node = node.getNodeById('cc');
    equals(node.getAttr('id'),'cc');

    //getNodesByTagName
    node = uNode.createElement('<div id="aa"><div id="bb"><div id="cc"></div> </div>sdfadf</div>');
    var nodelist = node.getNodesByTagName('div');
    equals(nodelist.length,2);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<div id="bb"><div id="cc"></div> </div>sdfadf');

    //innerHTML
    node.innerHTML('<div><div><div></div></div></div>');
    nodelist =node.getNodesByTagName('div');
    equals(nodelist.length,3);
    for(var i= 0,ci;ci=nodelist[i++];){
        ci.tagName = 'p';
    }
    equals(node.innerHTML(),'<p><p><p></p></p></p>');

    //innerText
    var tmp = new UE.uNode.createElement('area');
    tmp.innerHTML('');
    equals(tmp.innerText(),tmp);
    var tmp = new UE.uNode.createText('');
    tmp.innerHTML('');
    equals(tmp.innerText(),tmp);
    node.innerHTML('<p>dfsdfsdf<b>eee</b>sdf</p>');
    equals(node.innerText(),'dfsdfsdfeeesdf');

    //getData
    var tmp = new UE.uNode.createElement('div');
    equals(tmp.getData(),'');
    var tmp = new UE.uNode.createText('askdj');
    equals(tmp.getData(),"askdj");

    //appendChild && insertBefore
    node.innerHTML('<p><td></td></p>');
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p>');
    var tmp = uNode.createElement('div');
    node.appendChild(tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');
    node.insertBefore(tmp,node.firstChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<div></div><p><table><tbody><tr><td></td></tr></tbody></table></p>');
    node.appendChild(tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');

    //replaceChild && setAttr
    tmp = uNode.createElement('p');
    tmp.setAttr({'class':'test','id':'aa'});
    node.insertBefore(tmp,node.lastChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><p class="test" id="aa"></p><div></div>');
    node.replaceChild(uNode.createElement('div'),tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div><div></div>');

    //insertAfter
    node.innerHTML('<p><td></td></p>');
    var tmp = uNode.createElement('div');
    node.appendChild(tmp);
    node.insertAfter(tmp,node.firstChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');
    node.appendChild(tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');

    //setAttr
    tmp = uNode.createElement('p');
    tmp.setAttr();
    node.insertAfter(tmp,node.lastChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div><p></p>');

    //replaceChild
    node.innerHTML('<p><td></td></p>');
    var tmp = uNode.createElement('div');
    node.appendChild(tmp);
    node.replaceChild(node.firstChild(),tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p>');

    //getStyle
    node.innerHTML('<div style=""><div>');
    node = node.firstChild();
    equals(node.getStyle(''),'');
    node.innerHTML('<div style="border:1px solid #ccc"><div>');
    node = node.firstChild();
    equals(node.getStyle('border'),'1px solid #ccc');
    node.innerHTML('<div style="border:1px solid #ccc"><div>');
    node = node.firstChild();
    equals(node.getStyle('color'),'');
    node.innerHTML('<div style="border:1px solid #ccc;color:#ccc"><div>');
    node = node.firstChild();
    equals(node.getStyle('border'),'1px solid #ccc');

    //setStyle
    node.setStyle('border','2px solid #ccc');
    equals(node.getAttr('style'),'border:2px solid #ccc;color:#ccc');
    node.setStyle({
        'font':'12px',
        'background':'#ccc'
    });
    equals(node.getAttr('style'),'background:#ccc;font:12px;border:2px solid #ccc;color:#ccc');
    node.setStyle({
        'font':'',
        'background':'',
        'border':'',
        'color':''
    });
    equals(node.getAttr('style'),undefined);
    node.setStyle('border','<script>alert("")</script>');
    equals(node.getAttr('style'),"border:&lt;script&gt;alert(&quot;&quot;)&lt;/script&gt;;");
    equals(node.toHtml(),'<div style=\"border:&lt;script&gt;alert(&quot;&quot;)&lt;/script&gt;;\" ><div></div></div>')
    node.innerHTML('<div>asdfasdf<b>sdf</b></div>')
    node.removeChild(node.firstChild(),true);
    equals(node.toHtml(),'<div style=\"border:&lt;script&gt;alert(&quot;&quot;)&lt;/script&gt;;\" >asdfasdf<b>sdf</b></div>')

    //getIndex
    var tmp = new UE.uNode.createElement('div');
    node.appendChild(tmp);
    equals(tmp.getIndex(),2);
});