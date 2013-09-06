/**
 * Range封装
 * @file
 * @module UE.dom
 * @class Range
 * @since 1.2.6.1
 */

/**
 * dom操作封装
 * @unfile
 * @module UE.dom
 */

/**
 * Range实现类，本类是UEditor底层核心类，统一w3cRange和ieRange之间的差异，包括接口和属性
 * @unfile
 * @module UE.dom
 * @class Range
 */

(function () {
    var guid = 0,
        fillChar = domUtils.fillChar,
        fillData;

    /*
     * 更新range的collapse状态
     * @param  {Range}   range    range对象
     */
    function updateCollapse(range) {
        range.collapsed =
            range.startContainer && range.endContainer &&
                range.startContainer === range.endContainer &&
                range.startOffset == range.endOffset;
    }

    function selectOneNode(rng){
        return !rng.collapsed && rng.startContainer.nodeType == 1 && rng.startContainer === rng.endContainer && rng.endOffset - rng.startOffset == 1
    }
    function setEndPoint(toStart, node, offset, range) {
        //如果node是自闭合标签要处理
        if (node.nodeType == 1 && (dtd.$empty[node.tagName] || dtd.$nonChild[node.tagName])) {
            offset = domUtils.getNodeIndex(node) + (toStart ? 0 : 1);
            node = node.parentNode;
        }
        if (toStart) {
            range.startContainer = node;
            range.startOffset = offset;
            if (!range.endContainer) {
                range.collapse(true);
            }
        } else {
            range.endContainer = node;
            range.endOffset = offset;
            if (!range.startContainer) {
                range.collapse(false);
            }
        }
        updateCollapse(range);
        return range;
    }

    function execContentsAction(range, action) {
        //调整边界
        //range.includeBookmark();
        var start = range.startContainer,
            end = range.endContainer,
            startOffset = range.startOffset,
            endOffset = range.endOffset,
            doc = range.document,
            frag = doc.createDocumentFragment(),
            tmpStart, tmpEnd;
        if (start.nodeType == 1) {
            start = start.childNodes[startOffset] || (tmpStart = start.appendChild(doc.createTextNode('')));
        }
        if (end.nodeType == 1) {
            end = end.childNodes[endOffset] || (tmpEnd = end.appendChild(doc.createTextNode('')));
        }
        if (start === end && start.nodeType == 3) {
            frag.appendChild(doc.createTextNode(start.substringData(startOffset, endOffset - startOffset)));
            //is not clone
            if (action) {
                start.deleteData(startOffset, endOffset - startOffset);
                range.collapse(true);
            }
            return frag;
        }
        var current, currentLevel, clone = frag,
            startParents = domUtils.findParents(start, true), endParents = domUtils.findParents(end, true);
        for (var i = 0; startParents[i] == endParents[i];) {
            i++;
        }
        for (var j = i, si; si = startParents[j]; j++) {
            current = si.nextSibling;
            if (si == start) {
                if (!tmpStart) {
                    if (range.startContainer.nodeType == 3) {
                        clone.appendChild(doc.createTextNode(start.nodeValue.slice(startOffset)));
                        //is not clone
                        if (action) {
                            start.deleteData(startOffset, start.nodeValue.length - startOffset);
                        }
                    } else {
                        clone.appendChild(!action ? start.cloneNode(true) : start);
                    }
                }
            } else {
                currentLevel = si.cloneNode(false);
                clone.appendChild(currentLevel);
            }
            while (current) {
                if (current === end || current === endParents[j]) {
                    break;
                }
                si = current.nextSibling;
                clone.appendChild(!action ? current.cloneNode(true) : current);
                current = si;
            }
            clone = currentLevel;
        }
        clone = frag;
        if (!startParents[i]) {
            clone.appendChild(startParents[i - 1].cloneNode(false));
            clone = clone.firstChild;
        }
        for (var j = i, ei; ei = endParents[j]; j++) {
            current = ei.previousSibling;
            if (ei == end) {
                if (!tmpEnd && range.endContainer.nodeType == 3) {
                    clone.appendChild(doc.createTextNode(end.substringData(0, endOffset)));
                    //is not clone
                    if (action) {
                        end.deleteData(0, endOffset);
                    }
                }
            } else {
                currentLevel = ei.cloneNode(false);
                clone.appendChild(currentLevel);
            }
            //如果两端同级，右边第一次已经被开始做了
            if (j != i || !startParents[i]) {
                while (current) {
                    if (current === start) {
                        break;
                    }
                    ei = current.previousSibling;
                    clone.insertBefore(!action ? current.cloneNode(true) : current, clone.firstChild);
                    current = ei;
                }
            }
            clone = currentLevel;
        }
        if (action) {
            range.setStartBefore(!endParents[i] ? endParents[i - 1] : !startParents[i] ? startParents[i - 1] : endParents[i]).collapse(true);
        }
        tmpStart && domUtils.remove(tmpStart);
        tmpEnd && domUtils.remove(tmpEnd);
        return frag;
    }

    /**
     * 创建一个跟document绑定的空的Range实例
     * @constructor
     */

    /**
     * @property { Node } startContainer 当前Range的开始边界的容器节点, 可以是一个元素节点或者是文本节点
     */

    /**
     * @property { Node } startOffset 当前Range的开始边界容器节点的偏移量, 如果是元素节点，
     *                              该值就是childNodes中的第几个节点， 如果是文本节点就是文本内容的第几个字符
     */

    /**
     * @property { Node } endContainer 当前Range的结束边界的容器节点, 可以是一个元素节点或者是文本节点
     */

    /**
     * @property { Node } endOffset 当前Range的结束边界容器节点的偏移量, 如果是元素节点，
     *                              该值就是childNodes中的第几个节点， 如果是文本节点就是文本内容的第几个字符
     */

    /**
     * @property { Boolean } collapsed 当前Range是否是闭合的
     */

    /**
     * @property { Document } document 当前Range所属的Document对象
     */

    var Range = dom.Range = function (document) {
        var me = this;
        me.startContainer =
            me.startOffset =
                me.endContainer =
                    me.endOffset = null;
        me.document = document;
        me.collapsed = true;
    };

    /*
     * 删除fillData
     * @param doc
     * @param excludeNode
     */
    function removeFillData(doc, excludeNode) {
        try {
            if (fillData && domUtils.inDoc(fillData, doc)) {
                if (!fillData.nodeValue.replace(fillCharReg, '').length) {
                    var tmpNode = fillData.parentNode;
                    domUtils.remove(fillData);
                    while (tmpNode && domUtils.isEmptyInlineElement(tmpNode) &&
                        //safari的contains有bug
                        (browser.safari ? !(domUtils.getPosition(tmpNode,excludeNode) & domUtils.POSITION_CONTAINS) : !tmpNode.contains(excludeNode))
                        ) {
                        fillData = tmpNode.parentNode;
                        domUtils.remove(tmpNode);
                        tmpNode = fillData;
                    }
                } else {
                    fillData.nodeValue = fillData.nodeValue.replace(fillCharReg, '');
                }
            }
        } catch (e) {
        }
    }

    /*
     *
     * @param node
     * @param dir
     */
    function mergeSibling(node, dir) {
        var tmpNode;
        node = node[dir];
        while (node && domUtils.isFillChar(node)) {
            tmpNode = node[dir];
            domUtils.remove(node);
            node = tmpNode;
        }
    }

    Range.prototype = {

        /**
         * 克隆选中的内容到一个DocumentFragment里
         * @method cloneContents
         * @return { DocumentFragment | NULL } 如果选区是空的将返回null， 否则， 返回包含所clone内容的DocumentFragment元素
         * @example
         * ```html
         * <!-- 被选中的内容 -->
         * <div>123</div><div>456</div>
         *
         * <script>
         *     //output: 2
         *     console.log( range.cloneContents().childNodes.length );
         * </script>
         * ```
         */
        cloneContents:function () {
            return this.collapsed ? null : execContentsAction(this, 0);
        },

        /**
         * 删除当前选区范围中的所有内容
         * @method deleteContents
         * @remind 执行完该操作后， 当前Range对象变成了闭合状态
         * @remind 执行该操作会引起当前Range对象的其他属性的变化
         * @return { UE.dom.Range } 当前操作的Range对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <div></div>
         *     <span></span>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *     //output: 5
         *     console.log( document.body.childNodes.length );
         *
         *     //执行删除选区内容操作
         *     range.deleteContents();
         *
         *     //output: 2
         *     console.log( document.body.childNodes.length );
         * </script>
         * ```
         */
        deleteContents:function () {
            var txt;
            if (!this.collapsed) {
                execContentsAction(this, 1);
            }
            if (browser.webkit) {
                txt = this.startContainer;
                if (txt.nodeType == 3 && !txt.nodeValue.length) {
                    this.setStartBefore(txt).collapse(true);
                    domUtils.remove(txt);
                }
            }
            return this;
        },

        /**
         * 将当前选区的内容提取到一个DocumentFragment里
         * @method extractContents
         * @remind 执行该操作后， 选区将变成闭合状态
         * @warning 执行该操作后， 原来选区所选中的内容将从dom树上剥离出来
         * @return { DocumentFragment } 返回包含所提取内容的DocumentFragment对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <div></div>
         *     <span></span>
         *     <!-- 选区结束 -->
         * </body>
         * <script>
         *     //output: 5
         *     console.log( document.body.childNodes.length );
         *
         *     //执行选区内容提取
         *     var contents = range.extractContents();
         *
         *     //output: 2
         *     console.log( document.body.childNodes.length );
         *
         *     //output: 3
         *     console.log( contents.childNodes.length );
         *
         * </script>
         */
        extractContents:function () {
            return this.collapsed ? null : execContentsAction(this, 2);
        },

        /**
         * 设置Range的开始位置
         * @method  setStart
         * @remind 如果容器节点是元素节点，那么offset指的是其子元素中索引为offset的元素，
         *          如果是文本节点，那么offset指的是其文本内容的第offset个字符
         * @param { Node } node 将被设为当前选区开始边界容器的节点对象
         * @param { int } offset 开始容器的偏移量
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <div id="test"></div>
         *     <!-- 选区开始 -->
         *     <span></span>
         *     <a></a>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *
         *     //output: SPAN
         *     console.log( range.startContainer.tagName );
         *
         *     range.setStart( document.getElementById( "test" ), 0 );
         *
         *     //output: DIV
         *     console.log( range.startContainer.tagName );
         *
         * </script>
         * ```
         */
        setStart:function (node, offset) {
            return setEndPoint(true, node, offset, this);
        },

        /**
         * 设置Range的结束位置
         * @method  setEnd
         * @param { Node } node 将被设为当前选区结束边界容器的节点对象
         * @param { int } offset 结束容器的偏移量
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <span></span>
         *     <a></a>
         *     <!-- 选区结束 -->
         *     <div id="test"></div>
         * </body>
         *
         * <script>
         *
         *     //output: A
         *     console.log( range.endContainer.tagName );
         *
         *     range.setEnd( document.getElementById( "test" ), 0 );
         *
         *     //output: DIV
         *     console.log( range.endContainer.tagName );
         *
         * </script>
         * ```
         */
        setEnd:function (node, offset) {
            return setEndPoint(false, node, offset, this);
        },

        /**
         * 将Range开始位置设置到node节点之后
         * @method  setStartAfter
         * @param { Node } node 当前选区开始边界之前的节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <div id="test"></div>
         *     <span></span>
         *     <!-- 选区开始 -->
         *     <a></a>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *
         *     //output: A
         *     console.log( range.startContainer.tagName );
         *
         *     range.setStartAfter( document.getElementById( "test" ) );
         *
         *     //output: SPAN
         *     console.log( range.startContainer.tagName );
         *
         * </script>
         * ```
         */
        setStartAfter:function (node) {
            return this.setStart(node.parentNode, domUtils.getNodeIndex(node) + 1);
        },

        /**
         * 将Range开始位置设置到node节点之前
         * @method  setStartBefore
         * @param { Node } node 新的选区开始位置在该节点之前
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <span></span>
         *     <div id="test"></div>
         *     <!-- 选区开始 -->
         *     <a></a>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *
         *     //output: A
         *     console.log( range.startContainer.tagName );
         *
         *     range.setStartBefore( document.getElementById( "test" ) );
         *
         *     //output: SPAN
         *     console.log( range.startContainer.tagName );
         *
         * </script>
         * ```
         */
        setStartBefore:function (node) {
            return this.setStart(node.parentNode, domUtils.getNodeIndex(node));
        },

        /**
         * 将Range结束位置设置到node节点之后
         * @method  setEndAfter
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <a></a>
         *     <!-- 选区结束 -->
         *     <span></span>
         *     <div id="test"></div>
         *
         *     <script>
         *         //output: A
         *         console.log( range.endContainer.tagName );
         *
         *         range.setEndAfter( document.getElementById( "test" ) );
         *
         *         //output: DIV
         *         console.log( range.endContainer.tagName );
         *     </script>
         * </body>
         * ```
         */
        setEndAfter:function (node) {
            return this.setEnd(node.parentNode, domUtils.getNodeIndex(node) + 1);
        },

        /**
         * 将Range结束位置设置到node节点之前
         * @method  setEndBefore
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <a></a>
         *     <!-- 选区结束 -->
         *     <span></span>
         *     <div id="test"></div>
         *
         *     <script>
         *         //output: A
         *         console.log( range.endContainer.tagName );
         *
         *         range.setEndBefore( document.getElementById( "test" ) );
         *
         *         //output: SPAN
         *         console.log( range.endContainer.tagName );
         *     </script>
         * </body>
         * ```
         */
        setEndBefore:function (node) {
            return this.setEnd(node.parentNode, domUtils.getNodeIndex(node));
        },

        /**
         * 设置Range的开始位置设置到node节点内的第一个节点处
         * @method  setStartAtFirst
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <div id="test">
         *         <i></i>
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <!-- 选区结束 -->
         *         <span></span>
         *     </div>
         *
         *     <script>
         *         //output: '<a></a>'
         *         console.log( range.cloneContents() );
         *
         *         range.setStartAtFirst( document.getElementById("test") );
         *
         *         //output: '<i></i><a></a>'
         *         console.log( range.cloneContents() );
         *     </script>
         * </body>
         * ```
         */
        setStartAtFirst:function (node) {
            return this.setStart(node, 0);
        },

        /**
         * 设置Range的开始位置设置到node节点内的最后一个节点处
         * @method  setStartAtLast
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <div id="test">
         *         <i></i>
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <!-- 选区结束 -->
         *         <span></span>
         *     </div>
         *
         *     <script>
         *         //output: <a></a>
         *         console.log( range.cloneContents() );
         *
         *         range.setStartAtLast( document.body );
         *
         *         //选区已经闭合， 输出空字符串
         *         //output: ''
         *         console.log( range.cloneContents() );
         *     </script>
         * </body>
         * ```
         */
        setStartAtLast:function (node) {
            return this.setStart(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);
        },

        /**
         * 设置Range的结束位置设置到node节点内的第一个节点处
         * @method  setEndAtFirst
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <!-- 选区开始 -->
         *     <a></a>
         *     <!-- 选区结束 -->
         *     <span></span>
         *     <div id="test"></div>
         *
         *     <script>
         *         //output: '<a></a>'
         *         console.log( range.cloneContents() );
         *
         *         range.setEndAtFirst( document.getElementById("test") );
         *
         *         //output: '<a></a><div></div>'
         *         console.log( range.cloneContents() );
         *     </script>
         * </body>
         * ```
         */
        setEndAtFirst:function (node) {
            return this.setEnd(node, 0);
        },

        /**
         * 设置Range的结束位置设置到node节点内的最后一个节点处
         * @method  setEndAtLast
         * @param { Node } node 目标节点
         * @see UE.dom.Range:setStart(Node,int)
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <!-- 选区结束 -->
         *         <span></span>
         *     </div>
         *
         *     <script>
         *         //output: '<a></a>'
         *         console.log( range.cloneContents() );
         *
         *         range.setEndAtLast( document.getElementById("test") );
         *
         *         //output: '<a></a><span></span>'
         *         console.log( range.cloneContents() );
         *     </script>
         * </body>
         * ```
         */
        setEndAtLast:function (node) {
            return this.setEnd(node, node.nodeType == 3 ? node.nodeValue.length : node.childNodes.length);
        },

        /**
         * 选中一个节点， 并返回包含这个节点的range对象
         * @method  selectNode
         * @param { Node } node 需要选中的节点
         * @return { UE.dom.Range } 当前range对象， 但是选区已经改变， 包含了当前选择的节点对象
         * @example
         * ```html
         * <body>
         *
         *     <div id="test"></div>
         *
         *     <script>
         *
         *         range.selectNode( document.getElementById("test") );
         *
         *         //output: '<div id="test"></div>'
         *         console.log( range.cloneContents() );
         *
         *     </script>
         * </body>
         * ```
         */
        selectNode:function (node) {
            return this.setStartBefore(node).setEndAfter(node);
        },

        /**
         * 选中给定节点内部的所有节点， 并返回包含这个节点内容的range对象
         * @method  selectNodeContents
         * @param { Node } node 目标节点， 当前range将包含该节点内的所有节点
         * @return { UE.dom.Range } 当前range对象，  包含了当前选择的节点对象的所有子节点
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *          <a></a>
         *          <i></i>
         *     </div>
         *
         *     <script>
         *
         *         range.selectNodeContents( document.getElementById("test") );
         *
         *         //output: '<a></a><i></i>'
         *         console.log( range.cloneContents() );
         *
         *     </script>
         * </body>
         * ```
         */
        selectNodeContents:function (node) {
            return this.setStart(node, 0).setEndAtLast(node);
        },

        /**
         * clone当前Range对象
         * @method  cloneRange
         * @return { UE.dom.Range } 当前range对象的一个副本
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         var cloneRange = range.cloneRange();
         *
         *         //output: '<a></a><i></i>'
         *         console.log( cloneRange.cloneContents() );
         *
         *     </script>
         * </body>
         * ```
         */
        cloneRange:function () {
            var me = this;
            return new Range(me.document).setStart(me.startContainer, me.startOffset).setEnd(me.endContainer, me.endOffset);
        },

        /**
         * 闭合当前选区，向尾部闭合
         * @method  collapse
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         //output: '<a></a><i></i>'
         *         console.log( range.cloneContents() );
         *         //output: 1
         *         console.log( range.startOffset );
         *
         *         range.collapse();
         *
         *         //output: ''
         *         console.log( range.cloneContents() );
         *         //output: 3
         *         console.log( range.startOffset );
         *
         *     </script>
         * </body>
         * ```
         */

        /**
         * 闭合当前选区，根据给定的toStart参数项决定是向尾部闭合还是向前闭合，
         * 如果toStart的值为true，则闭合到首部， 反之，则闭合到尾部
         * @method  collapse
         * @param { Boolean } toStart 是否向前闭合选区
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         //output: '<a></a><i></i>'
         *         console.log( range.cloneContents() );
         *         //output: 1
         *         console.log( range.startOffset );
         *
         *         range.collapse();
         *
         *         //output: ''
         *         console.log( range.cloneContents() );
         *         //output: 3
         *         console.log( range.startOffset );
         *
         *     </script>
         * </body>
         * ```
         */
        collapse:function (toStart) {
            var me = this;
            if (toStart) {
                me.endContainer = me.startContainer;
                me.endOffset = me.startOffset;
            } else {
                me.startContainer = me.endContainer;
                me.startOffset = me.endOffset;
            }
            me.collapsed = true;
            return me;
        },

        /*
         * 调整range的边界，使其"收缩"到最小的位置
         * @name  shrinkBoundary
         * @grammar range.shrinkBoundary()  => Range  //range开始位置和结束位置都调整，参见<code><a href="#adjustmentboundary">adjustmentBoundary</a></code>
         * @grammar range.shrinkBoundary(true)  => Range  //仅调整开始位置，忽略结束位置
         * @example
         * <b>xx[</b>xxxxx] ==> <b>xx</b>[xxxxx]
         * <b>x[xx</b><i>]xxx</i> ==> <b>x[xx]</b><i>xxx</i>
         * [<b><i>xxxx</i>xxxxxxx</b>] ==> <b><i>[xxxx</i>xxxxxxx]</b>
         */
        /**
         * 调整range的开始位置和结束位置，使其"收缩"到最小的位置
         * @method  shrinkBoundary
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         //output: '<a></a><i></i>'
         *         console.log( range.cloneContents() );
         *         //output: 1
         *         console.log( range.startOffset );
         *
         *         range.collapse();
         *
         *         //output: ''
         *         console.log( range.cloneContents() );
         *         //output: 3
         *         console.log( range.startOffset );
         *
         *     </script>
         * </body>
         * ```
         */
        shrinkBoundary:function (ignoreEnd) {
            var me = this, child,
                collapsed = me.collapsed;
            function check(node){
                return node.nodeType == 1 && !domUtils.isBookmarkNode(node) && !dtd.$empty[node.tagName] && !dtd.$nonChild[node.tagName]
            }
            while (me.startContainer.nodeType == 1 //是element
                && (child = me.startContainer.childNodes[me.startOffset]) //子节点也是element
                && check(child)) {
                me.setStart(child, 0);
            }
            if (collapsed) {
                return me.collapse(true);
            }
            if (!ignoreEnd) {
                while (me.endContainer.nodeType == 1//是element
                    && me.endOffset > 0 //如果是空元素就退出 endOffset=0那么endOffst-1为负值，childNodes[endOffset]报错
                    && (child = me.endContainer.childNodes[me.endOffset - 1]) //子节点也是element
                    && check(child)) {
                    me.setEnd(child, child.childNodes.length);
                }
            }
            return me;
        },

        /**
         * 获取当前选区所包含的所有节点的公共祖先节点，
         * 返回的公共祖先节点一定不是range自身的容器节点， 但有可能是一个文本节点
         * @method  getCommonAncestor
         * @return { Node } 当前range对象内所有节点的公共祖先节点
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         var ancestorNode = range.getCommonAncestor();
         *
         *         //output: 'DIV'
         *         console.log( ancestorNode.tagName );
         *
         *     </script>
         *
         * </body>
         * ```
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *          <span>
         *              <!-- 选区开始 -->
         *              <a></a>
         *          </span>
         *          <span>
         *              <i></i>
         *              <!-- 选区结束 -->
         *          </span>
         *     </div>
         *
         *     <script>
         *
         *         var ancestorNode = range.getCommonAncestor();
         *
         *         //output: 'DIV'
         *         console.log( ancestorNode.tagName );
         *
         *     </script>
         *
         * </body>
         * ```
         */

        /**
         * 获取当前选区所包含的所有节点的公共祖先节点， 可以根据给定的参数 includeSelf 决定获取到
         * 的公共祖先节点是否可以是当前选区的startContainer或endContainer节点， 如果 includeSelf
         * 的取值为true， 则返回的节点可以是自身的容器节点， 否则， 则不能是容器节点
         * @method  getCommonAncestor
         * @param { Boolean } includeSelf 是否允许获取到的公共祖先节点是当前range对象的容器节点
         * @return { Node } 当前range对象内所有节点的公共祖先节点
         * @see UE.dom.Range:getCommonAncestor()
         * @example
         * ```html
         * <body>
         *
         *     <!-- 选区开始 -->
         *     <div id="test">
         *         <a></a>
         *         <i></i>
         *     </div>
         *     <!-- 选区结束 -->
         *
         *     <script>
         *
         *         var ancestorNode = range.getCommonAncestor( true );
         *
         *         //output: 'DIV'
         *         console.log( ancestorNode.tagName );
         *
         *         ancestorNode = range.getCommonAncestor( false );
         *
         *         //output: BODY
         *         console.log( ancestorNode.tagName );
         *
         *     </script>
         *
         * </body>
         * ```
         */

        /**
         * 获取当前选区所包含的所有节点的公共祖先节点， 可以根据给定的参数 includeSelf 决定获取到
         * 的公共祖先节点是否可以是当前选区的startContainer或endContainer节点， 如果 includeSelf
         * 的取值为true， 则返回的节点可以是自身的容器节点， 否则， 则不能是容器节点； 同时可以根据
         * ignoreTextNode 参数的取值决定是否忽略类型为文本节点的祖先节点。
         * @method  getCommonAncestor
         * @param { Boolean } includeSelf 是否允许获取到的公共祖先节点是当前range对象的容器节点
         * @param { Boolean } ignoreTextNode 获取祖先节点的过程中是否忽略类型为文本节点的祖先节点
         * @return { Node } 当前range对象内所有节点的公共祖先节点
         * @see UE.dom.Range:getCommonAncestor()
         * @see UE.dom.Range:getCommonAncestor(Boolean)
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <span>
         *             我是一个
         *             <!-- 选区开始 -->
         *             文本
         *             <!-- 选区结束 -->
         *             内容
         *         </span>
         *     </div>
         *
         *     <script>
         *
         *         var ancestorNode = range.getCommonAncestor( true, false );
         *
         *         //output: 3
         *         console.log( ancestorNode.nodeType );
         *         //output: SPAN
         *         console.log( ancestorNode.parentNode.tagName );
         *
         *         ancestorNode = range.getCommonAncestor( true, true );
         *
         *         //output: 1
         *         console.log( ancestorNode.nodeType );
         *         //output: SPAN
         *         console.log( ancestorNode.tagName );
         *
         *     </script>
         *
         * </body>
         * ```
         */
        getCommonAncestor:function (includeSelf, ignoreTextNode) {
            var me = this,
                start = me.startContainer,
                end = me.endContainer;
            if (start === end) {
                if (includeSelf && selectOneNode(this)) {
                    start = start.childNodes[me.startOffset];
                    if(start.nodeType == 1)
                        return start;
                }
                //只有在上来就相等的情况下才会出现是文本的情况
                return ignoreTextNode && start.nodeType == 3 ? start.parentNode : start;
            }
            return domUtils.getCommonAncestor(start, end);
        },

        /**
         * 调整当前Range的开始和结束边界容器，如果是容器节点是文本节点,就调整到包含该文本节点的父节点上
         * @method trimBoundary
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         你好
         *         <!-- 选区开始 -->
         *         我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         <!-- 选区结束 -->
         *         到这里文本结束了
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.trimBoundary();
         *
         *         //output: 1
         *         console.log( range.startContainer.nodeType );
         *         //output: 1
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         */

        /**
         * 调整当前Range的开始和结束边界容器，如果是容器节点是文本节点,就调整到包含该文本节点的父节点上，
         * 可以根据 ignoreEnd 参数的值决定是否调整对结束边界的调整
         * @method trimBoundary
         * @param { Boolean } ignoreEnd 是否忽略对结束边界的调整
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         你好
         *         <!-- 选区开始 -->
         *         我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         <!-- 选区结束 -->
         *         到这里文本结束了
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.trimBoundary( true );
         *
         *         //output: 1
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         */
        trimBoundary:function (ignoreEnd) {
            this.txtToElmBoundary();
            var start = this.startContainer,
                offset = this.startOffset,
                collapsed = this.collapsed,
                end = this.endContainer;
            if (start.nodeType == 3) {
                if (offset == 0) {
                    this.setStartBefore(start);
                } else {
                    if (offset >= start.nodeValue.length) {
                        this.setStartAfter(start);
                    } else {
                        var textNode = domUtils.split(start, offset);
                        //跟新结束边界
                        if (start === end) {
                            this.setEnd(textNode, this.endOffset - offset);
                        } else if (start.parentNode === end) {
                            this.endOffset += 1;
                        }
                        this.setStartBefore(textNode);
                    }
                }
                if (collapsed) {
                    return this.collapse(true);
                }
            }
            if (!ignoreEnd) {
                offset = this.endOffset;
                end = this.endContainer;
                if (end.nodeType == 3) {
                    if (offset == 0) {
                        this.setEndBefore(end);
                    } else {
                        offset < end.nodeValue.length && domUtils.split(end, offset);
                        this.setEndAfter(end);
                    }
                }
            }
            return this;
        },

        /**
         * 如果选区在文本的边界上，就扩展选区到文本的父节点上, 如果当前选区是闭合的， 则什么也不做
         * @method txtToElmBoundary
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         <!-- 选区开始 -->
         *         你好，我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         <!-- 选区结束 -->
         *         到这里文本结束了
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.txtToElmBoundary();
         *
         *         //output: 1
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         <!-- 选区开始 -->
         *         你好，我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         到这里文本结束了
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.txtToElmBoundary();
         *
         *         //output: 1
         *         console.log( range.startContainer.nodeType );
         *         //output: 1
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         */

        /**
         * 如果选区在文本的边界上，就扩展选区到文本的父节点上, 如果当前选区是闭合的， 则根据参数项
         * ignoreCollapsed 的值决定是否执行该调整
         * @method txtToElmBoundary
         * @param { Boolean } ignoreCollapsed 是否忽略选区的闭合状态， 如果该参数取值为true， 则
         *                      不论选区是否闭合， 都会执行该操作， 反之， 则不会对闭合的选区执行该操作
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         你好，我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         <!-- 选区开始 --><!-- 选区结束 -->
         *         到这里文本结束了
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.txtToElmBoundary( true );
         *
         *         //output: 1
         *         console.log( range.startContainer.nodeType );
         *         //output: 1
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *         你好，我是一段文本， 我旁边的注释内容其实是不存在的,仅仅是为了描述一下选区的边界
         *         <!-- 选区开始 --><!-- 选区结束 -->
         *         到这里文本结束了
         *     </div>
         *
         *     <script>
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *         range.txtToElmBoundary( false );
         *
         *         //output: 3
         *         console.log( range.startContainer.nodeType );
         *         //output: 3
         *         console.log( range.endContainer.nodeType );
         *
         *     </script>
         * </body>
         *
         * ```
         */
        txtToElmBoundary:function (ignoreCollapsed) {
            function adjust(r, c) {
                var container = r[c + 'Container'],
                    offset = r[c + 'Offset'];
                if (container.nodeType == 3) {
                    if (!offset) {
                        r['set' + c.replace(/(\w)/, function (a) {
                            return a.toUpperCase();
                        }) + 'Before'](container);
                    } else if (offset >= container.nodeValue.length) {
                        r['set' + c.replace(/(\w)/, function (a) {
                            return a.toUpperCase();
                        }) + 'After' ](container);
                    }
                }
            }

            if (ignoreCollapsed || !this.collapsed) {
                adjust(this, 'start');
                adjust(this, 'end');
            }
            return this;
        },

        /**
         * 在当前选区的开始位置后紧临着插入一个节点，新插入的节点会被该range包含
         * @method  insertNode
         * @param { Node } 需要插入的节点
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         * <body>
         *
         *     <div id="test">
         *         <!-- 选区开始 -->
         *         <span></span>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *
         *         var newNode = document.createElement('div');
         *         newNode.id = 'ueditor';
         *
         *         //output: <span></span><i></i>
         *         console.log( range.cloneContents() );
         *
         *         range.insertNode( newNode );
         *
         *         //output: <div id="ueditor"></div><span></span><i></i>
         *         console.log( range.cloneContents() );
         *
         *     </script>
         *
         * </body>
         * ```
         */
        insertNode:function (node) {
            var first = node, length = 1;
            if (node.nodeType == 11) {
                first = node.firstChild;
                length = node.childNodes.length;
            }
            this.trimBoundary(true);
            var start = this.startContainer,
                offset = this.startOffset;
            var nextNode = start.childNodes[ offset ];
            if (nextNode) {
                start.insertBefore(node, nextNode);
            } else {
                start.appendChild(node);
            }
            if (first.parentNode === this.endContainer) {
                this.endOffset = this.endOffset + length;
            }
            return this.setStartBefore(first);
        },

        /**
         * 闭合选区到当前选区的开始位置， 并且定位光标到闭合后的位置
         * @method  setCursor
         * @return { UE.dom.Range } 当前range对象
         * @see UE.dom.Range:collapse()
         */

        /**
         * 闭合选区， 并且定位光标到闭合后的位置， 可以根据参数toEnd的值控制选区是向前闭合还是向后闭合
         * @method  setCursor
         * @param { Boolean } toEnd 是否向后闭合， 如果为true， 则闭合选区时， 将向结束容器方向闭合，
         *                      反之，则向开始容器方向闭合
         * @return { UE.dom.Range } 当前range对象
         * @see UE.dom.Range:collapse(Boolean)
         */
        setCursor:function (toEnd, noFillData) {
            return this.collapse(!toEnd).select(noFillData);
        },

        /**
         * 创建当前range的一个书签，记录下当前range的位置，方便当dom树改变时，还能找回原来的选区位置
         * @method createBookmark
         * @param { Boolean } serialize 控制返回的标记位置是对当前位置的引用还是ID，如果该值为true，则
         *                              返回标记位置的ID， 反之则返回标记位置的引用
         * @return { Object } 返回一个书签记录键值对， 其包含的key有： start => 开始标记的ID或者引用，
         *                          end => 结束标记的ID或引用， id => 当前标记的类型， 如果为true，则表示
         *                          返回的记录的类型为ID， 反之则为引用
         */
        createBookmark:function (serialize, same) {
            var endNode,
                startNode = this.document.createElement('span');
            startNode.style.cssText = 'display:none;line-height:0px;';
            startNode.appendChild(this.document.createTextNode('\u200D'));
            startNode.id = '_baidu_bookmark_start_' + (same ? '' : guid++);

            if (!this.collapsed) {
                endNode = startNode.cloneNode(true);
                endNode.id = '_baidu_bookmark_end_' + (same ? '' : guid++);
            }
            this.insertNode(startNode);
            if (endNode) {
                this.collapse().insertNode(endNode).setEndBefore(endNode);
            }
            this.setStartAfter(startNode);
            return {
                start:serialize ? startNode.id : startNode,
                end:endNode ? serialize ? endNode.id : endNode : null,
                id:serialize
            }
        },

        /**
         *  调整当前range的边界到书签位置，并删除该书签对象所标记的位置内的节点
         *  @method  moveToBookmark
         *  @param { BookMark } createBookmark所创建的标签对象
         *  @return { UE.dom.Range } 当前range对象
         *  @see UE.dom.Range:createBookmark(Boolean)
         */
        moveToBookmark:function (bookmark) {
            var start = bookmark.id ? this.document.getElementById(bookmark.start) : bookmark.start,
                end = bookmark.end && bookmark.id ? this.document.getElementById(bookmark.end) : bookmark.end;
            this.setStartBefore(start);
            domUtils.remove(start);
            if (end) {
                this.setEndBefore(end);
                domUtils.remove(end);
            } else {
                this.collapse(true);
            }
            return this;
        },

        /**
         * 调整range的边界，使其"放大"到最近的父节点
         * @method  enlarge
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *          <span>
         *              <b>a<!-- 选区开始 -->b</b>
         *              cdef
         *              <!-- 选区结束 -->
         *          </span>
         *     </div>
         *
         *     <script>
         *
         *          range.enlarge();
         *
         *          //output: <span><b>ab</b>cdef</span>
         *          console.log( enlarge.cloneContents() );
         *
         *     </script>
         * </body>
         * ```
         */

        /**
         * 调整range的边界，使其"放大"到最近的父节点，根据参数 toBlock 的取值， 可以
         * 要求扩大之后的父节点是block节点
         * @method  enlarge
         * @param { Boolean } toBlock 是否要求扩大之后的父节点必须是block节点
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *     <div>
         *          <span>
         *              <b>a<!-- 选区开始 -->b</b>
         *              cdef
         *              <!-- 选区结束 -->
         *          </span>
         *     </div>
         *
         *     <script>
         *
         *          range.enlarge( true );
         *
         *          //output: <div><span><b>ab</b>cdef</span></div>
         *          console.log( enlarge.cloneContents() );
         *
         *     </script>
         * </body>
         * ```
         */
        enlarge:function (toBlock, stopFn) {
            var isBody = domUtils.isBody,
                pre, node, tmp = this.document.createTextNode('');
            if (toBlock) {
                node = this.startContainer;
                if (node.nodeType == 1) {
                    if (node.childNodes[this.startOffset]) {
                        pre = node = node.childNodes[this.startOffset]
                    } else {
                        node.appendChild(tmp);
                        pre = node = tmp;
                    }
                } else {
                    pre = node;
                }
                while (1) {
                    if (domUtils.isBlockElm(node)) {
                        node = pre;
                        while ((pre = node.previousSibling) && !domUtils.isBlockElm(pre)) {
                            node = pre;
                        }
                        this.setStartBefore(node);
                        break;
                    }
                    pre = node;
                    node = node.parentNode;
                }
                node = this.endContainer;
                if (node.nodeType == 1) {
                    if (pre = node.childNodes[this.endOffset]) {
                        node.insertBefore(tmp, pre);
                    } else {
                        node.appendChild(tmp);
                    }
                    pre = node = tmp;
                } else {
                    pre = node;
                }
                while (1) {
                    if (domUtils.isBlockElm(node)) {
                        node = pre;
                        while ((pre = node.nextSibling) && !domUtils.isBlockElm(pre)) {
                            node = pre;
                        }
                        this.setEndAfter(node);
                        break;
                    }
                    pre = node;
                    node = node.parentNode;
                }
                if (tmp.parentNode === this.endContainer) {
                    this.endOffset--;
                }
                domUtils.remove(tmp);
            }

            // 扩展边界到最大
            if (!this.collapsed) {
                while (this.startOffset == 0) {
                    if (stopFn && stopFn(this.startContainer)) {
                        break;
                    }
                    if (isBody(this.startContainer)) {
                        break;
                    }
                    this.setStartBefore(this.startContainer);
                }
                while (this.endOffset == (this.endContainer.nodeType == 1 ? this.endContainer.childNodes.length : this.endContainer.nodeValue.length)) {
                    if (stopFn && stopFn(this.endContainer)) {
                        break;
                    }
                    if (isBody(this.endContainer)) {
                        break;
                    }
                    this.setEndAfter(this.endContainer);
                }
            }
            return this;
        },

        /**
         * 调整Range的边界，使其"缩小"到最合适的位置
         * @method adjustmentBoundary
         * @return { UE.dom.Range } 当前range对象
         * @see UE.dom.Range:shrinkBoundary()
         */
        adjustmentBoundary:function () {
            if (!this.collapsed) {
                while (!domUtils.isBody(this.startContainer) &&
                    this.startOffset == this.startContainer[this.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length &&
                    this.startContainer[this.startContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
                    ) {

                    this.setStartAfter(this.startContainer);
                }
                while (!domUtils.isBody(this.endContainer) && !this.endOffset &&
                    this.endContainer[this.endContainer.nodeType == 3 ? 'nodeValue' : 'childNodes'].length
                    ) {
                    this.setEndBefore(this.endContainer);
                }
            }
            return this;
        },
        /*
         * 给range选区中的内容添加给定的标签，主要用于inline标签
         * @name applyInlineStyle
         * @grammar range.applyInlineStyle(tagName)        =>  Range    //tagName为需要添加的样式标签名
         * @grammar range.applyInlineStyle(tagName,attrs)  =>  Range    //attrs为属性json对象
         * @desc
         * <code type="html"><p>xxxx[xxxx]x</p>  ==>  range.applyInlineStyle("strong")  ==>  <p>xxxx[<strong>xxxx</strong>]x</p>
         * <p>xx[dd<strong>yyyy</strong>]x</p>  ==>  range.applyInlineStyle("strong")  ==>  <p>xx[<strong>ddyyyy</strong>]x</p>
         * <p>xxxx[xxxx]x</p>  ==>  range.applyInlineStyle("strong",{"style":"font-size:12px"})  ==>  <p>xxxx[<strong style="font-size:12px">xxxx</strong>]x</p></code>
         */
        applyInlineStyle:function (tagName, attrs, list) {
            if (this.collapsed)return this;
            this.trimBoundary().enlarge(false,
                function (node) {
                    return node.nodeType == 1 && domUtils.isBlockElm(node)
                }).adjustmentBoundary();
            var bookmark = this.createBookmark(),
                end = bookmark.end,
                filterFn = function (node) {
                    return node.nodeType == 1 ? node.tagName.toLowerCase() != 'br' : !domUtils.isWhitespace(node);
                },
                current = domUtils.getNextDomNode(bookmark.start, false, filterFn),
                node,
                pre,
                range = this.cloneRange();
            while (current && (domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING)) {
                if (current.nodeType == 3 || dtd[tagName][current.tagName]) {
                    range.setStartBefore(current);
                    node = current;
                    while (node && (node.nodeType == 3 || dtd[tagName][node.tagName]) && node !== end) {
                        pre = node;
                        node = domUtils.getNextDomNode(node, node.nodeType == 1, null, function (parent) {
                            return dtd[tagName][parent.tagName];
                        });
                    }
                    var frag = range.setEndAfter(pre).extractContents(), elm;
                    if (list && list.length > 0) {
                        var level, top;
                        top = level = list[0].cloneNode(false);
                        for (var i = 1, ci; ci = list[i++];) {
                            level.appendChild(ci.cloneNode(false));
                            level = level.firstChild;
                        }
                        elm = level;
                    } else {
                        elm = range.document.createElement(tagName);
                    }
                    if (attrs) {
                        domUtils.setAttributes(elm, attrs);
                    }
                    elm.appendChild(frag);
                    range.insertNode(list ? top : elm);
                    //处理下滑线在a上的情况
                    var aNode;
                    if (tagName == 'span' && attrs.style && /text\-decoration/.test(attrs.style) && (aNode = domUtils.findParentByTagName(elm, 'a', true))) {
                        domUtils.setAttributes(aNode, attrs);
                        domUtils.remove(elm, true);
                        elm = aNode;
                    } else {
                        domUtils.mergeSibling(elm);
                        domUtils.clearEmptySibling(elm);
                    }
                    //去除子节点相同的
                    domUtils.mergeChild(elm, attrs);
                    current = domUtils.getNextDomNode(elm, false, filterFn);
                    domUtils.mergeToParent(elm);
                    if (node === end) {
                        break;
                    }
                } else {
                    current = domUtils.getNextDomNode(current, true, filterFn);
                }
            }
            return this.moveToBookmark(bookmark);
        },
        /*
         * 对当前range选中的节点，去掉给定的标签节点，但标签中的内容保留，主要用于处理inline元素
         * @name removeInlineStyle
         * @grammar range.removeInlineStyle(tagNames)  => Range  //tagNames 为需要去掉的样式标签名,支持"b"或者["b","i","u"]
         * @desc
         * <code type="html">xx[x<span>xxx<em>yyy</em>zz]z</span>  => range.removeInlineStyle(["em"])  => xx[x<span>xxxyyyzz]z</span></code>
         */
        removeInlineStyle:function (tagNames) {
            if (this.collapsed)return this;
            tagNames = utils.isArray(tagNames) ? tagNames : [tagNames];
            this.shrinkBoundary().adjustmentBoundary();
            var start = this.startContainer, end = this.endContainer;
            while (1) {
                if (start.nodeType == 1) {
                    if (utils.indexOf(tagNames, start.tagName.toLowerCase()) > -1) {
                        break;
                    }
                    if (start.tagName.toLowerCase() == 'body') {
                        start = null;
                        break;
                    }
                }
                start = start.parentNode;
            }
            while (1) {
                if (end.nodeType == 1) {
                    if (utils.indexOf(tagNames, end.tagName.toLowerCase()) > -1) {
                        break;
                    }
                    if (end.tagName.toLowerCase() == 'body') {
                        end = null;
                        break;
                    }
                }
                end = end.parentNode;
            }
            var bookmark = this.createBookmark(),
                frag,
                tmpRange;
            if (start) {
                tmpRange = this.cloneRange().setEndBefore(bookmark.start).setStartBefore(start);
                frag = tmpRange.extractContents();
                tmpRange.insertNode(frag);
                domUtils.clearEmptySibling(start, true);
                start.parentNode.insertBefore(bookmark.start, start);
            }
            if (end) {
                tmpRange = this.cloneRange().setStartAfter(bookmark.end).setEndAfter(end);
                frag = tmpRange.extractContents();
                tmpRange.insertNode(frag);
                domUtils.clearEmptySibling(end, false, true);
                end.parentNode.insertBefore(bookmark.end, end.nextSibling);
            }
            var current = domUtils.getNextDomNode(bookmark.start, false, function (node) {
                return node.nodeType == 1;
            }), next;
            while (current && current !== bookmark.end) {
                next = domUtils.getNextDomNode(current, true, function (node) {
                    return node.nodeType == 1;
                });
                if (utils.indexOf(tagNames, current.tagName.toLowerCase()) > -1) {
                    domUtils.remove(current, true);
                }
                current = next;
            }
            return this.moveToBookmark(bookmark);
        },

        /**
         * 获取当前选区中的首个自闭合的节点
         * @method  getClosedNode
         * @return { Node | NULL } 如果在当前选区中存在自闭合的节点， 则返回该节点， 否则返回NULL
         * @example
         * ```html
         * <body>
         *     <div>
         *         <!-- 选区开始 -->
         *         <a></a>
         *         <span><img></span>
         *         <i></i>
         *         <!-- 选区结束 -->
         *     </div>
         *
         *     <script>
         *
         *         var node = range.getCloseNode();
         *
         *         //output: IMG
         *         console.log( node.tagName );
         *
         *     </script>
         * </body>
         * ```
         */
        getClosedNode:function () {
            var node;
            if (!this.collapsed) {
                var range = this.cloneRange().adjustmentBoundary().shrinkBoundary();
                if (selectOneNode(range)) {
                    var child = range.startContainer.childNodes[range.startOffset];
                    if (child && child.nodeType == 1 && (dtd.$empty[child.tagName] || dtd.$nonChild[child.tagName])) {
                        node = child;
                    }
                }
            }
            return node;
        },

        /**
         * 选中当前选区
         * @method select
         * @return { UE.dom.Range } 返回当前Range对象
         */
        select:browser.ie ? function (noFillData, textRange) {
            var nativeRange;
            if (!this.collapsed)
                this.shrinkBoundary();
            var node = this.getClosedNode();
            if (node && !textRange) {
                try {
                    nativeRange = this.document.body.createControlRange();
                    nativeRange.addElement(node);
                    nativeRange.select();
                } catch (e) {}
                return this;
            }
            var bookmark = this.createBookmark(),
                start = bookmark.start,
                end;
            nativeRange = this.document.body.createTextRange();
            nativeRange.moveToElementText(start);
            nativeRange.moveStart('character', 1);
            if (!this.collapsed) {
                var nativeRangeEnd = this.document.body.createTextRange();
                end = bookmark.end;
                nativeRangeEnd.moveToElementText(end);
                nativeRange.setEndPoint('EndToEnd', nativeRangeEnd);
            } else {
                if (!noFillData && this.startContainer.nodeType != 3) {
                    //使用<span>|x<span>固定住光标
                    var tmpText = this.document.createTextNode(fillChar),
                        tmp = this.document.createElement('span');
                    tmp.appendChild(this.document.createTextNode(fillChar));
                    start.parentNode.insertBefore(tmp, start);
                    start.parentNode.insertBefore(tmpText, start);
                    //当点b,i,u时，不能清除i上边的b
                    removeFillData(this.document, tmpText);
                    fillData = tmpText;
                    mergeSibling(tmp, 'previousSibling');
                    mergeSibling(start, 'nextSibling');
                    nativeRange.moveStart('character', -1);
                    nativeRange.collapse(true);
                }
            }
            this.moveToBookmark(bookmark);
            tmp && domUtils.remove(tmp);
            //IE在隐藏状态下不支持range操作，catch一下
            try {
                nativeRange.select();
            } catch (e) {
            }
            return this;
        } : function (notInsertFillData) {
            function checkOffset(rng){

                function check(node,offset,dir){
                    if(node.nodeType == 3 && node.nodeValue.length < offset){
                        rng[dir + 'Offset'] = node.nodeValue.length
                    }
                }
                check(rng.startContainer,rng.startOffset,'start');
                check(rng.endContainer,rng.endOffset,'end');
            }
            var win = domUtils.getWindow(this.document),
                sel = win.getSelection(),
                txtNode;
            //FF下关闭自动长高时滚动条在关闭dialog时会跳
            //ff下如果不body.focus将不能定位闭合光标到编辑器内
            browser.gecko ? this.document.body.focus() : win.focus();
            if (sel) {
                sel.removeAllRanges();
                // trace:870 chrome/safari后边是br对于闭合得range不能定位 所以去掉了判断
                // this.startContainer.nodeType != 3 &&! ((child = this.startContainer.childNodes[this.startOffset]) && child.nodeType == 1 && child.tagName == 'BR'
                if (this.collapsed && !notInsertFillData) {
//                    //opear如果没有节点接着，原生的不能够定位,不能在body的第一级插入空白节点
//                    if (notInsertFillData && browser.opera && !domUtils.isBody(this.startContainer) && this.startContainer.nodeType == 1) {
//                        var tmp = this.document.createTextNode('');
//                        this.insertNode(tmp).setStart(tmp, 0).collapse(true);
//                    }
//
                    //处理光标落在文本节点的情况
                    //处理以下的情况
                    //<b>|xxxx</b>
                    //<b>xxxx</b>|xxxx
                    //xxxx<b>|</b>
                    var start = this.startContainer,child = start;
                    if(start.nodeType == 1){
                        child = start.childNodes[this.startOffset];

                    }
                    if( !(start.nodeType == 3 && this.startOffset)  &&
                        (child ?
                            (!child.previousSibling || child.previousSibling.nodeType != 3)
                            :
                            (!start.lastChild || start.lastChild.nodeType != 3)
                        )
                    ){
                        txtNode = this.document.createTextNode(fillChar);
                        //跟着前边走
                        this.insertNode(txtNode);
                        removeFillData(this.document, txtNode);
                        mergeSibling(txtNode, 'previousSibling');
                        mergeSibling(txtNode, 'nextSibling');
                        fillData = txtNode;
                        this.setStart(txtNode, browser.webkit ? 1 : 0).collapse(true);
                    }
                }
                var nativeRange = this.document.createRange();
                if(this.collapsed && browser.opera && this.startContainer.nodeType == 1){
                    var child = this.startContainer.childNodes[this.startOffset];
                    if(!child){
                        //往前靠拢
                        child = this.startContainer.lastChild;
                        if( child && domUtils.isBr(child)){
                            this.setStartBefore(child).collapse(true);
                        }
                    }else{
                        //向后靠拢
                        while(child && domUtils.isBlockElm(child)){
                            if(child.nodeType == 1 && child.childNodes[0]){
                                child = child.childNodes[0]
                            }else{
                                break;
                            }
                        }
                        child && this.setStartBefore(child).collapse(true)
                    }

                }
                //是createAddress最后一位算的不准，现在这里进行微调
                checkOffset(this);
                nativeRange.setStart(this.startContainer, this.startOffset);
                nativeRange.setEnd(this.endContainer, this.endOffset);
                sel.addRange(nativeRange);
            }
            return this;
        },

        /**
         * 滚动到当前range开始的位置
         * @method scrollToView
         * @param { Window } win 当前range对象所属的window对象
         * @return { UE.dom.Range } 当前Range对象
         */

        /**
         * 滚动到距离当前range开始位置 offset 的位置处
         * @method scrollToView
         * @param { Window } win 当前range对象所属的window对象
         * @param { Number } offset 距离range开始位置处的偏移量， 如果为正数， 则向下偏移， 反之， 则向上偏移
         * @return { UE.dom.Range } 当前Range对象
         */
        scrollToView:function (win, offset) {
            win = win ? window : domUtils.getWindow(this.document);
            var me = this,
                span = me.document.createElement('span');
            //trace:717
            span.innerHTML = '&nbsp;';
            me.cloneRange().insertNode(span);
            domUtils.scrollToView(span, win, offset);
            domUtils.remove(span);
            return me;
        },
        /**
         * 判断当前选区内容是否占位符
         * @method inFillChar
         * @return { Boolean } 如果是占位符返回true，否则返回false
         */
        inFillChar : function(){
            var start = this.startContainer;
            if(this.collapsed && start.nodeType == 3
                && start.nodeValue.replace(new RegExp('^' + domUtils.fillChar),'').length + 1 == start.nodeValue.length
                ){
                return true;
            }
            return false;
        },

        /**
         * 保存
         * @method createAddress
         * @return { Boolean } 返回开始和结束的位置
         * @example
         * ```html
         * <body>
         *     <p>
         *         aaaa
         *         <em>
         *             <!-- 选区开始 -->
         *             bbbb
         *             <!-- 选区结束 -->
         *         </em>
         *     </p>
         *
         *     <script>
         *         //output: {startAddress:[0,1,0,0],endAddress:[0,1,0,4]}
         *         console.log( range.createAddress() );
         *     </script>
         * </body>
         * ```
         */
        createAddress : function(ignoreEnd,ignoreTxt){
            var addr = {},me = this;

            function getAddress(isStart){
                var node = isStart ? me.startContainer : me.endContainer;
                var parents = domUtils.findParents(node,true,function(node){return !domUtils.isBody(node)}),
                    addrs = [];
                for(var i = 0,ci;ci = parents[i++];){
                    addrs.push(domUtils.getNodeIndex(ci,ignoreTxt));
                }
                var firstIndex = 0;

                if(ignoreTxt){
                    if(node.nodeType == 3){
                        var tmpNode = node.previousSibling;
                        while(tmpNode && tmpNode.nodeType == 3){
                            firstIndex += tmpNode.nodeValue.replace(fillCharReg,'').length;
                            tmpNode = tmpNode.previousSibling;
                        }
                        firstIndex +=  (isStart ? me.startOffset : me.endOffset)// - (fillCharReg.test(node.nodeValue) ? 1 : 0 )
                    }else{
                        node =  node.childNodes[ isStart ? me.startOffset : me.endOffset];
                        if(node){
                            firstIndex = domUtils.getNodeIndex(node,ignoreTxt);
                        }else{
                            node = isStart ? me.startContainer : me.endContainer;
                            var first = node.firstChild;
                            while(first){
                                if(domUtils.isFillChar(first)){
                                    first = first.nextSibling;
                                    continue;
                                }
                                firstIndex++;
                                if(first.nodeType == 3){
                                    while( first && first.nodeType == 3){
                                        first = first.nextSibling;
                                    }
                                }else{
                                    first = first.nextSibling;
                                }
                            }
                        }
                    }

                }else{
                    firstIndex = isStart ? domUtils.isFillChar(node) ? 0 : me.startOffset  : me.endOffset
                }
                if(firstIndex < 0){
                    firstIndex = 0;
                }
                addrs.push(firstIndex);
                return addrs;
            }
            addr.startAddress = getAddress(true);
            if(!ignoreEnd){
                addr.endAddress = me.collapsed ? [].concat(addr.startAddress) : getAddress();
            }
            return addr;
        },
        /**
         * 保存
         * @method createAddress
         * @return { Boolean } 返回开始和结束的位置
         * @example
         * ```html
         * <body>
         *     <p>
         *         aaaa
         *         <em>
         *             <!-- 选区开始 -->
         *             bbbb
         *             <!-- 选区结束 -->
         *         </em>
         *     </p>
         *
         *     <script>
         *         var range = editor.selection.getRange();
         *         range.moveToAddress({startAddress:[0,1,0,0],endAddress:[0,1,0,4]});
         *         range.select();
         *         //output: 'bbbb'
         *         console.log(editor.selection.getText());
         *     </script>
         * </body>
         * ```
         */
        moveToAddress : function(addr,ignoreEnd){
            var me = this;
            function getNode(address,isStart){
                var tmpNode = me.document.body,
                    parentNode,offset;
                for(var i= 0,ci,l=address.length;i<l;i++){
                    ci = address[i];
                    parentNode = tmpNode;
                    tmpNode = tmpNode.childNodes[ci];
                    if(!tmpNode){
                        offset = ci;
                        break;
                    }
                }
                if(isStart){
                    if(tmpNode){
                        me.setStartBefore(tmpNode)
                    }else{
                        me.setStart(parentNode,offset)
                    }
                }else{
                    if(tmpNode){
                        me.setEndBefore(tmpNode)
                    }else{
                        me.setEnd(parentNode,offset)
                    }
                }
            }
            getNode(addr.startAddress,true);
            !ignoreEnd && addr.endAddress &&  getNode(addr.endAddress);
            return me;
        },

        /**
         * 判断给定的Range对象是否和当前Range对象表示的是同一个选区
         * @method equals
         * @param { UE.dom.Range } 需要判断的Range对象
         * @return { Boolean } 如果给定的Range对象与当前Range对象表示的是同一个选区， 则返回true， 否则返回false
        equals : function(rng){
            for(var p in this){
                if(this.hasOwnProperty(p)){
                    if(this[p] !== rng[p])
                        return false
                }
            }
            return true;

        },

        /**
         * 遍历range内的节点。每当遍历一个节点时， 都会执行参数项 doFn 指定的函数， 该函数的接受当前遍历的节点
         * 作为其参数。
         * @method traversal
         * @param { Function }  doFn 对每个遍历的节点要执行的方法， 该方法接受当前遍历的节点作为其参数
         * @return { UE.dom.Range } 当前range对象
         * @example
         * ```html
         *
         * <body>
         *
         *     <!-- 选区开始 -->
         *     <span></span>
         *     <a></a>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *
         *     //output: <span></span><a></a>
         *     console.log( range.cloneContents() );
         *
         *     range.traversal( function ( node ) {
         *
         *         if ( node.nodeType === 1 ) {
         *             node.className = "test";
         *         }
         *
         *     } );
         *
         *     //output: <span class="test"></span><a class="test"></a>
         *     console.log( range.cloneContents() );
         *
         * </script>
         * ```
         */

        /**
         * 遍历range内的节点。
         * 每当遍历一个节点时， 都会执行参数项 doFn 指定的函数， 该函数的接受当前遍历的节点
         * 作为其参数。
         * 可以通过参数项 filterFn 来指定一个过滤器， 只有符合该过滤器过滤规则的节点才会触
         * 发doFn函数的执行
         * @method traversal
         * @param { Function } doFn 对每个遍历的节点要执行的方法， 该方法接受当前遍历的节点作为其参数
         * @param { Function } filterFn 过滤器， 该函数接受当前遍历的节点作为参数， 如果该节点满足过滤
         *                      规则， 请返回true， 该节点会触发doFn， 否则， 请返回false， 则该节点不
         *                      会触发doFn。
         * @return { UE.dom.Range } 当前range对象
         * @see UE.dom.Range:traversal(Function)
         * @example
         * ```html
         *
         * <body>
         *
         *     <!-- 选区开始 -->
         *     <span></span>
         *     <a></a>
         *     <!-- 选区结束 -->
         * </body>
         *
         * <script>
         *
         *     //output: <span></span><a></a>
         *     console.log( range.cloneContents() );
         *
         *     range.traversal( function ( node ) {
         *
         *         node.className = "test";
         *
         *     }, function ( node ) {
         *          return node.nodeType === 1;
         *     } );
         *
         *     //output: <span class="test"></span><a class="test"></a>
         *     console.log( range.cloneContents() );
         *
         * </script>
         * ```
         */
        traversal:function(doFn,filterFn){
            if (this.collapsed)
                return this;
            var bookmark = this.createBookmark(),
                end = bookmark.end,
                current = domUtils.getNextDomNode(bookmark.start, false, filterFn);
            while (current && current !== end && (domUtils.getPosition(current, end) & domUtils.POSITION_PRECEDING)) {
                var tmpNode = domUtils.getNextDomNode(current,false,filterFn);
                doFn(current);
                current = tmpNode;
            }
            return this.moveToBookmark(bookmark);
        }
    };
})();