///import core
///import plugins\removeformat.js
///commands 字体颜色,背景色,字号,字体,下划线,删除线
///commandsName  ForeColor,BackColor,FontSize,FontFamily,Underline,StrikeThrough
///commandsTitle  字体颜色,背景色,字号,字体,下划线,删除线
/**
 * @description 字体
 * @name baidu.editor.execCommand
 * @param {String}     cmdName    执行的功能名称
 * @param {String}    value             传入的值
 */
UE.plugins['font'] = function() {
    var me = this,
        fonts = {
            'forecolor':'color',
            'backcolor':'background-color',
            'fontsize':'font-size',
            'fontfamily':'font-family',
            'underline':'text-decoration',
            'strikethrough':'text-decoration',
            'fontborder':'border'
        },
        needCmd = {'underline':1,'strikethrough':1,'fontborder':1};
    me.setOpt({
        'fontfamily':[
            { name:'songti',val:'宋体,SimSun'},
            { name:'yahei',val:'微软雅黑,Microsoft YaHei'},
            { name:'kaiti',val:'楷体,楷体_GB2312, SimKai'},
            { name:'heiti',val:'黑体, SimHei'},
            { name:'lishu',val:'隶书, SimLi'},
            { name:'andaleMono',val:'andale mono'},
            { name:'arial',val:'arial, helvetica,sans-serif'},
            { name:'arialBlack',val:'arial black,avant garde'},
            { name:'comicSansMs',val:'comic sans ms'},
            { name:'impact',val:'impact,chicago'},
            { name:'timesNewRoman',val:'times new roman'}
          ],
        'fontsize':[10, 11, 12, 14, 16, 18, 20, 24, 36]
    });
//    function mergesibling(range,me){
//        var collapsed = range.collapsed,
//            bk = range.createBookmark(),common;
//        if(collapsed){
//            common = bk.start.parentNode;
//            while(dtd.$inline[common.tagName]){
//                common = common.parentNode;
//            }
//        }else{
//
//            common = domUtils.getCommonAncestor(bk.start,bk.end);
//        }
//
//        utils.each(domUtils.getElementsByTagName(common,'span'),function(node){
//            if(!node.parentNode){
//                return;
//            }
//            function isBorder(n){
//                if(!n)
//                    return false;
//                if(n.tagName != 'SPAN')
//                    return false;
//                var val;
//                if(val = domUtils.getComputedStyle( n, 'border' )){
//                    if(/1px/.test(val) && /solid/.test(val)){
//                        return true;
//                    }
//                }
//                return false;
//            }
//            function nextSibling(node){
//                var next = node.nextSibling;
//                if(next && domUtils.isBookmarkNode(next)){
//                    next = next.nextSibling;
//                }
//                return next;
//            }
//
//            var span = me.document.createElement('span');
//            span.style.cssText = 'border:1px solid #000';
//            node.parentNode.insertBefore(span,node);
//            while(isBorder(node) && isBorder(nextSibling(node))){
//                var val = utils.trim(node.style.cssText.replace(/border[^:]+:[^;]+;?/gi,''));
//                node.style.cssText = val;
//                var tmp  = node.nextSibling;
//                if(!val){
//                    while(node.firstChild){
//                        if(isBorder(node.firstChild)){
//                            node.firstChild.style.cssText = node.firstChild.style.cssText.replace(/border[^:]+:[^;]+;?/gi,'');
//                        }
//                        span.appendChild(node.firstChild)
//                    }
//                    domUtils.remove(node)
//                }else{
//                    span.appendChild(node);
//                }
//                if(domUtils.isBookmarkNode(tmp)){
//                    node = tmp.nextSibling;
//                    span.appendChild(tmp)
//                }else{
//                    node = tmp;
//                }
//            }
//            if(!span.firstChild){
//                domUtils.remove(span)
//            }else{
//                if(isBorder(span) && isBorder(nextSibling(span))){
//                    node = span.nextSibling;
//                    var val = utils.trim(node.style.cssText.replace(/border[^:]+:[^;]+;?/gi,''));
//                    node.style.cssText = val;
//
//                    if(!val){
//                        while(node.firstChild){
//                            if(isBorder(node.firstChild)){
//                                node.firstChild.style.cssText = node.firstChild.style.cssText.replace(/border[^:]+:[^;];?/,'');
//                            }
//                            span.appendChild(node.firstChild)
//                        }
//                        domUtils.remove(node)
//                    }else{
//                        span.appendChild(node);
//                    }
//                }
//            }
//            if(isBorder(node)){
//                var tmpParent = node.parentNode;
//                while(dtd.$inline[tmpParent.tagName]){
//                    if(isBorder(tmpParent)){
//                        var val = utils.trim(node.style.cssText.replace(/border[^:]+:[^;]+;?/gi,''));
//                        node.style.cssText = val;
//                        if(!val){
//                            domUtils.remove(node,true)
//                        }
//                        break;
//                    }
//                    tmpParent = tmpParent.parentNode;
//
//                }
//
//            }
//
//        });
//        range.moveToBookmark(bk);
//    }
    function mergesibling(rng){
        var collapsed = rng.collapsed,
            bk = rng.createBookmark(),common;
        if(collapsed){
            common = bk.start.parentNode;
            while(dtd.$inline[common.tagName]){
                common = common.parentNode;
            }
        }else{
            common = domUtils.getCommonAncestor(bk.start,bk.end);
        }
        utils.each(domUtils.getElementsByTagName(common,'span'),function(span){
            if(!span.parentNode || domUtils.isBookmarkNode(span))return;
            if(/^\s*border\s*:\s*none;\s*/i.test(span.style.cssText)){
                domUtils.remove(span,true);
                return
            }
            if(/border/i.test(span.style.cssText) && span.parentNode.tagName == 'SPAN' && /border/i.test(span.parentNode.style.cssText)){
                span.style.cssText = span.style.cssText.replace(/border[^:]*:[^;]+;?/gi,'');
            }
            var next = span.nextSibling;
            while(next && next.nodeType == 1 && next.tagName == 'SPAN'){
                if(domUtils.isBookmarkNode(next)){
                    span.appendChild(next);
                }else{
                    if(next.style.cssText == span.style.cssText){
                        domUtils.moveChild(next,span);
                        domUtils.remove(next);
                    }
                }
                if(span.nextSibling === next)
                    break;
                next = span.nextSibling;
            }
        });
        rng.moveToBookmark(bk);
    }
    me.addInputRule(function(root){
        utils.each(root.getNodesByTagName('u s del font'),function(node){
            if(node.tagName == 'font'){
                var cssStyle = [];
                for(var p in node.attrs){
                    switch (p){
                        case 'size':
                            cssStyle.push('font-size:' + node.attrs[p] + 'px');
                            break;
                        case 'color':
                            cssStyle.push('color:'+ node.attrs[p]);
                            break;
                        case 'face':
                            cssStyle.push('font-family:'+ node.attrs[p]);
                            break;
                        case 'style':
                            cssStyle.push(node.attrs[p]);
                    }
                }
                node.attrs = {
                    'style' : cssStyle.join(';')
                };
            }else{
                var val = node.tagName == 'u' ? 'underline' : 'line-through';
                node.attrs = {
                    'style' : (node.getAttr('style') || '') + 'text-decoration:'+val+';'
                }
            }
            node.tagName = 'span';
        });
    });
    for ( var p in fonts ) {
        (function( cmd, style ) {
            UE.commands[cmd] = {
                execCommand : function( cmdName, value ) {
                    value = value || (this.queryCommandState(cmdName) ? 'none' : cmdName == 'underline' ? 'underline' :
                        cmdName == 'fontborder' ? '1px solid #000' :
                       'line-through');
                    var me = this,
                        range = this.selection.getRange(),
                        text;

                    if ( value == 'default' ) {

                        if(range.collapsed){
                            text = me.document.createTextNode('font');
                            range.insertNode(text).select();

                        }
                        me.execCommand( 'removeFormat', 'span,a', style);
                        if(text){
                            range.setStartBefore(text).setCursor();
                            domUtils.remove(text);
                        }


                    } else {
                            if ( !range.collapsed ) {
                                if(needCmd[cmd] && me.queryCommandValue(cmd)){
                                     me.execCommand( 'removeFormat', 'span,a', style );
                                }
                                range = me.selection.getRange();

                                range.applyInlineStyle( 'span', {'style':style + ':' + value} );
                                mergesibling(range,me);
                                range.select();
                            } else {

                                var span = domUtils.findParentByTagName(range.startContainer,'span',true);
                                text = me.document.createTextNode('font');
                                if(span && !span.children.length && !span[browser.ie ? 'innerText':'textContent'].replace(fillCharReg,'').length){
                                    //for ie hack when enter
                                    range.insertNode(text);
                                     if(needCmd[cmd]){
                                         range.selectNode(text).select();
                                         me.execCommand( 'removeFormat','span,a', style, null );

                                         span = domUtils.findParentByTagName(text,'span',true);
                                         range.setStartBefore(text);

                                    }
                                    span && (span.style.cssText += ';' + style + ':' + value);
                                    range.collapse(true).select();


                                }else{
                                    range.insertNode(text);
                                    range.selectNode(text).select();
                                    span = range.document.createElement( 'span' );

                                    if(needCmd[cmd]){
                                        //a标签内的不处理跳过
                                        if(domUtils.findParentByTagName(text,'a',true)){
                                            range.setStartBefore(text).setCursor();
                                             domUtils.remove(text);
                                             return;
                                         }
                                         me.execCommand( 'removeFormat','span,a', style );
                                    }

                                    span.style.cssText = style + ':' + value;


                                    text.parentNode.insertBefore(span,text);
                                    //修复，span套span 但样式不继承的问题
                                    if(!browser.ie || browser.ie && browser.version == 9){
                                        var spanParent = span.parentNode;
                                        while(!domUtils.isBlockElm(spanParent)){
                                            if(spanParent.tagName == 'SPAN'){
                                                //opera合并style不会加入";"
                                                span.style.cssText = spanParent.style.cssText + ";" + span.style.cssText;
                                            }
                                            spanParent = spanParent.parentNode;
                                        }
                                    }



                                    if(opera){
                                        setTimeout(function(){
                                            range.setStart(span,0).collapse(true);
                                            mergesibling(range,me);
                                            range.select();
                                        });
                                    }else{
                                        range.setStart(span,0).collapse(true);
                                        mergesibling(range,me);
                                        range.select();
                                    }

                                    //trace:981
                                    //domUtils.mergeToParent(span)
                                }
                                domUtils.remove(text);
                            }


                    }
                    return true;
                },
                queryCommandValue : function (cmdName) {
                    var startNode = this.selection.getStart();

                    //trace:946
                    if(cmdName == 'underline'||cmdName=='strikethrough' ){
                        var tmpNode = startNode,value;
                        while(tmpNode && !domUtils.isBlockElm(tmpNode) && !domUtils.isBody(tmpNode)){
                            if(tmpNode.nodeType == 1){
                                value = domUtils.getComputedStyle( tmpNode, style );

                                if(value != 'none'){
                                    return value;
                                }
                            }

                            tmpNode = tmpNode.parentNode;
                        }
                        return 'none';
                    }
                    if(cmdName == 'fontborder'){
                        var tmp = startNode,val;
                        while(tmp && dtd.$inline[tmp.tagName]){
                            if(val = domUtils.getComputedStyle( tmp, 'border' )){
                                if( /1px/.test(val) && /solid/.test(val)){
                                    return val;
                                }
                            }
                            tmp = tmp.parentNode;
                        }
                        return ''
                    }
                    return  domUtils.getComputedStyle( startNode, style );
                },
                queryCommandState : function(cmdName){
                    if(!needCmd[cmdName])
                        return 0;
                    var val = this.queryCommandValue(cmdName);
                    if(cmdName == 'fontborder'){
                        return /1px/.test(val) && /solid/.test(val)
                    }else{
                        return  val == (cmdName == 'underline' ?
                            'underline' : 'line-through');
                    }

                }
            };
        })( p, fonts[p] );
    }
};