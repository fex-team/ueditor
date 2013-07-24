///import core
///commands 改变图片大小
///commandsName  imageresize
///commandsTitle  改变图片大小

UE.plugins['imageresize'] = (function () {

    function Resize() {
        this.editor = null;
        this.container = null;
        this.cover = null;
        this.prePos = {x: 0, y: 0};
        this.startPos = {x: 0, y: 0};
    }

    (function () {
        var allResizes = [],
            rect = [
                //[left, top, width, height]
                [1, 1, -1, -1],
                [0, 1, 0, -1],
                [0, 1, 1, -1],
                [1, 0, -1, 0],
                [0, 0, 1, 0],
                [1, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        Resize.prototype = {
            init: function (editorObj) {
                var me = this,
                    hands = [],
                    cover = me.cover = document.createElement('div'),
                    container = me.container = document.createElement('div');

                me.editor = editorObj;
                me.editor.ui._imageResize = me;
                allResizes.push(me);

                for (i = 0; i < 8; i++) {
                    hands[i] = document.createElement('span');
                    hands[i].className = 'hand' + i;
                    container.appendChild(hands[i]);
                }
                cover.id = me.editor.ui.id + '_imageresize_cover';
                cover.style.cssText = 'position:absolute;display:none;z-index:' + (me.editor.options.zIndex) + ';filter:alpha(opacity=0); opacity:0;background:#CCC;';
                domUtils.on(cover, 'mousedown', function () {
                    me.hideCover();
                });

                container.id = me.editor.ui.id + '_imageresize';
                container.className = 'edui-editor-imageresize';
                container.style.cssText += ';position:absolute;display:none;border:1px solid #3b77ff;z-index:' + (me.editor.options.zIndex) + ';';

                me.editor.ui.getDom().appendChild(cover);
                me.editor.ui.getDom().appendChild(container);
                me.initStyle();

            },
            initStyle: function () {
                utils.cssRule('imageresize', '.edui-editor-imageresize span{position:absolute;left:0;top:0;width:6px;height:6px;overflow:hidden;font-size:0px;display:block;background-color:#006DAE;}'
                    + '.edui-editor-imageresize .hand0, .edui-editor-imageresize .hand7{cursor:nw-resize;}'
                    + '.edui-editor-imageresize .hand1, .edui-editor-imageresize .hand6{left:50%;margin-left:-3px;cursor:n-resize;}'
                    + '.edui-editor-imageresize .hand2, .edui-editor-imageresize .hand4, .edui-editor-imageresize .hand7{left:100%;margin-left:-6px;}'
                    + '.edui-editor-imageresize .hand3, .edui-editor-imageresize .hand4{top:50%;margin-top:-3px;cursor:w-resize;}'
                    + '.edui-editor-imageresize .hand5, .edui-editor-imageresize .hand6, .edui-editor-imageresize .hand7{margin-top:-6px;top:100%;}'
                    + '.edui-editor-imageresize .hand2, .edui-editor-imageresize .hand5{cursor:ne-resize;}');
            },
            initEvents: function () {
                var me = this,
                    doc = document;

                me.startPos.x = me.startPos.y = 0;
                me.isDraging = false;
                me.dragId = -1;

                var _mouseMoveHandler = function (e) {
                    if (me.isDraging) {
                        me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                        me.prePos.x = e.clientX;
                        me.prePos.y = e.clientY;
                    }
                };
                domUtils.on(this.container, 'mousedown', function (e) {
                    var hand = e.target || e.srcElement, hand;
                    if (hand.className.indexOf('hand') != -1) {
                        me.dragId = hand.className.slice(-1);
                        me.startPos.x = e.clientX;
                        me.startPos.y = e.clientY;
                        me.prePos.x = e.clientX;
                        me.prePos.y = e.clientY;
                        me.isDraging = true;
                        domUtils.on(doc, 'mousemove', _mouseMoveHandler);
                        document.body.setAttribute('onselectstart', "return false");
                        me.showCover();
                    }
                });
                domUtils.on(doc, 'mouseup', function (e) {
                    if (me.isDraging) {
                        me.isDraging = false;
                        me.dragId = -1;
                        me.updateScaledElement();
                        me.setTarget(me.target);
                        me.hideCover();
                    }
                    domUtils.un(doc, 'mousemove', _mouseMoveHandler);
                });
            },
            setTarget: function (targetObj) {
                var me = this,
                    target = me.target = targetObj,
                    container = this.container,
                    imgPos = domUtils.getXY(target),
                    iframePos = domUtils.getXY(me.editor.iframe),
                    editorPos = domUtils.getXY(container.parentNode);
                var x = iframePos.x + imgPos.x - me.editor.document.body.scrollLeft - editorPos.x - parseInt(container.style.borderLeftWidth),
                    y = iframePos.y + imgPos.y - me.editor.document.body.scrollTop - editorPos.y - parseInt(container.style.borderTopWidth);
                container.style.width = target.offsetWidth + 'px';
                container.style.height = target.offsetHeight + 'px';
                container.style.left = x + 'px';
                container.style.top = y + 'px';
                me.initEvents();
            },
            updateScaledElement: function () {
                var me = this;
                me.target.style.width = parseInt(me.container.style.width) + 'px';
                me.target.style.height = parseInt(me.container.style.height) + 'px';
            },
            updateContainerStyle: function (dir, offset) {
                var me = this,
                    dom = me.container, tmp;

                rect['def'] = [1, 1, 0, 0];
                if (rect[dir][0] != 0) {
                    tmp = parseInt(dom.style.left) + offset.x;
                    dom.style.left = me._validScaledProp('left', tmp) + 'px';
                }
                if (rect[dir][1] != 0) {
                    tmp = parseInt(dom.style.top) + offset.y;
                    dom.style.top = me._validScaledProp('top', tmp) + 'px';
                }
                if (rect[dir][2] != 0) {
                    tmp = dom.clientWidth + rect[dir][2] * offset.x;
                    dom.style.width = me._validScaledProp('width', tmp) + 'px';
                }
                if (rect[dir][3] != 0) {
                    tmp = dom.clientHeight + rect[dir][3] * offset.y;
                    dom.style.height = me._validScaledProp('height', tmp) + 'px';
                }
            },
            _validScaledProp: function (prop, value) {
                var ele = this.container,
                    wrap = document;

                value = isNaN(value) ? 0 : value;
                switch (prop) {
                    case 'left':
                        return value < 0 ? 0 : (value + ele.clientWidth) > wrap.clientWidth ? wrap.clientWidth - ele.clientWidth : value;
                    case 'top':
                        return value < 0 ? 0 : (value + ele.clientHeight) > wrap.clientHeight ? wrap.clientHeight - ele.clientHeight : value;
                    case 'width':
                        return value <= 0 ? 1 : (value + ele.offsetLeft) > wrap.clientWidth ? wrap.clientWidth - ele.offsetLeft : value;
                    case 'height':
                        return value <= 0 ? 1 : (value + ele.offsetTop) > wrap.clientHeight ? wrap.clientHeight - ele.offsetTop : value;
                }
            },
            hideCover: function () {
                this.cover.style.display = 'none';
            },
            showCover: function () {
                var me = this,
                    cover = me.cover,
                    w = me.editor.iframe.offsetWidth,
                    h = me.editor.iframe.offsetHeight,
                    editorPos = domUtils.getXY(me.editor.ui.getDom()),
                    iframePos = domUtils.getXY(me.editor.iframe);

                cover.style.cssText += ';width:' + w + 'px; height:' + h + 'px;top:' + (iframePos.y - editorPos.y) + 'px;left:' + (iframePos.x - editorPos.x) + 'px;';
                cover.style.display = '';
            },
            show: function () {
                var me = this;
                me.container.style.display = 'block';
                me.editor.document.body.contentEditable = 'false';

                me._keyDownHandler = function() {
                    me.hide();
                    var range = me.editor.selection.getRange();
                    range.selectNode(me.target);
                    range.select();
                }
                me._mouseDownHandler = function(e) {
                    var ele = e.target || e.srcElement;
                    if (ele && ele.className.indexOf('imageresize')==-1 && ele.parentNode.className.indexOf('imageresize')==-1 ) {
                        me._keyDownHandler();
                    }
                }

                domUtils.on(document, 'keydown', me._keyDownHandler);
                domUtils.on(me.editor.document, 'keydown', me._keyDownHandler);
                domUtils.on(document, 'mousedown', me._mouseDownHandler);
                domUtils.on(me.editor.document, 'mousedown', me._mouseDownHandler);
            },
            hide: function () {
                var me = this;
                me.hideCover();
                me.container.style.display = 'none';
                me.editor.document.body.contentEditable = 'true';

                domUtils.un(document, 'keydown', me._keyDownHandler);
                domUtils.un(me.editor.document, 'keydown', me._keyDownHandler);
                domUtils.un(document, 'mousedown', me._mouseDownHandler);
                domUtils.un(me.editor.document, 'mousedown', me._mouseDownHandler);
            }
        }
    })();

    return function () {
        var me = this;
        if (me.options.imageResizeEnabled === undefined) me.options.imageResizeEnabled = true;
        if (me.options.imageResizeEnabled) {
            me.addListener('mousedown', function (type, e) {
                var img = e.target || e.srcElement;
                if (img && img.tagName == 'IMG') {
                    var imageResize;
                    if (me.ui._imageResize) {
                        imageResize = me.ui._imageResize;
                    } else {
                        imageResize = me.ui._imageResize = new Resize();
                        imageResize.init(me);
                    }
                    imageResize.setTarget(img);
                    imageResize.show();
                } else {
                    if (me.ui._imageResize) me.ui._imageResize.hide();
                }
            });
        }
    }
})();