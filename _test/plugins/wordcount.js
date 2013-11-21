module('plugins.wordcount');

test('trace 1743 右键删除后计算字数', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>hello</p>');
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        editor.execCommand('selectall');
        editor.execCommand('cleardoc');
        equal(editor.getContentLength(true), 0, '插入成功');

        start();
    }, 50);
    stop();
});

test('空格', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('           \ufeff\u200B\t\t    \n\n\t\n\b\t\n\b\u200B\t\t\n\n    ');
    if (ua.browser.ie)
        equal(editor.getContentLength(true), 23, '清空后编辑器中23个空格');
    else
        equal(editor.getContentLength(true), 22, '清空后编辑器中22个空格');
});

test(' trace 3744 超出最大', function () {

    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue', {'UEDITOR_HOME_URL': '../../../', 'wordCount': true, 'maximumWords': 10,'initialContent':'','autoFloatEnabled': false});
    editor.ready(function () {

        expect(2);
        editor.addListener("wordcountoverflow", function () {
            ok(true, "超出最大");
            setTimeout(function () {
                UE.delEditor('ue');
                start();
            }, 500);
        });
        setTimeout(function () {
            editor.setContent('hello hello hello');
            equal(editor.getContentLength(true), 17, '仅统计字数')

        }, 50);
    });
    stop();
});
