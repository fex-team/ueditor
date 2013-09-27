///import core
///commands 本地图片引导上传
///commandsName  WordImage
///commandsTitle  本地图片引导上传
///commandsDialog  dialogs\wordimage


UE.plugins["wordimage"] = function () {
    var me = this,
        images;
    me.addInputRule(function (root) {
        utils.each(root.getNodesByTagName('img'), function (img) {
            var attrs = img.attrs,
                flag = parseInt(attrs.width) < 128 || parseInt(attrs.height) < 43,
                opt = me.options,
                src = opt.UEDITOR_HOME_URL + 'themes/default/images/spacer.gif';
            if (attrs['_src'] && attrs['_src'].indexOf("file:///")!==-1) {
                img.setAttr({
                    width:attrs.width,
                    height:attrs.height,
                    alt:attrs.alt,
                    word_img:attrs._src,
                    src:src,
                    _src:src,
                    'style':'background:url(' + ( flag ? opt.themePath + opt.theme + '/images/word.gif' : opt.langPath + opt.lang + '/images/localimage.png') + ') no-repeat center center;border:1px solid #ddd'
                })
            }
        })
    });
    me.commands['wordimage'] = {
        execCommand:function () {
            images = domUtils.getElementsByTagName(me.document.body, "img");
            var urlList = [];
            for (var i = 0, ci; ci = images[i++];) {
                var url = ci.getAttribute("word_img");
                url && urlList.push(url);
            }
            if (images.length) {
                this["word_img"] = urlList;
            }
        },
        queryCommandState:function () {
            images = domUtils.getElementsByTagName(me.document.body, "img");
            for (var i = 0, ci; ci = images[i++];) {
                if (ci.getAttribute("word_img")) {
                    return 1;
                }
            }
            return -1;
        }
    };

};