/**
 * Created with JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-10-12
 * Time: 上午10:05
 * To change this template use File | Settings | File Templates.

 */
UE.plugins['table'] = function () {
    var me = this,
        findParent = domUtils.findParentByTagName,
        getStyle = domUtils.getComputedStyle,
        getXY = domUtils.getXY,
        ueTables ={};
    //处理拖动及框选相关方法
    var startTd = null,   //鼠标按下时的锚点td
        currentTd = null, //当前鼠标经过时的td
        onDrag = "",      //指示当前拖动状态，其值可为"","h","v" ,分别表示未拖动状态，横向拖动状态，纵向拖动状态，用于鼠标移动过程中的判断
        onBorder = false, //检测鼠标按下时是否处在单元格边缘位置
        dragLine = null,  //模拟的拖动线
        UE_cursor = null, //IE下模拟鼠标光标的箭头
        bodyMargin = {},  //编辑框body的边距，用于修正拖动过程中的一些计算误差
        dragTd = null;    //发生拖动的目标td

    me.ready(function () {
        utils.cssRule('table',
            //选中的td上的样式
            '.selectTdClass{background-color:#3399FF !important;}' +
                'table.noBorderTable td{border:1px dashed #ddd !important}' +
                //插入的表格的默认样式
                'table{line-height:22px; margin-bottom:10px;border-collapse:collapse;word-break:break-all;border:1px solid #000;}' +
                'td{ border:1px solid #000;}', me.document);

        bodyMargin = {
            x:parseInt(getStyle(me.body,"margin-left"),10),
            y:parseInt(getStyle(me.body,"margin-top"),10)
        };
        //内容变化时触发索引更新
        //todo 可否考虑标记检测，如果不涉及表格的变化就不进行索引重建和更新
        me.addListener("contentchange",function(){
            //尽可能排除一些不需要更新的状况
            if(getUETableBySelected())return;
            var tables = domUtils.getElementsByTagName(me.document,"table");
            ueTables ={};
            for(var i = 0,table;table = tables[i++];){
                var key = table.id;
                table.setAttribute("width",table.offsetWidth);
                if(!key){
                    key = "ut_" + +new Date();
                    table.id = key;
                }
                ueTables[key] = new UETable(table);
            }
            //初始化拖动条
            dragLine = me.document.getElementById("ue_tableDragLine");
            if(!dragLine || !dragLine.parentNode){
                dragLine = me.document.createElement("hr");
                domUtils.setAttributes(dragLine,{
                    id:"ue_tableDragLine",
                    style:"left:-10000px;background-color: blue;position: absolute;"
                });
                me.body.appendChild(dragLine);
            }

            //初始化箭头
            UE_cursor = me.document.getElementById("ue_cursor");
            if(!UE_cursor || !UE_cursor.parentNode){
                UE_cursor = me.document.createElement("img");
                domUtils.setAttributes(UE_cursor,{
                    id:"ue_cursor",
                    style:"position: absolute;left:-10000px;"
                });
                me.body.appendChild(UE_cursor);
            }
        });
        me.addListener("beforepaste",function(type,data){
            var div = document.createElement("div"),tables;
            div.innerHTML = data.html;
            tables = div.getElementsByTagName("table");
            utils.each(tables,function(table){
                removeStyleSize(table,false);
                var tds = domUtils.getElementsByTagName("td");
                utils.each(tds,function(td){
                    removeStyleSize(td,true);
                });
            });
            data.html = div.innerHTML;
        });
        /**
         * 删除obj的宽高style，改成属性宽高
         * @param obj
         * @param remainPro
         */
        function removeStyleSize(obj,replaceToProperty){
            removeStyle(obj,"width",true);
            removeStyle(obj,"height",true);
        }
        function removeStyle(obj,styleName,replaceToProperty){
            if(obj.style[styleName]){
                replaceToProperty && obj.setAttribute(styleName,parseInt(obj.style[styleName],10));
                obj.style[styleName] = "";
            }
        }
        domUtils.on(me.document,"mousemove",mouseMoveEvent);
        domUtils.on(me.document,"mouseout",function(evt){
            var target = evt.target||evt.srcElement;
            if(target.tagName == "TABLE"){
                toggleDragableState(false,"",null);
            }
        });
        me.addListener("mousedown", mouseDownEvent);
        me.addListener("mouseup", mouseUpEvent);
        me.addListener("keydown", function (type, evt) {
            var notCtrlKey = !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey;
            notCtrlKey && removeSelectedClass(domUtils.getElementsByTagName(me.body,"td"));
            var ut = getUETableBySelected();
            if(!ut) return;
            notCtrlKey && ut.clearSelected();
        });

        //重写execCommand命令，用于处理框选时的处理
        var oldExecCommand = me.execCommand;
        me.execCommand = function (cmd) {
            cmd = cmd.toLowerCase();
            var ut = getUETableBySelected(),tds,
                range = new dom.Range(me.document),
                cmdFun = me.commands[cmd]||UE.commands[cmd];
            if(!cmdFun) return;
            if(ut && !cmdFun.notNeedUndo ){
                me.fireEvent("beforeexeccommand");
                me.__hasEnterExecCommand = true;
                tds = ut.selectedTds;
                for(var i = 0,td;td=tds[i++];){
                    range.selectNodeContents(td).select();
                    oldExecCommand.apply( me, arguments );
                }
                me.fireEvent("afterexeccommand");
                me.__hasEnterExecCommand = false;
                tds[0] && range.selectNodeContents(tds[0]).select();
                me._selectionChange();
            }else{
                oldExecCommand.apply( me, arguments );
            }
        };
    });

    function mouseCoords( evt ) {
        if ( evt.pageX || evt.pageY ) { return { x:evt.pageX, y:evt.pageY }; }
        return {
            x:evt.clientX + document.body.scrollLeft - document.body.clientLeft,
            y:evt.clientY + document.body.scrollTop - document.body.clientTop
        };
    };
    function mouseMoveEvent(evt){
        //普通状态下鼠标移动
        var target = evt.target||evt.srcElement,
            tagName = target.tagName.toLowerCase(),
            pos;
        //修改单元格大小时的鼠标移动
        if(onDrag && dragTd){
            me.document.body.style.webkitUserSelect = 'none';
            me.selection.getNative()[browser.ie ? 'empty' : 'removeAllRanges']();
            pos = mouseCoords(evt);
            toggleDragableState(true,"",pos);
            if(onDrag == "h" ){
                dragLine.style.left = getPermissionX(dragTd,evt)  +"px";
            }else if(onDrag=="v"){
                dragLine.style.top = getPermissionY(dragTd,evt) - (browser.ie && browser.version < 9 ? 0:bodyMargin.y)  +"px";
            }
            UE_cursor.style.cssText = "position: absolute;left:-10000px;";
            return;
        }
        //当鼠标处于table上时，修改移动过程中的光标状态
        if(tagName=="td"||tagName=="th"){
            pos = mouseCoords(evt);
            var state = getRelation(target,pos);
            toggleDragableState(!!state,state,pos);
        }
        //事件稀释
        domUtils.un(me.document,"mousemove",mouseMoveEvent);
        setTimeout(function(){
            domUtils.on(me.document,"mousemove",mouseMoveEvent);
        },30);
    }

    /**
     * 获取拖动时允许的X轴坐标
     * @param dragTd
     * @param evt
     */
    function getPermissionX(dragTd,evt){
        var ut = getUETable(dragTd),
            preTd = ut.getSameEndPosCells(dragTd,"x")[0],
            nextTd = ut.getSameStartPosXCells(dragTd)[0],
            mouseX = mouseCoords(evt).x,
            left = (preTd ? getXY(preTd).x : getXY(ut.table).x)  + 20 ,
            right = nextTd? getXY(nextTd).x + nextTd.offsetWidth - 20 : mouseX;
        return mouseX < left ? left : mouseX > right? right:mouseX;
    }
    /**
     * 获取拖动时允许的Y轴坐标
     * @param dragTd
     * @param evt
     */
    function getPermissionY(dragTd,evt){
        var top = getXY(dragTd).y,
            mousePosY = mouseCoords(evt).y;
        return mousePosY < top? top :mousePosY;
    }
    var flag = false;
    /**
     * 移动状态切换
     * @param dragable
     * @param dir
     */
    function toggleDragableState(dragable,dir,mousePos){
        //IE在contentEditable为true时光标无法显示成箭头
        if(!browser.ie){
            me.body.style.cursor = dir=="h" ? "e-resize":dir=="v"? "n-resize":"text";
        }else{
            if(dragable){
                dir && !onDrag && showCursor(dir,mousePos);
            }else{
                if(!onDrag) dragLine.style.cssText = "position: absolute;left:-10000px;";
                UE_cursor.style.cssText = "position: absolute;left:-10000px;";
            }
        }
        onBorder = dragable;
    }
    function showCursor(dir,mousePos){
        var pos = dir == "v" ? {x:mousePos.x - 25,y:mousePos.y - 8 }:dir=="h"?{x:mousePos.x-6 ,y:mousePos.y -25}:{x:0,y:0};
        if(dir) UE_cursor.src = me.options.UEDITOR_HOME_URL + "_examples/cursor_"+ dir +".gif";
        UE_cursor.style.cssText = "position: absolute;display:'block';top:" + pos.y + "px;left:" + pos.x + "px;"
    }

    /**
     * 获取鼠标与当前单元格的相对位置
     * @param ele
     * @param mousePos
     */
    function getRelation(ele,mousePos){
        var elePos = getXY(ele);
        if(elePos.x + ele.offsetWidth - mousePos.x  < 5){
            return "h";
        }
        if(elePos.y + ele.offsetHeight - mousePos.y  < 5){
            return "v";
        }
        return '';
    }

    function mouseDownEvent(type, evt) {
        if (evt.button == 2) return;
        if( UE_cursor ) UE_cursor.style.cssText = "position: absolute;left:-10000px;";
        removeSelectedClass(domUtils.getElementsByTagName(me.body,"td"));
        for(var i in ueTables){
            if(ueTables.hasOwnProperty(i)){
                ueTables[i].clearSelected();
            }
        }
        startTd = getTargetTd(evt);
        if (!startTd ) return;
        //判断当前鼠标状态
        if(!onBorder){
            me.document.body.style.webkitUserSelect = '';
            me.addListener('mouseover', mouseOverEvent);
        }else{
            var state = getRelation(startTd,mouseCoords(evt));
            showDragLineAt(state,startTd);
            //拖动开始
            onDrag = state;
            dragTd = startTd;
        }
    }

    function removeSelectedClass(cells){
        utils.each(cells,function(cell){
            domUtils.removeClasses(cell,"selectTdClass");
        })
    }

    function addSelectedClass(cells){
        utils.each(cells,function(cell){
            domUtils.addClass(cell,"selectTdClass");
        })
    }

    /**
     * 依据state（v|h）在cell位置显示横线
     * @param state
     * @param cell
     */
    function showDragLineAt(state,cell){
        var table = findParent(cell,"table"),
            width = table.offsetWidth,
            height = table.offsetHeight,
            tablePos = getXY(table),
            cellPos = getXY(cell),css;
        switch(state){
            case "h":
                css = 'height:' + height + 'px;top:' +(tablePos.y -(browser.ie && browser.version < 9 ? 0: bodyMargin.y) ) + 'px;left:' + (cellPos.x + cell.offsetWidth - 2);
                dragLine.style.cssText = css +'px;position: absolute;display:block;background-color:blue;width:1px;border:0; color:blue;';
                break;
            case "v":
                css = 'width:' + width + 'px;left:' + tablePos.x + 'px;top:' +
                    (cellPos.y + cell.offsetHeight- (browser.ie && browser.version < 9 ? 0: bodyMargin.y) - 2);
                //必须加上border:0和color:blue，否则低版ie不支持背景色显示
                dragLine.style.cssText =  css + 'px;position: absolute;display:block;background-color:blue;height:1px;border:0;color:blue;';
                break;
            default:
        }
    }

    function getWidth(cell){
        if(!cell)return 0;
        return parseInt(getStyle(cell,"width"),10);
    }
    function getHeight(cell){
        if(!cell)return 0;
        return parseInt(getStyle(cell,"height"),10);
    }

    function changeColWidth(cell,changeValue){
        var ut = getUETable(cell),
            table = ut.table,
            backTableWidth = getWidth(table),
        //这里不考虑一个都没有情况，如果一个都没有，可以认为该表格的结构可以精简
            leftCells = ut.getSameEndPosCells(cell,"x"),
            backLeftWidth = getWidth(leftCells[0]),
            rightCells = ut.getSameStartPosXCells(cell),
            backRightWidth = getWidth(rightCells[0]);

        utils.each(leftCells,function(cell){
            if(cell.style.width) cell.style.width = "";
            cell.setAttribute("width",backLeftWidth + changeValue);
        });
        utils.each(rightCells,function(cell){
            if(cell.style.width) cell.style.width = "";
            cell.setAttribute("width",backRightWidth - changeValue);
        })
        //如果是在表格最右边拖动，则还需要调整表格宽度，否则在合并过的单元格中输入文字，表格会被撑开
        if(!cell.nextSibling){
            if(table.style.width) table.style.width = "";
            table.setAttribute("width",backTableWidth + changeValue);
        }
    }

    function changeRowHeight(td,changeValue){
        var ut = getUETable(td),
            cells = ut.getSameEndPosCells(td,"y"),
        //备份需要连带变化的td的原始高度，否则后期无法获取正确的值
            backHeight = cells[0] ? cells[0].offsetHeight: 0;
        for(var i= 0,cell;cell = cells[i++];){
            setCellHeight(cell,changeValue,backHeight);
        }
    }

    function setCellHeight(cell,height,backHeight){
        var lineHight = parseInt(getStyle(cell,"line-height"),10),
            tmpHeight = backHeight + height ;
        height = tmpHeight < lineHight ? lineHight:tmpHeight;
        if(cell.style.height) cell.style.height = "";
        cell.rowSpan == 1 ? cell.setAttribute("height", height): (cell.removeAttribute && cell.removeAttribute("height"));
    }

    function mouseUpEvent(type, evt) {
        me.document.body.style.webkitUserSelect = '';
        //拖拽状态下的mouseUP
        if(onDrag && dragTd){
            var dragTdPos = getXY(dragTd),
                dragLinePos = getXY(dragLine);
            switch(onDrag){
                case "h":
                    changeColWidth(dragTd,dragLinePos.x - dragTdPos.x - dragTd.offsetWidth);
                    break;
                case "v":
                    changeRowHeight(dragTd,dragLinePos.y - dragTdPos.y - dragTd.offsetHeight);
                    break;
                default:
            }
            onDrag = "";
            dragTd = null;
            dragLine.style.cssText = "position: absolute;left:-10000px;";
            UE_cursor.style.cssText = "position: absolute;left:-10000px;";
            return;
        }
        //正常状态下的mouseup
        var range = null;
        if(!startTd){
            var target = evt.target||evt.srcElement;
            if(target.tagName == "TD" ||target.tagName == "TH"){
                range = new dom.Range(me.document);
                range.setStart(target,0).setCursor(false,true);
            }
        }else{
            var ut = getUETable(startTd),
                cell = ut? ut.selectedTds[0] : null;
            if (cell) {
                range = new dom.Range(me.document);
                if ( domUtils.isEmptyNode( cell ) ) {
                    range.setStart(cell, 0).setCursor(false,true);
                } else {
                    range.selectNodeContents(cell).select();
                }
            } else {
                range = me.selection.getRange().shrinkBoundary();
                if (!range.collapsed) {
                    var start = findParent(range.startContainer, ['td', 'th'], true),
                        end = findParent(range.endContainer, ['td', 'th'], true);
                    //在table里边的不能清除
                    if (start && !end || !start && end || start && end && start !== end) {
                        range.setCursor(false,true);
                    }
                }
            }
            startTd = null;
            me.removeListener('mouseover', mouseOverEvent);
        }
    }

    function mouseOverEvent(type, evt) {
        currentTd = evt.target || evt.srcElement;
        //需要判断两个TD是否位于同一个表格内
        if (startTd && currentTd.tagName == "TD" && startTd!=currentTd && findParent(startTd, 'table') == findParent(currentTd, 'table')) {
            me.document.body.style.webkitUserSelect = 'none';
            me.selection.getNative()[browser.ie ? 'empty' : 'removeAllRanges']();
            var ut = getUETable(currentTd),
                range = ut.getCellsRange(startTd, currentTd);
            ut.setSelected(range);
        }
        evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    }
    /**
     * 根据当前点击的td或者table获取索引对象
     * @param tdOrTable
     */
    function getUETable(tdOrTable){
        var tag = tdOrTable.tagName.toLowerCase(),key;
        tdOrTable = (tag=="td"||tag=="th")?findParent(tdOrTable,"table",true):tdOrTable;
        key = tdOrTable.id;
        for(var i in ueTables){
            if( ueTables.hasOwnProperty(i) && key == i){
                ueTables[i].table = tdOrTable;
                return ueTables[i];
            }
        }
    }
    /**
     * 根据当前框选的td来获取ueTable对象
     */
    function getUETableBySelected(){
        for(var i in ueTables){
            if(ueTables.hasOwnProperty(i)){
                var ut = ueTables[i];
                return ut.selectedTds.length ? ut:null;
            }
        }
    }

    UE.commands['inserttable'] = {
        queryCommandState:function () {
            return getTableItemsByRange().cell?-1:0;
        },
        execCommand:function (cmd, opt) {
            var me = this;
            var div = document.createElement("div");
            div.innerHTML = createTable(opt.numRows,opt.numCols);
            var table = div.firstChild,
                tds = table.getElementsByTagName("td"),
                width = me.body.offsetWidth - 12,
                tdWidth = Math.floor(parseInt((width-(opt.numCols +1))/opt.numCols,10));
            for(var i = 0,td;td=tds[i++];){
                td.setAttribute("width",tdWidth);
            }
            table.id = "ut_"+ +new Date();
            me.execCommand("inserthtml", div.innerHTML);
            function createTable(rowsNum,colsNum) {
                var rows = [];
                while (rowsNum--) {
                    var row = [],i = colsNum;
                    while (i--) {
                        row[i] = browser.ie ?" ": "<br />";
                    }
                    rows[rowsNum] = '<td>' + row.join('</td><td>') + '</td>';
                }
                return '<table><tr>' + rows.join('</tr><tr>') + '</tr></table>';
            }
        }
    };
    UE.commands["mergeright"] = {
        queryCommandState:function (cmd) {
            var tableItems = getTableItemsByRange();
            if (!tableItems.cell) return -1;
            var ut = getUETable(tableItems.table);
            if(ut.selectedTds.length)return -1;
            var cellInfo = ut.getCellInfo(tableItems.cell),
                rightColIndex = cellInfo.colIndex + cellInfo.colSpan;
            if (rightColIndex >= ut.colsNum) return -1;
            var rightCellInfo = ut.indexTable[cellInfo.rowIndex][rightColIndex];
            return (rightCellInfo.rowIndex == cellInfo.rowIndex
                && rightCellInfo.rowSpan == cellInfo.rowSpan) ? 0 : -1;
        },
        execCommand:function (cmd) {
            if (this.queryCommandState("mergeright") == -1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell);
            ut.mergeRight(cell);
        }
    };
    UE.commands["mergedown"] = {
        queryCommandState:function (cmd) {
            var tableItems = getTableItemsByRange();
            if (!tableItems.cell) return -1;
            var ut = getUETable(tableItems.table);
            if(ut.selectedTds.length)return -1;
            var cellInfo = ut.getCellInfo(tableItems.cell),
                downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan;
            // 如果处于最下边则不能向右合并
            if (downRowIndex >= ut.rowsNum) return -1;
            var downCellInfo = ut.indexTable[downRowIndex][cellInfo.colIndex];
            // 当且仅当两个Cell的开始列号和结束列号一致时能进行合并
            return (downCellInfo.colIndex == cellInfo.colIndex
                && downCellInfo.colSpan == cellInfo.colSpan) ? 0 : -1;
        },
        execCommand:function (cmd) {
            if (this.queryCommandState("mergedown") == -1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell);
            ut.mergeDown(cell);

        }
    };
    UE.commands["mergecells"] = {
        queryCommandState:function (cmd) {
            return getUETableBySelected() ? 0:-1;
        },
        execCommand:function (cmd) {
            if(this.queryCommandState("mergecells")==-1)return;
            getUETableBySelected().mergeRange();
        }
    };
    UE.commands["insertrow"] ={
        queryCommandState:function(cmd){
            return getTableItemsByRange().cell?0:-1;
        },
        execCommand:function(cmd){
            if(this.queryCommandState("insertrow")==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);
            ut.insertRow(cellInfo.rowIndex);
        }
    };
    UE.commands["deleterow"] = {
        queryCommandState:function(cmd){
            var tableItems = getTableItemsByRange();
            if(!tableItems.cell) {return -1;}
            var ut = getUETable(tableItems.cell);
            if( ut.selectedTds.length ){ return -1;}
        },
        execCommand:function(){
            if(this.queryCommandState("deleterow")==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);
            ut.deleteRow(cellInfo.rowIndex);
        }
    };
    UE.commands["insertcol"] = {
        queryCommandState:function(cmd){
            return getTableItemsByRange().cell?0:-1;
        },
        execCommand:function(cmd){
            if(this.queryCommandState("insertcol")==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);
            ut.insertCol(cellInfo.colIndex);
        }
    };
    UE.commands["deletecol"] = {
        queryCommandState:function(cmd){
            var tableItems = getTableItemsByRange();
            if(!tableItems.cell) return -1;
            var ut = getUETable(tableItems.cell);
            if(ut.selectedTds.length>0)return -1;
        },
        execCommand:function(){
            if(this.queryCommandState("deletecol")==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell),
                cellInfo = ut.getCellInfo(cell);
            ut.deleteCol(cellInfo.colIndex);
        }
    };
    UE.commands["splittocells"] = {
        queryCommandState:function(cmd){
            var tableItems = getTableItemsByRange(),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if(ut.selectedTds.length>0) return -1;
            return cell && (cell.colSpan>1 || cell.rowSpan>1)?0:-1;
        },
        execCommand:function(cmd){
            if(this.queryCommandState(cmd)==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell);
            ut.splitToCells(cell);
        }
    };
    UE.commands["splittorows"] = {
        queryCommandState:function(cmd){
            var tableItems = getTableItemsByRange(),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if(ut.selectedTds.length>0) return -1;
            return cell && cell.rowSpan > 1 ? 0:-1;
        },
        execCommand:function(cmd){
            if(this.queryCommandState(cmd)==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell);
            ut.splitToRows(cell);
        }
    };
    UE.commands["splittocols"] = {
        queryCommandState:function(cmd){
            var tableItems = getTableItemsByRange(),
                cell = tableItems.cell;
            if (!cell) return -1;
            var ut = getUETable(tableItems.table);
            if(ut.selectedTds.length>0) return -1;
            return cell && cell.colSpan > 1 ? 0:-1;
        },
        execCommand:function(cmd){
            if(this.queryCommandState(cmd)==-1)return;
            var cell = getTableItemsByRange().cell,
                ut = getUETable(cell);
            ut.splitToCols(cell);
        }
    }

    /**
     * UE表格操作类
     * @param table
     * @constructor
     */
    function UETable(table) {
        this.table = table;
        this.indexTable = [];
        this.selectedTds = [];
        this.cellsRange = {};
        this.update();
    }
    UETable.prototype = {
        /**
         * 获取某个tr中存在的单位td或者th个数
         */
        getCellsNumPerRow:function (row) {
            var cellsNum = 0;
            for (var i = 0, ci; ci = row.cells[i++];) {
                cellsNum += (ci.colSpan || 1);
            }
            return cellsNum;
        },
        /**
         * 获取当前表格的最大列数
         */
        getMaxCols:function () {
            var rows = this.table.rows, maxLen = 0;
            for (var i = 0, row; row = rows[i++];) {
                var len = this.getCellsNumPerRow(row);
                maxLen = len > maxLen ? len : maxLen;
            }
            return maxLen;
        },
        /**
         * 获取相同结束位置的单元格，xOrY指代了是获取x轴相同还是y轴相同
         */
        getSameEndPosCells:function(cell,xOrY){
            var flag = (xOrY.toLowerCase() === "x"),
                end = getXY(cell)[flag?'x':'y'] + cell["offset"+ (flag?'Width':'Height')],
                rows = this.table.rows,
                cells = null,returns = [];
            for(var i = 0;i < this.rowsNum;i++){
                cells = rows[i].cells;
                for(var j = 0,tmpCell;tmpCell = cells[j++];){
                    var tmpEnd = getXY(tmpCell)[flag?'x':'y'] + tmpCell["offset"+(flag?'Width':'Height')];
                    //对应行的td已经被上面行rowSpan了
                    if(tmpEnd > end && flag) break;
                    if(cell == tmpCell ||end == tmpEnd ){
                        //只获取单一的单元格
                        //todo 仅获取单一单元格在特定情况下会造成returns为空，从而影响后续的拖拽实现，修正这个。需考虑性能
                        if(tmpCell[flag?"colSpan":"rowSpan"] == 1){
                            returns.push(tmpCell);
                        }
                        if(flag) break;
                    }
                }
            }
            return returns;
        },
        /**
         * 获取跟当前单元格的右边竖线为左边的所有未合并单元格
         */
        getSameStartPosXCells:function(cell){
            var start = getXY(cell).x + cell.offsetWidth,
                rows = this.table.rows,cells ,returns = [];
            for(var i = 0;i < this.rowsNum;i++){
                cells = rows[i].cells;
                for(var j = 0,tmpCell;tmpCell = cells[j++];){
                    var tmpStart = getXY(tmpCell).x;
                    if(tmpStart > start) break;
                    if(tmpStart == start && tmpCell.colSpan == 1) {
                        returns.push(tmpCell);
                        break;
                    }
                }
            }
            return returns;
        },
        /**
         * 更新table对应的索引表
         */
        update:function (table) {
            this.table = table || this.table;
            var rows = this.table.rows,
            //暂时采用rows Length,对残缺表格可能存在问题，
            //todo 可以考虑取最大值
                rowsNum = rows.length,
                colsNum = this.getMaxCols();
            this.rowsNum = rowsNum;
            this.colsNum = colsNum;
            for (var i = 0, len = rows.length; i < len; i++) {
                this.indexTable[i] = new Array(colsNum);
            }
            //填充索引表
            for (var rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
                for (var cellIndex = 0, cell, cells = row.cells; cell = cells[cellIndex]; cellIndex++) {
                    //修正整行被rowSpan时导致的行数计算错误
                    if (cell.rowSpan > rowsNum) {
                        cell.rowSpan = rowsNum;
                    }
                    var colIndex = cellIndex,
                        rowSpan = cell.rowSpan || 1,
                        colSpan = cell.colSpan || 1;
                    //当已经被上一行rowSpan或者被前一列colSpan了，则跳到下一个单元格进行
                    while (this.indexTable[rowIndex][colIndex]) colIndex++;
                    for (var j = 0; j < rowSpan; j++) {
                        for (var k = 0; k < colSpan; k++) {
                            this.indexTable[rowIndex + j][colIndex + k] = {
                                rowIndex:rowIndex,
                                cellIndex:cellIndex,
                                colIndex:colIndex,
                                rowSpan:rowSpan,
                                colSpan:colSpan
                            }
                        }
                    }
                }
            }
            //修复残缺td
            for (j = 0; j < rowsNum; j++) {
                for (k = 0; k < colsNum; k++) {
                    if (this.indexTable[j][k] === undefined) {
                        row = rows[j];
                        cell = row.cells[row.cells.length - 1];
                        cell = cell ? cell.cloneNode(true) : document.createElement("td");
                        cell.innerHTML = "1";
                        if (cell.colSpan !== 1)cell.colSpan = 1;
                        if (cell.rowSpan !== 1)cell.rowSpan = 1;
                        row.appendChild(cell);
                        this.indexTable[j][k] = {
                            rowIndex:j,
                            cellIndex:cell.cellIndex,
                            colIndex:k,
                            rowSpan:1,
                            colSpan:1
                        }
                    }
                }
            }
        },
        //获取单元格行号
        getCellRowIndex:function (cell) {
            var cellIndex = cell.cellIndex,
                rows = this.table.rows,
                rowLen = rows.length;
            if (rowLen) while (rowLen--) {
                if (rows[rowLen].cells[cellIndex] === cell) {
                    return rowLen;
                }
            }
            return -1;
        },
        /**
         * 获取单元格的索引信息
         */
        getCellInfo:function (cell) {
            if (!cell) return;
            var cellIndex = cell.cellIndex,
                rowIndex = this.getCellRowIndex(cell),
                rowInfo = this.indexTable[rowIndex],
                numCols = this.colsNum;
            for (var colIndex = cellIndex; colIndex < numCols; colIndex++) {
                var cellInfo = rowInfo[colIndex];
                if (cellInfo.rowIndex === rowIndex && cellInfo.cellIndex === cellIndex) {
                    return cellInfo;
                }
            }
        },
        /**
         * 根据行列号获取单元格
         */
        getCell:function (rowIndex, cellIndex) {
            return rowIndex < this.rowsNum && this.table.rows[rowIndex].cells[cellIndex] || null;
        },
        /**
         * 删除单元格
         */
        deleteCell:function (cell, rowIndex) {
            rowIndex = typeof rowIndex == 'number' ? rowIndex : this.getCellRowIndex(cell);
            var row = this.table.rows[rowIndex];
            row.deleteCell(cell.cellIndex);
        },
        /**
         * 根据始末两个单元格获取被框选的所有单元格范围
         */
        getCellsRange:function (cellA, cellB) {
            var me = this,
                cellAInfo = me.getCellInfo(cellA);
            if (cellA === cellB) {
                return {
                    beginRowIndex:cellAInfo.rowIndex,
                    beginColIndex:cellAInfo.colIndex,
                    endRowIndex:cellAInfo.rowIndex + cellAInfo.rowSpan - 1,
                    endColIndex:cellAInfo.colIndex + cellAInfo.colSpan - 1
                };
            }
            var cellBInfo = me.getCellInfo(cellB);
            // 计算TableRange的四个边
            var beginRowIndex = Math.min(cellAInfo.rowIndex, cellBInfo.rowIndex),
                beginColIndex = Math.min(cellAInfo.colIndex, cellBInfo.colIndex),
                endRowIndex = Math.max(cellAInfo.rowIndex + cellAInfo.rowSpan - 1, cellBInfo.rowIndex + cellBInfo.rowSpan - 1),
                endColIndex = Math.max(cellAInfo.colIndex + cellAInfo.colSpan - 1, cellBInfo.colIndex + cellBInfo.colSpan - 1);

            return checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex);

            function checkRange(beginRowIndex, beginColIndex, endRowIndex, endColIndex) {
                var tmpBeginRowIndex = beginRowIndex,
                    tmpBeginColIndex = beginColIndex,
                    tmpEndRowIndex = endRowIndex,
                    tmpEndColIndex = endColIndex,
                    cellInfo, colIndex, rowIndex;
                // 通过indexTable检查是否存在超出TableRange上边界的情况
                if (beginRowIndex > 0) {
                    for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
                        cellInfo = me.indexTable[beginRowIndex][colIndex];
                        rowIndex = cellInfo.rowIndex;
                        if (rowIndex < beginRowIndex) {
                            tmpBeginRowIndex = Math.min(rowIndex, tmpBeginRowIndex);
                        }
                    }
                }
                // 通过indexTable检查是否存在超出TableRange右边界的情况
                if (endColIndex < me.colsNum) {
                    for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
                        cellInfo = me.indexTable[rowIndex][endColIndex];
                        colIndex = cellInfo.colIndex + cellInfo.colSpan - 1;
                        if (colIndex > endColIndex) {
                            tmpEndColIndex = Math.max(colIndex, tmpEndColIndex);
                        }
                    }
                }
                // 检查是否有超出TableRange下边界的情况
                if (endRowIndex < me.rowsNum) {
                    for (colIndex = beginColIndex; colIndex < endColIndex; colIndex++) {
                        cellInfo = me.indexTable[endRowIndex][colIndex];
                        rowIndex = cellInfo.rowIndex + cellInfo.rowSpan - 1;
                        if (rowIndex > endRowIndex) {
                            tmpEndRowIndex = Math.max(rowIndex, tmpEndRowIndex);
                        }
                    }
                }
                // 检查是否有超出TableRange左边界的情况
                if (beginColIndex > 0) {
                    for (rowIndex = beginRowIndex; rowIndex < endRowIndex; rowIndex++) {
                        cellInfo = me.indexTable[rowIndex][beginColIndex];
                        colIndex = cellInfo.colIndex;
                        if (colIndex < beginColIndex) {
                            tmpBeginColIndex = Math.min(cellInfo.colIndex, tmpBeginColIndex);
                        }
                    }
                }
                //递归调用直至所有完成所有框选单元格的扩展
                if (tmpBeginRowIndex != beginRowIndex || tmpBeginColIndex != beginColIndex || tmpEndRowIndex != endRowIndex || tmpEndColIndex != endColIndex) {
                    return checkRange(tmpBeginRowIndex, tmpBeginColIndex, tmpEndRowIndex, tmpEndColIndex);
                } else {
                    // 不需要扩展TableRange的情况
                    return {
                        beginRowIndex:beginRowIndex,
                        beginColIndex:beginColIndex,
                        endRowIndex:endRowIndex,
                        endColIndex:endColIndex
                    };
                }
            }
        },
        /**
         * 依据cellsRange获取对应的单元格集合
         */
        getCells:function (range) {
            //每次获取cells之前必须先清除上次的选择，否则会对后续获取操作造成影响
            this.clearSelected();
            var beginRowIndex = range.beginRowIndex,
                beginColIndex = range.beginColIndex,
                endRowIndex = range.endRowIndex,
                endColIndex = range.endColIndex,
                cellInfo, rowIndex, colIndex, tdHash = {}, returnTds = [];
            for (var i = beginRowIndex; i <= endRowIndex; i++) {
                for (var j = beginColIndex; j <= endColIndex; j++) {
                    cellInfo = this.indexTable[i][j];
                    rowIndex = cellInfo.rowIndex;
                    colIndex = cellInfo.colIndex;
                    // 如果Cells里已经包含了此Cell则跳过
                    var key = rowIndex + '|' + colIndex;
                    if (tdHash[key]) continue;
                    tdHash[key] = 1;
                    if (rowIndex < i || colIndex < j || rowIndex + cellInfo.rowSpan - 1 > endRowIndex || colIndex + cellInfo.colSpan - 1 > endColIndex) {
                        return null;
                    }
                    returnTds.push(this.getCell(rowIndex, cellInfo.cellIndex));
                }
            }
            return returnTds;
        },
        /**
         * 清理已经选中的单元格
         */
        clearSelected:function () {
            removeSelectedClass(this.selectedTds);
            this.selectedTds = [];
            this.cellsRang = {};
        },
        /**
         * 根据range设置已经选中的单元格
         */
        setSelected:function (range) {
            var cells = this.getCells(range);
            addSelectedClass(cells);
            this.selectedTds = cells;
            this.cellsRange = range;
        },
        /**
         * 移动单元格中的内容
         */
        moveContent:function (cellTo, cellFrom) {
            if (domUtils.isEmptyNode(cellFrom)) return;
            if (domUtils.isEmptyNode(cellTo)) {
                cellTo.innerHTML = cellFrom.innerHTML;
                return;
            }
            var child = cellTo.lastChild;
            if (child.nodeType != 1 || child.tagName != 'BR') {
                cellTo.appendChild(cellTo.ownerDocument.createElement('br'))
            }
            while (child = cellFrom.firstChild) {
                cellTo.appendChild(child);
            }
        },
        /**
         * 向右合并单元格
         */
        mergeRight:function(cell){
            var cellInfo = this.getCellInfo(cell),
                rightColIndex = cellInfo.colIndex + cellInfo.colSpan,
                rightCellInfo = this.indexTable[cellInfo.rowIndex][rightColIndex],
                rightCell = this.getCell(rightCellInfo.rowIndex, rightCellInfo.cellIndex);
            //合并
            cell.colSpan = cellInfo.colSpan + rightCellInfo.colSpan;
            //被合并的单元格不应存在宽度属性
            cell.removeAttribute("width");
            //移动内容
            this.moveContent(cell, rightCell);
            //删掉被合并的Cell
            this.deleteCell(rightCell, rightCellInfo.rowIndex);
        },
        /**
         * 向下合并单元格
         */
        mergeDown:function(cell){
            var cellInfo = this.getCellInfo(cell),
                downRowIndex = cellInfo.rowIndex + cellInfo.rowSpan,
                downCellInfo = this.indexTable[downRowIndex][cellInfo.colIndex],
                downCell = this.getCell(downCellInfo.rowIndex, downCellInfo.cellIndex);
            cell.rowSpan = cellInfo.rowSpan + downCellInfo.rowSpan;
            cell.removeAttribute("height");
            this.moveContent(cell, downCell);
            this.deleteCell(downCell, downCellInfo.rowIndex);
        },
        /**
         * 合并整个range中的内容
         */
        mergeRange:function(){
            //由于合并操作可以在任意时刻进行，所以无法通过鼠标位置等信息实时生成range，只能通过缓存实例中的cellsRange对象来访问
            var range = this.cellsRange,
                leftTopCell = this.getCell(range.beginRowIndex,this.indexTable[range.beginRowIndex][range.beginColIndex].cellIndex);
            // 删除剩余的Cells
            var cells = this.getCells(range),
                len = cells.length,cell;
            while (len--) {
                cell = cells[len];
                if (cell !== leftTopCell) {
                    this.moveContent(leftTopCell, cell);
                    this.deleteCell(cell);
                }
            }
            // 修改左上角Cell的rowSpan和colSpan，并调整宽度属性设置
            leftTopCell.rowSpan = range.endRowIndex - range.beginRowIndex + 1;
            leftTopCell.rowSpan > 1 && leftTopCell.removeAttribute("height");
            leftTopCell.colSpan = range.endColIndex - range.beginColIndex + 1;
            leftTopCell.colSpan > 1 && leftTopCell.removeAttribute("width");
        },
        /**
         * 插入一行单元格
         */
        insertRow:function(rowIndex){
            var numCols = this.colsNum,
                table = this.table,
                row = table.insertRow(rowIndex),cell,
                width = parseInt(table.offsetWidth / numCols,10);
            //首行直接插入,无需考虑部分单元格被rowspan的情况
            if (rowIndex == 0) {
                for (var colIndex = 0; colIndex < numCols; colIndex ++) {
                    cell =  row.insertCell(colIndex);
                    cell.innerHTML = browser.ie ? ' ' : "<br />";
                    cell.setAttribute("width",width);
                }
            } else {
                var infoRow = this.indexTable[rowIndex],
                    cellIndex = 0;
                for (colIndex = 0; colIndex < numCols; colIndex ++) {
                    var cellInfo = infoRow[colIndex];
                    //如果存在某个单元格的rowspan穿过待插入行的位置，则修改该单元格的rowspan即可，无需插入单元格
                    if (cellInfo.rowIndex < rowIndex) {
                        cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                        cell.rowSpan = cellInfo.rowSpan + 1;
                    } else {
                        cell = row.insertCell(cellIndex ++);
                        cell.innerHTML = browser.ie ? ' ' : "<br/>";
                        cell.setAttribute("width",width);
                    }
                }
            }
        },
        /**
         * 删除一行单元格
         * @param rowIndex
         */
        deleteRow:function(rowIndex){
            var infoRow = this.indexTable[rowIndex],
                colsNum = this.colsNum,
                //部分被rowspan的单元格在循环过程中可能会多次碰到，如果处理过了就缓存到这里，下次无需操作
                cacheMap = {},
                moveDownCount = 0;
            for (var colIndex =0; colIndex<colsNum; colIndex++) {
                var cellInfo = infoRow[colIndex],
                    key = cellInfo.rowIndex + '_' + cellInfo.colIndex;
                // 跳过已经处理过的Cell
                if( cacheMap[key] ) continue;
                cacheMap[key] = 1;
                var cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex - moveDownCount);
                // 如果Cell的rowSpan大于1, 表明它是从别的行rowSpan过来的, 修改它的rowSpan
                if (cell.rowSpan > 1) {
                    cell.rowSpan = --cellInfo.rowSpan;
                    // 如果是Cell所在行，需要将其搬到下一行,搬动之后会影响到当前行的cellIndex计数，故需要通过moveDownCount计数
                    if (cellInfo.rowIndex == rowIndex) {
                        var nextRowIndex = rowIndex + 1,
                            nextRowLeftCellIndex = colIndex == 0 ? 0 : this.indexTable[nextRowIndex][colIndex - 1].cellIndex,
                            nextRowLeftCell = this.getCell(nextRowIndex, nextRowLeftCellIndex + moveDownCount);
                        moveDownCount++;
                        colsNum--;
                        this.table.rows[nextRowIndex].insertBefore(cell, nextRowLeftCell.nextSibling);
                    }
                }
            }
            this.table.deleteRow(rowIndex);
        },
        insertCol:function(colIndex){
            var rowsNum = this.rowsNum,
                rowIndex = 0,
                tableRow,cell;
            if (colIndex == 0 || colIndex == this.colsNum) {
                for (; rowIndex < rowsNum; rowIndex ++) {
                    tableRow = this.table.rows[rowIndex];
                    cell = tableRow.insertCell(colIndex==0 ? colIndex:tableRow.cells.length);
                    cell.innerHTML = browser.ie ? ' ' : "<br />";
                }
            }  else {
                for (; rowIndex < rowsNum; rowIndex ++) {
                    var cellInfo = this.indexTable[rowIndex][colIndex];
                    if (cellInfo.colIndex < colIndex) {
                        cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                        cell.colSpan = cellInfo.colSpan + 1;
                    } else {
                        tableRow = this.table.rows[rowIndex];
                        cell = tableRow.insertCell(cellInfo.cellIndex);
                        cell.innerHTML = browser.ie ? ' ' : "<br />";
                    }
                }
            }
        },
        deleteCol:function(colIndex){
            var indexTable = this.indexTable,
                tableRows = this.table.rows,
                rowsNum = this.rowsNum,
                hash={};
            for (var rowIndex=0; rowIndex<rowsNum; rowIndex++) {
                var infoRow = indexTable[rowIndex],
                    cellInfo = infoRow[colIndex],
                    key = cellInfo.rowIndex+'|'+cellInfo.colIndex;
                // 跳过已经处理过的Cell
                if(hash[key])continue;
                hash[key] = 1;
                var cell = this.getCell(cellInfo.rowIndex, cellInfo.cellIndex);
                // 如果Cell的colSpan大于1, 就修改colSpan, 否则就删掉这个Cell
                if (cell.colSpan > 1) {
                    cell.colSpan--;
                } else {
                    tableRows[rowIndex].deleteCell(cellInfo.cellIndex);
                }
            }
        },
        splitToCells:function(cell){
            var cellInfo = this.getCellInfo(cell),
                rowIndex = cellInfo.rowIndex,
                colIndex = cellInfo.colIndex,
                width =  parseInt(cell.offsetWidth / cell.colSpan, 10);
            // 修改Cell的rowSpan和colSpan
            cell.rowSpan = 1;
            cell.colSpan = 1;
            cell.setAttribute("width",width);
            // 补齐单元格
            for(var i = rowIndex,endRow = rowIndex + cellInfo.rowSpan ;i < endRow;i++){
                for(var j = colIndex,endCol= colIndex + cellInfo.colSpan;j<endCol;j++){
                    var tableRow = this.table.rows[i],
                        index = this.indexTable[i][j],
                        tmpCell;
                    if( i == rowIndex) {
                        if(j == colIndex )continue;
                        tmpCell = tableRow.insertCell(index.cellIndex + 1);
                    }else{
                        tmpCell = tableRow.insertCell(tableRow.cells.length);
                    }
                    tmpCell.innerHTML =  browser.ie ? ' ' : "<br />";
                    tmpCell.setAttribute("width",width);
                }
            }
        },
        splitToRows:function(cell){
            var cellInfo = this.getCellInfo(cell),
                rowIndex = cellInfo.rowIndex,
                colIndex = cellInfo.colIndex;
            // 修改Cell的rowSpan
            cell.rowSpan = 1;
            // 补齐单元格
            for(var i = rowIndex,endRow = rowIndex + cellInfo.rowSpan ;i < endRow;i++){
                if(i==rowIndex)continue;
                var tableRow = this.table.rows[i],
                    tmpCell = tableRow.insertCell( this.indexTable[i][colIndex].cellIndex);
                tmpCell.colSpan = cellInfo.colSpan;
                tmpCell.innerHTML =  browser.ie ? ' ' : "<br />";
            }
        },
        splitToCols:function(cell){
            var cellInfo = this.getCellInfo(cell),
                rowIndex = cellInfo.rowIndex,
                colIndex = cellInfo.colIndex;
            // 修改Cell的rowSpan
            cell.colSpan = 1;
            // 补齐单元格
            for(var j = colIndex,endCol= colIndex + cellInfo.colSpan;j<endCol;j++){
                if(j==colIndex)continue;
                var tableRow = this.table.rows[rowIndex],
                    tmpCell = tableRow.insertCell(this.indexTable[rowIndex][j].cellIndex + 1);
                tmpCell.rowSpan = cellInfo.rowSpan;
                tmpCell.innerHTML =  browser.ie ? ' ' : "<br />";
            }
        }

    };


    /**
     * 根据当前选区获取相关的table信息
     * @return {Object}
     */
    function getTableItemsByRange() {
        var range = me.selection.getRange(),
            start = range.startContainer,
            cell= findParent(start, ["td", "th"],true),
            tr = cell && cell.parentNode,
            table = tr && tr.parentNode.parentNode;
        return {
            cell:cell,
            tr:tr,
            table:table
        }
    }
    /**
     * 获取需要触发对应点击或者move事件的td对象
     * @param evt
     */
    function getTargetTd(evt) {
        var target = findParent(evt.target || evt.srcElement, ["td", "th"], true);
        //排除了非td内部以及用于代码高亮部分的td
        return target && !domUtils.findParent(target, function (node) {
            return node.tagName == "DIV" && /highlighter/.test(node.id);
        }) ? target : null;
    }
};
