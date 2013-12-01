<?php
require_once 'config.php';
/**
 * for case running
 *
 * @author bell
 */
class Kiss
{
    public $projroot;
    /**
     * case name
     * @var string
     */
    public $name;

    public $path;

    private $ext;
    /**
     * type of case is core or another
     * @var boolean
     */
    public $is_core;
    /**
     * true means qunit, false means jsspec
     * @var boolean
     */
    public $js_frame;
    /**
     * case id shown in html
     * @var string
     */
    public $case_id;

    /**
     * 某些用例是空的，应该直接过滤掉
     * @var unknown_type
     */
    public $empty = false;

    /**
     *
     * @param string $projroot root of project
     * @param string $name namespace of case
     */
    function __construct( $projroot = '../../../' , $name = 'baidu.core.dom.domUtils' , $ext = '' )
    {

        $this->projroot = $projroot;
        $this->name = $name;

        $this->ext = $ext;
        if ( strlen( $ext ) > 0 ) {
            $ns = explode( '.' , $name );

            $n = array_pop( $ns );
            array_push( $ns , $ext , $n );
            $path = implode( '/' , $ns );
        } else {
            //$path = implode( '/' , explode( '.' , $name ) );
            $path = $name;  //为了支持xx.xx.js类型的文件名而修改 田丽丽
        }
//        $dir = explode('/',$path);
//        if($dir[0]=='dialogs')
//            $this->path = $this->projroot . '_test/' . $path . '.html';
//        else
            $this->path = $this->projroot . '_test/' . $path . '.js';
        if ( filesize( $this->path ) < 20 ) {
            $this->empty = true;
            return;
        }
        $this->case_id = 'id_case_' . join( '_' , explode( '.' , $name ) );
    }


    public function print_js( $cov, $release = false )
    {
        print '<script type="text/javascript" src="js/jquery-1.5.1.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/tangram.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/testrunner.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/ext_qunit.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/UserAction.js"></script>' . "\n";
        print '<link media="screen" href="css/qunit.css" type="text/css" rel="stylesheet" />' . "\n";
        print '<link  href="../../../themes/default/_css/ueditor.css" type="text/css" rel="stylesheet" />' . "\n";
        print '<script type="text/javascript" src="js/tools.js"></script>' . "\n";
      
        print '<script type="text/javascript" charset="utf-8" src="../../../third-party/SyntaxHighlighter/shCore.js"></script>' . "\n";        //                print '<script type="text/javascript" charset="utf-8" src="../../ueditor.config_src.js"></script>' . "\n";
        print '<script type="text/javascript" charset="utf-8" src="../../../ueditor.config.js"></script>' . "\n";


        /* load case source*/
        $importurl = "{$this->projroot}_test/tools/br/import.php?f=$this->name";
        if ( $cov ) $importurl .= '^&cov=true';
        print "<script type='text/javascript' src='".$importurl."' ></script>\n";

        /* load case and case dependents*/
        //$ps = explode( '.' , $this->name );
        $ps = explode( '/' , $this->name ); //为了支持xx.xx.js类型的文件名而修改 田丽丽
        array_pop( $ps );
        array_push( $ps , 'tools' );
        
        if ( file_exists( $this->projroot . '_test/' . implode( '/' , $ps ) . '.js' ) ) //没有就不加载了
            print '<script type="text/javascript" src="' . $this->projroot . '_test/' . implode( '/' , $ps ) . '.js"></script>' . "\n";
        print '<script type="text/javascript" src="' . $this->path . '"></script>' . "\n";


    }
    public function print_all_js( $cov, $release = false )
    {
        print '<script type="text/javascript" src="js/jquery-1.5.1.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/tangram.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/testrunner.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/ext_qunit.js"></script>' . "\n";
        print '<script type="text/javascript" src="js/UserAction.js"></script>' . "\n";
        print '<link media="screen" href="css/qunit.css" type="text/css" rel="stylesheet" />' . "\n";
        print '<link  href="../../../themes/default/_css/ueditor.css" type="text/css" rel="stylesheet" />' . "\n";
        print '<script type="text/javascript" src="js/tools.js"></script>' . "\n";

        print '<script type="text/javascript" charset="utf-8" src="../../../third-party/SyntaxHighlighter/shCore.js"></script>' . "\n";

        print '<script type="text/javascript" charset="utf-8" src="../../../ueditor/ueditor.config.js"></script>' . "\n";


        /* load case source*/
        $importurl = "{$this->projroot}ueditor/ueditor.all.min.js";
        print "<script type='text/javascript' src='".$importurl."' ></script>\n";

        /* load case and case dependents*/
        //$ps = explode( '.' , $this->name );
        $ps = explode( '/' , $this->name ); //为了支持xx.xx.js类型的文件名而修改 田丽丽
        array_pop( $ps );
        array_push( $ps , 'tools' );

        if ( file_exists( $this->projroot . '_test/' . implode( '/' , $ps ) . '.js' ) ) //没有就不加载了
            print '<script type="text/javascript" src="' . $this->projroot . '_test/' . implode( '/' , $ps ) . '.js"></script>' . "\n";
        print '<script type="text/javascript" src="' . $this->path . '"></script>' . "\n";


    }
    public function match( $matcher )
    {
        if ( $matcher == '*' )
            return true;
        $len = strlen( $matcher );

        /**
         * 处理多选分支，有一个成功则成功，filter后面参数使用|切割
         * @var unknown_type
         */
        $as = explode( ';' , $matcher );
        if ( sizeof( $as ) > 1 ) {

            //这里把或的逻辑改成与
            foreach ( $as as $matcher1 ) {
                if ( $this->match( $matcher1 ) )
                    return true;
            }
            return false;
        }
        $ms = explode( ',' , $matcher );
        if ( sizeof( $ms ) > 1 ) {

            //这里把或的逻辑改成与
            foreach ( $ms as $matcher1 ) {
                if ( !$this->match( $matcher1 ) )
                    return false;
            }
            return true;
        }

        /**
         * 处理反向选择分支
         */
        if ( substr( $matcher , 0 , 1 ) == '!' ) {
            $m = substr( $matcher , 1 );
            if ( substr( $this->name , 0 , strlen( $m ) ) == $m )
                return false;
            return true;
        }

        if ( $len > strlen( $this->name ) ) {
            return false;
        }
        return substr( $this->name , 0 , $len ) == $matcher;
    }

    public static function listcase( $filter = "*" , $filterRun = '*',$projroot = '../../../' )
    {
        $srcpath = $projroot . '_src/';
        $testpath = $projroot . '_test/';
        require_once 'filehelper.php';
        $caselist = getSameFile( $srcpath , $testpath , '' );
        sort($caselist,SORT_STRING);
        foreach ( $caselist as $caseitem ) {
            /*将文件名替换为域名方式，替换/为.，移除.js*/
            //$name = str_replace( '/' , '.' , substr( $caseitem , 0 , -3 ) );
            $name = substr( $caseitem , 0 , -3 );  //为了支持xx.xx.js类型的文件名而修改 田丽丽
            $c = new Kiss( $projroot , $name );
            if ( $c->empty )
                continue;
            if ( $c->match( $filterRun ) ) {
                $newName = explode( '\\.' , $name );
                $newName = $newName[ count( $newName ) - 1 ];
                print( "<a href=\"run.php?case=$name\" id=\"$c->case_id\" class=\"jsframe_qunit\" target=\"_blank\" title=\"$name\" onclick=\"run('$name');\$('#id_rerun').html('$name');return false;\">"
                       /*过长的时候屏蔽超出20的部分，因为隐藏的处理，所有用例不能直接使用标签a中的innerHTML，而应该使用title*/
                       . $newName . "</a>\n" );
            }
        }
        /**
         * 设置在源码路径下没有同名文件对应的测试文件
         */
        foreach(Config::$special_Case as $s_caseitem => $s_source){
            //取形如 'plugins/config_test.js' 中 'plugins/config_test'部分
            $s_newName = str_replace(".js","", $s_caseitem );
            print( "<a href=\"run.php?case=$s_newName\" id=\"id_case_".str_replace('.','_',$s_newName)."\" class=\"jsframe_qunit\" target=\"_blank\" title=\"$s_newName\" onclick=\"run('$s_newName');\$('#id_rerun').html('$s_newName');return false;\">". $s_newName . "</a>\n" );
        }
    }

    public static function listSrcOnly( $print = true , $projroot = '../../../' )
    {
        $srcpath = $projroot . '_src/';
        $testpath = $projroot . '_test/';
        require_once 'filehelper.php';
        $caselist = getSameFile( $srcpath , $testpath , '' );
        $srclist = getSrcOnlyFile( $srcpath , $testpath , '' );
        $srcList = array();
        foreach ( $srclist as $case ) {
            if ( in_array( $case , $caselist ) )
                continue;
            $name = str_replace( '/' , '.' , substr( $case , 0 , -3 ) );
            $tag = "<a class=\"jsframe_qunit\" title=\"$name\">" . ( strlen( $name ) > 20 ? substr( $name , 6 )
                    : $name ) . "</a>";
            array_push( $srcList , $tag );
            if ( $print )
                echo $tag;
        }
        return $srcList;
    }
}

?>