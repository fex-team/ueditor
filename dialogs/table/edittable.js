/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-12-19
 * Time: 下午4:55
 * To change this template use File | Settings | File Templates.
 */
(function () {
    var title = $G("J_title"),
        caption = $G("J_caption"),
        sorttable = $G("J_sorttable"),
        autoSizeContent = $G("J_autoSizeContent"),
        autoSizePage = $G("J_autoSizePage"),
        tone = $G("J_tone"),
        me,
        preview = $G("J_preview");

    var editTable = function () {
        me = this;
        me.init();
    };
    editTable.prototype = {
        init:function () {
            var colorPiker = new UE.ui.ColorPicker({
                    editor:editor
                }),
                colorPop = new UE.ui.Popup({
                    editor:editor,
                    content:colorPiker
                });

            title.checked = editor.queryCommandState("inserttitle") == -1;
            caption.checked = editor.queryCommandState("insertcaption") == -1;

            me.createTable(title.checked, caption.checked);
            me.setAutoSize();
            me.setColor(me.getColor());

            domUtils.on(title, "click", me.titleHanler);
            domUtils.on(caption, "click", me.captionHanler);
            domUtils.on(sorttable, "click", me.sorttableHanler);
            domUtils.on(autoSizeContent, "click", me.autoSizeContentHanler);
            domUtils.on(autoSizePage, "click", me.autoSizePageHanler);

            domUtils.on(tone, "click", function () {
                colorPop.showAnchor(tone);
            });
            domUtils.on(document, 'mousedown', function () {
                colorPop.hide();
            });
            colorPiker.addListener("pickcolor", function () {
                me.setColor(arguments[1]);
                colorPop.hide();
            });
            colorPiker.addListener("picknocolor", function () {
                me.setColor("");
                colorPop.hide();
            });
        },

        createTable:function (hasTitle, hasCaption) {
            var arr = [];
            arr.push("<table id='J_example'>");
            if (hasCaption) {
                arr.push("<caption>" + lang.captionName + "</caption>")
            }
            if (hasTitle) {
                arr.push("<tr>");
                for (var j = 0; j < 5; j++) {
                    arr.push("<th>" + lang.titleName + "</th>")
                }
                arr.push("</tr>");
            }
            for (var i = 0; i < 6; i++) {
                arr.push("<tr>");
                for (var k = 0; k < 5; k++) {
                    arr.push("<td>" + lang.cellsName + "</td>")
                }
                arr.push("</tr>");
            }
            arr.push("</table>");
            preview.innerHTML = arr.join("");
        },

        titleHanler:function () {
            var example = $G("J_example"),
                 frg=document.createDocumentFragment(),
                color = domUtils.getComputedStyle(domUtils.getElementsByTagName(example, "td")[0], "border-color");

            if (title.checked) {
                example.insertRow(0);
                for (var i = 0, node; i < 5; i++) {
                    node = document.createElement("th");
                    node.innerHTML = lang.titleName;
                    frg.appendChild(node);
                }
                example.rows[0].appendChild(frg);

            } else {
                domUtils.remove(example.rows[0]);
            }
            me.setColor(color);
        },
        captionHanler:function () {
            var example = $G("J_example");
            if (caption.checked) {
                var row = document.createElement('caption');
                row.innerHTML = lang.captionName;
                example.insertBefore(row, example.firstChild);
            } else {
                domUtils.remove(domUtils.getElementsByTagName(example, 'caption')[0]);
            }
        },
        sorttableHanler:function(){
            var example = $G("J_example"),
                row = example.rows[0];
            if (sorttable.checked) {
                for(var i = 0,cell;cell = row.cells[i++];){
                    var span = document.createElement("span");
                    span.innerHTML = "^";
                    cell.appendChild(span);
                }
            } else {
                var spans = domUtils.getElementsByTagName(example,"span");
                utils.each(spans,function(span){
                    span.parentNode.removeChild(span);
                })
            }
        },
        autoSizeContentHanler:function () {
            var example = $G("J_example");
            example.removeAttribute("width");
        },
        autoSizePageHanler:function () {
            var example = $G("J_example");
            var tds = example.getElementsByTagName(example, "td");
            utils.each(tds, function (td) {
                td.removeAttribute("width");
            });
            example.setAttribute('width', '100%');
        },

        getColor:function () {
            var start = editor.selection.getStart(), color,
                cell = domUtils.findParentByTagName(start, ["td", "th", "caption"], true);
            color = domUtils.getComputedStyle(cell, "border-color");
            if (!color)  color = "#DDDDDD";
            return color;
        },
        setColor:function (color) {
            var example = $G("J_example"),
                arr = domUtils.getElementsByTagName(example, "td").concat(
                    domUtils.getElementsByTagName(example, "th"),
                    domUtils.getElementsByTagName(example, "caption")
                );

            tone.value = color;
            utils.each(arr, function (node) {
                node.style.borderColor = color;
            });

        },
        setAutoSize:function () {
            var me = this,
                start = editor.selection.getStart(),
                wt = domUtils.findParentByTagName(start, "table", true).width,
                flag = !wt;
            if (flag) {
                autoSizeContent.checked = flag;
                me.autoSizeContentHanler();
            } else {
                autoSizePage.checked = !flag;
                me.autoSizePageHanler();
            }
        }
    };

    new editTable;

    dialog.onok = function () {
        editor.__hasEnterExecCommand = true;

        var checks = {
            title:"inserttitle deletetitle",
            caption:"insertcaption deletecaption",
            sorttable:"enablesort disablesort"
        };
        editor.fireEvent('saveScene');
        for(var i in checks){
            var cmds = checks[i].split(" "),
                input = $G("J_" + i);
            if(input["checked"]){
                editor.queryCommandState(cmds[0])!=-1 &&editor.execCommand(cmds[0]);
            }else{
                editor.queryCommandState(cmds[1])!=-1 &&editor.execCommand(cmds[1]);
            }
        }

        editor.execCommand("edittable", tone.value);
        autoSizeContent.checked ?editor.execCommand('adaptbytext') : "";
        autoSizePage.checked ? editor.execCommand("adaptbywindow") : "";
        editor.fireEvent('saveScene');

        editor.__hasEnterExecCommand = false;
    };
})();