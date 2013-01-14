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
    me.addListener('contentchange',function(){
        me.fireEvent('wordcount')
    });
    var timer;
    me.addListener('keyup',function(){
        clearTimeout(timer);
        var me = this;
        timer = setTimeout(function(){
            me.fireEvent('wordcount')
        },200)
    });
};
