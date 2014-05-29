<?php
/**
 * check get or post
 *
 */
/*加上这句使得当php配置显示Notice提示信息时也不会报错*/
error_reporting(E_ERROR | E_WARNING);
if ($_SERVER['REQUEST_METHOD'] == 'POST') { // POST请求

    $img1 = $_POST['img1'];
    $img2 = $_POST['img2'];
    $content = $_POST['content'];
    $str = '';
    if ($img1 && $img2) {
        $str = "img1='" . $img1 . "'&img2='" . $img2 . "'";
    }
    if ($content) {
        if ($img1) {
            $str .= '&';
        }
        $str .= $content;
    }
    echo $str;

} else if (isset($_GET['callback'])) { // jsonp做的GET请求

    $callback = $_GET['callback'];

    echo $callback . '(' . json_encode($_GET) . ')';

} else { // 普通GET请求

    $get1 = $_GET['get1'];
    $get2 = $_GET['get2'];
    $img1 = $_GET['img1'];
    $img2 = $_GET['img2'];
    $content = $_GET['content'];
    $str = '';
    if ($get1 && $get2) {
        $str .= "get1='" . $get1 . "'&get2='" . $get2 . "'";
    }
    if ($img1 && $img2) {
        if ($get1) {
            $str .= '&';
        }
        $str .= "img1='" . $img1 . "'&img2='" . $img2 . "'";
    }
    if ($content) {
        if ($img1 || $get1) {
            $str .= '&';
        }
        $str .= $content;
    }
    echo $str;

}
?>