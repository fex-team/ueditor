<?php

/**
 * 依赖winrar和wget
 */

require 'config.php';
require_once './coverage/jscov.php';
/**
 * 考虑单浏览器执行入口，从config提取浏览器ip信息，通过staf启动用例的执行
 * @param $b
 * @param $filter
 * @param $debug
 */
$count = 0;
function run( $b , $debug = false )
{
    $browser = Config::$BROWSERS[ $b ];
    $host = $debug ? 'localhost' : $browser[ 0 ];
    $path = $debug
            ? 'C:\\Documents and Settings\\shenlixia01\\Local Settings\\Application Data\\Google\Chrome\\Application\\chrome.exe'
            : $browser[ 1 ];
    $browserSet = array_key_exists( 'browserSet' , $_GET )?"^&browserSet=".$_GET[ 'browserSet' ]:'';

    $url = "http://" . $_SERVER[ 'SERVER_ADDR' ] . ( $debug ? "" : ":8089" )
           . substr( $_SERVER[ 'PHP_SELF' ] , 0 , -11 ) . "/list.php?batchrun=true^&browser=$b".$browserSet;
    if ( !array_key_exists( "ci" , $_GET ) )
        $url .= "^&mail=true";

    if(array_key_exists(  "filter" , $_GET  )){
        $filterR = array_key_exists( $b , $_GET )?$_GET[$b]:$_GET['filter'];
        if(strstr($b,'main')||strstr($b,'supp')){
            $url .= "^&filterRun={$filterR}^&filter={$_GET['filter']}";
        }else {
            $url .= "^&filterRun={$_GET['filter']}^&filter={$_GET['filter']}";

        }
    }

//    if( $b!='ie6') {
        if ( array_key_exists( 'cov' , $_GET ) )
            $url .= "^&cov={$_GET['cov']}";
//    }
    //	else
    //	$url .= "^&cov=true";
print $url;
    if ( $b == 'baidu' ) {
        $url = "--'$url'";
    }

    require_once 'lib/Staf.php';
    $result = Staf::process_start( $path , $url , $host );
    return $result;
}

function delDirAndFile( $dirName )
{
    if ( $handle = opendir( "$dirName" ) ) {
        while ( false !== ( $item = readdir( $handle ) ) ) {
            if ( $item != "." && $item != ".." ) {
                if ( is_dir( "$dirName/$item" ) ) {
                    delDirAndFile( "$dirName/$item" );
                } else {
                    if ( unlink( "$dirName/$item" ) ) echo "成功删除文件： $dirName/$item<br />\n";
                }
            }
        }
        closedir( $handle );
        if ( rmdir( $dirName ) ) echo "成功删除目录： $dirName<br />\n";
    }
}

if ( array_key_exists( 'clear' , $_GET ) ) {
    print 'debug - clear report';
    //Config::StopAll();
    if ( file_exists( 'report' ) )
        delDirAndFile( 'report' );
}
$reportfile = "report_{$_GET['filter']}";
if ( file_exists( $reportfile ) ) {
    //	rmdir('report');
    $reports = scandir( $reportfile );
    /*自己和父节点*/
    print 'on batch run, please waiting : ' . ( sizeof( $reports ) - 2 );
    return;
} else {
    mkdir( $reportfile );
}

if ( file_exists( "./coverage/source.js" ) ) {
    if ( unlink( "./coverage/source.js" ) ) echo "成功删除文件：source.js";
}
source();

if ( file_exists( "covreport.html" ) ) {
    if ( unlink( "covreport.html" ) ) echo "成功删除覆盖率报告文件： covreport.html<br />\n";
}
if ( file_exists( "jshintReport.html" ) ) {
    if ( unlink( "jshintReport.html" ) ) echo "成功删除: jshintReport.html<br />\n";
}
exec("python ../lib/jshunter_1.2.0.1/jshunter_dev/jshunter/hint.py jshintReport.html ../../../_src", $back);
echo "jshint: ".$back."<br />\n";
/*记录运行时信息*/
$b = array_key_exists( 'browser' , $_GET ) ? $_GET[ 'browser' ] : 'all';

//if ( array_key_exists( 'cov' , $_GET ) ){


if ( $b != 'all' ) {
    run( $b , true );
} else {
    Config::StopAll(); //添加启动前结束浏览器步骤
    $browsers = array_key_exists( 'browserSet' , $_GET )?Config::getBrowserSet($_GET[ 'browserSet' ]):Config::$BROWSERS;
    foreach ( $browsers as $b => $i ) {
        run( $b );
        sleep(40);
    }
}
?>