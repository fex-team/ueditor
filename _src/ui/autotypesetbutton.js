///import core
///import uicore
///import ui/popup.js
///import ui/autotypesetpicker.js
///import ui/splitbutton.js
(function() {
  var utils = baidu.editor.utils,
    Popup = baidu.editor.ui.Popup,
    AutoTypeSetPicker = baidu.editor.ui.AutoTypeSetPicker,
    SplitButton = baidu.editor.ui.SplitButton,
    AutoTypeSetButton = (baidu.editor.ui.AutoTypeSetButton = function(options) {
      this.initOptions(options);
      this.initAutoTypeSetButton();
    });
  function getPara(me) {
    var opt = {},
      cont = me.getDom(),
      editorId = me.editor.uid,
      inputType = null,
      attrName = null,
      ipts = domUtils.getElementsByTagName(cont, "input");
    for (var i = ipts.length - 1, ipt; (ipt = ipts[i--]); ) {
      inputType = ipt.getAttribute("type");
      if (inputType == "checkbox") {
        attrName = ipt.getAttribute("name");
        opt[attrName] && delete opt[attrName];
        if (ipt.checked) {
          var attrValue = document.getElementById(
            attrName + "Value" + editorId
          );
          if (attrValue) {
            if (/input/gi.test(attrValue.tagName)) {
              opt[attrName] = attrValue.value;
            } else {
              var iptChilds = attrValue.getElementsByTagName("input");
              for (
                var j = iptChilds.length - 1, iptchild;
                (iptchild = iptChilds[j--]);

              ) {
                if (iptchild.checked) {
                  opt[attrName] = iptchild.value;
                  break;
                }
              }
            }
          } else {
            opt[attrName] = true;
          }
        } else {
          opt[attrName] = false;
        }
      } else {
        opt[ipt.getAttribute("value")] = ipt.checked;
      }
    }

    var selects = domUtils.getElementsByTagName(cont, "select");
    for (var i = 0, si; (si = selects[i++]); ) {
      var attr = si.getAttribute("name");
      opt[attr] = opt[attr] ? si.value : "";
    }

    utils.extend(me.editor.options.autotypeset, opt);

    me.editor.setPreferences("autotypeset", opt);
  }

  AutoTypeSetButton.prototype = {
    initAutoTypeSetButton: function() {
      var me = this;
      this.popup = new Popup({
        //传入配置参数
        content: new AutoTypeSetPicker({ editor: me.editor }),
        editor: me.editor,
        hide: function() {
          if (!this._hidden && this.getDom()) {
            getPara(this);
            this.getDom().style.display = "none";
            this._hidden = true;
            this.fireEvent("hide");
          }
        }
      });
      var flag = 0;
      this.popup.addListener("postRenderAfter", function() {
        var popupUI = this;
        if (flag) return;
        var cont = this.getDom(),
          btn = cont.getElementsByTagName("button")[0];

        btn.onclick = function() {
          getPara(popupUI);
          me.editor.execCommand("autotypeset");
          popupUI.hide();
        };

        domUtils.on(cont, "click", function(e) {
          var target = e.target || e.srcElement,
            editorId = me.editor.uid;
          if (target && target.tagName == "INPUT") {
            // 点击图片浮动的checkbox,去除对应的radio
            if (
              target.name == "imageBlockLine" ||
              target.name == "textAlign" ||
              target.name == "symbolConver"
            ) {
              var checked = target.checked,
                radioTd = document.getElementById(
                  target.name + "Value" + editorId
                ),
                radios = radioTd.getElementsByTagName("input"),
                defalutSelect = {
                  imageBlockLine: "none",
                  textAlign: "left",
                  symbolConver: "tobdc"
                };

              for (var i = 0; i < radios.length; i++) {
                if (checked) {
                  if (radios[i].value == defalutSelect[target.name]) {
                    radios[i].checked = "checked";
                  }
                } else {
                  radios[i].checked = false;
                }
              }
            }
            // 点击radio,选中对应的checkbox
            if (
              target.name == "imageBlockLineValue" + editorId ||
              target.name == "textAlignValue" + editorId ||
              target.name == "bdc"
            ) {
              var checkboxs = target.parentNode.previousSibling.getElementsByTagName(
                "input"
              );
              checkboxs && (checkboxs[0].checked = true);
            }

            getPara(popupUI);
          }
        });

        flag = 1;
      });
      this.initSplitButton();
    }
  };
  utils.inherits(AutoTypeSetButton, SplitButton);
})();
