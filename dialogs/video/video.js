/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-2-20
 * Time: 上午11:19
 * To change this template use File | Settings | File Templates.
 */

(function(){

    editor.setOpt({
        videoFieldName:"upfile"
    });

    var video = {},
        uploadVideoList = [],
        isModifyUploadVideo = false;

    window.onload = function(){
        $focus($G("videoUrl"));
        initTabs();
        initVideo();
        initUpload();
    };

    /* 初始化tab标签 */
    function initTabs(){
        var tabs = $G('tabHeads').children;
        for (var i = 0; i < tabs.length; i++) {
            domUtils.on(tabs[i], "click", function (e) {
                var target = e.target || e.srcElement;
                for (var j = 0; j < tabs.length; j++) {
                    if(tabs[j] == target){
                        tabs[j].className = "focus";
                        $G(tabs[j].getAttribute('data-content-id')).style.display = "block";
                    }else {
                        tabs[j].className = "";
                        $G(tabs[j].getAttribute('data-content-id')).style.display = "none";
                    }
                }
            });
        }
    }

    function initVideo(){
        createAlignButton( ["videoFloat", "upload_alignment"] );
        addUrlChangeListener($G("videoUrl"));
        addOkListener();

        //编辑视频时初始化相关信息
        (function(){
            var img = editor.selection.getRange().getClosedNode(),url;
            if(img && img.className){
                var hasFakedClass = (img.className == "edui-faked-video"),
                    hasUploadClass = img.className.indexOf("edui-upload-video")!=-1;
                if(hasFakedClass || hasUploadClass) {
                    $G("videoUrl").value = url = img.getAttribute("_url");
                    $G("videoWidth").value = img.width;
                    $G("videoHeight").value = img.height;
                    var align = domUtils.getComputedStyle(img,"float"),
                        parentAlign = domUtils.getComputedStyle(img.parentNode,"text-align");
                    updateAlignButton(parentAlign==="center"?"center":align);
                }
                if(hasUploadClass) {
                    isModifyUploadVideo = true;
                }
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
                case "upload":
                    return insertUpload();
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
        }, isModifyUploadVideo ? 'upload':null);
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


    /* 插入上传视频 */
    function insertUpload(){
        var videoObjs=[],
            uploadDir = editor.options.videoPath,
            width = $G('upload_width').value || 420,
            height = $G('upload_height').value || 280,
            align = findFocus("upload_alignment","name") || 'none';
        for(var key in uploadVideoList) {
            var file = uploadVideoList[key];
            videoObjs.push({
                url: uploadDir + file.url,
                width:width,
                height:height,
                align:align
            });
        }
        editor.execCommand('insertvideo', videoObjs, 'upload');
    }

    /*初始化上传标签*/
    function initUpload(){
        var settings = {
            upload_url:editor.options.videoUrl,           //附件上传服务器地址
            file_post_name:editor.options.videoFieldName,      //向后台提交的表单名
            flash_url:"../../third-party/swfupload/swfupload.swf",
            flash9_url:"../../third-party/swfupload/swfupload_fp9.swf",
            post_params:{"PHPSESSID":"<?php echo session_id(); ?>","fileNameFormat":editor.options.fileNameFormat}, //解决session丢失问题
            file_size_limit:"100 MB",                                 //文件大小限制，此处仅是前端flash选择时候的限制，具体还需要和后端结合判断
            file_types:"*.*",                                         //允许的扩展名，多个扩展名之间用分号隔开，支持*通配符
            file_types_description:"Video Files",                      //扩展名描述
            file_upload_limit:100,                                   //单次可同时上传的文件数目
            file_queue_limit:10,                                      //队列中可同时上传的文件数目
            custom_settings:{                                         //自定义设置，用户可在此向服务器传递自定义变量
                progressTarget:"fsUploadProgress",
                startUploadId:"startUpload"
            },
            debug:false,

            // 按钮设置
            button_image_url:"../../themes/default/images/filescan.png",
            button_width:"100",
            button_height:"25",
            button_placeholder_id:"spanButtonPlaceHolder",
            button_text:'<span class="theFont">'+lang.browseFiles+'</span>',
            button_text_style:".theFont { font-size:14px;}",
            button_text_left_padding:10,
            button_text_top_padding:4,
            // 所有回调函数
            swfupload_preload_handler:preLoad,
            swfupload_load_failed_handler:loadFailed,
            file_queued_handler:fileQueued,
            file_queue_error_handler:fileQueueError,
            //选择文件完成回调
            file_dialog_complete_handler:function(numFilesSelected, numFilesQueued) {
                var me = this;        //此处的this是swfupload对象
                if (numFilesQueued > 0) {
                    dialog.buttons[0].setDisabled(true);
                    var start = $G(this.customSettings.startUploadId);
                    start.style.display = "";
                    start.onclick = function(){
                        me.startUpload();
                        start.style.display = "none";
                    }
                }
            },
            upload_start_handler:uploadStart,
            upload_progress_handler:uploadProgress,
            upload_error_handler:uploadError,
            upload_success_handler:function (file, serverData) {
                try{
                    var info = eval("("+serverData+")");
                }catch(e){}
                var progress = new FileProgress(file, this.customSettings.progressTarget);
                if(info.state=="SUCCESS"){
                    progress.setComplete();
                    progress.setStatus("<span style='color: #0b0;font-weight: bold'>"+lang.uploadSuccess+"</span>");
                    uploadVideoList.push({url:info.url,type:info.fileType,original:info.original});
                    progress.toggleCancel(true,this,lang.delSuccessFile);
                }else{
                    progress.setError();
                    progress.setStatus(info.state);
                    progress.toggleCancel(true,this,lang.delFailSaveFile);
                }
            },
            //上传完成回调
            upload_complete_handler:uploadComplete,
            //队列完成回调
            queue_complete_handler:function(numFilesUploaded){
                dialog.buttons[0].setDisabled(false);
//                var status = $G("divStatus");
//                var num = status.innerHTML.match(/\d+/g);
//                status.innerHTML = ((num && num[0] ?parseInt(num[0]):0) + numFilesUploaded) +lang.statusPrompt;
            }
        };
        var swfupload = new SWFUpload( settings );
    };

})();