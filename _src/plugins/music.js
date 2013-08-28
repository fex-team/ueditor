/**
 * 插入音乐命令
 * @file
 */

/**
 * 在当前光标处插入音乐
 * @command music
 * @method execCommand
 * @param { KeyValueMap } musicOptions 插入音乐的参数项， 支持的key有： url=>音乐地址；
 * width=>音乐容器宽度；height=>音乐容器高度；align=>音乐文件的对齐方式， 可选值有: left, center, right, none
 * @example
 * ```javascript
 * //editor是编辑器实例
 * //在编辑器里插入一个“植物大战僵尸”的APP
 * editor.execCommand( 'music' , {
 *     width: 400,
 *     height: 95,
 *     align: "center",
 *     url: "音乐地址"
 * } );
 * ```
 */
UE.plugins['music'] = function () {
    var me = this,
        div;

    /*
     * 创建插入音乐字符串
     * @param url 音乐地址
     * @param width 音乐宽度
     * @param height 音乐高度
     * @param align 对齐
     * @param toEmbed 是否以flash代替显示
     * @param addParagraph  是否需要添加P标签
     */
    function creatInsertStr(url,width,height,align,toEmbed,addParagraph){
        return  !toEmbed ?
            (addParagraph? ('<p '+ (align !="none" ? ( align == "center"? ' style="text-align:center;" ':' style="float:"'+ align ) : '') + '>'): '') +
                '<img align="'+align+'" width="'+ width +'" height="' + height + '" _url="'+url+'" class="edui-faked-music"' +
                ' src="'+me.options.langPath+me.options.lang+'/images/music.png" />' +
                (addParagraph?'</p>':'')
            :
            '<embed type="application/x-shockwave-flash" class="edui-faked-music" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
                ' src="' + url + '" width="' + width  + '" height="' + height  + '" align="' + align + '"' +
                ( align !="none" ? ' style= "'+ ( align == "center"? "display:block;":" float: "+ align )  + '"' :'' ) +
                ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >';
    }

    function switchImgAndEmbed(img2embed) {
        var tmpdiv,
            nodes = domUtils.getElementsByTagName(me.document, !img2embed ? "embed" : "img");
        for (var i = 0, node; node = nodes[i++];) {
            if (node.className != "edui-faked-music") {
                continue;
            }
            tmpdiv = me.document.createElement("div");
            //先看float在看align,浮动有的是时候是在float上定义的
            var align = domUtils.getComputedStyle(node,'float');
            align = align == 'none' ? (node.getAttribute('align') || '') : align;
            tmpdiv.innerHTML = creatInsertStr(img2embed ? node.getAttribute("_url") : node.getAttribute("src"), node.width, node.height, align, img2embed);
            node.parentNode.replaceChild(tmpdiv.firstChild, node);
        }
    }

    me.addListener("beforegetcontent", function () {
        switchImgAndEmbed(true);
    });
    me.addListener('aftersetcontent', function () {
        switchImgAndEmbed(false);
    });
    me.addListener('aftergetcontent', function (cmdName) {
        if (cmdName == 'aftergetcontent' && me.queryCommandState('source')) {
            return;
        }
        switchImgAndEmbed(false);
    });

    me.commands["music"] = {
        execCommand:function (cmd, musicObj) {
            var me = this,
                str = creatInsertStr(musicObj.url, musicObj.width || 400, musicObj.height || 95, "none", false, true);
            me.execCommand("inserthtml",str);
        },
        queryCommandState:function () {
            var me = this,
                img = me.selection.getRange().getClosedNode(),
                flag = img && (img.className == "edui-faked-music");
            return flag ? 1 : 0;
        }
    };
};