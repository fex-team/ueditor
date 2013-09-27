/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-17
 * Time: 下午2:55
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.iframe' );
test( '检查高亮和清除_iframe', function() {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        te.obj[2].render('sc');

    te.obj[2].ready(function(){
            equal( te.obj[2].queryCommandState( 'insertframe' ), 0, 'check insertframe state' );
            var iframe = document.createElement('iframe');
            $(iframe).attr('src','www.baidu.com');
            this._iframe = iframe;
            this.setContent('<p>欢迎使用ueditor!</p>');
            ok(te.obj[2]._iframe,'加入_iframe');
            setTimeout(function(){
                ok(!te.obj[2]._iframe,'检查selectionchanged会触发去掉_iframe');
                document.getElementById('sc').parentNode.removeChild(document.getElementById('sc'));
                start();
            },50);
    });
    stop();
} );