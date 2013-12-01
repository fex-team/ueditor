module( 'plugins.background' );


test( 'getAllHtml能取到背景', function() {
    var sc = document.createElement("script");
    var editor = te.obj[2];
    sc.id="sc";
    sc.type = "text/plain";
    document.body.appendChild(sc);
    editor.render('sc');
    editor.ready(function(){
        equal( editor.queryCommandState( 'background' ), 0, 'check background state' );
        this.body.style.backgroundColor = "#d7e3bc";
//        this.body.style.backgroundImage = '/ueditor/php/upload//8721363160868.gif';
        setTimeout(function(){
            var headHtml = [];
            editor.fireEvent('getAllHtml',headHtml);
            equal(ua.formatColor(editor.body.style.backgroundColor),'#d7e3bc','检查body背景色');

//            equal(editor.body.style.backgroundImage,'','检查body背景图片');
            document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
            start();
        },50);
    });
    stop();
} );
test( ' trace 3744 setContent 背景色', function() {
    var editor = te.obj[0];
    editor.setContent('<p> <br/></p><p style="display:none;" data-background="background-repeat:no-repeat; background-position:center center; background-color:#8064A2; ">    <br/></p>');
    stop();
    setTimeout(function(){
        equal(ua.formatColor($(editor.body).css('background-color')),'#8064a2','setContent 背景色');
        start();
    },50);
});
test( ' trace 3751 3748 设置 背景色', function() {
    var editor = te.obj[0];
    var backgroundStyle = {'background-repeat': "no-repeat", 'background-position': "center center", 'background-color': "#4F81BD"};
    editor.setContent('<p><br/></p>');
    editor.execCommand('background',backgroundStyle);
    stop();
    setTimeout(function(){
        equal(editor.queryCommandValue('background')['background-repeat'],'no-repeat');
        equal(ua.formatColor(editor.queryCommandValue('background')['background-color'].toLowerCase()),'#4f81bd');
        ok(/center/.test(editor.queryCommandValue('background')['background-position']));
        editor.execCommand('source');
        setTimeout(function(){
            ua.checkSameHtml(editor.body.lastChild.outerHTML,'<p style="display:none;" data-background="background-repeat:no-repeat; background-position:center center; background-color:#4F81BD; "><br/></p>','source查看 背景色');
//            equal(editor.body.lastChild.outerHTML,'<p style="display:none;" data-background="background-repeat:no-repeat; background-position:center center; background-color:#4F81BD; "><br/></p>','source查看 背景色');
        start();
        },50);
    },50);
});
