///import core
///commands 拖拽改变图片大小
///commandsName  imageresize
///commandsTitle  拖拽改变图片大小

function Resize() {
    this.dom = null;
}
(function () {
    var editor,
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
            editor = editorObj;
            if (!editor.ui._imageResize) editor.ui._imageResize = this;

            var me = this,
                angles = [],
                cover = document.createElement('div'),
                container = document.createElement('div');

            for (i = 0; i < 8; i++) {
                angles[i] = document.createElement('span');
                angles[i].className = 'hand' + i;
                angles[i].style.width = angles[i].style.height = '6px';
                container.appendChild(angles[i]);
            }
            cover.id = editor.ui.id + '_resizeCover';
            cover.style.cssText = 'position:absolute;display:none;z-index:'+(editor.options.zIndex+11)+';';
            container.id = editor.ui.id + '_resize';
            container.className = 'edui-editor-resize';
            container.style.cssText += 'position:absolute;display:none;border:1px solid #3b77ff;z-index:' + (editor.options.zIndex+12) + ';';

            editor.ui.getDom().appendChild(cover);
            editor.ui.getDom().appendChild(container);

            this.dom = {
                cover: cover,
                container: container,
                angles: angles
            };
            me.initStyle();
        },
        reset: function (targetObj) {
            var me = this,
                target = me.target = targetObj,
                container = this.dom.container,
                imgPos = UE.dom.domUtils.getXY(target),
                iframePos = UE.dom.domUtils.getXY(editor.iframe),
                editorPos = UE.dom.domUtils.getXY(container.parentNode);
            var x = iframePos.x + imgPos.x - editor.document.body.scrollLeft - editorPos.x - parseInt(container.style.borderLeftWidth),
                y = iframePos.y + imgPos.y - editor.document.body.scrollTop - editorPos.y - parseInt(container.style.borderTopWidth);
            container.style.width = target.offsetWidth + 'px';
            container.style.height = target.offsetHeight + 'px';
            container.style.left = x + 'px';
            container.style.top = y + 'px';
            me.initEvents();
        },
        initStyle: function () {
            var doc = document,
                head = doc.getElementsByTagName('head')[0],
                style = doc.createElement('style'),
                cssText = '.edui-editor-resize span{position:absolute;left:0;top:0;width:6px;height:6px;background-color:#006DAE;}'
                    + '.edui-editor-resize .hand0, .edui-editor-resize .hand7{cursor:nw-resize;}'
                    + '.edui-editor-resize .hand1, .edui-editor-resize .hand6{left:50%;margin-left:-3px;cursor:n-resize;}'
                    + '.edui-editor-resize .hand2, .edui-editor-resize .hand4, .edui-editor-resize .hand7{left:100%;margin-left:-6px;}'
                    + '.edui-editor-resize .hand3, .edui-editor-resize .hand4{top:50%;margin-top:-3px;cursor:w-resize;}'
                    + '.edui-editor-resize .hand5, .edui-editor-resize .hand6, .edui-editor-resize .hand7{margin-top:-6px;top:100%;}'
                    + '.edui-editor-resize .hand2, .edui-editor-resize .hand5{cursor:ne-resize;}';
            style.type = 'text/css';

            try {
                style.appendChild(doc.createTextNode(cssText));
            } catch (e) {
                style.styleSheet.cssText = cssText;
            }
            head.appendChild(style);
        },
        initEvents: function () {
            var me = this,
                doc = document;

            me.startX = me.startY = 0;
            me.isDraging = false;
            me.dragId = -1;

            var _mousemoveHandler = function (e) {
                console.log('moving');
                if (me.isDraging) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.preX, y: e.clientY - me.preY});
                    me.preX = e.clientX;
                    me.preY = e.clientY;
                }
            };
            UE.dom.domUtils.on(this.dom.container, 'mousedown', function (e) {
                var target = e.target, hand;
                if (target.className.indexOf('hand') != -1) {
                    me.dragId = target.className.slice(-1);
                    me.startX = e.clientX;
                    me.startY = e.clientY;
                    me.preX = e.clientX;
                    me.preY = e.clientY;
                    me.isDraging = true;
                    UE.dom.domUtils.on(doc, 'mousemove', _mousemoveHandler);
                    document.body.setAttribute('onselectstart', "return false");
                    me.showCover();
                }
            });
            UE.dom.domUtils.on(doc, 'mouseup', function (e) {
                if(me.isDraging){
                    me.isDraging = false;
                    me.dragId = -1;
                    me.updateScaledElement();
                    me.reset(me.target);
                    me.hideCover();
                }
                UE.dom.domUtils.un(doc, 'mousemove', _mousemoveHandler);
            });
        },
        updateScaledElement: function () {
            var me = this;
            me.target.style.width = parseInt(me.dom.container.style.width) + 'px';
            me.target.style.height = parseInt(me.dom.container.style.height) + 'px';
        },
        updateContainerStyle: function (dir, offset) {
            var me = this,
                dom = me.dom.container, tmp;

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
            if (dir === 'def') {
                me.updateScaledElement({position: {x: dom.style.left, y: dom.style.top}});
            }
        },
        _validScaledProp: function (prop, value) {
            var ele = this.dom.container,
                wrap = editor.document.body;

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
            this.dom.cover.style.display = 'none';
        },
        showCover: function () {
            var me = this,
                cover = me.dom.cover,
                w = editor.iframe.offsetWidth,
                h = editor.iframe.offsetHeight,
                editorPos = UE.dom.domUtils.getXY(editor.ui.getDom()),
                iframePos = UE.dom.domUtils.getXY(editor.iframe);

            cover.id = editor.ui.id + '_resizeCover';
            cover.style.display = 'block';
            cover.style.cssText += 'width:'+w+'px;height:'+h+'px;top:'+(iframePos.y-editorPos.y)+'px;left:'+(iframePos.x-editorPos.x)+'px;';
        },
        show: function () {
            this.dom.container.style.display = 'block';
            editor.document.body.contentEditable = 'false';
//            editor.document.body.setAttribute('unselectable','on');
        },
        hide: function () {
            this.dom.container.style.display = 'none';
            editor.document.body.contentEditable = 'true';
//            editor.document.body.removeAttribute('unselectable');
        }
    }
})();

UE.plugins['imageresize'] = function () {
    var me = this;
//    me.commands['imageresize'] = {
//        execCommand: function (cmd, opt) {
//            var range = this.selection.getRange(), img = range.getClosedNode();
//            if (img && img.tagName == 'IMG') {
//                img.setAttribute('width', opt.width);
//                img.setAttribute('height', opt.height);
//            }
//        }
//    };
    me.addListener('selectionchange', function (t, causeByUi) {
        if (!causeByUi) return;
        var img = me.selection.getRange().getClosedNode();
        if (img && img.tagName == 'IMG') {
            var iamgeResize;
            if (me.ui._imageResize) {
                iamgeResize = me.ui._imageResize;
            } else {
                iamgeResize = new Resize();
                iamgeResize.init(me);
            }
            iamgeResize.reset(img);
            iamgeResize.show();

            me.selection.getRange().setStartAfter(img);
        } else {
            if (me.ui._imageResize) me.ui._imageResize.hide();
        }

    });
};