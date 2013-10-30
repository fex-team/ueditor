/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-28
 * Time: 下午1:34
 * To change this template use File | Settings | File Templates.
 */
module('plugins.section');

test('getsections命令',function(){
    var editor = te.obj[0];
    var html = '<h1>一级标题1</h1><p>段落a</p><h2>二级标题2</h2><p>段落</p><h2>二级标题3</h2><p>段落</p><h3>三级标题4</h3><p>段落</p><h1>一级标题5</h1><p>段落</p>';
    editor.setContent(html);
    var sectionTree = editor.execCommand('getsections');

    equal(sectionTree.children.length, 2, '内容里有两个一级标题');
    equal(sectionTree.children[1].title, '一级标题5', '验证章节内容');
    same(sectionTree.children[1].startAddress, [8], '验证章节开始位置');
    same(sectionTree.children[1].endAddress, [9], '验证章节结束位置');
});

test('deletesection命令',function(){
    var editor = te.obj[0];
    var html = '<h1>一级标题1</h1><p>段落a</p><h2>二级标题2</h2><p>段落</p><h2>二级标题3</h2><p>段落</p><h3>三级标题4</h3><p>段落</p><h1>一级标题5</h1><p>段落b</p>';

    editor.setContent(html);
    var sectionTree = editor.execCommand('getsections');
    editor.execCommand('deleteSection', sectionTree.children[1]);
    equal(sectionTree.children[1].parentNode, null, '验证章节标题是否已删除');
    notEqual(editor.body.children[0].innerHTML, '段落a', '不传入keepChild参数时,验证章节内容是否已删除');

    editor.setContent(html);
    sectionTree = editor.execCommand('getsections');
    editor.execCommand('deleteSection', sectionTree.children[0], true);
    equal(editor.body.children[0].innerHTML, '段落a', '传入keepChild参数为true时,验证章节内容是否已保留');
});

test('movesection命令',function(){
    var editor = te.obj[0];
    var html = '<h1>一级标题1</h1><p>段落a</p><h2>二级标题2</h2><p>段落</p><h2>二级标题3</h2><p>段落</p><h3>三级标题4</h3><p>段落</p><h1>一级标题5</h1><p>段落b</p>';

    editor.setContent(html);
    var sectionTree = editor.execCommand('getsections');
    editor.execCommand('movesection', sectionTree.children[1], sectionTree.children[0]);
    equal(editor.body.children[0].innerHTML, '一级标题5', ' 移动章节移动到目标章节之前,验证章节是否移动正确');
    equal(editor.body.children[1].innerHTML, '段落b', ' 验证移动章节移动到目标章节之前,验证章节内容是否移动正确');

    editor.setContent(html);
    sectionTree = editor.execCommand('getsections');
    editor.execCommand('movesection', sectionTree.children[0], sectionTree.children[1], true);
    var len = editor.body.children.length;
    equal(editor.body.children[len-2].innerHTML, '一级标题1', ' 移动章节移动到目标章节之前,验证章节是否移动正确');
    equal(editor.body.children[len-1].innerHTML, '段落a', ' 验证移动章节移动到目标章节之前,验证章节内容是否移动正确');
});

test('selectsection命令',function(){
    var editor = te.obj[0];
    var html = '<h1>一级标题1</h1><p>段落a</p><h2>二级标题2</h2><p>段落</p><h2>二级标题3</h2><p>段落</p><h3>三级标题4</h3><p>段落</p><h1>一级标题5</h1><p>段落b</p>';

    editor.setContent(html);
    var sectionTree = editor.execCommand('getsections');
    editor.execCommand('selectsection', sectionTree.children[1]);
    var range = editor.selection.getRange();
    ua.checkSameHtml($('<div>').append(range.cloneContents()).html(), '<h1>一级标题5</h1><p>段落b</p>', '判断选区内容是否正确');
});
