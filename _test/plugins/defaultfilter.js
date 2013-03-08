/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-2-28
 * Time: 下午3:20
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.defaultfilter' );

//TODO 现在在过滤机制里面去除无用的标签
test( "getContent--去除无用的空标签:autoClearEmptyNode==true", function() {
    var editor = new UE.Editor({autoClearEmptyNode:true,'autoFloatEnabled':false});
    stop();
    setTimeout(function(){
        var div = document.body.appendChild(document.createElement('div'));
        editor.render(div);
        te.dom.push(div);
        editor.focus();
        var innerHTML = '<span><span></span><strong>xx</strong><em>em</em><em></em></span><div>xxxx</div>';
        editor.setContent( innerHTML );
        editor.execCommand('source');
        editor.execCommand('source');
        equal( editor.getContent(), '<p><strong>xx</strong><em>em</em></p><div>xxxx</div>', "span style空，套空的em和不空的em" );
        //style="color:#c4bd97;"
        innerHTML = '<span style="color:#c4bd97"><span></span><strong>xx</strong><em>em</em><em></em></span>';
        editor.setContent( innerHTML );
        if(ua.browser.ie ==9){
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97;" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em" );
        }
        else{
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em" );
        }
        innerHTML = '<span style="color:#c4bd97"></span><strong>xx</strong><em>em</em><em></em>';
        editor.setContent( innerHTML );
        /*inline标签上只要有属性就不清理*/
        if(ua.browser.ie ==9){
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97;" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空" );
        }
        else{
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空" );
        }
        innerHTML = '<span style="color:#c4bd97">asdf<strong>xx</strong><em>em</em><em></em></span>';
        editor.setContent( innerHTML );
        if(ua.browser.ie ==9){
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97;" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空" );
        }
        else{
            equal( editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空" );
        }
        innerHTML = '<a href="http://www.baidu.com"></a><a>a</a><strong>xx</strong><em>em</em><em></em>';
        editor.setContent( innerHTML );
        equal( editor.getContent(), '<p><a href="http://www.baidu.com" ></a><a>a</a><strong>xx</strong><em>em</em></p>', "a 有href但内容为空,不过滤a标签" );
        start()
    },100);
} );

//editor.options.autoClearEmptyNode
test("getContent--不去除无用的空标签:autoClearEmptyNode==false", function() {
    var editor = new UE.Editor({autoClearEmptyNode:false,'autoFloatEnabled':false});
    stop();
    setTimeout(function(){
        var div = document.body.appendChild(document.createElement('div'));
        editor.render(div);
        te.dom.push(div);
        editor.focus();
        var innerHTML = '<span><span></span><strong>xx</strong><em>em</em><em></em><strong></strong></span>';
        editor.setContent(innerHTML);
        equal(editor.getContent().toLowerCase(), '<p><span><span></span><strong>xx</strong><em>em</em><em></em><strong></strong></span></p>', "span style空，套空的em和不空的em");
        innerHTML = '<span style="color:#c4bd97"></span><strong>xx</strong><em>em</em><em></em><strong></strong>';
        editor.setContent(innerHTML);
        ua.manualDeleteFillData(editor.body);
        if (ua.browser.ie == 9) {
            equal(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97;" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        else {
            equal(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        start();
    },100);
});

test("getContent--转换空格，nbsp与空格相间显示", function() {
    var editor = te.obj[0];
    var div = te.dom[0];
    editor.render(div);
    editor.focus();
    var innerHTML = '<div> x  x   x&nbsp;&nbsp;&nbsp;&nbsp;x&nbsp;&nbsp;  &nbsp;</div>';
    editor.setContent(innerHTML);
    equal(editor.getContent(), '<div> x &nbsp;x &nbsp; x &nbsp; &nbsp;x &nbsp; &nbsp; </div>', "转换空格，nbsp与空格相间显示");
});
