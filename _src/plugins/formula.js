///import core
///import commands/inserthtml.js
///commands 插入公式
///commandsName  insertFormula
///commandsTitle  插入公式
///commandsDialog  dialogs\formula\formula.html

UE.plugins['formula'] = function () {
    var me = this;

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
            if (start && end && start == end) {
                this.body.contentEditable = "false";
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

    me.commands['formula'] = {
        execCommand:function (cmdName, html, css) {
            html = '<table style="width:100%;margin: 5px auto;" class="MathJaxer">' +
                '<tr><td style="text-align: center;border:1px dotted #ccc;">' + html + '</td></tr>' +
                '</table>';
            var range = me.selection.getRange();
            range.adjustmentBoundary();
            var start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
                }, true),
                end = domUtils.findParent(range.endContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
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
                domUtils.remove(domUtils.findParent(start, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer');
                }, true));
            }
            if (html && css) {
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
            var start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
                }, true),
                end = domUtils.findParent(range.endContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
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

                var ele = domUtils.getElementsByTagName(start, "span", function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax');
                })[0];
                start.parentNode.replaceChild(ele, start);
            }
        },
        queryCommandState:function () {
            try {
                var range = this.selection.getRange(), start, end;
                range.adjustmentBoundary();
                start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
                }, true);
                end = domUtils.findParent(range.endContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
                }, true);
                if (start && end && start == end) {
                    return 0;
                } else {
                    return -1;
                }
            }
            catch (e) {
                return -1;
            }
        }
    };

    me.commands['formuladisplay'] = {
        execCommand:function () {
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

                var table = domUtils.createElement(document,"table", {
                    style:"width:100%;margin: 5px auto;",
                    class:"MathJaxer"
                });
                table.innerHTML = '<tr><td style="text-align: center;border:1px dotted #ccc;">' + start.outerHTML + '</td></tr>';
                start.parentNode.replaceChild(table, start);
            }
        },
        queryCommandState:function () {
            try {
                var range = this.selection.getRange(), start, end;
                range.adjustmentBoundary();
                start = domUtils.findParent(range.startContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                }, true);
                end = domUtils.findParent(range.endContainer, function (node) {
                    return node.nodeType == 1 && node.tagName.toLowerCase() == 'span' && domUtils.hasClass(node, 'MathJax')
                }, true);
                if (start && end && start == end) {
                    var table = domUtils.findParent(range.startContainer, function (node) {
                        return node.nodeType == 1 && node.tagName.toLowerCase() == 'table' && domUtils.hasClass(node, 'MathJaxer')
                    }, true);
                    return table ? -1 : 0;
                } else {
                    return -1;
                }

            }
            catch (e) {
                return -1;
            }
        }
    };


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
        formula:1,
        formuladisplay:1,
        formulainline:1
    };
    //将queyCommamndState重置
    var orgQuery = me.queryCommandState;
    me.queryCommandState = function (cmd) {
        if (!me.notNeedHighlightQuery[cmd.toLowerCase()] && queryState.call(this) == 1) {
            return -1;
        }
        return orgQuery.apply(this, arguments)
    };

    //避免table插件对于公式的影响
    me.addListener('excludetable excludeNodeinautotype', function (cmd, target) {
        if (target && domUtils.findParent(target, function (node) {
            return domUtils.hasClass(node, 'MathJaxer')
        }, true)) {
            return true;
        }
    });

    me.addOutputRule(function (root) {
        me._MathJaxList = [];
        utils.each(root.getNodesByTagName('table'), function (pi) {
            var cls;
            if ((cls = pi.getAttr('class')) && /MathJaxer/.test(cls)) {
                var tmpNode = UE.uNode.createElement(pi.toHtml());
                me._MathJaxList.push(tmpNode);

                utils.each(pi.getNodesByTagName('span'), function (node) {
                    var val;
                    if ((val = node.getAttr('class')) && /MathJax/.test(val)) {
                        var tmpSpan = UE.uNode.createElement("span");
                        tmpSpan.setAttr("class", "MathJax");
                        var txtNode = UE.uNode.createText(decodeURIComponent(node.getAttr('data')));
                        tmpSpan.appendChild(txtNode);
                        pi.parentNode.replaceChild(tmpSpan, pi);
                    }
                });
            }
        });

        if (!me._MathJaxList.length)
            utils.each(root.getNodesByTagName('span'), function (pi) {
                var cls;
                if ((cls = pi.getAttr('class')) && /MathJax/.test(cls)) {
                    var tmpNode = UE.uNode.createElement(pi.toHtml());
                    me._MathJaxList.push(tmpNode);

                    var tmpSpan = UE.uNode.createElement("span");
                    tmpSpan.setAttr("class", "MathJax");
                    var txtNode = UE.uNode.createText(decodeURIComponent(pi.getAttr('data')));
                    tmpSpan.appendChild(txtNode);
                    pi.parentNode.replaceChild(tmpSpan, pi);
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
};