(function () {
    var UI = baidu.editor.ui,
        UIBase = UI.UIBase,
        uiUtils = UI.uiUtils,
        utils = baidu.editor.utils,
        domUtils = baidu.editor.dom.domUtils;

    var allMenus = [],//存储所有快捷菜单
        isSubMenuShow = false;//是否有子pop显示

    var ShortCutMenu = UI.ShortCutMenu = function ( options ) {
        this.initOptions ( options );
        this.initShortCutMenu ();
    };

    ShortCutMenu.postHide = hideAllMenu;

    ShortCutMenu.prototype = {
        isHidden : true ,
        initShortCutMenu : function () {
            this.items = this.items || [];
            this.initUIBase ();
            this.initItems ();
            this.initEvent ();
            allMenus.push ( this );
        } ,
        initEvent : function () {
            var me = this,
                doc = me.editor.document;

            domUtils.on ( doc , "mousemove" , function ( e ) {
                if ( me.isHidden === false ) {
                    //有pop显示就不隐藏快捷菜单
                    if ( me.getSubMenuMark () )   return;

                    var flag = true,
                        el = me.getDom (),
                        wt = el.offsetWidth,
                        ht = el.offsetHeight,
                        distanceX = wt / 2 + 15,//距离中心X标准
                        distanceY = ht / 2 + 15,//距离中心Y标准
                        x = Math.abs ( e.screenX - me.left ),//离中心距离横坐标
                        y = Math.abs ( e.screenY - me.top );//离中心距离纵坐标

                    if ( y > 0 && y < distanceY ) {
                        me.setOpacity ( el , "1" );
                    } else if ( y > distanceY && y < distanceY + 70 ) {
                        me.setOpacity ( el , "0.5" );
                        flag = false;
                    } else if ( y > distanceY + 70 && y < distanceY + 140 ) {
                        me.hide ();
                    }

                    if ( flag && x > 0 && x < distanceX ) {
                        me.setOpacity ( el , "1" )
                    } else if ( x > distanceX && x < distanceX + 70 ) {
                        me.setOpacity ( el , "0.5" )
                    } else if ( x > distanceX + 70 && x < distanceX + 140 ) {
                        me.hide ();
                    }
                }
            } );

            me.editor.addListener ( "afterhidepop" , function () {
                if ( ! me.isHidden ) {
                    isSubMenuShow = true;
                }
            } );
        } ,
        initItems : function () {
            if ( utils.isArray ( this.items ) ) {
                for ( var i = 0, len = this.items.length ; i < len ; i ++ ) {
                    var item = this.items[i].toLowerCase ();

                    if ( UI[item] ) {
                        this.items[i] = new UI[item] ( this.editor );
                        this.items[i].className += " edui-shortcutsubmenu ";
                    }
                }
            }
        } ,
        setOpacity : function ( el , value ) {
            if ( browser.ie && browser.version < 9 ) {
                el.style.filter = "alpha(opacity = " + parseFloat ( value ) * 100 + ");"
            } else {
                el.style.opacity = value;
            }
        } ,
        getSubMenuMark : function () {
            isSubMenuShow = false;
            var layerEle = uiUtils.getFixedLayer ();
            var list = domUtils.getElementsByTagName ( layerEle , "div" , function ( node ) {
                return domUtils.hasClass ( node , "edui-shortcutsubmenu edui-popup" )
            } );

            for ( var i = 0, node ; node = list[i ++] ; ) {
                if ( node.style.display != "none" ) {
                    isSubMenuShow = true;
                }
            }
            return isSubMenuShow;
        } ,
        show : function ( e ) {
            var el = this.getDom (), offset;

            offset = uiUtils.getViewportOffsetByEvent ( e );
            el.style.cssText = "display:block;left:-9999px";
            offset.top -= el.offsetHeight + 20;
            el.style.cssText = "position:absolute;left:" + offset.left + "px;top:" + offset.top + "px;display:block";
            this.setOpacity(el,0.2);
            if ( this.editor ) {
                el.style.zIndex = this.editor.container.style.zIndex * 1 + 10;
                uiUtils.getFixedLayer ().style.zIndex = el.style.zIndex - 1;
            }

            this.isHidden = false;
            this.left = e.screenX + el.offsetWidth / 2;
            this.top = e.screenY - (el.offsetHeight / 2) - 20;
        } ,
        hide : function () {
            if ( this.getDom () ) {
                this.getDom ().style.display = "none";
            }
            this.isHidden = true;
        } ,
        postRender : function () {
            if ( utils.isArray ( this.items ) ) {
                for ( var i = 0, item ; item = this.items[i ++] ; ) {
                    item.postRender ();
                }
            }
        } ,
        getHtmlTpl : function () {
            var buff;
            if ( utils.isArray ( this.items ) ) {
                buff = [];
                for ( var i = 0 ; i < this.items.length ; i ++ ) {
                    buff[i] = this.items[i].renderHtml ();
                }
                buff = buff.join ( "" );
            } else {
                buff = this.items;
            }

            return '<div id="##" class="%% edui-toolbar" data-src="shortcutmenu" onselectstart="return false;" >' +
                buff +
                '</div>';
        }
    };

    utils.inherits ( ShortCutMenu , UIBase );

    function hideAllMenu ( e ) {
        var tgt = e.target || e.srcElement,
            cur = domUtils.findParent ( tgt , function ( node ) {
                return domUtils.hasClass ( node , "edui-shortcutmenu" ) || domUtils.hasClass ( node , "edui-popup" );
            } , true );

        if ( ! cur ) {
            for ( var i = 0, menu ; menu = allMenus[i ++] ; ) {
                menu.hide ()
            }
        }
    }

    domUtils.on ( document , 'mousedown' , function ( e ) {
        hideAllMenu ( e );
    } );

    domUtils.on ( window , 'scroll' , function ( e ) {
        hideAllMenu ( e );
    } );

}) ();
