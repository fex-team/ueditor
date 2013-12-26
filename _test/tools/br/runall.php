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
    $host = $debug ? 'localhost' : $browser[0];
    $path = $debug
            ? 'C:\\Documents and Settings\\shenlixia01\\Local Settings\\Application Data\\Google\Chrome\\Application\\chrome.exe'
            : $browser[ 1 ];
    $browserSet = array_key_exists( 'browserSet' , $_GET )?"^&browserSet=".$_GET[ 'browserSet' ]:'';

    $url = "http://" . $_SERVER[ 'SERVER_ADDR' ] . ( $debug ? "" : ":8089" )
           . substr( $_SERVER[ 'PHP_SELF' ] , 0 , -11 ) . "/list.php?batchrun=true^&browser=$b".$browserSet;
    if ( !array_key_exists( "ci" , $_GET ) )
        $url .= "^&mail=true";

    //如果配置的数据有该浏览器名字的字段,就是使用这个字段的值来作为filter的值,如果没有,就使用filter字段的值
    //一次filter中的用例过多,会导致一些性能低的浏览器内存不够,所以分开跑,以filterRun标注
    if(array_key_exists($b,Config::$filterSet)){
//        $filterR = Config::$filterSet[$b];
        $url .= "^&filterRun={".Config::$filterSet[$b]."}";
    }else if(array_key_exists(  "filter" , $_GET  )){
//        $filterR = $_GET['filter'];
        $url .= "^&filterRun={$_GET['filter']}";
    }
    if(array_key_exists(  "filter" , $_GET  )){
            $url .= "^&filter={$_GET['filter']}";
    }
    if(array_key_exists( 'bConfig' , $_GET )){
        $url .= "^&bConfig={$_GET['bConfig']}";
    }
    if ( array_key_exists( 'cov' , $_GET ) )
            $url .= "^&cov={$_GET['cov']}";
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
     //添加启动前结束浏览器步骤

    $THIS_BROWSERS = null;
    if(array_key_exists( 'bConfig' , $_GET )){
        $THIS_BROWSERS =  Config::$BROWSERS_SET[$_GET['bConfig']];
        Config::StopAll($_GET['bConfig']);
    }
    if($THIS_BROWSERS === null){
        $THIS_BROWSERS =  Config::$BROWSERS_SET['basic'];
        Config::StopAll('basic');
    }
    $browsers = array_key_exists( 'browserSet' , $_GET )?Config::getBrowserSet($_GET[ 'browserSet' ]):$THIS_BROWSERS;

    foreach ( $browsers as $b => $i ) {
        run( $b );
        sleep(60);
    }
}
?>