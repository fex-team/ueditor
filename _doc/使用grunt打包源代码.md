# 使用grunt打包源代码

随着nodejs和grunt的火爆，ueditor采用了grunt来作为线下的合并打包工具，支持编码和后台语言指定。

## 支持版本 ##
支持 UEditor 1.3.0+ 的版本

## 使用方法

1. 线上下载ueditor
    * 下载地址：[ueditor](http://ueditor.baidu.com/website/download.html#ueditor)，要下载"完整版 + 源码"

2. 安装nodejs
    * 下载[nodejs](http://www.nodejs.org)并安装到本地
    * 安装成功后，打开控制台，在控制台下输入```shell node -v```
    * 如果控制台输出nodejs的版本。那恭喜你，nodejs安装好了，可以使用ctrl+c退出node模式.

3. 安装打包需要的grunt插件
    * 以终端方式（windows用户用cmd）进入ueditor源码根目录，执行```shell npm install```
    * 这个命令会根据package.json文件，安装打包需要的grunt和grunt插件
    * 安装结束后，会在ueditor目录下出现一个node_modules文件夹

4. 执行打包命令
    * 以终端方式（windows用户用cmd）进入ueditor源码根目录，执行```shell grunt```
    * 这个命令会根据Gruntfile.js执行打包打包的任务，运行过程 **需要java环境** 支持
    * 命令完成后，ueditor目录下会出现dist/目录，里面有你要的打包好的ueditor文件夹，默认是utf8-php文件夹

## 打包其他版本
执行打包grunt命令时，可以传入编码和后台语言的参数

1. 支持两种编码指定：--encode参数
    * utf8 (默认编码)
    * gbk

2. 提供四种后台语言支持：--server参数
    * php (默认语言)
    * jsp
    * net (代表.net后台)
    * asp

例如:想要打包成编码是gbk，后台语言是asp版本，可执行命令:
```shell grunt --encode=gbk --server=asp```
