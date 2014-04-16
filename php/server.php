<?php
$C = include("config.php");
$action = $_GET['action'];

switch ($action) {
    case 'config':
        /* 过滤一些不想暴露给前端的配置项 */
        $filter = ['savePath', 'nameFormat'];
        /* 返回给前端的配置项 */
        $config = [];
        foreach ($C as $k => $v) {
            if (!in_array($k, $filter)) {
                $config[$k] = $v;
            }
        }
        $result =  json_encode($config);
        break;

    /* 上传图片 */
    case 'uploadimage':
    /* 上传涂鸦 */
    case 'uploadscrawl':
    /* 上传视频 */
    case 'uploadvideo':
    /* 上传文件 */
    case 'uploadfile':
        $result = include("upload.php");
        break;

    /* 列出图片 */
    case 'listimage':
        $result = include("list.php");
        break;

    /* 抓取远程文件 */
    case 'getremoteimage':
        $result = include("remote.php");
        break;

    default:
        $result = json_encode(array(
            'state'=> 'UNKNOW ERROR'
        ));
        break;
}

/* 输出结果 */
if ($callback = $_GET['callback']) {
    echo $callback . '(' . $result . ')';
} else {
    echo $result;
}