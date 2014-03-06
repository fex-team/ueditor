UEditor
======

**UEditor富文本编辑器**

UEditor是由百度web前端研发部开发所见即所得富文本web编辑器，具有轻量，可定制，注重用户体验等特点，开源基于MIT协议，允许自由使用和修改代码。

## 入门部署和体验 ##

### 第一步：下载编辑器 ###

到官网下载ueditor最新版: [[官网地址]](http://ueditor.baidu.com/website/download.html#ueditor "官网地址") [[1.3.5下载地址]](http://ueditor.baidu.com/build/build_down.php?t=1_3_5-src)

### 第二步：创建demo文件 ###
解压下载的包，在解压后的目录创建demo.html文件，填入下面的html代码

```html
<!DOCTYPE HTML>
<html lang="en-US">
<head>
	<meta charset="UTF-8">
	<title>ueditor demo</title>
</head>
<body>
	<!-- 加载编辑器的容器 -->
	<script id="container" name="content" type="text/plain">这里写你的初始化内容</script>
	<!-- 配置文件 -->
	<script type="text/javascript" src="ueditor.config.js"></script>
	<!-- 编辑器源码文件 -->
	<script type="text/javascript" src="ueditor.all.js"></script>
	<!-- 实例化编辑器 -->
	<script type="text/javascript">
	    var editor = UE.getEditor('container');
	</script>
</body>
</html>
```

### 第三步：在浏览器打开demo.html ###

如果看到了下面这样的编辑器，恭喜你，初次部署成功！

![部署成功](http://www.ueditorbbs.com/data/attachment/forum/201311/01/180213cop7scr30s3p9wc0.png)

## 更多使用文档 ##

1. [部署编辑器](_doc/部署编辑器.md "部署编辑器")

2. [提交表单并展示内容](_doc/提交表单并展示内容.md "提交表单并展示内容")

3. [部署编辑器](_doc/路径配置.md "路径配置")

4. [拖拽插入和粘贴图片](_doc/拖拽插入和粘贴图片.md "拖拽插入和粘贴图片")

5. [ASP支持说明](_doc/ASP支持说明.md "ASP支持说明")

## 二次开发文档 ##

1. 注意：正式使用时，需要在build目录下运行merge.bat （运行需要java支持），这个操作会自动把_src的源代码合并到editor_all.js和editor_min.js这样也页面使用自己修改的编辑器的时候，就可以只引用editor_all.js。

2. [增加一个简单按钮](_doc/增加一个简单按钮.md "增加一个简单按钮")

## 相关链接 ##

ueditor 官网: [http://ueditor.baidu.com](http://ueditor.baidu.com "ueditor 官网")

ueditor API 文档: [http://ueditor.baidu.com/doc](http://ueditor.baidu.com/doc "ueditor API 文档")

ueditor 论坛: [http://www.ueditorbbs.com](http://www.ueditorbbs.com "ueditor 论坛")

ueditor github 地址: [https://github.com/campaign/ueditor](https://github.com/campaign/ueditor "ueditor github 地址")

## 联系我们 ##

email: [ueditor@baidu.com](mailto://email:ueditor@baidu.com "发邮件给ueditor开发组")

bbs: [www.ueditorbbs.com](http://www.ueditorbbs.com "ueditor 论坛")
