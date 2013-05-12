<?php
header( "Content-type: text/html; charset=utf-8" );
date_default_timezone_set('PRC');

$loginfo = $_GET[ 'loginfo' ];
$detail = $_GET['detail'];
$fail = $_GET[ 'fail' ];
$nextCase = $_GET['next'];

$date = date( 'Y-m-d' );
$browser = getBrowser();

$tmpLog = $browser.'--- '.date('H:i:s  ').$loginfo."下一个用例:$nextCase";
if ( $fail == 'true' ) {
    $failHandle = fopen( "log/$date--fail.txt" , "a" );
    fwrite( $failHandle , iconv("UTF-8", "GBK", $tmpLog . "\n" ));
    fwrite( $failHandle , iconv("UTF-8", "GBK", "detail:\n".str_replace("\\n","\n",$detail)."\n" ) );
    fclose( $failHandle );
}
/*$handle = fopen( "log/$date.txt" , "a" );

fwrite( $handle ,  $tmpLog. "\n" );
fwrite( $handle , "detail:\n".str_replace("\\n","\n",$detail)."\n" );
fclose( $handle );*/
function getBrowser(){
    if(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 9.0"))
		$browser = "Internet Explorer 9.0";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 8.0"))
		$browser = "Internet Explorer 8.0";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 7.0"))
		$browser = "Internet Explorer 7.0";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 6.0"))
		$browser = "Internet Explorer 6.0";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"Firefox"))
		$browser = "Firefox";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"Chrome"))
		$browser = "Google Chrome";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"Safari"))
		$browser = "Safari";
	else if(strpos($_SERVER["HTTP_USER_AGENT"],"Opera"))
		$browser = "Opera";
	else 	$browser =  $_SERVER["HTTP_USER_AGENT"];
    return $browser;
}
?>