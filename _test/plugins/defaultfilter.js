/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-2-28
 * Time: 下午3:20
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.defaultfilter' );
test( '转换a标签', function () {
    var editor = te.obj[0];
    editor.setContent( '<a href="http://elearning.baidu.com/url/RepositoryEntry/68616197" target="_blank">' );
    var br = ua.browser.ie?'&nbsp;':'<br>';
    var html = '<p><a href="http://elearning.baidu.com/url/RepositoryEntry/68616197" target="_blank" _href="http://elearning.baidu.com/url/RepositoryEntry/68616197"></a></p>';
    ua.checkSameHtml(html,editor.body.innerHTML,'转换a标签');
} );
test( '转换img标签', function () {
    var editor = te.obj[0];
    editor.setContent( '<img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px;" />' );
//    var html = '<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px;" _src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" /></p>';
    equal(editor.body.getElementsByTagName('img')[0].getAttribute('_src'),"http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif");
} );
test( '删span中的white-space标签', function () {
    if(ua.browser.webkit){
        var editor = te.obj[0];
        editor.setContent( '<span style=" display: block; white-space: nowrap " >sadfsadf</span>' );
        var html = '<p><span style=" display: block; ">sadfsadf</span></p>';
        ua.checkSameHtml(html,editor.body.innerHTML,'删span中的white-space标签');
    }
} );
//TODO 1.2.6
//test( '删p中的margin|padding标签', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<p style="margin-left: 1em; list-style: none;" >hello</p>' );
//    var html = '<p style="list-style: none;">hello</p>';
//    ua.checkSameHtml(html,editor.body.innerHTML,'删p中的margin|padding标签');
//} );
test( '给空p加br', function () {
    var editor = te.obj[0];
    editor.setContent( '<p style="list-style: none;" ></p>' );
    var br = ua.browser.ie?'&nbsp;':'<br>';
//    var html = '<p style="list-style: none;">'+br+'</p>';
    equal(editor.body.firstChild.innerHTML,br)
} );
test( '删div', function () {
    var editor = te.obj[0];
    editor.setContent( '<div class="socore" ><div class="sooption" style="padding: 1px;" ><p>视频</p></div></div>' );
    var html = '<p>视频</p>';
    ua.checkSameHtml(html,editor.body.innerHTML,'删div');
} );
test( 'li', function () {
    var editor = te.obj[0];
    editor.setContent( '<li style="margin: 0px 0px 0px 6px;" ><a href="http://www.baidu.com/p/pistachio%E5%A4%A9?from=zhidao" class="user-name"  >天<i class="i-arrow-down"></i></a></li>' );
    var html = '<ul class=" list-paddingleft-2"><li><p><a href="http://www.baidu.com/p/pistachio%E5%A4%A9?from=zhidao" class="user-name" _href="http://www.baidu.com/p/pistachio%E5%A4%A9?from=zhidao">天<em class="i-arrow-down"></em></a></p></li></ul>';
    ua.checkSameHtml(html,editor.body.innerHTML,'li');
} );
//<li style="margin: 0px 0px 0px 6px;" ><a href="http://www.baidu.com/p/pistachio%E5%A4%A9?from=zhidao" class="user-name"  >pistachio天<i class="i-arrow-down"></i></a></li>
//TODO 现在在过滤机制里面去除无用的标签
test( "getContent--去除无用的空标签:autoClearEmptyNode==true", function() {
    var editor = new UE.Editor({autoClearEmptyNode:true,'autoFloatEnabled':false});
    stop();
    setTimeout(function () {
        var div = document.body.appendChild(document.createElement('div'));
        editor.render(div);
        te.dom.push(div);
        editor.focus();
        var innerHTML = '<span><span></span><strong>xx</strong><em>em</em><em></em></span><div>xxxx</div>';
        editor.setContent(innerHTML);
        editor.execCommand('source');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                equal(editor.getContent(), '<p><strong>xx</strong><em>em</em></p><p>xxxx</p>', "span style空，套空的em和不空的em");
                //style="color:#c4bd97;"
                innerHTML = '<span style="color:#c4bd97"><span></span><strong>xx</strong><em>em</em><em></em></span>';
                editor.setContent(innerHTML);
                if (ua.browser.ie == 9) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(),'<p><span style="color:#c4bd97" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em");
                }
                innerHTML = '<span style="color:#c4bd97"></span><strong>xx</strong><em>em</em><em></em>';
                editor.setContent(innerHTML);
                /*inline标签上只要有属性就不清理*/
                if (ua.browser.ie == 9) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空");
                }
                innerHTML = '<span style="color:#c4bd97">asdf<strong>xx</strong><em>em</em><em></em></span>';
                editor.setContent(innerHTML);
                if (ua.browser.ie == 9) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空");
                }
                innerHTML = '<a href="http://www.baidu.com"></a><a>a</a><strong>xx</strong><em>em</em><em></em>';
                editor.setContent(innerHTML);
                ua.checkSameHtml(editor.getContent(), '<p><a href="http://www.baidu.com" ></a><a>a</a><strong>xx</strong><em>em</em></p>', "a 有href但内容为空,不过滤a标签");
                start()
            }, 50);
        }, 50);
    }, 100);
});

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
            ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        else {
            ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        start();
    },100);
});

test("getContent--转换空格，nbsp与空格相间显示", function() {
    var editor = te.obj[0];
    var div = te.dom[0];
    editor.focus();
    //策略改变,原nbsp不做处理,类似:'<p> d </p>'中的空格会被过滤
    var innerHTML = '<div>x  x   x &nbsp;x&nbsp;&nbsp;  &nbsp;</div>';
    editor.setContent(innerHTML);
    equal(editor.getContent(), '<p>x &nbsp;x &nbsp; x &nbsp;x&nbsp;&nbsp; &nbsp;&nbsp;</p>', "转换空格，nbsp与空格相间显示");
});
test( '转换script标签', function () {
    var editor = te.obj[0];
    editor.setContent( '<script type="text/javascript">ueditor</script>' );
    var html = '<p><br></p><div type="text/javascript" cdata_tag=\"script\" cdata_data=\"ueditor\"></div>';
    ua.checkHTMLSameStyle(html,editor.document,editor.body,'转换script标签');
} );

test( '转换style标签:style data不为空', function () {
    var editor = te.obj[0];
    editor.setContent( '<style type="text/css">sdf</style>' );
    var br = ua.browser.ie?'&nbsp;':'<br>';
    var html = '<p>'+br+'</p><div type="text/css" cdata_tag="style" cdata_data="sdf"></div>';
    ua.checkHTMLSameStyle(html,editor.document,editor.body,'转换style标签');
    ua.checkSameHtml(html,editor.body.innerHTML);
} );
test( '转换style标签:style data不空', function () {
    var editor = te.obj[0];
    editor.setContent( '<style type="text/css"></style>' );
    var br = ua.browser.ie?'&nbsp;':'<br>';
    var html = '<p>'+br+'</p><div type="text/css" cdata_tag="style" ></div>';
    ua.checkHTMLSameStyle(html,editor.document,editor.body,'转换style标签');
    ua.checkSameHtml(html,editor.body.innerHTML);
} );
test( 'div出编辑器转换', function () {
    var editor = te.obj[0];
    var str =  '<script type="text/javascript">ueditor</script>' ;
    var html = '<div type="text/javascript" cdata_tag=\"script\" cdata_data=\"ueditor\"></div>';
    editor.body.innerHTML = html;
    editor.execCommand( 'source' );
    stop();
    setTimeout(function(){
        equal(editor.getContent(),str,'div出编辑器转换');
        start();
    },20);
} );
test( 'img出编辑器转换', function () {
    var editor = te.obj[0];
    var str = ua.browser.ie? '<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px currentColor;"/></p>':'<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px;"/></p>' ;
    var html = '<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px;" _src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" /></p>';
    editor.body.innerHTML = html;
    editor.execCommand( 'source' );
    stop();
    setTimeout(function(){
        ua.checkSameHtml(editor.getContent(),str,'img出编辑器转换');
        start();
    },20);
} );
//ue.setContent('<a href="http://elearning.baidu.com/url/RepositoryEntry/68616197" target="_blank">');
