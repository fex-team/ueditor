/**
 * 插入分割线插件
 * @file
 * @since 1.2.6.1
 */

/**
 * 插入分割线
 * @command horizontal
 * @method execCommand
 * @param { String } cmdName 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'horizontal' );
 * ```
 */
UE.plugins["horizontal"] = function() {
  var me = this;
  me.commands["horizontal"] = {
    execCommand: function(cmdName) {
      var me = this;
      if (me.queryCommandState(cmdName) !== -1) {
        me.execCommand("insertHtml", "<hr>");
        var range = me.selection.getRange(),
          start = range.startContainer;
        if (start.nodeType == 1 && !start.childNodes[range.startOffset]) {
          var tmp;
          if ((tmp = start.childNodes[range.startOffset - 1])) {
            if (tmp.nodeType == 1 && tmp.tagName == "HR") {
              if (me.options.enterTag == "p") {
                tmp = me.document.createElement("p");
                range.insertNode(tmp);
                range.setStart(tmp, 0).setCursor();
              } else {
                tmp = me.document.createElement("br");
                range.insertNode(tmp);
                range.setStartBefore(tmp).setCursor();
              }
            }
          }
        }
        return true;
      }
    },
    //边界在table里不能加分隔线
    queryCommandState: function() {
      return domUtils.filterNodeList(
        this.selection.getStartElementPath(),
        "table"
      )
        ? -1
        : 0;
    }
  };
  //    me.addListener('delkeyup',function(){
  //        var rng = this.selection.getRange();
  //        if(browser.ie && browser.version > 8){
  //            rng.txtToElmBoundary(true);
  //            if(domUtils.isStartInblock(rng)){
  //                var tmpNode = rng.startContainer;
  //                var pre = tmpNode.previousSibling;
  //                if(pre && domUtils.isTagNode(pre,'hr')){
  //                    domUtils.remove(pre);
  //                    rng.select();
  //                    return;
  //                }
  //            }
  //        }
  //        if(domUtils.isBody(rng.startContainer)){
  //            var hr = rng.startContainer.childNodes[rng.startOffset -1];
  //            if(hr && hr.nodeName == 'HR'){
  //                var next = hr.nextSibling;
  //                if(next){
  //                    rng.setStart(next,0)
  //                }else if(hr.previousSibling){
  //                    rng.setStartAtLast(hr.previousSibling)
  //                }else{
  //                    var p = this.document.createElement('p');
  //                    hr.parentNode.insertBefore(p,hr);
  //                    domUtils.fillNode(this.document,p);
  //                    rng.setStart(p,0);
  //                }
  //                domUtils.remove(hr);
  //                rng.setCursor(false,true);
  //            }
  //        }
  //    })
  me.addListener("delkeydown", function(name, evt) {
    var rng = this.selection.getRange();
    rng.txtToElmBoundary(true);
    if (domUtils.isStartInblock(rng)) {
      var tmpNode = rng.startContainer;
      var pre = tmpNode.previousSibling;
      if (pre && domUtils.isTagNode(pre, "hr")) {
        domUtils.remove(pre);
        rng.select();
        domUtils.preventDefault(evt);
        return true;
      }
    }
  });
};
