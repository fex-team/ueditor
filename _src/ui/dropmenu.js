//button 类
UE.ui.define('dropmenu',{
    tpl : '<a class="dropdown-toggle" data-toggle="dropdown" href="#">{{title}}<span class="caret"></span></a>' +
        '<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" >' +
            '{{list}}<li class="{{active}}" data-value="{{value}}"><a href="#" tabindex="-1" >{{text}}</a></li>{{/list}}</ul>',
    init : function(options){
        var me = this,
            html = utils.parseTmpl(this.tpl,options,function(data,cont){
                if(utils.isString(data)){
                    cont.push('<li class="divider"></li>');
                    return true;
                }
            }),
            $root = this.root($(html));
        options.click && $root.children('li[class!="divider disabled dropdown-submenu"]').click(function(evt){
            options.click.call(me,evt)
        })
    },
    disabled : function(cb){
        this.root().children('li[class!=divider]').each(function(){
            var $el = $(this);
            if(cb === true){
                $el.addClass('disabled')
            }else if(utils.isFunction(cb)){
                $el.toggleClass('disabled',cb(li))
            }else{
                $el.removeClass('disabled')
            }

        });
        return this;
    },
    val:function(val){
        var currentVal;
        this.root().children('li[class!=divider]').each(function(){
            var $el = $(this);
            if(val === undefined){
                if($el.hasClass('active')){
                    currentVal =  $el.data('value');
                    return false
                }
            }else{
                $el.toggleClass('active',$el.data('value') == val)
            }

        });
        if(val === undefined){
            return currentVal
        }
        return this;
    },
    addSubmenu:function(menu,index){
        index = index || 0;
        this.root().children('li[class!=divider]').each(function(i,l){
            if(index == i){
                $('<li class="dropdown-submenu"></li>').append(menu.root()).insertBefore($(l));
                return false;
            }
        });

        if(!menu.root().parent()){
            $('<li class="dropdown-submenu"></li>').append(menu.root()).insertAfter(this.root().children(':last'));
        }
        return menu;
    }
});