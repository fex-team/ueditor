var Formula = function () {
    this.init();
};
(function () {
    var importBar = $G('J_importBar'),
        textEditor = $G('J_textarea'),
        outputBar = $G('J_outputBar'),
        bk;

    Formula.prototype = {
        init:function () {
            var me = this;
            window.onload = function () {
                editor._MathJaxList = [];
                me._initTextEditor();//初始化文本输入区域
                me._initImportBar();//初始化输入工具栏
                me._initOutputBar();//同步编辑器中的字体大小与公式一致
                me._autoShowRes();//自动显示结果
            };
        },
        _initTextEditor:function () {
            var me = this;
            textEditor.focus();

            domUtils.on(textEditor, "mouseup", function () {
                document.selection && (bk = document.selection.createRange().getBookmark());
            });
            domUtils.on(textEditor, "keyup", function () {
                me._updateFormula.call(this, this.value);
            });
        },
        _initImportBar:function () {
            var me = this;

            domUtils.on(importBar, "click", function (e) {
                var target = e.target || e.srcElement,
                    signal,
                    posStart,
                    posEnd;
                if (target.tagName.toLowerCase() === 'td' && (signal = target.getAttribute('data'))) {
                    if (!((posStart = textEditor.selectionStart) != undefined && (posEnd = textEditor.selectionEnd) != undefined)) {
                        var range = textEditor.createTextRange();
                        range.moveToBookmark(bk);
                        range.select();
                        var pos = me._getPos();
                        posStart = pos[0];
                        posEnd = pos[1];
                    }
                    textEditor.value = textEditor.value.slice(0, posStart) + signal + textEditor.value.slice(posEnd);
                    me._updateFormula(textEditor.value);
                }
            });
        },
        _initOutputBar:function () {
            outputBar.style.fontSize = domUtils.getComputedStyle(editor.selection.getRange().startContainer, 'font-size');
        },
        _autoShowRes:function () {
            var me = this;
            if (editor.queryCommandState("formula")) {
                var range = editor.selection.getRange(),
                    ele = domUtils.findParent(range.startContainer, function (node) {
                        return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                    }, true);
                textEditor.value = decodeURIComponent(ele.getAttribute('data')).replace(/\$/ig, "");
                me._updateFormula(textEditor.value);
            }
        },
        _updateFormula:function (text) {
            var tmr = arguments.callee.tmr;

            tmr && window.clearTimeout(tmr);
            arguments.callee.tmr = setTimeout(function () {
                MathJax.Hub.queue.Push(["Text", MathJax.Hub.getAllJax("J_outputBar")[0], "\\displaystyle{" + text + "}"]);
            }, 1000);
        },
        _getPos:function () {
            var start, end, doc = document;
            var range = doc.selection.createRange();
            var range_all = doc.body.createTextRange();

            range_all.moveToElementText(textEditor);
            for (start = 0; range_all.compareEndPoints("StartToStart", range) < 0; start++)
                range_all.moveStart('character', 1);
            for (var i = 0; i <= start; i++) {
                if (textEditor.value.charAt(i) == '\n')
                    start++;
            }
            range_all = doc.body.createTextRange();
            range_all.moveToElementText(textEditor);

            for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end++)
                range_all.moveStart('character', 1);

            for (var i = 0; i <= end; i++) {
                if (textEditor.value.charAt(i) == '\n')
                    end++;
            }
            return [start, end];
        },

        formatCss:function () {
            var list = document.head.children, str = "";
            for (var i = 0, node; node = list[i++];) {
                if (/style/ig.test(node.tagName)) {
                    str += node[browser.ie ? "innerText" : "textContent"];
                }
            }
            return str;
        },
        formatHtml:function (outputBar, value) {
            if (value.length) {
                var mathjaxDom = outputBar.lastChild;
                do {
                    mathjaxDom = mathjaxDom.previousSibling;
                }
                while (mathjaxDom && mathjaxDom.className != 'MathJax_Display');

                var node = mathjaxDom.children[0];
                node.setAttribute("data", encodeURIComponent("$$" + value + "$$"));
                domUtils.removeAttributes(node, ['id', 'style']);

                return  mathjaxDom.innerHTML;
            }
            return "";
        }
    };

    var formulaObj = new Formula();

    dialog.onok = function () {
        if (MathJax.isReady) {
            try {
                var html = formulaObj.formatHtml(outputBar, utils.trim(textEditor.value));
                var css = formulaObj.formatCss();
            } catch (e) {
                return;
            }
            editor.execCommand('formula', html, css);
        }
    };
})()

