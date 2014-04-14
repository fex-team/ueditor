<?php
global $C;

$C = include("config.php");
$action = $_GET['action'];
$type = $_GET['type'];

switch($action){
    case 'config':
        /* 过滤一些不想暴露给前端的配置项 */
        $filter = ['savePath', 'nameFormat'];
        /* 返回给前端的配置项 */
        $config = [];
        foreach($C as $k => $v){
            if ( !in_array($k, $filter) ) {
                $config[$k] = $v;
            }
        }
        if($callback = $_GET['callback']) {
            echo $callback.'('.json_encode($config).')';
        } else {
            echo json_encode($config);
        }
        break;
    case 'upload':
        include("upload.php");
        break;
    case 'list':
        if($type == 'image') {
            include("imageManager.php");
        } else if($type == 'video') {
        }
        break;
    case 'search':
        if($type == 'video') {
            include("getMovie.php");
        }
        break;
    default:
        echo 'UNKNOW ERROR';
        break;
}