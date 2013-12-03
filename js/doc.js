var hljs= window.hljs;
$(function(){
    var path = location.hash.slice(1).split('-'), cate = path[0], doc = path[1];
    activeCate = path.length >= 2 ? path[0]:docList[0]['id'];
    activeDoc = path.length >= 2 ? path[1]:docList[0]['list'][0]['id'];

    /* 便利数据对象，生成导航的目录树 */
    $.each(docList, function(ckey, c){
        var $category = $('<li>'),
            $item = $('<ul class = "nav">');

        $category.append('<a href="#">' + c.title + '</a>');
        $.each(c.list, function(vkey, v){
            var $li = $('<li><a href="#' + c.id + '-' + v.id + '">' + v.title + '</a></li>');
            if (c.id==activeCate && v.id==activeDoc) {
                $('#guidebar .nav .nav>li').removeClass('active');
                $li.addClass('active');
                updateDocContent(v.title);
            }
            $item.append($li);
        });
        if ($item.find('li')) $category.append($item);

        $category.appendTo('#guidebar>ul');
    });

    /* 设置点击连接，更新导航菜单的active状态 */
    $('#guidebar .nav .nav>li>a').click(function(){
        $('#guidebar .nav li').removeClass('active');
        $(this).parent().addClass('active').parent().parent().addClass('active');
        updateDocContent($(this).text());
    });

    /* 拉取md文档，并解析插入到页面上 */
    function updateDocContent(activeMd){
        $.get('doc/' + activeMd + '.md',function(s){
            var html = markdown.toHTML(s)
                .replace(/src=\"images\//g, 'src=\"doc/images/')
                .replace(/<code>/g, '<pre>')
                .replace(/<\/code>/g, '</pre>')
                .replace(/\<pre\>([^ \s]+)\b/g, '<pre class="sh_$1">');
            $('#show').html(html);
            $('#show pre,#show code').addClass("prettyprint");
            prettyPrint();
        });
    };
})