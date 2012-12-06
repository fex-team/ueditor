/**
 * @file
 * @name ui.Utils
 * @import ui/ui.js
 * @desc 常用工具类
 */

(function(ui){
    var ueUtils = ui.UE_Utils,
        utils = ui.Utils = {
            /**
             * @name guid
             * @desc 根据prefix取得相应的一个guid
             * @grammar utils.guid(prefix) //prefix起到分组和前缀的作用 推荐[a-zA-Z]
             */
            guid: function(){
                var allguid = [];
                return function(prefix){
                    return prefix + (prefix in allguid ? ++allguid[prefix] : (allguid[prefix]=0));
                }
            }(),

            /**
             * @name isObject
             * @grammar utils.isObject(object)
             */
            isObject: function(object){
                return '[object Object]'===Object.prototype.toString.call(object);
            },

            /**
             * @name each
             * @grammar utils.each(object, callback)
             * @desc 遍历数组或对象执行回调函数
             */
            each: function(object, callback){
                var name, i= 0,
                    len = object.length,
                    isObj = len===undefined || ueUtils.isFunction(object);

                if(isObj){
                    for(name in object){
                        if(callback.call(object[name], name, object[name])===false) break;
                    }
                }
                else{
                    for(;i<len;)
                        if(callback.call(object, i, object[i++]) === false) break;
                }
            },

            /**
             * @name bind
             * @grammar utils.bind(fn, context, ...)
             * @desc 绑定函数到指定的作用域，可选任意参数
             */
            bind: function(fn, context){
                var args = [].slice.call(arguments, 0).slice(2);
                return function(){
                    fn.apply(context, args);
                }
            },

            /**
             * @name isContains
             * @grammar utils.isContains(nodeA, nodeB);
             * @desc 判断DOM节点是否包含关系
             */
            isContains: function(){
                var fn = document.documentElement.contains ?
                    function(nodeA, nodeB){return nodeA.contains(nodeB)} :
                    function(nodeA, nodeB){return nodeA.compareDocumentPosition(nodeB)&16};

                return function(nodeA, nodeB){
                    return nodeA===nodeB ? false : fn.call(null, nodeA, nodeB);
                }
            }(),

            /**
             * @name makeUnselectable
             * @grammar utils.makeUnselectable(element)
             * @desc 设置元素不可选
             */
            makeUnselectable: function (element){
                var tmp,
                    elestyle = element.style,
                    testIter = ['MozUserSelect', 'WebkitUserSelect', 'KhtmlUserSelect'];

                element.setAttribute('unselectable', 'on');
                element.setAttribute('onselectstart', 'return false');
                for(var i= 0,len=testIter.length; i<len;){
                    tmp = testIter[i++];
                    tmp in elestyle && (elestyle[tmp]='none');
                }
            },

            getClientRect: function (element){
                var bcr;
                //trace  IE6下在控制编辑器显隐时可能会报错，catch一下
                try{
                    bcr = element.getBoundingClientRect();
                }catch(e){
                    bcr={left:0,top:0,height:0,width:0}
                }
                var rect = {
                    left: Math.round(bcr.left),
                    top: Math.round(bcr.top),
                    height: Math.round(bcr.bottom - bcr.top),
                    width: Math.round(bcr.right - bcr.left)
                };
                var doc;
                while ((doc = element.ownerDocument) !== document &&
                    (element = this.getWindow(doc).frameElement)) {
                    bcr = element.getBoundingClientRect();
                    rect.left += bcr.left;
                    rect.top += bcr.top;
                }
                rect.bottom = rect.top + rect.height;
                rect.right = rect.left + rect.width;
                return rect;
            },

            getViewportOffsetByEvent: function (evt){
                var el = evt.target || evt.srcElement;
                var frameEl = this.getWindow(el).frameElement;
                var offset = {
                    left: evt.clientX,
                    top: evt.clientY
                };
                if (frameEl && el.ownerDocument !== document) {
                    var rect = this.getClientRect(frameEl);
                    offset.left += rect.left;
                    offset.top += rect.top;
                }
                return offset;
            },

            getEventOffset: function (evt){
                var el = evt.target || evt.srcElement;
                var rect = this.getClientRect(el);
                var offset = this.getViewportOffsetByEvent(evt);
                return {
                    left: offset.left - rect.left,
                    top: offset.top - rect.top
                };
            },

            getViewportElement: function (){
                return (utils.ie && utils.quirks) ?
                    document.body : document.documentElement;
            },

            getViewportRect: function (){
                var viewportEl = utils.getViewportElement();
                var width = (window.innerWidth || viewportEl.clientWidth) | 0;
                var height = (window.innerHeight ||viewportEl.clientHeight) | 0;
                return {
                    left: 0,
                    top: 0,
                    height: height,
                    width: width,
                    bottom: height,
                    right: width
                };
            },

            startDrag: function (evt, callbacks,doc){
                var doc = doc || document;
                var startX = evt.clientX;
                var startY = evt.clientY;
                function handleMouseMove(evt){
                    var x = evt.clientX - startX;
                    var y = evt.clientY - startY;
                    callbacks.ondragmove(x, y);
                    if (evt.stopPropagation) {
                        evt.stopPropagation();
                    } else {
                        evt.cancelBubble = true;
                    }
                }
                if (doc.addEventListener) {
                    function handleMouseUp(evt){
                        doc.removeEventListener('mousemove', handleMouseMove, true);
                        doc.removeEventListener('mouseup', handleMouseMove, true);
                        window.removeEventListener('mouseup', handleMouseUp, true);
                        callbacks.ondragstop();
                    }
                    doc.addEventListener('mousemove', handleMouseMove, true);
                    doc.addEventListener('mouseup', handleMouseUp, true);
                    window.addEventListener('mouseup', handleMouseUp, true);
                    evt.preventDefault();
                } else {
                    var elm = evt.srcElement;
                    elm.setCapture();
                    function releaseCaptrue(){
                        elm.releaseCapture();
                        elm.detachEvent('onmousemove', handleMouseMove);
                        elm.detachEvent('onmouseup', releaseCaptrue);
                        elm.detachEvent('onlosecaptrue', releaseCaptrue);
                        callbacks.ondragstop();
                    }
                    elm.attachEvent('onmousemove', handleMouseMove);
                    elm.attachEvent('onmouseup', releaseCaptrue);
                    elm.attachEvent('onlosecaptrue', releaseCaptrue);
                    evt.returnValue = false;
                }
                callbacks.ondragstart();
            },

            getScrollOffsetByDir: function(dir){
                var f = dir.charAt(0),
                    scrollDir = 'scroll' + dir.replace(f, f.toUpperCase());

                return Math.max(document.body[scrollDir], document.documentElement[scrollDir]);
            },

            stopPropagation: function(e){
                try{
                    e.stopPropagation();
                }catch(er){
                    e.cancelBubble = true;
                }
            },
            unLinster:function(obj){
                var allListeners = obj.__allListeners;
                if(allListeners){
                    for(var k in allListeners){
                        if(allListeners[k]&&allListeners[k].length){
                            allListeners[k] = [];
                        }
                    }
                }
            }
        };

    ueUtils.extend(utils, ueUtils, true); //扩展utils但保留自身实现
    ueUtils.extend(utils, ui.UE_DomUtils, true); //扩展utils但保留自身实现
    ueUtils.extend(utils, ui.UE_Browser, true); //扩展utils但保留自身实现
})(UE.ui);
