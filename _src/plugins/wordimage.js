/**
 * 本地图片引导上传插件
 * @file
 * @since 1.2.6.1
 */

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

    /**
     * 粘贴word文档的内容时，运行该命令，会把编辑区域里的word图片地址，赋值到editor.word_img的数组里面
     * @command wordimage
     * @method execCommand
     * @example
     * ```javascript
     * editor.execCommand( 'wordimage');
     * ```
     */

    /**
     * 查询当前是否有word文档粘贴进来的图片
     * @command wordimage
     * @method queryCommandState
     * @return { int } 如果当前编辑区域有word文档的粘贴进来的图片，则返回1，否则返回-1
     * @example
     * ```javascript
     * editor.queryCommandState( 'wordimage' );
     * ```
     */

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