/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-4-12
 * Time: 下午4:44
 * To change this template use File | Settings | File Templates.
 */
module( 'ui.combox' );
test( 'combox', function() {
    var editor = new baidu.editor.ui.Editor();
    editor.render("editor");
//设置菜单内容
    var list = [
                ['1',[1]],
                ['0',[0]],
                ['宋体',['宋体', 'SimSun']],
                ['楷体',['楷体', '楷体_GB2312', 'SimKai']],
                ['黑体',['黑体', 'SimHei']],
                ['隶书',['隶书', 'SimLi']],
                ['andale mono',['andale mono']],
                ['arial',['arial', 'helvetica', 'sans-serif']],
                ['arial black',['arial black', 'avant garde']],
                ['comic sans ms',['comic sans ms']],
                ['impact',['impact', 'chicago']],
                ['times new roman',['times new roman']]
    ];
    var title = list ;

    for(var i=0,ci,items=[];ci=list[i++];){

            (function(key,val){
                items.push({
                    label: key,
                    value: val,
                    renderLabelHtml: function (){
                        return '<div class="edui-label %%-label" style="font-family:' +
                            utils.unhtml(this.value.join(',')) + '">' + (this.label || '') + '</div>';
                    }
                });
            })(ci[0],ci[1])
        }
    editor.ready(function(){
        var combox = new te.obj[0].Combox({editor:editor,items :items,title: title,  initValue:'字体',className: 'edui-for-fontfamily'});

        te.dom[0].innerHTML = combox.renderHtml();
        combox.postRender();
        combox.showPopup();
    //////// getItem
        equal(combox.getItem(0).label,'1','检查item内容');
        equal(combox.getItem(0).value[0],1,'');
///////getValue setValue
        combox.setValue(list[4][1]);
        equal(combox.getValue(),list[4][1],'设置内容');
        equal(combox.label,'黑体','');
        equal(combox.getDom('button_body').innerHTML,"黑体",'');
  ////////getLabelForUnknowValue
        combox.setValue(['黑体', 'chicago']);
        equal(combox.getValue()[0],"黑体",'设置一个不在原来列表的内容');
        equal(combox.getValue()[1],'chicago','');
        equal(combox.getValue(),combox.label,'');
        equal(combox.getDom('button_body').innerHTML,"黑体,chicago",'');
    /////selectByIndex
        combox.popup.items[2].onclick();
        equal(combox.getValue()[0],'宋体','检查onclick，设定选中内容');
        equal(combox.getValue()[1],'SimSun','');
        equal(items[2].label,combox.label,'');
        equal(combox.selectedIndex,2,'');
        combox.popup.hide();
        start();

     });
stop();
} );