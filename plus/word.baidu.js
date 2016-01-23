 /*!
 * wordonline
 */

!function() {
    !function() {
        function a() {
            var a = document.getElementsByTagName("script"), c = a[a.length - 1].src;
            if (c) {
                var d = document.createElement("a");
                d.href = c, d.href = d.href;
                var e = d.protocol + "//" + d.hostname + (d.port && "80" != d.port ? ":" + d.port : ""), f = "/" == d.pathname.charAt(0) ? d.pathname : "/" + d.pathname, g = e + f;
                return b(b(g))
            }
            return ""
        }
        function b(a) {
            return a = a.replace(/\/$/, ""), a.substr(0, a.lastIndexOf("/") + 1)
        }
        var c = a(), d = b(c), e = d + "server/";
        window.WO = {WO_URL: c,WO_ROOT_URL: d,WO_SERVER_URL: e,uploaderSwfUrl: c + "lib/webuploader/Uploader.swf",uploaderServerUrl: e + "controller.php?cmd=uploaddoc",uploaderFieldName: "upfile"}
    }(), function() {
        var a = {ui: {back: "返回",undo: "撤销",redo: "重做",quickvisit: {edit: "编辑",upload: "导入文档",download: "下载","new": " 新建",share: "分享",menu: "文件",feedback: "反馈问题"},tabs: {idea: "思路",appearence: "展现",view: "视图"},menu: {mainmenutext: "百度脑图",newtab: "新建",opentab: "打开",savetab: "保存",sharetab: "分享",helptab: "帮助",settingtab: "设置",recenttab: "最近使用",netdisktab: "百度云存储",localtab: "本地文件",drafttab: "草稿箱",downloadtab: "导出到本地",createsharetab: "当前脑图",managesharetab: "已分享",newheader: "新建脑图",openheader: "打开",saveheader: "保存到",shareheader: "分享我的脑图"},mydocument: "我的文档",emptydir: "目录为空！",pickfile: "选择文件...",acceptfile: "支持的格式：{0}",dropfile: "或将文件拖至此处",unsupportedfile: "不支持的文件格式",untitleddoc: "未命名文档",errorloading: "加载失败：{0}",unknownreason: "可能是外星人篡改了代码...",overrideconfirm: "{0} 已存在，确认覆盖吗？",checklogin: "检查登录状态中...",loggingin: "正在登录...",recent: "最近打开",clearrecent: "清空",clearrecentconfirm: "确认清空最近文档列表？",cleardraft: "清空",cleardraftconfirm: "确认清空草稿箱？",login: "登录",logout: "注销",switchuser: "切换账户",userinfo: "个人信息",gotonetdisk: "我的网盘",requirelogin: '请 <a class="login-button">登录</a> 后使用',saveas: "保存为",filename: "文件名",fileformat: "保存格式",save: "保存",mkdir: "新建目录",newdir: "未命名目录"}};
        WO.getLang = function(b) {
            var c = a;
            b = (b || "").split(".");
            for (var d, e = 0; (d = b[e++]) && (c = c[d], c); )
                ;
            return c
        }
    }(), function() {
        WO.utils = {openGetWin: function(a, b) {
                var c = $("<a>").attr("target", "_blank").width(0).height(0).css("clip", "rect(1px, 1px, 1px, 1px)"), d = [];
                b && $.each(b, function(a, b) {
                    d.push(a + "=" + b)
                }), d.length && (a = a + "?" + d.join("&")), c.attr("href", a).appendTo(document.body), c[0].click(), setTimeout(function() {
                    c && c.remove()
                })
            },openPostWin: function(a, b) {
                var c = b.target || "_blank", d = $('<form id="open-post-win" action="' + a + '" target="' + c + '" method="post"></form>');
                b && $.each(b, function(a, b) {
                    "target" != a && $('<input name="' + a + '"/>').val(b).appendTo(d)
                }), d.css("display", "none").appendTo(document.body), d.submit(), setTimeout(function() {
                    d && d.remove()
                })
            },getParam: function() {
                var a;
                return function(b) {
                    if (!a) {
                        var c, d, e;
                        if (a = {}, e = location.hash.substr(1))
                            for (e = e.split("&"), c = 0; c < e.length; c++)
                                d = e[c].split("="), a[d[0]] = d[1]
                    }
                    return a[b]
                }
            }()}
    }(), function() {
        $.extend(WO, {isReady: function() {
                return 1 == WO.__isReady
            },render: function(a, b) {
                var c = UE.getEditor(b, {toolbars: [["message", "editword"]],initialStyle: "body{padding: 100px!important;overflow-x:hidden!important;}p{word-wrap:break-word;}p{text-align:justify;letter-spacing:.001cm}table td,table th{border-color:#444444!important;padding:2px 8px;}",initialContent: "",autoClearinitialContent: "true",focus: !0,enableDragUpload: !1,zIndex: 10});
                c.ready(function() {
                    WO.initUI(), WO.initRequester(), WO.initToolbar(a, c), WO.initMenu(a, c), WO.initLogin(c), WO.__isReady = !0, WO.fire("ready")
                }), WO.ue = WO.editor = window.ue = c
            },initToolbar: function(a, b) {
                WO.toolbar = FUIToolbar.getToolbar(a, b), WO.fire("toolbarready", WO.toolbar)
            },ready: function(a) {
                WO.isReady() ? a.call() : WO.on("ready", a)
            }})
    }(), function() {
        var a, b;
        $.extend(WO, {showMsg: function(c) {
                $("#wordonline-filename").html(c.content), clearTimeout(a), clearTimeout(b), c.keepshow || (a = setTimeout(function() {
                    WO.hideMsg()
                }, c.timeout || 3e3)), /正在.*\.{3}/.test(c.content) && (b = setInterval(function() {
                    var a = $("#wordonline-filename").html();
                    /正在.*\.{1,3}/.test(a) ? (a = a.replace(/\.{1,3}$/, function(a) {
                        return [".", "..", "..."][a.length % 3]
                    }), $("#wordonline-filename").html(a)) : clearTimeout(b)
                }, 500))
            },updateMsg: function(c) {
                $("#wordonline-filename").html(c.content), clearTimeout(a), clearTimeout(b), c.keepshow || (a = setTimeout(function() {
                    WO.hideMsg()
                }, c.timeout || 3e3)), /正在.*\.{3}/.test(c.content) && (b = setInterval(function() {
                    var a = $("#wordonline-filename").html();
                    /正在.*\.{1,3}/.test(a) ? (a = a.replace(/\.{1,3}$/, function(a) {
                        return [".", "..", "..."][a.length % 3]
                    }), $("#wordonline-filename").html(a)) : clearTimeout(b)
                }, 500))
            },hideMsg: function() {
                var a = WO.doc.current(), b = a && a.path;
                if (b) {
                    $("#wordonline-filename").html((WO.isUnSave ? "* " : "") + b.substr(b.lastIndexOf("/") + 1));
                    var c = 0 === b.indexOf(WO.basePath) ? b.substr(WO.basePath.length) : b, d = "#path=" + c;
                    d != window.location.hash && (window.location.hash = encodeURI(d))
                } else
                    $("#wordonline-filename").html("未命名文档")
            },message: function(a) {
                $("#wordonline-filename").html(a.content)
            },title: function(a) {
                $("#wordonline-filename").html(a);
                try {
                    document.title = a ? a + " - 百度Doc" : "百度Doc"
                } catch (b) {
                }
            }})
    }(), function() {
        function a(a, b) {
            return void 0 === a ? {fid: g,path: f} : (void 0 !== a && null !== a && (g = a), void 0 !== b && null !== b && (f = b), WO.editor.execCommand("serverparam", {fid: g,path: f}), WO.fire("doccurrentchange"), void 0)
        }
        function b(a) {
            a && (a = a.substr(a.lastIndexOf("/") + 1), a = a.substr(0, a.lastIndexOf(".")) || a, a && setTimeout(function() {
                WO.fire("searchonwenku", a)
            }, 2500))
        }
        var c = "", d = "", e = !1, f = "", g = "", h = 0, i = WO.WO_SERVER_URL + "controller.php", j = function(a) {
            try {
                return UE.utils.str2json.apply(null, arguments)
            } catch (b) {
                return console && console.error(b, a), null
            }
        };
        $.extend(WO, {initRequester: function() {
                WO.editor && WO.editor.on("imageUploadSuccess", function(b, c) {
                    !g && c.fid && a(c.fid, c.path)
                })
            },doc: {create: function(a, b) {
                    b(a.html)
                },open: function(b, c) {
                    WO.addMask(), WO.showMsg({keepshow: !0,content: "正在打开文档..."}), $.get(i, {cmd: "opendoc",fid: b.fid,path: b.path}, function(b) {
                        WO.removeMask();
                        var d = j(b);
                        d && "SUCCESS" == d.state && (d.html || d.bdjson) ? (a(d.fid, d.path), WO.hideMsg()) : WO.updateMsg({timeout: 3e3,content: d && "SUCCESS" == d.state ? "文档没有内容!" : "文档打开失败!"}), c && c(d)
                    })
                },view: function(c, d) {
                    WO.addMask(), WO.showMsg({keepshow: !0,content: "正在打开文档..."}), $.get(i, {cmd: "viewdoc",fid: c.fid,path: c.path}, function(c) {
                        WO.removeMask();
                        var e = j(c);
                        e && "SUCCESS" == e.state && (e.html || e.bdjson) ? (a(e.fid, e.path), WO.hideMsg(), b(e.path)) : WO.updateMsg({timeout: 3e3,content: e && "SUCCESS" == e.state ? "文档没有内容!" : "文档打开失败!"}), d && d(e)
                    })
                },save: function(b, k) {
                    WO.showMsg({keepshow: !0,content: "正在保存文档..."}), $.post(i + "?cmd=savedoc&fid=" + g + "&path=" + f + "&newpath=" + (b.newpath || f) + "&docid=" + c + (e ? "&path=" + d : ""), {content: b.content}, function(b) {
                        var c = j(b);
                        c && "SUCCESS" == c.state ? (a(c.fid, c.path), WO.isUnSave = !1, WO.hideMsg()) : (WO.isUnSave = !0, WO.updateMsg({timeout: 3e3,content: "文档保存失败!"}), h = 0), k && k(c)
                    })
                },upload: function(a) {
                    WO.showMsg({keepshow: !0,content: "文档正在上传..."}), $(document.body).addClass("loading");
                    var b = function(d, e) {
                        $(document.body).removeClass("loading");
                        var f = j(e._raw);
                        f && "SUCCESS" == f.state && f.path ? (WO.updateMsg({timeout: 3e3,content: "文档上传成功!"}), WO.fire("openuploadeddoc", f.path, "blank", f)) : WO.updateMsg({timeout: 3e3,content: "文档转换出错!"}), a.off("uploadSuccess", b), a.off("uploadError error", c)
                    }, c = function() {
                        $(document.body).removeClass("loading"), WO.updateMsg({timeout: 3e3,content: "文档转换出错!"}), a.off("uploadSuccess", b), a.off("uploadError error", c)
                    };
                    a.on("uploadSuccess", b), a.on("uploadError error", c)
                },getUploadedDoc: function(c, d) {
                    WO.showMsg({keepshow: !0,content: "正在获取上传文档..."}), WO.addMask(), $.get(i, {cmd: "openuploadeddoc",fid: c.fid}, function(c) {
                        WO.removeMask();
                        var e = j(c), f = e.bdjson;
                        e.html ? (a(e.fid, e.path), WO.hideMsg(), d && d(e.html, "html"), b(e.path)) : f && f["document.xml"] && f["document.xml"].length ? (a(e.fid, e.path), WO.hideMsg(), d && d(f["document.xml"], "bdjson"), b(e.filename)) : (WO.updateMsg({timeout: 3e3,content: "文档获取失败!"}), d && d())
                    })
                },download: function() {
                    var a, b = (+new Date).toString(36), c = f || "未命名文档", d = WO.editor.getContent(), e = $("<iframe>").attr("name", "iframe_" + b).attr("id", "iframe_" + b).hide().appendTo(document.body).on("load", function() {
                        setTimeout(function() {
                            e.remove(), a.remove()
                        }, 500)
                    });
                    c = c.substr(c.lastIndexOf("/") + 1), c = c.substr(0, c.lastIndexOf(".")) || c, a = $('<form action="' + i + '?cmd=downloaddoc" method="post" target="iframe_' + b + '" accept-charset="utf-8"><input type="hidden" name="content" value="" /><input type="hidden" name="filename" value="" /><input type="submit" name="content" value="" /></form>').attr("name", "iframe_" + b).attr("id", "iframe_" + b).hide().appendTo(document.body), a.find("[name=content]").val(d), a.find("[name=filename]").val(c), e.on("load", function() {
                        var a = e[0], b = a.contentDocument || a.contentWindow.document, c = b.body.innerText;
                        if (c) {
                            var d = j(c);
                            "SUCCESS" == d.state ? console && console.log("SUCCESS") : console && console.log(d.state)
                        } else
                            console && console.log("empty text")
                    }), a.submit()
                },current: a}}), $.extend(WO, {share: {list: function(a) {
                    $.get(i, {cmd: "listmyshare"}, function(b) {
                        var c = j(b);
                        c && "SUCCESS" == c.state ? a && a(c.list) : a && a(null)
                    })
                },add: function(b, c) {
                    $.post(i + "?cmd=addshare&fid=" + g + "&path=" + f, {content: b.content}, function(b) {
                        var d = j(b);
                        d && "SUCCESS" == d.state ? (!f && d.fid && a(d.fid, d.path), c && c(d.share)) : c && c(null)
                    })
                },rm: function(a, b) {
                    $.get(i, {cmd: "rmshare",id: a.id}, function(a) {
                        var c = j(a);
                        c && "SUCCESS" == c.state ? b && b(c) : b && b(null)
                    })
                }}})
    }(), function() {
        var a = [], b = {}, c = !1;
        $.extend(WO, {registerUI: function(b, c, d) {
                "function" == typeof c && (d = c, c = null), a.push({id: b,ui: d,deps: c})
            },initUI: function() {
                c || $.each(a, function(a, c) {
                    var d = c.deps;
                    d && (d = $.map(d, function(a) {
                        return WO.getUI(a)
                    })), b[c.id] = c.ui.apply(null, [b].concat(d || []))
                })
            },getUI: function(a) {
                return b[a]
            }})
    }(), function() {
        WO.initLogin = function() {
            function a(a) {
                var b = a && a.id;
                b && setTimeout(function() {
                    fio.user.fire("login"), $(".login-required").removeClass("login-required").addClass("login-done")
                }, 100), $(".userlogout").click(function() {
                    fio.user.logout().then(function() {
                        $(".username").hide(), $(".useravatar").hide(), $(".userlogout").hide(), $(".userlogin").show(), window.location.href = "welcome.html"
                    })
                })[b ? "show" : "hide"](), $(".userlogin").click(function() {
                    fio.user.login({remember: 2592e3})
                })[b ? "hide" : "show"](), $(document).delegate(".login-button", "click", function() {
                    fio.user.login({remember: 2592e3})
                }), b && ($(".username").text(a.username).show(), $(".useravatar").css("background-image", "url(" + a.smallImage + ")").show())
            }
            a(fio.user.current())
        }, WO.doAfterLogin = function(a) {
            var b = fio.user.current();
            b && b.access_token ? setTimeout(function() {
                a(b)
            }) : fio.user.on("login", function(b, c) {
                console.log(b, c), a(b)
            })
        }
    }(), WO.registerUI("eve", function() {
        return {setup: function(a) {
                var b = {};
                return a.on = function(a, c) {
                    var d = $.isArray(a) ? a : a.split(" ");
                    return $.each(d, function(a, d) {
                        var e = b[d] || (b[d] = []);
                        e.push(c)
                    }), this
                }, a.off = function(a, c) {
                    var d = b[a];
                    if (d) {
                        var e = d.indexOf(c);
                        ~e ? d.splice(e, 1) : c[a] = null
                    }
                    return this
                }, a.once = function(b, c) {
                    return this.on(b, function d() {
                        c.apply(a, arguments), a.off(b, d)
                    })
                }, a.fire = function(c) {
                    var d = b[c], e = [].slice.call(arguments, 1);
                    return d && $.each(d, function(b, c) {
                        return 1 == c.apply(a, e) ? !1 : void 0
                    }), this
                }, a
            }}
    }), WO.registerUI("wox", function() {
        var a = WO.getUI("eve");
        a.setup(WO)
    }), WO.registerUI("fiox", function() {
        var a = WO.getUI("eve");
        a.setup(fio.user)
    }), function() {
        $.ajaxSetup({cache: !1})
    }(), WO.registerUI("keymap", function() {
        var a = {"ctrl+alt+192": "newdoc","ctrl+78": "openmenu","ctrl+79": "openmenu","ctrl+83": "savedoc","ctrl+shift+83": "saveasdoc","ctrl+alt+83": "sharedoc","ctrl+80": "print",27: "esc","ctrl+70": "search","ctrl+65": "selectall","ctrl+187": "upsize","ctrl+189": "downsize",8: "backspace"}, b = function(b, c) {
            "string" != typeof b && (c = b);
            var d, e, f = c.keyCode;
            if (91 != f)
                for (e in a)
                    d = e.match(/(ctrl\+)?(shift\+)?(alt\+)?([\d]+)/), !(c.ctrlKey || c.metaKey) ^ Boolean(d[1]) && !c.shiftKey ^ Boolean(d[2]) && !c.altKey ^ Boolean(d[3]) && f == d[4] && WO.fire(a[e], a[e], c)
        };
        WO.on("backspace", function(a, b) {
            var c = b.target || b.srcElement;
            c == document.body && b && (b.preventDefault ? b.preventDefault() : b.returnValue = !1)
        });
        var c = WO.editor;
        c && (c.on("keydown", b), $(document.body).on("keydown", b), UE.browser.chrome && c.on("keydown", function(a, b) {
            var c = b.keyCode || b.which;
            return (b.metaKey && b.altKey || b.ctrlKey && b.shiftKey) && 73 == c ? !0 : void 0
        }), WO.on("selectall", function(a, b) {
            var c = b.target || b.srcElement;
            c && c.tagName && "input" != c.tagName.toLowerCase() && "textarea" != c.tagName.toLowerCase() && 1 != c.contentEditable && (b && (b.preventDefault ? b.preventDefault() : b.returnValue = !1), WO.editor.execCommand("selectAll"))
        }), WO.on("upsize", function(a, b) {
            b && (b.preventDefault ? b.preventDefault() : b.returnValue = !1), WO.editor.execCommand("upsize")
        }), WO.on("downsize", function(a, b) {
            b && (b.preventDefault ? b.preventDefault() : b.returnValue = !1), WO.editor.execCommand("downsize")
        }))
    }), WO.registerUI("enter", function() {
        function a(a, b) {
            var c = (b || location.hash).match(new RegExp("(^|&|#|\\?)" + a + "=([^&]+)"));
            return c && c[2]
        }
        WO.ready(function() {
            var b, c;
            (b = a("tpl")) ? WO.fire("loadtemplate", b) : (c = a("path")) ? WO.fire("opendoc", c, "current") : (action = a("action")) && WO.fire("switchtotpl"), WO.fire("afterloadhash")
        })
    }), WO.registerUI("confirm", function() {
        function a() {
            function a(a, b) {
                switch ("string" != typeof a && (b = a), b.keyCode) {
                    case 13:
                        c.trigger("ok"), c.close();
                        break;
                    case 27:
                        c.close()
                }
            }
            if (!WO._confirmDialog) {
                var c = new FUI.Dialog({title: "",className: "wo-dialog wo-confirm",mask: {className: "wo-confirm-mask",opacity: .2}});
                c.on("ok", function() {
                    b && b()
                }), c.on("open", function() {
                    $(document).on("keydown", a), WO.editor.on("keydown", a)
                }), c.on("close", function() {
                    $(document).off("keydown", a), WO.editor.off("keydown", a)
                }), $(c.getContentElement()).append('<div class="wo-confirm-message"></div>'), c.positionTo(document.body), WO._confirmDialog = c
            }
            return WO._confirmDialog
        }
        var b = function() {
        }, c = function() {
        };
        WO.on("confirm", function(d) {
            var e = a(), f = $(e.getElement());
            if (d) {
                d.onOk && (b = d.onOk), d.onCancel && (c = d.onCancel), f.find(".fui-dialog-caption").html(d.title || ""), f.find(".wo-confirm-message").html(d.message || "确定?");
                var g = e.getButtons();
                g && g.length && (g[0].setLabel(d.textOk || "确定"), g[1].setLabel(d.textCancel || "取消"), !d.textOk && $(g[0].getElement()).hide(), !d.textCancel && $(g[1].getElement()).hide())
            }
            e.open()
        })
    }), WO.registerUI("searchonwenku", function() {
        var a;
        WO.on("searchonwenku", function(b) {
            function c() {
                UE.browser.webkit ? a.transition({x: "-246px"}, 300, "in-out") : a.animate({"margin-left": "-246px"}, "linear")
            }
            function d() {
                UE.browser.webkit ? a.transition({x: "246px"}, 300, "in-out") : a.animate({"margin-left": "0"}, "linear")
            }
            a || (a = $('<div class="search-wenku">   到文库搜索：<a class="keywords" target="_blank" href=""></a>   <div class="s-close" id="s-close">x</div></div>'), a.appendTo(document.body)), a.find(".keywords").text(b).attr("href", "http://wenku.baidu.com/search?from=wordonline&ie=utf-8&word=" + encodeURI(b)), c(), setTimeout(function() {
                d()
            }, 12e3), $("#s-close").on("click", function() {
                d()
            })
        })
    }), WO.addMask = function() {
        $(document.body).addClass("loading"), setTimeout(function() {
            WO.editor.blur()
        })
    }, WO.removeMask = function() {
        $(document.body).removeClass("loading")
    }, WO.registerUI("beforeunload", function() {
        WO.on("afterloadhash", function() {
            var a = WO.editor;
            setTimeout(function() {
                a.on("contentchange", function() {
                    window.onbeforeunload = function() {
                        return "文档未保存，确定离开页面？"
                    }
                })
            }, 200), WO.on("doccurrentchange", function() {
                WO.isUnSave || (window.onbeforeunload = function() {
                })
            })
        })
    }), UE.plugin.register("cut", function() {
        var a = this;
        return {commands: {cut: {execCommand: function() {
                        a.document.execCommand("cut") || alert("浏览器不支持,请使用 'Ctrl + x'")
                    }}}}
    }), UE.plugin.register("fontsizechange", function() {
        var a = this, b = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 26, 36, 48, 72];
        return {shortcutkey: {upsize: 'ctrl+187"',downsize: "ctrl+189"},commands: {upsize: {execCommand: function() {
                        for (var c = parseInt(a.queryCommandValue("fontsize")), d = 0; d < b.length; d++)
                            if (b[d] > c) {
                                a.execCommand("fontsize", b[d] + "px");
                                break
                            }
                    }},downsize: {execCommand: function() {
                        for (var c = parseInt(a.queryCommandValue("fontsize")), d = b.length - 1; d >= 0; d--)
                            if (b[d] < c) {
                                a.execCommand("fontsize", b[d] + "px");
                                break
                            }
                    }}}}
    }), UE.plugin.register("justify", function() {
        var a = this;
        return {commands: {justifyleft: {execCommand: function() {
                        a.execCommand("justify", "left")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "left" == a.queryCommandValue("justify") ? 1 : 0
                    }},justifycenter: {execCommand: function() {
                        a.execCommand("justify", "center")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "center" == a.queryCommandValue("justify") ? 1 : 0
                    }},justifyright: {execCommand: function() {
                        a.execCommand("justify", "right")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "right" == a.queryCommandValue("justify") ? 1 : 0
                    }},justifyjustify: {execCommand: function() {
                        a.execCommand("justify", "justify")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "justify" == a.queryCommandValue("justify") ? 1 : 0
                    }}}}
    }), UE.plugin.register("rowspacing", function() {
        var a = this;
        return {commands: {rowspacingtop: {execCommand: function(b, c) {
                        a.execCommand("rowspacing", c, "top")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "left" == a.queryCommandValue("justify") ? 1 : 0
                    }},rowspacingbottom: {execCommand: function(b, c) {
                        a.execCommand("rowspacing", c, "bottom")
                    },queryCommandState: function() {
                        return -1 == a.queryCommandState("justify") ? -1 : "left" == a.queryCommandValue("justify") ? 1 : 0
                    }}}}
    }), UE.plugin.register("fontstyle", function() {
        var a = this;
        return {commands: {fontstyle: {execCommand: function(b, c) {
                        a.execCommand("paragraph", c.tagName, {style: c.style})
                    }}}}
    }), UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl, UE.Editor.prototype.getActionUrl = function(a) {
        return "uploadimage" == a || "uploadimage" == a ? WO.WO_SERVER_URL + "controller.php?cmd=addimage" : "uploadscrawl" == a ? WO.WO_SERVER_URL + "controller.php?cmd=addscrawl" : this._bkGetActionUrl.call(this, a)
    }, UE.plugin.register("export", function() {
        return {commands: {exporttxt: {execCommand: function() {
                    },queryCommandState: function() {
                        return -1
                    }},exportword: {execCommand: function() {
                    },queryCommandState: function() {
                        return -1
                    }},exportpdf: {execCommand: function() {
                    },queryCommandState: function() {
                        return -1
                    }}}}
    }), UE.plugin.register("todo", function() {
        return {commands: function(a) {
                a = a.split(" ");
                for (var b = {}, c = 0; c < a.length; c++)
                    b[a[c]] = {execCommand: function() {
                        },queryCommandState: function() {
                            return -1
                        }};
                return b
            }("formula comment showcomment coordination")}
    }), UE.plugin.register("messagefix", function() {
        var a = this;
        a.on("showmessage", function() {
            var b = $(a.container);
            $(".edui-editor-messageholder").css({position: "absolute",top: b.offset().top + 4,left: b.offset().left + b.width() - 150 - 3,width: "150px",height: "auto"}).appendTo(document.body)
        })
    }), UE.plugin.register("autoupload", function() {
        function a(a, b) {
            var c, d, e, f, g, h, i, j, k = b, l = /image\/\w+/i.test(a.type) ? "image" : "file", m = "loading_" + (+new Date).toString(36);
            if (c = k.getOpt(l + "FieldName"), d = k.getOpt(l + "UrlPrefix"), e = k.getOpt(l + "MaxSize"), f = k.getOpt(l + "AllowFiles"), g = k.getActionUrl(k.getOpt(l + "ActionName")), i = function(a) {
                var b = k.document.getElementById(m);
                b && UE.dom.domUtils.remove(b), k.fireEvent("showmessage", {id: m,content: a,type: "error",timeout: 4e3})
            }, "image" == l ? (h = '<img class="loadingclass" id="' + m + '" src="' + k.options.themePath + k.options.theme + '/images/spacer.gif">', j = function(a) {
                var b = d + a.url, c = k.document.getElementById(m);
                c && (UE.dom.domUtils.removeClasses(c, "loadingclass"), c.setAttribute("src", b), c.setAttribute("_src", b), c.setAttribute("alt", a.original || ""), c.removeAttribute("id"), k.trigger("contentchange", c))
            }) : (h = '<p><img class="loadingclass" id="' + m + '" src="' + k.options.themePath + k.options.theme + '/images/spacer.gif"></p>', j = function(a) {
                var b = d + a.url, c = k.document.getElementById(m), e = k.selection.getRange(), f = e.createBookmark();
                e.selectNode(c).select(), k.execCommand("insertfile", {url: b}), e.moveToBookmark(f).select()
            }), k.execCommand("inserthtml", h), !k.getOpt(l + "ActionName"))
                return void i(k.getLang("autoupload.errorLoadConfig"));
            if (a.size > e)
                return void i(k.getLang("autoupload.exceedSizeError"));
            var n = a.name ? a.name.substr(a.name.lastIndexOf(".")) : "";
            if (n && "image" != l || f && -1 == (f.join("") + ".").indexOf(n.toLowerCase() + "."))
                return void i(k.getLang("autoupload.exceedTypeError"));
            var o = new XMLHttpRequest, p = new FormData, q = UE.utils.serializeParam(k.queryCommandValue("serverparam")) || "", r = UE.utils.formatUrl(g + (-1 == g.indexOf("?") ? "?" : "&") + q);
            p.append(c, a, a.name || "blob." + a.type.substr("image/".length)), p.append("type", "ajax"), o.open("post", r, !0), o.setRequestHeader("X-Requested-With", "XMLHttpRequest"), o.addEventListener("load", function(a) {
                try {
                    var b = new Function("return " + UE.utils.trim(a.target.response))();
                    "SUCCESS" == b.state && b.url ? (j(b), k.fireEvent("imageUploadSuccess", b)) : i(b.state)
                } catch (c) {
                    i(k.getLang("autoupload.loadError"))
                }
            }), o.send(p)
        }
        function b(a) {
            return a.clipboardData && a.clipboardData.items && 1 == a.clipboardData.items.length && /^image\//.test(a.clipboardData.items[0].type) ? a.clipboardData.items : null
        }
        function c(a) {
            return a.dataTransfer && a.dataTransfer.files ? a.dataTransfer.files : null
        }
        return {outputRule: function(a) {
                UE.utils.each(a.getNodesByTagName("img"), function(a) {
                    /\b(loaderrorclass)|(bloaderrorclass)\b/.test(a.getAttr("class")) && a.parentNode.removeChild(a)
                }), UE.utils.each(a.getNodesByTagName("p"), function(a) {
                    /\bloadpara\b/.test(a.getAttr("class")) && a.parentNode.removeChild(a)
                })
            },bindEvents: {defaultOptions: {enableDragUpload: !0,enablePasteUpload: !0},ready: function() {
                    var d = this;
                    if (window.FormData && window.FileReader) {
                        var e = function(e) {
                            var f, g = !1;
                            if (f = "paste" == e.type ? b(e) : c(e)) {
                                for (var h, i = f.length; i--; )
                                    h = f[i], h.getAsFile && (h = h.getAsFile()), h && h.size > 0 && (a(h, d), g = !0);
                                g && e.preventDefault()
                            }
                        };
                        d.getOpt("enablePasteUpload") !== !1 && UE.dom.domUtils.on(d.body, "paste ", e), d.getOpt("enableDragUpload") !== !1 ? (UE.dom.domUtils.on(d.body, "drop", e), UE.dom.domUtils.on(d.body, "dragover", function(a) {
                            "Files" == a.dataTransfer.types[0] && a.preventDefault()
                        })) : UE.browser.gecko && UE.dom.domUtils.on(d.body, "drop", function(a) {
                            c(a) && a.preventDefault()
                        }), UE.utils.cssRule("loading", ".loadingclass{display:inline-block;cursor:default;background: url('" + this.options.themePath + this.options.theme + "/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin-left:1px;height: 22px;width: 22px;}\n.loaderrorclass{display:inline-block;cursor:default;background: url('" + this.options.themePath + this.options.theme + "/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}", this.document)
                    }
                }}}
    }), UE.plugin.register("simpleupload", function() {
        function a() {
            var a = b.offsetWidth || 46, e = b.offsetHeight || 24, f = document.createElement("iframe"), g = "display:block;width:" + a + "px;height:" + e + "px;overflow:hidden;border:0;margin:0;padding:0;position:absolute;top:0;left:0;filter:alpha(opacity=0);-moz-opacity:0;-khtml-opacity: 0;opacity: 0;cursor:pointer;";
            UE.dom.domUtils.on(f, "load", function() {
                var b, h, i, j = (+new Date).toString(36);
                h = f.contentDocument || f.contentWindow.document, i = h.body, b = h.createElement("div"), b.innerHTML = '<form id="edui_form_' + j + '" target="edui_iframe_' + j + '" method="POST" enctype="multipart/form-data" action="' + c.getOpt("serverUrl") + '" style="' + g + '"><input id="edui_input_' + j + '" type="file" accept="image/*" name="' + c.options.imageFieldName + '" style="' + g + '"></form><iframe id="edui_iframe_' + j + '" name="edui_iframe_' + j + '" style="display:none;width:0;height:0;border:0;margin:0;padding:0;position:absolute;"></iframe>', b.className = "edui-" + c.options.theme, b.id = c.ui.id + "_iframeupload", i.style.cssText = g, i.style.width = a + "px", i.style.height = e + "px", i.appendChild(b), i.parentNode && (i.parentNode.style.width = a + "px", i.parentNode.style.height = a + "px");
                var k = h.getElementById("edui_form_" + j), l = h.getElementById("edui_input_" + j), m = h.getElementById("edui_iframe_" + j);
                UE.dom.domUtils.on(l, "change", function() {
                    function a() {
                        try {
                            var e, f, g, h = (m.contentDocument || m.contentWindow.document).body, i = h.innerText || h.textContent || "";
                            f = new Function("return " + i)(), e = c.options.imageUrlPrefix + f.url, "SUCCESS" == f.state && f.url ? (g = c.document.getElementById(d), UE.dom.domUtils.removeClasses(g, "loadingclass"), g.setAttribute("src", e), g.setAttribute("_src", e), g.setAttribute("alt", f.original || ""), g.removeAttribute("id"), c.fireEvent("imageUploadSuccess", f)) : b && b(f.state)
                        } catch (j) {
                            b && b(c.getLang("simpleupload.loadError"))
                        }
                        k.reset(), UE.dom.domUtils.un(m, "load", a)
                    }
                    function b(a) {
                        if (d) {
                            var b = c.document.getElementById(d);
                            b && UE.dom.domUtils.remove(b), c.fireEvent("showmessage", {id: d,content: a,type: "error",timeout: 4e3})
                        }
                    }
                    if (l.value) {
                        var d = "loading_" + (+new Date).toString(36), e = UE.utils.serializeParam(c.queryCommandValue("serverparam")) || "", f = c.getActionUrl(c.getOpt("imageActionName")), g = c.getOpt("imageAllowFiles");
                        if (c.focus(), c.execCommand("inserthtml", '<img class="loadingclass" id="' + d + '" src="' + c.options.themePath + c.options.theme + '/images/spacer.gif">'), !c.getOpt("imageActionName"))
                            return void errorHandler(c.getLang("autoupload.errorLoadConfig"));
                        var h = l.value, i = h ? h.substr(h.lastIndexOf(".")) : "";
                        if (!i || g && -1 == (g.join("") + ".").indexOf(i.toLowerCase() + "."))
                            return void b(c.getLang("simpleupload.exceedTypeError"));
                        UE.dom.domUtils.on(m, "load", a), k.action = UE.utils.formatUrl(f + (-1 == f.indexOf("?") ? "?" : "&") + e), k.submit()
                    }
                });
                var n;
                c.addListener("selectionchange", function() {
                    clearTimeout(n), n = setTimeout(function() {
                        var a = c.queryCommandState("simpleupload");
                        l.disabled = -1 == a ? "disabled" : !1
                    }, 400)
                }), d = !0
            }), f.style.cssText = g, b.appendChild(f)
        }
        var b, c = this, d = !1;
        return {bindEvents: {ready: function() {
                    UE.utils.cssRule("loading", ".loadingclass{display:inline-block;cursor:default;background: url('" + this.options.themePath + this.options.theme + "/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}\n.loaderrorclass{display:inline-block;cursor:default;background: url('" + this.options.themePath + this.options.theme + "/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;}", this.document)
                },simpleuploadbtnready: function(d, e) {
                    b = e, c.afterConfigReady(a)
                }},outputRule: function(a) {
                UE.utils.each(a.getNodesByTagName("img"), function(a) {
                    /\b(loaderrorclass)|(bloaderrorclass)\b/.test(a.getAttr("class")) && a.parentNode.removeChild(a)
                })
            },commands: {simpleupload: {queryCommandState: function() {
                        return d ? 0 : -1
                    }}}}
    }), UE.commands.preview = {execCommand: function() {
            function a() {
                var a = new Date, b = function(a) {
                    return N = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"][a] || a
                };
                return b(a.getMonth() + 1) + "-" + b(a.getDate()) + " " + b(a.getHours()) + ":" + b(a.getMinutes())
            }
            var b = WO.doc.current().path;
            WO.utils.openPostWin(WO.WO_ROOT_URL + "preview.php", {content: this.getContent(),title: b ? b.substring(b.lastIndexOf("/") + 1, b.lastIndexOf(".")) : "未命名文档",createTime: a(),author: fio.user.current().username})
        },notNeedUndo: 1}, UE.plugins.autoheight = function() {
        function a() {
            var a = this;
            clearTimeout(e), f || (!a.queryCommandState || a.queryCommandState && 1 != a.queryCommandState("source")) && (e = setTimeout(function() {
                for (var b = a.body.lastChild; b && 1 != b.nodeType; )
                    b = b.previousSibling;
                b && 1 == b.nodeType && (b.style.clear = "both", d = Math.max(UE.dom.domUtils.getXY(b).y + b.offsetHeight + 225, Math.max(h.minFrameHeight, h.initialFrameHeight)), d != g && (d !== parseInt(a.iframe.parentNode.style.height) && (a.iframe.parentNode.style.height = d + "px"), a.body.style.height = d + "px", g = d), UE.dom.domUtils.removeStyle(b, "clear"))
            }, 50))
        }
        var b = this;
        if (b.autoHeightEnabled = b.options.autoHeightEnabled !== !1, b.autoHeightEnabled) {
            var c, d, e, f, g = 0, h = b.options;
            b.addListener("fullscreenchanged", function(a, b) {
                f = b
            }), b.addListener("destroy", function() {
                b.removeListener("contentchange afterinserthtml keyup mouseup", a)
            }), b.enableAutoHeight = function() {
                var b = this;
                if (b.autoHeightEnabled) {
                    var d = b.document;
                    b.autoHeightEnabled = !0, c = d.body.style.overflowY, d.body.style.overflowY = "hidden", b.addListener("contentchange afterinserthtml keyup mouseup", a), setTimeout(function() {
                        a.call(b)
                    }, UE.browser.gecko ? 100 : 0), b.fireEvent("autoheightchanged", b.autoHeightEnabled)
                }
            }, b.disableAutoHeight = function() {
                b.body.style.overflowY = c || "", b.removeListener("contentchange", a), b.removeListener("keyup", a), b.removeListener("mouseup", a), b.autoHeightEnabled = !1, b.fireEvent("autoheightchanged", b.autoHeightEnabled)
            }, b.on("setHeight", function() {
                b.disableAutoHeight()
            }), b.addListener("ready", function() {
                b.enableAutoHeight();
                var c;
                UE.dom.domUtils.on(UE.browser.ie ? b.body : b.document, UE.browser.webkit ? "dragover" : "drop", function() {
                    clearTimeout(c), c = setTimeout(function() {
                        a.call(b)
                    }, 100)
                });
                var d;
                window.onscroll = function() {
                    null === d ? d = this.scrollY : 0 == this.scrollY && 0 != d && (b.window.scrollTo(0, 0), d = null)
                }
            })
        }
    }, UE.plugin.register("blockindent", function() {
        var a = this, b = function() {
            var b = UE.dom.domUtils.filterNodeList(a.selection.getStartElementPath(), "p h1 h2 h3 h4 h5 h6");
            return b && b.style.marginLeft && Math.round(parseInt(b.style.marginLeft) / 32)
        };
        return {commands: {blockindent: {execCommand: function() {
                        var b = a.queryCommandValue("blockindent");
                        a.execCommand("paragraph", "p", {style: "margin-left:" + (32 * ++b + "px")})
                    },queryCommandValue: b},blockoutdent: {execCommand: function() {
                        var b = a.queryCommandValue("blockoutdent");
                        b > 0 && a.execCommand("paragraph", "p", {style: "margin-left:" + (32 * --b + "px")})
                    },queryCommandValue: b}}}
    }), UE.plugin.register("share", function() {
        return {commands: {share: {execCommand: function(a) {
                        WO.fire("sharedoc", a)
                    }}}}
    }), UE.plugin.register("directory", function() {
        var a = this;
        return {commands: {directory: {execCommand: function() {
                        a.fireEvent("toggledirectory")
                    }}}}
    }), WO.registerUI("topbar/logo", function() {
        var a = window.DEBUG ? "./src.php" : "./", b = $('<div class="left">   <a class="guide logo-doc logo" href="' + a + '">百度Doc</a>   <a class="guide logo-wenku beta" href="http://wenku.baidu.com" target="_blank">百度文库</a></div>').appendTo("#header"), c = b.find(".logo-wenku");
        $(window).on("resize", function() {
            var a = $(window).width();
            a >= 600 ? c.show() : c.hide()
        }), $(window).width() < 600 && c.hide()
    }), WO.registerUI("topbar/moreservice", function() {
        function a() {
            b.css("margin-left", "-46px").hide().prependTo("#header .left").moreService({button: {"float": "left",width: "45px",height: "45px","border-right": "1px solid rgba(255, 255, 255, .5)"}}).fadeIn("slow").animate({"margin-left": 0}, 100, "linear")
        }
        var b, c = $("<link>").attr("href", "http://baiduoffice.duapp.com/public/assets/style/moreService.css").attr("rel", "stylesheet");
        $("head").append(c), $.getScript("http://baiduoffice.duapp.com/public/widget/moreService.js", a), b = $('<div class="wo-moreservice" id="moreservice"></div>')
    }), WO.registerUI("topbar/user", function() {
        function a(a) {
            if (a)
                j.setLabel(a.username), j.getIconWidget().setImage(a.smallImage), j.show(), i.hide(), fio.user.fire("login", a);
            else {
                if (-1 == window.location.href.indexOf("nocheck"))
                    return c();
                i.show()
            }
            h.hide(), f = a
        }
        function b() {
            fio.user.logout(), i.show(), j.hide(), fio.user.fire("logout"), window.location.href = "./welcome.html"
        }
        function c() {
            i.setLabel(WO.getLang("ui.loggingin")), fio.user.login({redirectUrl: WO.WO_ROOT_URL + (window.DEBUG ? "src.php" : ""),remember: 604800})
        }
        function d() {
            fio.user.login({redirectUrl: WO.WO_ROOT_URL + (window.DEBUG ? "src.php" : ""),remember: 604800,force: !0}).then(a)
        }
        function e(a) {
            var b = $('<p class="login-tip"></p>').html(WO.getLang("ui.requirelogin"));
            a.append(b), WO.doAfterLogin(function() {
                a.removeClass("login-required")
            }), fio.user.on("logout", function() {
                a.addClass("login-required")
            })
        }
        var f, g = (WO.getUI("eve"), WO.editor, $('<div class="user-panel right"></div>').appendTo("#header")), h = $('<span class="loading-tip"></span>').text(WO.getLang("ui.checklogin")).appendTo(g), i = new FUI.Button({label: WO.getLang("ui.login"),text: WO.getLang("ui.login"),className: "login-button"}).appendTo(g[0]).hide(), j = new FUI.Button({icon: {img: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="},className: "user-button"}).appendTo(g[0]).hide(), k = new FUI.PopupMenu({className: "user-menu"}).appendTo(document.getElementById("content-wrapper")).positionTo(j), l = k.getMenuWidget().show();
        return $.each(["userinfo", "fui-spliter", "switchuser", "logout"], function(a, b) {
            l.appendItem(new FUI.Item({label: WO.getLang("ui." + b),className: b,value: b}))
        }), j.on("click", function() {
            k.open();
            var a = $(k.getElement()), b = $(j.getElement());
            a.offset({left: b.offset().left - a.outerWidth() + b.outerWidth() - 10,top: b.offset().top + b.outerHeight()})
        }), l.on("select", function(a, c) {
            switch (c.value) {
                case "userinfo":
                    window.open("http://i.baidu.com");
                    break;
                case "gotonetdisk":
                    window.open("http://pan.baidu.com/disk/home#path=/apps/wordonline");
                    break;
                case "switchuser":
                    d();
                    break;
                case "logout":
                    b()
            }
            l.clearSelect(), k.hide()
        }), WO.ready(function() {
            fio.user.check().then(a)["catch"](function() {
                i.show(), j.hide(), h.hide()
            })
        }), i.on("click", c), $("#content-wrapper").delegate(".login-button", "click", c), {getCurrent: function() {
                return f
            },loginLink: function() {
                return $("<a></a>").click(c)
            },requireLogin: e}
    }), WO.registerUI("topbar/title", function() {
        $('<h1 class="center" id="wordonline-filename"></a></h1>').appendTo("#header")
    }), WO.registerUI("topbar/fastvisit", function() {
        function a(a, d, e) {
            var f = WO.getLang("ui.quickvisit." + a), g = new FUI.Button({className: "wo-fastvisit-btn wo-" + a,label: f,text: f,layout: "bottom"}), h = g.getElement();
            return ("right" == d ? c : b)[e ? "prepend" : "append"](h), g
        }
        {
            var b = $(".header .left"), c = $(".header .right"), d = {};
            $(".wo-fastvisit-btn")
        }
        return d.add = a, d
    }), WO.registerUI("topbar/fastvisit/feedback", function() {
        var a = WO.getUI("topbar/fastvisit"), b = a.add("feedback", "right", !0);
        b.on("click", function() {
            WO.utils.openGetWin("http://tieba.baidu.com/f?kw=%E7%99%BE%E5%BA%A6doc")
        })
    }), WO.registerUI("topbar/fastvisit/download", function() {
        var a = WO.getUI("topbar/fastvisit"), b = a.add("share", "right", !0);
        b.on("click", function() {
            WO.fire("sharedoc")
        })
    }), WO.registerUI("topbar/fastvisit/new", function() {
        var a = WO.getUI("topbar/fastvisit"), b = a.add("new", "right", !0);
        b.on("click", function() {
            WO.utils.openGetWin(window.DEBUG ? "./src.php" : "./")
        })
    }), WO.registerUI("topbar/fastvisit/download", function() {
        var a = WO.getUI("topbar/fastvisit"), b = a.add("download", "right", !0);
        b.on("click", function() {
            WO.fire("exportdoc")
        })
    }), WO.registerUI("topbar/fastvisit/upload", function() {
        var a = WO.getUI("topbar/fastvisit"), b = a.add("upload", "right", !0), c = "upload-btn-" + +(new Date).toString(36);
        if ($(b.getElement()).attr("id", c), WO.on("needflash", function() {
            WO.fire("confirm", {title: "提示",message: '当前浏览器 Flash <span style="color:red;">不支持</span>, 请安装 Flash 最新版再使用上传功能。<p style="text-align:center;">   <a href="http://www.adobe.com/go/getflashplayer" target="_blank">       <img border="0" src="http://www.adobe.com/macromedia/style_guide/images/160x41_Get_Flash_Player.jpg" alt="获取最新版 flash player" />   </a></p>',textOk: "确定"})
        }), WebUploader.Uploader.support()) {
            var d = WebUploader.create({pick: {id: "#" + c,multiple: !1},accept: {title: "word文档",extensions: "doc,docx",mimeTypes: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"},fileSingleSizeLimit: 512e4,swf: WO.uploaderSwfUrl,server: WO.uploaderServerUrl,fileVal: WO.uploaderFieldName,duplicate: !0});
            d.on("filesQueued", function() {
                WO.doc.upload(d), d.upload(), d.disable()
            }), d.on("uploadFinished", function() {
                d.enable()
            }), d.on("all", function() {
                var a = $.extend([], arguments);
                return a[0] = "uploader_" + a[0], WO.editor.fireEvent.apply(WO.editor, a)
            }), d.on("uploadBeforeSend", function(a, b) {
                b._COOKIE = document.cookie
            }), WO.webuploader = d
        } else
            $(b.getElement()).on("click", function() {
                WO.fire("needflash")
            })
    }), function() {
        var a = {}, b = window.FUIToolbar = {getToolbar: function(a, b) {
                return new c(a, b)
            },registerWidgetHandler: function(b, c) {
                $.each(b.split(/\s+/), function(b, d) {
                    a[d] = c
                })
            }}, c = function(a, b) {
            this.targetId = a, this.editor = b, this.$toolbar = null, this.$tabList = null, this.$tabContent = null, this.init()
        };
        c.prototype = {init: function() {
                this.initContainer(), this.initMainTabs()
            },initContainer: function() {
                this.$toolbar = $("#" + this.targetId), this.$tabList = $('<div class="tab-list"></div>').appendTo(this.$toolbar), this.$tabContent = $('<div class="tab-content"></div>').appendTo(this.$toolbar), this.$popupContainer = $('<div class="popup-container"></div>').appendTo(this.$toolbar)
            },initMainTabs: function() {
                var c = this;
                c.tabwidget = FUI.Creator.parse(b.MainConfig), c.tabwidget.appendButtonTo(c.$tabList[0]), c.tabwidget.appendPanelTo(c.$tabContent[0]), WO.ConfigTraveller(b.MainConfig, function(b) {
                    var d = a[b.clazz], e = FUI.widgets[b.id];
                    e && d && d.call(c, b, e, c.editor)
                })
            }}
    }(), function() {
        FUIToolbar.MainConfig = {clazz: "Tabs",className: "wo-tabs",buttons: [],panels: []}
    }(), function() {
        var a = {clazz: "InputMenu",id: "fontfamily",className: "wo-input-menu-fontfamily",text: "字体格式",select: 0,input: {placeholder: "字体格式"},menu: {items: function() {
                    var a = [];
                    return $.each([{name: "songti",val: "宋体,SimSun"}, {name: "yahei",val: "微软雅黑,Microsoft YaHei"}, {name: "kaiti",val: "楷体,楷体_GB2312, SimKai"}, {name: "heiti",val: "黑体, SimHei"}, {name: "lishu",val: "隶书, SimLi"}, {name: "andaleMono",val: "andale mono"}, {name: "arial",val: "arial, helvetica,sans-serif"}, {name: "arialBlack",val: "arial black,avant garde"}, {name: "comicSansMs",val: "comic sans ms"}, {name: "impact",val: "impact,chicago"}, {name: "timesNewRoman",val: "times new roman"}], function(b, c) {
                        a.push({value: c.val,label: {text: c.name,style: {"font-family": c.val,"font-size": "18px"}}})
                    }), a
                }()}}, b = {clazz: "InputMenu",id: "fontsize",className: "wo-input-menu-fontsize",text: "字号",select: 4,input: {placeholder: "字号"},menu: {items: function() {
                    var a = [];
                    return UE.utils.each([10, 11, 12, 14, 16, 18, 20, 24, 36], function(b) {
                        a.push({value: b + "px",label: {text: b + "px",style: {"font-size": b + "px"}}})
                    }), a
                }()}}, c = {clazz: "ButtonMenu",id: "unorderedlist",_cmd: "insertunorderedlist",className: "wo-btnmenu-unorderedlist",text: "编号",selected: 1,buttons: [{className: "fui-button-menu-button"}, {className: "fui-button-menu-down"}],menu: {items: [{label: "○ 空心项目符号",value: "circle"}, {label: "● 实心项目符号",value: "disc"}, {label: "■ 方形项目符号",value: "square"}]}}, d = {clazz: "ButtonMenu",id: "orderedlist",_cmd: "insertorderedlist",className: "wo-btnmenu-orderedlist",text: "编号",selected: 0,buttons: [{className: "fui-button-menu-button"}, {className: "fui-button-menu-down"}],menu: {items: [{label: "1., 2., 3., 4.,  ",value: "decimal"}, {label: "a., b., c., d.,  ",value: "lower-alpha"}, {label: "i., ii., iii., iv.,  ",value: "lower-roman"}, {label: "A., B., C., D.,  ",value: "upper-alpha"}, {label: "I., II., III., IV.,  ",value: "upper-roman"}]}}, e = {clazz: "ButtonMenu",id: "rowspacingtop",className: "wo-btnmenu-rowspacingtop",text: "段前距",selected: 0,buttons: [{className: "fui-button-menu-button"}, {className: "fui-button-menu-down"}],menu: {items: [{label: "5px",value: 5}, {label: "10px",value: 10}, {label: "15px",value: 15}, {label: "20px",value: 20}, {label: "25px",value: 25}]}}, f = {clazz: "ButtonMenu",id: "rowspacingbottom",className: "wo-btnmenu-rowspacingbottom",text: "段后距",selected: 0,buttons: [{className: "fui-button-menu-button"}, {className: "fui-button-menu-down"}],menu: {items: [{label: "5px",value: 5}, {label: "10px",value: 10}, {label: "15px",value: 15}, {label: "20px",value: 20}, {label: "25px",value: 25}]}}, g = {clazz: "ButtonMenu",id: "lineheight",className: "wo-btnmenu-lineheight",text: "行高",selected: 0,buttons: [{className: "fui-button-menu-button"}, {className: "fui-button-menu-down"}],menu: {items: function() {
                    var a = [];
                    return UE.utils.each([1, 1.5, 1.75, 2, 3, 4, 5], function(b) {
                        a.push({value: b,label: b})
                    }), a
                }()}}, h = {clazz: "DropPanel",id: "fontstyle",className: "wo-drop-panel wo-drop-panel-fontstyle",button: {className: "fui-drop-panel-down"}};
        FUIToolbar.MainConfig.buttons.push({className: "wo-tabs-btn",label: "编辑"}), FUIToolbar.MainConfig.panels.push({className: "fui-tab-content fui-tab-content-edit",widgets: [{clazz: "LabelPanel",id: "blockhistory",className: "wo-block wo-blockhistory",label: "历史记录",layout: "top",widgets: [{clazz: "Panel",className: "wo-line",widgets: [{clazz: "Button",id: "undo",className: "wo-btn wo-btn-undo",text: "撤销",label: "撤销"}, {clazz: "Button",id: "redo",className: "wo-btn wo-btn-redo",text: "恢复",label: "恢复"}]}, {clazz: "Panel",className: "wo-line",widgets: [{clazz: "Button",id: "drafts1",_cmd: "drafts",className: "wo-btn wo-btn-drafts",text: "草稿箱",label: "草稿箱",layout: "bottom"}]}]}, {clazz: "LabelPanel",id: "blockclipboard",className: "wo-block wo-blockclipboard",label: "剪贴板",layout: "top",widgets: [{clazz: "Panel",className: "wo-line",column: !0,widgets: [{clazz: "Button",id: "copy",className: "wo-btn wo-btn-copy",text: "复制",label: "复制"}, {clazz: "Button",id: "cut",className: "wo-btn wo-btn-cut",text: "剪切",label: "剪切"}]}, {clazz: "Panel",className: "wo-line",widgets: [{clazz: "Button",id: "paste",className: "wo-btn wo-btn-paste",text: "粘贴",label: "粘贴",layout: "bottom"}]}]}, {clazz: "LabelPanel",id: "blockfont",className: "wo-block wo-blockfont",label: "字体",layout: "top",column: !0,widgets: [{clazz: "Panel",className: "wo-line wo-line-1",widgets: [a, {clazz: "Button",id: "removeformat",className: "wo-btn wo-btn-removeformat",label: "清除格式",text: "清除格式"}, {clazz: "Button",id: "autotypeset",className: "wo-btn wo-btn-autotypeset",label: "自动格式化",text: "自动格式化"}, {clazz: "Button",id: "formatmatch",className: "wo-btn wo-btn-formatmatch",label: "格式刷",text: "格式刷"}]}, {clazz: "Panel",className: "wo-line wo-line-2",widgets: [b, {clazz: "Button",id: "upsize",className: "wo-btn wo-btn-upsize",text: "增大字体"}, {clazz: "Button",id: "downsize",className: "wo-btn wo-btn-downsize",text: "缩小字体"}, {clazz: "Button",id: "subscript",className: "wo-btn wo-btn-subscript",text: "上标"}, {clazz: "Button",id: "superscript",className: "wo-btn wo-btn-superscript",text: "下标"}, {clazz: "Button",id: "bold",className: "wo-btn wo-btn-bold",text: "加粗"}, {clazz: "Button",id: "italic",className: "wo-btn wo-btn-italic",text: "倾斜"}, {clazz: "Button",id: "underline",className: "wo-btn wo-btn-underline",text: "下划线"}, {clazz: "Button",id: "strikethrough",className: "wo-btn wo-btn-strikethrough",text: "删除线"}, {clazz: "Button",id: "forecolor",className: "wo-btn wo-btn-forecolor",text: "文字颜色"}, {clazz: "Button",id: "backcolor",className: "wo-btn wo-btn-backcolor",text: "背景颜色"}]}]}, {clazz: "LabelPanel",id: "blockparagraph",className: "wo-block wo-blockparagraph",label: "段落",layout: "top",column: !0,widgets: [{clazz: "Panel",className: "wo-line wo-line-1",widgets: [{clazz: "Button",id: "justifyleft",className: "wo-btn wo-btn-justifyleft",text: "向左对齐"}, {clazz: "Button",id: "justifycenter",className: "wo-btn wo-btn-justifycenter",text: "居中对齐"}, {clazz: "Button",id: "justifyright",className: "wo-btn wo-btn-justifyright",text: "向右对齐"}, {clazz: "Button",id: "justifyjustify",className: "wo-btn wo-btn-justifyjustify",text: "两端对齐"}, {clazz: "Button",id: "blockquote",className: "wo-btn wo-btn-blockquote",text: "引用"}, {clazz: "Button",id: "blockindent",className: "wo-btn wo-btn-blockindent",text: "增加缩进"}, {clazz: "Button",id: "blockoutdent",className: "wo-btn wo-btn-blockoutdent",text: "减少缩进"}]}, {clazz: "Panel",className: "wo-line wo-line-2",widgets: [c, d, e, f, g]}]}, {clazz: "LabelPanel",id: "blockstyle",className: "wo-block wo-blockstyle",label: "样式",layout: "top",widgets: [h]}]})
    }(), function() {
        FUIToolbar.MainConfig.buttons.push({className: "wo-tabs-btn",label: "插入"}), FUIToolbar.MainConfig.panels.push({className: "fui-tab-content fui-tab-content-insert",widgets: [{clazz: "LabelPanel",id: "blockpage",className: "wo-block wo-blockpage",layout: "top",label: "页",widgets: [{clazz: "Button",id: "horizontal",className: "wo-btn wo-btn-horizontal",text: "分页符",label: "分页符",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blockchar",className: "wo-block wo-blockchar",layout: "top",label: "字符",widgets: [{clazz: "Button",id: "spechars",className: "wo-btn wo-btn-spechars",text: "字符",label: "字符",layout: "bottom",_dialog: {width: 620,height: 575,caption: "插入字符"}}]}, {clazz: "LabelPanel",id: "blocklink",className: "wo-block wo-blocklink",layout: "top",label: "链接",column: !0,widgets: [{clazz: "Button",id: "link",className: "wo-btn wo-btn-link",text: "添加链接",label: "添加链接",_dialog: {width: 420,height: 250,caption: "添加链接"}}, {clazz: "Button",id: "unlink",className: "wo-btn wo-btn-unlink",text: "取消链接",label: "取消链接"}]}, {clazz: "LabelPanel",id: "blockimage",className: "wo-block wo-blockimage",layout: "top",label: "图片",widgets: [{clazz: "Button",id: "insertimage",className: "wo-btn wo-btn-insertimage",text: "图片",label: "图片",layout: "bottom",_dialog: {width: 650,height: 470,caption: "插入图片"}}, {clazz: "Panel",className: "wo-line",widgets: [{clazz: "Panel",className: "wo-line",column: !0,widgets: [{clazz: "Panel",className: "wo-line wo-line-1",widgets: [{clazz: "Button",id: "simpleupload",className: "wo-btn wo-btn-simpleupload",text: "单图上传",label: "单图"}, {clazz: "Button",id: "emotion",className: "wo-btn wo-btn-emotion",text: "表情",label: "表情",_popup: {caption: "插入表情",iframe: !0}}]}, {clazz: "Panel",className: "wo-line wo-line-2",widgets: [{clazz: "Button",id: "snapscreen",className: "wo-btn wo-btn-snapscreen",text: "截屏",label: "截屏"}, {clazz: "Button",id: "scrawl",className: "wo-btn wo-btn-scrawl",text: "涂鸦",label: "涂鸦",_dialog: {width: 520,height: 430,caption: "插入涂鸦"}}]}]}]}]}, {clazz: "LabelPanel",id: "blockmap",className: "wo-block wo-blockmap",layout: "top",label: "地图",column: !0,widgets: [{clazz: "Button",id: "map",className: "wo-btn wo-btn-map",text: "地图",label: "地图",layout: "bottom",_dialog: {width: 570,height: 460,caption: "插入地图"}}]}, {clazz: "LabelPanel",id: "blockcode",className: "wo-block wo-blockcode",layout: "top",label: "代码",widgets: [{clazz: "Button",id: "insertcode",className: "wo-btn wo-btn-insertcode",text: "代码",label: "代码",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blocktable",className: "wo-block wo-blocktable",layout: "top",label: "表格",widgets: [{clazz: "TablePicker",id: "inserttable1",_cmd: "inserttable",button: {className: "wo-btn wo-btn-inserttable",text: "表格",label: "表格",layout: "bottom"}}]}, {clazz: "LabelPanel",id: "blockformula",className: "wo-block wo-blockformula",layout: "top",label: "公式",widgets: [{clazz: "Button",id: "formula",className: "wo-btn wo-btn-insertformula",text: "公式",label: "公式",layout: "bottom",_popup: {width: 600,height: 400,caption: "插入公式"}}]}, {clazz: "LabelPanel",id: "blockcomment",className: "wo-block wo-blockcomment",layout: "top",label: "批注",widgets: [{clazz: "Button",id: "comment",className: "wo-btn wo-btn-comment",text: "批注",label: "批注",layout: "bottom",_dialog: {width: 600,height: 400,caption: "添加批注"}}]}]})
    }(), function() {
        FUIToolbar.MainConfig.buttons.push({className: "wo-tabs-btn",label: "表格"}), FUIToolbar.MainConfig.panels.push({className: "fui-tab-content fui-tab-content-table",widgets: [{clazz: "LabelPanel",id: "blocktable",className: "wo-block wo-blocktable",layout: "top",label: "表格",widgets: [{clazz: "Panel",widgets: [{clazz: "TablePicker",id: "inserttable2",_cmd: "inserttable",button: {className: "wo-btn wo-btn-inserttable",text: "插入表格",label: "插入表格",layout: "bottom"}}, {clazz: "Button",id: "deletetable",className: "wo-btn wo-btn-deletetable",text: "删除表格",label: "删除表格",layout: "bottom"}]}, {clazz: "Panel",column: !0,widgets: [{clazz: "Panel",widgets: [{clazz: "Button",id: "insertrow",className: "wo-btn wo-btn-insertrow",text: "插入行"}, {clazz: "Button",id: "insertcol",className: "wo-btn wo-btn-insertcol",text: "插入列"}]}, {clazz: "Panel",widgets: [{clazz: "Button",id: "deleterow",className: "wo-btn wo-btn-deleterow",text: "删除行"}, {clazz: "Button",id: "deletecol",className: "wo-btn wo-btn-deletecol",text: "删除列"}]}]}]}, {clazz: "LabelPanel",id: "blockmergecells",className: "wo-block wo-blockmergecells",layout: "top",label: "合并单元格",column: !0,widgets: [{clazz: "Panel",widgets: [{clazz: "Button",id: "mergecells",className: "wo-btn wo-btn-mergecells",text: "合并单元格"}, {clazz: "Button",id: "mergedown",className: "wo-btn wo-btn-mergedown",text: "向下合并单元格"}, {clazz: "Button",id: "mergeright",className: "wo-btn wo-btn-mergeright",text: "向右合并单元格"}]}, {clazz: "Panel",widgets: [{clazz: "Button",id: "splittocells",className: "wo-btn wo-btn-splittocells",text: "拆分单元格"}, {clazz: "Button",id: "splittocols",className: "wo-btn wo-btn-splittocols",text: "单元格拆分成列"}, {clazz: "Button",id: "splittorows",className: "wo-btn wo-btn-splittorows",text: "单元格拆分成行"}]}]}]})
    }(), function() {
        FUIToolbar.MainConfig.buttons.push({className: "wo-tabs-btn",label: "视图"}), FUIToolbar.MainConfig.panels.push({className: "fui-tab-content fui-tab-content-edit",widgets: [{clazz: "LabelPanel",id: "blockdirectory",className: "wo-block wo-blockdirectory",layout: "top",label: "目录",widgets: [{clazz: "Button",id: "directory",className: "wo-btn wo-btn-directory",text: "显示目录",label: "显示目录",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blockshowcomment",className: "wo-block wo-blockshowcomment",layout: "top",label: "批注",widgets: [{clazz: "Button",id: "showcomment",className: "wo-btn wo-btn-showcomment",text: "显示批注",label: "显示批注",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blockpreview",className: "wo-block wo-blockpreview",layout: "top",label: "预览",widgets: [{clazz: "Button",id: "preview",className: "wo-btn wo-btn-preview",text: "预览文档",label: "预览文档",layout: "bottom"}]}]})
    }(), function() {
        FUIToolbar.MainConfig.buttons.push({className: "wo-tabs-btn",label: "工具"}), FUIToolbar.MainConfig.panels.push({className: "fui-tab-content fui-tab-content-edit",widgets: [{clazz: "LabelPanel",id: "blockdrafts",className: "wo-block wo-blockdrafts",layout: "top",label: "草稿箱",widgets: [{clazz: "Button",id: "drafts2",_cmd: "drafts",className: "wo-btn wo-btn-drafts",text: "草稿箱",label: "草稿箱",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blockprint",className: "wo-block wo-blockprint",layout: "top",label: "打印",widgets: [{clazz: "Button",id: "print",className: "wo-btn wo-btn-print",text: "打印文档",label: "打印文档",layout: "bottom"}]}, {clazz: "LabelPanel",id: "blocksearch",className: "wo-block wo-blocksearch",layout: "top",label: "搜索",widgets: [{clazz: "Button",id: "searchreplace",className: "wo-btn wo-btn-searchreplace",text: "查找替换",label: "查找替换",layout: "bottom",_dialog: {width: 400,height: 290,caption: "查找替换"}}]}, {clazz: "LabelPanel",id: "blockwordcount",className: "wo-block wo-blockwordcount",layout: "top",label: "字数统计",widgets: [{clazz: "Button",id: "wordcount",className: "wo-btn wo-btn-wordcount",text: "字数统计",label: "字数统计",layout: "bottom",_dialog: {width: 340,height: 260,caption: "字数统计"}}]}, {clazz: "LabelPanel",id: "blockcoordination",className: "wo-block wo-blockcoordination",layout: "top",label: "协同",widgets: [{clazz: "Button",id: "coordination",className: "wo-btn wo-btn-coordination",text: "共享给好友",label: "共享给好友",layout: "bottom",_dialog: {width: 600,height: 400,caption: "共享给好友"}}]}, {clazz: "LabelPanel",id: "blockshare",className: "wo-block wo-blockshare",layout: "top",label: "分享",widgets: [{clazz: "Button",id: "share",className: "wo-btn wo-btn-share",text: "分享",label: "分享",layout: "bottom"}]}]})
    }(), function() {
        WO.ConfigTraveller = function(a, b) {
            if (a) {
                b(a);
                var c = "Tabs" === a.clazz ? a.panels : a.widgets;
                if (c && c.length)
                    for (var d = 0; d < c.length; d++)
                        WO.ConfigTraveller(c[d], b)
            }
        }, WO.ConfigTraveller(FUIToolbar.MainConfig, function(a) {
            a.clazz && a.id && (a._cmd = a._cmd || a.id, a._dialog && (a._dialog.className = "wo-dialog wo-dialog-" + a.id), a._popup && (a._popup.className = "wo-popup wo-popup-" + a.id))
        })
    }(), function() {
        function a(a, b, c) {
            var d = a._cmd;
            if (a._dialog) {
                var e = WO.WO_URL + "dialogs/", f = a._dialog, g = "wo_" + (+new Date).toString(36), h = new FUI.Dialog(f), i = $(h.getBodyElement()), j = $EDITORUI[g] = {_ishidden: !0,editor: c,className: "wo-dialog-" + d,uiName: "dialog",onok: function() {
                    },onclose: function() {
                    },oncancel: function() {
                    },dialog: h,reset: function() {
                        i.html('<iframe id="' + g + '_iframe" width="100%" height="' + (f.height - 70) + '" class="wo-dialog-iframe" src="' + e + d + "/" + d + '.html" frameborder="0">')
                    },open: function() {
                        h.open()
                    },close: function() {
                        h.close()
                    },isHidden: function() {
                        return j._ishidden
                    },buttons: h.getButtons()};
                h.on("ok", function() {
                    return j.onok.apply(c, arguments) === !1 ? !1 : void 0
                }), h.on("close", function() {
                    j.onclose.apply(c, arguments), setTimeout(function() {
                        i.html("")
                    })
                }), h.on("cancel", function() {
                    j.oncancel.apply(c, arguments)
                }), h.on("open", function() {
                    j._ishidden = !1
                }), h.on("close", function() {
                    j._ishidden = !0
                }), h.positionTo(document.body), b.on("click", function() {
                    j.reset(), h.open()
                }), WO.on("esc", function() {
                    return h.isOpen() ? (h.close(), !0) : void 0
                })
            }
        }
        function b(a, b, c) {
            var d = a._cmd;
            if (a._popup) {
                var e = WO.WO_URL + "dialogs/", f = a._popup, g = "wo_" + (+new Date).toString(36), h = new FUI.Popup(f), i = $(h.getElement()).find(".fui-panel-content"), j = $EDITORUI[g] = {_ishidden: !0,editor: c,className: "wo-dialog-" + d,uiName: "popup",onok: function() {
                    },onclose: function() {
                    },oncancel: function() {
                    },popup: h,reset: function() {
                        i.html('<iframe id="' + g + '_iframe" class="wo-dialog-iframe" src="' + e + d + "/" + d + '.html" frameborder="0">')
                    },open: function() {
                        h.show()
                    },close: function() {
                        h.close()
                    },isHidden: function() {
                        return j._ishidden
                    },getDom: function(a) {
                        var b;
                        return b = "iframe" == a ? i.find("iframe")[0] : "body" == a || "content" == a ? i[0] : h.getElement()
                    }};
                h.positionTo(b), b.on("click", function() {
                    j.reset(), h.show()
                })
            }
        }
        function c(a, b, c) {
            c.on("zeroclipboardready", function(a, d) {
                d.clip(b.getElement()), d.on("copy", function() {
                    "cut" == arguments[0].target.id && c.execCommand("inserthtml", UE.dom.domUtils.fillChar)
                })
            })
        }
        function d(a, b, c) {
            c.fireEvent.call(c, "simpleuploadbtnready", b.getElement())
        }
        function e() {
        }
        FUIToolbar.registerWidgetHandler("Button", function(f, g, h) {
            var i = f._cmd;
            if ("forecolor" == i || "backcolor" == i) {
                var j = new FUI.ColorPicker({clearText: "清除颜色",commonText: "通用颜色",standardText: "标准颜色",resize: "none"});
                j.attachTo(g), j.on("selectcolor", function(a, b) {
                    h.execCommand(i, b)
                })
            } else
                f._dialog || f._popup || g.on("click", function() {
                    h.execCommand(i)
                });
            return h.on("selectionchange", function() {
                var a = h.queryCommandState(i);
                g[-1 == a ? "disable" : "enable"](), g[1 == a ? "addClass" : "removeClass"]("fui-button-pressed")
            }), ("copy" == f.id || "cut" == f.id) && c.call(this, f, g, h), "simpleupload" == f.id && d.call(this, f, g, h), "preview" == f.id && e.call(this, f, g, h), a.call(this, f, g, h), b.call(this, f, g, h), g
        })
    }(), FUIToolbar.registerWidgetHandler("InputMenu", function(a, b, c) {
        function d(a) {
            a && (b.selectByValue(a) || b.clearSelect(), e(a), b.setValue(a))
        }
        function e(c) {
            "fontfamily" == g && $.each(a.menu.items, function(a, b) {
                return b.value.replace(/[', ]/g, "") == c.replace(/[', ]/g, "") ? (c = b.label.text, !1) : void 0
            }), b.__inputWidget.setValue(c)
        }
        function f() {
            return b.__inputWidget.getValue()
        }
        {
            var g = a._cmd;
            a.menu.items
        }
        return "fontfamily" == g && $(".fui-input", b.getElement()).attr({readonly: "readonly",unselectable: "on"}), b.on("itemclick inputcomplete", function(a, b) {
            var d = b.value;
            "fontsize" == g && /^[\d]+$/.test(d) && (d += "px"), c.execCommand(g, d)
        }), c.on("selectionchange", function() {
            var a = c.queryCommandState(g);
            b[-1 == a ? "disable" : "enable"](), b[1 == a ? "addClass" : "removeClass"]("fui-button-pressed");
            var e = c.queryCommandValue(g);
            d(e)
        }), b.__menuWidget.on("inputcomplete", function() {
            b.setValue(f())
        }), b
    }), FUIToolbar.registerWidgetHandler("ButtonMenu", function(a, b, c) {
        {
            var d = a._cmd;
            a.menu.items
        }
        return b.on("btnclick", function(a) {
            $(a.target).hasClass("fui-button-menu-down") || c.execCommand(d, b.getValue())
        }), b.on("select", function() {
            c.execCommand(d, b.getValue())
        }), b
    }), FUIToolbar.registerWidgetHandler("DropPanel", function(a, b, c) {
        var d = a._cmd, e = WO.WO_URL, f = {className: "wo-fontstyle-buttonset",selected: 2,buttons: [{text: "标",icon: e + "assets/images/fontstyle/style_01.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "无间隔​",icon: e + "assets/images/fontstyle/style_02.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 1​",icon: e + "assets/images/fontstyle/style_03.png",value: {tagName: "h1",style: "font-size: 29px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 2​",icon: e + "assets/images/fontstyle/style_04.png",value: {tagName: "h2",style: "font-size: 21px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 3​",icon: e + "assets/images/fontstyle/style_05.png",value: {tagName: "h3",style: "font-size: 21px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 4​",icon: e + "assets/images/fontstyle/style_06.png",value: {tagName: "h4",style: "font-size: 19px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 5​",icon: e + "assets/images/fontstyle/style_07.png",value: {tagName: "h5",style: "font-size: 19px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 6​",icon: e + "assets/images/fontstyle/style_08.png",value: {tagName: "h6",style: "font-size: 16px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 7​",icon: e + "assets/images/fontstyle/style_09.png",value: {tagName: "p",style: "font-size: 16px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "标题 8​",icon: e + "assets/images/fontstyle/style_10.png",value: {tagName: "p",style: "font-size: 16px; font-style: normal; font-family: Cambria, serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "标题 9​",icon: e + "assets/images/fontstyle/style_11.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: Cambria, serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "标题​",icon: e + "assets/images/fontstyle/style_12.png",value: {tagName: "p",style: "font-size: 21px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "副标题​",icon: e + "assets/images/fontstyle/style_13.png",value: {tagName: "p",style: "font-size: 21px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "不明显强调​",icon: e + "assets/images/fontstyle/style_14.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #404040;"}}, {text: "强调​",icon: e + "assets/images/fontstyle/style_15.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "明显强调​",icon: e + "assets/images/fontstyle/style_16.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #4f81bd;"}}, {text: "增强​",icon: e + "assets/images/fontstyle/style_17.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "引用​",icon: e + "assets/images/fontstyle/style_18.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #404040;"}}, {text: "明显引用​",icon: e + "assets/images/fontstyle/style_19.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #4f81bd;"}}, {text: "不明显参考​",icon: e + "assets/images/fontstyle/style_20.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #5a5a5a;"}}, {text: "明显参考​",icon: e + "assets/images/fontstyle/style_21.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: underline; color: #c0504d;"}}, {text: "书籍标题​",icon: e + "assets/images/fontstyle/style_22.png",value: {tagName: "p",style: "font-size: 14px; font-style: italic; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: bold; text-decoration: none; color: #000000;"}}, {text: "列出段落​",icon: e + "assets/images/fontstyle/style_23.png",value: {tagName: "p",style: "font-size: 14px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "caption​",icon: e + "assets/images/fontstyle/style_24.png",value: {tagName: "p",style: "font-size: 13px; font-style: normal; font-family: Cambria, serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "toc 1​",icon: e + "assets/images/fontstyle/style_25.png",value: {tagName: "p",style: "font-size: 15px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "toc 2​",icon: e + "assets/images/fontstyle/style_26.png",value: {tagName: "p",style: "font-size: 15px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "toc 3​",icon: e + "assets/images/fontstyle/style_27.png",value: {tagName: "p",style: "font-size: 15px; font-style: normal; font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', 微软雅黑, SimSun, 宋体, sans-serif; font-weight: normal; text-decoration: none; color: #000000;"}}, {text: "TOC Heading​",icon: e + "assets/images/fontstyle/style_28.png",value: {tagName: "p",style: "font-size: 19px; font-style: normal; font-family: Cambria, serif; font-weight: bold; text-decoration: none; color: #365f91;"}}]}, g = new FUI.Buttonset(f);
        return b.appendWidget(g), g.on("click", function() {
            var a;
            (a = g.getValue()) && c.execCommand(d, a), b.close()
        }), b
    }), FUIToolbar.registerWidgetHandler("ColorPicker", function(a, b, c) {
        var d = a._cmd, e = new FUI.ColorPicker({clearText: "清除颜色",commonText: "通用颜色",standardText: "标准颜色",resize: "none"});
        return e.attachTo(b), e.on("selectcolor", function(a, b) {
            c.execCommand(d, b)
        }), b
    }), FUIToolbar.registerWidgetHandler("TablePicker", function(a, b, c) {
        var d = a._cmd;
        return b.on("pickerselect", function(a, b) {
            c.execCommand(d, {border: 1,numCols: b.col,numRows: b.row,tdvalign: "top"})
        }), c.on("selectionchange", function() {
            var a = c.queryCommandState(d);
            b[-1 == a ? "disable" : "enable"](), b[1 == a ? "addClass" : "removeClass"]("fui-button-pressed")
        }), b
    }), WO.registerUI("section", function() {
        function a() {
            function a(b) {
                var c = {}, e = [];
                return c.dom = b.dom, c.title = b.title, c.tag = b.tag.toLowerCase(), d(b) && $.each(b.children, function(b, c) {
                    e.push(a(c))
                }), e.length && (c.children = e), c
            }
            function d(a) {
                return 0 != a.children.length || !1
            }
            var g, h = b.execCommand("getsections"), i = "";
            d(h) ? (g = a(h), i = c(g) || e) : i = e, $(".section-tree", f).html(i)
        }
        var b = WO.editor, c = function(a) {
            var b = [];
            return b.push('<ul class="dir-tip">'), $.each(a.children, function(a, c) {
                b.push('   <li class="dir-item" data-tagname="' + c.tag + '" title="' + c.title + '">' + c.title + "</li>")
            }), b.push("</ul>"), b.join("\n")
        }, d = "", e = '<div class="section-empty-tip">没有找到目录大纲</div>', f = $('<div class="dir"><div class="s-close">x</div><div class="title">目录大纲</div><div class="section-tree">' + e + "</div></div>").appendTo($(".main"));
        b.on("aftersetcontent contentchange", function() {
            var c = b.getContent();
            c != d && (d = c, a())
        }), f.delegate(".dir-item", "click", function() {
            var a = $(".main"), c = $("li").index(this), d = $(b.iframe), e = $(WO.editor.iframe).contents().find(":header:eq(" + c + ")");
            a.animate({scrollTop: e.offset().top + d.offset().top - a.offset().top + a.scrollTop()}, 100)
        }), b.on("toggledirectory", function() {
            $(".dir").toggle()
        }), f.delegate(".s-close", "click", function() {
            $(".dir").fadeOut()
        })
    }), WO.registerUI("toolbardock", function() {
        WO.ready(function() {
            function a(a, b, c) {
                b.duration = 200, b.easing = "ease", b.complete = c, a.transition(b)
            }
            var b = !0, c = WO.toolbar.$tabContent, d = WO.toolbar.$tabList, e = WO.toolbar.$toolbar, f = $('<div class="toggle-toolbar"><span class="fold-toolbar" id="fold-toolbar" title="折叠工具栏"></span><span class="dock-toolbar" id="dock-toolbar" title="固定工具栏"></span></div>');
            f.appendTo(c), $("#fold-toolbar").on("click", function() {
                $(".fui-selected", d).removeClass("fui-selected"), f.css("display", "none"), a(e, {height: "30px"}), a($(".main"), {top: "76px"}), b = !1
            }), $(".wo-tabs-btn", WO.toolbar.$tabList).on("click", function() {
                a(e, {height: "142px"}, function() {
                    f.css("display", "block")
                }), b || ($("#fold-toolbar").css("display", "none"), $("#dock-toolbar").css("display", "block"))
            }), $("#dock-toolbar").on("click", function() {
                a($(".main"), {top: "188px"}), b = !0, $("#fold-toolbar").css("display", "block"), $("#dock-toolbar").css("display", "none")
            }), WO.editor.on("keydown mousedown", function() {
                b || $("#fold-toolbar").trigger("click")
            })
        })
    }), function() {
        function a(a, b, c, d) {
            var e = new FUI.Panel({className: "wo-filetab-left"}), f = new FUI.Panel({className: "wo-filetab-right"});
            d.appendWidget(e), d.appendWidget(f);
            var g = new FUI.Button({className: "wo-filetab-back",label: "回退"});
            e.appendWidget(g), $(f.getContentElement()).before('<div class="wo-filetab-right-title">百度Doc</div>'), g.on("click", function() {
                d.close()
            });
            var h = FUI.Creator.parse(WO.MenuConfig);
            h.appendButtonTo(e.getContentElement()), h.appendPanelTo(f.getContentElement())
        }
        function b(b, c, d) {
            function e() {
                WO.fire("filerefresh")
            }
            var f = this, g = new FUI.Popup({id: "filetabpopup",className: "wo-filetab",mask: {className: "wo-filetab-mask"}}), h = $(g.getElement());
            return h.find(".fui-panel-content").addClass("wo-filetab-wrap"), g.appendTo(document.body), g.positionTo(f.$toolbar[0], "left-top"), g._bkopen = g.open, g._bkclose = g.close, g.open = function() {
                h.css({width: 0,height: 0}), g._bkopen(), h.css({top: 0}).animate({width: "100%",height: "100%"}, 300, "swing"), h.find(".wo-filetab-right").css({"margin-left": "-150px",background: "#fff"}).animate({"margin-left": "0"}, 400, "swing"), !g.isOpen() && e()
            }, g.close = function() {
                h.css({width: "100%",height: "100%"}), g._bkclose(), h.animate({width: 0,height: 0}, 300, "linear"), h.find(".wo-filetab-right").animate({"margin-left": "-150px"}, 300, "linear")
            }, c.on("click", function() {
                g.open()
            }), WO.on("esc", function() {
                var a = 0;
                $(".fui-mask").each(function(b, c) {
                    "none" == $(c).css("display") || $(c).hasClass("wo-filetab-mask") || a++
                }), a || g[g.isOpen() ? "close" : "open"](), WO.READONLY && $("#fileopen,#openfromwangpan").trigger("click")
            }), WO.on("switchtotpl", function() {
                g.open(), $("filenew").trigger("click")
            }), WO.ready(function() {
                $("#fileopen,#openfromwangpan,#filesave,#savetowangpan").on("click", function() {
                    e()
                })
            }), a.call(f, b, c, d, g), WO.menu = g, c
        }
        var c = {};
        WO.registerWouiHandler = function(a, b) {
            $.each(a.split(/\s+/), function(a, d) {
                c[d] = b
            })
        }, WO.initMenu = function() {
            var a = WO.toolbar;
            a.menuButton = new FUI.Button({label: "文件",className: "wo-btn wo-btn-filetab"}), a.$tabList.prepend(a.menuButton.getElement()), b.call(a, {}, a.menuButton, a.editor), WO.ConfigTraveller(WO.MenuConfig, function(b) {
                var d = c[b._name], e = FUI.widgets[b.id];
                e && d && d.call(a, b, e, a.editor)
            }), WO.fire("menuready")
        }
    }(), function() {
        WO.MenuConfig = {clazz: "Tabs",className: "wo-tabs",buttons: [{clazz: "Button",id: "filenew",title: "新建",label: "新建"}, {clazz: "Button",id: "fileopen",title: "打开",label: "打开"}, {clazz: "Button",id: "filesave",title: "保存",label: "保存"}, {clazz: "Button",id: "fileshare",title: "分享",label: "分享"}, {clazz: "Button",id: "fileprint",title: "打印",label: "打印"}, {clazz: "Button",id: "filehelp",title: "帮助",label: "帮助"}],panels: [{clazz: "Panel",id: "filepanelnew",_name: "filenew"}, {clazz: "Panel",id: "filepanelopen",_name: "fileopen"}, {clazz: "Panel",id: "filepanelsave",_name: "filesave"}, {clazz: "Panel",id: "filepanelshare",_name: "fileshare"}, {clazz: "Panel",id: "filepanelprint",_name: "fileprint"}, {clazz: "Panel",id: "filepanelhelp",_name: "filehelp"}]}, WO.ConfigTraveller(WO.MenuConfig, function(a) {
            a.clazz && a.id && (a._name = a._name || a.id)
        }), function(a) {
            var b;
            for (b = 0; b < a.buttons.length; b++)
                a.buttons[b].className = "wo-filetab-button wo-filetab-" + a.buttons[b].id;
            for (b = 0; b < a.panels.length; b++)
                a.panels[b].className = "wo-filetab-content wo-filetab-" + a.panels[b].id
        }(WO.MenuConfig)
    }(), WO.registerUI("widget/netdiskfinder", function() {
        function a(a, c) {
            function d() {
                function a() {
                    var a = c.val();
                    a && fio.file.mkdir({path: q + a}).then(function() {
                        return i(q)
                    }, function(a) {
                        "31061,file already exists" == a.message && alert("目录已存在")
                    }).then(function() {
                        d.onprogress = !1
                    }), b.remove()
                }
                if (d.onprogress)
                    return d.onprogress.select();
                var b = $("<li>").addClass("netdisk-file-list-item dir").prependTo(s), c = $("<input>").attr("type", "text").addClass("new-dir-name fui-widget fui-selectable").val(WO.getLang("ui.newdir")).appendTo(b);
                d.onprogress = c[0], c[0].select(), c[0].focus(), c.on("keydown", function(c) {
                    13 == c.keyCode && a(), 27 == c.keyCode && (b.remove(), d.onprogress = !1, c.stopPropagation())
                })
            }
            function e(a) {
                return a > 0 ? 1 : 0 > a ? -1 : 0
            }
            function f(a) {
                return a.isDir ? i(a.path) : void o.fire("fileclick", a)
            }
            function g(a) {
                return new Promise(function(b) {
                    s.transit({x: a,opacity: 0}, 100, b)
                })
            }
            function h() {
                return new Promise(function(a) {
                    s.css({x: -parseInt(s.css("x"))}).stop().transit({x: 0,opacity: 1}, 100, a)
                })
            }
            function i(a) {
                a = a || p;
                var b = fio.file.list({path: a}), c = g(-100 * e(a.length - q.length));
                return q = "/" == a.charAt(a.length - 1) ? a : a + "/", k(), Promise.all([b, c]).then(j, function() {
                })
            }
            function j(a) {
                s.empty();
                var b = a[0];
                b.sort(function(a, b) {
                    return a.isDir > b.isDir ? -1 : a.isDir == b.isDir && a.createTime > b.createTime ? -1 : 1
                }), b.length ? $.each(b, function(a, b) {
                    (b.isDir || c && c(b)) && $("<li></li>").text(b.filename).addClass("netdisk-file-list-item").addClass(b.isDir ? "dir" : "file").data("file", b).appendTo(s)
                }) : s.append('<li class="empty" disabled="disabled">' + WO.getLang("ui.emptydir") + "</li>"), h(), m(), o.fire("cd", q, a[0])
            }
            function k() {
                function a(a) {
                    d += a + "/";
                    var b = $("<a></a>");
                    return b.text(a == p ? WO.getLang("ui.mydocument") : a), b.data("path", d)
                }
                r.empty(), r.append(q != p && q != p + "/" ? '<a class="dir-back">Back</a>' : '<span class="my-document"></span>');
                var b = q.substr(p.length), c = b.split("/"), d = "";
                r.append(a(p)), $.each(c, function(b, c) {
                    c && (r.append('<span class="spliter"></span>'), r.append(a(c)))
                }), r.append($('<a class="dir-refresh"></a>').data("path", q).text("刷新"))
            }
            function l(a) {
                return u = a, m()
            }
            function m() {
                var a = !1;
                return s.find(".netdisk-file-list-item").removeClass("selected").each(function() {
                    var b = $(this).data("file");
                    b && b.path == u && ($(this).addClass("selected"), a = !0)
                }), a || (u = !1), a
            }
            function n() {
                return q
            }
            var o = b.setup({}), p = "/apps/wordonline", q = p, r = $('<div class="netdisk-nav"></div>').appendTo(a), s = $('<ul class="netdisk-file-list"></ul>').appendTo(a), t = ($("<a></a>").text(WO.getLang("ui.mkdir")).addClass("button netdisk-mkdir").click(d), $("<a></a>").text(WO.getLang("ui.mkdir")).addClass("button netdisk-mkdir").click(d)), u = null;
            return r.after(t), a.addClass("netdisk-finder-container"), s.delegate(".netdisk-file-list-item", "click", function(a) {
                if (d.onprogress)
                    return d.onprogress.select();
                var b = $(a.target), c = b.data("file");
                c && f(c)
            }), r.delegate("a", "click", function(a) {
                if (d.onprogress)
                    return d.onprogress.select();
                if ($(a.target).hasClass("dir-back")) {
                    var b = q.split("/");
                    return b.pop(), b.pop(), i(b.join("/"))
                }
                i($(a.target).data("path"))
            }), WO.ready(function() {
                a.append($('<p class="login-tip"></p>').html(WO.getLang("ui.requirelogin"))), WO.doAfterLogin(function() {
                    i()
                }), fio.user.on("logout", function() {
                })
            }), WO.on("filerefresh", function() {
                i(q)
            }), o.list = i, o.select = l, o.pwd = n, o
        }
        var b = WO.getUI("eve");
        return {generate: a}
    }), WO.registerWouiHandler("filenew", function(a, b, c) {
        function d(a) {
            function b(b) {
                clearTimeout(d);
                try {
                    e.onload = e.onerror = function() {
                    }, e.src = ""
                } catch (f) {
                }
                i || (i = b, a(1 == b), c = !0), c || (a(1 == b), c = !0)
            }
            var c, d;
            if (i)
                a(1 == i);
            else {
                var e = new Image;
                e.onload = function() {
                    b(!0)
                }, e.onerror = function() {
                    b(!1)
                }, d = setTimeout(function() {
                    b(!1)
                }, 300), e.src = g + "favicon.ico?v=" + +new Date
            }
        }
        function e(a, b) {
            if (a || a.length) {
                var c, d = ['<div class="tpl-list">'];
                $.each(a, function(a, e) {
                    d.push('<h2 class="filenew-title">' + e.name + '</h2><div class="filenew-main"><ul class="tpl-list">'), $.each(e.list, function(a, e) {
                        c = (b || WO.WO_URL) + "images/" + e.id + ".png", d.push('<li class="tpl-item" data-title="' + e.title + '" data-id="' + e.id + '"><div class="tpl-thumbnails">' + (e.thumbs ? e.thumbs : '<img src="' + c + '" />') + '</div><div class="tpl-title">' + e.title + "</div></li>")
                    }), d.push('<li class="tpl-item tpl-add" data-title="贡献模板" data-id="blank">   <div class="tpl-thumbnails" style="border-style:dashed;">       <p style="color: #CCC;font-size: 36px;text-align: center;margin-top: 40px;">+</p>   </div>   <div class="tpl-title">贡献模板</div></li>'), d.push("</div></ul>")
                }), d.push("</div>"), f.find(".filenew-content").html(d.join(""))
            }
        }
        var f = $(b.getElement()), g = "http://wordonline.newoffline.bae.baidu.com/static/tpl/", h = WO.WO_URL + "tpl/";
        f.html('<div class="filenew-wrap">   <div class="filenew-content">       <div class="tpl-list preload">           <h2 class="filenew-title">通用文档模板</h2>           <div class="filenew-main">               <ul class="tpl-list">                   <li class="tpl-item" data-title="空白文档" data-id="blank">                       <div class="tpl-thumbnails"><p style="color: #CCC;font-size: 24px;text-align: center;margin-top: 50px;">                           空白</p></div>                       <div class="tpl-title">空白文档</div>                   </li>                   <li class="tpl-item" data-title="调研方案" data-id="survey-scheme">                       <div class="tpl-thumbnails"><img                               src="' + h + 'images/survey-scheme.png"></div>                       <div class="tpl-title">调研方案</div>                   </li>                   <li class="tpl-item" data-title="总体设计文档" data-id="design-document">                       <div class="tpl-thumbnails"><img                               src="' + h + 'images/design-document.png"></div>                       <div class="tpl-title">总体设计文档</div>                   </li>                   <li class="tpl-item" data-title="项目迭代周报" data-id="projectiteration">                       <div class="tpl-thumbnails"><img                               src="' + h + 'images/projectiteration.png"></div>                       <div class="tpl-title">项目迭代周报</div>                   </li>                   <li class="tpl-item" data-title="周报" data-id="weekly">                       <div class="tpl-thumbnails"><img                               src="' + h + 'images/weekly.png"></div>                       <div class="tpl-title">周报</div>                   </li>                   <li class="tpl-item tpl-add" data-title="贡献模板" data-id="blank">                       <div class="tpl-thumbnails" style="border-style:dashed;"><p                               style="color: #CCC;font-size: 36px;text-align: center;margin-top: 40px;">+</p></div>                       <div class="tpl-title">贡献模板</div>                   </li>               </ul>           </div>       </div>   </div></div>');
        var i;
        return d(function(a) {
            var b = a ? g : h;
            $.get(b + "tpl.php", {action: "config",noCache: +new Date}, function(a) {
                a && "SUCCESS" == a.state && a.list && e(a.list, b)
            }, "jsonp")
        }), f.delegate(".tpl-item", "click", function() {
            $(this).hasClass("tpl-add") ? WO.fire("confirm", {title: "贡献模板",textOk: "确定",message: '<p>欢迎贡献你的文档作为模板。<br/>发主题为“贡献模板 - 百度doc”的邮件到 <a href="mailto:ueditor@baidu.com?subject=贡献模板 - 百度doc邮件" target="blank">ueditor@baidu.com</a><br/>反馈问题请到 <a href="http://tieba.baidu.com/f?kw=%E7%99%BE%E5%BA%A6doc" target="blank">百度doc</a> 贴吧。感谢你的支持！'}) : (WO.menu.isOpen() && WO.menu.close(), WO.utils.openGetWin("#tpl=" + $(this).attr("data-id")))
        }), WO.on("newdoc", function(a) {
            var b = a ? "#tpl=" + a : "#tpl=blank";
            b = (window.DEBUG ? "./src.php" : "./") + b, WO.utils.openGetWin(b)
        }), WO.on("loadtemplate", function(a) {
            d(function(b) {
                var d = b ? g : h;
                $.get(d + "tpl.php", {action: "tpl",id: a,noCache: +new Date}, function(b) {
                    if (b && "SUCCESS" == b.state && (c.setContent(b.html), c.reset(), c.focus(), b.title)) {
                        var d = b.title;
                        d = d.substr(0, d.lastIndexOf(".")) || d, d && "blank" != a && setTimeout(function() {
                            WO.fire("searchonwenku", d)
                        }, 1e3)
                    }
                }, "jsonp")
            })
        }), b
    }), WO.registerWouiHandler("fileopen", function(a, b, c) {
        function d() {
            var a = $("#openfromlocal-selector").find(".webuploader-pick");
            a && a.length || WebUploader.Uploader.support() && (WO.webuploader.on("filesQueued", function(a) {
                a[0] && a[0].source && a[0].source._refer.hasClass("fileopen-local-selector") && WO.menu.close()
            }), WO.webuploader.addButton({id: "#openfromlocal-selector",multiple: !1})), WebUploader.Uploader.support() || $("#openfromlocal-selector").on("click", function() {
                WO.fire("needflash")
            })
        }
        function e() {
            var a = WO.doc.current(), b = a && a.path || "";
            return b.substr(b.lastIndexOf("/") + 1)
        }
        function f(a) {
            try {
                document.title = a ? a + " - 百度Doc" : "百度Doc"
            } catch (b) {
            }
        }
        var g = $(b.getElement());
        g.html('<div class="fileopen-wrap">   <div class="fileopen-content">       <h2 class="fileopen-title">打开</h2>       <div class="panel-left">           <div id="openfromwangpan" class="fileopen-subtab fileopen-active">百度云存储</div>           <div id="openfromlocal" class="fileopen-subtab fileopen-btn">从本地上传</div>       </div>       <div class="panel-right">           <div id="openfromwangpan-content" class="fileopen-subpanel fileopen-wangpan fileopen-active login-required"></div>           <div id="openfromlocal-content" class="fileopen-subpanel fileopen-local">               <div class="fileopen-subhead"><span class="fileopen-subtitle">从本地上传</span></div>               <div class="webuploader-wrap"><a id="openfromlocal-selector" class="fileopen-local-selector">选择文件...</a><span>支持格式 .doc, .docx</span></div>           </div>       </div>   </div></div>'), g.find(".fileopen-subtab").on("click", function() {
            var a = $(this), b = $("#" + a.attr("id") + "-content");
            $(".fileopen-subtab").not(a).removeClass("fileopen-active"), a.addClass("fileopen-active"), $(".fileopen-subpanel").not(b).removeClass("fileopen-active"), b.addClass("fileopen-active"), "openfromlocal" == a.attr("id") && d()
        });
        var h = WO.basePath = "/apps/wordonline/", i = WO.getUI("widget/netdiskfinder"), j = i.generate($(".fileopen-wangpan", g).html(""), function(a) {
            return ".wo" == a.extension || ".doc" == a.extension || ".docx" == a.extension || a.isDir
        });
        return j.on("fileclick", function(a) {
            var b = UE.browser.ie ? "&nodl" : "";
            WO.utils.openGetWin(".doc" == a.extension || ".docx" == a.extension ? "./readonly.html#path=" + encodeURI(a.path.substr(h.length)) + b : (window.DEBUG ? "./src.php" : "./") + "#path=" + encodeURI(a.path.substr(h.length)) + b)
        }), WO.on("openmenu", function(a, b) {
            $("#fileopen,#openfromwangpan").trigger("click"), WO.menu.isOpen() || WO.menu.open(), b && b.preventDefault()
        }), WO.on("opendoc", function(a) {
            WO.menu.close(), WO.READONLY ? WO.doc.view({path: a}, function(a) {
                a.html ? c.setContent(a.html || "", !1, !0) : a.bdjson && c.setWkContent(a.bdjson["document.xml"]), a.path && f(e())
            }) : WO.doc.open({path: a}, function(a) {
                if (a.html)
                    c.setContent(a.html || "", !1, !0);
                else if (a.bdjson) {
                    c.setWkContent(a.bdjson["document.xml"]);
                    var b = 0 === a.path.indexOf(h) ? a.path.substr(h.length) : a.path;
                    window.location.hash = "#path=" + encodeURI(b)
                }
                a.path && f(e()), setTimeout(function() {
                    var a = c.selection.getRange();
                    a.setStartAtFirst(c.body.firstChild).collapse().select()
                })
            })
        }), WO.on("openuploadeddoc", function(a) {
            WO.fire("confirm", {title: "",message: "文档上传成功，现在打开？",textOk: "打开",textCancel: "取消",onOk: function() {
                    var b = UE.browser.ie ? "&nodl" : "";
                    WO.utils.openGetWin("./readonly.html#path=" + encodeURI(0 === a.indexOf(h) ? a.substr(h.length) : a) + b)
                }})
        }), b
    }), WO.registerWouiHandler("filesave", function(a, b, c) {
        function d(a) {
            WO.menu.close(), e(c.getContent(), a)
        }
        function e(a, b) {
            q = a = a || c.getContent(), WO.doc.save({newpath: b || "",content: a}, function(a) {
                var b = f();
                a && "SUCCESS" == a.state ? (g(b), WO.isUnSave = !1) : g("* " + b)
            })
        }
        function f() {
            var a = WO.doc.current(), b = a && a.path || "";
            return b.substr(b.lastIndexOf("/") + 1)
        }
        function g(a) {
            try {
                document.title = a ? a + " - 百度Doc" : "百度Doc"
            } catch (b) {
            }
        }
        var h = $(b.getElement());
        h.html('<div class="filesave-wrap">   <div class="filesave-content">       <h2 class="filesave-title">保存</h2>       <div class="panel-left">           <div id="savetowangpan" class="filesave-subtab filesave-active">百度云存储</div>           <div id="savetolocal" class="filesave-subtab">保存到本地</div>       </div>       <div class="panel-right">           <div id="savetowangpan-content" class="filesave-subpanel filesave-wangpan filesave-active">               <div class="netdisk-wrap login-required"></div>           </div>           <div id="savetolocal-content" class="filesave-subpanel filesave-local">               <div class="fileopen-subhead"><span class="filesave-subtitle">保存到本地</span></div>               <div id="savetolocal-selector" class="filesave-local-button"><a class="download-button">导出文档到本地</a><span>导出格式 .docx</span></div>           </div>       </div>   </div></div>'), h.find(".filesave-subtab").on("click", function() {
            var a = $(this), b = $("#" + a.attr("id") + "-content");
            $(".filesave-subtab").not(a).removeClass("filesave-active"), a.addClass("filesave-active"), $(".filesave-subpanel").not(b).removeClass("filesave-active"), b.addClass("filesave-active")
        }), WO.menu.on("open", function() {
            var a, b = WO.doc.current();
            b && (a = b.path || "未命名文档", a = a.substring(a.lastIndexOf("/") + 1, a.lastIndexOf(".")), $(".netdisk-save-select input").val(a))
        }), h.find(".filesave-local-button .download-button").on("click", function() {
            WO.doc.download()
        }), WO.on("exportdoc", function() {
            WO.doc.download()
        });
        var i = [], j = "/apps/wordonline", k = $(".filesave-wangpan", h), l = WO.getUI("widget/netdiskfinder"), m = l.generate($(".filesave-wangpan .netdisk-wrap", h).html(""), function(a) {
            return ".wo" == a.extension || ".doc" == a.extension || ".docx" == a.extension || a.isDir
        });
        m.on("fileclick", function(a) {
            k.find("input").val(a.name)
        }), m.on("cd", function(a, b) {
            j = a, i = b
        }), k.append('<div class="netdisk-save-select login-required">   <label>保存为</label>   <input placeholder="文件名" title="文件名" class="fui-widget fui-selectable">   <a class="button save-button">保存</a></div>');
        var n = k.find("input"), o = k.find(".save-button");
        o.on("click", function() {
            var a = !1, b = n.val();
            if (!b)
                return !1;
            var c = j + b + (/\.wo/.test(b) ? "" : ".wo");
            c != WO.doc.current().path && $.each(i, function(c, d) {
                return d.filename == b + ".wo" ? (a = !0, !1) : void 0
            }), a ? WO.fire("confirm", {message: "文件名已存在，你要替换它吗？",textOk: "替换",textCancel: "取消",onOk: function() {
                    d(c)
                }}) : d(c)
        });
        var p, q;
        return WO.isUnSave = !1, WO.on("savedoc saveasdoc", function(a, b) {
            if (b && b.preventDefault(), WO.doc.current().path && "savedoc" == a) {
                WO.menu.isOpen() || WO.menu.close();
                var d = c.getContent();
                if (q == d)
                    return void WO.showMsg({content: "文档已保存",timeout: 2e3});
                e(d)
            } else
                WO.menu.isOpen() || WO.menu.open(), $("#filesave, #savetowangpan").trigger("click"), setTimeout(function() {
                    n.focus()
                })
        }), n.on("keydown", function(a) {
            "13" == a.keyCode && o.trigger("click")
        }), c.on("contentchange", function() {
            var a, b = WO.doc.current().path;
            if (b) {
                if (a = c.getContent(), q == a)
                    return;
                var d = f();
                $("#wordonline-filename").html("* " + d), g("* " + d), WO.isUnSave = !0, p && clearTimeout(p), p = setTimeout(function() {
                    e(), p = 0
                }, 1e3)
            } else
                $("#wordonline-filename").html("* 未命名文档"), g("* 未命名文档"), a = c.getContent();
            q != a && (WO.isUnSave = !0)
        }), c.on("afterSetContent", function() {
            var a = f();
            WO.isUnSave = !1, g(a), $("#wordonline-filename").html(a), q = c.getContent()
        }), b
    }), WO.registerWouiHandler("fileshare", function(a, b, c) {
        function d() {
            var a = [], b = $(".share-list-wrap");
            WO.share.list(function(c) {
                n = c, c && c.length ? ($.each(c, function(b, c) {
                    var d = WO.WO_ROOT_URL + "share.php?id=" + c.sid;
                    a.push('<li class="share-list-item"><span class="share-filename">' + (c.path ? c.path.substr(c.path.lastIndexOf("/") + 1) : "未保存文件") + '</span><div class="share-links">   <a class="share-link" target="_blank" href="' + d + '" title="' + d + '">查看分享</a>   <a class="share-delete" data-link="' + d + '" data-sid="' + c.sid + '" title="删除分享">删除</a></div></li>')
                }), b.html(a.join("")), $(".share-tip").hide()) : $(".share-tip").show(), e()
            })
        }
        function e() {
            window._bd_share_config = {common: {bdPic: "",bdSnsKey: {},bdMini: "2",bdMiniList: [],bdStyle: "1",bdSize: "32"},share: {}}, o || (UE.utils.loadFile(document, {src: "http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion=" + ~(-new Date / 36e5),tag: "script",type: "text/javascript",defer: "defer"}, function() {
                o = !0, bdShareJsLoading = !1, k()
            }), bdShareJsLoading = !0), o || bdShareJsLoading || k()
        }
        function f(a) {
            if ("none" !== q) {
                m.find(".panel-right").addClass("loading");
                var b = $("#public-share .share-body");
                h("none"), a && WO.share.rm({id: p}, function() {
                    m.find(".panel-right").removeClass("loading"), b.hide(), q = "none"
                })
            }
        }
        function g(a) {
            "share" !== q && (h("public"), e(), a && i())
        }
        function h(a) {
            $("#share-select input[name=sharetype][value=" + a + "]").prop("checked", !0)
        }
        function i() {
            $(this).hasClass("wo-disabled") || (m.find(".panel-right").addClass("loading"), WO.share.add({content: WO.editor.getContent()}, function(a) {
                m.find(".panel-right").removeClass("loading"), a && a.sid && j(a)
            }))
        }
        function j(a) {
            var b = $("#public-share .share-body");
            p = a.sid;
            var c = WO.WO_ROOT_URL + "share.php?id=" + a.sid;
            $("#share-url", b).val(c)[0].select(), $(".shareQrCode", b).attr("src", "http://qr.liantu.com/api.php?w=128&m=0&text=" + encodeURI(c));
            var d = window._bd_share_config.common, e = window._bd_share_main.init, f = a.path ? a.path.substring(a.path.lastIndexOf("/"), a.path.lastIndexOf(".")) : "未命名文档";
            d && e && (d.bdTitle = f, d.bdDesc = d.bdText = f + "- 我用「百度Doc」编辑的文档，快看看吧！", d.bdUrl = c, e && e()), b.show(), $("#share-url").focus()[0].select(), q = "share"
        }
        function k() {
            var a = WO.doc.current().fid;
            if (a && n && o) {
                var b = !1;
                $.each(n, function(c, d) {
                    return d.fid == a ? (b = !0, g(), j(d), !1) : void 0
                }), !b && f()
            }
        }
        function l() {
            r.text("已复制").attr("disabled", "disabled"), $("#share-url").focus()[0].select(), setTimeout(function() {
                r.text("复制").removeAttr("disabled")
            }, 3e3)
        }
        var m = $(b.getElement()), n = [];
        m.html('<div class="share-wrap">   <div class="share-content">       <h2 class="share-title">分享</h2>       <div class="panel-left">           <div id="share-current" class="share-subtab share-active">当前文档</div>           <div id="share-list" class="share-subtab">已分享</div>       </div>       <div class="panel-right login-required">           <div id="share-current-content" class="share-subpanel share-current-content share-active">               <div class="share-subhead"><span class="share-subtitle">分享当前文档</span></div>               <form id="share-select">                   <div id="shared-tip"></div>                   <fieldset id="no-share">                      <legend>                         <label><input name="sharetype" type="radio" value="none" checked />不分享</label>                     </legend>                      <div class="share-description">不分享当前文档</div>                  </fieldset>                  <fieldset id="public-share">                      <legend>                          <label><input name="sharetype" type="radio" value="public"/>公开分享</label>                      </legend>                      <div class="share-description">创建任何人可见的分享</div>                      <div class="share-body">                          <h3>文档 URL 地址：</h3>                          <p>                              <input id="share-url" type="url" />                              <button id="copy-share-url" data-clipboard-target="share-url" type="button">复制</button>                          </p>                          <p class="share-qr-code" title="http://naotu.baidu.com/viewshare.html?shareId=aqot71i9dk0g">                               <canvas width="128" height="128" style="display: none;"></canvas>                               <img class="shareQrCode" alt="Scan me!" src="" style="display: block;">                          </p>                          <h3>社交网络分享</h3>                          <p id="share-platform" class="bdsharebuttonbox">                              <a href="#" class="bds_tsina" data-cmd="tsina" title="分享到新浪微博"></a>                              <a href="#" class="bds_qzone" data-cmd="qzone" title="分享到QQ空间"></a>                              <a href="#" class="bds_tqq" data-cmd="tqq" title="分享到腾讯微博"></a>                              <a href="#" class="bds_renren" data-cmd="renren" title="分享到人人网"></a>                              <a href="#" class="bds_weixin" data-cmd="weixin" title="分享到微信"></a>                          </p>                      </div>                  </fieldset>                  <fieldset id="password-share" disabled>                      <legend>                          <label><input name="sharetype" type="radio" value="password" disabled />私密分享</label>                      </legend>                      <div class="share-description">创建需要密码才可见的分享</div>                      <div class="share-body">敬请期待！</div>                  </fieldset>                  <fieldset id="email-share" disabled>                      <legend>                          <label><input name="sharetype" type="radio" value="email" disabled />邮件邀请</label>                      </legend>                      <div class="share-description">创建指定人可见的分享，您还可以允许他们编辑</div>                      <div class="share-body">敬请期待！</div>                  </fieldset>               </form>           </div>           <div id="share-list-content" class="share-subpanel share-list-content">               <div class="share-subhead"><span class="share-subtitle">已分享</span></div>               <ul class="share-list-wrap"></ul>               <p class="share-tip">没有分享记录</p>           </div>           <p class="login-tip">请 <a class="login-button">登录</a> 后使用</p>       </div>   </div></div>'), m.find(".share-subtab").on("click", function() {
            var a = $(this), b = $("#" + a.attr("id") + "-content");
            $(".share-subtab").not(a).removeClass("share-active"), a.addClass("share-active"), $(".share-subpanel").not(b).removeClass("share-active"), b.addClass("share-active"), "share-list" == a.attr("id") && d()
        }), m.find(".share-list-wrap").delegate(".share-delete", "click", function() {
            var a = $(this);
            a.parents(".share-list-item").slideUp(), WO.share.rm({id: a.attr("data-sid")}, function() {
            })
        }), m.find(".share-current-button").on("click", function() {
            $(this).hasClass("wo-disabled") || (m.find(".share-current-loding").addClass("loading"), WO.share.add({content: WO.editor.getContent()}, function(a) {
                if (m.find(".share-current-button").hide(), m.find(".share-current-loding").removeClass("loading").css("display", "inline-block"), m.find(".share-current-qrcode .share-current-bdshare").slideDown(), a) {
                    var b = location.href.replace(/\/[#\?].*$/, "/").replace(/\/[^/]*$/, "/") + "share.php?id=" + a.sid;
                    $(".share-current-link").html('分享链接: <a href="' + b + '" target="_blank">' + b + "</a>").css("display", "inline-block"), $(".share-current-qrcode").html('<img src="http://qr.liantu.com/api.php?text=' + b + '" />')
                }
            }))
        }), WO.doAfterLogin(function() {
            d(), m.find(".share-current-button").removeClass("wo-disabled"), m.find(".share-current-body").show(), m.find(".share-current-tip").hide()
        }), WO.on("sharedoc", function(a, b) {
            b && b.preventDefault(), WO.menu.isOpen() || WO.menu.open(), $("#fileshare, #share-current").trigger("click")
        });
        var o = bdShareJsLoading = !1, p = "", q = "none";
        m.delegate("input[name=sharetype]", "click", function(a) {
            var b = {none: f,"public": g};
            b[a.target.value](!0)
        }), WO.on("afterlistshare doccurrentchange", k);
        var r = $("#copy-share-url");
        return UE.browser.ie ? $("#copy-share-url").on("click", function() {
            window.clipboardData.setData("Url", window._bd_share_config.common.bdUrl), window.clipboardData.setData("Text", window._bd_share_config.common.bdUrl), l()
        }) : c.on("zeroclipboardready", function() {
            var a = new ZeroClipboard(document.getElementById("copy-share-url"), {hoverClass: "hover",activeClass: "active"});
            a.on("ready", function() {
                a.on("copy", function(a) {
                    var b = a.clipboardData;
                    b.setData("text/plain", window._bd_share_config.common.bdUrl)
                }), a.on("aftercopy", function() {
                    l()
                })
            })
        }), b
    }), WO.registerWouiHandler("fileprint", function() {
        WO.on("print", function(a, b) {
            WO.editor.execCommand("print"), b.preventDefault()
        })
    }), WO.registerWouiHandler("filehelp", function(a, b) {
        function c(a) {
            var b, c, d, e = "", f = "", g = !0;
            return e += '<div class="help-container">', e += '<h2 class="help-header">帮助</h2>', e += '<div class="help-article row">', $.each(a.split("\n"), function(a, h) {
                if (f = "", /^##/g.test(h)) {
                    g ? g = !1 : f += "</table>";
                    var i = h.replace(/^#+\s*/, "");
                    f += '<table class="shortcuts-table "><tr><td></td><td><h2 class="shortcuts-thead">' + i + "</h2></td>"
                } else
                    /\S/.test(h) && (f += '<tr class="shortcuts-tbody"><td class="shortcuts-group"><div class="shortcuts-keys right">', b = h.split(":"), c = b[0], d = b[1], c = c.replace(/\`(.+?)\`/g, '<span class="shortcuts-key label">$1</span>'), f += c, f += '</div></td><td class="shortcuts-desc">' + d + "</td>", f += "</tr>");
                e += f
            }), e += "<table>", e += "</div>", e += "</div>"
        }
        var d = $(b.getElement()), e = d.find(".fui-panel-content"), f = WO.WO_URL + "dialogs/help/operation.txt";
        UE.browser.mac && (f = WO.WO_URL + "dialogs/help/operation-mac.txt"), $.ajax({type: "get",dataType: "text",url: f,success: function(a) {
                var d = c(a) || "";
                return e.append(d), b
            }})
    }), UE._wk_whitelist = {a: {href: !0},br: {type: !0},div: {},h1: {},h2: {},h3: {},h4: {},h5: {},h6: {},img: {src: !0,width: !0,height: !0,alt: !0,__trans: {c: "src",w: "width",h: "height"}},math: {},obj: {datatype: !0,data: !0,"bg-img": !0,alt: !0,width: !0,height: !0,type: !0},li: {},ol: {start: !0,type: !0},p: {datatype: !0},span: {},table: {},td: {rowspan: !0,colspan: !0,nowrap: !0},tr: {},ul: {start: !0,type: !0},sup: {},sub: {},ruby: {},rt: {},rbase: {},style: {}}, function() {
        function a(a) {
            var b = {};
            return $.each(a, function(a, c) {
                var d;
                (d = c.baseStyle.p) && $.each($.isArray(d) ? d : [d], function(a, d) {
                    $.each(c.style[d], function(a, c) {
                        b[a] = c
                    })
                }), (d = c.baseStyle.span) && $.each($.isArray(d) ? d : [d], function(a, d) {
                    $.each(c.style[d], function(a, c) {
                        b[a] = c
                    })
                })
            }), "body{" + $.map(b, function(a, b) {
                return b + ":" + a + ";"
            }).join("") + "}"
        }
        var b = {setWkContent: function(b) {
                var c, d, e, f = this;
                UE.utils.cssRule("bdjsonBaseStyle", a(b), f.document), f.fireEvent("beforesetwkcontent", b), c = UE.parseDoc(b), d = c.node, f.filterWkInputRule(d), e = d.toHtml(), f.setContent(e), f.fireEvent("aftersetwkcontent", e)
            },addWkInputRule: function(a) {
                void 0 === this.wkInputRules && (this.wkInputRules = []), this.wkInputRules.push(a)
            },filterWkInputRule: function(a) {
                var b = this;
                b.wkInputRules && a.traversal(function(a) {
                    for (var c, d = 0; c = b.wkInputRules[d++]; )
                        c.call(b, a)
                })
            }};
        UE.utils.extend(UE.Editor.prototype, b)
    }(), UE.plugins.docparserfilters = function() {
        function a(a) {
            if ("obj" == a.tagName) {
                if (a.firstChild()) {
                    var b = UE.uNode.createElement("img");
                    b.setAttr("src", a.firstChild().data), a.parentNode.insertBefore(b, a)
                }
                return a.parentNode.removeChild(a), 1
            }
        }
        function b(a) {
            var b = a.getAttr("style");
            if (b && /font\-family\s*:\s*Wingdings/.test(b)) {
                var c = a.innerText().charCodeAt(0);
                a.innerText(9 != c ? j[c] || "●" : "     "), a.setStyle("font-family")
            }
        }
        function c(a) {
            var b = a.getAttr("style");
            b && a.setAttr("style", b.replace(/styleName\s*:\s*([^;]+);/gi, function(b, c) {
                switch (c) {
                    case "quote":
                        a.tagName = "blockqoute"
                }
                return ""
            }))
        }
        function d(a) {
            var b = a.getAttr("style");
            b && /outlineLvl\s*:\s*(\d);?/i.test(b) && (a.tagName = "h" + (1 * RegExp.$1 + 1), a.setAttr("style", b.replace(/outlineLvl\s*:\s*(\d);?/i, "")))
        }
        function e(a) {
            var b = a.getAttr("style");
            if (b) {
                b = b.split(";");
                var c = {};
                i.each(b, function(a) {
                    a && (a = a.split(":"), c[a[0]] = a[1])
                }), b = [], i.each(c, function(a, c) {
                    b.push(c + ":" + a)
                }), a.setAttr("style", b.join(";"))
            }
        }
        function f(a) {
            function b(a) {
                var b = 0;
                return i.each(a, function() {
                    b++
                }), b
            }
            function c(a, c) {
                if (a.tagName != c.tagName)
                    return !1;
                var d = a.attrs, e = c.attrs;
                if (b(d) != b(e))
                    return !1;
                for (var f in d)
                    if (e[f].replace(/;$/, "") !== d[f].replace(/;$/, ""))
                        return !1;
                return !0
            }
            if ("span" == a.tagName)
                for (; (next = a.nextSibling()) && c(next, a); ) {
                    for (; next.firstChild(); )
                        a.appendChild(next.firstChild());
                    next.parentNode.removeChild(next)
                }
        }
        function g(a) {
            if ("span" == a.tagName && (style = a.getAttr("style"))) {
                if (/valign\s*:\s*(sup|sub);?/i.test(style))
                    return a.tagName = RegExp.$1, void a.setAttr("style", style.replace(/valign\s*:\s*(sup|sub);?/i, ""));
                if (/font-style\s*:\s*italic;?/i.test(style))
                    return a.tagName = "em", void a.setAttr("style", style.replace(/font-style\s*:\s*italic;?/i, ""));
                if (/font-weight\s*:\s*(\d+);?/i.test(style) && 1 * RegExp.$1 >= 700)
                    return a.tagName = "strong", void a.setAttr("style", style.replace(/font-weight\s*:\s*(\d+);?/i, ""))
            }
        }
        var h = this, i = UE.utils;
        h.addWkInputRule(function(h) {
            "element" == h.type && (d(h), c(h), e(h), "span" == h.tagName && b(h), f(h), g(h), 1 === a(h))
        });
        var j = {61550: "●",61548: "■",61557: "◆",61618: "◇",61692: "√"}
    }, function() {
        function a(a) {
            var c = a[j.tagName], d = a[j.className], i = a[j.children], k = arguments.callee, l = null;
            if (!b(c)) {
                if (h)
                    throw new Error("Illegal tag, tag name is: " + c);
                return null
            }
            if (l = new f({type: "element",children: [],tagName: c}), d && l.setAttr("class", g.isArray(d) ? d.join(" ") : d), e(l, a), i)
                if (g.isArray(i))
                    $.each(i, function(a, b) {
                        var c = k(b);
                        c && l.appendChild(c)
                    });
                else if (g.isString(i))
                    l.appendChild(new f({type: "text",data: g.unhtml(i || "")}));
                else {
                    if (!g.isObject(i))
                        throw new Error("unkonw child type");
                    var m = k(i);
                    m && l.appendChild(m)
                }
            return l
        }
        function b(a) {
            return a in i
        }
        function c(a, b, d) {
            var e, f, h, i, j = [], k = [], l = [];
            if (e = a.getAttr("class"), e = e ? g.trim(e).split(/\s+/) : [], e && e.length) {
                for (e = e.reverse(), f = 0; f < e.length; f++) {
                    var m = e[f];
                    m in b ? "s_" == m.substr(0, 2) ? k.push(b[m]) : l.push(b[m]) : j.push(m)
                }
                h = (k.join(";") + ";").replace(/(^;)/, "").replace(/;{2,}/g, ";"), i = (l.join(";") + ";").replace(/(^;)/, "").replace(/;{2,}/g, ";"), (h || i) && a.setAttr("style", h + i), j.length ? a.setAttr("class", j.join(" ")) : a.setAttr("class")
            }
            if ("element" == a.type)
                for (f = 0; f < a.children.length; f++)
                    c(a.children[f], b, d)
        }
        function d(a) {
            var b = {};
            return g.each(a, function(a, c) {
                var d = [];
                g.each(a, function(a, b) {
                    /[\d\.]+px/.test(a) && (a = a.replace(/[\d]+\.[\d]*px/g, function(a) {
                        return parseInt(a) + "px"
                    })), d.push(g.trim("" + b) + ":" + g.trim("" + a))
                }), b[c] = (d.join(";") + ";").replace(/(^;)/, "").replace(/;{2,}/g, ";")
            }), b
        }
        function e(a, b) {
            var c = i[a.tagName], d = c.__trans;
            g.each(b, function(e, f) {
                if (0 !== f.indexOf("__")) {
                    if (d && d[f]) {
                        var g = b[f];
                        delete b[f], f = d[f], b[f] = g, g = null
                    }
                    c[f] && a.setAttr(f, b[f] + "")
                }
            })
        }
        var f = UE.uNode, g = UE.utils, h = !1, i = UE._wk_whitelist, j = {tagName: "t",className: "r",children: "c"};
        UE.parseDoc = function(b) {
            var e, h, i = [], j = "";
            if (b) {
                b = g.isArray(b) ? b : [b], h = new f({children: [],type: "root"});
                for (var k = 0; k < b.length; k++)
                    e = a(b[k]), c(e, d(b[k].style), b[k].baseStyle), h.appendChild(e), i.push(e.toHtml());
                j = i.join("")
            } else
                alert("文档解析出错");
            return {html: j,node: h}
        }
    }()
}();
