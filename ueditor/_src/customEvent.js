/**
 * @file
 * @name 编辑器事件接口
 * @short Custom events
 * @des 本文件非编辑器核心文件，仅适用于生成对应的事件接口文档
 * UEditor编辑器中的所有事件监听和触发都统一采用
 * ''editor''是编辑器实例
 * editor.addListener("eventName",handler) 和 editor.fireEvent("eventName")方式调用，支持浏览器原生事件，如keydown,keyup,mousedown,mouseup等
 */
/**
 * 编辑器加载完成事件（核心），在编辑器准备好所有运行条件时触发，大部分场景可以使用editor.ready(fn)取代。
 * @name ready
 * @grammar editor.addListener("ready",fn)
 * @example
 * editor.addListener("ready",function(){
 *     //this为editor实例
 *     this.setContent("欢迎使用UEditor！");
 * })
 * //同如下接口方式调用
 * editor.ready(function(){
 *     this.setContent("欢迎使用UEditor！");
 * })
 */
/**
 * 选区变化事件（核心），当选区出现变化时触发。
 * 在UEditor中，任何涉及到光标改变的操作都会触发选区变化事件，该事件主要用来实现工具栏状态反射。
 * @name selectionChange
 * @grammar editor.addListener("selectionChange",fn)
 * @grammar editor.fireEvent("selectionChange")
 * @example
 * editor.addListener("selectionChange",function(){
 *     //this为editor实例
 * })
 */

/**
 * 内容变化事件（核心），当编辑区域中的文本内容出现变化时触发
 * @name contentChange
 * @grammar editor.addListener("contentChange",fn)
 * @grammar editor.fireEvent("contentChange")
 */

/**
 * 粘贴事件（核心），当使用ctr+v快捷键粘贴(包括Chrome、FF浏览器的右键粘贴)时会触发本事件
 * @name (before|after)Paste
 * @grammar editor.addListener("beforePaste",fn)
 * @desc
 * * beforePaste 在将粘贴的内容写到编辑器之前触发，这个事件触发时，粘贴的内容还未在编辑器内显示
 * * afterPaste 粘贴的内容已经写到编辑器里边后触发
 * @example
 * editor.addListener("beforePaste",function(type,data){
 *     //beforePaste事件监听区别于afterPaste事件监听最主要的一个方面是存在一个data参数，
 *     //该data参数是一个对象，包含属性html。
 *     //若用户在此处更改该html的值时，将会影响粘贴到编辑器中的内容,主要用于粘贴时需要特殊处理的一些场景。
 *     console.log(this.getContent) //this都是当前编辑器的实例
 *     //before事件才用这个参数，用来在写出编辑器之前对粘贴进来的内容进行最后的修改
 *     data.html = "我把粘贴内容改成了这句话";
 * })
 */

/**
 * 设置内容事件（核心），当调用setContent方法时触发
 * @name (before|after)SetContent
 * @grammar editor.addListener("beforeSetContent",fn)
 * @desc
 * * beforeSetContent 在内容写到编辑器之前触发
 * * afterSetContent 内容已经写到编辑器里边后触发
 * @example
 * editor.addListener("beforeSetContent",function(type,data){
 *     //beforeSetContent事件监听区别于afterSetContent事件监听最主要的一个方面是存在一个data参数，
 *     //该data参数是一个对象，包含属性html。
 *     //若用户在此处更改该html的值时，将会影响设置到编辑器中的内容,主要用于设置内容时需要特殊处理的一些场景。
 *     data.html = "我把设置内容改成了这句话";
 * })
 */

/**
 * getAllHtml事件，当调用getAllHtml方法时触发
 * @name getAllHtml
 * @grammar editor.addListener("getAllHtml",fn)
 * @desc
 * * 主要用来对于生成的整个html代码中的head内容进行定制，比如你想插入你自己的样式，script标签等，用来在展示时使用
 * @example
 * editor.addListener("getAllHtml",function(type,data){
 *     //data是document中head部分html的封装，可通过data.html来获取对应字符串。
 *     //需要修改的话得重新赋值data.html = '<style type="text/css"> body{margin:0;}</style>';
 * })
 */

/**
 * 内容提交事件(插件)，当内容提交插件加载并调用了autosubmit命令时触发，多用于提交之前的验证
 * @name beforeSubmit
 * @grammar editor.addListener("beforeSubmit",fn)   //若fn返回false，则阻止本次提交
 * @example
 * editor.addListener("beforeSubmit",function(){
 *     if(!editor.hasContents()){
 *         return false;
 *     }
 * })
 */

/**
 * 如果抓取远程的图片失败了，就触发
 * @name catchRemoteError
 * @grammar editor.addListener("catchRemoteError",fn)
 * @example
 * editor.addListener("catchRemoteError",function(){
 *     console.log("抓取失败了！")
 * })
 */

/**
 * 当抓取远程的图片成功并会返回生成图片的链接时触发
 * @name catchRemoterSuccess
 * @grammar editor.addListener("catchRemoterSuccess",fn)
 * @example
 * editor.addListener("catchRemoterSuccess",function(){
 *     console.log("抓取成功")
 * })
 */

/**
 * 编辑模式切换事件（插件），当源码模式和富文本模式发生切换时触发事件
 * @name sourceModeChanged
 * @grammar  editor.addListener("sourceModeChanged",fn)
 * @example
 * editor.addListener("sourceModeChanged",function(type,mode){
 *     //mode代表了当前的编辑模式，true代表切换到了源码模式，false代表切换到了富文本模式
 * })
 */

/**
 * 全屏切换事件（插件），当执行全屏切换的时候触发事件
 * @name fullScreenChanged
 * @grammar  editor.addListener("fullScreenChanged",fn)
 * @example
 * editor.addListener("fullScreenChanged",function(type,mode){
 *     //mode代表当前是否全屏，true代表切换到了全屏模式，false代表切换到了普通模式
 * })
 */

/**
 * 字数超出限制事件（插件），当输入的字符数超出配置项配置时触发
 * @name wordCountOverflow
 * @grammar editor.addListener("wordCountOverflow",fn)
 * @example
 * editor.addListener("wordCountOverflow",function(type,length){
 *     console.log(length)
 * })
 */

