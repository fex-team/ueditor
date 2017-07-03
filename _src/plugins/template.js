///import core
///import plugins\inserthtml.js
///import plugins\cleardoc.js
///commands 模板
///commandsName  template
///commandsTitle  模板
///commandsDialog  dialogs\template
UE.plugins["template"] = function() {
  UE.commands["template"] = {
    execCommand: function(cmd, obj) {
      obj.html && this.execCommand("inserthtml", obj.html);
    }
  };
  this.addListener("click", function(type, evt) {
    var el = evt.target || evt.srcElement,
      range = this.selection.getRange();
    var tnode = domUtils.findParent(
      el,
      function(node) {
        if (node.className && domUtils.hasClass(node, "ue_t")) {
          return node;
        }
      },
      true
    );
    tnode && range.selectNode(tnode).shrinkBoundary().select();
  });
  this.addListener("keydown", function(type, evt) {
    var range = this.selection.getRange();
    if (!range.collapsed) {
      if (!evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
        var tnode = domUtils.findParent(
          range.startContainer,
          function(node) {
            if (node.className && domUtils.hasClass(node, "ue_t")) {
              return node;
            }
          },
          true
        );
        if (tnode) {
          domUtils.removeClasses(tnode, ["ue_t"]);
        }
      }
    }
  });
};
