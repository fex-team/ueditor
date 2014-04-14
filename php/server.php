<?php
global $C;

$C = include("config.php");
$action = $_GET['action'];
$type = $_GET['type'];

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
        if ($callback = $_GET['callback']) {
            echo $callback . '(' . json_encode($config) . ')';
        } else {
            echo json_encode($config);
        }
        break;

    /* 上传图片 */
    case 'uploadimage':
    /* 上传涂鸦 */
    case 'uploadscrawl':
    /* 上传视频 */
    case 'uploadvideo':
    /* 上传文件 */
    case 'uploadfile':
        include("fileUp.php");
        break;

    /* 列出图片 */
    case 'listimage':
        include("imageManager.php");
        break;

    /* 抓取远程文件 */
    case 'getremoteimage':
        include("getRemoteImage.php");
        break;

    default:
        echo 'UNKNOW ERROR';
        break;
}