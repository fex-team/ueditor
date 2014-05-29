module('plugins.insertcode');
//test('',function(){stop();})
test('trace 3343：插入代码中有空行', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
        editor.setContent('hello');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        editor.execCommand('insertcode', 'Java');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode':13});
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        ua.keydown(editor.body, {'keyCode':13});
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        range.insertNode(editor.document.createTextNode('hello'));
        var br = ua.browser.ie ? '' : '<br>';
        if (ua.browser.ie)
            ua.checkSameHtml(editor.body.innerHTML, '<PRE class=brush:Java;toolbar:false>​<BR>hello​​<BR>​​hello</PRE><P></P>', '插入代码');
        else if (ua.browser.gecko||ua.browser.webkit)
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:Java;toolbar:false">hello<br><br>hello</pre>', '插入代码');
        else
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:Java;toolbar:false">hello<br><br>hello</pre><p>' + br + '</p>', '插入代码');
        setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                var br = ua.browser.ie ? '' : '<br>';
                if (ua.browser.ie&&ua.browser.ie<9)
                    ua.checkSameHtml(editor.body.innerHTML, "<PRE class=brush:Java;toolbar:false>hello<BR>hello<BR></PRE><P>&nbsp;</P>", '样式不变');

                else if (ua.browser.gecko||ua.browser.webkit)
                    ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:Java;toolbar:false">hello<br><br>hello<br></pre>', '样式不变');
                    start();
            }, 20);
        }, 20);
    stop();
});

test('trace 3355：不闭合选区插入代码', function () {
    var editor = te.obj[0];
        var code = '&lt;div id=&quot;upload&quot; style=&quot;display: none&quot; &gt;&lt;img id=&quot;uploadBtn&quot;&gt;&lt;/div&gt;';
        editor.setContent(code);
        setTimeout(function () {
            ua.keydown(editor.body, {'keyCode': 65, 'ctrlKey': true});
            editor.execCommand('insertcode', 'html');
            var br = ua.browser.ie ? '' : '<br>';
            if (ua.browser.gecko || ua.browser.opera ||ua.browser.webkit)
                ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">&lt;div id=\"upload\" style=\"display: none\" &gt;&lt;img id=\"uploadBtn\"&gt;&lt;/div&gt;</pre>', '检查插入了html');
            else
                ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">&lt;div id=\"upload\" style=\"display: none\" &gt;&lt;img id=\"uploadBtn\"&gt;&lt;/div&gt;</pre><p>' + br + '</p>', '检查插入了html');
                start();
        }, 50);
    stop();
});

test('trace 3395：插入代码为空时，清空编辑器', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
        editor.setContent('');
        editor.execCommand('insertcode', 'html');
        var br = ua.browser.ie ? '&nbsp;' : '<br>';
        if (ua.browser.gecko||ua.browser.ie > 10)
            ua.checkSameHtml(editor.body.firstChild.outerHTML, '<pre class="brush:html;toolbar:false"><br></pre>', '检查插入了html');
        else if (ua.browser.ie > 8)
            ua.checkSameHtml(editor.body.firstChild.outerHTML, '<pre class="brush:html;toolbar:false"></pre>', '检查插入了html');
        else
            ua.checkSameHtml(editor.body.firstChild.outerHTML, '<pre class="brush:html;toolbar:false">' + br + '</pre>', '检查插入了html');
        range.setStart(editor.body.firstChild, 0).collapse(true).select();
        range.insertNode(editor.document.createTextNode('hello'));//TODO bug修复把此行删除
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        ua.keydown(editor.body, {'keyCode':8});
        br = ua.browser.ie ? '' : '<br>';
        ua.checkSameHtml(editor.body.innerHTML, '<p>' + br + '</p>', '检查编辑器清空');
});

test('trace 3396：多次切换源码，不会产生空行', function () {
    var editor = te.obj[0];

        editor.setContent('<p>&lt;body&gt;</p><p>&lt;/body&gt;</p>');
        ua.keydown(editor.body, {'keyCode':65, 'ctrlKey':true});
        editor.execCommand('insertcode', 'html');
        var br = (ua.browser.ie==9||ua.browser.ie==10) ? '\n' : '<br>';
    var p = editor.body.firstChild.outerHTML.toLowerCase();
    var x ='\"';
    if(ua.browser.ie<9&&ua.browser.ie)x='';
    equal(p, '<pre class='+x+'brush:html;toolbar:false'+x+'>&lt;body&gt;'+br+'&lt;/body&gt;</pre>', '检查插入了html')
            ua.checkSameHtml(editor.body.firstChild.outerHTML, '<pre class="brush:html;toolbar:false">&lt;body&gt;'+br+'&lt;/body&gt;</pre>', '检查插入了html');

    //todo 1.3.6 3853

    setTimeout(function () {
            editor.execCommand('source');
            setTimeout(function () {
                editor.execCommand('source');
                var end = (ua.browser.ie==9||ua.browser.ie==10) ?'':'<br>';
                br =(ua.browser.ie==9||ua.browser.ie==10) ?'\n':'<br>';
                var Bbr =( ua.browser.ie&&ua.browser.ie<9)?'\n':'';
                ua.checkSameHtml(editor.body.firstChild.innerHTML, '&lt;body&gt;'+Bbr+br+'&lt;/body&gt;'+end, '切回源码无影响');
//            setTimeout(function() {//TODO bug修复后去掉注释
//                editor.execCommand('source');
//                setTimeout(function() {
//                    editor.execCommand('source');
//                    ua.checkSameHtml(editor.body.firstChild.innerHTML,'&lt;body&gt;<br>&lt;/body&gt;<br>','切回源码无影响');
//                setTimeout(function () {
//                    UE.delEditor('ue');
//                    document.getElementById('ue')&&te.dom.push(document.getElementById('ue'));
                    start();
            }, 20);
        }, 20);

    stop();
});

test('trace 3407：表格中插入代码', function () {
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('');
    editor.execCommand('inserttable');
    stop();
    setTimeout(function () {
        var tds = editor.body.getElementsByTagName('td');
        tds[1].innerHTML = 'asd';
        range.setStart(tds[1], 0).setEnd(tds[1], 1).select();
        editor.execCommand('insertcode', 'Javascript');
        var br = ua.browser.ie ? '&nbsp;' : '<br>';
        ua.checkSameHtml(tds[1].innerHTML, '<pre class="brush:Javascript;toolbar:false">asd</pre>', '检查插入了html');
//    stop();
//    setTimeout(function() {//TODO bug
//        editor.execCommand('source');
//        setTimeout(function() {
//            editor.execCommand('source');
//            ua.checkSameHtml(tds[1].innerHTML,'<pre class="brush:Javascript;toolbar:false">asd</pre><br>','切回源码无影响');
//            start();
//        },20);
//    },20);
        start();
    }, 50);
});


test('test-beforeInsertHTML', function(){
    var editor = te.obj[0];
    var range = te.obj[1];
        editor.setContent('<pre class="brush:html;toolbar:false"><br/></pre>');
        //闭合
        range.setStart(editor.body.firstChild,0).collapse(true).select();
        var insert = 'text';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10)
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">'+insert+'</pre>', '插入IE');
        else
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">'+insert+'<br></pre>', '插入chrome/ff/ie11+');
        ua.manualDeleteFillData(editor.body);

        //插入非br element
        range.setStart(editor.body.firstChild.firstChild,0).collapse(true).select();
        insert='<p>I</p>';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10)
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">Itext</pre>', '插入IE');
        else
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">Itext<br></pre>', '插入chrome/ff/ie11+');
        ua.manualDeleteFillData(editor.body);

        //插入br element
        range.setStart(editor.body.firstChild.firstChild,1).collapse(true).select();
        insert='<br>br';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10){
                ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">\nbrItext</pre>', '插入IE');

        }
        else if(ua.browser.ie>10){
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">I\nbrtext<br></pre>', '插入IE11+');
        }
        else{
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">I​<br>brtext<br></pre>', '插入chrome/ff');}
        ua.manualDeleteFillData(editor.body);

        //混合标签
        range.setStart(editor.body.firstChild,0).collapse(true).select();
        insert='<p>PPP<p>222</p><span>SSS</span><br>BBB</p>';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10){
//            if(ua.browser.ie<11){
                ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPP222SSS\nBBB\nbrItext</pre>', '插入IE');
//            }else{
//            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPP222SSS\nBBBI\nbrtext</pre>', '插入IE');
//            }
        }
        else if(ua.browser.ie>10){
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPP222SSS\nBBBI\nbrtext<br></pre>', '插入IE11+');
        }
        else{
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPP222SSS<br>BBBI<br>brtext<br></pre>', '插入chrome/ff/ie11+');
        }
        ua.manualDeleteFillData(editor.body);

        //非闭合
        //插入非element
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.firstChild, 4).select();
        insert = 'replace';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10)
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">replace</pre>', '插入IE');
        else if(ua.browser.ie>10){
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">replace<br></pre>', '插入IE11+');

        }
        else
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">replaceBBBI<br>brtext<br></pre>', '插入chrome/ff/ie11+');
        ua.manualDeleteFillData(editor.body);
        //插入element
        range.setStart(editor.body.firstChild, 0).setEnd(editor.body.firstChild, 0).select();
        insert = '<p>PPP</p>';
        editor.execCommand('inserthtml', insert);
        if(ua.browser.ie==9||ua.browser.ie==10)
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPPreplace</pre>', '插入IE');
        else if(ua.browser.ie>10){
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPPreplace<br></pre>', '插入IE11+');

        }
        else
            ua.checkSameHtml(editor.body.innerHTML, '<pre class="brush:html;toolbar:false">PPPreplaceBBBI<br>brtext<br></pre>', '插入chrome/ff/ie11+');
        ua.manualDeleteFillData(editor.body);

});

test('关于pre中的tabKey',function(){
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<pre class="brush:Javascript;toolbar:false">function a(){var a = true;}</pre>');
    var text = editor.body.firstChild.firstChild;
    range.setStart(text,13).setEnd(text,16).select();
    ua.keydown(editor.body,{'shiftKey':false,'keyCode':9});
    ua.keyup(editor.body,{'shiftKey':false,'keyCode':9});
    if(ua.browser.ie==8||ua.browser.ie==9){
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">&nbsp;&nbsp;&nbsp;&nbsp;function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>');
    }else if(ua.browser.ie>9){
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">&nbsp;&nbsp;&nbsp;&nbsp;function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey1');
    }else{
        equal(editor.getContent(),'<pre class="brush:Javascript;toolbar:false">&nbsp;&nbsp;&nbsp;&nbsp;function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey1');
    }
    editor.setContent('<pre class="brush:Javascript;toolbar:false"><br>function a(){var a = true;}</pre>');
    var text = editor.body.firstChild.firstChild;
    range.setStart(text,13).setEnd(text,16).select();
    ua.keydown(editor.body,{'shiftKey':false,'keyCode':9});
    ua.keyup(editor.body,{'shiftKey':false,'keyCode':9});
    if(ua.browser.ie==8||ua.browser.ie==9){
        var x = '\n';
        if(ua.browser.ie==9){
            x = '';
        }
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">&nbsp;&nbsp;&nbsp;&nbsp;'+x+'function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey2');
    }else if(ua.browser.ie>9){
        var x2 = '';
        var x3 = '&nbsp;&nbsp;&nbsp;&nbsp;';
        if(ua.browser.ie==11){
            x2 = '&nbsp;&nbsp;&nbsp;&nbsp;';
            x3='\n';
        }
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">'+x3+'function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>'+x2,'验证pre下tabKey2');
    }else{
        equal(editor.getContent(),'<pre class="brush:Javascript;toolbar:false">\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;function&nbsp;a(){var&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey2');
    }
    editor.setContent('<pre class="brush:Javascript;toolbar:false">function a(){<br>var a = true;}</pre>');
    var text = editor.body.firstChild.firstChild;
    range.setStart(text,13).setEnd(text,16).select();
    ua.keydown(editor.body,{'shiftKey':false,'keyCode':9});
    ua.keyup(editor.body,{'shiftKey':false,'keyCode':9});
    if(ua.browser.ie==8){
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">function&nbsp;a(){&nbsp;&nbsp;&nbsp;&nbsp;\nvar&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey3');
    }else if(ua.browser.ie>8){
        var xx = '&nbsp;&nbsp;&nbsp;&nbsp;';
        var xx2 = '';
        if(ua.browser.ie==11){
            xx = '';
            xx2 = '&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        equal(editor.getContent(),'<pre class=\"brush:Javascript;toolbar:false\">'+xx+'function&nbsp;a(){'+xx2+'\nvar&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey3');
    }else{
        equal(editor.getContent(),'<pre class="brush:Javascript;toolbar:false">function&nbsp;a(){&nbsp;&nbsp;&nbsp;&nbsp;\nvar&nbsp;a&nbsp;=&nbsp;true;}</pre>','验证pre下tabKey3');
    }
});
