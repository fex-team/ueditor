///import core
///commands 段落格式,居左,居右,居中,两端对齐
///commandsName  JustifyLeft,JustifyCenter,JustifyRight,JustifyJustify
///commandsTitle  居左对齐,居中对齐,居右对齐,两端对齐
/**
 * @description 居左右中
 * @name baidu.editor.execCommand
 * @param   {String}   cmdName     justify执行对齐方式的命令
 * @param   {String}   align               对齐方式：left居左，right居右，center居中，justify两端对齐
 * @author zhanyi
 */
UE.plugins['justify']=function(){
    var me=this,
        tags = [ 'p', ',h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ];

    UE.commands['justify'] = {
        execCommand:function (cmdName, align) {
            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true),
                classList = null;

            if( !node ) {
                return;
            }

            classList = node.classList;

            for( var key in UE.singleAlign ) {

                classList.remove( UE.singleAlign[ key ] );

            }

            classList.add( UE.singleAlign[ align ] );

        },
        queryCommandValue:function () {
            var node = domUtils.findParentByTagName( this.selection.getStart(), tags, true),
                classList = null,
                alignClass = 'left';

            if( !node ) {
                return 'left';
            }

            classList = node.classList;

            for( var key in UE.singleAlign ) {

                if( classList.contains( UE.singleAlign[ key ] ) ) {
                    alignClass = key;
                    break;
                }

            }

            return alignClass;

        },
        queryCommandState:function () {
            var start = this.selection.getStart(),
                cell = start && domUtils.findParentByTagName(start, ["td", "th","caption"], true);

            return cell? -1:0;
        }

    };
};
