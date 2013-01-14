var me = editor,
    doc = me.document,
    bodyStyle,
    cp = $G("colorPicker"),
    bkbodyStyle = "",
    bkcolor = "";
var popup = new UE.ui.Popup({
    content:new UE.ui.ColorPicker({
        noColorText:me.getLang("clearColor"),
        editor:me,
        onpickcolor:function (t, color) {
            domUtils.setStyle(cp, "background-color", color);
            bkcolor = color;
            UE.ui.Popup.postHide();
        },
        onpicknocolor:function (t, color) {
            domUtils.setStyle(cp, "background-color", "transparent");
            bkcolor = "";
            UE.ui.Popup.postHide();
        }
    }),
    editor:me,
    onhide:function () {
        setBody();
    }
});
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
//获得head
var getHead = function () {
    return domUtils.getElementsByTagName($G("tabHeads"), "span");
};
//给head绑定事件
var bindClick = function () {
    var heads = getHead();
    for (var i = 0, head; head = heads[i++];) {
        head.onclick = function () {
            var bodyid = this.getAttribute("tabsrc");
            toggleHead(this);
            toggleBody(bodyid);
            if (bodyid == "imgManager") {
                ajax.request(editor.options.imageManagerUrl, {
                    timeout:100000,
                    action:"get",
                    onsuccess:function (xhr) {
                        var tmp = utils.trim(xhr.responseText),
                            imageUrls = !tmp ? [] : tmp.split("ue_separate_ue"),
                            length = imageUrls.length,
                            imgList = $G("imageList");
                        imgList.innerHTML = !length ? "&nbsp;&nbsp;" + lang.noUploadImage : "";
                        for (var k = 0, ci; ci = imageUrls[k++];) {
                            var img = document.createElement("img");
                            var div = document.createElement("div");
                            div.appendChild(img);
                            div.style.display = "none";
                            imgList.appendChild(div);
                            img.onclick = function () {
                                var nodes = imgList.childNodes;
                                for (var i = 0, node; node = nodes[i++];) {
                                    node.firstChild.removeAttribute("selected");
                                    node.firstChild.style.cssText = "filter:alpha(Opacity=100);-moz-opacity:1;opacity: 1;border: 2px solid #fff";
                                }
                                changeSelected(this);
                            };
                            img.onload = function () {
                                this.parentNode.style.display = "";
                                var w = this.width, h = this.height;
                                scale(this, 95, 120, 80);
                                this.title = lang.toggleSelect + w + "X" + h;
                            };
                            img.setAttribute(k < 35 ? "src" : "lazy_src", editor.options.imageManagerPath + ci.replace(/\s+|\s+/ig, ""));
                            img.setAttribute("data_ue_src", editor.options.imageManagerPath + ci.replace(/\s+|\s+/ig, ""));

                        }
                    },
                    onerror:function () {
                        $G("imageList").innerHTML = lang.imageLoadError;
                    }
                });
            } else {
                var radios = document.getElementsByName("t");
                for (var i = 0, r; r = radios[i++];) {
                    if (r.checked && r.value != "none") {
                        $G("repeatType").style.display = "";
                        net(r);
                    }
                }
            }
        }
    }
};
/**
 * 改变o的选中状态
 * @param o
 */
function changeSelected(o) {
    if (o.getAttribute("selected")) {
        o.removeAttribute("selected");
        o.style.cssText = "filter:alpha(Opacity=100);-moz-opacity:1;opacity: 1;border: 2px solid #fff";
    } else {
        o.setAttribute("selected", "true");
        o.style.cssText = "filter:alpha(Opacity=50);-moz-opacity:0.5;opacity: 0.5;border:2px solid blue;";
    }
    $G("url").value = o.getAttribute("src")
}
/**
 * 图片缩放
 * @param img
 * @param max
 */
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
//切换body
var toggleBody = function (id) {
    var bodys = ["normal", "imgManager"];
    for (var i = 0, body; body = bodys[i++];) {
        $G(body).style.zIndex = body == id ? 200 : 1;
    }
};
//切换head
var toggleHead = function (obj) {
    var heads = getHead();
    for (var i = 0, head; head = heads[i++];) {
        domUtils.removeClasses(head, ["focus"]);
        $G("repeatType").style.display = "none";
    }
    domUtils.addClass(obj, "focus");
};
//获得当前选中的tab
var getCheckedTab = function () {
    var heads = getHead();
    for (var i = 0, head; head = heads[i++];) {
        if (domUtils.hasClass(head, "focus")) {
            return head;
        }
    }
};


var init = function () {
    bindClick();
    var el = getHead()[0],
            bodyid = el.getAttribute("tabsrc");
    toggleHead(el);
    toggleBody(bodyid);
    $G("alignment").style.display = "none";
    $G("custom").style.display = "none";
    //初始化颜色
    domUtils.setStyle(cp, "background-color", domUtils.getComputedStyle(doc.body, "background-color"));
    var color = domUtils.getComputedStyle(doc.body, "background-color");
    if ((color && color != "#ffffff" && color != "transparent") || domUtils.getComputedStyle(doc.body, "background-image") != "none") {
        setTimeout(function () {
            document.getElementsByName("t")[1].click();
        }, 200);
    }
    initImgUrl();
    initSelfPos();
    initAlign();
};
//初始化自定义位置
function initSelfPos() {
    var x, y;
    if (browser.ie) {
        x = domUtils.getComputedStyle(doc.body, "background-position-x").replace(/50%|%|px|center/ig, "");
        y = domUtils.getComputedStyle(doc.body, "background-position-y").replace(/50%|%|px|center/ig, "");
    } else {
        var arr = domUtils.getComputedStyle(doc.body, "background-position").match(/\s?(\d*)px/ig);
        if (arr && arr.length) {
            x = arr[0].replace("px", "");
            y = arr[1].replace("px", "");
        }
    }
    $G("x").value = x || 0;
    $G("y").value = y || 0;
}
//初始化图片地址
function initImgUrl() {
    var su = domUtils.getComputedStyle(doc.body, "background-image"),
        url = "";
    if (su.indexOf(me.options.imagePath) > 0) {
        url = su.match(/url\("?(.*[^\)"])"?/i);
        if (url && url.length) {
            url = url[1].substring(url[1].indexOf(me.options.imagePath), url[1].length);
        }
    } else {
        url = su != "none" ? su.replace(/url\("?|"?\)/ig, "") : "";
    }
    $G("url").value = url;
}
//初始化定位
function initAlign() {
    var align = domUtils.getComputedStyle(doc.body, "background-repeat"),
        alignType = $G("repeatType");
    if (align == "no-repeat") {
        var pos = domUtils.getComputedStyle(doc.body, browser.ie ? "background-position-x" : "background-position");
        alignType.value = pos && pos.match(/\s?(\d*)px/ig) ? "self" : "center";
        if (pos == "center") {
            alignType.value = "center";
        }
        $G("custom").style.display = alignType.value == "self" ? "" : "none";
    } else {
        alignType.value = align;
    }
}
    init();



//获得选中的类型
function getCheckIpt() {
    var ipts = document.getElementsByName("t");
    for (var i = 0, ipt; ipt = ipts[i++];) {
        if (ipt.checked) {
            return ipt.value;
        }
    }
}
var net = function (obj) {
    var align = $G("alignment"),
        url = $G("url"),
        custom = $G("custom");
    if (obj.value == "none") {
        align.style.display = "none";
        custom.style.display = "none";
        if (browser.ie) {
            url.onpropertychange = null;
        } else {
            url.removeEventListener("input", setBody);
        }
    } else {
        bindSelfPos();
        $G("repeatType").style.display = "";
        align.style.display = "";
        if (browser.ie) {
            url.onpropertychange = setBody;
        } else {
            url.addEventListener("input", setBody, false);
        }
    }
    setBody();
};
//给自定义位置绑定事件
var bindSelfPos = function () {
    var x = $G("x"),
        y = $G("y");
    domUtils.on(x, ["propertychange", "input", "keydown"], function (evt) {
        bindkeydown(evt, this);
    });
    domUtils.on(y, ["propertychange", "input", "keydown"], function (evt) {
        bindkeydown(evt, this);
    });
    function bindkeydown(evt, obj) {
        evt = evt || event;
        if (evt.keyCode == 38 || evt.keyCode == 40) {
            obj.value = evt.keyCode == 38 ? parseInt(obj.value) + 1 : parseInt(obj.value) - 1;
            if (obj.value < 0) {
                obj.value = 0;
            }
        } else {
            if (evt.keyCode < 48 && evt.keyCode > 57) {
                domUtils.preventDefault(evt);
            }
        }
        setBody();
    }
};
var showAlign = function () {
    $G("alignment").style.display = "";
};
var selectAlign = function (obj) {
    $G("custom").style.display = obj.value == "self" ? "" : "none";
    setBody();
};
//给body增加样式和背景图片
var setBody = function () {
    var color = domUtils.getStyle(cp, "background-color"),
        bgimg = $G("url").value,
        align = $G("repeatType").value,
        alignObj = {
            "background-repeat":"no-repeat",
            "background-position":"center center"
        },
        outstr = [];
    if (color)
        alignObj["background-color"] = color;
    if (bgimg)
        alignObj["background-image"] = 'url("' + bgimg + '")';
    switch (align) {
        case "repeat-x":
            alignObj["background-repeat"] = "repeat-x;";
            break;
        case "repeat-y":
            alignObj["background-repeat"] = "repeat-y;";
            break;
        case "repeat":
            alignObj["background-repeat"] = "repeat;";
            break;
        case "self":
            alignObj["background-position"] = $G("x").value + "px " + $G("y").value + "px";
            break;
    }
    for (var name in alignObj) {
        if (alignObj.hasOwnProperty(name)) {
            outstr.push(name + ":" + alignObj[name]);
        }
    }
    if (getCheckIpt() != "none") {
        utils.cssRule('body','body{' + outstr.join(";") + '}',doc);

    } else {

        utils.cssRule('body','',doc)
    }
};



dialog.onok = function () {
    setBody();
};
dialog.oncancel = function () {
    utils.cssRule('body',bkbodyStyle,doc)
};
bkbodyStyle = utils.cssRule('body',undefined,doc);