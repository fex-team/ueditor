///import core
///commands 字数统计
///commandsName  WordCount,wordCount
///commandsTitle  字数统计
/*
 * Created by JetBrains WebStorm.
 * User: taoqili
 * Date: 11-9-7
 * Time: 下午8:18
 * To change this template use File | Settings | File Templates.
 */

UE.plugins["wordcount"] = function() {
  var me = this;
  me.setOpt("wordCount", true);
  me.addListener("contentchange", function() {
    me.fireEvent("wordcount");
  });
  var timer;
  me.addListener("ready", function() {
    var me = this;
    domUtils.on(me.body, "keyup", function(evt) {
      var code = evt.keyCode || evt.which,
        //忽略的按键,ctr,alt,shift,方向键
        ignores = {
          "16": 1,
          "18": 1,
          "20": 1,
          "37": 1,
          "38": 1,
          "39": 1,
          "40": 1
        };
      if (code in ignores) return;
      clearTimeout(timer);
      timer = setTimeout(function() {
        me.fireEvent("wordcount");
      }, 200);
    });
  });
};
