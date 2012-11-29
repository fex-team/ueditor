/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-9-18
 * Time: 下午12:59
 * To change this template use File | Settings | File Templates.
 */

module('plugins.map');

test('选择地图',function(){
    var editor=te.obj[0];
    editor.focus();
    equal(editor.queryCommandState('map'),0,'map state');
    equal(editor.queryCommandState('gmap'),0,'gmap state');
});