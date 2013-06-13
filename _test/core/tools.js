(function () {
    function mySetup() {
        for (var config in window.UEDITOR_CONFIG) {
            if (typeof(window.UEDITOR_CONFIG[config]) == 'string')
                window.UEDITOR_CONFIG[config] = window.UEDITOR_CONFIG[config].replace('_test/tools/br/', '');
        }
        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'test1';
        var utils = baidu.editor.utils;
        var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../', 'autoFloatEnabled':false});
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.id = 'iframe';
        var range = new baidu.editor.dom.Range(document);
        var domUtils = baidu.editor.dom.domUtils;
        var div_dom = document.body.appendChild(document.createElement('div'));
        div_dom.id = 'test';
        te.dom.push(div);
        te.dom.push(iframe);
        te.dom.push(div_dom);
        te.obj.push(utils);
        te.obj.push(editor);
        te.obj.push(range);
        te.obj.push(domUtils);
    }
    var s = QUnit.testStart;
    QUnit.testStart = function () {
        s.apply(this, arguments);
        mySetup();
    };
})()