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
    function convert_url(url){
        if ( !url ) return '';
        url = utils.trim(url)
            .replace(/v\.youku\.com\/v_show\/id_([\w\-=]+)\.html/i, 'player.youku.com/player.php/sid/$1/v.swf')
            .replace(/(www\.)?youtube\.com\/watch\?v=([\w\-]+)/i, "www.youtube.com/v/$2")
            .replace(/youtu.be\/(\w+)$/i, "www.youtube.com/v/$1")
            .replace(/v\.ku6\.com\/.+\/([\w\.]+)\.html.*$/i, "player.ku6.com/refer/$1/v.swf")
            .replace(/www\.56\.com\/u\d+\/v_([\w\-]+)\.html/i, "player.56.com/v_$1.swf")
            .replace(/www.56.com\/w\d+\/play_album\-aid\-\d+_vid\-([^.]+)\.html/i, "player.56.com/v_$1.swf")
            .replace(/v\.pps\.tv\/play_([\w]+)\.html.*$/i, "player.pps.tv/player/sid/$1/v.swf")
            .replace(/www\.letv\.com\/ptv\/vplay\/([\d]+)\.html.*$/i, "i7.imgs.letv.com/player/swfPlayer.swf?id=$1&autoplay=0")
            .replace(/www\.tudou\.com\/programs\/view\/([\w\-]+)\/?/i, "www.tudou.com/v/$1")
            .replace(/v\.qq\.com\/cover\/[\w]+\/[\w]+\/([\w]+)\.html/i, "static.video.qq.com/TPout.swf?vid=$1")
            .replace(/v\.qq\.com\/.+[\?\&]vid=([^&]+).*$/i, "static.video.qq.com/TPout.swf?vid=$1")
            .replace(/my\.tv\.sohu\.com\/[\w]+\/[\d]+\/([\d]+)\.shtml.*$/i, "share.vrs.sohu.com/my/v.swf&id=$1");

        return url;
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

        var conUrl = convert_url(url);

        $G("preview").innerHTML = '<div class="previewMsg"><span>'+lang.urlError+'</span></div>'+
        '<embed class="previewVideo" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer"' +
            ' src="' + conUrl + '"' +
            ' width="' + 420  + '"' +
            ' height="' + 280  + '"' +
            ' wmode="transparent" play="true" loop="false" menu="false" allowscriptaccess="never" allowfullscreen="true" >' +
        '</embed>';
    }


    /* 插入上传视频 */
    function insertUpload(){
        var videoObjs=[],
            uploadDir = editor.options.videoUrlPrefix,
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
        var unFinishFileCount = 0;
        var acceptExtensions = editor.getOpt('videoAllowFiles').join('').replace(/\./g, ',').replace(/^[,]/, '');
        var uploader = WebUploader.create({
            pick: {
                id: '#spanButtonPlaceHolder',
                label: lang.browseFiles
            },
            accept: {
                title: 'Videos',
                extensions: acceptExtensions,
                mimeTypes: 'video/*'
            },
            swf: '../../third-party/webuploader/Uploader.swf',
            disableGlobalDnd: true,
            chunked: true,
            server: editor.getActionUrl(editor.getOpt('videoActionName')),
            fileVal: editor.getOpt('videoFieldName'),
            duplicate: true,
            fileSingleSizeLimit: editor.getOpt('videoMaxSize'),
            compress: false
        });

        $('#startUpload').on('click', function(){
            uploader.upload();
        });

        uploader.on('fileQueued', function (file) {
            unFinishFileCount++;
            $('<div class="progressWrapper" id="' + file.id + '">' +
                '<div class="progressContainer">' +
                '<a class="progressCancel" href="#" title="' + lang.delUploadQueue + '" style="visibility: visible;"></a>' +
                '<div class="progressName">' + file.name + '</div>' +
                '<div class="progressBarStatus">' + lang.fileUploadReady + '</div>' +
                '<div class="progressBarInProgress"></div>' +
                '</div>' +
                '</div>').appendTo('#fsUploadProgress')
                .find('.progressCancel').on('click', function(e){
                    uploader.removeFile(file);
                    e.preventDefault();
                });
        });
        uploader.on('filesQueued', function (file) {
            $('#startUpload').show();
            dialog.buttons[0].setDisabled(true);
        });
        uploader.on('fileDequeued', function (file) {
            unFinishFileCount--;
            if (!unFinishFileCount) dialog.buttons[0].setDisabled(false);
            $('#' + file.id).remove();
        });
        uploader.on('uploadProgress', function (file, p) {
            var id = file.id;
            setFileState(id, 'green', lang.fileUploading);
            $('#' + id).find('.progressBarInProgress').css('width', p * 100 + '%');
        });
        uploader.on('uploadSuccess', function (file, r) {
            var id = file.id;
            try {
                var info = eval('(' + (r._raw || r)+ ')');
                if (info.state == 'SUCCESS' && info.url) {
                    uploadVideoList.push({
                        'url': info.url,
                        'type': info.fileType,
                        'original':info.original
                    });
                    setFileState(id, 'blue', lang.uploadSuccess);
                } else {
                    setFileState(id, 'red', info.state);
                }
            } catch (e) {
                setFileState(id, 'red', lang.failUpload);
            }
        });
        uploader.on('uploadError', function (file, code) {
            setFileState(file.id, 'red', lang.netError + code);
        });
        uploader.on('error', function (file, code) {
            setFileState(file.id, 'red', code);
        });
        uploader.on('uploadComplete', function (file, code) {
        });
        uploader.on('uploadFinished', function (file, code) {
            $('#startUpload').hide();
            dialog.buttons[0].setDisabled(false);
        });

        function setFileState(id, color, msg){
            var $file = $('#' + id);
            $file.find('.progressContainer').removeClass('green red blue').addClass(color)
                .find('.progressBarStatus').text(msg);
            if (color == 'red') {
                $file.find('.progressBarInProgress').css('width', 0);
                $file.find('.progressCancel').attr('title', lang.delFailSaveFile);
            } else if (color == 'blue') {
                $file.find('.progressBarStatus').css({color: '#0b0', 'font-weight': 'bold'});
                $file.find('.progressCancel').attr('title', lang.delSuccessFile).hide();
            }
        }
    }

})();