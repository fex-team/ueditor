///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  insertFormula
///commandsTitle  插入公式
///commandsDialog  dialogs\formula\formula.html

UE.plugins['formula'] = function () {
    var me = this;

    var fnInline = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
        }, true);
    };

    var fnBlock = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'p' && domUtils.hasClass(node, 'MathJaxBlock')
        }, true);
    };

    var setCursorPos = function (range, start, end, callback) {
        if (start && end && start === end) {
            if (start.nextSibling) {
                range.setStart(start.nextSibling, 0)
            } else {
                if (start.previousSibling) {
                    range.setStartAtLast(start.previousSibling)
                } else {
                    var p = me.document.createElement('p');
                    domUtils.fillNode(me.document, p);
                    range.setStart(p, 0)
                }
            }
            range.setCursor(false, true);
            callback();
        }
    };

    function toInline(node, ignorePre, ignoreNext) {
        function merge(rtl, start, node) {
            var next;
            if ((next = node[rtl]) && !domUtils.isBookmarkNode(next) && next.nodeType == 1) {
                while (next.firstChild) {
                    if (start == 'firstChild') {
                        node.insertBefore(next.lastChild, node.firstChild);
                    }
                    else {
                        node.appendChild(next.firstChild);
                    }
                }
                domUtils.remove(next);
            }
        }

        !ignorePre && merge('previousSibling', 'firstChild', node);
        !ignoreNext && merge('nextSibling', 'lastChild', node);
    }

    function addFillChar(node) {
        var previous = node.previousSibling,
            next = node.nextSibling;

        if (!previous || !domUtils.isFillChar(previous)) {
            node.parentNode.insertBefore(document.createTextNode(domUtils.fillChar), node);
        }
        if (!next || !domUtils.isFillChar(next)) {
            domUtils.insertAfter(node, document.createTextNode(domUtils.fillChar));
        }
    }

    function queryState() {
        try {
            var range = this.selection.getRange();
            range.adjustmentBoundary();
            var start = fnInline(range.startContainer);
            end = fnInline(range.endContainer);
            if (start && end && start == end) {
                this.body.contentEditable = "false";
                addFillChar(start);
                return 1;
            } else {
                this.body.contentEditable = "true";
                return 0;
            }
        }
        catch (e) {
            return 0;
        }
    }

    //不需要判断highlight的command列表
    me.notNeedFormulaQuery = {
        help:1,
        undo:1,
        redo:1,
        source:1,
        print:1,
        searchreplace:1,
        fullscreen:1,
        autotypeset:1,
        pasteplain:1,
        preview:1,
        insertparagraph:1,
        elementpath:1,
        formula:1,
        formulablock:1,
        formulainline:1
    };

    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function (cmd) {
        if (!me.notNeedFormulaQuery[cmd.toLowerCase()] && queryState.call(this) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    me.addOutputRule(function (root) {
        me._MathJaxList = [];

        utils.each(root.getNodesByTagName('span'), function (pi) {
            var cls;
            if ((cls = pi.getAttr('class')) && /MathJax/.test(cls)) {
                var span = UE.uNode.createElement("span");
                span.setAttr("class", "MathJax");
                var txtNode = UE.uNode.createText(decodeURIComponent(pi.getAttr('data')));
                span.appendChild(txtNode);

                var p = domUtils.findParent(pi, function (node) {
                    return node.type == "element" && node.tagName.toLowerCase() == 'p' && /MathJaxBlock/.test(node.attrs.class);
                }, true);

                if (p) {
                    me._MathJaxList.push(p);
                    p.parentNode.replaceChild(span, p);
                } else {
                    me._MathJaxList.push(UE.uNode.createElement(pi.toHtml()));
                    pi.parentNode.replaceChild(span, pi);
                }

            }
        });
    });

    me.addInputRule(function (root) {
        if (me._MathJaxList && me._MathJaxList.length) {
            var i = 0;
            utils.each(root.getNodesByTagName('span'), function (pi) {
                var val;
                if ((val = pi.getAttr('class')) && /MathJax/.test(val)) {
                    pi.parentNode.replaceChild(me._MathJaxList[i++], pi);
                }
            });
        }
    });

    me.commands['formula'] = {
        execCommand:function (cmdName, html, css) {
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = fnBlock(range.startContainer);
            end = fnBlock(range.endContainer);

            if (start == null && end == null) {
                start = fnInline(range.startContainer);
                end = fnInline(range.endContainer);
            }

            setCursorPos(range, start, end, function () {
                domUtils.remove(start);
            });

            if (html && css) {
                html = '<p class="MathJaxBlock" style="text-align: center;">' + html + '</p>';
                me.execCommand('inserthtml', html);
                utils.cssRule('formula', css, me.document);
            }
        },
        queryCommandState:function () {
            return queryState.call(me);
        }
    };

    me.commands['formulainline'] = {
        execCommand:function () {
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = fnBlock(range.startContainer),
                end = fnBlock(range.endContainer);

            setCursorPos(range, start, end, function () {
                if (start.previousSibling || start.nextSibling || /li/i.test(start.parentNode.tagName)) {
                    toInline(start);
                }
                else {
                    var p = document.createElement("p");
                    p.appendChild(start);
                    start.parentNode.replaceChild(p, start);
                }
                domUtils.removeAttributes(start, ["style", "class"]);

                range.setEndAfter(start);
                range.setCursor(true);
            });
        },
        queryCommandState:function () {
            try {
                var range = this.selection.getRange();
                range.adjustmentBoundary();
                var start = fnBlock(range.startContainer),
                    end = fnBlock(range.startContainer);

                return start && end && start == end ? 0 : -1;
            }
            catch (e) {
                return -1;
            }
        }
    };

    me.commands['formulablock'] = {
        execCommand:function () {
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = fnInline(range.startContainer),
                end = fnInline(range.endContainer);

            setCursorPos(range, start, end, function () {
                domUtils.breakParent(start, domUtils.findParent(start, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'p'
                }, false));

                var p = domUtils.createElement(document, "p", {
                    style:'text-align:center',
                    class:'MathJaxBlock'
                });
                start.parentNode.replaceChild(p, start);
                p.appendChild(start)
                range.setEndAfter(start);
                range.setCursor(true);
            });
        },
        queryCommandState:function () {
            try {
                var range = me.selection.getRange();
                range.adjustmentBoundary();
                var start = fnInline(range.startContainer),
                    end = fnInline(range.endContainer);

                if (start && end && start == end) {
                    var p = fnBlock(range.startContainer);
                    return p ? -1 : 0;
                } else {
                    return -1;
                }

            }
            catch (e) {
                return -1;
            }
        }
    };
};