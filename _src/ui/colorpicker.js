//colorpicker 类
UE.ui.define('colorpicker', {
    tpl: (function () {
        var COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');

        var html = '<div class="colorpicker">' +
            '<div class="colorpicker-topbar">' +
            '<div class="colorpicker-preview"></div>' +
            '<div class="colorpicker-nocolor">清空颜色</div>' +
            '</div>' +
            '<table>' +
            '<tr><td colspan="10">主题颜色</td> </tr>' +
            '<tr class="colorpicker-firstrow" >';

        for (var i = 0; i < COLORS.length; i++) {
            if (i && i % 10 === 0) {
                html += '</tr>' + (i == 60 ? '<tr><td colspan="10">标准颜色</td></tr>' : '') + '<tr' + (i == 60 ? ' class="colorpicker-firstrow"' : '') + '>';
            }
            html += i < 70 ? '<td><a title="' + COLORS[i] + '" class="colorpicker-colorcell"' +
                ' data-color="#' + COLORS[i] + '"' +
                ' style="background-color:#' + COLORS[i] + ';border:solid #ccc;' +
                (i < 10 || i >= 60 ? 'border-width:1px;' :
                    i >= 10 && i < 20 ? 'border-width:1px 1px 0 1px;' :
                        'border-width:0 1px 0 1px;') +
                '"' +
                '></a></td>' : '';
        }
        html += '</tr></table></div>';
        return html;
    })(),
    init: function () {
        var me = this;

        me.root($(me.tpl));

        me.root().find("table")
            .on("mouseover",function (e) {
                var color = e.target.getAttribute('data-color');
                if (color) {
                    me.root().find(".colorpicker-preview").css("background-color", color);
                }
            })
            .on("mouseout",function () {
                me.root().find(".colorpicker-preview").css("background-color", "");
            })
            .on("click",function (e) {
                var color = e.target.getAttribute('data-color');
                if (color) {
                    me.trigger('pickcolor', color);
                }
            });
    }
});