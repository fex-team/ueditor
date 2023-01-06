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

(function() {
  var uid = 0,
    _selectionChangeTimer;

  /**
     * 获取编辑器的html内容，赋值到编辑器所在表单的textarea文本域里面
     * @private
     * @method setValue
     * @param { UE.Editor } editor 编辑器事例
     */
  function setValue(form, editor) {
    var textarea;
    if (editor.options.textarea) {
      if (utils.isString(editor.options.textarea)) {
        for (
          var i = 0, ti, tis = domUtils.getElementsByTagName(form, "textarea");
          (ti = tis[i++]);

        ) {
          if (ti.id == "ueditor_textarea_" + editor.options.textarea) {
            textarea = ti;
            break;
          }
        }
      } else {
        textarea = editor.textarea;
      }
    }
    if (!textarea) {
      form.appendChild(
        (textarea = domUtils.createElement(document, "textarea", {
          name: editor.options.textarea,
          id: "ueditor_textarea_" + editor.options.textarea,
          style: "display:none"
        }))
      );
      //不要产生多个textarea
      editor.textarea = textarea;
    }
    !textarea.getAttribute("name") &&
      textarea.setAttribute("name", editor.options.textarea);
    textarea.value = editor.hasContents()
      ? editor.options.allHtmlEnabled
        ? editor.getAllHtml()
        : editor.getContent(null, null, true)
      : "";
  }
  function loadPlugins(me) {
    //初始化插件
    for (var pi in UE.plugins) {
      UE.plugins[pi].call(me);
    }
  }
  function checkCurLang(I18N) {
    for (var lang in I18N) {
      return lang;
    }
  }

  function langReadied(me) {
    me.langIsReady = true;

    me.fireEvent("langReady");
  }

  /**
     * 编辑器准备就绪后会触发该事件
     * @module UE
     * @class Editor
     * @event ready
     * @remind render方法执行完成之后,会触发该事件
     * @remind
     * @example
     * ```javascript
     * editor.addListener( 'ready', function( editor ) {
     *     editor.execCommand( 'focus' ); //编辑器家在完成后，让编辑器拿到焦点
     * } );
     * ```
     */
  /**
     * 执行destroy方法,会触发该事件
     * @module UE
     * @class Editor
     * @event destroy
     * @see UE.Editor:destroy()
     */
  /**
     * 执行reset方法,会触发该事件
     * @module UE
     * @class Editor
     * @event reset
     * @see UE.Editor:reset()
     */
  /**
     * 执行focus方法,会触发该事件
     * @module UE
     * @class Editor
     * @event focus
     * @see UE.Editor:focus(Boolean)
     */
  /**
     * 语言加载完成会触发该事件
     * @module UE
     * @class Editor
     * @event langReady
     */
  /**
     * 运行命令之后会触发该命令
     * @module UE
     * @class Editor
     * @event beforeExecCommand
     */
  /**
     * 运行命令之后会触发该命令
     * @module UE
     * @class Editor
     * @event afterExecCommand
     */
  /**
     * 运行命令之前会触发该命令
     * @module UE
     * @class Editor
     * @event firstBeforeExecCommand
     */
  /**
     * 在getContent方法执行之前会触发该事件
     * @module UE
     * @class Editor
     * @event beforeGetContent
     * @see UE.Editor:getContent()
     */
  /**
     * 在getContent方法执行之后会触发该事件
     * @module UE
     * @class Editor
     * @event afterGetContent
     * @see UE.Editor:getContent()
     */
  /**
     * 在getAllHtml方法执行时会触发该事件
     * @module UE
     * @class Editor
     * @event getAllHtml
     * @see UE.Editor:getAllHtml()
     */
  /**
     * 在setContent方法执行之前会触发该事件
     * @module UE
     * @class Editor
     * @event beforeSetContent
     * @see UE.Editor:setContent(String)
     */
  /**
     * 在setContent方法执行之后会触发该事件
     * @module UE
     * @class Editor
     * @event afterSetContent
     * @see UE.Editor:setContent(String)
     */
  /**
     * 每当编辑器内部选区发生改变时，将触发该事件
     * @event selectionchange
     * @warning 该事件的触发非常频繁，不建议在该事件的处理过程中做重量级的处理
     * @example
     * ```javascript
     * editor.addListener( 'selectionchange', function( editor ) {
     *     console.log('选区发生改变');
     * }
     */
  /**
     * 在所有selectionchange的监听函数执行之前，会触发该事件
     * @module UE
     * @class Editor
     * @event beforeSelectionChange
     * @see UE.Editor:selectionchange
     */
  /**
     * 在所有selectionchange的监听函数执行完之后，会触发该事件
     * @module UE
     * @class Editor
     * @event afterSelectionChange
     * @see UE.Editor:selectionchange
     */
  /**
     * 编辑器内容发生改变时会触发该事件
     * @module UE
     * @class Editor
     * @event contentChange
     */

  /**
     * 以默认参数构建一个编辑器实例
     * @constructor
     * @remind 通过 改构造方法实例化的编辑器,不带ui层.需要render到一个容器,编辑器实例才能正常渲染到页面
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */

  /**
     * 以给定的参数集合创建一个编辑器实例，对于未指定的参数，将应用默认参数。
     * @constructor
     * @remind 通过 改构造方法实例化的编辑器,不带ui层.需要render到一个容器,编辑器实例才能正常渲染到页面
     * @param { Object } setting 创建编辑器的参数
     * @example
     * ```javascript
     * var editor = new UE.Editor();
     * editor.execCommand('blod');
     * ```
     * @see UE.Config
     */
  var Editor = (UE.Editor = function(options) {
    var me = this;
    me.uid = uid++;
    EventBase.call(me);
    me.commands = {};
    me.options = utils.extend(utils.clone(options || {}), UEDITOR_CONFIG, true);
    me.shortcutkeys = {};
    me.inputRules = [];
    me.outputRules = [];
    //设置默认的常用属性
    me.setOpt(Editor.defaultOptions(me));

    /* 尝试异步加载后台配置 */
    me.loadServerConfig();

    if (!utils.isEmptyObject(UE.I18N)) {
      //修改默认的语言类型
      me.options.lang = checkCurLang(UE.I18N);
      UE.plugin.load(me);
      langReadied(me);
    } else {
      utils.loadFile(
        document,
        {
          src:
            me.options.langPath +
              me.options.lang +
              "/" +
              me.options.lang +
              ".js",
          tag: "script",
          type: "text/javascript",
          defer: "defer"
        },
        function() {
          UE.plugin.load(me);
          langReadied(me);
        }
      );
    }

    UE.instants["ueditorInstant" + me.uid] = me;
  });
  Editor.prototype = {
    registerCommand: function(name, obj) {
      this.commands[name] = obj;
    },
    /**
         * 编辑器对外提供的监听ready事件的接口， 通过调用该方法，达到的效果与监听ready事件是一致的
         * @method ready
         * @param { Function } fn 编辑器ready之后所执行的回调, 如果在注册事件之前编辑器已经ready，将会
         * 立即触发该回调。
         * @remind 需要等待编辑器加载完成后才能执行的代码,可以使用该方法传入
         * @example
         * ```javascript
         * editor.ready( function( editor ) {
         *     editor.setContent('初始化完毕');
         * } );
         * ```
         * @see UE.Editor.event:ready
         */
    ready: function(fn) {
      var me = this;
      if (fn) {
        me.isReady ? fn.apply(me) : me.addListener("ready", fn);
      }
    },

    /**
         * 该方法是提供给插件里面使用，设置配置项默认值
         * @method setOpt
         * @warning 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
         * @warning 该方法仅供编辑器插件内部和编辑器初始化时调用，其他地方不能调用。
         * @param { String } key 编辑器的可接受的选项名称
         * @param { * } val  该选项可接受的值
         * @example
         * ```javascript
         * editor.setOpt( 'initContent', '欢迎使用编辑器' );
         * ```
         */

    /**
         * 该方法是提供给插件里面使用，以{key:value}集合的方式设置插件内用到的配置项默认值
         * @method setOpt
         * @warning 三处设置配置项的优先级: 实例化时传入参数 > setOpt()设置 > config文件里设置
         * @warning 该方法仅供编辑器插件内部和编辑器初始化时调用，其他地方不能调用。
         * @param { Object } options 将要设置的选项的键值对对象
         * @example
         * ```javascript
         * editor.setOpt( {
         *     'initContent': '欢迎使用编辑器'
         * } );
         * ```
         */
    setOpt: function(key, val) {
      var obj = {};
      if (utils.isString(key)) {
        obj[key] = val;
      } else {
        obj = key;
      }
      utils.extend(this.options, obj, true);
    },
    getOpt: function(key) {
      return this.options[key];
    },
    /**
         * 销毁编辑器实例，使用textarea代替
         * @method destroy
         * @example
         * ```javascript
         * editor.destroy();
         * ```
         */
    destroy: function() {
      var me = this;
      me.fireEvent("destroy");
      var container = me.container.parentNode;
      var textarea = me.textarea;
      if (!textarea) {
        textarea = document.createElement("textarea");
        container.parentNode.insertBefore(textarea, container);
      } else {
        textarea.style.display = "";
      }

      textarea.style.width = me.iframe.offsetWidth + "px";
      textarea.style.height = me.iframe.offsetHeight + "px";
      textarea.value = me.getContent();
      textarea.id = me.key;
      container.innerHTML = "";
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
         * @remind 执行该方法,会触发ready事件
         * @warning 必须且只能调用一次
         */

    /**
         * 渲染编辑器的DOM到指定容器
         * @method render
         * @param { Element } containerDom 直接指定容器对象
         * @remind 执行该方法,会触发ready事件
         * @warning 必须且只能调用一次
         */
    render: function(container) {
      var me = this,
        options = me.options,
        getStyleValue = function(attr) {
          return parseInt(domUtils.getComputedStyle(container, attr));
        };
      if (utils.isString(container)) {
        container = document.getElementById(container);
      }
      if (container) {
        if (options.initialFrameWidth) {
          options.minFrameWidth = options.initialFrameWidth;
        } else {
          options.minFrameWidth = options.initialFrameWidth =
            container.offsetWidth;
        }
        if (options.initialFrameHeight) {
          options.minFrameHeight = options.initialFrameHeight;
        } else {
          options.initialFrameHeight = options.minFrameHeight =
            container.offsetHeight;
        }

        container.style.width = /%$/.test(options.initialFrameWidth)
          ? "100%"
          : options.initialFrameWidth -
              getStyleValue("padding-left") -
              getStyleValue("padding-right") +
              "px";
        container.style.height = /%$/.test(options.initialFrameHeight)
          ? "100%"
          : options.initialFrameHeight -
              getStyleValue("padding-top") -
              getStyleValue("padding-bottom") +
              "px";

        container.style.zIndex = options.zIndex;

        var html =
          (ie && browser.version < 9 ? "" : "<!DOCTYPE html>") +
          "<html xmlns='http://www.w3.org/1999/xhtml' class='view' >" +
          "<head>" +
          "<style type='text/css'>" +
          //设置四周的留边
          ".view{padding:0;word-wrap:break-word;cursor:text;height:90%;}\n" +
          //设置默认字体和字号
          //font-family不能呢随便改，在safari下fillchar会有解析问题
          "body{margin:8px;font-family:sans-serif;font-size:16px;}" +
          //设置段落间距
          "p{margin:5px 0;}</style>" +
          (options.iframeCssUrl
            ? "<link rel='stylesheet' type='text/css' href='" +
                utils.unhtml(options.iframeCssUrl) +
                "'/>"
            : "") +
          (options.initialStyle
            ? "<style>" + options.initialStyle + "</style>"
            : "") +
          "</head>" +
          "<body class='view' ></body>" +
          "<script type='text/javascript' " +
          (ie ? "defer='defer'" : "") +
          " id='_initialScript'>" +
          "setTimeout(function(){editor = window.parent.UE.instants['ueditorInstant" +
          me.uid +
          "'];editor._setup(document);},0);" +
          "var _tmpScript = document.getElementById('_initialScript');_tmpScript.parentNode.removeChild(_tmpScript);" +
          "</script>" +
          (options.iframeJsUrl
            ? "<script type='text/javascript' src='" +
                utils.unhtml(options.iframeJsUrl) +
                "'></script>"
            : "") +
          "</html>";

        container.appendChild(
          domUtils.createElement(document, "iframe", {
            id: "ueditor_" + me.uid,
            width: "100%",
            height: "100%",
            frameborder: "0",
            //先注释掉了，加的原因忘记了，但开启会直接导致全屏模式下内容多时不会出现滚动条
            //                    scrolling :'no',
            src:
              "javascript:void(function(){document.open();" +
                (options.customDomain && document.domain != location.hostname
                  ? 'document.domain="' + document.domain + '";'
                  : "") +
                'document.write("' +
                html +
                '");document.close();}())'
          })
        );
        container.style.overflow = "hidden";
        //解决如果是给定的百分比，会导致高度算不对的问题
        setTimeout(function() {
          if (/%$/.test(options.initialFrameWidth)) {
            options.minFrameWidth = options.initialFrameWidth =
              container.offsetWidth;
            //如果这里给定宽度，会导致ie在拖动窗口大小时，编辑区域不随着变化
            //                        container.style.width = options.initialFrameWidth + 'px';
          }
          if (/%$/.test(options.initialFrameHeight)) {
            options.minFrameHeight = options.initialFrameHeight =
              container.offsetHeight;
            container.style.height = options.initialFrameHeight + "px";
          }
        });
      }
    },

    /**
         * 编辑器初始化
         * @method _setup
         * @private
         * @param { Element } doc 编辑器Iframe中的文档对象
         */
    _setup: function(doc) {
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
      for (
        var form = this.iframe.parentNode;
        !domUtils.isBody(form);
        form = form.parentNode
      ) {
        if (form.tagName == "FORM") {
          me.form = form;
          if (me.options.autoSyncData) {
            domUtils.on(me.window, "blur", function() {
              setValue(form, me);
            });
          } else {
            domUtils.on(form, "submit", function() {
              setValue(this, me);
            });
          }
          break;
        }
      }
      if (options.initialContent) {
        if (options.autoClearinitialContent) {
          var oldExecCommand = me.execCommand;
          me.execCommand = function() {
            me.fireEvent("firstBeforeExecCommand");
            return oldExecCommand.apply(me, arguments);
          };
          this._setDefaultContent(options.initialContent);
        } else this.setContent(options.initialContent, false, true);
      }

      //编辑器不能为空内容

      if (domUtils.isEmptyNode(me.body)) {
        me.body.innerHTML = "<p>" + (browser.ie ? "" : "<br/>") + "</p>";
      }
      //如果要求focus, 就把光标定位到内容开始
      if (options.focus) {
        setTimeout(function() {
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
        me.document.execCommand("2D-position", false, false);
      } catch (e) {}
      try {
        me.document.execCommand("enableInlineTableEditing", false, false);
      } catch (e) {}
      try {
        me.document.execCommand("enableObjectResizing", false, false);
      } catch (e) {}

      //挂接快捷键
      me._bindshortcutKeys();
      me.isReady = 1;
      me.fireEvent("ready");
      options.onready && options.onready.call(me);
      if (!browser.ie9below) {
        domUtils.on(me.window, ["blur", "focus"], function(e) {
          //chrome下会出现alt+tab切换时，导致选区位置不对
          if (e.type == "blur") {
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
            } catch (e) {}
          }
        });
      }
      //trace:1518 ff3.6body不够寛，会导致点击空白处无法获得焦点
      if (browser.gecko && browser.version <= 10902) {
        //修复ff3.6初始化进来，不能点击获得焦点
        me.body.contentEditable = false;
        setTimeout(function() {
          me.body.contentEditable = true;
        }, 100);
        setInterval(function() {
          me.body.style.height = me.iframe.offsetHeight - 20 + "px";
        }, 100);
      }

      !options.isShow && me.setHide();
      options.readonly && me.setDisabled();
    },

    /**
         * 同步数据到编辑器所在的form
         * 从编辑器的容器节点向上查找form元素，若找到，就同步编辑内容到找到的form里，为提交数据做准备，主要用于是手动提交的情况
         * 后台取得数据的键值，使用你容器上的name属性，如果没有就使用参数里的textarea项
         * @method sync
         * @example
         * ```javascript
         * editor.sync();
         * form.sumbit(); //form变量已经指向了form元素
         * ```
         */

    /**
         * 根据传入的formId，在页面上查找要同步数据的表单，若找到，就同步编辑内容到找到的form里，为提交数据做准备
         * 后台取得数据的键值，该键值默认使用给定的编辑器容器的name属性，如果没有name属性则使用参数项里给定的“textarea”项
         * @method sync
         * @param { String } formID 指定一个要同步数据的form的id,编辑器的数据会同步到你指定form下
         */
    sync: function(formId) {
      var me = this,
        form = formId
          ? document.getElementById(formId)
          : domUtils.findParent(
              me.iframe.parentNode,
              function(node) {
                return node.tagName == "FORM";
              },
              true
            );
      form && setValue(form, me);
    },

    /**
         * 设置编辑器高度
         * @method setHeight
         * @remind 当配置项autoHeightEnabled为真时,该方法无效
         * @param { Number } number 设置的高度值，纯数值，不带单位
         * @example
         * ```javascript
         * editor.setHeight(number);
         * ```
         */
    setHeight: function(height, notSetHeight) {
      if (height !== parseInt(this.iframe.parentNode.style.height)) {
        this.iframe.parentNode.style.height = height + "px";
      }
      !notSetHeight &&
        (this.options.minFrameHeight = this.options.initialFrameHeight = height);
      this.body.style.height = height + "px";
      !notSetHeight && this.trigger("setHeight");
    },

    /**
         * 为编辑器的编辑命令提供快捷键
         * 这个接口是为插件扩展提供的接口,主要是为新添加的插件，如果需要添加快捷键，所提供的接口
         * @method addshortcutkey
         * @param { Object } keyset 命令名和快捷键键值对对象，多个按钮的快捷键用“＋”分隔
         * @example
         * ```javascript
         * editor.addshortcutkey({
         *     "Bold" : "ctrl+66",//^B
         *     "Italic" : "ctrl+73", //^I
         * });
         * ```
         */
    /**
         * 这个接口是为插件扩展提供的接口,主要是为新添加的插件，如果需要添加快捷键，所提供的接口
         * @method addshortcutkey
         * @param { String } cmd 触发快捷键时，响应的命令
         * @param { String } keys 快捷键的字符串，多个按钮用“＋”分隔
         * @example
         * ```javascript
         * editor.addshortcutkey("Underline", "ctrl+85"); //^U
         * ```
         */
    addshortcutkey: function(cmd, keys) {
      var obj = {};
      if (keys) {
        obj[cmd] = keys;
      } else {
        obj = cmd;
      }
      utils.extend(this.shortcutkeys, obj);
    },

    /**
         * 对编辑器设置keydown事件监听，绑定快捷键和命令，当快捷键组合触发成功，会响应对应的命令
         * @method _bindshortcutKeys
         * @private
         */
    _bindshortcutKeys: function() {
      var me = this,
        shortcutkeys = this.shortcutkeys;
      me.addListener("keydown", function(type, e) {
        var keyCode = e.keyCode || e.which;
        for (var i in shortcutkeys) {
          var tmp = shortcutkeys[i].split(",");
          for (var t = 0, ti; (ti = tmp[t++]); ) {
            ti = ti.split(":");
            var key = ti[0],
              param = ti[1];
            if (
              /^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) ||
              /^(\d+)$/.test(key)
            ) {
              if (
                ((RegExp.$1 == "ctrl" ? e.ctrlKey || e.metaKey : 0) &&
                  (RegExp.$2 != "" ? e[RegExp.$2.slice(1) + "Key"] : 1) &&
                  keyCode == RegExp.$3) ||
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
         * @return { String } 编辑器的内容字符串, 如果编辑器的内容为空，或者是空的标签内容（如:”&lt;p&gt;&lt;br/&gt;&lt;/p&gt;“）， 则返回空字符串
         * @example
         * ```javascript
         * //编辑器html内容:<p>1<strong>2<em>34</em>5</strong>6</p>
         * var content = editor.getContent(); //返回值:<p>1<strong>2<em>34</em>5</strong>6</p>
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
         *      return editor.body.innerHTML === '欢迎使用UEditor'; //返回空字符串
         * } );
         * ```
         */
    getContent: function(cmd, fn, notSetCursor, ignoreBlank, formatter) {
      var me = this;
      if (cmd && utils.isFunction(cmd)) {
        fn = cmd;
        cmd = "";
      }
      if (fn ? !fn() : !this.hasContents()) {
        return "";
      }
      me.fireEvent("beforegetcontent");
      var root = UE.htmlparser(me.body.innerHTML, ignoreBlank);
      me.filterOutputRule(root);
      me.fireEvent("aftergetcontent", cmd, root);
      return root.toHtml(formatter);
    },

    /**
         * 取得完整的html代码，可以直接显示成完整的html文档
         * @method getAllHtml
         * @return { String } 编辑器的内容html文档字符串
         * @eaxmple
         * ```javascript
         * editor.getAllHtml(); //返回格式大致是: <html><head>...</head><body>...</body></html>
         * ```
         */
    getAllHtml: function() {
      var me = this,
        headHtml = [],
        html = "";
      me.fireEvent("getAllHtml", headHtml);
      if (browser.ie && browser.version > 8) {
        var headHtmlForIE9 = "";
        utils.each(me.document.styleSheets, function(si) {
          headHtmlForIE9 += si.href
            ? '<link rel="stylesheet" type="text/css" href="' + si.href + '" />'
            : "<style>" + si.cssText + "</style>";
        });
        utils.each(me.document.getElementsByTagName("script"), function(si) {
          headHtmlForIE9 += si.outerHTML;
        });
      }
      return (
        "<html><head>" +
        (me.options.charset
          ? '<meta http-equiv="Content-Type" content="text/html; charset=' +
              me.options.charset +
              '"/>'
          : "") +
        (headHtmlForIE9 ||
          me.document.getElementsByTagName("head")[0].innerHTML) +
        headHtml.join("\n") +
        "</head>" +
        "<body " +
        (ie && browser.version < 9 ? 'class="view"' : "") +
        ">" +
        me.getContent(null, null, true) +
        "</body></html>"
      );
    },

    /**
         * 得到编辑器的纯文本内容，但会保留段落格式
         * @method getPlainTxt
         * @return { String } 编辑器带段落格式的纯文本内容字符串
         * @example
         * ```javascript
         * //编辑器html内容:<p><strong>1</strong></p><p><strong>2</strong></p>
         * console.log(editor.getPlainTxt()); //输出:"1\n2\n
         * ```
         */
    getPlainTxt: function() {
      var reg = new RegExp(domUtils.fillChar, "g"),
        html = this.body.innerHTML.replace(/[\n\r]/g, ""); //ie要先去了\n在处理
      html = html
        .replace(/<(p|div)[^>]*>(<br\/?>|&nbsp;)<\/\1>/gi, "\n")
        .replace(/<br\/?>/gi, "\n")
        .replace(/<[^>/]+>/g, "")
        .replace(/(\n)?<\/([^>]+)>/g, function(a, b, c) {
          return dtd.$block[c] ? "\n" : b ? b : "";
        });
      //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
      return html
        .replace(reg, "")
        .replace(/\u00a0/g, " ")
        .replace(/&nbsp;/g, " ");
    },

    /**
         * 获取编辑器中的纯文本内容,没有段落格式
         * @method getContentTxt
         * @return { String } 编辑器不带段落格式的纯文本内容字符串
         * @example
         * ```javascript
         * //编辑器html内容:<p><strong>1</strong></p><p><strong>2</strong></p>
         * console.log(editor.getPlainTxt()); //输出:"12
         * ```
         */
    getContentTxt: function() {
      var reg = new RegExp(domUtils.fillChar, "g");
      //取出来的空格会有c2a0会变成乱码，处理这种情况\u00a0
      return this.body[browser.ie ? "innerText" : "textContent"]
        .replace(reg, "")
        .replace(/\u00a0/g, " ");
    },

    /**
         * 设置编辑器的内容，可修改编辑器当前的html内容
         * @method setContent
         * @warning 通过该方法插入的内容，是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @warning 该方法会触发selectionchange事件
         * @param { String } html 要插入的html内容
         * @example
         * ```javascript
         * editor.getContent('<p>test</p>');
         * ```
         */

    /**
         * 设置编辑器的内容，可修改编辑器当前的html内容
         * @method setContent
         * @warning 通过该方法插入的内容，是经过编辑器内置的过滤规则进行过滤后得到的内容
         * @warning 该方法会触发selectionchange事件
         * @param { String } html 要插入的html内容
         * @param { Boolean } isAppendTo 若传入true，不清空原来的内容，在最后插入内容，否则，清空内容再插入
         * @example
         * ```javascript
         * //假设设置前的编辑器内容是 <p>old text</p>
         * editor.setContent('<p>new text</p>', true); //插入的结果是<p>old text</p><p>new text</p>
         * ```
         */
    setContent: function(html, isAppendTo, notFireSelectionchange) {
      var me = this;

      me.fireEvent("beforesetcontent", html);
      var root = UE.htmlparser(html);
      me.filterInputRule(root);
      html = root.toHtml();

      me.body.innerHTML = (isAppendTo ? me.body.innerHTML : "") + html;

      function isCdataDiv(node) {
        return node.tagName == "DIV" && node.getAttribute("cdata_tag");
      }
      //给文本或者inline节点套p标签
      if (me.options.enterTag == "p") {
        var child = this.body.firstChild,
          tmpNode;
        if (
          !child ||
          (child.nodeType == 1 &&
            (dtd.$cdata[child.tagName] ||
              isCdataDiv(child) ||
              domUtils.isCustomeNode(child)) &&
            child === this.body.lastChild)
        ) {
          this.body.innerHTML =
            "<p>" +
            (browser.ie ? "&nbsp;" : "<br/>") +
            "</p>" +
            this.body.innerHTML;
        } else {
          var p = me.document.createElement("p");
          while (child) {
            while (
              child &&
              (child.nodeType == 3 ||
                (child.nodeType == 1 &&
                  dtd.p[child.tagName] &&
                  !dtd.$cdata[child.tagName]))
            ) {
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
                p = me.document.createElement("p");
              }
            }
            child = child.nextSibling;
          }
        }
      }
      me.fireEvent("aftersetcontent");
      me.fireEvent("contentchange");

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
    focus: function(toEnd) {
      try {
        var me = this,
          rng = me.selection.getRange();
        if (toEnd) {
          var node = me.body.lastChild;
          if (node && node.nodeType == 1 && !dtd.$empty[node.tagName]) {
            if (domUtils.isEmptyBlock(node)) {
              rng.setStartAtFirst(node);
            } else {
              rng.setStartAtLast(node);
            }
            rng.collapse(true);
          }
          rng.setCursor(true);
        } else {
          if (
            !rng.collapsed &&
            domUtils.isBody(rng.startContainer) &&
            rng.startOffset == 0
          ) {
            var node = me.body.firstChild;
            if (node && node.nodeType == 1 && !dtd.$empty[node.tagName]) {
              rng.setStartAtFirst(node).collapse(true);
            }
          }

          rng.select(true);
        }
        this.fireEvent("focus selectionchange");
      } catch (e) {}
    },
    isFocus: function() {
      return this.selection.isFocus();
    },
    blur: function() {
      var sel = this.selection.getNative();
      if (sel.empty && browser.ie) {
        var nativeRng = document.body.createTextRange();
        nativeRng.moveToElementText(document.body);
        nativeRng.collapse(true);
        nativeRng.select();
        sel.empty();
      } else {
        sel.removeAllRanges();
      }

      //this.fireEvent('blur selectionchange');
    },
    /**
         * 初始化UE事件及部分事件代理
         * @method _initEvents
         * @private
         */
    _initEvents: function() {
      var me = this,
        doc = me.document,
        win = me.window;
      me._proxyDomEvent = utils.bind(me._proxyDomEvent, me);
      domUtils.on(
        doc,
        [
          "click",
          "contextmenu",
          "mousedown",
          "keydown",
          "keyup",
          "keypress",
          "mouseup",
          "mouseover",
          "mouseout",
          "selectstart"
        ],
        me._proxyDomEvent
      );
      domUtils.on(win, ["focus", "blur"], me._proxyDomEvent);
      domUtils.on(me.body, "drop", function(e) {
        //阻止ff下默认的弹出新页面打开图片
        if (browser.gecko && e.stopPropagation) {
          e.stopPropagation();
        }
        me.fireEvent("contentchange");
      });
      domUtils.on(doc, ["mouseup", "keydown"], function(evt) {
        //特殊键不触发selectionchange
        if (
          evt.type == "keydown" &&
          (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey)
        ) {
          return;
        }
        if (evt.button == 2) return;
        me._selectionChange(250, evt);
      });
    },
    /**
         * 触发事件代理
         * @method _proxyDomEvent
         * @private
         * @return { * } fireEvent的返回值
         * @see UE.EventBase:fireEvent(String)
         */
    _proxyDomEvent: function(evt) {
      if (
        this.fireEvent("before" + evt.type.replace(/^on/, "").toLowerCase()) ===
        false
      ) {
        return false;
      }
      if (this.fireEvent(evt.type.replace(/^on/, ""), evt) === false) {
        return false;
      }
      return this.fireEvent(
        "after" + evt.type.replace(/^on/, "").toLowerCase()
      );
    },
    /**
         * 变化选区
         * @method _selectionChange
         * @private
         */
    _selectionChange: function(delay, evt) {
      var me = this;
      //有光标才做selectionchange 为了解决未focus时点击source不能触发更改工具栏状态的问题（source命令notNeedUndo=1）
      //            if ( !me.selection.isFocus() ){
      //                return;
      //            }

      var hackForMouseUp = false;
      var mouseX, mouseY;
      if (browser.ie && browser.version < 9 && evt && evt.type == "mouseup") {
        var range = this.selection.getRange();
        if (!range.collapsed) {
          hackForMouseUp = true;
          mouseX = evt.clientX;
          mouseY = evt.clientY;
        }
      }
      clearTimeout(_selectionChangeTimer);
      _selectionChangeTimer = setTimeout(function() {
        if (!me.selection || !me.selection.getNative()) {
          return;
        }
        //修复一个IE下的bug: 鼠标点击一段已选择的文本中间时，可能在mouseup后的一段时间内取到的range是在selection的type为None下的错误值.
        //IE下如果用户是拖拽一段已选择文本，则不会触发mouseup事件，所以这里的特殊处理不会对其有影响
        var ieRange;
        if (hackForMouseUp && me.selection.getNative().type == "None") {
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
          me.selection.getIERange = function() {
            return ieRange;
          };
        }
        me.selection.cache();
        if (bakGetIERange) {
          me.selection.getIERange = bakGetIERange;
        }
        if (me.selection._cachedRange && me.selection._cachedStartElement) {
          me.fireEvent("beforeselectionchange");
          // 第二个参数causeByUi为true代表由用户交互造成的selectionchange.
          me.fireEvent("selectionchange", !!evt);
          me.fireEvent("afterselectionchange");
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
    _callCmdFn: function(fnName, args) {
      var cmdName = args[0].toLowerCase(),
        cmd,
        cmdFn;
      cmd = this.commands[cmdName] || UE.commands[cmdName];
      cmdFn = cmd && cmd[fnName];
      //没有querycommandstate或者没有command的都默认返回0
      if ((!cmd || !cmdFn) && fnName == "queryCommandState") {
        return 0;
      } else if (cmdFn) {
        return cmdFn.apply(this, args);
      }
    },

    /**
         * 执行编辑命令cmdName，完成富文本编辑效果
         * @method execCommand
         * @param { String } cmdName 需要执行的命令
         * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
         * @return { * } 返回命令函数运行的返回值
         * @example
         * ```javascript
         * editor.execCommand(cmdName);
         * ```
         */
    execCommand: function(cmdName) {
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
          me.fireEvent("saveScene");
          me.fireEvent.apply(
            me,
            ["beforeexeccommand", cmdName].concat(arguments)
          );
          result = this._callCmdFn("execCommand", arguments);
          //保存场景时，做了内容对比，再看是否进行contentchange触发，这里多触发了一次，去掉
          //                    (!cmd.ignoreContentChange && !me._ignoreContentChange) && me.fireEvent('contentchange');
          me.fireEvent.apply(
            me,
            ["afterexeccommand", cmdName].concat(arguments)
          );
          me.fireEvent("saveScene");
        }
        me.__hasEnterExecCommand = false;
      } else {
        result = this._callCmdFn("execCommand", arguments);
        !me.__hasEnterExecCommand &&
          !cmd.ignoreContentChange &&
          !me._ignoreContentChange &&
          me.fireEvent("contentchange");
      }
      !me.__hasEnterExecCommand &&
        !cmd.ignoreContentChange &&
        !me._ignoreContentChange &&
        me._selectionChange();
      return result;
    },

    /**
         * 根据传入的command命令，查选编辑器当前的选区，返回命令的状态
         * @method  queryCommandState
         * @param { String } cmdName 需要查询的命令名称
         * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
         * @return { Number } number 返回放前命令的状态，返回值三种情况：(-1|0|1)
         * @example
         * ```javascript
         * editor.queryCommandState(cmdName)  => (-1|0|1)
         * ```
         * @see COMMAND.LIST
         */
    queryCommandState: function(cmdName) {
      return this._callCmdFn("queryCommandState", arguments);
    },

    /**
         * 根据传入的command命令，查选编辑器当前的选区，根据命令返回相关的值
         * @method queryCommandValue
         * @param { String } cmdName 需要查询的命令名称
         * @remind 具体命令的使用请参考<a href="#COMMAND.LIST">命令列表</a>
         * @remind 只有部分插件有此方法
         * @return { * } 返回每个命令特定的当前状态值
         * @grammar editor.queryCommandValue(cmdName)  =>  {*}
         * @see COMMAND.LIST
         */
    queryCommandValue: function(cmdName) {
      return this._callCmdFn("queryCommandValue", arguments);
    },

    /**
         * 检查编辑区域中是否有内容
         * @method  hasContents
         * @remind 默认有文本内容，或者有以下节点都不认为是空
         * table,ul,ol,dl,iframe,area,base,col,hr,img,embed,input,link,meta,param
         * @return { Boolean } 检查有内容返回true，否则返回false
         * @example
         * ```javascript
         * editor.hasContents()
         * ```
         */

    /**
         * 检查编辑区域中是否有内容，若包含参数tags中的节点类型，直接返回true
         * @method  hasContents
         * @param { Array } tags 传入数组判断时用到的节点类型
         * @return { Boolean } 若文档中包含tags数组里对应的tag，返回true，否则返回false
         * @example
         * ```javascript
         * editor.hasContents(['span']);
         * ```
         */
    hasContents: function(tags) {
      if (tags) {
        for (var i = 0, ci; (ci = tags[i++]); ) {
          if (this.document.getElementsByTagName(ci).length > 0) {
            return true;
          }
        }
      }
      if (!domUtils.isEmptyBlock(this.body)) {
        return true;
      }
      //随时添加,定义的特殊标签如果存在，不能认为是空
      tags = ["div"];
      for (i = 0; (ci = tags[i++]); ) {
        var nodes = domUtils.getElementsByTagName(this.document, ci);
        for (var n = 0, cn; (cn = nodes[n++]); ) {
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
         * @remind 此方法会清空编辑器内容，清空回退列表，会触发reset事件
         * @example
         * ```javascript
         * editor.reset()
         * ```
         */
    reset: function() {
      this.fireEvent("reset");
    },

    /**
         * 设置当前编辑区域可以编辑
         * @method setEnabled
         * @example
         * ```javascript
         * editor.setEnabled()
         * ```
         */
    setEnabled: function() {
      var me = this,
        range;
      if (me.body.contentEditable == "false") {
        me.body.contentEditable = true;
        range = me.selection.getRange();
        //有可能内容丢失了
        try {
          range.moveToBookmark(me.lastBk);
          delete me.lastBk;
        } catch (e) {
          range.setStartAtFirst(me.body).collapse(true);
        }
        range.select(true);
        if (me.bkqueryCommandState) {
          me.queryCommandState = me.bkqueryCommandState;
          delete me.bkqueryCommandState;
        }
        if (me.bkqueryCommandValue) {
          me.queryCommandValue = me.bkqueryCommandValue;
          delete me.bkqueryCommandValue;
        }
        me.fireEvent("selectionchange");
      }
    },
    enable: function() {
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
         * @param { Array } except 例外命令的字符串数组，数组中的命令仍然可以执行
         * @remind 即使设置了disable，此处配置的例外命令仍然可以执行
         * @example
         * ```javascript
         * editor.setDisabled(['bold','insertimage']); //禁用工具栏中除加粗和插入图片之外的所有功能
         * ```
         */
    setDisabled: function(except) {
      var me = this;
      except = except ? (utils.isArray(except) ? except : [except]) : [];
      if (me.body.contentEditable == "true") {
        if (!me.lastBk) {
          me.lastBk = me.selection.getRange().createBookmark(true);
        }
        me.body.contentEditable = false;
        me.bkqueryCommandState = me.queryCommandState;
        me.bkqueryCommandValue = me.queryCommandValue;
        me.queryCommandState = function(type) {
          if (utils.indexOf(except, type) != -1) {
            return me.bkqueryCommandState.apply(me, arguments);
          }
          return -1;
        };
        me.queryCommandValue = function(type) {
          if (utils.indexOf(except, type) != -1) {
            return me.bkqueryCommandValue.apply(me, arguments);
          }
          return null;
        };
        me.fireEvent("selectionchange");
      }
    },
    disable: function(except) {
      return this.setDisabled(except);
    },

    /**
         * 设置默认内容
         * @method _setDefaultContent
         * @private
         * @param  { String } cont 要存入的内容
         */
    _setDefaultContent: (function() {
      function clear() {
        var me = this;
        if (me.document.getElementById("initContent")) {
          me.body.innerHTML = "<p>" + (ie ? "" : "<br/>") + "</p>";
          me.removeListener("firstBeforeExecCommand focus", clear);
          setTimeout(function() {
            me.focus();
            me._selectionChange();
          }, 0);
        }
      }

      return function(cont) {
        var me = this;
        me.body.innerHTML = '<p id="initContent">' + cont + "</p>";

        me.addListener("firstBeforeExecCommand focus", clear);
      };
    })(),

    /**
         * 显示编辑器
         * @method setShow
         * @example
         * ```javascript
         * editor.setShow()
         * ```
         */
    setShow: function() {
      var me = this,
        range = me.selection.getRange();
      if (me.container.style.display == "none") {
        //有可能内容丢失了
        try {
          range.moveToBookmark(me.lastBk);
          delete me.lastBk;
        } catch (e) {
          range.setStartAtFirst(me.body).collapse(true);
        }
        //ie下focus实效，所以做了个延迟
        setTimeout(function() {
          range.select(true);
        }, 100);
        me.container.style.display = "";
      }
    },
    show: function() {
      return this.setShow();
    },
    /**
         * 隐藏编辑器
         * @method setHide
         * @example
         * ```javascript
         * editor.setHide()
         * ```
         */
    setHide: function() {
      var me = this;
      if (!me.lastBk) {
        me.lastBk = me.selection.getRange().createBookmark(true);
      }
      me.container.style.display = "none";
    },
    hide: function() {
      return this.setHide();
    },

    /**
         * 根据指定的路径，获取对应的语言资源
         * @method getLang
         * @param { String } path 路径根据的是lang目录下的语言文件的路径结构
         * @return { Object | String } 根据路径返回语言资源的Json格式对象或者语言字符串
         * @example
         * ```javascript
         * editor.getLang('contextMenu.delete'); //如果当前是中文，那返回是的是'删除'
         * ```
         */
    getLang: function(path) {
      var lang = UE.I18N[this.options.lang];
      if (!lang) {
        throw Error("not import language file");
      }
      path = (path || "").split(".");
      for (var i = 0, ci; (ci = path[i++]); ) {
        lang = lang[ci];
        if (!lang) break;
      }
      return lang;
    },

    /**
         * 计算编辑器html内容字符串的长度
         * @method  getContentLength
         * @return { Number } 返回计算的长度
         * @example
         * ```javascript
         * //编辑器html内容<p><strong>132</strong></p>
         * editor.getContentLength() //返回27
         * ```
         */
    /**
         * 计算编辑器当前纯文本内容的长度
         * @method  getContentLength
         * @param { Boolean } ingoneHtml 传入true时，只按照纯文本来计算
         * @return { Number } 返回计算的长度，内容中有hr/img/iframe标签，长度加1
         * @example
         * ```javascript
         * //编辑器html内容<p><strong>132</strong></p>
         * editor.getContentLength() //返回3
         * ```
         */
    getContentLength: function(ingoneHtml, tagNames) {
      var count = this.getContent(false, false, true).length;
      if (ingoneHtml) {
        tagNames = (tagNames || []).concat(["hr", "img", "iframe"]);
        count = this.getContentTxt().replace(/[\t\r\n]+/g, "").length;
        for (var i = 0, ci; (ci = tagNames[i++]); ) {
          count += this.document.getElementsByTagName(ci).length;
        }
      }
      return count;
    },

    /**
         * 注册输入过滤规则
         * @method  addInputRule
         * @param { Function } rule 要添加的过滤规则
         * @example
         * ```javascript
         * editor.addInputRule(function(root){
         *   $.each(root.getNodesByTagName('div'),function(i,node){
         *       node.tagName="p";
         *   });
         * });
         * ```
         */
    addInputRule: function(rule) {
      this.inputRules.push(rule);
    },

    /**
         * 执行注册的过滤规则
         * @method  filterInputRule
         * @param { UE.uNode } root 要过滤的uNode节点
         * @remind 执行editor.setContent方法和执行'inserthtml'命令后，会运行该过滤函数
         * @example
         * ```javascript
         * editor.filterInputRule(editor.body);
         * ```
         * @see UE.Editor:addInputRule
         */
    filterInputRule: function(root) {
      for (var i = 0, ci; (ci = this.inputRules[i++]); ) {
        ci.call(this, root);
      }
    },

    /**
         * 注册输出过滤规则
         * @method  addOutputRule
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
    addOutputRule: function(rule) {
      this.outputRules.push(rule);
    },

    /**
         * 根据输出过滤规则，过滤编辑器内容
         * @method  filterOutputRule
         * @remind 执行editor.getContent方法的时候，会先运行该过滤函数
         * @param { UE.uNode } root 要过滤的uNode节点
         * @example
         * ```javascript
         * editor.filterOutputRule(editor.body);
         * ```
         * @see UE.Editor:addOutputRule
         */
    filterOutputRule: function(root) {
      for (var i = 0, ci; (ci = this.outputRules[i++]); ) {
        ci.call(this, root);
      }
    },

    /**
         * 根据action名称获取请求的路径
         * @method  getActionUrl
         * @remind 假如没有设置serverUrl,会根据imageUrl设置默认的controller路径
         * @param { String } action action名称
         * @example
         * ```javascript
         * editor.getActionUrl('config'); //返回 "/ueditor/php/controller.php?action=config"
         * editor.getActionUrl('image'); //返回 "/ueditor/php/controller.php?action=uplaodimage"
         * editor.getActionUrl('scrawl'); //返回 "/ueditor/php/controller.php?action=uplaodscrawl"
         * editor.getActionUrl('imageManager'); //返回 "/ueditor/php/controller.php?action=listimage"
         * ```
         */
    getActionUrl: function(action) {
      var actionName = this.getOpt(action) || action,
        imageUrl = this.getOpt("imageUrl"),
        serverUrl = this.getOpt("serverUrl");

      if (!serverUrl && imageUrl) {
        serverUrl = imageUrl.replace(/^(.*[\/]).+([\.].+)$/, "$1controller$2");
      }

      if (serverUrl) {
        serverUrl =
          serverUrl +
          (serverUrl.indexOf("?") == -1 ? "?" : "&") +
          "action=" +
          (actionName || "");
        return utils.formatUrl(serverUrl);
      } else {
        return "";
      }
    }
  };
  utils.inherits(Editor, EventBase);
})();
