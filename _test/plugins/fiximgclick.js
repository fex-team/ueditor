module( 'plugins.fiximgclick' );

test( 'webkit下图片可以被选中并出现八个角', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
        editor.render(sc.id);
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var range = editor.selection.getRange();
            ua.checkResult( range, p, p, 1, 2, false, '检查当前的range是否为img' );
            var scale = document.getElementById(editor.ui.id + '_scale');
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ok(img.style.width == scale.style.width && img.style.height == scale.style.height, "检查八个角和图片宽高度是否相等");
            UE.delEditor(sc.id);
            domUtils.remove(sc);
            start();
        });
        stop();
    }
} );

test( '鼠标在八个角上拖拽改变图片大小', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
        editor.render(sc.id);
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = document.getElementById(editor.ui.id + '_imagescale');
            var hand0 = scale.children[0], width, height;
            width = parseInt(scale.style.width);
            height = parseInt(scale.style.height);
            ua.mousedown( hand0, {clientX: 322, clientY: 281} );
            ua.mousemove( document, {clientX: 352, clientY: 301} );
            equal(width-parseInt(scale.style.width), 30, "检查鼠标拖拽中图片宽度是否正确 --");
            equal(height-parseInt(scale.style.height), 20, "检查鼠标拖拽中图片高度是否正确 --");
            ua.mousemove( document, {clientX: 382, clientY: 321} );
            ua.mouseup( document, {clientX: 382, clientY: 321} );
            equal(width-parseInt(scale.style.width), 60, "检查鼠标拖拽完毕图片高度是否正确 --");
            equal(height-parseInt(scale.style.height), 40, "检查鼠标拖拽完毕图片高度是否正确 --");
            ok(img.style.width == scale.style.width && img.style.height == scale.style.height, "检查八个角和图片宽高度是否相等");
            UE.delEditor(sc.id);
            domUtils.remove(sc);
            start();
        });
        stop();
    }
} );

test( '鼠标点击图片外的其他区域时，八个角消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
        editor.render(sc.id);
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = document.getElementById(editor.ui.id + '_imagescale'),
                cover = document.getElementById(editor.ui.id + '_imagescale_cover');
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ok(cover && cover.style.display!='none', "检查遮罩层是否已出现");
            ua.mousedown( editor.ui.getDom(), {clientX: 100, clientY: 100} );
            ok(cover && cover.style.display=='none', "检查遮罩层是否已消失");
            ok(scale && scale.style.display=='none', "检查八个角是否已消失");
            UE.delEditor(sc.id);
            domUtils.remove(sc);
            start();
        });
        stop();
    }
} );

test( '键盘有操作时，八个角消失', function() {
    if ( ua.browser.webkit ) {
        var sc = document.createElement("script");
        sc.id="sc";
        sc.type = "text/plain";
        document.body.appendChild(sc);
        var editor = new UE.ui.Editor({'autoFloatEnabled':true,'topOffset':60,'autoHeightEnabled':true,'scaleEnabled':false});
        editor.render(sc.id);
        editor.ready(function () {
            editor.setContent( '<p>修正webkit下图片选择的问题<img src="" width="200" height="100" />修正webkit下图片选择的问题</p>' );
            var img = editor.body.getElementsByTagName( 'img' )[0];
            var p = editor.body.firstChild;
            ua.click( img );
            var scale = document.getElementById(editor.ui.id + '_imagescale'),
                cover = document.getElementById(editor.ui.id + '_imagescale_cover');
            ok(scale && scale.style.display!='none', "检查八个角是否已出现");
            ok(cover && cover.style.display!='none', "检查遮罩层是否已出现");
            ua.keydown( editor.ui.getDom());
            ok(cover && cover.style.display=='none', "检查遮罩层是否已消失");
            ok(scale && scale.style.display=='none', "检查八个角是否已消失");
            UE.delEditor(sc.id);
            domUtils.remove(sc);
            start();
        });
        stop();
    }
} );