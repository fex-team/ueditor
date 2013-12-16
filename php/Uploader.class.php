<?php
/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-7-18
 * Time: 上午11: 32
 * UEditor编辑器通用上传类
 */
class Uploader
{
    private $fileField;            //文件域名
    private $file;                 //文件上传对象
    private $config;               //配置信息
    private $oriName;              //原始文件名
    private $fileName;             //新文件名
    private $fullName;             //完整文件名,即从当前配置目录开始的URL
    private $fileSize;             //文件大小
    private $fileType;             //文件类型
    private $stateInfo;            //上传状态信息,
    private $stateMap = array(    //上传状态映射表，国际化用户需考虑此处数据的国际化
        "SUCCESS" ,                //上传成功标记，在UEditor中内不可改变，否则flash判断会出错
        // "文件大小超出 upload_max_filesize 限制" ,
        '\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u9650\u5236',
        // "文件大小超出 MAX_FILE_SIZE 限制" ,
        '\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u9650\u5236',
        // "文件未被完整上传" ,
        '\u6587\u4ef6\u672a\u88ab\u5b8c\u6574\u4e0a\u4f20',
        // "没有文件被上传" ,
        '\u6ca1\u6709\u6587\u4ef6\u88ab\u4e0a\u4f20',
        // "上传文件为空" ,
        '\u4e0a\u4f20\u6587\u4ef6\u4e3a\u7a7a',
//        "POST" => "文件大小超出 post_max_size 限制" ,
        'POST' => '\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u9650\u5236',
        // "SIZE" => "文件大小超出网站限制" ,
        'SIZE' => '\u6587\u4ef6\u5927\u5c0f\u8d85\u51fa\u7f51\u7ad9\u9650\u5236',
        // "TYPE" => "不允许的文件类型" ,
        'TYPE' => '\u4e0d\u5141\u8bb8\u7684\u6587\u4ef6\u7c7b\u578b',
        // "DIR" => "目录创建失败" ,
        'DIR' => '\u76ee\u5f55\u521b\u5efa\u5931\u8d25',
        // "IO" => "输入输出错误" ,
        'IO' => '\u8f93\u5165\u8f93\u51fa\u9519\u8bef',
        //"UNKNOWN" => "未知错误" ,
        'UNKNOWN'=>'\u672a\u77e5\u9519\u8bef',
        // "MOVE" => "文件保存时出错"
        'MOVE' => '\u6587\u4ef6\u4fdd\u5b58\u65f6\u51fa\u9519'
    );

    /**
     * 构造函数
     * @param string $fileField 表单名称
     * @param array $config  配置项
     * @param bool $base64  是否解析base64编码，可省略。若开启，则$fileField代表的是base64编码的字符串表单名
     */
    public function __construct( $fileField , $config , $base64 = false )
    {
        $this->fileField = $fileField;
        $this->config = $config;
        $this->stateInfo = $this->stateMap[ 0 ];
        $this->upFile( $base64 );
    }

    /**
     * 上传文件的主处理方法
     * @param $base64
     * @return mixed
     */
    private function upFile( $base64 )
    {
        //处理base64上传
        if ( "base64" == $base64 ) {
            $content = $_POST[ $this->fileField ];
            $this->base64ToImage( $content );
            return;
        }

        //处理普通上传
        $file = $this->file = $_FILES[ $this->fileField ];
        if ( !$file ) {
            $this->stateInfo = $this->getStateInfo( 'POST' );
            return;
        }
        if ( $this->file[ 'error' ] ) {
            $this->stateInfo = $this->getStateInfo( $file[ 'error' ] );
            return;
        }
        if ( !is_uploaded_file( $file[ 'tmp_name' ] ) ) {
            $this->stateInfo = $this->getStateInfo( "UNKNOWN" );
            return;
        }

        $this->oriName = $file[ 'name' ];
        $this->fileSize = $file[ 'size' ];
        $this->fileType = $this->getFileExt();

        if ( !$this->checkSize() ) {
            $this->stateInfo = $this->getStateInfo( "SIZE" );
            return;
        }
        if ( !$this->checkType() ) {
            $this->stateInfo = $this->getStateInfo( "TYPE" );
            return;
        }
        $this->fullName = $this->getFolder() . '/' . $this->getName();
        if ( $this->stateInfo == $this->stateMap[ 0 ] ) {
            if ( !move_uploaded_file( $file[ "tmp_name" ] , $this->fullName ) ) {
                $this->stateInfo = $this->getStateInfo( "MOVE" );
            }
        }
    }

    /**
     * 处理base64编码的图片上传
     * @param $base64Data
     * @return mixed
     */
    private function base64ToImage( $base64Data )
    {
        $img = base64_decode( $base64Data );
        $this->fileName = time() . rand( 1 , 10000 ) . ".png";
        $this->fullName = $this->getFolder() . '/' . $this->fileName;
        if ( !file_put_contents( $this->fullName , $img ) ) {
            $this->stateInfo = $this->getStateInfo( "IO" );
            return;
        }
        $this->oriName = "";
        $this->fileSize = strlen( $img );
        $this->fileType = ".png";
    }

    /**
     * 获取当前上传成功文件的各项信息
     * @return array
     */
    public function getFileInfo()
    {
        return array(
            "originalName" => $this->oriName ,
            "name" => $this->fileName ,
            "url" => $this->fullName ,
            "size" => $this->fileSize ,
            "type" => $this->fileType ,
            "state" => $this->stateInfo
        );
    }

    /**
     * 上传错误检查
     * @param $errCode
     * @return string
     */
    private function getStateInfo( $errCode )
    {
        return !$this->stateMap[ $errCode ] ? $this->stateMap[ "UNKNOWN" ] : $this->stateMap[ $errCode ];
    }

    /**
     * 重命名文件
     * @return string
     */
    private function getName()
    {
        $count = 0;
        $dir = $this->getFolder();
        $timeStamp = time();
        if ($format = $this->config[ "fileNameFormat" ]) {

            $ext = $this->getFileExt();
            $oriName = substr($this->oriName, 0, strrpos($this->oriName, '.'));
            $randNum = rand(1, 10000000000);

            //过滤非法字符
            $format = preg_replace("/[\|\?\"\<\>\/\*\\\\]+/", '', $format);

            $d = split('-', date("Y-y-m-d-H-i-s"));
            $format = str_replace("{yyyy}", $d[0], $format);
            $format = str_replace("{yy}", $d[1], $format);
            $format = str_replace("{mm}", $d[2], $format);
            $format = str_replace("{dd}", $d[3], $format);
            $format = str_replace("{hh}", $d[4], $format);
            $format = str_replace("{ii}", $d[5], $format);
            $format = str_replace("{ss}", $d[6], $format);
            $format = str_replace("{time}", $timeStamp, $format);
            $format = str_replace("{filename}", $oriName, $format);

            if(preg_match("/\{rand\:([\d]*)\}/i", $format, $matches)) {
                $format = preg_replace("/\{rand\:[\d]*\}/i", substr($randNum, 0, $matches[1]), $format);
            }

            //过滤非法字符
            $format = preg_replace("/[\|\?\"\<\>\/\*\\\\]+/", '', $format);

            $fileName = $format.$ext;
            while (file_exists($dir.'/'.$fileName)){
                $fileName = $format.'_'.(++$count).$ext;
            }
        } else {
            do{
                $fileName = time().rand(1, 10000).$this->getFileExt();
            } while (file_exists($dir.'/'.$fileName));
        }
        return $this->fileName = $fileName;
    }

    /**
     * 文件类型检测
     * @return bool
     */
    private function checkType()
    {
        return in_array( $this->getFileExt() , $this->config[ "allowFiles" ] );
    }

    /**
     * 文件大小检测
     * @return bool
     */
    private function  checkSize()
    {
        return $this->fileSize <= ( $this->config[ "maxSize" ] * 1024 );
    }

    /**
     * 获取文件扩展名
     * @return string
     */
    private function getFileExt()
    {
        return strtolower( strrchr( $this->file[ "name" ] , '.' ) );
    }

    /**
     * 按照日期自动创建存储文件夹
     * @return string
     */
    private function getFolder()
    {
        $pathStr = $this->config[ "savePath" ];
        if ( strrchr( $pathStr , "/" ) != "/" ) {
            $pathStr .= "/";
        }
        $pathStr .= date( "Ymd" );
        if ( !file_exists( $pathStr ) ) {
            if ( !mkdir( $pathStr , 0777 , true ) ) {
                return false;
            }
        }
        return $pathStr;
    }
}