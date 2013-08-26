/**
 * 编辑器主类，包含编辑器提供的大部分公用接口
 * @file
 * @module UE
 * @class Editor
 * @since 1.2.6.1
 */

/**
 * UEditor公用空间，UEditor所有的功能都挂载在该空间下
 * @unfile
 * @module UE
 */

/**
 * UEditor的核心类，为用户提供与编辑器交互的接口。
 * @unfile
 * @module UE
 * @class Editor
 */

(function () {
    var uid = 0, _selectionChangeTimer;


    /**
     * 获取编辑器的html内容，赋值到编辑器所在表单的textarea文本域里面
     * @private
     * @method setValue
     * @param { Editor } editor 编辑器事例
     */
    function setValue(form, editor) {
        var textarea;
        if (editor.textarea) {
            if (utils.isString(editor.textarea)) {
                for (var i = 0, ti, tis = domUtils.getElementsByTagName(form, 'textarea'); ti = tis[i++];) {
                    if (ti.id == 'ueditor_textarea_' + editor.options.textarea) {
                        textarea = ti;
                        break;
                    }
                }
            } else {
                textarea = editor.textarea;
            }
        }
        if (!textarea) {
            form.appendChild(textarea = domUtils.createElement(document, 'textarea', {
                'name': editor.options.textarea,
                'id': 'ueditor_textarea_' + editor.options.textarea,
                'style': "display:none"
            }));
            //不要产生多个textarea
            editor.textarea = textarea;
        }
        textarea.value = editor.hasContents() ?
            (editor.options.allHtmlEnabled ? editor.getAllHtml() : editor.getContent(null, null, true)) :
            ''
    }

    /**
     * 初始化插件
     * @private
     * @method loadPlugins
     * @param { Editor } editor 编辑器事例
     */
    function loadPlugins(me) {
        //初始化插件
        for (var pi in UE.plugins) {
            UE.plugins[pi].call(me);
        }
        me.langIsReady = true;

        me.fireEvent("langReady");
    }

    /**
     * 获取语言包里面的第一个
     * @private
     * @method checkCurLang
     * @param { PlainObject } I18N 编辑器事例
     */
    function checkCurLang(I18N) {
        for (var lang in I18N) {
            return lang
        }
    }


    /**
     * 编辑器准备就绪后会触发该事件
     * @module UE
     * @class Editor
     * @event ready
     * @example
     * ```javascript
     * editor.addListener( 'ready', function( editor ) {
     *     editor.execCommand( 'focus' );
     * } );
     * ```
     */

    /**
     * 每当编辑器内部选区发生改变后， 将触发该事件。例如鼠标点击或者框选，键盘输入，工具栏上的编辑操作，都会触发selectionchange事件
     * @event selectionchange
     * @warning 该事件的触发非常频繁，不建议在该事件的处理过程中做重量级的处理
     * @example
     * ```javascript
     * editor.addListener( 'selectionchange', function( editor ) {
     *
     *     editor.execCommand( 'bold' );
     *
     * }
     */

    /**
     * 以默认参数构建一个编辑器实例
     * @constructor
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */

    /**
     * 以给定的参数集合创建一个编辑器对象，对于未指定的参数，将应用默认参数。
     * @constructor
     * @param { PlainObject } setting 创建编辑器的参数
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */
    var Editor = UE.Editor = function (options) {
        var me = this;
        me.uid = uid++;
        EventBase.call(me);
        me.commands = {};
        me.options = utils.extend(utils.clone(options || {}), UEDITOR_CONFIG, true);
        me.shortcutkeys = {};
        me.inputRules = [];
        me.outputRules = [];
        //设置默认的常用属性
        me.setOpt({
            isShow: true,
            initialContent: '',
            initialStyle: '',
            autoClearinitialContent: false,
            iframeCssUrl: me.options.UEDITOR_HOME_URL + 'themes/iframe.css',
            textarea: 'editorValue',
            focus: false,
            focusInEnd: true,
            autoClearEmptyNode: true,
            fullscreen: false,
            readonly: false,
            zIndex: 999,
            imagePopup: true,
            enterTag: 'p',
            customDomain: false,
            lang: 'zh-cn',
            langPath: me.options.UEDITOR_HOME_URL + 'lang/',
            theme: 'default',
            themePath: me.options.UEDITOR_HOME_URL + 'themes/',
            allHtmlEnabled: false,
            scaleEnabled: false,
            tableNativeEditInFF: false,
            autoSyncData: true
        });

        if (!utils.isEmptyObject(UE.I18N)) {
            //修改默认的语言类型
            me.options.lang = checkCurLang(UE.I18N);
            loadPlugins(me)
        } else {
            utils.loadFile(document, {
                src: me.options.langPath + me.options.lang + "/" + me.options.lang + ".js",
                tag: "script",
                type: "text/javascript",
                defer: "defer"
            }, function () {
                loadPlugins(me)
            });
        }

        UE.instants['ueditorInstant' + me.uid] = me;
    };
    Editor.prototype = {


        /**
         * 编辑器对外提供的监听ready事件的接口， 通过调用该方法，达到的效果与监听ready事件是一致的
         * @method ready
         * @param { Function } fn 编辑器ready之后所执行的回调, 如果在注册事件之前编辑器已经ready，将会
         * 立即触发该回调。
         * @see UE.Editor.event:ready
         * @example
         * ```javascript
         * editor.ready( function( editor ) {
         *
         *     editor.setContent('初始化完毕');
         *
         * } );
         * ```
         */
        ready: function (fn) {
            var me = this;
            if (fn) {
                me.isReady ? fn.apply(me) : me.addListener('ready', fn);
            }
        },


        /**
         * 以attributeName - attributeValue的方式设置编辑器的配置项，以覆盖编辑器的默认选项值
         * @method setOpt
         * @warning 该方法仅供编辑器构造函数调用，其他任何方法不能调用。
         * @param { String } key 编辑器的可接受的选项名称
         * @param { * } val  该选项可接受的值
         * @example
         * ```javascript
         * editor.setOpt( 'initContent', '欢迎使用编辑器' );
         * ```
         */

        /**
         * 以key-value集合的方式设置编辑器的配置项，以覆盖编辑器的默认选项值
         * @method setOpt
         * @warning 该方法仅供编辑器构造函数调用，其他任何方法不能调用。
         * @param { PlainObject } settings 编辑器的可接受的选项的key-value集合
         * @example
         * ```javascript
         * editor.setOpt( {
         *     'initContent': '欢迎使用编辑器'
         * } );
         * ```
         */
        setOpt: function (key, val) {
            var obj = {};
            if (utils.isString(key)) {
                obj[key] = val
            } else {
                obj = key;
            }
            utils.extend(this.options, obj, true);
        },


        /**
         * 销毁编辑器实例对象,解绑所有的注册是事件，并且将编辑区域变成textarea标签
         * @method destroy
         * @example
         * ```javascript
         * editor.destroy();
         * ```
         */
        destroy: function () {

            var me = this;
            me.fireEvent('destroy');
            var container = me.container.parentNode;
            var textarea = me.textarea;
            if (!textarea) {
                textarea = document.createElement('textarea');
                container.parentNode.insertBefore(textarea, container);
            } else {
                textarea.style.display = ''
            }

            textarea.style.width = me.iframe.offsetWidth + 'px';
            textarea.style.height = me.iframe.offsetHeight + 'px';
            textarea.value = me.getContent();
            textarea.id = me.key;
            container.innerHTML = '';
            domUtils.remove(container);
            var key = me.key;
            //trace:2004
            for (var p in me) {
                if (me.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            UE.delEditor(key);
        },

        /**
         * 渲染编辑器的DOM到指定容器
         * @method render
         * @param { String } containerId 指定一个容器ID
         * @warning 必须且只能调用一次
         */

        /**
         * 渲染编辑器的DOM到指定容器
         * @method render
         * @param { Element } containerDom 直接指定容器对象
         * @warning 必须且只能调用一次
         */
        render: function (container) {
            var me = this,
                options = me.options,
                getStyleValue = function (attr) {
                    return parseInt(domUtils.getComputedStyle(container, attr));
                };
            if (utils.isString(container)) {
                container = document.getElementById(container);
            }
            if (container) {
                if (options.initialFrameWidth) {
                    options.minFrameWidth = options.initialFrameWidth
                } else {
                    options.minFrameWidth = options.initialFrameWidth = container.offsetWidth;
                }
                if (options.initialFrameHeight) {
                    options.minFrameHeight = options.initialFrameHeight
                } else {
                    options.initialFrameHeight = options.minFrameHeight = container.offsetHeight;
                }

                container.style.width = /%$/.test(options.initialFrameWidth) ? '100%' : options.initialFrameWidth -
                    getStyleValue("padding-left") - getStyleValue("padding-right") + 'px';
                container.style.height = /%$/.test(options.initialFrameHeight) ? '100%' : options.initialFrameHeight -
                    getStyleValue("padding-top") - getStyleValue("padding-bottom") + 'px';

                container.style.zIndex = options.zIndex;

                var html = ( ie && browser.version < 9 ? '' : '<!DOCTYPE html>') +
                    '<html xmlns=\'http://www.w3.org/1999/xhtml\' class=\'view\' ><head>' +
                    '<style type=\'text/css\'>' +
                    //设置四周的留边
                    '.view{padding:0;word-wrap:break-word;cursor:text;height:90%;}\n' +
                    //设置默认字体和字号
                    //font-family不能呢随便改，在safari下fillchar会有解析问题
                    'body{margin:8px;font-family:sans-serif;font-size:16px;}' +
                    //设置段落间距
                    'p{margin:5px 0;}</style>' +
                    ( options.iframeCssUrl ? '<link rel=\'stylesheet\' type=\'text/css\' href=\'' + utils.unhtml(options.iframeCssUrl) + '\'/>' : '' ) +
                    (options.initialStyle ? '<style>' + options.initialStyle + '</style>' : '') +
                    '</head><body class=\'view\' ></body>' +
                    '<script type=\'text/javascript\' ' + (ie ? 'defer=\'defer\'' : '' ) + ' id=\'_initialScript\'>' +
                    'setTimeout(function(){window.parent.UE.instants[\'ueditorInstant' + me.uid + '\']._setup(document);},0);' +
                    'var _tmpScript = document.getElementById(\'_initialScript\');_tmpScript.parentNode.removeChild(_tmpScript);</script></html>';
                container.appendChild(domUtils.createElement(document, 'iframe', {
                    id: 'ueditor_' + me.uid,
                    width: "100%",
                    height: "100%",
                    frameborder: "0",
                    src: 'javascript:void(function(){document.open();' + (options.customDomain && document.domain != location.hostname ? 'document.domain="' + document.domain + '";' : '') +
                        'document.write("' + html + '");document.close();}())'
                }));
                container.style.overflow = 'hidden';
                //解决如果是给定的百分比，会导致高度算不对的问题
                setTimeout(function () {
                    if (/%$/.test(options.initialFrameWidth)) {
                        options.minFrameWidth = options.initialFrameWidth = container.offsetWidth;
                        container.style.width = options.initialFrameWidth + 'px';
                    }
                    if (/%$/.test(options.initialFrameHeight)) {
                        options.minFrameHeight = options.initialFrameHeight = container.offsetHeight;
                        container.style.height = options.initialFrameHeight + 'px';
                    }
                })
            }
        },

        /**
         * 编辑器初始化
         * @method _setup
         * @private
         * @param { Element } doc 编辑器Iframe中的文档对象
         */
        _setup: function (doc) {

            var me = this,
                options = me.options;
            if (ie) {
                doc.body.disabled = true;
                doc.body.contentEditable = true;
                doc.body.disabled = false;
            } else {
                doc.body.contentEditable = true;
            }
            doc.body.spellcheck = false;
            me.document = doc;
            me.window = doc.defaultView || doc.parentWindow;
            me.iframe = me.window.frameElement;
            me.body = doc.body;

            me.selection = new dom.Selection(doc);
            //gecko初始化就能得到range,无法判断isFocus了
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            this._initEvents();
            //为form提交提供一个隐藏的textarea
            for (var form = this.iframe.parentNode; !domUtils.isBody(form); form = form.parentNode) {
                if (form.tagName == 'FORM') {
                    me.form = form;
                    if (me.options.autoSyncData) {
                        domUtils.on(me.window, 'blur', function () {
                            setValue(form, me);
                        });
                    } else {
                        domUtils.on(form, 'submit', function () {
                            setValue(this, me);
                        });
                    }
                    break;
                }
            }
            if (options.initialContent) {
                if (options.autoClearinitialContent) {
                    var oldExecCommand = me.execCommand;
                    me.execCommand = function () {
                        me.fireEvent('firstBeforeExecCommand');
                        return oldExecCommand.apply(me, arguments);
                    };
                    this._setDefaultContent(options.initialContent);
                } else
                    this.setContent(options.initialContent, false, true);
            }

            //编辑器不能为空内容

            if (domUtils.isEmptyNode(me.body)) {
                me.body.innerHTML = '<p>' + (browser.ie ? '' : '<br/>') + '</p>';
            }
            //如果要求focus, 就把光标定位到内容开始
            if (options.focus) {
                setTimeout(function () {
                    me.focus(me.options.focusInEnd);
                    //如果自动清除开着，就不需要做selectionchange;
                    !me.options.autoClearinitialContent && me._selectionChange();
                }, 0);
            }
            if (!me.container) {
                me.container = this.iframe.parentNode;
            }
            if (options.fullscreen && me.ui) {
                me.ui.setFullScreen(true);
            }

            try {
                me.document.execCommand('2D-position', false, false);
            } catch (e) {
            }
            try {
                me.document.execCommand('enableInlineTableEditing', false, false);
            } catch (e) {
            }
            try {
                me.document.execCommand('enableObjectResizing', false, false);
            } catch (e) {
//                domUtils.on(me.body,browser.ie ? 'resizestart' : 'resize', function( evt ) {
//                    domUtils.preventDefault(evt)
//                });
            }
            me._bindshortcutKeys();
            me.isReady = 1;
            me.fireEvent('ready');
            options.onready && options.onready.call(me);
            if (!browser.ie) {
                domUtils.on(me.window, ['blur', 'focus'], function (e) {
                    //chrome下会出现alt+tab切换时，导致选区位置不对
                    if (e.type == 'blur') {
                        me._bakRange = me.selection.getRange();
                        try {
                            me._bakNativeRange = me.selection.getNative().getRangeAt(0);
                            me.selection.getNative().removeAllRanges();
                        } catch (e) {
                            me._bakNativeRange = null;
                        }

                    } else {
                        try {
                            me._bakRange && me._bakRange.select();
                        } catch (e) {
                        }
                    }
                });
            }
            //trace:1518 ff3.6body不够寛，会导致点击空白处无法获得焦点
            if (browser.gecko && browser.version <= 10902) {
                //修复ff3.6初始化进来，不能点击获得焦点
                me.body.contentEditable = false;
                setTimeout(function () {
                    me.body.contentEditable = true;
                }, 100);
                setInterval(function () {
                    me.body.style.height = me.iframe.offsetHeight - 20 + 'px'
                }, 100)
            }
            !options.isShow && me.setHide();
            options.readonly && me.setDisabled();
        },

        /**
         * 同步编辑器的数据，为提交数据做准备，主要用于是手动提交的情况
         * 后台取得数据的键值使用你容器上的name属性，如果没有就使用参数传入的textarea属性
         * 获取要同步的表单，从编辑器的容器向上查找要同步数据的form，如果找到就同步数据
         * @method sync
         * @example
         * ```javascript
         * editor.sync();
         * form.sumbit(); //form变量已经指向了form元素
         * ```
         */

        /**
         * 同步编辑器的数据，为提交数据做准备，主要用于是手动提交的情况
         * 后台取得数据的键值使用你容器上的name属性，如果没有就使用参数传入的textarea属性
         * 根据传入表单id参数，获取要同步数据的form
         * @method sync
         * @param { String } formID 指定一个要同步数据的form的id,编辑器的数据会同步到你指定form下
         */
        sync: function (formId) {
            var me = this,
                form = formId ? document.getElementById(formId) :
                    domUtils.findParent(me.iframe.parentNode, function (node) {
                        return node.tagName == 'FORM'
                    }, true);
            form && setValue(form, me);
        },

        /**
         * 设置编辑器高度
         * @method setHeight
         * @param { Number } number 设置的高度值，纯数值，不带单位
         * @example
         * ```javascript
         * editor.setHeight(number);
         * ```
         */
        setHeight: function (height, notSetHeight) {
            if (height !== parseInt(this.iframe.parentNode.style.height)) {
                this.iframe.parentNode.style.height = height + 'px';
            }
            !notSetHeight && (this.options.minFrameHeight = this.options.initialFrameHeight = height);

            this.body.style.height = height + 'px';
        },

        /**
         * 添加命令的快捷键
         * @method addshortcutkey
         * @param { PlainObject } keyset 命令和快捷键的键值对对象，多个按钮的快捷键用“＋”分隔
         * @example
         * ```javascript
         * editor.addshortcutkey({
         *     "Bold" : "ctrl+66",//^B
         *     "Italic" : "ctrl+73", //^I
         * });
         * ```
         */
        /**
         * 添加命令的快捷键
         * @method addshortcutkey
         * @param { String } cmd 触发快捷键时，响应的命令
         * @param { String } keys 快捷键的字符串，多个按钮用“＋”分隔
         * @example
         * ```javascript
         * editor.addshortcutkey("Underline", "ctrl+85"); //^U
         * ```
         */
        addshortcutkey: function (cmd, keys) {
            var obj = {};
            if (keys) {
                obj[cmd] = keys
            } else {
                obj = cmd;
            }
            utils.extend(this.shortcutkeys, obj)
        },

        /**
         * 对编辑器设置keydown事件监听，绑定快捷键和命令，当快捷键组合触发成功，会响应对应的命令
         * @method _bindshortcutKeys
         * @private
         */
        _bindshortcutKeys: function () {
            var me = this, shortcutkeys = this.shortcutkeys;
            me.addListener('keydown', function (type, e) {
                var keyCode = e.keyCode || e.which;
                for (var i in shortcutkeys) {
                    var tmp = shortcutkeys[i].split(',');
                    for (var t = 0, ti; ti = tmp[t++];) {
                        ti = ti.split(':');
                        var key = ti[0], param = ti[1];
                        if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                            if (( (RegExp.$1 == 'ctrl' ? (e.ctrlKey || e.metaKey) : 0)
                                && (RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1)
                                && keyCode == RegExp.$3
                                ) ||
                                keyCode == RegExp.$1
                                ) {
                                if (me.queryCommandState(i, param) != -1)
                                    me.execCommand(i, param);
                                domUtils.preventDefault(e);
                            }
                        }
                    }

                }
            });
        },


        /**
         * 获取编辑器的内容
         * @method getContent
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @return { String } 编辑器的内容字符串, 如果编辑器的内容为空， 则返回空字符串
         * @example
         * ```javascript
         * var content = editor.getContent();
         * ```
         */

        /**
         * 获取编辑器的内容。 可以通过参数定义编辑器内置的判空规则
         * @method getContent
         * @param { Function } fn 自定的判空规则， 要求该方法返回一个boolean类型的值，
         *                      代表当前编辑器的内容是否空，
         *                      如果返回true， 则该方法将直接返回空字符串；如果返回false，则编辑器将返回
         *                      经过内置过滤规则处理后的内容。
         * @remind 该方法在处理包含有初始化内容的时候能起到很好的作用。
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @return { String } 编辑器的内容字符串
         * @example
         * ```javascript
         * // editor 是一个编辑器的实例
         * var content = editor.getContent( function ( editor ) {
         *      return editor.body.innerHTML === '欢迎使用UEditor';
         * } );
         * ```
         */
        getContent: function (cmd, fn, notSetCursor, ignoreBlank, formatter) {
            var me = this;
            if (cmd && utils.isFunction(cmd)) {
                fn = cmd;
                cmd = '';
            }
            if (fn ? !fn() : !this.hasContents()) {
                return '';
            }
            me.fireEvent('beforegetcontent');
            var root = UE.htmlparser(me.body.innerHTML, ignoreBlank);
            me.filterOutputRule(root);
            me.fireEvent('aftergetcontent', cmd);
            return  root.toHtml(formatter);
        },

        /**
         * 取得完整的html代码，可以直接显示成完整的html文档
         * @method getAllHtml
         * @return { String } 编辑器的内容html文档字符串
         * @eaxmple
         * ```javascript
         * editor.getAllHtml();
         * ```
         */
        getAllHtml: function () {
            var me = this,
                headHtml = [],
                html = '';
            me.fireEvent('getAllHtml', headHtml);
            if (browser.ie && browser.version > 8) {
                var headHtmlForIE9 = '';
                utils.each(me.document.styleSheets, function (si) {
                    headHtmlForIE9 += ( si.href ? '<link rel="stylesheet" type="text/css" href="' + si.href + '" />' : '<style>' + si.cssText + '</style>');
                });
                utils.each(me.document.getElementsByTagName('script'), function (si) {
                    headHtmlForIE9 += si.outerHTML;
                });

            }
            return '<html><head>' + (me.options.charset ? '<meta http-equiv="Content-Type" content="text/html; charset=' + me.options.charset + '"/>' : '')
                + (headHtmlForIE9 || me.document.getElementsByTagName('head')[0].innerHTML) + headHtml.join('\n') + '</head>'
                + '<body ' + (ie && browser.version < 9 ? 'class="view"' : '') + '>' + me.getContent(null, null, true) + '</body></html>';
        },

        /**
         * 得到编辑器的纯文本内容，但会保留段落格式
         * @method getPlainTxt
         * @return { String } 编辑器带段落格式的纯文本内容字符串
         * @example
         * ```javascript
         * editor.getPlainTxt();
         * ```
         */
        getPlainTxt: function () {
            var reg = new RegExp(domUtils.fillChar, 'g'),
                html = this.body.innerHTML.replace(/[\n\r]/g, '');//ie要先去了\n在处理
            html = html.replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, '\n')
                .replace(/<br\/?>/gi, '\n')
                .replace(/<[^>/]+>/g, '')
                .replace(/(\n)?<\/([^>]+)>/g, function (a, b, c) {
                    return dtd.$block[c] ? '\n' : b ? b : '';
                });
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return html.replace(reg, '').replace(/\u00a0/g, ' ').replace(/&nbsp;/g, ' ');
        },

        /**
         * 获取编辑器中的纯文本内容,没有段落格式
         * @method getContentTxt
         * @return { String } 编辑器不带段落格式的纯文本内容字符串
         * @example
         * ```javascript
         * editor.getContentTxt();
         * ```
         */
        getContentTxt: function () {
            var reg = new RegExp(domUtils.fillChar, 'g');
            //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
            return this.body[browser.ie ? 'innerText' : 'textContent'].replace(reg, '').replace(/\u00a0/g, ' ');
        },

        /**
         * 获取编辑器的内容
         * @method getContent
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @return { String } 编辑器的内容字符串, 如果编辑器的内容为空， 则返回空字符串
         * @example
         * ```javascript
         * var content = editor.getContent();
         * ```
         */

        /**
         * 获取编辑器的内容。 可以通过参数定义编辑器内置的判空规则
         * @method getContent
         * @param { Function } fn 自定的判空规则， 要求该方法返回一个boolean类型的值，
         *                      代表当前编辑器的内容是否空，
         *                      如果返回true， 则该方法将直接返回空字符串；如果返回false，则编辑器将返回
         *                      经过内置过滤规则处理后的内容。
         * @remind 该方法在处理包含有初始化内容的时候能起到很好的作用。
         * @warning 该方法获取到的是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @return { String } 编辑器的内容字符串
         * @example
         * ```javascript
         * // editor 是一个编辑器的实例
         * var content = editor.getContent( function ( editor ) {
         *
         *      return editor.body.innerHTML === '欢迎使用UEditor';
         *
         * } );
         * ```
         */
        setContent: function (html, isAppendTo, notFireSelectionchange) {
            var me = this;

            me.fireEvent('beforesetcontent', html);
            var root = UE.htmlparser(html);
            me.filterInputRule(root);
            html = root.toHtml();


            me.body.innerHTML = (isAppendTo ? me.body.innerHTML : '') + html;


            function isCdataDiv(node) {
                return  node.tagName == 'DIV' && node.getAttribute('cdata_tag');
            }

            //给文本或者inline节点套p标签
            if (me.options.enterTag == 'p') {

                var child = this.body.firstChild, tmpNode;
                if (!child || child.nodeType == 1 &&
                    (dtd.$cdata[child.tagName] || isCdataDiv(child) ||
                        domUtils.isCustomeNode(child)
                        )
                    && child === this.body.lastChild) {
                    this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>' + this.body.innerHTML;

                } else {
                    var p = me.document.createElement('p');
                    while (child) {
                        while (child && (child.nodeType == 3 || child.nodeType == 1 && dtd.p[child.tagName] && !dtd.$cdata[child.tagName])) {
                            tmpNode = child.nextSibling;
                            p.appendChild(child);
                            child = tmpNode;
                        }
                        if (p.firstChild) {
                            if (!child) {
                                me.body.appendChild(p);
                                break;
                            } else {
                                child.parentNode.insertBefore(p, child);
                                p = me.document.createElement('p');
                            }
                        }
                        child = child.nextSibling;
                    }
                }
            }
            me.fireEvent('aftersetcontent');
            me.fireEvent('contentchange');

            !notFireSelectionchange && me._selectionChange();
            //清除保存的选区
            me._bakRange = me._bakIERange = me._bakNativeRange = null;
            //trace:1742 setContent后gecko能得到焦点问题
            var geckoSel;
            if (browser.gecko && (geckoSel = this.selection.getNative())) {
                geckoSel.removeAllRanges();
            }
            if (me.options.autoSyncData) {
                me.form && setValue(me.form, me);
            }
        },

        /**
         * 让编辑器获得焦点，默认focus到编辑器头部
         * @method focus
         * @example
         * ```javascript
         * editor.focus()
         * ```
         */

        /**
         * 让编辑器获得焦点，toEnd确定focus位置
         * @method focus
         * @param { Boolean } toEnd 默认focus到编辑器头部，toEnd为true时focus到内容尾部
         * @example
         * ```javascript
         * editor.focus(true)
         * ```
         */
        focus: function (toEnd) {
            try {
                var me = this,
                    rng = me.selection.getRange();
                if (toEnd) {
                    rng.setStartAtLast(me.body.lastChild).setCursor(false, true);
                } else {
                    rng.select(true);
                }
                this.fireEvent('focus');
            } catch (e) {
            }
        },

        /**
         * 初始化UE事件及部分事件代理
         * @method _initEvents
         * @private
         */
        _initEvents: function () {
            var me = this,
                doc = me.document,
                win = me.window;
            me._proxyDomEvent = utils.bind(me._proxyDomEvent, me);
            domUtils.on(doc, ['click', 'contextmenu', 'mousedown', 'keydown', 'keyup', 'keypress', 'mouseup', 'mouseover', 'mouseout', 'selectstart'], me._proxyDomEvent);
            domUtils.on(win, ['focus', 'blur'], me._proxyDomEvent);
            domUtils.on(doc, ['mouseup', 'keydown'], function (evt) {
                //特殊键不触发selectionchange
                if (evt.type == 'keydown' && (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)) {
                    return;
                }
                if (evt.button == 2)return;
                me._selectionChange(250, evt);
            });
//            //处理拖拽
//            //ie ff不能从外边拖入
//            //chrome只针对从外边拖入的内容过滤
//            var innerDrag = 0, source = browser.ie ? me.body : me.document, dragoverHandler;
//            domUtils.on(source, 'dragstart', function () {
//                innerDrag = 1;
//            });
//            domUtils.on(source, browser.webkit ? 'dragover' : 'drop', function () {
//                return browser.webkit ?
//                    function () {
//                        clearTimeout(dragoverHandler);
//                        dragoverHandler = setTimeout(function () {
//                            if (!innerDrag) {
//                                var sel = me.selection,
//                                    range = sel.getRange();
//                                if (range) {
//                                    var common = range.getCommonAncestor();
//                                    if (common && me.serialize) {
//                                        var f = me.serialize,
//                                            node =
//                                                f.filter(
//                                                    f.transformInput(
//                                                        f.parseHTML(
//                                                            f.word(common.innerHTML)
//                                                        )
//                                                    )
//                                                );
//                                        common.innerHTML = f.toHTML(node);
//                                    }
//                                }
//                            }
//                            innerDrag = 0;
//                        }, 200);
//                    } :
//                    function (e) {
//                        if (!innerDrag) {
//                            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
//                        }
//                        innerDrag = 0;
//                    }
//            }());
        },

        /**
         * 触发事件代理
         * @method _proxyDomEvent
         * @private
         * @return { * } fireEvent的返回值
         * @see UE.EventBase:fireEvent(String)
         */
        _proxyDomEvent: function (evt) {
            return this.fireEvent(evt.type.replace(/^on/, ''), evt);
        },
        /**
         * 变化选区
         * @method _selectionChange
         * @private
         */
        _selectionChange: function (delay, evt) {
            var me = this;
            //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
//            if ( !me.selection.isFocus() ){
//                return;
//            }


            var hackForMouseUp = false;
            var mouseX, mouseY;
            if (browser.ie && browser.version < 9 && evt && evt.type == 'mouseup') {
                var range = this.selection.getRange();
                if (!range.collapsed) {
                    hackForMouseUp = true;
                    mouseX = evt.clientX;
                    mouseY = evt.clientY;
                }
            }
            clearTimeout(_selectionChangeTimer);
            _selectionChangeTimer = setTimeout(function () {
                if (!me.selection.getNative()) {
                    return;
                }
                //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
                //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
                var ieRange;
                if (hackForMouseUp && me.selection.getNative().type == 'None') {
                    ieRange = me.document.body.createTextRange();
                    try {
                        ieRange.moveToPoint(mouseX, mouseY);
                    } catch (ex) {
                        ieRange = null;
                    }
                }
                var bakGetIERange;
                if (ieRange) {
                    bakGetIERange = me.selection.getIERange;
                    me.selection.getIERange = function () {
                        return ieRange;
                    };
                }
                me.selection.cache();
                if (bakGetIERange) {
                    me.selection.getIERange = bakGetIERange;
                }
                if (me.selection._cachedRange && me.selection._cachedStartElement) {
                    me.fireEvent('beforeselectionchange');
                    // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
                    me.fireEvent('selectionchange', !!evt);
                    me.fireEvent('afterselectionchange');
                    me.selection.clear();
                }
            }, delay || 50);
        },

        /**
         * 执行编辑命令
         * @method _callCmdFn
         * @private
         * @param { String } fnName 函数名称
         * @param { * } args 传给命令函数的参数
         * @return { * } 返回命令函数运行的返回值
         */
        _callCmdFn: function (fnName, args) {
            var cmdName = args[0].toLowerCase(),
                cmd, cmdFn;
            cmd = this.commands[cmdName] || UE.commands[cmdName];
            cmdFn = cmd && cmd[fnName];
            //没有querycommandstate或者没有command的都默认返回0
            if ((!cmd || !cmdFn) && fnName == 'queryCommandState') {
                return 0;
            } else if (cmdFn) {
                return cmdFn.apply(this, args);
            }
        },

        /**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @method execCommand
         * @return { * } 返回命令函数运行的返回值
         * @example
         * ```javascript
         * editor.execCommand(cmdName);
         * ```
         */
        execCommand: function (cmdName) {
            cmdName = cmdName.toLowerCase();
            var me = this,
                result,
                cmd = me.commands[cmdName] || UE.commands[cmdName];
            if (!cmd || !cmd.execCommand) {
                return null;
            }
            if (!cmd.notNeedUndo && !me.__hasEnterExecCommand) {
                me.__hasEnterExecCommand = true;
                if (me.queryCommandState.apply(me, arguments) != -1) {
                    me.fireEvent('beforeexeccommand', cmdName);
                    result = this._callCmdFn('execCommand', arguments);
                    !me._ignoreContentChange && me.fireEvent('contentchange');
                    me.fireEvent('afterexeccommand', cmdName);
                }
                me.__hasEnterExecCommand = false;
            } else {
                result = this._callCmdFn('execCommand', arguments);
                !me._ignoreContentChange && me.fireEvent('contentchange')
            }
            !me._ignoreContentChange && me._selectionChange();
            return result;
        },

        /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @method  queryCommandState
         * @return { Number } number 返回放前命令的状态
         * 返回 -1 当前命令不可用
         * 返回 0 当前命令可用
         * 返回 1 当前命令已经执行过了
         * @example
         * ```javascript
         * editor.queryCommandState(cmdName)  => (-1|0|1)
         * ```
         */
        queryCommandState: function (cmdName) {
            return this._callCmdFn('queryCommandState', arguments);
        },

        /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @method queryCommandValue
         * @remind 只有部分插件有此方法
         * @return { * } 返回每个命令特定的当前状态值
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         */
        queryCommandValue: function (cmdName) {
            return this._callCmdFn('queryCommandValue', arguments);
        },

        /**
         * 检查编辑区域中是否有内容
         * @method  hasContents
         * @remind 默认有文本内容，或者有以下节点都不认为是空
         * <code>{table:1,ul:1,ol:1,dl:1,iframe:1,area:1,base:1,col:1,hr:1,img:1,embed:1,input:1,link:1,meta:1,param:1}</code>
         * @return { Boolean } 检查有内容返回true，否则返回false
         * @example
         * ```javascript
         * editor.hasContents()
         * ```
         */

        /**
         * 检查编辑区域中是否有内容，若包含参数tags中的节点类型，直接返回true
         * @method  hasContents
         * @return { Boolean } 若文档中包含tags数组里对应的tag，返回true，否则返回false
         * @example
         * ```javascript
         * editor.hasContents(['span']);
         * ```
         */
        hasContents: function (tags) {
            if (tags) {
                for (var i = 0, ci; ci = tags[i++];) {
                    if (this.document.getElementsByTagName(ci).length > 0) {
                        return true;
                    }
                }
            }
            if (!domUtils.isEmptyBlock(this.body)) {
                return true
            }
            //随时添加,定义的特殊标签如果存在，不能认为是空
            tags = ['div'];
            for (i = 0; ci = tags[i++];) {
                var nodes = domUtils.getElementsByTagName(this.document, ci);
                for (var n = 0, cn; cn = nodes[n++];) {
                    if (domUtils.isCustomeNode(cn)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 重置编辑器，可用来做多个tab使用同一个编辑器实例
         * @method  reset
         * @remind 此方法会清空编辑器内容，清空回退列表
         * @example
         * ```javascript
         * editor.reset()
         * ```
         */
        reset: function () {
            this.fireEvent('reset');
        },

        /**
         * 设置当前编辑区域可以编辑
         * @method setEnabled
         * @example
         * ```javascript
         * editor.setEnabled()
         * ```
         */
        setEnabled: function () {
            var me = this, range;
            if (me.body.contentEditable == 'false') {
                me.body.contentEditable = true;
                range = me.selection.getRange();
                //有可能内容丢失了
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                range.select(true);
                if (me.bkqueryCommandState) {
                    me.queryCommandState = me.bkqueryCommandState;
                    delete me.bkqueryCommandState;
                }
                me.fireEvent('selectionchange');
            }
        },

        /**
         * 设置当前编辑区域可以编辑
         * @method enable
         * @return { * } 返回setEnabled方法的返回值
         * @example
         * ```javascript
         * editor.enable()
         * ```
         * @see UE.Editor:setEnabled()
         */
        enable: function () {
            return this.setEnabled();
        },

        /** 设置当前编辑区域不可编辑
         * @method setDisabled
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method setDisabled
         * @param { String } except 例外命令的字符串
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.setDisabled('bold'); //禁用工具栏中除加粗之外的所有功能
         * ```
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method setDisabled
         * @param { Array } except 字符串数组，数组中的命令仍然可以执行
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.setDisabled(['bold','insertimage']); //禁用工具栏中除加粗和插入图片之外的所有功能
         * ```
         */
        setDisabled: function (except) {
            var me = this;
            except = except ? utils.isArray(except) ? except : [except] : [];
            if (me.body.contentEditable == 'true') {
                if (!me.lastBk) {
                    me.lastBk = me.selection.getRange().createBookmark(true);
                }
                me.body.contentEditable = false;
                me.bkqueryCommandState = me.queryCommandState;
                me.queryCommandState = function (type) {
                    if (utils.indexOf(except, type) != -1) {
                        return me.bkqueryCommandState.apply(me, arguments);
                    }
                    return -1;
                };
                me.fireEvent('selectionchange');
            }
        },

        /** 设置当前编辑区域不可编辑
         * @method disable
         * @see UE.Editor:setEnabled()
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method disable
         * @param { String } except 例外命令的字符串
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.disable('bold'); //禁用工具栏中除加粗之外的所有功能
         * ```
         * @see UE.Editor:setEnabled(String)
         */

        /** 设置当前编辑区域不可编辑,except中的命令除外
         * @method disable
         * @param { Array } except 字符串数组，数组中的命令仍然可以执行
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.disable(['bold','insertimage']); //禁用工具栏中除加粗和插入图片之外的所有功能
         * ```
         * @see UE.Editor:setEnabled(Array)
         */
        disable: function (except) {
            return this.setDisabled(except);
        },

        /**
         * 设置默认内容
         * @method _setDefaultContent
         * @private
         * @param  { String } cont 要存入的内容
         */
        _setDefaultContent: function () {
            function clear() {
                var me = this;
                if (me.document.getElementById('initContent')) {
                    me.body.innerHTML = '<p>' + (ie ? '' : '<br/>') + '</p>';
                    me.removeListener('firstBeforeExecCommand focus', clear);
                    setTimeout(function () {
                        me.focus();
                        me._selectionChange();
                    }, 0)
                }
            }

            return function (cont) {
                var me = this;
                me.body.innerHTML = '<p id="initContent">' + cont + '</p>';

                me.addListener('firstBeforeExecCommand focus', clear);
            }
        }(),

        /**
         * 显示编辑器，show方法的兼容版本
         * @method setShow
         * @private
         * @param  { String } cont 要存入的内容
         */
        setShow: function () {
            var me = this, range = me.selection.getRange();
            if (me.container.style.display == 'none') {
                //有可能内容丢失了
                try {
                    range.moveToBookmark(me.lastBk);
                    delete me.lastBk
                } catch (e) {
                    range.setStartAtFirst(me.body).collapse(true)
                }
                //ie下focus实效，所以做了个延迟
                setTimeout(function () {
                    range.select(true);
                }, 100);
                me.container.style.display = '';
            }
        },

        /**
         * 显示编辑器
         * @method show
         * @param  { String } cont 要存入的内容
         * @example
         * ```javascript
         * editor.show()
         * ```
         * @see UE.Editor:setShow(String)
         */
        show: function () {
            return this.setShow();
        },

        /**
         * 隐藏编辑器，hide方法的兼容版本
         * @method setHide
         * @private
         */
        setHide: function () {
            var me = this;
            if (!me.lastBk) {
                me.lastBk = me.selection.getRange().createBookmark(true);
            }
            me.container.style.display = 'none'
        },

        /**
         * 隐藏编辑器
         * @method hide
         * @example
         * ```javascript
         * editor.hide()
         * ```
         * @see UE.Editor:setHide()
         */
        hide: function () {
            return this.setHide();
        },

        /**
         * 根据指定的路径，获取对应的语言资源
         * @method getLang
         * @param { String } path 路径根据的是lang目录下的语言文件的路径结构
         * @return { PlainObject | String } 根据路径返回语言资源的Json格式对象或者语言字符串
         * @example
         * ```javascript
         * editor.getLang('contextMenu.delete'); //如果当前是中文，那返回是的是'删除'
         * ```
         */
        getLang: function (path) {
            var lang = UE.I18N[this.options.lang];
            if (!lang) {
                throw Error("not import language file");
            }
            path = (path || "").split(".");
            for (var i = 0, ci; ci = path[i++];) {
                lang = lang[ci];
                if (!lang)break;
            }
            return lang;
        },

        /**
         * 计算编辑器当前html内容的长度
         * @method  getContentLength
         * @return { Number } 返回计算的长度
         * @example
         * ```javascript
         * editor.getContentLength()
         * ```
         */

        /**
         * 计算编辑器当前存文本内容的长度
         * @method  getContentLength
         * @param { Boolean } ingoneHtml
         * @return { Number } 返回计算的长度，内容中有hr/img/iframe标签，长度加1
         * @example
         * ```javascript
         * editor.getContentLength(true)
         * ```
         */

        /**
         * 计算编辑器当前内容的长度
         * @method  getContentLength
         * @param { Boolean } ingoneHtml
         * @param { Array } tagNames
         * @return { Number } 返回计算的长度，内容中有hr/img/iframe标签或者参数tagNames中的标签，长度加1
         * @example
         * ```javascript
         * editor.getContentLength(true, ['em','strong'])
         * ```
         */
        getContentLength: function (ingoneHtml, tagNames) {
            var count = this.getContent(false, false, true).length;
            if (ingoneHtml) {
                tagNames = (tagNames || []).concat([ 'hr', 'img', 'iframe']);
                count = this.getContentTxt().replace(/[\t\r\n]+/g, '').length;
                for (var i = 0, ci; ci = tagNames[i++];) {
                    count += this.document.getElementsByTagName(ci).length;
                }
            }
            return count;
        },

        /**
         * 添加输入过滤规则
         * @method  addInputRule
         * @param { Function } rule 要添加的过滤规则
         * @example
         * ```javascript
         * editor.addOutputRule(function(root){
         *   $.each(root.getNodesByTagName('p'),function(i,node){
         *       node.tagName="div";
         *   });
         * });
         * ```
         */
        addInputRule: function (rule) {
            this.inputRules.push(rule);
        },

        /**
         * 根据输入过滤规则，过滤编辑器内容
         * @method  filterInputRule
         * @param { Element } root 要过滤的文档节点
         * @example
         * ```javascript
         * editor.filterInputRule(editor.body);
         * ```
         */
        filterInputRule: function (root) {
            for (var i = 0, ci; ci = this.inputRules[i++];) {
                ci.call(this, root)
            }
        },

        /**
         * 添加输出过滤规则
         * @method  addOutputRule
         * @param { PlainObject } rule 要添加的过滤规则
         * @example
         * ```javascript
         * editor.addOutputRule(rule);
         * ```
         */
        addOutputRule: function (rule) {
            this.outputRules.push(rule)
        },

        /**
         * 根据输出过滤规则，过滤编辑器内容
         * @method  filterOutputRule
         * @param { Element } root 要过滤的文档节点
         * @example
         * ```javascript
         * editor.filterOutputRule(editor.body);
         * ```
         */
        filterOutputRule: function (root) {
            for (var i = 0, ci; ci = this.outputRules[i++];) {
                ci.call(this, root)
            }
        }
    };
    utils.inherits(Editor, EventBase);
})();
