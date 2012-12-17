/**
 * @file
 * @name UE.ui
 * @import core/EventBase.js, core/utils.js, core/dom/domUtils.js, core/browser.js
 * @desc UEditor的ui实现类
 *
 */

(function(){
    var ui = UE.ui = function(editor){
        this.editor = editor;
        this.init();
    };

    ui.prototype = {
        /**
         * @name init
         * @desc 初始化ui
         */
        init: function(){
            var zV = ui.View;
            this.wrapper = new zV({viewType: 'wrapper',viewHtmlTag: 'div',unselectable: true});
            this.toolbar = new zV.Toolbar(this);
            this.editorHolder = new zV({viewType: 'editorholder',viewHtmlTag: 'div'});
            this.statusbar = new zV.Toolbar(this, {viewType: 'statusbar'});
        },
        /**
         * @name render
         * @desc 把ui渲染到指定的node中
         * @grammar ui.render(node) //渲染ui到node节点区域
         */
        render: function(node){
            var editor = this.editor,
                options = editor.options,
                opttoolbars = options.toolbars,
                optstatusbars = options.statusbars;

            node.appendChild(this.wrapper.dom);
            this.wrapper.appendChild(this.toolbar).appendChild(this.editorHolder).appendChild(this.statusbar);
            opttoolbars && this.toolbar.addTool(opttoolbars);
            optstatusbars && this.statusbar.addTool(optstatusbars);
        }
    };

    ui.UE_Event = UE.EventBase;
    ui.UE_Utils = UE.utils;
    ui.UE_DomUtils = UE.dom.domUtils;
    ui.UE_Browser = UE.browser;
})();
