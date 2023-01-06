///import core
///commands 全屏
///commandsName FullScreen
///commandsTitle  全屏
(function() {
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    UIBase = baidu.editor.ui.UIBase,
    domUtils = baidu.editor.dom.domUtils;
  var nodeStack = [];

  function EditorUI(options) {
    this.initOptions(options);
    this.initEditorUI();
  }

  EditorUI.prototype = {
    uiName: "editor",
    initEditorUI: function() {
      this.editor.ui = this;
      this._dialogs = {};
      this.initUIBase();
      this._initToolbars();
      var editor = this.editor,
        me = this;

      editor.addListener("ready", function() {
        //提供getDialog方法
        editor.getDialog = function(name) {
          return editor.ui._dialogs[name + "Dialog"];
        };
        domUtils.on(editor.window, "scroll", function(evt) {
          baidu.editor.ui.Popup.postHide(evt);
        });
        //提供编辑器实时宽高(全屏时宽高不变化)
        editor.ui._actualFrameWidth = editor.options.initialFrameWidth;

        UE.browser.ie &&
          UE.browser.version === 6 &&
          editor.container.ownerDocument.execCommand(
            "BackgroundImageCache",
            false,
            true
          );

        //display bottom-bar label based on config
        if (editor.options.elementPathEnabled) {
          editor.ui.getDom("elementpath").innerHTML =
            '<div class="edui-editor-breadcrumb">' +
            editor.getLang("elementPathTip") +
            ":</div>";
        }
        if (editor.options.wordCount) {
          function countFn() {
            setCount(editor, me);
            domUtils.un(editor.document, "click", arguments.callee);
          }
          domUtils.on(editor.document, "click", countFn);
          editor.ui.getDom("wordcount").innerHTML = editor.getLang(
            "wordCountTip"
          );
        }
        editor.ui._scale();
        if (editor.options.scaleEnabled) {
          if (editor.autoHeightEnabled) {
            editor.disableAutoHeight();
          }
          me.enableScale();
        } else {
          me.disableScale();
        }
        if (
          !editor.options.elementPathEnabled &&
          !editor.options.wordCount &&
          !editor.options.scaleEnabled
        ) {
          editor.ui.getDom("elementpath").style.display = "none";
          editor.ui.getDom("wordcount").style.display = "none";
          editor.ui.getDom("scale").style.display = "none";
        }

        if (!editor.selection.isFocus()) return;
        editor.fireEvent("selectionchange", false, true);
      });

      editor.addListener("mousedown", function(t, evt) {
        var el = evt.target || evt.srcElement;
        baidu.editor.ui.Popup.postHide(evt, el);
        baidu.editor.ui.ShortCutMenu.postHide(evt);
      });
      editor.addListener("delcells", function() {
        if (UE.ui["edittip"]) {
          new UE.ui["edittip"](editor);
        }
        editor.getDialog("edittip").open();
      });

      var pastePop,
        isPaste = false,
        timer;
      editor.addListener("afterpaste", function() {
        if (editor.queryCommandState("pasteplain")) return;
        if (baidu.editor.ui.PastePicker) {
          pastePop = new baidu.editor.ui.Popup({
            content: new baidu.editor.ui.PastePicker({ editor: editor }),
            editor: editor,
            className: "edui-wordpastepop"
          });
          pastePop.render();
        }
        isPaste = true;
      });

      editor.addListener("afterinserthtml", function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
          if (pastePop && (isPaste || editor.ui._isTransfer)) {
            if (pastePop.isHidden()) {
              var span = domUtils.createElement(editor.document, "span", {
                style: "line-height:0px;",
                innerHTML: "\ufeff"
              }),
                range = editor.selection.getRange();
              range.insertNode(span);
              var tmp = getDomNode(span, "firstChild", "previousSibling");
              tmp &&
                pastePop.showAnchor(tmp.nodeType == 3 ? tmp.parentNode : tmp);
              domUtils.remove(span);
            } else {
              pastePop.show();
            }
            delete editor.ui._isTransfer;
            isPaste = false;
          }
        }, 200);
      });
      editor.addListener("contextmenu", function(t, evt) {
        baidu.editor.ui.Popup.postHide(evt);
      });
      editor.addListener("keydown", function(t, evt) {
        if (pastePop) pastePop.dispose(evt);
        var keyCode = evt.keyCode || evt.which;
        if (evt.altKey && keyCode == 90) {
          UE.ui.buttons["fullscreen"].onclick();
        }
      });
      editor.addListener("wordcount", function(type) {
        setCount(this, me);
      });
      function setCount(editor, ui) {
        editor.setOpt({
          wordCount: true,
          maximumWords: 10000,
          wordCountMsg:
            editor.options.wordCountMsg || editor.getLang("wordCountMsg"),
          wordOverFlowMsg:
            editor.options.wordOverFlowMsg || editor.getLang("wordOverFlowMsg")
        });
        var opt = editor.options,
          max = opt.maximumWords,
          msg = opt.wordCountMsg,
          errMsg = opt.wordOverFlowMsg,
          countDom = ui.getDom("wordcount");
        if (!opt.wordCount) {
          return;
        }
        var count = editor.getContentLength(true);
        if (count > max) {
          countDom.innerHTML = errMsg;
          editor.fireEvent("wordcountoverflow");
        } else {
          countDom.innerHTML = msg
            .replace("{#leave}", max - count)
            .replace("{#count}", count);
        }
      }

      editor.addListener("selectionchange", function() {
        if (editor.options.elementPathEnabled) {
          me[
            (editor.queryCommandState("elementpath") == -1 ? "dis" : "en") +
              "ableElementPath"
          ]();
        }
        if (editor.options.scaleEnabled) {
          me[
            (editor.queryCommandState("scale") == -1 ? "dis" : "en") +
              "ableScale"
          ]();
        }
      });
      var popup = new baidu.editor.ui.Popup({
        editor: editor,
        content: "",
        className: "edui-bubble",
        _onEditButtonClick: function() {
          this.hide();
          editor.ui._dialogs.linkDialog.open();
        },
        _onImgEditButtonClick: function(name) {
          this.hide();
          editor.ui._dialogs[name] && editor.ui._dialogs[name].open();
        },
        _onImgSetFloat: function(value) {
          this.hide();
          editor.execCommand("imagefloat", value);
        },
        _setIframeAlign: function(value) {
          var frame = popup.anchorEl;
          var newFrame = frame.cloneNode(true);
          switch (value) {
            case -2:
              newFrame.setAttribute("align", "");
              break;
            case -1:
              newFrame.setAttribute("align", "left");
              break;
            case 1:
              newFrame.setAttribute("align", "right");
              break;
          }
          frame.parentNode.insertBefore(newFrame, frame);
          domUtils.remove(frame);
          popup.anchorEl = newFrame;
          popup.showAnchor(popup.anchorEl);
        },
        _updateIframe: function() {
          var frame = (editor._iframe = popup.anchorEl);
          if (domUtils.hasClass(frame, "ueditor_baidumap")) {
            editor.selection.getRange().selectNode(frame).select();
            editor.ui._dialogs.mapDialog.open();
            popup.hide();
          } else {
            editor.ui._dialogs.insertframeDialog.open();
            popup.hide();
          }
        },
        _onRemoveButtonClick: function(cmdName) {
          editor.execCommand(cmdName);
          this.hide();
        },
        queryAutoHide: function(el) {
          if (el && el.ownerDocument == editor.document) {
            if (
              el.tagName.toLowerCase() == "img" ||
              domUtils.findParentByTagName(el, "a", true)
            ) {
              return el !== popup.anchorEl;
            }
          }
          return baidu.editor.ui.Popup.prototype.queryAutoHide.call(this, el);
        }
      });
      popup.render();
      if (editor.options.imagePopup) {
        editor.addListener("mouseover", function(t, evt) {
          evt = evt || window.event;
          var el = evt.target || evt.srcElement;
          if (
            editor.ui._dialogs.insertframeDialog &&
            /iframe/gi.test(el.tagName)
          ) {
            var html = popup.formatHtml(
              "<nobr>" +
                editor.getLang("property") +
                ': <span onclick=$$._setIframeAlign(-2) class="edui-clickable">' +
                editor.getLang("default") +
                '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(-1) class="edui-clickable">' +
                editor.getLang("justifyleft") +
                '</span>&nbsp;&nbsp;<span onclick=$$._setIframeAlign(1) class="edui-clickable">' +
                editor.getLang("justifyright") +
                "</span>&nbsp;&nbsp;" +
                ' <span onclick="$$._updateIframe( this);" class="edui-clickable">' +
                editor.getLang("modify") +
                "</span></nobr>"
            );
            if (html) {
              popup.getDom("content").innerHTML = html;
              popup.anchorEl = el;
              popup.showAnchor(popup.anchorEl);
            } else {
              popup.hide();
            }
          }
        });
        editor.addListener("selectionchange", function(t, causeByUi) {
          if (!causeByUi) return;
          var html = "",
            str = "",
            img = editor.selection.getRange().getClosedNode(),
            dialogs = editor.ui._dialogs;
          if (img && img.tagName == "IMG") {
            var dialogName = "insertimageDialog";
            if (
              img.className.indexOf("edui-faked-video") != -1 ||
              img.className.indexOf("edui-upload-video") != -1
            ) {
              dialogName = "insertvideoDialog";
            }
            if (img.className.indexOf("edui-faked-webapp") != -1) {
              dialogName = "webappDialog";
            }
            if (img.src.indexOf("http://api.map.baidu.com") != -1) {
              dialogName = "mapDialog";
            }
            if (img.className.indexOf("edui-faked-music") != -1) {
              dialogName = "musicDialog";
            }
            if (
              img.src.indexOf("http://maps.google.com/maps/api/staticmap") != -1
            ) {
              dialogName = "gmapDialog";
            }
            if (img.getAttribute("anchorname")) {
              dialogName = "anchorDialog";
              html = popup.formatHtml(
                "<nobr>" +
                  editor.getLang("property") +
                  ': <span onclick=$$._onImgEditButtonClick("anchorDialog") class="edui-clickable">' +
                  editor.getLang("modify") +
                  "</span>&nbsp;&nbsp;" +
                  "<span onclick=$$._onRemoveButtonClick('anchor') class=\"edui-clickable\">" +
                  editor.getLang("delete") +
                  "</span></nobr>"
              );
            }
            if (img.getAttribute("word_img")) {
              //todo 放到dialog去做查询
              editor.word_img = [img.getAttribute("word_img")];
              dialogName = "wordimageDialog";
            }
            if (
              domUtils.hasClass(img, "loadingclass") ||
              domUtils.hasClass(img, "loaderrorclass")
            ) {
              dialogName = "";
            }
            if (!dialogs[dialogName]) {
              return;
            }
            str =
              "<nobr>" +
              editor.getLang("property") +
              ": " +
              '<span onclick=$$._onImgSetFloat("none") class="edui-clickable">' +
              editor.getLang("default") +
              "</span>&nbsp;&nbsp;" +
              '<span onclick=$$._onImgSetFloat("left") class="edui-clickable">' +
              editor.getLang("justifyleft") +
              "</span>&nbsp;&nbsp;" +
              '<span onclick=$$._onImgSetFloat("right") class="edui-clickable">' +
              editor.getLang("justifyright") +
              "</span>&nbsp;&nbsp;" +
              '<span onclick=$$._onImgSetFloat("center") class="edui-clickable">' +
              editor.getLang("justifycenter") +
              "</span>&nbsp;&nbsp;" +
              "<span onclick=\"$$._onImgEditButtonClick('" +
              dialogName +
              '\');" class="edui-clickable">' +
              editor.getLang("modify") +
              "</span></nobr>";

            !html && (html = popup.formatHtml(str));
          }
          if (editor.ui._dialogs.linkDialog) {
            var link = editor.queryCommandValue("link");
            var url;
            if (
              link &&
              (url = link.getAttribute("_href") || link.getAttribute("href", 2))
            ) {
              var txt = url;
              if (url.length > 30) {
                txt = url.substring(0, 20) + "...";
              }
              if (html) {
                html += '<div style="height:5px;"></div>';
              }
              html += popup.formatHtml(
                "<nobr>" +
                  editor.getLang("anthorMsg") +
                  ': <a target="_blank" href="' +
                  url +
                  '" title="' +
                  url +
                  '" >' +
                  txt +
                  "</a>" +
                  ' <span class="edui-clickable" onclick="$$._onEditButtonClick();">' +
                  editor.getLang("modify") +
                  "</span>" +
                  ' <span class="edui-clickable" onclick="$$._onRemoveButtonClick(\'unlink\');"> ' +
                  editor.getLang("clear") +
                  "</span></nobr>"
              );
              popup.showAnchor(link);
            }
          }

          if (html) {
            popup.getDom("content").innerHTML = html;
            popup.anchorEl = img || link;
            popup.showAnchor(popup.anchorEl);
          } else {
            popup.hide();
          }
        });
      }
    },
    _initToolbars: function() {
      var editor = this.editor;
      var toolbars = this.toolbars || [];
      var toolbarUis = [];
      var extraUIs = [];
      for (var i = 0; i < toolbars.length; i++) {
        var toolbar = toolbars[i];
        var toolbarUi = new baidu.editor.ui.Toolbar({
          theme: editor.options.theme
        });
        for (var j = 0; j < toolbar.length; j++) {
          var toolbarItem = toolbar[j];
          var toolbarItemUi = null;
          if (typeof toolbarItem == "string") {
            toolbarItem = toolbarItem.toLowerCase();
            if (toolbarItem == "|") {
              toolbarItem = "Separator";
            }
            if (toolbarItem == "||") {
              toolbarItem = "Breakline";
            }
            var ui = baidu.editor.ui[toolbarItem];
            if (ui) {
              if (utils.isFunction(ui)) {
                toolbarItemUi = new baidu.editor.ui[toolbarItem](editor);
              } else {
                if (ui.id && ui.id != editor.key) {
                  continue;
                }
                var itemUI = ui.execFn.call(editor, editor, toolbarItem);
                if (itemUI) {
                  if (ui.index === undefined) {
                    toolbarUi.add(itemUI);
                    continue;
                  } else {
                    extraUIs.push({
                      index: ui.index,
                      itemUI: itemUI
                    });
                  }
                }
              }
            }
            //fullscreen这里单独处理一下，放到首行去
            if (toolbarItem == "fullscreen") {
              if (toolbarUis && toolbarUis[0]) {
                toolbarUis[0].items.splice(0, 0, toolbarItemUi);
              } else {
                toolbarItemUi && toolbarUi.items.splice(0, 0, toolbarItemUi);
              }
              continue;
            }
          } else {
            toolbarItemUi = toolbarItem;
          }
          if (toolbarItemUi && toolbarItemUi.id) {
            toolbarUi.add(toolbarItemUi);
          }
        }
        toolbarUis[i] = toolbarUi;
      }

      //接受外部定制的UI

      utils.each(extraUIs, function(obj) {
        toolbarUi.add(obj.itemUI, obj.index);
      });
      this.toolbars = toolbarUis;
    },
    getHtmlTpl: function() {
      return (
        '<div id="##" class="%%">' +
        '<div id="##_toolbarbox" class="%%-toolbarbox">' +
        (this.toolbars.length
          ? '<div id="##_toolbarboxouter" class="%%-toolbarboxouter"><div class="%%-toolbarboxinner">' +
              this.renderToolbarBoxHtml() +
              "</div></div>"
          : "") +
        '<div id="##_toolbarmsg" class="%%-toolbarmsg" style="display:none;">' +
        '<div id = "##_upload_dialog" class="%%-toolbarmsg-upload" onclick="$$.showWordImageDialog();">' +
        this.editor.getLang("clickToUpload") +
        "</div>" +
        '<div class="%%-toolbarmsg-close" onclick="$$.hideToolbarMsg();">x</div>' +
        '<div id="##_toolbarmsg_label" class="%%-toolbarmsg-label"></div>' +
        '<div style="height:0;overflow:hidden;clear:both;"></div>' +
        "</div>" +
        '<div id="##_message_holder" class="%%-messageholder"></div>' +
        "</div>" +
        '<div id="##_iframeholder" class="%%-iframeholder">' +
        "</div>" +
        //modify wdcount by matao
        '<div id="##_bottombar" class="%%-bottomContainer"><table><tr>' +
        '<td id="##_elementpath" class="%%-bottombar"></td>' +
        '<td id="##_wordcount" class="%%-wordcount"></td>' +
        '<td id="##_scale" class="%%-scale"><div class="%%-icon"></div></td>' +
        "</tr></table></div>" +
        '<div id="##_scalelayer"></div>' +
        "</div>"
      );
    },
    showWordImageDialog: function() {
      this._dialogs["wordimageDialog"].open();
    },
    renderToolbarBoxHtml: function() {
      var buff = [];
      for (var i = 0; i < this.toolbars.length; i++) {
        buff.push(this.toolbars[i].renderHtml());
      }
      return buff.join("");
    },
    setFullScreen: function(fullscreen) {
      var editor = this.editor,
        container = editor.container.parentNode.parentNode;
      if (this._fullscreen != fullscreen) {
        this._fullscreen = fullscreen;
        this.editor.fireEvent("beforefullscreenchange", fullscreen);
        if (baidu.editor.browser.gecko) {
          var bk = editor.selection.getRange().createBookmark();
        }
        if (fullscreen) {
          while (container.tagName != "BODY") {
            var position = baidu.editor.dom.domUtils.getComputedStyle(
              container,
              "position"
            );
            nodeStack.push(position);
            container.style.position = "static";
            container = container.parentNode;
          }
          this._bakHtmlOverflow = document.documentElement.style.overflow;
          this._bakBodyOverflow = document.body.style.overflow;
          this._bakAutoHeight = this.editor.autoHeightEnabled;
          this._bakScrollTop = Math.max(
            document.documentElement.scrollTop,
            document.body.scrollTop
          );

          this._bakEditorContaninerWidth = editor.iframe.parentNode.offsetWidth;
          if (this._bakAutoHeight) {
            //当全屏时不能执行自动长高
            editor.autoHeightEnabled = false;
            this.editor.disableAutoHeight();
          }

          document.documentElement.style.overflow = "hidden";
          //修复，滚动条不收起的问题

          window.scrollTo(0, window.scrollY);
          this._bakCssText = this.getDom().style.cssText;
          this._bakCssText1 = this.getDom("iframeholder").style.cssText;
          editor.iframe.parentNode.style.width = "";
          this._updateFullScreen();
        } else {
          while (container.tagName != "BODY") {
            container.style.position = nodeStack.shift();
            container = container.parentNode;
          }
          this.getDom().style.cssText = this._bakCssText;
          this.getDom("iframeholder").style.cssText = this._bakCssText1;
          if (this._bakAutoHeight) {
            editor.autoHeightEnabled = true;
            this.editor.enableAutoHeight();
          }

          document.documentElement.style.overflow = this._bakHtmlOverflow;
          document.body.style.overflow = this._bakBodyOverflow;
          editor.iframe.parentNode.style.width =
            this._bakEditorContaninerWidth + "px";
          window.scrollTo(0, this._bakScrollTop);
        }
        if (browser.gecko && editor.body.contentEditable === "true") {
          var input = document.createElement("input");
          document.body.appendChild(input);
          editor.body.contentEditable = false;
          setTimeout(function() {
            input.focus();
            setTimeout(function() {
              editor.body.contentEditable = true;
              editor.fireEvent("fullscreenchanged", fullscreen);
              editor.selection.getRange().moveToBookmark(bk).select(true);
              baidu.editor.dom.domUtils.remove(input);
              fullscreen && window.scroll(0, 0);
            }, 0);
          }, 0);
        }

        if (editor.body.contentEditable === "true") {
          this.editor.fireEvent("fullscreenchanged", fullscreen);
          this.triggerLayout();
        }
      }
    },
    _updateFullScreen: function() {
      if (this._fullscreen) {
        var vpRect = uiUtils.getViewportRect();
        this.getDom().style.cssText =
          "border:0;position:absolute;left:0;top:" +
          (this.editor.options.topOffset || 0) +
          "px;width:" +
          vpRect.width +
          "px;height:" +
          vpRect.height +
          "px;z-index:" +
          (this.getDom().style.zIndex * 1 + 100);
        uiUtils.setViewportOffset(this.getDom(), {
          left: 0,
          top: this.editor.options.topOffset || 0
        });
        this.editor.setHeight(
          vpRect.height -
            this.getDom("toolbarbox").offsetHeight -
            this.getDom("bottombar").offsetHeight -
            (this.editor.options.topOffset || 0),
          true
        );
        //不手动调一下，会导致全屏失效
        if (browser.gecko) {
          try {
            window.onresize();
          } catch (e) {}
        }
      }
    },
    _updateElementPath: function() {
      var bottom = this.getDom("elementpath"),
        list;
      if (
        this.elementPathEnabled &&
        (list = this.editor.queryCommandValue("elementpath"))
      ) {
        var buff = [];
        for (var i = 0, ci; (ci = list[i]); i++) {
          buff[i] = this.formatHtml(
            '<span unselectable="on" onclick="$$.editor.execCommand(&quot;elementpath&quot;, &quot;' +
              i +
              '&quot;);">' +
              ci +
              "</span>"
          );
        }
        bottom.innerHTML =
          '<div class="edui-editor-breadcrumb" onmousedown="return false;">' +
          this.editor.getLang("elementPathTip") +
          ": " +
          buff.join(" &gt; ") +
          "</div>";
      } else {
        bottom.style.display = "none";
      }
    },
    disableElementPath: function() {
      var bottom = this.getDom("elementpath");
      bottom.innerHTML = "";
      bottom.style.display = "none";
      this.elementPathEnabled = false;
    },
    enableElementPath: function() {
      var bottom = this.getDom("elementpath");
      bottom.style.display = "";
      this.elementPathEnabled = true;
      this._updateElementPath();
    },
    _scale: function() {
      var doc = document,
        editor = this.editor,
        editorHolder = editor.container,
        editorDocument = editor.document,
        toolbarBox = this.getDom("toolbarbox"),
        bottombar = this.getDom("bottombar"),
        scale = this.getDom("scale"),
        scalelayer = this.getDom("scalelayer");

      var isMouseMove = false,
        position = null,
        minEditorHeight = 0,
        minEditorWidth = editor.options.minFrameWidth,
        pageX = 0,
        pageY = 0,
        scaleWidth = 0,
        scaleHeight = 0;

      function down() {
        position = domUtils.getXY(editorHolder);

        if (!minEditorHeight) {
          minEditorHeight =
            editor.options.minFrameHeight +
            toolbarBox.offsetHeight +
            bottombar.offsetHeight;
        }

        scalelayer.style.cssText =
          "position:absolute;left:0;display:;top:0;background-color:#41ABFF;opacity:0.4;filter: Alpha(opacity=40);width:" +
          editorHolder.offsetWidth +
          "px;height:" +
          editorHolder.offsetHeight +
          "px;z-index:" +
          (editor.options.zIndex + 1);

        domUtils.on(doc, "mousemove", move);
        domUtils.on(editorDocument, "mouseup", up);
        domUtils.on(doc, "mouseup", up);
      }

      var me = this;
      //by xuheng 全屏时关掉缩放
      this.editor.addListener("fullscreenchanged", function(e, fullScreen) {
        if (fullScreen) {
          me.disableScale();
        } else {
          if (me.editor.options.scaleEnabled) {
            me.enableScale();
            var tmpNode = me.editor.document.createElement("span");
            me.editor.body.appendChild(tmpNode);
            me.editor.body.style.height =
              Math.max(
                domUtils.getXY(tmpNode).y,
                me.editor.iframe.offsetHeight - 20
              ) + "px";
            domUtils.remove(tmpNode);
          }
        }
      });
      function move(event) {
        clearSelection();
        var e = event || window.event;
        pageX = e.pageX || doc.documentElement.scrollLeft + e.clientX;
        pageY = e.pageY || doc.documentElement.scrollTop + e.clientY;
        scaleWidth = pageX - position.x;
        scaleHeight = pageY - position.y;

        if (scaleWidth >= minEditorWidth) {
          isMouseMove = true;
          scalelayer.style.width = scaleWidth + "px";
        }
        if (scaleHeight >= minEditorHeight) {
          isMouseMove = true;
          scalelayer.style.height = scaleHeight + "px";
        }
      }

      function up() {
        if (isMouseMove) {
          isMouseMove = false;
          editor.ui._actualFrameWidth = scalelayer.offsetWidth - 2;
          editorHolder.style.width = editor.ui._actualFrameWidth + "px";

          editor.setHeight(
            scalelayer.offsetHeight -
              bottombar.offsetHeight -
              toolbarBox.offsetHeight -
              2,
            true
          );
        }
        if (scalelayer) {
          scalelayer.style.display = "none";
        }
        clearSelection();
        domUtils.un(doc, "mousemove", move);
        domUtils.un(editorDocument, "mouseup", up);
        domUtils.un(doc, "mouseup", up);
      }

      function clearSelection() {
        if (browser.ie) doc.selection.clear();
        else window.getSelection().removeAllRanges();
      }

      this.enableScale = function() {
        //trace:2868
        if (editor.queryCommandState("source") == 1) return;
        scale.style.display = "";
        this.scaleEnabled = true;
        domUtils.on(scale, "mousedown", down);
      };
      this.disableScale = function() {
        scale.style.display = "none";
        this.scaleEnabled = false;
        domUtils.un(scale, "mousedown", down);
      };
    },
    isFullScreen: function() {
      return this._fullscreen;
    },
    postRender: function() {
      UIBase.prototype.postRender.call(this);
      for (var i = 0; i < this.toolbars.length; i++) {
        this.toolbars[i].postRender();
      }
      var me = this;
      var timerId,
        domUtils = baidu.editor.dom.domUtils,
        updateFullScreenTime = function() {
          clearTimeout(timerId);
          timerId = setTimeout(function() {
            me._updateFullScreen();
          });
        };
      domUtils.on(window, "resize", updateFullScreenTime);

      me.addListener("destroy", function() {
        domUtils.un(window, "resize", updateFullScreenTime);
        clearTimeout(timerId);
      });
    },
    showToolbarMsg: function(msg, flag) {
      this.getDom("toolbarmsg_label").innerHTML = msg;
      this.getDom("toolbarmsg").style.display = "";
      //
      if (!flag) {
        var w = this.getDom("upload_dialog");
        w.style.display = "none";
      }
    },
    hideToolbarMsg: function() {
      this.getDom("toolbarmsg").style.display = "none";
    },
    mapUrl: function(url) {
      return url
        ? url.replace("~/", this.editor.options.UEDITOR_HOME_URL || "")
        : "";
    },
    triggerLayout: function() {
      var dom = this.getDom();
      if (dom.style.zoom == "1") {
        dom.style.zoom = "100%";
      } else {
        dom.style.zoom = "1";
      }
    }
  };
  utils.inherits(EditorUI, baidu.editor.ui.UIBase);

  var instances = {};

  UE.ui.Editor = function(options) {
    var editor = new UE.Editor(options);
    editor.options.editor = editor;
    utils.loadFile(document, {
      href:
        editor.options.themePath + editor.options.theme + "/_css/ueditor.css",
      tag: "link",
      type: "text/css",
      rel: "stylesheet"
    });

    var oldRender = editor.render;
    editor.render = function(holder) {
      if (holder.constructor === String) {
        editor.key = holder;
        instances[holder] = editor;
      }
      utils.domReady(function() {
        editor.langIsReady
          ? renderUI()
          : editor.addListener("langReady", renderUI);
        function renderUI() {
          editor.setOpt({
            labelMap: editor.options.labelMap || editor.getLang("labelMap")
          });
          new EditorUI(editor.options);
          if (holder) {
            if (holder.constructor === String) {
              holder = document.getElementById(holder);
            }
            holder &&
              holder.getAttribute("name") &&
              (editor.options.textarea = holder.getAttribute("name"));
            if (holder && /script|textarea/gi.test(holder.tagName)) {
              var newDiv = document.createElement("div");
              holder.parentNode.insertBefore(newDiv, holder);
              var cont = holder.value || holder.innerHTML;
              editor.options.initialContent = /^[\t\r\n ]*$/.test(cont)
                ? editor.options.initialContent
                : cont
                    .replace(/>[\n\r\t]+([ ]{4})+/g, ">")
                    .replace(/[\n\r\t]+([ ]{4})+</g, "<")
                    .replace(/>[\n\r\t]+</g, "><");
              holder.className && (newDiv.className = holder.className);
              holder.style.cssText &&
                (newDiv.style.cssText = holder.style.cssText);
              if (/textarea/i.test(holder.tagName)) {
                editor.textarea = holder;
                editor.textarea.style.display = "none";
              } else {
                holder.parentNode.removeChild(holder);
              }
              if (holder.id) {
                newDiv.id = holder.id;
                domUtils.removeAttributes(holder, "id");
              }
              holder = newDiv;
              holder.innerHTML = "";
            }
          }
          domUtils.addClass(holder, "edui-" + editor.options.theme);
          editor.ui.render(holder);
          var opt = editor.options;
          //给实例添加一个编辑器的容器引用
          editor.container = editor.ui.getDom();
          var parents = domUtils.findParents(holder, true);
          var displays = [];
          for (var i = 0, ci; (ci = parents[i]); i++) {
            displays[i] = ci.style.display;
            ci.style.display = "block";
          }
          if (opt.initialFrameWidth) {
            opt.minFrameWidth = opt.initialFrameWidth;
          } else {
            opt.minFrameWidth = opt.initialFrameWidth = holder.offsetWidth;
            var styleWidth = holder.style.width;
            if (/%$/.test(styleWidth)) {
              opt.initialFrameWidth = styleWidth;
            }
          }
          if (opt.initialFrameHeight) {
            opt.minFrameHeight = opt.initialFrameHeight;
          } else {
            opt.initialFrameHeight = opt.minFrameHeight = holder.offsetHeight;
          }
          for (var i = 0, ci; (ci = parents[i]); i++) {
            ci.style.display = displays[i];
          }
          //编辑器最外容器设置了高度，会导致，编辑器不占位
          //todo 先去掉，没有找到原因
          if (holder.style.height) {
            holder.style.height = "";
          }
          editor.container.style.width =
            opt.initialFrameWidth +
            (/%$/.test(opt.initialFrameWidth) ? "" : "px");
          editor.container.style.zIndex = opt.zIndex;
          oldRender.call(editor, editor.ui.getDom("iframeholder"));
          editor.fireEvent("afteruiready");
        }
      });
    };
    return editor;
  };

  /**
     * @file
     * @name UE
     * @short UE
     * @desc UEditor的顶部命名空间
     */
  /**
     * @name getEditor
     * @since 1.2.4+
     * @grammar UE.getEditor(id,[opt])  =>  Editor实例
     * @desc 提供一个全局的方法得到编辑器实例
     *
     * * ''id''  放置编辑器的容器id, 如果容器下的编辑器已经存在，就直接返回
     * * ''opt'' 编辑器的可选参数
     * @example
     *  UE.getEditor('containerId',{onready:function(){//创建一个编辑器实例
     *      this.setContent('hello')
     *  }});
     *  UE.getEditor('containerId'); //返回刚创建的实例
     *
     */
  UE.getEditor = function(id, opt) {
    var editor = instances[id];
    if (!editor) {
      editor = instances[id] = new UE.ui.Editor(opt);
      editor.render(id);
    }
    return editor;
  };

  UE.delEditor = function(id) {
    var editor;
    if ((editor = instances[id])) {
      editor.key && editor.destroy();
      delete instances[id];
    }
  };

  UE.registerUI = function(uiName, fn, index, editorId) {
    utils.each(uiName.split(/\s+/), function(name) {
      baidu.editor.ui[name] = {
        id: editorId,
        execFn: fn,
        index: index
      };
    });
  };
})();
