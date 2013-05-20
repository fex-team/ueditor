//dropmenu 类
UE.ui.define('dropmenu',{
    tmpl:'<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" >' +
            '<%for(var i=0,ci;ci=data[i++];){%>'+
                '<%if(ci.divider){%><li class="divider"></li><%}else{%>' +
                '<li <%if(ci.active||ci.disabled){%>class="<%= ci.active|| \'\' %> <%=ci.disabled||\'\' %>" <%}%> data-value="<%= ci.value%>">' +
                    '<a href="#" tabindex="-1" ><%= ci.label%></a>' +
                '</li><%}%>' +
            '<%}%>' +
        '</ul>',
    default:{
        data:[],
        click:function(){}
    },

    init : function(options){
        var me = this;
        this.root($($.parseTmpl(this.tmpl, options))).on('click','li[class!="disabled divider dropdown-submenu"]',function(evt){
            $.proxy(options.click,me,evt,$(this).data('value'),$(this))()
        })

    },
    show : function($obj){
        this.root().css($.extend({display:'block'},$obj ? {
            top : $obj.offset().top + $obj.outerHeight(),
            left : $obj.offset().left
        }:{}))
    },
    hide : function(){
        this.root().css('display','none');
    },
    disabled : function(cb){
        $('ul > li[class!=divider]',this.root()).each(function(){
            var $el = $(this);
            if(cb === true){
                $el.addClass('disabled')
            }else if($.isFunction(cb)){
                $el.toggleClass('disabled',cb(li))
            }else{
                $el.removeClass('disabled')
            }

        });
    },
    val:function(val){
        var currentVal;
        $('ul > li[class!=divider disabled dropdown-submenu]',this.root()).each(function(){
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
    },
    attachTo : function($obj){
        var me = this;
        if(!$obj.data('dropmenu')){
            if(!$.contains(document.body,me.root()[0])){
                me.root().appendTo(document.body);
            }
            $obj.data('dropmenu',me.root());
            $obj.on('click',function(evt){
                if($obj.trigger('beforeclick') === false){
                    return;
                }
                me.show($obj)
            });
            me.register('click',$obj,function(evt){
               me.hide()
            })
        }
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