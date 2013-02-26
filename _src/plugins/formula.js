///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  insertFormula
///commandsTitle  插入公式
///commandsDialog  dialogs\formula\formula.html

UE.plugins['formula'] = function () {
    var me = this;

    me.addListener("ready",function(){
        domUtils.on(me.body,"click",function(){
            var range=me.selection.getRange();
            var start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                }, true);
            if(start){
                me._MathJaxList = [];
                me.getDialog("formula").open();
            }
        });
    });

    me.commands['formula'] = {
        execCommand:function (cmdName, html, css) {
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                }, true),
                end = domUtils.findParent(range.endContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                }, true);

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
                domUtils.remove(start);
            }
            if (html && css) {
                me.execCommand('inserthtml', html);
                utils.cssRule('formula', css, me.document);
            }
        },
        queryCommandState:function () {
            return queryState.call(this);
        }
    };
    function queryState() {
        try {
            var range = this.selection.getRange(), start, end;
            range.adjustmentBoundary();
            start = domUtils.findParent(range.startContainer, function (node) {
                return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
            }, true);
            end = domUtils.findParent(range.endContainer, function (node) {
                return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
            }, true);
            return start && end && start == end ? 1 : 0;
        }
        catch (e) {
            return 0;
        }
    }

    //不需要判断highlight的command列表
    me.notNeedHighlightQuery = {
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
        if (!me.notNeedHighlightQuery[cmd.toLowerCase()] && queryState.call(this) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    me.addOutputRule(function (root) {
        me._MathJaxList = [];
        utils.each(root.getNodesByTagName('span'), function (pi) {
            var val;
            if ((val = pi.getAttr('class')) && /MathJax/.test(val)) {
                var tmpNode = UE.uNode.createElement(pi.toHtml());
                me._MathJaxList.push(tmpNode);
                pi.children = [];
                pi.appendChild(UE.uNode.createText(decodeURIComponent(pi.getAttr('data'))));
                delete pi.attrs.data;
            }
        });
    });
    me.addInputRule(function (root) {
        if (me._MathJaxList && me._MathJaxList.length) {
            utils.each(root.getNodesByTagName('span'), function (pi) {
                var val, i = 0;
                if ((val = pi.getAttr('class'))&&/MathJax/.test(val)) {
                    pi.parentNode.replaceChild(me._MathJaxList[i++], pi);
                }
            });
        }
    });
};