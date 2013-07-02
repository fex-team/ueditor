/**
 *
 */
module( 'plugins.customstyle' );

test( 'block的元素（p）', function () {
        var editor = te.obj[0];
    editor.setContent('<p>hello</p>');
    setTimeout(function () {
        var range = editor.selection.getRange();
        range.selectNode(editor.body.firstChild).select();//非闭合选区

        editor.execCommand('customstyle', {
            style:'border:1px solid #ccc',
            label:'aaa',
            tag:'h3'
        });
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.getAttribute('label'), 'aaa', '检查标签');
        range.selectNode(editor.body.firstChild).select();
        equal(editor.queryCommandValue('customstyle'), 'aaa', 'queryCommandValue');
        equal(editor.queryCommandState('customstyle'), '0', 'queryCommandState');
        var hStyle = $(editor.body.firstChild);
        ok(editor.body.firstChild.style.borderWidth == '1px', '检查边框宽');
        ok(hStyle.css('border-top-style') == 'solid' && hStyle.css('border-bottom-style') == 'solid' && hStyle.css('border-left-style') == 'solid' && hStyle.css('border-right-style') == 'solid', '检查边框风格');
        if (ua.browser.ie && ua.browser.ie < 9)
            ok(hStyle.css('border-top-color') == '#ccc' && hStyle.css('border-bottom-color') == '#ccc' && hStyle.css('border-left-color') == '#ccc' && hStyle.css('border-right-color') == '#ccc', '检查边框颜色');
        else
            ok(hStyle.css('border-top-color') == 'rgb(204, 204, 204)' && hStyle.css('border-bottom-color') == 'rgb(204, 204, 204)' && hStyle.css('border-left-color') == 'rgb(204, 204, 204)' && hStyle.css('border-right-color') == 'rgb(204, 204, 204)', '检查边框颜色');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();//闭合选区
        editor.execCommand('customstyle', {
            style:'border:1px solid #ccc',
            label:'aaa',
            tag:'h3'
        });
        ua.manualDeleteFillData(editor.body);
        range.selectNode(editor.body.firstChild).select();
        equal(editor.queryCommandValue('customstyle'), '');
        equal(editor.queryCommandState('customstyle'), '0', 'queryCommandState');
        /*trace 1732*/
        var p = editor.body.firstChild;
        equal(p.tagName.toLowerCase(), 'p', '闭合去掉h3标签');
        equal(p.innerHTML, 'hello', '检查innerHTML');

        editor.setContent('<h3 style="border: 1px solid rgb(204, 204, 204); " label="aaa">hello</h3><p><br></p>');
        range.selectNode(editor.body.firstChild).select();
        editor.execCommand('customstyle', {
            style:'border:1px solid #ccc',
            label:'aaa',
            tag:'h3'
        });
        var p = editor.body.firstChild;
        equal(p.tagName.toLowerCase(), 'p', '非闭合去掉h3标签');
        start();
    }, 50);
    stop();
} );
test( 'block的元素（div）', function () {
        var editor = te.obj[0];
        editor.setContent( '<div>hello</div>' );
    setTimeout(function(){
        var range = editor.selection.getRange();
        range.selectNode( editor.body.firstChild ).select();//非闭合选区
        editor.execCommand( 'customstyle', {
                style:'border:1px solid #ccc',
                label:'aaa',
                tag:'h3'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.firstChild.getAttribute( 'label' ), 'aaa', '检查标签' );
        var hStyle = $( editor.body.firstChild );
        ok( editor.body.firstChild.style.borderWidth=='1px', '检查边框宽' );
        ok( hStyle.css( 'border-top-style' ) == 'solid' && hStyle.css( 'border-bottom-style' ) == 'solid' && hStyle.css( 'border-left-style' ) == 'solid' && hStyle.css( 'border-right-style' ) == 'solid', '检查边框风格' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok( hStyle.css( 'border-top-color' ) == '#ccc' && hStyle.css( 'border-bottom-color' ) == '#ccc' && hStyle.css( 'border-left-color' ) == '#ccc' && hStyle.css( 'border-right-color' ) == '#ccc', '检查边框颜色' );
        else
            ok( hStyle.css( 'border-top-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-left-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-right-color' ) == 'rgb(204, 204, 204)', '检查边框颜色' );
        range.setStart(editor.body.firstChild,0).collapse(true).select();//闭合选区
        editor.execCommand( 'customstyle', {
                style:'border:1px solid #ccc',
                label:'aaa',
                tag:'h3'
        } );
        ua.manualDeleteFillData( editor.body );
        /*trace 1732*/
        var p = editor.body.firstChild;
        equal( p.tagName.toLowerCase(), 'p', 'h3被去掉了' );
        equal( p.innerHTML, 'hello', '检查innerHTML' );
    start();
},50);
stop();
} );

test( 'inline的元素(a)', function () {
        var editor = te.obj[0];
        editor.setContent( '<a href="http://www.baidu.com">hello</a>' );
        var range = editor.selection.getRange();
        range.selectNode( editor.body.firstChild ).select();//非闭合选区

        editor.execCommand( 'customstyle', {
                style:'border:1px solid #ccc',
                label:'aaa',
                tag:'h3'
        } );
        range.selectNode( editor.body.firstChild ).select();
        equal(editor.queryCommandValue('customstyle'),'aaa','queryCommandValue');
        equal(editor.queryCommandState('customstyle'),'0','queryCommandState');
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.firstChild.getAttribute( 'label' ), 'aaa', '检查标签' );
        var hStyle = $( editor.body.firstChild );
        ok( editor.body.firstChild.style.borderWidth=='1px', '检查边框宽' );
        ok( hStyle.css( 'border-top-style' ) == 'solid' && hStyle.css( 'border-bottom-style' ) == 'solid' && hStyle.css( 'border-left-style' ) == 'solid' && hStyle.css( 'border-right-style' ) == 'solid', '检查边框风格' );
        if (ua.browser.ie&&ua.browser.ie<9 )
            ok( hStyle.css( 'border-top-color' ) == '#ccc' && hStyle.css( 'border-bottom-color' ) == '#ccc' && hStyle.css( 'border-left-color' ) == '#ccc' && hStyle.css( 'border-right-color' ) == '#ccc', '检查边框颜色' );
        else
            ok( hStyle.css( 'border-top-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-left-color' ) == 'rgb(204, 204, 204)' && hStyle.css( 'border-right-color' ) == 'rgb(204, 204, 204)', '检查边框颜色' );
        range.setStart(editor.body.firstChild,0).collapse(true).select();//闭合选区
        editor.execCommand( 'customstyle', {
                style:'border:1px solid #ccc',
                label:'aaa',
                tag:'h3'
        } );
        ua.manualDeleteFillData( editor.body );
        /*trace 1732*/
        var a = editor.body.getElementsByTagName('a')[0];
        equal( a.tagName.toLowerCase(), 'a', 'h3被去掉了' );
        equal( a.innerHTML, 'hello', '检查innerHTML' );
        range.selectNode( editor.body.firstChild ).select();
        equal(editor.queryCommandValue('customstyle'),'','queryCommandValue');
        equal(editor.queryCommandState('customstyle'),'0','queryCommandState');
} );
//h 与span标签作为选区的情况，在下的用例中自然使用到
test( 'block的元素-样式的反复转换：块-块；包含的选取方式：整段、部分、多段', function () {
        var editor = te.obj[0];
        editor.setContent( '<p>hello</p><p>world</p>' );
        var range = editor.selection.getRange();
        range.setStart(editor.body.firstChild.firstChild,0).setEnd(editor.body.firstChild.firstChild,2).select();//非闭合选区，部分
        editor.execCommand( 'customstyle', {
                style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;',
                label:'居中标题',
                tag:'h1'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.getElementsByTagName('h1')[0].getAttribute( 'label' ), '居中标题', '非闭合选区，部分选择，设置块元素的样式：居中标题' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[0]);
        ok(  editor.body.getElementsByTagName('h1')[0].style.borderBottomWidth == '2px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '4px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '20px'&&hStyle.css( 'margin-top' ) == '0px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        ok(  hStyle.css( 'text-align' ) == 'center' , '检查对齐方式' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
        range.setStart(editor.body.getElementsByTagName('h1')[0],0).collapse(true).select();//闭合选区
        editor.execCommand( 'customstyle', {
                tag:'h1',
                label:'居左标题',
                style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;margin:0 0 10px 0;'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.getElementsByTagName('h1')[0].getAttribute( 'label' ), '居左标题', '闭合选区设置块元素的样式：居左标题' );
        var hStyle = $(editor.body.getElementsByTagName('h1')[0]);
        ok(  editor.body.getElementsByTagName('h1')[0].style.borderBottomWidth == '2px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '4px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '0px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        ok(  hStyle.css( 'text-align' ) != 'center' , '检查对齐方式' );
        if (ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
        range.setStart(editor.body.firstChild,0).setEnd(editor.body.lastChild,1).select();//非闭合选区，多段
        editor.execCommand( 'customstyle', {
                tag:'h3',
                label:'标题3',
                style:'border-bottom:#ccc 1px solid;padding:0 1px 0 0;margin:0 0 10px 0;'
        } );
        ua.manualDeleteFillData( editor.body );
        ok(editor.body.getElementsByTagName('h1').length==0&&editor.body.getElementsByTagName('h3').length==2,'选中两行（中间夹一行空行），设置成标题3');
        equal( editor.body.getElementsByTagName('h3')[0].getAttribute( 'label' ), '标题3', '标题3' );
        var hStyle = $( editor.body.getElementsByTagName('h3')[0]);
        ok(  editor.body.getElementsByTagName('h3')[0].style.borderBottomWidth == '1px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '1px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '0px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
        equal( editor.body.getElementsByTagName('h3')[1].getAttribute( 'label' ), '标题3', '标题3' );
        var hStyle = $( editor.body.getElementsByTagName('h3')[1] );
        ok(  editor.body.getElementsByTagName('h3')[1].style.borderBottomWidth == '1px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '1px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '0px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
});
test( 'block的元素-样式的反复转换：块-块；包含的选取方式： 多段部分', function () {
        var editor = te.obj[0];
        var range = editor.selection.getRange();
        editor.setContent( '<p>hello</p><p>world</p><p>！！！</p>' );
        range.setStart(editor.body.firstChild.firstChild,2).setEnd(editor.body.lastChild.firstChild,1).select();//非闭合选区，多段部分
        editor.execCommand( 'customstyle', {
                tag:'h1',
                label:'标题1',
                style:'border-bottom:#ccc 1px solid;padding:0 3px 0 0;margin:10px 0 10px 0;'
        } );
        ua.manualDeleteFillData( editor.body );
        ok(editor.body.getElementsByTagName('h1').length==3,'选中多行的部分，设置成标题1');
        equal( editor.body.getElementsByTagName('h1')[0].getAttribute( 'label' ), '标题1', '标题1' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[0] );
        ok(  editor.body.getElementsByTagName('h1')[0].style.borderBottomWidth == '1px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '3px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '10px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
        equal( editor.body.getElementsByTagName('h1')[1].getAttribute( 'label' ), '标题1', '标题1' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[1] );
        ok(  editor.body.getElementsByTagName('h1')[1].style.borderBottomWidth == '1px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '3px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '10px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
        equal( editor.body.getElementsByTagName('h1')[2].getAttribute( 'label' ), '标题1', '标题1' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[2] );
        ok(  editor.body.getElementsByTagName('h1')[2].style.borderBottomWidth == '1px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '3px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '10px'&&hStyle.css( 'margin-top' ) == '10px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );

} );
test( 'block的元素-样式的反复转换：块-内联；包含的选取方式：闭合、多段部分', function () {
        var editor = te.obj[0];
        editor.setContent( '<p>hello</p><p>world</p>' );
        var range = editor.selection.getRange();
        range.setStart(editor.body.firstChild,0).setEnd(editor.body.lastChild,1).select();//现设块样式
        editor.execCommand( 'customstyle', {
                style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;',
                label:'居中标题',
                tag:'h1'
        } );
        range.setStart(editor.body.getElementsByTagName('h1')[0],0).collapse(true).select();//闭合选区
        editor.execCommand( 'customstyle', {
                tag:'span',
                label:'强调',
                style:'font-style:italic;font-weight:bold;color:#000'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.getElementsByTagName('span')[0].getAttribute( 'label' ), '强调', '闭合选区设置样式：强调' );
        var hStyle = $( editor.body.getElementsByTagName('span')[0] );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
             ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) , '#000' , '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(0, 0, 0)' , '检查颜色' );
        range.setStart(editor.body.getElementsByTagName('h1')[0].lastChild,0).setEnd(editor.body.getElementsByTagName('h1')[1].firstChild,2).select();//多段部分
        editor.execCommand( 'customstyle', {
            tag:'span',
            label:'明显强调',
            style:'font-style:italic;font-weight:bold;color:rgb(51, 153, 204)'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.getElementsByTagName('h1')[1].firstChild.getAttribute( 'label' ), '明显强调', '闭合选区设置样式：明显强调' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[1].firstChild );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
             ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) , 'rgb(51,153,204)', '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(51, 153, 204)' , '检查颜色' );
} );
test( 'block的元素-样式的反复转换：内联-块；包含的选取方式：闭合', function () { //从内联-块的转换意义不大，其实还是针对块的转换，就不做多种方式选取了
        var editor = te.obj[0];
        editor.setContent( '<p>hello</p>' );
        var range = editor.selection.getRange();
        range.setStart(editor.body.firstChild,0).setEnd(editor.body.firstChild,1).select();
        editor.execCommand( 'customstyle', {
                tag:'span',
                label:'强调',
                style:'font-style:italic;font-weight:bold;color:#000'
        } );
        range.setStart(editor.body.firstChild,0).collapse(true).select();
        editor.execCommand( 'customstyle', {
                style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;',
                label:'居中标题',
                tag:'h1'
        } );
        ua.manualDeleteFillData( editor.body );
        equal( editor.body.getElementsByTagName('h1')[0].getAttribute( 'label' ), '居中标题', '居中标题' );
        var hStyle = $( editor.body.getElementsByTagName('h1')[0] );
        ok(  editor.body.getElementsByTagName('h1')[0].style.borderBottomWidth == '2px' , '检查边框宽' );
        ok(  hStyle.css( 'border-bottom-style' ) == 'solid' , '检查边框风格' );
        ok(  hStyle.css( 'padding-bottom' ) == '0px'&&hStyle.css( 'padding-top' ) == '0px'&&hStyle.css( 'padding-left' ) == '0px'&&hStyle.css( 'padding-right' ) == '4px' , '检查padding' );
        ok(  hStyle.css( 'margin-bottom' ) == '20px'&&hStyle.css( 'margin-top' ) == '0px'&&hStyle.css( 'margin-left' ) == '0px'&&hStyle.css( 'margin-right' ) == '0px' , '检查margin' );
        if ( ua.browser.ie&&ua.browser.ie<9 )
            ok(  hStyle.css( 'border-bottom-color' ) == '#ccc' , '检查边框颜色' );
        else
            ok( hStyle.css( 'border-bottom-color' ) == 'rgb(204, 204, 204)' , '检查边框颜色' );
    if(!editor.body.getElementsByTagName('h1')[0].firstChild.data ){return;}
        equal( editor.body.getElementsByTagName('h1')[0].firstChild.tagName.toLowerCase(),'span','h1内包含样式：强调');
        equal( editor.body.getElementsByTagName('h1')[0].firstChild.getAttribute( 'label' ), '强调', '闭合选区设置样式：强调' );
        var hStyle = $( editor.body.getElementsByTagName('span')[0] );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) , '#000' , '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(0, 0, 0)' , '检查颜色' );
} );
test( 'block的元素-样式的反复转换：内联-内联；包含的选取方式：闭合，非闭合，多段', function () {
        var div = document.body.appendChild( document.createElement( 'div' ) );
        var editor = new baidu.editor.Editor({'initialContent':'<p>欢迎使用ueditor</p>','elementPathEnabled' : true,'autoFloatEnabled':false});

        stop();
    setTimeout(function(){
        editor.render( div );
         setTimeout(function(){
        editor.setContent( '<p>hello</p><p>world</p>' );
        var range = editor.selection.getRange();
        range.setStart(editor.body.firstChild,0).setEnd(editor.body.firstChild,1).select();
        editor.execCommand( 'customstyle', {
                tag:'span',
                label:'强调',
                style:'font-style:italic;font-weight:bold;color:#000'
        } );
        equal( editor.body.getElementsByTagName('p')[0].firstChild.tagName.toLowerCase(), 'span', '闭合选区设置样式：强调' );
        equal( editor.body.getElementsByTagName('p')[0].firstChild.getAttribute( 'label' ), '强调', '闭合选区设置样式：强调' );
        var hStyle = $( editor.body.getElementsByTagName('span')[0] );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) , '#000' , '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(0, 0, 0)' , '检查颜色' );
        range.setStart(editor.body.firstChild.firstChild.firstChild,0).setEnd(editor.body.lastChild.firstChild,3).select();
        editor.execCommand( 'customstyle', {
                tag:'span',
            label:'明显强调',
            style:'font-style:italic;font-weight:bold;color:rgb(51, 153, 204)'
        } );
        range.selectNode(editor.body.firstChild).select();
        var eles = editor.queryCommandValue( 'elementpath' );
        ua.checkElementPath( eles, ['body', 'p', 'span', 'span'], '选中第一行' );
        var span2 = editor.body.getElementsByTagName('p')[0].firstChild.firstChild;
        var hStyle = $( span2 );
        equal( span2.tagName.toLowerCase(), 'span', '非闭合选区设置样式：明显强调' );
        equal(span2.getAttribute( 'label' ), '明显强调', '非闭合选区设置样式：明显强调' );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) , 'rgb(51,153,204)' , '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(51, 153, 204)', '检查颜色' );
        var span3 = editor.body.getElementsByTagName('p')[1].firstChild;
        var hStyle = $( span3 );
        equal( span3.tagName.toLowerCase(), 'span', '非闭合选区设置样式：明显强调' );
        equal(span3.getAttribute( 'label' ), '明显强调', '非闭合选区设置样式：明显强调' );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) ,'rgb(51,153,204)', '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(51, 153, 204)', '检查颜色' );
        range.setStart(span2.firstChild,0).collapse(true).select();
        editor.execCommand( 'customstyle', {
                tag:'span',
                label:'强调',
                style:'font-style:italic;font-weight:bold;color:#000'
        } );
        equal( span2.firstChild.tagName.toLowerCase(), 'span', '非闭合选区设置样式：强调' );
        equal( span2.firstChild.getAttribute( 'label' ), '强调', '闭合选区设置样式：强调' );
        var hStyle = $( span2.firstChild );
        if ( ua.browser.webkit )
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == 'bold' , '检查字体' );
        else
            ok(  hStyle.css( 'font-style' ) == 'italic'&&hStyle.css( 'font-weight' ) == '700' , '检查字体' );
        if(ua.browser.ie&&ua.browser.ie<9)
            equal( hStyle.css( 'color' ) ,'#000', '检查颜色' );
        else
            equal(  hStyle.css( 'color' ) ,'rgb(0, 0, 0)', '检查颜色' );
        start();
    },50);
},50);

} );

test('h1空节点',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p></p>');
    range.setStart(editor.body.firstChild,0).collapse(1).select();
    editor.execCommand('customstyle',{tag:'h1', label:'居中标题', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'});
    ua.manualDeleteFillData(editor.body);
    equal(editor.body.firstChild.tagName,'H1','h1标签');
    equal($(editor.body.firstChild).css('textAlign'),'center','居中');
    range.setStart(editor.body.firstChild.firstChild,0).collapse(1).select();
    ua.keyup(editor.body,{keyCode:32});
    var br = ua.browser.ie?'&nbsp;':'<br>';
//    无法模拟空格
//    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','h1空节点点击空格键');

    editor.execCommand('customstyle',{tag:'h1', label:'居中标题', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'});
    range.setStart(editor.body.firstChild,0).collapse(1).select();
    ua.keyup(editor.body,{keyCode:13});
    ua.manualDeleteFillData(editor.body);
    equal(ua.getChildHTML(editor.body),'<p>'+br+'</p>','h1空节点点击回车键');
});

test('trace 1840:单击后插入“居中标题”',function(){
        var editor = te.obj[0];
        var range = te.obj[1];
        var body = editor.body;
        editor.setContent( '<p></p>' );
        range.setStart(body.firstChild,0).select();
        editor.execCommand('customstyle',{tag:'h1', label:'居中标题', style:'border-bottom:#ccc 2px solid;padding:0 4px 0 0;text-align:center;margin:0 0 20px 0;'});
        equal(body.firstChild.tagName.toLowerCase(),'h1','检查tagname');
        var childs = body.firstChild.childNodes;
        var count = 0;
        for(var index=0;index<childs.length;index++){
                if(childs[index].nodeType==1 && childs[index].tagName.toLowerCase() =='br')
                count ++;
        }
        equal(count,ua.browser.ie?0:1,'br的个数');
});
