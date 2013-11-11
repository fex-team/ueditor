UE.parse.register('table', function (utils) {
    var me = this,
        root = this.root,
        tables = root.getElementsByTagName('table');
    if (tables.length) {
        var selector = this.selector;
        //追加默认的表格样式
        utils.cssRule('table',
            selector + ' table.noBorderTable td,' +
                selector + ' table.noBorderTable th,' +
                selector + ' table.noBorderTable caption{border:1px dashed #ddd !important}' +
                selector + ' table.sortEnabled tr.firstRow th,' + selector + ' table.sortEnabled tr.firstRow td{padding-right:20px; background-repeat: no-repeat;' +
                    'background-position: center right; background-image:url(' + this.rootPath + 'themes/default/images/sortable.png);}' +
                selector + ' table.sortEnabled tr.firstRow th:hover,' + selector + ' table.sortEnabled tr.firstRow td:hover{background-color: #EEE;}' +
                selector + ' table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
                selector + ' td,' + selector + ' th{ background:white; padding: 5px 10px;border: 1px solid #DDD;}' +
                selector + ' caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
                selector + ' th{border-top:1px solid #BBB;background:#F7F7F7;}' +
                selector + ' table tr.firstRow th{border-top:2px solid #BBB;background:#F7F7F7;}' +
                selector + ' tr.ue-table-interlace-color-single td{ background: #fcfcfc; }' +
                selector + ' tr.ue-table-interlace-color-double td{ background: #f7faff; }' +
                selector + ' td p{margin:0;padding:0;}',
            document);
        //填充空的单元格

        utils.each('td th caption'.split(' '), function (tag) {
            var cells = root.getElementsByTagName(tag);
            cells.length && utils.each(cells, function (node) {
                if (!node.firstChild) {
                    node.innerHTML = '&nbsp;';

                }
            })
        });

        //表格可排序
        var tables = root.getElementsByTagName('table');
        utils.each(tables, function (table) {
            if (/\bsortEnabled\b/.test(table.className)) {
                utils.on(table, 'click', function(e){
                    var target = e.target || e.srcElement,
                        cell = findParentByTagName(target, ['td', 'th']);
                    var table = findParentByTagName(target, 'table'),
                        colIndex = utils.indexOf(table.rows[0].cells, cell),
                        sortType = table.getAttribute('data-sort-type');
                    if(colIndex != -1) {
                        sortTable(table, colIndex, me.tableSortCompareFn || sortType);
                        updateTable(table);
                    }
                });
            }
        });

        //按照标签名查找父节点
        function findParentByTagName(target, tagNames) {
            var i, current = target;
            tagNames = utils.isArray(tagNames) ? tagNames:[tagNames];
            while(current){
                for(i = 0;i < tagNames.length; i++) {
                    if(current.tagName == tagNames[i].toUpperCase()) return current;
                }
                current = current.parentNode;
            }
            return null;
        }
        //表格排序
        function sortTable(table, sortByCellIndex, compareFn) {
            var rows = table.rows,
                trArray = [],
                flag = rows[0].cells[0].tagName === "TH",
                lastRowIndex = 0;

            for (var i = 0,len = rows.length; i < len; i++) {
                trArray[i] = rows[i];
            }

            var Fn = {
                'reversecurrent': function(td1,td2){
                    return 1;
                },
                'orderbyasc': function(td1,td2){
                    var value1 = td1.innerText||td1.textContent,
                        value2 = td2.innerText||td2.textContent;
                    return value1.localeCompare(value2);
                },
                'reversebyasc': function(td1,td2){
                    var value1 = td1.innerHTML,
                        value2 = td2.innerHTML;
                    return value2.localeCompare(value1);
                },
                'orderbynum': function(td1,td2){
                    var value1 = td1[utils.isIE ? 'innerText':'textContent'].match(/\d+/),
                        value2 = td2[utils.isIE ? 'innerText':'textContent'].match(/\d+/);
                    if(value1) value1 = +value1[0];
                    if(value2) value2 = +value2[0];
                    return (value1||0) - (value2||0);
                },
                'reversebynum': function(td1,td2){
                    var value1 = td1[utils.isIE ? 'innerText':'textContent'].match(/\d+/),
                        value2 = td2[utils.isIE ? 'innerText':'textContent'].match(/\d+/);
                    if(value1) value1 = +value1[0];
                    if(value2) value2 = +value2[0];
                    return (value2||0) - (value1||0);
                }
            };

            //对表格设置排序的标记data-sort-type
            table.setAttribute('data-sort-type', compareFn && typeof compareFn === "string" && Fn[compareFn] ? compareFn:'');

            //th不参与排序
            flag && trArray.splice(0, 1);
            trArray = sort(trArray,function (tr1, tr2) {
                var result;
                if (compareFn && typeof compareFn === "function") {
                    result = compareFn.call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
                } else if (compareFn && typeof compareFn === "number") {
                    result = 1;
                } else if (compareFn && typeof compareFn === "string" && Fn[compareFn]) {
                    result = Fn[compareFn].call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
                } else {
                    result = Fn['orderbyasc'].call(this, tr1.cells[sortByCellIndex], tr2.cells[sortByCellIndex]);
                }
                return result;
            });
            var fragment = table.ownerDocument.createDocumentFragment();
            for (var j = 0, len = trArray.length; j < len; j++) {
                fragment.appendChild(trArray[j]);
            }
            var tbody = table.getElementsByTagName("tbody")[0];
            if(!lastRowIndex){
                tbody.appendChild(fragment);
            }else{
                tbody.insertBefore(fragment,rows[lastRowIndex- range.endRowIndex + range.beginRowIndex - 1])
            }
        }
        //冒泡排序
        function sort(array, compareFn){
            compareFn = compareFn || function(item1, item2){ return item1.localeCompare(item2);};
            for(var i= 0,len = array.length; i<len; i++){
                for(var j = i,length = array.length; j<length; j++){
                    if(compareFn(array[i], array[j]) > 0){
                        var t = array[i];
                        array[i] = array[j];
                        array[j] = t;
                    }
                }
            }
            return array;
        }
        //更新表格
        function updateTable(table) {
            //给第一行设置firstRow的样式名称,在排序图标的样式上使用到
            if(!utils.hasClass(table.rows[0], "firstRow")) {
                for(var i = 1; i< table.rows.length; i++) {
                    utils.removeClass(table.rows[i], "firstRow");
                }
                utils.addClass(table.rows[0], "firstRow");
            }
        }
    }
});