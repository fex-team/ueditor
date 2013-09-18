/**
 * 插入时间和日期
 * @file
 * @since 1.2.6.1
 */

/**
 * 插入时间
 * @command time
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @remind 时间的替换规则
 *  hh：替换成小时
 *  ii：替换成分钟
 *  ss：替换成秒钟
 * @example
 * ```javascript
 * editor.execCommand( 'time'); //插入当前时间,默认的格式：12:59:59
 * editor.execCommand( 'time', 'hh:ii:ss' ); //按照格式参数插入时间
 * ```
 */
/**
 * 插入日期
 * @command date
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } format 日期格式
 * @remind 时间格式的替换规则
 *  yyyy：替换成4位年,如1993
 *  yy：替换成2位年,如93
 *  mm：替换成月份
 *  dd：替换成日期
 * @example
 * ```javascript
 * editor.execCommand( 'date'); //插入当前日期,默认的格式：2013-08-30
 * editor.execCommand( 'date', 'yyyy-mm-dd' ); //按照格式参数插入日期
 * ```
 */
UE.commands['time'] = UE.commands["date"] = {
    execCommand : function(cmd, format){
        var date = new Date;

        function formatTime(date, format) {
            var hh = ('0' + date.getHours()).slice(-2),
                ii = ('0' + date.getMinutes()).slice(-2),
                ss = ('0' + date.getSeconds()).slice(-2);
            format = format || 'hh:ii:ss';
            return format.replace(/hh/ig, hh).replace(/ii/ig, ii).replace(/ss/ig, ss);
        }
        function formatDate(date, format) {
            var yyyy = ('000' + date.getFullYear()).slice(-4),
                yy = yyyy.slice(-2),
                mm = ('0' + date.getMonth()).slice(-2),
                dd = ('0' + date.getDate()).slice(-2);
            format = format || 'yyyy-mm-dd';
            return format.replace(/yyyy/ig, yyyy).replace(/yy/ig, yy).replace(/mm/ig, mm).replace(/dd/ig, dd);
        }

        this.execCommand('insertHtml',cmd == "time" ? formatTime(date, format):formatDate(date, format) );
    }
};
