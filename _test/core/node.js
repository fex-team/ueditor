module( 'core.htmlparser' );

test( '', function() {
    var uNode = UE.uNode;
    var node = uNode.createElement('div');
    equals(node.tagName,'div');
    equals(node.type,'element');
    node = uNode.createElement('<div id="aa">sdfadf</div>');
    equals(node.tagName,'div');
    equals(node.children[0].data,'sdfadf');
    node = uNode.createElement('<div id="aa"><div id="bb"></div>sdfadf</div>');
    node = node.getNodeById('bb');
    equals(node.getAttr('id'),'bb');
    node = uNode.createElement('<div id="aa"><div id="bb"><div id="cc"></div> </div>sdfadf</div>');
    node = node.getNodeById('cc');
    equals(node.getAttr('id'),'cc');
    node = uNode.createElement('<div id="aa"><div id="bb"><div id="cc"></div> </div>sdfadf</div>');
    var nodelist = node.getNodesByTagName('div');
    equals(nodelist.length,2);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<div id="bb"><div id="cc"></div> </div>sdfadf');
    node.innerHTML('<p><td></td></p>');
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p>');
    var tmp = uNode.createElement('div');
    node.appendChild(tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');
    node.insertBefore(tmp,node.firstChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<div></div><p><table><tbody><tr><td></td></tr></tbody></table></p>');
    node.appendChild(tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div>');
    tmp = uNode.createElement('p');
    tmp.setAttr({'class':'test','id':'aa'});
    node.insertBefore(tmp,node.lastChild());
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><p class="test" id="aa"></p><div></div>');
    node.replaceChild(uNode.createElement('div'),tmp);
    equals(node.innerHTML().replace(/[ ]+>/g,'>'),'<p><table><tbody><tr><td></td></tr></tbody></table></p><div></div><div></div>');
    node.innerHTML('<p>dfsdfsdf<b>eee</b>sdf</p>');
    equals(node.innerText(),'dfsdfsdfeeesdf');
    node.innerHTML('<div><div><div></div></div></div>');
    nodelist =node.getNodesByTagName('div');
    equals(nodelist.length,3);
    for(var i= 0,ci;ci=nodelist[i++];){
        ci.tagName = 'p';
    }
    equals(node.innerHTML(),'<p><p><p></p></p></p>');
    node.innerHTML('<div style="border:1px solid #ccc"><div>');
    node = node.firstChild();
    equals(node.getStyle('border'),'1px solid #ccc');
    node.innerHTML('<div style="border:1px solid #ccc;color:#ccc"><div>');
    node = node.firstChild();
    equals(node.getStyle('border'),'1px solid #ccc');
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

    equals(node.getAttr('style'),undefined)
});