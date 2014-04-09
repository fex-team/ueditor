UE.registerUI('combox',function(editor,uiName){
    //注册按钮执行时的command命令,用uiName作为command名字，使用命令默认就会带有回退操作
    editor.registerCommand(uiName,{
        execCommand:function(cmdName,value){
            //这里借用fontsize的命令
            this.execCommand('fontsize',value + 'px')
        },
        queryCommandValue:function(){
            //这里借用fontsize的查询命令
            return this.queryCommandValue('fontsize')
        }
    });


    //创建下拉菜单中的键值对，这里我用字体大小作为例子
    var items = [];
    for(var i= 0,ci;ci=[10, 11, 12, 14, 16, 18, 20, 24, 36][i++];){
        items.push({
            //显示的条目
            label:'字体:' + ci + 'px',
            //选中条目后的返回值
            value:ci,
            //针对每个条目进行特殊的渲染
            renderLabelHtml:function () {
                //这个是希望每个条目的字体是不同的
                return '<div class="edui-label %%-label" style="line-height:2;font-size:' +
                    this.value + 'px;">' + (this.label || '') + '</div>';
            }
        });
    }
    //创建下来框
    var combox = new UE.ui.Combox({
        //需要指定当前的编辑器实例
        editor:editor,
        //添加条目
        items:items,
        //当选中时要做的事情
        onselect:function (t, index) {
            //拿到选中条目的值
            editor.execCommand(uiName, this.items[index].value);
        },
        //提示
        title:uiName,
        //当编辑器没有焦点时，combox默认显示的内容
        initValue:uiName
    });

    editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
        if (!uiReady) {
            var state = editor.queryCommandState(uiName);
            if (state == -1) {
                combox.setDisabled(true);
            } else {
                combox.setDisabled(false);
                var value = editor.queryCommandValue(uiName);
                if(!value){
                    combox.setValue(uiName);
                    return;
                }
                //ie下从源码模式切换回来时，字体会带单引号，而且会有逗号
                value && (value = value.replace(/['"]/g, '').split(',')[0]);
                combox.setValue(value);

            }
        }

    });
    return combox;
},2/*index 指定添加到工具栏上的那个位置，默认时追加到最后,editorId 指定这个UI是那个编辑器实例上的，默认是页面上所有的编辑器都会添加这个按钮*/);