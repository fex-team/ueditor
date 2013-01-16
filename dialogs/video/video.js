/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-2-20
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */
var video = {};

(function(){
    video.init = function(){
        switchTab("videoTab");
        createAlignButton( ["videoFloat"] );
        addUrlChangeListener($G("videoUrl"));
        addOkListener();
        addSearchListener();

        //编辑视频时初始化相关信息
        (function(){
            var img = editor.selection.getRange().getClosedNode(),url;
            if(img && img.className == "edui-faked-video"){
                $G("videoUrl").value = url = img.getAttribute("_url");
                $G("videoWidth").value = img.width;
                $G("videoHeight").value = img.height;
                var align = domUtils.getComputedStyle(img,"float"),
                    parentAlign = domUtils.getComputedStyle(img.parentNode,"text-align");
                updateAlignButton(parentAlign==="center"?"center":align);
            }
            createPreviewVideo(url);
        })();
    };
    /**
     * 监听确认和取消两个按钮事件，用户执行插入或者清空正在播放的视频实例操作
     */
    function addOkListener(){
        dialog.onok = function(){
            $G("preview").innerHTML = "";
            var currentTab =  findFocus("tabHeads","tabSrc");
            switch(currentTab){
                case "video":
                    return insertSingle();
                    break;
                case "videoSearch":
                    return insertSearch("searchList");
                    break;
            }
        };
        dialog.oncancel = function(){
            $G("preview").innerHTML = "";
        };
    }

    function selectTxt(node){
        if(node.select){
            node.select();
        }else{
            var r = node.createTextRange && node.createTextRange();
            r.select();
        }
    }

    /**
     * 依据传入的align值更新按钮信息
     * @param align
     */
    function updateAlignButton( align ) {
        var aligns = $G( "videoFloat" ).children;
        for ( var i = 0, ci; ci = aligns[i++]; ) {
            if ( ci.getAttribute( "name" ) == align ) {
                if ( ci.className !="focus" ) {
                    ci.className = "focus";
                }
            } else {
                if ( ci.className =="focus" ) {
                    ci.className = "";
                }
            }
        }
    }

    /**
     * 将单个视频信息插入编辑器中
     */
    function insertSingle(){
        var width = $G("videoWidth"),
            height = $G("videoHeight"),
            url=$G('videoUrl').value,
            align = findFocus("videoFloat","name");
        if(!url) return false;
        if ( !checkNum( [width, height] ) ) return false;
        editor.execCommand('insertvideo', {
            url: convert_url(url),
            width: width.value,
            height: height.value,
            align: align
        });
    }

    /**
     * 将元素id下的所有代表视频的图片插入编辑器中
     * @param id
     */
    function insertSearch(id){
        var imgs = domUtils.getElementsByTagName($G(id),"img"),
            videoObjs=[];
        for(var i=0,img; img=imgs[i++];){
            if(img.getAttribute("selected")){
                videoObjs.push({
                    url:img.getAttribute("ue_video_url"),
                    width:420,
                    height:280,
                    align:"none"
                });
            }
        }
        editor.execCommand('insertvideo',videoObjs);
    }

    /**
     * 找到id下具有focus类的节点并返回该节点下的某个属性
     * @param id
     * @param returnProperty
     */
    function findFocus( id, returnProperty ) {
        var tabs = $G( id ).children,
                property;
        for ( var i = 0, ci; ci = tabs[i++]; ) {
            if ( ci.className=="focus" ) {
                property = ci.getAttribute( returnProperty );
                break;
            }
        }
        return property;
    }
    function convert_url(s){
        return s.replace(/http:\/\/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i,"http://www.tudou.com/v/$1")
            .replace(/http:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/i,"http://www.youtube.com/v/$1")
            .replace(/http:\/\/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i,"http://player.youku.com/player.php/sid/$1")
            .replace(/http:\/\/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "http://player.56.com/v_$1.swf")
            .replace(/http:\/\/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "http://player.56.com/v_$1.swf")
            .replace(/http:\/\/v\.ku6\.com\/.+\/([^.]+)\.html/i, "http://player.ku6.com/refer/$1/v.swf");
    }

    /**
      * 检测传入的所有input框中输入的长宽是否是正数
      * @param nodes input框集合，
      */
     function checkNum( nodes ) {
         for ( var i = 0, ci; ci = nodes[i++]; ) {
             var value = ci.value;
             if ( !isNumber( value ) && value) {
                 alert( lang.numError );
                 ci.value = "";
                 ci.focus();
                 return false;
             }
         }
         return true;
     }

    /**
     * 数字判断
     * @param value
     */
    function isNumber( value ) {
        return /(0|^[1-9]\d*$)/.test( value );
    }

    /**
     * tab切换
     * @param tabParentId
     * @param keepFocus   当此值为真时，切换按钮上会保留focus的样式
     */
    function switchTab( tabParentId,keepFocus ) {
        var tabElements = $G( tabParentId ).children,
                tabHeads = tabElements[0].children,
                tabBodys = tabElements[1].children;
        for ( var i = 0, length = tabHeads.length; i < length; i++ ) {
            var head = tabHeads[i];
            domUtils.on( head, "click", function () {
                //head样式更改
                for ( var k = 0, len = tabHeads.length; k < len; k++ ) {
                    if(!keepFocus)tabHeads[k].className = "";
                }
                this.className = "focus";
                //body显隐
                var tabSrc = this.getAttribute( "tabSrc" );
                for ( var j = 0, length = tabBodys.length; j < length; j++ ) {
                    var body = tabBodys[j],
                        id = body.getAttribute( "id" );

                    if ( id == tabSrc ) {
                        body.style.display = "";
                        if(id=="videoSearch"){
                            selectTxt($G("videoSearchTxt"));
                        }
                        if(id=="video"){
                            selectTxt($G("videoUrl"));
                        }

                    } else {
                        body.style.display = "none";
                    }
                }
            } );
        }
    }
    /**
      * 创建图片浮动选择按钮
      * @param ids
      */
     function createAlignButton( ids ) {
         for ( var i = 0, ci; ci = ids[i++]; ) {
             var floatContainer = $G( ci ),
                     nameMaps = {"none":lang['default'], "left":lang.floatLeft, "right":lang.floatRight, "center":lang.block};
             for ( var j in nameMaps ) {
                 var div = document.createElement( "div" );
                 div.setAttribute( "name", j );
                 if ( j == "none" ) div.className="focus";
                 div.style.cssText = "background:url(images/" + j + "_focus.jpg);";
                 div.setAttribute( "title", nameMaps[j] );
                 floatContainer.appendChild( div );
             }
             switchSelect( ci );
         }
     }

    /**
     * 选择切换
     * @param selectParentId
     */
    function switchSelect( selectParentId ) {
        var selects = $G( selectParentId ).children;
        for ( var i = 0, ci; ci = selects[i++]; ) {
            domUtils.on( ci, "click", function () {
                for ( var j = 0, cj; cj = selects[j++]; ) {
                    cj.className = "";
                    cj.removeAttribute && cj.removeAttribute( "class" );
                }
                this.className = "focus";
            } )
        }
    }

    /**
     * 监听url改变事件
     * @param url
     */
    function addUrlChangeListener(url){
        if (browser.ie) {
            url.onpropertychange = function () {
                createPreviewVideo( this.value );
            }
        } else {
            url.addEventListener( "input", function () {
                createPreviewVideo( this.value );
            }, false );
        }
    }

    /**
     * 根据url生成视频预览
     * @param url
     */
    function createPreviewVideo(url){

        if ( !url )return;
		var matches = url.match(/youtu.be\/(\w+)$/) || url.match(/youtube\.com\/watch\?v=(\w+)/) || url.match(/youtube.com\/v\/(\w+)/),
            youku = url.match(/youku\.com\/v_show\/id_(\w+)/),
            youkuPlay = /player\.youku\.com/ig.test(url);
        if(!youkuPlay){
            if (matches){
                url = "https://www.youtube.com/v/" + matches[1] + "?version=3&feature=player_embedded";
            }else if(youku){
                url = "http://player.youku.com/player.php/sid/"+youku[1]+"/v.swf"
            }else if(!endWith(url,[".swf",".flv",".wmv"])){
                $G("preview").innerHTML = lang.urlError;
                return;
            }
        }else{
            url = url.replace(/\?f=.*/,"");
        }
        $G("preview").innerHTML = '<embed type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
        ' src="' + url + '"' +
        ' width="' + 420  + '"' +
        ' height="' + 280  + '"' +
        ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" ></embed>';
    }

    /**
     * 末尾字符检测
     * @param str
     * @param endStrArr
     */
    function endWith(str,endStrArr){
        for(var i=0,len = endStrArr.length;i<len;i++){
            var tmp = endStrArr[i];
            if(str.length - tmp.length<0) return false;

            if(str.substring(str.length-tmp.length)==tmp){
                return true;
            }
        }
        return false;
    }

    /**
     * ajax获取视频信息
     */
    function getMovie(){
        var keywordInput =  $G("videoSearchTxt");
        if(!keywordInput.getAttribute("hasClick") ||!keywordInput.value){
            selectTxt(keywordInput);
            return;
        }
        $G( "searchList" ).innerHTML = lang.loading;
        var keyword = keywordInput.value,
                type = $G("videoType").value,
            str="";
        ajax.request(editor.options.getMovieUrl,{
            searchKey:keyword,
            videoType:type,
            onsuccess:function(xhr){
                try{
                    var info = eval("("+xhr.responseText+")");
                }catch(e){
                    return;
                }

                var videos = info.multiPageResult.results;
                var html=["<table width='530'>"];
                for(var i=0,ci;ci = videos[i++];){
                    html.push(
                        "<tr>" +
                            "<td><img title='"+lang.clickToSelect+"' ue_video_url='"+ci.outerPlayerUrl+"' alt='"+ci.tags+"' width='106' height='80' src='"+ci.picUrl+"' /> </td>" +
                            "<td>" +
                                "<p><a target='_blank' title='"+lang.goToSource+"' href='"+ci.itemUrl+"'>"+ci.title.substr(0,30)+"</a></p>" +
                                "<p style='height: 62px;line-height: 20px' title='"+ci.description+"'> "+ ci.description.substr(0,95) +" </p>" +
                            "</td>" +
                       "</tr>"
                    );
                }
                html.push("</table>");
                $G("searchList").innerHTML = str = html.length ==2 ?lang.noVideo : html.join("");
                var imgs = domUtils.getElementsByTagName($G("searchList"),"img");
                if(!imgs)return;
                for(var i=0,img;img = imgs[i++];){
                    domUtils.on(img,"click",function(){
                        changeSelected(this);
                    })
                }
            }
        });
    }

    /**
     * 改变对象o的选中状态
     * @param o
     */
    function changeSelected(o){
        if ( o.getAttribute( "selected" ) ) {
            o.removeAttribute( "selected" );
            o.style.cssText = "filter:alpha(Opacity=100);-moz-opacity:1;opacity: 1;border: 2px solid #fff";
        } else {
            o.setAttribute( "selected", "true" );
            o.style.cssText = "filter:alpha(Opacity=50);-moz-opacity:0.5;opacity: 0.5;border:2px solid blue;";
        }
    }

    /**
     * 视频搜索相关注册事件
     */
    function addSearchListener(){
        domUtils.on($G("videoSearchBtn"),"click",getMovie);
        domUtils.on($G( "videoSearchTxt" ),"click",function () {
            if ( this.value == lang.static.videoSearchTxt.value ) {
                this.value = "";
            }
            this.setAttribute("hasClick","true");
            selectTxt(this);
        });
        $G( "videoSearchTxt" ).onkeyup = function(){
            this.setAttribute("hasClick","true");
            this.onkeyup = null;
        };
        domUtils.on($G( "videoSearchReset" ),"click",function () {
            var txt = $G( "videoSearchTxt" );
            txt.value = "";
            selectTxt(txt);
            $G( "searchList" ).innerHTML = "";
        });
        domUtils.on($G( "videoType" ),"change", getMovie);
        domUtils.on($G( "videoSearchTxt" ), "keyup", function ( evt ) {
            if ( evt.keyCode == 13 ) {
                getMovie();
            }
        } )
    }



})();