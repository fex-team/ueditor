(function () {
    function mySetup() {
        for (var config in window.UEDITOR_CONFIG) {
            if (typeof(window.UEDITOR_CONFIG[config]) == 'string')
                window.UEDITOR_CONFIG[config] = window.UEDITOR_CONFIG[config].replace('_test/tools/br/', '');
        }

        var div = document.body.appendChild(document.createElement('div'));
        div.id = 'test1';
        var utils = baidu.editor.utils;
        var editor = new baidu.editor.Editor({'UEDITOR_HOME_URL':'../../../', 'autoFloatEnabled':false,initialContent:'tool'});
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
    var _d = function () {

        if (te) {
            if (te.dom && te.dom.length) {
                for (var i = 0; i < te.dom.length; i++) {
                    if (te.dom[i] && te.dom[i].parentNode)
                        te.dom[i].parentNode.removeChild(te.dom[i]);
                }

            }
        }
        te.dom = [];
        te.obj = [];
    };
    var s = QUnit.testStart, d = QUnit.testDone;
    QUnit.testStart = function () {
        s.apply(this, arguments);
        mySetup();
    };
    QUnit.testDone = function () {
        _d();
        d.apply(this, arguments);
    };
})()