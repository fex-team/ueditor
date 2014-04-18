<?php
/**
 * 抓取远程图片
 * User: Jinqn
 * Date: 14-04-14
 * Time: 下午19:18
 */
include "Uploader.class.php";
date_default_timezone_set("Asia/chongqing");
header("Content-Type: text/html; charset=utf-8");
error_reporting(E_ERROR | E_WARNING);

/* 全局配置项 */
$CONFIG = include("config.php");

/* 上传配置 */
$config = array(
    "savePath" => $CONFIG['savePath'][0],
    "fileNameFormat" => $CONFIG['nameFormat'],
    "maxSize" => $CONFIG['catcherMaxSize'], //单位KB
    "allowFiles" => $CONFIG['catcherAllowFiles']
);
$fieldName = $CONFIG['catcherFieldName'];

/* 获取远程图片 */
$source = $_POST[$fieldName];
$result = getRemoteImage($source, $config);
return $result;

/**
 * 远程抓取函数
 * @param $source
 * @param $config
 */
function getRemoteImage($source, $config)
{
    //忽略抓取时间限制
    set_time_limit(0);
    $urls = array();
    foreach ($source as $imgUrl) {

        //字符转换
        $imgUrl = htmlspecialchars($imgUrl);
        $imgUrl = str_replace("&amp;", "&", $imgUrl);

        //http开头验证
        if (strpos($imgUrl, "http") !== 0) {
            array_push($urls, "error");
            continue;
        }
        //获取请求头
        $heads = get_headers($imgUrl);
        //死链检测
        if (!(stristr($heads[0], "200") && stristr($heads[0], "OK"))) {
            array_push($urls, "error");
            continue;
        }

        //格式验证(扩展名验证和Content-Type验证)
        $fileType = strtolower(strrchr($imgUrl, '.'));
        if (!in_array($fileType, $config['allowFiles']) || stristr($heads['Content-Type'], "image")) {
            array_push($urls, "error");
            continue;
        }

        //打开输出缓冲区并获取远程图片
        ob_start();
        $context = stream_context_create(
            array(
                'http' => array(
                    'follow_location' => false // don't follow redirects
                )
            )
        );
        //请确保php.ini中的fopen wrappers已经激活
        readfile($imgUrl, false, $context);
        $img = ob_get_contents();
        ob_end_clean();

        //大小验证
        $uriSize = strlen($img); //得到图片大小
        $allowSize = 1024 * $config['maxSize'];
        if ($uriSize > $allowSize) {
            array_push($urls, "error");
            continue;
        }

        //创建保存位置
        $savePath = $config['savePath'];
        if(substr($savePath, strlen($savePath) - 1) != '/') {
            $savePath .= '/';
        }
        if (!file_exists($savePath)) {
            mkdir("$savePath", 0777);
        }

        //写入文件
        $tmpName = $savePath . rand(1, 10000) . time() . strrchr($imgUrl, '.');
        try {
            $fp2 = @fopen($tmpName, "a");
            fwrite($fp2, $img);
            fclose($fp2);
            array_push($urls, $tmpName);
        } catch (Exception $e) {
            array_push($urls, "error");
        }
    }

    return json_encode(array(
        'state'=> 'SUCCESS',
        'url'=> $urls,
        'tip'=> '远程图片抓取成功！',
        'source'=> $source
    ));
}