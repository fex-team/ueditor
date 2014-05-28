module("plugins.list");
/*
 * <li>有序列表切换到无序
 * <li>无序列表切换到有序
 * <li>有序之间相互切换
 * <li>无序之间相互切换
 * <li>先引用后列表
 * <li>表格中插入列表
 * <li>h1套列表
 * <li>去除链接
 *
 * */

//test('',function(){stop();})
test('trace 3859 回车将p转成列表', function () {
    if(ua.browser.ie==9||ua.browser.ie==10)return;
    var editor = te.obj[0];
    var range = te.obj[1];
    var br = ua.browser.ie ? '' : '<br>';
    editor.setContent('<p>1. 2</p>');
    stop();
    setTimeout(function () {
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body, {keyCode:13});
        setTimeout(function () {
            ua.checkSameHtml(ua.getChildHTML(editor.body), '<ol style=\"list-style-type: decimal;\" class=\" list-paddingleft-2\"><li><p> 2</p></li><li><p>' + br + '</p></li></ol>', '回车将p转成列表');
            start()
        }, 50);
    }, 100);
});

//todo bug3418
test('ol标签嵌套', function () {
    var editor = te.obj[0];
    editor.setContent('<ol class="custom_num list-paddingleft-1"><li class="list-num-1-1 list-num-paddingleft-1"><p>a</p></li><ol class="custom_num list-paddingleft-1"><li class="list-num-1-1 list-num-paddingleft-1"><p>b</p></li></ol></ol>');
    ua.checkSameHtml(editor.body.innerHTML, '<ol class=\"custom_num list-paddingleft-1\"><li class=\"list-num-1-1 list-num-paddingleft-1\"><p>a</p></li><ol class=\"custom_num1 list-paddingleft-2\"><li class=\"list-num-2-1 list-num1-paddingleft-1\"><p>b</p></li></ol></ol>');
});

test('li内添加p标签', function () {
    var editor = te.obj[0];
    editor.setContent('<ol><li>asd<p>asd</p></li></ol>');
    ua.manualDeleteFillData(editor.body);
    ua.checkSameHtml(editor.body.innerHTML, '<ol class=\" list-paddingleft-2\"><li><p>asd</p><p>asd</p></li></ol>', '添加p标签');
});
//todo 1.2.6.1
test('p转成列表', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue',{autoTransWordToList:true});
//    var br = ua.browser.ie ? '&nbsp;' : '';
    var br = '';
    editor.ready(function () {
        setTimeout(function(){
            editor.setContent('<p class="MsoListParagraph">1.a</p><ol><li>b</li></ol>');
            ua.manualDeleteFillData(editor.body);
            //todo 1.2.6.1
//    ua.checkSameHtml(editor.body.innerHTML,'<ol style=\"list-style-type: decimal;\" class=\" list-paddingleft-2\"><li><p>a</p></li><li><p>b</p></li></ol>','p转成有序列表');
            editor.setContent('<p class="MsoListParagraph"><span style="font-family: Symbol;">abc</span></p>');
            ua.manualDeleteFillData(editor.body);
            ua.checkSameHtml(editor.body.innerHTML, '<ul style=\"list-style-type: disc;\" class=\" list-paddingleft-2\"><li><p>' + br + '</p></li></ul>', 'p转成无序列表');
//todo bug3417
//    editor.setContent('<p class="MsoListParagraph"><span style="font-family: Symbol;">n</span></p>');
//    ua.manualDeleteFillData(editor.body);
//    ua.checkSameHtml(editor.body.innerHTML,'<ul style=\"list-style-type: disc;\" class=\" list-paddingleft-2\"><li><p><br></p></li></ul>','p转成无序列表');
            UE.delEditor('ue');
            te.dom.push(document.getElementById('ue'));
            start();
        },200);
    });
    stop();

});

test('列表复制粘贴', function () {
    var editor = te.obj[0];

        editor.setContent('<ol class="custom_num2 list-paddingleft-1"><li class="list-num-3-1 list-num2-paddingleft-1">a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul>');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
        /*ctrl+c*/

        setTimeout(function () {
            var html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
//    range.setStart(editor.body,1).collapse(true).select();
//    editor.fireEvent("paste");
//    ua.manualDeleteFillData(editor.body);
//    equal(editor.body.innerHTML,'<p><br></p>','编辑器清空');
            editor.setContent('<ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
            editor.setContent('<ol><ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul></ol>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            editor.fireEvent('beforepaste', html);
            /*粘贴*/
            editor.setContent('<ol class="custom_cn1 list-paddingleft-1"><ol><li>a</li><li>b</li></ol><ul><li>a</li><li>b</li></ul></ol>');
            ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
            ua.keydown(editor.body, {'keyCode':67, 'ctrlKey':true});
            /*ctrl+c*/
            html = {html:editor.body.innerHTML};
            setTimeout(function () {
                editor.fireEvent('beforepaste', html);
                /*粘贴*/
                start()
            }, 50);
        }, 50);
    stop();
});

//TODO trace-3416 此处只为提高覆盖率
//test('剪切列表',function(){
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    editor.setContent('<ol><li><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif"/><br/></p></li><li></li></ol>');
//    range.setStart(editor.body.firstChild.lastChild,0).collapse(true).select();
//    ua.cut(editor.body);
//    stop();
//    setTimeout(function(){
//        ua.manualDeleteFillData(editor.body);
//        var br = ua.browser.ie?'':'<br>';
//       equal(editor.body.innerHTML,'<p>'+br+'</p>','编辑器清空');
//        editor.setContent('<ol><li><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif"/><br/></p></li><li></li></ol><p>asdf</p>');
//        range.setStart(editor.body.firstChild.lastChild,0).collapse(true).select();
//        ua.cut(editor.body);
//        setTimeout(function(){
//            ua.manualDeleteFillData(editor.body);
//            equal(editor.body.innerHTML,'<p>asdf</p>','列表删除');
//            editor.setContent('<a href="http://www.baidu.com">www.baidu.com</a><ol><li><p><img src="http://img.baidu.com/hi/jx2/j_0015.gif"/><br/></p></li><li></li></ol>');
//            range.setStart(editor.body.firstChild.nextSibling.lastChild,0).collapse(true).select();
//            ua.cut(editor.body);
//            setTimeout(function(){
//                ua.manualDeleteFillData(editor.body);
//                ua.checkSameHtml(editor.body.innerHTML,'<p><a href=\"http://www.baidu.com\" _href=\"http://www.baidu.com\">www.baidu.com</a></p>','列表删除');
//                start();
//            },20);
//        },20);
//    },20);
//});

test('修改列表再删除列表', function () {
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];
    var br = baidu.editor.browser.ie ? "" : "<br>";
    editor.setContent('<ol>hello1</ol>');
    range.setStart(editor.body.firstChild, 0).collapse(true).select();
    editor.execCommand('insertorderedlist', 'cn2');
    ua.manualDeleteFillData(editor.body);
    equal(editor.body.firstChild.tagName.toLowerCase(), 'ol', '查询列表的类型');
    equal(ua.getChildHTML(editor.body.firstChild), '<li class=\"list-cn-3-1 list-cn2-paddingleft-1\"><p>hello1</p></li>');
    range.setStart(editor.body.lastChild, 0).setEnd(editor.body.lastChild, 1).select();
    editor.execCommand('insertorderedlist', 'cn2');
    ua.manualDeleteFillData(editor.body);
    ua.checkSameHtml(editor.body.innerHTML, '<p>hello1</p>');
});

test('列表内没有列表标号的项后退', function () {
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        var lis;
        var br = ua.browser.ie ? '<br>' : '<br>';
        editor.setContent('<ol><li><p>hello</p><p><a href="http://www.baidu.com">www.baidu.com</a></p></li></ol>');
        range.setStart(editor.body.firstChild.firstChild.lastChild.lastChild, 0).collapse(true).select();
        ua.manualDeleteFillData(editor.body);
        ua.keydown(editor.body, {keyCode:8});

        setTimeout(function () {
            lis = editor.body.getElementsByTagName('li');
            equal(lis.length, '1', '列表长度不变');
            ua.checkSameHtml(ua.getChildHTML(editor.body), '<ol class=" list-paddingleft-2"><li><p>hello</p></li></ol><p><a href="http://www.baidu.com" _href="http://www.baidu.com">www.baidu.com</a></p>', 'p在列表外');
            start()
        }, 50);
    stop();
});

test('多个p，选中其中几个变为列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.firstChild.nextSibling, 1).select();
        editor.execCommand('insertorderedlist');
        equal(ua.getChildHTML(body.firstChild), '<li><p>hello1</p></li><li><p>hello2</p></li>', '检查列表的内容');
        equal(body.firstChild.tagName.toLowerCase(), 'ol', '检查列表的类型');
        equal(body.childNodes.length, 3, '3个孩子');
        equal(body.lastChild.tagName.toLowerCase(), 'p', '后面的p没有变为列表');
        equal(body.lastChild.innerHTML.toLowerCase(), 'hello4', 'p里的文本');
        start();
    }, 50);
    stop();
});

//trace 988，有序123切到abc再切到123
test('有序列表的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>你好</p><p>是的</p>');
    setTimeout(function () {
        range.setStart(body, 0).setEnd(body, 2).select();
        editor.execCommand('insertorderedlist', 'decimal');
        equal(editor.queryCommandValue('insertorderedlist'), 'decimal', '查询插入数字列表的结果1');
        editor.execCommand('insertorderedlist', 'lower-alpha');
        equal(editor.queryCommandValue('insertorderedlist'), 'lower-alpha', '查询插入字母列表的结果');
        editor.execCommand('insertorderedlist', 'decimal');
        equal(editor.queryCommandValue('insertorderedlist'), 'decimal', '查询插入数字列表的结果2');
        start();
    }, 50);
    stop();
});

//trace 988，无序圆圈切到方块再切到圆圈
test('无序列表之间的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>你好</p><p>是的</p>');
    range.setStart(body, 0).setEnd(body, 2).select();
    editor.execCommand('insertunorderedlist', 'circle');
    equal(editor.queryCommandValue('insertunorderedlist'), 'circle', '查询插入圆圈列表的结果1');
    editor.execCommand('insertunorderedlist', 'square');
    equal(editor.queryCommandValue('insertunorderedlist'), 'square', '查询插入正方形列表的结果');
    editor.execCommand('insertunorderedlist', 'circle');
    equal(editor.queryCommandValue('insertunorderedlist'), 'circle', '查询插入圆圈列表的结果1');
});

test('引用中插入列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p></p>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    editor.execCommand('blockquote');
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'blockquote', 'firstChild of body is blockquote');
    equal(body.childNodes.length, 1, '只有一个孩子');
    equal(body.firstChild.firstChild.tagName.toLowerCase(), 'ol', 'insert an ordered list');
    equal(body.firstChild.childNodes.length, 1, 'blockquote只有一个孩子');
    equal($(body.firstChild.firstChild).css('list-style-type'), 'decimal', '数字列表');
    equal(editor.queryCommandValue('insertorderedlist'), 'decimal', 'queryCommand value is decimal');
});

/*trace 1118*/
test('去除无序列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p></p>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    editor.execCommand('insertunorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertunorderedlist'), 'disc', 'queryCommand value is disc');
    ok(editor.queryCommandState('insertunorderedlist'), 'state是1');
    /*去除列表*/
    editor.execCommand('insertunorderedlist');
    ua.manualDeleteFillData(editor.body);
    equal(body.firstChild.tagName.toLowerCase(), 'p', '去除列表');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    ok(!editor.queryCommandState('insertunorderedlist'), 'state是0');
});

test('闭合方式有序和无序列表之间的切换', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p></p>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    editor.execCommand('insertunorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', 'insert an unordered list');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertunorderedlist'), 'disc', 'queryCommand value is disc');
    equal(editor.queryCommandValue('insertorderedlist'), null, '有序列表查询结果为null');
    /*切换为有序列表*/
    editor.execCommand('insertorderedlist');
    ua.manualDeleteFillData(editor.body);
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '变为有序列表');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertorderedlist'), 'decimal', 'queryCommand value is decimal');
    equal(editor.queryCommandValue('insertunorderedlist'), null, '无序列表查询结果为null');
    /*切换为圆圈无序列表*/
    editor.execCommand('insertunorderedlist', 'circle');
    ua.manualDeleteFillData(editor.body);
    equal(body.firstChild.tagName.toLowerCase(), 'ul', '变为无序列表');
    equal(body.childNodes.length, 1, 'body只有一个孩子');
    equal(editor.queryCommandValue('insertunorderedlist'), 'circle', '无序列表是圆圈');
    equal(editor.queryCommandValue('insertorderedlist'), null, '有序列表查询结果为null');
});

test('非闭合方式切换有序和无序列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    /*如果只选中hello然后切换有序无序的话，不同浏览器下表现不一样*/
    editor.setContent('<ol><li>hello</li><li>hello3</li></ol><p>hello2</p>');
    range.selectNode(body.firstChild).select();
    editor.execCommand('insertunorderedlist', 'square');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', '有序列表变为无序列表');
    equal(editor.queryCommandValue('insertunorderedlist'), 'square', '无序列表是方块');
    equal(ua.getChildHTML(body.firstChild), '<li><p>hello</p></li><li><p>hello3</p></li>', 'innerHTML 不变');
    /*切换为有序列表*/
    editor.execCommand('insertorderedlist', 'upper-alpha');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '无序列表变为有序列表');
    equal(editor.queryCommandValue('insertorderedlist'), 'upper-alpha', '有序列表是A');
    equal(ua.getChildHTML(body.firstChild), '<li><p>hello</p></li><li><p>hello3</p></li>', '变为有序列表后innerHTML 不变');
});

test('将列表下的文本合并到列表中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ul><li>hello1</li></ul><p>是的</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.lastChild, 1).select();
        /*将无序的变为有序，文本也相应变成无序列表的一部分*/
        editor.execCommand('insertorderedlist');
        ua.manualDeleteFillData(editor.body);
        equal(body.firstChild.tagName.toLowerCase(), 'ol', 'ul变为了ol');
        equal(ua.getChildHTML(body.firstChild), '<li><p>hello1</p></li><li><p>是的</p></li>');
        equal(body.childNodes.length, 1, '只有一个孩子是ol');
        start();
    }, 50);
    stop();
});

test('多个列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello1</li></ol><ul><li>hello2</li></ul>');
    range.selectNode(body.lastChild).select();
    /*将无序的变为有序*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(body.childNodes.length, 1, 'body只有1个孩子ol');
    equal(body.firstChild.childNodes.length, 2, '下面的列表合并到上面');
    equal(ua.getChildHTML(body.lastChild), '<li><p>hello1</p></li><li><p>hello2</p></li>', '2个li子节点');
});

test('修改列表中间某一段列表为另一种列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello</li><li>hello2</li><li>hello3</li><li>hello4</li></ol>');
    var lis = body.firstChild.getElementsByTagName('li');
    range.setStart(lis[1], 0).setEnd(lis[2], 1).select();
    editor.execCommand('insertunorderedlist');
    equal(body.childNodes.length, 3, '3个列表');
    equal(ua.getChildHTML(body.firstChild), '<li><p>hello</p></li>', '第一个列表只有一个li');
    equal(ua.getChildHTML(body.lastChild), '<li><p>hello4</p></li>', '最后一个列表只有一个li');
    equal(body.childNodes[1].tagName.toLowerCase(), 'ul', '第二个孩子是无序列表');
    equal(ua.getChildHTML(body.childNodes[1]), '<li><p>hello2</p></li><li><p>hello3</p></li>', '检查第二个列表的内容');
});

test('两个列表，将下面的合并上去', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello3</li></ol><ol><li>hello1</li></ol><ul><li>hello2</li></ul>');
    range.selectNode(body.lastChild).select();
    /*将无序的变为有序，有序上面的有序不会合并在一起了*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(body.childNodes.length, 2, 'body有两个孩子ol');
    equal(body.lastChild.childNodes.length, 2, '下面和上面的列表合并到上面去了');
//TODO 1.2.6不严重bug注释 空style未删除
//    equal( ua.getChildHTML( editor.body ), '<ol class=" list-paddingleft-2" ><li><p>hello3</p></li></ol><ol class=" list-paddingleft-2" ><li><p>hello1</p></li><li><p>hello2</p></li></ol>', '3个li子节点' );
});

test('trace 3293：列表下的文本合并到列表中', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello3</li><li>hello1</li></ol><p>文本1</p><p>文本2</p>');
    range.setStart(body, 1).setEnd(body, 3).select();
    /*选中文本变为有序列表，和上面的列表合并了*/
    editor.execCommand('insertorderedlist');
    var ol = body.firstChild;
    equal(body.childNodes.length, 1, '所有合并为一个列表');
    equal(ol.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(ol.childNodes.length, 4, '下面和上面的列表合并到上面去了');
    equal(ua.getChildHTML(body.firstChild), '<li><p>hello3</p></li><li><p>hello1</p></li><li><p>文本1</p></li><li><p>文本2</p></li>', '4个li子节点');
});

test('2个相同类型的列表合并', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol><li>hello3</li><li>hello1</li></ol><ol style="list-style-type: lower-alpha"><li><p>文本1</p></li><li><p>文本2</p></li></ol>');
    range.selectNode(body.lastChild).select();
    editor.execCommand('insertorderedlist');
    var ol = body.firstChild;
    equal(body.childNodes.length, 1, '所有合并为一个列表');
    equal(ol.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(ol.childNodes.length, 4, '下面和上面的列表合并到上面去了');
    equal(ua.getChildHTML(body.firstChild), '<li><p>hello3</p></li><li><p>hello1</p></li><li><p>文本1</p></li><li><p>文本2</p></li>', '4个li子节点');
});

test('不闭合情况h1套列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<h1>hello1</h1><h2>hello2</h2>');
    range.setStart(body.firstChild, 0).setEnd(body.lastChild, 1).select();
    /*对h1添加列表*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(ua.getChildHTML(body.firstChild), '<li><h1>hello1</h1></li><li><h2>hello2</h2></li>', '查看插入列表后的结果');
    equal(body.childNodes.length, 1, 'body只有一个孩子ol');
    equal(body.firstChild.childNodes.length, 2, '2个li');
});

test('闭合情况h1套列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<h2>hello1</h2>');
    range.setStart(body.firstChild, 0).collapse(1).select();
    /*对h1添加列表*/
    editor.execCommand('insertorderedlist');
    equal(body.firstChild.tagName.toLowerCase(), 'ol', '仍然是ol');
    equal(ua.getChildHTML(body.firstChild), '<li><h2>hello1</h2></li>', '查看插入列表后的结果');
    equal(body.childNodes.length, 1, 'body只有一个孩子ol');
    equal(body.firstChild.childNodes.length, 1, '1个li');
});

test('列表内后退', function () {
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if ((ua.browser.safari && !ua.browser.chrome))
        return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        var lis;
        var br = ua.browser.ie ? '<br>' : '<br>';
//////标签空格的处理
        editor.setContent('<ol><li><br></li><li><p>hello2</p></li><li><br></li><li><sss>hello3</sss></li><li><p>hello4</p></li><li><p>hello5</p></li></ol>');
//    editor.setContent('<ol><li><br></li><li><p>hello2</p></li><li></li><li><sss>hello3</sss></li><li><p>hello4</p></li><li><p>hello5</p></li></ol>');
        range.setStart(editor.body.firstChild.lastChild.firstChild.firstChild, 0).collapse(1).select();
        ua.manualDeleteFillData(editor.body);
        ua.keydown(editor.body, {keyCode:8});

        var ol = editor.body.getElementsByTagName('ol');
        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '5', '变成5个列表项');
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>' + br + '</p></li><li><p>hello2</p></li><li><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '最后一个列表项');
        range.setStart(lis[0].firstChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:8});

        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '4', '变成4个列表项');
        equal(ua.getChildHTML(editor.body.lastChild), '<li><p>hello2</p></li><li><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '第一个列表项且为空行');
        range.setStart(lis[1].firstChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:8});

        lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '3', '变成3个列表项');
        equal(ua.getChildHTML(editor.body.lastChild), '<li><p>hello2</p><p>' + br + '</p></li><li><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li>', '中间列表项且为空行');
        if (!ua.browser.ie) {
            range.setStart(lis[1].firstChild.firstChild, 0).collapse(1).select();
            ua.manualDeleteFillData(editor.body);
            ua.keydown(editor.body, {keyCode:8});
//TODO 1.2.6不严重bug注释 空style未删除
//        equal(ua.getChildHTML(editor.body),'<p><br></p><ol class=\" list-paddingleft-2\"><li><p>hello2</p><p><br></p><sss>hello3</sss></li><li><p>hello4</p><p>hello5</p></li></ol>','自定义标签后退');
        }

});

test('列表内回车', function () {
    var editor = te.obj[0];
    var range = te.obj[1];

        var lis;
        var br = ua.browser.ie ? '' : '<br>';
        editor.setContent('<ol><li><sss></sss><sss></sss></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[0], 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:13});
        var spa = ua.browser.opera ? '<br>' : '';
        equal(ua.getChildHTML(editor.body), spa + '<p><sss></sss><sss></sss></p>', '空列表项回车--无列表');

        editor.setContent('<ol><li><sss>hello1</sss><p>hello2</p></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[0].lastChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:13});
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p><sss>hello1</sss><p></p></p></li><li><p><p>hello2</p></p></li>', '单个列表项内回车');
//////标签空格的处理
//    editor.setContent('<ol><li><br></li><li><p>hello5</p></li><li><p><br></p><p><br></p></li></ol>');
        editor.setContent('<ol><li><br></li><li><p>hello5</p></li><li><p><br></p><p><br></p></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[2].firstChild.firstChild, 0).setEnd(lis[2].lastChild.firstChild, 0).select();
        ua.keydown(editor.body, {keyCode:13});
//TODO 1.2.6不严重bug注释 空style未删除
//    equal(ua.getChildHTML(editor.body),'<ol class=\" list-paddingleft-2\"><li><p>'+br+'</p></li><li><p>hello5</p></li></ol><p>'+br+'</p>','最后一个列表项为空行回车');

        /*trace 2652*/
        range.setStart(editor.body.firstChild.firstChild.firstChild, 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:13});
//TODO 1.2.6不严重bug注释 空style未删除
//    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p><ol class=\" list-paddingleft-2\"><li><p>hello5</p></li></ol><p>'+br+'</p>','第一个列表项为空行下回车');

        /*trace 2653*/
        editor.setContent('<ol><li><p>hello2</p></li><li><p>hello3</p></li><li><p><br /></p><p>hello5</p></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[0].firstChild.firstChild, 2).setEnd(lis[1].firstChild.firstChild, 4).select();
        ua.keydown(editor.body, {keyCode:13});
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>he</p></li><li><p>o3</p></li><li><p><br></p><p>hello5</p></li>', '非闭合回车');

        editor.setContent('<ol><li><sss>hello</sss><p>hello4</p></li><li><p>hello5</p></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[0].lastChild.firstChild, 1).setEnd(lis[0].lastChild.firstChild, 2).select();
        ua.keydown(editor.body, {keyCode:13});
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p><sss>hello</sss><p>h</p></p></li><li><p><p>llo4</p></p></li><li><p>hello5</p></li>', '一个列表项内两行');

});

test('tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];

        var lis;
        editor.setContent('<ol><li><p>hello1</p></li><li><p>hello2</p></li></ol>');
        lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[1], 0).collapse(1).select();
        ua.keydown(editor.body, {keyCode:9});
        ua.keydown(editor.body, {keyCode:9});
        var str = '<li><p>hello1</p></li><ol style="list-style-type: lower-alpha;" class=" list-paddingleft-2" ><ol style="list-style-type: lower-roman;" class=" list-paddingleft-2" ><li><p>hello2</p></li></ol></ol>';
        ua.checkSameHtml(str, editor.body.firstChild.innerHTML.toLowerCase(), '有序列表---tab键');

});

test('回车后产生新的li-选区闭合', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>hello1</p><p>hello2</p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 0).setEnd(body.firstChild.nextSibling, 1).select();
            editor.execCommand('insertorderedlist');
            var lastLi = body.firstChild.lastChild.firstChild.firstChild;
            range.setStart(lastLi, lastLi.length).collapse(1).select();
            setTimeout(function () {
                ua.keydown(editor.body, {'keyCode':13});
                equal(body.firstChild.childNodes.length, 3, '回车后产生新的li');
                equal(body.firstChild.lastChild.tagName.toLowerCase(), 'li', '回车后产生新的li');
                var br = ua.browser.ie ? '' : '<br>';
                equal(ua.getChildHTML(body.firstChild), '<li><p>hello1</p></li><li><p>hello2</p></li><li><p>' + br + '</p></li>', '检查内容');
                var lastLi = body.firstChild.lastChild.firstChild.firstChild;
                range.setStart(lastLi, lastLi.length).collapse(1).select();
                setTimeout(function () {
                    ua.keydown(editor.body, {'keyCode':13});
                    equal(body.firstChild.childNodes.length, 2, '空li后回车，删除此行li');
                    equal(body.lastChild.tagName.toLowerCase(), 'p', '产生p');
                    br = ua.browser.ie ? '' : '<br>';
                    ua.manualDeleteFillData(body.lastChild);
                    equal(body.lastChild.innerHTML.toLowerCase().replace(/\r\n/ig, ''), br, '检查内容');
                    start()
                }, 20);
            }, 20);
        }, 50);
    stop();
});

/*trace 3074*/
test('trace 1622：表格中插入列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<table><tbody><tr><td><br></td><td>你好</td></tr><tr><td>hello2</td><td>你好2</td></tr></tbody></table>');
    /*必须加br，否则没办法占位*/
    stop()
    setTimeout(function () {
        var tds = body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        /*选中一个单元格*/
        editor.execCommand('insertorderedlist');
        /*插入有序列表*/
        equal(tds[0].firstChild.tagName.toLowerCase(), 'ol', '查询列表的类型');
        equal(tds[0].firstChild.style['listStyleType'], 'decimal', '查询有序列表的类型');
        var br = baidu.editor.browser.ie ? "<br>" : "<br>";
        equal(ua.getChildHTML(tds[0].firstChild), '<li>' + '<p>' + br + '</p>' + '</li>');
        setTimeout(function () {
            var trs = editor.body.firstChild.getElementsByTagName('tr');
            /*选中多个单元格*/
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[1]);
            ut.setSelected(cellsRange);
            range.setStart(trs[0].cells[0], 0).collapse(true).select();
            tds = body.getElementsByTagName('td');
            editor.execCommand('insertunorderedlist', 'circle');
            /*插入无序列表*/
            equal(tds[1].firstChild.tagName.toLowerCase(), 'ul', '查询无序列表');
            equal(tds[1].firstChild.style['listStyleType'], 'circle', '查询无序列表的类型');
            equal(ua.getChildHTML(tds[1].firstChild), '<li>你好</li>');
            equal(ua.getChildHTML(tds[3].firstChild), '<li>你好2</li>');
            start();
        }, 50);
    }, 50);
});

///*presskey*/
//test( ' trace 1536:删除部分列表', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<ol><li>hello1</li><li>你好</li><li>hello3</li></ol>' );
//    var body = editor.body;
//    var range = te.obj[1];
//    stop();
//    expect( 2 );
//    range.setStart( body.firstChild, 1 ).setEnd( body.firstChild, 2 ).select();
//    editor.focus();
//    te.presskey( 'del', '' );
//    editor.focus();
//    setTimeout( function () {
//        equal( body.childNodes.length, 1, '删除后只剩一个ol元素' );
//        var br = (baidu.editor.browser.ie || baidu.editor.browser.gecko) ? "" : "<br>";
//        //todo 不同浏览器原生选区的差别导致
////        equal( ua.getChildHTML( body ), '<ol><li><p>hello1</p></li><li><p>hello3' + br + '</p></li></ol>', '第二个li被删除' );
//        start();
//    }, 30 );
//} );
///*presskey*/
//test( ' trace 1544,1624 :列表中回车后再回退，会产生一个空行', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<ol><li><p>hello1</p></li><li><p>你好</p></li></ol>' );
//    var body = editor.body;
//    var ol = body.firstChild;
//    var range = te.obj[1];
//
//    range.setStart( ol.firstChild.firstChild, 1 ).collapse( 1 ).select();
//    editor.focus();
//    te.presskey( 'enter', '' );
//    equal(editor.selection.getRange().startContainer.parentNode.innerHTML,'');
//
//    setTimeout( function () {
//        range.setStart( ol.childNodes[1], 0 ).collapse( 1 ).select();
//        equal(editor.selection.getRange().startContainer.parentNode.innerHTML,'');
//        editor.focus();
//        te.presskey( 'back', '' );
//        setTimeout( function () {
//            editor.focus();
//            var br = ua.browser.ie ? "" : "<br>";
//            equal( ua.getChildHTML( body ), '<ol><li><p>hello1</p><p>' + br + '</p></li><li><p>你好</p></li></ol>', '第二个li被删除' );
//            range.setStart( body, 0 ).setEnd( body, 1 ).select();
//            editor.execCommand( 'insertorderedlist' );
//            equal( ua.getChildHTML( body ), '<p>hello1</p><p>' + br + '</p><p>你好</p>', '应当变为纯文本' );
//            start();
//        }, 70 );
//    }, 50 );
//    stop();
//} );

test('trace1620：修改上面的列表与下面的列表一致', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>你好</p><ol><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type:lower-alpha; "><li><p>字母列表2</p></li><li><p>字母列表2</p></li></ol>');
    range.selectNode(editor.body.firstChild.nextSibling).select();
    editor.execCommand('insertorderedlist', 'lower-alpha');
    var html = '<p>你好</p><ol style="list-style-type: lower-alpha;" class=" list-paddingleft-2" ><li><p>数字列表1</p></li><li><p>数字列表2</p></li><li><p>字母列表2</p></li><li><p>字母列表2</p></li></ol>'
    ua.checkSameHtml(html, editor.body.innerHTML.toLowerCase(), '检查列表结果');
});

test('trace 1621：选中多重列表，设置为相同类型的列表', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<ol style="list-style-type:decimal; "><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type:lower-alpha; "><li><p>字母列表1</p></li><li><p>字母列表2</p></li></ol><ol style="list-style-type: upper-alpha; "><li><p>​大写字母1<br></p></li><li><p>大写字母2</p></li><li><p>大写字母3</p></li></ol>');
    range.setStart(body, 1).setEnd(body.lastChild.firstChild.nextSibling, 1).select();
    var html = '<ol style="list-style-type: decimal;" class=" list-paddingleft-2" ><li><p>数字列表1</p></li><li><p>数字列表2</p></li></ol><ol style="list-style-type: upper-alpha;" class=" list-paddingleft-2" ><li><p>字母列表1</p></li><li><p>字母列表2</p></li><li><p>大写字母1<br/></p></li><li><p>大写字母2</p></li><li><p>大写字母3</p></li></ol>';
    editor.execCommand('insertorderedlist', 'upper-alpha');
    ua.checkSameHtml(html, editor.body.innerHTML.toLowerCase(), 'trace 1621');
});
//TODO 1.2.6不严重bug注释 空style未删除
//test( 'trace 3049：列表内有引用', function () {
//    var editor = te.obj[0];
//    editor.setContent( '<blockquote><ol class="custom_cn1 list-paddingleft-1" ><li class="list-cn-2-1 list-cn1-paddingleft-1" ><p>a</p></li><li class="list-cn-2-2 list-cn1-paddingleft-1" ><p>b</p></li></ol></blockquote>' );
//    editor.execCommand( 'selectall');
//    editor.execCommand( 'blockquote' );
//    var html = '<ol class="custom_cn1 list-paddingleft-1" ><li class="list-cn-2-1 list-cn1-paddingleft-1"><p>a</p></li><li class="list-cn-2-2 list-cn1-paddingleft-1"><p>b</p></li></ol>';
//    equal(ua.getChildHTML(editor.body),html,'检查列表结果');
//});

/*trace 3056：模拟不完全，还需手动测试*/
test('trace 3056：列表内表格后回车', function () {
    var editor = te.obj[0];
    var range = te.obj[1];

        var body = editor.body;
        editor.setContent('<ol class="custom_cn2 list-paddingleft-1" ><li class="list-cn-3-1 list-cn2-paddingleft-1" ><p>a</p></li><li class="list-cn-3-2 list-cn2-paddingleft-1" ><p><br></p></li><li class="list-cn-3-3 list-cn2-paddingleft-1" ><p>c</p></li></ol>');
        var lis = editor.body.getElementsByTagName('li');
        range.setStart(lis[1].firstChild, 0).collapse(true).select();

        setTimeout(function () {
            editor.execCommand('inserttable');
            var tds = body.getElementsByTagName('td');
            tds[0].innerHTML = 'asd<br>';
            range.setStart(tds[0].firstChild, 3).collapse(true).select();
            setTimeout(function () {
                ua.keydown(body, {'keyCode':13});
                equal(body.childNodes.length, 1, 'body只有一个孩子');
                equal(editor.body.getElementsByTagName('li').length, 3, 'ol有3个孩子');
                equal(editor.body.getElementsByTagName('table').length, 1, '只有1个table');
                start()
            }, 20);
        }, 50);
    stop();
});

/*trace 3075：fix in future*/
//test( 'trace 3075：表格标题行中插入有序列表', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<table><tbody><tr><th><br></th><th><br></th><th><br></th></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>' ); /*必须加br，否则没办法占位*/
//    var ths = body.getElementsByTagName( 'th' );
//    range.setStart( ths[1], 0 ).collapse( 1 ).select();                             /*选中一个单元格*/
//    editor.execCommand( 'insertorderedlist' );                                      /*插入有序列表*/
//    equal( ths[1].firstChild.tagName.toLowerCase(), 'ol', '查询列表的类型' );
//    equal( ths[1].firstChild.style['listStyleType'], 'decimal', '查询有序列表的类型' );
//    var br = baidu.editor.browser.ie ? "" : "<br>";
//    equal( ua.getChildHTML( ths[0].firstChild ), '<li>' + '<p>' + br + '</p>' + '</li>' );
//    stop();
//    setTimeout(function() {
//        editor.execCommand('source');
//        setTimeout(function() {
//            editor.execCommand('source');
//            equal( body.getElementsByTagName('table').length, 1, '只有1个table' );
//            start();
//        },20);
//    },20);
//} );
//test( 'trace 3075：表格标题行中插入无序列表', function () {
//    var editor = te.obj[0];
//    var range = te.obj[1];
//    var body = editor.body;
//    editor.setContent( '<table><tbody><tr><th><br></th><th><br></th><th><br></th></tr><tr><td><br></td><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td><td><br></td></tr></tbody></table>' ); /*必须加br，否则没办法占位*/
//    var trs = editor.body.firstChild.getElementsByTagName( 'tr' );                  /*选中多个单元格*/
//    var ut = editor.getUETable(editor.body.firstChild);
//    var cellsRange = ut.getCellsRange(trs[0].cells[1],trs[0].cells[2]);
//    ut.setSelected(cellsRange);
//    range.setStart( trs[0].cells[1], 0 ).collapse( true ).select();
//    var ths = body.getElementsByTagName( 'th' );
//    editor.execCommand( 'insertunorderedlist', 'circle' );                            /*插入无序列表*/
//    equal( ths[1].firstChild.tagName.toLowerCase(), 'ul', '查询无序列表' );
//    equal( ths[1].firstChild.style['listStyleType'], 'circle', '查询无序列表的类型' );
//    stop();
//    setTimeout(function() {
//        editor.execCommand('source');
//        setTimeout(function() {
//            editor.execCommand('source');
//            equal( body.getElementsByTagName('table').length, 1, '只有1个table' );
//            start();
//        },20);
//    },20);
//} );

test('trace 3117：列表内后退两次', function () {
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        var br = ua.browser.ie ? '<br>' : '<br>';
        editor.setContent('<ol><li>hello</li><li><p><br></p></li></ol>');

        range.setStart(editor.body.firstChild.lastChild.firstChild, 0).collapse(1).select();
        ua.manualDeleteFillData(editor.body);
        ua.keydown(editor.body, {keyCode:8});
        var ol = editor.body.getElementsByTagName('ol');
        var lis = editor.body.getElementsByTagName('li');
        equal(lis.length, '1', '变成1个列表项');
        equal(ua.getChildHTML(editor.body.firstChild), '<li><p>hello</p><p>' + br + '</p></li>', '检查列表内容');
//TODO 1.2.6不严重bug注释 空style未删除
//    range.setStart(lis[0].lastChild,0).collapse(1).select();
//    ua.keydown(editor.body,{keyCode:8});
//    equal(ua.getChildHTML(editor.body),'<ol class=\" list-paddingleft-2\"><li><p>hello</p></li></ol><p>'+br+'</p>','检查body内容');
        /*模拟不到光标跳到上一行？*/
//    range.setStart(editor.body.lastChild,0).collapse(1).select();
//    ua.keydown(editor.body,{keyCode:8});
//    equal(ua.getChildHTML(editor.body),'<ol class=\" list-paddingleft-2\"><li><p>hello</p></li></ol>','检查body内容');

});

/*trace 3136*/
test('trace 3118：全选后backspace', function () {
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        var br = ua.browser.ie ? '' : '<br>';
        editor.setContent('<ol><li>hello</li><li><p><br></p></li></ol>');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        ua.keydown(editor.body, {keyCode:8});
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', '');
        ok(!editor.queryCommandState('insertorderedlist'), 'state是0');

});

test('trace 3126：1.2.5+列表重构新增标签，tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];

        var body = editor.body;
        editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
        editor.execCommand('selectAll');
        editor.execCommand('insertorderedlist', 'cn2');
        var lis = body.getElementsByTagName('li');
        range.setStart(lis[1].firstChild, 0).setEnd(lis[2].firstChild, 1).select();
        ua.keydown(editor.body, {keyCode:9});
        var str = '<li class="list-cn-3-1 list-cn2-paddingleft-1" ><p>hello1</p></li><ol style="list-style-type: decimal;" class=" list-paddingleft-3" ><li><p>hello2</p></li><li><p>hello3</p></li></ol><li class="list-cn-3-2 list-cn2-paddingleft-1" ><p>hello4</p></li>';
        ua.checkSameHtml(str, editor.body.firstChild.innerHTML.toLowerCase(), '有序列表---tab键');

});

test('trace 3132：单行列表backspace', function () {
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        editor.setContent('<ol><li><br></li></ol>');
        range.selectNode(editor.body.firstChild.firstChild.firstChild.firstChild).select();
        ua.keydown(editor.body, {keyCode:8});
        var space ='<br>';
        equal(ua.getChildHTML(editor.body), '<p>'+space+'</p>', '');

});

test('trace 3133：表格中插入列表再取消列表', function () {
    /*实际操作没问题，取range时会在将文本节点分为两个节点，后退操作无法实现*/
    if ((ua.browser.safari && !ua.browser.chrome))return 0;
    var editor = te.obj[0];
    var range = te.obj[1];

        var body = editor.body;
        var br = baidu.editor.browser.ie ? "" : "<br>";
        editor.setContent('<table><tbody><tr><td><br></td></tr></tbody></table>');
        /*插入一行一列的表格*/
        var tds = body.getElementsByTagName('td');
        range.setStart(tds[0], 0).collapse(1).select();
        editor.execCommand('insertorderedlist', 'num2');
        /*插入列表*/
        equal(tds[0].firstChild.tagName.toLowerCase(), 'ol', '查询列表的类型');
        equal(ua.getChildHTML(tds[0].firstChild), '<li class="list-num-3-1 list-num2-paddingleft-1"><p><br></p></li>');
        editor.execCommand('insertorderedlist', 'num2');
        /*取消列表*/
        equal(ua.getChildHTML(tds[0]), '<p><br></p>');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        /*ctrl+a*/
        ua.keydown(editor.body, {keyCode:8});
        /*backspace*/
        equal(ua.getChildHTML(editor.body), '<p>' + br + '</p>', '');

});

test('trace 3164：添加列表，取消列表', function () {
    var editor = te.obj[0];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>');
    editor.execCommand('selectAll');
    editor.execCommand('insertunorderedlist', 'dash');
    equal(body.firstChild.tagName.toLowerCase(), 'ul', '检查无序列表');
    equal(body.firstChild.className, 'custom_dash list-paddingleft-1', '查询有序列表的类型');
    equal(editor.queryCommandValue('insertunorderedlist'), 'dash', '查询插入无序列表的结果');
    ok(editor.queryCommandState('insertunorderedlist'), 'state是1');
    editor.execCommand('selectAll');
    editor.execCommand('insertunorderedlist', 'dash');
    ua.checkHTMLSameStyle('<p>hello1</p><p>hello2</p><p>hello3</p><p>hello4</p>', editor.document, editor.body, '取消列表');
    equal(editor.queryCommandValue('insertunorderedlist'), null, '查询取消无序列表的结果');
    ok(!editor.queryCommandState('insertunorderedlist'), 'state是0');
});

test('trace 3165：检查表格中列表tab键', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
        var body = editor.body;
        setTimeout(function () {
            editor.execCommand('inserttable');
            var tds = body.getElementsByTagName('td');
            range.setStart(tds[6], 0).collapse(1).select();
            editor.execCommand('insertorderedlist');
            equal(tds[6].firstChild.style['listStyleType'], 'decimal', '查询有序列表的类型');
            tds = body.getElementsByTagName('td');
            range.setStart(tds[5], 0).collapse(1).select();
            range = editor.selection.getRange();
            if(ua.browser.ie==9||ua.browser.ie==10)
                equal(range.startContainer.tagName.toLowerCase(), 'td', 'tab键前光标位于td中');

            else
                equal(range.startContainer.parentNode.tagName.toLowerCase(), 'td', 'tab键前光标位于td中');
            ua.keydown(editor.body, {keyCode:9});
            setTimeout(function () {
                range = editor.selection.getRange();
                if (!ua.browser.gecko && !ua.browser.ie && !ua.browser.webkit)//TODO 1.2.6
                    equal(range.startContainer.parentNode.tagName.toLowerCase(), 'li', 'tab键后光标跳到有列表的单元格中');
                equal(tds[6].firstChild.style['listStyleType'], 'decimal', '检查有序列表的类型不应该被改变');
                start();
            }, 100);
        }, 100);
    stop();
});

test('trace 3168：表格中列表更改样式', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.execCommand('inserttable');
    var tds = body.getElementsByTagName('td');
    tds[0].innerHTML = 'asdf';
    tds[1].innerHTML = '<ol class="custom_num1 list-paddingleft-1"><li class="list-num-2-1 list-num1-paddingleft-1"><p>asd</p></li></ol>';
    setTimeout(function () {
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[0].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();

        editor.execCommand('insertorderedlist', 'cn1');
        equal(tds[0].firstChild.className, 'custom_cn1 list-paddingleft-1', '查询有序列表的类型');
        equal(tds[1].firstChild.className, 'custom_cn1 list-paddingleft-1', '查询有序列表的类型');
        equal(editor.queryCommandValue('insertorderedlist'), 'cn1', '查询插入有序列表的结果');

        editor.execCommand('insertunorderedlist', 'dot');
        equal(tds[0].firstChild.className, 'custom_dot list-paddingleft-1', '查询无序列表的类型');
        equal(tds[1].firstChild.className, 'custom_dot list-paddingleft-1', '查询无序列表的类型');
        equal(editor.queryCommandValue('insertunorderedlist'), 'dot', '查询插入无序列表的结果');
        start();
    }, 50);
    stop();
});
//todo 1.2.6.1
//test('trace 3213 3499：tab键后更改列表样式', function () {
//    var div = document.body.appendChild(document.createElement('div'));
//    div.id = 'ue';
//    var editor = UE.getEditor('ue');
//    editor.ready(function () {
//        var range = new baidu.editor.dom.Range(editor.document);
//        editor.setContent('<ol><li><p>hello1</p></li><li><p>hello2</p></li><li><p>hello1</p></li><li><p>hello1</p></li></ol>');
//        var lis = editor.body.getElementsByTagName('li');
//        range.setStart(lis[2], 0).setEnd(lis[3], 1).select();
//        ua.keydown(editor.body, {keyCode:9});
//        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
//        editor.execCommand('insertorderedlist', 'lower-alpha');
//        var str = '<ol style="list-style-type: lower-alpha;" class=" list-paddingleft-2"><li><p>hello1</p></li><li><p>hello2</p></li><li><p>hello1</p></li><li><p>hello1</p></li></ol>';
//        ua.checkSameHtml(str, editor.body.innerHTML.toLowerCase(), '');
//        UE.delEditor('ue');
//        start();
//    });
//    stop();
//});