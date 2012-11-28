<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" src="../internal.js"></script>
    <link rel="stylesheet" type="text/css" href="table.css">
</head>
<body>
    <div class="wrapper">
        <fieldset  class="base">
            <legend><var id="lang_baseInfo"></var></legend>
            <table>
                <tr>
                    <td width="120"><label for="numRows"><var id="lang_rows"></var>: </label><input id="numRows" type="text"  /> <var id="lang_rowUnit"></var></td>
                    <td>
                        <label for="width"><var id="lang_width"></var>: </label><input id="width" type="text"  />
                        <label for="widthUnit"><var id="lang_widthUnit"></var>: </label>
                        <select id="widthUnit">
                            <option value="%">%</option>
                            <option value="px">px</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td><label for="numCols"><var id="lang_cols"></var>: </label><input id="numCols" type="text"  /> <var id="lang_colUnit"></var></td>
                    <td>
                        <label for="height"><var id="lang_height"></var>: </label><input id="height" type="text"  />
                        <label for="heightUnit"><var id="lang_heightUnit"></var>: </label>
                        <select id="heightUnit">
                            <option value="%">%</option>
                            <option value="px">px</option>
                        </select>
                    </td>
                </tr>
            </table>
            <div id="message" style="display: none">
                <p><var id="lang_warmPrompt"></var>：</p>
                <p id="messageContent"><var id="lang_maxPadding"></var></p>
            </div>
        </fieldset>
        <div>
            <fieldset  class="extend">
                <legend><var id="lang_extendInfo"></var><span style="font-weight: normal;">(<var id="lang_preview"></var>)</span></legend>
                <table>
                    <tr>
                        <td width="60"><span class="bold"><var id="lang_tableBorder"></var></span>:</td>
                        <td><label for="border"><var id="lang_borderSize"></var>: </label><input id="border" type="text"  /> px&nbsp;</td>
                        <td><label for="borderColor"><var id="lang_borderColor"></var>: </label><input id="borderColor" type="text"  /></td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd">
                        <td><span class="bold"><var id="lang_mar_pad"></var></span>:</td>
                        <td><label for="cellPadding"><var id="lang_margin"></var>: </label><input id="cellPadding" type="text"  /> px&nbsp;</td>
                        <td><label for="cellSpacing"><var id="lang_padding"></var>: </label><input id="cellSpacing" type="text"  /> px </td>
                    </tr>
                    <tr>
                        <td colspan="3"><span class="bold"><var id="lang_table_background"></var></span>:
                            <input id="bgColor" type="text"  />
                        </td>
                    </tr>
                    <tr>
                        <td colspan="3"><span class="bold"><var id="lang_table_alignment"></var></span>:
                            <select id="align">
                                <option value=""></option>
                                <option value="center"></option>
                                <option value="left"></option>
                                <option value="right"></option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                       <td colspan="3">
                           <span class="bold"><var id="lang_borderFor"></var></span>:
                           <select id="borderType">
                               <option value="0"></option>
                               <option value="1"></option>
                           </select>
                       </td>
                    </tr>

                </table>
            </fieldset>

            <div id="preview">
                <table border="1" borderColor="#000" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                    <tr><td colspan="3"><var id="lang_forPreview"></var></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td></tr>
                </table>
            </div>
        </div>
    </div>
    <script type="text/javascript" src="table.js"></script>
    <script type="text/javascript">
        var inputs = document.getElementsByTagName('input'),
            selects=document.getElementsByTagName('select');
        //ie给出默认值
        for(var i=0,ci;ci=inputs[i++];){
            switch (ci.id){
                case 'numRows':
                case 'numCols':
                    ci.value = 5;
                    break;
                case 'bgColor':
                    ci.value = '';
                    break;
                case 'borderColor':
                    ci.value = '#000000';
                    break;
                case 'border':
                    ci.value = 1;
                    break;
                case 'cellSpacing':
                case 'cellPadding':
                    ci.value = '0';
                    break;
                default:
            }
        }
        for(var i=0,ci;ci=selects[i++];){
            ci.options[0].selected = true;
        }
        var state = editor.queryCommandState("edittable");
        if(state == 0){
            var range = editor.selection.getRange(),
                    table = domUtils.findParentByTagName(range.startContainer,'table',true);
            if(table){
                var numRows = table.rows.length,cellCount=0;
                //列取最大数
                for(var i=0,ri;ri=table.rows[i++];){
                    var tmpCellCount = 0;
                    for(var j=0,cj;cj=ri.cells[j++];){
                        if(cj.style.display != 'none'){
                            tmpCellCount++;
                        }
                    }
                    cellCount = Math.max(tmpCellCount,cellCount)
                }
                domUtils.setAttributes($G('numRows'),{
                    'value':numRows,
                    'disabled':true
                });
                domUtils.setAttributes($G('numCols'),{
                    'value':cellCount,
                    'disabled':true
                });

                $G("cellPadding").value = table.getAttribute("cellPadding") || '0';
                $G("cellSpacing").value = table.getAttribute("cellSpacing") || '0';

                var value = table.getAttribute('width');
                value = !value ? ['',table.offsetWidth]:/%$/.test(value) ? value.match(/(\d+)(%)?/) : ['',value.replace(/px/i,'')];
                $G("width").value = value[1];
                $G('widthUnit').options[value[2] ? 0:1].selected = true;
                value = table.getAttribute('height');
                value = !value ? ['','']:/%$/.test(value) ? value.match(/(\d+)(%)?/) : ['',value.replace(/px/i,'')];
                $G("height").value = value[1];
                $G('heightUnit').options[value[2]?0:1].selected = true;
                $G('borderColor').value = (table.getAttribute('borderColor')||"#000000").toUpperCase();
                $G("border").value = table.getAttribute("border");
                for(var i=0,ip,opts= $G("align").options;ip=opts[i++];){
                    if(ip.value == (table.getAttribute('align' )||"").toLowerCase()){
                        ip.selected = true;
                        break;
                    }
                }
                $G("borderType").options[table.getAttribute('borderType') == '1' ? 1: 0].selected = true;
                $G("bgColor").value = (table.getAttribute("bgColor")||"").toUpperCase();
                createTable();
            }
        }else{
            $focus($G("numRows"));
        }
        init();

        domUtils.on($G("width"),"keyup",function(){
            var value = this.value;
            if(value>100){
                $G("widthUnit").value="px";
            }
        });
        domUtils.on($G("height"),"keyup",function(){
            var value = this.value;
            if(value>100){
                $G("heightUnit").value="px";
            }
        });

        dialog.onok = function(){
            for(var i=0,opt={},ci;ci=inputs[i++];){
                switch (ci.id){
                    case 'numRows':
                    case 'numCols':
                    case 'height':
                    case 'width':
                        if(ci.value && !/^[1-9]+[0-9]*$/.test(ci.value)){
                            alert(lang.errorNum);
                            $focus(ci);
                            return false;
                        }
                        break;
                    case 'cellspacing':
                    case 'cellpadding':
                    case 'border':
                        if(ci.value && !/^[0-9]*$/.test(ci.value)){
                            alert(lang.errorNum);
                            $focus(ci);
                            return false;
                        }
                        break;
                    case 'bgColor':
                    case 'borderColor':
                        if(ci.value && !/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(ci.value)){
                            alert(lang.errorColor);
                            $focus(ci);
                            return false;
                        }
                        break;
                    default:
                }
                opt[ci.id] = ci.value || (ci.id == 'border' ? 0 : '')
            }

            for(var i=0,ci;ci=selects[i++];){
                opt[ci.id] = ci.value.toUpperCase()
            }
            editor.execCommand(state == -1 ? 'inserttable' : 'edittable',opt );
        };
    </script>
</body>
</html>