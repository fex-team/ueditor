/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-18
 * Time: 下午4:34
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.spechars' );
test( '检查高亮', function() {
    var editor = te.obj[0];
    editor.focus();
    equal( editor.queryCommandState( 'spechars' ), 0, 'check attachment state' );
} );