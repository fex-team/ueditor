/**
 * 文库自动排版插件
 * User: hancong03@baidu.com
 * Date: 13-7-2
 * Time: 下午3:48
 */

UE.plugins['autotypeset'] = function(){

    this.setOpt({'autotypeset':{
        removeEmptyline : true,        //去掉空行
        //去除首尾换行
        trimSpace: true,
        indent : true,                  // 行首缩进
        indentValue : '2em'             //行首缩进的大小
    }});
    var me = this,
        opt = me.options.autotypeset,
        remainClass = {
            'selectTdClass':1,
            'pagebreak':1,
            'anchorclass':1
        },
        remainTag = {
            'li':1
        },
        tags = {
            div:1,
            p:1,
            //trace:2183 这些也认为是行
            blockquote:1,center:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,
            span:1
        },
        highlightCont;
    //升级了版本，但配置项目里没有autotypeset
    if(!opt){
        return;
    }
    function isLine(node,notEmpty){
        if(!node || node.nodeType == 3)
            return 0;
        if(domUtils.isBr(node))
            return 1;
        if(node && node.parentNode && tags[node.tagName.toLowerCase()]){
            if(highlightCont && highlightCont.contains(node)
                ||
                node.getAttribute('pagebreak')
                ){
                return 0;
            }

            return notEmpty ? !domUtils.isEmptyBlock(node) : domUtils.isEmptyBlock(node,new RegExp('[\\s'+domUtils.fillChar
                +']','g'));
        }
    }

    function autotype(type,html){
        var me = this,cont;
        if(html){
            cont = me.document.createElement('div');
            cont.innerHTML = html.html;
        }else{
            cont = me.document.body;
        }
        var nodes = domUtils.getElementsByTagName(cont,'*');

        // 行首缩进，段落方向，段间距，段内间距
        for(var i=0,ci;ci=nodes[i++];){

            if(me.fireEvent('excludeNodeinautotype',ci) === true){
                continue;
            }
            if(isLine(ci)){
                //去掉空行，保留占位的空行
                if(opt.removeEmptyline && domUtils.inDoc(ci,cont) && !remainTag[ci.parentNode.tagName.toLowerCase()] ){
                    if(domUtils.isBr(ci)){
                        next = ci.nextSibling;
                        if(next && !domUtils.isBr(next)){
                            continue;
                        }
                    }
                    domUtils.remove(ci);
                    continue;
                }

            }
            if(isLine(ci,true) && ci.tagName != 'SPAN'){
                if(opt.indent){
                    ci.classList.remove( UE.NO_INDENT_FLAG );
                    ci.classList.add( UE.INDENT_FLAG );
                }
            }
            //去除首尾空格
            if( opt.trimSpace && /^p|h\d$/i.test(ci.tagName) && !ci._trimed ) {
                var str = ci.innerHTML;
                str = utils.trim( str );
                str = str.replace(/^(\s*(&nbsp;)*\s*)+|(\s*(&nbsp;)*\s*)+$/gi, '');
                ci.innerHTML = str;
                ci._trimed = true;
            }

        }
        if(html){
            html.html = cont.innerHTML;
        }
    }

    me.commands['autotypeset'] = {
        execCommand:function () {
            me.removeListener('beforepaste',autotype);
            if(opt.pasteFilter){
                me.addListener('beforepaste',autotype);
            }
            autotype.call(me)
        }

    };

};