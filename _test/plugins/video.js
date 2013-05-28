/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-5-15
 * Time: 下午7:15
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.video' );

test( '视频', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent( '<p>hello</p>' );
    range.setStart(editor.body.firstChild,0).collapse(true).select();
    var videoObject  ={url: "http://player.youku.com/player.php/Type/Folder/Fid/19275705/Ob/1/sid/XNTU3Mjk4NzQ4/v.swf", width: "500", height: "400", align: "center"}
    editor.execCommand( 'insertvideo',videoObject);
    stop();
    setTimeout(function(){
        var img = editor.body.getElementsByTagName('img');
        equal(img.length,1,'插入img');
        equal(img[0].width,"500");
        equal(img[0].height,"400");
        equal(img[0].src,editor.options.UEDITOR_HOME_URL+'themes/default/images/spacer.gif');
        if(ua.browser.gecko||ua.browser.ie>8){
            ok(img[0].style.background.indexOf('url(\"'+editor.options.UEDITOR_HOME_URL+'themes/default/images/videologo.gif\")') > -1);
        }
        else
        {
            ok(img[0].style.background.indexOf("url("+editor.options.UEDITOR_HOME_URL+"themes/default/images/videologo.gif)") > -1);
        }
        start();
    },100);
} );