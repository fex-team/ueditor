module( 'plugins.lineheight' );
//test( '', function() {
//    equal('','','');
//} );
/*
 *
 *利用pict工具生成的用例设计结果，有微调。3to1表示先设置行距为3再设置为1，选区“singlePara”表示选中一个段落，
 * “multiPara”表示选中多个段落，“字号统一”表示所有的字号都是一样大，“16to36To16”表示先设置大小为16px，再设置为36，再设置为16
 设置行距顺序	选区	选区内字号顺序
 <li>3to1        	collapse	     字号统一</li>
 <li>1             	multiPara	  36To16To36</li>
 <li>1to3to1 	singlePara	  字号统一</li>
 <li>1              collapse 	      16to36To16</li>
 <li>1to3to1	multiPara	16to36To16</li>
 <li>3to1     	singlePara	  36To16To16</li>
 <li>3             	multiPara	 字号统一</li>
 <li>1to3to1	collapse	     36To16To16</li>
 <li>3to1     	multiPara	16to36To16</li>
 <li>3	         singlePara   	16to36To16</li>
 * */
//
//var compareLineHeight = function ( node, value,fontSize, descript ) {
//        var currLineHeight = $(node).css('lineHeight').replace(/px/,'');
//        var spans = node.getElementsByTagName('')
//        value = value.replace( /px/, '' );
//        var baseLineHeight = (ua.browser.ie ? domUtils.getComputedStyle( node, 'font-size' ).replace( /px/, '' ) : node.offsetHeight);
//        var fontSize = $( node ).css( 'font-size' ).replace( /px/, '' );
//        if ( value >= fontSize && value >= baseLineHeight ) {
//                ok( true, descript );
//        } else {
//                ok( false, descript + '--- "lineHeight应取fontSize和baseLineHeight*倍数的最大值":lineHeight=' + value + ' ;font-sze=' + fontSize + ';baseLineHeight=' + baseLineHeight );
//        }
//
//}
//
///*<li>3to1        	collapse	     字号统一</li>*/
test( '闭合情况，字号统一', function () {
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p style="font-size: 36px">hello</p>' );
        range.setStart(body.firstChild, 1).collapse(1).select();
        editor.execCommand('lineheight', 3);
        setTimeout( function () {
            var p = body.firstChild;
            equal( editor.queryCommandValue('lineheight'), "3", '行间距为3');
            editor.execCommand('lineheight', 1);
            p = body.firstChild;
            equal( editor.queryCommandValue('lineheight'), "1", '行间距为1');
            equal( p.style['lineHeight'], 'normal', '检查行高' );
            equal( $( p ).css('font-size'), '36px', '检查字体');
            start();
        }, 20 );
        stop();
} );

/*<li>1             	multiPara	  36To16To36</li>*/
//test( '多个段落设置多倍行距，段落中字体大小各不相同', function () {
//        var editor = te.obj[0];
//        var range = te.obj[1];
//        var body = editor.body;
//        editor.setContent( '<p style="font-size: 36px">hello</p><p style="font-size: 16px">hello</p><p style="font-size: 36px">hello</p>' );
//        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
//        editor.execCommand( 'lineheight', 1 );
//        setTimeout( function () {
//                var ps = body.childNodes;
//                equal( $( ps[0] ).css( 'line-height' ), '36px', '第1个p行高为36px' );
//                equal( $( ps[1] ).css( 'line-height' ), '16px', '第2个p行高为36px' );
//                equal( $( ps[2] ).css( 'line-height' ), '36px', '第3个p行高为36px' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第1个p行间距为1' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第2个p行间距为1' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第3个p行间距为1' );
//                start();
//        }, 20 );
//        stop();
//} );
//
///*<li>1              collapse 	      16to36To16</li>*/
//test( '多个段落设置多倍行距，段落中字体大小各不相同', function () {
//        var editor = te.obj[0];
//        var range = te.obj[1];
//        var body = editor.body;
//        editor.setContent( '<p style="font-size: 16px">hello</p><p style="font-size: 36px">hello</p><p style="font-size: 16px">hello</p>' );
//        range.setStart( body.firstChild, 0 ).setEnd( body.lastChild, 1 ).select();
//        editor.execCommand( 'lineheight', 1 );
//        setTimeout( function () {
//                var ps = body.childNodes;
//                compareLineHeight( ps[0], $( ps[0] ).css( 'line-height' ), '行距为1，第1个p行高' );
//                compareLineHeight( ps[1], $( ps[1] ).css( 'line-height' ), '行距为1，第2个p行高' );
//                compareLineHeight( ps[2], $( ps[2] ).css( 'line-height' ), '行距为1，第3个p行高' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第1个p行间距为1' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第2个p行间距为1' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第3个p行间距为1' );
//                start();
//        }, 20 );
//        stop();
//} );
//
///*<li>1to3to1 	singlePara	  字号统一</li>*/
//test( '1个段落设置多倍行距，字号相同', function () {
//        var editor = te.obj[0];
//        var range = te.obj[1];
//        var body = editor.body;
//        editor.setContent( '<p style="font-size: 36px">hello</p>' );
//        range.selectNode( body.firstChild ).select();
//        editor.execCommand( 'lineheight', 1 );
//        setTimeout( function () {
//                var p = body.firstChild;
//                equal( $( p ).css( 'line-height' ), '36px', '第1个p行高为36px' );
//                editor.execCommand( 'lineheight', 3 );
//                p = body.firstChild;
//                compareLineHeight( p, $( p ).css( 'line-height' ), '行距为1，第1个p行高' );
//                editor.execCommand( 'lineheight', 1 );
//                var p = body.firstChild;
//                equal( $( p ).css( 'line-height' ), '36px', '第1个p行高为36px' );
//                start();
//        }, 20 );
//        stop();
//} );
//
///* <li>1to3to1	multiPara	16to36To16</li>*/
//test( '多个段落设置多倍行距，字号不同', function () {
//        var editor = te.obj[0];
//        var range = te.obj[1];
//        var body = editor.body;
//        editor.setContent( '<p style="font-size: 16px">hello</p><p style="font-size: 36px">hello</p><p style="font-size: 16px">hello</p>' );
//        range.setStart( body.firstChild.firstChild, 1 ).setEnd( body.lastChild.firstChild, 2 ).select();
//        editor.execCommand( 'lineheight', 1 );
//        setTimeout( function () {
//                var ps = body.childNodes;
//                compareLineHeight( ps[0], $( ps[0] ).css( 'line-height' ), '行距为1，第1个p行高' );
//                compareLineHeight( ps[1], $( ps[1] ).css( 'line-height' ), '行距为1，第2个p行高' );
//                compareLineHeight( ps[2], $( ps[2] ).css( 'line-height' ), '行距为1，第3个p行高' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第3个p行间距为1' );
//
//                range.setStart( body.firstChild.firstChild, 1 ).setEnd( body.lastChild.firstChild, 2 ).select();
//                editor.execCommand( 'lineheight', 3 );
//                ps = body.childNodes;
//                compareLineHeight( ps[0], $( ps[0] ).css( 'line-height' ), '行距为3，第1个p行高' );
//                compareLineHeight( ps[1], $( ps[1] ).css( 'line-height' ), '行距为3，第2个p行高' );
//                compareLineHeight( ps[2], $( ps[2] ).css( 'line-height' ), '行距为3，第3个p行高' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "3", '第1个p行间距为1' );
//
//                range.setStart( body.firstChild.firstChild, 1 ).setEnd( body.lastChild.firstChild, 2 ).select();
//                editor.execCommand( 'lineheight', 1 );
//                ps = body.childNodes;
//                compareLineHeight( ps[0], $( ps[0] ).css( 'line-height' ), '行距为1，第1个p行高' );
//                compareLineHeight( ps[1], $( ps[1] ).css( 'line-height' ), '行距为1，第2个p行高' );
//                compareLineHeight( ps[2], $( ps[2] ).css( 'line-height' ), '行距为1，第3个p行高' );
//                range.selectNode( ps[0] ).select();
//                equal( editor.queryCommandValue( 'lineheight' ), "1", '第1个p行间距为1' );
//                start();
//        }, 20 );
//        stop();
//
//} );