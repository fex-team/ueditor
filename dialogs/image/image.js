/**
 * User: Jinqn
 * Date: 14-04-08
 * Time: 下午16:34
 * 上传图片对话框逻辑代码,包括tab: 远程图片/上传图片/在线图片/搜索图片
 */

(function () {

    var remoteImage,
        uploadImage,
        onlineImage,
        searchImage;

    window.onload = function () {
        initTabs();
        initButtons();
    };

    /* 初始化tab标签 */
    function initTabs() {
        var tabs = $G('tabhead').children;
        for (var i = 0; i < tabs.length; i++) {
            domUtils.on(tabs[i], "click", function (e) {
                var j, targetBodyId, target = e.target || e.srcElement;
                for (j = 0; j < tabs.length; j++) {
                    if (tabs[j] == target) {
                        tabs[j].className = "focus";
                        targetBodyId = tabs[j].getAttribute('data-content-id');
                        $G(targetBodyId).style.display = "block";
                    } else {
                        tabs[j].className = "";
                        $G(tabs[j].getAttribute('data-content-id')).style.display = "none";
                    }
                }
                resetTabBody(targetBodyId);
            });
        }
        resetTabBody('remote');
    }

    /* 初始化tabbody */
    function resetTabBody(id) {
        switch (id) {
            case 'remote':
                remoteImage = remoteImage || new RemoteImage();
                break;
            case 'upload':
                uploadImage = uploadImage || new UploadImage('queueList');
                break;
            case 'online':
                onlineImage = onlineImage || new OnlineImage('imageList');
                break;
            case 'search':
                break;
        }
    }

    /* 初始化onok事件 */
    function initButtons() {
        var btn = dialog.buttons[0];

        dialog.onok = function () {
            var list, id, tabs = $G('tabhead').children;
            for (var i = 0; i < tabs.length; i++) {
                if (domUtils.hasClass(tabs[i], 'focus')) {
                    id = tabs[i].getAttribute('data-content-id');
                    break;
                }
            }

            switch (id) {
                case 'remote':
                    break;
                case 'upload':
                    list = uploadImage.getInsertList();
                    break;
                case 'online':
                    list = onlineImage.getInsertList();
                    break;
                case 'search':
                    break;
            }

            editor.execCommand('insertimage', list);
        };
    }



    /* 在线图片 */
    function RemoteImage(target) {
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }

    RemoteImage.prototype = {
        init: function () {
            this.initContainer();
            this.initEvents();
        },
        initContainer: function () {
            this.dom = {
                'url': $G('url'),
                'width': $G('width'),
                'height': $G('height'),
                'border': $G('border'),
                'vhSpace': $G('vhSpace'),
                'title': $G('title'),
                'align': $G('align')
            };
            var img = editor.selection.getRange().getClosedNode();
            if (img) {
                this.setImage(img);
            }
        },
        initEvents: function () {
            var _this = this;
            /* 改变url */
            domUtils.on($G("url"), 'change', function(e){

            });
            /* 改变width */
            domUtils.on($G("width"), 'change', function(e){

            });
            /* 改变height */
            domUtils.on($G("height"), 'change', function(e){

            });
            /* 点击align图标 */
            domUtils.on($G("url"), 'click', function(e){
                var target = e.target || e.srcElement;
                if(target.className && target.className.indexOf('-align') != -1) {
                    setAlign(target.getAttribute('data-align'));
                }
            });
        },
        setImage: function(img){
            /* 不是正常的图片 */
            if (!img.tagName || img.tagName.toLowerCase() != 'img' && !img.getAttribute("src") || !img.src) return;

            var wordImgFlag = img.getAttribute("word_img"),
                src = wordImgFlag ? wordImgFlag.replace("&amp;", "&") : (img.getAttribute('_src') || img.getAttribute("src", 2).replace("&amp;", "&")),
                align = editor.queryCommandValue("imageFloat") || "none";

            /* 防止onchange事件循环调用 */
            if (src !== $G("url").value) $G("url").value = src;
            /* 设置表单内容 */
            $G("width").value = img.width || '';
            $G("height").value = img.height || '';
            $G("border").value = img.getAttribute("border") || '';
            $G("vhSpace").value = img.getAttribute("vspace") || '';
            $G("title").value = img.title || img.alt ||'';
            this.setAlign(align);

            this.setPreview(img, true);
            var tabElements = g("imageTab").children,
                tabHeads = tabElements[0].children,
                tabBodys = tabElements[1].children;
            for (var i = 0, ci; ci = tabHeads[i++];) {
                if (ci.getAttribute("tabSrc") == "remote") {
                    clickHandler(tabHeads, tabBodys, ci);
                }
            }
        },
        setAlign: function(align){
            var aligns = $G("alignIcon").children;
            for(i = 0; i < aligns.length; i++){
                if(aligns[i].getAttribute('data-align') == 'align') {
                    domUtils.removeClasses(aligns[i], 'focus');
                } else {
                    domUtils.addClass(aligns[i], 'focus');
                }
            }
            $G("align").value = target.getAttribute('data-align');
        },
        getData: function(){
            return $G("align").value;
        },
        setPreview: function(img){
            var tmpWidth = img.width,
                tmpHeight = img.height;
            var maxWidth = 262,
                maxHeight = 262,
                target = scaling(tmpWidth, tmpHeight, maxWidth, maxHeight);
            target.border = img.border || 0;
            target.src = img.src;
            if ((target.width + 2 * target.border) > maxWidth) {
                target.width = maxWidth - 2 * target.border;
            }
            if ((target.height + 2 * target.border) > maxWidth) {
                target.height = maxWidth - 2 * target.border;
            }
            var preview = g("preview");
            preview.innerHTML = '<img src="' + target.src + '" width="' + target.width + '" height="' + target.height + '" border="' + target.border + 'px solid #000" />';
        },
        getInsertList: function () {
            return list;
        }
    };


    /* 上传图片 */
    function UploadImage(target) {
        this.$wrap = target.constructor == String ? $('#' + target) : $(target);
        this.init();
    }

    UploadImage.prototype = {
        init: function () {
            this.imageList = [];
            this.initContainer();
            this.initUploader();
        },
        initContainer: function () {
            this.$queue = this.$wrap.find('.filelist').hide();
        },
        /* 初始化容器 */
        initUploader: function () {
            var _this = this,
                $ = jQuery,    // just in case. Make sure it's not an other libaray.
                $wrap = _this.$wrap,
            // 图片容器
                $queue = $wrap.find('.filelist'),
            // 状态栏，包括进度和控制按钮
                $statusBar = $wrap.find('.statusBar'),
            // 文件总体选择信息。
                $info = $statusBar.find('.info'),
            // 上传按钮
                $upload = $wrap.find('.uploadBtn'),
            // 上传按钮
                $filePickerBtn = $wrap.find('.filePickerBtn').hide(),
            // 上传按钮
                $filePickerBlock = $wrap.find('.filePickerBlock'),
            // 没选择文件之前的内容。
                $placeHolder = $wrap.find('.placeholder'),
            // 总体进度条
                $progress = $statusBar.find('.progress').hide(),
            // 添加的文件数量
                fileCount = 0,
            // 添加的文件总大小
                fileSize = 0,
            // 优化retina, 在retina下这个值是2
                ratio = window.devicePixelRatio || 1,
            // 缩略图大小
                thumbnailWidth = 115 * ratio,
                thumbnailHeight = 115 * ratio,
            // 可能有pedding, ready, uploading, confirm, done.
                state = 'pedding',
            // 所有文件的进度信息，key为file id
                percentages = {},
                supportTransition = (function () {
                    var s = document.createElement('p').style,
                        r = 'transition' in s ||
                            'WebkitTransition' in s ||
                            'MozTransition' in s ||
                            'msTransition' in s ||
                            'OTransition' in s;
                    s = null;
                    return r;
                })(),
            // WebUploader实例
                uploader;

            uploader = _this.uploader = WebUploader.create({
                pick: {
                    id: '#filePickerReady',
                    label: '点击选择图片'
                },
                dnd: '#queueList',
                paste: document.body,
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,bmp,png',
                    mimeTypes: 'image/*'
                },
                swf: '../../third-party/webuploader/webuploader.swf',
                disableGlobalDnd: true,
                chunked: true,
                server: editor.getOpt('imageUrl'),
                fileVal: editor.getOpt('imageFieldName'),
                duplicate: true,
                fileNumLimit: 300,
                fileSizeLimit: 200 * 1024 * 1024,    // 200 M
                fileSingleSizeLimit: 50 * 1024 * 1024    // 50 M
            });
            uploader.addButton({
                id: '#filePickerBlock'
            });
            uploader.addButton({
                id: '#filePickerBtn',
                label: '继续添加'
            });

            // 当有文件添加进来时执行，负责view的创建
            function addFile(file) {
                var $li = $('<li id="' + file.id + '">' +
                        '<p class="title">' + file.name + '</p>' +
                        '<p class="imgWrap"></p>' +
                        '<p class="progress"><span></span></p>' +
                        '</li>'),

                    $btns = $('<div class="file-panel">' +
                        '<span class="cancel">删除</span>' +
                        '<span class="rotateRight">向右旋转</span>' +
                        '<span class="rotateLeft">向左旋转</span></div>' +
                        '<p class="error"></p>').appendTo($li),
                    $prgress = $li.find('p.progress span'),
                    $wrap = $li.find('p.imgWrap'),
                    $info = $li.find('.error').hide(),

                    showError = function (code) {
                        switch (code) {
                            case 'exceed_size':
                                text = '文件大小超出';
                                break;
                            case 'interrupt':
                                text = '上传暂停';
                                break;
                            default:
                                text = '上传失败，请重试';
                                break;
                        }
                        $info.text(text).show();
                    };

                if (file.getStatus() === 'invalid') {
                    showError(file.statusText);
                } else {
                    $wrap.text('预览中');
                    uploader.makeThumb(file, function (error, src) {
                        if (error) {
                            $wrap.text('不能预览');
                            return;
                        }

                        var img = $('<img src="' + src + '">');
                        $wrap.empty().append(img);
                    }, thumbnailWidth, thumbnailHeight);
                    percentages[ file.id ] = [ file.size, 0 ];
                    file.rotation = 0;
                }

                file.on('statuschange', function (cur, prev) {
                    if (prev === 'progress') {
                        $prgress.hide().width(0);
                    } else if (prev === 'queued') {
                        $li.off('mouseenter mouseleave');
                        $btns.remove();
                    }
                    // 成功
                    if (cur === 'error' || cur === 'invalid') {
                        console.log(file.statusText);
                        showError(file.statusText);
                        percentages[ file.id ][ 1 ] = 1;
                    } else if (cur === 'interrupt') {
                        showError('interrupt');
                    } else if (cur === 'queued') {
                        percentages[ file.id ][ 1 ] = 0;
                    } else if (cur === 'progress') {
                        $info.remove();
                        $prgress.css('display', 'block');
                    } else if (cur === 'complete') {
                        $li.append('<span class="success"></span>');
                    }

                    $li.removeClass('state-' + prev).addClass('state-' + cur);
                });

                $li.on('mouseenter', function () {
                    $btns.stop().animate({height: 30});
                });
                $li.on('mouseleave', function () {
                    $btns.stop().animate({height: 0});
                });

                $btns.on('click', 'span', function () {
                    var index = $(this).index(),
                        deg;

                    switch (index) {
                        case 0:
                            uploader.removeFile(file);
                            return;
                        case 1:
                            file.rotation += 90;
                            break;
                        case 2:
                            file.rotation -= 90;
                            break;
                    }

                    if (supportTransition) {
                        deg = 'rotate(' + file.rotation + 'deg)';
                        $wrap.css({
                            '-webkit-transform': deg,
                            '-mos-transform': deg,
                            '-o-transform': deg,
                            'transform': deg
                        });
                    } else {
                        $wrap.css('filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation=' + (~~((file.rotation / 90) % 4 + 4) % 4) + ')');
                    }

                });

                $li.insertBefore($filePickerBlock);
            }

            // 负责view的销毁
            function removeFile(file) {
                var $li = $('#' + file.id);
                delete percentages[ file.id ];
                updateTotalProgress();
                $li.off().find('.file-panel').off().end().remove();
            }

            function updateTotalProgress() {
                var loaded = 0,
                    total = 0,
                    spans = $progress.children(),
                    percent;

                $.each(percentages, function (k, v) {
                    total += v[ 0 ];
                    loaded += v[ 0 ] * v[ 1 ];
                });

                percent = total ? loaded / total : 0;

                spans.eq(0).text(Math.round(percent * 100) + '%');
                spans.eq(1).css('width', Math.round(percent * 100) + '%');
                updateStatus();
            }

            function updateStatus() {
                var text = '', stats;

                if (state === 'ready') {
                    text = '选中' + fileCount + '张图片，共' +
                        WebUploader.formatSize(fileSize) + '。';
                } else if (state === 'confirm') {
                    stats = uploader.getStats();
                    if (stats.uploadFailNum) {
                        text = '已成功上传' + stats.successNum + '张照片，' +
                            stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>'
                    }
                } else {
                    stats = uploader.getStats();
                    text = '共' + fileCount + '张（' +
                        WebUploader.formatSize(fileSize) +
                        '），已上传' + stats.successNum + '张';

                    if (stats.uploadFailNum) {
                        text += '，失败' + stats.uploadFailNum + '张';
                    }
                }

                $info.html(text);
            }

            function setState(val, files) {
                if (val === state) {
                    return;
                }

                var stats = uploader.getStats();

                $upload.removeClass('state-' + state);
                $upload.addClass('state-' + val);


                switch (val) {

                    /* 未选择文件 */
                    case 'pedding':
                        $queue.hide(); $statusBar.hide(); $placeHolder.show();
                        $progress.hide(); $info.hide();
                        uploader.refresh();
                        break;

                    /* 可以开始上传 */
                    case 'ready':
                        $placeHolder.hide(); $queue.show(); $statusBar.show();
                        $progress.hide(); $info.show();
                        $upload.text('开始上传').removeClass('disabled');
                        uploader.refresh();
                        break;

                    /* 上传中 */
                    case 'uploading':
                        $progress.show(); $info.hide();
                        $upload.text('暂停上传');
                        break;

                    /* 暂停上传 */
                    case 'paused':
                        $progress.show(); $info.hide();
                        $upload.text('继续上传');
                        break;

                    case 'confirm':
                        $progress.show(); $info.hide();
                        $upload.text('开始上传').addClass('disabled');

                        stats = uploader.getStats();
                        if (stats.successNum && !stats.uploadFailNum) {
                            setState('finish');
                            return;
                        }
                        break;

                    case 'finish':
                        $progress.hide(); $info.show();
                        if (stats.uploadFailNum) {
                            $upload.text('重试上传').removeClass('disabled');
                        } else {
                            $upload.text('开始上传').addClass('disabled');
                        }
                        break;
                }

                state = val;
                updateStatus();
            }

            uploader.onUploadSuccess = function (file, ret) {
                try {
                    var json = eval('(' + ret._raw + ')');
                    if (json.state == 'SUCCESS') {
                        _this.imageList.push(json);
                    }
                } catch (e) {
                }
            };
            uploader.onUploadProgress = function (file, percentage) {
                var $li = $('#' + file.id),
                    $percent = $li.find('.progress span');

                $percent.css('width', percentage * 100 + '%');
                percentages[ file.id ][ 1 ] = percentage;
                updateTotalProgress();
            };

            uploader.onFileQueued = function (file) {
                fileCount++;
                fileSize += file.size;

                if (fileCount === 1) {
                    $placeHolder.addClass('element-invisible');
                    $statusBar.show();
                }

                addFile(file);
                if (state == 'pedding' || state == 'finish') {
                    setState('ready');
                }
                updateTotalProgress();
            };

            uploader.onFileDequeued = function (file) {
                fileCount--;
                fileSize -= file.size;

                if (!fileCount) {
                    setState('pedding');
                }

                removeFile(file);
                updateTotalProgress();

            };

            uploader.on('all', function (type, files) {
                switch (type) {
                    case 'uploadFinished':
                        setState('confirm', files);
                        break;
                    case 'startUpload':
                        setState('uploading', files);
                        break;
                    case 'stopUpload':
                        setState('paused', files);
                        break;
                }
            });

            uploader.onError = function (code) {
                //alert('Eroor: ' + code);
            };

            $upload.on('click', function () {
                if ($(this).hasClass('disabled')) {
                    return false;
                }

                if (state === 'ready') {
                    uploader.upload();
                } else if (state === 'paused') {
                    uploader.upload();
                } else if (state === 'uploading') {
                    uploader.stop();
                }
            });

            $info.on('click', '.retry', function () {
                uploader.retry();
            });

            $info.on('click', '.ignore', function () {
                //alert('todo');
            });

            $upload.addClass('state-' + state);
            updateTotalProgress();
        },
        getInsertList: function () {
            var i, data, list = [],
                prefix = editor.getOpt('imagePath');
            for (i = 0; i < this.imageList.length; i++) {
                data = this.imageList[i];
                list.push({
                    src: prefix + data.url,
                    _src: prefix + data.url,
                    title: data.original,
                    alt: data.title
                });
            }
            return list;
        }
    };

    /* 在线图片 */
    function OnlineImage(target) {
        this.container = utils.isString(target) ? document.getElementById(target) : target;
        this.init();
    }

    OnlineImage.prototype = {
        init: function () {
            this.initContainer();
            this.initEvents();
            this.initData();
        },
        /* 初始化容器 */
        initContainer: function () {
            this.container.innerHTML = '';
            this.list = document.createElement('ul');
            this.clearFloat = document.createElement('li');

            domUtils.addClass(this.list, 'list');
            domUtils.addClass(this.clearFloat, 'clearFloat');

            this.list.appendChild(this.clearFloat);
            this.container.appendChild(this.list);
        },
        /* 初始化滚动事件,滚动到地步自动拉取数据 */
        initEvents: function () {
            var _this = this;

            /* 滚动拉取图片 */
            this.container.onscroll = function () {
                //TODO 判断是否已滚动到底部
                if (true) {
                    _this.getImageData();
                }
            };

            /* 选中图片 */
            this.list.onclick = function (e) {
                var target = e.target || e.srcElement,
                    li = target.parentNode;

                if (li.tagName.toLowerCase() == 'li') {
                    li = target.parentNode;
                    if (domUtils.hasClass(li, 'selected')) {
                        domUtils.removeClasses(li, 'selected');
                    } else {
                        domUtils.addClass(li, 'selected');
                    }
                }
            };
        },
        /* 初始化第一次的数据 */
        initData: function () {

            /* 拉取数据需要使用的值 */
            this.state = 0;
            this.listSize = editor.getOpt('imageManagerListSize');
            this.listIndex = 0;

            /* 第一次拉取数据 */
            this.getImageData();
        },
        /* 向后台拉取图片列表数据 */
        getImageData: function () {
            var _this = this;
            ajax.request(editor.options.imageManagerUrl, {
                timeout: 100000,
                data: {
                    size: this.listSize,
                    page: (this.listIndex - 1) / this.listSize + 1
                },
                method: 'get',
                onsuccess: function (r) {
                    try {
                        var json = eval('(' + r.responseText + ')');
                        if (json.state == 'SUCCESS') {
                            _this.pushData(json.list);
                        }
                    } catch (e) {
                    }
                },
                onerror: function () {
                }
            });
        },
        /* 添加图片到列表界面上 */
        pushData: function (list) {
            var i, item, img, icon, _this = this;
            for (i = 0; i < list.length; i++) {
                item = document.createElement('li');
                img = document.createElement('img');
                icon = document.createElement('span');

                img.setAttribute('src', editor.getOpt('imageManagerPath') + list[i]);
                img.setAttribute('_src', editor.getOpt('imageManagerPath') + list[i]);
                img.width = 100;
                img.onload = function () {
                    var image = this;
                    _this.scale(image, image.parentNode.offsetWidth, image.parentNode.offsetHeight);
                };
                domUtils.addClass(icon, 'icon');

                item.appendChild(img);
                item.appendChild(icon);
                this.list.insertBefore(item, this.clearFloat);
            }
        },
        /* 改变图片大小 */
        scale: function (img, w, h, type) {
            var ow = img.width,
                oh = img.height;

            if (type == 'justify') {
                if (ow >= oh) {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            } else {
                if (ow >= oh) {
                    img.width = w * ow / oh;
                    img.height = h;
                    img.style.marginLeft = '-' + parseInt((img.width - w) / 2) + 'px';
                } else {
                    img.width = w;
                    img.height = h * oh / ow;
                    img.style.marginTop = '-' + parseInt((img.height - h) / 2) + 'px';
                }
            }
        },
        getInsertList: function () {
            var i, lis = this.list.children, list = [];
            for (i = 0; i < lis.length; i++) {
                if (domUtils.hasClass(lis[i], 'selected')) {
                    var img = lis[i].firstChild,
                        src = img.getAttribute('_src');
                    list.push({
                        src: src,
                        _src: src
                    });
                }

            }
            return list;
        }
    };

})();