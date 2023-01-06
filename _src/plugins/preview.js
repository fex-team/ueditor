/**
 * 预览
 * @file
 * @since 1.2.6.1
 */

/**
 * 预览
 * @command preview
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'preview' );
 * ```
 */
UE.commands["preview"] = {
  execCommand: function() {
    var w = window.open("", "_blank", ""),
      d = w.document;
    d.open();
    d.write(
      '<!DOCTYPE html><html><head><meta charset="utf-8"/><script src="' +
        this.options.UEDITOR_HOME_URL +
        'ueditor.parse.js"></script><script>' +
        "setTimeout(function(){uParse('div',{rootPath: '" +
        this.options.UEDITOR_HOME_URL +
        "'})},300)" +
        "</script></head><body><div>" +
        this.getContent(null, null, true) +
        "</div></body></html>"
    );
    d.close();
  },
  notNeedUndo: 1
};
