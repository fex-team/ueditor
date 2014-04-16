<?php
/**
 * 获取已上传的文件列表
 * User: Jinqn
 * Date: 14-04-09
 * Time: 上午10:17
 */
include "Uploader.class.php";
date_default_timezone_set("Asia/chongqing");
header("Content-Type: text/html; charset=utf-8");
error_reporting(E_ERROR | E_WARNING);

/* 全局配置项 */
$CONFIG = include("config.php");

//需要遍历的目录列表，最好使用缩略图地址，否则当网速慢时可能会造成严重的延时
$paths = $CONFIG['savePath'];

/* 获取文件列表 */
$files = array();
foreach ($paths as $path) {
    $tmp = getfiles($path);
    if ($tmp) {
        $files = array_merge($files, $tmp);
    }
}
if (!count($files)) return;
rsort($files, SORT_STRING);

/* 获取指定范围的列表 */
$size = isset($_GET['size']) ? $_GET['size'] : 0;
$start = isset($_GET['start']) ? $_GET['start'] : 0;
$end = $start + $size;
for ($list = [], $i = $start; $i < $end; $i++) {
    $list[] = $files[$i];
}

/* 返回数据 */
$result = json_encode(array(
    "state" => "SUCCESS",
    "list" => $list,
    "start" => $start,
    "total" => count($files)
));

return $result;


/**
 * 遍历获取目录下的指定类型的文件
 * @param $path
 * @param array $files
 * @return array
 */
function getfiles($path, &$files = array())
{
    if (!is_dir($path)) return null;
    if(substr($path, strlen($path) - 1) != '/') $path .= '/';
    $handle = opendir($path);
    while (false !== ($file = readdir($handle))) {
        if ($file != '.' && $file != '..') {
            $path2 = $path . $file;
            if (is_dir($path2)) {
                getfiles($path2, $files);
            } else {
                if (preg_match("/\.(gif|jpeg|jpg|png|bmp)$/i", $file)) {
                    $files[] = $path2;
                }
            }
        }
    }
    return $files;
}
