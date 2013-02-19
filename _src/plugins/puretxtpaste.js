/**
 * @description 纯文本粘贴
 * @name puretxtpaste
 * @author zhanyi
 */

UE.plugins['pasteplain'] = function(){
    var me = this;
    me.setOpt({
        'pasteplain':false,
        'filterTxtRules' : function(){
            function transP(node){
                node.tagName = 'p';
                node.setStyle();
            }
            return {
                //直接删除及其字节点内容
                '-' : 'script style object iframe embed input select',
                'p': {$:{}},
                'br':{$:{}},
                'div':{'$':{}},
                'li':{'$':{}},
                'caption':transP,
                'th':transP,
                'tr':transP,
                'h1':transP,'h2':transP,'h3':transP,'h4':transP,'h5':transP,'h6':transP,
                'td':function(node){
                    //没有内容的td直接删掉
                    var txt = !!node.innerText();
                    if(txt){
                         node.parentNode.insertAfter(UE.uNode.createText(' &nbsp; &nbsp;'),node);
                    }
                    node.parentNode.removeChild(node,node.innerText())
                }
            }
        }()
    });
    //暂时这里支持一下老版本的属性
    var pasteplain = me.options.pasteplain;

    me.commands['pasteplain'] = {
        queryCommandState: function (){
            return pasteplain;
        },
        execCommand: function (){
            pasteplain = !pasteplain|0;
        },
        notNeedUndo : 1
    };
};