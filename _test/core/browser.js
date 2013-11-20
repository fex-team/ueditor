module( "core.browser" );


test( 'browser', function() {
    var browser = baidu.editor.browser;
    /*ie*/
    if ( browser.ie ) {
        ok( ua.browser.ie, 'is ie' );
        var version = ua.browser.ie;
        if ( browser.version < 7 ) {
            ok( browser.ie6Compat, 'ie6 compat mode' );
            equal( version, browser.version, 'check ie version' );
        }
        if ( browser.version == 7 ) {
            ok( browser.ie7Compat, 'ie7 compat mode' );
            equal( version, browser.version, 'check ie version' );
            ok( browser.isCompatible, 'is compatible' );
        }
        switch ( document.documentMode ) {
            case 7:
                ok( browser.ie7Compat, 'ie7 document Mode' );
                equal( version, browser.version, 'check ie version' );
                ok( browser.isCompatible, 'is compatible' );
                break;
            case 8:
                ok( browser.ie8Compat, 'ie8 document Mode' );
                equal( version, browser.version, 'check ie version' );
                ok( browser.isCompatible, 'is compatible' );
                break;
            case 9:
                ok( browser.ie9Compat, 'ie9 document Mode' );
                equal( version, browser.version, 'check ie version' );
                ok( browser.isCompatible, 'is compatible' );
                break;
            case 11:
                ok( browser.ie11Compat, 'ie11 document Mode' );
                equal( version, browser.version, 'check ie version' );
                ok( browser.isCompatible, 'is compatible' );
                break;
        }
    }
    /*opera*/
    if ( browser.opera ) {
        ok( ua.browser.opera, 'is opera' );
        equal( browser.version, ua.browser.opera, 'check opera version' );
    }
    /*webKit*/
    if ( browser.webkit ) {
        ok( ua.browser.webkit, 'is webkit' );
        equal( browser.webkit, ua.browser.webkit>0, 'check webkit version' );
    }
    /*gecko*/
    if ( browser.gecko ) {
        ok( ua.browser.gecko, 'is gecko' );
        equal( browser.gecko, !!ua.browser.gecko, 'check gecko version' );
    }
//    /*air*/
//    if ( browser.air ) {
//        ok( ua.browser.air, 'is air' );
//        equal( browser.air, ua.browser.air>0, 'check air version' );
//    }
//    /*mac*/
//    if ( browser.mac ) {
//        ok( ua.browser.air, 'is air' );
//        equal( ua.browser.os, 'macintosh', 'check air version' );
//    }
    /*quirks*/
    if ( browser.quirks ) {
        equal( document.compatMode, 'BackCompat', 'is quirks mode' );
        equal( browser.version, 6, 'ie version is 6' );
    }
} );
