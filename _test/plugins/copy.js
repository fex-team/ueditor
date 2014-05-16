module('plugins.copy');

//需要点击授权弹出框,暂时去除
//test('检查IE下复制命令是否执行正常', function () {
//
//    if (browser.ie) {
//        var editor = te.obj[0];
//        editor.setContent('<p>hello</p>');
//        editor.focus();
//
//        editor.execCommand('selectall');
//        editor.execCommand('copy');
//        editor.body.innerHTML = '';
//        editor.execCommand('selectall');
//        editor.body.document.execCommand('paste');
//
//        equal(utils.trim(window.clipboardData.getData('text')), 'hello', '检查粘贴板内容,IE下成功复制内容');
//        setTimeout(function(){
//            equal(editor.getContent(), '<p>hello</p>', '检查原生粘贴命令,IE下成功复制内容');
//            start();
//        },100);
//
//        stop();
//    }
//
//});

test('检查非IE下是否正常加载zeroclipboard粘贴板插件', function () {

    if (!browser.ie) {

        setTimeout(function(){
            ok(ZeroClipboard, '是否正常加载zeroclipboard粘贴板插件');
            start();
        }, 300);

        stop();

    }

});