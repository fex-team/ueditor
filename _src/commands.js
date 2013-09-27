//本文件非编辑器核心文件，仅适用于生成对应的命令接口文档
/**
 * @file
 * @name 编辑器命令接口
 * @short Commands
 * @desc
 *
 * UEditor中执行命令的统一调用格式为
 * <code>editor.execCommand("cmdName"[,opt]);</code>
 *
 *
 * 检测当前命令是否可用的方法是
 * <code>editor.queryCommandState("cmdName");</code>
 *
 *
 * 部分命令可以返回命令值，其格式为
 * <code>editor.queryCommandValue("cmdName");</code>
 */
/**
 * 插入锚点
 * @name anchor
 * @grammar editor.execCommand("anchor","name"); //锚点的名字
 */
/**
 * 为当前选中文字添加粗体效果
 * @name bold
 * @grammar editor.execCommand("bold");
 */
/**
 * 为当前选中文字添加斜体效果
 * @name italic
 * @grammar editor.execCommand("italic");
 */
/**
 * 为当前选中文字添加下划线效果
 * @name underline
 * @grammar editor.execCommand("underline");
 */


/**
 * 为当前选中文字添加删除线效果
 * @name strikethrough
 * @grammar editor.execCommand("strikethrough");
 */
/**
 * 将当前选中文字转换成上标
 * @name superscript
 * @grammar editor.execCommand("superscript");
 */
/**
 * 将当前选中文字转换成下标
 * @name subscript
 * @grammar editor.execCommand("subscript");
 */
/**
 * 为当前选中文字添加颜色
 * @name foreColor
 * @grammar editor.execCommand("foreColor","#ffffff");
 */
/**
 * 为当前选中文字添加背景颜色
 * @name backColor
 * @grammar editor.execCommand("backColor","#dddddd");
 */
/**
 * 设置当前选中文字的字体
 * @name fontFamily
 * @grammar editor.execCommand("fontFamily","微软雅黑,Microsoft YaHei");
 */
/**
 * 设置当前选中文字的字号
 * @name fontSize
 * @grammar editor.execCommand("fontSize","32px");
 */
/**
 * 设置当前选区的段落格式,如p,h1,h2,h3,...
 * @name paragraph
 * @grammar editor.execCommand("paragraph","h1");
 */
/**
 * 将当前选区变换成有序或者无序列表
 * @name insert(Un)OrderedList
 * @grammar editor.execCommand("insertOrderedList");
 */
/**
 * 设置当前选区的行间距
 * @name lineHeight
 * @grammar editor.execCommand("lineHeight");
 */
/**
 * 设置当前选区中的字体对齐方式
 * @name justify
 * @grammar editor.execCommand("justify",align);  //align可为Left，Right，Center，Justify
 */
/**
 * 将当前选中文字中的字母转换成大写
 * @name toUppercase
 * @grammar editor.execCommand("toUppercase");
 */
/**
 * 将当前选中文字中的字母转换成小写
 * @name toLowercase
 * @grammar editor.execCommand("toLowercase");
 */
/**
 * 为当前选区所在的块级元素添加引用标记
 * @name blockquote
 * @grammar editor.execCommand("blockquote");
 */
/**
 * 设置当前选区所在块级元素的文字输入方向
 * @name directionality
 * @grammar editor.execCommand("directionality",dir);  //dir可为LTR,RTL
 */
/**
 * 清除当前选中文字上的所有样式或者指定样式
 * @name removeFormat
 * @grammar editor.execCommand("removeFormat")   //根据ueditor.config.js里的removeFormatTags，removeFormatAttributes两个属性作为规则
 * @grammar editor.execCommand("removeFormat",tags,style);   //清除指定tags上的指定style
 * @example
 * editor.execCommand("removeFormat",'span,a','color,background-color')
 */
/**
 * 切换纯文本粘贴模式
 * @name pastePlain
 * @grammar ue.execCommand("pastePlain");
 */
/**
 * 开启格式刷功能
 * @name formatMatch
 * @grammar editor.execCommand("formatMatch");
 */
/**
 * 清空文档
 * @name clearDoc
 * @grammar editor.execCommand("clearDoc");
 */
/**
 * 删除当前选中文本
 * @name delete
 * @grammar editor.execCommand("delete");
 */
/**
 * 全部选择
 * @name selectAll
 * @grammar editor.execCommand("selectAll");
 */
/**
 * 撤销操作
 * @name undo
 * @grammar editor.execCommand("undo");
 */
/**
 * 恢复操作
 * @name redo
 * @grammar editor.execCommand("redo");
 */
/**
 * 对整个编辑文档进行自动排版
 * @name autoTypeset
 * @grammar editor.execCommand("autoTypeset");
 */
/**
 * 在当前选区位置插入一段html代码，最基本功能。大部分其他插入命令都会调用此命令完成最后的插入
 * @name insertHtml
 * @grammar editor.execCommand("insertHtml","欢迎使用UEditor！")
 */
/**
 * 在当前选区位置插入一个超链接
 * @name link
 * @grammar editor.execCommand("link",linkObj);
 * @example
 * editor.execCommand("link",{
 *     href: "http://ueditor.baidu.com",         //超链地址，必选
 *     _src: "http://ueditor.baidu.com",  //UE内部使用参数，与href保持一致即可，可选
 *     target: "_self",                          //目标窗口，可选
 *     textValue: "UEditor",                     //链接显示文本，可选
 *     title: "百度开源富文本编辑器UEditor官网"     //标题，可选
 * })
 */
/**
 * 在当前选区位置插入一个图片
 * @name insertImage
 * @grammar editor.execCommand("insertImage",imageObj);
 * @example
 * editor.execCommand("insertImage",{
 *     src: "http://ueditor.baidu.com/logo.jpg",          //图片链接地址,必选
 *     _src: "http://ueditor.baidu.com/logo.jpg",  //UE内部使用参数，与src保持一致即可，可选
 *     width: 300,                                        //图片显示宽度，可选
 *     height: 400,                                       //图片显示高度，可选
 *     border: 2,                                         //图片边框，可选
 *     hspace: 5,                                         //图片左右边距，可选
 *     vspace: 2,                                         //图片上下边距，可选
 *     alt: 'UEditor-logo',                               //图片替换文字，可选
 *     title: "百度开源富文本编辑器UEditor官网"             //图片标题，可选
 * })
 */
/**
 * 在当前选区位置插入一个视频
 * @name insertVideo
 * @grammar editor.execCommand("insertVideo",videoObj);
 * @example
 * editor.execCommand("insertVideo",{
 *     url: "http://youku.com/id?id=1233122",   //视频地址，必选
 *     width: 420,                              //视频宽度，可选
 *     height: 280,                             //视频高度，可选
 *     align: "none"                            //对齐方式，支持right，left，center，none ，可选
 * })
 */
/**
 * 在当前选区位置插入一个日期或者时间
 * @name date|time
 * @grammar editor.execCommand("date");
 */
/**
 * 在当前选区位置插入一个分页符标记
 * @name pageBreak
 * @grammar editor.execCommand("pageBreak");
 */
/**
 * 切换源码编辑模式和富文本编辑模式
 * @name source
 * @grammar editor.execCommand("source");
 */
/**
 * IE下进入截屏模式
 * @name snapScreen
 * @grammar editor.execCommand("snapScreen");
 */
/**
 * 插入表格
 * @name insertTable
 * @grammar editor.execCommand("insertTable",rows,cols);
 */

/**
 * 查找替换
 * @name searchreplace
 * @grammar editor.execCommand("searchreplace",opt);
 * @desc
 * opt是个json对象,属性如下
 * * ''all'' true表示查找整个文档，false表示从上次的位置开始查找,默认是false
 * * ''casesensitive'' 大小写铭感，true是铭感,默认是false
 * * ''dir'' 1表示从前往后查，－1表示从后往前
 * * ''searchStr'' 查找的字符串
 * * ''replaceStr'' 替换用的字符串
 */









