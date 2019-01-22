/**
 * 插入html字符串插件
 * @file
 * @since 1.2.6.1
 */

/**
 * 插入html代码
 * @command inserthtml
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @param { String } html 插入的html字符串
 * @remaind 插入的标签内容是在当前的选区位置上插入，如果当前是闭合状态，那直接插入内容， 如果当前是选中状态，将先清除当前选中内容后，再做插入
 * @warning 注意:该命令会对当前选区的位置，对插入的内容进行过滤转换处理。 过滤的规则遵循html语意化的原则。
 * @example
 * ```javascript
 * //xxx[BB]xxx 当前选区为非闭合选区，选中BB这两个文本
 * //执行命令，插入<b>CC</b>
 * //插入后的效果 xxx<b>CC</b>xxx
 * //<p>xx|xxx</p> 当前选区为闭合状态
 * //插入<p>CC</p>
 * //结果 <p>xx</p><p>CC</p><p>xxx</p>
 * //<p>xxxx</p>|</p>xxx</p> 当前选区在两个p标签之间
 * //插入 xxxx
 * //结果 <p>xxxx</p><p>xxxx</p></p>xxx</p>
 * ```
 */

UE.commands["inserthtml"] = {
  execCommand: function(command, html, notNeedFilter) {
    var me = this,
      range,
      div;
    if (!html) {
      return;
    }
    if (me.fireEvent("beforeinserthtml", html) === true) {
      return;
    }
    range = me.selection.getRange();
    div = range.document.createElement("div");
    div.style.display = "inline";

    if (!notNeedFilter) {
      var root = UE.htmlparser(html);
      //如果给了过滤规则就先进行过滤
      if (me.options.filterRules) {
        UE.filterNode(root, me.options.filterRules);
      }
      //执行默认的处理
      me.filterInputRule(root);
      html = root.toHtml();
    }
    div.innerHTML = utils.trim(html);

    if (!range.collapsed) {
      var tmpNode = range.startContainer;
      if (domUtils.isFillChar(tmpNode)) {
        range.setStartBefore(tmpNode);
      }
      tmpNode = range.endContainer;
      if (domUtils.isFillChar(tmpNode)) {
        range.setEndAfter(tmpNode);
      }
      range.txtToElmBoundary();
      //结束边界可能放到了br的前边，要把br包含进来
      // x[xxx]<br/>
      if (range.endContainer && range.endContainer.nodeType == 1) {
        tmpNode = range.endContainer.childNodes[range.endOffset];
        if (tmpNode && domUtils.isBr(tmpNode)) {
          range.setEndAfter(tmpNode);
        }
      }
      if (range.startOffset == 0) {
        tmpNode = range.startContainer;
        if (domUtils.isBoundaryNode(tmpNode, "firstChild")) {
          tmpNode = range.endContainer;
          if (
            range.endOffset ==
              (tmpNode.nodeType == 3
                ? tmpNode.nodeValue.length
                : tmpNode.childNodes.length) &&
            domUtils.isBoundaryNode(tmpNode, "lastChild")
          ) {
            me.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>";
            range.setStart(me.body.firstChild, 0).collapse(true);
          }
        }
      }
      !range.collapsed && range.deleteContents();
      if (range.startContainer.nodeType == 1) {
        var child = range.startContainer.childNodes[range.startOffset],
          pre;
        if (
          child &&
          domUtils.isBlockElm(child) &&
          (pre = child.previousSibling) &&
          domUtils.isBlockElm(pre)
        ) {
          range.setEnd(pre, pre.childNodes.length).collapse();
          while (child.firstChild) {
            pre.appendChild(child.firstChild);
          }
          domUtils.remove(child);
        }
      }
    }

    var child,
      parent,
      pre,
      tmp,
      hadBreak = 0,
      nextNode;
    //如果当前位置选中了fillchar要干掉，要不会产生空行
    if (range.inFillChar()) {
      child = range.startContainer;
      if (domUtils.isFillChar(child)) {
        range.setStartBefore(child).collapse(true);
        domUtils.remove(child);
      } else if (domUtils.isFillChar(child, true)) {
        child.nodeValue = child.nodeValue.replace(fillCharReg, "");
        range.startOffset--;
        range.collapsed && range.collapse(true);
      }
    }
    //列表单独处理
    var li = domUtils.findParentByTagName(range.startContainer, "li", true);
    if (li) {
      var next, last;
      while ((child = div.firstChild)) {
        //针对hr单独处理一下先
        while (
          child &&
          (child.nodeType == 3 ||
            !domUtils.isBlockElm(child) ||
            child.tagName == "HR")
        ) {
          next = child.nextSibling;
          range.insertNode(child).collapse();
          last = child;
          child = next;
        }
        if (child) {
          if (/^(ol|ul)$/i.test(child.tagName)) {
            while (child.firstChild) {
              last = child.firstChild;
              domUtils.insertAfter(li, child.firstChild);
              li = li.nextSibling;
            }
            domUtils.remove(child);
          } else {
            var tmpLi;
            next = child.nextSibling;
            tmpLi = me.document.createElement("li");
            domUtils.insertAfter(li, tmpLi);
            tmpLi.appendChild(child);
            last = child;
            child = next;
            li = tmpLi;
          }
        }
      }
      li = domUtils.findParentByTagName(range.startContainer, "li", true);
      if (domUtils.isEmptyBlock(li)) {
        domUtils.remove(li);
      }
      if (last) {
        range.setStartAfter(last).collapse(true).select(true);
      }
    } else {
      while ((child = div.firstChild)) {
        if (hadBreak) {
          var p = me.document.createElement("p");
          while (child && (child.nodeType == 3 || !dtd.$block[child.tagName])) {
            nextNode = child.nextSibling;
            p.appendChild(child);
            child = nextNode;
          }
          if (p.firstChild) {
            child = p;
          }
        }
        range.insertNode(child);
        nextNode = child.nextSibling;
        if (
          !hadBreak &&
          child.nodeType == domUtils.NODE_ELEMENT &&
          domUtils.isBlockElm(child)
        ) {
          parent = domUtils.findParent(child, function(node) {
            return domUtils.isBlockElm(node);
          });
          if (
            parent &&
            parent.tagName.toLowerCase() != "body" &&
            !(
              dtd[parent.tagName][child.nodeName] && child.parentNode === parent
            )
          ) {
            if (!dtd[parent.tagName][child.nodeName]) {
              pre = parent;
            } else {
              tmp = child.parentNode;
              while (tmp !== parent) {
                pre = tmp;
                tmp = tmp.parentNode;
              }
            }

            domUtils.breakParent(child, pre || tmp);
            //去掉break后前一个多余的节点  <p>|<[p> ==> <p></p><div></div><p>|</p>
            var pre = child.previousSibling;
            domUtils.trimWhiteTextNode(pre);
            if (!pre.childNodes.length) {
              domUtils.remove(pre);
            }
            //trace:2012,在非ie的情况，切开后剩下的节点有可能不能点入光标添加br占位

            if (
              !browser.ie &&
              (next = child.nextSibling) &&
              domUtils.isBlockElm(next) &&
              next.lastChild &&
              !domUtils.isBr(next.lastChild)
            ) {
              next.appendChild(me.document.createElement("br"));
            }
            hadBreak = 1;
          }
        }
        var next = child.nextSibling;
        if (!div.firstChild && next && domUtils.isBlockElm(next)) {
          range.setStart(next, 0).collapse(true);
          break;
        }
        range.setEndAfter(child).collapse();
      }

      child = range.startContainer;

      if (nextNode && domUtils.isBr(nextNode)) {
        domUtils.remove(nextNode);
      }
      //用chrome可能有空白展位符
      if (domUtils.isBlockElm(child) && domUtils.isEmptyNode(child)) {
        if ((nextNode = child.nextSibling)) {
          domUtils.remove(child);
          if (nextNode.nodeType == 1 && dtd.$block[nextNode.tagName]) {
            range.setStart(nextNode, 0).collapse(true).shrinkBoundary();
          }
        } else {
          try {
            child.innerHTML = browser.ie ? domUtils.fillChar : "<br/>";
          } catch (e) {
            range.setStartBefore(child);
            domUtils.remove(child);
          }
        }
      }
      //加上true因为在删除表情等时会删两次，第一次是删的fillData
      try {
        range.select(true);
      } catch (e) {}
    }

    setTimeout(function() {
      range = me.selection.getRange();
      range.scrollToView(
        me.autoHeightEnabled,
        me.autoHeightEnabled ? domUtils.getXY(me.iframe).y : 0
      );
      me.fireEvent("afterinserthtml", html);
    }, 200);
  }
};
