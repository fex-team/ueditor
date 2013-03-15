/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-5-2
 * Time: 下午2:36
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.splitbutton' );
test( 'splitbutton', function() {
    //打开一个对话框

    var editor = new baidu.editor.ui.Editor();
    editor.render("editor");
    editor.ready(function(){
        var splitButton = new te.obj[0].SplitButton({popup:new baidu.editor.ui.Popup({
                //传入配置参数
                content: new te.obj[0].SplitButton({editor:editor}),
                'editor':editor
        }),   editor:editor});
        te.dom[0].innerHTML = splitButton.renderHtml();
        splitButton.postRender();
        splitButton.showPopup();
        equal(splitButton.popup.getDom('body').lastChild,splitButton.popup.getDom('bordereraser'),'检查：addListener：postrender');
        ok(contains(splitButton.getStateDom().className,"edui-state-opened"),'_onPopupShow');
        splitButton.popup.hide();
        equal(splitButton.getStateDom().className,"",'_onPopupHide');
        splitButton.popup.show();
        ok(contains(splitButton.getStateDom().className,"edui-state-opened"),'_onPopupShow');
        var flag = 0;
   //有两个baidu.editor.ui.SplitButton,通过popup操作的是第一个
        splitButton.addListener('buttonclick', function(){
            flag = 1;
        });

        ua.click(document.getElementsByClassName('edui-box edui-button-body')[0]);
        equal(flag, 1,'_onButtonClick');
        ua.click(document.getElementsByClassName('edui-box edui-arrow')[0]);
        ok(contains(splitButton.getStateDom().className,"edui-state-opened"),'_onArrowClick');
        splitButton.popup.hide();
        equal(splitButton.getStateDom().className,"",'_onArrowClick');
        ua.click(document.getElementsByClassName('edui-box edui-arrow')[0]);
        ok(contains(splitButton.getStateDom().className,"edui-state-opened"),'_onArrowClick');
        splitButton.popup.hide();
        start();
    });
    stop();
    function contains(string,substr,isIgnoreCase)
    {
        if(isIgnoreCase)
        {
            string=string.toLowerCase();
            substr=substr.toLowerCase();
        }
        var startChar=substr.substring(0,1);
        var strLen=substr.length;
        for(var j=0;j<string.length-strLen+1;j++)
        {
            if(string.charAt(j)==startChar)//如果匹配起始字符,开始查找
            {
                if(string.substring(j,j+strLen)==substr)//如果从j开始的字符与str匹配，那ok
                {
                    return true;
                }
            }
        }
        return false;
    }
} );