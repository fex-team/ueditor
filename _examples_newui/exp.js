F.module('/static/edit/ui/dataCenter/dataCenter.js', function(require, exports) {
    /*-----[ /static/edit/ui/dataCenter/dataCenter.js ]-----*/
    
    var T = require("/static/common/lib/tangram/base/base.js");
    var dataCenter = {
        data: {
            cid: F.context('cid'), /* 非新经验才会有cid */
            did: F.context('did'), /* 草稿才会有did */
            CatPath: F.context('CatPath'), /* 非新经验才会有分类路径 */
            title: F.context('title'),
            titleHtml: F.context('titleHtml'),
            eid: F.context('eid'), /* 新版本才会有eidEnc */
            type: F.context('type'),
            originTitle: F.context('originTitle'),
            originAuthor: F.context('originAuthor'),
            isOriginal: F.context('isOriginal'),
            contentChanged: false,
            tid: F.context('tid'),
            expContent: T.object.clone(F.context('expContent')),
            hasVideo: false,
            titleMin: F.context('titleMin'),
            titleMax: F.context('titleMax'),
            CONTENT_TOO_SHORT_EMBED: F.context('CONTENT_TOO_SHORT_EMBED'),
            CONTENT_TOO_SHORT: F.context('CONTENT_TOO_SHORT'),
            CONTENT_TOO_LONG: F.context('CONTENT_TOO_LONG'),
            REFERENCE_TOO_LONG: F.context('REFERENCE_TOO_LONG') /* 非新经验才会有did */
        },
        dataProxy: {
            /**
		 * 数据代理
		 *
		 */
            reference: 'reference',
            originAuthor: 'originAuthor',
            isOriginal: 'isOriginal',
            category: 'cate-input',
            hasVideo: function() {
                /**
			 * @name hasVideo
			 * @description 经验是否有视频判断
			 *
			 */
                var hasVideo = false, 
                expsections = this.dataProxy.expContent();
                T.array.each(expsections, function(section, i) {
                    T.array.each(section.items, function(step, j) {
                        T.array.each(step.media, function(media, index) {
                            if (media.type === 'video') {
                                hasVideo = true;
                                return;
                            }
                        });
                    });
                });
                return hasVideo;
            },
            expContent: function() {
                /*
			 * @name expContent
			 * @description 获取json 格式的经验内容
			 *
			 */
                return window.Geditorframe.getJSONContent();
            },
            expString: function() {
                /**
			 * @name expString
			 * @descrption 获取经验文本类容
			 *
			 */
                return window.Geditorframe.getTxtContent();
            },
            expTxt: function() {
                /*
			 * @name expTxt 
			 * @description 获取纯文本类型的经验
			 *
			 */
                return T.string.stripTags(this.dataProxy.expString());
            },
            expType: function() {
                return this.data.type;
            },
            noEmptyTitleSection: function() {

                /**
			 * @name noEmptyTitleSection 
			 * @description 经验标题内容判空
			 */
                var expsections = window.Geditorframe.getExpSections();
                return expsections;
            },
            foodJson: function() {
                var expsections = this.dataProxy.expContent(), 
                foodJson = null;
                for (var i = 0; i < expsections.length; i++) {
                    if (expsections[i].type == "tools" && expsections[i].model && expsections[i].model == "1") 
                    {
                        foodJson = expsections[i].options[0];
                    }
                }
                ;
                return foodJson;
            }
        },
        getData: function(key, options) {
            /**
		 * @name getData
		 * @description 根据key 拿去数据中心的内容
		 * @param {String} 拿去数据的名称 
		 */
            if (!key) {
                return false;
            }
            
            var proxy = this.dataProxy[key], 
            value, 
            self = this, 
            length;
            //找不到代理，则直接拿去数据中心内容
            if (!proxy) {
                value = self.data[key];
            }
            //代理为string 类型，则获取对应节点的value
            if (typeof proxy === 'string') {
                var dom = T.g(proxy);
                var nodeName = dom.nodeName.toLowerCase();
                var placeholder = T.dom.getAttr(dom, 'placeholder');
                switch (nodeName) {
                    case 'input':
                        value = dom.value;
                        if (T.dom.getAttr(dom, 'type') == 'text') {
                            value = T.string.trim(dom.value);
                        } else if (T.dom.getAttr(dom, 'type') == 'checkbox') {
                            value = dom.checked ? 1 : 0;
                        }
                        break;
                    case 'textarea':
                        value = T.string.trim(dom.value);
                        break;
                    default:
                        value = T.string.trim(dom.innerHTML);
                }
                //检查是否有placeholder属性
                if (placeholder && (value == placeholder)) {
                    value = '';
                }
                self.setData(key, value);
            }

            //代理类型为function 则执行function 获取内容
            if (typeof proxy === 'function') {
                value = proxy.apply(self, arguments);
                self.setData(key, value);
            }
            return value;
        },
        setData: function(key, value) {
            /**
		 * @name setData
		 * @description 更新数据中心对应的数据项
		 * @param {String} key 数据项名称
		 * @param {mix}    value 数据项内容
		 */
            if (!key || !value) {
                return;
            }
            this.data[key] = value;
        },
        getInitData: function() {
            /**
		 * @name getInitData
		 * @description 获取初始状态下数据
		 *
		 */
            var data = T.object.clone(this.dataCopy);
            data.content = T.json.stringify(data.expContent);
            return data;
        },
        init: function() {
            this.data = {
                cid: F.context('cid'), /* 非新经验才会有cid */
                did: F.context('did'), /* 草稿才会有did */
                CatPath: F.context('CatPath'), /* 非新经验才会有分类路径 */
                title: F.context('title'),
                titleHtml: F.context('titleHtml'),
                eid: F.context('eid'), /* 新版本才会有eidEnc */
                type: F.context('type'),
                originTitle: F.context('originTitle'),
                originAuthor: F.context('originAuthor'),
                isOriginal: F.context('isOriginal'),
                contentChanged: false,
                tid: F.context('tid'),
                expContent: T.object.clone(F.context('expContent')),
                hasVideo: false,
                titleMin: F.context('titleMin'),
                titleMax: F.context('titleMax'),
                CONTENT_TOO_SHORT_EMBED: F.context('CONTENT_TOO_SHORT_EMBED'),
                CONTENT_TOO_SHORT: F.context('CONTENT_TOO_SHORT'),
                CONTENT_TOO_LONG: F.context('CONTENT_TOO_LONG'),
                REFERENCE_TOO_LONG: F.context('REFERENCE_TOO_LONG') /* 非新经验才会有did */
            };
            this.dataCopy = T.object.clone(this.data);
        }
    };
    exports = dataCenter;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/auto-textarea/auto-textarea.js', function(require, exports) {
    /*-----[ /static/edit/ui/auto-textarea/auto-textarea.js ]-----*/
    /**
 * @fileOverView auto-textarea.js
 * @author liuyong07@baidu.com
 */
    var T = require('/static/common/lib/tangram/base/base.js');
    var AutoTextarea = T.lang.createClass(function(options) {
        /**
	 * @class AutoTextarea
	 * @description 自动长高输入框
	 * @param {Object} options 
	 * @options {Int} minHeight 最小高度
	 * @options {Int} scrollHeight
	 * @target {HTMLDOMelement} textArear dom
  	 */
        this.options = T.object.extend({
            minHeight: parseInt(T.dom.getStyle(options.target, 'height')),
            scrollHeight: 0,
            isInit: false,
            target: ''
        }, options);
        this.textarea = T.g(this.options.target);
        this.scrollHeight = this.options.scrollHeight;
        this.inInit = this.options.isInit;
        this._init();
    }).extend({
        _init: function() {
            this.isInit = this._create();
            this.attachEvents();
        },
        _create: function() {
            /**
		 * @name _create
		 * @description 创建dom结构
		 *
		 */
            if (!this.textarea) {
                return false;
            }
            var holder = T.dom.create('div', {
                'class': 'auto-textarea-holder'
            });
            var tempAreaHolder = T.dom.create('div', {
                'className': 'auto-textarea-tmp-holder'
            });
            var tempArea = T.dom.create('div', {
                'class': 'auto-textarea-tmp'
            });
            T.dom.addClass(this.textarea, 'auto-text-area');
            tempAreaHolder.appendChild(tempArea);
            holder.appendChild(tempAreaHolder);
            if (T.dom.prev(this.textarea)) {
                holder.appendChild(this.textarea);
                T.dom.insertAfter(holder, T.dom.prev(this.textarea));
            } else {
                var parentDOM = T.dom.getParent(this.textarea);
                holder.appendChild(this.textarea);
                parentDOM.appendChild(holder);
            }
            this.tempArea = tempArea;
            return true;
        },
        setScroll: function() {
            /**
		 * @name setScroll
		 * @description 设置滚动
		 *
		 */
            var target = this.textarea, 
            opt = this.options;
            if (T.ie) {
                target.style.height = (target.scrollHeight > opt.minHeight ? target.scrollHeight : opt.minHeight) + "px";
            } else {
                var tempH = 0;
                var temp_autoTextArea = this.tempArea;
                if (!temp_autoTextArea) {
                    return false;
                }
                var _html = target.value;
                _html = _html.replace(/\n/g, "<br>");
                temp_autoTextArea.innerHTML = _html;
                tempH = temp_autoTextArea.offsetHeight;
                if (tempH < opt.minHeight) {
                    tempH = opt.minHeight;
                }
                target.style.height = tempH + "px";
            }
        },
        auto: function(minHeight) {
            if (this.isInit == false) {
                this._init();
            }

            // keydown和keyup会触发auto方法
            if (this.scrollHeight > this.options.minHeight) {
                this.setScroll();
            }
            this.scrollHeight = this.textarea.scrollHeight;
        },
        paste: function(minHeight) {
            var self = this;
            if (this.isInit == false) {
                this._init();
            }

            // 粘贴时会触发paste方法
            setTimeout(function() {
                self.setScroll();
            }, 250);
        },
        attachEvents: function() {
            /**
		 * @description 绑定事件
		 *
		 */
            if (!this.textarea) {
                return;
            }
            var self = this;
            T.event.on(this.textarea, 'keyup', function(event) {
                self.auto();
            });
            T.event.on(this.textarea, 'paste', function(event) {
                self.paste();
            });
        }
    
    });
    exports = AutoTextarea;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/tools/tools.js', function(require, exports) {
    /*-----[ /static/edit/ui/tools/tools.js ]-----*/
    
    var T = require("/static/common/lib/tangram/base/base.js");
    exports = {
        stripTags: function(source) {
            /**
		 * @name stripTags
		 * @description 去除字符串中的html标签
		 * @param {String} source 需要处理的字符串
		 * @returns {String} 转换后的字符串 
		 */
            return String(source || '').replace(/<[^>]+>/g, '');
        },
        cutString: function(string, maxlen) {

            /**
		 * @name cutString
		 * @desc 按照最长长度对字符串进行截断
		 * @param {String} 原字符串
		 * @param {Int} 允许的最长字节数 
		 * @returns {String} 截断后的字符串
		 */
            
            if (!maxlen) {
                return string;
            }
            var str = string;
            var relstring = [];
            var rellength = 0;
            for (var i = 0, len = str.length; i < len; i++) {
                rellength += T.string.getByteLength(str.charAt(i));
                if (rellength > maxlen) {
                    break;
                }
                relstring.push(str.charAt(i));
            }
            return relstring.join("");
        },
        inputPlaceholder: function(input, placeholder) {
            /**
		 * @name inputPlaceholder
		 * @description 为输入框添加默认提示
		 *
		 *
		 */
            //设置默认提示
            var placeholder = placeholder || '';
            var input = T.g(input);
            if (!input) {
                return;
            }
            placeholder = T.dom.getAttr(input, 'placeholder') || placeholder;
            var initValue = T.string.trim(input.value);
            if (!initValue) {
                input.value = placeholder;
                T.dom.addClass(input, 'ui-input-placeholder');
            }
            //焦点聚集检查是否去掉input 里的值
            T.event.on(input, 'focus', function(event) {
                var value = T.string.trim(this.value);
                T.dom.removeClass(input, 'ui-input-placeholder');
                if (value == placeholder) {
                    this.value = '';
                }
            });
            //失去焦点检查，是否需要重设placeholder
            T.event.on(input, 'blur', function(event) {
                var value = T.string.trim(this.value);
                if (value == '') {
                    this.value = placeholder;
                    T.dom.addClass(this, 'ui-input-placeholder');
                }
            });
        }
    
    };
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/dataConfSingleton/dataConfSingleton.js', function(require, exports) {
    /*-----[ /static/edit/ui/dataConfSingleton/dataConfSingleton.js ]-----*/
    /**
 * @author liuyong07
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var blankContent = T.browser.ie ? '<p>&nbsp</p>' : '<p><br/></p>';
    var dataConfSingleton = {
        expContentModel: [ //经验编辑器json模板
            {
                type: 'brief',
                paratitle: '简介',
                attr: { //区块属性
                    fixedPos: true, //是否固定位置
                    canDelete: false, //可否删除
                    orderType: 'notorder' //区块是什么列表类型的区块，true 表示有序列表，false 为无序列表
                },
                items: [
                    {
                        attr: { //list 属性
                            isInOrder: true // 该项是否属于列表中的内容
                        },
                        text: '<p class="edit-item-tip">点击这里输入简介</p>', // 列表文本内容
                        media: [ //列表媒体内容 包含图片和视频
                        ]
                    }
                ]
            }, {
                type: 'tools',
                paratitle: '工具/原料',
                attr: { //区块属性
                    fixedPos: true, //是否固定位置
                    canDelete: false, //可否删除
                    orderType: 'unorderlist' //区块是什么列表类型的区块，true 表示有序列表，false 为无序列表
                },
                items: [
                    {
                        attr: { //list 属性
                            isInOrder: true // 该项是否属于列表中的内容
                        },
                        text: '<p class="edit-item-tip">点击这里输入工具或原料</p>', // 列表文本内容
                        media: [ //列表媒体内容 包含图片和视频
                        ]
                    }
                ],
                model: '0',
                options: [
                    {main: [],other: []}
                ]
            }, {
                type: 'step',
                paratitle: '方法/步骤',
                attr: { //区块属性
                    fixedPos: false, //是否固定位置
                    canDelete: false, //可否删除
                    orderType: 'orderlist' //区块是什么列表类型的区块，true 表示有序列表，false 为无序列表
                },
                items: [
                    {
                        attr: { //list 属性
                            isInOrder: true // 该项是否属于列表中的内容
                        },
                        text: '<p class="edit-item-tip">点击这里输入方法或步骤</p>', // 列表文本内容
                        media: [ //列表媒体内容 包含图片和视频
                        ]
                    }
                ]
            }, {
                type: 'notice',
                paratitle: '注意事项',
                attr: { //区块属性
                    fixedPos: true, //是否固定位置
                    canDelete: false, //可否删除
                    orderType: 'unorderlist' //区块是什么列表类型的区块，true 表示有序列表，false 为无序列表
                },
                items: [
                    {
                        attr: { //list 属性
                            isInOrder: true // 该项是否属于列表中的内容
                        },
                        text: '<p class="edit-item-tip">点击这里输入注意事项</p>', // 列表文本内容
                        media: [ //列表媒体内容 包含图片和视频
                        ]
                    }
                ]
            }, 
            {
                type: 'common',
                paratitle: '',
                attr: { //区块属性
                    fixedPos: false, //是否固定位置
                    canDelete: true, //可否删除
                    orderType: 'orderlist' //区块是什么列表类型的区块，true 表示有序列表，false 为无序列表
                },
                items: [{
                        attr: { //list 属性
                            isInOrder: true // 该项是否属于列表中的内容
                        },
                        text: '<p class="edit-item-tip">点击这里输入方法或步骤</p>', // 列表文本内容
                        media: [ //列表媒体内容 包含图片和视频
                        ]
                    }
                ]
            }
        ],
        getJsonTemplate: function(param) {
            /**
    	 * @ name getJsonTemplate
    	 * @ description 获取用于渲染编辑器页面经验的json 数据结构模板
    	 * @ param {String} type 获取模板的类型 
    	 * @ return {Object|Array} 返回json模板数据，默认返回包含 brief,tools,step,notice 的数组 
    	 */
            var sections = [], 
            self = this;
            if (!T.lang.isArray(param)) {
                return sections;
            }
            T.array.each(param, function(item, index) {
                sections.push(self.getSectionJsonTemplate(item));
            });
            return sections;
        },
        getSectionJsonTemplate: function(param) {
            var item, 
            num, 
            type, 
            section, 
            items = [], 
            modelBridge = {
                'brief': 0,
                'tools': 1,
                'step': 2,
                'notice': 3,
                'common': 4
            };
            if (T.lang.isString(param)) {
                type = param;
                num = 1;
                if (arguments[1] && T.lang.isNumber(arguments[1])) {
                    num = arguments[1];
                }
            }
            if (T.lang.isObject(param)) {
                for (var key in param) {
                    if (!param.hasOwnProperty(key)) {
                        continue;
                    }
                    if (type) {
                        break;
                    }
                    type = key;
                    num = param[key];
                }
            }
            
            if (modelBridge[type] === undefined || modelBridge[type] === null) {
                return null;
            }
            section = T.object.clone(this.expContentModel[modelBridge[type]]);
            item = section.items[0];
            for (var i = 0; i < num; i++) {
                items.push(T.object.clone(item));
            }
            section.items = items;
            return section;
        },
        getContentRenderJson: function(json) {
            /**
    	 * @name getContentRenderJson
    	 * @description 处理经验内容json，为内容添加json模板，使没有简介，工具原料，注意事项的经验也能再编辑器区域对缺少的栏目进行渲染。
    	 * @param {Object} json json格式的经验内容
    	 */

            //TODO 这段代码有点挫，求支招，求解救i
            var that = this;
            var expContent = json;
            //gms add 2012.11.21 增加判断是食材 只生成一个tools切片
            var isFood = F.context('isFood') ? 1 : 3;
            var expJsonTemplate = this.getJsonTemplate([{'brief': 1}, {'tools': isFood}, {'step': 5}, {'notice': 3}]);
            if (!expContent) {
                expContent = expJsonTemplate;
            } else {
                var hasBrief, hasNotice, hasTools;
                T.array.each(expContent, function(item, index) {
                    that.sectionContentCompat(item);
                    if (!hasBrief) {
                        hasBrief = (item.type == 'brief' ? true : false);
                    }
                    if (!hasNotice) {
                        hasNotice = (item.type == 'notice' ? true : false);
                    }
                    if (!hasTools) {
                        hasTools = (item.type == 'tools' ? true : false);
                    }
                });
                if (!hasBrief) {
                    var briefSection = this.getSectionJsonTemplate({'brief': 1});
                    expContent.splice(0, 0, briefSection);
                }
                if (!hasNotice) {
                    var noticeSection = this.getSectionJsonTemplate({'notice': 3});
                    var index = expContent.length + 1;
                    expContent.splice(index, 0, noticeSection);
                }
                if (!hasTools) {
                    var toolsSection = this.getSectionJsonTemplate({'tools': isFood});
                    expContent.splice(1, 0, toolsSection);
                }
            
            }
            return expContent;
        },
        sectionContentCompat: function(json) {
            /**
         * @name sectionContentCompat
         * @description 为经验内容做兼容处理，主要是添加空白站位符号，以免引起编辑器编辑错误
         * @param {Object} json 经验区块内容
         * @returns {Object} 返回处理过的栏目内容
         *
         */
            var that = this;
            var section = json;
            var items = section.items;
            var blankContent = that.blankContent;
            var type = section.type;
            var confMap = {
                'brief': {'brief': 1},
                'tools': {'tools': 1},
                'step': {'step': 1},
                'notice': {'notice': 1},
                'common': {'common': 1}
            };
            //rd 数据不完整，需要对简介的标题做兼容处理
            if (type == 'brief' && (!section.paratitle || T.string.trim(section.paratitle) == '')) {
                section.paratitle = "简介";
            }
            if (items && T.lang.isArray(items) && (items.length > 0)) {
                for (var i = 0, len = items.length; i < len; i++) {
                    var text = T.string.trim(items[i].text);
                    var regOffsetP = /^<p>((\s*&nbsp;*\s*)|(\s*<br\s*\/?\s*>\s*)|(\s*))<\/p>$/gi; //匹配<p>&nbsp;</p>,<p><br /></p>,<p></p>,以及这三类匹配项中<p>之后，</p>之前包含0个或多个空格的情况。
                    //这里没有将正则表达式放在外面的原因详见 MDN https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/RegExp/test
                    if (text == blankContent) {
                        continue;
                    }
                    if (text === '' || regOffsetP.test(text)) {
                        items[i].text = blankContent;
                        continue;
                    }
                }
            } else {
                items = that.getSectionJsonTemplate(confMap[type]).items;
                section.items = items;
            }
            return section;
        },
        blankContent: blankContent
    };
    exports = {
        getJsonTemplate: function(param) {
            return dataConfSingleton.getJsonTemplate(param);
        },
        getSectionJsonTemplate: function(param) {
            return dataConfSingleton.getSectionJsonTemplate(param);
        },
        getContentRenderJson: function(json) {
            return dataConfSingleton.getContentRenderJson(json);
        },
        getBlankContent: function() {
            return dataConfSingleton.blankContent;
        }
    };
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/video/video.js', function(require, exports) {
    /*-----[ /static/edit/ui/video/video.js ]-----*/
    /**
 * @author liuyong07
 * @description 插入视频
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    function convert_url(s) {
        s = s.replace(/http:\/\/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, "http://www.tudou.com/v/$1");
        s = s.replace(/http:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/i, "http://www.youtube.com/v/$1");
        s = s.replace(/http:\/\/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, "http://player.youku.com/player.php/sid/$1");
        s = s.replace(/http:\/\/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "http://player.56.com/v_$1.swf");
        s = s.replace(/http:\/\/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "http://player.56.com/v_$1.swf");
        s = s.replace(/http:\/\/v\.ku6\.com\/.+\/([^.]+)\.html/i, "http://player.ku6.com/refer/$1/v.swf");
        return s;
    }
    exports.insertVideo = function(mediaManager) {
        dialog.confirm("插入视频", {
            width: 400,
            height: 180,
            info: ['<div class="video-dialog-content">', 
                '<p class="video-dialog-content-title">插入视频</p>', 
                '<p><input type="text" maxlength="500" id="video-input" value="" class="video-url-input" name="url"></p>', 
                '<p class="video-insert-content">', 
                '<span class="video-insert-tips">请输入视频的网络源地址，目前支持酷6、优酷、土豆、56、六间房、奇艺等多家视频网站。</span>', 
                '<span style="display: none; " class="warning" id="warning"></span>', 
                '<a target="_blank" class="video-insert-help" href="http://www.baidu.com/search/jingyan_help.html#怎样插入视频">相关帮助</a>', 
                '</p>', 
                '</div>'
            ].join(""),
            onopen: function() {
                var videoInput = T.dom.g('video-input');
                videoInput.focus();
            },
            onconfirm: function() {
                var url = T.g('video-input').value;
                url = convert_url(url);
                if (mediaManager && T.lang.isFunction(mediaManager.add)) {
                    var index = mediaManager.medias.length + 1;
                    mediaManager.add({type: 'video',src: url}, index, 'new');
                }
            
            },
            onupdate: function() {
            }
        });
    
    };
    
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/ui/dialog/dialog.js']);
F.module('/static/edit/ui/tips/tips.js', function(require, exports) {
    /*-----[ /static/edit/ui/tips/tips.js ]-----*/
    /**
 * @fileOverview tips.js
 * @description 经验动态类引导 和标签提示
 *
 */
    var T = require('/static/common/lib/tangram/base/base.js');
    var Dialog = require("/static/common/lib/tangram/ui/Dialog/Dialog.js");
    var cookie = require("/static/common/ui/cookie/cookie.js");
    var Tip = T.ui.createUI(
    T.ui.Dialog, {superClass: T.ui.Dialog}).extend(
    {
        uiType: "tooltip",
        resizable: false,
        draggable: false,
        autoDispose: false,
        modal: false,
        height: '30px',
        closeOnEscape: false,
        classPrefix: "exp-tooltip",
        zIndex: '100',
        _createArrow: function() {
            /**
			 * @name _createArrow
			 * @description 创建tips 箭头
			 *
			 */
            var self = this;
            var meDom = self.getMain();
            if (!meDom) {
                return;
            }
            if (self.tipName) {
                var className = self.classPrefix + '-' + self.tipName;
                T.dom.addClass(meDom, className);
            }
            var container = T.dom.q('exp-tooltip', meDom, 'div')[0];
            var arrowtips = '<div class="exp-tooltip-arrow"><em>\u25c6</em><span>\u25c6</span></div>';
            T.dom.insertHTML(container, 'afterBegin', arrowtips);
        },
        _createCloseBtn: function() {
            /**
			 * @name _createCloseBtn
			 * @description 创建关闭按钮
			 *
			 */
            var self = this;
            var meDom = self.getMain();
            if (!meDom) {
                return;
            }
            var container = T.dom.q('exp-tooltip', meDom, 'div')[0];
            var closeBtn = T.dom.create('div', {
                'class': 'exp-tooltip-close-btn'
            });
            container.appendChild(closeBtn);
            T.event.on(closeBtn, 'click', function() {
                self.destroyTip();
            });
            T.event.on(closeBtn, 'mouseover', function() {
                T.dom.addClass(this, 'exp-tooltip-close-btn-hover');
            });
            T.event.on(closeBtn, 'mouseout', function() {
                T.dom.removeClass(this, 'exp-tooltip-close-btn-hover');
            });
            T.dom.setStyle(container, 'height', '30px');
        },
        onload: function() {
            this._createArrow();
            this._createCloseBtn();
        },
        onopen: function() {
            var meDom = this.getMain();
            if (!meDom) {
                return;
            }
            var container = T.dom.q('exp-tooltip', meDom, 'div')[0];
            T.dom.setStyle(container, 'height', '30px');
        }
    }
    );
    var tipsManager = {
        tips: {},
        cookieMap: {
            'listChange': 'EXP_EDITORLISTCHANGE',
            'removeSection': 'EXP_EDITORREMOVESECTION',
            'dragImage': 'EXP_EDITORDRAGIMAGE',
            'dragSection': 'EXP_EDITORDRAGSECTION'
        },
        firstTipZone: {
            'listChange': null,
            'removeSection': null,
            'dragImage': null,
            'dragSection': null
        },
        tipOptions: {
            'listChange': {
                'width': "170px",
                'contentText': "点击这里改变列表类型",
                'tipName': 'list-change',
                'hasShow': false,
                'destroyTip': function() {
                    tipsManager.remove('listChange');
                    cookie.set('EXP_EDITORLISTCHANGE', '1', false, '/edit');
                }
            },
            'removeSection': {
                'width': "155px",
                'contentText': "点击这里删除该栏目",
                'tipName': 'remove-section',
                'hasShow': false,
                'destroyTip': function() {
                    cookie.set('EXP_EDITORREMOVESECTION', '1', false, '/edit');
                    tipsManager.remove('removeSection');
                }
            },
            'dragImage': {
                'width': "145px",
                'contentText': "拖拽图片进行排序",
                'tipName': 'drag-image',
                'hasShow': false,
                'destroyTip': function() {
                    cookie.set('EXP_EDITORDRAGIMAGE', '1', false, '/edit');
                    tipsManager.remove('dragImage');
                },
                'onopen': function() {
                    var meDom = this.getMain();
                    if (!meDom) {
                        return;
                    }
                    var container = T.dom.q('exp-tooltip', meDom, 'div')[0];
                    T.dom.setStyle(container, 'height', '30px');
                    if (this.target) {
                        this.target.appendChild(meDom);
                        setTimeout(function() {
                            T.dom.setStyles(meDom, {
                                'left': 'auto',
                                'top': 'auto'
                            });
                        }, 100);
                    }
                }
            },
            'dragSection': {
                'width': "145px",
                'contentText': "点击这里,可以拖拽栏目进行排序",
                'tipName': 'drag-section',
                'hasShow': false,
                'destroyTip': function() {
                    cookie.set('EXP_EDITORDRAGSECTION', '1', false, '/edit');
                    tipsManager.remove('dragSection');
                }
            }
        },
        createTip: function(name, target) {
            /**
		 * @name createTip 
		 * @description 创建tip
		 *
		 */
            var tipOption = this.tipOptions[name];
            var obj = this.getPosition(name, target);
            if (!tipOption) {
                return;
            }
            tipOption = T.object.extend(tipOption, obj);
            var tip = new Tip(tipOption);
            tip.render();
            tip.open();
            this.tips[name] = tip;
        },
        getPosition: function(name, target) {
            /**
		 * @name getPosition
		 * @description 获取tip的展示位置
		 *
		 */
            if (!target || !T.g(target)) {
                return {
                    'left': 0,
                    'top': 0
                };
            }
            var obj = T.dom.getPosition(target);
            switch (name) {
                case 'listChange':
                    obj.top = obj.top - 43;
                    obj.left = obj.left - 53;
                    break;
                case 'removeSection':
                    obj.top = obj.top - 45;
                    obj.left = obj.left - 99;
                    break;
                case 'dragImage':
                    obj.top = 0;
                    obj.left = 0;
                    obj.target = target;
                    break;
            }
            return obj;
        },
        show: function(name, target) {
            /**
		 * @name show
		 * @description 显示tip
		 *
		 */
            var tips = this.tips, 
            cookieName = this.cookieMap[name];
            //判断tip是否为cookie记录类型的tip
            if (cookieName) {
                if (this.tipOptions[name].hasShow) {
                    return;
                }
                var cookieValue = cookie.get(cookieName);
                if (!cookieValue) {
                    if (!tips[name]) {
                        this.createTip(name, target);
                    } else {
                        tips[name].update(this.getPosition(name, target));
                        tips[name].open();
                    }
                }
            } else if (tips[name]) {
            //tips[name].update(option);
            }
        },
        close: function(name) {
            var self = this;
            if (self.tips[name]) {
                self.tips[name].close();
            }
        },
        remove: function(name) {
            var self = this;
            if (!name || !self.tips[name]) {
                return;
            }
            self.tips[name].close();
            self.tips[name].dispose();
            delete self.tips[name];
        },
        handle: function(section) {
            var self = this;
            if (!section) {
                return;
            }
            setTimeout(function() {
                self.handleRemoveSectionTip(section);
                //self.handleDragSectionTip(section);
                self.handleListChangeTip(section);
                self.close('dragImage');
            }, 300);
        
        },
        handleRemoveSectionTip: function(section) {
            var self = this;
            if (section.createType == 'new') {
                var target = section.closeBtn;
                var removeSection = self.firstTipZone.removeSection;
                if (!removeSection) {
                    self.firstTipZone.removeSection = section;
                    section.showRemoveTip = true;
                    self.show('removeSection', target);
                } else {
                    //removeSection 和 sectionInstance 是同一个栏目则展示
                    if (section.showRemoveTip) {
                        self.show('removeSection', target);
                    } else {
                        self.close('removeSection');
                    }
                }
            } else {
                self.close('removeSection');
            }
        },
        handleDragSectionTip: function(section) {
            //TODO 栏目添加完拖拽后完成
            var self = this;
            if (section.createType == 'new') {
                var dragSection = self.firstTipZone.dragSection;
                if (!dragSection) {
                    self.firstTipZone.dragSection = section;
                    section.showDragSectionTip = true;
                    self.show('dragSection');
                } else {
                    if (section.showDragSectionTip) {
                        self.show('dragSection');
                    } else {
                        self.close('dragSection');
                    }
                
                }
            } else {
                self.close('dragSection');
            }
        },
        handleListChangeTip: function(section) {
            var self = this;
            if (section.buttonManager) {
                var listChange = self.firstTipZone.listChange;
                var target = section.buttonManager.holder;
                if (!listChange) {
                    self.firstTipZone.listChange = section;
                    section.showListChangeTip = true;
                    self.show('listChange', target);
                } else {
                    if (section.showListChangeTip) {
                        self.show('listChange', target);
                    } else {
                        self.close('listChange');
                    }
                }
            } else {
                self.close('listChange');
            }
        },
        handleDragImageTip: function(mediaManager) {
            var self = this;
            if (!mediaManager) {
                return;
            }
            if (mediaManager.medias.length > 1) {
                var dragImage = self.firstTipZone.dragImage;
                var target = mediaManager.container;
                target = T.dom.getParent(target);
                if (!dragImage) {
                    self.firstTipZone.dragImage = mediaManager;
                    mediaManager.showDragImageTip = true;
                    self.show('dragImage', target);
                } else {
                    if (mediaManager.showDragImageTip) {
                        self.show('dragImage', target);
                    } else {
                        self.close('dragImage');
                    }
                }
            } else {
                self.close('dragImage');
            }
        }
    };
    exports = tipsManager;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/lib/tangram/ui/Dialog/Dialog.js', '/static/common/ui/cookie/cookie.js']);
F.module('/static/edit/ui/error/error.js', function(require, exports) {
    /*-----[ /static/edit/ui/error/error.js ]-----*/
    /*
 * 内容页-错误处理
 * xiazhaoxia
 * 2011/12/25
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var dataCenter = require("/static/edit/ui/dataCenter/dataCenter.js");
    var Gtool = require("/static/common/ui/util/tool/tool.js");
    var ajax = require("/static/common/ui/ajax/ajax.js");
    var ec = require('/static/common/lib/fis/event/event.js').eventCenter;
    window.Gtool = Gtool;
    var submit = F.context("expSubmit");
    exports = {
        errorMessages: {
            CONTENT_TOO_SHORT: '经验过短无法发布，请详细描述',
            CONTENT_TOO_SHORT_EMBED: '视频经验过短，请简要描述（30字以上）',
            CONTENT_TOO_LONG: '超过15000字的经验无法发布，请删改',
            REFERENCE_TOO_LONG: '参考资料超过500字，请删改',
            CHANGE_NOTHING: '您并未做任何改动，不需提交',
            CONTENT_CATE_NULL: '请选择经验分类',
            TITLE_TOO_SHORT: '标题过于简略，请具体描述经验将达到的目的',
            TITLE_TOO_LONG: '标题字数过长，请酌情删减',
            CONTENT_TOO_LONG_SAVE: '超过15000字的经验无法保存，请删改',
            HIT_REJECT_WORD: '对不起，经验内容中含有不当词语，请修改',
            CONTENT_NULL: '空白经验无法保存',
            FOOD_MAIN_NULL: '请填写食材主料',
            FOOD_MAIN_LACK: '请完整填写食材主料名称或份量',
            FOOD_OTHER_LACK: '请完整填写食材辅料名称或份量',
            FOOD_SELECT_SONTYPE: '请选择二级分类'
        },
        //采用弹出pop层的方式进行操作错误提示
        showErrorPop: function(errorMessage, titleMessage) {
            dialog.alert(titleMessage || "提示", {info: '<p>' + errorMessage + '</p>',width: 300,height: 80,onopen: window.Geditorframe.onDialogOpen,onClosed: window.Geditorframe.onDialogClose});
        },
        //在dom中提示错误信息给用户
        showErrorDom: function(errorMessage) {
            var numError = T.g("ti-numError");
            var numRight = T.g("ti-numRight");
            numError.innerHTML = errorMessage;
            numError.style.display = "inline-block";
            numRight.style.display = "none";
        },
        //标题错误处理
        titleExistErr: function() {
            var len = T.string.getByteLength(dataCenter.getData("title")), 
            num = Math.floor((dataCenter.getData("titleMax") - len) / 2);
            var info = '<div id="title-exist-pop">很抱歉，刚刚有人成功提交了同标题的经验，您可以修改细化经验标题后再次发布' + 
            '<input type="text" id="ti" class="ti" onfocus="Gtool.inputCheck.resetError(' + dataCenter.getData('titleMax') + ')"' + 
            ' onkeyup="Gtool.inputCheck.inputLength(\'ti\', ' + dataCenter.getData('titleMax') + ')" value="' + 
            dataCenter.getData('titleHtml') + '"/>' + 
            '<div class="right-error-prompt">' + 
            '<span id="ti-numRight" class="num-right f14 f-999">' + 
            '还可以输入<em id="ti-numLen">' + num + '</em>字</span>' + 
            '<span id="ti-numError" class="num-error hide">输入内容已经达到长度限制</span>' + 
            '</div>' + 
            '<span id="exist-prompt" class="hide">标题已被占用</span>' + 
            '<div class="clear"></div>' + 
            '<div class="center">' + 
            '<input type="button" id="title-submit" value="提交修改后的标题" class="g-btn-submit">' + 
            '</div>' + 
            '</div>';
            dialog.show("提示", {info: info,width: 430,height: 160});
            T.event.on("title-submit", "click", function(e) {
                var title = T.string.trim(T.g("ti").value), 
                len = T.string.getByteLength(title);
                
                if (len > dataCenter.getData('titleMax')) {
                    exports.showErrorDom(exports.errorMessages.TITLE_TOO_LONG);
                    return;
                } 
                else if (len < dataCenter.getData('titleMin')) {
                    exports.showErrorDom(exports.errorMessages.TITLE_TOO_SHORT);
                    return;
                }
                ec.fire('login.check', {
                    'isLogin': function() {
                        ajax.post('/common/isTitleValid', 
                        {title: title}, function() {
                            dataCenter.setData('title');
                            submit.send();
                        }, {TITLE_EXIST_ERR: function() {
                                T.g("exist-prompt").style.display = "inline-block";
                            },
                            HIT_REJECT_WORD_ERR: function() {
                                exports.showErrorDom(exports.errorMessages.HIT_REJECT_WORD);
                            },
                            TITLE_TOO_SHORT_ERR: function() {
                                exports.showErrorDom(exports.errorMessages.TITLE_TOO_SHORT);
                            },
                            TITLE_TOO_LONG_ERR: function() {
                                exports.showErrorDom(exports.errorMessages.TITLE_TOO_LONG);
                            }
                        });
                    }
                });
            });
        }
    
    };
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/ui/dialog/dialog.js', '/static/edit/ui/dataCenter/dataCenter.js', '/static/common/ui/util/tool/tool.js', '/static/common/ui/ajax/ajax.js', '/static/common/lib/fis/event/event.js']);
F.module('/static/edit/ui/validate/validate.js', function(require, exports) {
    /*-----[ /static/edit/ui/validate/validate.js ]-----*/
    /**
 * @fileOverView validate.js
 * @description 编辑器数据验证
 *
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dataCenter = require("/static/edit/ui/dataCenter/dataCenter.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var error = require("/static/edit/ui/error/error.js");
    /**
 * @name validateCenter 
 * @description 验证中心单体
 *
 */
    var validateCenter = {
        conf: {
            /**
		 * @name conf
		 * @description 验证中心配置
		 *
		 */
            titleMin: F.context('titleMin'),
            titleMax: F.context('titleMax'),
            CONTENT_TOO_SHORT_EMBED: F.context('CONTENT_TOO_SHORT_EMBED'),
            CONTENT_TOO_SHORT: F.context('CONTENT_TOO_SHORT'),
            CONTENT_TOO_LONG: F.context('CONTENT_TOO_LONG'),
            REFERENCE_TOO_LONG: F.context('REFERENCE_TOO_LONG') /* 非新经验才会有did */
        },
        validate: function(obj) {
            /**
		 * @name validate
		 * @description 验证数据
		 * @param {Object} 需要验证的数据集合
		 *
		 */
            var result = true, 
            self = this, 
            type = arguments[1], 
            validateItems;
            T.object.each(obj, function(value, key) {
                if (result == false) {
                    return false;
                }
                result = self.validateItem(key, value, type);
            });
            return result;
        },
        validateItem: function(key, value, type) {
            /**
		 * @name validateItem 
		 * @description 验证单条数据项
		 * @param {String} key 验证数据字段名称
		 * @param {mixed} value 需要验证数据的值 
		 * @param {String} type 验证的类型 'draft' or 'submit' 目前支持这两种类型 该字段非必须
		 *
		 */
            var self = this;
            return self.bridge[key].call(self, value, type);
        },
        bridge: {
            /* 
		 * @name bridge
		 * @description 具体验证函数的桥接
		 *
		 */
            title: function(value) {
                /**
			 * @name title
			 * @description 标题验证
			 *
			 */
                return true;
            },
            reference: function(value) {
                /**
			 * @name reference
			 * @description 参考资料的验证
			 * @param {String} value 参考资料的内容
			 */
                var self = this;
                value = value || '';
                if (T.string.getByteLength(value.replace(/\s/ig, '')) > parseInt(self.conf.REFERENCE_TOO_LONG, 10)) {
                    error.showErrorPop(error.errorMessages['REFERENCE_TOO_LONG']);
                    return false;
                }
                return true;
            },
            expTxt: function(value) {
                /**
			 * @name expString
			 * @description 经验文本的验证主要用于验证字数
			 * @param {String} value 经验文本内容的值
			 */
                var self = this, 
                type = arguments[1], 
                length = T.string.getByteLength(value.replace(/\s/ig, ''));
                hasVideo = dataCenter.getData('hasVideo');
                CONTENT_TOO_SHORT = hasVideo ? self.conf.CONTENT_TOO_SHORT_EMBED : self.conf.CONTENT_TOO_SHORT;
                if (length == 0) {
                    error.showErrorPop(error.errorMessages['CONTENT_NULL']);
                    return false;
                
                }
                if (type != 'draft') {
                    if (length < parseInt(CONTENT_TOO_SHORT, 10)) {
                        error.showErrorPop(hasVideo ? error.errorMessages['CONTENT_TOO_SHORT_EMBED'] : error.errorMessages['CONTENT_TOO_SHORT']);
                        return false;
                    }
                }
                if (length > parseInt(self.conf.CONTENT_TOO_LONG, 10)) {
                    error.showErrorPop(error.errorMessages['CONTENT_TOO_LONG']);
                    return false;
                }
                return true;
            },
            hasVideo: function(value) {
                /**
			 * @name hasVideo
			 * description 是否有视频的验证
			 *
			 */
                return true == value;
            },
            noEmptyTitleSection: function(value) {
                /**
			 * @name noEmptyTitleSection 
			 * @description 空标题验证
			 * @param {String} value 
			 *
			 */
                var expsections = value, 
                noEmptyTitle = true;
                for (var i = 0, len = expsections.length; i < len; i++) {
                    var expSectionTitle = expsections[i].title.getTxtContent(); //TODO this function may changed
                    expSectionTitle = T.string.trim(expSectionTitle);
                    if (expsections[i].sectionType == 'brief') {
                        continue;
                    }
                    if (expSectionTitle == '') {
                        noEmptyTitle = false;
                        dialog.alert("提示", {
                            width: 300,
                            height: 90,
                            info: "<p>您还没有填写栏目标题，请填写标题！</p>",
                            onclose: function() {
                                T.event.fire(expsections[i].title.fieldElement, 'focus');
                                expsections[i].title.fieldElement.focus();
                            }
                        });
                        break;
                    }
                
                }
                return noEmptyTitle;
            },
            noEmptyBriefSection: function(value) {
                /**
			 * @name noEmptyBrief
			 * @description 检查是否有空简介
			 *
			 */
                var expsections = value, 
                briefContent;
                for (var i = 0, len = expsections.length; i < len; i++) {
                    if (expsections[i].type == 'brief') {
                        briefContent = expsections[i];
                        break;
                    }
                }
                if (briefContent && briefContent.items && briefContent.items.length > 0) {
                    return true;
                } else {
                    dialog.alert("提示", {
                        width: 300,
                        height: 90,
                        info: "<p>简介为必填内容，请填写！</p>",
                        onclose: function() {
                            window.Geditorframe.expSections[0].stepFactory.steps[0].onEdit();
                        }
                    });
                    return false;
                }
            },
            cid: function(value) {
                /**
			 * @name hasCategory
			 * @description 分类验证
			 * @param {String} hasCategory 
			 */
                if (value == '' || parseInt(value, 10) == 0) {
                    // 保存草稿不需要验证经验分类
                    error.showErrorPop(error.errorMessages['CONTENT_CATE_NULL']);
                    return false;
                } 
                else 
                {
                    //gms add 2012.11.28 判断如果是美食类需要选择2级分类
                    if (F.context("isFood")) 
                    {
                        var foodtype = T.q("category-level-2")[0].value;
                        if (foodtype == "0-2") 
                        {
                            error.showErrorPop(error.errorMessages['FOOD_SELECT_SONTYPE']);
                            return false;
                        }
                    }
                }
                return true;
            },
            checkFoodJson: function(value) 
            {
                //如果非食材类跳过验证
                if (F.context("isFood")) 
                {
                    var isOk = true, 
                    flagerr = 0, 
                    main = value ? value.main : [], 
                    other = value ? value.other : [];
                    if (main.length == 0) 
                    {
                        flagerr = 1;
                        isOk = false;
                    } 
                    else 
                    {
                        for (var i = 0; i < main.length; i++) {
                            if (T.string.trim(main[i].name) == "" || T.string.trim(main[i].content) == "") 
                            {
                                flagerr = 2;
                                isOk = false;
                                break;
                            }
                        }
                        ;
                        if (isOk) 
                        {
                            for (var i = 0; i < other.length; i++) {
                                if (T.string.trim(other[i].name) == "" || T.string.trim(other[i].content) == "") 
                                {
                                    flagerr = 3;
                                    isOk = false;
                                    break;
                                }
                            }
                            ;
                        }
                    }
                    switch (flagerr) 
                    {
                        case 1:
                            error.showErrorPop(error.errorMessages['FOOD_MAIN_NULL']);
                            break;
                        case 2:
                            error.showErrorPop(error.errorMessages['FOOD_MAIN_LACK']);
                            break;
                        case 3:
                            error.showErrorPop(error.errorMessages['FOOD_OTHER_LACK']);
                            break;
                    }
                    return isOk;
                }
                return true;
            }
        }
    };
    exports = validateCenter;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/dataCenter/dataCenter.js', '/static/common/ui/dialog/dialog.js', '/static/edit/ui/error/error.js']);
F.module('/static/edit/ui/submit/submit.js', function(require, exports) {
    /*-----[ /static/edit/ui/submit/submit.js ]-----*/
    /**
 * @fileOverView submit.js
 * @author liuyong07@baidu.com
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var ajax = require("/static/common/ui/ajax/ajax.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var login = require("/static/common/ui/login/login.js");
    var ec = require('/static/common/lib/fis/event/event.js').eventCenter;
    var dataCenter = require("/static/edit/ui/dataCenter/dataCenter.js");
    var validateCenter = require("/static/edit/ui/validate/validate.js");
    var Gtool = require("/static/common/ui/util/tool/tool.js");
    var error = require("/static/edit/ui/error/error.js");
    var Gerror = require("/static/common/ui/error/error.js");
    var submit = {
        send: function() {

            /**
		 * @name saveDraft 
		 * @param {Object} expJson 经验json 格式数据
		 * @param {String} expText 经验过滤掉标签的文本
		 * @param {Boolean} hasVideo 文章中 是否有视频  
		 */
            var self = this, 
            initVars = dataCenter.getInitData(), 
            postVars = self.getPostVars();
            //对拒绝经验检查其是否有修改
            if (self.expType == 'refuse') {
                if (!self.isContentChanged(initVars, postVars)) {
                    Gerror.errorMap['2025'].handler();
                    return false;
                }
            }
            self.post(postVars);
        },
        post: function(vars) {
            /**
		 * @name post 
		 * @description 草稿提交
		 * @param {Object} vars 提交的参数
		 */
            var self = this, 
            type = arguments[1];
            if (!vars) {
                return;
            }
            //提交前走验证中心验证
            if (!validateCenter.validate(self.validateVars, 'submit')) {
                var preview = F.context('preview');
                if (preview) {
                    preview.close();
                }
                return;
            }
            //提交前检查是否登陆	
            ec.fire('login.check', {
                'isLogin': function() {
                    window.onbeforeunload = null;
                    var form = Gtool.dynCreateForm("post", '/edit/success', {type: dataCenter.getData('expType'),tid: dataCenter.getData('tid')});
                    ajax.post('/submit/exp', 
                    vars, 
                    function() { // 跳转到成功发布页面
                        form.submit();
                    }, 
                    {HIT_REJECT_WORD_ERR: function() {
                            error.showErrorPop(error.errorMessages['HIT_REJECT_WORD']);
                        },
                        NOT_LOGIN_ERR: function() {
                            self.send();
                        },
                        TITLE_EXIST_ERR: error.titleExistErr,
                        TITLE_TOO_SHORT_ERR: function() {
                            error.showErrorPop(error.errorMessages['TITLE_TOO_SHORT']);
                        },
                        TITLE_TOO_LONG_ERR: function() {
                            error.showErrorPop(error.errorMessages['TITLE_TOO_LONG']);
                        }
                    }
                    );
                }
            });
        },
        getPostVars: function() {
            /**
		 * @name getPostVars
		 * @description 获取提交参数
		 *
		 */
            var originAuthor = dataCenter.getData('originAuthor'), 
            isOriginal = dataCenter.getData('isOriginal'), 
            expContent = dataCenter.getData('expContent'), 
            reference = dataCenter.getData('reference'), 
            title = dataCenter.getData('title'), 
            cid = dataCenter.getData('cid'), 
            did = dataCenter.getData('did'), 
            tid = dataCenter.getData('tid'), 
            eid = dataCenter.getData('eid'), 
            hasVideo = dataCenter.getData('hasVideo'), 
            expTxt = dataCenter.getData('expTxt'), 
            noEmptyTitleSection = dataCenter.getData('noEmptyTitleSection'), 
            hasCategory = dataCenter.getData('hasCategory'), 
            expType = dataCenter.getData('expType'), 
            foodJson = dataCenter.getData('foodJson');
            //gms add 2012.11.28 新经验cid是传输过来，需要检查rd传入参数是否有cid
            if (cid == '' || parseInt(cid, 10) == 0) {
                var tmpCid = F.context('CatPath');
                if (tmpCid != '') 
                {
                    var value = tmpCid.split('-');
                    dataCenter.setData('cid', value[value.length - 1]);
                    cid = value[value.length - 1];
                }
            }
            this.expType = expType;
            this.setValidateVars(expTxt, reference, noEmptyTitleSection, cid, expContent, foodJson);

            //gms add 2012.11.21 过滤多余的属性
            var isFood = F.context('isFood') ? true : false;
            if (isFood) 
            {
                var tmpJson = expContent;
                for (var i = 0; i < tmpJson.length; i++) {
                    if (tmpJson[i].type == "tools") 
                    {
                        var tmpItems = tmpJson[i].items, 
                        newItemArr = [];
                        //gms add 2012.12.10 把新数据写入老的数组，兼容无线端展示
                        if (tmpJson[i].options) 
                        {
                            var mainArr = tmpJson[i].options[0].main, 
                            otherArr = tmpJson[i].options[0].other;
                            for (var j = 0; j < mainArr.length; j++) {
                                var tmparr = {"attr": "","text": "",media: []};
                                tmparr.attr = tmpItems[0].attr;
                                tmparr.media = tmpItems[0].media;
                                tmparr.text = mainArr[j].name + " " + mainArr[j].content;
                                newItemArr.push(tmparr);
                            }
                            for (var j = 0; j < otherArr.length; j++) {
                                var tmparr = {"attr": "","text": "",media: []};
                                tmparr.attr = tmpItems[0].attr;
                                tmparr.media = tmpItems[0].media;
                                tmparr.text = otherArr[j].name + " " + otherArr[j].content;
                                newItemArr.push(tmparr);
                            }
                        } 
                        else 
                        {
                            for (var j = 0; j < tmpItems.length; j++) {
                                var tmparr = {"attr": "","text": "",media: []};
                                tmparr.attr = tmpItems[j].attr;
                                tmparr.text = tmpItems[j].text;
                                tmparr.media = tmpItems[j].media;
                                newItemArr.push(tmparr);
                            }
                        }
                        tmpJson[i].items = newItemArr;
                    }
                }
                ;
            }
            expContent = T.json.stringify(expContent);
            var postVars = {
                content: expContent,
                reference: reference,
                cid: cid,
                originAuthor: originAuthor,
                tid: tid,
                title: title,
                isOriginal: isOriginal
            };
            //更具不同的经验类型选择不同的提交参数
            switch (expType) {
                case 'new':
                    if (did != '') {
                        postVars = T.object.extend(postVars, {
                            method: 'createNewExp',
                            did: did
                        });
                    
                    } else {
                        postVars = T.object.extend(postVars, {
                            method: 'createNewExp'
                        });
                    }
                    break;
                case 'draft':
                    postVars = T.object.extend(postVars, {
                        method: 'createNewExp',
                        did: did
                    });
                    break;
                case 'refuse':
                    postVars = T.object.extend(postVars, {
                        method: 'modifyRefusedExp',
                        eid: eid
                    });
                    break;
                default:
                    postVars = T.object.extend(postVars, {
                        method: 'modifyPassedExp',
                        eid: eid
                    });
            }
            return postVars;
        },
        isContentChanged: function(signVars, vars) {
            /**
		 * @name isContentChanged
		 * @description 经验内容是否更改判断
		 *
		 */
            var self = this;
            var title = Gtool.filterWhiteSpace(dataCenter.getData('title'));
            var originTitle = Gtool.filterWhiteSpace(dataCenter.getData('originTitle'));
            if (!(signVars && vars)) {
                return false;
            }
            if (
            signVars.content == vars.content && 
            signVars.reference == vars.reference && 
            signVars.isOriginal == vars.isOriginal && 
            signVars.originAuthor == vars.originAuthor && 
            signVars.cid == vars.cid && 
            title == originTitle
            ) {
                return false;
            }
            return true;
        },
        setValidateVars: function(expTxt, reference, noEmptyTitleSection, cid, noEmptyBriefSection, foodJson) {
            /**
		 * @name setValidateVars
		 * @description 设置需要验证的参数
		 *
		 */
            this.validateVars = {
                expTxt: expTxt,
                reference: reference,
                noEmptyTitleSection: noEmptyTitleSection,
                cid: cid,
                noEmptyBriefSection: noEmptyBriefSection,
                checkFoodJson: foodJson
            };
        }
    };
    exports = submit;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/ui/ajax/ajax.js', '/static/common/ui/dialog/dialog.js', '/static/common/ui/login/login.js', '/static/common/lib/fis/event/event.js', '/static/edit/ui/dataCenter/dataCenter.js', '/static/edit/ui/validate/validate.js', '/static/common/ui/util/tool/tool.js', '/static/edit/ui/error/error.js', '/static/common/ui/error/error.js']);
F.module('/static/edit/ui/imageupload/imageupload.js', function(require, exports) {
    /*-----[ /static/edit/ui/imageupload/imageupload.js ]-----*/
    /**
 * @author liuyong07
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var tipsManager = require('/static/edit/ui/tips/tips.js');
    require("/static/common/lib/tangram/flash/fileUploader/fileUploader.js");
    require("/static/edit/ui/submit/submit.js");
    var imageupload = function(options) {
        /**
		 * @name imageupload
		 * @param {Object} options 上传图片的配置参数 
		 */
        var self = this, 
        mediaLength, 
        ownerStep = options.ownerStep, 
        callTimes = arguments.callee.callTimes ? ++arguments.callee.callTimes : (arguments.callee.callTimes = 1), 
        flashID = 'flash-' + callTimes;
        options = {
            createOptions: {
                'id': flashID,
                'url': '/static/common/flash/multiupload.swf',
                'width': (options.width || 80),
                'height': (options.height || 60),
                'wmode': 'transparent',
                'container': options.container,
                'tabIndex': '-1',
                'vars': {
                    flashID: flashID,
                    picWidth: 100, // 单张预览图片的宽度
                    picHeight: 100, // 单张预览图片的高度
                    uploadDataFieldName: 'file', // POST请求中图片数据的key
                    picDescFieldName: 'pictitle', // POST请求中图片描述的key
                    compressSize: 1, // 上传前如果图片体积超过该值，会先压缩,单位M
                    maxNum: 40, // 最大上传多少个文件
                    backgroundUrl: '', //背景图片,留空默认
                    listBackgroundUrl: '', //预览图背景，留空默认
                    buttonUrl: '', //按钮背景，留空默认
                    ext: '{"method":"uploadPic","BDUSS":"' + T.cookie.get("BDUSS") + '"}', //可向服务器提交的自定义参数列表
                    fileType: '{"description":"图片", "extension":"*.gif;*.jpeg;*.png;*jpg"}'
                }
            },
            maxNum: 20,
            maxSize: 3 * 1024,
            onAllComplete: options.onAllComplete || function() {
            }
        };
        function isOverSize(object) {
            if (object.size > 3 * 1024 * 1024) {
                return true;
            }
            return false;
        }
        function isAcceptFile(object) {
            if (/\.(gif|jpg|jpeg|png)$/.test(object.name.toLowerCase())) {
                return true;
            }
            return false;
        }
        options = T.object.extend({
            uploadComplete: function(data) {
                var imageIndex = self.medias.length + data.index;
                var media;
                T.array.each(self.medias, function(item, index) {
                    if (item.countIndex == (self.countTotal - self.uploadTotal + data.index + 1)) {
                        media = item;
                        return false;
                    }
                });
                if (data.index === (self.uploadTotal - 1)) {
                    self.uploadTotal = undefined;
                    self.uploading = false;
                    options.onAllComplete(window.GeditorManager.onUploadStep);
                    window.GeditorManager.onUploadStep = null;
                }
                var info = eval('(' + data.data + ')');
                var obj = {
                    'src': info.encrypt,
                    'type': 'img',
                    'timgurl': info.timgurl
                };
                //将上传完成的图片更新到media中
                media && media.loadImage(obj);
            },
            uploadStart: function(data) {
                var media;
                T.array.each(self.medias, function(item, index) {
                    if (item.countIndex == (self.countTotal - self.uploadTotal + data.index + 1)) {
                        media = item;
                        return false;
                    }
                });

                //创建进度条
                media && media.createLoadBar();
            },
            selectFile: function(data, flashID) {
                var selectNum = data.info.selectedNum, 
                maxNum = data.info.maxNum, 
                mediaManager = self, 
                mediaLength = self.medias.length;
                mediaManager.uploadTotal = selectNum;
                var files = data.files;
                for (var i = 0, len = files.length; i < len; i++) {
                    if (isOverSize(files[i])) {
                        dialog.alert("提示", {info: '<p>图片大小不能超过3M</p>'});
                        return;
                    }
                    if (!isAcceptFile(files[i])) {
                        dialog.alert("提示", {info: '<p>上传文件不对，只能上传图片</p>'});
                        return;
                    }
                }
                
                if (selectNum > maxNum) {
                    dialog.alert("提示", {info: '<p>最大上传数不能超过' + maxNum + ',请重新上传</p>'});
                    return;
                }
                mediaManager.uploadTotal = selectNum;
                //创建装载图片的holder
                for (var i = 1; i <= selectNum; i++) {
                    var index = mediaLength + i;
                    mediaManager.add({type: 'img',src: ''}, index, 'new');
                }
                self.uploading = true;
                window.GeditorManager.onUploadStep = ownerStep;
                //上传图片
                self.uploadInstances[flashID].upload("/submit/picture?method=uploadPic", "file", {'crop': 'wh=80,60'}, -1);
                tipsManager.handleDragImageTip(self);
            },
            uploadError: function(data, a) {
                self.uploading = false;
                dialog.alert("提示", {info: '<p>对不起上传出错啦!</p>'});
            },
            uploadProgress: function(data, a) {
                //更新单张图片上传的进度条
                var media;
                T.array.each(self.medias, function(item, index) {
                    if (item.countIndex == (self.countTotal - self.uploadTotal + data.index + 1)) {
                        media = item;
                        return false;
                    }
                });
                media && media.setLoadProcess(data.data);
            }
        }, options);
        uploadInstance = new T.flash.fileUploader(options);
        if (!self.uploadInstances) {
            self.uploadInstances = {};
        }
        self.uploadInstances[flashID] = uploadInstance;
    };
    exports = imageupload;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/ui/dialog/dialog.js', '/static/edit/ui/tips/tips.js', '/static/common/lib/tangram/flash/fileUploader/fileUploader.js', '/static/edit/ui/submit/submit.js']);
F.module('/static/edit/ui/media/media.js', function(require, exports) {
    /*-----[ /static/edit/ui/media/media.js ]-----*/
    /**
 * @fileOverView name media.js
 * @author liuyong07@baidu.com
 * 
 */
    
    var T = require("/static/common/lib/tangram/base/base.js");
    var addVideo = require("/static/edit/ui/video/video.js");
    var imageUploader = require("/static/edit/ui/imageupload/imageupload.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var Media = T.lang.createClass(function(media, index, createType, countIndex) {
        /**
	 * @class Media
	 * @description 媒体(图片和视频)类
	 * @param {Object} media 媒体值json数据源
	 * @param {Int} index 媒体序号
	 * @param {String} createType 创建类型 'new' 为重新上传的图片
	 * @param {Int} countIndex 被创mediaManager 创建的序列号，序列号唯一
	 */
        this.media = media;
        this.index = index;
        this.type = media.type;
        this.createType = createType;
        this.countIndex = countIndex;
        this.render();
    }).extend({
        conf: {
            placeholder: {
                img: 'http://img.baidu.com/img/iknow/exp/global/transparent1px.gif',
                video: 'http://img.baidu.com/img/iknow/exp/edit/video-place-holder.gif',
                imgError: 'http://img.baidu.com/img/iknow/exp/edit/image-load-error.gif'
            },
            image: {
                width: 80,
                height: 60
            },
            loadBar: {
                backgroundColor: '#90d3e1',
                border: '1px solid #319fb7',
                width: 45,
                height: 2
            }
        },
        init: function() {
            this.render();
        },
        render: function() {
            /**
		 * @name render
		 * @description 创建dom
		 *
		 */
            this.mediaContainer = T.dom.create('div', {
                'class': 'step-media step-media-' + this.countIndex
            });
            this.mediaContainerInner = T.dom.create('div', {
                'class': 'step-media-inner'
            });
            this.removeBtn = T.dom.create('a', {
                'href': 'javascript:;',
                'class': 'media-remove-btn'
            });
            this.mediaContainerInner.appendChild(this._createImage());
            this.mediaContainer.appendChild(this.mediaContainerInner);
            this.mediaContainerInner.appendChild(this.removeBtn);
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 获取媒体内容
		 *
		 */
            var self = this, 
            JSON = {
                'type': self.type,
                'src': self.url.src
            }
            return JSON;
        },
        _createImage: function() {
            /**
		 * @name _createImage 
		 * @description 创建图片
		 *
		 */
            var self = this, 
            className = (this.type == 'img') ? 'step-media-image' : 'step-media-video', 
            placeHolder = this.conf.placeholder[this.type];
            className = 'step-media-item ' + className;
            this.image = T.dom.create('img', {
                'class': className,
                'src': placeHolder,
                'type': this.type
            });
            this.mediaHolder = T.dom.create('div', {
                'class': 'step-media-wrap'
            });
            T.dom.setStyles(this.mediaHolder, {
                width: this.conf.image.width,
                height: this.conf.image.height,
                overflow: 'hidden'
            });
            this.mediaHolder.appendChild(this.image);
            //加载图片
            if (this.type == 'img' && this.createType != 'new') {
                self.loadImage(self.media);
            } else {
                T.dom.setAttr(this.image, '_src', this._generateURL(self.media));
            }
            return this.mediaHolder;
        },
        createLoadBar: function() {
            /**
		 * @name createLoadBar
		 * @description 生成进度条
		 *
		 */
            var self = this, 
            loadBarConf = self.conf.loadBar;
            self.loadBar = T.dom.create('div', {
                'class': 'step-image-loadbar-holder'
            });
            self.loadBarInner = T.dom.create('div', {
                'class': 'step-image-loadbar-status'
            });
            self.loadBar.appendChild(self.loadBarInner);
            self.mediaContainerInner.appendChild(self.loadBar);
            T.dom.setStyles(self.loadBar, {
                width: loadBarConf.width,
                height: loadBarConf.height,
                border: loadBarConf.border,
                overFlow: 'hidden',
                position: 'absolute',
                top: '29px',
                left: '17px'
            });
            T.dom.setStyles(self.loadBarInner, {
                width: '0px',
                height: '2px',
                overflow: 'hidden',
                backgroundColor: loadBarConf.backgroundColor
            });
        },
        removeLoadBar: function() {
            /**
		 * @name removeLoadBar
		 * @description 移除上传进度条
		 *
		 */
            var self = this;
            self.loadBar && T.dom.hide(self.loadBar);
        },
        setLoadProcess: function(value) {
            /**
		 * @name setLoadProcess
		 * @description 更新上传进度
		 * @param {Float} value 上传进度浮点数
		 *
		 */
            var self = this, 
            numStatus = parseFloat(value);
            width = self.conf.loadBar.width * numStatus;
            T.dom.setStyle(self.loadBarInner, 'width', width);
        },
        loadImage: function(media) {
            /**
		 * @name loadImage
		 * @description 加载图片
		 * @param {Object} media 图片信息
		 *
		 */
            var self = this;
            var relImg = new Image();
            relImg.src = this._generateURL(media);
            T.dom.setAttr(this.image, '_src', this.url.src);
            if (relImg.complete) {
                //图片缓存
                self._imageLoadOk(relImg);
            } else {
                relImg.onload = function() {
                    //加载成功
                    self._imageLoadOk(relImg);
                    relImg.onload = null;
                };
                relImg.onerror = function() {
                    //加载失败
                    self._imageLoadError(relImg);
                    relImg.onerror = null;
                };
            }
        },
        _imageLoadOk: function(relImg) {
            /**
		 * @name _imageLoadOk
		 * @description 图片加载成功并进行裁切
		 *
		 */
            var relWidth = relImg.width, 
            relHeight = relImg.height, 
            width = this.conf.image.width, 
            height = this.conf.image.height, 
            ratio = width / height, 
            relRatio = relWidth / relHeight, 
            setWidth, 
            setHeight, 
            top, 
            left;
            if (ratio < relRatio) {
                /**/
                if (relHeight < height) {
                    setWidth = width;
                    setHeight = height;
                } else {
                    setHeight = height;
                    setWidth = setHeight * relRatio;
                }
            } else {
                if (relWidth < width) {
                    setWidth = relWidth;
                    setHeight = setWidth / relRatio;
                } else {
                    setWidth = width;
                    setHeight = setWidth / relRatio;
                }
            }
            left = (width - setWidth) / 2;
            top = (height - setHeight) / 2;
            T.dom.setAttr(this.image, 'src', relImg.src);
            T.dom.setStyles(this.image, {
                width: setWidth,
                height: setHeight,
                marginLeft: left + 'px',
                marginTop: top + 'px'
            });
            //移除上传进度条
            this.removeLoadBar();
        },
        _imageLoadError: function(relImg) {
            /**
		 * @name _imageLoadError
		 * @description 图片加载失败处理逻辑
		 *
		 */
            this.removeLoadBar();
            T.dom.setAttr(this.image, 'src', this.conf.placeholder.imgError);
        },
        _generateURL: function(media) {
            /**
		 * @name _generateURL
		 * @description 生成媒体链接
		 *
		 */
            var type = media.type, 
            url = type == 'img' ? 
            media.timgurl ? media.timgurl : (F.context('imagePath') + media.src + '.jpg') : 
            media.src;
            this.url = {
                src: media.src,
                timgurl: url
            };
            return url;
        },
        getContainer: function() {
            /**
		 * @name getContainer
		 * @description 获取媒体dom容器
		 * @return {HTMLDOMelement} 返回容器dom元素
		 */
            return this.mediaContainer;
        },
        attachEvents: function(parent) {
            /**
		 * @name attachEvents
		 * @description 为媒体绑定事件
		 *
		 */
            var self = this;
            T.event.on(this.mediaContainer, 'mouseover', function(e) {
                T.dom.removeClass(self.removeBtn, 'step-remove-btn-hide');
                T.dom.addClass(self.mediaContainer, 'step-media-hover');
            });
            T.event.on(this.mediaContainer, 'mouseout', function(e) {
                T.dom.addClass(self.removeBtn, 'step-remove-btn-hide');
                T.dom.removeClass(self.mediaContainer, 'step-media-hover');
            });
            //删除媒体按钮逻辑
            T.event.on(this.removeBtn, 'click', function(e) {
                T.event.stopPropagation(e);
                T.event.preventDefault(e);
                var parentDOM = parent.container;
                parent.remove(self.index - 1);
            });
        },
        updateListStatus: function(newIndex) {
            /**
		 * @name updateListStatus 更新媒体序号
		 *
		 */
            this.index = newIndex;
        }
    });
    
    var MediaManager = T.lang.createClass(function(mediasJson, sectionType) {
        /**
	 * @class MediaManager
	 * @description 媒体管理类
	 * @param {Array} mediasJson 媒体类数组
	 * @param {String} sectionType 媒体管理类所属栏目的栏目类型
	 *
	 */
        this.mediasJson = mediasJson;
        this.medias = [];
        this.sectionType = sectionType;
        this.countTotal = 0;
        this.waitingNum = 0;
        this.init();
    }).extend({
        init: function() {
            this.render();
            this.attachEvents();
        },
        render: function() {
            var that = this;
            this.container = that.createMediasContainer();
            this.addImageBtn = T.dom.create('div', {
                'class': 'image-add-btn'
            });
            T.array.each(that.mediasJson, function(item, index) {
                var order = index + 1;
                that.add(item, order);
            });
            if (!(this.sectionType == 'tools' || this.sectionType == 'notice')) {
                this.container.appendChild(this.addImageBtn);
            }
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 获取媒体
		 *
		 */
            var self = this, 
            JSON = [];
            var images = T.dom.q('step-media-item', this.container);
            T.array.each(images, function(item, index) {
                var obj = {
                    'src': T.dom.getAttr(item, '_src'),
                    'type': T.dom.getAttr(item, 'type')
                }
                JSON.push(obj);
            });
            return JSON;
        },
        remove: function(index) {

            /**
		 * @name remove
		 * @description 删除媒体
		 * @param {Int} 需要删除媒体的序号
		 *
		 */
            this.container.removeChild(this.medias[index].getContainer());
            this.medias.splice(index, 1);
            this.updatelist();
        },
        add: function(json, index, type) {
            /**
		 * @name add 
		 * @description 添加媒体
		 * @param {Object} json 媒体json内容
		 * @param {int} index 序号
		 * @param {type} type 创建方式 
		 */
            this.countTotal += 1;
            var media = new Media(json, index, type, this.countTotal);
            media.attachEvents(this);
            this.medias.push(media);
            if (type && type === 'new') {
                T.dom.insertBefore(media.getContainer(), this.addImageBtn);
            } else {
                this.container.appendChild(media.getContainer());
            }
        },
        createMediasContainer: function() {
            /**
		 * @name createMediasContainer
		 * @description 创建媒体容器
		 */
            this.container = T.dom.create('div', {
                'class': 'step-media-container clearfix'
            });
            return this.container;
        },
        createUploader: function(options) {
            /**
		 * @name createUploader
		 * @description 生成上传组件
		 */
            var self = this;
            options = T.object.extend({
                container: self.addImageBtn,
                'onAllComplete': function() {
                    var editorManager = window.GeditorManager;
                    if (editorManager.onEditStep == editorManager.onUploadStep) {
                        return;
                    }
                    if (editorManager.onUploadStep) {
                        editorManager.onUploadStep.mediaManager.addImageBtn.innerHTML = '';
                    }
                    editorManager.onEditStep.mediaManager.createUploader({
                        'ownerStep': editorManager.onEditStep
                    });
                }
            }, options);
            
            imageUploader.call(this, options);
        },
        getContainer: function() {
            return this.container;
        },
        attachEvents: function() {
            var self = this;
            T.event.on(this.addImageBtn, 'click', function(event) {
                var html = T.string.trim(this.innerHTML);
                if (!html) {
                    dialog.alert("提示", {info: '<p>其他步骤中还有图片在上传，请稍等......</p>'});
                }
            });
        },
        updatelist: function() {
            /**
		 * @name updatelist
		 * @description 更新没听序号
		 *
		 */
            T.array.each(this.medias, function(item, index) {
                index = index + 1;
                item.updateListStatus(index);
            });
        }
    });
    
    exports = MediaManager;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/video/video.js', '/static/edit/ui/imageupload/imageupload.js', '/static/common/ui/dialog/dialog.js']);
F.module('/static/edit/ui/sortable/sortable.js', function(require, exports) {
    /*-----[ /static/edit/ui/sortable/sortable.js ]-----*/
    /**
 * @fileOverView
 * @author liuyong07
 * @email liuyong07@baidu.com
 * @information 代码实现参考jquery.ui.sortable
 *
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    require("/static/common/lib/tangram/fx/moveTo/moveTo.js");
    T.event.on(document, 'mouseup', function(event) {
        window.mouseHandled = false;
    });
    var Sortable = T.lang.createClass(function(options) {
        this.options = T.object.extend({
            distance: 1,
            delay: 0,
            appendTo: "parent",
            axis: false,
            connectWith: false,
            containment: false,
            cursor: 'auto',
            cursorAt: false,
            dropOnEmpty: true,
            forcePlaceholderSize: false,
            forceHelperSize: false,
            grid: false,
            handle: false,
            helper: "ui-place-holder",
            items: false,
            opacity: false,
            placeholder: false,
            revert: false,
            scroll: true,
            scrollSensitivity: 20,
            scrollSpeed: 20,
            scope: "default",
            tolerance: "intersect",
            zIndex: 1000,
            start: function() {
            
            },
            sort: function() {
            },
            beforeStop: function() {
            },
            stop: function() {
            },
            change: function() {
            }
        }, options);
        this.items = [];
        this.container = T.dom.g(this.options.container);
        this.cancelItems = [];
        this.ready = false;
    }).extend({
        init: function() {
            this._create();
        },
        _create: function() {
            var o = this.options;
            this.containerCache = {};
            T.dom.addClass(this.container, "ui-sortable");

            //Get the items
            this.refresh();
            //Let's determine if the items are being displayed horizontally
            this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(T.dom.getStyle(this.items[0].item, 'float')) || (/inline|table-cell/).test(T.dom.getStyle(this.items[0].item, 'display')) : false;

            //Let's determine the parent's offset
            this.parentOffset = T.dom.getPosition(this.container);

            //Initialize mouse events for interaction
            this._mouseInit();
            //We're ready to go
            this.ready = true;
        
        },
        refresh: function(event) {
            this._refreshItems(event);
            this.refreshPositions();
            return this;
        },
        
        _mouseInit: function() {
            var self = this;
            this.mouseDownDelegate = function(event) {
                return self._mouseDown(event);
            };
            this.clickDelegate = function(event) {
                T.event.preventDefault(event);
                T.event.stopPropagation(event);
            };
            T.event.on(this.container, 'mousedown', this.mouseDownDelegate);
            T.event.on(this.container, 'click', this.clickDelegate);
        },
        _mouseDestroy: function() {
            T.event.un(this.container, 'mousedown', this.mouseDownDelegate);
            T.event.un(this.container, 'click', this.clickDelegate);
            T.event.un(document, 'mousemove', this.mouseMoveDelegate);
            T.event.un(document, 'mouseup', this.mouseUpDelegate);
        },
        destroy: function() {
            T.dom.removeClass(this.container, "ui-sortable");
            window.mouseHandled = false;
            this._mouseDestroy();
        },
        _mouseStart: function(event, overrideHandle, noActivation) {
            var o = this.options, self = this;
            this.currentContainer = this.container;
            //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
            this.refreshPositions();
            //Create and append the visible helper
            this.helper = this._createHelper(event);
            //Cache the helper size
            this._cacheHelperProportions();
            /*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

            //Cache the margins of the original element
            this._cacheMargins();
            //Get the next scrolling parent
            this.scrollParent = this.getScrollParent(this.helper);
            //The element's absolute position on the page minus margins
            //this.offset = this.currentItem.offset();
            this.offset = T.dom.getPosition(this.currentItem);
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            
            T.object.extend(this.offset, {
                click: { //Where the click happened, relative to the element
                    left: T.event.getPageX(event) - this.offset.left,
                    top: T.event.getPageY(event) - this.offset.top
                },
                parent: this._getParentOffset(),
                relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
            });
            // Only after we got the offset, we can change the helper's position to absolute
            // TODO: Still need to figure out a way to make relative sorting possible
            T.dom.setStyle(this.helper, "position", "absolute");
            this.cssPosition = T.dom.getStyle(this.helper, "position");

            //Generate the original position
            this.originalPosition = this._generatePosition(event);
            this.originalPageX = T.event.getPageX(event);
            this.originalPageY = T.event.getPageY(event);

            //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
            (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

            //Cache the former DOM position
            this.domPosition = {prev: T.dom.prev(this.currentItem),parent: T.dom.getParent(this.currentItem)};

            //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
            if (this.helper != this.currentItem) {
                T.dom.hide(this.currentItem);
            }

            //Create the placeholder
            this._createPlaceholder();

            //Set a containment if given in the options
            if (o.containment) {
                this._setContainment();
            }
            
            if (o.cursor) { // cursor option
                if (T.dom.getStyle(document.body, 'cursor'))
                    this._storedCursor = T.dom.getStyle(document.body, 'cursor');
                T.dom.setStyle(document.body, 'cursor', o.cursor);
            }
            
            if (o.opacity) { // opacity option
                if (T.dom.getStyle(this.helper, "opacity"))
                    this._storedOpacity = T.dom.getStyle(this.helper, "opacity");
                T.dom.setStyle(this.helper, "opacity", o.opacity);
            }
            
            if (o.zIndex) { // zIndex option
                if (T.dom.getStyle(this.helper, "zIndex"))
                    this._storedZIndex = T.dom.getStyle(this.helper, "zIndex");
                T.dom.setStyle(this.helper, "zIndex", o.zIndex);
            }

            //Prepare scrolling
            if (this.scrollParent != document && this.scrollParent.tagName != 'HTML')
                this.overflowOffset = T.dom.getPosition(this.scrollParent);

            //Call callbacks
            this.options.start.call(this, event);
            //Recache the helper size
            if (!this._preserveHelperProportions)
                this._cacheHelperProportions();


            //Post 'activate' events to possible containers
            if (!noActivation) {
            //for (var i = this.containers.length - 1; i >= 0; i--) { this.containers[i]._trigger("activate", event, self._uiHash(this)); }
            }

            //Prepare possible droppables
            /*
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);
		*/
            this.dragging = true;
            
            T.dom.addClass(this.helper, "ui-sortable-helper");
            this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
            return true;
        
        },
        _mouseCapture: function(event, overrideHandle) {
            if (this.reverting) {
                return false;
            }
            if (this.options.disabled || this.options.type == 'static')
                return false;
            //We have to refresh the items data once first
            this._refreshItems(event);

            //Find out if the clicked node (or one of its parents) is a actual item in this.items
            /*
		var currentItem = null, self = this, nodes = $(event.target).parents().each(function() {
			if($.data(this, that.widgetName + '-item') == self) {
				currentItem = $(this);
				return false;
			}
		});
		*/
            var currentItem = null, 
            self = this, 
            target = T.event.getTarget(event), 
            nodes = this.parents(target);
            nodes.unshift(target);
            T.array.each(this.items, function(item, index) {
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (item.item == nodes[i]) {
                        currentItem = item.item;
                    }
                }
            });
            if (!currentItem) {
                return false;
            }
            if (this.options.handle && !overrideHandle) {
                var validHandle = false;

                //$(this.options.handle, currentItem).find("*").andSelf().each(function() { if(this == event.target) validHandle = true; });
                var handle = T.dom.q(this.options.handle, currentItem)[0];
                var candidateHandle = T.dom.children(handle);
                candidateHandle.push(handle);
                T.array.each(candidateHandle, function() {
                    if (item == T.event.getTarget(event)) {
                        validHandle = true;
                    }
                });
                if (!validHandle)
                    return false;
            }
            this.currentItem = currentItem;
            this._removeCurrentsFromItems();
            return true;
        },
        
        _mouseDown: function(event) {
            if (window.mouseHandled) {
                return;
            }
            (this._mouseStarted && this._mouseUp(event));
            var eventTarget = T.event.getTarget(event);
            if (typeof eventTarget.onselectstart != "undefined") {
                T.event.on(eventTarget, 'selectstart', function(event) {
                    T.event.preventDefault(event);
                    T.event.stop(event);
                });
                T.event.on(eventTarget, 'dragstart', function(event) {
                    T.event.preventDefault(event);
                    T.event.stop(event);
                });
            } else if (typeof eventTarget.style.MozUserSelect != "undefined") {
                eventTarget.style.MozUserSelect = "none";
            } 
            else {
                T.event.preventDefault(event);
            }
            this._mouseDownEvent = event;
            this._mouseDownEventClone = {
                pageX: T.event.getPageX(event),
                pageY: T.event.getPageY(event),
                target: T.event.getTarget(event)
            };
            var self = this, 
            btnIsLeft = ((T.browser.ie == 9) || ((T.browser.ie && event.button == 1) || ((!T.browser.ie) && event.button == 0))), 
            // event.target.nodeName works around a bug in IE 8 with
            // disabled inputs (#7620)
            elIsCancel = false, 
            ancestor;
            if (this.cancelItems.length > 0 && eventTarget.nodeName) {
                for (var i = 0, len = cancelItems.length; i < len; i++) {
                    if (cancelItems[i] == eventTarget) {
                        elIsTarget = true;
                        break;
                    }
                    ancestor = T.dom.getAncestorBy(eventTarget, function(elem) {
                        return eventTarget == elem;
                    });
                    if (ancestor) {
                        elIsCancel == true;
                        break;
                    }
                }
            }
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }
            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function() {
                    self.mouseDelayMet = true;
                }, this.options.delay);
            }
            
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }
            
            this._mouseMoveDelegate = function(event) {
                return self._mouseMove(event);
            };
            this._mouseUpDelegate = function(event) {
                return self._mouseUp(event);
            };
            T.event.on(document, 'mousemove', this._mouseMoveDelegate);
            T.event.on(document, 'mouseup', this._mouseUpDelegate);
            
            T.event.preventDefault(event);
            window.mouseHandled = true;
            return true;
        },
        _mouseMove: function(event) {
            // IE mouseup check - mouseup happened when mouse was out of window
            if (T.browser.ie && !(document.documentMode >= 9) && !T.event.getEvent(event).button) {
                return this._mouseUp(event);
            }
            if (this._mouseStarted) {
                this._mouseDrag(event);
                return T.event.preventDefault(event);
            }
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = 
                (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }
            return !this._mouseStarted;
        },
        _mouseDrag: function(event) {
            //Compute the helpers position
            this.position = this._generatePosition(event);
            this.positionAbs = this._convertPositionTo("absolute");
            
            if (!this.lastPositionAbs) {
                this.lastPositionAbs = this.positionAbs;
            }

            //Do scrolling
            /*
		if(this.options.scroll) {
			var o = this.options, scrolled = false;
			if(this.scrollParent != document && this.scrollParent.tagName != 'HTML') {

				if((this.overflowOffset.top + this.scrollParent.offsetHeight) - T.event.getPageY(event) < o.scrollSensitivity)
					this.scrollParent.scrollTop = scrolled = this.scrollParent.scrollTop + o.scrollSpeed;
				else if(T.event.getPageY(event) - this.overflowOffset.top < o.scrollSensitivity)
					this.scrollParent.scrollTop = scrolled = this.scrollParent.scrollTop - o.scrollSpeed;

				if((this.overflowOffset.left + this.scrollParent.offsetWidth) - T.event.getPageX(event) < o.scrollSensitivity)
					this.scrollParent.scrollLeft = scrolled = this.scrollParent.scrollLeft + o.scrollSpeed;
				else if(T.event.getPageX(event) - this.overflowOffset.left < o.scrollSensitivity)
					this.scrollParent.scrollLeft = scrolled = this.scrollParent.scrollLeft - o.scrollSpeed;

			} else {

				if(T.event.getPageY(event) - T.page.getScrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

			}
		}
		*/
            //Regenerate the absolute position used for position checks
            this.positionAbs = this._convertPositionTo("absolute");

            //Set the helper position
            if (!this.options.axis || this.options.axis != "y")
                this.helper.style.left = this.position.left + 'px';
            if (!this.options.axis || this.options.axis != "x")
                this.helper.style.top = this.position.top + 'px';
            //Rearrange
            for (var i = this.items.length - 1; i >= 0; i--) {

                //Cache variables and intersection, continue if no intersection
                var item = this.items[i], itemElement = item.item, intersection = this._intersectsWithPointer(item);
                if (!intersection)
                    continue;
                
                if (itemElement != this.currentItem  //cannot intersect with itself
                && T.dom[intersection == 1 ? "next" : "prev"](this.placeholder) != itemElement  //no useless actions that have been done before
                && !T.dom.contains(this.placeholder, itemElement)  //no action if the item moved is the parent of the item checked
                && (this.options.type == 'semi-dynamic' ? !T.dom.contains(this.container, itemElement) : true)
                //&& itemElement.parentNode == this.placeholder.parentNode // only rearrange items within the same container
                ) {
                    
                    this.direction = intersection == 1 ? "down" : "up";
                    
                    if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
                        this._rearrange(event, item);
                    } else {
                        break;
                    }

                    //this._trigger("change", event, this._uiHash());
                    this.options.change.call(this, event);
                    break;
                }
            }

            //Post events to containers
            //this._contactContainers(event);

            //Interconnect with droppables
            //	if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

            //Call callbacks
            //this._trigger('sort', event, this._uiHash());
            this.options.sort(event);
            this.lastPositionAbs = this.positionAbs;
            return false;
        
        },
        _mouseUp: function(event) {
            T.event.un(document, 'mousemove', this._mouseMoveDelegate);
            T.event.un(document, 'mouseup', this._mouseUpDelegate);
            
            if (this._mouseStarted) {
                this._mouseStarted = false;
                
                if (T.event.getTarget(event) == T.event.getTarget(this._mouseDownEvent)) {
                    T.event.stop(event);
                }
                this._mouseStop(event);
            }
            return false;
        },
        
        _mouseDistanceMet: function(event) {
            return (Math.max(
            Math.abs(T.event.getPageX(this._mouseDownEventClone) - T.event.getPageX(event)), 
            Math.abs(T.event.getPageY(this._mouseDownEventClone) - T.event.getPageY(event))
            ) >= this.options.distance
            );
        
        },
        
        _mouseDelayMet: function(event) {
            return this.mouseDelayMet;
        },
        _getParentOffset: function() {
            //Get the offsetParent and cache its position
            this.offsetParent = this.getOffsetParent(this.helper);
            var po = T.dom.getPosition(this.offsetParent);

            // This is a special case where we need to modify a offset calculated on start, since the following happened:
            // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
            // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
            //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
            if (this.cssPosition == 'absolute' && this.scrollParent != document && T.dom.contains(this.scrollParent, this.offsetParent)) {
                po.left += this.scrollParent.scrollLeft;
                po.top += this.scrollParent.scrollTop;
            }
            
            if ((this.offsetParent == document.body)  //This needs to be actually done for all browsers, since pageX/pageY includes this information
            || (this.offsetParent.tagName && this.offsetParent.tagName.toLowerCase() == 'html' && T.browser.ie)) { //Ugly IE fix
                po = {top: 0,left: 0};
            }
            var obj = {
                top: po.top + (parseInt(T.dom.getStyle(this.offsetParent, "borderTopWidth"), 10) || 0),
                left: po.left + (parseInt(T.dom.getStyle(this.offsetParent, "borderLeftWidth"), 10) || 0)
            };
            return obj;
        
        },
        _getRelativeOffset: function() {
            if (this.cssPosition == "relative") {
                var p = this.getPosition(this.currentItem);
                return {
                    //top: p.top - (parseInt(T.dom.getStyle(this.helper,"top"),10) || 0),
                    //left: p.left - (parseInt(T.dom.getStyle(this.helper,"left"),10) || 0)
                    top: p.top - (parseInt(T.dom.getStyle(this.helper, "top"), 10) || 0) + this.scrollParent.scrollTop,
                    left: p.left - (parseInt(T.dom.getStyle(this.helper, "left"), 10) || 0) + this.scrollParent.scrollLeft
                };
            } else {
                return {top: 0,left: 0};
            }
        
        },
        getPosition: function(elem) {
            if (!elem) {
                return null;
            }


            // Get *real* offsetParent
            var offsetParent = this.getOffsetParent(elem), 

            // Get correct offsets
            offset = T.dom.getPosition(elem), 
            parentOffset = (/^(?:body|html)$/i).test(offsetParent.nodeName) ? {top: 0,left: 0} : T.dom.getPosition(offsetParent);

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(T.dom.getStyle(elem, "marginTop")) || 0;
            offset.left -= parseFloat(T.dom.getStyle(elem, "marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(T.dom.getStyle(offsetParent, "borderTopWidth")) || 0;
            parentOffset.left += parseFloat(T.dom.getStyle(offsetParent, "borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },
        refreshPositions: function(fast) {
            //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
            if (this.offsetParent && this.helper) {
                this.offset.parent = this._getParentOffset();
            }
            for (var i = this.items.length - 1; i >= 0; i--) {
                var item = this.items[i];

                //We ignore calculating positions of all connected containers when we're not over them
                var t = item.item;
                if (!fast) {
                    item.width = this._getOuterWidth(t);
                    item.height = this._getOuterHeight(t);
                }
                
                var p = T.dom.getPosition(t);
                item.left = p.left;
                item.top = p.top;
            }
            if (this.options.custom && this.options.custom.refreshContainers) {
                this.options.custom.refreshContainers.call(this);
            } else {
                var p = T.dom.getPosition(this.container);
                this.containerCache.left = p.left;
                this.containerCache.top = p.top;
                //the next should be get the outerWidth and outerHeight
                this.containerCache.width = this._getOuterWidth(this.container);
                this.containerCache.height = this._getOuterHeight(this.container);
            }
            return this;
        },
        _refreshItems: function(event) {
            this.items = [];
            var items = this.items;
            var self = this;
            var domItems;
            if (T.lang.isFunction(this.options.items)) {
                domItems = this.options.call(this.container, this.currentItem);
            } else if (T.lang.isString(this.options.items)) {
                domItems = T.dom.q(this.options.items, this.container);
            } else {
                domItems = T.dom.children(this.container);
            }
            for (var i = domItems.length - 1; i >= 0; i--) {
                var item = domItems[i];
                items.push({
                    item: item,
                    instance: self.container,
                    width: 0,height: 0,
                    left: 0,top: 0
                });
            
            }
        },
        getScrollParent: function(elem) {
            var scrollParent;
            if ((T.browser.ie && (/(static|relative)/).test(T.dom.getPosition(elem, 'position'))) || (/absolute/).test(T.dom.getStyle(elem, 'position'))) {
                scrollParent = T.array.filter(this.parents(elem), function(item, i) {
                    return (/(relative|absolute|fixed)/).test(T.dom.getComputedStyle(item, 'position')) && (/(auto|scroll)/).test(T.dom.getComputedStyle(item, 'overflow') + T.dom.getComputedStyle(item, 'overflow-y') + T.dom.getComputedStyle(item, 'overflow-x'));
                })[0];
            } else {
                scrollParent = T.array.filter(this.parents(elem), function(item, i) {
                    return (/(auto|scroll)/).test(T.dom.getComputedStyle(item, 'overflow') + T.dom.getComputedStyle(item, 'overflow-y') + T.dom.getComputedStyle(item, 'overflow-x'));
                })[0];
            }
            
            return (/fixed/).test(T.dom.getStyle(elem, 'position')) || !scrollParent ? document : scrollParent;
        },
        getOffsetParent: function(elem) {
            var offsetParent = elem.offsetParent || document.body;
            while (offsetParent && (!(/^(?:body|html)$/i).test(offsetParent.nodeName) && T.dom.getStyle(offsetParent, "position") === "static")) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent;
        },
        parents: function(elem, until) {
            var matched = [], 
            cur = elem['parentNode'];
            
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || cur != T.dom.g(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur['parentNode'];
            }
            return matched;
        },
        _createHelper: function(event) {
            
            var o = this.options;
            var helper = T.lang.isFunction(o.helper) ? $(o.helper.apply(this.container, [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.cloneNode(true) : this.currentItem);
            
            if (!this.parents(helper, document.body).length) //Add the helper to the DOM if that didn't happen already
                T.dom.g(o.appendTo != 'parent' ? T.dom.g(o.appendTo) : this.currentItem.parentNode).appendChild(helper);
            if (helper == this.currentItem)
                this._storedCSS = {width: T.dom.getStyle(this.currentItem, 'width'),height: T.dom.getStyle(this.currentItem, 'height'),position: T.dom.getStyle(this.currentItem, "position"),top: T.dom.getStyle(this.currentItem, "top"),left: T.dom.getStyle(this.currentItem, "left")};
            
            if (helper.style.width == '' || o.forceHelperSize)
                T.dom.setStyles(helper, {'wdith': T.dom.getStyle(this.currentItem, 'width')});
            if (helper.style.height == '' || o.forceHelperSize)
                T.dom.setStyles(helper, {'wdith': T.dom.getStyle(this.currentItem, 'width')});
            return helper;
        },
        
        _createPlaceholder: function(that) {
            var self = that || this, o = self.options;
            
            if (!o.placeholder || o.placeholder.constructor == String) {
                var className = o.placeholder;
                o.placeholder = {
                    element: function() {
                        
                        var el = T.dom.create(self.currentItem.nodeName);
                        T.dom.addClass(el, (className || self.currentItem.className + " ui-sortable-placeholder"));
                        T.dom.removeClass(el, "ui-sortable-helper");
                        if (!className)
                            el.style.visibility = "hidden";
                        
                        return el;
                    },
                    update: function(container, p) {

                        // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                        // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                        if (className && !o.forcePlaceholderSize)
                            return;

                        //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                        if (!T.dom.getStyle(p, 'height')) {
                            T.dom.setStyle(p, 'height', (parseInt(T.dom.getStyle(self.currentItem, 'height') || 0, 10) - parseInt(T.dom.getStyle(self.currentItem, 'paddingTop') || 0, 10) - parseInt(T.dom.getStyle(self.currentItem, 'paddingBottom') || 0, 10)));
                        }
                        ;
                        if (!T.dom.getStyle(p, 'width')) {
                            T.dom.setStyle(p, 'width', (parseInt(T.dom.getStyle(self.currentItem, 'width') || 0, 10) - parseInt(T.dom.getStyle(self.currentItem, 'paddingLeft') || 0, 10) - parseInt(T.dom.getStyle(self.currentItem, 'paddingRight') || 0, 10)));
                        }
                        ;
                    }
                };
            }

            //Create the placeholder
            self.placeholder = o.placeholder.element.call(self.container, self.currentItem);

            //Append it after the actual current item
            T.dom.insertAfter(self.placeholder, self.currentItem);

            //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
            o.placeholder.update(self.container, self.placeholder);
        
        },
        
        _cacheHelperProportions: function() {
            this.helperProportions = {
                width: T.dom.getStyle(this.helper, 'width'),
                height: T.dom.getStyle(this.helper, 'height')
            };
        },
        _cacheMargins: function() {
            this.margins = {
                left: (parseInt(T.dom.getStyle(this.currentItem, "marginLeft"), 10) || 0),
                top: (parseInt(T.dom.getStyle(this.currentItem, "marginTop"), 10) || 0)
            };
        },
        _adjustOffsetFromHelper: function(obj) {
            if (typeof obj == 'string') {
                obj = obj.split(' ');
            }
            if (T.lang.isArray(obj)) {
                obj = {left: +obj[0],top: +obj[1] || 0};
            }
            if ('left' in obj) {
                this.offset.click.left = obj.left + this.margins.left;
            }
            if ('right' in obj) {
                this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
            }
            if ('top' in obj) {
                this.offset.click.top = obj.top + this.margins.top;
            }
            if ('bottom' in obj) {
                this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
            }
        },
        _setContainment: function() {
            
            var o = this.options;
            if (o.containment == 'parent')
                o.containment = this.helper.parentNode;
            if (o.containment == 'document' || o.containment == 'window')
                this.containment = [
                    0 - this.offset.relative.left - this.offset.parent.left, 
                    0 - this.offset.relative.top - this.offset.parent.top, 
                    T.dom.getStyle((o.containment == 'document' ? document : window), 'width') - this.helperProportions.width - this.margins.left, 
                    (T.dom.getStyle((o.containment == 'document' ? document : window), 'height') || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
                ];
            
            if (!(/^(document|window|parent)$/).test(o.containment)) {
                var ce = T.dom.g(o.containment);
                var co = T.dom.getPosition(o.containment);
                var over = (T.dom.getStyle(ce, 'overflow') != 'hidden');
                
                this.containment = [
                    co.left + (parseInt(T.dom.getStyle(ce, "borderLeftWidth"), 10) || 0) + (parseInt(T.dom.getStyle(ce, "paddingLeft"), 10) || 0) - this.margins.left, 
                    co.top + (parseInt(T.dom.getStyle(ce, "borderTopWidth"), 10) || 0) + (parseInt(T.dom.getStyle(ce, "paddingTop"), 10) || 0) - this.margins.top, 
                    co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt(T.dom.getStyle(ce, "borderLeftWidth"), 10) || 0) - (parseInt(T.dom.getStyle(ce, "paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, 
                    co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt(T.dom.getStyle(ce, "borderTopWidth"), 10) || 0) - (parseInt(T.dom.getStyle(ce, "paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top
                ];
            }
        
        },
        _removeCurrentsFromItems: function() {
        /*
		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");
		for (var i=0; i < this.items.length; i++) {

			for (var j=0; j < list.length; j++) {
				if(list[j] == this.items[i].item[0])
					this.items.splice(i,1);
			};

		};
		*/
        
        },
        _generatePosition: function(event) {
            
            var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent != document && T.dom.contains(this.scrollParent, this.offsetParent)) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll.tagName);

            // This is another very weird special case that only happens for relative elements:
            // 1. If the css position is relative
            // 2. and the scroll parent is the document or similar to the offset parent
            // we have to refresh the relative offset during the scroll so there are no jumps
            if (this.cssPosition == 'relative' && !(this.scrollParent != document && this.scrollParent != this.offsetParent)) {
                this.offset.relative = this._getRelativeOffset();
            }
            
            var pageX = T.event.getPageX(event);
            var pageY = T.event.getPageY(event);

            /*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */
            
            if (this.originalPosition) { //If we are not dragging yet, we won't check for options
                
                if (this.containment) {
                    if (T.event.getPageX(event) - this.offset.click.left < this.containment)
                        pageX = this.containment + this.offset.click.left;
                    if (T.event.getPageY(event) - this.offset.click.top < this.containment)
                        pageY = this.containment + this.offset.click.top;
                    if (T.event.getPageX(event) - this.offset.click.left > this.containment)
                        pageX = this.containment + this.offset.click.left;
                    if (T.event.getPageY(event) - this.offset.click.top > this.containment)
                        pageY = this.containment + this.offset.click.top;
                }
            /*
			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}
			*/
            }
            
            return {
                top: (
                pageY  // The absolute mouse position
                - this.offset.click.top  // Click offset (relative to the element)
                - this.offset.relative.top  // Only for relative positioned nodes: Relative offset from element to offset parent
                - this.offset.parent.top  // The offsetParent's offset without borders (offset + border)
                + (T.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop : (scrollIsRootNode ? 0 : scroll.scrollTop)))
                ),
                left: (
                pageX  // The absolute mouse position
                - this.offset.click.left  // Click offset (relative to the element)
                - this.offset.relative.left  // Only for relative positioned nodes: Relative offset from element to offset parent
                - this.offset.parent.left  // The offsetParent's offset without borders (offset + border)
                + (T.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft : scrollIsRootNode ? 0 : scroll.scrollLeft))
                )
            };
        
        },
        _convertPositionTo: function(d, pos) {
            
            if (!pos)
                pos = this.position;
            var mod = d == "absolute" ? 1 : -1;
            var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent != document && T.dom.contains(this.scrollParent, this.offsetParent)) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll.tagName);
            
            return {
                top: (
                pos.top  // The absolute mouse position
                + this.offset.relative.top * mod  // Only for relative positioned nodes: Relative offset from element to offset parent
                + this.offset.parent.top * mod  // The offsetParent's offset without borders (offset + border)
                - (T.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop : (scrollIsRootNode ? 0 : scroll.scrollTop)) * mod)
                ),
                left: (
                pos.left  // The absolute mouse position
                + this.offset.relative.left * mod  // Only for relative positioned nodes: Relative offset from element to offset parent
                + this.offset.parent.left * mod  // The offsetParent's offset without borders (offset + border)
                - (T.browser.safari && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft : scrollIsRootNode ? 0 : scroll.scrollLeft) * mod)
                )
            };
        
        },
        _intersectsWithPointer: function(item) {
            
            var isOverElementHeight = (this.options.axis === 'x') || this.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height), 
            isOverElementWidth = (this.options.axis === 'y') || this.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width), 
            isOverElement = isOverElementHeight && isOverElementWidth, 
            verticalDirection = this._getDragVerticalDirection(), 
            horizontalDirection = this._getDragHorizontalDirection();
            
            if (!isOverElement)
                return false;
            
            return this.floating ? 
            (((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1) 
            : (verticalDirection && (verticalDirection == "down" ? 2 : 1));
        
        },
        
        _intersectsWithSides: function(item) {
            
            var isOverBottomHalf = this.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height / 2), item.height), 
            isOverRightHalf = this.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width / 2), item.width), 
            verticalDirection = this._getDragVerticalDirection(), 
            horizontalDirection = this._getDragHorizontalDirection();
            
            if (this.floating && horizontalDirection) {
                return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
            } else {
                return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
            }
        
        },
        _rearrange: function(event, i, a, hardRefresh) {
            a ? a[0].appendChild(this.placeholder[0]) : i.item.parentNode.insertBefore(this.placeholder, (this.direction == 'down' ? i.item : i.item.nextSibling));

            //Various things done here to improve the performance:
            // 1. we create a setTimeout, that calls refreshPositions
            // 2. on the instance, we have a counter variable, that get's higher after every append
            // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
            // 4. this lets only the last addition to the timeout stack through
            this.counter = this.counter ? ++this.counter : 1;
            var self = this, counter = this.counter;
            
            window.setTimeout(function() {
                if (counter == self.counter)
                    self.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
            }, 0);
        
        },
        _contactContainers: function(event) {

            // get innermost container that intersects with item 
            var innermostContainer = null, innermostIndex = null;
            this.containers = [].push(this.container);
            
            for (var i = this.containers.length - 1; i >= 0; i--) {

                // never consider a container that's located within the item itself 
                if (T.dom.contains(this.containers[i], this.currentItem))
                    continue;
                
                if (this._intersectsWith(this.containerCache)) {

                    // if we've already found a container and it's more "inner" than this, then continue 
                    if (innermostContainer && T.dom.contains(innermostContainer, this.containers[i]))
                        continue;
                    
                    innermostContainer = this.containers[i];
                    innermostIndex = i;
                
                } else {
                    // container doesn't intersect. trigger "out" event if necessary 
                    if (this.containerCache.over) {
                        //his.containers[i]._trigger("out", event, this._uiHash(this));
                        this.containers[i].containerCache.over = 0;
                    }
                }
            
            }

            // if no intersecting containers found, return 
            if (!innermostContainer)
                return;

            // move the item into the container if it's not there already
            if (this.containers.length === 1) {
                //this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            } else if (this.currentContainer != this.containers[innermostIndex]) {

                //When entering a new container, we will find the item with the least distance and append our item near it
                var dist = 10000;
                var itemWithLeastDistance = null;
                var base = this.positionAbs[this.floating ? 'left' : 'top'];
                for (var j = this.items.length - 1; j >= 0; j--) {
                    if (!T.dom.contains(this.items[j].dom, this.containers[innermostIndex]))
                        continue;
                    var cur = this.container.floating ? T.dom.getPosition(this.items[j].dom).left : T.dom.getPosition(this.items[j].dom).top;
                    if (Math.abs(cur - base) < dist) {
                        dist = Math.abs(cur - base);
                        itemWithLeastDistance = this.items[j];
                        this.direction = (cur - base > 0) ? 'down' : 'up';
                    }
                }
                
                if (!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
                    return;
                
                this.currentContainer = this.container;
                itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
                //this._trigger("change", event, this._uiHash());
                //this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

                //Update the placeholder
                this.options.placeholder.update(this.currentContainer, this.placeholder);

                //this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                this.containers[innermostIndex].containerCache.over = 1;
            }
        
        
        },
        _getOuterWidth: function(elem) {
            if (!elem) {
                return;
            }
            var width = parseInt(T.dom.getStyle(elem, 'width')) || 0;
            var blw = parseInt(T.dom.getStyle(elem, 'borderLeftWidth')) || 0;
            var brw = parseInt(T.dom.getStyle(elem, 'borderRightWidth')) || 0;
            var pl = parseInt(T.dom.getStyle(elem, 'paddingLeft')) || 0;
            var pr = parseInt(T.dom.getStyle(elem, 'paddingRight')) || 0;
            return (width + blw + brw + pl + pr);
        },
        _getOuterHeight: function(elem) {
            if (!elem) {
                return;
            }
            var height = parseInt(T.dom.getStyle(elem, 'height')) || 0;
            var btw = parseInt(T.dom.getStyle(elem, 'borderTopWidth')) || 0;
            var bbw = parseInt(T.dom.getStyle(elem, 'borderBottomWidth')) || 0;
            var pt = parseInt(T.dom.getStyle(elem, 'paddingTop')) || 0;
            var pb = parseInt(T.dom.getStyle(elem, 'paddingBottom')) || 0;
            return (height + btw + bbw + pt + pb);
        },
        _getDragVerticalDirection: function() {
            var delta = this.positionAbs.top - this.lastPositionAbs.top;
            return delta != 0 && (delta > 0 ? "down" : "up");
        },
        
        _getDragHorizontalDirection: function() {
            var delta = this.positionAbs.left - this.lastPositionAbs.left;
            return delta != 0 && (delta > 0 ? "right" : "left");
        },
        isOverAxis: function(x, reference, size) {
            //Determines when x coordinate is over "b" element axis
            return (x > reference) && (x < (reference + size));
        },
        isOver: function(y, x, top, left, height, width) {
            //Determines when x, y coordinates is over "b" element
            return this.isOverAxis(y, top, height) && this.isOverAxis(x, left, width);
        },
        // These are placeholder methods, to be overriden by extending plugin
        _mouseStop: function(event, noPropagation) {
            
            if (!event)
                return;

            //If we are using droppables, inform the manager about the drop
            /*if ($.ui.ddmanager && !this.options.dropBehaviour)
			$.ui.ddmanager.drop(this, event);
		*/
            if (this.options.revert) {
                var self = this;
                var cur = T.dom.getPosition(self.placeholder);
                
                self.reverting = true;
                T.fx.moveTo(this.helper, [(cur.left - this.offset.parent.left - self.margins.left + (this.offsetParent == document.body ? 0 : this.offsetParent.scrollLeft)), (cur.top - this.offset.parent.top - self.margins.top + (this.offsetParent == document.body ? 0 : this.offsetParent.scrollTop))], {
                    'duration': 100,
                    'onafterfinish': function() {
                        self._clear(event)
                    }
                });
            } else {
                this._clear(event, noPropagation);
            }
            
            return false;
        
        },
        
        cancel: function() {
            
            var self = this;
            
            if (this.dragging) {
                
                this._mouseUp({target: null});
                
                if (this.options.helper == "original") {
                    
                    T.dom.setStyles(this.currentItem, this._storedCSS);
                    T.dom.removeClass(this.currentItem, "ui-sortable-helper");
                } else {
                    T.dom.show(this.currentItem);
                }
                //Post deactivating events to containers
                if (this.containers.containerCache.over) {
                    this.containers[i].containerCache.over = 0;
                }
            
            }
            
            if (this.placeholder) {
                //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                if (this.placeholder.parentNode)
                    this.placeholder.parentNode.removeChild(this.placeholder);
                if (this.options.helper != "original" && this.helper && this.helper.parentNode)
                    this.helper.parentNode.removeChild(this.helper);
                
                T.object.extend(this, {
                    helper: null,
                    dragging: false,
                    reverting: false,
                    _noFinalSort: null
                });
                
                if (this.domPosition.prev) {
                    T.dom.insertAfter(this.currentItem, this.domPosition.prev);
                } else {
                    T.dom.insertBefore(this.currentItem, T.dom.children(this.domPosition.parent)[0]);
                }
            }
            
            return this;
        
        },
        _clear: function(event, noPropagation) {
            
            this.reverting = false;
            // We delay all events that have to be triggered to after the point where the placeholder has been removed and
            // everything else normalized again
            var delayedTriggers = [], self = this;

            // We first have to update the dom position of the actual currentItem
            // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
            if (!this._noFinalSort && this.parents(this.currentItem).length)
                T.dom.insertBefore(this.currentItem, this.placeholder);
            this._noFinalSort = null;
            
            if (this.helper == this.currentItem) {
                for (var i in this._storedCSS) {
                    if (this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static')
                        this._storedCSS[i] = '';
                }
                T.dom.setStyles(this.currentItem, this._storedCSS)
                T.dom.removeClass(this.currentItem, "ui-sortable-helper");
            } else {
                T.dom.show(this.currentItem);
            }
            /*
		if(this.fromOutside && !noPropagation) delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		if((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		if(!$.ui.contains(this.element[0], this.currentItem[0])) { //Node was moved out of the current element
			if(!noPropagation) delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
			for (var i = this.containers.length - 1; i >= 0; i--){
				if($.ui.contains(this.containers[i].element[0], this.currentItem[0]) && !noPropagation) {
					delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
					delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.containers[i]));
				}
			};
		};
		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}
		*/
            //Do what was originally in plugins
            if (this._storedCursor) {
                T.dom.setStyle(document.body, 'cursor', this._storedCursor);
            } //Reset cursor
            if (this._storedOpacity) {
                T.dom.setStyle(this.helper, "opacity", this._storedOpacity);
            }
            if (this._storedZIndex) {
                T.dom.setStyle(this.helper, "zIndex", (this._storedZIndex == 'auto' ? '' : this._storedZIndex)); //Reset z-index
            }
            
            this.dragging = false;
            
            if (!noPropagation) {
                this.options.beforeStop(event);
            }
            this.placeholder.parentNode.removeChild(this.placeholder);
            if (this.helper != this.currentItem) {
                this.helper.parentNode.removeChild(this.helper);
                this.helper = null;
            }
            if (!noPropagation) {
                this.options.stop.call(this, event);
            }
            this.fromOutside = false;
            return true;
        }
    
    
    });
    exports = Sortable;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/lib/tangram/fx/moveTo/moveTo.js']);
F.module('/static/edit/ui/editorManager/editorManager.js', function(require, exports) {
    /*-----[ /static/edit/ui/editorManager/editorManager.js ]-----*/
    /**
 * @fileOverview editorManager.js
 * @author liuyong07@baidu.com
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dataConfSingleton = require("/static/edit/ui/dataConfSingleton/dataConfSingleton.js");
    var log = require("/static/common/ui/log/log.js");
    var video = require("/static/edit/ui/video/video.js");
    var browserInfo = function() {
        var browsername = T.browser.ie ? "ie" : (T.browser.chrome ? "chrome" : T.browser.firefox ? "firefox" : "other"), 
        browserBB = 0;
        switch (browsername) 
        {
            case "ie":
                browserBB = T.browser.ie;
                break;
            case "chrome":
                browserBB = T.browser.chrome;
                break;
            case "firefox":
                browserBB = T.browser.firefox;
                break;
        }
        return [browsername, browserBB];
    };
    
    
    var editorManager = {
        onEditSection: null,
        onEditStep: null,
        onUploadStep: null,
        onEditStepFactory: null,
        createEditor: function(stepInstance, action) {
            /**
		 * @name createEditor
		 * @description 创建编辑器
		 * @param {Sting} action 编辑动作来源
		 */
            var self = this, 
            step = stepInstance, 
            html = step.stepTxtContainer.innerHTML;
            self.isTabEnd = false;
            //如果内容为提示文字，则给编辑器添加空类容
            if (T.string.trim(html) === '' || /edit-item-tip/gi.test(html)) {
                html = dataConfSingleton.getBlankContent();
            }
            step.stepTxtContainer.innerHTML = '';
            //获取编辑器配置项
            //var insertImageBtn = editorOption.toolbars[0][3];
            //编辑器实例化
            var ue = UE.getEditor(step.stepTxtContainer, this.getEditorOption(step, action));
            ue.addListener("beforegetcontent",function(){
                var alist = this.body.getElementsByTagName("a");
                for(var i= 0,a;a=alist[i++];){
                    UE.dom.domUtils.remove(a,true);
                }
            });
            //编辑器中触发tab事件
            ue.addListener("clicktab", function() {
                T.event.preventDefault(arguments[1]);
                if (!self.isScrolling && self.isTabEnd) 
                {
                    var editorBD = T.dom.getAncestorByClass(ue.container, "exp-step-container");
                    if (editorBD) 
                    {
                        var nextDom = T.dom.next(editorBD);
                        if (nextDom && T.dom.hasClass(nextDom, "exp-step-container")) 
                        {
                            T.event.fire(nextDom, "click");
                        } 
                        else 
                        {
                            var btDom = T.dom.next(T.dom.getParent(editorBD));
                            self.editorBody = self.onEditSection.container;
                            //如果存在添加按钮，需要附加click事件
                            if (btDom && T.dom.hasClass(btDom, "add-step-btn-out")) 
                            {
                                //如果有正在编辑的步骤，则关闭	
                                if (self.onEditStep) {
                                    ue.addListener('destroy', function() {
                                        setTimeout(function() {
                                            var a = T.dom.query(".edit-addlinks", btDom)[0];
                                            a.focus();
                                            T.event.fire(a, 'focus');
                                        }, 25);
                                    });
                                    self.onEditStep.offEdit("", "no");
                                }
                                //关闭提示标签
                                var tips = T.q("exp-tooltip");
                                T.array.each(tips, function(item) {
                                    T.hide(item);
                                });
                            } 
                            else 
                            {
                                //如果又正在编辑的步骤，则关闭	
                                if (self.onEditStep) {
                                    self.onEditStep.offEdit();
                                }
                            }
                        }
                    }
                }
            });
            
            var editorLoading = function() {
                debugger
//                ue.removeListener('ready', editorLoading);
                html && ue.setContent(html);
                //光标定位和内容插入
                if (action != 'addSection') {
                    var range = ue.selection.getRange(), 
                    domUtils = UE.dom.domUtils;
                    range.setEndAtLast(ue.body.lastChild).shrinkBoundary();
                    if (domUtils.isEmptyBlock(range.startContainer)) {
                        range.setStart(range.startContainer, 0);
                        range.setCursor(false);
                    } else {
                        range.setCursor(true, true);
                    }
                }

                //gms 延时触发，等待编辑器完成渲染高度。。。
                setTimeout(function() {
                    self.isTabEnd = false;
                    if (self.onEditStep) 
                    {
                        var eDiv = self.onEditStep.getContainer(), 
                        editorH = eDiv.offsetHeight, 
                        editTopH = T.dom.getPosition(eDiv).top, 
                        pageVH = T.page.getViewHeight(), 
                        scrollH = T.page.getScrollTop(), 
                        offsetH = -35;
                        pyH = editorH - pageVH > 0 ? (editorH - pageVH - offsetH) : offsetH;
                        if ((editorH + editTopH) > (pageVH + scrollH) || (scrollH > (editorH + editTopH))) 
                        {
                            self.AnchorScroller(eDiv, 300, pyH);
                        } 
                        else if (editTopH < scrollH) 
                        {
                            self.AnchorScroller(eDiv, 300, offsetH);
                        }
                    }
                    self.isTabEnd = true;
                }, 251);
            };
            
            ue.addListener("ready", editorLoading);

            //重复加载N次，未成功就死吧。。。
            /*var num = 0;
        var editLoading = setInterval(function(){
            if(!ue.body && num < 50)
            {
                self.isTabEnd = true;
                num++;
                return;
            }
            clearInterval(editLoading);
            var br = browserInfo();
            log.send("",1003,{'editloadfail':'1','num':num,'brower_n':br[0],'brower_b':br[1]});
            html&&ue.setContent(html);
            //光标定位和内容插入
			if(action != 'addSection'){
				var range = ue.selection.getRange(),
				domUtils = UE.dom.domUtils;
				range.setEndAtLast(ue.body.lastChild).shrinkBoundary();
				if(domUtils.isEmptyBlock(range.startContainer)){
					range.setStart(range.startContainer,0);
					range.setCursor(false);
				}else{
					range.setCursor(true, true);
				}
			}
            
            //gms 延时触发，等待编辑器完成渲染高度。。。
            setTimeout(function(){
                self.isTabEnd = false;
                if(self.onEditStep)
                {
                    var eDiv = self.onEditStep.getContainer(),
                        editorH = eDiv.offsetHeight,
                        editTopH = T.dom.getPosition(eDiv).top,
                        pageVH = T.page.getViewHeight(),
                        scrollH = T.page.getScrollTop(),
                        offsetH = -35;
                        pyH = editorH - pageVH > 0 ? (editorH - pageVH - offsetH) : offsetH;
                    if((editorH + editTopH) > (pageVH + scrollH) || (scrollH > (editorH + editTopH)))
                    {
                        self.AnchorScroller(eDiv, 300, pyH);
                    }
                    else if(editTopH < scrollH)
                    {
                        self.AnchorScroller(eDiv, 300, offsetH);
                    }
                }
                self.isTabEnd = true;
            },251);
            
        },30);
		*/

            return ue;
        },
        getEditorOption: function(step, action) {
            /**
		 * @name getEditorOption 
		 * @description 获取编辑器配置项 工具原料，注意事项类栏目没有插入图片和插入视频功能
		 * @param {String} type 栏目类型 
		 */
            var editorOption, 
            self = this, 
            type = step.sectionType;
            switch (type) {
                case 'tools':
                    editorOption = {
                        toolbars: [[
                                'bold', 
                                'italic'
                            ]]
                    };
                    break;
                case 'notice':
                    editorOption = {
                        toolbars: [[
                                'bold', 
                                'italic'
                            ]]
                    };
                    break;
                default:
                    editorOption = {
                        toolbars: [[
                                'bold', 
                                'italic', 
                                '|', 
                                /*
						TODO 编辑器工具栏上传图片按钮不能点击
						(function(){
							var ui = new baidu.editor.ui.Button({
								'className':'edui-for-image',
								'title':'插入图片',
								'id':'editor-insert-image',
								'onclick':function(){
								}
							});
							return ui;
						 })(),
						 */
                                (function() {
                                    var ui = new baidu.editor.ui.Button({
                                        'className': 'edui-for-video',
                                        'title': '插入视频',
                                        'id': 'editor-insert-video',
                                        onclick: function() {
                                            video.insertVideo(step.mediaManager);
                                        }
                                    });
                                    return ui;
                                })()
                            ]]
                    };
            }
            if (action != 'addSection') {
                editorOption.focus = true;
            }
            return editorOption;
        },
        clearOnEditInfo: function() {
            this.onEditStep = null;
            this.onEditSection = null;
            this.onEditStepFactory = null;
        },
        saveOnEditInfo: function(step, section, stepFactory) {
            this.onEditStep = step;
            this.onEditSection = section;
            this.onEditStepFactory = stepFactory;
        },
        //锚点跳转
        AnchorScroller: function(el, duration, pyh) 
        {
            var z = this;
            z.el = el;
            z.p = z.getPos(el);
            z.p.y += pyh;
            z.s = z.getScroll();
            z.isScrolling = true;
            z.clear = function() {
                window.clearInterval(z.timer);
                z.timer = null;
                z.isScrolling = false;
            };
            z.t = (new Date).getTime();
            z.step = function() {
                var t = (new Date).getTime();
                var p = (t - z.t) / duration;
                if (t >= duration + z.t) {
                    z.clear();
                    window.setTimeout(function() {
                        z.scroll(z.p.y, z.p.x);
                    }, 10);
                } 
                else {
                    st = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.y - z.s.t) + z.s.t;
                    sl = ((-Math.cos(p * Math.PI) / 2) + 0.5) * (z.p.x - z.s.l) + z.s.l;
                    z.scroll(st, sl);
                }
            };
            z.scroll = function(t, l) {
                window.scrollTo(l, t)
            };
            z.timer = window.setInterval(function() {
                z.step();
            }, 10);
        },
        //获取滚动条信息
        getScroll: function() {
            var t, l, w, h;
            t = T.page.getScrollTop();
            l = T.page.getScrollLeft();
            return {t: t,l: l};
        }

        //获取元素信息
        ,getPos: function(e) 
        {
            var l = 0, t = 0, 
            w = this.intval(e.style.width), 
            h = this.intval(e.style.height), 
            wb = e.offsetWidth, 
            hb = e.offsetHeight;
            while (e.offsetParent) {
                l += e.offsetLeft + (e.currentStyle ? this.intval(e.currentStyle.borderLeftWidth) : 0);
                t += e.offsetTop + (e.currentStyle ? this.intval(e.currentStyle.borderTopWidth) : 0);
                e = e.offsetParent;
            }
            l += e.offsetLeft + (e.currentStyle ? this.intval(e.currentStyle.borderLeftWidth) : 0);
            t += e.offsetTop + (e.currentStyle ? this.intval(e.currentStyle.borderTopWidth) : 0);
            return {x: l,y: t,w: w,h: h,wb: wb,hb: hb};
        }

        //转整形
        ,intval: function(v) 
        {
            v = parseInt(v);
            return isNaN(v) ? 0 : v;
        }
    };
    window.GeditorManager = editorManager;
    exports = editorManager;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/dataConfSingleton/dataConfSingleton.js', '/static/common/ui/log/log.js', '/static/edit/ui/video/video.js']);
F.module('/static/edit/ui/sectionstep/sectionstep.js', function(require, exports) {
    /*-----[ /static/edit/ui/sectionstep/sectionstep.js ]-----*/
    /**
 * @fileOverview editor.sectionstep.js
 * @description 栏目区域下的步骤
 * @author liuyong07@baidu.com
 * @date   2012-07-25
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var MediaManager = require("/static/edit/ui/media/media.js");
    var dataConfSingleton = require("/static/edit/ui/dataConfSingleton/dataConfSingleton.js");
    var Sortable = require("/static/edit/ui/sortable/sortable.js");
    var tipsManager = require("/static/edit/ui/tips/tips.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var editorManager = require("/static/edit/ui/editorManager/editorManager.js");
    var sug = require("/static/common/ui/sug/sug.js");
    
    var BaseStep = T.lang.createClass(function(index, json, orderType, stepNum, stepsContainer, sectionType, datajson) {
        /**
	 * @class BaseStep
	 * @param {Int} index 步骤信息
	 * @param {Object} json 步骤的json 信息
	 * @param {String} orderType 步骤类型
	 *  
	 */
        this.index = index;
        this.json = json;
        this.orderType = orderType;
        this.media = json.media;
        this.stepNum = stepNum;
        this.stepsContainer = stepsContainer;
        this.sectionType = sectionType;
        this.datajson = datajson;
        this.init();
    }).extend({
        init: function() {
            this.render();
        },
        render: function() {
            //创建dom
            this.createStepContainer();
            this.addListClass(this.stepNum);
            this.stepTxtContainer = T.dom.create('div', {
                'class': 'exp-step-text-container'
            });
            this.stepTxtContainer.innerHTML = this.json.text;
            this.removeBtn = T.dom.create('a', {
                'class': 'step-remove-btn',
                'href': 'javascript:;'
            });
            var listicon = T.dom.create('div', {
                'class': 'list-icon'
            });
            T.dom.setAttr(this.removeBtn, "tabIndex", "-1");
            this.stepContainer.appendChild(this.stepTxtContainer);
            this.stepContainer.appendChild(this.removeBtn);
            if (this.sectionType != 'brief') {
                this.stepContainer.appendChild(this.createStepInsertBtn());
            }
            this.stepContainer.appendChild(listicon);
            this.stepContainer.appendChild(this.stepTxtContainer);
            this.stepContainer.appendChild(this.createMedia());
        
        },
        createStepContainer: function() {
            /*
		 * @name createStepContainer
		 * @description 生成步骤容器
		 *
		 */
            this.stepContainer = T.dom.create('div', {
                'class': 'exp-step-container'
            });
            return this.stepContainer;
        },
        createStepInsertBtn: function() {
            this.insertStepBtnContainer = T.dom.create('div', {
                'class': 'step-insert-btn-container'
            });
            this.insertBeforeBtn = T.dom.create('div', {
                'class': 'step-insertbefore-btn',
                'title': '向上插入新步骤'
            });
            this.insertAfterBtn = T.dom.create('div', {
                'class': 'step-insertafter-btn',
                'title': '向下插入新步骤'
            });
            this.insertStepBtnContainer.appendChild(this.insertBeforeBtn);
            this.insertStepBtnContainer.appendChild(this.insertAfterBtn);
            return this.insertStepBtnContainer;
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 获取步骤JSON内容
		 *
		 */
            var self = this, 
            JSON = {
                'attr': self.json.attr,
                'text': self.getTxtContent(),
                'media': []
            };
            //从媒体管理类中拿内容
            JSON.media = self.mediaManager ? self.mediaManager.getJSONContent() : [];
            if (JSON.text == '' && (JSON.media.length === 0)) {
                return null;
            }
            return JSON;
        },
        getTxtContent: function() {
            /**
		 * @name getTxtContent
		 * @description 获取步骤文本内容
		 *
		 */
            var self = this, 
            content;
            //如果该步骤正处于编辑状态下
            if (self.isOnEdit && self.editor) {
                content = self.editor.getContent();
                if (/^<p>((\s*&nbsp;*\s*)|(\s*<br\s*\/?\s*>\s*)|(\s*))<\/p>$/gi.test(content)) {
                    content = '';
                }
            } else {
                content = this.stepTxtContainer.innerHTML;
            }
            content = T.string.trim(content);
            //检查步骤类容是否为提示信息
            if (/edit-item-tip/gi.test(content)) {
                content = '';
            }
            return content;
        },
        attachEvents: function(parent) {
            /**
		 * @name attachEvents 
		 * @description 为步骤ui绑定事件
		 * @param {Object} parent step ui 的父组件stepFactory
		 */
            
            var self = this, 
            json = parent.getStepJsonTemplate();
            //编辑
            T.event.on(this.stepContainer, 'click', function(event) {
                T.event.stopPropagation(event);
                if (self.isOnEdit) {
                    return;
                }
                self.onEdit(parent);
            });
            
            T.event.on(this.stepContainer, 'mouseover', function(event) {
                if (T.dom.hasClass(this, 'exp-step-container-onedit')) {
                    return;
                }
                if (self.insertStepBtnContainer && (self.getTxtContent() != '' || (self.mediaManager && self.mediaManager.medias.length > 0))) {
                    T.dom.addClass(self.insertStepBtnContainer, 'step-insert-btn-container-show');
                }
                T.dom.addClass(this, 'exp-step-container-hover');
            });
            T.event.on(this.stepContainer, 'mouseout', function(event) {
                T.dom.removeClass(this, 'exp-step-container-hover');
                if (self.insertStepBtnContainer) {
                    T.dom.removeClass(self.insertStepBtnContainer, 'step-insert-btn-container-show');
                }
            });
            if (this.insertStepBtnContainer) {
                T.event.on(this.insertBeforeBtn, 'click', function(event) {
                    T.event.stopPropagation(event);
                    var index = self.index;
                    var stepNum = parent.steps.length + 1;
                    var newStep = parent.add(index, json, stepNum, {
                        'signStep': self,
                        'action': 'insertBefore'
                    });
                    //更新整个列表状态
                    parent.updatelist();
                    setTimeout(function() {
                        T.event.fire(newStep.stepContainer, 'click');
                    }, 100);
                });
                T.event.on(this.insertBeforeBtn, 'mouseover', function(event) {
                    T.dom.addClass(this, 'step-insertbefore-btn-hover');
                });
                T.event.on(this.insertBeforeBtn, 'mouseout', function(event) {
                    T.dom.removeClass(this, 'step-insertbefore-btn-hover');
                });
                T.event.on(this.insertAfterBtn, 'click', function(event) {
                    T.event.stopPropagation(event);
                    var index = self.index + 1;
                    var stepNum = parent.steps.length + 1;
                    var newStep = parent.add(index, json, stepNum, {
                        'signStep': self,
                        'action': 'insertAfter'
                    });
                    //更新整个列表状态
                    parent.updatelist();
                    setTimeout(function() {
                        T.event.fire(newStep.stepContainer, 'click');
                    }, 100);
                });
                T.event.on(this.insertAfterBtn, 'mouseover', function(event) {
                    T.dom.addClass(this, 'step-insertafter-btn-hover');
                });
                T.event.on(this.insertAfterBtn, 'mouseout', function(event) {
                    T.dom.removeClass(this, 'step-insertafter-btn-hover');
                });
            }
            T.event.on(this.removeBtn, 'click', function(event) {
                T.event.stopPropagation(event);
                T.event.preventDefault(event);
                var parentDOM = parent.stepsContainer;
                dialog.confirm('提示', {
                    'info': '<div clsss="editor-delete-step">步骤删除之后将无法恢复，确定删除？</div>',
                    'width': 400,
                    'height': 130,
                    onconfirm: function() {
                        setTimeout(function() {
                            parent.remove(self.index - 1);
                            //清理当前实例
                            var editorManager = window.GeditorManager;
                            if (editorManager.onEditStep) {
                                editorManager.onEditStep.offEdit();
                            }
                        }, 200);
                    }
                });
            });
        },
        addMediaSort: function() {
            /**
		 * @name addMediaSort
		 * @description 为图片添加拖拽
		 *
		 */
            var self = this;
            self.sortable = new Sortable({
                container: self.mediaManager.container,
                items: 'step-media',
                placeholder: 'media-sortable-placeholder',
                opacity: 0.6,
                cursor: 'move',
                revert: true,
                start: function() {
                    T.dom.removeClass(this.helper, 'step-media-hover');
                    T.dom.addClass(this.container, 'step-media-container-ondragging');
                },
                stop: function() {
                    T.dom.removeClass(this.container, 'step-media-container-ondragging');
                }
            });
            self.sortable.init();
        },
        removeMediaSort: function() {
        /**
		 * @name removeMediaSort
		 * @description 移除拖拽
		 */
        /*
		if(!this.sortable){
			return;
		}
		this.sortable.destroy();
		this.sortable = null;
		*/
        },
        updateListStatus: function(newIndex, stepNum) {
            /* 
		 * @name updateListStatus
		 * @description 更新步骤信息
		 * @param {Int} newIndex 最新的序号
		 * @param {Int} stepNum 总步骤数
		 *
		 */
            this.removeListClass();
            this.index = newIndex;
            this.stepNum = stepNum;
            this.addListClass(stepNum);
        },
        addListClass: function(stepNum) {
            /**
		 * @name addListClass
		 * @description 更新步骤class名
		 *
		 */
            //获取唯一步骤
            var onlyStep = T.dom.q('list-item-only', this.stepsContainer)[0];
            //如果栏目下仅存一个步骤则移除list-item-only 类名	
            if (onlyStep && (onlyStep != this.stepContainer)) {
                T.dom.removeClass(onlyStep, 'list-item-only');
            }
            T.dom.addClass(this.stepContainer, 'list-item-' + this.index);
            if (stepNum == this.index) {
                T.dom.addClass(this.stepContainer, 'list-item-last');
            }
            //如果仅有一个步骤则添加'list-item-only'标示
            if (T.dom.hasClass(this.stepContainer, 'list-item-1') && 
            T.dom.hasClass(this.stepContainer, 'list-item-last')
            ) {
                T.dom.addClass(this.stepContainer, 'list-item-only');
            }
        },
        removeListClass: function() {
            /**
		 * @name removeListClass
		 * @description 移除对应的类名
		 *
		 */
            T.dom.removeClass(this.stepContainer, 'list-item-' + this.index);
        },
        createMedia: function() {
            /**
		 * @name createMedia
		 * @description 创建媒体
		 *
		 */
            this.mediaManager = new MediaManager(this.media, this.sectionType);
            return this.mediaManager.getContainer();
        },
        getContainer: function() {
            return this.stepContainer;
        },
        onEdit: function(parent) {
            /**
		 * @name onEdit
		 * @description 步骤区域触发编辑操作
		 * @param {Object} event 事件对象
		 * @param {Object} parent stepFactory 对象
		 */
            
            var self = this, 
            stepContainer = self.getContainer(), 
            editorManager = window.GeditorManager, 
            editorframe = window.Geditorframe, 
            sectionContainer = T.dom.getAncestorBy(stepContainer, function(elem) {
                return T.dom.hasClass(elem, 'editor-block-container');
            }), 
            sectionFactory, 
            action = arguments[1],  //激活编辑命令的来源
            sectionInstance;
            //如果有正在编辑的步骤，则关闭	
            if (editorManager.onEditStep) {
                editorManager.onEditStep.offEdit();
            } 
            else {
                self.upEditorBodyState(editorManager.editorBody);
            }
            T.dom.removeClass(self.removeBtn, 'step-remove-btn-hide');
            self.isOnEdit = true;

            //找到步骤所属的栏目对象
            T.array.each(editorframe.getExpSections(), function(item, index) {
                var container = item.getContainer();
                if (container == sectionContainer) {
                    sectionInstance = item;
                    return false;
                }
            });
            tipsManager.handle(sectionInstance);

            //取消添加按钮焦点
            if (sectionInstance.stepFactory.addStepA) 
            {
                T.event.fire(sectionInstance.stepFactory.addStepA, 'blur');
            }

            //创建提示逻辑
            //创建编辑器	
            self.editor = editorManager.createEditor(self, action);
            //创建图片上传组件
            if (!(self.sectionType == 'tools' || self.sectionType == 'notice')) {
                if (!(editorManager.onUploadStep && editorManager.onUploadStep.mediaManager.uploading)) {
                    self.mediaManager.createUploader({
                        'ownerStep': self
                    });
                }
            }
            //创建拖拽
            self.addMediaSort();
            if (sectionInstance.type != 'brief' && !sectionInstance.stepFactory.addStepBtn) {
                sectionInstance.contentContainer.appendChild(
                sectionInstance.stepFactory.createAddStepBtn()
                );
            }

            //保存被编辑的信息
            editorManager.saveOnEditInfo(self, sectionInstance, parent);
            T.dom.removeClass(sectionContainer, 'editor-block-container-hover');
            T.dom.addClass(sectionContainer, 'editor-block-container-onedit');
            T.dom.addClass(self.stepContainer, 'exp-step-container-onedit');
            T.dom.removeClass(self.removeBtn, 'step-remove-btn-hide');
            //去除mouseover 展示插入步骤的按钮
            if (self.insertStepBtnContainer) {
                T.dom.removeClass(self.insertStepBtnContainer, 'step-insert-btn-container-show');
            }
        },
        offEdit: function(event, changeEditState) {
            /**
		 * @name offEdit
		 * @description 撤销步骤的编辑
		 * @param {Object} 事件对象
		 */
            var self = this, 
            editorframe = window.Geditorframe, 
            editorManager = window.GeditorManager;
            if (!editorManager.onEditStep) {
                return;
            }
            var sectionInstance = editorManager.onEditSection, 
            sectionContainer = sectionInstance.getContainer();
            if (!changeEditState) 
            {
                T.dom.removeClass(sectionContainer, 'editor-block-container-onedit');
            }
            T.dom.removeClass(self.getContainer(), 'exp-step-container-onedit');
            T.dom.addClass(self.removeBtn, 'step-remove-btn-hide');
            self.isOnEdit = false;
            //去掉所属栏目区域添加步骤按钮
            if (sectionInstance.stepFactory.addStepBtn && sectionInstance.type != 'common') {
            //sectionInstance.stepFactory.removeAddStepBtn();
            }
            //清空上传图片的flash
            if (!(self.mediaManager && self.mediaManager.uploading)) {
                self.mediaManager.addImageBtn.innerHTML = '';
            }
            self.updateText();
            self.destroyEditor();
            self.removeMediaSort();
            editorManager.clearOnEditInfo();

            //附加点击图片层触发激活编辑器
            var partentObj = T.dom.getParent(self.mediaManager.container);
            if (partentObj) 
            {
                T.on(self.mediaManager.container, "click", function() {
                    T.event.fire(partentObj, "click");
                });
            }
        },
        updateText: function() {

            /**
		 * @name updateText
		 * @description 更新文本内容
		 *
		 */
            if (!this.editor) {
                return;
            }
            var content = this.editor.getContent();
            content = T.string.trim(content);
            //如果内容为空则返回模板(提示内容)
            if (/^<p>((\s*&nbsp;*\s*)|(\s*<br\s*\/?\s*>\s*)|(\s*))<\/p>$/gi.test(content)) {
                content = '';
            }
            //如果文本内容为空，且没有图片则插入提示语
            if (content == '') {
                content = dataConfSingleton.getSectionJsonTemplate(this.sectionType).items[0].text;
            }
            this.stepTxtContainer.innerHTML = content;
        },
        destroyEditor: function() {

            /**
		 * @name destoryEditor
		 * @description 销毁编辑器更新内容
		 *
		 */
            if (!this.editor) {
                return;
            }
            this.editor.destroy();
            this.editor = null;
        },
        // 移除外边框样式
        upEditorBodyState: function(obj) {
            if (obj) 
            {
                T.dom.removeClass(obj, "editor-block-container-onedit");
            }
        }
    });
    var ListStep = T.lang.createClass(function(index, json, orderType) {
    /*
	 * @class ListStep
	 * @surperclass BaseStep
	 */
    }, {superClass: BaseStep}).extend({
        createStepContainer: function() {
            this.stepContainer = T.dom.create('div', {
                'class': 'exp-step-container'
            });
            return this.stepContainer;
        }
    });
    /*
 * @class 创建食材原料类
 * @author gms 2012.11.15   
 */
    var foodSetp = T.lang.createClass(function(index, json, stepsContainer, sectionType) {
    }, {superClass: BaseStep}).extend({
        init: function() {
            this.render();
        },
        render: function() {
            //创建dom
            this.createStepContainer();
            this.stepTxtContainer = T.dom.create('div', {
                'class': 'exp-step-text-container'
            });

            //主料,辅料 数据处理&&未编辑状态的HTML渲染
            var data = this.datajson.options ? this.datajson.options[0] : null;
            var mainFoodHtml = this.getFoodDataHtml(data ? data.main : [], "main", "主料", 4)[0], 
            otherFoodHtml = this.getFoodDataHtml(data ? data.other : [], "other", "辅料", 4)[0];
            this.stepTxtContainer.innerHTML = '<div id="food_no_edit">' + mainFoodHtml + otherFoodHtml + '</div>';

            //主料,辅料编辑状态的HTML渲染
            var mainFoodHtml_Edit = this.getFoodDataHtml(data ? data.main : [], "main", "主料", 4)[1], 
            otherFoodHtml_Edit = this.getFoodDataHtml(data ? data.other : [], "other", "辅料", 4)[1];
            this.stepTxtContainer.innerHTML += '<div id="food_edit" style="display:none;">' + mainFoodHtml_Edit + otherFoodHtml_Edit + '</div>';
            this.stepContainer.appendChild(this.stepTxtContainer);
        },
        createStepContainer: function() {
            this.stepContainer = T.dom.create('div', {
                'class': 'exp-step-container-food'
            });
            return this.stepContainer;
        },
        attachEvents: function(parent) {
            var self = this, 
            json = parent.getStepJsonTemplate();
            //编辑
            T.event.on(this.stepContainer, 'click', function(event) {
                //T.event.stopPropagation(event);
                if (self.isOnEdit) {
                    return;
                }
                self.onEdit(parent);
            });

            //外框样式切换
            T.event.on(this.stepContainer, 'mouseover', function(event) {
                if (T.dom.hasClass(this, 'exp-step-container-onedit-food')) {
                    return;
                }
                T.dom.addClass(this, 'exp-step-container-hover');
            });
            T.event.on(this.stepContainer, 'mouseout', function(event) {
                T.dom.removeClass(this, 'exp-step-container-hover');
            });
            
            var noeditDivLS = T.q('f_noedit_div', parent.stepsContainer);
            var editDivLS = T.q('f_edit_div', parent.stepsContainer);
            //input框上的提示层隐藏
            self.clewDivHide(editDivLS);

            //编辑状态下删除input
            self.delInput(editDivLS);

            //点击对应的未编辑状态的span切换到对应的input
            self.clickSpanGoInput(noeditDivLS);

            //绑定添加input事件
            var addBtLS = [{"bt": T.dom.query("#addfood_main", parent.stepsContainer)[0],"type": "main"}, {"bt": T.dom.query("#addfood_other", parent.stepsContainer)[0],"type": "other"}];
            T.array.each(addBtLS, function(item, index) {
                T.on(item.bt, "click", function(event) {
                    var newObj = self.insertInputHtml(item, T.q('f_' + item.type, T.g("food_edit")));
                    self.clewDivHide(newObj);
                    self.delInput(newObj);
                    //附加 sug 框
                    T.object.each(newObj, function(item, index) {
                        var inputObj = T.dom.query('input', item);
                        T.array.each(inputObj, function(input, index) {
                            if (T.dom.hasClass(input, "f_edit_input_name")) 
                            {
                                sug.init(input, "getFoodSug", true);
                            }
                        });
                    });
                    T.event.stopPropagation(event);
                    T.event.preventDefault(event);
                })
            });
        },
        onEdit: function(parent) {
            var self = this, 
            stepContainer = self.getContainer(), 
            editorManager = window.GeditorManager, 
            editorframe = window.Geditorframe, 
            sectionContainer = T.dom.getAncestorBy(stepContainer, function(elem) {
                return T.dom.hasClass(elem, 'editor-block-container');
            }), 
            sectionFactory, 
            action = arguments[1],  //激活编辑命令的来源
            sectionInstance;
            //如果又正在编辑的步骤，则关闭	
            if (editorManager.onEditStep) {
                editorManager.onEditStep.offEdit();
            } 
            else {
                self.upEditorBodyState(editorManager.editorBody);
            }
            self.isOnEdit = true;
            //找到步骤所属的栏目对象
            T.array.each(editorframe.getExpSections(), function(item, index) {
                var container = item.getContainer();
                if (container == sectionContainer) {
                    sectionInstance = item;
                    return false;
                }
            });
            tipsManager.handle(sectionInstance);

            //保存被编辑的信息
            editorManager.saveOnEditInfo(self, sectionInstance, parent);
            T.dom.removeClass(sectionContainer, 'editor-block-container-hover');
            T.dom.addClass(sectionContainer, 'editor-block-container-onedit');
            T.dom.addClass(self.stepContainer, 'exp-step-container-onedit-food');

            //切换到编辑input
            var food_no_edit = T.g("food_no_edit"), 
            food_edit = T.g("food_edit");
            if (food_no_edit && food_edit) 
            {
                T.fx.fadeOut(food_no_edit, {
                    "duration": 50,
                    "onbeforestart": function() {
                    },
                    "onafterfinish": function() {
                        T.fx.fadeIn(food_edit, {
                            "onafterfinish": function() {
                                //重新绑定点击span触发到对应的input事件
                                var spanDivLS = T.q('f_noedit_div', food_no_edit);
                                self.clickSpanGoInput(spanDivLS);
                            }
                        });
                    }
                });
            }
        },
        offEdit: function(event) {
            /**
		 * @name offEdit
		 * @description 撤销步骤的编辑
		 * @param {Object} 事件对象
		 */
            var self = this, 
            editorframe = window.Geditorframe, 
            editorManager = window.GeditorManager;
            if (!editorManager.onEditStep) {
                return;
            }
            var sectionInstance = editorManager.onEditSection, 
            sectionContainer = sectionInstance.getContainer();
            T.dom.removeClass(self.getContainer(), 'exp-step-container-onedit-food');
            T.dom.removeClass(sectionContainer, 'editor-block-container-onedit');
            self.isOnEdit = false;
            
            self.updateText();
            editorManager.clearOnEditInfo();

            //切换2个div 状态显示
            var food_no_edit = T.g("food_no_edit"), 
            food_edit = T.g("food_edit");
            if (food_no_edit && food_edit) 
            {
                //拼装no_edit
                var rtnLs = self.showNo_EditFoodDiv(food_edit);
                food_no_edit.innerHTML = rtnLs[0][0] + rtnLs[1][0];
                //T.show(food_no_edit);
                //T.hide(food_edit);
                T.fx.fadeOut(food_edit, {
                    "duration": 50,
                    "onbeforestart": function() {
                    },
                    "onafterfinish": function() {
                        T.fx.fadeIn(food_no_edit, {
                            "onafterfinish": function() {
                                //重新绑定点击span触发到对应的input事件
                                var spanDivLS = T.q('f_noedit_div', food_no_edit);
                                self.clickSpanGoInput(spanDivLS);
                            }
                        });
                    }
                });
            }
        },
        updateText: function() {

            /**
		 * @name updateText
		 * @description 更新文本内容
		 *
		 */
            if (!this.editor) {
                return;
            }
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 获取步骤JSON内容
		 *
		 */
            var self = this, 
            JSON = {
                'attr': self.json.attr,
                'text': self.json.text,
                'media': self.json.media || [],
                'model': '1',
                'showPrewHtml': ''
            };
            var ph = this.showNo_EditFoodDiv(T.g("food_edit"));
            if (ph.length > 0) 
            {
                JSON.showPrewHtml = ph[0][2] + ph[1][2];
            }
            if (JSON.showPrewHtml == '' && (JSON.media.length === 0)) {
                return null;
            }
            return JSON;
        },
        //获取食材区HTML
        getFoodDataHtml: function(data, type, name, num, index_arr) {
            //根据 主料数据是否存在 展示不同效果
            var foodHtml_noEdit = '<div class="food-tool-' + type + ' clearfix"><span class="food-tool-title">' + name + '</span>', 
            foodHtml_Edit = '<div class="food-tool-' + type + ' pl27 clearfix"><span class="food-tool-title">' + name + '</span>', 
            prewHtml = "", 
            num = num || 4, 
            index_arr = index_arr || [];
            //主料数据处理
            if (data.length > 0) 
            {
                for (var i = 0; i < data.length; i++) {
                    var cnTmp = (i % 2 == 0) ? "food-tool-left" : "food-tool-right", 
                    index = data[i].index ? data[i].index : i;
                    
                    foodHtml_noEdit += '<div class="' + cnTmp + ' f_noedit_div"><span rel="' + type + '_name_' + index + '">' + data[i].name + '</span><span rel="' + type + '_dw_' + index + '" class="food-tool-dw">' + data[i].content + '</span></div>';
                    foodHtml_Edit += '<div class="' + cnTmp + ' f_edit_div f_' + type + '"><input maxlength="8" class="f_edit_input_name" value="' + data[i].name + '" rel="' + type + '_name_' + index + '"/><input maxlength="6" class="f_edit_input_dw" value="' + data[i].content + '" rel="' + type + '_dw_' + index + '" /><span></span></div>';
                }
                ;
                prewHtml = foodHtml_noEdit + '</div>';
            } 
            else 
            {
                if (index_arr.length == 0) 
                {
                    for (var i = 0; i < num; i++) {
                        var cnTmp = (i % 2 == 0) ? "food-tool-left" : "food-tool-right", 
                        index = i;
                        foodHtml_noEdit += '<div class="' + cnTmp + ' f_noedit_div finput"><span class="food-tool-name" rel="' + type + '_name_' + index + '">输入食材名称</span><span class="food-tool-dw" rel="' + type + '_dw_' + index + '">份量</span></div>';
                        foodHtml_Edit += '<div class="' + cnTmp + ' f_edit_div f_' + type + '"><div class="food-tool-clew">请输入食材名称</div><input maxlength="8" class="f_edit_input_name" rel="' + type + '_name_' + index + '" /><div class="food-tool-clew dw">份量</div><input maxlength="6" rel="' + type + '_dw_' + index + '" class="f_edit_input_dw" /><span></span></div>';
                    
                    }
                    ;
                } 
                else 
                {
                    var iArr = type == "main" ? index_arr[0] : index_arr[1];
                    for (var i = 0; i < num; i++) {
                        var cnTmp = (i % 2 == 0) ? "food-tool-left" : "food-tool-right", 
                        index = i;
                        if (iArr.length > i) 
                        {
                            index = iArr[i];
                        } 
                        else 
                        {
                            index = iArr[iArr.length - 1] + 1;
                        }
                        foodHtml_noEdit += '<div class="' + cnTmp + ' f_noedit_div finput"><span class="food-tool-name" rel="' + type + '_name_' + index + '">输入食材名称</span><span class="food-tool-dw" rel="' + type + '_dw_' + index + '">份量</span></div>';
                        foodHtml_Edit += '<div class="' + cnTmp + ' f_edit_div f_' + type + '"><div class="food-tool-clew">请输入食材名称</div><input maxlength="8" class="f_edit_input_name" rel="' + type + '_name_' + index + '" /><div class="food-tool-clew dw">份量</div><input maxlength="6" rel="' + type + '_dw_' + index + '" class="f_edit_input_dw" /><span></span></div>';
                    }
                    ;
                }
            }
            foodHtml_noEdit += '</div>';
            foodHtml_Edit += '</div><div class="food-tool-add"><a id="addfood_' + type + '" href="javascript:;" class="food-add-btn"><span class="add-step-btn-icon">＋</span><span class="add-step-btn-text">添加</span></a></div>';
            return [foodHtml_noEdit, foodHtml_Edit, prewHtml];
        },
        //插入食材区编辑状态input
        insertInputHtml: function(item, nowLS) {
            var rtnNewObj = [], 
            parObj = T.q('food-tool-' + item.type, T.g("food_edit"))[0];
            //需要判断是否存在隐藏删除input按钮的控件，进行恢复
            if (nowLS.length == 1) 
            {
                T.show(T.dom.query('span', nowLS[0])[0]);
            }
            var num = nowLS.length % 2 == 0 ? 2 : 1;
            //获取当前已有index，目前无换位排序，只取值最后一个dom
            var lsObj = T.dom.last(parObj), 
            iupls = T.q('f_edit_input_name', lsObj);
            var rel = iupls.length ? T.dom.getAttr(iupls[0], "rel") : "", 
            cutNum = item.type == "main" ? 10 : 11, 
            index = rel ? parseInt(rel.substring(cutNum)) + 1 : 1000;
            
            for (var i = 0; i < num; i++) {
                var foodHtml_Edit = T.dom.create('div', {
                    'class': 'food-tool-left f_edit_div f_' + item.type
                });
                foodHtml_Edit.innerHTML = '<div class="food-tool-clew">请输入食材名称</div><input maxlength="8" class="f_edit_input_name" rel="' + item.type + '_name_' + (index + i) + '" /><div class="food-tool-clew dw">份量</div><input maxlength="6" class="f_edit_input_dw" rel="' + item.type + '_dw_' + (index + i) + '" /><span></span>';
                
                parObj.appendChild(foodHtml_Edit);
                T.fx.fadeIn(foodHtml_Edit);
                rtnNewObj.push(foodHtml_Edit);
            }
            ;
            return rtnNewObj;
        },
        //input框上的提示层隐藏
        clewDivHide: function(objDiv) {
            T.object.each(objDiv, function(item, index) {
                var inputObj = T.dom.query('input', item), 
                clewObj = T.q('food-tool-clew', item);
                T.array.each(inputObj, function(input, index) {
                    var prevObj = T.dom.prev(input);
                    if (prevObj && T.dom.hasClass(prevObj, "food-tool-clew")) 
                    {
                        T.on(input, "focus", function() {
                            T.hide(prevObj);
                        });
                    }
                });
                T.array.each(clewObj, function(clew, index) {
                    T.on(clew, "click", function() {
                        T.dom.next(clew).focus();
                        T.hide(clew);
                    });
                });
            });
        },
        //点击span去对应的input
        clickSpanGoInput: function(objDiv) {
            var me = this;
            T.object.each(objDiv, function(item, index) {
                var spanObj = T.dom.query('span', item);
                T.array.each(spanObj, function(span) {
                    T.on(span, "click", function() {
                        var rel = T.dom.getAttr(span, "rel");
                        if (rel) 
                        {
                            var inputLs = T.dom.query('input', T.g("food_edit")), 
                            flag = true;
                            for (var i = 0; i < inputLs.length; i++) {
                                var irel = T.dom.getAttr(inputLs[i], "rel");
                                if (irel == rel) 
                                {
                                    me.setInputFocus(inputLs[i]);
                                    flag = false;
                                    break;
                                }
                            }
                            ;
                            if (flag) 
                            {
                                //未能找到，则默认第一个为焦点
                                if (rel.indexOf("main") > -1) 
                                {
                                    me.setInputFocus(inputLs[0]);
                                } 
                                else 
                                {
                                    var otherDiv = T.dom.query('.food-tool-other', T.g("food_edit"))[0];
                                    me.setInputFocus(T.dom.query('input', otherDiv)[0]);
                                }
                            }
                        }
                    })
                });
            });
        },
        //编辑状态下删除input
        delInput: function(objDiv) {
            T.object.each(objDiv, function(item, index) {
                var delBT = T.dom.query('span', item)[0];
                if (delBT) 
                {
                    //注册下3态
                    T.on(delBT, "mouseover", function() {
                        T.dom.addClass(delBT, "fspan-mo");
                    });
                    T.on(delBT, "mouseout", function() {
                        T.dom.removeClass(delBT, "fspan-mo");
                    });
                    T.on(delBT, "click", function() {
                        T.dom.addClass(delBT, "fspan-click");
                        var partent = T.dom.getParent(item);
                        T.fx.fadeOut(item, {
                            "onbeforestart": function() {
                                T.hide(delBT);
                            },
                            "onafterfinish": function() {
                                T.dom.remove(item);
                                //判断是否只剩下一个item,一个去掉删除icon
                                var inputDivLS = T.q('f_edit_div', partent)
                                if (inputDivLS.length == 1) 
                                {
                                    T.hide(T.dom.query('span', inputDivLS[0])[0]);
                                }
                            }
                        });
                    });
                }
            });
        },
        //拼装no_edit
        showNo_EditFoodDiv: function(food_edit) {
            var mainData = [], 
            otherData = [], 
            indexMainLs = [], 
            indexOtherLs = [], 
            main_Div = T.dom.query('.food-tool-main', food_edit)[0], 
            main_nameLS = T.dom.query('.f_edit_input_name', main_Div), 
            main_contLS = T.dom.query('.f_edit_input_dw', main_Div)
            other_Div = T.dom.query('.food-tool-other', food_edit)[0], 
            other_nameLS = T.dom.query('.f_edit_input_name', other_Div), 
            other_contLS = T.dom.query('.f_edit_input_dw', other_Div);
            for (var i = 0; i < main_nameLS.length; i++) {
                var tmpjson = {}, 
                rel = T.dom.getAttr(main_nameLS[i], "rel"), 
                index = rel ? parseInt(rel.substring(10)) : 1000;
                tmpjson.name = main_nameLS[i].value;
                tmpjson.index = index;
                indexMainLs.push(index);
                try {
                    tmpjson.content = main_contLS[i].value;
                } 
                catch (e) {
                    tmpjson.content = "";
                }
                if (tmpjson.name != "" || tmpjson.content != "") 
                {
                    mainData.push(tmpjson);
                }
            }
            ;
            for (var i = 0; i < other_nameLS.length; i++) {
                var tmpjson = {}, 
                rel = T.dom.getAttr(other_nameLS[i], "rel"), 
                index = rel ? parseInt(rel.substring(11)) : 1000;
                tmpjson.name = other_nameLS[i].value;
                tmpjson.index = index;
                indexOtherLs.push(index);
                try {
                    tmpjson.content = other_contLS[i].value;
                } 
                catch (e) {
                    tmpjson.content = "";
                }
                if (tmpjson.name != "" || tmpjson.content != "") 
                {
                    otherData.push(tmpjson);
                }
            }
            ;
            var mainStr = this.getFoodDataHtml(mainData, "main", "主料", 4, [indexMainLs, indexOtherLs]), 
            otherStr = this.getFoodDataHtml(otherData, "other", "辅料", 4, [indexMainLs, indexOtherLs]);
            //T.g("food_no_edit").innerHTML = mainStr[0] + otherStr[0];

            //返回预览展示部分
            //0:主料HTML，1:辅料HTML，2:主料数据，3:辅料数据
            return [mainStr, otherStr, mainData, otherData];
        },
        //input绑定焦点事件
        setInputFocus: function(obj) {
            if (obj) 
            {
                var prevObj = T.dom.prev(obj);
                if (prevObj && T.dom.hasClass(prevObj, "food-tool-clew")) 
                {
                    T.hide(prevObj);
                }
                setTimeout(function() {
                    obj.focus();
                }, 200);
            }
        },
        //获取json数据串
        getFoodJSON: function() {
            var self = this, 
            foodStr = {"main": [],"other": []}, 
            data = this.showNo_EditFoodDiv(T.g("food_edit"));
            for (var i = 0; i < data[2].length; i++) {
                var con = {"name": "","content": ""};
                con.name = data[2][i].name;
                con.content = data[2][i].content;
                foodStr.main.push(con);
            }
            ;
            for (var i = 0; i < data[3].length; i++) {
                var con = {"name": "","content": ""};
                con.name = data[3][i].name;
                con.content = data[3][i].content;
                foodStr.other.push(con);
            }
            ;
            return foodStr;
        }
    });
    var StepFactory = T.lang.createClass(function(obj, orderType, index) {
        /**
	 * @class StepFactory 
	 * @description 步骤管理类
	 * @param {Object} obj 栏目JSON内容
	 * @param {String} 栏目列表类型
	 * @param {Int} 栏目序号
	 */
        this.stepsJson = obj.items;
        this.orderType = orderType;
        this.sectionType = obj.type;
        this.steps = [];
        this.index = index;
        this.datajson = obj;
        this.render();
    }).extend({
        getStepClass: function(index, json, oType, stepNum, stepsContainer, sectionType) {
            var stepClass;
            //工具原料中切分出食材模板渲染
            var dataModel = F.context("isFood");
            if (sectionType == "tools" && dataModel == "1") 
            {
                stepClass = foodSetp;
            } 
            else 
            {
                //根据不同的orderType 值来获取不同的步骤类
                switch (this.orderType) {
                    case 'orderlist':
                        stepClass = ListStep;
                        break;
                    case 'unorderlist':
                        stepClass = ListStep;
                        break;
                    default:
                        stepClass = BaseStep;
                }
            }
            return new stepClass(index, json, oType, stepNum, stepsContainer, sectionType, this.datajson);
        },
        render: function() {
            /**
		 * @name render
		 * @description 渲染步骤
		 *
		 */
            var self = this;
            self.stepsContainer = self.createStepsContainer(self.orderType);
            var stepNum = self.stepsJson.length;
            //gms add 增加判断如果是food&&tools类，只渲染一次
            if (F.context("isFood") == "1" && self.sectionType == "tools") 
            {
                self.add(1, self.stepsJson[0], 1);
            } 
            else 
            {
                T.array.each(self.stepsJson, function(item, index) {
                    var order = index + 1;
                    self.add(order, item, stepNum);
                });
            }
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent 
		 * @description 获取步骤的JSON类容
		 *
		 */
            var JSON = [], 
            self = this, 
            steps = self.steps;
            for (var i = 0, len = steps.length; i < len; i++) {
                var obj = steps[i].getJSONContent();
                obj && JSON.push(obj);
            }
            return JSON;
        },
        getTxtContent: function() {
            /**
		 * @name getTxtContent
		 * @description 获取所有步骤的文本类容
		 *
		 */
            var self = this, 
            content = [];
            T.array.each(self.steps, function(step, index) {
                content.push(step.getTxtContent());
            });
            return content.join('');
        },
        createStepsContainer: function(orderType) {
            var stepsContainer = T.dom.create('div', {
                'class': 'exp-content-' + orderType
            });
            return stepsContainer;
        },
        remove: function(index) {
            /**
		 * @name remove
		 * @description 移除步骤
		 * @param {Index} 需要移除的步骤的序号
		 *
		 */
            this.stepsContainer.removeChild(this.steps[index].getContainer());
            var removed = this.steps.splice(index, 1);
            removed = removed[0];
            var editorManager = window.GeditorManager;
            if (removed == editorManager.onUploadStep) {
                editorManager.onUploadStep = null;
                if (editorManager.onEditStep && editorManager.onEditStep.mediaManager) {
                    editorManager.onEditStep.mediaManager.createUploader({
                        'ownerStep': editorManager.onEditStep
                    });
                }
            
            }
            this.updatelist();
        },
        add: function(index, json, stepNum, options) {
            /**
		 * @name add
		 * @description 添加步骤
		 * @param {Index} index 步骤序号 这里的序号是从1开始计数
		 * @param {Object} json 步骤json类容
		 * @param {Int}    stepNum 总步骤数  
		 */
            var self = this;
            //var Step = self.getStepClass();
            var stepInstance = self.getStepClass(index, json, self.orderType, stepNum, self.stepsContainer, self.sectionType);
            //self.steps.push(stepInstance);
            self.steps.splice((index - 1), 0, stepInstance);
            if (options) {
                var signElement = options.signStep.getContainer();
                switch (options.action) {
                    case 'insertBefore':
                        T.dom.insertBefore(stepInstance.getContainer(), signElement);
                        break;
                    case 'insertAfter':
                        T.dom.insertAfter(stepInstance.getContainer(), signElement);
                        break;
                }
            } else {
                self.stepsContainer.appendChild(stepInstance.getContainer());
            }
            stepInstance.attachEvents(self);
            return stepInstance;
        },
        updatelist: function() {
            /**
		 * @name updatelist
		 * @description 更新list 
		 */
            var stepNum = this.steps.length;
            var prevLast = T.dom.q('list-item-last', this.stepsContainer)[0];
            if (prevLast) {
                T.dom.removeClass(prevLast, 'list-item-last');
            }
            T.array.each(this.steps, function(item, index) {
                index = index + 1;
                item.updateListStatus(index, stepNum);
            });
        },
        getContainer: function() {
            return this.stepsContainer;
        },
        createAddStepBtn: function() {
            /**
		 * @name createAddStepBtn
		 * @description 创建添加步骤按钮
		 *
		 */
            var self = this, 
            stepBtnHTML;
            switch (self.sectionType) {
                case 'tools':
                    stepBtnHTML = '<div class="add-step-btn-inner"><a class="edit-addlinks" href="javascript:;"><span class="add-step-btn-icon">＋</span><span class="add-step-btn-text">添加工具/原料</span></a></div>';
                    break;
                case 'notice':
                    stepBtnHTML = '<a class="edit-addlinks" href="javascript:;"><span class="add-step-btn-icon">＋</span><span class="add-step-btn-text">添加注意事项</span></a></div></div>';
                    break;
                default:
                    stepBtnHTML = '<div class="add-step-btn-inner"><a class="edit-addlinks" href="javascript:;"><span class="add-step-btn-icon">＋</span><span class="add-step-btn-text">添加方法/步骤</span></a></div>';
            }
            self.addStepBtnOut = T.dom.create('div', {
                'class': 'add-step-btn'
            });
            self.addStepBtn = T.dom.create('div', {
                'class': 'add-step-btn-out'
            });
            self.addStepBtn.appendChild(self.addStepBtnOut);
            self.addStepBtnOut.innerHTML = stepBtnHTML;
            self.addStepA = T.dom.query(".edit-addlinks", self.addStepBtnOut)[0];
            T.on(self.addStepA, "focus", function() {
                T.dom.addClass(self.addStepA, "edit-btn-focuseditor");
            });
            T.on(self.addStepA, "blur", function() {
                T.dom.removeClass(self.addStepA, "edit-btn-focuseditor");
            });
            var json = self.getStepJsonTemplate();
            self._stepBtnClick = function(event) {
                event = event || window.event;
                T.event.preventDefault(event);
                var index = self.steps.length + 1;
                var prevLast = T.dom.q('list-item-last', self.stepsContainer)[0];
                if (prevLast) {
                    T.dom.removeClass(prevLast, 'list-item-last');
                }
                var stepInstance = self.add(index, json, index);
                setTimeout(function() {
                    T.event.fire(stepInstance.stepContainer, 'click');
                }, 100);
            };
            self._stepBtnMouseover = function(event) {
                T.dom.addClass(this, 'add-step-btn-hover');
            };
            self._stepBtnMouseout = function(event) {
                T.event.stopPropagation(event);
                T.dom.removeClass(this, 'add-step-btn-hover');
            };
            self._stepBtnMousedown = function(event) {
                T.dom.addClass(this, 'add-step-btn-active');
            };
            self._stepBtnMouseup = function(event) {
                T.dom.removeClass(this, 'add-step-btn-active');
            };
            self._stepBtnKeydown = function(event) {
                var codeKey = T.event.getKeyCode(event);
                if (codeKey == 9) 
                {
                    T.event.stopPropagation(event);
                    T.event.preventDefault(event);
                    var editorLS = self.steps;
                    if (editorLS.length > 0) 
                    {
                        T.event.fire(editorLS[0].stepContainer, 'click');
                    }
                }
            };
            self.addStepBtnOut.onclick = function(e) {
                self._stepBtnClick(e);
            };
            T.event.on(self.addStepBtnOut, 'mouseover', self._stepBtnMouseover);
            T.event.on(self.addStepBtnOut, 'mouseout', self._stepBtnMouseout);
            T.event.on(self.addStepBtnOut, 'mousedown', self._stepBtnMousedown);
            T.event.on(self.addStepBtnOut, 'mouseup', self._stepBtnMouseup);
            T.event.on(self.addStepBtnOut, 'keydown', self._stepBtnKeydown);
            return self.addStepBtn;
        },
        removeAddStepBtn: function() {
            /**
		 * @name removeAddStepBtn 
		 * @description 移除添加步骤按钮
		 *
		 */
            var self = this, 
            parent = T.dom.getParent(self.addStepBtn);
            if (!parent) {
                return;
            }
            T.event.un(self.addStepBtn, 'click', self._stepBtnClick);
            T.event.un(self.addStepBtn, 'mouseover', self._stepBtnMouseover);
            T.event.un(self.addStepBtn, 'mouseout', self._stepBtnMouseout);
            T.event.un(self.addStepBtn, 'mousedown', self._stepBtnMousedown);
            T.event.un(self.addStepBtn, 'mouseup', self._stepBtnMouseup);
            T.event.un(self.addStepBtn, 'keydown', self._stepBtnKeydown);
            parent.removeChild(self.addStepBtn);
            self.addStepBtn = null;
        },
        getStepJsonTemplate: function() {
            /**
		 * @name getStepJsonTemplate
		 * @description 获取步骤模板
		 *
		 */
            return dataConfSingleton.getSectionJsonTemplate(this.sectionType).items[0];
        },
        getFoodJSON: function() {
            var JSON = [], 
            self = this, 
            steps = self.steps;
            for (var i = 0, len = steps.length; i < len; i++) {
                var obj = steps[i].getFoodJSON();
                JSON.push(obj);
            }
            return JSON;
        }
    });
    exports = StepFactory;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/media/media.js', '/static/edit/ui/dataConfSingleton/dataConfSingleton.js', '/static/edit/ui/sortable/sortable.js', '/static/edit/ui/tips/tips.js', '/static/common/ui/dialog/dialog.js', '/static/edit/ui/editorManager/editorManager.js', '/static/common/ui/sug/sug.js']);
F.module('/static/edit/ui/editplacefield/editplacefield.js', function(require, exports) {
    /*-----[ /static/edit/ui/editplacefield/editplacefield.js ]-----*/
    /**
 * @class EditPlaceField
 * @fileOverfiew 就地编辑基础类
 * @description 就地编辑
 * @author liuyong07
 * @date 2012-06-25
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var editorTools = require("/static/edit/ui/tools/tools.js");
    var EditPlaceFieldBase = T.lang.createClass(function(id, parent, value, index, canEdit, hasTitlePending, sectionCreateType) {
        /**
	 * @constructor
	 * @param {String} id 就地编辑对象id
	 * @param {HTMLelement} parent 就地编辑父元素
	 * @param {String} value 就地编辑的内容
	 * @param {Int} 所在栏目的序号
	 * @param {Boolean} canEdit 是否可以被就地编辑
	 * 
	 */
        this.id = id;
        this.index = index;
        this.canEdit = canEdit;
        this.hasTitlePending = hasTitlePending;
        this.value = value || '';
        this.parentElement = parent;
        this.sectionCreateType = sectionCreateType;
        this.init();
    }).extend({
        createElements: function(id) {

            /**
		 * @name createElement 
		 * @description 创建就地编辑元素
		 * @param {String} 就地编辑头部id
		 * 
		 */
            var that = this;
            this.containerElement = T.dom.create('div', {
                'class': 'exp-content-head-text'
            });
            this.staticElement = T.dom.create('span');
            //this.containerElement.appendChild(this.staticElement);
            this.staticElement.innerHTML = that.value;
            
            if (this.canEdit) {
                T.dom.setStyles(this.staticElement, {
                    'display': 'none'
                });
                this.fieldElement = T.dom.create('input', {
                    'type': 'text',
                    'value': that.value,
                    'class': 'exp-content-head-input'
                });
                this.containerElement.appendChild(this.fieldElement);
            }
            this.containerElement.appendChild(this.staticElement);
            if (this.hasTitlePending) {
                T.dom.insertHTML(this.containerElement, 'beforeEnd', '<span class="section-title-must">*</span>');
            }
            this.parentElement.appendChild(this.containerElement);
        },
        init: function() {
            var self = this;
            this.createElements(this.id);
            this.attachEvents();
            if ('new' == this.sectionCreateType) {
                setTimeout(function() {
                    T.event.fire(self.fieldElement, 'focus');
                    self.fieldElement.focus();
                }, 200);
            
            }
        },
        attachEvents: function() {

            /**
		 * @name attachEvent
		 * @descritipn 绑定事件
		 * 
		 */
            var that = this;
            if (this.fieldElement) {
                /*
			T.event.on(this.fieldElement,'keypress',function(e){
				var keyCode = T.event.getKeyCode(e);
				var ownerSection = that.getOwnerSection();
				if(keyCode== '13') {
					if(ownerSection.onEditState){
						return;
					}
					//T.event.fire(ownerSection.contentContainer,'click');
				}
			});
			*/
                T.event.on(this.fieldElement, 'keyup', function(e) {
                    var input = this;
                    var value = T.string.trim(input.value);
                    value = editorTools.cutString(value, 40);
                    input.value = value;
                    that.staticElement.innerHTML = value;
                    var ownerSection = that.getOwnerSection();
                });
            /*
			if(T.browser.ie){
				T.event.on(this.fieldElement,'propertychange',function(e){
					var input  = this;
					var value = T.string.trim(input.value);
					var len = T.string.getByteLength(value);
					T.g('expTitle').innerHTML = len;
					//value = exp.editor.tools.cutString(value,20);
					//input.value = value;
					if(len > 20 ){
						T.event.stop(e);
					}
				});
			}
			*/
            }
        },
        getTxtContent: function() {
            /**
		 * @name getValue
		 * @description 返回就地编辑的内容
		 * 
		 */
            return this.staticElement.innerHTML;
        },
        getOwnerSection: function() {
            /**
		 * @name getOwnerSection
		 * @description 返回就地编辑所在的栏目
		 * @return {Object} 
		 * 
		 */
            var that = this;
            var editorframe = window.Geditorframe;
            var expsections = editorframe.getExpSections();
            return expsections[that.index];
        },
        getContainer: function() {
            /**
		 * @name getContainer
		 * @description 返回就地编辑的父元素
		 * @returns {HTMLelement}
		 * 
		 */
            return this.containerElement;
        }
    });
    exports = EditPlaceFieldBase;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/tools/tools.js']);
F.module('/static/edit/ui/uibutton/uibutton.js', function(require, exports) {
    /*-----[ /static/edit/ui/uibutton/uibutton.js ]-----*/
    /**
 * @author liuyong07
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    require("/static/common/lib/tangram/ui/Button/Button.js");
    var UIbutton = T.lang.createClass(function(commandManager, buttonManager, commandName, unitName, options) {
        /**
	 * @class UIbutton 
	 * @description 编辑器button UI界面，在UI中绑定命令
	 * @param {Object} commandManager 命令管理对象
	 * @param {Object} buttonManage  UIbutton 管理对象
	 * @param {String} commmandName  button 名，与绑定的命令同名
	 * @param {String} unitName      button 属于的互斥组的名称
	 */
        
        var self = this;
        options = T.object.extend({
            onclick: function() {
                //促发命令
                if (commandManager) {
                    commandManager.execute(commandName);
                }
                //改变button 状态
                if (buttonManager) {
                    buttonManager.setActiveButton(commandName);
                }
            },
            onmouseover: function() {
            },
            classPrefix: 'tangram-button-' + commandName,
            onload: function() {
            }
        }, options);
        this.name = commandName;
        this.options = options;
        this.unitName = unitName;
        this.loaded = false;
        this.target = options.target;
        this.btnInstance = new T.ui.Button(options);
        this.init();
    }).extend({
        init: function() {
            /**
		 * @name init
		 * @description 初始化button
		 */
            this.btnInstance.render(this.target);
        },
        on: function() {
            /*
		 * @name on 
		 * @description button 被激活
		 */
            var self = this, 
            btnDOM, 
            timer = setInterval(function() { //等待button 组件被渲染完
                btnDOM = self.btnInstance.getBody();
                if (btnDOM) {
                    T.dom.addClass(btnDOM, 'tangram-button-' + self.name + '-active');
                    clearInterval(timer);
                }
            }, 20);
        },
        off: function() {
            /**
		 * @name off
		 * @description button 取消激活
		 *
		 */
            var self = this, 
            btnDOM, 
            timer = setInterval(function() {
                btnDOM = self.btnInstance.getBody();
                if (btnDOM) {
                    T.dom.removeClass(btnDOM, 'tangram-button-' + self.name + '-active');
                    clearInterval(timer);
                }
            }, 20);
        },
        getBtnDOM: function() {
        
        }
    });
    
    var ButtonManager = T.lang.createClass(function(holder) {
        /**
	 * @class ButtonManager
	 * @description button 管理类
	 *
	 */
        this.buttons = {};
        this.unitButtons = {};
        this.buttonsON = {};
        this.holder = holder;
    }).extend({
        addButton: function(button) {
            /**
		 * @name addButton
		 * @description 添加button 组件
		 */
            if (this.buttons[name]) {
                return;
            }
            this.buttons[button.name] = button;
            if (this.unitButtons[button.unitName]) {
                this.unitButtons[button.unitName][button.name] = button;
            } else {
                this.unitButtons[button.unitName] = {};
                this.unitButtons[button.unitName]['buttonON'] = null;
                this.unitButtons[button.unitName][button.name] = button;
            }
        },
        setActiveButton: function(name) {
            /**
		 * @name setActiveButton 
		 * @description 按钮设为激活状态
		 *
		 */
            var button;
            if (!(button = this.buttons[name])) {
                return false;
            }
            if (button.unitName) {
                var unitActiveButton = this.unitButtons[button.unitName]['buttonON'];
                if (unitActiveButton && (unitActiveButton.name != button.name)) {
                    unitActiveButton.off();
                    delete this.buttonsON[unitActiveButton.name];
                }
                this.unitButtons[button.unitName]['buttonON'] = button;
            }
            if (this.buttonsON[button.name]) {
                return false;
            }
            this.buttonsON[button.name] = button;
            button.on();
        }
    });
    exports = {
        'ButtonManager': ButtonManager,
        'UIbutton': UIbutton
    };
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/lib/tangram/ui/Button/Button.js']);
F.module('/static/edit/ui/command/command.js', function(require, exports) {
    /*-----[ /static/edit/ui/command/command.js ]-----*/
    /**
 * @author liuyong07
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var CommandBase = T.lang.createClass(function(name, unitName, options) {
        /**
	 * @class CommandBase
	 * @description 命令基类 抽象类
	 * @param {String} name 命令名称
	 * @param {String} unitName 组合互斥命令的命令名称
	 * @options {HTMLDOMelement} container
	 */
        this.name = name;
        this.unitName = unitName;
        this.options = options;
    }).extend({
        execute: function(options) {
        
        }
    });
    
    
    var CommandList = T.lang.createClass(function(name, unitName, options) {
    /**
	 * @class CommandOrderList 
	 * @description 无序列表命令类,CommandBase 的扩展类
	 * @param {String} name 命令名称
	 * @param {String} unitName 组合互斥命令的命令名称 
	 */
    }, {superClass: CommandBase}).extend({
        execute: function() {
            /**
		 * @name execute
		 * @description 执行命令
		 */
            var stepFactory = this.options.stepFactory;
            var stepsContainer = stepFactory.getContainer();
            stepFactory.orderType = this.name;
            T.dom.addClass(stepsContainer, 'exp-content-' + this.name);
        },
        deActive: function() {
            /**
		 * @name deActive
		 * @description 撤销命令
		 */
            var stepFactory = this.options.stepFactory;
            var stepsContainer = stepFactory.getContainer();
            T.dom.removeClass(stepsContainer, 'exp-content-' + this.name);
        }
    });
    
    var CommandManager = T.lang.createClass(function() {
        /**
	 * @class CommandManager
	 * @description 命令管理类
	 */
        this.commands = {};
        this.unitCommands = {};
        this.commandsON = {};
    }).extend({
        addCommand: function(command) {
            /**
		 * @name addCommand
		 * @description 向CommandManager 中添加命令
		 *
		 */
            if (this.commands[name]) {
                return;
            }
            this.commands[command.name] = command;
            //如果命令是对应的组合互斥命令，则按照unitName 进行分配
            if (this.unitCommands[command.unitName]) {
                this.unitCommands[command.unitName][command.name] = command;
            } else {
                this.unitCommands[command.unitName] = {};
                this.unitCommands[command.unitName].commandON = null;
                this.unitCommands[command.unitName][command.name] = command;
            }
        },
        setActiveCommand: function(name) {
            /**
		 * @name setActiveCommand 
		 * @description 激活命令
		 * @param {String} name 命令名称
		 */
            var command, 
            doExcute = false;
            //检查命令是否存在
            if (!(command = this.commands[name])) {
                return false;
            }
            //检查命令是否是组合互斥命令
            if (command.unitName) {
                var unitActiveCommand = this.unitCommands[command.unitName].commandON;
                //检查组合互斥命令被激活的命令
                if (unitActiveCommand && (unitActiveCommand.name != command.name)) {
                    //将已激活命令撤销
                    this.commandsON[unitActiveCommand.name].deActive();
                    delete this.commandsON[unitActiveCommand.name];
                    doExcute = true;
                }
                this.unitCommands[command.unitName].commandON = command;
            }
            if (this.commandsON[command.name]) {
                doExcute = false;
            }
            this.commandsON[command.name] = command;
            return doExcute;
        },
        execute: function(name) {
            /**
		 * @name excute
		 * @description 执行派发的命令
		 */
            if (!this.commands[name]) {
                return;
            }
            (this.setActiveCommand(name) && this.commands[name].execute());
        }
    });
    exports = {
        'CommandManager': CommandManager,
        'CommandList': CommandList
    };
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/expsection/expsection.js', function(require, exports) {
    /*-----[ /static/edit/ui/expsection/expsection.js ]-----*/
    /**
 * @fileOverview editor.expsection.js
 * @desctription  用于创建经验栏目的区域
 * @author liuyong07@baidu.com
 * @date 2012-07-25 
 *  
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var StepFactory = require("/static/edit/ui/sectionstep/sectionstep.js");
    var EditPlaceFieldBase = require('/static/edit/ui/editplacefield/editplacefield.js');
    var button = require('/static/edit/ui/uibutton/uibutton.js');
    var command = require('/static/edit/ui/command/command.js');
    var dialog = require('/static/common/ui/dialog/dialog.js');
    var ExpSection = T.lang.createClass(function(json, index, createType) {
        /**
	 * @class ExpSection
	 * @description 经验栏目UI类
	 * @param {Object} json 经验栏目json 内容
	 * @param {Int} index 经验栏目index
	 *
	 */
        this.sectionJson = json;
        this.type = 'common'; //给定栏目区域默认类型为common
        this.index = index;
        this.conf = {
            classPrefix: 'editor-block-',
            idPrefix: 'editor-block-'
        };
        this.createType = createType;
        this.init();
    }).extend({
        init: function() {
            /**
		 * @name init
		 * @desctription 初始化内容，绑定事件
		 */
            this.render(this.sectionJson, this.index);
            this.attachEvents();
        },
        getClass: function() {
            /**
		 * @name getClass
		 * @description 获取元素class
		 * @return {String} 
		 */
            return this.conf.classPrefix;
        },
        getId: function() {
            /**
		 * @name getId 
		 * @description 获取id前缀
		 */
            return this.conf.idPrefix;
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 获取栏目JSON格式类容，次方法为组合对象模式方法
		 */
            var self = this, 
            JSON = {
                'type': self.type,
                'paratitle': self.title.getTxtContent(),
                'attr': self.sectionJson.attr,
                'items': []
            };
            JSON.attr.orderType = self.getOrderType();
            JSON.items = self.stepFactory.getJSONContent();
            
            if (JSON.items.length == 0) {
                return null;
            }
            //gms 21012.11.20 判断如果是food 需要增加参数
            var isFood = F.context('isFood') ? true : false;
            if (JSON.items[0].model && isFood) 
            {
                JSON.model = "1";
                JSON.options = self.stepFactory.getFoodJSON();
            }
            return JSON;
        },
        getTxtContent: function() {
            /**
		 * @name getTxtContent 
		 * @description 获取经验字符串内容
		 */
            var content = [], 
            self = this;
            content.push(self.title.getTxtContent());
            content.push(self.stepFactory.getTxtContent());
            return content.join("");
        },
        getOrderType: function() {
            /**
		 * @name getOrderType
		 * @descript 获取经验栏目的列表类型,分别有 notorder(非列表类型) orderlist(有序列表)  unorderlist(无序列表)
		 */
            return this.stepFactory.orderType;
        },
        getSteps: function() {
            /**
		 * @name getSteps
		 * @description 拿取列表的步骤对象
		 */
            return this.stepFactory.steps;
        },
        setType: function(type) {
            /**
		 * @name steType
		 * @description 设置栏目类型
		 */
            this.type = type;
        },
        getType: function() {
            /**
		 * @name getType
		 * @description 获取栏目类型，栏目类型分为 1.brief (简介) 2.step(步骤) 3.common (普通，用户可以自己增加) 4.tools(工具原料) 5.notice(注意事项) 
		 */
            return this.type;
        },
        render: function(obj, index) {
            /**
		 * @name render 
		 * @description 渲染栏目类容
		 * @param {Object} 栏目json 格式的数据内容
		 * @param {Int} index 栏目序号
		 */
            var that = this;
            var canEditTitle = true;
            var canRemove = true;
            var hasTitlePending = false;
            if (obj.type == 'tools' || obj.type == 'notice' || obj.type == 'brief') {
                canEditTitle = false;
            }
            if (obj.type == 'tools' || obj.type == 'notice' || obj.type == 'brief' || obj.type == 'step') {
                canRemove = false;
            }
            if (obj.type == 'brief') {
                hasTitlePending = true;
            }
            that.type = obj.type;
            //var parent = that.parent
            var container = T.dom.create('div', {
                'class': that.getClass() + 'container ' + that.getClass() + obj.type
            });
            var headContainer = T.dom.create('div', {
                'class': 'exp-content-head'
            });
            var headContainerInner = T.dom.create('div', {
                'class': 'exp-content-head-inner'
            });
            var listBtnContainer = T.dom.create('div', {
                'class': 'exp-list-button'
            });
            headContainerInner.appendChild(listBtnContainer);
            headContainer.appendChild(headContainerInner);
            if (canRemove) {
                that.closeBtn = T.dom.create('a', {
                    'class': 'exp-content-close',
                    'href': 'javascript:;'
                });
                headContainerInner.appendChild(that.closeBtn);
            }
            //gms add 2012.11.21 判断如果是食材类，修改标题
            var isFood = F.context('isFood') ? true : false, 
            title = "";
            if (isFood && obj.type == 'tools') 
            {
                title = "食材";
            } 
            else if (obj.type == 'tools') 
            {
                title = "工具/原料";
            } 
            else 
            {
                title = obj.paratitle;
            }
            that.title = new EditPlaceFieldBase(
            that.getId() + 'head', 
            headContainerInner, title, 
            index, canEditTitle, 
            hasTitlePending, 
            that.createType
            );
            var contentContainer = T.dom.create('div', {
                'class': that.getClass() + 'body'
            });
            that.contentContainer = contentContainer;
            
            this.stepFactory = new StepFactory(obj, obj.attr.orderType, index);
            //gms 2012.11.15 附加判断“工具、原料”属于食材也不附加
            if (obj.type != 'brief') {
                if (!(obj.type == 'tools' && isFood)) 
                {
                    this.createUI(listBtnContainer);
                }
            }
            contentContainer.appendChild(
            this.stepFactory.getContainer()
            );
            if (obj.type == 'step' || obj.type == 'common') {
                contentContainer.appendChild(
                this.stepFactory.createAddStepBtn()
                );
            }
            container.appendChild(headContainer);
            container.appendChild(contentContainer);
            that.container = container;
        },
        createUI: function(target) {
            /**
		 * @name createUI
		 * @description 创建栏目的UI元素列表按钮，并绑定命令对象
		 */
            var that = this;
            //创建命令工厂
            var commandFactory = new command.CommandManager();
            var orderlistCommand = new command.CommandList('orderlist', 'list', {
                container: that.contentContainer,
                json: this.sectionJson,
                stepFactory: this.stepFactory
            });
            var unorderlistCommand = new command.CommandList('unorderlist', 'list', {
                container: that.contentContainer,
                json: this.sectionJson,
                stepFactory: this.stepFactory
            });
            var activeCommand = orderlistCommand;
            commandFactory.addCommand(orderlistCommand);
            commandFactory.addCommand(unorderlistCommand);
            //创建按钮管理器
            var buttonManager = new button.ButtonManager(target);
            this.buttonManager = buttonManager;
            var orderlistBtn = new button.UIbutton(commandFactory, buttonManager, 'orderlist', 'list', {
                target: target
            });
            var unorderlistBtn = new button.UIbutton(commandFactory, buttonManager, 'unorderlist', 'list', {
                target: target
            });
            buttonManager.addButton(orderlistBtn);
            buttonManager.addButton(unorderlistBtn);
            var seperate = T.dom.create('div', {
                'class': 'list-btn-seperate'
            });
            target.appendChild(seperate);
            commandFactory.setActiveCommand(this.sectionJson.attr.orderType);
            buttonManager.setActiveButton(this.sectionJson.attr.orderType);
        },
        getContainer: function() {
            /**
		 * @name getContainer
		 * @description 获取栏目顶级包含元素
		 * @return {HTMLDOMelement}
		 */
            return this.container;
        },
        attachEvents: function() {
            /**
		 * @name attachEvents
		 * @description 为栏目绑定事件
		 */
            var self = this;
            if (self.closeBtn) {
                T.event.on(self.closeBtn, 'click', function(e) {
                    T.event.preventDefault(e);
                    var editorframe = self.getEditorFrame();
                    
                    dialog.confirm('提示', {
                        'info': '<div clsss="editor-delete-step">栏目删除之后将无法恢复，确定删除？</div>',
                        'width': 400,
                        'height': 130,
                        onconfirm: function() {
                            setTimeout(function() {
                                editorframe.remove(self.index);
                            }, 200);
                            //gms fixbug 隐藏tip提示。。。
                            var tipLs = T.dom.q("exp-tooltip-main");
                            if (tipLs.length > 0) 
                            {
                                T.array.each(tipLs, function(item) {
                                    T.dom.hide(item);
                                });
                            }
                        }
                    });
                });
            }
            T.event.on(self.contentContainer, 'mouseover', function(event) {
                if (!T.dom.hasClass(self.container, 'editor-block-container-onedit')) {
                    T.dom.addClass(self.container, 'editor-block-container-hover');
                }
            });
            T.event.on(self.contentContainer, 'mouseout', function(event) {
                T.dom.removeClass(self.container, 'editor-block-container-hover');
            });

            //gms add 激活切换到编辑器功能
            var titleDom = T.dom.first(self.title.containerElement);
            if (T.dom.hasClass(titleDom, "exp-content-head-input")) 
            {
                T.event.on(titleDom, 'keydown', function(event) {
                    var codeKey = T.event.getKeyCode(event);
                    if (codeKey == 9) 
                    {
                        var editorManager = window.GeditorManager;
                        if (!editorManager.onEditStep) {
                            var editorLS = T.dom.query(".exp-step-container", self.contentContainer);
                            if (editorLS.length > 0) 
                            {
                                T.event.preventDefault(event);
                                T.event.fire(editorLS[0], 'click');
                            }
                        } 
                        else 
                        {
                            //判断是否在同一个区域内
                            if (editorManager.onEditStep.sectionType != self.sectionJson.type) 
                            {
                                editorManager.onEditStep.offEdit();
                                var editorLS = T.dom.query(".exp-step-container", self.contentContainer);
                                if (editorLS.length > 0) 
                                {
                                    T.event.preventDefault(event);
                                    T.event.fire(editorLS[0], 'click');
                                }
                            }
                        }
                    }
                });
            }
        },
        getEditorFrame: function() {
            /**
		 * @name getEditorFrame
		 * @description editorframe 对象
		 */
            return window.Geditorframe;
        }
    });
    exports = ExpSection;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/sectionstep/sectionstep.js', '/static/edit/ui/editplacefield/editplacefield.js', '/static/edit/ui/uibutton/uibutton.js', '/static/edit/ui/command/command.js', '/static/common/ui/dialog/dialog.js']);
F.module('/static/edit/ui/editorframe/editorframe.js', function(require, exports) {
    /*-----[ /static/edit/ui/editorframe/editorframe.js ]-----*/
    /**
 * @fileOverview  editor.editorframe.js  
 * @desctription  新编辑器页面框架
 * @author liuyong07@baidu.com
 * @date    2012-07-23
 *  
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dataConfSingleton = require("/static/edit/ui/dataConfSingleton/dataConfSingleton.js");
    var ExpSection = require("/static/edit/ui/expsection/expsection.js");
    var Sortable = require("/static/edit/ui/sortable/sortable.js");
    var EditorFrame = T.lang.createClass(function(expJson, options) {
        /**
	 * @class EditorFrame
	 * @description 经验内容整体UI（栏目）渲染组件
	 * @param {Object} expJson 经验内容json 数据
	 * @param {Object} options
	 * @options {HTMLDOMelement} container 渲染编辑器框架容器
	 */
        options = T.object.extend({
            container: T.g('body'),
            imagePath: 'http://hiphotos.baidu.com/exp/pic/item/',
            afterRender: function() {
            
            }
        }, options);
        this.expJsonSource = dataConfSingleton.getContentRenderJson(expJson);
        this.options = options;
        this.expSections = [];
        this.onEditInfo = null;
        this.init();
    }).extend({
        add: function(json, index, type) {
            /**
		 * @name add
		 * @description 添加新栏目
		 * @param {Object} json 栏目的json 数据
		 * @param {Int} index 栏目所在的序号
		 * @param {String} 栏目被添加的方式  'new' 表示新增,如果没有值或者为'old' 表示栏目为初始化渲染时，自动渲染
		 */
            var section = new ExpSection(json, index, type);
            var sectionLength = this.expSections.length;
            if (type && type == 'new' && this.addSectionBtn) {
                T.dom.insertBefore(section.getContainer(), this.addSectionBtn);
            } else {
                this.options.container.appendChild(section.getContainer());
            }
            this.expSections.splice(index, 0, section);
            return section;
        },
        init: function() {
            /**
		 * @name init
		 * @description 初始化
		 *
		 */
            this.render();
            this.options.afterRender.call(this, arguments);
            this.addSortable();
        },
        remove: function(index) {
            /**
		 * @name remove
		 * @description 移除栏目
		 * @param {Int} 被移除栏目的index
		 *
		 */
            this.options.container.removeChild(
            this.expSections[index].getContainer()
            );
            var removed = this.expSections.splice(index, 1);
            removed = removed[0];
            var removedSteps = removed.getSteps();
            var editorManager = window.GeditorManager;
            T.array.each(removedSteps, function(item, index) {
                if (item == editorManager.onUploadStep) {
                    editorManager.onUploadStep = null;
                    if (editorManager.onEditStep && editorManager.onEditStep.mediaManager) {
                        editorManager.onEditStep.mediaManager.createUploader({
                            'ownerStep': editorManager.onEditStep
                        });
                    }
                
                }
            });
            this.updateIndex();
        },
        updateIndex: function() {
            /**
		 * @name updateIndex
		 * @description 更新栏目序号
		 *
		 */
            T.array.each(this.expSections, function(item, index) {
                item.index = index;
            });
        },
        createAddSectionBtn: function() {
            /**
		 * @name createAddSection 
		 * @description 创建增加栏目的button
		 *
		 */
            var that = this;
            this.addSectionBtn = T.dom.create('div', {
                'class': 'add-section-btn-default'
            });
            //this.addSectionBtn.innerHTML = '<span class="add-section-btnicon">+</span>'+
            //						   '<span class="add-section-btntext">添加新栏目</span>';
            //将增加栏目的按钮插入到注意事项栏目之前
            var sections = this.getExpSections();
            var len = sections.length;
            var ele = sections[len - 1].getContainer();
            T.dom.insertBefore(this.addSectionBtn, ele);
            T.event.on(this.addSectionBtn, 'mouseover', function(e) {
                T.dom.addClass(this, 'add-section-btn-hover');
            });
            T.event.on(this.addSectionBtn, 'mouseout', function(e) {
                T.dom.removeClass(this, 'add-section-btn-hover');
            });
            this.addSectionBtn.onclick = function(e) {
                e = e || window.event;
                T.event.stopPropagation(e);
                T.event.preventDefault(e);
                var sections = that.getExpSections();
                var length = sections.length;
                var index = length - 1;
                var section = that.add(dataConfSingleton.getSectionJsonTemplate({'common': 5}), index, 'new');
                that.updateIndex();
                section.stepFactory.steps[0].onEdit(section.stepFactory, 'addSection');
            };
        },
        render: function() {
            /**
		 * @name render
		 * @description 渲染内容
		 */
            var that = this;
            T.array.each(this.expJsonSource, function(item, index) {
                that.add(item, index, 'auto');
            });
            this.createAddSectionBtn();
        },
        getJSONContent: function() {
            /**
		 * @name getJSONContent
		 * @description 提取经验 json 格式的内容
		 */
            var JSON = [];
            T.array.each(this.expSections, function(section, index) {
                var content = section.getJSONContent();
                if (content) {
                    JSON.push(content);
                }
            });
            return JSON;
        },
        getTxtContent: function() {
            /**
		 * @name getTxtContent
		 * @description 提取经验文本内容
		 */
            var content = [];
            T.array.each(this.expSections, function(section, index) {
                content.push(section.getTxtContent());
            });
            return content.join('');
        },
        getExpSections: function() {
            /**
		 * @name getExpSections
		 * @description 返回经验
		 */
            return this.expSections;
        },
        addSortable: function() {
        /*
		var self = this;
		self.sortable = new Sortable({
			container:self.options.container,
			items:'editor-block-common',
			placeholder:'section-sortable-placeholder',
			opacity:0.8,
			cursor:'move',
			start:function(){
				T.dom.addClass(this.container,'editorframe-ondragging');
			},
			stop:function(){
				T.dom.removeClass(this.container,'editorframe-ondragging');
			}
		});
		self.sortable.init();
		*/
        }
    });
    
    exports = EditorFrame;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/dataConfSingleton/dataConfSingleton.js', '/static/edit/ui/expsection/expsection.js', '/static/edit/ui/sortable/sortable.js']);
F.module('/static/edit/ui/draft/draft.js', function(require, exports) {
    /*-----[ /static/edit/ui/draft/draft.js ]-----*/
    /**
 * @fileOverView draft.js
 * @author  liuyong07@baidu.com
 * 
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var ajax = require("/static/common/ui/ajax/ajax.js");
    var dialog = require("/static/common/ui/dialog/dialog.js");
    var login = require("/static/common/ui/login/login.js");
    var ec = require('/static/common/lib/fis/event/event.js').eventCenter;
    var dataCenter = require("/static/edit/ui/dataCenter/dataCenter.js");
    var validateCenter = require("/static/edit/ui/validate/validate.js");
    var tool = require("/static/common/ui/util/tool/tool.js");
    var error = require("/static/edit/ui/error/error.js");
    var fixable = require("/static/common/ui/util/fixable/fixable.js");
    require("/static/common/lib/tangram/fx/fadeIn/fadeIn.js");
    require("/static/common/lib/tangram/fx/fadeOut/fadeOut.js");
    var Tooltip = T.lang.createClass(function(options) {
        /**
	 * @class Tooltip
	 * @description 自动保存草稿提示
	 */
        this.options = T.object.extend({
            'width': 190,
            'height': 60,
            'closeBtb': false,
            'interval': 5 * 1000
        }, options || {});
        this.tipContent = '&nbsp;&nbsp;已自动为您保存草稿';
        this.fixing = false;
        this.init();
    }).extend({
        init: function() {
            this._create();
            this.updatePosition();
            this.attachEvent();
        },
        _create: function() {
            /**
		 * @name _create
		 * @description 生成草稿dom 结构
		 *
		 */
            this.container = T.dom.create('div', {
                'class': 'draft-autosave-tip'
            });
            T.dom.setStyles(this.container, {
                'width': this.options.width + 'px',
                'display': 'none'
            });
            this.wraper = T.dom.create('div', {
                'class': 'draft-autosave-wraper'
            });
            this.contentContainer = T.dom.create('div', {
                'class': 'draft-autosave-content'
            });
            this.closeBtn = T.dom.create('a', {
                'class': 'draft-tip-close-btn i-msg-close',
                'href': 'javascript:;'
            });
            this.container.appendChild(this.wraper);
            this.wraper.appendChild(this.contentContainer);
            this.wraper.appendChild(this.closeBtn);
            document.body.appendChild(this.container);
            (!this.options.closeBtn) && T.dom.setStyle(this.closeBtn, 'display', 'none');
        },
        open: function() {
            /**
		 * @name open
		 * @description 自动保存草稿提示开启 
		 *
		 */
            var self = this;
            T.fx.fadeIn(self.container, {
                onafterfinish: function() {
                    self.timer = setTimeout(function() {
                        self.close();
                    }, self.options.interval);
                }
            });
        },
        close: function() {
            /**
		 * 自动保存草稿提示关闭
		 *
		 */
            T.fx.fadeOut(this.container);
        },
        updateContent: function(value) {
            /**
		 * @name updateContent
		 * @description 更新提示的内容
		 */
            var self = this;
            self.contentContainer.innerHTML = value + self.tipContent;
            self.open();
        },
        attachEvent: function() {
            /**
		 * @name attachEvent
		 * @description 为提示绑定事件
		 */
            var self = this;
            T.event.on(this.closeBtn, 'click', function(event) {
                T.event.preventDefault(event);
                self.close();
            });
            T.event.on(window, 'scroll', function() {
                self.updatePosition();
            });
            T.event.on(window, 'resize', function() {
                self.updatePosition();
            });
        },
        updatePosition: function() {
            /**
		 * @name updatePosition
		 * @description 更新自动保存草稿提示的位置
		 *
		 */
            var self = this;
            var left = T.dom.getPosition('editor-frame').left + parseInt(T.dom.getStyle('editor-frame', 'width'), 10) / 2 - 95;
            T.dom.setStyle(self.container, 'left', left);
            if (T.page.getScrollTop() >= 131 && !self.fixing) {
                fixable.
                fixable(self.container, {
                    top: 0,
                    left: left
                });
                self.fixing = true;
            } else if (T.page.getScrollTop() < 131 && self.fixing) {
                T.dom.removeStyle(self.container, 'position');
                T.dom.removeStyle(self.container, 'top');
                if (T.ie && T.ie < 7) {
                    self.container.style.removeExpression('top');
                }
                self.fixing = false;
            }
        }
    });

    /**
 * @name draft
 * @description 草稿单体
 *
 */
    var draft = {
        conf: {
            interval: 60 * 1000,
            tipsOffInterval: 1 * 1000,
            draftNumHolder: T.g('draft-num')
        },
        data: {
            curPostVars: null,
            lastPostVars: null,
            lastPostTime: false,
            lastPostWay: 'auto' // another way is 'manual'
        },
        timer: null,
        hasUpdateDraftNum: false, //只有第一次保存草稿之后才更新
        allAutoSave: true,
        save: function() {
            /**
		 * @name saveDraft 
		 * @param {Object} expJson 经验json 格式数据
		 * @param {String} expText 经验过滤掉标签的文本
		 * @param {Boolean} hasVideo 文章中 是否有视频  
		 */
            var self = this, 
            vars = self.getPostVars();
            self.post(vars);
            self.stopAutoSave();
            self.startAutoSave();
        },
        addDraftNum: function(type) {
            if (type != 'draft' && !this.hasUpdateDraftNum && this.conf.draftNumHolder) {
                var draftNum = parseInt(this.conf.draftNumHolder.innerHTML, 10);
                draftNum++;
                this.conf.draftNumHolder.innerHTML = draftNum;
                this.hasUpdateDraftNum = true;
            }
        },
        minusDraftNum: function() {
            if (this.conf.draftNumHolder) {
                var draftNum = parseInt(this.conf.draftNumHolder.innerHTML, 10);
                draftNum--;
                this.conf.draftNumHolder.innerHTML = draftNum;
                this.hasUpdateDraftNum = false;
            }
        },
        post: function(vars) {
            /**
		 * @name post 
		 * @description 草稿提交
		 * @param {Object} vars 提交的参数
		 */
            var self = this, 
            type = arguments[1];
            if (!vars) {
                return;
            }
            //提交前走验证中心验证
            if (!validateCenter.validate(self.validateVars, 'draft')) {
                return;
            }
            //提交前检查是否登陆
            var loginParam = {
                'isLogin': function() {
                    ajax.post('/submit/exp', vars, function(req) {
                        dataCenter.setData('did', req.did);
                        self.addDraftNum(type);
                        self.data.lastPostVars = T.object.clone(vars);
                        var time = new Date();
                        if (type && type == 'auto') {
                            self.tip.updateContent(time.toLocaleTimeString());
                        } else {
                            dialog.alert("提示", {info: '<p>草稿保存成功</p>',width: 300,height: 100});
                        }
                    }, 
                    {CONTENT_TOO_LONG_ERR: function() {
                            self.contentTooLongErr();
                        },
                        NOT_LOGIN_ERR: function() {
                            self.notLoginErr();
                        },
                        DRAFT_BOX_FULL_ERR: function() {
                            self.draftBoxFullErr();
                        },
                        FINAL_ERR_HANDLER: function() {
                            self.stopAutoSave();
                        }
                    });
                },
                'notLogin': function() {
                    self.stopAutoSave();
                    ec.fire('login.log');
                }
            };
            ec.fire('login.check', loginParam);
        },
        getPostVars: function() {
            /**
		 * @name getPostVars
		 * @description 通过数据中心获取提交参数
		 */
            var self = this;
            var originAuthor = dataCenter.getData('originAuthor'), 
            isOriginal = dataCenter.getData('isOriginal'), 
            expContent = dataCenter.getData('expContent'), 
            reference = dataCenter.getData('reference'), 
            title = dataCenter.getData('title'), 
            cid = dataCenter.getData('cid'), 
            did = dataCenter.getData('did'), 
            hasVideo = dataCenter.getData('hasVideo'), 
            tid = dataCenter.getData('tid'), 
            expTxt = dataCenter.getData('expTxt');
            self.setValidateVars(expTxt, reference);
            //gms add 2012.11.21 过滤多余的属性
            var isFood = F.context('isFood') ? true : false;
            if (isFood) 
            {
                var tmpJson = expContent;
                for (var i = 0; i < tmpJson.length; i++) {
                    if (tmpJson[i].type == "tools") 
                    {
                        var tmpItems = tmpJson[i].items, 
                        newItemArr = [];
                        for (var j = 0; j < tmpItems.length; j++) {
                            var tmparr = {"attr": "","text": "",media: []};
                            tmparr.attr = tmpItems[j].attr;
                            tmparr.text = tmpItems[j].text;
                            tmparr.media = tmpItems[j].media;
                            newItemArr.push(tmparr);
                        }
                        tmpJson[i].items = newItemArr;
                    }
                }
                ;
            }
            expContent = T.json.stringify(expContent);
            var postVars = {
                content: expContent,
                reference: reference,
                originAuthor: originAuthor,
                isOriginal: isOriginal,
                tid: tid,
                title: title
            };
            if (cid) {
                postVars = T.object.extend(postVars, {
                    cid: cid
                });
            }
            if (did) {
                postVars = T.object.extend(postVars, {
                    did: did,
                    'method': 'modifyDraft'
                });
            } else {
                postVars = T.object.extend(postVars, {
                    'method': 'createDraft'
                });
            }
            return postVars;
        },
        setValidateVars: function(expTxt, reference) {
            /**
		 * @name setValidateVars
		 * @description 设置需要验证的参数
		 *
		 */
            this.validateVars = {
                expTxt: expTxt,
                reference: reference
            };
        },
        init: function() {
            /**
		 * @name init
		 * @description 初始化
		 *
		 */
            var self = this, 
            expType = dataCenter.getData('expType');
            self.createButton(expType);
            if (expType != 'refuse' && expType != 'version') {
                self.tip = new Tooltip({interval: 4 * 1000});
                self.data.lastPostVars = T.object.clone(this.getPostVars());
                self.startAutoSave();
            }
        },
        autoSave: function() {
            /**
		 * @name autoSave
		 * @description 自动保存
		 *
		 *
		 */
            var self = this, 
            initVars = dataCenter.getInitData(), 
            postVars = self.getPostVars(), 
            lastPostVars = self.data.lastPostVars;
            if (self.isContentChanged(lastPostVars, initVars) && self.isContentChanged(lastPostVars, postVars)) {
                self.post(postVars, 'auto');
            }
        },
        createButton: function(expType) {
            /**
		 * @name createButton
		 * @description 创建按钮并绑定事件
		 *
		 */
            var draftBtn = T.dom.create('div', {
                'class': 'save-draft-btn',
                'id': 'editor-save-draft'
            });
            var self = this;
            this.draftBtn = draftBtn;
            var holder = T.g('save-draft-holder');
            holder.appendChild(this.draftBtn);
            if (expType == 'refuse' || expType == 'version') {
                T.dom.addClass(draftBtn, 'save-draft-btn-disable');
                return false;
            }
            T.on(draftBtn, 'mouseover', function(event) {
                T.dom.addClass(this, 'save-draft-btn-hover');
            });
            T.on(draftBtn, 'mouseout', function(event) {
                T.dom.removeClass(this, 'save-draft-btn-hover');
            });
            T.on(draftBtn, 'mousedown', function(event) {
                T.dom.addClass(this, 'save-draft-btn-active');
            });
            T.on(draftBtn, 'mouseup', function(event) {
                T.dom.removeClass(this, 'save-draft-btn-active');
            });
            draftBtn.onclick = function() {
                self.save();
            }
        },
        startAutoSave: function() {
            /**
		 * @name startAutoSave
		 * @description 开启自动保存
		 */
            var self = this;
            //为确保开启新的自动保存前，把原来的自动保存计时器停止并清除
            self.stopAutoSave();
            self.allowAutoSave = true;
            self.timer = window.setInterval(function() {
                self.autoSave();
            }, self.conf.interval);
            (typeof arguments[0] === 'function') && arguments[0]();
        },
        stopAutoSave: function() {
            /**
		 * @name stopAutoSave
		 * @description 停止自动保存
		 *
		 */
            var self = this;
            self.allowAutoSave = false;
            window.clearInterval(self.timer);
            (typeof arguments[0] === 'function') && arguments[0]();
        },
        isContentChanged: function(signVars, vars) {
            /**
		 * @name isContentChanged
		 * @description 经验内容是否更改判断
		 *
		 */
            var self = this;
            if (!(signVars && vars)) {
                return false;
            }
            if (
            signVars.content == vars.content && 
            signVars.reference == vars.reference && 
            signVars.isOriginal == vars.isOriginal && 
            signVars.originAuthor == vars.originAuthor && 
            signVars.cid == vars.cid
            ) {
                return false;
            }
            return true;
        },
        contentTooLongErr: function() {
            dialog.alert("提示", {info: '<p>超过15000字的经验无法保存，请删改</p>',width: 300,height: 80});
        },
        //错误-未登录
        notLoginErr: function() {
            var self = this;
            ec.fire('login.check', {
                'isLogin': function() {
                    self.save();
                }
            });
        },
        draftBoxFullErr: function() {
            var self = this;
            var info = ['<div class="draftbox-full" id="draftbox-full">草稿箱已满，是否删除最早的草稿以便成功保存？', 
                '<div class="button">', 
                '<input type="button" value="是" class="g-btn-com">', 
                '<input type="button" class="g-btn-del">', 
                '</div></div>'].join('');
            dialog.show("提示", {info: info,width: 405,height: 125});
            T.event.on("draftbox-full", "click", function(e) {
                var target = T.event.getTarget(e);
                if (T.dom.hasClass(target, "g-btn-com")) {
                    ajax.post('/submit/exp', {method: "deleteOldestDraft"}, function() {
                        self.minusDraftNum();
                        self.save();
                    });
                } 
                else if (T.dom.hasClass(target, "g-btn-del")) {
                    window.open("/user/nuc/expList?type=4");
                }
            });
        }
    
    };
    exports = draft;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/ui/ajax/ajax.js', '/static/common/ui/dialog/dialog.js', '/static/common/ui/login/login.js', '/static/common/lib/fis/event/event.js', '/static/edit/ui/dataCenter/dataCenter.js', '/static/edit/ui/validate/validate.js', '/static/common/ui/util/tool/tool.js', '/static/edit/ui/error/error.js', '/static/common/ui/util/fixable/fixable.js', '/static/common/lib/tangram/fx/fadeIn/fadeIn.js', '/static/common/lib/tangram/fx/fadeOut/fadeOut.js']);
F.module('/static/edit/ui/guide/guide.js', function(require, exports) {
    /*-----[ /static/edit/ui/guide/guide.js ]-----*/
    /**
 * @fileOverview guide.js
 * @author liuyong07@baidu.com
 *
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var dialog = require("/static/common/lib/tangram/ui/Dialog/Dialog.js");
    var cookie = require("/static/common/ui/cookie/cookie.js");
    var preview = F.context('preview');
    require("/static/common/lib/tangram/ui/Modal/Modal.js");
    require("/static/common/lib/tangram/ui/Dialog/Dialog$button/Dialog$button.js");
    require("/static/common/lib/tangram/ui/Dialog/Dialog$autoDispose/Dialog$autoDispose.js");
    require("/static/common/lib/tangram/ui/Dialog/Dialog$coverable/Dialog$coverable.js");
    require("/static/common/lib/tangram/ui/Dialog/Dialog$keyboard/Dialog$keyboard.js");
    require("/static/common/lib/tangram/ui/Dialog/Dialog$closeButton/Dialog$closeButton.js");
    require("/static/common/lib/tangram/fx/fadeOut/fadeOut.js");
    
    var GuideTip = T.lang.createClass(function(options) {
        /**
	 * @class GuideTip
	 * @param {Object} options
	 * @options {String} type 引导的类型
	 * @options {HTMLDOMelement} target 被引导的目标元素
	 * @options {Object} buttons tips 底部按钮
	 */
        
        this.type = options.type;
        this.options = options;
        this.target = options.target;
        this.guideIndex = options.guideIndex;
        this.guideManager = options.guideManager;
    }).extend({
        tipOptions: {
            classPrefix: 'editor-guide',
            width: 213,
            height: 102,
            modal: false,
            autoDispose: false,
            onopen: function() {
                T.dom.addClass(this.getMain(), 'guide-' + this.type);
            },
            onclose: function() {
                /**
			 * @name onclose
			 * @description 气泡关闭
			 *
			 */
                var self = this;
                var parentUI = self.parentUI;
                parentUI.destroyTip();
                parentUI.guideManager.destroyModal();
                cookie.set('EXP_EDITGUIDE', '5');
                //滚动到顶部
                window.scrollTo(0, 0);
            },
            buttons: {
                'back': {
                    'content': '<span title="返回"></span>',
                    'guidePhase': this.type,
                    'onclick': function() {
                        var parent = this.getParent();
                        var guideManager = parent.guideManager;
                        var guideIndex = parent.guideIndex;
                        parent.parentUI.destroyTip();
                        guideManager.guides[guideIndex - 2].init();
                    }
                },
                'next': {
                    'content': '<span title="下一步"></span>',
                    'guidePhase': this.type,
                    'onclick': function() {
                        var parent = this.getParent();
                        var guideManager = parent.guideManager;
                        var guideIndex = parent.guideIndex;
                        parent.parentUI.destroyTip();
                        guideManager.guides[guideIndex].init();
                    }
                }
            }
        },
        init: function() {
            /**
		 * @name init 
		 * @description 气泡初始化
		 *
		 */
            var self = this;
            this.createSignElement();
            this.createTip();
            this.attachEvents();
            this.tip.render();
            this.tip.open();
            cookie.set('EXP_EDITGUIDE', this.guideIndex, false, '/edit');
            setTimeout(function() {
                //更新气泡位置
                self.updatePos();
            }, 200);
        },
        attachEvents: function() {
            var self = this;
            if (!self._isResize) 
            {
                self._isResize = function() {
                    self.updatePos();
                };
                T.event.on(window, 'resize', self._isResize);
            }
        },
        createSignElement: function() {
            /**
		 * @name createSignElement
		 * @description 创建被引导的图标
		 *
		 */
            var target = T.g(this.target), 
            cloneDeep = this.type == 'image' ? false : true;
            signElement = T.g(this.target).cloneNode(cloneDeep), 
            pos = T.dom.getPosition(target);
            //避免ie中出现克隆引导元素的事件
            /*T.event.on(signElement,'click',function(event){
			return false;
		});*/
            this.targetPos = pos;
            this.signElement = signElement;
            T.dom.setStyles(signElement, {
                'position': 'absolute',
                'left': pos.left + 1,
                'top': pos.top
            });
            T.dom.addClass(signElement, 'guide-sign-element');
            document.body.appendChild(signElement);
        },
        updatePos: function() {
            /**
		 * @name uploadPos
		 * @description 更新气泡的位置
		 *
		 */
            var self = this;
            var target = T.g(self.target), 
            pos = T.dom.getPosition(target);
            this.targetPos = pos;
            T.dom.setStyles(self.signElement, {
                'position': 'absolute',
                'left': pos.left + 1,
                'top': pos.top
            });
            var width = this.signElement.offsetWidth;
            var height = this.signElement.offsetHeight;
            this.tip.update({
                'left': self.targetPos.left + width + 7,
                'top': self.targetPos.top - (58 - height / 2)
            });
            self.scroll();
        },
        scroll: function() {
            /**
		 * @name scroll 
		 * @description 根据被引导的位置来滚动滚动条
		 *
		 */
            var scrollTop = T.page.getScrollTop();
            var viewHeight = T.page.getViewHeight();
            var targetTop = this.targetPos.top;
            var targetHeight = 102;
            //在视觉区域上部分
            if ((targetTop + targetHeight) < scrollTop) {
                window.scrollTo(0, targetTop - (viewHeight - targetHeight) / 2);
            }
            //在视觉区域下部分
            if ((targetTop + targetHeight) > scrollTop + viewHeight) {
                window.scrollTo(0, targetTop - (viewHeight - targetHeight) / 2);
            }
        
        },
        createTip: function(type) {
            /**
		 * @name createTip
		 * @description 创建引导气泡
		 * @param {String} type 引导气泡类型
		 */
            var self = this;
            var options = T.object.clone(this.tipOptions);
            var width = this.signElement.offsetWidth;
            var height = this.signElement.offsetHeight;
            options.type = this.type;
            options.parentUI = self;
            options.guideManager = this.guideManager;
            options.guideIndex = this.guideIndex;
            if (this.options.buttons) {
                options.buttons = this.options.buttons;
            }
            options = T.object.extend({
                'left': self.targetPos.left + width + 7,
                'top': self.targetPos.top - (58 - height / 2)
            }, options);
            var tip = new dialog(options);
            this.tip = tip;
            return tip;
        },
        destroyTip: function() {
            /*
		 * @name destroyTip
		 * @description 销毁气泡
		 */
            document.body.removeChild(this.signElement);
            this.tip.dispose();
            if (this._isResize) 
            {
                T.event.un(window, 'resize', this._isResize);
            }
        }
    });
    
    var Guide = T.lang.createClass(function() {
        /**
	 * @class Guide 引导类
	 * @dscription 负责管理气泡引导 
	 *
	 */
        this.guides = [];
        this.modal = null;
    }).extend({
        init: function() {
            /**
		 *初始化
		 *
		 */
            var guidePhase = parseInt(cookie.get('EXP_EDITGUIDE'), 10);
            if (!guidePhase) {
                guidePhase = 1;
            }
            if (guidePhase == 5) {
                return;
            }
            this.createModal();
            this.createGuide();
            this.guides[guidePhase - 1].init();
        },
        createGuide: function() {
            /**
		 * @name createGuide
		 * @description 生成引导
		 *
		 */
            var self = this;
            //保存草稿引导
            var draft = new GuideTip({
                type: 'draft',
                target: T.g('editor-save-draft'),
                guideIndex: 1,
                guideManager: self,
                buttons: {
                    'next': {
                        'content': '<span title="下一步"></span>',
                        'guidePhase': this.type,
                        'onclick': function() {
                            var parent = this.getParent();
                            var guideManager = parent.guideManager;
                            var guideIndex = parent.guideIndex;
                            parent.parentUI.destroyTip();
                            guideManager.guides[guideIndex].init();
                        }
                    }
                
                }
            });
            this.guides.push(draft);
            //添加图片引导
            var image = new GuideTip({
                type: 'image',
                guideIndex: 2,
                guideManager: self,
                target: T.dom.q('image-add-btn')[0]
            });
            
            this.guides.push(image);
            //添加步骤引导
            var addstep = new GuideTip({
                type: 'addstep',
                guideIndex: 3,
                guideManager: self,
                target: T.dom.q('add-step-btn')[0]
            });
            this.guides.push(addstep);
            //添加栏目引导
            var addsection = new GuideTip({
                type: 'addsection',
                target: T.dom.q('add-section-btn-default')[0],
                guideIndex: 4,
                guideManager: self,
                buttons: {
                    'next': {
                        'content': '<span title="返回"></span>',
                        'guidePhase': this.type,
                        'onclick': function() {
                            var parent = this.getParent();
                            var guideManager = parent.guideManager;
                            var guideIndex = parent.guideIndex;
                            parent.parentUI.destroyTip();
                            guideManager.destroyModal();
                            cookie.set('EXP_EDITGUIDE', '5');
                            window.scrollTo(0, 0);
                        }
                    }
                
                }
            });
            this.guides.push(addsection);
        },
        createModal: function() {
            //生成遮罩
            this.modal = new T.ui.Modal();
            this.modal.render();
            this.modal.show();
        },
        destroyModal: function() {
            //销毁遮罩
            this.modal.dispose();
        
        }
    });
    
    var guide = new Guide();
    exports = guide;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/common/lib/tangram/ui/Dialog/Dialog.js', '/static/common/ui/cookie/cookie.js', '/static/common/lib/tangram/ui/Modal/Modal.js', '/static/common/lib/tangram/ui/Dialog/Dialog$button/Dialog$button.js', '/static/common/lib/tangram/ui/Dialog/Dialog$autoDispose/Dialog$autoDispose.js', '/static/common/lib/tangram/ui/Dialog/Dialog$coverable/Dialog$coverable.js', '/static/common/lib/tangram/ui/Dialog/Dialog$keyboard/Dialog$keyboard.js', '/static/common/lib/tangram/ui/Dialog/Dialog$closeButton/Dialog$closeButton.js', '/static/common/lib/tangram/fx/fadeOut/fadeOut.js']);
F.module('/static/edit/ui/template/template.js', function(require, exports) {
    /*-----[ /static/edit/ui/template/template.js ]-----*/
    /**
 * @fileOverView 经验预览类容的渲染
 * @author liuyong07@baidu.com	
 *
 */
    var T = require("/static/common/lib/tangram/base/base.js");
    var tplEngine = T.lang.createClass(function(title, JSON, reference, isOriginal, originAuthor) {
        this.title = title;
        this.JSON = JSON;
        this.reference = reference;
        this.isOriginal = isOriginal;
        this.originAuthor = originAuthor;
    }).extend({
        imagePath: F.context('imagePath'),
        sectionClass: 'exp-content-block',
        listClass: 'exp-content-list',
        updateContent: function(title, JSON, reference, isOriginal, originAuthor) {
            this.title = title;
            this.JSON = JSON;
            this.reference = reference;
            this.renderExp(title, JSON, reference);
        },
        getExpContent: function(title, JSON, reference, isOriginal, originAuthor) {
            var self = this;
            content = [
                '<div class="exp-preview-content">', 
                self.renderTitle(title), 
                self.renderOriginalState(isOriginal), 
                self.renderContentBody(JSON, reference, originAuthor), 
                '</div>'
            ];
            return content.join("");
        },
        renderTitle: function(title) {
            var self = this;
            content = [
                '<div class="preview-content-head">', 
                '<div class="preview-content-head-inner">', 
                '<span class="content-head-text">', 
                title, 
                '</span>', 
                '</div>', 
                '</div>'
            ].join('');
            return content;
        },
        renderOriginalState: function(isOriginal) {
            if (parseInt(isOriginal, 10) === 1) {
                content = [
                    '<div class="preview-content-origin">', 
                    '<div class="preview-content-origin-inner">', 
                    '<span class="content-origin-icon"></span>', 
                    '<span class="content-origin-text">', 
                    '<span class="content-origin-text-label">作者声明:</span>', 
                    '<span class="content-origin-desc">本篇经验系本人依照真实经历原创，未经许可，谢绝转载。</span>', 
                    '</span>', 
                    '</div>', 
                    '</div>'
                ].join('');
                return content;
            }
            return '';
        },
        renderContentBody: function(JSON, reference, originAuthor) {
            var self = this;
            return [
                '<div class="preview-content-body">', 
                '<div class="preview-content-body-inner">', 
                self.renderSections(JSON), 
                self.renderReference(reference), 
                self.renderOriginAuthor(originAuthor), 
                self.renderRightState(), 
                '</div>', 
                '</div>'
            ].join('');
        },
        renderSections: function(JSON) {
            var self = this, 
            sections = [];
            T.array.each(JSON, function(section, index) {
                sections.push(self.renderSingleSection(section, index + 1));
            });
            return sections.join('');
        },
        renderSingleSection: function(json, index) {
            var self = this;
            if (!self.isShowSection(json)) {
                return '';
            }
            var section = [
                '<div class="exp-content-block exp-content-block-', index, '">', 
                '<div class="exp-content-head"><div class="exp-content-head-inner"><div class="exp-content-head-text">', json.paratitle, '</div></div></div>', 
                '<div class="exp-content-body">'
            ];
            var orderType = json.attr.orderType;
            section.push('<div class="exp-content-');
            section.push(orderType);
            section.push('">');
            //gms add 2012.11.19 判断是否食材，需要特殊处理
            if (json.model && json.model == "1") 
            {
                var step = [];
                step.push('<div class="exp-step-container food-preview list-item-0">');
                if (json.items[0].showPrewHtml) {
                    step.push('<div class="content-list-text">');
                    step.push(json.items[0].showPrewHtml);
                    step.push('</div>');
                }
                step.push('</div>');
                section.push(step.join(''));
            } 
            else 
            {
                section.push(self.renderSteps(json.items, orderType));
            }
            section.push('</div>');
            section.push('</div></div>');
            return section.join('');
        },
        renderSteps: function(json, orderType) {
            var self = this, 
            steps = [];
            T.array.each(json, function(step, index) {
                steps.push(self.renderSingleStep(step, orderType, index + 1));
            });
            return steps.join('');
        },
        renderSingleStep: function(json, orderType, index) {
            var self = this, 
            step = [], 
            text = json.text || '';
            text = T.string.trim(text);
            //text = T.string.stripTags(text);
            
            step.push('<div class="exp-step-container list-item-');
            step.push(index);
            step.push('">');
            step.push('<span class="list-icon"></span>');
            if (text) {
                step.push('<div class="content-list-text">');
                step.push(text);
                step.push('</div>');
            }
            if (json.media.length > 0) {
                step.push('<div class="content-list-media">');
                step.push(self.renderMedias(json.media));
                step.push('</div>');
            }
            step.push('</div>');
            return step.join('');
        },
        renderMedias: function(json) {
            var self = this, 
            medias = [];
            T.array.each(json, function(media, index) {
                medias.push(self.renderSingleMedia(media));
            });
            return medias.join('');
        },
        renderSingleMedia: function(json) {
            var self = this, 
            media = [];
            media.push('<div class="list-media-item">');
            if (json.type == 'img') {
                media.push('<img src="');
                media.push(self.imagePath);
                media.push(json.src);
                media.push('.jpg');
                media.push('" />');
            
            } else {
                media.push('<embed height="365" width="440" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="');
                media.push(json.src);
                media.push('wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never">');
            
            }
            media.push('</div>');
            return media.join('');
        },
        renderReference: function(reference) {
            if (!reference) {
                return '';
            }
            reference = reference.replace(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi, function(match) {
                var link = match;
                if (!(/^http|https/gi.test(match))) {
                    link = 'http://' + match;
                }
                return '<a href="' + link + '" target="_blank">' + match + '</a>';
            });
            var content = [
                '<div class="exp-content-block exp-content-block-reference">', 
                '<div class="exp-content-head">', 
                '<div class="exp-content-head-inner">', 
                '<div class="exp-content-head-text">参考资料</div>', 
                '</div>', 
                '</div>', 
                '<div class="exp-content-body">', 
                '<div class="exp-content-notorder">', 
                '<div class="exp-step-container"><p>', 
                reference, 
                '</p></div>', 
                '</div>', 
                '</div>', 
                '</div>'
            ];
            return content.join('');
        
        },
        renderOriginAuthor: function(originAuthor) {
            if (!originAuthor) {
                return '';
            }
            originAuthor = T.string.trim(originAuthor);
            var content = [
                '<div class="exp-content-author">', 
                '<div class="exp-content-author-inner">', 
                '原作者：', 
                '<span class="originauthor-name">', 
                originAuthor, 
                '</span>', 
                '</div>', 
                '</div>'
            ];
            return content.join('');
        },
        renderRightState: function() {
            return [
                '<div class="exp-content-rightstate">', 
                '<div class="exp-content-rightstate-inner">', 
                '经验内容仅供参考，如果您需要解决具体问题（尤其在法律、医学等领域），建议您接下来详细咨询相关领域专业人士。', 
                '</div>', 
                '</div>'
            ].join('');
        
        },
        isShowSection: function(json) {
            var items = json.items, 
            showSection = false;
            if (items.length > 1) {
                showSection = true;
                return true;
            } else if (items.length == 1) {
                var text = items[0].text || '';
                text = T.string.trim(text);
                text = T.string.stripTags(text);
                if (text) {
                    showSection = true;
                    return true;
                } else if (items[0].media.length > 0) {
                    showSection = true;
                    return true;
                } else {
                    showSection = false;
                    return false;
                }
            } else {
                showSection = false;
                return false;
            }
            return showSection;
        }
    });
    
    exports = tplEngine;
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js']);
F.module('/static/edit/ui/preview/preview.js', function(require, exports) {
    /*-----[ /static/edit/ui/preview/preview.js ]-----*/
    var T = require("/static/common/lib/tangram/base/base.js");
    var submit = require("/static/edit/ui/submit/submit.js");
    var tplEngine = require("/static/edit/ui/template/template.js");
    var dataCenter = require("/static/edit/ui/dataCenter/dataCenter.js");
    var Modal = require("/static/common/lib/tangram/ui/Modal/Modal.js");
    var fixable = require("/static/common/ui/util/fixable/fixable.js");
    require("/static/common/lib/tangram/fx/scrollTo/scrollTo.js");
    require("/static/common/lib/tangram/fx/fadeOut/fadeOut.js");
    require("/static/common/lib/tangram/fx/fadeIn/fadeIn.js");
    var Preview = T.lang.createClass(function(options) {
        this.options = options;
        this.tplEngine = new tplEngine();
        this.init();
    }).extend({
        init: function() {
            this.create();
            this.attachEvents();
        },
        create: function() {
            this.model = T.dom.create('div', {
                'class': 'exp-preview-model'
            });
            this.head = T.dom.create('div', {
                'class': 'exp-preview-head'
            });
            this.headBox = T.dom.create('div', {
                'class': 'preview-head-inner'
            });
            this.headTextContainer = T.dom.create('strong', {
                'class': 'preview-head-text'
            });
            this.headTextContainer.innerHTML = "经验预览";
            this.headBtnContainer = T.dom.create('div', {
                'class': 'preview-head-buttons'
            });
            this.backBtn = T.dom.create('div', {
                'class': 'preview-btn-back'
            });
            this.submitBtn = T.dom.create('div', {
                'class': 'preview-btn-submit'
            });
            this.body = T.dom.create('div', {
                'class': 'exp-preview-body'
            });
            this.model.appendChild(this.head);
            this.model.appendChild(this.body);
            this.head.appendChild(this.headBox);
            this.headBox.appendChild(this.headTextContainer);
            this.headBox.appendChild(this.headBtnContainer);
            this.headBtnContainer.appendChild(this.backBtn);
            this.headBtnContainer.appendChild(this.submitBtn);
            document.body.appendChild(this.model);
            T.dom.hide(this.model);
            this.isShow = false;
        },
        attachEvents: function() {
            var self = this;
            T.event.on(self.submitBtn, 'click', function(event) {
                T.event.preventDefault(event);
                submit.send();
            });
            T.event.on(self.submitBtn, 'mouseover', function(event) {
                T.dom.addClass(this, 'preview-btn-submit-hover');
            });
            T.event.on(self.submitBtn, 'mouseout', function(event) {
                T.dom.removeClass(this, 'preview-btn-submit-hover');
            });
            T.event.on(self.submitBtn, 'mousedown', function(event) {
                T.dom.addClass(this, 'preview-btn-submit-active');
            });
            T.event.on(self.submitBtn, 'mouseup', function(event) {
                T.dom.removeClass(this, 'preview-btn-submit-active');
            });
            T.event.on(self.backBtn, 'click', function(event) {
                T.event.preventDefault(event);
                self.close();
            });
            T.event.on(self.backBtn, 'mouseover', function(event) {
                T.dom.addClass(this, 'preview-btn-back-hover');
            });
            T.event.on(self.backBtn, 'mouseout', function(event) {
                T.dom.removeClass(this, 'preview-btn-back-hover');
            });
            T.event.on(self.backBtn, 'mousedown', function(event) {
                T.dom.addClass(this, 'preview-btn-back-active');
            });
            T.event.on(self.backBtn, 'mouseup', function(event) {
                T.dom.removeClass(this, 'preview-btn-back-active');
            });
            T.event.on(document, 'keypress', function(event) {
                var keyCode = T.event.getKeyCode(event);
                if ((keyCode == 27) && (self.isShow === true)) {
                    self.close();
                }
            });
            T.event.on(window, 'scroll', function(event) {
                self.updatePosition();
            });
        },
        open: function() {
            var self = this;
            T.fx.fadeIn(self.model, {
                onafterfinish: function() {
                    self.isShow = true;
                }
            });
            var pageHeight = T.page.getHeight();
            var modelHeight = parseInt(T.dom.getStyle(self.model, 'height'), 10);
            var height = Math.max(pageHeight, modelHeight);
            T.dom.setStyle(self.model, 'height', height);
            window.scrollTo(0, 0);
        },
        close: function() {
            var self = this;
            var pageBody = T.g('body');
            if (T.browser.ie && pageBody) {
                T.dom.show(pageBody);
            }
            T.fx.fadeOut(self.model, {
                onafterfinish: function() {
                    self.isShow = false;
                }
            });
        },
        updateContent: function() {
            var self = this;
            var JSON = dataCenter.getData('expContent'), 
            title = dataCenter.getData('title'), 
            reference = dataCenter.getData('reference'), 
            isOriginal = dataCenter.getData('isOriginal'), 
            originAuthor = dataCenter.getData('originAuthor');
            var expHTML = this.tplEngine.getExpContent(title, JSON, reference, isOriginal, originAuthor);
            this.body.innerHTML = expHTML;
            var pageBody = T.g('body');
            if (T.browser.ie && pageBody) {
                T.dom.hide(pageBody);
            }
            self.open();
        },
        updatePosition: function() {
            /**
		 * @name updatePosition
		 * @description 更新自动保存草稿提示的位置
		 *
		 */
            var self = this;
            var pageWidth = T.page.getWidth();
            if (T.page.getScrollTop() >= 65 && !self.fixing) {
                fixable.
                fixable(self.head, {
                    top: 0,
                    left: 0
                });
                T.dom.setStyle(self.head, 'width', pageWidth);
                self.fixing = true;
            } else if (T.page.getScrollTop() < 65 && self.fixing) {
                T.dom.removeStyle(self.head, 'position');
                T.dom.removeStyle(self.head, 'top');
                if (T.ie && T.ie < 7) {
                    self.head.style.removeExpression('top');
                }
                self.fixing = false;
            }
        }
    });
    
    exports = new Preview();
    
    return exports;
}, ['/static/common/lib/tangram/base/base.js', '/static/edit/ui/submit/submit.js', '/static/edit/ui/template/template.js', '/static/edit/ui/dataCenter/dataCenter.js', '/static/common/lib/tangram/ui/Modal/Modal.js', '/static/common/ui/util/fixable/fixable.js', '/static/common/lib/tangram/fx/scrollTo/scrollTo.js', '/static/common/lib/tangram/fx/fadeOut/fadeOut.js', '/static/common/lib/tangram/fx/fadeIn/fadeIn.js']);
