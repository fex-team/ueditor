(function () {

    var backupStyle = editor.queryCommandValue('background');

    window.onload = function () {
        initTabs();
        initColorSelector();
        getImageData(initImagePanel);
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

    /* 初始化颜色设置 */
    function initColorSelector () {
        var obj = editor.queryCommandValue('background');
        if (obj) {
            var color = obj['background-color'],
                repeat = obj['background-repeat'] || 'repeat',
                image = obj['background-image'] || '',
                position = obj['background-position'] || 'center center',
                pos = position.split(' '),
                x = parseInt(pos[0]) || 0,
                y = parseInt(pos[1]) || 0;

            if(repeat == 'no-repeat' && (x || y)) repeat = 'self';

            image = image.match(/url[\s]*\(([^\)]*)\)/);
            image = image ? image[1]:'';
            updateFormState('colored', color, image, repeat, x, y);
        } else {
            updateFormState();
        }

        var updateHandler = function () {
            updateFormState();
            updateBackground();
        }
        domUtils.on($G('nocolorRadio'), 'click', updateBackground);
        domUtils.on($G('coloredRadio'), 'click', updateHandler);
        domUtils.on($G('url'), 'keyup', function(){
            if($G('url').value && $G('alignment').style.display == "none") {
                utils.each($G('repeatType').children, function(item){
                    item.selected = ('repeat' == item.getAttribute('value') ? 'selected':false);
                });
            }
            updateHandler();
        });
        domUtils.on($G('repeatType'), 'change', updateHandler);
        domUtils.on($G('x'), 'keyup', updateBackground);
        domUtils.on($G('y'), 'keyup', updateBackground);

        initColorPicker();
    }

    /* 初始化颜色选择器 */
    function initColorPicker() {
        var me = editor,
            cp = $G("colorPicker");

        /* 生成颜色选择器ui对象 */
        var popup = new UE.ui.Popup({
            content: new UE.ui.ColorPicker({
                noColorText: me.getLang("clearColor"),
                editor: me,
                onpickcolor: function (t, color) {
                    updateFormState('colored', color);
                    updateBackground();
                    UE.ui.Popup.postHide();
                },
                onpicknocolor: function (t, color) {
                    updateFormState('colored', 'transparent');
                    updateBackground();
                    UE.ui.Popup.postHide();
                }
            }),
            editor: me,
            onhide: function () {
            }
        });

        /* 设置颜色选择器 */
        domUtils.on(cp, "click", function () {
            popup.showAnchor(this);
        });
        domUtils.on(document, 'mousedown', function (evt) {
            var el = evt.target || evt.srcElement;
            UE.ui.Popup.postHide(el);
        });
        domUtils.on(window, 'scroll', function () {
            UE.ui.Popup.postHide();
        });
    }

    /* 向后台拉取图片列表数据 */
    function getImageData(callback) {
        ajax.request(editor.options.imageManagerUrl, {
            timeout: 100000,
            action: 'get',
            onsuccess: function (r) {
                var data = r.responseText.split('ue_separate_ue');
                if(data.length && data[0]=='') data.shift();
                if(data.length && data[data.length-1]=='') data.pop();
                callback(data.length ? data:lang.noUploadImage);
            },
            onerror: function () {
                callback(lang.imageLoadError);
            }
        });
    }

    /* 初始化在线图片列表 */
    function initImagePanel(data) {
        var imagePanel = $G("imageList");
        if(utils.isArray(data) && data) {
            utils.each(data, function(value, key){
                var img = document.createElement("img"),
                    div = document.createElement("div");
                div.appendChild(img);
                div.style.display = "none";
                imagePanel.appendChild(div);

                domUtils.on(img, 'click', function(e){
                    var target = e.target || e.srcElement,
                        nodes = imagePanel.childNodes;
                    updateFormState('nocolor', null, '');
                    for (var i = 0, node; node = nodes[i++];) {
                        if(node.firstChild == target && !node.firstChild.getAttribute("selected")) {
                            node.firstChild.setAttribute("selected", "true");
                            node.firstChild.style.cssText = "filter:alpha(Opacity=50);-moz-opacity:0.5;opacity: 0.5;border:2px solid blue;";
                            updateFormState('colored', null, target.getAttribute("src"), 'repeat');
                        } else {
                            node.firstChild.removeAttribute("selected");
                            node.firstChild.style.cssText = "filter:alpha(Opacity=100);-moz-opacity:1;opacity: 1;border: 2px solid #fff";
                        }
                    }
                    updateBackground();
                });

                img.onload = function (e) {
                    this.parentNode.style.display = "";
                    var w = this.width, h = this.height;
                    scale(this, 95, 120, 80);
                    this.title = lang.toggleSelect + w + "X" + h;
                };
                img.setAttribute(key < 35 ? "src" : "lazy_src", editor.options.imageManagerPath + value.replace(/\s+|\s+/ig, ""));
                img.setAttribute("_src", editor.options.imageManagerPath + value.replace(/\s+|\s+/ig, ""));
            });
        } else {
            imagePanel.innerHTML = "&nbsp;&nbsp;" + data;
        }
    }

    /* 图片缩放 */
    function scale(img, max, oWidth, oHeight) {
        var width = 0, height = 0, percent, ow = img.width || oWidth, oh = img.height || oHeight;
        if (ow > max || oh > max) {
            if (ow >= oh) {
                if (width = ow - max) {
                    percent = (width / ow).toFixed(2);
                    img.height = oh - oh * percent;
                    img.width = max;
                }
            } else {
                if (height = oh - max) {
                    percent = (height / oh).toFixed(2);
                    img.width = ow - ow * percent;
                    img.height = max;
                }
            }
        }
    }

    /* 更新背景色设置面板 */
    function updateFormState (radio, color, url, align, x, y) {
        var nocolorRadio = $G('nocolorRadio'),
            coloredRadio = $G('coloredRadio');

        if(radio) {
            nocolorRadio.checked = (radio == 'colored' ? false:'checked');
            coloredRadio.checked = (radio == 'colored' ? 'checked':false);
        }
        if(color) {
            domUtils.setStyle($G("colorPicker"), "background-color", color);
        }
        if(url || url === '') {
            $G('url').value = url;
        }
        if(align) {
            utils.each($G('repeatType').children, function(item){
                item.selected = (align == item.getAttribute('value') ? 'selected':false);
            });
        }
        if(x || y) {
            $G('x').value = parseInt(x) || 0;
            $G('y').value = parseInt(y) || 0;
        }

        $G('alignment').style.display = coloredRadio.checked && $G('url').value ? '':'none';
        $G('custom').style.display = coloredRadio.checked && $G('url').value && $G('repeatType').value == 'self' ? '':'none';
    }

    /* 更新背景颜色 */
    function updateBackground () {
        if ($G('coloredRadio').checked) {
            var color = domUtils.getStyle($G("colorPicker"), "background-color"),
                bgimg = $G("url").value,
                align = $G("repeatType").value,
                backgroundObj = {
                    "background-repeat": "no-repeat",
                    "background-position": "center center"
                };

            if (color) backgroundObj["background-color"] = color;
            if (bgimg) backgroundObj["background-image"] = 'url(' + bgimg + ')';
            if (align == 'self') {
                backgroundObj["background-position"] = $G("x").value + "px " + $G("y").value + "px";
            } else if (align == 'repeat-x' || align == 'repeat-y' || align == 'repeat') {
                backgroundObj["background-repeat"] = align;
            }

            editor.execCommand('background', backgroundObj);
        } else {
            editor.execCommand('background', null);
        }
    }

    dialog.onok = function () {
        updateBackground();
        editor.fireEvent('saveScene');
    };
    dialog.oncancel = function () {
        editor.execCommand('background', backupStyle);
    };
})()