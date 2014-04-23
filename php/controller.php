<?php
//header('Access-Control-Allow-Origin: http://*.baidu.com'); //设置http://*.baidu.com允许跨域访问
date_default_timezone_set("Asia/chongqing");
header("Content-Type: text/html; charset=utf-8");
error_reporting(E_ERROR | E_WARNING);

global $CONFIG;
$CONFIG = json_decode(preg_replace("/\/\/.*[\r\n]/", "\n", file_get_contents("config.json")));
$action = $_GET['action'];

switch ($action) {
    case 'config':
        $result =  json_encode($CONFIG);
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
        $result = include("filemanager.php");
        break;
    /* 列出文件 */
    case 'listfile':
        $result = include("filemanager.php");
        break;

    /* 抓取远程文件 */
    case 'catchimage':
        $result = include("crawler.php");
        break;

    default:
        $result = json_encode(array(
            'state'=> 'UNKNOW ERROR'
        ));
        break;
}

/* 输出结果 */
if (isset($_GET["callback"])) {
    echo $_GET["callback"] . '(' . $result . ')';
} else {
    echo $result;
}