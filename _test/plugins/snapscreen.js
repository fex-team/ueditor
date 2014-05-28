/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-17
 * Time: 下午2:38
 * To change this template use File | Settings | File Templates.
 */
module('plugins.snapscreen');
test('检查高亮', function () {
    var editor = te.obj[0];
    editor.focus();
    equal(editor.queryCommandState('snapscreen'), 0, 'check snapscreen state');
});
test('snapscreen', function () {
    var div = document.body.appendChild(document.createElement('script'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
            setTimeout(function () {
                editor.execCommand('snapscreen');
                editor.container.removeChild(editor.container.lastChild);
                setTimeout(function () {
                    ok($('.edui-dialog .edui-for-snapscreen')[0] != null, '');
                    $EDITORUI[$('.edui-dialog .edui-for-snapscreen')[0].parentNode.id].close();
                    setTimeout(function () {

                        UE.delEditor('ue');
                        te.dom.push(document.getElementById('ue'));
                        start();
                    }, 1000);
                }, 300);


            }, 100);


        }

    );
});