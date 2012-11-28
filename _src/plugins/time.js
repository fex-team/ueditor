///import core
///import plugins\inserthtml.js
///commands 日期,时间
///commandsName  Date,Time
///commandsTitle  日期,时间
/**
 * 插入日期
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName    date插入日期
 * @author zhuwenxuan
*/
/**
 * 插入时间
 * @function
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName    time插入时间
 * @author zhuwenxuan
*/
UE.commands['time'] = UE.commands["date"] = {
    execCommand : function(cmd){
        var date = new Date;
        this.execCommand('insertHtml',cmd == "time" ?
            (date.getHours()+":"+ (date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes())+":"+(date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds())) :
            (date.getFullYear()+"-"+((date.getMonth()+1)<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1)+"-"+(date.getDate()<10?"0"+date.getDate():date.getDate())));
    },
    queryCommandState : function(){
            return this.highlight ? -1 :0;
    }
};



