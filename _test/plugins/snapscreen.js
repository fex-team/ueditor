/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-17
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.snapscreen' );
test( '检查高亮', function() {
    var editor = te.obj[0];
    editor.focus();
    equal( editor.queryCommandState( 'snapscreen' ), 0, 'check snapscreen state' );
} );