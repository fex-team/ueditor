<?php

$phpSelf = $_SERVER['PHP_SELF'];
$serverDir = substr($phpSelf, 0, strrpos($phpSelf, '/') + 1); // 例子: "/ueditor/php/"
$serverUrl = $serverDir . 'server.php'; // 例子: "/ueditor/php/server.php"
$uploadPathPrefix = $serverDir; // 例子: "/ueditor/php/"
$savePath = 'upload/';
$fieldName = 'upfile';

return array(
    savePath => $savePath //上传文件保存在服务器端的目录
    , nameFormat => '{time}{rand:6}'

    /* 图片上传配置区 */
    , imageUrl => $serverUrl . '?action=uploadimage' //图片上传地址
    , imagePath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , imageFieldName => $fieldName //提交的图片表单名称
    , imageMaxSize => 1024 //上传图片大小限制，单位KB
    , imageAllowFiles => array(".png", ".jpg", ".jpeg", ".gif", ".bmp") //上传图片允许的文件格式
    , imageCompressEnable => true //是否压缩图片,默认是true
    , imageCompressBorder => 1600 //是否压缩图片,图片压缩最长边限制

    /* 涂鸦图片配置区 */
    , scrawlUrl => $serverUrl . "?action=uploadscrawl" //涂鸦上传地址
    , scrawlPath => $uploadPathPrefix //涂鸦修正地址，是最终插入的图片地址前缀
    , scrawlFieldName => $fieldName //提交的涂鸦表单名称

    /* 图片在线管理配置区 */
    , imageManagerUrl => $serverUrl . "?action=listimage" //图片在线管理的处理地址
    , imageManagerPath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , imageManagerListSize => 20 //一次获取列表数量

    /* 远程抓取配置区 */
    , catchRemoteImageEnable => true //是否开启远程图片抓取,默认开启
    , catcherUrl => $serverUrl . "?action=getremoteimage" //处理远程图片抓取的地址
    , catcherPath => $uploadPathPrefix //图片修正地址，同imagePath
    , catchFieldName => $fieldName //提交到后台远程图片uri合集，若此处修改，需要在后台对应文件修改对应参数
    , separater => 'ue_separate_ue' //提交至后台的远程图片地址字符串分隔符
    , localDomain => []

    /* 屏幕截图配置区 */
    , snapscreenHost => $_SERVER['HTTP_HOST'] //屏幕截图的server端文件所在的网站地址或者ip，请不要加http=>//
    , snapscreenServerUrl => $serverUrl . "?action=uploadimage" //屏幕截图的server端保存程序，UEditor的范例代码为“URL +"server/upload/php/snapImgUp.php"”
    , snapscreenPath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , snapscreenServerPort => $_SERVER['SERVER_PORT'] //屏幕截图的server端端口
    , snapscreenImgAlign => '' //截图的图片默认的排版方式

    /* word图片转存配置区 */
    , wordImageUrl => $serverUrl . "?action=uploadimage" //word转存提交地址
    , wordImagePath => $uploadPathPrefix //图片修正地址，是最终插入的图片地址前缀
    , wordImageFieldName => $fieldName //提交的图片表单名称

    /* 附件上传配置区 */
    , fileUrl => $serverUrl . "?action=upload&type=file" //附件上传提交地址
    , filePath => $uploadPathPrefix //附件修正地址，是最终插入的附件地址前缀
    , fileFieldName => $fieldName //附件提交的表单名，若此处修改，需要在后台对应文件修改对应参数
    , fileMaxSize => 20 * 1024 //上传图片大小限制，单位KB
    , fileAllowFiles => array(".rar", ".zip", ".tar", ".gz", ".7z", "bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf",
        ".txt", ".md", ".xml") //上传图片允许的文件格式

    /* 视频上传配置区 */
    , videoUrl => $serverDir //视频上传提交地址
    , videoPath => $uploadPathPrefix //视频修正地址，是最终插入的视频地址前缀
    , videoFieldName => $fieldName //提交的图片表单名称
    , videoMaxSize => 100 * 1024 //上传图片大小限制，单位KB
    , videoAllowFiles => array(".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg", ".ogg", ".mov", ".wmv", ".mp4", ".webm") //上传图片允许的文件格式

);