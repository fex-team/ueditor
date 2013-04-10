///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  insertmath
///commandsTitle  插入公式
///commandsDialog  dialogs\math\math.html

UE.plugins['formula'] = function () {
    var me = this;

    var filter = function (node) {
        return domUtils.findParent(node, function (node) {
            return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' &&  domUtils.hasClass(node, 'mathquill-rendered-math');
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

    me.addListener("ready", function () {
        utils.loadFile(me.document, {
            id:"mathquill_css",
            tag:"link",
            rel:"stylesheet",
            type:"text/css",
            href:me.options.formulaCssUrl || me.options.UEDITOR_HOME_URL + "third-party/mathquill/mathquill.css"
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
        me._mathList = [];

        utils.each(root.getNodesByTagName('span'), function (pi) {
            var cls;
            if ((cls = pi.getAttr('class')) && /mathquill-rendered-math/.test(cls)) {
                var span = UE.uNode.createElement("span");
                span.setAttr("class", "mathquill-embedded-latex");
                var txtNode = UE.uNode.createText(decodeURIComponent(pi.getAttr('data')));
                span.appendChild(txtNode);

                me._mathList.push(UE.uNode.createElement(pi.toHtml()));
                pi.parentNode.replaceChild(span, pi);
            }
        });
    });

    me.addInputRule(function (root) {
        if (me._mathList && me._mathList.length) {
            utils.each(root.getNodesByTagName('span'), function (pi,i) {
                var val;
                if ((val = pi.getAttr('class')) && /mathquill-embedded-latex/.test(val)) {
                    pi.parentNode.replaceChild(me._mathList[i++], pi);
                }
            });
        }
    });

    me.commands['formula'] = {
        execCommand:function (cmdName, html) {
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = filter(range.startContainer);
            var end = filter(range.endContainer);

            setCursorPos(range, start, end, function () {
                domUtils.remove(start);
            });

            if (html) {
                me.execCommand('inserthtml', html);
            }
        },
        queryCommandState:function () {
            return queryState.call(me);
        }
    };
};