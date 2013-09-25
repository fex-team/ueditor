/**
 * @file
 * @name UE.browser
 * @short Browser
 * @desc UEditor中采用的浏览器判断模块
 */
var browser = UE.browser = function(){
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
        /**
         * 检测浏览器是否为IE
         * @name ie
         * @grammar UE.browser.ie  => true|false
         */
        ie		: !!window.ActiveXObject,

        /**
         * 检测浏览器是否为Opera
         * @name opera
         * @grammar UE.browser.opera  => true|false
         */
        opera	: ( !!opera && opera.version ),

        /**
         * 检测浏览器是否为webkit内核
         * @name webkit
         * @grammar UE.browser.webkit  => true|false
         */
        webkit	: ( agent.indexOf( ' applewebkit/' ) > -1 ),

        /**
         * 检测浏览器是否为mac系统下的浏览器
         * @name mac
         * @grammar UE.browser.mac  => true|false
         */
        mac	: ( agent.indexOf( 'macintosh' ) > -1 ),

        /**
         * 检测浏览器是否处于怪异模式
         * @name quirks
         * @grammar UE.browser.quirks  => true|false
         */
        quirks : ( document.compatMode == 'BackCompat' )
    };
    /**
     * 检测浏览器是否处为gecko内核
     * @name gecko
     * @grammar UE.browser.gecko  => true|false
     */
    browser.gecko =( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

    var version = 0;

    // Internet Explorer 6.0+
    if ( browser.ie ){
        version = parseFloat( agent.match( /msie (\d+)/ )[1] );
        /**
         * 检测浏览器是否为 IE9 模式
         * @name ie9Compat
         * @grammar UE.browser.ie9Compat  => true|false
         */
        browser.ie9Compat = document.documentMode == 9;
        /**
         * 检测浏览器是否为 IE8 浏览器
         * @name ie8
         * @grammar     UE.browser.ie8  => true|false
         */
        browser.ie8 = !!document.documentMode;

        /**
         * 检测浏览器是否为 IE8 模式
         * @name ie8Compat
         * @grammar     UE.browser.ie8Compat  => true|false
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name ie7Compat
         * @grammar     UE.browser.ie7Compat  => true|false
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
                || document.documentMode == 7 );

        /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name ie6Compat
         * @grammar     UE.browser.ie6Compat  => true|false
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

    }

    // Gecko.
    if ( browser.gecko ){
        var geckoRelease = agent.match( /rv:([\d\.]+)/ );
        if ( geckoRelease )
        {
            geckoRelease = geckoRelease[1].split( '.' );
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }
    /**
     * 检测浏览器是否为chrome
     * @name chrome
     * @grammar     UE.browser.chrome  => true|false
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = + RegExp['\x241'];
    }
    /**
     * 检测浏览器是否为safari
     * @name safari
     * @grammar     UE.browser.safari  => true|false
     */
    if(/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)){
    	browser.safari = + (RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if ( browser.opera )
        version = parseFloat( opera.version() );

    // WebKit 522+ (Safari 3+)
    if ( browser.webkit )
        version = parseFloat( agent.match( / applewebkit\/(\d+)/ )[1] );

    /**
     * 浏览器版本判断
     * IE系列返回值为5,6,7,8,9,10等
     * gecko系列会返回10900，158900等.
     * webkit系列会返回其build号 (如 522等).
     * @name version
     * @grammar     UE.browser.version  => number
     * @example
     * if ( UE.browser.ie && UE.browser.version == 6 ){
     *     alert( "Ouch!居然是万恶的IE6!" );
     * }
     */
    browser.version = version;

    /**
     * 是否是兼容模式的浏览器
     * @name isCompatible
     * @grammar  UE.browser.isCompatible  => true|false
     * @example
     * if ( UE.browser.isCompatible ){
     *     alert( "你的浏览器相当不错哦！" );
     * }
     */
    browser.isCompatible =
        !browser.mobile && (
        ( browser.ie && version >= 6 ) ||
        ( browser.gecko && version >= 10801 ) ||
        ( browser.opera && version >= 9.5 ) ||
        ( browser.air && version >= 1 ) ||
        ( browser.webkit && version >= 522 ) ||
        false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;