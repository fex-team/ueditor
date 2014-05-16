/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午4:44
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.autotypeset' );
test( 'AutoTypeSetButton/AutoTypeSetPicker', function() {
    //打开一个自动排版的对话框
    var editor = new baidu.editor.ui.Editor();
    editor.render("editor");
    editor.ready(function(){
        var autotypesetButton = new te.obj[0].AutoTypeSetButton({editor:editor});
        te.dom[0].innerHTML = autotypesetButton.renderHtml();
        autotypesetButton.postRender();
        autotypesetButton.showPopup();
        equal(autotypesetButton.popup._hidden,false,'窗口显示');
//    检查每个input的选中情况是否和editor.options里设置的一样

        var AutoPickerBodyInput = document.getElementsByClassName("edui-autotypesetpicker-body")[0].getElementsByTagName('input');
        for(var i=0;i<AutoPickerBodyInput.length;i++){
            var inputName = AutoPickerBodyInput[i].name;
            if(inputName=="textAlign"||inputName=="imageBlockLine"){
                equal(AutoPickerBodyInput[i].checked,editor.options.autotypeset[inputName]!= null,inputName+":"+editor.options.autotypeset[inputName]);
            }
            else if(/textAlignValue\d/.test(inputName)||/imageBlockLineValue\d/.test(inputName)){
                equal(AutoPickerBodyInput[i].checked,editor.options.autotypeset[inputName.replace(new RegExp('Value\\d',"g"),'')]==AutoPickerBodyInput[i].value,inputName+":"+editor.options.autotypeset[inputName]);
            }
            else{
                if(inputName=='bdc')continue;
                equal(AutoPickerBodyInput[i].checked,editor.options.autotypeset[inputName],inputName+":"+editor.options.autotypeset[inputName]);
            }
        }
        //更改两个input 的选择
        var flagChecked = document.getElementsByClassName("edui-autotypesetpicker-body")[0].getElementsByTagName("input")[0].checked ;
        document.getElementsByClassName("edui-autotypesetpicker-body")[0].getElementsByTagName("input")[0].checked = !flagChecked;
        document.getElementById("imageBlockLineValue"+editor.uid).childNodes[2].checked = true;
//    //关闭对话框再重新打开，检查更改的input内容是否仍然有效
        autotypesetButton.popup.hide();
        equal(autotypesetButton.popup._hidden,true ,'窗口关闭');
        autotypesetButton.showPopup();
        equal(document.getElementsByClassName("edui-autotypesetpicker-body")[0].getElementsByTagName("input")[0].checked,!flagChecked,'检查更改的input内容');
        equal(document.getElementById("imageBlockLineValue"+editor.uid).childNodes[2].checked,true,'检查更改的input内容');
        equal(document.getElementById("imageBlockLineValue"+editor.uid).childNodes[1].checked,null,'检查更改的input内容');
        autotypesetButton.popup.hide();
        start();

    });
    stop();


} );