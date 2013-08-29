/**
 * B、I、sub、super命令支持
 * @file
 */

UE.plugins['basestyle'] = function(){

    /**
     * 字体加粗， 对已加粗的文本内容执行该命令， 将取消加粗
     * @command bold
     * @method execCommand
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //对当前选中的文本内容执行加粗操作
     * //第一次执行， 文本内容加粗
     * editor.execCommand( 'bold' );
     *
     * //第二次执行， 文本内容取消加粗
     * editor.execCommand( 'bold' );
     * ```
     */

    /**
     * 获取当前选中的文本内容的加粗状态
     * @command bold
     * @method queryCommandState
     * @return { int } 如果当前选中的所有文本内容已经被加粗， 则返回1， 否则返回0
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //获取当前选中的文本内容的加粗状态
     * //output: 1 或者 0
     * console.log( editor.queryCommandState( 'bold' ) );
     * ```
     */

    /**
     * 字体倾斜, 对已倾斜的文本内容执行该命令， 将取消倾斜
     * @command italic
     * @method execCommand
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //对当前选中的文本内容执行斜体操作
     * //第一次操作， 文本内容将变成斜体
     * editor.execCommand( 'italic' );
     *
     * //再次对同一文本内容执行， 则文本内容将恢复正常
     * editor.execCommand( 'italic' );
     * ```
     */

    /**
     * 获取当前选中的文本内容的倾斜状态
     * @command italic
     * @method queryCommandState
     * @return { int } 如果当前选中的所有文本内容已经是斜体， 则返回1， 否则返回0
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //获取当前选中的文本内容的倾斜状态
     * //output: 1 或者 0
     * console.log( editor.queryCommandState( 'italic' ) );
     * ```
     */

    /**
     * 下标文本， 把选中的文本内容切换成下标文本， 如果当前选中的文本已经是下标， 则该操作会把文本内容还原成
     * 正常文本
     * @command subscript
     * @method execCommand
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //对当前选中的文本内容执行下标操作
     * //第一次操作， 文本内容将变成下标文本
     * editor.execCommand( 'subscript' );
     *
     * //再次对同一文本内容执行， 则文本内容将恢复正常
     * editor.execCommand( 'subscript' );
     * ```
     */

    /**
     * 获取当前选中的文本内容的下标状态
     * @command subscript
     * @method queryCommandState
     * @return { int } 如果当前选中的所有文本内容已经是下标文本， 则返回1， 否则返回0
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //获取当前选中的文本内容的下标状态
     * //output: 1 或者 0
     * console.log( editor.queryCommandState( 'subscript' ) );
     * ```
     */

    /**
     * 上标文本， 把选中的文本内容切换成上标文本， 如果当前选中的文本已经是上标， 则该操作会把文本内容还原成
     * 正常文本
     * @command superscript
     * @method execCommand
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //对当前选中的文本内容执行上标操作
     * //第一次操作， 文本内容将变成上标文本
     * editor.execCommand( 'superscript' );
     *
     * //再次对同一文本内容执行， 则文本内容将恢复正常
     * editor.execCommand( 'superscript' );
     * ```
     */

    /**
     * 获取当前选中的文本内容的上标状态
     * @command superscript
     * @method queryCommandState
     * @return { int } 如果当前选中的所有文本内容已经是上标文本， 则返回1， 否则返回0
     * @example
     * ```javascript
     * //editor是编辑器实例
     * //获取当前选中的文本内容的上标状态
     * //output: 1 或者 0
     * console.log( editor.queryCommandState( 'superscript' ) );
     * ```
     */
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
    //添加快捷键
    me.addshortcutkey({
        "Bold" : "ctrl+66",//^B
        "Italic" : "ctrl+73", //^I
        "Underline" : "ctrl+85"//^U
    });
    me.addInputRule(function(root){
        utils.each(root.getNodesByTagName('b i'),function(node){
            switch (node.tagName){
                case 'b':
                    node.tagName = 'strong';
                    break;
                case 'i':
                    node.tagName = 'em';
            }
        });
    });
    for ( var style in basestyles ) {
        (function( cmd, tagNames ) {
            me.commands[cmd] = {
                execCommand : function( cmdName ) {
                    var range = me.selection.getRange(),obj = getObj(this,tagNames);
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
                },
                queryCommandState : function() {
                   return getObj(this,tagNames) ? 1 : 0;
                }
            };
        })( style, basestyles[style] );
    }
};

