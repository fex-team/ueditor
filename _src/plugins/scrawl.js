///import core
///commands 涂鸦
///commandsName  Scrawl
///commandsTitle  涂鸦
///commandsDialog  dialogs\scrawl
UE.commands["scrawl"] = {
  queryCommandState: function() {
    return browser.ie && browser.version <= 8 ? -1 : 0;
  }
};
