UE.parse.register('background', function (utils) {
    var me = this,
        root = me.root,
        p = root.getElementsByTagName('p'),
        styles;

    for (var i = 0; i < p.length; i++) {
        styles = p[i].getAttribute('data-background');
        if (styles) p[i].parentNode.removeChild(p[i]);
    }

    //追加默认的表格样式
    styles && utils.cssRule('ueditor_background', me.selector + '{' + styles + '}', document);
});