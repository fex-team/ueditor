<?php
header( "Content-type: text/html; charset=utf-8" );
header( "Cache-Control: no-cache, max-age=10, must-revalidate" );
if ( !array_key_exists( 'quirk' , $_GET ) ) {
    print '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
}
;
require_once "case.class.php";
$c = new Kiss( '../../../' , $_GET[ 'case' ] );
$title = $c->name;
$cov = array_key_exists( 'cov' , $_GET );
?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title><?php print( "run case $title" );?></title>
    <?php $c->print_js( $cov ); ?>
</head>
<body>
<h1 id="qunit-header"><?php print( $c->name );?></h1>

<h2 id="qunit-banner"></h2>

<h2 id="qunit-userAgent"></h2>
<ol id="qunit-tests"></ol>
<script type="text/javascript">
    /**捕获所有页面的异常，当有异常时如果是关于用例执行完毕还有对editor的调用这种情况，一律忽略，其他照常抛异常**/
    window.onerror = function( e ) {
        msg1 = "Uncaught TypeError: Cannot call method 'select' of null";
        msg2 = "Uncaught TypeError: Cannot call method 'getSelection' of undefined";
        msg3 = "'sourceEditor' 为空或不是对象";
        msg4 = "未指明的错误。";
        if ( e != msg1 && e != msg2 && e.indexOf( msg3 ) < 0 && e != msg4 ) {
//            throw new Error( e );
        } else {
            return true;
        }
    };
</script>
<div>
    <object id="plugin" type="application/x-plugintest" width="1" height="1">
        <param name="onload" value="pluginLoaded"/>
    </object>
</div>
</body>
</html>