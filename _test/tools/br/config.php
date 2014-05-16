<?php
        class Config
        {
                public static $BROWSERS = array(
                    'ie8supp' => array( '10.94.26.94' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
                , 'ie11main' => array( '10.81.96.46' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )

                ,
                    'firefox' => array( '10.94.26.95' , "C:\\Program Files\\mozilla firefox\\firefox.exe" )
//                    'firefox' => array( '10.81.96.46@8500' , "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe" )
//                , '360ie8' => array('10.81.58.64@8500',"C:\\Program Files\\360\\360se\\360SE.exe")
//                , '360ie7' => array( '10.81.58.87@8500' , "C:\\Program Files\\360\\360se\\360SE.exe" )


//                , 'ie6' => array( '10.81.58.86@8500' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
//C:\Program Files\Google\Chrome\Application\chrome.exe
// "C:\Program Files\Mozilla Firefox\firefox.exe"
                , 'chrome' => array( '10.94.26.95' , "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" )
                ,
                    'ie8main' => array( '10.94.26.94' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
                , 'ie11supp' => array( '10.81.96.46' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
//                , 'ie7' => array( '10.81.58.87@8500' , "C:\\Program Files\\Internet Explorer\\iexplore.exe" )
//                , 'opera' => array( '10.81.58.64@8500' , "C:\\Program Files\\Opera\\opera.exe" )
//                , 'safari' => array( '10.81.58.63@8500' , "C:\\Program Files\\Safari\\Safari.exe" )
                );

                public static $DEBUG = false;

                public static $HISTORY_REPORT_PATH = '/report';

                public static function getBrowserSet($browsers){
                    if(strcmp($browsers,'')==0){
                        return Config::$BROWSERS;
                    }
                    $selectedBrowsers =array();
                    $browserName = explode('_',$browsers);
                    foreach($browserName as $s){
                        if(array_key_exists($s,Config::$BROWSERS));{
                            $selectedBrowsers[$s] =Config::$BROWSERS[$s];
                        }
                    }
                    return $selectedBrowsers;
                }

                public static function StopAll()
                {
                        $hostarr = array();
                        foreach ( Config::$BROWSERS as $b => $h ) {
                                $host = $h[ 0 ];
                                if ( array_search( $host , $hostarr ) )
                                        continue;
                                array_push( $hostarr , $host );
                                require_once 'lib/Staf.php';
                                Staf::process_stop( '' , $host , true );
                                Staf::process( "free all" );
                        }
                }
            public static function StopOne($key){
                $host = Config::$BROWSERS[$key][0];
                require_once 'lib/Staf.php';
                Staf::process_stop( '' , $host , true );
            }
                /**
                 * 源码路径配置，会在所有位置寻找源码
                 * @var ArrayIterator::String
                 */
                public static $SOURCE_PATH = array( "../../../_src/" );

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
            public static $special_Case =  array('plugins/ueditor.config.js'=>'../../../ueditor.config.js');
        }

?>