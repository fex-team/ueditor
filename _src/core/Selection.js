/**
 * 选集
 * @file
 * @module UE.dom
 * @class Selection
 * @since 1.2.6.1
 */

/**
 * 选区集合
 * @unfile
 * @module UE.dom
 * @class Selection
 */
(function() {
  function getBoundaryInformation(range, start) {
    var getIndex = domUtils.getNodeIndex;
    range = range.duplicate();
    range.collapse(start);
    var parent = range.parentElement();
    //如果节点里没有子节点，直接退出
    if (!parent.hasChildNodes()) {
      return { container: parent, offset: 0 };
    }
    var siblings = parent.children,
      child,
      testRange = range.duplicate(),
      startIndex = 0,
      endIndex = siblings.length - 1,
      index = -1,
      distance;
    while (startIndex <= endIndex) {
      index = Math.floor((startIndex + endIndex) / 2);
      child = siblings[index];
      testRange.moveToElementText(child);
      var position = testRange.compareEndPoints("StartToStart", range);
      if (position > 0) {
        endIndex = index - 1;
      } else if (position < 0) {
        startIndex = index + 1;
      } else {
        //trace:1043
        return { container: parent, offset: getIndex(child) };
      }
    }
    if (index == -1) {
      testRange.moveToElementText(parent);
      testRange.setEndPoint("StartToStart", range);
      distance = testRange.text.replace(/(\r\n|\r)/g, "\n").length;
      siblings = parent.childNodes;
      if (!distance) {
        child = siblings[siblings.length - 1];
        return { container: child, offset: child.nodeValue.length };
      }

      var i = siblings.length;
      while (distance > 0) {
        distance -= siblings[--i].nodeValue.length;
      }
      return { container: siblings[i], offset: -distance };
    }
    testRange.collapse(position > 0);
    testRange.setEndPoint(position > 0 ? "StartToStart" : "EndToStart", range);
    distance = testRange.text.replace(/(\r\n|\r)/g, "\n").length;
    if (!distance) {
      return dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName]
        ? {
            container: parent,
            offset: getIndex(child) + (position > 0 ? 0 : 1)
          }
        : {
            container: child,
            offset: position > 0 ? 0 : child.childNodes.length
          };
    }
    while (distance > 0) {
      try {
        var pre = child;
        child = child[position > 0 ? "previousSibling" : "nextSibling"];
        distance -= child.nodeValue.length;
      } catch (e) {
        return { container: parent, offset: getIndex(pre) };
      }
    }
    return {
      container: child,
      offset: position > 0 ? -distance : child.nodeValue.length + distance
    };
  }

  /**
     * 将ieRange转换为Range对象
     * @param {Range}   ieRange    ieRange对象
     * @param {Range}   range      Range对象
     * @return  {Range}  range       返回转换后的Range对象
     */
  function transformIERangeToRange(ieRange, range) {
    if (ieRange.item) {
      range.selectNode(ieRange.item(0));
    } else {
      var bi = getBoundaryInformation(ieRange, true);
      range.setStart(bi.container, bi.offset);
      if (ieRange.compareEndPoints("StartToEnd", ieRange) != 0) {
        bi = getBoundaryInformation(ieRange, false);
        range.setEnd(bi.container, bi.offset);
      }
    }
    return range;
  }

  /**
     * 获得ieRange
     * @param {Selection} sel    Selection对象
     * @return {ieRange}    得到ieRange
     */
  function _getIERange(sel) {
    var ieRange;
    //ie下有可能报错
    try {
      ieRange = sel.getNative().createRange();
    } catch (e) {
      return null;
    }
    var el = ieRange.item ? ieRange.item(0) : ieRange.parentElement();
    if ((el.ownerDocument || el) === sel.document) {
      return ieRange;
    }
    return null;
  }

  var Selection = (dom.Selection = function(doc) {
    var me = this,
      iframe;
    me.document = doc;
    if (browser.ie9below) {
      iframe = domUtils.getWindow(doc).frameElement;
      domUtils.on(iframe, "beforedeactivate", function() {
        me._bakIERange = me.getIERange();
      });
      domUtils.on(iframe, "activate", function() {
        try {
          if (!_getIERange(me) && me._bakIERange) {
            me._bakIERange.select();
          }
        } catch (ex) {}
        me._bakIERange = null;
      });
    }
    iframe = doc = null;
  });

  Selection.prototype = {
    rangeInBody: function(rng, txtRange) {
      var node = browser.ie9below || txtRange
        ? rng.item ? rng.item() : rng.parentElement()
        : rng.startContainer;

      return node === this.document.body || domUtils.inDoc(node, this.document);
    },

    /**
         * 获取原生seleciton对象
         * @method getNative
         * @return { Object } 获得selection对象
         * @example
         * ```javascript
         * editor.selection.getNative();
         * ```
         */
    getNative: function() {
      var doc = this.document;
      try {
        return !doc
          ? null
          : browser.ie9below
            ? doc.selection
            : domUtils.getWindow(doc).getSelection();
      } catch (e) {
        return null;
      }
    },

    /**
         * 获得ieRange
         * @method getIERange
         * @return { Object } 返回ie原生的Range
         * @example
         * ```javascript
         * editor.selection.getIERange();
         * ```
         */
    getIERange: function() {
      var ieRange = _getIERange(this);
      if (!ieRange) {
        if (this._bakIERange) {
          return this._bakIERange;
        }
      }
      return ieRange;
    },

    /**
         * 缓存当前选区的range和选区的开始节点
         * @method cache
         */
    cache: function() {
      this.clear();
      this._cachedRange = this.getRange();
      this._cachedStartElement = this.getStart();
      this._cachedStartElementPath = this.getStartElementPath();
    },

    /**
         * 获取选区开始位置的父节点到body
         * @method getStartElementPath
         * @return { Array } 返回父节点集合
         * @example
         * ```javascript
         * editor.selection.getStartElementPath();
         * ```
         */
    getStartElementPath: function() {
      if (this._cachedStartElementPath) {
        return this._cachedStartElementPath;
      }
      var start = this.getStart();
      if (start) {
        return domUtils.findParents(start, true, null, true);
      }
      return [];
    },

    /**
         * 清空缓存
         * @method clear
         */
    clear: function() {
      this._cachedStartElementPath = this._cachedRange = this._cachedStartElement = null;
    },

    /**
         * 编辑器是否得到了选区
         * @method isFocus
         */
    isFocus: function() {
      try {
        if (browser.ie9below) {
          var nativeRange = _getIERange(this);
          return !!(nativeRange && this.rangeInBody(nativeRange));
        } else {
          return !!this.getNative().rangeCount;
        }
      } catch (e) {
        return false;
      }
    },

    /**
         * 获取选区对应的Range
         * @method getRange
         * @return { Object } 得到Range对象
         * @example
         * ```javascript
         * editor.selection.getRange();
         * ```
         */
    getRange: function() {
      var me = this;
      function optimze(range) {
        var child = me.document.body.firstChild,
          collapsed = range.collapsed;
        while (child && child.firstChild) {
          range.setStart(child, 0);
          child = child.firstChild;
        }
        if (!range.startContainer) {
          range.setStart(me.document.body, 0);
        }
        if (collapsed) {
          range.collapse(true);
        }
      }

      if (me._cachedRange != null) {
        return this._cachedRange;
      }
      var range = new baidu.editor.dom.Range(me.document);

      if (browser.ie9below) {
        var nativeRange = me.getIERange();
        if (nativeRange) {
          //备份的_bakIERange可能已经实效了，dom树发生了变化比如从源码模式切回来，所以try一下，实效就放到body开始位置
          try {
            transformIERangeToRange(nativeRange, range);
          } catch (e) {
            optimze(range);
          }
        } else {
          optimze(range);
        }
      } else {
        var sel = me.getNative();
        if (sel && sel.rangeCount) {
          var firstRange = sel.getRangeAt(0);
          var lastRange = sel.getRangeAt(sel.rangeCount - 1);
          range
            .setStart(firstRange.startContainer, firstRange.startOffset)
            .setEnd(lastRange.endContainer, lastRange.endOffset);
          if (
            range.collapsed &&
            domUtils.isBody(range.startContainer) &&
            !range.startOffset
          ) {
            optimze(range);
          }
        } else {
          //trace:1734 有可能已经不在dom树上了，标识的节点
          if (
            this._bakRange &&
            domUtils.inDoc(this._bakRange.startContainer, this.document)
          ) {
            return this._bakRange;
          }
          optimze(range);
        }
      }
      return (this._bakRange = range);
    },

    /**
         * 获取开始元素，用于状态反射
         * @method getStart
         * @return { Element } 获得开始元素
         * @example
         * ```javascript
         * editor.selection.getStart();
         * ```
         */
    getStart: function() {
      if (this._cachedStartElement) {
        return this._cachedStartElement;
      }
      var range = browser.ie9below ? this.getIERange() : this.getRange(),
        tmpRange,
        start,
        tmp,
        parent;
      if (browser.ie9below) {
        if (!range) {
          //todo 给第一个值可能会有问题
          return this.document.body.firstChild;
        }
        //control元素
        if (range.item) {
          return range.item(0);
        }
        tmpRange = range.duplicate();
        //修正ie下<b>x</b>[xx] 闭合后 <b>x|</b>xx
        tmpRange.text.length > 0 && tmpRange.moveStart("character", 1);
        tmpRange.collapse(1);
        start = tmpRange.parentElement();
        parent = tmp = range.parentElement();
        while ((tmp = tmp.parentNode)) {
          if (tmp == start) {
            start = parent;
            break;
          }
        }
      } else {
        range.shrinkBoundary();
        start = range.startContainer;
        if (start.nodeType == 1 && start.hasChildNodes()) {
          start =
            start.childNodes[
              Math.min(start.childNodes.length - 1, range.startOffset)
            ];
        }
        if (start.nodeType == 3) {
          return start.parentNode;
        }
      }
      return start;
    },

    /**
         * 得到选区中的文本
         * @method getText
         * @return { String } 选区中包含的文本
         * @example
         * ```javascript
         * editor.selection.getText();
         * ```
         */
    getText: function() {
      var nativeSel, nativeRange;
      if (this.isFocus() && (nativeSel = this.getNative())) {
        nativeRange = browser.ie9below
          ? nativeSel.createRange()
          : nativeSel.getRangeAt(0);
        return browser.ie9below ? nativeRange.text : nativeRange.toString();
      }
      return "";
    },

    /**
         * 清除选区
         * @method clearRange
         * @example
         * ```javascript
         * editor.selection.clearRange();
         * ```
         */
    clearRange: function() {
      this.getNative()[browser.ie9below ? "empty" : "removeAllRanges"]();
    }
  };
})();
