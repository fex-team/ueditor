/**
 * 文库文档资源解析
 * 该文件提供了文库后端的中间格式转换为html结构的支持
 * User: hancong03@baidu.com
 * Date: 13-7-1
 * Time: 上午10:21
 */

(function(){

    /* base status */

        //debug模式
    var DEBUG = false,
        //标签名 白名单
        TagList = UE._wk_whitelist,
        blockquote_className = UE.BLOCKQUOTE_FLAG,
        //标签名mapping
        ATTR = {
            tagName: 't',
            className: 'r',
            children: 'c'
        };

    var uNode = UE.uNode,
        currentBlock = null;


    /* function */

    /**
     * 转换类
     * @param source 文库后端中间格式的json对象
     * @returns 解析完成之后的HTML代码片段
     */
    UE.parseSource = function( source, callback ){

        var blockNum = -1;

        if( isDocmentBlock( source ) ) {

            blockNum = getBlockNum( source );

            //记录当前编辑的blockNum
            UE._wk_blockNum = blockNum;

            //当前区块状态
            currentBlock = {
                styles: parseStyle( source )
            };

        } else {
            //源数据没有区块标识
            throw new Error('faild source, document block error');
        }

        //执行转换
        var node = transform( source );

        toHtml( node, callback );

    };

    /**
     * 检测指定的source json对象是否是block(独立的区块)
     */
    function isDocmentBlock( source ) {
        return 'blockNum' in source;
    }

    function getBlockNum( source ) {
            return source.blockNum;
    }

    /**
     * 区块级样式解析
     * @param source 源数据
     * @returns 以className为键, css规则为值的map对象.
     */
    function parseStyle( source ) {

        var styles = source.style,
            map = {};

        delete source.style;

        styles.forEach(function( style ){

            for( var className in style ) {

                if( style.hasOwnProperty( className ) ) {

                    map[ className ] = style[ className ];

                }

            }

        });

        return map;

    }

    /**
     * 转换函数
     * @param source 源数据
     * @param currentBlock 当前区块数据容器
     * @return HTML String, 符合w3c 规范的html字符串片段
     */
    function transform( source ) {

        var tagName = source[ ATTR['tagName'] ],
            classNames = source[ ATTR['className'] ],
            children = source[ ATTR['children'] ],
            _selfFn = arguments.callee,
            node = null;

        //合法性检测
        if( !isLegalTag( tagName ) ) {
            if( DEBUG ) {
                throw new Error( 'Illegal tag, tag name is: ' + tagName );
            } else {
                return null;
            }
        }

        node = createElement( tagName );
        classNames && node.setAttr('class', Array.isArray(classNames) ? classNames.join(" ") : classNames );

        validAttr( node, source );

        if( !children ) {
            return node;
        }

        if( isArray( children ) ) {

            children.forEach( function( childSource ){

                var childNode = _selfFn( childSource );

                childNode && node.appendChild( childNode );

            } );

        } else if( isString( children ) ) {

            node.appendChild( createText( children ) );

        } else if( isPlainObject( children ) ) {

            var childNode = _selfFn( children );

            childNode && node.appendChild( childNode );

        } else {
            throw new Error('unkonw child type');
        }

        return node;

    }

    /**
     * 转换为html字符串
     */
    function toHtml( node, callback ) {

        var children = node.children,
            lastIndex = -1,
            htmlArr = [];

        if( !node.children || !node.children.length  ) {
            callback( node.toHtml() );
            return;
        }

        lastIndex = node.children.length;

        node.children.forEach(function( childNode, index ){

            getHtml( childNode, index, htmlArr );

        });

        function getHtml( childNode, index, htmlArr ) {


            window.setTimeout( function(){

                lastIndex--;
                htmlArr[ index ] = childNode.toHtml();
                childNode.parentNode = null;

                if( !lastIndex ) {

                    //to string
                    callback( htmlArr.join('') );

                }

            }, 0 );

        }

    }

    /**
     * 给定的标签名是否是合法的标签名
     * 依赖白名单来进行判断
     * @param tagName 表签名
     * @return <boolean> 是否合法
     */
    function isLegalTag( tagName ) {
        return tagName in TagList;
    }

    function createElement( tagName ) {
        return node = new uNode({
            type:'element',
            children:[],
            tagName: tagName
        });
    }

    function createText( content ) {
        return new UE.uNode({
            type:'text',
            'data':utils.unhtml(content || '')
        })
    }

    /**
     * 为指定node应用样式
     * 如果不存在指定的样式, 则什么也不做
     * @param node 节点
     * @returns 已应用指定样式后的节点
     */
    function applyStyle( node ) {

        var styles = currentBlock.styles,
            classNames = node.getClasses(),
            //未转换的样式名称
            unTransClassNames = [],
            style = [];

        if( !classNames || !classNames.length ) {
            return node;
        } else {

            classNames.forEach( function( className ){

                //不处理“引用”的样式名称
                if( className === blockquote_className ) {
                    unTransClassNames.push( className );
                    return;
                }


                if( styles[ className ] ) {

                    //样式存在， 则转换到style上去
                    style.push( styles[ className ] );

                } else {

                    //不存在样式对照表， 则保留该className
                    unTransClassNames.push( className );

                }

            } );

            //应用style
            style.length && node.setAttr( 'style', style.join(';') );

            //清除已转换过的class
            if( unTransClassNames.length ) {
                node.setAttr( 'class', unTransClassNames.join(" ") );
            } else {
                node.setAttr('class');
            }

        }

    }

    /**
     * 通过给定的源数据验证该node节点的属性, 如果该属性符合规则(通过白名单来确定), 则附加该属性到节点上, 否则, 抛弃该属性
     * @param node 需要附加属性的节点
     * @param source 源数据
     * @returns node, 返回作为第一个参数传递进来的node节点, 该节点可能包含有属性值
     */
    function validAttr( node, source ) {

        var attrList = TagList[ node.tagName ],
            tmp = null,
            __trans = attrList['__trans'];

        for( var attrName in source ) {

            if( attrName.indexOf('__') === 0 ) {
                continue;
            }

            //属性转换
            if( __trans && __trans[ attrName ] ) {
                tmp = source[ attrName ];
                delete source[ attrName ];
                attrName = __trans[ attrName ];
                source[ attrName ] = tmp;
                tmp = null;
            }

            if( source.hasOwnProperty( attrName ) && attrList[ attrName ] ) {

                node.setAttr( attrName, source[ attrName ] + "" );

            }

        }

    }

    function isArray( val ) {
        return Object.prototype.toString.call( val ) === '[object Array]';
    }

    function isString( val ) {
        return Object.prototype.toString.call( val ) === '[object String]';
    }

    function isPlainObject( val ) {
        return val.constructor === Object;
    }

    function save() {

    }

})();
