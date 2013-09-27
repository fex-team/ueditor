///import core
///import plugins\inserthtml.js
///commands 插入框架
///commandsName  InsertFrame
///commandsTitle  插入Iframe
///commandsDialog  dialogs\insertframe

UE.plugins['insertframe'] = function() {
   var me =this;
    function deleteIframe(){
        me._iframe && delete me._iframe;
    }

    me.addListener("selectionchange",function(){
        deleteIframe();
    });

};

