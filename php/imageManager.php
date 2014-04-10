<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Jinqn
 * Date: 14-04-09
 * Time: 上午10:17
 * 获取已上传的文件列表
 */
header("Content-Type: text/html; charset=utf-8");
error_reporting(E_ERROR | E_WARNING);

//需要遍历的目录列表，最好使用缩略图地址，否则当网速慢时可能会造成严重的延时
$paths = array('upload', 'upload1');

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
$listSize = isset($_GET['size']) ? $_GET['size'] : 30;
$listPage = isset($_GET['page']) ? $_GET['page'] : 0;
$start = $listSize * $listPage;
$end = $listSize * ($listPage + 1);
for ($list = [], $i = $start; $i < $end; $i++) {
    $list[] = $files[$i];
}

/* 返回数据 */
$json = json_encode(array(
    "state" => "SUCCESS",
    "list" => $list,
    "size" => $listSize,
    "page" => $listPage,
    "total" => count($files)
));
if ($callback = $_GET['callback']) {
    echo $callback . '(' . $json . ')';
} else {
    echo $json;
}


/**
 * 遍历获取目录下的指定类型的文件
 * @param $path
 * @param array $files
 * @return array
 */
function getfiles($path, &$files = array())
{
    if (!is_dir($path)) return null;
    $handle = opendir($path);
    while (false !== ($file = readdir($handle))) {
        if ($file != '.' && $file != '..') {
            $path2 = $path . '/' . $file;
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
