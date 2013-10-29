module( 'plugins.charts' );

test( '图表命令检测', function() {
    expect(3);

    var container = te.obj[0].container,
        editor = null,
        count = 0;

    UE.delEditor( te.obj[0] );
    container.parentNode.removeChild( container );

    container = document.createElement( "div" );
    container.id = "container";
    document.body.appendChild( container );
    editor = UE.getEditor( "container", {
        initialContent: '<table><tbody><tr><td width="147" valign="top">' +
                        '<br></td><td width="147" valign="top"><br></td>' +
                        '<td width="147" valign="top"><br></td><td width="147" valign="top">' +
                        '<br></td><td width="147" valign="top"><br></td></tr></tbody></table>'
    } );


    stop();

    window.setTimeout( function () {

        var firstTd = editor.body.getElementsByTagName("td")[0],
            range = editor.selection.getRange();

        range.selectNode( firstTd );
        range.collapse();

        equal( editor.queryCommandState( 'charts' ), -1, '数据验证失败， 状态为禁用' );

        //设置数据格式合法的表格
        editor.setContent('<table width="992"><tbody><tr class="firstRow"><th valign="null" width="141"><br></th><th width="141">a</th><th width="141">b</th><th width="142">c</th><th width="142">d</th><th width="142">e</th><th width="142">f</th></tr><tr><th valign="null" width="141">1999</th><td valign="top" width="141">1</td><td valign="top" width="141">2</td><td valign="top" width="142">3</td><td valign="top" width="142">4</td><td valign="top" width="142">5</td><td valign="top" width="142">6</td></tr></tbody></table>');

        firstTd = editor.container.getElementsByTagName("td")[0];

        range.selectNode( firstTd );
        range.collapse();

        equal( editor.queryCommandState( 'charts' ) != -1, true, '数据合法， 状态可用' );

        editor.execCommand( 'charts', {
            title: '测试标题',
            subTitle: '标题2',
            xTitle: 'X轴标题',
            yTitle: 'Y轴标题',
            suffix: '后缀',
            tip: '提示',
            dataFormat: '1',
            chartType: 1
        } );

        var tableNode = editor.body.getElementsByTagName("table")[0];

        equal( tableNode.getAttribute("data-chart") !== null, true, '插入图表命令执行成功' );

        start();

    } , 500 );

} );
