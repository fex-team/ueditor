module( ".path" );

/*trace 879*/
test( '路径查找测试', function () {
    equal( UE.getUEBasePath( 'http://www.baidu.com/', './ueditor.config.js' ), 'http://www.baidu.com/', '路径测试-当前目录下' );
} );