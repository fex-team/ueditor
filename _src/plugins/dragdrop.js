///import core

/**
 * 编辑器中拖拽的处理
 * @function
 */
UE.plugins['dragdrop'] = function (){
    var me = this;
    me.ready(function(){
        //针对图片的拖动定位
        var parent;
        domUtils.on(this.body,'dragstart',function(){
            var rng = me.selection.getRange();
            var node = rng.getClosedNode();
            if(node && node.tagName == 'IMG'){
                parent = node.parentNode;
                if(parent && domUtils.isBlockElm(parent) && domUtils.getComputedStyle(parent,'text-align') == 'center'){

                }else{
                    parent = null;
                }
            }
        });

        domUtils.on(this.body,'dragend',function(){

            var rng = me.selection.getRange();
            var node = rng.getClosedNode();
            if(node && node.tagName == 'IMG'){
                if(parent){
                    if(!domUtils.isEmptyBlock(parent)){
                        parent = parent.cloneNode(false);
                    }

                    node.parentNode.insertBefore(parent,node);
                    parent.appendChild(node);
                }else{
                    var pre = node.previousSibling;
                    var next = node.nextSibling;
                    if((pre && domUtils.isBlockElm(pre) || !pre) && (!next || domUtils.isBlockElm(next))){
                        if(pre){
                            pre.appendChild(node);
                            domUtils.moveChild(next,pre)
                        }else  if(next){
                            next.insertBefore(next.firstChild,node);

                        }
                    }
                }

            }
        })
    });
};
