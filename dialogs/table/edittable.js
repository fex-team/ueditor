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
        autoSizeContent = $G("J_autoSizeContent"),
        autoSizePage = $G("J_autoSizePage"),
        preview = $G("J_preview");

    var editTable = function () {
        this.init();
    };
    editTable.prototype = {
        init:function () {
            var me = this;

            title.checked = editor.queryCommandState("inserttitle") == -1;
            caption.checked = editor.queryCommandState("insertcaption") == -1;

            me.createTable(title.checked, caption.checked);
            me.setAutoSize();

            domUtils.on(title, "click", me.titleHanler);
            domUtils.on(caption, "click", me.captionHanler);
            domUtils.on(autoSizeContent, "click", me.autoSizeContentHanler);
            domUtils.on(autoSizePage, "click", me.autoSizePageHanler);
        },

        createTable:function (hasCaption, hasTitle) {
            var doc = document,
                arr = [];
            arr.push("<table id='J_example'>");
            if (hasCaption) {
                arr.push("<caption>"+lang.captionName+"</caption>")
            }
            if (hasTitle) {
                arr.push("<tr>");
                for(var j=0;j<5;j++){
                    arr.push("<th>"+lang.titleName+"</th>")
                }
                arr.push("</tr>");
            }
            for (var i = 0; i < 6; i++) {
                arr.push("<tr>");
                for(var k=0;k<5;k++){
                    arr.push("<td>"+lang.cellsName+"</td>")
                }
                arr.push("</tr>");
            }
            arr.push("</table>");
            $G("J_preview").innerHTML = arr.join("");
        },

        titleHanler:function () {
            var example = $G("J_example");
            if (title.checked) {
                var row = document.createElement("tr");
                row.innerHTML = "<th>"+lang.titleName+"</th><th>"+lang.titleName+"</th><th>"+lang.titleName+"</th><th>"
                    +lang.titleName+"</th><th>"+lang.titleName+"</th>";
                example.insertBefore(row, example.firstChild);
            } else {
                domUtils.remove(example.rows[0]);
            }
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
        setAutoSize:function(){
            var me=this,
                start = editor.selection.getStart(),
                flag=!domUtils.findParentByTagName(start, "table",true).width;
            if(flag){
                autoSizeContent.checked=flag;
                me.autoSizeContentHanler();
            }else{
                autoSizePage.checked=!flag;
                me.autoSizePageHanler();
            }
        }
    };

    new editTable;

    function adaptByTextTable(){
        editor.execCommand("adaptbywindow");
        editor.execCommand('adaptbytext');
    }
    dialog.onok = function () {
        title.checked ? editor.execCommand("inserttitle") : editor.execCommand("deletetitle");
        caption.checked ? editor.execCommand("insertcaption") : editor.execCommand("deletecaption");
        autoSizeContent.checked ? adaptByTextTable(): editor.execCommand("adaptbywindow");
    };
})();