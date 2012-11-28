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
            var length,contentText,reg;
            if(onlyCount){
                reg = new RegExp("[\r\t\n]","g");
                contentText = this.getContentTxt().replace(reg,"");
                return contentText.length;
            }
            reg = new RegExp("[\r\t\n]","g");
            contentText = this.getContentTxt().replace(reg,"");
            length = contentText.length;
            if(max-length<0){
                me.fireEvent('wordcountoverflow',length);
                return errMsg;
            }

            return msg.replace("{#leave}",max-length >= 0 ? max-length:0).replace("{#count}",length);
        }
    };
};
