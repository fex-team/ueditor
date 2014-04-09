<?php

$phpSelf = $_SERVER['PHP_SELF'];
$serverDir = substr($phpSelf, 0, strrpos($phpSelf, '/') + 1); // 例子: "/ueditor/php/"
$serverUrl = $serverDir . 'server.php'; // 例子: "/ueditor/php/server.php"
$uploadPathPrefix = $serverDir; // 例子: "/ueditor/php/"

return array(

    /* 图片上传配置区 */
    imageUrl => $serverUrl . '?action=upload&type=image' //涂鸦上传地址
    , imagePath => $uploadPathPrefix //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
    , imageFieldName => "upfile" //图片数据的key,若此处修改，需要在后台对应文件修改对应参数
    , compressSide => 0 //等比压缩的基准，确定maxImageSideLength参数的参照对象。0为按照最长边，1为按照宽度，2为按照高度
    , maxImageSideLength => 900 //上传图片最大允许的边长，超过会自动等比缩放,不缩放就设置一个比较大的值，更多设置在image.html中
    , savePath => ["upload1", "upload2", "upload3"] //图片保存在服务器端的目录， 默认为空， 此时在上传图片时会向服务器请求保存图片的目录列表，
    , imageMaxSize => "1000KB"
    , imageAllowFiles => array(".gif", ".png", ".jpg", ".jpeg", ".bmp")

    /* 远程抓取配置区 */
    , catchRemoteImageEnable => true //是否开启远程图片抓取,默认开启
    , catchFieldName => "upfile" //提交到后台远程图片uri合集，若此处修改，需要在后台对应文件修改对应参数
    , separater => 'ue_separate_ue' //提交至后台的远程图片地址字符串分隔符
    , localDomain => [] //本地顶级域名，当开启远程图片抓取时，除此之外的所有其它域名下的图片都将被抓取到本地,默认不抓取127.0.0.1和localhost

    /* 屏幕截图配置区 */
    , snapscreenHost => $_SERVER['HTTP_HOST'] //屏幕截图的server端文件所在的网站地址或者ip，请不要加http=>//
    , snapscreenServerUrl => $serverUrl . "?action=upload&type=image" //屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/php/snapImgUp.php"”
    , snapscreenPath => $uploadPathPrefix
    , snapscreenServerPort => $_SERVER['SERVER_PORT'] //屏幕截图的server端端口
    , snapscreenImgAlign => '' //截图的图片默认的排版方式

    /* word图片转存配置区 */
    , wordImageUrl => $serverUrl . "?action=list&type=image" //word转存提交地址
    , wordImagePath => $uploadPathPrefix
    , wordImageFieldName => "upfile" //word转存表单名若此处修改，需要在后台对应文件修改对应参数

    /* 涂鸦图片配置区 */
    , scrawlUrl => $serverUrl . "?action=upload&type=scrawl" //涂鸦上传地址
    , scrawlPath => $uploadPathPrefix //图片修正地址，同imagePath,
    , scrawlFieldName => "upfile"

    /* 附件上传配置区 */
    , fileUrl => $serverUrl . "?action=upload&type=file" //附件上传提交地址
    , filePath => $uploadPathPrefix //附件修正地址，同imagePath
    , fileFieldName => "upfile" //附件提交的表单名，若此处修改，需要在后台对应文件修改对应参数

    /* 视频上传配置区 */
    , videoUrl => $serverDir + "upload/video/" //视频上传提交地址
    , videoPath => $uploadPathPrefix //视频修正地址，同imagePath
    , videoFieldName => "upfile" //视频提交的表单名

    /* 搜索视频配置区 */
    , getMovieUrl => $serverUrl . "?action=search&type=movie" //视频数据获取地址

    /* 图片在线管理配置区 */
    , imageManagerUrl => $serverUrl . "?action=list&type=image" //图片在线管理的处理地址
    , imageManagerPath => $uploadPathPrefix //图片修正地址，同imagePath
    , imageManagerListSize => 30 //一次获取列表大小


);