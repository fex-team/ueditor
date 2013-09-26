/**
 * 文库className输出过滤器
 * 该过滤器负责把inline style转换为className
 * User: hancong03@biaud.com
 * Date: 13-7-4
 * Time: 上午10:34
 */

UE.plugins['classnameoutputfilter'] = function () {
    var me = this,
        utils = UE.utils,
        CLASS_NAME_PREFIX = UEDITOR_CONFIG.CLASS_NAME_PREFIX || 'ext-',
        tmpNode = null,
        MERGE_FLAG = UE.MERGE_FLAG,
        PAGE_BREAK = '_ueditor_page_break_tag_',
        filterClassName = UE._wk_filterClassName,
        BLOCKQUOTE_FLAG = UE.BLOCKQUOTE_FLAG,
        tmpNodeStyle = null;

    /**
     * className输出过滤
     */
    me.addWkOutputRule(function (root) {

        tmpNode = document.createElement('div');
        tmpNode.style.display = 'none';
        document.body.appendChild( tmpNode );
        tmpNodeStyle = document.defaultView.getComputedStyle( tmpNode, null);

        root.traversal(function (node) {

            var breakNode = null;

            if (node.type == 'element') {

                if( !isBlockquote( node ) ) {

                    //图片处理
                    if( node.tagName === 'img' ) {

                        parseImage( node );

                    } else {
                        transform( node );
                    }

                    filterClassName( node );

                }

            //分页符转换
            } else if ( node.data === PAGE_BREAK ) {
                //为分页符新增一个包裹节点
                node.data = null;
                node.type = 'element';
                node.tagName = 'p';

                breakNode = UE.uNode.createElement( '<br>' );
                breakNode.attrs['dataType'] = 'page';
                node.appendChild( breakNode );

            }

        });

        tmpNodeStyle = null;
        tmpNode.parentNode.removeChild( tmpNode );
        tmpNode = null;

    });


    /**
     * style转className
     */
    function transform( node ) {

        var styles = null,
            classNames = [];

//        //清除不是分页符的换行符
//        if( node.tagName === 'br' && node.getAttr('dataType') !== 'page') {
//            node.parentNode.removeChild( node );
//        }


        node.setAttr('style');

    }

    /**
     * 处理图片
     * @param node 图片节点
     */
    function parseImage( node ) {

        var flag = null,
            wrap = null,
            parent = node.parentNode,
            placeholderNode = null;

        var getFlag = function(img){
            var flag;
            flag = img.getAttr('flag');
            if(flag) return flag;

            //cover
            if(img.hasAttr('alt')) return 'cover';

            var key, className, tags = [ 'p', 'h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ],
                parNode = domUtils.findParentByTagName(img, tags, true);
            if(parNode) {
                className = ' ' + parNode.getAttr('class') + ' ';
            }

            //note
            if(className.indexOf(UE.PICNOTE_FLAG)!=-1) return 'note';

            //float
            for(key in UE.singleImageFloat) {
                if(className.indexOf(UE.singleImageFloat[key])!=-1){
                    return 'float';
                }
            }
            return null;
        }

        //非独立节点, 则执行提取
        if( node.parentNode.children.length > 1 ) {

            placeholderNode = UE.uNode.createText('');
            flag = getFlag(node);

            if( flag=='cover' ) {
                //标题图片单独提取成行
                wrap = UE.uNode.createElement( '<h2></h2>' );
                parent.parentNode.insertBefore( wrap, parent );
                //插入占位节点
                parent.replaceChild( placeholderNode, node );
                //外提节点
                wrap.appendChild( node );
            } else if(flag=='single'){
                //处理同一个段落里面有多个图片
                wrap = UE.uNode.createElement( '<p></p>' );
                parent.parentNode.insertBefore( wrap, parent );
                parent.replaceChild( placeholderNode, node );
                wrap.appendChild( node );
            } else if(node.parentNode.children.length>2 && (flag=='float'||flag=='note')) {
//                //处理同一个段落里面有多个span
//                var tmpChild, tmpClass = '', tmpText = '', key;
//                for(key = node.parentNode.children.length-1; key>=0; key--){
//                    tmpChild = node.parentNode.children[key];
//                    if(tmpChild.tagName.toLowerCase()=='span' && !tmpChild.getAttr('data-remark')){
//                        if(!tmpClass && tmpChild.attrs.class) {
//                            tmpClass = tmpChild.attrs.class;
//                        }
//                        tmpText += tmpChild.innerText();
//                        node.parentNode.removeChild(node.parentNode.children[key]);
//                    }
//                }
//                //整理多个span，把他合并到一个span上
//                tmpChild = UE.uNode.createElement( '<span></span>' );
//                tmpChild.className = tmpClass;
//                tmpChild.innerText(tmpText);
//                if(node.getAttr('flag')=='note'&& (' '+node.parentNode.getAttr('class')+' ').indexOf(UE.singlePicNoteDir['top'])!=-1 ){
//                    node.parentNode.children.unshift(tmpChild);
//                }else{
//                    node.parentNode.children.push(tmpChild);
//                }

            }



        //独立节点， 则执行标签验证
        } else {

            if( node.hasAttr('alt') ) {

                node.parentNode.tagName = 'h2';

            } else {

                node.parentNode.tagName = 'p';

            }

            //删除其父节点的所有属性
            //node.parentNode.setAttr();

        }


    }

    /**
     * 检测给定的节点是否是分符
     */
    function isBlockquote( node ) {
        return node.tagName === 'blockquote';
    }

    /**
     * 根据给定的style值， 应用当前文库的className转换规则，转换成一个className
     * @param style 给定的style值
     * @returns 如果匹配上规则， 则返回className；否则返回NULL
     */
    function toClassName( style ) {

        var styleName = null,
            styleVal = null,
            tmp = null;

        if( styleName = /^(\w+(?:-\w+)*)\s*:\s*([\s\S]+)$/.exec( style ) ) {

            styleVal = styleName[2];
            styleName = styleName[1];

            //去除数字中的小数点
            styleVal = styleVal.replace( /\.\d+/g, '' );

            //rgb颜色转换
            styleVal = styleVal.replace(/rgba?\s*\(\s*(\d{0,3}\s*,\s*\d{0,3}\s*,\s*\d{0,3})\s*(?:,\s*\d{0,3}\s*)?\)/g, function(){

                return colorKeywordToHex( 'rgb('+arguments[1]+')' );

            });

            //去除逗号后的可选列表
            styleVal = styleVal.replace( /,\s*[^\s]+/g, '' );

            //#333格式转换
            styleVal = styleVal.replace( /#([a-f\d])([a-f\d])([a-f\d])\b/gi, function(){

                var color =[],
                    tmp = null;

                color.push( tmp = arguments[1].toLowerCase() );
                color.push( tmp );
                color.push( tmp = arguments[2].toLowerCase() );
                color.push( tmp );
                color.push( tmp = arguments[3].toLowerCase() );
                color.push( tmp );

                return '#'+color.join('');

            } );

            //检查是否有颜色关键字
            var vals = styleVal.split(/\s+/);

            for( var i = 0, len = vals.length; i < len; i++ ) {

                tmp = vals[ i ];
                tmp.indexOf('#') !== 0 && ( vals[ i ] = colorKeywordToHex( tmp ) );

            }

            styleVal = vals.join(' ');

            //生成最终className
            styleName = CLASS_NAME_PREFIX + styleName+'_'+styleVal.replace(/\s+/g, '-');
            //替换颜色中的#字符
            styleName = styleName.replace(/#/g, '-_');

            return styleName;

        } else {
            return null;
        }

    }

    /**
     * 颜色值转换为16进制
     * @param color
     */
    function colorKeywordToHex( color ) {

        var origin = [ color ];

        tmpNode.style.color = 'transparent';
        tmpNode.style.color = color;

        if( tmpNode.style.color !== 'transparent' ) {

            color = tmpNodeStyle.getPropertyValue('color');

            if( color = /(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*/.exec( color ) ) {

                origin = [ '#', (+color[1]).toString(16), (+color[2]).toString(16), (+color[3]).toString(16) ];

                origin[1].length === 1 && ( origin[1] = origin[1] + origin[1] );
                origin[2].length === 1 && ( origin[2] = origin[2] + origin[2] );
                origin[3].length === 1 && ( origin[3] = origin[3] + origin[3] );

            }

        }

        return origin.join('');

    }

};