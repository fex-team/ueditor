module( 'plugins.background' );

test( '背景', function() {
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
            if(ua.browser.ie && ua.browser.ie<9){
                equal(editor.body.style.backgroundColor,'#d7e3bc','检查body背景色');
            }else{
                equal(editor.body.style.backgroundColor,'rgb(215, 227, 188)','检查body背景色');
            }
//            equal(editor.body.style.backgroundImage,'','检查body背景图片');
            document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
            start();
        },50);
    });
    stop();
} );