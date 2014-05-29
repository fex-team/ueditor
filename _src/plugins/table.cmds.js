/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 13-2-20
 * Time: 下午6:25
 * To change this template use File | Settings | File Templates.
 */
;
(function () {
    var UT = UE.UETable,
        getTableItemsByRange = function (editor) {
            return UT.getTableItemsByRange(editor);
        },
        getUETableBySelected = function (editor) {
            return UT.getUETableBySelected(editor)
        },
        getDefaultValue = function (editor, table) {
            return UT.getDefaultValue(editor, table);
        },
        getUETable = function (tdOrTable) {
            return UT.getUETable(tdOrTable);
        };


    UE.commands['inserttable'] = {
        queryCommandState: function () {
            return getTableItemsByRange(this).table ? -1 : 0;
        },
        execCommand: function (cmd, opt) {
            function createTable(opt, tdWidth) {
                var html = [],
                    rowsNum = opt.numRows,
                    colsNum = opt.numCols;
                for (var r = 0; r < rowsNum; r++) {
                    html.push('<tr' + (r == 0 ? ' class="firstRow"':'') + '>');
                    for (var c = 0; c < colsNum; c++) {
                        html.push('<td width="' + tdWidth + '"  vAlign="' + opt.tdvalign + '" >' + (browser.ie && browser.version < 11 ? domUtils.fillChar : '<br/>') + '</td>')
                    }
                    html.push('</tr>')
                }
                //禁止指定table-width
                return '<table><tbody>' + html.join('') + '</tbody></table>'
            }

            if (!opt) {
                opt = utils.extend({}, {
                    numCols: this.options.defaultCols,
                    numRows: this.options.defaultRows,
                    tdvalign: this.options.tdvalign
                })
            }
            var me = this;
            var range = this.selection.getRange(),
                start = range.startContainer,
                firstParentBlock = domUtils.findParent(start, function (node) {
                    return domUtils.isBlockElm(node);
                }, true) || me.body;

            var defaultValue = getDefaultValue(me),
                tableWidth = firstParentBlock.offsetWidth,
                tdWidth = Math.floor(tableWidth / opt.numCols - defaultValue.tdPadding * 2 - defaultValue.tdBorder);

            //todo其他属性
            !opt.tdvalign && (opt.tdvalign = me.options.tdvalign);
            me.execCommand("inserthtml", createTable(opt, tdWidth));
        }
    };

    UE.commands['insertparagraphbeforetable'] = {
        queryCommandState: function () {
            return getTableItemsByRange(this).cell ? 0 : -1;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var p = this.document.createElement("p");
                p.innerHTML = browser.ie ? '&nbsp;' : '<br />';
                table.parentNode.insertBefore(p, table);
                this.selection.getRange().setStart(p, 0).setCursor();
            }
        }
    };

    UE.commands['deletetable'] = {
        queryCommandState: function () {
            var rng = this.selection.getRange();
            return domUtils.findParentByTagName(rng.startContainer, 'table', true) ? 0 : -1;
        },
        execCommand: function (cmd, table) {
            var rng = this.selection.getRange();
            table = table || domUtils.findParentByTagName(rng.startContainer, 'table', true);
            if (table) {
                var next = table.nextSibling;
                if (!next) {
                    next = domUtils.createElement(this.document, 'p', {
                        'innerHTML': browser.ie ? domUtils.fillChar : '<br/>'
                    });
                    table.parentNode.insertBefore(next, table);
                }
                domUtils.remove(table);
                rng = this.selection.getRange();
                if (next.nodeType == 3) {
                    rng.setStartBefore(next)
                } else {
                    rng.setStart(next, 0)
                }
                rng.setCursor(false, true)
                this.fireEvent("tablehasdeleted")

            }

        }
    };
    UE.commands['cellalign'] = {
        queryCommandState: function () {
            return getSelectedArr(this).length ? 0 : -1
        },
        execCommand: function (cmd, align) {
            var selectedTds = getSelectedArr(this);
            if (selectedTds.length) {
                for (var i = 0, ci; ci = selectedTds[i++];) {
                    ci.setAttribute('align', align);
                }
            }
        }
    };
    UE.commands['cellvalign'] = {
        queryCommandState: function () {
            return getSelectedArr(this).length ? 0 : -1;
        },
        execCommand: function (cmd, valign) {
            var selectedTds = getSelectedArr(this);
            if (selectedTds.length) {
                for (var i = 0, ci; ci = selectedTds[i++];) {
                    ci.setAttribute('vAlign', valign);
                }
            }
        }
    };
    UE.commands['insertcaption'] = {
        queryCommandState: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                return table.getElementsByTagName('caption').length == 0 ? 1 : -1;
            }
            return -1;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var caption = this.document.createElement('caption');
                caption.innerHTML = browser.ie ? domUtils.fillChar : '<br/>';
                table.insertBefore(caption, table.firstChild);
                var range = this.selection.getRange();
                range.setStart(caption, 0).setCursor();
            }

        }
    };
    UE.commands['deletecaption'] = {
        queryCommandState: function () {
            var rng = this.selection.getRange(),
                table = domUtils.findParentByTagName(rng.startContainer, 'table');
            if (table) {
                return table.getElementsByTagName('caption').length == 0 ? -1 : 1;
            }
            return -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                table = domUtils.findParentByTagName(rng.startContainer, 'table');
            if (table) {
                domUtils.remove(table.getElementsByTagName('caption')[0]);
                var range = this.selection.getRange();
                range.setStart(table.rows[0].cells[0], 0).setCursor();
            }

        }
    };
    UE.commands['inserttitle'] = {
        queryCommandState: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var firstRow = table.rows[0];
                return firstRow.cells[firstRow.cells.length-1].tagName.toLowerCase() != 'th' ? 0 : -1
            }
            return -1;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                getUETable(table).insertRow(0, 'th');
            }
            var th = table.getElementsByTagName('th')[0];
            this.selection.getRange().setStart(th, 0).setCursor(false, true);
        }
    };
    UE.commands['deletetitle'] = {
        queryCommandState: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var firstRow = table.rows[0];
                return firstRow.cells[firstRow.cells.length-1].tagName.toLowerCase() == 'th' ? 0 : -1
            }
            return -1;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                domUtils.remove(table.rows[0])
            }
            var td = table.getElementsByTagName('td')[0];
            this.selection.getRange().setStart(td, 0).setCursor(false, true);
        }
    };
    UE.commands['inserttitlecol'] = {
        queryCommandState: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var lastRow = table.rows[table.rows.length-1];
                return lastRow.getElementsByTagName('th').length ? -1 : 0;
            }
            return -1;
        },
        execCommand: function (cmd) {
            var table = getTableItemsByRange(this).table;
            if (table) {
                getUETable(table).insertCol(0, 'th');
            }
            resetTdWidth(table, this);
            var th = table.getElementsByTagName('th')[0];
            this.selection.getRange().setStart(th, 0).setCursor(false, true);
        }
    };
    UE.commands['deletetitlecol'] = {
        queryCommandState: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                var lastRow = table.rows[table.rows.length-1];
                return lastRow.getElementsByTagName('th').length ? 0 : -1;
            }
            return -1;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            if (table) {
                for(var i = 0; i< table.rows.length; i++ ){
                    domUtils.remove(table.rows[i].children[0])
                }
            }
            resetTdWidth(table, this);
            var td = table.getElementsByTagName('td')[0];
            this.selection.getRange().setStart(td, 0).setCursor(false, true);
        }
    };

    UE.commands["mergeright"] = {
        queryCommandState: function (cmd) {
            var tableItems = getTableItemsByRange(this),
                table = tableItems.table,
                cell = tableItems.cell;

            if (!table || !cell) return -1;
            var ut = getUETable(table);
            if (ut.selectedTds.length) return -1;

            var cellInfo = ut.getCellInfo(cell),
                rightColIndex = cellInfo.colIndex + cellInfo.colSpan;
            if (rightColIndex >= ut.colsNum) return -1; // 如果处于最右边则不能向右合并

            var rightCellInfo = ut.indexTable[cellInfo.rowIndex][rightColIndex],
                rightCell = table.rows[rightCellInfo.rowIndex].cells[rightCellInfo.cellIndex];
            if (!rightCell || cell.tagName != rightCell.tagName) return -1; // TH和TD不能相互合并

            // 当且仅当两个Cell的开始列号和结束列号一致时能进行合并
            return (rightCellInfo.rowIndex == cellInfo.rowIndex && rightCellInfo.rowSpan == cellInfo.rowSpan) ? 0 : -1;
        },
        execCommand: function (cmd) {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell);
            ut.mergeRight(cell);
            rng.moveToBookmark(bk).select();
        }
    };
    UE.commands["mergedown"] = {
        queryCommandState: function (cmd) {
            var tableItems = getTableItemsByRange(this),
                table = tableItems.table,
                cell = tableItems.cell;

            if (!table || !cell) return -1;
            var ut = getUETable(table);
            if (ut.selectedTds.length)return -1;

            var cellInfo = ut.getCellInfo(cell),
                downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan;
            if (downRowIndex >= ut.rowsNum) return -1; // 如果处于最下边则不能向下合并

            var downCellInfo = ut.indexTable[downRowIndex][cellInfo.colIndex],
                downCell = table.rows[downCellInfo.rowIndex].cells[downCellInfo.cellIndex];
            if (!downCell || cell.tagName != downCell.tagName) return -1; // TH和TD不能相互合并

            // 当且仅当两个Cell的开始列号和结束列号一致时能进行合并
            return (downCellInfo.colIndex == cellInfo.colIndex && downCellInfo.colSpan == cellInfo.colSpan) ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell);
            ut.mergeDown(cell);
            rng.moveToBookmark(bk).select();
        }
    };
    UE.commands["mergecells"] = {
        queryCommandState: function () {
            return getUETableBySelected(this) ? 0 : -1;
        },
        execCommand: function () {
            var ut = getUETableBySelected(this);
            if (ut && ut.selectedTds.length) {
                var cell = ut.selectedTds[0];
                ut.mergeRange();
                var rng = this.selection.getRange();
                if (domUtils.isEmptyBlock(cell)) {
                    rng.setStart(cell, 0).collapse(true)
                } else {
                    rng.selectNodeContents(cell)
                }
                rng.select();
            }


        }
    };
    UE.commands["insertrow"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            return cell && (cell.tagName == "TD" || (cell.tagName == 'TH' && tableItems.tr !== tableItems.table.rows[0])) &&
                getUETable(tableItems.table).rowsNum < this.options.maxRowNum ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell,
                table = tableItems.table,
                ut = getUETable(table),
                cellInfo = ut.getCellInfo(cell);
            //ut.insertRow(!ut.selectedTds.length ? cellInfo.rowIndex:ut.cellsRange.beginRowIndex,'');
            if (!ut.selectedTds.length) {
                ut.insertRow(cellInfo.rowIndex, cell);
            } else {
                var range = ut.cellsRange;
                for (var i = 0, len = range.endRowIndex - range.beginRowIndex + 1; i < len; i++) {
                    ut.insertRow(range.beginRowIndex, cell);
                }
            }
            rng.moveToBookmark(bk).select();
            if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
        }
    };
    //后插入行
    UE.commands["insertrownext"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            return cell && (cell.tagName == "TD") && getUETable(tableItems.table).rowsNum < this.options.maxRowNum ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell,
                table = tableItems.table,
                ut = getUETable(table),
                cellInfo = ut.getCellInfo(cell);
            //ut.insertRow(!ut.selectedTds.length? cellInfo.rowIndex + cellInfo.rowSpan : ut.cellsRange.endRowIndex + 1,'');
            if (!ut.selectedTds.length) {
                ut.insertRow(cellInfo.rowIndex + cellInfo.rowSpan, cell);
            } else {
                var range = ut.cellsRange;
                for (var i = 0, len = range.endRowIndex - range.beginRowIndex + 1; i < len; i++) {
                    ut.insertRow(range.endRowIndex + 1, cell);
                }
            }
            rng.moveToBookmark(bk).select();
            if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
        }
    };
    UE.commands["deleterow"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this);
            return tableItems.cell ? 0 : -1;
        },
        execCommand: function () {
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell),
                cellsRange = ut.cellsRange,
                cellInfo = ut.getCellInfo(cell),
                preCell = ut.getVSideCell(cell),
                nextCell = ut.getVSideCell(cell, true),
                rng = this.selection.getRange();
            if (utils.isEmptyObject(cellsRange)) {
                ut.deleteRow(cellInfo.rowIndex);
            } else {
                for (var i = cellsRange.beginRowIndex; i < cellsRange.endRowIndex + 1; i++) {
                    ut.deleteRow(cellsRange.beginRowIndex);
                }
            }
            var table = ut.table;
            if (!table.getElementsByTagName('td').length) {
                var nextSibling = table.nextSibling;
                domUtils.remove(table);
                if (nextSibling) {
                    rng.setStart(nextSibling, 0).setCursor(false, true);
                }
            } else {
                if (cellInfo.rowSpan == 1 || cellInfo.rowSpan == cellsRange.endRowIndex - cellsRange.beginRowIndex + 1) {
                    if (nextCell || preCell) rng.selectNodeContents(nextCell || preCell).setCursor(false, true);
                } else {
                    var newCell = ut.getCell(cellInfo.rowIndex, ut.indexTable[cellInfo.rowIndex][cellInfo.colIndex].cellIndex);
                    if (newCell) rng.selectNodeContents(newCell).setCursor(false, true);
                }
            }
            if (table.getAttribute("interlaced") === "enabled")this.fireEvent("interlacetable", table);
        }
    };
    UE.commands["insertcol"] = {
        queryCommandState: function (cmd) {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            return cell && (cell.tagName == "TD" || (cell.tagName == 'TH' && cell !== tableItems.tr.cells[0])) &&
                getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1;
        },
        execCommand: function (cmd) {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            if (this.queryCommandState(cmd) == -1)return;
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);

            //ut.insertCol(!ut.selectedTds.length ? cellInfo.colIndex:ut.cellsRange.beginColIndex);
            if (!ut.selectedTds.length) {
                ut.insertCol(cellInfo.colIndex, cell);
            } else {
                var range = ut.cellsRange;
                for (var i = 0, len = range.endColIndex - range.beginColIndex + 1; i < len; i++) {
                    ut.insertCol(range.beginColIndex, cell);
                }
            }
            rng.moveToBookmark(bk).select(true);
        }
    };
    UE.commands["insertcolnext"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            return cell && getUETable(tableItems.table).colsNum < this.options.maxColNum ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);
            //ut.insertCol(!ut.selectedTds.length ? cellInfo.colIndex + cellInfo.colSpan:ut.cellsRange.endColIndex +1);
            if (!ut.selectedTds.length) {
                ut.insertCol(cellInfo.colIndex + cellInfo.colSpan, cell);
            } else {
                var range = ut.cellsRange;
                for (var i = 0, len = range.endColIndex - range.beginColIndex + 1; i < len; i++) {
                    ut.insertCol(range.endColIndex + 1, cell);
                }
            }
            rng.moveToBookmark(bk).select();
        }
    };

    UE.commands["deletecol"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this);
            return tableItems.cell ? 0 : -1;
        },
        execCommand: function () {
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell),
                range = ut.cellsRange,
                cellInfo = ut.getCellInfo(cell),
                preCell = ut.getHSideCell(cell),
                nextCell = ut.getHSideCell(cell, true);
            if (utils.isEmptyObject(range)) {
                ut.deleteCol(cellInfo.colIndex);
            } else {
                for (var i = range.beginColIndex; i < range.endColIndex + 1; i++) {
                    ut.deleteCol(range.beginColIndex);
                }
            }
            var table = ut.table,
                rng = this.selection.getRange();

            if (!table.getElementsByTagName('td').length) {
                var nextSibling = table.nextSibling;
                domUtils.remove(table);
                if (nextSibling) {
                    rng.setStart(nextSibling, 0).setCursor(false, true);
                }
            } else {
                if (domUtils.inDoc(cell, this.document)) {
                    rng.setStart(cell, 0).setCursor(false, true);
                } else {
                    if (nextCell && domUtils.inDoc(nextCell, this.document)) {
                        rng.selectNodeContents(nextCell).setCursor(false, true);
                    } else {
                        if (preCell && domUtils.inDoc(preCell, this.document)) {
                            rng.selectNodeContents(preCell).setCursor(true, true);
                        }
                    }
                }
            }
        }
    };
    UE.commands["splittocells"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if (ut.selectedTds.length > 0) return -1;
            return cell && (cell.colSpan > 1 || cell.rowSpan > 1) ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell);
            ut.splitToCells(cell);
            rng.moveToBookmark(bk).select();
        }
    };
    UE.commands["splittorows"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if (ut.selectedTds.length > 0) return -1;
            return cell && cell.rowSpan > 1 ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell);
            ut.splitToRows(cell);
            rng.moveToBookmark(bk).select();
        }
    };
    UE.commands["splittocols"] = {
        queryCommandState: function () {
            var tableItems = getTableItemsByRange(this),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if (ut.selectedTds.length > 0) return -1;
            return cell && cell.colSpan > 1 ? 0 : -1;
        },
        execCommand: function () {
            var rng = this.selection.getRange(),
                bk = rng.createBookmark(true);
            var cell = getTableItemsByRange(this).cell,
                ut = getUETable(cell);
            ut.splitToCols(cell);
            rng.moveToBookmark(bk).select();

        }
    };

    UE.commands["adaptbytext"] =
        UE.commands["adaptbywindow"] = {
            queryCommandState: function () {
                return getTableItemsByRange(this).table ? 0 : -1
            },
            execCommand: function (cmd) {
                var tableItems = getTableItemsByRange(this),
                    table = tableItems.table;
                if (table) {
                    if (cmd == 'adaptbywindow') {
                        resetTdWidth(table, this);
                    } else {
                        var cells = domUtils.getElementsByTagName(table, "td th");
                        utils.each(cells, function (cell) {
                            cell.removeAttribute("width");
                        });
                        table.removeAttribute("width");
                    }
                }
            }
        };

    //平均分配各列
    UE.commands['averagedistributecol'] = {
        queryCommandState: function () {
            var ut = getUETableBySelected(this);
            if (!ut) return -1;
            return ut.isFullRow() || ut.isFullCol() ? 0 : -1;
        },
        execCommand: function (cmd) {
            var me = this,
                ut = getUETableBySelected(me);

            function getAverageWidth() {
                var tb = ut.table,
                    averageWidth, sumWidth = 0, colsNum = 0,
                    tbAttr = getDefaultValue(me, tb);

                if (ut.isFullRow()) {
                    sumWidth = tb.offsetWidth;
                    colsNum = ut.colsNum;
                } else {
                    var begin = ut.cellsRange.beginColIndex,
                        end = ut.cellsRange.endColIndex,
                        node;
                    for (var i = begin; i <= end;) {
                        node = ut.selectedTds[i];
                        sumWidth += node.offsetWidth;
                        i += node.colSpan;
                        colsNum += 1;
                    }
                }
                averageWidth = Math.ceil(sumWidth / colsNum) - tbAttr.tdBorder * 2 - tbAttr.tdPadding * 2;
                return averageWidth;
            }

            function setAverageWidth(averageWidth) {
                utils.each(domUtils.getElementsByTagName(ut.table, "th"), function (node) {
                    node.setAttribute("width", "");
                });
                var cells = ut.isFullRow() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;

                utils.each(cells, function (node) {
                    if (node.colSpan == 1) {
                        node.setAttribute("width", averageWidth);
                    }
                });
            }

            if (ut && ut.selectedTds.length) {
                setAverageWidth(getAverageWidth());
            }
        }
    };
    //平均分配各行
    UE.commands['averagedistributerow'] = {
        queryCommandState: function () {
            var ut = getUETableBySelected(this);
            if (!ut) return -1;
            if (ut.selectedTds && /th/ig.test(ut.selectedTds[0].tagName)) return -1;
            return ut.isFullRow() || ut.isFullCol() ? 0 : -1;
        },
        execCommand: function (cmd) {
            var me = this,
                ut = getUETableBySelected(me);

            function getAverageHeight() {
                var averageHeight, rowNum, sumHeight = 0,
                    tb = ut.table,
                    tbAttr = getDefaultValue(me, tb),
                    tdpadding = parseInt(domUtils.getComputedStyle(tb.getElementsByTagName('td')[0], "padding-top"));

                if (ut.isFullCol()) {
                    var captionArr = domUtils.getElementsByTagName(tb, "caption"),
                        thArr = domUtils.getElementsByTagName(tb, "th"),
                        captionHeight, thHeight;

                    if (captionArr.length > 0) {
                        captionHeight = captionArr[0].offsetHeight;
                    }
                    if (thArr.length > 0) {
                        thHeight = thArr[0].offsetHeight;
                    }

                    sumHeight = tb.offsetHeight - (captionHeight || 0) - (thHeight || 0);
                    rowNum = thArr.length == 0 ? ut.rowsNum : (ut.rowsNum - 1);
                } else {
                    var begin = ut.cellsRange.beginRowIndex,
                        end = ut.cellsRange.endRowIndex,
                        count = 0,
                        trs = domUtils.getElementsByTagName(tb, "tr");
                    for (var i = begin; i <= end; i++) {
                        sumHeight += trs[i].offsetHeight;
                        count += 1;
                    }
                    rowNum = count;
                }
                //ie8下是混杂模式
                if (browser.ie && browser.version < 9) {
                    averageHeight = Math.ceil(sumHeight / rowNum);
                } else {
                    averageHeight = Math.ceil(sumHeight / rowNum) - tbAttr.tdBorder * 2 - tdpadding * 2;
                }
                return averageHeight;
            }

            function setAverageHeight(averageHeight) {
                var cells = ut.isFullCol() ? domUtils.getElementsByTagName(ut.table, "td") : ut.selectedTds;
                utils.each(cells, function (node) {
                    if (node.rowSpan == 1) {
                        node.setAttribute("height", averageHeight);
                    }
                });
            }

            if (ut && ut.selectedTds.length) {
                setAverageHeight(getAverageHeight());
            }
        }
    };

    //单元格对齐方式
    UE.commands['cellalignment'] = {
        queryCommandState: function () {
            return getTableItemsByRange(this).table ? 0 : -1
        },
        execCommand: function (cmd, data) {
            var me = this,
                ut = getUETableBySelected(me);

            if (!ut) {
                var start = me.selection.getStart(),
                    cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], true);
                if (!/caption/ig.test(cell.tagName)) {
                    domUtils.setAttributes(cell, data);
                } else {
                    cell.style.textAlign = data.align;
                    cell.style.verticalAlign = data.vAlign;
                }
                me.selection.getRange().setCursor(true);
            } else {
                utils.each(ut.selectedTds, function (cell) {
                    domUtils.setAttributes(cell, data);
                });
            }
        },
        /**
         * 查询当前点击的单元格的对齐状态， 如果当前已经选择了多个单元格， 则会返回所有单元格经过统一协调过后的状态
         * @see UE.UETable.getTableCellAlignState
         */
        queryCommandValue: function (cmd) {

            var activeMenuCell = getTableItemsByRange( this).cell;

            if( !activeMenuCell ) {
                activeMenuCell = getSelectedArr(this)[0];
            }

            if (!activeMenuCell) {

                return null;

            } else {

                //获取同时选中的其他单元格
                var cells = UE.UETable.getUETable(activeMenuCell).selectedTds;

                !cells.length && ( cells = activeMenuCell );

                return UE.UETable.getTableCellAlignState(cells);

            }

        }
    };
    //表格对齐方式
    UE.commands['tablealignment'] = {
        queryCommandState: function () {
            if (browser.ie && browser.version < 8) {
                return -1;
            }
            return getTableItemsByRange(this).table ? 0 : -1
        },
        execCommand: function (cmd, value) {
            var me = this,
                start = me.selection.getStart(),
                table = start && domUtils.findParentByTagName(start, ["table"], true);

            if (table) {
                table.setAttribute("align",value);
            }
        }
    };

    //表格属性
    UE.commands['edittable'] = {
        queryCommandState: function () {
            return getTableItemsByRange(this).table ? 0 : -1
        },
        execCommand: function (cmd, color) {
            var rng = this.selection.getRange(),
                table = domUtils.findParentByTagName(rng.startContainer, 'table');
            if (table) {
                var arr = domUtils.getElementsByTagName(table, "td").concat(
                    domUtils.getElementsByTagName(table, "th"),
                    domUtils.getElementsByTagName(table, "caption")
                );
                utils.each(arr, function (node) {
                    node.style.borderColor = color;
                });
            }
        }
    };
    //单元格属性
    UE.commands['edittd'] = {
        queryCommandState: function () {
            return getTableItemsByRange(this).table ? 0 : -1
        },
        execCommand: function (cmd, bkColor) {
            var me = this,
                ut = getUETableBySelected(me);

            if (!ut) {
                var start = me.selection.getStart(),
                    cell = start && domUtils.findParentByTagName(start, ["td", "th", "caption"], true);
                if (cell) {
                    cell.style.backgroundColor = bkColor;
                }
            } else {
                utils.each(ut.selectedTds, function (cell) {
                    cell.style.backgroundColor = bkColor;
                });
            }
        }
    };

    UE.commands["settablebackground"] = {
        queryCommandState: function () {
            return getSelectedArr(this).length > 1 ? 0 : -1;
        },
        execCommand: function (cmd, value) {
            var cells, ut;
            cells = getSelectedArr(this);
            ut = getUETable(cells[0]);
            ut.setBackground(cells, value);
        }
    };

    UE.commands["cleartablebackground"] = {
        queryCommandState: function () {
            var cells = getSelectedArr(this);
            if (!cells.length)return -1;
            for (var i = 0, cell; cell = cells[i++];) {
                if (cell.style.backgroundColor !== "") return 0;
            }
            return -1;
        },
        execCommand: function () {
            var cells = getSelectedArr(this),
                ut = getUETable(cells[0]);
            ut.removeBackground(cells);
        }
    };

    UE.commands["interlacetable"] = UE.commands["uninterlacetable"] = {
        queryCommandState: function (cmd) {
            var table = getTableItemsByRange(this).table;
            if (!table) return -1;
            var interlaced = table.getAttribute("interlaced");
            if (cmd == "interlacetable") {
                //TODO 待定
                //是否需要待定，如果设置，则命令只能单次执行成功，但反射具备toggle效果；否则可以覆盖前次命令，但反射将不存在toggle效果
                return (interlaced === "enabled") ? -1 : 0;
            } else {
                return (!interlaced || interlaced === "disabled") ? -1 : 0;
            }
        },
        execCommand: function (cmd, classList) {
            var table = getTableItemsByRange(this).table;
            if (cmd == "interlacetable") {
                table.setAttribute("interlaced", "enabled");
                this.fireEvent("interlacetable", table, classList);
            } else {
                table.setAttribute("interlaced", "disabled");
                this.fireEvent("uninterlacetable", table);
            }
        }
    };
    UE.commands["setbordervisible"] = {
        queryCommandState: function (cmd) {
            var table = getTableItemsByRange(this).table;
            if (!table) return -1;
            return 0;
        },
        execCommand: function () {
            var table = getTableItemsByRange(this).table;
            utils.each(domUtils.getElementsByTagName(table,'td'),function(td){
                td.style.borderWidth = '1px';
                td.style.borderStyle = 'solid';
            })
        }
    };
    function resetTdWidth(table, editor) {
        var tds = domUtils.getElementsByTagName(table,'td th');
        utils.each(tds, function (td) {
            td.removeAttribute("width");
        });
        table.setAttribute('width', getTableWidth(editor, true, getDefaultValue(editor, table)));
        var tdsWidths = [];
        setTimeout(function () {
            utils.each(tds, function (td) {
                (td.colSpan == 1) && tdsWidths.push(td.offsetWidth)
            })
            utils.each(tds, function (td,i) {
                (td.colSpan == 1) && td.setAttribute("width", tdsWidths[i] + "");
            })
        }, 0);
    }

    function getTableWidth(editor, needIEHack, defaultValue) {
        var body = editor.body;
        return body.offsetWidth - (needIEHack ? parseInt(domUtils.getComputedStyle(body, 'margin-left'), 10) * 2 : 0) - defaultValue.tableBorder * 2 - (editor.options.offsetWidth || 0);
    }

    function getSelectedArr(editor) {
        var cell = getTableItemsByRange(editor).cell;
        if (cell) {
            var ut = getUETable(cell);
            return ut.selectedTds.length ? ut.selectedTds : [cell];
        } else {
            return [];
        }
    }
})();
