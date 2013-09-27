module('plugins.autoheight');

test('自动长高',function(){
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    document.body.appendChild(sc);
    var editor = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
    editor.render('sc');
    te.dom[0].parentNode.removeChild(te.dom[0]);
    stop();
    setTimeout(function(){
        var height=editor.body.style.height;
        editor.setContent('<br/>nmnmknmm,<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>');
        setTimeout(function(){
            ok(height!=editor.body.style.height,'自动长高');
            editor.disableAutoHeight();
            editor.body.style.height=height;
            editor.setContent('<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>');
            stop();
            setTimeout(function(){
                ok(height==editor.body.style.height,'不长高');

                start();
            },200);
        },200);
    },800);
});