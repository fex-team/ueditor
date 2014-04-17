<?php
/**
 * 上传附件和上传视频
 * User: Jinqn
 * Date: 14-04-14
 * Time: 下午19:18
 */
$phpSelf = $_SERVER['PHP_SELF'];
$serverDir = substr($phpSelf, 0, strrpos($phpSelf, '/') + 1); // 例子: "/ueditor/php/"
$serverUrl = $serverDir . 'server.php'; // 例子: "/ueditor/php/server.php"
$uploadPathPrefix = $serverDir; // 例子: "/ueditor/php/"
$fieldName = 'upfile';
$insertAlign = 'none'; // none left right center

return array(
    'savePath' => ['upload'] //上传文件保存在服务器端的目录
    , 'nameFormat' => '{time}/{rand:6}'

    /* 图片上传配置区 */
    , 'imageUrl' => $serverUrl . '?action=uploadimage' //图片上传地址
    , 'imagePath' => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , 'imageFieldName' => $fieldName //提交的图片表单名称
    , 'imageMaxSize' => 1024 //上传图片大小限制，单位KB
    , 'imageAllowFiles' => array(".png", ".jpg", ".jpeg", ".gif", ".bmp") //上传图片允许的文件格式
    , 'imageCompressEnable' => true //是否压缩图片,默认是true
    , 'imageCompressBorder' => 1600 //是否压缩图片,图片压缩最长边限制
    , 'imageInsertAlign' => $insertAlign //插入的图片浮动方式

    /* 涂鸦图片配置区 */
    , 'scrawlUrl' => $serverUrl . "?action=uploadscrawl" //涂鸦上传地址
    , 'scrawlPath' => $uploadPathPrefix //涂鸦修正地址，是最终插入的图片地址前缀
    , 'scrawlFieldName' => 'content' //提交的涂鸦表单名称
    , 'scrawlInsertAlign' => $insertAlign //插入的涂鸦图片浮动方式
    , 'scrawlMaxSize' => 2 * 1024 //提交的涂鸦大小限制，单位KB
    , 'scrawlAllowFiles' => array(".png", ".jpg") //提交的涂鸦的文件格式

    /* 屏幕截图配置区 */
    , 'snapscreenHost' => $_SERVER['HTTP_HOST'] //屏幕截图的server端文件所在的网站地址或者ip，请不要加htt'p=>//
    , 'snapscreenServerUrl' => $serverUrl . "?action=uploadimage" //屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/php/snapImgUp.php"”
    , 'snapscreenPath' => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , 'snapscreenServerPort' => $_SERVER['SERVER_PORT'] //屏幕截图的server端端口
    , 'snapscreenInsertAlign' => $insertAlign //截图的图片默认的排版方式

    /* 图片在线管理配置区 */
    , 'imageManagerUrl' => $serverUrl . "?action=listimage" //图片在线管理的处理地址
    , 'imageManagerPath' => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , 'imageManagerListSize' => 20 //一次获取列表数量
    , 'imageManagerInsertAlign' => $insertAlign //截图的图片默认的排版方式

    /* 远程抓取配置区 */
    , 'catcherLocalDomain' => ["127.0.0.1","localhost","img.baidu.com"] //不抓取的域名列表
    , 'catcherUrl' => $serverUrl . "?action=getremoteimage" //处理远程图片抓取的地址
    , 'catcherPath' => $uploadPathPrefix //图片修正地址，同imagePath
    , 'catcherFieldName' => 'source' //提交到后台远程图片uri合集，若此处修改，需要在后台对应文件修改对应参数
    , 'catcherMaxSize' => 2 * 1024 //上传图片大小限制，单位KB
    , 'catcherAllowFiles' => array(".png", ".jpg", ".jpeg", ".gif", ".bmp") //上传图片允许的文件格式

    /* 附件上传配置区 */
    , 'fileUrl' => $serverUrl . "?action=uploadfile" //附件上传提交地址
    , 'filePath' => $uploadPathPrefix //附件修正地址，是最终插入的附件地址前缀
    , 'fileFieldName' => $fieldName //附件提交的表单名，若此处修改，需要在后台对应文件修改对应参数
    , 'fileMaxSize' => 20 * 1024 //上传图片大小限制，单位KB
    , 'fileAllowFiles' => array(".rar", ".zip", ".tar", ".gz", ".7z", "bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf",
        ".txt", ".md", ".xml") //上传图片允许的文件格式

    /* 视频上传配置区 */
    , 'videoUrl' => $serverDir . "?action=uploadvideo" //视频上传提交地址
    , 'videoPath' => $uploadPathPrefix //视频修正地址，是最终插入的视频地址前缀
    , 'videoFieldName' => $fieldName //提交的图片表单名称
    , 'videoMaxSize' => 100 * 1024 //上传图片大小限制，单位KB
    , 'videoAllowFiles' => array(".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm") //上传图片允许的文件格式

);