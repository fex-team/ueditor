/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-2-23
 * Time: 上午11:32
 * To change this template use File | Settings | File Templates.
 */

    var init = function(){
        addColorPickListener();
        addPxChangeListener();
        addFloatListener();
        addBorderTypeChangeListener();
    };

    function addBorderTypeChangeListener(){
        domUtils.on($G("borderType"),"change",createTable);
    }

    function addFloatListener(){
        domUtils.on($G("align"),"change",function(){
            setTablePosition(this.value);
        })

    }

    /**
     * 根据传入的value值变更table的位置
     * @param value
     */
    function setTablePosition(value){
        var table = $G("preview").children[0],
            margin = (table.parentNode.offsetWidth - table.offsetWidth)/2;
        if(value=="center"){
            table.style.marginLeft = margin +"px";
        }else if(value=="right"){
            table.style.marginLeft = 2*margin +"px";
        }else{
            table.style.marginLeft = "5px";
        }
    }

    /**
     * 绑定border、spaceing等更改事件
     */
    function addPxChangeListener(){
        var ids = ["border","cellPadding","cellSpacing"];
        for(var i=0,ci;ci=$G(ids[i++]);){
            domUtils.on(ci,"keyup",function(){
                $G("message").style.display="none";
                switch(this.id){
                    case "border":
                        $G("border").value = filter(this.value,"border");
                        break;
                    case "cellPadding":
                        $G("cellPadding").value = filter(this.value,"cellPadding");
                        break;
                    case "cellSpacing":
                        $G("cellSpacing").value = filter(this.value,"cellSpacing");
                        break;
                    default:

                }
                createTable();
                //setTablePosition($G("align").value);
            });
        }
    }

    function isNum(str){
        return /^(0|[1-9][0-9]*)$/.test( str );
    }

    /**
     * 依据属性框中的属性值创建table对象
     */
    function createTable(){
        var border=$G("border").value || 1,
            borderColor=$G("borderColor").value || "#000000",
            cellPadding=$G("cellPadding").value || 0,
            cellSpacing=$G("cellSpacing").value || 0,
            bgColor=$G("bgColor").value || "#FFFFFF",
            align=$G("align").value || "",
            borderType=$G("borderType").value || 0;

        border = setMax(border,5);
        cellPadding = setMax(cellPadding,5);
        cellSpacing = setMax(cellSpacing,5);

        var html = ["<table "];
        html.push(' style="border-collapse:'+(cellSpacing>0?"separate":"collapse")+';" ');
        cellSpacing>0 && html.push(' cellSpacing="' + cellSpacing + '" ');
        html.push(' border="' + border +'" borderColor="' + borderColor +'"');
        bgColor && html.push(' bgColor="' + bgColor + '"');
        html.push(' ><tr><td colspan="3"><var id="lang_forPreview">'+lang.static.lang_forPreview+'</var></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>');
        var preview = $G("preview");
        preview.innerHTML = html.join("");
        //如果针对每个单元格
        var table = preview.firstChild;
        if(borderType=="1"){
            for(var i =0,td,tds = domUtils.getElementsByTagName(table,"td");td = tds[i++];){
                td.style.border = border + "px solid " + borderColor;
            }
        }
        for(var i =0,td,tds = domUtils.getElementsByTagName(table,"td");td = tds[i++];){
            td.style.padding = cellPadding + "px";
        }
        setTablePosition(align.toLowerCase());
    }
    function setMax(value,max){
        return value>max? max:value;
    }
    function filter(value,property){
        var maxPreviewValue = 5,
                maxValue = 10;
        if(!isNum(value) && value!=""){
            $G(property).value = "";
            $G("message").style.display ="";
            $G("messageContent").innerHTML= lang.errorNum;
            return property=="border"?1:0;
        }
        if(value > maxPreviewValue){
            $G("message").style.display ="";
            $G("messageContent").innerHTML= lang.overflowPreviewMsg.replace("{#value}",maxPreviewValue);
            if(value>maxValue){
                $G("messageContent").innerHTML = lang.overflowMsg.replace("{#value}",maxValue);
                $G(property).value = maxValue;
                return maxValue;
            }
        }
        return value;
    }
    /**
     * 绑定取色器监听事件
     */
    function addColorPickListener(){
        var colorPicker = UE.getColorPicker(editor),
            ids = ["bgColor","borderColor"];
        for(var i=0,ci;ci = $G(ids[i++]); ){
            domUtils.on(ci,"click",function(){
                var me = this;
                showColorPicker(colorPicker,me);
                colorPicker.onsetcolor = function(t,color){
                    me.value = 'default' === color ? "" : color.toUpperCase();
                    colorPicker.hide();
                    createTable();
                }
            });
            domUtils.on(ci,"keyup",function(){
                colorPicker.hide();
                createTable();
            });
        }
        domUtils.on(document, 'mousedown', function (){
            colorPicker.hide()
        });
    }
    /**
     * 在anchorObj上显示colorpicker
     * @param anchorObj
     */
    function showColorPicker(colorPicker,anchorObj){
        colorPicker.show(anchorObj);
    }
