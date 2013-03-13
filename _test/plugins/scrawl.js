/**
 * Created with JetBrains PhpStorm.
 * User: luqiong
 * Date: 12-11-13
 * Time: 下午2:13
 * To change this template use File | Settings | File Templates.
 */

module( 'plugins.scrawl' );
test( '检查高亮', function() {
    var editor = te.obj[0];
    editor.focus();
    equal( editor.queryCommandState( 'scrawl' ), ( browser.ie && browser.version  <= 8 ) ? -1:0, 'check scrawl state' );
} );




