UE.parse.register('table',function(utils){
    var root = this.root,
        tables = root.getElementsByTagName('table');
    if(tables.length){
        var selector = this.selector;
        //追加默认的表格样式
        utils.cssRule('table',
            selector +' table.noBorderTable td,'+
                selector+' table.noBorderTable th,'+
                selector+' table.noBorderTable caption{border:1px dashed #ddd !important}' +
                selector +' table{margin-bottom:10px;border-collapse:collapse;display:table;}' +
                selector +' td,'+selector+' th{ background:white; padding: 5px 10px;border: 1px solid #DDD;}' +
                selector +' caption{border:1px dashed #DDD;border-bottom:0;padding:3px;text-align:center;}' +
                selector +' th{border-top:1px solid #BBB;background:#F7F7F7;}' +
                selector +' table tr.firstRow th{border-top:2px solid #BBB;background:#F7F7F7;}' +
                selector +' td p{margin:0;padding:0;}',
            document);
        //填充空的单元格
        utils.each('td th caption'.split(' '),function(tag){
            var cells = root.getElementsByTagName(tag);
            cells.legnth && utils.each(cells,function(node){
                if(!node.firstChild){
                    node.innerHTML = '&nbsp;'
                }
            })
        })
    }
});