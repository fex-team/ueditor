module('core.Range');

var checkBookmark = function (bookmark, pre, latter, id) {
    same(bookmark['start'], pre, '检查start返回值');
    same(bookmark['end'], latter, '检查end返回值');
    equal(bookmark['id'], id, '检查id');
};

test('init', function () {
    expect(6);
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    ua.checkResult(range, null, null, null, null, true, 'for init range');
    same(range.document, document, 'check current document of range');
});


test('setStart/startEnd 自闭合元素', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    var img = document.createElement('img');
    div.appendChild(img);
    range.setStart(img, 0);
    ua.checkResult(range, div, div, 0, 0, true, "endContainer is null");
    range.setEnd(img, 0);
    ua.checkResult(range, div, div, 0, 1, false, "startContainer is not null");
    range.startContainer = null;
    range.setEnd(img, 0);
    ua.checkResult(range, div, div, 1, 1, true, "startContainer is null");
    range.setStart(img, 0);
    ua.checkResult(range, div, div, 0, 1, false, "endContainer is not null");
});

test('setStart/startEnd--nodeType不为1', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    var text = document.createTextNode("text");
    div.appendChild(text);
    range.setStart(text, 0);
    ua.checkResult(range, text, text, 0, 0, true, "endContainer is null");
    range.setEnd(text, 1);
    ua.checkResult(range, text, text, 0, 1, false, "startContainer is not null");
});

test('setStart/setEnd--nodeType为1', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    range.setStart(div, 0);
    ua.checkResult(range, div, div, 0, 0, true, "endContainer is null");
    range.setEnd(div, 1);
    ua.checkResult(range, div, div, 0, 1, false, "startContainer is not null");
});
/*
 * 测的内容比较多，updateCollapse，setEndPoint，setStart，setEnd，collapse
 * 因为updateCollapse和setEndPoint无法通过Range对象获取， 必须间接调用验证
 */
test('setStartAfter,setStartBefore', function () {
    var div = te.dom[2];
    div.innerHTML = '<span></span><a></a>';
    var span = div.firstChild;
    var a = div.lastChild;
    var range = new baidu.editor.dom.Range(document);
    range.setStartAfter(a);
    equal(range.startOffset, 2, 'check startOffset for setStartAfter--boundary testing');
    range.setStartAfter(span);
    equal(range.startOffset, 1, 'check startOffset for setStartAfter');
    range.setStartBefore(span);
    equal(range.startOffset, 0, 'check startOffset for setStartBefore--boundary testing');
    range.setStartBefore(a);
    equal(range.startOffset, 1, 'check startOffset for setStartBefore');
    var txtNode = document.createTextNode("text");
    div.innerHTML = "";
    div.appendChild(txtNode);
    range.setStartBefore(txtNode);
    equal(range.startOffset, 0, 'check startOffset in text node');
});

test('setEndAfter,setEndBefore', function () {
    var div = te.dom[2];
    div.innerHTML = '<span></span><a></a>';
    var span = div.firstChild;
    var a = div.lastChild;
    var range = new baidu.editor.dom.Range(document);
    range.setEndAfter(a);
    equal(range.endOffset, 2, 'check startOffset for setEndAfter--boundary testing');
    range.setEndAfter(span);
    equal(range.endOffset, 1, 'check startOffset for setEndAfter');
    range.setEndBefore(span);
    equal(range.endOffset, 0, 'check startOffset for setEndBefore--boundary testing');
    range.setEndBefore(a);
    equal(range.endOffset, 1, 'check startOffset for setEndBefore');
});

/* 校验collapse方法 */
test('collapse', function () {
    var text = document.createTextNode('TextNode');
    te.dom[2].appendChild(text);
    var range = new baidu.editor.dom.Range(document);
    range.setStart(text, 1);
//    ua.checkResult(range.endContainer,range.startContainer,0)
    ok(range.collapsed, 'check collapse method true--setStart');
    equal(range.startContainer, range.endContainer, 'compare startContainer and endContainer--setStart');
    range.startContainer = null;
    range.setEnd(text, 0);
    equal(range.startContainer, range.endContainer, 'compare startContainer and endContainer--setEnd');
    equal(range.startOffset, range.endOffset, 'compare startOffset and endOffset--setEnd');
    ok(range.collapsed, 'check collapsed is true--setEnd');
    var img = document.createElement("img");
    range.insertNode(img).selectNode(img);
    equal(range.startContainer, range.endContainer, "img startContainer and endContainer is same，but startOffset and endOffset is not same");
});

//TODO 空节点<div></div>

test('selectNode', function () {
    var div = te.dom[2];
    div.innerHTML = "text!";
    div.id = 'div_id';
    var range = new baidu.editor.dom.Range(document);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNode--空节点', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNode--空文本节点', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    var textNode = document.createTextNode('');
    div.appendChild(textNode);
    range.selectNode(div);
    var index = ua.getIndex(div);
    ua.checkResult(range, document.body, document.body, index, index + 1, false, 'check selectNode');
});

test('selectNodeContents', function () {
    expect(15);
    var div = te.dom[2];
    div.innerHTML = '<div>text</div><a>';
    var text = div.firstChild.firstChild;
    var range = new baidu.editor.dom.Range(document);
    range = range.selectNodeContents(div);
    ua.checkResult(range, div, div, 0, 2, false, 'selectNodeContents');
    /*textNode*/
    range = range.selectNodeContents((text));
    ua.checkResult(range, text, text, 0, 4, false, 'selectNodeContents for textNode');
    div.innerHTML = '<b>xxx<i>xxx</i>xxx</b>';
    range = new baidu.editor.dom.Range(document);
    range = range.selectNodeContents(div.firstChild);
    ua.checkResult(range, div.firstChild, div.firstChild, 0, 3, false, 'selectNodeContents');

});


test('cloneRange', function () {
    expect(5);
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<div>cloneRange</div>';
    range.setStart(div, 0);
    range.setEnd(div, 1);
    var cloneRange = range.cloneRange(range);
    ua.checkResult(range, cloneRange.startContainer, cloneRange.endContainer,
        cloneRange.startOffset, cloneRange.endOffset, false, 'cloneRange');
});


/*循环缩进子节点，直到子节点元素类型不为1或为自闭合元素*/
test('shrinkBoundary--not ignore end', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
//    $('#test').css('background','red');
    div.innerHTML = '<div>div1_text</div><a>a_text</a><div><span>span_text</span>div3_text</div>';

    var a = div.firstChild.nextSibling;
    var div_2 = div.lastChild;
    range.setStart(div, 1).setEnd(div, 3);
    range.shrinkBoundary();
    ua.checkResult(range, a, div_2, 0, 2, false, 'shrinkBoundary--not ignore end');
});

test('shrinkBoundary--ignoreEnd', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "<div><p>p_text</p></div>";
    var div_child = div.firstChild;
    var p = div_child.firstChild;
    range.setStart(div_child, 0).setEnd(div_child, 0);
    //TODO
    range.shrinkBoundary(true);
    ua.checkResult(range, p, p, 0, 0, true, '检查前后闭合是否一致');
});
test('shrinkBonudaryl', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<b><i>xxxx</i>xxxxxxx</b>';
    /*ignoreEnd=true*/
    range.selectNodeContents(div).shrinkBoundary(true);

    var i = div.firstChild.firstChild;
    ua.checkResult(range, i, div, 0, 1, false, 'shrinkBoundary--ignoreEnd');
    /*ignoreEnd = null*/
    var b = div.firstChild;
    range.selectNodeContents(div).shrinkBoundary();
    ua.checkResult(range, i, b, 0, b.childNodes.length, false, 'shrinkBoundary--not ignoreEnd');

    div.innerHTML = 'xxxx<b><i><u></u></i></b>ssss';
    var u = div.getElementsByTagName('u')[0];
    range.selectNode(div.getElementsByTagName('b')[0]).shrinkBoundary();
    ua.checkResult(range, u, u, 0, 0, true, '初始startContainer和endContainer相同');

    div.innerHTML = '<table><tr><td>sssss</td></tr></table>';
    var td = div.getElementsByTagName('td')[0];
    var table = div.firstChild;
    range.setStart(table, 0).setEnd(table.getElementsByTagName('tr')[0], 1).shrinkBoundary();
    ua.checkResult(range, td, td, 0, 1, false, '初始startContainer和endContainer不同');

    div.innerHTML = '<img/>';
    range.setStart(div, 0).setEnd(div, 1).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 1, false, '子节点为自闭合元素，未能进入函数内部的逻辑');

    div.innerHTML = 'text';
    var text = div.firstChild;
    range.setStart(text, 1).setEnd(text, 4).shrinkBoundary();
    ua.checkResult(range, text, text, 1, 4, false, '节点为文本节点，未能进入函数内部的逻辑');

    range.setStart(div, 0).setEnd(div, 1).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 1, false, '子节点为文本节点，未能进入函数内部的逻辑');

    range.setStart(div, 0).setEnd(div, 0).shrinkBoundary();
    ua.checkResult(range, div, div, 0, 0, true, '元素collapsed');

    range.setStart(div, 0).setEnd(text, 4).shrinkBoundary();
    ua.checkResult(range, div, text, 0, 4, false, 'endContainer为文本节点');
});


/*调整边界，针对TextNode*/
test('txtToElmBoundary', function () {
    var div = te.dom[2];
    div.innerHTML = 'text_node';
    var range = new baidu.editor.dom.Range(document);
    var text = div.firstChild;
    /*endOffset大于text的长度*/
    range.setStart(text, 0).setEnd(text, 10);
    range.txtToElmBoundary();
    ua.checkResult(range, div, div, 0, 1, false, 'endOffset大于text的长度');
    /*endOffset小于text的长度*/
    range.setStart(text, 1).setEnd(text, 4).txtToElmBoundary();
    ua.checkResult(range, text, text, 1, 4, false, 'endOffset小于text长度');
    range.setStart(text, 1).setEnd(text, 10).txtToElmBoundary();
    ua.checkResult(range, text, div, 1, 1, false, 'startOffset不为0，endOffset大于text长度');
    /*startOffset和endOffset都大于text长度*/
    range.setStart(text, 10).setEnd(text, 11).txtToElmBoundary();
    ua.checkResult(range, div, div, 1, 1, true, 'endOffset和startOffset大于text长度');
    /*startOffset和endOffset都等于0*/
    range.setStart(text, 0).setEnd(text, 0).txtToElmBoundary();
    ua.checkResult(range, text, text, 0, 0, true, 'startOffset和endOffset为0');
});

/*切分文本节点*/
test('trimBonudary', function () {
    var div = te.dom[2];
    div.innerHTML = '<table border="1"><tr><td>td_xxxx<b><i><u>u_text</u></i></b></td></tr></table>';
    var range = new baidu.editor.dom.Range(document);
    var td = div.getElementsByTagName('td')[0];
    var td_text = td.firstChild;
    /*startOffset为0，在第一个孩子节点前插入*/
    range.setStart(td_text, 0).setEnd(td_text, 5);

    range.trimBoundary();
    ua.checkResult(range, td, td, 0, 1, false, '切分文本节点');
    /*text_node被切分为2个文本节点*/
    equal(td_text.data, "td_xx", "check text of tr");

    var u = div.getElementsByTagName('u')[0];
    var u_text = u.firstChild;

    /*startOffset=0 && collapsed=true，则不对后面的文本节点进行操作*/
    range.setStart(u_text, 0).setEnd(u_text, 0);
    range.trimBoundary();
    ua.checkResult(range, u, u, 0, 0, true, 'startOffset=endOffset=0');

    /*endOffset大于text的长度，从左边切'*/
    range.setStart(u_text, 3).setEnd(u_text, 10);
    range.trimBoundary().select();
    ua.checkResult(range, u, u, 1, 2, false, 'endOffset大于text的长度');
    equal(u_text.data, 'u_t', '从左边切分textNode');

    /*endOffset大小于text的长度，从中间切'*/
    range.setStart(u_text, 1).setEnd(u_text, 2);
    range.trimBoundary();
    ua.checkResult(range, u, u, 1, 2, false, 'endOffset小于text的长度');
    equal(u_text.data, 'u', '从中间切分textNode');

    div.innerHTML = '123456';
    range.setStart(div.firstChild, 2).setEnd(div.firstChild, 4).trimBoundary(true);
    ua.checkResult(range, div, div.lastChild, 1, 2, false, 'ignoreEnd');
});

/*前面尽可能往右边跳，后面尽可能往左边跳*/
test('adjustmentBoundary--startContainer为文本节点', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = 'div_text<p><span id="span">span_text</span></p>div_text2<p id="p">p_text<em>em_text</em></p>';
    var span_text = document.getElementById('span').firstChild;
    var p = document.getElementById('p');
    range.setStart(span_text, 9).setEnd(p, 0);
    range.adjustmentBoundary();
    ua.checkResult(range, div, div, 2, 3, false, 'startContainer为文本节点');

});

//TODO
test('adjustmentBoundary--非文本节点', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = 'div_text<p><span id="span">span_text</span></p>div_text2<p id="p">p_text<em>em_text</em></p>';
    var span = document.getElementById('span');
    var p = document.getElementById('p');
    range.setStart(span, 1).setEnd(p, 0);
    range.adjustmentBoundary();
    ua.checkResult(range, div, div, 2, 3, false, 'startContainer为非文本节点');

});

test('getCommonAncestor--初始startContainer和endContainer相同', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = "div_text<p><span>span_text</span></p>div_text2";
    range.setStart(div, 0).setEnd(div, 1);
    /*--初始startContainer和endContainer相同*/
    var ancestor = range.getCommonAncestor();
    same(ancestor, div, '祖先节点为startContainer');
    /*文本节点*/
    var span = div.getElementsByTagName('span')[0];
    range.setStart(span.firstChild, 0).setEnd(span.firstChild, 4);
    ancestor = range.getCommonAncestor();
    same(ancestor, span.firstChild, "文本节点的祖先节点");
    /*忽略文本节点*/
    ancestor = range.getCommonAncestor(true, true);
    same(ancestor, span, "文本节点的祖先节点--忽略文本节点");

    range.setStart(div, 1).setEnd(div, 2);
    ancestor = range.getCommonAncestor(true, true);
    same(ancestor, span.parentNode, "文本节点的祖先节点--includeSelf=true");
    range.setStart(div, 1).setEnd(div, 2);
    ancestor = range.getCommonAncestor(false, true);
    same(ancestor, div, "文本节点的祖先节点--includeSelf=false");
});


test('getCommonAncestor--初始startContainer和endContainer不同', function () {
    var range = new baidu.editor.dom.Range(document);
    var div = te.dom[2];
    div.innerHTML = "div_text<p><span>span_text</span></p>div_text2";
    var span = div.getElementsByTagName('span')[0];
    range.setStart(div, 0).setEnd(span, 1);
    /*--初始startContainer和endContainer相同*/
    var ancestor = range.getCommonAncestor();
    same(ancestor, div, 'startContainer是endContainer的祖先');

    range.setStart(div.firstChild, 0).setEnd(span, 1);
    ancestor = range.getCommonAncestor();
    same(ancestor, div, 'startContainer和endContainer是兄弟');
});

test('selectNodeContents', function () {
    var div = te.dom[2];
    div.innerHTML = '<b>xxxx</b>div_text';
    var range = new baidu.editor.dom.Range(document);
    /*选中非文本节点*/
    range.selectNodeContents(div);
    ua.checkResult(range, div, div, 0, 2, false, 'selectNodeContents');
    /*选中文本节点*/
    range.selectNodeContents(div.lastChild);
    ua.checkResult(range, div.lastChild, div.lastChild, 0, 8, false, 'selectNodeContents--');
});

test('cloneContents', function () {
    var div = te.dom[2];
    div.innerHTML = '<b>b_text</b>div_text';
//    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var range = new baidu.editor.dom.Range(document);
    var b = div.firstChild;
    range.setStart(b, 1).setEnd(div, 1);
    var frag = range.cloneContents();
    /*类型：<b>xxxx|</b>|div_text（"|"表示切的位置）*/
    equal(ua.getHTML(frag), '<b></b>', ' 只选中一个b标签，插入空文本节点');

    /*类型：<b>t|_ext</b>div|_text（"|"表示切的位置）*/
    range.setStart(b.firstChild, 1).setEnd(b.nextSibling, 3);
    frag = range.cloneContents();
    equal(ua.getHTML(frag), '<b>_text</b>div', '从文本节点中间切');
    /*类型：|<b>b_t|ext</b>div_text（"|"表示切的位置）*/
    range.setStart(div, 0).setEnd(b.firstChild, 3);
    frag = range.cloneContents();
    equal(ua.getHTML(frag), '<b>b_t</b>', '选中文本的前半部分');
    /*类型：<b>b|_text</b>div_text|（"|"表示切的位置）*/
    range.setStart(b.firstChild, 1).setEnd(div, 2);
    frag = range.cloneContents();
    equal(ua.getHTML(frag), '<b>_text</b>div_text', '选中文本的前半部分');
    /*类型：<b>xxxx|</b>xxxx<b>c22c|</b>（"|"表示切的位置）*/
    div.innerHTML = '<b>xxxx</b>xxxx<b>c22c</b>';
    range.setStart(div.firstChild, 1).setEnd(div.lastChild, 1);
    equals(ua.getHTML(range.cloneContents()), '<b></b>xxxx<b>c22c</b>');
});

/*startContainer和endContainer为文本节点，补全后面</b></tr>之类的标签*/
test('cloneContents--补全后面的标签', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first').firstChild;
    var two = document.getElementById('two').firstChild;
    r.setStart(first, 1).setEnd(two, 2);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first">irst<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">ab</td></tr></tbody></table>');
    ua.checkResult(r, first, two, 1, 2, false, 'cloneContents--补全后面的标签');
});

/*startContainer和endContainer为文本节点，层级各不相同，补全前面 的<b><tr>之类的标签*/
test('cloneContents--补全前面的标签', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var last = document.getElementById('last').firstChild;
    var two = document.getElementById('two').firstChild;
    r.setStart(two, 1);
    r.setEnd(last, 2);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<table id="table" width="300"><tbody><tr><td id="two">bc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">te</p>');
    ua.checkResult(r, two, last, 1, 2, false, 'cloneContents--补全前面的标签');
});

/*startContainer和endContainer为文本节点，为兄弟节点*/
test('cloneContents--切的部分为兄弟节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');

    r.setStart(first.firstChild, 1).setEnd(first.lastChild, 4);
    /*strong前面有空格*/
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), 'irst<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> str');
    ua.checkResult(r, first.firstChild, first.lastChild, 1, 4, false, 'cloneContents--startContainer和endContainer为兄弟节点');
});


test('cloneContents--切同一个文本节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first').firstChild;

    r.setStart(first, 1).setEnd(first, 4);
    equals(ua.getHTML(r.cloneContents()), 'irs');
    ua.checkResult(r, first, first, 1, 4, false, 'cloneContents--切同一个文本节点');
});

/*startContainer和endContainer的nodeType=1*/
test('cloneContents--startContainer和endContainer为非文本节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');
    var last = document.getElementById('last');
    r.setStart(first, 0).setEnd(last, 0);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\"></p>');
    ua.checkResult(r, first, last, 0, 0, false, 'cloneContents--开始和结束位置都是文本');

    r.setStart(first, 1).setEnd(last, 1);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first"><!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc</p>');
    ua.checkResult(r, first, last, 1, 1, false, 'cloneContents--开始位置有注释');
});


test('cloneContents--完整切掉一个节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');
    r.setStart(div, 0).setEnd(div, div.childNodes.length - 1);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>');
    ua.checkResult(r, div, div, 0, div.childNodes.length - 1, false, 'cloneContents--完整切掉一个节点');
});

test('cloneContents--startContainer和endContainer节点类型不同', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');
    var last = document.getElementById('last');
    r.setStart(first, 0).setEnd(last.firstChild, 1);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">t</p>');
    ua.checkResult(r, first, last.firstChild, 0, 1, false, 'cloneContents--startContainer的nodeType=1，endContainer为文本节点');

    r.setStart(first.firstChild, 1).setEnd(last, 0);
    ua.checkSameHtml(ua.getHTML(r.cloneContents()), '<p id="first">irst<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last"></p>');
    ua.checkResult(r, first.firstChild, last, 1, 0, false, 'cloneContents--endContainer为文本节点，startContainer的nodeType=1');
});


test('cloneContents--endContainer为em', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var traverse = document.getElementById('traverse');
    r.setStart(div, 0).setEnd(traverse, 1);
    equals(ua.getHTML(r.cloneContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b></p>');
    ua.checkResult(r, div, traverse, 0, 1, false, 'cloneContents--startContainer的nodeType=1，endContainer为b');
    r.setStart(div, 0).setEnd(traverse, 2);
    equals(ua.getHTML(r.cloneContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em></p>');
    ua.checkResult(r, div, traverse, 0, 2, false, 'cloneContents--startContainer的nodeType=1，endContainer为em');
});


test('cloneContents--元素闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p>p_text</p>';
//    if ( baidu.editor.browser.gecko ) {

    var text = div.firstChild.firstChild;
    range.setStart(text, 1).setEnd(text, 1);
    equals(ua.getHTML(range.cloneContents()), 'null', '元素闭合直接返回null');
    ua.checkResult(range, text, text, 1, 1, true, 'cloneContents--startContainer的nodeType=1，endContainer为em');
    var p = div.firstChild;
    range.setStart(p, 1).setEnd(p, 1);
    equals(ua.getHTML(range.cloneContents()), 'null', '元素闭合直接返回null');
    ua.checkResult(range, p, p, 1, 1, true, 'cloneContents--startContainer的nodeType=1，endContainer为em');
});


test('cloneContents--自闭合元素', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<b>b_text<i id="ii">i_text</i><img /></b>xxx';
    var b = div.firstChild;
    range.setStart(b.firstChild, 2).setEnd(b, b.childNodes.length);
    /*只能获得<img>而不是<img  />的标签*/
    equal(ua.getHTML(range.cloneContents()), 'text<i id="ii">i_text</i><img>');
    ua.checkResult(range, b.firstChild, b, 2, b.childNodes.length, false, '选中结束位置为自闭合元素-1');

    var i = b.firstChild.nextSibling;
    range.setStart(i, 1).setEnd(b, b.childNodes.length);
    equal(ua.getHTML(range.cloneContents()), '<i id="ii"></i><img>');
    ua.checkResult(range, i, b, 1, b.childNodes.length, false, '选中结束位置为自闭合元素-2');

    range.setStart(i.firstChild, 2).setEnd(div, 2);
    equal(ua.getHTML(range.cloneContents()), '<b><i id="ii">text</i><img></b>xxx');
    ua.checkResult(range, i.firstChild, div, 2, 2, false, '选中结束位置为自闭合元素-3');

    div.innerHTML = 'xxx<b>xxxx<i id="ii">i_Text</i><img/></b>xxx';
    var i_text = document.getElementById('ii').firstChild;
    range.setStart(div, 0).setEnd(i_text, 2);
    equals(ua.getHTML(range.cloneContents()), 'xxx<b>xxxx<i id="ii">i_</i></b>');
    ua.checkResult(range, div, i_text, 0, 2, false, '选中结束位置为自闭合元素-4');
});

test('deleteContents--删除空', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p>p_text</p>';
    var p_text = div.firstChild.firstChild;
    range.setStart(p_text, 2).setEnd(p_text, 2);
    range.deleteContents();
    ua.checkResult(range, p_text, p_text, 2, 2, true, '删除空');
    equal(ua.getHTML(div), '<div id="test"><p>p_text</p></div>', 'div的innerHTML没有改变 ');
});

test('deleteContents--删除相邻节点之间的内容', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);
    var two = document.getElementById('two');
    var last = document.getElementById('last');
    r.setStart(two, 1).setEnd(last, 2);
    r.deleteContents();
    ua.checkSameHtml(ua.getHTML(div), '<div id="test"><p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr></tbody></table><p id="last"></p></div>');

    ua.checkResult(r, div, div, 4, 4, true, '删除相邻节点的内容');
});


test('deleteContents--删除子节点', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);

    r.setStart(div, 0).setEnd(div, 2);
    r.deleteContents();
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');

    ua.checkResult(r, div, div, 0, 0, true, '删除子节点的内容');
});


test('deleteContents--删除同一文本节点内容', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);
    var p = div.firstChild;
    var strong_text = document.getElementById('strong').firstChild;
    r.setStart(strong_text, 0).setEnd(strong_text, 2);
    r.deleteContents();
    equals(ua.getHTML(r.startContainer), 'rong');

    ua.checkSameHtml(ua.getHTML(div), '<div id="test"><p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">rong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, strong_text, strong_text, 0, 0, true, '删除子节点的内容');
});

test('deleteContents--startContainer是endContainer父亲', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    r.setStart(div, 0);
    r.setEnd(document.getElementById('traverse'), 2);
    r.deleteContents();
    ua.checkSameHtml(ua.getHTML(div), '<div id="test"><p id="traverse">more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 0, 0, true, 'startContainer是endContainer父亲');
});

test('deleteContents--startContainer和endContainer为不同文本节点', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);
    var first = document.getElementById('first');
    r.setStart(first.firstChild, 1).setEnd(first.lastChild, 4);
    var p = div.firstChild;
    r.deleteContents();
    equals(ua.getHTML(r.startContainer), '<p id="first">fong.</p>');
    ua.checkResult(r, p, p, 1, 1, true, 'startContainer和endContainer为文本节点内容');
    ua.checkSameHtml(ua.getHTML(div), '<div id="test"><p id="first">fong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');
    equals(ua.getHTML(r.endContainer), '<p id="first">fong.</p>');
});


test('deleteContents--startContainer是endContainer后代', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);
    var em = document.getElementById('em');
    r.setStart(em, 1).setEnd(div, 3);
    r.deleteContents();
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em></p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 1, 1, true, 'startContainer是endContainer后代');
});

test('deleteContents--startContainer是文本，endContainer的nodeType=1', function () {
    var div = te.dom[2];
    var html = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    div.innerHTML = html;
    var r = new baidu.editor.dom.Range(document);
    var em = document.getElementById('em').firstChild;
    var two = document.getElementById('two');
    r.setStart(em, 1).setEnd(two, 0);
    r.deleteContents();
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">e</em></p><table id=\"table\" width=\"300\"><tbody><tr><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 1, 1, true, 'startContainer是文本，endContainer的nodeType=1');
});


/*startContainer和endContainer为文本节点，补全后面</b></tr>之类的标签*/
test('extractContents--补全后面的标签', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first').firstChild;
    var two = document.getElementById('two').firstChild;
    r.setStart(first, 1).setEnd(two, 2);
    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<p id="first">irst<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">ab</td></tr></tbody></table>');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\">f</p><table id=\"table\" width=\"300\"><tbody><tr><td id=\"two\">c</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 1, 1, true, 'startContainer--补全后面的标签');
});

/*startContainer和endContainer为文本节点，层级各不相同，补全前面 的<b><tr>之类的标签*/
test('extractContents--补全前面的标签', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var last = document.getElementById('last').firstChild;
    var two = document.getElementById('two').firstChild;
    r.setStart(two, 1).setEnd(last, 2);
    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<table id="table" width="300"><tbody><tr><td id="two">bc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">te</p>');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">a</td></tr></tbody></table><p id=\"last\">xtabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 4, 4, true, 'startContainer--补全前面的标签');
});

/*startContainer和endContainer为文本节点，为兄弟节点*/
test('extractContents--切的部分为兄弟节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');

    r.setStart(first.firstChild, 1).setEnd(first.lastChild, 4);
    /*strong前面有空格*/
    ua.checkSameHtml(ua.getHTML(r.extractContents()), 'irst<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> str');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<p id=\"first\">fong.</p>', 'check startContainer html');
    ua.checkResult(r, first, first, 1, 1, true, 'startContainer--startContainer和endContainer为兄弟节点');
});


test('extractContents--切同一个文本节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first').firstChild;

    r.setStart(first, 1).setEnd(first, 4);
    equals(ua.getHTML(r.extractContents()), 'irs');
    equal(ua.getHTML(r.startContainer), 'ft');
    ua.checkResult(r, first, first, 1, 1, true, 'startContainer--切同一个文本节点');
});

/*startContainer和endContainer的nodeType=1*/
test('extractContents--startContainer和endContainer为非文本节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');
    var last = document.getElementById('last');
    r.setStart(first, 0).setEnd(last, 0);
    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\"></p>');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\"></p><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 1, 1, true, 'cloneContents--开始和结束位置都是文本');

    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    first = document.getElementById('first');
    last = document.getElementById('last');
    r.setStart(first, 2).setEnd(last, 1);
    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<p id="first"> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc</p>', '检查得到的contents');

    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"first\">first<!--not--></p><p id=\"last\"><span>span</span></p></div>', '检查切除后');
    ua.checkResult(r, div, div, 1, 1, true, 'extractContents--开始位置有注释');
});


test('extractContents--完整切掉一个节点', function () {
    var div = te.dom[2];
    var r = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first');
    r.setStart(div, 0).setEnd(div, div.childNodes.length - 1);
    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em>more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table>');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id=\"last\">textabc<span>span</span></p></div>');
    ua.checkResult(r, div, div, 0, 0, true, 'extractContents--完整切掉一个节点');
});

test('extractContents--元素闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p>p_text</p>';
    var text = div.firstChild.firstChild;
    range.setStart(text, 1).setEnd(text, 1);
    equals(ua.getHTML(range.extractContents()), 'null', '元素闭合直接返回null');
    equal(ua.getHTML(range.startContainer), 'p_text');
    ua.checkResult(range, text, text, 1, 1, true, 'extractContents--startContainer的nodeType=1，endContainer为em');
    var p = div.firstChild;
    range.setStart(p, 1).setEnd(p, 1);
    equals(ua.getHTML(range.extractContents()), 'null', '元素闭合直接返回null');
    equal(ua.getHTML(range.startContainer), '<p>p_text</p>');
    ua.checkResult(range, p, p, 1, 1, true, 'extractContents--startContainer的nodeType=1，endContainer为em');
});


test('extractContents--自闭合元素', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    var inner = '<b>b_text<i id="ii">i_text</i><img /></b>xxx';
    div.innerHTML = inner;
    var b = div.firstChild;

    div.innerHTML = inner;
    b = div.firstChild;
    range.setStart(b.firstChild, 2).setEnd(b, b.childNodes.length);
    /*只能获得<img>而不是<img  />的标签*/
    equal(ua.getHTML(range.extractContents()), 'text<i id="ii">i_text</i><img>', '获取带有<img>的内容');
    equal(ua.getHTML(range.startContainer), '<b>b_</b>', '检查切除元素后');
    ua.checkResult(range, b, b, 1, 1, true, '选中结束位置为自闭合元素');
});

test('extractContents', function () {
    function trans(range) {
        return {
            startContainer:range.startContainer.id,
            startOffset:range.startOffset,
            endContainer:range.endContainer.id,
            endOffset:range.endOffset
        };
    }

    var div = te.dom[2];

    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var r = range;

    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';

    r.setStart(document.getElementById('test'), 0);
    r.setEnd(document.getElementById('traverse'), 2);

    ua.checkSameHtml(ua.getHTML(r.extractContents()), '<p id="first">first<!--not--> strong <!-- --><strong id="strong">strong</strong> second <em id="em">em</em> strong.</p><p id="second">bar</p><p id="traverse"><b><em id="em">some text</em></b><em>em text</em></p>');
    ua.checkSameHtml(ua.getHTML(r.startContainer), '<div id="test"><p id="traverse">more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');
    equals(r.startOffset, 0);
    equals(r.endContainer.nodeType, 1);
    equals(r.endOffset, 0);
    ua.checkSameHtml(ua.getHTML(r.endContainer), '<div id="test"><p id="traverse">more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');
    ua.checkSameHtml(ua.getHTML(document.getElementById('test')), '<div id="test"><p id="traverse">more text</p><table id="table" width="300"><tbody><tr><td>1</td><td id="two">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id="last">textabc<span>span</span></p></div>');
    equals(r.collapsed, true);
});

/*只要邻居节点不是块元素就左扩或右扩*/
test('enlarge--文本节点左边扩到body', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<div>div_text</div></p>';
    var first = document.getElementById('first').firstChild;
    var last = document.getElementById('last').firstChild;
    range.setStart(first, 1).setEnd(last, 2);
    range.enlarge(true);
    /*左边的文本节点是左边第一个节点，所以一直左扩直到body，右边的文本节点右边有兄弟，因此只扩到第一个块元素祖先*/
    ua.checkResult(range, document.body, div, ua.getIndex(div), 5, false, '左边扩到body');

});

test('enlarge--文本节点右边扩到body', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<div id=\"first\"><p>xxx</p>first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</div><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var strong = document.getElementById('strong').firstChild;
    var span = document.getElementById('last').lastChild.firstChild;
    range.setStart(strong, 1).setEnd(span, 2);
    range.enlarge(true);
    /*右边的文本节点是右边最后一个节点，所以一直右扩直到body，左边的文本节点左边边有块元素兄弟，因此只扩到第一个块元素祖先*/
    ua.checkResult(range, div.firstChild, document.body, 1, ua.getIndex(div) + 1, false, '右边扩到body');

});

test('enlarge--文本节点左右边扩到body', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var first = document.getElementById('first').firstChild;
    var span = document.getElementById('last').lastChild.firstChild;
    range.setStart(first, 1).setEnd(span, 2);
    range.enlarge(true);
    /*右边的文本节点是右边最后一个节点，所以一直右扩直到body，左边的文本节点是左边第一个节点，所以一直左扩直到body*/
    ua.checkResult(range, document.body, document.body, ua.getIndex(div), ua.getIndex(div) + 1, false, '左右边扩到body');

});

test('enlarge--startContainer和endContainer的nodeType为1', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong<strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    range.setStart(div, 0).setEnd(div, 2);
    range.enlarge(true);
    ua.checkResult(range, document.body, div, ua.getIndex(div), 2, false, '左边扩到块元素父节点，右边扩到body');

});

test('enlarge--左边非块元素节点', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var strong = document.getElementById('strong');
    var table = div.getElementsByTagName('table')[0];
    range.setStart(strong, 0).setEnd(table, 1);
    range.enlarge(true);
    ua.checkResult(range, document.body, div, ua.getIndex(div), 4, false, '左边扩到块元素父节点，右边扩到父节点');

});

test('enlarge--左右属于同一非块元素节点', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var strong = document.getElementById('strong');
    range.setStart(strong, 0).setEnd(strong, 1);
    range.enlarge(true);
    ua.checkResult(range, document.body, div, ua.getIndex(div), 1, false, '左边扩到body');

    /*文本节点*/
    var strong_text = strong.firstChild;
    range.setStart(strong_text, 2).setEnd(strong_text, 3);
    range.enlarge(true);
    ua.checkResult(range, document.body, div, ua.getIndex(div), 1, false, '左右均扩到第一个块元素祖先节点');
});

test('enlarge--isBlock为null', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xx<b><i>xxxx</i>xxxxxxx</b>';

    range.selectNodeContents(div.getElementsByTagName('i')[0]);
    range.enlarge();
    ua.checkResult(range, div, div.lastChild, 1, 1, false, 'isBlock为null');

});

test('enlarge--stopFn', function () {
    var div = te.dom[2];
    var stopFn = function (container) {
        if (container.tagName.toLowerCase() == 'table')
            return true;
        return false;
    };
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p id=\"first\">first<!--not--> strong <!-- --><strong id=\"strong\">strong</strong> second <em id=\"em\">em</em> strong.</p><p id=\"second\">bar</p><p id=\"traverse\"><b><em id=\"em\">some text</em></b><em>em text</em>more text</p><table id=\"table\" width=\"300\"><tbody><tr><td>1</td><td id=\"two\">abc</td></tr><tr><td>3</td><td>4</td></tr></tbody></table><p id=\"last\">textabc<span>span</span></p>';
    var strong = document.getElementById('strong');
    var table = div.getElementsByTagName('table')[0];
    range.setStart(strong, 0).setEnd(table, 1);
    range.enlarge(true, stopFn);
    ua.checkResult(range, document.body, table, ua.getIndex(div), 1, false, '左边扩到块元素父节点，右边不扩（stopFn为false）');

});


//test( 'enlarge--闭合特殊情况，有歧义', function() {
//    var div = te.dom[2];
//    var range = new baidu.editor.dom.Range( document );
//    div.innerHTML = '<p>p_text</p>';
//    var p = div.firstChild;
//    range.setStart( p.firstChild, 0 ).setEnd( p.firstChild, 3 ).trimBoundary();
//    range.setStart( p, 1 ).setEnd( p, 1 );
//    range.enlarge( true );
//
//    //TODO
//} );

test('enlarge--闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxx<p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx';
    range.setStart(div.getElementsByTagName('b')[0], 2).collapse(true);

    range.enlarge(true);
    ua.checkResult(range, div, div, 2, 6, false, "初始为闭合，文本父节点为非块元素");

    div.innerHTML = '<div></div>xxxx<div></div>';
    range.setStart(div.firstChild.nextSibling, 2).collapse(true)
    range.enlarge(true);
    ua.checkResult(range, div, div, 1, 2, false, "初始为闭合,文本父节点为块元素");
});


test('insertNode--文本中插入', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text1<p>p_text</p>xxx<em>em_text</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>text2_div';
    var p_text = div.firstChild.nextSibling.firstChild;
    range.setStart(p_text, 1).setEnd(p_text, 2);
    /*插入块元素*/
    var new_div = document.createElement('div');
    range.insertNode(new_div);

    ua.checkResult(range, p_text.parentNode, new_div.nextSibling, 1, 1, false, '插入div');

    /*插入文本节点，原来闭合*/
    var em_text = div.getElementsByTagName('em')[0].firstChild;
    range.setStart(em_text, 0).setEnd(em_text, 0);
    range.insertNode(document.createTextNode('new_text'));
    ua.checkResult(range, em_text.parentNode, em_text.parentNode, 0, 1, false, '闭合情况下插入文本');
    /*插入inline元素*/
    range.setStart(div.firstChild, 1).setEnd(div.lastChild, 1);
    range.insertNode(document.createElement('i'));
    ua.checkResult(range, div, div.lastChild, 1, 1, false, '插入inline元素');
});

test('inserNode--块元素中插入', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text1<p>p_text</p>xxx<em>em_text</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>text2_div';
//	var p_text = div.firstChild.nextSibling.firstChild;
    range.setStart(div, 1).setEnd(div.lastChild, 2);
    /*插入块元素*/
    var new_div = document.createElement('div');
    range.insertNode(new_div);

    ua.checkResult(range, div, div.lastChild, 1, 2, false, '插入div');

});

test('insertNode--插入的节点为endContainer孩子', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxx<p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx';
    var length = div.childNodes.length;
    range.setStart(div, 1).setEnd(div, length);
    var new_div = document.createElement('div');
    new_div.innerHTML = 'xxxx<div>div_text<span></span></div><i>i_text</i><img /><em>em_text</em>xxxx';
    range.insertNode(new_div);
    ua.checkResult(range, div, div, 1, length + 1, false, '插入节点为endContainer的孩子');
    equal(ua.getHTML(div), '<div id="test">xxx<div>xxxx<div>div_text<span></span></div><i>i_text</i><img><em>em_text</em>xxxx</div><p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx</div>')
});

test('insertNode--插入的fragment为endContainer孩子', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    var frag = document.createDocumentFragment();

    div.innerHTML = 'xxx<p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx';
    var length = div.childNodes.length;
    range.setStart(div, 1).setEnd(div, div.childNodes.length);
    var new_div = document.createElement('div');
    frag.appendChild(new_div);
    frag.appendChild(document.createTextNode('text'));
    frag.appendChild(document.createElement('span'));
    range.insertNode(frag);
    ua.checkResult(range, div, div, 1, length + 3, false, '插入fragment为endContainer的孩子');
    equal(ua.getHTML(div), '<div id="test">xxx<div></div>text<span></span><p>xxxxx</p>xxx<em>xxx</em>xxxxxxx<b>xxxx|xxx</b><p>bbbbb</p>xx</div>', '比较innerHTML');
});

test('createBookmark/moveToBookmark--元素不闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p>';
    var bookmark = range.selectNode(div).createBookmark();
    ua.checkResult(range, document.body, document.body, ua.getIndex(div), ua.getIndex(div) + 1, false, "元素不闭合,创建书签");
    ok(/_baidu_bookmark_start_/.test(div.previousSibling.id), '检查div的前一个兄弟');
    ok(/_baidu_bookmark_end_/.test(div.nextSibling.id), '检查div的后一个兄弟');
    /*moveToBookmark*/
    range.moveToBookmark(bookmark);
    ua.checkResult(range, document.body, document.body, ua.getIndex(div), ua.getIndex(div) + 1, false, "元素不闭合，删除书签");
    ok(!/_baidu_bookmark_start_/.test(div.previousSibling.id), '检查div的前面书签是否被删除');

    range.setStart(div, 2).setEnd(div, 3);
    var bookmark = range.createBookmark(true);
    ua.checkResult(range, div, div, 3, 4, false, "元素不闭合，插入span");
    var preId = document.getElementById('span').previousSibling.id;
    var latterId = document.getElementById('span').nextSibling.id;
    var reg = /_baidu_bookmark_start_/;
    ok(/_baidu_bookmark_start_/.test(preId), '检查前面span的id');
    ok(/_baidu_bookmark_end_/.test(latterId), '检查后面span的id');
    checkBookmark(bookmark, preId, latterId, true);

    range.moveToBookmark(bookmark);
    ua.checkResult(range, div, div, 2, 3, false, 'moveToBookmark');
    equal(ua.getHTML(div), '<div id="test">first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p></div>');

});

test('createBookmark/moveToBookmark--span嵌套', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em>em_text</em>p_text</p>';
    var span = document.getElementById('span');
    range.setStart(span, 0).setEnd(span, 1);
    var bookmark = range.createBookmark();
    var pre = span.firstChild;
    var latter = span.lastChild;
    ua.checkResult(range, span, span, 1, 2, false, 'span嵌套');
    ok(/_baidu_bookmark_start_/.test(pre.id), '检查前面span的id');
    ok(/_baidu_bookmark_end_/.test(latter.id), '检查后面span的id');
    checkBookmark(bookmark, pre, latter, undefined);
});

test('createBookmark/moveToBookmark--元素闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'first_text<b><i>i_text</i>xxxxxxx</b><span id="span">span_text</span><p id="second"><em id="em">em_text</em>p_text</p>';
    var em_text = document.getElementById('em').firstChild;
    var em = em_text.parentNode;
    range.setStart(em_text, 1).setEnd(em_text, 1);
    var bookmark = range.createBookmark(true, true);
    ua.checkResult(range, em, em, 2, 2, true, '元素闭合');
    var pre = em.firstChild.nextSibling;
    checkBookmark(bookmark, pre.id, null, true);
    equal('_baidu_bookmark_start_', pre.id, '检查前面span的id');

});


test('getClosedNode', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxx<span>xxx</span><img />xxxx';
    range.setStart(div, 2).setEnd(div, 3);
    same(range.getClosedNode(), div.lastChild.previousSibling, 'check result is img');

    range.setStart(div, 2).collapse(true);
    equal(range.getClosedNode(), null, 'check null return result');

    range.setStart(div, 0).setEnd(div, 1);
    equal(range.getClosedNode(), null, 'get null result');

});

test('applyInlineStyle--strong', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text';
    range.setStart(div, 0).setEnd(div, 1);

    range.applyInlineStyle('strong');
    equals(ua.getHTML(div), '<div id="test"><strong>div_text</strong></div>');
});

test('applyInlineStyle--双重strong', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text';

    div.innerHTML = 'div_text<strong>strong_text</strong>';
    range.setStart(div.firstChild, 3);
    range.setEnd(div.firstChild.nextSibling.firstChild, 3);

    range.applyInlineStyle('strong');
    equals(ua.getHTML(div), '<div id="test">div<strong>_textstrong_text</strong></div>', '同一个块元素父标签双重加粗');

    div.innerHTML = 'xx<p>xx<strong>bbbb</strong>xxx</p>xx<p><strong>aaaaaaa</strong></p>';
    range.setStartBefore(div.firstChild.nextSibling.firstChild);
    range.setEndAfter(div.lastChild.firstChild.firstChild);

    range.applyInlineStyle('strong');
    equals(ua.getHTML(div), '<div id="test">xx<p><strong>xxbbbbxxx</strong></p><strong>xx</strong><p><strong>aaaaaaa</strong></p></div>', '跨块元素的加粗');
});

test('applyInlineStyle--span放在em外面', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<div><em>div_text</em></div>';
    range.setStart(div, 0).setEnd(div, 1);
    range.applyInlineStyle('span', {style:'font-size:12px'});
    var span = div.firstChild.firstChild;
    equal($(span.firstChild).css('font-size'), '12px', 'check style');
});

test('applyInlineStyle--span', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text';
    range.setStart(div, 0).setEnd(div, 1);
    range.applyInlineStyle('span', {style:'font-size:12px'});
    var span = div.firstChild;
    equal($(span).css('font-size'), '12px', 'check style');
    equal(span.firstChild.data, 'div_text', 'check innerHTML');
});

test('applyInlineStyle--span元素闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'div_text';
    range.setStart(div, 0).setEnd(div, 0);
    range.applyInlineStyle('span', {style:'font-size:12px'});
    equal(ua.getHTML(div), '<div id="test">div_text</div>');
});

//TODO
test('applyInlineStyle-双重span', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);

    div.innerHTML = '<span style="font-size:12px">div_text</span>';
    var span = div.firstChild;
    range.setStart(span.firstChild, 0).setEnd(span.firstChild, 4);
    range.applyInlineStyle('span', {style:'color:red'});

    var div_new = document.createElement('div');
    div_new.id = 'test';
    //1.2.6.1开启span套 span，调整
//    div_new.innerHTML = '<span style="font-size: 12px"><span style="color: red; font-size: 12px">div_</span>text</span>';
    div_new.innerHTML = '<span style="font-size: 12px; color: red;">div_</span><span style="font-size:12px">text</span>';
    ok(ua.haveSameAllChildAttribs(div, div_new), 'check style');
});


test('applyInlineStyle--b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<ul><li>li_text</li><li>bbbb</li></ul>';
    var li_text = div.firstChild.firstChild;
    range.setStart(li_text, 0).setEnd(div, 1);
    range.applyInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><ul><li><b>li_text</b></li><li><b>bbbb</b></li></ul></div>');

    div.innerHTML = '<ul><li>li_text</li><li>bbbb</li></ul>';
    li_text = div.firstChild.firstChild.firstChild;
    range.setStart(li_text, 1).setEnd(li_text, 3);
    range.applyInlineStyle('b');
    equal(ua.getHTML(div), '<div id="test"><ul><li>l<b>i_</b>text</li><li>bbbb</li></ul></div>');

});

test('applyInlineStyle-b元素闭合', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<ul><li>li_text</li><li>bbbb</li></ul>';
    var li_text = div.firstChild.firstChild;
    range.setStart(li_text, 1).setEnd(li_text, 1);
    range.applyInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><ul><li>li_text</li><li>bbbb</li></ul></div>');

});

test('applyInlineStyle-b有属性', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p>1234</p>';
    range.setStart(div, 0).setEnd(div.firstChild, 4);
    range.applyInlineStyle('b', {title:'b_title', id:'b_id'});
    var b = div.firstChild.firstChild;
    same(b, document.getElementById('b_id'), '插入带有属性的b');
    equal($(b).attr('title'), 'b_title', 'check title');
    equal(b.innerHTML, '1234', 'check innerHTML');
    equal(div.childNodes.length, 1, 'check child count');
});

test('applyInlineStyle--b放在Inline元素外面', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p><em>1234</em>5678<span>9</span></p><p><em>1234</em>5678<span>9</span></p>';

    range.setStart(div, 0).setEnd(div, 2);
    range.applyInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><p><b><em>1234</em>5678<span>9</span></b></p><p><b><em>1234</em>5678<span>9</span></b></p></div>', 'Inline element on multiple selected elements with various childnodes');

    div.innerHTML = '<p>x<em><span id="span">1234</span></em>y</p>';
    var span = document.getElementById('span');
    range.setStart(span.firstChild, 0).setEnd(span.firstChild, 4);
    range.applyInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><p>x<b><em><span id="span">1234</span></em></b>y</p></div>', '多个嵌套Inline element');
});

test('applyInlinestyle--b没有文字', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<table><tr><td><br/></td></tr><tr><td><br/></td></tr><tr><td><br/></td></tr></table>';
    range.setStart(div, 0).setEnd(div, 1);
    range.applyInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><table><tbody><tr><td><br></td></tr><tr><td><br></td></tr><tr><td><br></td></tr></tbody></table></div>', '空表格');
    ua.checkResult(range, div, div, 0, 1, false, '对空表格进行b');
    //todo ie6下不知道为啥strong用不上去
//    div.innerHTML = '';
//    var ie6 = (baidu.editor.browser.ie == 6);
//    if ( ie6 ) {
//        div.appendChild( document.createTextNode( '\u200B' ) );
//        div.appendChild( document.createTextNode( '\u200B' ) );
//    }
//    else {
//        div.appendChild( document.createTextNode( '\ufeff' ) );
//        div.appendChild( document.createTextNode( '\ufeff' ) );
//    }
//    range.setStart(div,0).setEnd( div, 1 );
//    range.applyInlineStyle( 'strong' );
//    equals( div.getElementsByTagName( 'strong' ).length, 1 );
//    if ( ie6 )
//        equal( div.innerHTML.toLowerCase(), '<strong>\u200B</strong>\u200B', 'div has no text' );
//    else
//        equal( div.innerHTML.toLowerCase(), '<strong>\ufeff</strong>\ufeff', 'div has no text' );
});

test('applyInlineStyle-双重b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<p><b>b_text</b></p>';
    var b_text = div.firstChild.firstChild.firstChild;
    range.setStart(b_text, 1).setEnd(b_text, 2);
    range.applyInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<p><b>b_text</b></p>', '文本双重b');


    div.innerHTML = '<p><b>a<em>1234</em>b</b></p>';
    range.setStart(div.getElementsByTagName('em')[0].firstChild, 0);
    range.setEnd(div.getElementsByTagName('em')[0].firstChild, 4);

    range.applyInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<p><b>a<em>1234</em>b</b></p>', '双重b+多个inline元素');

    // Inline element merged with parent and child
    div.innerHTML = '<p>a<b>12<b>34</b>56</b>b</p>';

    range.setStart(div.getElementsByTagName('b')[0].firstChild, 1);
    range.setEnd(div.getElementsByTagName('b')[0].lastChild, 1);
    range.applyInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<p>a<b>123456</b>b</p>', '去掉嵌套的b');
});

test('applyInlineStyle--多个style', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxxx';
    range.setStart(div, 0).setEnd(div, 1);

    range.applyInlineStyle('i').applyInlineStyle('span', {style:'color:red'}).applyInlineStyle('span', {style:'font-size:12px'});
    //1.2.6.1 span能套i
//    var span = div.firstChild.firstChild;
    var span = div.firstChild;
    equal(span.style['color'], 'red', 'check color');
    equal($(span).css('font-size'), '12px', 'check font size');
    //1.2.6.1 span能套i
    equal(span.innerHTML.toLowerCase(), '<i>xxxx</i>', 'check innerHTML including u');

});

test('applyInlineStyle--MergeToParent', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '1<strong style="font-size: 24px; ">23456</strong>8910';
    range.setStart(div.firstChild, 0).setEnd(div.childNodes[1], 1).select();
    range.applyInlineStyle('strong', {style:'font-size:24px'});
    var html = '<strong style="font-size: 24px;">123456</strong>8910';
    ua.checkSameHtml(div.innerHTML, html);
});
test('trace1583:applyInlineStyle--MergeToChild', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<span style="font-size: 24px; ">​123<span style="font-size: 16px; ">45678</span>9</span>';

    var span = div.getElementsByTagName('span')[1];
    range.setStart(span.firstChild, 2).setEnd(span.firstChild, 4).select();
    range.applyInlineStyle('span', {style:'font-size:24px'});
    var html = '<span style="font-size:24px">123<span style="font-size:16px">45<span style="font-size: 24px; ">67</span>8</span>9</span>';
    ua.checkHTMLSameStyle(html, document, div, 'MergeToChild');
});

test('applyInlineStyle--选区包含部分兄弟', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxxx<span>span_text</span>';
    range.setStart(div, 0).setEnd(div.firstChild.nextSibling, 0);
    range.applyInlineStyle('u');
    equal(div.innerHTML.toLowerCase(), '<u>xxxx</u><span>span_text</span>', 'check innerHTML including u');

});

test('removeInlineStyle--删除父节点b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = '<b>xxxx</b>';
    range.setStart(div, 0).setEnd(div, 1);
    range.removeInlineStyle('b');
    equals(div.innerHTML, 'xxxx', '删除b');
});

test('removeInlineStyle--删除祖先b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "<b><i>xxxx</i></b>";
    var i = div.firstChild.firstChild;
    range.setStart(i, 0).setEnd(i, 1);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<i>xxxx</i>');
    ua.checkResult(range, div, div, 0, 1, false, '删除祖先b');
});

test('removeInlineStyle--删除部分b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "<b><i>i_text</i></b><span>span_text</span>";
    var b = div.firstChild;
    range.setStart(b, 0).setEnd(b.firstChild.firstChild, 3);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<i>i_t</i><b><i>ext</i></b><span>span_text</span>', '检查html');
    ua.checkResult(range, div, div, 0, 1, false, '删除部分b');
});


test('removeInlineStyle--删除多个b', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "<table><tr><td>&nbsp;</td><td><table><tr><td><b>xxxxxx</b></td></tr></table></td><td><b>xxxxxx</b></td></tr></table>";
    range.setStart(div, 0).setEnd(div, 1);
    range.removeInlineStyle('b');
    equals(ua.getHTML(div), '<div id="test"><table><tbody><tr><td>&nbsp;</td><td><table><tbody><tr><td>xxxxxx</td></tr></tbody></table></td><td>xxxxxx</td></tr></tbody></table></div>');

    div.innerHTML = '<b><i>xxxxx</i></b><i>bb</i><b>bbb</b>b<b><i>ccccc</i></b>';
    range.setStart(div.getElementsByTagName('b')[0], 0);
    range.setEndAfter(div.getElementsByTagName('b')[2].firstChild);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<i>xxxxx</i><i>bb</i>bbbb<i>ccccc</i>');

});

test('removeInlineStyle--删除不同层文本的样式', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "xxx<b>b_text</b><span><b>b2_text</b></span>";
    range.setStart(div, 0).setEnd(div, 1);
    var b1 = div.firstChild.nextSibling;
    var b2 = b1.nextSibling.firstChild;
    range.setStart(b1.firstChild, 2).setEnd(b2.firstChild, 2);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), 'xxx<b>b_</b>text<span>b2<b>_text</b></span>');

    ua.checkResult(range, div, div.lastChild, 2, 1, false, 'check startContainer等');
});

test('removeInlineStyle--删除部分文本样式，需要切分文本节点', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = 'xxx<b><i id="i"><u>u_text</u></i></b>';
    range.setStart(div.firstChild, 2).setEnd(div.getElementsByTagName('u')[0].firstChild, 2);
    range.removeInlineStyle('u');
    equals(ua.getHTML(div), '<div id="test">xxx<b><i id="i">u_<u>text</u></i></b></div>', 'u为父亲节点');
    ua.checkResult(range, div, document.getElementById('i'), 1, 1, false, '检查startOffset等');

    div.innerHTML = 'xxx<b><i><u id="u">u_text</u></i></b>';
    range.setStart(div.firstChild, 2).setEnd(div.getElementsByTagName('u')[0].firstChild, 2);
    range.removeInlineStyle('i');
    /*不能避免产生相同id元素。。。*/
    equals(ua.getHTML(div), '<div id="test">xxx<b><u id="u">u_</u><i><u id="u">text</u></i></b></div>', 'i为祖先节点');
    ua.checkResult(range, div, div.getElementsByTagName('b')[0], 1, 1, false, '');

    div.innerHTML = "<b><i><u>xxxx</u></i></b>bbbbb<b><i><u>xxxx</u></i></b>";
    range.setStart(div.getElementsByTagName('u')[0].firstChild, 2).setEnd(div.getElementsByTagName('u')[1].firstChild, 2);
    range.removeInlineStyle('u');
    equals(div.innerHTML.toLowerCase(), '<b><i><u>xx</u>xx</i></b>bbbbb<b><i>xx<u>xx</u></i></b>', '开始和结束位置都有u');

    div.innerHTML = "<b><i><u>xxxx</u></i></b>bbbbb<b><i><u>xxxx</u></i></b>";
    range.setStart(div.getElementsByTagName('u')[0].firstChild, 2).setEnd(div.getElementsByTagName('u')[1].firstChild, 2);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<b><i><u>xx</u></i></b><i><u>xx</u></i>bbbbb<i><u>xx</u></i><b><i><u>xx</u></i></b>', '删除部分文本节点的祖先节点的样式');
    ua.checkResult(range, div, div, 1, 4, false, '删除部分节点的祖先样式后');

});

/*闭合情况挪到basestyle中去做了，在这里不做任何处理*/
test('removeInlineStyle--删除闭合元素的样式', function () {
    var div = te.dom[2];
    var range = new baidu.editor.dom.Range(document);
    div.innerHTML = "<b><i>b_text</i></b>";
    range.setStart(div.firstChild.firstChild.firstChild, 2).collapse(true);
    range.removeInlineStyle('b');
    equals(div.innerHTML.toLowerCase(), '<b><i>b_text</i></b>');
});


test('b节点取range', function () {
    var div = te.dom[2];
    var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
    stop();
    editor.render(div);
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent('<p>hello<strong>hello1</strong>hello2</p>');
        range.setStart(editor.body.firstChild.lastChild, 0).collapse(1).select();
        range = editor.selection.getRange();
        if ((ua.browser.ie &&ua.browser.ie < 9) || ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.lastChild.previousSibling, editor.body.firstChild.lastChild.previousSibling, 1, 1, true, '节点后--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)
            ua.checkResult(range, editor.body.firstChild, editor.body.firstChild, 3, 3, true, '节点后--check range');
        else
            ua.checkResult(range, editor.body.firstChild.lastChild.previousSibling, editor.body.firstChild.lastChild.previousSibling, 0, 0, true, '节点后--check range');

        range.setStart(editor.body.firstChild.firstChild.nextSibling, 0).collapse(1);
        range.select();
        range = editor.selection.getRange();
        if (ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.firstChild.nextSibling.firstChild, editor.body.firstChild.firstChild.nextSibling.firstChild, 1, 1, true, '节点内文本节点前--check range');
        else if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].childNodes[1], editor.body.firstChild.childNodes[1].childNodes[1], 0, 0, true, '节点内文本节点前--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)
            ua.checkResult(range, editor.body.firstChild.childNodes[1], editor.body.firstChild.childNodes[1], 1, 1, true, '节点后--check range');
        else
            ua.checkResult(range, editor.body.firstChild.firstChild.nextSibling.firstChild, editor.body.firstChild.firstChild.nextSibling.firstChild, 0, 0, true, '节点内文本节点前--check range');

        range.setStart(editor.body.firstChild.childNodes[1], 0).collapse(1).select();
        range = editor.selection.getRange();
        if (ua.browser.webkit)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].firstChild, editor.body.firstChild.childNodes[1].firstChild, 1, 1, true, 'b节点--check range');
        else if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.childNodes[1].childNodes[1], editor.body.firstChild.childNodes[1].childNodes[1], 0, 0, true, '节点内文本节点前--check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)
            ua.checkResult(range, editor.body.firstChild.childNodes[1], editor.body.firstChild.childNodes[1], 1, 1, true, '节点后--check range');
        else
            ua.checkResult(range, editor.body.firstChild.childNodes[1].firstChild, editor.body.firstChild.childNodes[1].firstChild, 0, 0, true, 'b节点--check range');
        start();
    });
});

test('文本节点中间取range', function () {
    var div = te.dom[2];
    var editor = new baidu.editor.Editor({'autoFloatEnabled':false});
    stop();
    editor.render(div);
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.setContent('<p>hello2</p>');
        range.setStart(editor.body.firstChild.firstChild, 2).collapse(1).select();
        range = editor.selection.getRange();
        if (ua.browser.ie&&ua.browser.ie < 9)
            ua.checkResult(range, editor.body.firstChild.lastChild, editor.body.firstChild.lastChild, 0, 0, true, 'check range');
        else if(ua.browser.ie &&ua.browser.ie > 8)
            ua.checkResult(range, editor.body.firstChild, editor.body.firstChild, 2, 2, true, 'check range');
        else
            ua.checkResult(range, editor.body.firstChild.lastChild, editor.body.firstChild.lastChild, 2, 2, true, 'check range');
        start();
    });
});

//test( 'select--closedNode', function() {
//    var div = te.dom[2];
//    var range = new baidu.editor.dom.Range( document );
//    div.innerHTML = 'div_text<span style="color:red">span_text</span><img />div2_text<em>em_text</em>';
////    range.setStart(div.getElementsBytagName('img'),0).setEnd(div.)
////    var span = div.firstChild.nextSibling;
////    range.setStart(span,1).setEnd(div,4);
////    range.select();
////
////     ua.checkResult(range,span,div,1,4,false,'check range');
////    range.insertNode(document.createTextNode('aa'));
////    var selection = new baidu.editor.dom.Selection( document );
////    var nativeRange = selection.getRange();
//    //TODO
//} );

test('range.createAddress,range.moveAddress', function () {
    function equalRange(rngA, rngB) {
        return rngA.startContainer === rngB.startContainer && rngA.startOffset === rngB.startOffset
            && rngA.endContainer === rngB.endContainer && rngA.endOffset === rngB.endOffset

    }

    var div = te.dom[0];
    var rng = new UE.dom.Range(document);
    div.innerHTML = '<b>xxxx</b>';
    var addr = rng.setStart(div.firstChild, 0).collapse(true).createAddress(true);
    var rng1 = new UE.dom.Range(document);
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa';
    div.appendChild(document.createTextNode('aaa'));
    div.appendChild(document.createTextNode('aaa'));
    addr = rng.setStart(div.lastChild, 0).setEnd(div.lastChild, div.lastChild.nodeValue.length).createAddress();
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1));
    addr = rng.setStart(div.lastChild, 0).setEnd(div.lastChild, div.lastChild.nodeValue.length).createAddress(false, true);
    div.innerHTML = 'aaaaaabbb';
    rng1.moveToAddress(addr);
    equal(rng1.cloneContents().firstChild.nodeValue, 'bbb');
    div.innerHTML = 'aaaaaabbb<b>sss</b>';
    addr = rng.setStartAfter(div.firstChild.nextSibling.firstChild).collapse(true).createAddress(false);
    rng1.moveToAddress(addr);
    ok(equalRange(rng, rng1))
    div.innerHTML = '';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    div.appendChild(document.createTextNode('aaa'));
    addr = rng.setStartAtLast(div).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaa';
    rng1.moveToAddress(addr);
    rng.setStartAtLast(div).collapse(true);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa<b>sss</b>';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    addr = rng.setStartAtLast(div).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaa<b>sss</b>';
    rng1.moveToAddress(addr);
    rng.setStartAtLast(div).collapse(true);
    ok(equalRange(rng, rng1));
    div.innerHTML = 'aaa';
    div.appendChild(document.createTextNode(domUtils.fillChar));
    div.appendChild(document.createTextNode('aaa'));
    //空节点有占位
    addr = rng.setStart(div.firstChild.nextSibling, 0).collapse(true).createAddress(false, true);
    div.innerHTML = 'aaaaaa';
    rng1.moveToAddress(addr);
    rng.setStart(div.firstChild, 3).collapse(true);
    ok(equalRange(rng, rng1));
});

test('equals', function () {
    var div = te.dom[2];
    var rng = new UE.dom.Range(document);
    div.innerHTML = '<b>xxxx</b>';
    rng.setStart(div.firstChild, 0).collapse(true);
    var rng2 = rng.cloneRange();
    ok(rng.equals(rng2))
});