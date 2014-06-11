# UEditor ASP 支持说明

应广大用户要求，UEditor 团队在原本支持的 PHP、Java 和 .Net 的后台的基础上，推出了 ASP 后台的支持。

## 支持版本 ##
支持 UEditor 1.2.6+ 的版本

## 支持功能 ##
支持所有其他后台已支持的功能，包括：

1. 图片上传
2. 远程图片转存
3. 图片管理
4. 涂鸦上传（包括背景）
5. Word 图片转存
6. 截图上传
7. 文件上传

## 部署指南 ##
Classic ASP 一般在 IIS 上运行。其它 ASP 服务器不介绍部署方式，请自行研究。

### 配置 ###

对于 v1.4.0 之前的版本，需要修改 `ueditor.config.js`。最简单的方法，就是把文件中的 php 都替换成 asp。要修改的配置包括：

```javascript
{
     imageUrl:URL+"asp/imageUp.asp"
    ,imagePath:URL + "asp/"
    ,scrawlUrl:URL+"asp/scrawlUp.asp"
    ,scrawlPath:URL+"asp/"
    ,fileUrl:URL+"asp/fileUp.asp"
    ,filePath:URL + "asp/"
    ,catcherUrl:URL +"asp/getRemoteImage.asp"
    ,catcherPath:URL + "asp/"
    ,imageManagerUrl:URL + "asp/imageManager.asp"
    ,imageManagerPath:URL + "asp/"
    ,snapscreenServerUrl: URL +"asp/imageUp.asp"
    ,snapscreenPath: URL + "asp/"
    ,wordImageUrl:URL + "asp/imageUp.asp"
    ,wordImagePath:URL + "asp/"
    ,getMovieUrl:URL+"asp/getMovie.asp"
}
```

UEditor v1.4.0 后进行了后端的统一配置，后端相关的配置文件是 `config.json`，在具体的后台目录下。需要注意以下两个类型的配置：


```javascript
{
    "{tpl}UrlPrefix": "/ueditor/asp/",
    "{tpl}PathFormat": "upload/{tpl}/{yyyy}{mm}{dd}/{time}{rand:6}"
}
```

`{tpl}PathFormat` 是资源（图片、涂鸦、文件等）保存的位置以及文件名格式，这个路径在 ASP 中是相对运行目录的。

`{tpl}UrlPrefix` 是资源定位的基本路径，在 ASP 后台中一般设置成 ASP 的目录。

比如，IIS 中运行的 UEditor ASP 的目录为 C:\iis_pub\wwwroot\mysite\ueditor\asp，而网站的访问地址为 http://localhost/mysite/，那么你可以这样修改这两类配置项：

```javascript
{
    "{tpl}UrlPrefix": "/mysite/ueditor/asp/",
    "{tpl}PathFormat": "upload/{tpl}/{yyyy}{mm}{dd}/{time}{rand:6}"
}
```


### 在 IIS 6.X 中部署
IIS 的安装在这里不介绍，请自行查阅相关资料。

1. 启用 ASP 拓展
	* 打开 IIS 管理器
	* 展开本地计算机
	* 选中 Web 服务拓展
	* 允许 Active Server Pages 拓展

2. 配置网站脚本执行权限（如果使用虚拟路径，请跳过本步骤）
	* 在网站上右击，点属性
	* 切换到主目录选项卡，勾选*读取*、*写入*两个权限，并且*执行权限*选择*纯脚本*
	* 点确定

3. 使用虚拟路径
	* 在网站上右击，点*新建* - *虚拟路径*
	* 按照向导填写名称和路径
	* 勾选*读取*、*执行脚本*和*写入*三个权限
	* 完成虚拟目录的创建

4. 配置脚本执行身份
	* 在网站或虚拟路径上右击，点属性
	* 选择*目录安全性*选项卡
	* 在*身份验证和访问控制*中点击*编辑*
	* 勾选*启用匿名访问*，点击用户名后面的*浏览*
	* 输入*administrator*点确定
	* 输入*administrator*账号的密码
	* 点击确定，再确认一次密码

5. 设置最大 HTTP 请求大小限制
	* 找到位于 C:\Windows\System32\Inetsrv 中的 metabase.XML，打开，查找ASPMaxRequestEntityAllowed，修改为需要的值（如10240000 即 10M）
	> ASP 文件中也有上传文件大小的限制，不过先验证的限制是 IIS 中设置的，所以如果 IIS 中设置最大 256K，那么就算 ASP 中设置了最大 10M，那么超过 256K 的文件也无法上传，而且 ASP 没法给出错误信息。

### 在 IIS 7.X 中部署
IIS7 默认不安装 ASP，需要手动添加进去。添加方法请读者自行查阅。

1. 配置脚本执行身份
	* 选中网站或者应用程序
	* 双击 IIS 中的*身份验证*
	* 双击匿名身份验证
	* 填写*administrator*的用户名和密码，确定

2. 设置最大 HTTP 请求大小限制
    * 打开 IIS 控制台
    * 双击 ASP，展开*限制属性*，修改*醉倒请求实体主体限制*为需要的值（如10240000 即 10M）
    > ASP 文件中也有上传文件大小的限制，不过先验证的限制是 IIS 中设置的，所以如果 IIS 中设置最大 256K，那么就算 ASP 中设置了最大 10M，那么超过 256K 的文件也无法上传，而且 ASP 没法给出错误信息。
