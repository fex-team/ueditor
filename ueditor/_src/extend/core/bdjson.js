/**
 * 根据UNode对象转换成文库json格式数据
 */
(function(){

        //关键字映射
    var KEY_MAPPING = {
            blockNum: 'blockNum',
            style: 'style',
            nodeName: 't',
            className: 'r',
            children: 'c',
            width: 'w',
            height: 'h'
        },
        //白名单
        whilelist = UE._wk_whitelist;

    UE.parseToBDJson = function( root ){

        var contentJson = {};

        transToBlock( root );

        //解析块节点
        parseBlockContent( contentJson );

        //节点转换
        parseNode( root, contentJson );

        return contentJson;

    };

    /**
     * 解析给定节点
     * @param node {UNode} 需要解析的节点对象
     * @param jsonObj {PlainObject} 与node对于的object容器对象
     */
    function parseNode( node, jsonObj, parentObj ) {

        if( node.type === 'element' ) {
            //白名单
            if( !isLegalNode( node ) ) {
                return;
            }

            parseNodeName( node, jsonObj );
            parseClassName( node, jsonObj );
            parseAttr( node, jsonObj );
            parseChild( node, jsonObj );
        } else {
            parseText( node, jsonObj, parentObj );
        }

    }

    /**
     * 解析给定节点的字节点
     */
    function parseChild( node, jsonObj ) {

        var childJsonObj = null;

        if( !node.children || !node.children.length ) {
            return;
        }

        childJsonObj = [];
        jsonObj[ KEY_MAPPING['children'] ] = childJsonObj;
        node = node.children;

        for( var i = 0, child; child = node[ i ]; i++ ) {

            childJsonObj.push( {} );
            parseNode( child, childJsonObj[ i ], jsonObj );

        }

    }

    /**
     * 解析块结构
     */
    function parseBlockContent( jsonObj ) {

        var blockNum = getBlockNum();

        /^\d+$/.test( blockNum ) && ( jsonObj[ KEY_MAPPING['blockNum'] ] = getBlockNum() );
        //style必须加上
        jsonObj[ KEY_MAPPING['style'] ] = [];

    }

    /**
     * 解析节点属性
     */
    function parseAttr( node, jsonObj ) {

        var legalAttrs = getLegalNodeAttrNames( node );

        for( var i = 0, attr; attr = legalAttrs[ i ]; i++ ) {

            if( node.hasAttr( attr ) ) {
                if(KEY_MAPPING[attr]) jsonObj[ KEY_MAPPING[attr] ] = node.getAttr( attr );
                else jsonObj[ attr ] = node.getAttr( attr );
            }

        }

    }

    /**
     * 解析节点名称
     */
    function parseNodeName( node, jsonObj ) {
        jsonObj[ KEY_MAPPING['nodeName'] ] = node.tagName;
    }

    /**
     * 解析节点的className。 如果该节点有className， 则把该节点的className解析到给定的json对象中
     * @param node {UNode} 需要解析的node对象
     * @param jsonObj {PlainObject} 该node对象所映射到的json对象
     */
    function parseClassName( node, jsonObj ) {

        var className = null;

        if( node.hasAttr('class') ) {
            jsonObj[ KEY_MAPPING['className'] ] = node.getAttr('class').split(/\s+/);
        }

    }

    /**
     * 解析给定的文本节点
     * @param node {UNode} 文本节点对象
     * @param jsonObj {PlainObject} 当前节点容器对象
     * @param parentObj {PlainObject} 父容器对象
     */
    function parseText( node, jsonObj, parentObj ) {

        //检测当前节点是否有兄弟节点
        if( !isUniqueChild( node ) ) {

            //没有兄弟节点， 则重置其父节点
            parentObj[ KEY_MAPPING['children'] ] = node.data;

        } else {

            //不是唯一的子节点， 则直接给该文本节点包一层span
            jsonObj[ KEY_MAPPING['nodeName'] ] = "span";
            jsonObj[ KEY_MAPPING['children'] ] = node.data;

        }

    }

    function transToBlock( node ) {

        if( node.type === 'root' ) {
            node.type = 'element';
            node.tagName = 'div';
        }

    }

    function getBlockNum() {
        return UE._wk_blockNum+"";
    }

    /**
     * 判断给定节点是否是合法节点
     * @returns {*}
     */
    function isLegalNode( node ) {
        return !!whilelist[ node.tagName ];
    }

    /**
     * 获取给定节点的合法属性名数组
     */
    function getLegalNodeAttrNames( node ) {

        var result = [],
            attrs = whilelist[ node.tagName ];

        if( attrs ) {
            for( var key in attrs ) {
                result.push( key );
            }
        }

        return result;

    }

    /**
     * 检测给定节点是否是其父节点的唯一子节点
     */
    function isUniqueChild( node ) {

        return !!( node.previousSibling() || node.nextSibling() );

    }


})();