var layoutWrap = $G('layout-wrap'),
    resultArea = $G('result-area'),
    textEditor = $G('textarea'),
    bk;

window.onload = function () {
    editor._MathJaxList = [];
    textEditor.focus();
    textEditor.onmouseup = function () {
        document.selection && (bk = document.selection.createRange().getBookmark());
    };
    textEditor.onkeyup = function () {
        updateFormula.call(this, this.value);
    };
    layoutWrap.onclick = function (e) {
        var e = e || window.event,
            target = e.target || e.srcElement,
            signal,
            posStart,
            posEnd;
        if (target.tagName.toLowerCase() === 'td' && (signal = target.getAttribute('data'))) {
            if (!((posStart = textEditor.selectionStart) != undefined && (posEnd = textEditor.selectionEnd) != undefined)) {
                var range = textEditor.createTextRange();
                range.moveToBookmark(bk);
                range.select();
                var pos = getPos();
                posStart = pos[0];
                posEnd = pos[1];
            }
            textEditor.value = textEditor.value.slice(0, posStart) + signal + textEditor.value.slice(posEnd);
            updateFormula(textEditor.value);
        }
    };

    //同步编辑器中的字体大小与公式一致
    resultArea.style.fontSize = domUtils.getComputedStyle(editor.selection.getRange().startContainer, 'font-size');

    if (editor.queryCommandState("insertformula")) {
        var range = editor.selection.getRange(),
            ele = domUtils.findParent(range.startContainer, function (node) {
                return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
            }, true);
        textEditor.value = decodeURIComponent(ele.getAttribute('data')).replace(/\$/ig, "");
        updateFormula(textEditor.value)
    }
};

function updateFormula(text) {
    var tmr = arguments.callee.tmr;

    tmr && window.clearTimeout(tmr);
    arguments.callee.tmr = setTimeout(function () {
        MathJax.Hub.queue.Push(["Text", MathJax.Hub.getAllJax("result-area")[0], "\\displaystyle{" + text + "}"]);
    }, 1000);
}

function getPos() {
    var start, end, doc = document;
    var range = doc.selection.createRange();
    var range_all = doc.body.createTextRange();
    var textBox = $G('textarea');

    range_all.moveToElementText(textBox);
    for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
        range_all.moveStart('character', 1);
    for (var i = 0; i <= start; i++) {
        if (textBox.value.charAt(i) == '\n')
            start++;
    }
    range_all = doc.body.createTextRange();
    range_all.moveToElementText(textBox);

    for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++)
        range_all.moveStart('character', 1);

    for (var i = 0; i <= end; i++) {
        if (textBox.value.charAt(i) == '\n')
            end++;
    }
    return [start, end];
}

function getStyle() {
    var list = document.head.children, str = "";
    for (var i = 0, node; node = list[i++];) {
        if (/style/ig.test(node.tagName)) {
            str += node[browser.ie ? "innerText" : "textContent"];
        }
    }
    return str;
}
function format(resultArea, value) {
    var mathjaxDom = resultArea.lastChild;
    do {
        mathjaxDom = mathjaxDom.previousSibling;
    }
    while (mathjaxDom && mathjaxDom.className != 'MathJax_Display');
    var node = mathjaxDom.firstChild;
    node.removeAttribute("id");
    node.setAttribute("data", encodeURIComponent("$$" + value + "$$"));
    domUtils.removeAttributes(mathjaxDom.children[0], ['style']);//删除多余属性

    return '<table style="width:95%;margin: 5px auto;" class="MathJaxer">' +
        '<tr><td style="text-align: center;border:1px dotted #ccc;">' + mathjaxDom.innerHTML + '</td></tr>' +
        '</table>';
}

dialog.onok = function () {
    var textValue = textEditor.value.replace(/(^\s*)|(\s*$)/g, '');
    if (textValue.length > 0) {
        editor.execCommand('formula', format(resultArea, textValue), getStyle());
    }
};