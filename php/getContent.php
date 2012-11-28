<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<?php
    //获取数据
    error_reporting(E_ERROR|E_WARNING);
    $content =  htmlspecialchars(stripslashes($_POST['myEditor']));
    $content1 =  htmlspecialchars(stripslashes($_POST['myEditor1']));

    //存入数据库或者其他操作

    //显示
    echo "第1个编辑器的值";
    echo  htmlspecialchars_decode($content);
    echo "<br/>第2个编辑器的值<br/>";

    echo "<textarea style='width:500px;height:300px;'>".htmlspecialchars_decode($content1)."</textarea><br/>";
    echo "<input type='button' value='点击返回' onclick='javascript:location.href = \"../_examples/submitFormDemo.html\" ' /></script>";
