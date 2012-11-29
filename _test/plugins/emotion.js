/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-9-18
 * Time: 下午12:33
 * To change this template use File | Settings | File Templates.
 */

module('plugins.emotion');

test('选择表情',function(){
    var editor=te.obj[0];
    editor.focus();
    equal(editor.queryCommandState('emotion'),0,'state');
});