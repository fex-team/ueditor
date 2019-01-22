(function() {
  var UI = baidu.editor.ui,
    UIBase = UI.UIBase,
    uiUtils = UI.uiUtils,
    utils = baidu.editor.utils,
    domUtils = baidu.editor.dom.domUtils;

  var allMenus = [], //存储所有快捷菜单
    timeID,
    isSubMenuShow = false; //是否有子pop显示

  var ShortCutMenu = (UI.ShortCutMenu = function(options) {
    this.initOptions(options);
    this.initShortCutMenu();
  });

  ShortCutMenu.postHide = hideAllMenu;

  ShortCutMenu.prototype = {
    isHidden: true,
    SPACE: 5,
    initShortCutMenu: function() {
      this.items = this.items || [];
      this.initUIBase();
      this.initItems();
      this.initEvent();
      allMenus.push(this);
    },
    initEvent: function() {
      var me = this,
        doc = me.editor.document;

      domUtils.on(doc, "mousemove", function(e) {
        if (me.isHidden === false) {
          //有pop显示就不隐藏快捷菜单
          if (me.getSubMenuMark() || me.eventType == "contextmenu") return;

          var flag = true,
            el = me.getDom(),
            wt = el.offsetWidth,
            ht = el.offsetHeight,
            distanceX = wt / 2 + me.SPACE, //距离中心X标准
            distanceY = ht / 2, //距离中心Y标准
            x = Math.abs(e.screenX - me.left), //离中心距离横坐标
            y = Math.abs(e.screenY - me.top); //离中心距离纵坐标

          clearTimeout(timeID);
          timeID = setTimeout(function() {
            if (y > 0 && y < distanceY) {
              me.setOpacity(el, "1");
            } else if (y > distanceY && y < distanceY + 70) {
              me.setOpacity(el, "0.5");
              flag = false;
            } else if (y > distanceY + 70 && y < distanceY + 140) {
              me.hide();
            }

            if (flag && x > 0 && x < distanceX) {
              me.setOpacity(el, "1");
            } else if (x > distanceX && x < distanceX + 70) {
              me.setOpacity(el, "0.5");
            } else if (x > distanceX + 70 && x < distanceX + 140) {
              me.hide();
            }
          });
        }
      });

      //ie\ff下 mouseout不准
      if (browser.chrome) {
        domUtils.on(doc, "mouseout", function(e) {
          var relatedTgt = e.relatedTarget || e.toElement;

          if (relatedTgt == null || relatedTgt.tagName == "HTML") {
            me.hide();
          }
        });
      }

      me.editor.addListener("afterhidepop", function() {
        if (!me.isHidden) {
          isSubMenuShow = true;
        }
      });
    },
    initItems: function() {
      if (utils.isArray(this.items)) {
        for (var i = 0, len = this.items.length; i < len; i++) {
          var item = this.items[i].toLowerCase();

          if (UI[item]) {
            this.items[i] = new UI[item](this.editor);
            this.items[i].className += " edui-shortcutsubmenu ";
          }
        }
      }
    },
    setOpacity: function(el, value) {
      if (browser.ie && browser.version < 9) {
        el.style.filter = "alpha(opacity = " + parseFloat(value) * 100 + ");";
      } else {
        el.style.opacity = value;
      }
    },
    getSubMenuMark: function() {
      isSubMenuShow = false;
      var layerEle = uiUtils.getFixedLayer();
      var list = domUtils.getElementsByTagName(layerEle, "div", function(node) {
        return domUtils.hasClass(node, "edui-shortcutsubmenu edui-popup");
      });

      for (var i = 0, node; (node = list[i++]); ) {
        if (node.style.display != "none") {
          isSubMenuShow = true;
        }
      }
      return isSubMenuShow;
    },
    show: function(e, hasContextmenu) {
      var me = this,
        offset = {},
        el = this.getDom(),
        fixedlayer = uiUtils.getFixedLayer();

      function setPos(offset) {
        if (offset.left < 0) {
          offset.left = 0;
        }
        if (offset.top < 0) {
          offset.top = 0;
        }
        el.style.cssText =
          "position:absolute;left:" +
          offset.left +
          "px;top:" +
          offset.top +
          "px;";
      }

      function setPosByCxtMenu(menu) {
        if (!menu.tagName) {
          menu = menu.getDom();
        }
        offset.left = parseInt(menu.style.left);
        offset.top = parseInt(menu.style.top);
        offset.top -= el.offsetHeight + 15;
        setPos(offset);
      }

      me.eventType = e.type;
      el.style.cssText = "display:block;left:-9999px";

      if (e.type == "contextmenu" && hasContextmenu) {
        var menu = domUtils.getElementsByTagName(
          fixedlayer,
          "div",
          "edui-contextmenu"
        )[0];
        if (menu) {
          setPosByCxtMenu(menu);
        } else {
          me.editor.addListener("aftershowcontextmenu", function(type, menu) {
            setPosByCxtMenu(menu);
          });
        }
      } else {
        offset = uiUtils.getViewportOffsetByEvent(e);
        offset.top -= el.offsetHeight + me.SPACE;
        offset.left += me.SPACE + 20;
        setPos(offset);
        me.setOpacity(el, 0.2);
      }

      me.isHidden = false;
      me.left = e.screenX + el.offsetWidth / 2 - me.SPACE;
      me.top = e.screenY - el.offsetHeight / 2 - me.SPACE;

      if (me.editor) {
        el.style.zIndex = me.editor.container.style.zIndex * 1 + 10;
        fixedlayer.style.zIndex = el.style.zIndex - 1;
      }
    },
    hide: function() {
      if (this.getDom()) {
        this.getDom().style.display = "none";
      }
      this.isHidden = true;
    },
    postRender: function() {
      if (utils.isArray(this.items)) {
        for (var i = 0, item; (item = this.items[i++]); ) {
          item.postRender();
        }
      }
    },
    getHtmlTpl: function() {
      var buff;
      if (utils.isArray(this.items)) {
        buff = [];
        for (var i = 0; i < this.items.length; i++) {
          buff[i] = this.items[i].renderHtml();
        }
        buff = buff.join("");
      } else {
        buff = this.items;
      }

      return (
        '<div id="##" class="%% edui-toolbar" data-src="shortcutmenu" onmousedown="return false;" onselectstart="return false;" >' +
        buff +
        "</div>"
      );
    }
  };

  utils.inherits(ShortCutMenu, UIBase);

  function hideAllMenu(e) {
    var tgt = e.target || e.srcElement,
      cur = domUtils.findParent(
        tgt,
        function(node) {
          return (
            domUtils.hasClass(node, "edui-shortcutmenu") ||
            domUtils.hasClass(node, "edui-popup")
          );
        },
        true
      );

    if (!cur) {
      for (var i = 0, menu; (menu = allMenus[i++]); ) {
        menu.hide();
      }
    }
  }

  domUtils.on(document, "mousedown", function(e) {
    hideAllMenu(e);
  });

  domUtils.on(window, "scroll", function(e) {
    hideAllMenu(e);
  });
})();
