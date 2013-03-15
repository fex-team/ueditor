///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  insertmath
///commandsTitle  插入公式
///commandsDialog  dialogs\math\math.html

UE.plugins['formula'] = function () {
    var me = this;
    me._formulaid = 0;

    var filter = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'mathquill-rendered-math')
        }, true);
    };

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
            end = filter(rng.endContainer);
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
        formula:1
    };

    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function (cmd) {
        if (!me.notNeedmathQuery[cmd.toLowerCase()] && queryState.call(this) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    me.addListener("beforegetcontent beforegetscene", function () {
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

    me.addListener("aftergetcontent aftersetcontent aftergetscene", function () {
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
        },
        queryCommandState:function () {
            return queryState.call(me);
        }
    };
};