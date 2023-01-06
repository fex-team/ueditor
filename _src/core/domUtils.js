/**
 * Dom操作工具包
 * @file
 * @module UE.dom.domUtils
 * @since 1.2.6.1
 */

/**
 * Dom操作工具包
 * @unfile
 * @module UE.dom.domUtils
 */
function getDomNode(node, start, ltr, startFromChild, fn, guard) {
  var tmpNode = startFromChild && node[start],
    parent;
  !tmpNode && (tmpNode = node[ltr]);
  while (!tmpNode && (parent = (parent || node).parentNode)) {
    if (parent.tagName == "BODY" || (guard && !guard(parent))) {
      return null;
    }
    tmpNode = parent[ltr];
  }
  if (tmpNode && fn && !fn(tmpNode)) {
    return getDomNode(tmpNode, start, ltr, false, fn);
  }
  return tmpNode;
}
var attrFix = ie && browser.version < 9
  ? {
      tabindex: "tabIndex",
      readonly: "readOnly",
      for: "htmlFor",
      class: "className",
      maxlength: "maxLength",
      cellspacing: "cellSpacing",
      cellpadding: "cellPadding",
      rowspan: "rowSpan",
      colspan: "colSpan",
      usemap: "useMap",
      frameborder: "frameBorder"
    }
  : {
      tabindex: "tabIndex",
      readonly: "readOnly"
    },
  styleBlock = utils.listToMap([
    "-webkit-box",
    "-moz-box",
    "block",
    "list-item",
    "table",
    "table-row-group",
    "table-header-group",
    "table-footer-group",
    "table-row",
    "table-column-group",
    "table-column",
    "table-cell",
    "table-caption"
  ]);
var domUtils = (dom.domUtils = {
  //节点常量
  NODE_ELEMENT: 1,
  NODE_DOCUMENT: 9,
  NODE_TEXT: 3,
  NODE_COMMENT: 8,
  NODE_DOCUMENT_FRAGMENT: 11,

  //位置关系
  POSITION_IDENTICAL: 0,
  POSITION_DISCONNECTED: 1,
  POSITION_FOLLOWING: 2,
  POSITION_PRECEDING: 4,
  POSITION_IS_CONTAINED: 8,
  POSITION_CONTAINS: 16,
  //ie6使用其他的会有一段空白出现
  fillChar: ie && browser.version == "6" ? "\ufeff" : "\u200B",
  //-------------------------Node部分--------------------------------
  keys: {
    /*Backspace*/ 8: 1,
    /*Delete*/ 46: 1,
    /*Shift*/ 16: 1,
    /*Ctrl*/ 17: 1,
    /*Alt*/ 18: 1,
    37: 1,
    38: 1,
    39: 1,
    40: 1,
    13: 1 /*enter*/
  },
  /**
     * 获取节点A相对于节点B的位置关系
     * @method getPosition
     * @param { Node } nodeA 需要查询位置关系的节点A
     * @param { Node } nodeB 需要查询位置关系的节点B
     * @return { Number } 节点A与节点B的关系
     * @example
     * ```javascript
     * //output: 20
     * var position = UE.dom.domUtils.getPosition( document.documentElement, document.body );
     *
     * switch ( position ) {
     *
     *      //0
     *      case UE.dom.domUtils.POSITION_IDENTICAL:
     *          console.log('元素相同');
     *          break;
     *      //1
     *      case UE.dom.domUtils.POSITION_DISCONNECTED:
     *          console.log('两个节点在不同的文档中');
     *          break;
     *      //2
     *      case UE.dom.domUtils.POSITION_FOLLOWING:
     *          console.log('节点A在节点B之后');
     *          break;
     *      //4
     *      case UE.dom.domUtils.POSITION_PRECEDING;
     *          console.log('节点A在节点B之前');
     *          break;
     *      //8
     *      case UE.dom.domUtils.POSITION_IS_CONTAINED:
     *          console.log('节点A被节点B包含');
     *          break;
     *      case 10:
     *          console.log('节点A被节点B包含且节点A在节点B之后');
     *          break;
     *      //16
     *      case UE.dom.domUtils.POSITION_CONTAINS:
     *          console.log('节点A包含节点B');
     *          break;
     *      case 20:
     *          console.log('节点A包含节点B且节点A在节点B之前');
     *          break;
     *
     * }
     * ```
     */
  getPosition: function(nodeA, nodeB) {
    // 如果两个节点是同一个节点
    if (nodeA === nodeB) {
      // domUtils.POSITION_IDENTICAL
      return 0;
    }
    var node,
      parentsA = [nodeA],
      parentsB = [nodeB];
    node = nodeA;
    while ((node = node.parentNode)) {
      // 如果nodeB是nodeA的祖先节点
      if (node === nodeB) {
        // domUtils.POSITION_IS_CONTAINED + domUtils.POSITION_FOLLOWING
        return 10;
      }
      parentsA.push(node);
    }
    node = nodeB;
    while ((node = node.parentNode)) {
      // 如果nodeA是nodeB的祖先节点
      if (node === nodeA) {
        // domUtils.POSITION_CONTAINS + domUtils.POSITION_PRECEDING
        return 20;
      }
      parentsB.push(node);
    }
    parentsA.reverse();
    parentsB.reverse();
    if (parentsA[0] !== parentsB[0]) {
      // domUtils.POSITION_DISCONNECTED
      return 1;
    }
    var i = -1;
    while ((i++, parentsA[i] === parentsB[i])) {}
    nodeA = parentsA[i];
    nodeB = parentsB[i];
    while ((nodeA = nodeA.nextSibling)) {
      if (nodeA === nodeB) {
        // domUtils.POSITION_PRECEDING
        return 4;
      }
    }
    // domUtils.POSITION_FOLLOWING
    return 2;
  },

  /**
     * 检测节点node在父节点中的索引位置
     * @method getNodeIndex
     * @param { Node } node 需要检测的节点对象
     * @return { Number } 该节点在父节点中的位置
     * @see UE.dom.domUtils.getNodeIndex(Node,Boolean)
     */

  /**
     * 检测节点node在父节点中的索引位置， 根据给定的mergeTextNode参数决定是否要合并多个连续的文本节点为一个节点
     * @method getNodeIndex
     * @param { Node } node 需要检测的节点对象
     * @param { Boolean } mergeTextNode 是否合并多个连续的文本节点为一个节点
     * @return { Number } 该节点在父节点中的位置
     * @example
     * ```javascript
     *
     *      var node = document.createElement("div");
     *
     *      node.appendChild( document.createTextNode( "hello" ) );
     *      node.appendChild( document.createTextNode( "world" ) );
     *      node.appendChild( node = document.createElement( "div" ) );
     *
     *      //output: 2
     *      console.log( UE.dom.domUtils.getNodeIndex( node ) );
     *
     *      //output: 1
     *      console.log( UE.dom.domUtils.getNodeIndex( node, true ) );
     *
     * ```
     */
  getNodeIndex: function(node, ignoreTextNode) {
    var preNode = node,
      i = 0;
    while ((preNode = preNode.previousSibling)) {
      if (ignoreTextNode && preNode.nodeType == 3) {
        if (preNode.nodeType != preNode.nextSibling.nodeType) {
          i++;
        }
        continue;
      }
      i++;
    }
    return i;
  },

  /**
     * 检测节点node是否在给定的document对象上
     * @method inDoc
     * @param { Node } node 需要检测的节点对象
     * @param { DomDocument } doc 需要检测的document对象
     * @return { Boolean } 该节点node是否在给定的document的dom树上
     * @example
     * ```javascript
     *
     * var node = document.createElement("div");
     *
     * //output: false
     * console.log( UE.do.domUtils.inDoc( node, document ) );
     *
     * document.body.appendChild( node );
     *
     * //output: true
     * console.log( UE.do.domUtils.inDoc( node, document ) );
     *
     * ```
     */
  inDoc: function(node, doc) {
    return domUtils.getPosition(node, doc) == 10;
  },
  /**
     * 根据给定的过滤规则filterFn， 查找符合该过滤规则的node节点的第一个祖先节点，
     * 查找的起点是给定node节点的父节点。
     * @method findParent
     * @param { Node } node 需要查找的节点
     * @param { Function } filterFn 自定义的过滤方法。
     * @warning 查找的终点是到body节点为止
     * @remind 自定义的过滤方法filterFn接受一个Node对象作为参数， 该对象代表当前执行检测的祖先节点。 如果该
     *          节点满足过滤条件， 则要求返回true， 这时将直接返回该节点作为findParent()的结果， 否则， 请返回false。
     * @return { Node | Null } 如果找到符合过滤条件的节点， 就返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var filterNode = UE.dom.domUtils.findParent( document.body.firstChild, function ( node ) {
     *
     *     //由于查找的终点是body节点， 所以永远也不会匹配当前过滤器的条件， 即这里永远会返回false
     *     return node.tagName === "HTML";
     *
     * } );
     *
     * //output: true
     * console.log( filterNode === null );
     * ```
     */

  /**
     * 根据给定的过滤规则filterFn， 查找符合该过滤规则的node节点的第一个祖先节点，
     * 如果includeSelf的值为true，则查找的起点是给定的节点node， 否则， 起点是node的父节点
     * @method findParent
     * @param { Node } node 需要查找的节点
     * @param { Function } filterFn 自定义的过滤方法。
     * @param { Boolean } includeSelf 查找过程是否包含自身
     * @warning 查找的终点是到body节点为止
     * @remind 自定义的过滤方法filterFn接受一个Node对象作为参数， 该对象代表当前执行检测的祖先节点。 如果该
     *          节点满足过滤条件， 则要求返回true， 这时将直接返回该节点作为findParent()的结果， 否则， 请返回false。
     * @remind 如果includeSelf为true， 则过滤器第一次执行时的参数会是节点本身。
     *          反之， 过滤器第一次执行时的参数将是该节点的父节点。
     * @return { Node | Null } 如果找到符合过滤条件的节点， 就返回该节点， 否则返回NULL
     * @example
     * ```html
     * <body>
     *
     *      <div id="test">
     *      </div>
     *
     *      <script type="text/javascript">
     *
     *          //output: DIV, BODY
     *          var filterNode = UE.dom.domUtils.findParent( document.getElementById( "test" ), function ( node ) {
     *
     *              console.log( node.tagName );
     *              return false;
     *
     *          }, true );
     *
     *      </script>
     * </body>
     * ```
     */
  findParent: function(node, filterFn, includeSelf) {
    if (node && !domUtils.isBody(node)) {
      node = includeSelf ? node : node.parentNode;
      while (node) {
        if (!filterFn || filterFn(node) || domUtils.isBody(node)) {
          return filterFn && !filterFn(node) && domUtils.isBody(node)
            ? null
            : node;
        }
        node = node.parentNode;
      }
    }
    return null;
  },
  /**
     * 查找node的节点名为tagName的第一个祖先节点， 查找的起点是node节点的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var node = UE.dom.domUtils.findParentByTagName( document.getElementsByTagName("div")[0], [ "BODY" ] );
     * //output: BODY
     * console.log( node.tagName );
     * ```
     */

  /**
     * 查找node的节点名为tagName的祖先节点， 如果includeSelf的值为true，则查找的起点是给定的节点node，
     * 否则， 起点是node的父节点。
     * @method findParentByTagName
     * @param { Node } node 需要查找的节点对象
     * @param { Array } tagNames 需要查找的父节点的名称数组
     * @param { Boolean } includeSelf 查找过程是否包含node节点自身
     * @warning 查找的终点是到body节点为止
     * @return { Node | NULL } 如果找到符合条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var queryTarget = document.getElementsByTagName("div")[0];
     * var node = UE.dom.domUtils.findParentByTagName( queryTarget, [ "DIV" ], true );
     * //output: true
     * console.log( queryTarget === node );
     * ```
     */
  findParentByTagName: function(node, tagNames, includeSelf, excludeFn) {
    tagNames = utils.listToMap(utils.isArray(tagNames) ? tagNames : [tagNames]);
    return domUtils.findParent(
      node,
      function(node) {
        return tagNames[node.tagName] && !(excludeFn && excludeFn(node));
      },
      includeSelf
    );
  },
  /**
     * 查找节点node的祖先节点集合， 查找的起点是给定节点的父节点，结果集中不包含给定的节点。
     * @method findParents
     * @param { Node } node 需要查找的节点对象
     * @return { Array } 给定节点的祖先节点数组
     * @grammar UE.dom.domUtils.findParents(node)  => Array  //返回一个祖先节点数组集合，不包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf)  => Array  //返回一个祖先节点数组集合，includeSelf指定是否包含自身
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn)  => Array  //返回一个祖先节点数组集合，filterFn指定过滤条件，返回true的node将被选取
     * @grammar UE.dom.domUtils.findParents(node,includeSelf,filterFn,closerFirst)  => Array  //返回一个祖先节点数组集合，closerFirst为true的话，node的直接父亲节点是数组的第0个
     */

  /**
     * 查找节点node的祖先节点集合， 如果includeSelf的值为true，
     * 则返回的结果集中允许出现当前给定的节点， 否则， 该节点不会出现在其结果集中。
     * @method findParents
     * @param { Node } node 需要查找的节点对象
     * @param { Boolean } includeSelf 查找的结果中是否允许包含当前查找的节点对象
     * @return { Array } 给定节点的祖先节点数组
     */
  findParents: function(node, includeSelf, filterFn, closerFirst) {
    var parents = includeSelf && ((filterFn && filterFn(node)) || !filterFn)
      ? [node]
      : [];
    while ((node = domUtils.findParent(node, filterFn))) {
      parents.push(node);
    }
    return closerFirst ? parents : parents.reverse();
  },

  /**
     * 在节点node后面插入新节点newNode
     * @method insertAfter
     * @param { Node } node 目标节点
     * @param { Node } newNode 新插入的节点， 该节点将置于目标节点之后
     * @return { Node } 新插入的节点
     */
  insertAfter: function(node, newNode) {
    return node.nextSibling
      ? node.parentNode.insertBefore(newNode, node.nextSibling)
      : node.parentNode.appendChild(newNode);
  },

  /**
     * 删除节点node及其下属的所有节点
     * @method remove
     * @param { Node } node 需要删除的节点对象
     * @return { Node } 返回刚删除的节点对象
     * @example
     * ```html
     * <div id="test">
     *     <div id="child">你好</div>
     * </div>
     * <script>
     *     UE.dom.domUtils.remove( document.body, false );
     *     //output: false
     *     console.log( document.getElementById( "child" ) !== null );
     * </script>
     * ```
     */

  /**
     * 删除节点node，并根据keepChildren的值决定是否保留子节点
     * @method remove
     * @param { Node } node 需要删除的节点对象
     * @param { Boolean } keepChildren 是否需要保留子节点
     * @return { Node } 返回刚删除的节点对象
     * @example
     * ```html
     * <div id="test">
     *     <div id="child">你好</div>
     * </div>
     * <script>
     *     UE.dom.domUtils.remove( document.body, true );
     *     //output: true
     *     console.log( document.getElementById( "child" ) !== null );
     * </script>
     * ```
     */
  remove: function(node, keepChildren) {
    var parent = node.parentNode,
      child;
    if (parent) {
      if (keepChildren && node.hasChildNodes()) {
        while ((child = node.firstChild)) {
          parent.insertBefore(child, node);
        }
      }
      parent.removeChild(node);
    }
    return node;
  },

  /**
     * 取得node节点的下一个兄弟节点， 如果该节点其后没有兄弟节点， 则递归查找其父节点之后的第一个兄弟节点，
     * 直到找到满足条件的节点或者递归到BODY节点之后才会结束。
     * @method getNextDomNode
     * @param { Node } node 需要获取其后的兄弟节点的节点对象
     * @return { Node | NULL } 如果找满足条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```html
     *     <body>
     *      <div id="test">
     *          <span></span>
     *      </div>
     *      <i>xxx</i>
     * </body>
     * <script>
     *
     *     //output: i节点
     *     console.log( UE.dom.domUtils.getNextDomNode( document.getElementById( "test" ) ) );
     *
     * </script>
     * ```
     * @example
     * ```html
     * <body>
     *      <div>
     *          <span></span>
     *          <i id="test">xxx</i>
     *      </div>
     *      <b>xxx</b>
     * </body>
     * <script>
     *
     *     //由于id为test的i节点之后没有兄弟节点， 则查找其父节点（div）后面的兄弟节点
     *     //output: b节点
     *     console.log( UE.dom.domUtils.getNextDomNode( document.getElementById( "test" ) ) );
     *
     * </script>
     * ```
     */

  /**
     * 取得node节点的下一个兄弟节点， 如果startFromChild的值为ture，则先获取其子节点，
     * 如果有子节点则直接返回第一个子节点；如果没有子节点或者startFromChild的值为false，
     * 则执行<a href="#UE.dom.domUtils.getNextDomNode(Node)">getNextDomNode(Node node)</a>的查找过程。
     * @method getNextDomNode
     * @param { Node } node 需要获取其后的兄弟节点的节点对象
     * @param { Boolean } startFromChild 查找过程是否从其子节点开始
     * @return { Node | NULL } 如果找满足条件的节点， 则返回该节点， 否则返回NULL
     * @see UE.dom.domUtils.getNextDomNode(Node)
     */
  getNextDomNode: function(node, startFromChild, filterFn, guard) {
    return getDomNode(
      node,
      "firstChild",
      "nextSibling",
      startFromChild,
      filterFn,
      guard
    );
  },
  getPreDomNode: function(node, startFromChild, filterFn, guard) {
    return getDomNode(
      node,
      "lastChild",
      "previousSibling",
      startFromChild,
      filterFn,
      guard
    );
  },
  /**
     * 检测节点node是否属是UEditor定义的bookmark节点
     * @method isBookmarkNode
     * @private
     * @param { Node } node 需要检测的节点对象
     * @return { Boolean } 是否是bookmark节点
     * @example
     * ```html
     * <span id="_baidu_bookmark_1"></span>
     * <script>
     *      var bookmarkNode = document.getElementById("_baidu_bookmark_1");
     *      //output: true
     *      console.log( UE.dom.domUtils.isBookmarkNode( bookmarkNode ) );
     * </script>
     * ```
     */
  isBookmarkNode: function(node) {
    return node.nodeType == 1 && node.id && /^_baidu_bookmark_/i.test(node.id);
  },
  /**
     * 获取节点node所属的window对象
     * @method  getWindow
     * @param { Node } node 节点对象
     * @return { Window } 当前节点所属的window对象
     * @example
     * ```javascript
     * //output: true
     * console.log( UE.dom.domUtils.getWindow( document.body ) === window );
     * ```
     */
  getWindow: function(node) {
    var doc = node.ownerDocument || node;
    return doc.defaultView || doc.parentWindow;
  },
  /**
     * 获取离nodeA与nodeB最近的公共的祖先节点
     * @method  getCommonAncestor
     * @param { Node } nodeA 第一个节点
     * @param { Node } nodeB 第二个节点
     * @remind 如果给定的两个节点是同一个节点， 将直接返回该节点。
     * @return { Node | NULL } 如果未找到公共节点， 返回NULL， 否则返回最近的公共祖先节点。
     * @example
     * ```javascript
     * var commonAncestor = UE.dom.domUtils.getCommonAncestor( document.body, document.body.firstChild );
     * //output: true
     * console.log( commonAncestor.tagName.toLowerCase() === 'body' );
     * ```
     */
  getCommonAncestor: function(nodeA, nodeB) {
    if (nodeA === nodeB) return nodeA;
    var parentsA = [nodeA],
      parentsB = [nodeB],
      parent = nodeA,
      i = -1;
    while ((parent = parent.parentNode)) {
      if (parent === nodeB) {
        return parent;
      }
      parentsA.push(parent);
    }
    parent = nodeB;
    while ((parent = parent.parentNode)) {
      if (parent === nodeA) return parent;
      parentsB.push(parent);
    }
    parentsA.reverse();
    parentsB.reverse();
    while ((i++, parentsA[i] === parentsB[i])) {}
    return i == 0 ? null : parentsA[i - 1];
  },
  /**
     * 清除node节点左右连续为空的兄弟inline节点
     * @method clearEmptySibling
     * @param { Node } node 执行的节点对象， 如果该节点的左右连续的兄弟节点是空的inline节点，
     * 则这些兄弟节点将被删除
     * @grammar UE.dom.domUtils.clearEmptySibling(node,ignoreNext)  //ignoreNext指定是否忽略右边空节点
     * @grammar UE.dom.domUtils.clearEmptySibling(node,ignoreNext,ignorePre)  //ignorePre指定是否忽略左边空节点
     * @example
     * ```html
     * <body>
     *     <div></div>
     *     <span id="test"></span>
     *     <i></i>
     *     <b></b>
     *     <em>xxx</em>
     *     <span></span>
     * </body>
     * <script>
     *
     *      UE.dom.domUtils.clearEmptySibling( document.getElementById( "test" ) );
     *
     *      //output: <div></div><span id="test"></span><em>xxx</em><span></span>
     *      console.log( document.body.innerHTML );
     *
     * </script>
     * ```
     */

  /**
     * 清除node节点左右连续为空的兄弟inline节点， 如果ignoreNext的值为true，
     * 则忽略对右边兄弟节点的操作。
     * @method clearEmptySibling
     * @param { Node } node 执行的节点对象， 如果该节点的左右连续的兄弟节点是空的inline节点，
     * @param { Boolean } ignoreNext 是否忽略忽略对右边的兄弟节点的操作
     * 则这些兄弟节点将被删除
     * @see UE.dom.domUtils.clearEmptySibling(Node)
     */

  /**
     * 清除node节点左右连续为空的兄弟inline节点， 如果ignoreNext的值为true，
     * 则忽略对右边兄弟节点的操作， 如果ignorePre的值为true，则忽略对左边兄弟节点的操作。
     * @method clearEmptySibling
     * @param { Node } node 执行的节点对象， 如果该节点的左右连续的兄弟节点是空的inline节点，
     * @param { Boolean } ignoreNext 是否忽略忽略对右边的兄弟节点的操作
     * @param { Boolean } ignorePre 是否忽略忽略对左边的兄弟节点的操作
     * 则这些兄弟节点将被删除
     * @see UE.dom.domUtils.clearEmptySibling(Node)
     */
  clearEmptySibling: function(node, ignoreNext, ignorePre) {
    function clear(next, dir) {
      var tmpNode;
      while (
        next &&
        !domUtils.isBookmarkNode(next) &&
        (domUtils.isEmptyInlineElement(next) ||
          //这里不能把空格算进来会吧空格干掉，出现文字间的空格丢掉了
          !new RegExp("[^\t\n\r" + domUtils.fillChar + "]").test(
            next.nodeValue
          ))
      ) {
        tmpNode = next[dir];
        domUtils.remove(next);
        next = tmpNode;
      }
    }
    !ignoreNext && clear(node.nextSibling, "nextSibling");
    !ignorePre && clear(node.previousSibling, "previousSibling");
  },
  /**
     * 将一个文本节点textNode拆分成两个文本节点，offset指定拆分位置
     * @method split
     * @param { Node } textNode 需要拆分的文本节点对象
     * @param { int } offset 需要拆分的位置， 位置计算从0开始
     * @return { Node } 拆分后形成的新节点
     * @example
     * ```html
     * <div id="test">abcdef</div>
     * <script>
     *      var newNode = UE.dom.domUtils.split( document.getElementById( "test" ).firstChild, 3 );
     *      //output: def
     *      console.log( newNode.nodeValue );
     * </script>
     * ```
     */
  split: function(node, offset) {
    var doc = node.ownerDocument;
    if (browser.ie && offset == node.nodeValue.length) {
      var next = doc.createTextNode("");
      return domUtils.insertAfter(node, next);
    }
    var retval = node.splitText(offset);
    //ie8下splitText不会跟新childNodes,我们手动触发他的更新
    if (browser.ie8) {
      var tmpNode = doc.createTextNode("");
      domUtils.insertAfter(retval, tmpNode);
      domUtils.remove(tmpNode);
    }
    return retval;
  },

  /**
     * 检测文本节点textNode是否为空节点（包括空格、换行、占位符等字符）
     * @method  isWhitespace
     * @param { Node } node 需要检测的节点对象
     * @return { Boolean } 检测的节点是否为空
     * @example
     * ```html
     * <div id="test">
     *
     * </div>
     * <script>
     *      //output: true
     *      console.log( UE.dom.domUtils.isWhitespace( document.getElementById("test").firstChild ) );
     * </script>
     * ```
     */
  isWhitespace: function(node) {
    return !new RegExp("[^ \t\n\r" + domUtils.fillChar + "]").test(
      node.nodeValue
    );
  },
  /**
     * 获取元素element相对于viewport的位置坐标
     * @method getXY
     * @param { Node } element 需要计算位置的节点对象
     * @return { Object } 返回形如{x:left,y:top}的一个key-value映射对象， 其中键x代表水平偏移距离，
     *                          y代表垂直偏移距离。
     *
     * @example
     * ```javascript
     * var location = UE.dom.domUtils.getXY( document.getElementById("test") );
     * //output: test的坐标为: 12, 24
     * console.log( 'test的坐标为： ', location.x, ',', location.y );
     * ```
     */
  getXY: function(element) {
    var x = 0,
      y = 0;
    while (element.offsetParent) {
      y += element.offsetTop;
      x += element.offsetLeft;
      element = element.offsetParent;
    }
    return { x: x, y: y };
  },
  /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @method on
     * @param { Node } element 需要绑定事件的节点对象
     * @param { String } type 绑定的事件类型
     * @param { Function } handler 事件处理器
     * @example
     * ```javascript
     * UE.dom.domUtils.on(document.body,"click",function(e){
     *     //e为事件对象，this为被点击元素对戏那个
     * });
     * ```
     */

  /**
     * 为元素element绑定原生DOM事件，type为事件类型，handler为处理函数
     * @method on
     * @param { Node } element 需要绑定事件的节点对象
     * @param { Array } type 绑定的事件类型数组
     * @param { Function } handler 事件处理器
     * @example
     * ```javascript
     * UE.dom.domUtils.on(document.body,["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */
  on: function(element, type, handler) {
    var types = utils.isArray(type) ? type : utils.trim(type).split(/\s+/),
      k = types.length;
    if (k)
      while (k--) {
        type = types[k];
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else {
          if (!handler._d) {
            handler._d = {
              els: []
            };
          }
          var key = type + handler.toString(),
            index = utils.indexOf(handler._d.els, element);
          if (!handler._d[key] || index == -1) {
            if (index == -1) {
              handler._d.els.push(element);
            }
            if (!handler._d[key]) {
              handler._d[key] = function(evt) {
                return handler.call(evt.srcElement, evt || window.event);
              };
            }

            element.attachEvent("on" + type, handler._d[key]);
          }
        }
      }
    element = null;
  },
  /**
     * 解除DOM事件绑定
     * @method un
     * @param { Node } element 需要解除事件绑定的节点对象
     * @param { String } type 需要接触绑定的事件类型
     * @param { Function } handler 对应的事件处理器
     * @example
     * ```javascript
     * UE.dom.domUtils.un(document.body,"click",function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */

  /**
     * 解除DOM事件绑定
     * @method un
     * @param { Node } element 需要解除事件绑定的节点对象
     * @param { Array } type 需要接触绑定的事件类型数组
     * @param { Function } handler 对应的事件处理器
     * @example
     * ```javascript
     * UE.dom.domUtils.un(document.body, ["click","mousedown"],function(evt){
     *     //evt为事件对象，this为被点击元素对象
     * });
     * ```
     */
  un: function(element, type, handler) {
    var types = utils.isArray(type) ? type : utils.trim(type).split(/\s+/),
      k = types.length;
    if (k)
      while (k--) {
        type = types[k];
        if (element.removeEventListener) {
          element.removeEventListener(type, handler, false);
        } else {
          var key = type + handler.toString();
          try {
            element.detachEvent(
              "on" + type,
              handler._d ? handler._d[key] : handler
            );
          } catch (e) {}
          if (handler._d && handler._d[key]) {
            var index = utils.indexOf(handler._d.els, element);
            if (index != -1) {
              handler._d.els.splice(index, 1);
            }
            handler._d.els.length == 0 && delete handler._d[key];
          }
        }
      }
  },

  /**
     * 比较节点nodeA与节点nodeB是否具有相同的标签名、属性名以及属性值
     * @method  isSameElement
     * @param { Node } nodeA 需要比较的节点
     * @param { Node } nodeB 需要比较的节点
     * @return { Boolean } 两个节点是否具有相同的标签名、属性名以及属性值
     * @example
     * ```html
     * <span style="font-size:12px">ssss</span>
     * <span style="font-size:12px">bbbbb</span>
     * <span style="font-size:13px">ssss</span>
     * <span style="font-size:14px">bbbbb</span>
     *
     * <script>
     *
     *     var nodes = document.getElementsByTagName( "span" );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.isSameElement( nodes[0], nodes[1] ) );
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.isSameElement( nodes[2], nodes[3] ) );
     *
     * </script>
     * ```
     */
  isSameElement: function(nodeA, nodeB) {
    if (nodeA.tagName != nodeB.tagName) {
      return false;
    }
    var thisAttrs = nodeA.attributes,
      otherAttrs = nodeB.attributes;
    if (!ie && thisAttrs.length != otherAttrs.length) {
      return false;
    }
    var attrA,
      attrB,
      al = 0,
      bl = 0;
    for (var i = 0; (attrA = thisAttrs[i++]); ) {
      if (attrA.nodeName == "style") {
        if (attrA.specified) {
          al++;
        }
        if (domUtils.isSameStyle(nodeA, nodeB)) {
          continue;
        } else {
          return false;
        }
      }
      if (ie) {
        if (attrA.specified) {
          al++;
          attrB = otherAttrs.getNamedItem(attrA.nodeName);
        } else {
          continue;
        }
      } else {
        attrB = nodeB.attributes[attrA.nodeName];
      }
      if (!attrB.specified || attrA.nodeValue != attrB.nodeValue) {
        return false;
      }
    }
    // 有可能attrB的属性包含了attrA的属性之外还有自己的属性
    if (ie) {
      for (i = 0; (attrB = otherAttrs[i++]); ) {
        if (attrB.specified) {
          bl++;
        }
      }
      if (al != bl) {
        return false;
      }
    }
    return true;
  },

  /**
     * 判断节点nodeA与节点nodeB的元素的style属性是否一致
     * @method isSameStyle
     * @param { Node } nodeA 需要比较的节点
     * @param { Node } nodeB 需要比较的节点
     * @return { Boolean } 两个节点是否具有相同的style属性值
     * @example
     * ```html
     * <span style="font-size:12px">ssss</span>
     * <span style="font-size:12px">bbbbb</span>
     * <span style="font-size:13px">ssss</span>
     * <span style="font-size:14px">bbbbb</span>
     *
     * <script>
     *
     *     var nodes = document.getElementsByTagName( "span" );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.isSameStyle( nodes[0], nodes[1] ) );
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.isSameStyle( nodes[2], nodes[3] ) );
     *
     * </script>
     * ```
     */
  isSameStyle: function(nodeA, nodeB) {
    var styleA = nodeA.style.cssText
      .replace(/( ?; ?)/g, ";")
      .replace(/( ?: ?)/g, ":"),
      styleB = nodeB.style.cssText
        .replace(/( ?; ?)/g, ";")
        .replace(/( ?: ?)/g, ":");
    if (browser.opera) {
      styleA = nodeA.style;
      styleB = nodeB.style;
      if (styleA.length != styleB.length) return false;
      for (var p in styleA) {
        if (/^(\d+|csstext)$/i.test(p)) {
          continue;
        }
        if (styleA[p] != styleB[p]) {
          return false;
        }
      }
      return true;
    }
    if (!styleA || !styleB) {
      return styleA == styleB;
    }
    styleA = styleA.split(";");
    styleB = styleB.split(";");
    if (styleA.length != styleB.length) {
      return false;
    }
    for (var i = 0, ci; (ci = styleA[i++]); ) {
      if (utils.indexOf(styleB, ci) == -1) {
        return false;
      }
    }
    return true;
  },
  /**
     * 检查节点node是否为block元素
     * @method isBlockElm
     * @param { Node } node 需要检测的节点对象
     * @return { Boolean } 是否是block元素节点
     * @warning 该方法的判断规则如下： 如果该元素原本是block元素， 则不论该元素当前的css样式是什么都会返回true；
     *          否则，检测该元素的css样式， 如果该元素当前是block元素， 则返回true。 其余情况下都返回false。
     * @example
     * ```html
     * <span id="test1" style="display: block"></span>
     * <span id="test2"></span>
     * <div id="test3" style="display: inline"></div>
     *
     * <script>
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.isBlockElm( document.getElementById("test1") ) );
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.isBlockElm( document.getElementById("test2") ) );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.isBlockElm( document.getElementById("test3") ) );
     *
     * </script>
     * ```
     */
  isBlockElm: function(node) {
    return (
      node.nodeType == 1 &&
      (dtd.$block[node.tagName] ||
        styleBlock[domUtils.getComputedStyle(node, "display")]) &&
      !dtd.$nonChild[node.tagName]
    );
  },
  /**
     * 检测node节点是否为body节点
     * @method isBody
     * @param { Element } node 需要检测的dom元素
     * @return { Boolean } 给定的元素是否是body元素
     * @example
     * ```javascript
     * //output: true
     * console.log( UE.dom.domUtils.isBody( document.body ) );
     * ```
     */
  isBody: function(node) {
    return node && node.nodeType == 1 && node.tagName.toLowerCase() == "body";
  },
  /**
     * 以node节点为分界，将该节点的指定祖先节点parent拆分成两个独立的节点，
     * 拆分形成的两个节点之间是node节点
     * @method breakParent
     * @param { Node } node 作为分界的节点对象
     * @param { Node } parent 该节点必须是node节点的祖先节点， 且是block节点。
     * @return { Node } 给定的node分界节点
     * @example
     * ```javascript
     *
     *      var node = document.createElement("span"),
     *          wrapNode = document.createElement( "div" ),
     *          parent = document.createElement("p");
     *
     *      parent.appendChild( node );
     *      wrapNode.appendChild( parent );
     *
     *      //拆分前
     *      //output: <p><span></span></p>
     *      console.log( wrapNode.innerHTML );
     *
     *
     *      UE.dom.domUtils.breakParent( node, parent );
     *      //拆分后
     *      //output: <p></p><span></span><p></p>
     *      console.log( wrapNode.innerHTML );
     *
     * ```
     */
  breakParent: function(node, parent) {
    var tmpNode,
      parentClone = node,
      clone = node,
      leftNodes,
      rightNodes;
    do {
      parentClone = parentClone.parentNode;
      if (leftNodes) {
        tmpNode = parentClone.cloneNode(false);
        tmpNode.appendChild(leftNodes);
        leftNodes = tmpNode;
        tmpNode = parentClone.cloneNode(false);
        tmpNode.appendChild(rightNodes);
        rightNodes = tmpNode;
      } else {
        leftNodes = parentClone.cloneNode(false);
        rightNodes = leftNodes.cloneNode(false);
      }
      while ((tmpNode = clone.previousSibling)) {
        leftNodes.insertBefore(tmpNode, leftNodes.firstChild);
      }
      while ((tmpNode = clone.nextSibling)) {
        rightNodes.appendChild(tmpNode);
      }
      clone = parentClone;
    } while (parent !== parentClone);
    tmpNode = parent.parentNode;
    tmpNode.insertBefore(leftNodes, parent);
    tmpNode.insertBefore(rightNodes, parent);
    tmpNode.insertBefore(node, rightNodes);
    domUtils.remove(parent);
    return node;
  },
  /**
     * 检查节点node是否是空inline节点
     * @method  isEmptyInlineElement
     * @param { Node } node 需要检测的节点对象
     * @return { Number }  如果给定的节点是空的inline节点， 则返回1, 否则返回0。
     * @example
     * ```html
     * <b><i></i></b> => 1
     * <b><i></i><u></u></b> => 1
     * <b></b> => 1
     * <b>xx<i></i></b> => 0
     * ```
     */
  isEmptyInlineElement: function(node) {
    if (node.nodeType != 1 || !dtd.$removeEmpty[node.tagName]) {
      return 0;
    }
    node = node.firstChild;
    while (node) {
      //如果是创建的bookmark就跳过
      if (domUtils.isBookmarkNode(node)) {
        return 0;
      }
      if (
        (node.nodeType == 1 && !domUtils.isEmptyInlineElement(node)) ||
        (node.nodeType == 3 && !domUtils.isWhitespace(node))
      ) {
        return 0;
      }
      node = node.nextSibling;
    }
    return 1;
  },

  /**
     * 删除node节点下首尾两端的空白文本子节点
     * @method trimWhiteTextNode
     * @param { Element } node 需要执行删除操作的元素对象
     * @example
     * ```javascript
     *      var node = document.createElement("div");
     *
     *      node.appendChild( document.createTextNode( "" ) );
     *
     *      node.appendChild( document.createElement("div") );
     *
     *      node.appendChild( document.createTextNode( "" ) );
     *
     *      //3
     *      console.log( node.childNodes.length );
     *
     *      UE.dom.domUtils.trimWhiteTextNode( node );
     *
     *      //1
     *      console.log( node.childNodes.length );
     * ```
     */
  trimWhiteTextNode: function(node) {
    function remove(dir) {
      var child;
      while (
        (child = node[dir]) &&
        child.nodeType == 3 &&
        domUtils.isWhitespace(child)
      ) {
        node.removeChild(child);
      }
    }
    remove("firstChild");
    remove("lastChild");
  },

  /**
     * 合并node节点下相同的子节点
     * @name mergeChild
     * @desc
     * UE.dom.domUtils.mergeChild(node,tagName) //tagName要合并的子节点的标签
     * @example
     * <p><span style="font-size:12px;">xx<span style="font-size:12px;">aa</span>xx</span></p>
     * ==> UE.dom.domUtils.mergeChild(node,'span')
     * <p><span style="font-size:12px;">xxaaxx</span></p>
     */
  mergeChild: function(node, tagName, attrs) {
    var list = domUtils.getElementsByTagName(node, node.tagName.toLowerCase());
    for (var i = 0, ci; (ci = list[i++]); ) {
      if (!ci.parentNode || domUtils.isBookmarkNode(ci)) {
        continue;
      }
      //span单独处理
      if (ci.tagName.toLowerCase() == "span") {
        if (node === ci.parentNode) {
          domUtils.trimWhiteTextNode(node);
          if (node.childNodes.length == 1) {
            node.style.cssText = ci.style.cssText + ";" + node.style.cssText;
            domUtils.remove(ci, true);
            continue;
          }
        }
        ci.style.cssText = node.style.cssText + ";" + ci.style.cssText;
        if (attrs) {
          var style = attrs.style;
          if (style) {
            style = style.split(";");
            for (var j = 0, s; (s = style[j++]); ) {
              ci.style[utils.cssStyleToDomStyle(s.split(":")[0])] = s.split(
                ":"
              )[1];
            }
          }
        }
        if (domUtils.isSameStyle(ci, node)) {
          domUtils.remove(ci, true);
        }
        continue;
      }
      if (domUtils.isSameElement(node, ci)) {
        domUtils.remove(ci, true);
      }
    }
  },

  /**
     * 原生方法getElementsByTagName的封装
     * @method getElementsByTagName
     * @param { Node } node 目标节点对象
     * @param { String } tagName 需要查找的节点的tagName， 多个tagName以空格分割
     * @return { Array } 符合条件的节点集合
     */
  getElementsByTagName: function(node, name, filter) {
    if (filter && utils.isString(filter)) {
      var className = filter;
      filter = function(node) {
        return domUtils.hasClass(node, className);
      };
    }
    name = utils.trim(name).replace(/[ ]{2,}/g, " ").split(" ");
    var arr = [];
    for (var n = 0, ni; (ni = name[n++]); ) {
      var list = node.getElementsByTagName(ni);
      for (var i = 0, ci; (ci = list[i++]); ) {
        if (!filter || filter(ci)) arr.push(ci);
      }
    }

    return arr;
  },
  /**
     * 将节点node提取到父节点上
     * @method mergeToParent
     * @param { Element } node 需要提取的元素对象
     * @example
     * ```html
     * <div id="parent">
     *     <div id="sub">
     *         <span id="child"></span>
     *     </div>
     * </div>
     *
     * <script>
     *
     *     var child = document.getElementById( "child" );
     *
     *     //output: sub
     *     console.log( child.parentNode.id );
     *
     *     UE.dom.domUtils.mergeToParent( child );
     *
     *     //output: parent
     *     console.log( child.parentNode.id );
     *
     * </script>
     * ```
     */
  mergeToParent: function(node) {
    var parent = node.parentNode;
    while (parent && dtd.$removeEmpty[parent.tagName]) {
      if (parent.tagName == node.tagName || parent.tagName == "A") {
        //针对a标签单独处理
        domUtils.trimWhiteTextNode(parent);
        //span需要特殊处理  不处理这样的情况 <span stlye="color:#fff">xxx<span style="color:#ccc">xxx</span>xxx</span>
        if (
          (parent.tagName == "SPAN" && !domUtils.isSameStyle(parent, node)) ||
          (parent.tagName == "A" && node.tagName == "SPAN")
        ) {
          if (parent.childNodes.length > 1 || parent !== node.parentNode) {
            node.style.cssText =
              parent.style.cssText + ";" + node.style.cssText;
            parent = parent.parentNode;
            continue;
          } else {
            parent.style.cssText += ";" + node.style.cssText;
            //trace:952 a标签要保持下划线
            if (parent.tagName == "A") {
              parent.style.textDecoration = "underline";
            }
          }
        }
        if (parent.tagName != "A") {
          parent === node.parentNode && domUtils.remove(node, true);
          break;
        }
      }
      parent = parent.parentNode;
    }
  },
  /**
     * 合并节点node的左右兄弟节点
     * @method mergeSibling
     * @param { Element } node 需要合并的目标节点
     * @example
     * ```html
     * <b>xxxx</b><b id="test">ooo</b><b>xxxx</b>
     *
     * <script>
     *     var demoNode = document.getElementById("test");
     *     UE.dom.domUtils.mergeSibling( demoNode );
     *     //output: xxxxoooxxxx
     *     console.log( demoNode.innerHTML );
     * </script>
     * ```
     */

  /**
     * 合并节点node的左右兄弟节点， 可以根据给定的条件选择是否忽略合并左节点。
     * @method mergeSibling
     * @param { Element } node 需要合并的目标节点
     * @param { Boolean } ignorePre 是否忽略合并左节点
     * @example
     * ```html
     * <b>xxxx</b><b id="test">ooo</b><b>xxxx</b>
     *
     * <script>
     *     var demoNode = document.getElementById("test");
     *     UE.dom.domUtils.mergeSibling( demoNode, true );
     *     //output: oooxxxx
     *     console.log( demoNode.innerHTML );
     * </script>
     * ```
     */

  /**
     * 合并节点node的左右兄弟节点，可以根据给定的条件选择是否忽略合并左右节点。
     * @method mergeSibling
     * @param { Element } node 需要合并的目标节点
     * @param { Boolean } ignorePre 是否忽略合并左节点
     * @param { Boolean } ignoreNext 是否忽略合并右节点
     * @remind 如果同时忽略左右节点， 则该操作什么也不会做
     * @example
     * ```html
     * <b>xxxx</b><b id="test">ooo</b><b>xxxx</b>
     *
     * <script>
     *     var demoNode = document.getElementById("test");
     *     UE.dom.domUtils.mergeSibling( demoNode, false, true );
     *     //output: xxxxooo
     *     console.log( demoNode.innerHTML );
     * </script>
     * ```
     */
  mergeSibling: function(node, ignorePre, ignoreNext) {
    function merge(rtl, start, node) {
      var next;
      if (
        (next = node[rtl]) &&
        !domUtils.isBookmarkNode(next) &&
        next.nodeType == 1 &&
        domUtils.isSameElement(node, next)
      ) {
        while (next.firstChild) {
          if (start == "firstChild") {
            node.insertBefore(next.lastChild, node.firstChild);
          } else {
            node.appendChild(next.firstChild);
          }
        }
        domUtils.remove(next);
      }
    }
    !ignorePre && merge("previousSibling", "firstChild", node);
    !ignoreNext && merge("nextSibling", "lastChild", node);
  },

  /**
     * 设置节点node及其子节点不会被选中
     * @method unSelectable
     * @param { Element } node 需要执行操作的dom元素
     * @remind 执行该操作后的节点， 将不能被鼠标选中
     * @example
     * ```javascript
     * UE.dom.domUtils.unSelectable( document.body );
     * ```
     */
  unSelectable: (ie && browser.ie9below) || browser.opera
    ? function(node) {
        //for ie9
        node.onselectstart = function() {
          return false;
        };
        node.onclick = node.onkeyup = node.onkeydown = function() {
          return false;
        };
        node.unselectable = "on";
        node.setAttribute("unselectable", "on");
        for (var i = 0, ci; (ci = node.all[i++]); ) {
          switch (ci.tagName.toLowerCase()) {
            case "iframe":
            case "textarea":
            case "input":
            case "select":
              break;
            default:
              ci.unselectable = "on";
              node.setAttribute("unselectable", "on");
          }
        }
      }
    : function(node) {
        node.style.MozUserSelect = node.style.webkitUserSelect = node.style.msUserSelect = node.style.KhtmlUserSelect =
          "none";
      },
  /**
     * 删除节点node上的指定属性名称的属性
     * @method  removeAttributes
     * @param { Node } node 需要删除属性的节点对象
     * @param { String } attrNames 可以是空格隔开的多个属性名称，该操作将会依次删除相应的属性
     * @example
     * ```html
     * <div id="wrap">
     *      <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * </div>
     *
     * <script>
     *
     *     UE.dom.domUtils.removeAttributes( document.getElementById( "test" ), "id name" );
     *
     *     //output: <span style="font-size:14px;">xxxxx</span>
     *     console.log( document.getElementById("wrap").innerHTML );
     *
     * </script>
     * ```
     */

  /**
     * 删除节点node上的指定属性名称的属性
     * @method  removeAttributes
     * @param { Node } node 需要删除属性的节点对象
     * @param { Array } attrNames 需要删除的属性名数组
     * @example
     * ```html
     * <div id="wrap">
     *      <span style="font-size:14px;" id="test" name="followMe">xxxxx</span>
     * </div>
     *
     * <script>
     *
     *     UE.dom.domUtils.removeAttributes( document.getElementById( "test" ), ["id", "name"] );
     *
     *     //output: <span style="font-size:14px;">xxxxx</span>
     *     console.log( document.getElementById("wrap").innerHTML );
     *
     * </script>
     * ```
     */
  removeAttributes: function(node, attrNames) {
    attrNames = utils.isArray(attrNames)
      ? attrNames
      : utils.trim(attrNames).replace(/[ ]{2,}/g, " ").split(" ");
    for (var i = 0, ci; (ci = attrNames[i++]); ) {
      ci = attrFix[ci] || ci;
      switch (ci) {
        case "className":
          node[ci] = "";
          break;
        case "style":
          node.style.cssText = "";
          var val = node.getAttributeNode("style");
          !browser.ie && val && node.removeAttributeNode(val);
      }
      node.removeAttribute(ci);
    }
  },
  /**
     * 在doc下创建一个标签名为tag，属性为attrs的元素
     * @method createElement
     * @param { DomDocument } doc 新创建的元素属于该document节点创建
     * @param { String } tagName 需要创建的元素的标签名
     * @param { Object } attrs 新创建的元素的属性key-value集合
     * @return { Element } 新创建的元素对象
     * @example
     * ```javascript
     * var ele = UE.dom.domUtils.createElement( document, 'div', {
     *     id: 'test'
     * } );
     *
     * //output: DIV
     * console.log( ele.tagName );
     *
     * //output: test
     * console.log( ele.id );
     *
     * ```
     */
  createElement: function(doc, tag, attrs) {
    return domUtils.setAttributes(doc.createElement(tag), attrs);
  },
  /**
     * 为节点node添加属性attrs，attrs为属性键值对
     * @method setAttributes
     * @param { Element } node 需要设置属性的元素对象
     * @param { Object } attrs 需要设置的属性名-值对
     * @return { Element } 设置属性的元素对象
     * @example
     * ```html
     * <span id="test"></span>
     *
     * <script>
     *
     *     var testNode = UE.dom.domUtils.setAttributes( document.getElementById( "test" ), {
     *         id: 'demo'
     *     } );
     *
     *     //output: demo
     *     console.log( testNode.id );
     *
     * </script>
     *
     */
  setAttributes: function(node, attrs) {
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        var value = attrs[attr];
        switch (attr) {
          case "class":
            //ie下要这样赋值，setAttribute不起作用
            node.className = value;
            break;
          case "style":
            node.style.cssText = node.style.cssText + ";" + value;
            break;
          case "innerHTML":
            node[attr] = value;
            break;
          case "value":
            node.value = value;
            break;
          default:
            node.setAttribute(attrFix[attr] || attr, value);
        }
      }
    }
    return node;
  },

  /**
     * 获取元素element经过计算后的样式值
     * @method getComputedStyle
     * @param { Element } element 需要获取样式的元素对象
     * @param { String } styleName 需要获取的样式名
     * @return { String } 获取到的样式值
     * @example
     * ```html
     * <style type="text/css">
     *      #test {
     *          font-size: 15px;
     *      }
     * </style>
     *
     * <span id="test"></span>
     *
     * <script>
     *     //output: 15px
     *     console.log( UE.dom.domUtils.getComputedStyle( document.getElementById( "test" ), 'font-size' ) );
     * </script>
     * ```
     */
  getComputedStyle: function(element, styleName) {
    //一下的属性单独处理
    var pros = "width height top left";

    if (pros.indexOf(styleName) > -1) {
      return (
        element[
          "offset" +
            styleName.replace(/^\w/, function(s) {
              return s.toUpperCase();
            })
        ] + "px"
      );
    }
    //忽略文本节点
    if (element.nodeType == 3) {
      element = element.parentNode;
    }
    //ie下font-size若body下定义了font-size，则从currentStyle里会取到这个font-size. 取不到实际值，故此修改.
    if (
      browser.ie &&
      browser.version < 9 &&
      styleName == "font-size" &&
      !element.style.fontSize &&
      !dtd.$empty[element.tagName] &&
      !dtd.$nonChild[element.tagName]
    ) {
      var span = element.ownerDocument.createElement("span");
      span.style.cssText = "padding:0;border:0;font-family:simsun;";
      span.innerHTML = ".";
      element.appendChild(span);
      var result = span.offsetHeight;
      element.removeChild(span);
      span = null;
      return result + "px";
    }
    try {
      var value =
        domUtils.getStyle(element, styleName) ||
        (window.getComputedStyle
          ? domUtils
              .getWindow(element)
              .getComputedStyle(element, "")
              .getPropertyValue(styleName)
          : (element.currentStyle || element.style)[
              utils.cssStyleToDomStyle(styleName)
            ]);
    } catch (e) {
      return "";
    }
    return utils.transUnitToPx(utils.fixColor(styleName, value));
  },
  /**
     * 删除元素element指定的className
     * @method removeClasses
     * @param { Element } ele 需要删除class的元素节点
     * @param { String } classNames 需要删除的className， 多个className之间以空格分开
     * @example
     * ```html
     * <span id="test" class="test1 test2 test3">xxx</span>
     *
     * <script>
     *
     *     var testNode = document.getElementById( "test" );
     *     UE.dom.domUtils.removeClasses( testNode, "test1 test2" );
     *
     *     //output: test3
     *     console.log( testNode.className );
     *
     * </script>
     * ```
     */

  /**
     * 删除元素element指定的className
     * @method removeClasses
     * @param { Element } ele 需要删除class的元素节点
     * @param { Array } classNames 需要删除的className数组
     * @example
     * ```html
     * <span id="test" class="test1 test2 test3">xxx</span>
     *
     * <script>
     *
     *     var testNode = document.getElementById( "test" );
     *     UE.dom.domUtils.removeClasses( testNode, ["test1", "test2"] );
     *
     *     //output: test3
     *     console.log( testNode.className );
     *
     * </script>
     * ```
     */
  removeClasses: function(elm, classNames) {
    classNames = utils.isArray(classNames)
      ? classNames
      : utils.trim(classNames).replace(/[ ]{2,}/g, " ").split(" ");
    for (var i = 0, ci, cls = elm.className; (ci = classNames[i++]); ) {
      cls = cls.replace(new RegExp("\\b" + ci + "\\b"), "");
    }
    cls = utils.trim(cls).replace(/[ ]{2,}/g, " ");
    if (cls) {
      elm.className = cls;
    } else {
      domUtils.removeAttributes(elm, ["class"]);
    }
  },
  /**
     * 给元素element添加className
     * @method addClass
     * @param { Node } ele 需要增加className的元素
     * @param { String } classNames 需要添加的className， 多个className之间以空格分割
     * @remind 相同的类名不会被重复添加
     * @example
     * ```html
     * <span id="test" class="cls1 cls2"></span>
     *
     * <script>
     *     var testNode = document.getElementById("test");
     *
     *     UE.dom.domUtils.addClass( testNode, "cls2 cls3 cls4" );
     *
     *     //output: cl1 cls2 cls3 cls4
     *     console.log( testNode.className );
     *
     * <script>
     * ```
     */

  /**
     * 给元素element添加className
     * @method addClass
     * @param { Node } ele 需要增加className的元素
     * @param { Array } classNames 需要添加的className的数组
     * @remind 相同的类名不会被重复添加
     * @example
     * ```html
     * <span id="test" class="cls1 cls2"></span>
     *
     * <script>
     *     var testNode = document.getElementById("test");
     *
     *     UE.dom.domUtils.addClass( testNode, ["cls2", "cls3", "cls4"] );
     *
     *     //output: cl1 cls2 cls3 cls4
     *     console.log( testNode.className );
     *
     * <script>
     * ```
     */
  addClass: function(elm, classNames) {
    if (!elm) return;
    classNames = utils.trim(classNames).replace(/[ ]{2,}/g, " ").split(" ");
    for (var i = 0, ci, cls = elm.className; (ci = classNames[i++]); ) {
      if (!new RegExp("\\b" + ci + "\\b").test(cls)) {
        cls += " " + ci;
      }
    }
    elm.className = utils.trim(cls);
  },
  /**
     * 判断元素element是否包含给定的样式类名className
     * @method hasClass
     * @param { Node } ele 需要检测的元素
     * @param { String } classNames 需要检测的className， 多个className之间用空格分割
     * @return { Boolean } 元素是否包含所有给定的className
     * @example
     * ```html
     * <span id="test1" class="cls1 cls2"></span>
     *
     * <script>
     *     var test1 = document.getElementById("test1");
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.hasClass( test1, "cls2 cls1 cls3" ) );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.hasClass( test1, "cls2 cls1" ) );
     * </script>
     * ```
     */

  /**
     * 判断元素element是否包含给定的样式类名className
     * @method hasClass
     * @param { Node } ele 需要检测的元素
     * @param { Array } classNames 需要检测的className数组
     * @return { Boolean } 元素是否包含所有给定的className
     * @example
     * ```html
     * <span id="test1" class="cls1 cls2"></span>
     *
     * <script>
     *     var test1 = document.getElementById("test1");
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.hasClass( test1, [ "cls2", "cls1", "cls3" ] ) );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.hasClass( test1, [ "cls2", "cls1" ]) );
     * </script>
     * ```
     */
  hasClass: function(element, className) {
    if (utils.isRegExp(className)) {
      return className.test(element.className);
    }
    className = utils.trim(className).replace(/[ ]{2,}/g, " ").split(" ");
    for (var i = 0, ci, cls = element.className; (ci = className[i++]); ) {
      if (!new RegExp("\\b" + ci + "\\b", "i").test(cls)) {
        return false;
      }
    }
    return i - 1 == className.length;
  },

  /**
     * 阻止事件默认行为
     * @method preventDefault
     * @param { Event } evt 需要阻止默认行为的事件对象
     * @example
     * ```javascript
     * UE.dom.domUtils.preventDefault( evt );
     * ```
     */
  preventDefault: function(evt) {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
  },
  /**
     * 删除元素element指定的样式
     * @method removeStyle
     * @param { Element } element 需要删除样式的元素
     * @param { String } styleName 需要删除的样式名
     * @example
     * ```html
     * <span id="test" style="color: red; background: blue;"></span>
     *
     * <script>
     *
     *     var testNode = document.getElementById("test");
     *
     *     UE.dom.domUtils.removeStyle( testNode, 'color' );
     *
     *     //output: background: blue;
     *     console.log( testNode.style.cssText );
     *
     * </script>
     * ```
     */
  removeStyle: function(element, name) {
    if (browser.ie) {
      //针对color先单独处理一下
      if (name == "color") {
        name = "(^|;)" + name;
      }
      element.style.cssText = element.style.cssText.replace(
        new RegExp(name + "[^:]*:[^;]+;?", "ig"),
        ""
      );
    } else {
      if (element.style.removeProperty) {
        element.style.removeProperty(name);
      } else {
        element.style.removeAttribute(utils.cssStyleToDomStyle(name));
      }
    }

    if (!element.style.cssText) {
      domUtils.removeAttributes(element, ["style"]);
    }
  },
  /**
     * 获取元素element的style属性的指定值
     * @method getStyle
     * @param { Element } element 需要获取属性值的元素
     * @param { String } styleName 需要获取的style的名称
     * @warning 该方法仅获取元素style属性中所标明的值
     * @return { String } 该元素包含指定的style属性值
     * @example
     * ```html
     * <div id="test" style="color: red;"></div>
     *
     * <script>
     *
     *      var testNode = document.getElementById( "test" );
     *
     *      //output: red
     *      console.log( UE.dom.domUtils.getStyle( testNode, "color" ) );
     *
     *      //output: ""
     *      console.log( UE.dom.domUtils.getStyle( testNode, "background" ) );
     *
     * </script>
     * ```
     */
  getStyle: function(element, name) {
    var value = element.style[utils.cssStyleToDomStyle(name)];
    return utils.fixColor(name, value);
  },
  /**
     * 为元素element设置样式属性值
     * @method setStyle
     * @param { Element } element 需要设置样式的元素
     * @param { String } styleName 样式名
     * @param { String } styleValue 样式值
     * @example
     * ```html
     * <div id="test"></div>
     *
     * <script>
     *
     *      var testNode = document.getElementById( "test" );
     *
     *      //output: ""
     *      console.log( testNode.style.color );
     *
     *      UE.dom.domUtils.setStyle( testNode, 'color', 'red' );
     *      //output: "red"
     *      console.log( testNode.style.color );
     *
     * </script>
     * ```
     */
  setStyle: function(element, name, value) {
    element.style[utils.cssStyleToDomStyle(name)] = value;
    if (!utils.trim(element.style.cssText)) {
      this.removeAttributes(element, "style");
    }
  },
  /**
     * 为元素element设置多个样式属性值
     * @method setStyles
     * @param { Element } element 需要设置样式的元素
     * @param { Object } styles 样式名值对
     * @example
     * ```html
     * <div id="test"></div>
     *
     * <script>
     *
     *      var testNode = document.getElementById( "test" );
     *
     *      //output: ""
     *      console.log( testNode.style.color );
     *
     *      UE.dom.domUtils.setStyles( testNode, {
     *          'color': 'red'
     *      } );
     *      //output: "red"
     *      console.log( testNode.style.color );
     *
     * </script>
     * ```
     */
  setStyles: function(element, styles) {
    for (var name in styles) {
      if (styles.hasOwnProperty(name)) {
        domUtils.setStyle(element, name, styles[name]);
      }
    }
  },
  /**
     * 删除_moz_dirty属性
     * @private
     * @method removeDirtyAttr
     */
  removeDirtyAttr: function(node) {
    for (
      var i = 0, ci, nodes = node.getElementsByTagName("*");
      (ci = nodes[i++]);

    ) {
      ci.removeAttribute("_moz_dirty");
    }
    node.removeAttribute("_moz_dirty");
  },
  /**
     * 获取子节点的数量
     * @method getChildCount
     * @param { Element } node 需要检测的元素
     * @return { Number } 给定的node元素的子节点数量
     * @example
     * ```html
     * <div id="test">
     *      <span></span>
     * </div>
     *
     * <script>
     *
     *     //output: 3
     *     console.log( UE.dom.domUtils.getChildCount( document.getElementById("test") ) );
     *
     * </script>
     * ```
     */

  /**
     * 根据给定的过滤规则， 获取符合条件的子节点的数量
     * @method getChildCount
     * @param { Element } node 需要检测的元素
     * @param { Function } fn 过滤器， 要求对符合条件的子节点返回true， 反之则要求返回false
     * @return { Number } 符合过滤条件的node元素的子节点数量
     * @example
     * ```html
     * <div id="test">
     *      <span></span>
     * </div>
     *
     * <script>
     *
     *     //output: 1
     *     console.log( UE.dom.domUtils.getChildCount( document.getElementById("test"), function ( node ) {
     *
     *         return node.nodeType === 1;
     *
     *     } ) );
     *
     * </script>
     * ```
     */
  getChildCount: function(node, fn) {
    var count = 0,
      first = node.firstChild;
    fn =
      fn ||
      function() {
        return 1;
      };
    while (first) {
      if (fn(first)) {
        count++;
      }
      first = first.nextSibling;
    }
    return count;
  },

  /**
     * 判断给定节点是否为空节点
     * @method isEmptyNode
     * @param { Node } node 需要检测的节点对象
     * @return { Boolean } 节点是否为空
     * @example
     * ```javascript
     * UE.dom.domUtils.isEmptyNode( document.body );
     * ```
     */
  isEmptyNode: function(node) {
    return (
      !node.firstChild ||
      domUtils.getChildCount(node, function(node) {
        return (
          !domUtils.isBr(node) &&
          !domUtils.isBookmarkNode(node) &&
          !domUtils.isWhitespace(node)
        );
      }) == 0
    );
  },
  clearSelectedArr: function(nodes) {
    var node;
    while ((node = nodes.pop())) {
      domUtils.removeAttributes(node, ["class"]);
    }
  },
  /**
     * 将显示区域滚动到指定节点的位置
     * @method scrollToView
     * @param    {Node}   node    节点
     * @param    {window}   win      window对象
     * @param    {Number}    offsetTop    距离上方的偏移量
     */
  scrollToView: function(node, win, offsetTop) {
    var getViewPaneSize = function() {
      var doc = win.document,
        mode = doc.compatMode == "CSS1Compat";
      return {
        width:
          (mode ? doc.documentElement.clientWidth : doc.body.clientWidth) || 0,
        height:
          (mode ? doc.documentElement.clientHeight : doc.body.clientHeight) || 0
      };
    },
      getScrollPosition = function(win) {
        if ("pageXOffset" in win) {
          return {
            x: win.pageXOffset || 0,
            y: win.pageYOffset || 0
          };
        } else {
          var doc = win.document;
          return {
            x: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
            y: doc.documentElement.scrollTop || doc.body.scrollTop || 0
          };
        }
      };
    var winHeight = getViewPaneSize().height,
      offset = winHeight * -1 + offsetTop;
    offset += node.offsetHeight || 0;
    var elementPosition = domUtils.getXY(node);
    offset += elementPosition.y;
    var currentScroll = getScrollPosition(win).y;
    // offset += 50;
    if (offset > currentScroll || offset < currentScroll - winHeight) {
      win.scrollTo(0, offset + (offset < 0 ? -20 : 20));
    }
  },
  /**
     * 判断给定节点是否为br
     * @method isBr
     * @param { Node } node 需要判断的节点对象
     * @return { Boolean } 给定的节点是否是br节点
     */
  isBr: function(node) {
    return node.nodeType == 1 && node.tagName == "BR";
  },
  /**
     * 判断给定的节点是否是一个“填充”节点
     * @private
     * @method isFillChar
     * @param { Node } node 需要判断的节点
     * @param { Boolean } isInStart 是否从节点内容的开始位置匹配
     * @returns { Boolean } 节点是否是填充节点
     */
  isFillChar: function(node, isInStart) {
    if (node.nodeType != 3) return false;
    var text = node.nodeValue;
    if (isInStart) {
      return new RegExp("^" + domUtils.fillChar).test(text);
    }
    return !text.replace(new RegExp(domUtils.fillChar, "g"), "").length;
  },
  isStartInblock: function(range) {
    var tmpRange = range.cloneRange(),
      flag = 0,
      start = tmpRange.startContainer,
      tmp;
    if (start.nodeType == 1 && start.childNodes[tmpRange.startOffset]) {
      start = start.childNodes[tmpRange.startOffset];
      var pre = start.previousSibling;
      while (pre && domUtils.isFillChar(pre)) {
        start = pre;
        pre = pre.previousSibling;
      }
    }
    if (this.isFillChar(start, true) && tmpRange.startOffset == 1) {
      tmpRange.setStartBefore(start);
      start = tmpRange.startContainer;
    }

    while (start && domUtils.isFillChar(start)) {
      tmp = start;
      start = start.previousSibling;
    }
    if (tmp) {
      tmpRange.setStartBefore(tmp);
      start = tmpRange.startContainer;
    }
    if (
      start.nodeType == 1 &&
      domUtils.isEmptyNode(start) &&
      tmpRange.startOffset == 1
    ) {
      tmpRange.setStart(start, 0).collapse(true);
    }
    while (!tmpRange.startOffset) {
      start = tmpRange.startContainer;
      if (domUtils.isBlockElm(start) || domUtils.isBody(start)) {
        flag = 1;
        break;
      }
      var pre = tmpRange.startContainer.previousSibling,
        tmpNode;
      if (!pre) {
        tmpRange.setStartBefore(tmpRange.startContainer);
      } else {
        while (pre && domUtils.isFillChar(pre)) {
          tmpNode = pre;
          pre = pre.previousSibling;
        }
        if (tmpNode) {
          tmpRange.setStartBefore(tmpNode);
        } else {
          tmpRange.setStartBefore(tmpRange.startContainer);
        }
      }
    }
    return flag && !domUtils.isBody(tmpRange.startContainer) ? 1 : 0;
  },

  /**
     * 判断给定的元素是否是一个空元素
     * @method isEmptyBlock
     * @param { Element } node 需要判断的元素
     * @return { Boolean } 是否是空元素
     * @example
     * ```html
     * <div id="test"></div>
     *
     * <script>
     *     //output: true
     *     console.log( UE.dom.domUtils.isEmptyBlock( document.getElementById("test") ) );
     * </script>
     * ```
     */

  /**
     * 根据指定的判断规则判断给定的元素是否是一个空元素
     * @method isEmptyBlock
     * @param { Element } node 需要判断的元素
     * @param { RegExp } reg 对内容执行判断的正则表达式对象
     * @return { Boolean } 是否是空元素
     */
  isEmptyBlock: function(node, reg) {
    if (node.nodeType != 1) return 0;
    reg = reg || new RegExp("[ \xa0\t\r\n" + domUtils.fillChar + "]", "g");

    if (
      node[browser.ie ? "innerText" : "textContent"].replace(reg, "").length > 0
    ) {
      return 0;
    }
    for (var n in dtd.$isNotEmpty) {
      if (node.getElementsByTagName(n).length) {
        return 0;
      }
    }
    return 1;
  },

  /**
     * 移动元素使得该元素的位置移动指定的偏移量的距离
     * @method setViewportOffset
     * @param { Element } element 需要设置偏移量的元素
     * @param { Object } offset 偏移量， 形如{ left: 100, top: 50 }的一个键值对， 表示该元素将在
     *                                  现有的位置上向水平方向偏移offset.left的距离， 在竖直方向上偏移
     *                                  offset.top的距离
     * @example
     * ```html
     * <div id="test" style="top: 100px; left: 50px; position: absolute;"></div>
     *
     * <script>
     *
     *     var testNode = document.getElementById("test");
     *
     *     UE.dom.domUtils.setViewportOffset( testNode, {
     *         left: 200,
     *         top: 50
     *     } );
     *
     *     //output: top: 300px; left: 100px; position: absolute;
     *     console.log( testNode.style.cssText );
     *
     * </script>
     * ```
     */
  setViewportOffset: function(element, offset) {
    var left = parseInt(element.style.left) | 0;
    var top = parseInt(element.style.top) | 0;
    var rect = element.getBoundingClientRect();
    var offsetLeft = offset.left - rect.left;
    var offsetTop = offset.top - rect.top;
    if (offsetLeft) {
      element.style.left = left + offsetLeft + "px";
    }
    if (offsetTop) {
      element.style.top = top + offsetTop + "px";
    }
  },

  /**
     * 用“填充字符”填充节点
     * @method fillNode
     * @private
     * @param { DomDocument } doc 填充的节点所在的docment对象
     * @param { Node } node 需要填充的节点对象
     * @example
     * ```html
     * <div id="test"></div>
     *
     * <script>
     *     var testNode = document.getElementById("test");
     *
     *     //output: 0
     *     console.log( testNode.childNodes.length );
     *
     *     UE.dom.domUtils.fillNode( document, testNode );
     *
     *     //output: 1
     *     console.log( testNode.childNodes.length );
     *
     * </script>
     * ```
     */
  fillNode: function(doc, node) {
    var tmpNode = browser.ie
      ? doc.createTextNode(domUtils.fillChar)
      : doc.createElement("br");
    node.innerHTML = "";
    node.appendChild(tmpNode);
  },

  /**
     * 把节点src的所有子节点追加到另一个节点tag上去
     * @method moveChild
     * @param { Node } src 源节点， 该节点下的所有子节点将被移除
     * @param { Node } tag 目标节点， 从源节点移除的子节点将被追加到该节点下
     * @example
     * ```html
     * <div id="test1">
     *      <span></span>
     * </div>
     * <div id="test2">
     *     <div></div>
     * </div>
     *
     * <script>
     *
     *     var test1 = document.getElementById("test1"),
     *         test2 = document.getElementById("test2");
     *
     *     UE.dom.domUtils.moveChild( test1, test2 );
     *
     *     //output: ""（空字符串）
     *     console.log( test1.innerHTML );
     *
     *     //output: "<div></div><span></span>"
     *     console.log( test2.innerHTML );
     *
     * </script>
     * ```
     */

  /**
     * 把节点src的所有子节点移动到另一个节点tag上去, 可以通过dir参数控制附加的行为是“追加”还是“插入顶部”
     * @method moveChild
     * @param { Node } src 源节点， 该节点下的所有子节点将被移除
     * @param { Node } tag 目标节点， 从源节点移除的子节点将被附加到该节点下
     * @param { Boolean } dir 附加方式， 如果为true， 则附加进去的节点将被放到目标节点的顶部， 反之，则放到末尾
     * @example
     * ```html
     * <div id="test1">
     *      <span></span>
     * </div>
     * <div id="test2">
     *     <div></div>
     * </div>
     *
     * <script>
     *
     *     var test1 = document.getElementById("test1"),
     *         test2 = document.getElementById("test2");
     *
     *     UE.dom.domUtils.moveChild( test1, test2, true );
     *
     *     //output: ""（空字符串）
     *     console.log( test1.innerHTML );
     *
     *     //output: "<span></span><div></div>"
     *     console.log( test2.innerHTML );
     *
     * </script>
     * ```
     */
  moveChild: function(src, tag, dir) {
    while (src.firstChild) {
      if (dir && tag.firstChild) {
        tag.insertBefore(src.lastChild, tag.firstChild);
      } else {
        tag.appendChild(src.firstChild);
      }
    }
  },

  /**
     * 判断节点的标签上是否不存在任何属性
     * @method hasNoAttributes
     * @private
     * @param { Node } node 需要检测的节点对象
     * @return { Boolean } 节点是否不包含任何属性
     * @example
     * ```html
     * <div id="test"><span>xxxx</span></div>
     *
     * <script>
     *
     *     //output: false
     *     console.log( UE.dom.domUtils.hasNoAttributes( document.getElementById("test") ) );
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.hasNoAttributes( document.getElementById("test").firstChild ) );
     *
     * </script>
     * ```
     */
  hasNoAttributes: function(node) {
    return browser.ie
      ? /^<\w+\s*?>/.test(node.outerHTML)
      : node.attributes.length == 0;
  },

  /**
     * 检测节点是否是UEditor所使用的辅助节点
     * @method isCustomeNode
     * @private
     * @param { Node } node 需要检测的节点
     * @remind 辅助节点是指编辑器要完成工作临时添加的节点， 在输出的时候将会从编辑器内移除， 不会影响最终的结果。
     * @return { Boolean } 给定的节点是否是一个辅助节点
     */
  isCustomeNode: function(node) {
    return node.nodeType == 1 && node.getAttribute("_ue_custom_node_");
  },

  /**
     * 检测节点的标签是否是给定的标签
     * @method isTagNode
     * @param { Node } node 需要检测的节点对象
     * @param { String } tagName 标签
     * @return { Boolean } 节点的标签是否是给定的标签
     * @example
     * ```html
     * <div id="test"></div>
     *
     * <script>
     *
     *     //output: true
     *     console.log( UE.dom.domUtils.isTagNode( document.getElementById("test"), "div" ) );
     *
     * </script>
     * ```
     */
  isTagNode: function(node, tagNames) {
    return (
      node.nodeType == 1 &&
      new RegExp("\\b" + node.tagName + "\\b", "i").test(tagNames)
    );
  },

  /**
     * 给定一个节点数组，在通过指定的过滤器过滤后， 获取其中满足过滤条件的第一个节点
     * @method filterNodeList
     * @param { Array } nodeList 需要过滤的节点数组
     * @param { Function } fn 过滤器， 对符合条件的节点， 执行结果返回true， 反之则返回false
     * @return { Node | NULL } 如果找到符合过滤条件的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var divNodes = document.getElementsByTagName("div");
     * divNodes = [].slice.call( divNodes, 0 );
     *
     * //output: null
     * console.log( UE.dom.domUtils.filterNodeList( divNodes, function ( node ) {
     *     return node.tagName.toLowerCase() !== 'div';
     * } ) );
     * ```
     */

  /**
     * 给定一个节点数组nodeList和一组标签名tagNames， 获取其中能够匹配标签名的节点集合中的第一个节点
     * @method filterNodeList
     * @param { Array } nodeList 需要过滤的节点数组
     * @param { String } tagNames 需要匹配的标签名， 多个标签名之间用空格分割
     * @return { Node | NULL } 如果找到标签名匹配的节点， 则返回该节点， 否则返回NULL
     * @example
     * ```javascript
     * var divNodes = document.getElementsByTagName("div");
     * divNodes = [].slice.call( divNodes, 0 );
     *
     * //output: null
     * console.log( UE.dom.domUtils.filterNodeList( divNodes, 'a span' ) );
     * ```
     */

  /**
     * 给定一个节点数组，在通过指定的过滤器过滤后， 如果参数forAll为true， 则会返回所有满足过滤
     * 条件的节点集合， 否则， 返回满足条件的节点集合中的第一个节点
     * @method filterNodeList
     * @param { Array } nodeList 需要过滤的节点数组
     * @param { Function } fn 过滤器， 对符合条件的节点， 执行结果返回true， 反之则返回false
     * @param { Boolean } forAll 是否返回整个节点数组, 如果该参数为false， 则返回节点集合中的第一个节点
     * @return { Array | Node | NULL } 如果找到符合过滤条件的节点， 则根据参数forAll的值决定返回满足
     *                                      过滤条件的节点数组或第一个节点， 否则返回NULL
     * @example
     * ```javascript
     * var divNodes = document.getElementsByTagName("div");
     * divNodes = [].slice.call( divNodes, 0 );
     *
     * //output: 3（假定有3个div）
     * console.log( divNodes.length );
     *
     * var nodes = UE.dom.domUtils.filterNodeList( divNodes, function ( node ) {
     *     return node.tagName.toLowerCase() === 'div';
     * }, true );
     *
     * //output: 3
     * console.log( nodes.length );
     *
     * var node = UE.dom.domUtils.filterNodeList( divNodes, function ( node ) {
     *     return node.tagName.toLowerCase() === 'div';
     * }, false );
     *
     * //output: div
     * console.log( node.nodeName );
     * ```
     */
  filterNodeList: function(nodelist, filter, forAll) {
    var results = [];
    if (!utils.isFunction(filter)) {
      var str = filter;
      filter = function(n) {
        return (
          utils.indexOf(
            utils.isArray(str) ? str : str.split(" "),
            n.tagName.toLowerCase()
          ) != -1
        );
      };
    }
    utils.each(nodelist, function(n) {
      filter(n) && results.push(n);
    });
    return results.length == 0
      ? null
      : results.length == 1 || !forAll ? results[0] : results;
  },

  /**
     * 查询给定的range选区是否在给定的node节点内，且在该节点的最末尾
     * @method isInNodeEndBoundary
     * @param { UE.dom.Range } rng 需要判断的range对象， 该对象的startContainer不能为NULL
     * @param node 需要检测的节点对象
     * @return { Number } 如果给定的选取range对象是在node内部的最末端， 则返回1, 否则返回0
     */
  isInNodeEndBoundary: function(rng, node) {
    var start = rng.startContainer;
    if (start.nodeType == 3 && rng.startOffset != start.nodeValue.length) {
      return 0;
    }
    if (start.nodeType == 1 && rng.startOffset != start.childNodes.length) {
      return 0;
    }
    while (start !== node) {
      if (start.nextSibling) {
        return 0;
      }
      start = start.parentNode;
    }
    return 1;
  },
  isBoundaryNode: function(node, dir) {
    var tmp;
    while (!domUtils.isBody(node)) {
      tmp = node;
      node = node.parentNode;
      if (tmp !== node[dir]) {
        return false;
      }
    }
    return true;
  },
  fillHtml: browser.ie11below ? "&nbsp;" : "<br/>"
});
var fillCharReg = new RegExp(domUtils.fillChar, "g");
