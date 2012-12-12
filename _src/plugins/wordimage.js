///import core
///commands 本地图片引导上传
///commandsName  WordImage
///commandsTitle  本地图片引导上传


UE.plugins["wordimage"] = function(){
    var me = this,
        images;
    me.commands['wordimage'] = {
        execCommand : function() {
            images = domUtils.getElementsByTagName(me.document.body,"img");
            var urlList = [];
            for(var i=0,ci;ci=images[i++];){
                var url=ci.getAttribute("word_img");
                url && urlList.push(url);
            }
            if(images.length){
                this["word_img"] = urlList;
            }
        },
        queryCommandState: function(){
            images = domUtils.getElementsByTagName(me.document.body,"img");
            for(var i=0,ci;ci =images[i++];){
                if(ci.getAttribute("word_img")){
                    return 1;
                }
            }
            return -1;
        }
    };
};