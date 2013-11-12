/**
 * 插入音乐命令
 * @file
 */
UE.plugin.register('music', function (){
    var me = this;
    function creatInsertStr(url,width,height,align,cssfloat,toEmbed){
        return  !toEmbed ?
                '<img ' +
                    (align && !cssfloat? 'align="' + align + '"' : '') +
                    (cssfloat ? 'style="float:' + cssfloat + '"' : '') +
                    ' width="'+ width +'" height="' + height + '" _url="'+url+'" class="edui-faked-music"' +
                    ' src="'+me.options.langPath+me.options.lang+'/images/music.png" />'
            :
            '<embed type="application/x-shockwave-flash" class="edui-faked-music" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
                ' src="' + url + '" width="' + width  + '" height="' + height  + '" '+ (align && !cssfloat? 'align="' + align + '"' : '') +
                (cssfloat ? 'style="float:' + cssfloat + '"' : '') +
                ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >';
    }
    return {
        outputRule: function(root){
            utils.each(root.getNodesByTagName('img'),function(node){
                var html;
                if(node.getAttr('class') == 'edui-faked-music'){
                    var cssfloat = node.getStyle('float');
                    var align = node.getAttr('align');
                    html =  creatInsertStr(node.getAttr("_url"), node.getAttr('width'), node.getAttr('height'), align, cssfloat, true);
                    var embed = UE.uNode.createElement(html);
                    node.parentNode.replaceChild(embed,node);
                }
            })
        },
        inputRule:function(root){
            utils.each(root.getNodesByTagName('embed'),function(node){
                if(node.getAttr('class') == 'edui-faked-music'){
                    var cssfloat = node.getStyle('float');
                    var align = node.getAttr('align');
                    html =  creatInsertStr(node.getAttr("src"), node.getAttr('width'), node.getAttr('height'), align, cssfloat,false);
                    var img = UE.uNode.createElement(html);
                    node.parentNode.replaceChild(img,node);
                }
            })

        },
        commands:{
            /**
             * 插入音乐
             * @command music
             * @method execCommand
             * @param { Object } musicOptions 插入音乐的参数项， 支持的key有： url=>音乐地址；
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
            'music':{
                execCommand:function (cmd, musicObj) {
                    var me = this,
                        str = creatInsertStr(musicObj.url, musicObj.width || 400, musicObj.height || 95, "none", false);
                    me.execCommand("inserthtml",str);
                },
                queryCommandState:function () {
                    var me = this,
                        img = me.selection.getRange().getClosedNode(),
                        flag = img && (img.className == "edui-faked-music");
                    return flag ? 1 : 0;
                }
            }
        }
    }
});