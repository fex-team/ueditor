///import core
///commands 远程图片抓取
///commandsName  catchRemoteImage,catchremoteimageenable
///commandsTitle  远程图片抓取
/*
 * 远程图片抓取,当开启本插件时所有不符合本地域名的图片都将被抓取成为本地服务器上的图片
 *
 */
UE.plugins['catchremoteimage'] = function () {
    var me = this,
        ajax = UE.ajax;

    /* 设置默认值 */
    if (me.options.catchRemoteImageEnable === false) return;
    me.setOpt({
        catchRemoteImageEnable: false
    });

    me.addListener("afterpaste", function () {
        me.fireEvent("catchRemoteImage");
    });

    me.addListener("catchRemoteImage", function () {

        var catcherLocalDomain = me.getOpt('catcherLocalDomain'),
            catcherActionUrl = me.getActionUrl(me.getOpt('imageActionName')),
            catcherUrlPrefix = me.getOpt('catcherUrlPrefix'),
            catcherFieldName = me.getOpt('catcherFieldName');

        var remoteImages = [],
            imgs = domUtils.getElementsByTagName(me.document, "img"),
            test = function (src, urls) {
                for (var j = 0, url; url = urls[j++];) {
                    if (src.indexOf(url) !== -1) {
                        return true;
                    }
                }
                return false;
            };

        for (var i = 0, ci; ci = imgs[i++];) {
            if (ci.getAttribute("word_img")) {
                continue;
            }
            var src = ci.getAttribute("_src") || ci.src || "";
            if (/^(https?|ftp):/i.test(src) && !test(src, catcherLocalDomain)) {
                remoteImages.push(src);
            }
        }

        if (remoteImages.length) {
            catchremoteimage(remoteImages, {
                //成功抓取
                success: function (xhr) {
                    try {
                        var info = eval("(" + xhr.responseText + ")");
                    } catch (e) {
                        return;
                    }

                    /* 获取源路径和新路径 */
                    var i, j, ci, cj, oldSrc, newSrc, list = info.list;

                    for (i = 0; ci = imgs[i++];) {
                        oldSrc = ci.getAttribute("_src") || ci.src || "";
                        for (j = 0; cj = list[j++];) {
                            console.log(oldSrc);
                            console.log(cj.source);
                            console.log(cj.state);
                            if (oldSrc == cj.source && cj.state == "SUCCESS") {  //抓取失败时不做替换处理
                                newSrc = catcherUrlPrefix + cj.url;
                                domUtils.setAttributes(ci, {
                                    "src": newSrc,
                                    "_src": newSrc
                                });
                                break;
                            }
                        }
                    }
                    me.fireEvent('catchremotesuccess')
                },
                //回调失败，本次请求超时
                error: function () {
                    me.fireEvent("catchremoteerror");
                }
            });
        }

        function catchremoteimage(imgs, callbacks) {
            var opt = {
                timeout: 60000, //单位：毫秒，回调请求超时设置。目标用户如果网速不是很快的话此处建议设置一个较大的数值
                onsuccess: callbacks["success"],
                onerror: callbacks["error"]
            };
            opt[catcherFieldName] = imgs;
            ajax.request(catcherActionUrl, opt);
        }

    });
};