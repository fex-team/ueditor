/**
 * @file
 * @name ui.View.Toolbar
 * @import ui/ui.view.js
 * 工具条Toolbar实现类，负责添加工具
 */

(function(ue){
    var ui = ue.ui,
            utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.Toolbar
         * @grammar toolbar = new ui.View.Toolbar(ui, obj) //ui实例，obj-可选参数对象[title, viewType, tabodr]
         */
        toolbar = views.Toolbar = function(ownerui, obj){
            obj = obj || {};

            var title = obj.title;

            this.ownerui = ownerui;
            this.makeDom({viewType: (obj.viewType||'toolbar'), viewHtmlTag: obj.viewHtmlTag||'div'});
            this.toolList = [];


            //处理带选项卡的工具条
            if(title){
                this.setClass('edui-tabtoolbar' );
                this.addClass('edui-tabtoolbar'+obj.tabodr );
                var tab = this.tab = new views({viewType: 'tab', viewText: title, unselectable: true});
                tab.ownertoolbar = this;
                tab.setProxyListener('click');//只设置点击代理，鼠标移上去划出暂时没有需求。是否考虑加在基类的实例化时默认设置所有dom事件
                tab.addListener('click', utils.bind(this.switchoverTab, this, this));
                this.ownerui.toolbarhandle.appendChild(tab);
//                this.appendChild(tab);
                ownerui = tab = null;
            }
            obj = null;
        };

    toolbar.prototype = {
        /**
         * @name currentClassname
         * @desc 配置项-当前tan的样式名
         */
        currentClassname: 'current',
        /**
         * @name tabKey
         * @desc 配置项里的tabtoolbar配置键
         */
        tabKey:{
            tab: 'tab',
            tools: 'tools'
        },

        /**
         * @name addTool
         * @desc 初始化工具栏按钮，可以是单独的按钮或者组合工具
         * @grammar toolbar.addTool(tools)
         *        tools {String|Array|Object} 配置项中的工具栏按钮
         *              {String} 工具栏按钮名称
         *              {Array} 工具栏分组
         *              {Object} tabtoolbar的实现 @example {tab:'这是一个tab_1标题', tools:['bold', 'source']}
         */
        addTool: function(tools){
            var group, tmp, it, isFirstTab, tabid = 0,  i = 0,
                ui = this.ownerui,
                tabk = this.tabKey.tab,
                toolsk = this.tabKey.tools;

            tools = utils.isArray(tools) ? tools : [tools];
            for(; i<tools.length;){
                it = tools[i++];
                if(typeof it === 'string'){//添加一个按钮
                    tmp = ui.getButton(it);
                }else{
                    (group = this.group) || (group=this.group=[]);
                    //handle config likes [a, b,[c, d..]...]
                    //添加一组按钮
                    if(utils.isArray(it)){
                        tmp = group[group.length] = new views.Toolbar(ui);
                        tmp.addTool(it);
                    }
                    //添加一个tabtoolbar
                    else if(utils.isObject(it) && tabk in it){
                        if(tabid===0){
                            isFirstTab = true;
                        }
                        tmp = group[tabk+(tabid++)] = new views.Toolbar(ui, {title: it[tabk], tabodr:tabid});
                        if(isFirstTab){
                            tmp.addClass(this.currentClassname);
                            tmp.tab.addClass(this.currentClassname)
                            this.currentTab = tmp
                            isFirstTab = null;
                        }
                        tmp.addTool(it[toolsk]);
                    }
                }

                this.toolList.push(tmp);
                tmp.ownertoolbar = this;
                this.appendChild(tmp);//组合tool添加button到工具栏
            }
        },

        switchoverTab: function(tab){
            var toolbar = this.ownertoolbar,
                current = toolbar.currentTab;
            if(tab != current){
                current.removeClass(this.currentClassname);
                current.tab.removeClass(this.currentClassname);
                tab.addClass(this.currentClassname);
                tab.tab.addClass(this.currentClassname);
                toolbar.currentTab = tab;
            }
        }
    };

    utils.inherits(toolbar, views);
    toolbar = null;
})(UE);
