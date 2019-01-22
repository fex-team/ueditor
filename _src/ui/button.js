///import core
///import uicore
///import ui/stateful.js
(function() {
  var utils = baidu.editor.utils,
    UIBase = baidu.editor.ui.UIBase,
    Stateful = baidu.editor.ui.Stateful,
    Button = (baidu.editor.ui.Button = function(options) {
      if (options.name) {
        var btnName = options.name;
        var cssRules = options.cssRules;
        if (!options.className) {
          options.className = "edui-for-" + btnName;
        }
        options.cssRules =
          ".edui-" +
          (options.theme || "default") +
          " .edui-toolbar .edui-button.edui-for-" +
          btnName +
          " .edui-icon {" +
          cssRules +
          "}";
      }
      this.initOptions(options);
      this.initButton();
    });
  Button.prototype = {
    uiName: "button",
    label: "",
    title: "",
    showIcon: true,
    showText: true,
    cssRules: "",
    initButton: function() {
      this.initUIBase();
      this.Stateful_init();
      if (this.cssRules) {
        utils.cssRule("edui-customize-" + this.name + "-style", this.cssRules);
      }
    },
    getHtmlTpl: function() {
      return (
        '<div id="##" class="edui-box %%">' +
        '<div id="##_state" stateful>' +
        '<div class="%%-wrap"><div id="##_body" unselectable="on" ' +
        (this.title ? 'title="' + this.title + '"' : "") +
        ' class="%%-body" onmousedown="return $$._onMouseDown(event, this);" onclick="return $$._onClick(event, this);">' +
        (this.showIcon ? '<div class="edui-box edui-icon"></div>' : "") +
        (this.showText
          ? '<div class="edui-box edui-label">' + this.label + "</div>"
          : "") +
        "</div>" +
        "</div>" +
        "</div></div>"
      );
    },
    postRender: function() {
      this.Stateful_postRender();
      this.setDisabled(this.disabled);
    },
    _onMouseDown: function(e) {
      var target = e.target || e.srcElement,
        tagName = target && target.tagName && target.tagName.toLowerCase();
      if (tagName == "input" || tagName == "object" || tagName == "object") {
        return false;
      }
    },
    _onClick: function() {
      if (!this.isDisabled()) {
        this.fireEvent("click");
      }
    },
    setTitle: function(text) {
      var label = this.getDom("label");
      label.innerHTML = text;
    }
  };
  utils.inherits(Button, UIBase);
  utils.extend(Button.prototype, Stateful);
})();
