/**
 * 分页功能插件
 * @file
 * @since 1.2.6.1
 */
UE.plugins["pagebreak"] = function() {
  var me = this,
    notBreakTags = ["td"];
  me.setOpt("pageBreakTag", "_ueditor_page_break_tag_");

  function fillNode(node) {
    if (domUtils.isEmptyBlock(node)) {
      var firstChild = node.firstChild,
        tmpNode;

      while (
        firstChild &&
        firstChild.nodeType == 1 &&
        domUtils.isEmptyBlock(firstChild)
      ) {
        tmpNode = firstChild;
        firstChild = firstChild.firstChild;
      }
      !tmpNode && (tmpNode = node);
      domUtils.fillNode(me.document, tmpNode);
    }
  }
  //分页符样式添加

  me.ready(function() {
    utils.cssRule(
      "pagebreak",
      ".pagebreak{display:block;clear:both !important;cursor:default !important;width: 100% !important;margin:0;}",
      me.document
    );
  });
  function isHr(node) {
    return (
      node &&
      node.nodeType == 1 &&
      node.tagName == "HR" &&
      node.className == "pagebreak"
    );
  }
  me.addInputRule(function(root) {
    root.traversal(function(node) {
      if (node.type == "text" && node.data == me.options.pageBreakTag) {
        var hr = UE.uNode.createElement(
          '<hr class="pagebreak" noshade="noshade" size="5" style="-webkit-user-select: none;">'
        );
        node.parentNode.insertBefore(hr, node);
        node.parentNode.removeChild(node);
      }
    });
  });
  me.addOutputRule(function(node) {
    utils.each(node.getNodesByTagName("hr"), function(n) {
      if (n.getAttr("class") == "pagebreak") {
        var txt = UE.uNode.createText(me.options.pageBreakTag);
        n.parentNode.insertBefore(txt, n);
        n.parentNode.removeChild(n);
      }
    });
  });

  /**
     * 插入分页符
     * @command pagebreak
     * @method execCommand
     * @param { String } cmd 命令字符串
     * @remind 在表格中插入分页符会把表格切分成两部分
     * @remind 获取编辑器内的数据时， 编辑器会把分页符转换成“_ueditor_page_break_tag_”字符串，
     *          以便于提交数据到服务器端后处理分页。
     * @example
     * ```javascript
     * editor.execCommand( 'pagebreak'); //插入一个hr标签，带有样式类名pagebreak
     * ```
     */

  me.commands["pagebreak"] = {
    execCommand: function() {
      var range = me.selection.getRange(),
        hr = me.document.createElement("hr");
      domUtils.setAttributes(hr, {
        class: "pagebreak",
        noshade: "noshade",
        size: "5"
      });
      domUtils.unSelectable(hr);
      //table单独处理
      var node = domUtils.findParentByTagName(
        range.startContainer,
        notBreakTags,
        true
      ),
        parents = [],
        pN;
      if (node) {
        switch (node.tagName) {
          case "TD":
            pN = node.parentNode;
            if (!pN.previousSibling) {
              var table = domUtils.findParentByTagName(pN, "table");
              //                            var tableWrapDiv = table.parentNode;
              //                            if(tableWrapDiv && tableWrapDiv.nodeType == 1
              //                                && tableWrapDiv.tagName == 'DIV'
              //                                && tableWrapDiv.getAttribute('dropdrag')
              //                                ){
              //                                domUtils.remove(tableWrapDiv,true);
              //                            }
              table.parentNode.insertBefore(hr, table);
              parents = domUtils.findParents(hr, true);
            } else {
              pN.parentNode.insertBefore(hr, pN);
              parents = domUtils.findParents(hr);
            }
            pN = parents[1];
            if (hr !== pN) {
              domUtils.breakParent(hr, pN);
            }
            //table要重写绑定一下拖拽
            me.fireEvent("afteradjusttable", me.document);
        }
      } else {
        if (!range.collapsed) {
          range.deleteContents();
          var start = range.startContainer;
          while (
            !domUtils.isBody(start) &&
            domUtils.isBlockElm(start) &&
            domUtils.isEmptyNode(start)
          ) {
            range.setStartBefore(start).collapse(true);
            domUtils.remove(start);
            start = range.startContainer;
          }
        }
        range.insertNode(hr);

        var pN = hr.parentNode,
          nextNode;
        while (!domUtils.isBody(pN)) {
          domUtils.breakParent(hr, pN);
          nextNode = hr.nextSibling;
          if (nextNode && domUtils.isEmptyBlock(nextNode)) {
            domUtils.remove(nextNode);
          }
          pN = hr.parentNode;
        }
        nextNode = hr.nextSibling;
        var pre = hr.previousSibling;
        if (isHr(pre)) {
          domUtils.remove(pre);
        } else {
          pre && fillNode(pre);
        }

        if (!nextNode) {
          var p = me.document.createElement("p");

          hr.parentNode.appendChild(p);
          domUtils.fillNode(me.document, p);
          range.setStart(p, 0).collapse(true);
        } else {
          if (isHr(nextNode)) {
            domUtils.remove(nextNode);
          } else {
            fillNode(nextNode);
          }
          range.setEndAfter(hr).collapse(false);
        }

        range.select(true);
      }
    }
  };
};
