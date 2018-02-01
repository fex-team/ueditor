/**
 * @description
 * 1.拖放文件到编辑区域，自动上传并插入到选区
 * 2.插入粘贴板的图片，自动上传并插入到选区
 * @author Jinqn
 * @date 2013-10-14
 */
UE.plugin.register("autoupload", function() {
  function sendAndInsertFile(file, editor) {
    var me = editor;
    //模拟数据
    var urlPrefix,
      maxSize,
      allowFiles,
      loadingHtml,
      errorHandler,
      successHandler,
      filetype = /image\/\w+/i.test(file.type) ? "image" : "file",
      loadingId = "loading_" + (+new Date()).toString(36);

    urlPrefix = me.getOpt(filetype + "UrlPrefix");
    maxSize = me.getOpt(filetype + "MaxSize");
    allowFiles = me.getOpt(filetype + "AllowFiles");

    if (filetype == "image") {
      loadingHtml =
        '<img class="loadingclass" id="' +
        loadingId +
        '" src="' +
        me.options.themePath +
        me.options.theme +
        '/images/spacer.png">';
      successHandler = function(data) {
        var imgUrlPrefix = 'api/material/image/view/';
        var link = imgUrlPrefix + data.added.id;
        var loader = me.document.getElementById(loadingId);
        if (loader) {
          domUtils.removeClasses(loader, "loadingclass");
          loader.setAttribute("src", link);
          loader.setAttribute("_src", link);
          loader.removeAttribute("id");
          loader.setAttribute("class", "nfw-cms-img");
          loader.setAttribute("img-id", "" + data.added.id);
          me.trigger("contentchange", loader);
        }
      };
      errorHandler = function() {
        var loader = me.document.getElementById(loadingId);
        var failIMG = me.options.themePath + me.options.theme + '/images/img-cracked.png';
        if (loader) {
          domUtils.removeClasses(loader, "loadingclass");
          loader.setAttribute("src", failIMG);
          loader.setAttribute("_src", link);
          loader.setAttribute("img_catchFail", 'img_catchFail');
          loader.removeAttribute("id");
          me.trigger("contentchange", loader);
        }
        window.injection.notify.normalNotify({tpl: 'warn', text: '自动转存图片失败'});
      };
    } else {
      loadingHtml =
        "<p>" +
        '<img class="loadingclass" id="' +
        loadingId +
        '" src="' +
        me.options.themePath +
        me.options.theme +
        '/images/spacer.gif">' +
        "</p>";
      successHandler = function(data) {
        var link = urlPrefix + data.url,
          loader = me.document.getElementById(loadingId);

        var rng = me.selection.getRange(),
          bk = rng.createBookmark();
        rng.selectNode(loader).select();
        me.execCommand("insertfile", { url: link });
        rng.moveToBookmark(bk).select();
      };
      errorHandler = function(title) {
        var loader = me.document.getElementById(loadingId);
        loader && domUtils.remove(loader);
        me.fireEvent("showmessage", {
          id: loadingId,
          content: title,
          type: "error",
          timeout: 4000
        });
      };
    }

    /* 插入loading的占位符 */
    me.execCommand("inserthtml", loadingHtml);
    /* 判断文件大小是否超出限制 */
    if (file.size > maxSize) {
      errorHandler(me.getLang("autoupload.exceedSizeError"));
      return;
    }
    /* 判断文件格式是否超出允许 */
    var fileext = file.name ? file.name.substr(file.name.lastIndexOf(".")) : "";
    if (
      (fileext && filetype != "image") ||
      (allowFiles &&
        (allowFiles.join("") + ".").indexOf(fileext.toLowerCase() + ".") == -1)
    ) {
      errorHandler(me.getLang("autoupload.exceedTypeError"));
      return;
    }

    window.injection.api('/material/collection/list').then(function(data){
      try {
        var collectionId = data.collections.private[0].id;
        if (collectionId) {
          var fd = new FormData();
          fd.append('image', file)
          fd.append('name', '自动转存图片')
          fd.append('collection', collectionId)

          window.injection.api('/material/image/uploadFile', fd).then(function(data){
              successHandler(data)
          }, function(err){
              errorHandler();
          });

        } else {
          errorHandler();
        }
      } catch (er) {
        errorHandler();
      }
    }, function(err){
        errorHandler();
    });
  }

  function getPasteImage(e) {
    return e.clipboardData &&
      e.clipboardData.items &&
      e.clipboardData.items.length == 1 &&
      /^image\//.test(e.clipboardData.items[0].type)
      ? e.clipboardData.items
      : null;
  }
  function getDropImage(e) {
    return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
  }

  return {
    outputRule: function(root) {
      utils.each(root.getNodesByTagName("img"), function(n) {
        if (/\b(loaderrorclass)|(bloaderrorclass)\b/.test(n.getAttr("class"))) {
          n.parentNode.removeChild(n);
        }
      });
      utils.each(root.getNodesByTagName("p"), function(n) {
        if (/\bloadpara\b/.test(n.getAttr("class"))) {
          n.parentNode.removeChild(n);
        }
      });
    },
    bindEvents: {
      defaultOptions: {
        //默认间隔时间
        enableDragUpload: true,
        enablePasteUpload: true
      },
      //插入粘贴板的图片，拖放插入图片
      ready: function(e) {
        var me = this;
        if (window.FormData && window.FileReader) {
          var handler = function(e) {
            var hasImg = false,
              items;
            //获取粘贴板文件列表或者拖放文件列表
            items = e.type == "paste" ? getPasteImage(e) : getDropImage(e);
            if (items) {
              var len = items.length,
                file;
              while (len--) {
                file = items[len];
                if (file.getAsFile) {
                  file = file.getAsFile();
                }
                if (file && file.size > 0) {
                  sendAndInsertFile(file, me);
                  hasImg = true;
                }
              }
              hasImg && e.preventDefault();
            }
          };

          if (me.getOpt("enablePasteUpload") !== false) {
            domUtils.on(me.body, "paste ", handler);
          }
          if (me.getOpt("enableDragUpload") !== false) {
            domUtils.on(me.body, "drop", handler);
            //取消拖放图片时出现的文字光标位置提示
            domUtils.on(me.body, "dragover", function(e) {
              if (e.dataTransfer.types[0] == "Files") {
                e.preventDefault();
              }
            });
          } else {
            if (browser.gecko) {
              domUtils.on(me.body, "drop", function(e) {
                if (getDropImage(e)) {
                  e.preventDefault();
                }
              });
            }
          }

          //设置loading的样式
          utils.cssRule(
            "loading",
            ".loadingclass{display:inline-block;cursor:default;background: url('" +
              this.options.themePath +
              this.options.theme +
              "/images/loading.gif') no-repeat center center transparent;border:1px solid #cccccc;margin:0 atuo;width: 200px;}\n" +
              ".loaderrorclass{display:inline-block;cursor:default;background: url('" +
              this.options.themePath +
              this.options.theme +
              "/images/loaderror.png') no-repeat center center transparent;border:1px solid #cccccc;margin-right:1px;height: 22px;width: 22px;" +
              "}",
            this.document
          );
        }
      }
    }
  };
});
