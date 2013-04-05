///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  formula
///commandsTitle  插入公式
///commandsDialog  dialogs\formula\formula.html

UE.plugins['formula'] = function () {
    var me = this;
    me._formulaid = 0;

    var filter = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'mathquill-rendered-math')
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

    me.addListener("ready", function () {
        utils.loadFile(me.document, {
            id:"mathquill_css",
            tag:"link",
            rel:"stylesheet",
            type:"text/css",
            href:me.options.formulaCssUrl || me.options.UEDITOR_HOME_URL + "third-party/mathquill/mathquill.css"
        });
        utils.loadFile(me.document, {
            id:"jquery.min_js",
            src:me.options.jqueryUrl || me.options.UEDITOR_HOME_URL + "third-party/mathquill/jquery.min.js",
            tag:"script",
            type:"text/javascript",
            defer:"defer"
        }, function () {
            utils.loadFile(me.document, {
                id:"mathquill_js",
                src:me.options.formulaJsUrl || me.options.UEDITOR_HOME_URL + "third-party/mathquill/mathquill.min.js",
                tag:"script",
                type:"text/javascript",
                defer:"defer"
            });
        });
    });

    me.addListener("afterbackspace", function (types, evt) {
        var rng = me.selection.getRange();
        var formula = rng.startContainer.childNodes[rng.startOffset - 1];
        if (formula) {
            if (domUtils.hasClass(formula, "mathquill-rendered-math")) {
                var bk = rng.createBookmark();
                domUtils.remove(formula);
                rng.moveToBookmark(bk).select();
                evt.preventDefault();
            }
        }
    });

    me.addListener("keydown", function (types, evt) {
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 46) {
            var rng = me.selection.getRange();
            var formula = domUtils.getNextDomNode(rng.startContainer);
            if (formula) {
                if (domUtils.hasClass(formula, "mathquill-rendered-math")) {
                    var bk = rng.createBookmark();
                    domUtils.remove(formula);
                    rng.moveToBookmark(bk).select();
                    evt.preventDefault();
                }
            }
        }
    });

    function queryState(cmd) {
        try {
            var rng = this.selection.getRange();
            var start = filter(rng.startContainer);
            var end = filter(rng.endContainer);
            if (start && end && start == end) {
                addFillChar(start);
                if (!domUtils.hasClass(start, "hasCursor")) {
                    var selector = "[formulaid=" + start.getAttribute("formulaid") + "]";
                    me.window.$(selector).addClass("hasCursor");
                }
                return 1;
            } else {
                cmd === "formula" && me.window.$(".mathquill-rendered-math").removeClass("hasCursor");
                return 0;
            }
        }
        catch (e) {
            return 0;
        }
    }

    //不需要判断highlight的command列表
    me.notNeedmathQuery = {
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
        formuladelete:1,
        formualmergeup:1
    };

    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function (cmd) {
        if (!me.notNeedmathQuery[cmd.toLowerCase()] && queryState.call(this, cmd) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    me.addListener("beforegetcontent beforegetscene", function () {
        if (!me.window || !me.window.$)return;
        utils.each(domUtils.getElementsByTagName(me.body, 'span', 'mathquill-rendered-math'), function (di) {
            var id = di.getAttribute("formulaid");
            var txt = me.window.$("[formulaid=" + id + "]").mathquill("latex");
            var span = domUtils.createElement(me.document, 'math', {
                'class':'mathquill-embedded-latex',
                'formulaid':id
            });
            span.appendChild(me.document.createTextNode(txt));
            di.parentNode.replaceChild(span, di);
        });
    });
    me.addListener("aftergetcontent aftersetcontent aftergetscene", function () {
        if (!me.window || !me.window.$)return;
        var list = me.window.$("math"), obj = {};
        if (list.length) {
            for (var i = 0, len = list.length; i < len; i++) {
                obj[list[i].getAttribute("formulaid")] = list[i].innerText || list[i].textContent || list[i].nodeValue;
            }
            for (var attr in obj) {
                var node = me.window.$("[formulaid=" + attr + "]")[0];
                var span = domUtils.createElement(me.document, 'span', {
                    'class':'mathquill-embedded-latex',
                    'formulaid':node.getAttribute("formulaid")
                });
                node.parentNode.replaceChild(span, node);

                if (obj[attr]) {
                    me.window.$("[formulaid=" + attr + "]").html("").mathquill("editable")
                        .mathquill("write", obj[attr].replace("{/}", "\\"));
                }
            }
        }
    });

    me.addListener("beforepaste", function (type, obj) {
        obj.html = obj.html.replace(/formulaid=(["'])(\d)*\1/ig, function () {
            me._formulaid += 1;
            return "formulaid='" + me._formulaid + "'";
        });
    });
    me.addListener("afterpaste", function (type, obj) {
        if (!me.window || !me.window.$)return;
        var list = [];
        obj.html.replace(/formulaid=(["'])(\d*)\1/ig, function (all, char, id) {
            list.push(id);
        });
        if (list.length) {
            for (var i = 0, id; id = list[i++];) {
                var nodes = me.window.$("[formulaid=" + id + "]");
                var txt = nodes.mathquill("latex");
                var span = domUtils.createElement(me.document, "span", {
                    'class':'mathquill-editable',
                    formulaid:id
                });
                span.appendChild(me.document.createTextNode(txt));
                nodes[0].parentNode.replaceChild(span, nodes[0]);
                me.window.$("[formulaid=" + id + "]").mathquill("editable");
            }
        }
    });

    me.commands['formula'] = {
        execCommand:function (cmdName, txt) {
            var rng = me.selection.getRange();
            var start = filter(rng.startContainer);
            var end = filter(rng.endContainer);
            var id = 0;

            if (start && end && start == end) {
                id = start.getAttribute("formulaid");
            } else {
                var doc = me.document;
                var span = domUtils.createElement(doc, "span", {
                    'class':'mathquill-editable',
                    formulaid:me._formulaid
                });
                span.appendChild(doc.createTextNode(txt));
                me.execCommand('inserthtml', span.outerHTML);

                id = me._formulaid;
                me.window.$("[formulaid=" + id + "]").html("").mathquill('editable');
                me._formulaid += 1;
            }

            var list = me.window.$("[formulaid=" + id + "]");
            list.focus().mathquill("write", txt.replace("{/}", "\\"));

            rng.setStartAfter(list[0]).collapse(true);
            rng.setCursor();
        },
        queryCommandState:function () {
            return queryState.call(me, "formula");
        }
    };

    me.commands["formuladelete"] = {
        execCommand:function () {
            var range = me.selection.getRange();
            var start = filter(range.startContainer),
                end = filter(range.endContainer);

            setCursorPos(range, start, end, function () {
                domUtils.remove(start);
            });
        },
        queryCommandState:function () {
            try {
                var rng = me.selection.getRange();
                var start = filter(rng.startContainer);
                var end = filter(rng.endContainer);
                return start && end && start == end ? 0 : -1;
            } catch (e) {
                return -1;
            }

        }
    };

    me.commands["formualmergeup"] = {
        execCommand:function () {
            var range = me.selection.getRange();
            var start = filter(range.startContainer),
                end = filter(range.endContainer);

            setCursorPos(range, start, end, function () {
                var p = domUtils.findParent(start, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'p';
                });
                var cur = start.previousSibling;
                while (cur) {
                    if (!domUtils.isFillChar(cur) && domUtils.isBr(cur)) {
                        domUtils.remove(cur);
                        break;
                    } else {
                        cur = cur.previousSibling;
                    }
                }

                domUtils.mergeSibling(p, false, true);
            });
        },
        queryCommandState:function () {
            try {
                var rng = me.selection.getRange();
                var li = domUtils.findParent(rng.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'li';
                }, true);

                if (!li) {
                    var start = filter(rng.startContainer);
                    var end = filter(rng.endContainer);
                    return start && end && start == end ? 0 : 1;
                }

            } catch (e) {
                return -1;
            }

        }
    };
};