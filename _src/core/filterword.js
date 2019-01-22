/**
 * UE过滤word的静态方法
 * @file
 */

/**
 * UEditor公用空间，UEditor所有的功能都挂载在该空间下
 * @module UE
 */

/**
 * 根据传入html字符串过滤word
 * @module UE
 * @since 1.2.6.1
 * @method filterWord
 * @param { String } html html字符串
 * @return { String } 已过滤后的结果字符串
 * @example
 * ```javascript
 * UE.filterWord(html);
 * ```
 */
var filterWord = (UE.filterWord = (function() {
  //是否是word过来的内容
  function isWordDocument(str) {
    return /(class="?Mso|style="[^"]*\bmso\-|w:WordDocument|<(v|o):|lang=)/gi.test(
      str
    );
  }
  //去掉小数
  function transUnit(v) {
    v = v.replace(/[\d.]+\w+/g, function(m) {
      return utils.transUnitToPx(m);
    });
    return v;
  }

  function filterPasteWord(str) {
    return (
      str
        .replace(/[\t\r\n]+/g, " ")
        .replace(/<!--[\s\S]*?-->/gi, "")
        //转换图片
        .replace(/<v:shape [^>]*>[\s\S]*?.<\/v:shape>/gi, function(str) {
          //opera能自己解析出image所这里直接返回空
          if (browser.opera) {
            return "";
          }
          try {
            //有可能是bitmap占为图，无用，直接过滤掉，主要体现在粘贴excel表格中
            if (/Bitmap/i.test(str)) {
              return "";
            }
            var width = str.match(/width:([ \d.]*p[tx])/i)[1],
              height = str.match(/height:([ \d.]*p[tx])/i)[1],
              src = str.match(/src=\s*"([^"]*)"/i)[1];
            return (
              '<img width="' +
              transUnit(width) +
              '" height="' +
              transUnit(height) +
              '" src="' +
              src +
              '" />'
            );
          } catch (e) {
            return "";
          }
        })
        //针对wps添加的多余标签处理
        .replace(/<\/?div[^>]*>/g, "")
        //去掉多余的属性
        .replace(/v:\w+=(["']?)[^'"]+\1/g, "")
        .replace(
          /<(!|script[^>]*>.*?<\/script(?=[>\s])|\/?(\?xml(:\w+)?|xml|meta|link|style|\w+:\w+)(?=[\s\/>]))[^>]*>/gi,
          ""
        )
        .replace(
          /<p [^>]*class="?MsoHeading"?[^>]*>(.*?)<\/p>/gi,
          "<p><strong>$1</strong></p>"
        )
        //去掉多余的属性
        .replace(/\s+(class|lang|align)\s*=\s*(['"]?)([\w-]+)\2/gi, function(
          str,
          name,
          marks,
          val
        ) {
          //保留list的标示
          return name == "class" && val == "MsoListParagraph" ? str : "";
        })
        //清除多余的font/span不能匹配&nbsp;有可能是空格
        .replace(/<(font|span)[^>]*>(\s*)<\/\1>/gi, function(a, b, c) {
          return c.replace(/[\t\r\n ]+/g, " ");
        })
        //处理style的问题
        .replace(/(<[a-z][^>]*)\sstyle=(["'])([^\2]*?)\2/gi, function(
          str,
          tag,
          tmp,
          style
        ) {
          var n = [],
            s = style
              .replace(/^\s+|\s+$/, "")
              .replace(/&#39;/g, "'")
              .replace(/&quot;/gi, "'")
              .replace(/[\d.]+(cm|pt)/g, function(str) {
                return utils.transUnitToPx(str);
              })
              .split(/;\s*/g);

          for (var i = 0, v; (v = s[i]); i++) {
            var name,
              value,
              parts = v.split(":");

            if (parts.length == 2) {
              name = parts[0].toLowerCase();
              value = parts[1].toLowerCase();
              if (
                (/^(background)\w*/.test(name) &&
                  value.replace(/(initial|\s)/g, "").length == 0) ||
                (/^(margin)\w*/.test(name) && /^0\w+$/.test(value))
              ) {
                continue;
              }

              switch (name) {
                case "mso-padding-alt":
                case "mso-padding-top-alt":
                case "mso-padding-right-alt":
                case "mso-padding-bottom-alt":
                case "mso-padding-left-alt":
                case "mso-margin-alt":
                case "mso-margin-top-alt":
                case "mso-margin-right-alt":
                case "mso-margin-bottom-alt":
                case "mso-margin-left-alt":
                //ie下会出现挤到一起的情况
                //case "mso-table-layout-alt":
                case "mso-height":
                case "mso-width":
                case "mso-vertical-align-alt":
                  //trace:1819 ff下会解析出padding在table上
                  if (!/<table/.test(tag))
                    n[i] =
                      name.replace(/^mso-|-alt$/g, "") + ":" + transUnit(value);
                  continue;
                case "horiz-align":
                  n[i] = "text-align:" + value;
                  continue;

                case "vert-align":
                  n[i] = "vertical-align:" + value;
                  continue;

                case "font-color":
                case "mso-foreground":
                  n[i] = "color:" + value;
                  continue;

                case "mso-background":
                case "mso-highlight":
                  n[i] = "background:" + value;
                  continue;

                case "mso-default-height":
                  n[i] = "min-height:" + transUnit(value);
                  continue;

                case "mso-default-width":
                  n[i] = "min-width:" + transUnit(value);
                  continue;

                case "mso-padding-between-alt":
                  n[i] =
                    "border-collapse:separate;border-spacing:" +
                    transUnit(value);
                  continue;

                case "text-line-through":
                  if (value == "single" || value == "double") {
                    n[i] = "text-decoration:line-through";
                  }
                  continue;
                case "mso-zero-height":
                  if (value == "yes") {
                    n[i] = "display:none";
                  }
                  continue;
                //                                case 'background':
                //                                    break;
                case "margin":
                  if (!/[1-9]/.test(value)) {
                    continue;
                  }
              }

              if (
                /^(mso|column|font-emph|lang|layout|line-break|list-image|nav|panose|punct|row|ruby|sep|size|src|tab-|table-border|text-(?:decor|trans)|top-bar|version|vnd|word-break)/.test(
                  name
                ) ||
                (/text\-indent|padding|margin/.test(name) &&
                  /\-[\d.]+/.test(value))
              ) {
                continue;
              }

              n[i] = name + ":" + parts[1];
            }
          }
          return (
            tag +
            (n.length
              ? ' style="' + n.join(";").replace(/;{2,}/g, ";") + '"'
              : "")
          );
        })
    );
  }

  return function(html) {
    return isWordDocument(html) ? filterPasteWord(html) : html;
  };
})());
