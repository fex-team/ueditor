///import core
///import uicore
(function() {
  var utils = baidu.editor.utils,
    uiUtils = baidu.editor.ui.uiUtils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    Popup = (baidu.editor.ui.Popup = function(options) {
      this.initOptions(options);
      this.initPopup();
    });

  var allPopups = [];
  function closeAllPopup(evt, el) {
    for (var i = 0; i < allPopups.length; i++) {
      var pop = allPopups[i];
      if (!pop.isHidden()) {
        if (pop.queryAutoHide(el) !== false) {
          if (
            evt &&
            /scroll/gi.test(evt.type) &&
            pop.className == "edui-wordpastepop"
          )
            return;
          pop.hide();
        }
      }
    }

    if (allPopups.length) pop.editor.fireEvent("afterhidepop");
  }

  Popup.postHide = closeAllPopup;

  var ANCHOR_CLASSES = [
    "edui-anchor-topleft",
    "edui-anchor-topright",
    "edui-anchor-bottomleft",
    "edui-anchor-bottomright"
  ];
  Popup.prototype = {
    SHADOW_RADIUS: 5,
    content: null,
    _hidden: false,
    autoRender: true,
    canSideLeft: true,
    canSideUp: true,
    initPopup: function() {
      this.initUIBase();
      allPopups.push(this);
    },
    getHtmlTpl: function() {
      return (
        '<div id="##" class="edui-popup %%" onmousedown="return false;">' +
        ' <div id="##_body" class="edui-popup-body">' +
        ' <iframe style="position:absolute;z-index:-1;left:0;top:0;background-color: transparent;" frameborder="0" width="100%" height="100%" src="about:blank"></iframe>' +
        ' <div class="edui-shadow"></div>' +
        ' <div id="##_content" class="edui-popup-content">' +
        this.getContentHtmlTpl() +
        "  </div>" +
        " </div>" +
        "</div>"
      );
    },
    getContentHtmlTpl: function() {
      if (this.content) {
        if (typeof this.content == "string") {
          return this.content;
        }
        return this.content.renderHtml();
      } else {
        return "";
      }
    },
    _UIBase_postRender: UIBase.prototype.postRender,
    postRender: function() {
      if (this.content instanceof UIBase) {
        this.content.postRender();
      }

      //捕获鼠标滚轮
      if (this.captureWheel && !this.captured) {
        this.captured = true;

        var winHeight =
          (document.documentElement.clientHeight ||
            document.body.clientHeight) - 80,
          _height = this.getDom().offsetHeight,
          _top = uiUtils.getClientRect(this.combox.getDom()).top,
          content = this.getDom("content"),
          ifr = this.getDom("body").getElementsByTagName("iframe"),
          me = this;

        ifr.length && (ifr = ifr[0]);

        while (_top + _height > winHeight) {
          _height -= 30;
        }
        content.style.height = _height + "px";
        //同步更改iframe高度
        ifr && (ifr.style.height = _height + "px");

        //阻止在combox上的鼠标滚轮事件, 防止用户的正常操作被误解
        if (window.XMLHttpRequest) {
          domUtils.on(
            content,
            "onmousewheel" in document.body ? "mousewheel" : "DOMMouseScroll",
            function(e) {
              if (e.preventDefault) {
                e.preventDefault();
              } else {
                e.returnValue = false;
              }

              if (e.wheelDelta) {
                content.scrollTop -= e.wheelDelta / 120 * 60;
              } else {
                content.scrollTop -= e.detail / -3 * 60;
              }
            }
          );
        } else {
          //ie6
          domUtils.on(this.getDom(), "mousewheel", function(e) {
            e.returnValue = false;

            me.getDom("content").scrollTop -= e.wheelDelta / 120 * 60;
          });
        }
      }
      this.fireEvent("postRenderAfter");
      this.hide(true);
      this._UIBase_postRender();
    },
    _doAutoRender: function() {
      if (!this.getDom() && this.autoRender) {
        this.render();
      }
    },
    mesureSize: function() {
      var box = this.getDom("content");
      return uiUtils.getClientRect(box);
    },
    fitSize: function() {
      if (this.captureWheel && this.sized) {
        return this.__size;
      }
      this.sized = true;
      var popBodyEl = this.getDom("body");
      popBodyEl.style.width = "";
      popBodyEl.style.height = "";
      var size = this.mesureSize();
      if (this.captureWheel) {
        popBodyEl.style.width = -(-20 - size.width) + "px";
        var height = parseInt(this.getDom("content").style.height, 10);
        !window.isNaN(height) && (size.height = height);
      } else {
        popBodyEl.style.width = size.width + "px";
      }
      popBodyEl.style.height = size.height + "px";
      this.__size = size;
      this.captureWheel && (this.getDom("content").style.overflow = "auto");
      return size;
    },
    showAnchor: function(element, hoz) {
      this.showAnchorRect(uiUtils.getClientRect(element), hoz);
    },
    showAnchorRect: function(rect, hoz, adj) {
      this._doAutoRender();
      var vpRect = uiUtils.getViewportRect();
      this.getDom().style.visibility = "hidden";
      this._show();
      var popSize = this.fitSize();

      var sideLeft, sideUp, left, top;
      if (hoz) {
        sideLeft =
          this.canSideLeft &&
          (rect.right + popSize.width > vpRect.right &&
            rect.left > popSize.width);
        sideUp =
          this.canSideUp &&
          (rect.top + popSize.height > vpRect.bottom &&
            rect.bottom > popSize.height);
        left = sideLeft ? rect.left - popSize.width : rect.right;
        top = sideUp ? rect.bottom - popSize.height : rect.top;
      } else {
        sideLeft =
          this.canSideLeft &&
          (rect.right + popSize.width > vpRect.right &&
            rect.left > popSize.width);
        sideUp =
          this.canSideUp &&
          (rect.top + popSize.height > vpRect.bottom &&
            rect.bottom > popSize.height);
        left = sideLeft ? rect.right - popSize.width : rect.left;
        top = sideUp ? rect.top - popSize.height : rect.bottom;
      }

      var popEl = this.getDom();
      uiUtils.setViewportOffset(popEl, {
        left: left,
        top: top
      });
      domUtils.removeClasses(popEl, ANCHOR_CLASSES);
      popEl.className +=
        " " + ANCHOR_CLASSES[(sideUp ? 1 : 0) * 2 + (sideLeft ? 1 : 0)];
      if (this.editor) {
        popEl.style.zIndex = this.editor.container.style.zIndex * 1 + 10;
        baidu.editor.ui.uiUtils.getFixedLayer().style.zIndex =
          popEl.style.zIndex - 1;
      }
      this.getDom().style.visibility = "visible";
    },
    showAt: function(offset) {
      var left = offset.left;
      var top = offset.top;
      var rect = {
        left: left,
        top: top,
        right: left,
        bottom: top,
        height: 0,
        width: 0
      };
      this.showAnchorRect(rect, false, true);
    },
    _show: function() {
      if (this._hidden) {
        var box = this.getDom();
        box.style.display = "";
        this._hidden = false;
        //                if (box.setActive) {
        //                    box.setActive();
        //                }
        this.fireEvent("show");
      }
    },
    isHidden: function() {
      return this._hidden;
    },
    show: function() {
      this._doAutoRender();
      this._show();
    },
    hide: function(notNofity) {
      if (!this._hidden && this.getDom()) {
        this.getDom().style.display = "none";
        this._hidden = true;
        if (!notNofity) {
          this.fireEvent("hide");
        }
      }
    },
    queryAutoHide: function(el) {
      return !el || !uiUtils.contains(this.getDom(), el);
    }
  };
  utils.inherits(Popup, UIBase);

  domUtils.on(document, "mousedown", function(evt) {
    var el = evt.target || evt.srcElement;
    closeAllPopup(evt, el);
  });
  domUtils.on(window, "scroll", function(evt, el) {
    closeAllPopup(evt, el);
  });
})();
