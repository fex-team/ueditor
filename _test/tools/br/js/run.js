function run( kiss, runnext ) {

    window.document.title = kiss;
    var wb = window.brtest = window.brtest || {};
    wb.timeout = wb.timeout || 100000;
    wb.breakOnError = /breakonerror=true/gi.test( location.search )
        || $( 'input#id_control_breakonerror' ).attr( 'checked' );
    wb.runnext = /batchrun=true/gi.test( location.search ) || runnext
        || $( 'input#id_control_runnext' ).attr( 'checked' );

    wb.kiss = kiss;
    var cid = 'id_case_' + kiss.split( '.' ).join( '_' );
    /* 只有参数有showsrconly的时候才显示div */
    if ( /showsrconly=true/gi.test( location.search ) ) {
        var div = document.getElementById( 'id_showSrcOnly' );
        div.style.display = 'block';
    }
    /* id中由于嵌入用例名称，可能存在导致通过id直接$无法正确获取元素的情况 */
    wb.kissnode = $( document.getElementById( cid ) );
    wb.kisses = wb.kisses || {};
    // 把没有用例的情况加入到报告中
    if ( !wb.kisslost ) {
        $( 'div#id_showSrcOnly a' ).each( function () {
            wb.kisses[this.title] = '0;0;_;0;0';
        } );
        wb.kisslost = true;
    }
    wb.kisscov = wb.kisscov || {};

    var wbkiss = wb.kisses[wb.kiss] = wb.kisses[wb.kiss] || '';
    /**
     * 超时处理
     */
    var toh = setTimeout( function () {
        if ( !window.brtest.breakOnError )
            $( wb ).trigger( 'done', [ new Date().getTime(), {
                failed:1,
                passed:1
            }, frames[0].$_jscoverage, 'timeout' ] );
    }, wb.timeout );

    /**
     * 为当前用例绑定一个一次性事件
     */
    $( wb ).one( 'done', function ( event, time, result, covinfo ) {
        clearTimeout( toh );
        var wb = window.brtest, errornum = result.failed, allnum = result.failed + result.passed;
        wb.kissend = new Date().getTime();
        if ( covinfo !== null )// 如果支持覆盖率
        {
            wb.kisscov[wb.kiss] = covinfo;

        }
        wb.kissnode.removeClass( 'running_case' );
        /*
         * ext_qunit.js的_d方法会触发done事件
         * top.$(wbkiss).trigger('done', [ new Date().getTime(), args ]); new Date().getTime()指向a参数，args指向b参数
         */
        wb.kisses[wb.kiss] = errornum + ';' + allnum + ';_;' + wb.kissstart + ';' + wb.kissend;
//        var html =  '<strong><span style="color: red">'+kiss + '</span></strong>:失败/所有:<strong><span style="color: red">'+errornum + '</span></strong>/' + allnum + ',开始:' + wb.kissstart + ',结束:' + wb.kissend +'耗时:'+(wb.kissend-wb.kissstart) +'\n';
        var args = kiss + ': 失败/所有:' + errornum + '/' + allnum + ',耗时:' + (wb.kissend - wb.kissstart);
        var html = upath + '../br/log.php?loginfo=' + args;

        html += '&detail='+result.detail;

        if ( errornum > 0 )
            html += '&fail=true';

        if ( errornum > 0 ) {
            wb.kissnode.addClass( 'fail_case' );
            // wb.kisses[kiss + '_error'] =
            // window.frames[0].innerHTML;
        } else
            wb.kissnode.addClass( 'pass_case' );
        if ( wb.runnext && (!wb.breakOnError || parseInt( wb.kisses[wb.kiss].split( ',' )[0] ) == 0) ) {
            var nextA = wb.kissnode.next()[0];
            if ( nextA.tagName == 'A' ) {
                if ( wb.kisses[nextA.title] === undefined ) {
                    run( nextA.title, wb.runnext );
                }
                html += "&next=" + nextA.title;
            } else {
                /* 隐藏执行区 */
                // $('div#id_runningarea').toggle();
                /* ending 提交数据到后台 */
                html += '&next=@_@end';
                wb.kisses['config'] = location.search.substring( 1 );
//                var url = /mail=true/.test( location.search ) ? 'record.php' : 'report.php';
                var url = 'report.php';
                covcalc();
                /**
                 * 启动时间，结束时间，校验点失败数，校验点总数
                 */
                $.ajax( {
                    url:url,
                    type:'post',
                    data:wb.kisses,
                    success:function ( msg ) {
                        // $('#id_testlist').hide();
                        /* 展示报告区 */
                        $( '#id_reportarea' ).show().html( msg );
                    },
                    error:function ( xhr, msg ) {
                        alert( 'fail' + msg );
                    }
                } );
            }
        }
        te.log( html );
    } );

    /**
     * 初始化执行区并通过嵌入iframe启动用例执行
     */
    var url = 'run.php?case=' + kiss + '&time=' + new Date().getTime() + "&"
        + location.search.substring( 1 );
    // + (location.search.length > 0 ? '&' + location.search.substring(1)
    // : '');

    var fdiv = 'id_div_frame_' + kiss.split( '.' ).join( '_' );
    var fid = 'id_frame_' + kiss.split( '.' ).join( '_' );
    wb.kissnode.addClass( 'running_case' );
    if ( $( 'input#id_control_hidelist' ).attr( 'checked' ) )
        $( 'div#id_testlist' ).css( 'display', 'none' );
    /* 隐藏报告区 */
    $( 'div#id_reportarea' ).empty().hide();
    /* 展示执行区 */
//    if(ua.browser.ie){//释放iframe里面占用的内存
//        if($( 'div#id_runningarea' )[0].getElementsByTagName('iframe').length){
//            var iframe_old = $( 'div#id_runningarea' )[0].getElementsByTagName('iframe')[0];
//            iframe_old.src = "javascript:false";
//            iframe_old.contentWindow.document.write('');
//            iframe_old.contentWindow.close();
//            CollectGarbage();
//            iframe_old.parentNode.removeChild(iframe_old);
//        }
//
//    }
    var iframe =document.createElement('iframe');
    iframe.src= url;
    iframe.id= fid;
    iframe.className= "runningframe";
    $( 'div#id_runningarea' ).empty().css( 'display', 'block' ).append( iframe);
    wb.kissstart = new Date().getTime();
};
function match(fileName, matcher )
{
    if ( matcher == '*' )
        return true;
    var len = matcher.length;

    /**
     * 处理多选分支，有一个成功则成功，filter后面参数使用|切割
     * @var unknown_type
     */
    var ms = matcher.split( ',');
    if ( ms.length > 1 ) {
        //这里把或的逻辑改成与
        for ( var matcher1 in ms ) {
            if ( !match(fileName, ms[matcher1] ) )
                return false;
        }
        return true;
    }

    /**
     * 处理反向选择分支
     */
    if ( matcher.substr(  0 , 1 ) == '!' ) {
        var m = matcher.substr( 1 );
        if ( fileName.substr( 0 , m.length ) == m )
            return false;
        return true;
    }

    if ( len > fileName.length  ) {
        return false;
    }
    return fileName.substr(  0 , len ) == matcher;
}
// 需要根据一次批量执行整合所有文件的覆盖率情况
function covcalc() {
    function covmerge( cc, covinfo ) {
        for ( var key in covinfo ) {//key ：每个文件
            for ( var idx in covinfo[key] ) {
                if ( idx != 'source' ) {

                    cc[key] = cc[key] || [];
                    cc[key][idx] = (cc[key][idx] || 0) + covinfo[key][idx];
                }
            }
        }
        return cc;
    }

    var cc = {};
    var brkisses = window.brtest.kisses;
    for ( var key in window.brtest.kisscov ){
        covmerge( cc, window.brtest.kisscov[key] );//key:每个用例
//        brkisses[kiss]= brkisses[kiss] + ',' + key;
    }
    var file;
    var files = [];
    var filter = '';
    var ls = location.search.split('&');
    for( var i = 0; i < ls.length; i++){
        if(ls[i].indexOf('filter')!=-1&&ls[i].indexOf('filterRun')==-1){
            filter = ls[i].split('=')[1];
        }

    }
    for ( file in cc ) {
        if ( !cc.hasOwnProperty( file ) ) {
            continue;
        }
        if(match(file,filter))
            files.push( file );
    }
    files.sort();
    for ( var f = 0; f < files.length; f++ ) {
        file = files[f];
        var lineNumber;
        var num_statements = 0;
        var num_executed = 0;
        var missing = [];
        var fileCC = cc[file];
        var length = fileCC.length;
        var currentConditionalEnd = 0;
        var conditionals = null;

        if ( fileCC.conditionals ) {
            conditionals = fileCC.conditionals;
        }
        var recordCovForBrowser = null;//
        for ( lineNumber = 0; lineNumber < length; lineNumber++ ) {
            var n = fileCC[lineNumber];

            if ( lineNumber === currentConditionalEnd ) {
                currentConditionalEnd = 0;
            } else if ( currentConditionalEnd === 0 && conditionals
                && conditionals[lineNumber] ) {
                currentConditionalEnd = conditionals[lineNumber];
            }

            if ( currentConditionalEnd !== 0 ) {
                (recordCovForBrowser==null)?(recordCovForBrowser='2'):(recordCovForBrowser +=',2');

                continue;
            }

            if ( n === undefined || n === null ) {
                (recordCovForBrowser==null)?(recordCovForBrowser='2'):(recordCovForBrowser +=',2');
                continue;
            }

            if ( n === 0 ) {
                (recordCovForBrowser==null)?(recordCovForBrowser='0'):(recordCovForBrowser +=',0');
                missing.push( lineNumber );
            } else {
                 (recordCovForBrowser==null)?(recordCovForBrowser='1'):(recordCovForBrowser +=',1');
                num_executed++;
            }
            num_statements++;
        }

        var percentage = (num_statements === 0 ? 0 : ( 100* num_executed / num_statements ).toFixed(1));
        var kiss = file.replace( '.js', '' );
        // 统计所有用例的覆盖率信息和测试结果

        if ( brkisses[kiss] == undefined )
            brkisses[kiss] = '0;0;_;0;0';
        var info = brkisses[kiss].split( ';_;' );// 覆盖率的处理在最后环节加入到用例的测试结果中

        brkisses[kiss] = info[0] + ';' + percentage + ';' + info[1]+';'+recordCovForBrowser;
    }
}

/**
 * 为批量运行提供入口，参数携带batchrun=true
 */
$( document ).ready(
    function () {
        if ( location.href.search( "[?&,]batchrun=true" ) > 0
            || $( 'input#id_control_runnext' ).attr( 'checked' ) ) {
            run( $( 'div#id_testlist a' ).attr( 'title' ), true );
        }
    } );
