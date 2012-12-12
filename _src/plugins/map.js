///import core
///import plugins\inserthtml.js
///commands 地图
///commandsName  Map,GMap
///commandsTitle  Baidu地图,Google地图
///commandsDialog  dialogs\map\map.html,dialogs\gmap\gmap.html
UE.commands['gmap'] =
UE.commands['map'] = {
     queryCommandState : function(){
        return this.highlight ? -1 :0;
    }
};
