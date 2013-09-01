/**
 * 涂鸦
 * @file
 * @since 1.2.6.1
 */

/*
 * 涂鸦浏览器判断
 * @command scrawl
 * @method queryCommandState
 * @return { Int } ie8下返回-1，反之返回0
 * @example
 * ```javascript
 * editor.queryCommandState( 'scrawl' );
 * ```
 */
UE.commands['scrawl'] = {
    queryCommandState : function(){
        return ( browser.ie && browser.version  <= 8 ) ? -1 :0;
    }
};
