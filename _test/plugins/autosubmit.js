/**
 * Created by wangrui10 on 14-6-4.
 */
module('plugins.autosubmit');

test("自动提交",function(){
    var form = document.body.appendChild(document.createElement('form'));
    form.id = 'formid';
    form.action = './';
    form.method = "post";
    form.target = '_blank';

    var text = document.createElement('input');
    text.type = 'text';
    form.appendChild(text);

    var btn = document.createElement('input');
    btn.type = 'submit';
    form.appendChild(btn);

    var div = form.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    editor.ready(function(){
        editor.body.innerHTML='123123';
        editor.focus();
        editor.execCommand('autosubmit');

        form = domUtils.findParentByTagName(this.iframe,"form", false);

        setTimeout(function(){
            equal(editor.textarea.value,'123123','检查editor中准备同步的内容');
            var d = $('#'+form.id).context.forms.formid[2].value;
            equal(d,'123123','editor中的内容同步到textarea中');
            start();
        },100);

    });
    stop();
});

