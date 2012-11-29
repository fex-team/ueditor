(function() {
    function mySetup() {
        for (var config in window.UEDITOR_CONFIG) {
            if (typeof(window.UEDITOR_CONFIG[config]) == 'string')
                window.UEDITOR_CONFIG[config] = window.UEDITOR_CONFIG[config].replace('_test/tools/br/', '');
        }
        var div = document.body.appendChild( document.createElement( 'div' ) );
        div.id = 'test';

        var iframe = document.createElement( 'iframe' );
        document.body.appendChild( iframe );
        iframe.id = 'iframe';
        te.dom.push( div );
        te.dom.push( iframe );
        var range = new baidu.editor.dom.Range( document );
        var domUtils = baidu.editor.dom.domUtils;
        stop();
        setTimeout(function(){
            te.obj.push( range );
            te.obj.push( domUtils );
        },50);
        
//        te.obj.push(Selection);
//        document.body.appendChild(div);
    }

    var s = QUnit.testStart;
    QUnit.testStart = function() {
        s.apply( this, arguments );
        mySetup();
    };
})()
