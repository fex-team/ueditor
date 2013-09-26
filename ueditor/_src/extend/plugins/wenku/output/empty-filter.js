/**
 * 过滤空P节点
 */

UE.plugins['emptynodeoutputfilter'] = function () {

    var me = this;

    me.addWkOutputRule(function (root) {

        root.traversal(function (node) {

            //无子节点，剔除该节点
            if( node.type==='element' && node.tagName === 'p' && node.children.length === 0) {

                node.parentNode.removeChild( node );

            }
            //子节点只有一个非分页符的br标签，剔除该节点
            if( node.type==='element' && node.tagName === 'p' &&
                node.children.length === 1 && node.children[0].tagName==='br' && !node.children[0].attrs['dataType'] ) {
                node.parentNode.removeChild( node );
            }

        });

    });

}