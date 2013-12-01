
module( 'ui.editor' );
//test('图片浮层',function(){
//    var ue1 = new baidu.editor.ui.Editor({theme:'default'});
//    var div = document.createElement("div");
//    document.body.appendChild(div);
//    ue1.render(div);
//    stop();
//    ue1.ready(function(){
//        editor.execCommand( 'insertimage', {src:'http://img.baidu.com/hi/jx2/j_0001.gif', width:50, height:51} );
//    });
//});

test('拖拽', function(){
    var sc = document.createElement("script");
    sc.id="sc";
    sc.type = "text/plain";
    document.body.appendChild(sc);
    var ue = new UE.ui.Editor({'autoHeightEnabled':false,'autoFloatEnabled':false,'scaleEnabled':true});
    ue.render('sc');
    stop();
    ue.ready(function(){
        var me =this;
        var offset = 100;
        setTimeout(function(){
            //保存现有的编辑器宽，高
            var editorWidth = $(this.document.getElementById(me.ui.id)).css('width');
            var editorHeight = $(this.document.getElementById(me.ui.id)).css('height');
            //取得拖拽的元素
            var scaleDiv = this.document.getElementById(me.ui.id+'_scale');

            //从拖拽元素的右下角开始，拖拽到向下，向右20px
            var mouseX = $(scaleDiv).offset().left + parseInt($(scaleDiv).css('width'));//+editorBorderHeight;
            var mouseY = $(scaleDiv).offset().top + parseInt($(scaleDiv).css('height'));//+editorBorderWidth;
            ua.dragto(scaleDiv,{startX:mouseX,startY:mouseY,endX:mouseX+offset,endY:mouseY+offset});
            setTimeout(function(){
                //取编辑器的边框
                var editorBorderWidth = parseInt($(this.document.getElementById(me.ui.id)).css('border-left-width'))+parseInt($(this.document.getElementById(me.ui.id)).css('border-right-width'));
                var editorBorderHeight = parseInt($(this.document.getElementById(me.ui.id)).css('border-top-width'))+parseInt($(this.document.getElementById(me.ui.id)).css('border-bottom-width'));
                var border = me.options.theme=='default'?1:0;
                var bd = parseInt(editorHeight) + offset - 2 -editorBorderWidth + border;
                var height = parseInt($(this.document.getElementById(me.ui.id)).css('height'));
                equal(parseInt($(this.document.getElementById(me.ui.id)).css('width')),parseInt(editorWidth) + offset - 2 -editorBorderHeight + border,'宽');
                ok(height==bd||height==bd-1,'高'+height);
                setTimeout(function () {
                    UE.delEditor('sc');
                    sc = document.getElementById('sc');
                    sc && sc.parentNode.removeChild(sc);
                    start();
                }, 100);
            },1800);
        },100);
    });
});

test('编辑器皮肤',function(){
    if(ua.browser.ie<8 && ua.browser.ie>0) return 0;
    var ue1 = new baidu.editor.ui.Editor({theme:'default'});
    var sc1 = document.createElement("script");
    sc1.id="sc1";
    document.body.appendChild(sc1);
    ue1.render(sc1);
    stop();
    ue1.ready(function(){
        var id = document.getElementById('sc1').firstChild.id;
        equal(document.getElementById('sc1').firstChild.className,'edui-editor  edui-default','第一个editor的classname');
        equal(document.getElementById(id+'_toolbarbox').className,'edui-editor-toolbarbox edui-default','第一个editor toolbar的classname');
        equal(document.getElementById(id+'_iframeholder').className,'edui-editor-iframeholder edui-default','第一个editor iframeholder的classname');
        equal(document.getElementById(id+'_bottombar').className,'edui-editor-bottomContainer edui-default','第一个editor bottombar的classname');
        equal(document.getElementById(id+'_scalelayer').className,'edui-default','第一个editor scalelayer的classname');
        sc1 = document.getElementById('sc1');
        sc1.parentNode.removeChild(sc1);
        var ue2 = new baidu.editor.ui.Editor({theme:'modern'});
        var sc2 = document.createElement("script");
        sc2.id="sc2";
        document.body.appendChild(sc2);
        ue2.render('sc2');
        ue2.ready(function(){
            id = document.getElementById('sc2').firstChild.id;
            equal(document.getElementById('sc2').firstChild.className,'edui-editor  edui-modern','第二个editor的classname');
            equal(document.getElementById(id+'_toolbarbox').className,'edui-editor-toolbarbox edui-modern','第二个editor toolbar的classname');
            equal(document.getElementById(id+'_iframeholder').className,'edui-editor-iframeholder edui-modern','第二个editor iframeholder的classname');
            equal(document.getElementById(id+'_bottombar').className,'edui-editor-bottomContainer edui-modern','第二个editor bottombar的classname');
            equal(document.getElementById(id+'_scalelayer').className,'edui-modern','第二个editor scalelayer的classname');
            sc2 = document.getElementById('sc2');
            sc2.parentNode.removeChild(sc2);
            start();
        });
    });
});

test( '判断render有内容时，显示render内容(script)', function() {
    var ue3 = new baidu.editor.ui.Editor();
    var sc3 = document.createElement("script");
    sc3.id="sc3";
    sc3.type="text/plain";
//    if(sc3.text)
    sc3.text= 'renderinnerhtml';
//    else
//        sc3.textContent='renderinnerhtml';
    document.body.appendChild(sc3);
    ue3.render('sc3');
    stop();
    ue3.ready(function(){
        equal(ue3.body.firstChild.innerHTML.toLowerCase(),"renderinnerhtml",'标签有内容,显示标签内容');
        sc3 = document.getElementById('sc3');
        sc3.parentNode.removeChild(sc3);
        start();
    });
} );

test( 'render没有内容时，显示initialContent', function() {
    var ue4 = new baidu.editor.ui.Editor({initialContent:'<br>'});
    var sc4 = document.createElement("script");
    sc4.id="sc4";
    document.body.appendChild(sc4);
    ue4.render(sc4);
    stop();
    ue4.ready(function(){
        equal(ue4.body.firstChild.innerHTML.toLowerCase(),ue4.options.initialContent.toLowerCase(),'标签没有内容，显示initialContent');
        sc4 = document.getElementById('sc4');
        sc4.parentNode.removeChild(sc4);
        start();
    });
} );

test('判断dialogs对象名包含"Dialog"字符', function(){
    var ue5 = new baidu.editor.ui.Editor();
    var sc5 = document.createElement("script");
    sc5.id="sc5";
    document.body.appendChild(sc5);
    ue5.render(sc5);
    stop();
    ue5.ready(function(){
        var array=ue5.ui._dialogs;
        for(var p in array){
            ok(p.indexOf('Dialog')!=-1, p);
        }
        sc5 = document.getElementById('sc5');
        sc5.parentNode.removeChild(sc5);
        start();
    });
});

test('getEditor--delEditor',function(){
    var ue7 = UE.ui.Editor();
    var div = document.createElement('div');
    div.id='editor2';
    document.body.appendChild(div);
    ue7.render('editor2');
    ue7.ready(function(){
        var ue8=UE.getEditor('editor2');
        equal(ue8.uid,ue7.uid);
//        UE.delEditor('editor2');
//        equal(document.getElementById('editor1').tagName.toLowerCase(),'textarea');
    });
})

//test('多层div 全屏',function(){
//    var div1 = document.createElement('div');
//    document.body.appendChild(div1);
//    div1.id = 'div1';
//    div1.innerHTML = '<div style="position: relative;top:50px""></div>';
//    div1.firstChild.innerHTML='<div style="position:absolute;left:100px;width:500px;height:100px">';
//    var div2 = div1.firstChild.firstChild;
//    var ue6 = new baidu.editor.ui.Editor({autoFloatEnabled:false});
//    ue6.render(div2);
//    stop();
//    ue6.ready(function(){
//        var me = document.getElementById(ue6.ui.id);
//        var left = $(me).offset().left;
//        var top = $(me).offset().top;
//        ue6.ui.setFullScreen( true );
//        setTimeout(function(){
//            ue6.ui.setFullScreen( false );
//            setTimeout(function(){
//                me = document.getElementById(ue6.ui.id);
//                ok(left==$(me).offset().left,'left不变'+$(me).offset().left);
//                ok(top==$(me).offset().top,'top不变'+$(me).offset().top);
//                ue6.focus();
//                ua.checkResult(ue6.selection.getRange(), ue6.body.firstChild.firstChild, ue6.body.firstChild.firstChild, 0, 0, 1);
//                me = document.getElementById(ue6.ui.id);
//                me.parentNode.removeChild(me);
//                start();
//            },50);
//        },50);
//    });
//})