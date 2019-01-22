/**
 * 大小写转换
 * @file
 * @since 1.2.6.1
 */

/**
 * 把选区内文本变大写，与“tolowercase”命令互斥
 * @command touppercase
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'touppercase' );
 * ```
 */

/**
 * 把选区内文本变小写，与“touppercase”命令互斥
 * @command tolowercase
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'tolowercase' );
 * ```
 */
UE.commands["touppercase"] = UE.commands["tolowercase"] = {
  execCommand: function(cmd) {
    var me = this;
    var rng = me.selection.getRange();
    if (rng.collapsed) {
      return rng;
    }
    var bk = rng.createBookmark(),
      bkEnd = bk.end,
      filterFn = function(node) {
        return !domUtils.isBr(node) && !domUtils.isWhitespace(node);
      },
      curNode = domUtils.getNextDomNode(bk.start, false, filterFn);
    while (
      curNode &&
      domUtils.getPosition(curNode, bkEnd) & domUtils.POSITION_PRECEDING
    ) {
      if (curNode.nodeType == 3) {
        curNode.nodeValue = curNode.nodeValue[
          cmd == "touppercase" ? "toUpperCase" : "toLowerCase"
        ]();
      }
      curNode = domUtils.getNextDomNode(curNode, true, filterFn);
      if (curNode === bkEnd) {
        break;
      }
    }
    rng.moveToBookmark(bk).select();
  }
};
