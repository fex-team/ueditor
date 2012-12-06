/**
 * @file
 * @name ui.View.ColorPicker
 * @import ui/ui.view.pop.js
 * @desc 颜色选取的实现类
 *
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.ColorPicker
         * @grammar cpk = new ui.View.ColorPicker(ui)
         */
        cpk = views.ColorPicker = function(ui){
            var me = this,
                clearColor = ui.getLang('clearColor') || '清除颜色',
                themeColor = ui.getLang('themeColor') || '主题颜色',
                standardColor = ui.getLang('standardColor') || '标准颜色',
                COLORS = ('ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                    'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                    'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                    'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                    'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                    '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                    'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0').split(','),
                html = '<div class="edui-colorpicker-topbar edui-clearfix">' +
                    '<div unselectable="on" id="{ID}-preview" class="edui-colorpicker-preview"></div>' +
                    '<div unselectable="on" id="{ID}-clearcolor" class="edui-colorpicker-nocolor">'+ clearColor +'</div>' +
                    '</div>' +
                    '<table style="border-collapse: collapse;" cellspacing="0" cellpadding="0">' +
                    '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#366092;padding-top: 2px"><td colspan="10">'+themeColor+'</td> </tr>'+
                    '<tr class="edui-colorpicker-tablefirstrow" >';

            for (var i=0; i<COLORS.length; i++) {
                if (i && i%10 === 0) {
                    html += '</tr>'+(i==60?'<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#366092;"><td colspan="10">'+standardColor+'</td></tr>':'')+'<tr'+(i==60?' class="edui-colorpicker-tablefirstrow"':'')+'>';
                }
                html += i<70 ? '<td style="padding: 0 2px;"><a hidefocus="hidefocus" title="'+COLORS[i]+'" onclick="return false;" href="###" unselectable="on" class="edui-colorpicker-colorcell"' +
                    ' data-color="#'+ COLORS[i] +'"'+
                    ' style="background-color:#'+ COLORS[i] +';border:solid #ccc;'+
                    (i<10 || i>=60?'border-width:1px;':
                        i>=10&&i<20?'border-width:1px 1px 0 1px;':
                            'border-width:0 1px 0 1px;')+
                    '"' +
                    '></a></td>':'';
            }
            html += '</tr></table>';

            this.init({viewText: html});
            this.setProxyListener(['mouseover', 'mouseout', 'click']);
            this.addListener('mouseover', function(t, e){
                e = e.target || e.srcElement;
                var attr = e.getAttribute('data-color') || '',
                    preview = me.getInnerDom('preview');
                preview.style.backgroundColor !== attr && (preview.style.backgroundColor = attr);
            });

            this.addListener('click', function(t, e){
                e = e.target || e.srcElement;
                var color = e.getAttribute('data-color');
                color && me.fireEvent('setcolor', color);
                me.hide();
            });

            this.addListener('render', function(){
                utils.on(me.getInnerDom('clearcolor'), 'click', function(){
                    me.fireEvent('setcolor', 'default');
                    me.hide();
                } );
            });
        };

    utils.inherits(cpk, views.Pop);
})(UE.ui);
