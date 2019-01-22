/**
 * 打印
 * @file
 * @since 1.2.6.1
 */

/**
 * 打印
 * @command print
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'print' );
 * ```
 */
UE.commands["print"] = {
  execCommand: function() {
    this.window.print();
  },
  notNeedUndo: 1
};
