/**
 * 百度应用
 * @file
 * @since 1.2.6.1
 */

/**
 * 插入百度应用
 * @command webapp
 * @method execCommand
 * @remind 需要百度APPKey
 * @remind 百度应用主页： <a href="http://app.baidu.com/" target="_blank">http://app.baidu.com/</a>
 * @param { Object } appOptions 应用所需的参数项， 支持的key有： title=>应用标题， width=>应用容器宽度，
 * height=>应用容器高度，logo=>应用logo，url=>应用地址
 * @example
 * ```javascript
 * //editor是编辑器实例
 * //在编辑器里插入一个“植物大战僵尸”的APP
 * editor.execCommand( 'webapp' , {
 *     title: '植物大战僵尸',
 *     width: 560,
 *     height: 465,
 *     logo: '应用展示的图片',
 *     url: '百度应用的地址'
 * } );
 * ```
 */

//UE.plugins['webapp'] = function () {
//    var me = this;
//    function createInsertStr( obj, toIframe, addParagraph ) {
//        return !toIframe ?
//                (addParagraph ? '<p>' : '') + '<img title="'+obj.title+'" width="' + obj.width + '" height="' + obj.height + '"' +
//                        ' src="' + me.options.UEDITOR_HOME_URL + 'themes/default/images/spacer.gif" style="background:url(' + obj.logo+') no-repeat center center; border:1px solid gray;" class="edui-faked-webapp" _url="' + obj.url + '" />' +
//                        (addParagraph ? '</p>' : '')
//                :
//                '<iframe class="edui-faked-webapp" title="'+obj.title+'" width="' + obj.width + '" height="' + obj.height + '"  scrolling="no" frameborder="0" src="' + obj.url + '" logo_url = '+obj.logo+'></iframe>';
//    }
//
//    function switchImgAndIframe( img2frame ) {
//        var tmpdiv,
//                nodes = domUtils.getElementsByTagName( me.document, !img2frame ? "iframe" : "img" );
//        for ( var i = 0, node; node = nodes[i++]; ) {
//            if ( node.className != "edui-faked-webapp" ){
//                continue;
//            }
//            tmpdiv = me.document.createElement( "div" );
//            tmpdiv.innerHTML = createInsertStr( img2frame ? {url:node.getAttribute( "_url" ), width:node.width, height:node.height,title:node.title,logo:node.style.backgroundImage.replace("url(","").replace(")","")} : {url:node.getAttribute( "src", 2 ),title:node.title, width:node.width, height:node.height,logo:node.getAttribute("logo_url")}, img2frame ? true : false,false );
//            node.parentNode.replaceChild( tmpdiv.firstChild, node );
//        }
//    }
//
//    me.addListener( "beforegetcontent", function () {
//        switchImgAndIframe( true );
//    } );
//    me.addListener( 'aftersetcontent', function () {
//        switchImgAndIframe( false );
//    } );
//    me.addListener( 'aftergetcontent', function ( cmdName ) {
//        if ( cmdName == 'aftergetcontent' && me.queryCommandState( 'source' ) ){
//            return;
//        }
//        switchImgAndIframe( false );
//    } );
//
//    me.commands['webapp'] = {
//        execCommand:function ( cmd, obj ) {
//            me.execCommand( "inserthtml", createInsertStr( obj, false,true ) );
//        }
//    };
//};

UE.plugin.register("webapp", function() {
  var me = this;
  function createInsertStr(obj, toEmbed) {
    return !toEmbed
      ? '<img title="' +
          obj.title +
          '" width="' +
          obj.width +
          '" height="' +
          obj.height +
          '"' +
          ' src="' +
          me.options.UEDITOR_HOME_URL +
          'themes/default/images/spacer.gif" _logo_url="' +
          obj.logo +
          '" style="background:url(' +
          obj.logo +
          ') no-repeat center center; border:1px solid gray;" class="edui-faked-webapp" _url="' +
          obj.url +
          '" ' +
          (obj.align && !obj.cssfloat ? 'align="' + obj.align + '"' : "") +
          (obj.cssfloat ? 'style="float:' + obj.cssfloat + '"' : "") +
          "/>"
      : '<iframe class="edui-faked-webapp" title="' +
          obj.title +
          '" ' +
          (obj.align && !obj.cssfloat ? 'align="' + obj.align + '"' : "") +
          (obj.cssfloat ? 'style="float:' + obj.cssfloat + '"' : "") +
          'width="' +
          obj.width +
          '" height="' +
          obj.height +
          '"  scrolling="no" frameborder="0" src="' +
          obj.url +
          '" logo_url = "' +
          obj.logo +
          '"></iframe>';
  }
  return {
    outputRule: function(root) {
      utils.each(root.getNodesByTagName("img"), function(node) {
        var html;
        if (node.getAttr("class") == "edui-faked-webapp") {
          html = createInsertStr(
            {
              title: node.getAttr("title"),
              width: node.getAttr("width"),
              height: node.getAttr("height"),
              align: node.getAttr("align"),
              cssfloat: node.getStyle("float"),
              url: node.getAttr("_url"),
              logo: node.getAttr("_logo_url")
            },
            true
          );
          var embed = UE.uNode.createElement(html);
          node.parentNode.replaceChild(embed, node);
        }
      });
    },
    inputRule: function(root) {
      utils.each(root.getNodesByTagName("iframe"), function(node) {
        if (node.getAttr("class") == "edui-faked-webapp") {
          var img = UE.uNode.createElement(
            createInsertStr({
              title: node.getAttr("title"),
              width: node.getAttr("width"),
              height: node.getAttr("height"),
              align: node.getAttr("align"),
              cssfloat: node.getStyle("float"),
              url: node.getAttr("src"),
              logo: node.getAttr("logo_url")
            })
          );
          node.parentNode.replaceChild(img, node);
        }
      });
    },
    commands: {
      /**
             * 插入百度应用
             * @command webapp
             * @method execCommand
             * @remind 需要百度APPKey
             * @remind 百度应用主页： <a href="http://app.baidu.com/" target="_blank">http://app.baidu.com/</a>
             * @param { Object } appOptions 应用所需的参数项， 支持的key有： title=>应用标题， width=>应用容器宽度，
             * height=>应用容器高度，logo=>应用logo，url=>应用地址
             * @example
             * ```javascript
             * //editor是编辑器实例
             * //在编辑器里插入一个“植物大战僵尸”的APP
             * editor.execCommand( 'webapp' , {
             *     title: '植物大战僵尸',
             *     width: 560,
             *     height: 465,
             *     logo: '应用展示的图片',
             *     url: '百度应用的地址'
             * } );
             * ```
             */
      webapp: {
        execCommand: function(cmd, obj) {
          var me = this,
            str = createInsertStr(
              utils.extend(obj, {
                align: "none"
              }),
              false
            );
          me.execCommand("inserthtml", str);
        },
        queryCommandState: function() {
          var me = this,
            img = me.selection.getRange().getClosedNode(),
            flag = img && img.className == "edui-faked-webapp";
          return flag ? 1 : 0;
        }
      }
    }
  };
});
