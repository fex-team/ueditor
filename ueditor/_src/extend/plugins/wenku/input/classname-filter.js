/**
 * 文库className输入过滤
 * 该过滤负责把className转换为inline style
 * User: hancong03@biadu.com
 * Date: 13-7-4
 * Time: 下午2:18
 * To change this template use File | Settings | File Templates.
 */

UE.plugins['classnameinputfilter'] = function () {
    var me = this,
        PAGE_BREAK = "_ueditor_page_break_tag_",
        filterClassName = UE._wk_filterClassName;

    /**
     * 分页符 和 引用 转换
     */
    me.addWkInputRule(function (root) {

        root.traversal(function (node) {

            if (node.type == 'element') {

                //分页符转换
                if( isPageBreak( node ) ) {
                    parsePageBreak( node );
                } else {

                    //清理非法className
                    filterClassName( node );

                }

            }

        });

    });

    /* 分页符相关 */

    function isPageBreak( node ) {
        return node.tagName === 'br' && node.getAttr('dataType') === 'page';
    }

    function parsePageBreak( node ) {

        //把包裹的父节点干掉
        node = node.parentNode;
        node.children = [];
        node.type = 'text';
        node.tagName = null;
        node.setAttr('');
        node.data = PAGE_BREAK;

    }

}