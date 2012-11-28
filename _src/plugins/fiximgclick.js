///import core
///commands 修复chrome下图片不能点击的问题
///commandsName  FixImgClick
///commandsTitle  修复chrome下图片不能点击的问题
//修复chrome下图片不能点击的问题
//todo 可以改大小
UE.plugins['fiximgclick'] = function() {
    var me = this;
    if ( browser.webkit ) {
        me.addListener( 'click', function( type, e ) {
            if ( e.target.tagName == 'IMG' ) {
                var range = new dom.Range( me.document );
                range.selectNode( e.target ).select();

            }
        } );
    }
};