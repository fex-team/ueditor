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
        var eventName = {
            click:1,
            mouseover:1,
            mouseout:1
        };
        this.root($($.parseTmpl(this.tmpl, options))).on('click','li[class!="disabled divider dropdown-submenu"]',function(evt){
            $.proxy(options.click,me,evt,$(this).data('value'),$(this))()
        }).find('li').each(function(i,el){
                var $this = $(this);
                if(!$this.hasClass("disabled divider dropdown-submenu")){
                    var data = options.data[i];
                    $.each(eventName,function(k){
                        data[k] &&   $this[k](function(evt){
                            $.proxy(data[k],el)(evt,data,me.root)
                        })
                    })
                }
            })

    },
    show : function($obj){
        if(this.trigger('beforeshow') === false){
            return;
        }else{
            this.root().css($.extend({display:'block'},$obj ? {
                top : $obj.offset().top + $obj.outerHeight(),
                left : $obj.offset().left
            }:{}))
        }
    },
    hide : function(){
        this.root().css('display','none');
    },
    disabled : function(cb){
        $('li[class!=divider]',this.root()).each(function(){
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
        $('li[class!="divider disabled dropdown-submenu"]',this.root()).each(function(){
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
        var me = this
        if(!$obj.data('$mergeObj')){
            if(!$.contains(document.body,me.root()[0])){
                me.root().appendTo(document.body);
            }
            $obj.data('$mergeObj',me.root());
            $obj.on('click',function(evt){
                me.show($obj)
            });
            me.register('click',$obj,function(evt){
               me.hide()
            });
            me.data('$mergeObj',$obj)
        }
    },
    addSubmenu:function(label,menu,index){
        index = index || 0;
        $('li[class!=divider]',this.root()).each(function(i,l){
            if(index == i){
                $('<li class="dropdown-submenu"><a tabindex="-1" href="#">'+label+'</a></li>').append(menu).insertBefore($(l));
                return false;
            }
        });
    }
});