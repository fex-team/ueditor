/**
 * Created with JetBrains PhpStorm.
 * User: Jinqn
 * Date: 13-10-12
 * Time: 上午10:20
 * To change this template use File | Settings | File Templates.
 */
UE.plugins['tablesort'] = function () {
    var me = this,
        UT = UE.UETable,
        getUETable = function (tdOrTable) {
            return UT.getUETable(tdOrTable);
        },
        getTableItemsByRange = function (editor) {
            return UT.getTableItemsByRange(editor);
        };


    me.ready(function () {
        //添加表格可排序的样式
        utils.cssRule('tablesort',
            'table.sortEnabled tr:first-child th,table.sortEnabled tr:first-child td{padding-right:20px;background-repeat: no-repeat;background-position: center right;' +
                '   background-image:url(' + me.options.themePath + me.options.theme + '/images/sortable.png);}',
            me.document);

        //做单元格合并操作时,清除可排序标识
        me.addListener("afterexeccommand", function (type, cmd) {
            if( cmd == 'mergeright' || cmd == 'mergedown' || cmd == 'mergecells') {
                this.execCommand('disablesort');
            }
        });
    });

    //表格排序
    UE.commands['sorttable'] = {
        queryCommandState: function () {
            var me = this,
                tableItems = getTableItemsByRange(me);
            if (!tableItems.cell) return -1;
            var table = tableItems.table,
                cells = table.getElementsByTagName("td");
            for (var i = 0, cell; cell = cells[i++];) {
                if (cell.rowSpan != 1 || cell.colSpan != 1) return -1;
            }
            return 0;
        },
        execCommand: function (cmd, fn) {
            var me = this,
                range = me.selection.getRange(),
                bk = range.createBookmark(true),
                tableItems = getTableItemsByRange(me),
                cell = tableItems.cell,
                ut = getUETable(tableItems.table),
                cellInfo = ut.getCellInfo(cell);
            ut.sortTable(cellInfo.cellIndex, fn);
            range.moveToBookmark(bk).select();
        }
    };

    //设置表格可排序,清除表格可排序
    UE.commands["enablesort"] = UE.commands["disablesort"] = {
        queryCommandState: function (cmd) {
            var table = getTableItemsByRange(this).table;
            if(table && cmd=='enablesort') {
                var cells = domUtils.getElementsByTagName(table, 'th td');
                for(var i = 0; i<cells.length; i++) {
                    if(cells[i].getAttribute('colspan')>1 || cells[i].getAttribute('rowspan')>1) return -1;
                }
            }

            return !table ? -1: cmd=='enablesort' ^ table.getAttribute('data-sort')!='sortEnabled' ? 1:0;
        },
        execCommand: function (cmd) {
            var table = getTableItemsByRange(this).table;
            table.setAttribute("data-sort", cmd == "enablesort" ? "sortEnabled" : "sortDisabled");
            cmd == "enablesort" ? table.classList.add("sortEnabled"):table.classList.remove("sortEnabled");
        }
    };
};
