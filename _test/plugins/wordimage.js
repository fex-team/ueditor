/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-3-26
 * Time: 下午3:05
 * To change this template use File | Settings | File Templates.
 */
module('plugins.wordimage');

test('检查取得word_img的url地址', function () {
    var editor = te.obj[0];
    editor.setContent('<p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="172px" height="111px" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span><br /></p><p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img src="http://img.baidu.com/hi/jx2/j_0001.gif" border="0" hspace="0" vspace="0" /><br /> </span></p>');
    stop();
    setTimeout(function () {

        editor.execCommand('wordimage', 'word_img');
        equal(editor.body.getElementsByTagName('img')[0].getAttribute('word_img'), "file:///C:DOCUME~1DONGYA~1LOCALS~1Tempmsohtmlclip1clip_image001.gif", '检查url地址');
        editor.setContent('<p><a href="http://www.baidu.com" target="_self" title="asdf"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="401px" height="174px" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.jpg" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span></a><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="172px" height="111px" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span></span></p><p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img src="/ge/ueditor_1_2_0_0_BRANCH/server/upload/uploadimages/11171332502507.gif" border="0" hspace="0" vspace="0" /><br /></span></span></p>');
        setTimeout(function () {
            editor.execCommand('wordimage', 'word_img');
//            equal(editor.word_img.length, '2', '有2个wordimg');
            equal(editor.body.getElementsByTagName('img')[0].getAttribute('word_img'), "file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.jpg", '检查 第一个url地址');
            equal(editor.body.getElementsByTagName('img')[1].getAttribute('word_img'), "file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif", '检查 第二个url地址');
            equal(editor.queryCommandState('wordimage'), '1', 'queryCommandState');
            start();
        }, 50);
    }, 50);
});

test('多实例编辑器检查取得word_img的url地址', function () {
    var div1 = document.createElement('div');
    var div2 = document.createElement('div');
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    var editor1 = new UE.Editor({'initialContent':'<p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="172px" height="111px" _src="file:///C:DOCUME~1DONGYA~1LOCALS~1Tempmsohtmlclip1clip_image001.gif" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span><br /></p><p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img src="http://img.baidu.com/hi/jx2/j_0001.gif" border="0" hspace="0" vspace="0" /><br /> </span></p>','autoFloatEnabled':false});
    var editor2 = new UE.Editor({'initialContent':'<p><a href="http://www.baidu.com" target="_self" title="asdf"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="401px" height="174px" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.jpg" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span></a><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img width="172px" height="111px" src="/ge/ueditor_1_2_0_0_BRANCH/themes/default/images/spacer.gif" word_img="file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif" style="background:url(/ge/ueditor_1_2_0_0_branch/themes/default/images/localimage.png) no-repeat center center;border:1px solid #ddd" /></span></span></p><p><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><span style="font-size:14px;font-family:&#39;times new roman&#39;, serif"><img src="/ge/ueditor_1_2_0_0_BRANCH/server/upload/uploadimages/11171332502507.gif" border="0" hspace="0" vspace="0" /><br /></span></span></p>', 'autoFloatEnabled':false});
    stop();
    setTimeout(function () {
        editor1.render(div1);
        editor1.ready(function () {
            editor2.render(div2);
            editor2.ready(function () {
                editor1.focus();
                editor1.execCommand('wordimage', 'word_img');
//                equal(editor1.word_img.length, '1', 'editor1有一个wordimg');
                equal(editor1.body.getElementsByTagName('img')[0].getAttribute('word_img'), "file:///C:DOCUME~1DONGYA~1LOCALS~1Tempmsohtmlclip1clip_image001.gif", '检查url地址');
                editor2.execCommand('wordimage', 'word_img');
//                equal(editor2.word_img.length, '2', 'editor2有2个wordimg');
                equal(editor2.body.getElementsByTagName('img')[0].getAttribute('word_img'), "file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.jpg", '检查 第一个url地址');
                equal(editor2.body.getElementsByTagName('img')[1].getAttribute('word_img'), "file:///C:\DOCUME~1\DONGYA~1\LOCALS~1\Temp\msohtmlclip1\01\clip_image001.gif", '检查 第二个url地址');
                equal(editor1.queryCommandState('wordimage'), '1', 'queryCommandState');
                equal(editor2.queryCommandState('wordimage'), '1', 'queryCommandState');
                start();
            });
        });
    });
});