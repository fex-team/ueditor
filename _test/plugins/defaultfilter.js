/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 13-2-28
 * Time: 下午3:20
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.defaultfilter' );

//test('',function(){
//   stop();
//});
test( '对代码的行号不处理', function () {
    var editor = te.obj[0];
    editor.setContent( '<td class="gutter"><div class="line number1 index0 alt2">1</div><div class="line number2 index1 alt1">2</div></td>');
//    var br = ua.browser.ie?'':'<br>';
    var html = '<table><tbody><tr><td class=\"gutter\"><div class=\"line number1 index0 alt2\">1</div><div class=\"line number2 index1 alt1\">2</div></td></tr></tbody></table>';
    ua.checkSameHtml(editor.body.innerHTML,html,'table补全,对代码的行号不处理')
} );
test( '空td,th,caption', function () {
    var editor = te.obj[0];
    editor.setContent( '<table><caption></caption><tbody><tr><th></th><th></th></tr><tr><td></td><td></td></tr><tr><td></td><td></td></tr></tbody></table>' );
    var br = ua.browser.ie&&ua.browser.ie<11?'':'<br>';
    var html = '<table><caption>'+br+'</caption><tbody><tr><th>'+br+'</th><th>'+br+'</th></tr><tr><td>'+br+'</td><td>'+br+'</td></tr><tr><td>'+br+'</td><td>'+br+'</td></tr></tbody></table>';
    ua.checkSameHtml(editor.body.innerHTML,html,'空td,th,caption,添加text')
} );
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
test( '给空p加br&&转对齐样式', function () {
    var editor = te.obj[0];
    editor.setContent( '<p align ="center" ></p>' );
    var br = ua.browser.ie?'&nbsp;':'<br>';
//    "<p style=\"text-align:center;list-style: none;\"><br></p>"
    var html = '<p style=\"text-align:center;\">'+br+'</p>';
    ua.checkSameHtml(editor.body.innerHTML,html, '给空p加br&&转对齐样式');
} );
test( '删div', function () {
    var editor = te.obj[0];
    editor.setContent( '<div class="socore" ><div class="sooption" style="padding: 1px;" ><p>视频</p></div></div>' );
    var html = '<p>视频</p>';
    ua.checkSameHtml(html,editor.body.innerHTML,'删div');
} );
test( 'allowDivTransToP--false 不转div', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id ='ue';
    var editor = UE.getEditor('ue',{allowDivTransToP:false});
    stop();
    editor.ready(function(){
        var html = '<div class="socore" ><div class="sooption" style="padding: 1px;" >视频</div></div>';
        editor.setContent( html );
        var padding = (ua.browser.ie&&ua.browser.ie<9)?'PADDING-BOTTOM: 1px; PADDING-LEFT: 1px; PADDING-RIGHT: 1px; PADDING-TOP: 1px':'padding: 1px;';
        var html_a =  '<div class="socore" ><div class="sooption" style="'+padding+'" >视频</div></div>';
        ua.checkSameHtml(html_a,editor.body.innerHTML,'不转div');
        UE.delEditor('ue');
        start();
    });
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
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue',{autoClearEmptyNode:true,'autoFloatEnabled':false});
    //
    stop();
    editor.ready(function () {
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
                if (ua.browser.ie>8) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(),'<p><span style="color:#c4bd97" ><strong>xx</strong><em>em</em></span></p>', "span style不空，套空的em和不空的em");
                }
                innerHTML = '<span style="color:#c4bd97"></span><strong>xx</strong><em>em</em><em></em>';
                editor.setContent(innerHTML);
                /*inline标签上只要有属性就不清理*/
                if (ua.browser.ie >8) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em></p>', "span 有style但内容为空");
                }
                innerHTML = '<span style="color:#c4bd97">asdf<strong>xx</strong><em>em</em><em></em></span>';
                editor.setContent(innerHTML);
                if (ua.browser.ie >8) {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空");
                }
                else {
                    ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" >asdf<strong>xx</strong><em>em</em></span></p>', "span 有style内容不空");
                }
                innerHTML = '<a href="http://www.baidu.com"></a><a>a</a><strong>xx</strong><em>em</em><em></em>';
                editor.setContent(innerHTML);
                ua.checkSameHtml(editor.getContent(), '<p><a href="http://www.baidu.com" ></a><a>a</a><strong>xx</strong><em>em</em></p>', "a 有href但内容为空,不过滤a标签");
                setTimeout(function () {
                    UE.delEditor('ue');
                    start()
                },300);
            }, 50);
        }, 50);
    });
});

//editor.options.autoClearEmptyNode
test("getContent--不去除无用的空标签:autoClearEmptyNode==false", function() {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue',{autoClearEmptyNode:false,'autoFloatEnabled':false});
    stop();
    editor.ready(function () {
        te.dom.push(div);
        editor.focus();
        var innerHTML = '<span><span></span><strong>xx</strong><em>em</em><em></em><strong></strong></span>';
        editor.setContent(innerHTML);
        equal(editor.getContent().toLowerCase(), '<p><span><span></span><strong>xx</strong><em>em</em><em></em><strong></strong></span></p>', "span style空，套空的em和不空的em");
        innerHTML = '<span style="color:#c4bd97"></span><strong>xx</strong><em>em</em><em></em><strong></strong>';
        editor.setContent(innerHTML);
        ua.manualDeleteFillData(editor.body);
        if (ua.browser.ie >8) {
            ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color: rgb(196, 189, 151);" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        else {
            ua.checkSameHtml(editor.getContent().toLowerCase(), '<p><span style="color:#c4bd97" ></span><strong>xx</strong><em>em</em><em></em><strong></strong></p>', "span 有style但内容为空");
        }
        setTimeout(function () {
            UE.delEditor('ue');
            start()
        }, 500);
    });
});

test("getContent--转换空格，nbsp与空格相间显示", function() {
    var editor = te.obj[0];
    editor.focus();
    //策略改变,原nbsp不做处理,类似:'<p> d </p>'中的空格会被过滤
    var innerHTML = '<div>x  x   x &nbsp;x&nbsp;&nbsp;  &nbsp;</div>';
    editor.setContent(innerHTML);
    equal(editor.getContent(), '<p>x &nbsp;x &nbsp; x &nbsp;x&nbsp;&nbsp; &nbsp;&nbsp;</p>', "转换空格，nbsp与空格相间显示");
});
test( '转换script标签', function () {
    var editor = te.obj[0];
    var br = ua.browser.ie?'<p>&nbsp;</p>':('<p><br></p>');
    editor.setContent( '<script type="text/javascript">ueditor</script>' );
    var html = br+'<div type="text/javascript" cdata_tag=\"script\"  cdata_data=\"ueditor\" _ue_custom_node_=\"true\"></div>';
    ua.checkSameHtml(editor.body.innerHTML,html,'转换script标签');
} );
test( 'trace 3698 1.3.0 版本修复: script(style)标签里面的内容不转码', function () {
    var editor = te.obj[0];
    editor.setContent('<script type="text/plain" id="myEditor" name="myEditor">var ue=UE.getEditor("editor");</script>');
    equal(editor.document.getElementById('myEditor').innerHTML,'','内容不保留');//1.3.6 针对ie下标签不能隐藏问题的修复
    // todo 1.3.0 trace 3698
    editor.setContent('<style type="text/css" id="myEditor">        .clear {            clear: both;        }     </style>');
    var br = ua.browser.ie?'<p>&nbsp;</p>':('<p><br></p>');
    ua.checkSameHtml(editor.getContent(),br+'<style type="text/css" id="myEditor">.clear {            clear: both;        }</style>','内容不转码');
} );
test( '转换style标签:style data不为空', function () {
    var editor = te.obj[0];
    editor.setContent( '<style type="text/css">sdf</style>' );
    var br = ua.browser.ie?'<p>&nbsp;</p>':('<p><br></p>');
    var html = br+'<div type="text/css" cdata_tag="style" cdata_data=\"sdf\" _ue_custom_node_=\"true\"></div>';
    ua.checkSameHtml(editor.body.innerHTML,html,'转换script标签');
} );
test( '转换style标签:style data不空', function () {
    var editor = te.obj[0];
    editor.setContent( '<style type="text/css"></style>' );
    var br = ua.browser.ie?'<p>&nbsp;</p>':('<p><br></p>');

    var html = br+'<div type="text/css" cdata_tag="style" _ue_custom_node_=\"true\"></div>';
    ua.checkSameHtml(editor.body.innerHTML,html,'转换script标签');
} );
test( 'div出编辑器转换', function () {
    var editor = te.obj[0];
    var str =  '<script type="text/javascript">ueditor</script>' ;
    var html = '<div type="text/javascript" cdata_tag=\"script\" >ueditor</div>';
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
    var str = ua.browser.ie? '<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px currentColor;"/></p>':'<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px"/></p>' ;
    if(ua.browser.ie==8)
        str ='<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style=\"BORDER-BOTTOM: 0px; BORDER-LEFT: 0px; BORDER-TOP: 0px; BORDER-RIGHT: 0px\"/></p>';
    if(ua.browser.ie==11)
        str = '<p><img src="http://www.baidu.com/img/shouye_b5486898c692066bd2cbaeda86d74448.gif" width="270" height="129" style="border: 0px currentColor;border-image: none;"/></p>';
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
