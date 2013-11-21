module( 'core.plugin' );

test( 'register', function() {
    UE.plugin.register('test',function(){
        this.testplugin = true;
    });
    $('<div id="ue"></div>').appendTo(document.body);
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        ok(this.testplugin);
        editor.destroy();
        $('#ue').remove()
        start();
    });
});
test( 'load', function() {
    UE.plugin.register('test',function(){
        this.testplugin = true;
    });
    $('<div id="ue"></div>').appendTo(document.body);
    var editor = UE.getEditor('ue',{
        test:false
    });
    stop();
    editor.ready(function () {
//        ok(!this.testplugin); todo
        start();
    });
});