Get Started
=====

> 鉴于目前 ISSUE 较多而维护时间较少，且在进行后续的版本更新，目前暂时关闭 ISSUE，若社区有人跟进，欢迎和我们联系。重复的问题，请参阅常见问题的 [FAQ Wiki](https://github.com/fex-team/ueditor/wiki/FAQ)。

## 重要安全通告：

1. commons-fileupload-1.3.1.jar 存在漏洞可能会导致 ddos，源代码中已经修改，使用老版本的用户，强烈推荐升级 commons-fileupload.jar 至最新版本。（2018-04-09）.
2. UEditor 所提供的所有后端代码都仅为 DEMO 作用，切不可直接使用到生产环境中，目前已知 php 的代码会存在 ssrf 的安全漏洞。修复方式：使用最新的 Uploader.class [code](https://github.com/fex-team/ueditor/blob/dev-1.5.0/php/Uploader.class.php) .

## ueditor富文本编辑器介绍

UEditor是由百度web前端研发部开发所见即所得富文本web编辑器，具有轻量，可定制，注重用户体验等特点，开源基于MIT协议，允许自由使用和修改代码。

## 1 入门部署和体验

### 1.1 下载编辑器

1. `git clone ` 仓库
2. `npm install` 安装依赖（如果没有安装 grunt , 请先在全局安装 grunt）
3. 在终端执行 `grunt default`

### 1.2 创建demo文件
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
	    var ue = UE.getEditor('container');
	</script>
</body>
</html>
```

### 1.3 在浏览器打开demo.html

如果看到了下面这样的编辑器，恭喜你，初次部署成功！

![部署成功](http://fex.baidu.com/ueditor/doc/images/demo.png)

### 1.4 传入自定义的参数

编辑器有很多可自定义的参数项，在实例化的时候可以传入给编辑器：
```javascript
var ue = UE.getEditor('container', {
    autoHeight: false
});
```

配置项也可以通过ueditor.config.js文件修改，具体的配置方法请看[前端配置项说明](http://fex.baidu.com/ueditor/#start-config1.4 前端配置项说明.md)

### 1.5 设置和读取编辑器的内容

通getContent和setContent方法可以设置和读取编辑器的内容
```javascript
var ue = UE.getEditor();
//对编辑器的操作最好在编辑器ready之后再做
ue.ready(function(){
    //设置编辑器的内容
    ue.setContent('hello');
    //获取html内容，返回: <p>hello</p>
    var html = ue.getContent();
    //获取纯文本内容，返回: hello
    var txt = ue.getContentTxt();
});
```

ueditor的更多API请看[API 文档](http://ueditor.baidu.com/doc "ueditor API 文档")

### 1.6 dev-1.5.0 版本二次开发自定义插件注意事项

dev-1.5.0版对于插件的加载逻辑进行了调整，但官网对应的[二次开发功能文档](http://fex.baidu.com/ueditor/#dev-developer)未对相应调整做出开发细节说明，现补充如下：

除进行原有配置外，还需在实例化ueditor编辑器时在 toolbars 参数数组中，加入自定义插件的 uiname，并且注意uiname必须小写，方可正确加载自定义插件。 

## 2 详细文档

ueditor 官网：[http://ueditor.baidu.com](http://ueditor.baidu.com "ueditor 官网")

ueditor API 文档：[http://ueditor.baidu.com/doc](http://ueditor.baidu.com/doc "ueditor API 文档")

ueditor github 地址：[http://github.com/fex-team/ueditor](http://github.com/fex-team/ueditor "ueditor github 地址")

ueditor 第三方插件贡献 wiki : [第三方插件贡献规范](http://ueditor.baidu.com/website/thirdproject.html)

ueditor 贡献代码规范（javascript）： [javascript规范](https://github.com/fex-team/styleguide/blob/master/javascript.md)

## 3 第三方贡献

ueditor for nodejs 参考[https://github.com/netpi/ueditor](https://github.com/netpi/ueditor)

## 4 联系我们

email：[ueditor@baidu.com](mailto://email:ueditor@baidu.com "发邮件给ueditor开发组")

issue：[github issue](http://github.com/fex-team/ueditor/issues "ueditor 论坛")
