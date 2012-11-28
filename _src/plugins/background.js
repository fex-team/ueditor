(function() {
    UE.plugins['background'] = function(){
        var me = this;
        UE.commands['background'] = {
            queryCommandState : function(){
                return this.highlight ? -1 : 0;
            }
        };
        me.addListener("getAllHtml",function(type,headHtml){
            var body = this.body,
                su = domUtils.getComputedStyle(body,"background-image"),
                url="";
            if(su.indexOf(me.options.imagePath)>0){
                url =  su.substring(su.indexOf(me.options.imagePath),su.length-1).replace(/"|\(|\)/ig,"");
            }else{
                url =  su!="none" ? su.replace(/url\("?|"?\)/ig,""):"";
            }
            headHtml.html += '<style type="text/css">body{';
            var bgObj = {
                "background-color" : domUtils.getComputedStyle(body,"background-color")||"#ffffff",
                'background-image' : url ? 'url('+url+')' : '',
                'background-repeat':domUtils.getComputedStyle(body,"background-repeat")||"",
                'background-position': browser.ie?(domUtils.getComputedStyle(body,"background-position-x")+" "+domUtils.getComputedStyle(body,"background-position-y")):domUtils.getComputedStyle(body,"background-position"),
                'height':domUtils.getComputedStyle(body,"height")
            };
            for ( var name in bgObj ) {
                if ( bgObj.hasOwnProperty( name ) ) {
                    headHtml.html += name+":"+bgObj[name]+";";
                }
            }
            headHtml.html += '}</style> ';
        });
    }
})();