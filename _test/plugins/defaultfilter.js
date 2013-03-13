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

/*特殊字符需要转义*/
test( 'parseHTML,toHTML--文本包含特殊字符，如尖括号', function () {
    var serialize = te.obj[0].serialize;
    var node = serialize.parseHTML( '<span><td  hello</span>' );
    equal( serialize.toHTML( node ).toLowerCase(), '<span>&lt;td&nbsp;&nbsp;hello</span>', '字符转义' );
} );

test( '转换script标签', function () {
    var serialize = te.obj[0].serialize;
    var html = '<script type="text/javascript">ueditor</script>';
    var node = serialize.parseHTML( html );
    node = serialize.transformInput( node );
    equal( serialize.toHTML( node ), '<div type="text/javascript" _ue_org_tagName="script" _ue_div_script="1" _ue_script_data="ueditor" _ue_custom_node_="1"></div>', '转换script标签' );
    node = serialize.transformOutput(node);
    equal(serialize.toHTML( node ),html,'取出时恢复内容');
} );

test( '转换style标签', function () {
    var serialize = te.obj[0].serialize;
    var html = '<style type="text/css"></style>';
    var node = serialize.parseHTML( html );
    node = serialize.transformInput( node );
    equal( serialize.toHTML( node ), '<div type="text/css" _ue_div_style="1" _ue_org_tagName="style" _ue_style_data="" _ue_custom_node_="1"></div>' , '转换script标签');
    node = serialize.transformOutput(node);
    equal(serialize.toHTML( node ),html,'取出时恢复内容');
} );

test( 'parseHTML,toHTML---br', function () {
    var serialize = te.obj[0].serialize;
    var node = serialize.parseHTML( '<br />' );
    equal( serialize.toHTML( node ).toLowerCase(), '<br />', '对br不操作' );
    node = serialize.parseHTML( '<br>' );
    equal( serialize.toHTML( node ).toLowerCase(), '<br />', '补充br后面的斜杠' );
} );

//TODO 注释不过的用例，来源于过滤中现在不切html代码
/*考察标签之间嵌套关系*/
test( 'parseHTML,toHTML---复杂标签嵌套', function() {
    var serialize = te.obj[0].serialize;
    var node = serialize.parseHTML( '<span>hello1<p><img>hello2<div>hello3<p>hello4' );
    equal( serialize.toHTML( node ).toLowerCase(), '<span>hello1</span><p><img />hello2</p><div>hello3<p>hello4</p></div>' );
} );

test( 'bi转换为strong，em', function() {
    var serialize = te.obj[0].serialize;
    var node = serialize.parseHTML( '<b><i>hello</i>hello</b>' );
    equal( serialize.toHTML( node ).toLowerCase(), '<strong><em>hello</em>hello</strong>', '转化b和i' );
} );

test( 'font转span', function() {
    var serialize = te.obj[0].serialize;
    /*font转span*/
    var node = serialize.parseHTML( '<font size="20" color="red" lang="en" face="arial"><b><i>hello</i>hello</b>' );
    equal( serialize.toHTML( node ).toLowerCase(), '<span style="font-size:12px;color:red;font-family:arial;"><strong><em>hello</em>hello</strong></span>' );
    /*size的值在sizeMap中有对应的值*/
    var node = serialize.parseHTML( '<b><font size="1" color="#ff0000" lang="en" face="楷体">hello' );
    equal( serialize.toHTML( node ).toLowerCase(), '<strong><span style="font-size:10px;color:#ff0000;font-family:楷体;">hello</span></strong>' );
} );

//test( '只有white list', function() {
//    var serialize = te.obj[0];
//    serialize.rules = {
//        whiteList:{
//            div:{
//                span:1,
//                p:1
//            },
//            span:1,
//            em:{
//                strong:1
//            },
//            p:{
//                img:1
//            }
//        } };
//    var html = '<table></table>hellotable<!--hello--><div>hellodiv<span>hellospan</span><p class="p_class"><img /><strong><em>hello</em></strong></p><!--hello--></div><strong>hello2<em></em></strong>';
//    var node = serialize.parseHTML( html );
//    node = serialize.filter( node );
//    var div = document.createElement( 'div' );
//    var div_new = document.createElement( 'div' );
//    div.innerHTML = serialize.toHTML( node );
//    div_new.innerHTML = 'hellotable<!--hello--><div>hellodiv<span>hellospan</span><p class="p_class"><img /></p><!--hello--></div>hello2<em></em>';
//    ok( ua.haveSameAllChildAttribs( div, div_new ), 'white list' );
//} );

test( '只有white list--滤除属性', function () {
    var serialize = te.obj[0].serialize;
    serialize.rules = {
        whiteList:{
            div:{
                $:{
                    id:1,
                    'class':1
                }
            },
            table:{
            },
            span:{
            }
        }
    };
    var html = '<table></table>hellotable<!--hello--><p><div class="div_class" id="div_id" name="div_name">hellodiv<span style="color:red;font-size:12px" ><p>hellospan</span><!--hello--></p></div></p><span style="color:red;font-size:12px" >hellospan</span>';
    var node = serialize.parseHTML( html );
    node = serialize.filter( node );
    var div = document.createElement( 'div' );
    var div_new = document.createElement( 'div' );
    div.innerHTML = serialize.toHTML( node );
    div_new.innerHTML = '<table></table>hellotable<!--hello--><div id="div_id" class="div_class">hellodivhellospan<!--hello--></div><span style="color:red;font-size:12px" >hellospan</span>';
    ok( ua.hasSameAttrs( div, div_new ), '滤除属性' );
} );

test( '只有black list', function () {
    var serialize = te.obj[0].serialize;
    serialize.rules = {
        blackList:{
            span:1,
            em:1,
            '#comment':1,
            script:1,
            style:1
        }
    };
    var html = '<style  type="text/css"></style><script type="text/javascript"></script><!--comment--><div><script type="text/javascript"></script><span>hello1</span>hello2</div>';
    var node = serialize.parseHTML( html );
    node = serialize.filter( node );
    equal( serialize.toHTML( node ), '<div>hello2</div>' );
} );

test( '开始标签与后面文本的空格过滤，其他不过滤inline节点之间的空格，过滤block节点之间的空格', function () {
    var serialize = te.obj[0].serialize;
    /*inline节点之间的空格要留着*/
    var html = '<a href="www.baidu.com">baidu</a> <a> hello </a>';
    var node = serialize.parseHTML( html );
    node = serialize.filter( node );
    equal( serialize.toHTML( node ), '<a href="www.baidu.com">baidu</a>&nbsp;<a>&nbsp;hello&nbsp;</a>' );
    html = '<span> <span> hello </span></span> <span> he llo2<span> hello </span> </span>';
    node = serialize.parseHTML( html );
    node = serialize.filter( node );
    equal( serialize.toHTML( node ), '<span>&nbsp;<span>&nbsp;hello&nbsp;</span></span>&nbsp;<span>&nbsp;he&nbsp;llo2<span>&nbsp;hello&nbsp;</span>&nbsp;</span>' );
    /*block节点之间的空格不要留着     这个太纠结，不必了。会把ol拆开，后面的变成ul*/
//        html = '<ol>   <li> li_test </li> <li> li test2 </li> </ol> ';
//        node = serialize.parseHTML( html );
//        node = serialize.filter( node );
//        equal( serialize.toHTML( node ), '<ol><li>li_test&nbsp;</li><li>li&nbsp;test2&nbsp;</li></ol>&nbsp;' );
} );

//test( 'black list和whilte list都有', function() {
//    var serialize = te.obj[0];
//    serialize.rules = {
//        whiteList:{
//            div:{
//                span:1,
//                p:1
//            },
//            span:1,
//            p:{
//                img:1
//            }
//        },
//        blackList:{
//            em:1,
//            '#comment':1,
//            script:1,
//            style:1
//        }};
//    var html = '<table></table>hellotable<!--hello--><p><div class="div_class" id="div_id" name="div_name">hellodiv<style  type="text/css"></style><script type="text/javascript"></script><!--comment--><p><span style="color:red;font-size:12px" >hellospan</span><!--hello--></p></div></p><span style="color:red;font-size:12px" >hellospan2</span>';
//    var node = serialize.parseHTML( html );
//    var div = document.createElement( 'div' );
//    var div_new = document.createElement( 'div' );
//    node = serialize.filter( node );
//    div.innerHTML = serialize.toHTML( node );
//    div_new.innerHTML = 'hellotable<p></p><div class="div_class" id="div_id" name="div_name">hellodiv<p><span style="color:red;font-size:12px" >hellospan</span></p></div></p><span style="color:red;font-size:12px" >hellospan2</span>';
//    ok( ua.haveSameAllChildAttribs( div, div_new ), 'whiteList和blackList都有' );
//} );

