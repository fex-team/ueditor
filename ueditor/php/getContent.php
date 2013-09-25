<meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
<script src="../ueditor.parse.js" type="text/javascript"></script>
<script>
  uParse('.content',{
      'highlightJsUrl':'../third-party/SyntaxHighlighter/shCore.js',
      'highlightCssUrl':'../third-party/SyntaxHighlighter/shCoreDefault.css'
  })
</script>
<?php
    //获取数据
    error_reporting(E_ERROR|E_WARNING);
    $content =  htmlspecialchars(stripslashes($_POST['myEditor']));


    //存入数据库或者其他操作

    //显示
    echo "第1个编辑器的值";
    echo  "<div class='content'>".htmlspecialchars_decode($content)."</div>";
