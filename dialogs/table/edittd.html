<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <script type="text/javascript" src="../internal.js"></script>
    <style type="text/css">
        * {margin: 0; padding: 0}
        table { margin: 10px;font-size: 12px}
        table tr { height: 25px}
        input { width: 110px;border: 1px solid #ccc;}
        select { width: 76px;margin-left:6px\9; }
        span.strong {font-weight: bold;}
    </style>
</head>
<body>
<table>
    <tr>
        <td width="70"><span class="strong"><var id="lang_background"></var></span></td>
        <td><input id="bgColor" type="text" value="#FFFFFF"></td>
    </tr>
    <tr>
        <td rowspan="2"><span class="strong"><var id="lang_alignment"></var></span></td>
        <td><var id="lang_horizontal"></var>:&nbsp;<select id="align">
                <option value="">默认</option>
                <option value="center">居中</option>
                <option value="left">居左</option>
                <option value="right">居右</option>
            </select>
        </td>
    </tr>
    <tr>
        <td><var id="lang_vertical"></var>:&nbsp;<select id="vAlign">
                <option value="">默认</option>
                <option value="middle">居中</option>
                <option value="top">顶端对齐</option>
                <option value="bottom">底端对齐</option>
            </select>
        </td>
    </tr>

</table>
<script type="text/javascript">
    addColorPickListener();
    dialog.onok = function () {
        var tdItem = {
            bgColor:$G( "bgColor" ).value || "#FFFFFF",
            align:$G( "align" ).value || "",
            vAlign:$G( "vAlign" ).value || ""
        };
        editor.execCommand( "edittd", tdItem );
    };
    (function () {
        if ( !editor.currentSelectedArr.length ) {
            var range = editor.selection.getRange();
            var td = domUtils.findParentByTagName( range.startContainer, 'td', true );
            if ( td ) {
                $G( "bgColor" ).value = (td.bgColor || "#FFFFFF").toUpperCase();
                $G( "align" ).value = td.align || "";
                $G( "vAlign" ).value = td.vAlign || "";
            }
        }
    })();
    /**
     * 绑定取色器监听事件
     */
    function addColorPickListener() {
        var colorPicker = getColorPicker(),
                ids = ["bgColor"];
        for ( var i = 0, ci; ci = $G( ids[i++] ); ) {
            domUtils.on( ci, "click", function () {
                var me = this;
                showColorPicker( colorPicker, me );
                colorPicker.content.onpickcolor = function ( t, color ) {
                    me.value = color.toUpperCase();
                    colorPicker.hide();
                };
                colorPicker.content.onpicknocolor = function () {
                    me.value = '';
                    colorPicker.hide();
                };
            } );
            domUtils.on( ci, "keyup", function () {
                colorPicker.hide();
            } );
        }
        domUtils.on( document, 'mousedown', function () {
            UE.ui.Popup.postHide( this );
        } );
    }

    /**
     * 实例化一个colorpicker对象
     */
    function getColorPicker() {
        return new UE.ui.Popup( {
            editor:editor,
            content:new UE.ui.ColorPicker( {
                noColorText:lang.noColor,
                editor:editor
            } )
        } );
    }

    /**
     * 在anchorObj上显示colorpicker
     * @param anchorObj
     */
    function showColorPicker( colorPicker, anchorObj ) {
        colorPicker.showAnchor( anchorObj );
    }
</script>
</body>
</html>