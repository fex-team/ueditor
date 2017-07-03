/**
 * 插入时间和日期
 * @file
 * @since 1.2.6.1
 */

/**
 * 插入时间，默认格式：12:59:59
 * @command time
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'time');
 * ```
 */

/**
 * 插入日期，默认格式：2013-08-30
 * @command date
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'date');
 * ```
 */
UE.commands["time"] = UE.commands["date"] = {
  execCommand: function(cmd, format) {
    var date = new Date();

    function formatTime(date, format) {
      var hh = ("0" + date.getHours()).slice(-2),
        ii = ("0" + date.getMinutes()).slice(-2),
        ss = ("0" + date.getSeconds()).slice(-2);
      format = format || "hh:ii:ss";
      return format.replace(/hh/gi, hh).replace(/ii/gi, ii).replace(/ss/gi, ss);
    }
    function formatDate(date, format) {
      var yyyy = ("000" + date.getFullYear()).slice(-4),
        yy = yyyy.slice(-2),
        mm = ("0" + (date.getMonth() + 1)).slice(-2),
        dd = ("0" + date.getDate()).slice(-2);
      format = format || "yyyy-mm-dd";
      return format
        .replace(/yyyy/gi, yyyy)
        .replace(/yy/gi, yy)
        .replace(/mm/gi, mm)
        .replace(/dd/gi, dd);
    }

    this.execCommand(
      "insertHtml",
      cmd == "time" ? formatTime(date, format) : formatDate(date, format)
    );
  }
};
