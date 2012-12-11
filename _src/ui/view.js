/**
 * @file
 * @name ui.View
 * @import ui/ui.utils.js, ui/ui.js
 */

(function(ui){
    var utils = ui.Utils,
        view = ui.View = function(opt){
            this.makeDom(opt || {});
        };

    view.prototype = {
        viewType: 'view',
        viewHtmlTag: 'span',
        viewText: '',
        cssPrefix: 'edui-',
        getViewType: function(){
            return this.dom.className.split(' ')[0];
        },

        STATE:{
            DEFAULT: 0,
            CHECKED: 1,
            DISABLED: -1
        },

        /**
         * @name show
         * @grammar view.show(x, y, tar) //在相对于tar元素（默认为body）的(x, y)坐标处（默认为左上角）显示
         */
        show: function(x, y, tar){
                var dom = this.dom,
                    css = dom.style.cssText;

                tar = (tar&&tar.nodeType===1) ? tar : document.body;
                x = x| 0;
                y = y| 0;
                dom.style.cssText = css.replace(/;$/, '') + ';left:'+x+'px;top:'+y+'px;';
                tar.appendChild(dom);

            //修改后的代码
//            return function(){
//                dom.style.display == 'none' && (dom.style.display = 'block');
//            };
            //修改前的代码
                this.show = function(){
                    dom.style.display == 'none' && (dom.style.display = 'block');
                };
        },
        hide: function(){
            if(this.dom)
            this.dom.style.display = 'none';
        },

        /**
         * @name setClass
         * @grammar view.setClass(classname) //classname为设置的样式名
         */
        setClass: function(classname){
            var dom = this.dom,
                clastr = dom.className;

            clastr!==classname && (dom.className=classname);
        },

        /**
         * @name addClass
         * @grammar view.addClass(classnaem) //classname为添加的样式名
         */
        addClass: function(classname){
            var dom = this.dom,
                clastr = dom.className,
                ret = [clastr],
                tmp;
            classname = utils.isArray(classname)?classname:[classname];
            for(var i= 0,len=classname.length; i<len;){
                tmp = classname[i++].replace(/\s*/, '');
                clastr.indexOf(tmp)===-1 && ret.push(tmp);
            }

            return ret.length>1 ? (dom.className=ret.join(' ')) : false;
        },

        /**
         * @name removeClass
         * @grammar view.removeClass(classname) //classname为移除的样式名
         */
        removeClass: function(classname){
            var dom = this.dom,
                clastr = dom.className,
                regx, tmp;

            classname = utils.isArray(classname)?classname:[classname];
            for(var i= 0,len=classname.length; i<len;){
                tmp = classname[i++].replace(/\s*/, '');
                if(clastr.indexOf(tmp)!==-1){
                    regx = new RegExp('(^'+tmp+'\\s*)|(\\s+'+tmp+')');
                    clastr = clastr.replace(regx, '');
                }
            }

            dom.className!=clastr && (dom.className=clastr);

            dom = regx = null;
        },

        /**
         * @name makeDom
         * @desc 生成相应的DOM结构
         * @grammar view.makeDom(opt)// opt {Object} 键值可选[viewHtmlTag, viewText, viewType]，根据这些键值创建DOM，
         *                     其中viewText支持模板变量如{ID}
         */
        makeDom: function(opt){
            var tag = opt.viewHtmlTag || this.viewHtmlTag,
                cont = opt.viewText||this.viewText,
                classname = (opt.cssPrefix||this.cssPrefix) + (opt.viewType || this.viewType),
                dom = this.dom = document.createElement(tag);

            dom.className = classname;
            dom.id = utils.guid(classname);

            (utils.ie||opt.unselectable) && utils.makeUnselectable(dom);

            !!cont && (cont.nodeType ? dom.appendChild(cont) : (dom.innerHTML = cont.replace(/\{ID\}/ig, dom.id) ) );

            dom = null;
        },

        /**
         * @name setTips
         * @grammar view.setTips(tips)
         * @param tips
         */
        setTips: function(tips){
            this.dom.setAttribute('title', tips);
        },

        /**
         * @name appendChild
         * @grammar view.appendChild(childView) //childView为子view
         */
        appendChild: function(child){
            child instanceof ui.View && this.dom.appendChild(child.dom);
            return this;
        },

        /**
         * @name setProxyListener
         * @desc 设置DOM事件代理，统一由自定义事件分发
         * @grammar view.setProxyListener(['click', ['click', 'mouseout',...]])// {String|Array} 事件类型（数组）
         */
        setProxyListener: function(events){
            var me=this,
                utils = ui.Utils;

            if(utils.isArray(events)){
                for(var i= 0,len=events.length; i<len;)
                    arguments.callee.call(me, events[i++]);
            }else if(events){
                if(utils.indexOf(me.proxyed || [], events) === -1){
                    utils.on(me.dom, events, function(e){
                        me.dom.className.indexOf('disabled')===-1 && me.fireEvent(events, e);
                    });
                }
            }
        },

        getIntrState: function(type){
            var allow = {
                    mouseover: 'hover',
                    mousedown: 'active',
                    disabled: 'disabled',
                    checked: 'checked'
                };

            return allow[type] ? this.getViewType() + '-' + allow[type] : false;
        },

        /**
         * @name startReflectByMouse
         * @desc 设定tool根据鼠标操作反射样式
         * @grammar view.startReflectByMouse(['mousedown',['mousedown', 'mouseup']]) //可选指定的监听操作，默认['mouseover', 'mouseout', 'mousedown', 'mouseup']
         */
        startReflectByMouse: function(evts){
            var me = this,
                tarmap = {mousedown: 1, mouseup: 1}, //mousedown和mouseup没有relateTarget
                srcmap = {mouseover: 'fromElement', mouseout: 'toElement'};//mouseover和mouseout在IE下不同的元素获取key

            evts = evts || ['mouseover', 'mouseout', 'mousedown', 'mouseup'];
            me.setProxyListener(['mouseover','mouseout','mousedown','mouseup']);
            me.state = me.STATE.DEFAULT;
            me.allStateClas = me.allStateClas || []; //维护所有附加样式的队列,根据鼠标操作和状态反射添加或移除

            evts = (utils.isArray(evts)?evts:[evts]);
            utils.each(evts, function(i, v){
                var tar=v in tarmap ? 'target' : 'relatedTarget',
                    src=v in srcmap ? srcmap[v] : 'srcElement';

                me.addListener(v, function(t, e){
                    var clas,
                        allclas = me.allStateClas,
                        ele = e[tar] || e[src],
                        dom = me.dom;

                    if(me.state==me.STATE.DEFAULT){ //只在默认状态下根据鼠标操作改变样式
                        if(tar!=='relatedTarget' || (!utils.isContains(dom, ele))){
                            if(clas=me.getIntrState(v)){
                                me.addClass(clas) && allclas.push(clas);
                            }
                            else{
                                if(v==='mouseup'){
                                    clas = me.getIntrState('mousedown');
                                    me.removeClass(clas);
                                    utils.removeItem(allclas, clas);
                                }else{
                                    me.removeClass(allclas);
                                    me.allStateClas = [];
                                }
                            }

                        }
                    }
                    utils.preventDefault(e);
                    allclas = ele = dom = null;
                });

            });
        },

        reflectState: function(state){
            var clas,
                allsta = this.allStateClas || [],
                stamap = {'1': 'checked', '-1': 'disabled'};

            /**
             * 默认，选中，不可用三个状态互斥存在
             * querycommand触发改变时候需清除原有状态样式，然后设置对应状态样式
             */
            this.removeClass(allsta);
            allsta = this.allStateClas = [];
            typeof state === 'boolean' && (state=state?1:0);
            if(state in stamap){
                clas = this.getIntrState(stamap[state]);
                this.addClass(clas)&&allsta.push(clas);
            }
        },

        /**
         * @name getInnerDom
         * @desc 获取含有模板的内部元素的dom引用
         * @grammar dom = view.getInnerDom('content') //返回的是模板中以"{ID}-content"为id的元素
         */
        getInnerDom: function(suffix){
            return suffix?document.getElementById(this.dom.id+'-'+suffix):this.dom;
        },

        destroy: function(){
            if(!this.dom)
                return;
            var dom = this.dom,
                parent = dom.parentElement;
            parent && parent.removeChild(dom);
            dom = this.dom = null;
            this.fireEvent("destroy");
        }


    };

    ui.Utils.inherits(view, ui.UE_Event);
    view = null;
})(UE.ui);