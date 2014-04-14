<?php

$phpSelf = $_SERVER['PHP_SELF'];
$serverDir = substr($phpSelf, 0, strrpos($phpSelf, '/') + 1); // 例子: "/ueditor/php/"
$serverUrl = $serverDir . 'server.php'; // 例子: "/ueditor/php/server.php"
$uploadPathPrefix = $serverDir; // 例子: "/ueditor/php/"
$savePath = 'upload/';
$fieldName = 'upfile';

return array(
    savePath => $savePath /**/ //图片保存在服务器端的目录
    ,nameFormat => '{time}{rand:6}'

    /* 图片上传配置区 */
    , imageUrl => $serverUrl . '?action=upload&type=image' //图片上传地址
    , imagePath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , imageFieldName => $fieldName //提交的图片数据表单名
    , imageMaxSize => 1024 //上传图片大小限制，单位KB
    , imageAllowFiles => array(".png", ".jpg", ".jpeg", ".gif", ".bmp") //上传图片允许的文件格式
    , imageCompressEnable => true //是否压缩图片,默认是true
    , imageCompressBorder => 1600 //是否压缩图片,图片压缩最长边限制

    /* 图片在线管理配置区 */
    , imageManagerUrl => $serverUrl . "?action=list&type=image" //图片在线管理的处理地址
    , imageManagerPath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , imageManagerListSize => 20 //一次获取列表大小

    /* 远程抓取配置区 */
    , catchRemoteImageEnable => true //是否开启远程图片抓取,默认开启
    , catchFieldName => $fieldName //提交到后台远程图片uri合集，若此处修改，需要在后台对应文件修改对应参数
    , separater => 'ue_separate_ue' //提交至后台的远程图片地址字符串分隔符
    , localDomain => [] //本地顶级域名，当开启远程图片抓取时，除此之外的所有其它域名下的图片都将被抓取到本地,默认不抓取127.0.0.1和localhost

    /* 屏幕截图配置区 */
    , snapscreenHost => $_SERVER['HTTP_HOST'] //屏幕截图的server端文件所在的网站地址或者ip，请不要加http=>//
    , snapscreenServerUrl => $serverUrl . "?action=upload&type=image" //屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/php/snapImgUp.php"”
    , snapscreenPath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , snapscreenServerPort => $_SERVER['SERVER_PORT'] //屏幕截图的server端端口
    , snapscreenImgAlign => '' //截图的图片默认的排版方式

    /* word图片转存配置区 */
    , wordImageUrl => $serverUrl . "?action=list&type=image" //word转存提交地址
    , wordImagePath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , wordImageFieldName => $fieldName //提交的图片数据表单名

    /* 涂鸦图片配置区 */
    , scrawlUrl => $serverUrl . "?action=upload&type=scrawl" //涂鸦上传地址
    , scrawlPath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , scrawlFieldName => $fieldName //提交的图片数据表单名
    , scrawlMaxSize => 1024 //涂鸦图片大小限制，单位KB
    , scrawlAllowFiles => array(".png", ".jpg", ".jpeg", ".gif", ".bmp") //涂鸦图片允许的文件格式

    /* 附件上传配置区 */
    , fileUrl => $serverUrl . "?action=upload&type=file" //附件上传提交地址
    , filePath => $uploadPathPrefix //附件修正地址，是最终插入的附件地址前缀
    , fileFieldName => $fieldName //附件提交的表单名，若此处修改，需要在后台对应文件修改对应参数
    , fileAllowFiles => array(".rar", ".zip", ".tar", ".gz", ".7z", "bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf",
        ".txt", ".md", ".xml") //上传图片允许的文件格式

    /* 视频上传配置区 */
    , videoUrl => $serverDir + "upload/video/" //视频上传提交地址
    , videoPath => $uploadPathPrefix //视频修正地址，是最终插入的视频地址前缀
    , videoFieldName => $fieldName //视频提交的表单名
    , videoAllowFiles => array(".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm") //上传图片允许的文件格式

);