(function() {
    function mySetup() {
        for (var config in window.UEDITOR_CONFIG) {
            if (typeof(window.UEDITOR_CONFIG[config]) == 'string')
                window.UEDITOR_CONFIG[config] = window.UEDITOR_CONFIG[config].replace('_test/tools/br/', '');
        }
        var div = document.body.appendChild( document.createElement( 'div' ) );
        div.id = 'test';
        var utils = baidu.editor.utils;
        var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
        editor.render( div );
        stop();
        setTimeout(function(){
            te.dom.push( div );
            te.obj.push( utils );
            te.obj.push( editor );
        },50);
    }

    var s = QUnit.testStart;
    QUnit.testStart = function() {
        s.apply( this, arguments );
        mySetup();
    };
})()