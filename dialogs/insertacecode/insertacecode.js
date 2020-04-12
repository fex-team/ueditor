/**
 * 作者: 阿丁
 * 日期: 2020年4月10日
 * 时间: 16:59:45
 * 插入ace格式代码功能的主要实现代码，需要根据选择设置不同的语言和主题，并将处理之后的html代码返回到ueditor里
 */
(function () {
    //var { modes } = require("ace/ext/modelist");
    //var { themes } = require("ace/ext/themelist");
    var { modesByName } = require("ace/ext/modelist"),
        { themesByName } = require("ace/ext/themelist"),
        modes = [],
        themes = [];

    // 配置文件里配置的语言和主题优先显示在最前面，并按配置顺序显示
    for(var item of selectlangs){
        modes.push(modesByName[item]);
    }
    for(var item of selectthemes){
        themes.push(themesByName[item]);
    }

    // 其余的语言和主题显示在后面
    for(var item in modesByName){
        if(selectlangs.indexOf(item) === -1){
            modes.push(modesByName[item]);
        }
    }
    for(var item in themesByName){
        if(selectthemes.indexOf(item) === -1){
            themes.push(themesByName[item]);
        }
    }

    var me = editor,
            aceContainer = $G( "aceeditor" ),
            types = {
                lang: {
                    container: $G( "langitem" ),
                    datas: modes, //selectlangs,
                    currentItem: modes[0]
                },
                theme:{
                    container: $G( "themeitem" ),
                    datas: themes, //selectthemes,
                    currentItem: themes[0]
                }
            },
            aceEditor;
    // 封装选择列表的初始化
    var initPre = function (typeName) {
        var datas = types[typeName].datas,
            container = types[typeName].container;
        var str = "";
        for ( var i = 0, item; item = datas[i++]; ) {
            str += `<div class="${typeName}iterm" onclick="pre('${typeName}', ${i})">${item.caption}</div>`;
        }
        container.innerHTML = str;
    };
    // 封装选择列表的点击处理事件
    var pre = function ( typeName, n ) {
        var item = types[typeName].datas[n - 1];
        types[typeName].currentItem = item;
        clearItem( typeName );
        domUtils.setStyles( types[typeName].container.childNodes[n - 1], {
            "background-color":"lemonChiffon",
            "border":"#ccc 1px solid"
        } );
        // 选择语言后更新右边的编辑器语言
        createAceEditor();
    };
    // 清除选择列表的所有选中行样式
    var clearItem = function ( typeName ) {
        var items = types[typeName].container.children;
        for ( var i = 0, item; item = items[i++]; ) {
            domUtils.setStyles( item, {
                "background-color":"",
                "border":"white 1px solid"
            } );
        }
    };
    // 创建新的 ace 编辑器
    var createAceEditor = function () {
        var lang = types.lang.currentItem,
            theme = types.theme.currentItem;
        if(!aceEditor){
            aceEditor = ace.edit( aceContainer, {
                maxLines: 30000
            });
        }
        // 设置新的语言和主题
        aceEditor.session.setMode("ace/mode/" + lang.name);
        aceEditor.setTheme("ace/theme/" + theme.name);
    };

    // 点击确定按钮执行插入代码到 ueditor 编辑器里
    dialog.onok = function () {
        // 将ace输出结果的div转成p标签
        var style = window.getComputedStyle(aceContainer, null);
        var $html = $('<p>');
        copyStyle($html, aceContainer, ['height', 'background-color', 'font', 'position']);
        $html.css('padding', '2px 0');
        $html.css('overflow', 'hidden');

        // 处理行号样式问题
        var ace_gutter = $(aceContainer).find('.ace_gutter');
        var gutter = $('<span>');
        copyStyle(gutter, ace_gutter[0], ['width', 'height', 'display', 'background-color', 'position', 'color', 'user-select']);
        var aceGutterCell = ace_gutter.find('.ace_gutter-cell');
        for(var i=0; i<aceGutterCell.length; i++){
            var gutterItem = aceGutterCell[i];
            var newGutterItem = $('<span>');
            copyStyle(newGutterItem, gutterItem, ['width', 'height', 'display', 'position', 'top', 'left', 'right', 'padding-left', 'padding-right']);
            newGutterItem.text(gutterItem.textContent);
            gutter.append(newGutterItem);
        }
        $html.append(gutter);

        // 处理内容
        var ace_scroller = $(aceContainer).find('.ace_scroller');
        var scroller = $('<span>');
        copyStyle(scroller, ace_scroller[0], ['width', 'height', 'display', 'background-color', 'position', 'left', 'color']);
        scroller.css('white-space', 'pre');
        var aceLines = ace_scroller.find('.ace_line');
        for(var i=0; i<aceLines.length; i++){
            var aceLine = aceLines[i];
            var newAceLine = $('<span>');
            copyStyle(newAceLine, aceLine, ['display', 'position', 'top', 'left', 'right', 'padding-left', 'padding-right']);
            disposeAceLine(newAceLine, aceLine);
            scroller.append(newAceLine);
        }
        $html.append(scroller);
        me.execCommand('insertHtml', $html.prop("outerHTML"));
    }

    // 横杠属性转驼峰属性
    var toCamel = function ( str ) {
        return str.replace(/([^_])(?:_+([^_]))/g, function ($0, $1, $2) {
            return $1 + $2.toUpperCase();
        });
    }

    // 复制dom元素的样式，实现class转style
    var copyStyle = function ( newDom, oldDom, copyList ) {
        var style = window.getComputedStyle(oldDom, null);
        for(item of copyList){
            var styleName = toCamel(item);
            newDom.css(item, style[styleName]);
        }
    }

    // 处理每一行代码
    var disposeAceLine = function ( newAceLine, aceLine ) {
        // 循环复制一行代码里的所有元素，设置各自元素的颜色
        for(var i=0; i<aceLine.childNodes.length; i++){
            var node = aceLine.childNodes[i];
            var newChildren = $('<span>');
            if(node.tagName === 'SPAN'){
                var style = window.getComputedStyle(node, null);
                newChildren.css('color', style.color);
            }
            newChildren.text(node.textContent);
            newAceLine.append(newChildren);
        }
        // 添加换行符，否则复制全部变成一行
        newAceLine.append('<br>');
    }

    // 初始化选择语言和主题列表
    initPre('lang');
    initPre('theme');

    // 设置语言和主题初始值
    window.pre = pre;
    pre('lang', 1);
    pre('theme', 1);

})();