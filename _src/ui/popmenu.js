/**
 * @file
 * @name ui.View.Menu
 * @import ui/ui.view.pop.js
 * @desc 点击按钮展现菜单的实现类
 */

(function(ui){
    var utils = ui.Utils,
        views = ui.View,
        /**
         * @name ui.View.Menu
         * @grammar menu = new ui.View.Menu(ui, cmd)
         */
        menu = views.Menu = function(ui, cmd){
            var renderhtml,
                method = 'setItems' + cmd;

            this.menuitems = [];

            renderhtml = (method in this ? this[method] : this.setItems).apply(this, arguments) ;

            this.init({viewHtmlTag:'ul', viewText: renderhtml});
            this.addClass(cmd+'popup')

        };

    menu.prototype = {
        setItems: function(ui, cmd){
            var frag = document.createDocumentFragment(),
                opt = ui.getEditorOptions(cmd),
                lang = ui.getLang(cmd);

            if(utils.isObject(opt)){ //handle key=>value
                for(var tmp in opt){
                    frag.appendChild(this.addItem(opt[tmp]||lang[tmp], tmp));
                }
            }else{// handle number
                for(var i= 0,len=opt.length; i<len;){
                    frag.appendChild(this.addItem(opt[i++]));
                }
            }

            return frag;
        },
        setItemsfontsize: function(ui, cmd){
            var opt = ui.getEditorOptions(cmd),
                frag = document.createDocumentFragment(),
                tmp;

            for(var i= 0,len=opt.length; i<len;){
                tmp = opt[i++]+'px';
                frag.appendChild(this.addItem('<span style="font-size:'+tmp+'">'+tmp+'</span>', tmp));
            }

            return frag;
        },
        setItemsfontfamily: function(ui, cmd){
            var opt = ui.getEditorOptions(cmd),
                lang = ui.getLang(cmd),
                frag = document.createDocumentFragment(),
                tmp, text, val, name;

            for(var i= 0,len=opt.length; i<len;){
                tmp = opt[i++];
                name = tmp.name;
                text = lang[name];
                val = tmp.val;
                frag.appendChild(this.addItem('<span style="font-family:' + val + '">' + text + '</span>', val));
            }

            return frag;
        },
        setItemsparagraph: function(ui, cmd){
            var opt = ui.getEditorOptions(cmd),
                lang = ui.getLang(cmd),
                frag = document.createDocumentFragment(),
                text;

            for(var it in opt){
                text = opt[it] || lang[it];
                frag.appendChild(this.addItem('<span class="edui-tag-'+it+'">'+text+'</span>', it));
            }

            return frag;
        },
        setItemscustomstyle: function(ui, cmd){
            var opt = ui.getEditorOptions(cmd),
                lang = ui.getLang(cmd),
                frag = document.createDocumentFragment(),
                text, tmp, style, tag, name;

            for(var i= 0,len=opt.length; i<len;){
                tmp = opt[i++];
                name = tmp.name;
                text = tmp.label || lang[name];
                tag = tmp.tag || lang[name].tag;
                style = tmp.style || lang[name].style;
                frag.appendChild(this.addItem('<span style="' + style + '">' + text + '</span>', {'label':text, 'tag':tag, 'style':style}));
            }

            return frag;
        },
        addItem: function(text, value){
            var me = this,
                item = new views({viewType:'menuitem', viewHtmlTag:'li', viewText: text});

            item.cmdValue = value || text;
            item.setProxyListener('click');
            item.startReflectByMouse();
            item.addListener('click', function(){
                me.hide();
                me.fireEvent('select', item.cmdValue);
            });
            this.menuitems.push(item);

            return item.dom;
        },
        setValue: function(val){
            var tmp,
                allitems = this.menuitems,
                item  = this.checkedItem;

            if(item){
                if(item.cmdValue===val) return;
                item.removeClass('item-checked');
            }

            for(var i= 0,len=allitems.length; i<len;){
                tmp = allitems[i++];
                if(tmp.cmdValue==val){
                    tmp.addClass('item-checked');
                    this.checkedItem = tmp;
                    return;
                }
            }
        },
        getTextByValue: function(value){
            var i, temp,
                allitems = this.menuitems,
                len = allitems.length;

            for(i=0; i<len;){
                temp = allitems[i].dom;
                if(allitems[i++].cmdValue===value) return temp.innerText||temp.textContent;
            }
            return '';
        }
    };

    utils.inherits(menu, views.Pop);
    menu = null;
})(UE.ui);
