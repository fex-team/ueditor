<?php
    /**
     * Created by JetBrains PhpStorm.
     * User: taoqili
     * Date: 12-2-19
     * Time: 下午10:44
     * To change this template use File | Settings | File Templates.
     */
    error_reporting(E_ERROR|E_WARNING);
    $key =htmlspecialchars($_POST["searchKey"]);
    $type = htmlspecialchars($_POST["videoType"]);
    $html = file_get_contents('http://api.tudou.com/v3/gw?method=item.search&appKey=myKey&format=json&kw='.$key.'&pageNo=1&pageSize=20&channelId='.$type.'&inDays=7&media=v&sort=s');
    echo $html;