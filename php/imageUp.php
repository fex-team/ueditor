<?php
include "Uploader.class.php";
header("Content-Type: text/html; charset=utf-8");
error_reporting(E_ERROR | E_WARNING);
date_default_timezone_set("Asia/chongqing");

/* 全局配置项 */
$CONFIG = include("config.php");

/* 上传配置 */
$config = array(
    "savePath" => $CONFIG['savePath'],
    "maxSize" => $CONFIG['imageMaxSize'], //单位KB
    "allowFiles" => $CONFIG['imageAllowFiles'],
    "nameFormat" => $_POST['imageFieldName']
);
$fieldName = $CONFIG['imageFieldName'];

/* 生成上传实例对象并完成上传 */
$up = new Uploader($fieldName, $config);

/**
 * 得到上传文件所对应的各个参数,数组结构
 * array(
 *     "originalName" => "",   //原始文件名
 *     "name" => "",           //新文件名
 *     "url" => "",            //返回的地址
 *     "size" => "",           //文件大小
 *     "type" => "" ,          //文件类型
 *     "state" => ""           //上传状态，上传成功时必须返回"SUCCESS"
 * )
 */
$info = $up->getFileInfo();

if ($callback = $_GET["callback"]) {
    echo json_encode($info);
} else {
    echo $callback . '(' . json_encode($info) . ')';
}
