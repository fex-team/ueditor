<?php
require_once  dirname( __FILE__ ) .'/../config.php';
/**
 * Created by JetBrains PhpStorm.
 * User: lisisi01
 * Date: 12-9-13
 * Time: 下午12:36
 * To change this template use File | Settings | File Templates.
 */

function source(){
    $sourcePath=dirname( __FILE__ ) .'/source.js';
    $as = array();
    $is = list_file(Config::$COVERAGE_PATH,$as);
    $string = 'function loadSource(){'."\n";
    $file = fopen($sourcePath,"a");
    if($file)
        fwrite($file,$string);
    else {
        print "fail read file";
        return '';
    }
    foreach($is as $i) {
        $path = explode(Config::$COVERAGE_PATH.'/', $i);
        $path = $path[1];
        if(file_exists($i)){
            $f = fopen($i,'r');
            while(!feof($f))
            {
                $s = fgets($f);
                if(!!strpos($s,'].source')){
                    $string='_$jscoverage[\''.$path.'\'] &&'.' (';
                    $string.=substr($s,0,-2).');'."\n";
                    if(!$file)
                        $file = fopen($sourcePath,"a");
                    fwrite($file,$string);
                    break;
                }
            }
        }
    }
    $string='}';
    if(!$file)
        $file = fopen($sourcePath,"a");
    fwrite($file,$string);
    fclose($file);
}

function list_file($dir,$as){
    $list = scandir($dir); // 得到该文件下的所有文件和文件夹
    foreach($list as $file){//遍历
        $file_location=$dir."/".$file;//生成路径
        if(is_dir($file_location) && $file!="." &&$file!=".."){ //判断是不是文件夹
            $as = list_file($file_location,$as); //继续遍历
        }
        else if(substr(basename($file), -3) == '.js' && basename($file)!="jscoverage.js")
            array_push($as, $file_location);
    }
    return $as;
}
?>