//html字符串转换成uNode节点
//by zhanyi
var htmlparser = UE.htmlparser = function (htmlstr) {
    var reg = new RegExp(domUtils.fillChar, 'g');
    //ie下取得的html可能会有\n存在，要去掉，在处理replace(/[\t\r\n]*/g,'');代码高量的\n不能去除
    htmlstr = htmlstr.replace(reg, '').replace(/>[\t\r\n]*?</g, '><');

    var re_tag = /<(?:(?:\/([^>]+)>)|(?:!--([\S|\s]*?)-->)|(?:([^\s\/>]+)\s*((?:(?:"[^"]*")|(?:'[^']*')|[^"'<>])*)\/?>))/g,
        re_attr = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g;

    var uNode = UE.uNode,
        needparentNode = {
            'td':'tr',
            'tr':'tbody',
            'tbody':'table',
            'th':'tr',
            'thead':'table',
            'tfoot':'table',
            'caption':'table',
            'li':['ul', 'ol'],
            'dt':'dl',
            'dd':'dl',
            'option':'select'
        };

    function text(parent, data) {
        parent.children.push(new uNode({
            type:'text',
            data:data,
            parentNode:parent
        }));
    }

    function element(parent, tagName, htmlattr) {
        var needParentTag;
        if (needParentTag = needparentNode[tagName]) {
            if (tagName == parent.tagName) {
                parent = parent.parentNode;
            } else if (utils.isArray(needParentTag) ? utils.indexOf(needParentTag, parent.tagName) == -1 : needParentTag != parent.tagName) {
                parent = element(parent, utils.isArray(needParentTag) ? needParentTag[0] : needParentTag)
            }
        }
        var elm = new uNode({
            parentNode:parent,
            type:'element',
            tagName:tagName,
            //是自闭合的处理一下
            children:dtd.$empty[tagName] ? null : []
        });
        //如果属性存在，处理属性
        if (htmlattr) {
            var attrs = {}, match;
            while (match = re_attr.exec(htmlattr)) {
                attrs[match[1].toLowerCase()] = match[2]
            }
            elm.attrs = attrs;
        }

        parent.children.push(elm);
        //如果是自闭合节点返回父亲节点
        return  dtd.$empty[tagName] ? parent : elm
    }

    function comment(parent, data) {
        parent.children.push(new uNode({
            type:'comment',
            data:data,
            parentNode:parent
        }));
    }

    var match, currentIndex = 0, nextIndex = 0;
    //设置根节点
    var root = new uNode({
        type:'root',
        children:[]
    });
    var currentParent = root;
    while (match = re_tag.exec(htmlstr)) {
        currentIndex = match.index;
        if (currentIndex > nextIndex) {
            //text node
            text(currentParent, htmlstr.slice(nextIndex, currentIndex));
        }
        if (match[3]) {
            //start tag
            currentParent = element(currentParent, match[3], match[4]);

        } else if (match[1]) {
            //end tag
            currentParent = currentParent.parentNode;
        } else if (match[2]) {
            //comment
            comment(currentParent, match[2])
        }
        nextIndex = re_tag.lastIndex;

    }
    //如果结束是文本，就有可能丢掉，所以这里手动判断一下
    //例如 <li>sdfsdfsdf<li>sdfsdfsdfsdf
    if (nextIndex < htmlstr.length) {
        text(currentParent, htmlstr.slice(nextIndex));
    }
    return root;
};