//dropmenu 类
UE.ui.define('dropmenu',{
    menu:'<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" >' +
            '{{list}}<li class="{{active}} {{disabled}}" data-value="{{value}}"><a href="#" tabindex="-1" >{{text}}</a></li>{{/list}}' +
        '</ul>',

    init : function(options){
        var html = utils.parseTmpl(this.menu,options,function(data,cont){
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
        $('ul > li[class!=divider]',this.root()).each(function(){
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

        $('ul > li[class!=divider]',this.root()).each(function(){
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
        $('ul > li[class!=divider]',this.root()).each(function(i,l){
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