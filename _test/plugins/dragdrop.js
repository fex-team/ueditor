/**
 * Created with JetBrains PhpStorm.
 * User: Administrator
 * Date: 13-4-29
 * Time: 上午11:40
 * To change this template use File | Settings | File Templates.
 */
module( 'plugins.dragdrop' );
test( 'trace 3385：拖拽图像不会把p切开', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    stop();

    body.innerHTML = '<p>hel</p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" width="50" height="51" _src="http://img.baidu.com/hi/jx2/j_0001.gif" style="float: right;"><p>lo<br></p>';
    range.selectNode(body.childNodes[1]).select();
    equal(body.childNodes.length,3,'img在两个p之间');
    equal(body.firstChild.tagName.toLowerCase(),"p",'img在两个p之间');
    equal(body.childNodes[1].tagName.toLowerCase(),"img",'img在两个p之间');
    equal(body.childNodes[2].tagName.toLowerCase(),"p",'img在两个p之间');

    ua.dragend(body);
    setTimeout(function(){
        equal(body.childNodes.length,1,'img在p里面');
        equal(body.firstChild.tagName.toLowerCase(),'p','img在p里面');
        equal(body.firstChild.childNodes[1].tagName.toLowerCase(),'img','img在p里面');
        body.innerHTML = '<p>asds</p><img src="http://img.baidu.com/hi/jx2/j_0001.gif" _src="http://img.baidu.com/hi/jx2/j_0001.gif" width="18" height="20" border="0" hspace="0" vspace="0" title="" style="line-height: 16px; width: 18px; height: 20px; float: right;"><span style="line-height: 16px;"></span><p>ad<br></p>';
        range.selectNode(body.childNodes[1]).select();
        ua.dragend(body);
        setTimeout(function(){
            equal(body.childNodes.length,1,'拖拽图像不会把p切开,删除空span:img在p里面')
        equal(body.firstChild.tagName.toLowerCase(),'p','img在p里面');
        equal(body.firstChild.childNodes[1].tagName.toLowerCase(),'img','img在p里面');
            start();
        },300);
    },100);
} );