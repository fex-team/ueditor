$(function(){
    var path = location.hash.replace(/\?.*$/, '').slice(1).split('-'),
        cate = path[0],
        doc = path[1],
        mdToPath = {},
        pathToMd = {},
        listArr = []
        supportHashChange = (window.onhashchange !== undefined);

    activeCate = path.length >= 2 ? path[0]:docList[0]['id'];
    activeDoc = path.length >= 2 ? path[1]:docList[0]['list'][0]['id'];


    /* 遍历数据对象，生成导航的目录树 */
    $.each(docList, function(ckey, c){
        var $category = $('<li class="category">'),
            $item = $('<ul class = "nav">'),
            $title = $('<a href="javascript:void(0)">' + c.title + '</a>');

        $category.append($title);
        $.each(c.list, function(vkey, v){
            listArr.push(v.title);
            var $li = $('<li><a href="#' + c.id + '-' + v.id + '">' + v.title + '</a></li>');
            if (c.id==activeCate && v.id==activeDoc) {
                $('#guidebar .nav .nav>li').removeClass('active');
                $li.addClass('active');
                updateDocContent(v.title);
            }
            $item.append($li);
            mdToPath[v.title] = c.id + '-' + v.id;
            pathToMd[c.id + '-' + v.id] = v.title;
        });
        if ($item.find('li')) {
            $category.append($item);
            var bakHeight;
            $title.on('click', function () {
                if ($item.css('display') == 'block') {
                    bakHeight = $item.height();
                    $item.hide();
                } else {
                    $item.show();
                }
            });
        }

        $category.appendTo('#guidebar>ul');
    });

    /* 拉取md文档，并解析插入到页面上 */
    function updateDocContent(activeMd){
        $.get('doc/' + activeMd + '.md',function(s){
            var index = $.inArray(activeMd, listArr),
                pagebar = '<div class="pagebar">' +
                    (index != 0 ? ('<a class="previous mardwodnlink" href="#'+mdToPath[listArr[index-1]]+'">上一篇: '+listArr[index-1]+'</a>'):'') +
                    (index != (listArr.length - 1) ? '<a class="next mardwodnlink" href="#'+mdToPath[listArr[index+1]]+'">下一篇: '+listArr[index+1]+'</a>':'') +
                    '<span class="clearfloat"></span>' +
                    '</div>',
                html = markdown.toHTML(s)
                    .replace(/src=\"images\//g, 'src=\"doc/images/')
                    .replace(/<code>/g, '<pre>')
                    .replace(/<\/code>/g, '</pre>')
                    .replace(/\<pre\>([^ \s]+)\b/g, '<pre class="prettyprint lang-$1">')
                    .replace(/\<a href=\"([^\"]*)\.md\"/g, function(s, m){
                        if (/^[a-zA-Z]+:/.test(m)) {
                            return s;
                        } else {

                        }
                        return '<a class="mardwodnlink" href="#' + mdToPath[m] + '"';
                    });

            $('#show').html(html + pagebar);

            $('#show pre,#show code').addClass("prettyprint");
            $('#show pre,#show code').each(function(index,node){

                var lang = $(node).attr('class').match(/(javascript|js|css|html)/);
                if(lang &&lang[0]){
                    var html = beautify($(node).html(),lang[0]);
                    $(node).html(html)
                }
            });

            if (!supportHashChange) {
                /* 设置其他markdown的链接 */
                $('#show .mardwodnlink').click(function(){
                    $('#guidebar .nav .nav>li>a[href=' + $(this).attr('href') + ']').trigger('click');
                    window.scrollTo(0, 1);
                });
            }

            prettyPrint();
        });
    }

    if (supportHashChange) {
        /* 设置点击连接，更新导航菜单的active状态 */
        window.onhashchange = function(){
            var hash = location.hash;
            $('#guidebar .nav li').removeClass('active');
            $('#guidebar .nav .nav>li>a[href=' + hash + ']').parent().addClass('active').parent().parent().addClass('active');
            updateDocContent(pathToMd[location.hash.substr(1)]);
            window.scrollTo(0, 1);
        };
        updateDocContent(pathToMd[location.hash.substr(1) || 'start-start']);
    } else {
        /* 设置点击连接，更新导航菜单的active状态 */
        $('#guidebar .nav .nav>li>a').click(function(){
            $('#guidebar .nav li').removeClass('active');
            $(this).parent().addClass('active').parent().parent().addClass('active');
            updateDocContent($(this).text());
            window.scrollTo(0, 1);
        });
    }
});