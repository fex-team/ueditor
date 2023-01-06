///import core
///import uicore
(function() {
  var utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils,
    UIBase = baidu.editor.ui.UIBase,
    uiUtils = baidu.editor.ui.uiUtils;

  var Mask = (baidu.editor.ui.Mask = function(options) {
    this.initOptions(options);
    this.initUIBase();
  });
  Mask.prototype = {
    getHtmlTpl: function() {
      return '<div id="##" class="edui-mask %%" onclick="return $$._onClick(event, this);" onmousedown="return $$._onMouseDown(event, this);"></div>';
    },
    postRender: function() {
      var me = this;
      domUtils.on(window, "resize", function() {
        setTimeout(function() {
          if (!me.isHidden()) {
            me._fill();
          }
        });
      });
    },
    show: function(zIndex) {
      this._fill();
      this.getDom().style.display = "";
      this.getDom().style.zIndex = zIndex;
    },
    hide: function() {
      this.getDom().style.display = "none";
      this.getDom().style.zIndex = "";
    },
    isHidden: function() {
      return this.getDom().style.display == "none";
    },
    _onMouseDown: function() {
      return false;
    },
    _onClick: function(e, target) {
      this.fireEvent("click", e, target);
    },
    _fill: function() {
      var el = this.getDom();
      var vpRect = uiUtils.getViewportRect();
      el.style.width = vpRect.width + "px";
      el.style.height = vpRect.height + "px";
    }
  };
  utils.inherits(Mask, UIBase);
})();
