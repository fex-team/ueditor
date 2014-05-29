module( 'plugins.anchor' );

test( '插入锚点后切换源码', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    stop();
    var br = baidu.editor.browser.ie ? '&nbsp;' : '<br />';     //1.2版本,ie中‘’-〉'&nbsp;'
    setTimeout( function() {
        editor.setContent( '<p>' + br + '</p>' );
        range.setStart( body.firstChild, 0 ).collapse( 1 ).select();
        editor.execCommand( 'anchor', 'hello' );
        ua.checkHTMLSameStyle( '<img anchorname="hello" class="anchorclass">' + br, editor.document, body.firstChild, '检查锚点html' );     //1.2版本后，在img前有的不可见字符没有删去，这里改成之比较img内的内容
        ok(body.getElementsByTagName('img')[0].attributes['anchorname'].nodeValue=="hello"&&body.getElementsByTagName('img')[0].attributes['class'].nodeValue=="anchorclass",'检查锚点');
        editor.execCommand( 'source' );     /*切到源码模式下会有一个超时*/
        setTimeout( function() {
            var tas = editor.iframe.parentNode.getElementsByTagName( 'textarea' );
            if(ua.browser.webkit){
                ok( editor.iframe.nextSibling.textContent.indexOf( '<a name="hello"' ) !=-1, '查看是否转换成功' );
            }
            else{
                ok( tas[0].value.indexOf( '<a name="hello"' ) != -1 || tas[0].value.indexOf( '<a anchorname="1"' ) != -1, '查看是否转换成功' );
            }
          /*没办法比，看上去一样，但是一个42个字符，一个48个字符
             * ok((tas[0].value=='<p><a name="hello" anchorname="1"></a></p>')||(tas[0].value=='<p><a anchorname="1" name="hello"></a></p>'),'检查源码');*/
            editor.execCommand( 'source' );
            ua.checkHTMLSameStyle( '<img anchorname="hello" class="anchorclass">' + br, editor.document, body.firstChild, '检查锚点html' );
            setTimeout( function() {
                start();
            }, 500 );
        }, 200);
    }, 20 );
} );

test( '在源码模式设置超链接的name属性，切换到编辑器模式检查超链接是否变为锚点', function() {
    var editor = te.obj[0];
    var body = editor.body;
    stop();
    setTimeout(function(){
        editor.setContent( '' );
        setTimeout( function() {
            editor.execCommand( 'source' );
            setTimeout( function() {
                var ta = editor.iframe.parentNode.getElementsByTagName( 'textarea' )[0];
                ta.value = '<p><a name="source" anchorname="1"></a></p>';       /*这种情况认为是锚点*/
                setTimeout( function() {
                    editor.execCommand( 'source' );
                    ua.checkHTMLSameStyle( '<img anchorname="source" class="anchorclass">', editor.document, body.firstChild, '检查锚点html' );
                    start();
                }, 100 );
            }, 100 );
        }, 100 );
    },100);
} );

test( '在源码模式设置超链接没有name属性，切换到编辑器模式检查超链接不变为锚点', function() {
    var editor = te.obj[0];
    editor.setContent( '' );
    var body = editor.body;
    stop();
    setTimeout( function() {
        editor.execCommand( 'source' );
        setTimeout( function() {
            var ta = editor.iframe.parentNode.getElementsByTagName( 'textarea' )[0];
            ta.value = '<p><a name="source" href="www.baidu.com">你好</a></p>';
            setTimeout( function() {
                editor.execCommand( 'source' );
                ua.manualDeleteFillData(editor.body);
//                equal( body.firstChild.firstChild.tagName.toLowerCase(), 'a', 'a标签不会转化' );
                equal( body.firstChild.lastChild.tagName.toLowerCase(), 'a', 'a标签不会转化' );   //兼容opera
                start();
                }, 50 );
        }, 10 );
    }, 20 );
} );

test( '已存在锚点', function() {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var br = baidu.editor.browser.ie ? '&nbsp;' : '<br />';
    editor.setContent( '<p><img anchorname="1" class="anchorclass"/></p>' );
    range.selectNode(body.firstChild).select();
    editor.execCommand( 'anchor', 'hello' );
    var name=body.firstChild.firstChild.getAttribute('anchorname');
    equal(name, 'hello', '更改name');
    editor.setContent( '<p><img anchorname="1" class="anchorclass"/></p>' );
    range.selectNode(body.firstChild).select();
    editor.execCommand( 'anchor');
    equal(ua.getChildHTML(editor.body),'<p></p>','去掉锚点');
} );