///import core
///commands 加粗,斜体,上标,下标
///commandsName  Bold,Italic,Subscript,Superscript
///commandsTitle  加粗,加斜,下标,上标
/**
 * b u i等基础功能实现
 * @function
 * @name baidu.editor.execCommands
 * @param    {String}    cmdName    bold加粗。italic斜体。subscript上标。superscript下标。
*/
UE.plugins['basestyle'] = function(){
    var basestyles = {
            'bold':['strong','b'],
            'italic':['em','i'],
            'subscript':['sub'],
            'superscript':['sup']
        },
        getObj = function(editor,tagNames){
            return domUtils.filterNodeList(editor.selection.getStartElementPath(),tagNames);
        },
        me = this;
    for ( var style in basestyles ) {
        (function( cmd, tagNames ) {
            me.commands[cmd] = {
                execCommand : function( cmdName ) {

                    var range = new dom.Range(me.document),obj = '';
                    //table的处理
                    if(me.currentSelectedArr && me.currentSelectedArr.length > 0){
                        for(var i=0,ci;ci=me.currentSelectedArr[i++];){
                            if(ci.style.display != 'none'){
                                range.selectNodeContents(ci).select();
                                //trace:943
                                !obj && (obj = getObj(this,tagNames));
                                if(cmdName == 'superscript' || cmdName == 'subscript'){
                                    
                                    if(!obj || obj.tagName.toLowerCase() != cmdName){
                                        range.removeInlineStyle(['sub','sup']);
                                    }

                                }
                                obj ? range.removeInlineStyle( tagNames ) : range.applyInlineStyle( tagNames[0] );
                            }

                        }
                        range.selectNodeContents(me.currentSelectedArr[0]).select();
                    }else{
                        range = me.selection.getRange();
                        obj = getObj(this,tagNames);

                        if ( range.collapsed ) {
                            if ( obj ) {
                                var tmpText =  me.document.createTextNode('');
                                range.insertNode( tmpText ).removeInlineStyle( tagNames );

                                range.setStartBefore(tmpText);
                                domUtils.remove(tmpText);
                            } else {
                                
                                var tmpNode = range.document.createElement( tagNames[0] );
                                if(cmdName == 'superscript' || cmdName == 'subscript'){
                                    tmpText = me.document.createTextNode('');
                                    range.insertNode(tmpText)
                                        .removeInlineStyle(['sub','sup'])
                                        .setStartBefore(tmpText)
                                        .collapse(true);

                                }
                                range.insertNode( tmpNode ).setStart( tmpNode, 0 );
                                


                            }
                            range.collapse( true );

                        } else {
                            if(cmdName == 'superscript' || cmdName == 'subscript'){
                                if(!obj || obj.tagName.toLowerCase() != cmdName){
                                    range.removeInlineStyle(['sub','sup']);
                                }

                            }
                            obj ? range.removeInlineStyle( tagNames ) : range.applyInlineStyle( tagNames[0] );
                        }

                        range.select();
                        
                    }

                    return true;
                },
                queryCommandState : function() {
                   if(this.highlight){
                       return -1;
                   }
                   return getObj(this,tagNames) ? 1 : 0;
                }
            };
        })( style, basestyles[style] );

    }
};

