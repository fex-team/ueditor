<?php

class Config
{
    public static $BROWSERS= array(
        'ie8supp' => array('10.81.58.64@8500', "C:\\Program Files\\Internet Explorer\\iexplore.exe")
    , 'ie9main' => array('10.81.96.46', "C:\\Program Files\\Internet Explorer\\iexplore.exe")
    ,'firefox' => array('10.81.58.86@8500', "C:\\Program Files\\mozilla firefox\\firefox.exe")
    ,'chrome' => array('10.81.58.63@8500', "C:\\Documents and Settings\\geqa1\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe")
    ,'ie8main' => array('10.81.58.64@8500', "C:\\Program Files\\Internet Explorer\\iexplore.exe")
    , 'ie9supp' => array('10.81.96.46', "C:\\Program Files\\Internet Explorer\\iexplore.exe")
//      , 'ie7' => array( '10.81.58.87@8500' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
//      , 'opera' => array( '10.81.58.64@8500' , "C:\\Program Files\\Opera\\opera.exe" )
//      , 'safari' => array( '10.81.58.63@8500' , "C:\\Program Files\\Safari\\Safari.exe" )
//      , '360ie8' => array('10.81.58.64@8500',"C:\\Program Files\\360\\360se\\360SE.exe")
//      , '360ie7' => array( '10.81.58.87@8500' , "C:\\Program Files\\360\\360se\\360SE.exe" )
//      , 'ie6' => array( '10.81.58.86@8500' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
    );
    public static $BROWSERS_SET  = array(
        'plugins' => array(
            'ie8supp'
            , 'ie9main'
            ,'firefox'
            ,'chrome'
            ,'ie8main'
            , 'ie9supp'
    ),

        'basic' => array(
            'ie8'
             , 'ie9'
            ,'firefox'
            , 'chrome'
       ) );
    //如果这里有设置,list页面将按照这里的设置跑用例,没有的话,将使用runall传入的filter参数
    public static $filterSet = array(
        'ie8main' => 'plugins,!plugins/t,!plugins/w,!plugins/s;plugins/source',
        'ie8supp' => 'plugins/t;plugins/w;plugins/s',
        'ie9main' => 'plugins,!plugins/t,!plugins/w,!plugins/s;plugins/source',
        'ie9supp' => 'plugins/t;plugins/w;plugins/s',
    );
    public static $DEBUG = false;

    public static $HISTORY_REPORT_PATH = '/report';

    public static function getBrowserSet($browsers)
    {
        if (strcmp($browsers, '') == 0) {
            return Config::$BROWSERS['basic'];
        }
        $selectedBrowsers = array();
        $browserName = explode('_', $browsers);
//        foreach ($browserName as $s) {
//            if (array_key_exists($s, Config::$BROWSERS)) ;
//            {
//                $selectedBrowsers[$s] = Config::$BROWSERS[$s];
//            }
//        }
//        return $selectedBrowsers;
        return $browserName;
    }

    public static function StopAll($BROWSERSSET)
    {
        if(!$BROWSERSSET){
            $BROWSERSSET ='basic';
        }
        $hostarr = array();
        $browsers = Config::$BROWSERS_SET[$BROWSERSSET];
        foreach ($browsers as $b ) {
            $host = Config::$BROWSERS[$b][0];
            if (array_search($host, $hostarr))
                continue;
            array_push($hostarr, $host);
            require_once 'lib/Staf.php';
            Staf::process_stop('', $host, true);
            Staf::process("free all");
        }
    }

    public static function StopOne($key)
    {
        $host = Config::$BROWSERS[$key][0];
        require_once 'lib/Staf.php';
        Staf::process_stop('', $host, true);
    }

    /**
     * 源码路径配置，会在所有位置寻找源码
     * @var ArrayIterator::String
     */
    public static $SOURCE_PATH = array("../../../_src/");

    public static $test_PATH = "../../../_test/";

    /**
     * 覆盖率相关源码所在路径，如果路径中没有找到会回到$SOURCH_PATH中查找
     * @var string
     */
    public static $COVERAGE_PATH = "../../coverage/";
    /**
     * 设置在源码路径下没有同名文件对应的测试文件
     * @var array
     */
    public static $special_Case = array('plugins/ueditor.config.js' => '../../../ueditor.config.js');
}

?>