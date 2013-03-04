///import core
///import uicore
(function (){
    var utils = baidu.editor.utils,
        uiUtils = baidu.editor.ui.uiUtils,
        UIBase = baidu.editor.ui.UIBase,
        ColorPicker = baidu.editor.ui.ColorPicker = function (options){
            this.initOptions(options);
            this.noColorText = this.noColorText || this.editor.getLang("clearColor");
            this.initUIBase();
        };

    ColorPicker.prototype = {
        hue:360,
        ishide : true,
        saturation:100,
        brightness:100,
        getHtmlTpl: function (){
            return genColorPicker(this.noColorText,this.editor);
        },
        getPad:function(){
            return this.getDom("pad");
        },
        getSliderMain:function(){
            return this.getDom("sliderMain");
        },
        getThumb:function(){
            return this.getDom("thumb");
        },
        getPreview:function(){
            return this.getDom('preview');
        },
        getAdv:function(){
            return this.getDom("adv");
        },
        _onTableClick: function (evt){
            var tgt = evt.target || evt.srcElement;
            var color = tgt.getAttribute('data-color');
            if (color) {
                this.fireEvent('pickcolor', color);
            }
        },
        _onTableOver: function (evt){
            var tgt = evt.target || evt.srcElement;
            var color = tgt.getAttribute('data-color');
            if (color) {
                this.getPreview().style.backgroundColor = color;
            }
        },
        _onTableOut: function (){
            this.getPreview().style.backgroundColor = '';
        },
        _onPickNoColor: function (){
            this.fireEvent('picknocolor');
        },
        _onShowAdv:function(){
            if(browser.ie && browser.version<=6){
                alert("您的浏览器版本太低，请使用高级版本的浏览器")
                return;
            }
            this.toggleAdv();
        },
        toggleAdv:function(ishide){
            var obj = this.getDom("togglehandle");
            if(ishide&&this.ishide){
                return;
            }
            this.getAdv().style.display=this.ishide?"block":"none";
            domUtils.removeClasses(obj,["arrow_down","arrow_up"]);
            this.ishide?domUtils.addClass(obj,"arrow_up"):domUtils.addClass(obj,"arrow_down");
            this.ishide = !this.ishide;
            this.fireEvent("changeheight");
        },
        _onPadDotMouseDown:function(evt){
            var me = this;
            uiUtils.startDrag(evt, {
                ondragstart: function (){},
                ondragmove: function (x, y,evt){
                    me._onClickPad(evt);
                },
                ondragstop:function(){}
            });
        },
        /**
         * 校准value值，保证它在合理范围内
         * @private
         * @param {Number} x 范围上限,被校准的数值不能超过这个数值.
         * @param {Number} y 需要校准的数值.
         * @return {Number} 校准过的数值.
         */
        _adjustValue: function(x, y) {
            return Math.max(0, Math.min(x, y));
        },
        _onClickPad:function(evt){
            var me = this,
                paddot = me.getDom("paddot"),
                pdrect = uiUtils.getClientRect(paddot),
                rect = uiUtils.getClientRect(me.getPad()),
                evtoffset = uiUtils.getViewportOffsetByEvent(evt);
            //计算鼠标坐标相对调色板左上角距离
            me.padDotY = me._adjustValue(rect.height, evtoffset.top - rect.top);
            me.padDotX = me._adjustValue(rect.width, evtoffset.left - rect.left);

            me.safeSetOffset(paddot,{
                top: me.padDotY-pdrect.height/2 ,
                left:  me.padDotX-pdrect.width/2
            });

            me.saturation = parseInt(100 * me.padDotX / rect.width, 10); //根据调色块top值计算饱和度
            me.brightness = parseInt(100 * (rect.height - me.padDotY) / rect.height, 10); //根据调色块left值计算亮度
            me._setNewColor();

        },
        /**
         * 将rgb格式转成hex格式
         * @private
         * @param {Object} rgb rgb格式颜色值.
         * @return {String} hex格式颜色值.
         */
        _RGBToHex: function(rgb) {
            var hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
            for(var i= 0;i<hex.length;i++){
                if(hex[i].length == 1){
                    hex[i] = '0'+hex[i];
                }
            }
            return hex.join('');
        },
        /**
         * 将HSB格式转成RGB格式
         * @private
         * @param {Object} hsb hsb格式颜色值.
         * @return {Object} rgb格式颜色值.
         */
        _HSBToRGB: function(hsb) {
            var rgb = {},
                h = Math.round(hsb.h),
                s = Math.round(hsb.s * 255 / 100),
                v = Math.round(hsb.b * 255 / 100);
            if (s == 0) {
                rgb.r = rgb.g = rgb.b = v;
            } else {
                var t1 = v,
                    t2 = (255 - s) * v / 255,
                    t3 = (t1 - t2) * (h % 60) / 60;
                if (h == 360) h = 0;
                if (h < 60) {rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3;}
                else if (h < 120) {rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3;}
                else if (h < 180) {rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3;}
                else if (h < 240) {rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3;}
                else if (h < 300) {rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3;}
                else if (h < 360) {rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3;}
                else {rgb.r = 0; rgb.g = 0; rgb.b = 0;}
            }

            return {
                r: Math.round(rgb.r),
                g: Math.round(rgb.g),
                b: Math.round(rgb.b)
            };
        },
        /**
         * 将hsb格式转成hex格式
         * @private
         * @param {Object} hsb hsb格式颜色值.
         * @return {String} hex格式颜色值.
         */
        _HSBToHex: function(hsb) {
            var me = this;
            return me._RGBToHex(me._HSBToRGB(hsb));
        },
        _setNewColor: function() {
                var me = this;
            //记录当前hex格式颜色值
            me.hex = '#' + me._HSBToHex({
                h: me.hue,
                s: me.saturation,
                b: me.brightness
            });
            domUtils.setStyle(this.getPreview(),"background",me.hex);
        },
        _onSliderMouseDown:function(evt,obj){
            var rect,sliderrect,
            me = this,
            slider = me.getThumb(),
            sliderMain = me.getSliderMain();
            uiUtils.startDrag(evt, {
                ondragstart: function (){
                    rect = uiUtils.getClientRect(sliderMain);
                    sliderrect = uiUtils.getClientRect(slider);
                },
                ondragmove: function (x, y,evt){
                    var top = sliderrect.top - rect.top + y,
                        mousePos = uiUtils.getViewportOffsetByEvent(evt),
                        val = mousePos.top - rect.top - sliderrect.height / 2,
                        len = rect.height - sliderrect.height;
                    me.safeSetOffset(slider,{
                        top: Math.min(rect.bottom-rect.top-sliderrect.height,top)
                    });
                    me.value = (rect.height - 0) / len * val + 0;
                    me.setPadBackground();
                },
                ondragstop: function (){}
            });
        },
        _onClickSliderMain:function(evt,obj){
            var me = this,
                mousePos = uiUtils.getViewportOffsetByEvent(evt),
                thumb = me.getThumb(),
                thumbRect = uiUtils.getClientRect(thumb),
                sliderMainRect = uiUtils.getClientRect(me.getSliderMain()),
                len = sliderMainRect.height - thumbRect.height,
                val = mousePos.top - sliderMainRect.top - thumbRect.height / 2;
            me.value = (sliderMainRect.height - 0) / len * val + 0;
            thumb.style.top = me.value+"px";
            me.setPadBackground();
        },
        safeSetOffset: function (obj,offset){
            var el = obj;
            var vpRect = uiUtils.getViewportRect();
            var rect = uiUtils.getClientRect(el);
            var left = offset.left||0;
            if (left + rect.width > vpRect.right) {
                left = vpRect.right - rect.width;
            }
            var top = offset.top||0;
            if (top + rect.height > vpRect.bottom) {
                top = vpRect.bottom - rect.height;
            }
            domUtils.setStyle(el,"left",Math.max(left, 0) + 'px');
            domUtils.setStyle(el,"top",Math.max(top, 0) + 'px');
        },
        /**
         * 设置pad背景色
         */
        setPadBackground:function(){
            var me = this,
                pad = me.getPad(),
                thumb = me.getThumb(),
                sliderMainRect = uiUtils.getClientRect(me.getSliderMain());
            me.hue = parseInt(360 * (sliderMainRect.height - Math.min(me.value,sliderMainRect.height)) / sliderMainRect.height,10);
            //设置面板背景色
            domUtils.setStyle(pad,'background-color','#' + me._HSBToHex({
                h: Math.max(me.hue,0),
                s: 100,
                b: 100
            }));
            me._setNewColor();
        }
    };
    utils.inherits(ColorPicker, UIBase);

    var COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
            'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
            'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
            'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
            'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
            '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
            'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0,').split(',');

    function genColorPicker(noColorText,editor){
        var html = '<div id="##" class="edui-colorpicker %%">' +
            '<div class="edui-colorpicker-topbar edui-clearfix">' +
             '<div unselectable="on" id="##_preview" class="edui-colorpicker-preview"></div>' +
             '<div unselectable="on" class="edui-colorpicker-nocolor" onclick="$$._onPickNoColor(event, this);">'+ noColorText +'</div>' +
            '</div>' +
            '<table  class="edui-box" style="border-collapse: collapse;" onmouseover="$$._onTableOver(event, this);" onmouseout="$$._onTableOut(event, this);" onclick="return $$._onTableClick(event, this);" cellspacing="0" cellpadding="0">' +
            '<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;padding-top: 2px"><td colspan="10">'+editor.getLang("themeColor")+'</td> </tr>'+
            '<tr class="edui-colorpicker-tablefirstrow" >';
        for (var i=0; i<COLORS.length; i++) {
            if (i && i%10 === 0) {
                html += '</tr>'+(i==60?'<tr style="border-bottom: 1px solid #ddd;font-size: 13px;line-height: 25px;color:#39C;"><td colspan="10">'+editor.getLang("standardColor")+'</td></tr>':'')+'<tr'+(i==60?' class="edui-colorpicker-tablefirstrow"':'')+'>';
            }
            html += i<70 ? '<td style="padding: 0 2px;"><a hidefocus title="'+COLORS[i]+'" onclick="return false;" href="javascript:" unselectable="on" class="edui-box edui-colorpicker-colorcell"' +
                        ' data-color="#'+ COLORS[i] +'"'+
                        ' style="background-color:#'+ COLORS[i] +';border:solid #ccc;'+
                        (i<10 || i>=60?'border-width:1px;':
                         i>=10&&i<20?'border-width:1px 1px 0 1px;':

                        'border-width:0 1px 0 1px;')+
                        '"' +
                    '></a></td>':'';
        }
        html += '</tr></table>';
        //高级按钮
        html += '<span id="##_togglehandle" class="edui-colorpicker-advbtn arrow_down" onclick="$$._onShowAdv(event, this);"></span>';
        html += getAdvColorPicker();
        html += '</div>';
        return html;
    }


    function getAdvColorPicker(){
        var html = '<div id="##_adv" class="edui-colorpicker-adv" >' +
            '<div id="##_pad" class="edui-colorpicker-pad" style="background-color: rgb(255, 0, 0);" onclick = "$$._onClickPad(event,this)">' +
                '<div class="edui-colorpicker-cover"></div>' +
                '<div id="##_paddot" class="edui-colorpicker-padDot" style="top: 48px; left: 59px;" onmousedown="$$._onPadDotMouseDown(event,this)" ></div>'+
            '</div>' +
            '<div class="edui-colorpicker-sliderMain" id="##_sliderMain" onclick="$$._onClickSliderMain(event,this)">' +
                '<div class="edui-colorpicker-slider" id="##_slider">' +
                    '<div id="##_thumb" class="edui-colorpicker-thumb" style="top: -3px;" onmousedown="$$._onSliderMouseDown(event, this);"></div>' +
                '</div>' +
            '</div>' +
        '</div> ';
        return html;
    }
})();
