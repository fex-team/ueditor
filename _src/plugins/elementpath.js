/**
 * 选取路径命令
 * @file
 */
UE.plugins["elementpath"] = function() {
  var currentLevel,
    tagNames,
    me = this;
  me.setOpt("elementPathEnabled", true);
  if (!me.options.elementPathEnabled) {
    return;
  }
  me.commands["elementpath"] = {
    execCommand: function(cmdName, level) {
      var start = tagNames[level],
        range = me.selection.getRange();
      currentLevel = level * 1;
      range.selectNode(start).select();
    },
    queryCommandValue: function() {
      //产生一个副本，不能修改原来的startElementPath;
      var parents = [].concat(this.selection.getStartElementPath()).reverse(),
        names = [];
      tagNames = parents;
      for (var i = 0, ci; (ci = parents[i]); i++) {
        if (ci.nodeType == 3) {
          continue;
        }
        var name = ci.tagName.toLowerCase();
        if (name == "img" && ci.getAttribute("anchorname")) {
          name = "anchor";
        }
        names[i] = name;
        if (currentLevel == i) {
          currentLevel = -1;
          break;
        }
      }
      return names;
    }
  };
};
