/**
 * 插入代码插件
 * @file
 * @since 1.2.6.1
 */

UE.plugins["insertcode"] = function() {
  var me = this;
  me.ready(function() {
    utils.cssRule(
      "pre",
      "pre{margin:.5em 0;padding:.4em .6em;border-radius:8px;background:#f8f8f8;}",
      me.document
    );
  });
  me.setOpt("insertcode", {
    as3: "ActionScript3",
    bash: "Bash/Shell",
    cpp: "C/C++",
    css: "Css",
    cf: "CodeFunction",
    "c#": "C#",
    delphi: "Delphi",
    diff: "Diff",
    erlang: "Erlang",
    groovy: "Groovy",
    html: "Html",
    java: "Java",
    jfx: "JavaFx",
    js: "Javascript",
    pl: "Perl",
    php: "Php",
    plain: "Plain Text",
    ps: "PowerShell",
    python: "Python",
    ruby: "Ruby",
    scala: "Scala",
    sql: "Sql",
    vb: "Vb",
    xml: "Xml"
  });

  /**
     * 插入代码
     * @command insertcode
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @param { String } lang 插入代码的语言
     * @example
     * ```javascript
     * editor.execCommand( 'insertcode', 'javascript' );
     * ```
     */

  /**
     * 如果选区所在位置是插入插入代码区域，返回代码的语言
     * @command insertcode
     * @method queryCommandValue
     * @param { String } cmd 命令字符串
     * @return { String } 返回代码的语言
     * @example
     * ```javascript
     * editor.queryCommandValue( 'insertcode' );
     * ```
     */

  me.commands["insertcode"] = {
    execCommand: function(cmd, lang) {
      var me = this,
        rng = me.selection.getRange(),
        pre = domUtils.findParentByTagName(rng.startContainer, "pre", true);
      if (pre) {
        pre.className = "brush:" + lang + ";toolbar:false;";
      } else {
        var code = "";
        if (rng.collapsed) {
          code = browser.ie && browser.ie11below
            ? browser.version <= 8 ? "&nbsp;" : ""
            : "<br/>";
        } else {
          var frag = rng.extractContents();
          var div = me.document.createElement("div");
          div.appendChild(frag);

          utils.each(
            UE.filterNode(
              UE.htmlparser(div.innerHTML.replace(/[\r\t]/g, "")),
              me.options.filterTxtRules
            ).children,
            function(node) {
              if (browser.ie && browser.ie11below && browser.version > 8) {
                if (node.type == "element") {
                  if (node.tagName == "br") {
                    code += "\n";
                  } else if (!dtd.$empty[node.tagName]) {
                    utils.each(node.children, function(cn) {
                      if (cn.type == "element") {
                        if (cn.tagName == "br") {
                          code += "\n";
                        } else if (!dtd.$empty[node.tagName]) {
                          code += cn.innerText();
                        }
                      } else {
                        code += cn.data;
                      }
                    });
                    if (!/\n$/.test(code)) {
                      code += "\n";
                    }
                  }
                } else {
                  code += node.data + "\n";
                }
                if (!node.nextSibling() && /\n$/.test(code)) {
                  code = code.replace(/\n$/, "");
                }
              } else {
                if (browser.ie && browser.ie11below) {
                  if (node.type == "element") {
                    if (node.tagName == "br") {
                      code += "<br>";
                    } else if (!dtd.$empty[node.tagName]) {
                      utils.each(node.children, function(cn) {
                        if (cn.type == "element") {
                          if (cn.tagName == "br") {
                            code += "<br>";
                          } else if (!dtd.$empty[node.tagName]) {
                            code += cn.innerText();
                          }
                        } else {
                          code += cn.data;
                        }
                      });
                      if (!/br>$/.test(code)) {
                        code += "<br>";
                      }
                    }
                  } else {
                    code += node.data + "<br>";
                  }
                  if (!node.nextSibling() && /<br>$/.test(code)) {
                    code = code.replace(/<br>$/, "");
                  }
                } else {
                  code += node.type == "element"
                    ? dtd.$empty[node.tagName] ? "" : node.innerText()
                    : node.data;
                  if (!/br\/?\s*>$/.test(code)) {
                    if (!node.nextSibling()) return;
                    code += "<br>";
                  }
                }
              }
            }
          );
        }
        me.execCommand(
          "inserthtml",
          '<pre id="coder"class="brush:' +
            lang +
            ';toolbar:false">' +
            code +
            "</pre>",
          true
        );

        pre = me.document.getElementById("coder");
        domUtils.removeAttributes(pre, "id");
        var tmpNode = pre.previousSibling;

        if (
          tmpNode &&
          ((tmpNode.nodeType == 3 &&
            tmpNode.nodeValue.length == 1 &&
            browser.ie &&
            browser.version == 6) ||
            domUtils.isEmptyBlock(tmpNode))
        ) {
          domUtils.remove(tmpNode);
        }
        var rng = me.selection.getRange();
        if (domUtils.isEmptyBlock(pre)) {
          rng.setStart(pre, 0).setCursor(false, true);
        } else {
          rng.selectNodeContents(pre).select();
        }
      }
    },
    queryCommandValue: function() {
      var path = this.selection.getStartElementPath();
      var lang = "";
      utils.each(path, function(node) {
        if (node.nodeName == "PRE") {
          var match = node.className.match(/brush:([^;]+)/);
          lang = match && match[1] ? match[1] : "";
          return false;
        }
      });
      return lang;
    }
  };

  me.addInputRule(function(root) {
    utils.each(root.getNodesByTagName("pre"), function(pre) {
      var brs = pre.getNodesByTagName("br");
      if (brs.length) {
        browser.ie &&
          browser.ie11below &&
          browser.version > 8 &&
          utils.each(brs, function(br) {
            var txt = UE.uNode.createText("\n");
            br.parentNode.insertBefore(txt, br);
            br.parentNode.removeChild(br);
          });
        return;
      }
      if (browser.ie && browser.ie11below && browser.version > 8) return;
      var code = pre.innerText().split(/\n/);
      pre.innerHTML("");
      utils.each(code, function(c) {
        if (c.length) {
          pre.appendChild(UE.uNode.createText(c));
        }
        pre.appendChild(UE.uNode.createElement("br"));
      });
    });
  });
  me.addOutputRule(function(root) {
    utils.each(root.getNodesByTagName("pre"), function(pre) {
      var code = "";
      utils.each(pre.children, function(n) {
        if (n.type == "text") {
          //在ie下文本内容有可能末尾带有\n要去掉
          //trace:3396
          code += n.data.replace(/[ ]/g, "&nbsp;").replace(/\n$/, "");
        } else {
          if (n.tagName == "br") {
            code += "\n";
          } else {
            code += !dtd.$empty[n.tagName] ? "" : n.innerText();
          }
        }
      });

      pre.innerText(code.replace(/(&nbsp;|\n)+$/, ""));
    });
  });
  //不需要判断highlight的command列表
  me.notNeedCodeQuery = {
    help: 1,
    undo: 1,
    redo: 1,
    source: 1,
    print: 1,
    searchreplace: 1,
    fullscreen: 1,
    preview: 1,
    insertparagraph: 1,
    elementpath: 1,
    insertcode: 1,
    inserthtml: 1,
    selectall: 1
  };
  //将queyCommamndState重置
  var orgQuery = me.queryCommandState;
  me.queryCommandState = function(cmd) {
    var me = this;

    if (
      !me.notNeedCodeQuery[cmd.toLowerCase()] &&
      me.selection &&
      me.queryCommandValue("insertcode")
    ) {
      return -1;
    }
    return UE.Editor.prototype.queryCommandState.apply(this, arguments);
  };
  me.addListener("beforeenterkeydown", function() {
    var rng = me.selection.getRange();
    var pre = domUtils.findParentByTagName(rng.startContainer, "pre", true);
    if (pre) {
      me.fireEvent("saveScene");
      if (!rng.collapsed) {
        rng.deleteContents();
      }
      if (!browser.ie || browser.ie9above) {
        var tmpNode = me.document.createElement("br"),
          pre;
        rng.insertNode(tmpNode).setStartAfter(tmpNode).collapse(true);
        var next = tmpNode.nextSibling;
        if (!next && (!browser.ie || browser.version > 10)) {
          rng.insertNode(tmpNode.cloneNode(false));
        } else {
          rng.setStartAfter(tmpNode);
        }
        pre = tmpNode.previousSibling;
        var tmp;
        while (pre) {
          tmp = pre;
          pre = pre.previousSibling;
          if (!pre || pre.nodeName == "BR") {
            pre = tmp;
            break;
          }
        }
        if (pre) {
          var str = "";
          while (
            pre &&
            pre.nodeName != "BR" &&
            new RegExp("^[\\s" + domUtils.fillChar + "]*$").test(pre.nodeValue)
          ) {
            str += pre.nodeValue;
            pre = pre.nextSibling;
          }
          if (pre.nodeName != "BR") {
            var match = pre.nodeValue.match(
              new RegExp("^([\\s" + domUtils.fillChar + "]+)")
            );
            if (match && match[1]) {
              str += match[1];
            }
          }
          if (str) {
            str = me.document.createTextNode(str);
            rng.insertNode(str).setStartAfter(str);
          }
        }
        rng.collapse(true).select(true);
      } else {
        if (browser.version > 8) {
          var txt = me.document.createTextNode("\n");
          var start = rng.startContainer;
          if (rng.startOffset == 0) {
            var preNode = start.previousSibling;
            if (preNode) {
              rng.insertNode(txt);
              var fillchar = me.document.createTextNode(" ");
              rng
                .setStartAfter(txt)
                .insertNode(fillchar)
                .setStart(fillchar, 0)
                .collapse(true)
                .select(true);
            }
          } else {
            rng.insertNode(txt).setStartAfter(txt);
            var fillchar = me.document.createTextNode(" ");
            start = rng.startContainer.childNodes[rng.startOffset];
            if (start && !/^\n/.test(start.nodeValue)) {
              rng.setStartBefore(txt);
            }
            rng
              .insertNode(fillchar)
              .setStart(fillchar, 0)
              .collapse(true)
              .select(true);
          }
        } else {
          var tmpNode = me.document.createElement("br");
          rng.insertNode(tmpNode);
          rng.insertNode(me.document.createTextNode(domUtils.fillChar));
          rng.setStartAfter(tmpNode);
          pre = tmpNode.previousSibling;
          var tmp;
          while (pre) {
            tmp = pre;
            pre = pre.previousSibling;
            if (!pre || pre.nodeName == "BR") {
              pre = tmp;
              break;
            }
          }
          if (pre) {
            var str = "";
            while (
              pre &&
              pre.nodeName != "BR" &&
              new RegExp("^[ " + domUtils.fillChar + "]*$").test(pre.nodeValue)
            ) {
              str += pre.nodeValue;
              pre = pre.nextSibling;
            }
            if (pre.nodeName != "BR") {
              var match = pre.nodeValue.match(
                new RegExp("^([ " + domUtils.fillChar + "]+)")
              );
              if (match && match[1]) {
                str += match[1];
              }
            }

            str = me.document.createTextNode(str);
            rng.insertNode(str).setStartAfter(str);
          }
          rng.collapse(true).select();
        }
      }
      me.fireEvent("saveScene");
      return true;
    }
  });

  me.addListener("tabkeydown", function(cmd, evt) {
    var rng = me.selection.getRange();
    var pre = domUtils.findParentByTagName(rng.startContainer, "pre", true);
    if (pre) {
      me.fireEvent("saveScene");
      if (evt.shiftKey) {
      } else {
        if (!rng.collapsed) {
          var bk = rng.createBookmark();
          var start = bk.start.previousSibling;

          while (start) {
            if (pre.firstChild === start && !domUtils.isBr(start)) {
              pre.insertBefore(me.document.createTextNode("    "), start);

              break;
            }
            if (domUtils.isBr(start)) {
              pre.insertBefore(
                me.document.createTextNode("    "),
                start.nextSibling
              );

              break;
            }
            start = start.previousSibling;
          }
          var end = bk.end;
          start = bk.start.nextSibling;
          if (pre.firstChild === bk.start) {
            pre.insertBefore(
              me.document.createTextNode("    "),
              start.nextSibling
            );
          }
          while (start && start !== end) {
            if (domUtils.isBr(start) && start.nextSibling) {
              if (start.nextSibling === end) {
                break;
              }
              pre.insertBefore(
                me.document.createTextNode("    "),
                start.nextSibling
              );
            }

            start = start.nextSibling;
          }
          rng.moveToBookmark(bk).select();
        } else {
          var tmpNode = me.document.createTextNode("    ");
          rng
            .insertNode(tmpNode)
            .setStartAfter(tmpNode)
            .collapse(true)
            .select(true);
        }
      }

      me.fireEvent("saveScene");
      return true;
    }
  });

  me.addListener("beforeinserthtml", function(evtName, html) {
    var me = this,
      rng = me.selection.getRange(),
      pre = domUtils.findParentByTagName(rng.startContainer, "pre", true);
    if (pre) {
      if (!rng.collapsed) {
        rng.deleteContents();
      }
      var htmlstr = "";
      if (browser.ie && browser.version > 8) {
        utils.each(
          UE.filterNode(UE.htmlparser(html), me.options.filterTxtRules)
            .children,
          function(node) {
            if (node.type == "element") {
              if (node.tagName == "br") {
                htmlstr += "\n";
              } else if (!dtd.$empty[node.tagName]) {
                utils.each(node.children, function(cn) {
                  if (cn.type == "element") {
                    if (cn.tagName == "br") {
                      htmlstr += "\n";
                    } else if (!dtd.$empty[node.tagName]) {
                      htmlstr += cn.innerText();
                    }
                  } else {
                    htmlstr += cn.data;
                  }
                });
                if (!/\n$/.test(htmlstr)) {
                  htmlstr += "\n";
                }
              }
            } else {
              htmlstr += node.data + "\n";
            }
            if (!node.nextSibling() && /\n$/.test(htmlstr)) {
              htmlstr = htmlstr.replace(/\n$/, "");
            }
          }
        );
        var tmpNode = me.document.createTextNode(
          utils.html(htmlstr.replace(/&nbsp;/g, " "))
        );
        rng.insertNode(tmpNode).selectNode(tmpNode).select();
      } else {
        var frag = me.document.createDocumentFragment();

        utils.each(
          UE.filterNode(UE.htmlparser(html), me.options.filterTxtRules)
            .children,
          function(node) {
            if (node.type == "element") {
              if (node.tagName == "br") {
                frag.appendChild(me.document.createElement("br"));
              } else if (!dtd.$empty[node.tagName]) {
                utils.each(node.children, function(cn) {
                  if (cn.type == "element") {
                    if (cn.tagName == "br") {
                      frag.appendChild(me.document.createElement("br"));
                    } else if (!dtd.$empty[node.tagName]) {
                      frag.appendChild(
                        me.document.createTextNode(
                          utils.html(cn.innerText().replace(/&nbsp;/g, " "))
                        )
                      );
                    }
                  } else {
                    frag.appendChild(
                      me.document.createTextNode(
                        utils.html(cn.data.replace(/&nbsp;/g, " "))
                      )
                    );
                  }
                });
                if (frag.lastChild.nodeName != "BR") {
                  frag.appendChild(me.document.createElement("br"));
                }
              }
            } else {
              frag.appendChild(
                me.document.createTextNode(
                  utils.html(node.data.replace(/&nbsp;/g, " "))
                )
              );
            }
            if (!node.nextSibling() && frag.lastChild.nodeName == "BR") {
              frag.removeChild(frag.lastChild);
            }
          }
        );
        rng.insertNode(frag).select();
      }

      return true;
    }
  });
  //方向键的处理
  me.addListener("keydown", function(cmd, evt) {
    var me = this,
      keyCode = evt.keyCode || evt.which;
    if (keyCode == 40) {
      var rng = me.selection.getRange(),
        pre,
        start = rng.startContainer;
      if (
        rng.collapsed &&
        (pre = domUtils.findParentByTagName(rng.startContainer, "pre", true)) &&
        !pre.nextSibling
      ) {
        var last = pre.lastChild;
        while (last && last.nodeName == "BR") {
          last = last.previousSibling;
        }
        if (
          last === start ||
          (rng.startContainer === pre &&
            rng.startOffset == pre.childNodes.length)
        ) {
          me.execCommand("insertparagraph");
          domUtils.preventDefault(evt);
        }
      }
    }
  });
  //trace:3395
  me.addListener("delkeydown", function(type, evt) {
    var rng = this.selection.getRange();
    rng.txtToElmBoundary(true);
    var start = rng.startContainer;
    if (
      domUtils.isTagNode(start, "pre") &&
      rng.collapsed &&
      domUtils.isStartInblock(rng)
    ) {
      var p = me.document.createElement("p");
      domUtils.fillNode(me.document, p);
      start.parentNode.insertBefore(p, start);
      domUtils.remove(start);
      rng.setStart(p, 0).setCursor(false, true);
      domUtils.preventDefault(evt);
      return true;
    }
  });
};
