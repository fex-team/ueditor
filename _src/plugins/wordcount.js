///import core
///commands 字数统计
///commandsName  WordCount,wordCount
///commandsTitle  字数统计
/**
 * Created by JetBrains WebStorm.
 * User: taoqili
 * Date: 11-9-7
 * Time: 下午8:18
 * To change this template use File | Settings | File Templates.
 */

UE.plugins['wordcount'] = function(){
    var me = this;
    me.setOpt({
        wordCount:true,
        wordCountIngoreHtml:true,
        maximumWords:10000,
        wordCountMsg: me.options.wordCountMsg||me.getLang("wordCountMsg"),
        wordOverFlowMsg:me.options.wordOverFlowMsg||me.getLang("wordOverFlowMsg")
    });
    var opt = me.options,
        max = opt.maximumWords,
        msg = opt.wordCountMsg ,
        errMsg = opt.wordOverFlowMsg;
    if(!opt.wordCount){
        return;
    }
    me.commands["wordcount"]={
        queryCommandValue:function(cmd,onlyCount){
            var length;
            if(onlyCount){
                return this.getContentLength(this.options.wordCountIngoreHtml);
            }
            length = this.getContentLength(this.options.wordCountIngoreHtml);
            if(max-length<0){
                me.fireEvent('wordcountoverflow',length);
                return errMsg;
            }
            return msg.replace("{#leave}",max-length >= 0 ? max-length:0).replace("{#count}",length);
        }
    };
};
