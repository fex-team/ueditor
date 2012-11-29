module('plugins.searchreplace');


/*trace 974,先替换再撤销再全部替换，则不会替换
 * ie下会出现的bug*/
test('全部替换',function(){
    if(ua.browser.opera)
        return;
    var editor = te.obj[0];
    var range = te.obj[1];
    editor.setContent('<p>欢迎回来</p>');
    range.setStart(editor.body.firstChild,0).collapse(true).select();
    editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'你好'});
    editor.undoManger.undo();
    editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'你好',all:true});
    ua.manualDeleteFillData(editor.body);
    equal(editor.body.firstChild.innerHTML,'你好回来');
});

/*trace 917*/
test('替换内容包含查找内容,全部替换',function(){
    if(ua.browser.opera)
        return;
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent('<p>hello回来</p>');
        range.setStart(editor.body.firstChild,0).collapse(true).select();
       /*searchreplace文件里是一个闭包，闭包中有一个全局变量currentRange，在上一次用例执行结束后仍然会保存这个值，导致下一次用例受影响*/
        editor.execCommand('searchreplace',{searchStr:'hello',replaceStr:'hello啊',all:true});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'hello啊回来');
});

/*trace 973*/
test('替换内容包含查找内容',function(){
    if(ua.browser.opera)
        return;
        var editor = te.obj[0];
        var range = te.obj[1];
        editor.setContent('<p>欢迎回来</p>');
        range.setStart(editor.body.firstChild,0).collapse(1).select();
        editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'欢迎啊'});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'欢迎啊回来');
        editor.undoManger.undo();
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'欢迎回来');
});

/*trace 1286*/
test('连续2次全部替换',function(){
    if(ua.browser.opera)
        return;
        var editor = te.obj[0];
        editor.setContent('<p>欢迎回来</p>');
        editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'欢迎啊',all:true});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'欢迎啊回来');
        editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'欢迎啊',all:true});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'欢迎啊啊回来');
});

test('替换内容为空',function(){
    if(ua.browser.opera)
        return;
        var editor = te.obj[0];
        editor.setContent('<p>欢迎回来</p>');
        editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:''});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'回来');
});

test('全部替换内容为空',function(){
    if(ua.browser.opera)
        return;
        var editor = te.obj[0];
        editor.setContent('<p>欢迎回来 欢迎啊</p>');
        editor.execCommand('searchreplace',{searchStr:'欢迎',replaceStr:'',all:true});
        ua.manualDeleteFillData(editor.body);
        equal(editor.body.firstChild.innerHTML,'回来&nbsp;啊');
});