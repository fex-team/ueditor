/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-7-2
 * Time: 下午5:22
 * To change this template use File | Settings | File Templates.
 */
UE.commands['scrawl'] = {
    queryCommandState : function(){
        return this.highlight|| ( browser.ie && browser.version  <= 8 ) ? -1 :0;
    }
};
