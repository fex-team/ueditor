module("plugins.convertcase");

test('闭合选择', function () {
    stop();

    setTimeout(function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent('<p>hello</p>');
        setTimeout(function () {
            range.setStart(body.firstChild, 1).collapse(true).select();
            editor.execCommand("touppercase");
            equal(editor.getContent(), "<p>hello</p>", "闭合选择--up");
            start();
        }, 50);
    }, 100);
});
test('非闭合选择----字符串全选', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p>');
    setTimeout(function () {
        range.setStart(body.firstChild, 0).setEnd(body.lastChild, 1).select();
        editor.execCommand("touppercase");
        equal(editor.getContent(), "<p>HELLO1</p><p>HELLO2</p>", "非闭合--字符串全选--up");
        editor.execCommand("touppercase");
        equal(editor.getContent(), "<p>HELLO1</p><p>HELLO2</p>", "非闭合--两次up");
        editor.execCommand("tolowercase");
        equal(editor.getContent(), "<p>hello1</p><p>hello2</p>", "非闭合--字符串全选--low");
        editor.execCommand("tolowercase");
        equal(editor.getContent(), "<p>hello1</p><p>hello2</p>", "非闭合---两次low");
        start();
    }, 50);
    stop();
});
test('非闭合选择----子字符串', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>hello1</p><p>hello2</p>');
    setTimeout(function () {
        range.setStart(body.firstChild.firstChild, 2).setEnd(body.lastChild.firstChild, 2).select();
        editor.execCommand("touppercase");
        equal(editor.getContent(), "<p>heLLO1</p><p>HEllo2</p>", "非闭合--子字符串--up");
        editor.execCommand("tolowercase");
        equal(editor.getContent(), "<p>hello1</p><p>hello2</p>", "非闭合--子字符串--low");
        start();
    }, 50);
    stop();
});
test('非闭合选择----字符串包括大写跟小写', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var text = "<p>HEllo1</p><p>heLLo2</p>";
    editor.setContent(text);
    setTimeout(function () {
        range.setStart(body.firstChild.firstChild, 0).setEnd(body.lastChild.firstChild, 6).select();
        editor.execCommand("touppercase");
        equal(editor.getContent(), "<p>HELLO1</p><p>HELLO2</p>", "非闭合--包含大小写--up");
        editor.setContent(text);
        setTimeout(function () {
            range.setStart(body.firstChild.firstChild, 0).setEnd(body.lastChild.firstChild, 6).select();
            editor.execCommand("tolowercase");
            equal(editor.getContent(), "<p>hello1</p><p>hello2</p>", "非闭合--包含大小写--low");
            start();
        }, 50);
    }, 50);
    stop();
});
test('非闭合选择----字符串包括换行跟空格', function () {
    if (ua.browser.ie == 9)return;//TODO 1.2.6
    if (ua.browser.ie == 8)return;//TODO 1.2.6 PUBLICGE-3402
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<p>HEllo1<br/> heLLO2</p>');
    setTimeout(function () {
        range.setStart(body.firstChild.firstChild, 0).setEnd(body.firstChild.lastChild, 6).select();
        editor.execCommand("touppercase");
        equal(editor.getContent(), "<p>HELLO1<br/> HELLO2</p>", "非闭合--包含大小写--up");
        editor.execCommand("tolowercase");
        equal(editor.getContent(), "<p>hello1<br/> hello2</p>", "非闭合--包含大小写--low");
        start();
    }, 50);
    stop();
});
test('标签table', function () {
    //单个单元格，多个单元格，两个表格
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var text = "<table><tr><td>hello1</td><td>hello2</td></tr><tr><td>hello3</td><td>hello4</td></tr></table>";
    editor.setContent(text);
    stop();
    setTimeout(function () {
        var tds = body.firstChild.getElementsByTagName('td');
        range.selectNode(tds[1]).select();
        editor.execCommand("touppercase");
        equal(tds[1].innerHTML, "HELLO2", "table--up");
        editor.execCommand("tolowercase");
        equal(tds[1].innerHTML, "hello2", "table--low");

        range.setStart(tds[1], 0).setEnd(tds[2], 1).select();
        editor.execCommand("touppercase");
        equal(tds[1].innerHTML, "HELLO2", "table--单元格2--up");
        equal(tds[2].innerHTML, "HELLO3", "table--单元格3--up");
        editor.execCommand("tolowercase");
        equal(tds[1].innerHTML, "hello2", "table--单元格2--low");
        equal(tds[2].innerHTML, "hello3", "table--单元格3--low");

        range.setStart(tds[0], 0).setEnd(tds[3], 1).select();
        editor.execCommand("touppercase");
        equal(tds[0].innerHTML, "HELLO1", "table--单元格1--up");
        equal(tds[1].innerHTML, "HELLO2", "table--单元格2--up");
        equal(tds[2].innerHTML, "HELLO3", "table--单元格3--up");
        equal(tds[3].innerHTML, "HELLO4", "table--单元格4--up");
        editor.execCommand("tolowercase");
        equal(tds[0].innerHTML, "hello1", "table--单元格1--low");
        equal(tds[1].innerHTML, "hello2", "table--单元格2--low");
        equal(tds[2].innerHTML, "hello3", "table--单元格3--low");
        equal(tds[3].innerHTML, "hello4", "table--单元格4--low");
        start();
    }, 50);
});

test('标签h1', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    editor.setContent('<h1>hello1</h1><h1>hello2</h1>');
    range.setStart(body.firstChild.firstChild, 2).setEnd(body.lastChild.firstChild, 2).select();
    editor.execCommand("touppercase");
    equal(editor.getContent(), "<h1>heLLO1</h1><h1>HEllo2</h1>", "h1--up");
    editor.execCommand("tolowercase");
    equal(editor.getContent(), "<h1>hello1</h1><h1>hello2</h1>", "h1--low");
});

test('h1&table', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var text = "<h1>hello</h1><table><tbody><tr><td>hello1</td><td>hello2</td></tr><tr><td>hello3</td><td>hello4</td></tr></tbody></table>";
    editor.setContent(text);
    stop();
    setTimeout(function () {
        range.setStart(body.firstChild.firstChild, 0).setEnd(body.lastChild.firstChild.lastChild.lastChild.firstChild, 6).select();
        var tds = body.lastChild.getElementsByTagName('td');
        editor.execCommand("touppercase");
        ok(body.firstChild.tagName == "h1" || body.firstChild.tagName == "H1", "h1标签");
        equal(body.firstChild.innerHTML, "HELLO", "h1--up");
        equal(tds[0].innerHTML, "HELLO1", "table--单元格1--up");
        equal(tds[1].innerHTML, "HELLO2", "table--单元格2--up");
        equal(tds[2].innerHTML, "HELLO3", "table--单元格3--up");
        equal(tds[3].innerHTML, "HELLO4", "table--单元格4--up");
        editor.execCommand("tolowercase");
        ok(body.firstChild.tagName == "h1" || body.firstChild.tagName == "H1", "h1标签");
        equal(body.firstChild.innerHTML, "hello", "h1--low");
        equal(tds[0].innerHTML, "hello1", "table--单元格1--low");
        equal(tds[1].innerHTML, "hello2", "table--单元格2--low");
        equal(tds[2].innerHTML, "hello3", "table--单元格3--low");
        equal(tds[3].innerHTML, "hello4", "table--单元格4--low");
        start();
    }, 50);
});

test('三个组合', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    var body = editor.body;
    var text = "<p>hello</p><table><tbody><tr><td>hello1</td><td>hello2</td></tr><tr><td>hello3</td><td>hello4</td></tr></tbody></table><h1>hello</h1>";
    editor.setContent(text);
    var tds = body.firstChild.nextSibling.getElementsByTagName('td');
    range.setStart(body.firstChild.firstChild, 2).setEnd(body.lastChild.firstChild, 2).select();
    editor.execCommand("touppercase");
    ok(body.firstChild.tagName == "p" || body.firstChild.tagName == "P", "p标签");
    equal(body.firstChild.innerHTML, "heLLO", "p--up");
    equal(tds[0].innerHTML, "HELLO1", "table--单元格1--up");
    equal(tds[1].innerHTML, "HELLO2", "table--单元格2--up");
    equal(tds[2].innerHTML, "HELLO3", "table--单元格3--up");
    equal(tds[3].innerHTML, "HELLO4", "table--单元格4--up");
    ok(body.lastChild.tagName == "h1" || body.lastChild.tagName == "H1", "h1标签");
    equal(body.lastChild.innerHTML, "HEllo", "h1--up");
    editor.execCommand("tolowercase");
    ok(body.firstChild.tagName == "p" || body.firstChild.tagName == "P", "p标签");
    equal(body.firstChild.innerHTML, "hello", "p--low");
    equal(tds[0].innerHTML, "hello1", "table--单元格1--low");
    equal(tds[1].innerHTML, "hello2", "table--单元格2--low");
    equal(tds[2].innerHTML, "hello3", "table--单元格3--low");
    equal(tds[3].innerHTML, "hello4", "table--单元格4--low");
    ok(body.lastChild.tagName == "h1" || body.lastChild.tagName == "H1", "h1标签");
    equal(body.lastChild.innerHTML, "hello", "h1--low");
});


