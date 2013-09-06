UE.commands['scrawl'] = {
    queryCommandState : function(){
        return ( browser.ie && browser.version  <= 8 ) ? -1 :0;
    }
};
