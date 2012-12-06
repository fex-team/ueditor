/**
 * @file
 * @name ui.View.AutoTypeset
 * @import ui/ui.view.pop.js
 * @desc autotypeset实现类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.AutoTypeset
         * @grammar view = ui.View.AutoTypeset(ui)
         */
        autotp = views.AutoTypeset = function(ui){
            var me = this,
                opt = ui.getEditorOptions('autotypeset') || {},
                lang = ui.getLang("autoTypeSet"),
                html = '<div class="edui-autotypesetpicker">' +
                        '<div class="edui-autotypesetpicker-body">' +
                        '<table >' +
                        '<tr><td colspan="2"><input type="checkbox" name="mergeEmptyline" '+ (opt["mergeEmptyline"] ? "checked" : "" )+'>'+lang.mergeLine+'</td><td colspan="2"><input type="checkbox" name="removeEmptyline" '+ (opt["removeEmptyline"] ? "checked" : "" )+'>'+lang.delLine+'</td></tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="removeClass" '+ (opt["removeClass"] ? "checked" : "" )+'>'+lang.removeFormat+'</td><td colspan="2"><input type="checkbox" name="indent" '+ (opt["indent"] ? "checked" : "" )+'>'+lang.indent+'</td></tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="textAlign" '+ (opt["textAlign"] ? "checked" : "" )+'>'+lang.alignment+'：</td><td colspan="2" id="textAlignValue"><input type="radio" name="textAlignValue" value="left" '+((opt["textAlign"]&&opt["textAlign"]=="left") ? "checked" : "")+'>'+ui.getLang("justifyleft")+'<input type="radio" name="textAlignValue" value="center" '+((opt["textAlign"]&&opt["textAlign"]=="center") ? "checked" : "")+'>'+ui.getLang("justifycenter")+'<input type="radio" name="textAlignValue" value="right" '+((opt["textAlign"]&&opt["textAlign"]=="right") ? "checked" : "")+'>'+ui.getLang("justifyright")+' </tr>'+
                        '<tr><td colspan="2"><input type="checkbox" name="imageBlockLine" '+ (opt["imageBlockLine"] ? "checked" : "" )+'>'+lang.imageFloat+'</td>' +
                        '<td colspan="2" id="imageBlockLineValue">' +
                        '<input type="radio" name="imageBlockLineValue" value="none" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="none") ? "checked" : "")+'>' + ui.getLang("default")+
                        '<input type="radio" name="imageBlockLineValue" value="left" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="left") ? "checked" : "")+'>' + ui.getLang("justifyleft")+
                        '<input type="radio" name="imageBlockLineValue" value="center" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="center") ? "checked" : "")+'>' + ui.getLang("justifycenter") +
                        '<input type="radio" name="imageBlockLineValue" value="right" '+((opt["imageBlockLine"]&&opt["imageBlockLine"]=="right") ? "checked" : "")+'>'+ui.getLang("justifyright")+'</tr>'+

                        '<tr><td colspan="2"><input type="checkbox" name="clearFontSize" '+ (opt["clearFontSize"] ? "checked" : "" )+'>'+lang.removeFontsize+'</td><td colspan="2"><input type="checkbox" name="clearFontFamily" '+ (opt["clearFontFamily"] ? "checked" : "" )+'>'+lang.removeFontFamily+'</td></tr>'+
                        '<tr><td colspan="4"><input type="checkbox" name="removeEmptyNode" '+ (opt["removeEmptyNode"] ? "checked" : "" )+'>'+lang.removeHtml+'</td></tr>'+
                        '<tr><td colspan="4"><input type="checkbox" name="pasteFilter" '+ (opt["pasteFilter"] ? "checked" : "" )+'>'+lang.pasteFilter+'</td></tr>'+
                        '<tr><td colspan="4" align="right"><button id="{ID}-run">'+lang.run+'</button></td></tr>'+
                        '</table>'+
                        '</div>' +
                        '</div>';

            this.init({viewText: html});

            this.setProxyListener('click');
            this.addListener('render', function(){
                utils.on(me.getInnerDom('run'), 'click', function(){
                    var opt =  {},
                        cont = me.dom,
                        ipts = utils.getElementsByTagName(cont,"input");

                    for(var i=ipts.length-1,ipt;ipt=ipts[i--];){
                        if(ipt.getAttribute("type")=="checkbox"){
                            var attrName = ipt.getAttribute("name");
                            opt[attrName] && delete opt[attrName];
                            if(ipt.checked){
                                var attrValue = document.getElementById(attrName+"Value");
                                if(attrValue){
                                    if(/input/ig.test(attrValue.tagName)){
                                        opt[attrName] = attrValue.value;
                                    }else{
                                        var iptChilds = attrValue.getElementsByTagName("input");
                                        for(var j=iptChilds.length-1,iptchild;iptchild=iptChilds[j--];){
                                            if(iptchild.checked){
                                                opt[attrName] = iptchild.value;
                                                break;
                                            }
                                        }
                                    }
                                }else{
                                    opt[attrName] = true;
                                }
                            }
                        }
                    }

                    var selects = utils.getElementsByTagName(cont,"select");

                    for(var i=0,si;si=selects[i++];){
                        var attr = si.getAttribute('name');
                        opt[attr] = opt[attr] ? si.value : '';
                    }

                    me.fireEvent('setoption', opt);
                });
            });
        };

    utils.inherits(autotp, views.Pop);
    autotp = views = null;
})(UE.ui);

