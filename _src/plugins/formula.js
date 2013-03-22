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

    var fnBlock = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'p' && domUtils.hasClass(node, 'formulaBlock')
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
            var rng = this.selection.getRange();
            var start = filter(rng.startContainer);
            var end = filter(rng.endContainer);
            if (start && end && start == end) {
                addFillChar(start);
                return 1;
            } else {
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
        formulainline:1,
        formulablock:1,
        formuladelete:1,
        formualmergeup:1
    };

    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function (cmd) {
        if (!me.notNeedmathQuery[cmd.toLowerCase()] && queryState.call(this) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('span'), function (pi) {
            var cls;
            if ((cls = pi.getAttr('class')) && /mathquill-rendered-math/.test(cls)) {
                var id = pi.getAttr("formulaid");
                var txt = me.window.$("[formulaid=" + id + "]").mathquill("latex");
                var span = UE.uNode.createElement("span");

                span.setAttr('class', 'mathquill-embedded-latex');
                span.setAttr("formulaid", id);
                span.appendChild(UE.uNode.createText(txt));
                pi.parentNode.replaceChild(span, pi);
            }
        });
    });
    me.addInputRule(function(root){
        if(!me.window||!me.window.SyntaxHighlighter)return;
        utils.each(root.getNodesByTagName('span'),function(pi){
            var val;
            if(val = pi.getAttr('class')){
                if(/mathquill-embedded-latex/.test(val)){
                    var tmpDiv = me.document.createElement('div');
                    tmpDiv.innerHTML = pi.toHtml();
                    me.window.$("[formulaid=" + pi.getAttr("formulaid") + "]")
                        .html("")
                        .mathquill("editable")
                        .mathquill("write", tmpDiv.firstChild.innerText.replace("{/}", "\\"));
                    var node = UE.uNode.createElement(tmpDiv.innerHTML);
                    pi.parentNode.replaceChild(node,pi)
                }
            }
            if(domUtils.hasClass(pi,'mathquill-embedded-latex')){
                me.window.$(".mathquill-embedded-latex")
                    .html("")
                    .mathquill("editable")
                    .mathquill("write", tmpDiv.firstChild.replace("{/}", "\\"));
            }
        });
    });

    me.addListener("beforegetscene", function () {
        if (!me.window || !me.window.$)return;
        utils.each(domUtils.getElementsByTagName(me.body, 'span', 'mathquill-rendered-math'), function (di) {
            var id = di.getAttribute("formulaid");
            var txt = me.window.$("[formulaid=" + id + "]").mathquill("latex");
            var span = domUtils.createElement(me.document, 'span', {
                'class':'mathquill-embedded-latex',
                'formulaid':id
            });
            span.appendChild(me.document.createTextNode(txt));
            di.parentNode.replaceChild(span, di);
        });
    });
    me.addListener("aftergetscene", function () {
        if (!me.window || !me.window.$)return;
        var list = me.window.$(".mathquill-embedded-latex"), obj = {};
        if (list.length) {
            for (var i = 0, len = list.length; i < len; i++) {
                obj[list[i].getAttribute("formulaid")] = list[i].innerText || list[i].textContent || list[i].nodeValue;
            }
            for (var attr in obj) {
                me.window.$("[formulaid=" + attr + "]")
                    .html("")
                    .mathquill("editable")
                    .mathquill("write", obj[attr].replace("{/}", "\\"));
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
                    formulaid:me._formulaid
                });
                span.className = "mathquill-editable";
                span.appendChild(doc.createTextNode(txt));
                me.execCommand('inserthtml', span.outerHTML);

                id = me._formulaid;
                me.window.$("[formulaid=" + id + "]").html("").mathquill('editable');
                me._formulaid += 1;
            }

            var selector = "[formulaid=" + id + "]";
            me.window.$(selector).focus().mathquill("write", txt.replace("{/}", "\\"));
            rng.setStartAfter(me.window.$(selector)[0]).collapse(true);
            rng.setCursor();
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
            });
        },
        queryCommandState:function () {
            try {
                var range = this.selection.getRange();
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
            var start = filter(range.startContainer),
                end = filter(range.endContainer);

            setCursorPos(range, start, end, function () {
                domUtils.breakParent(start, domUtils.findParent(start, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'p'
                }, false));

                var p = domUtils.createElement(document, "p", {
                    "style":"text-align:center",
                    "class":"formulaBlock"
                });
                start.parentNode.replaceChild(p, start);
                p.appendChild(start);
            });
        },
        queryCommandState:function () {
            try {
                var range = me.selection.getRange();
                var start = filter(range.startContainer),
                    end = filter(range.endContainer);

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
    } ;

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
                    if (start && end && start == end) {
                        if (fnBlock(start)) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else {
                        return -1;
                    }
                }

            } catch (e) {
                return -1;
            }

        }
    }  ;
};