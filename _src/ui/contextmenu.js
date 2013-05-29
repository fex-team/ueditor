//dropmenu 类
UE.ui.define('contextmenu',{
    tmpl:'<a tabindex="-1" href="#"><em><%if(icon){%><i class="icon-<%=icon%>"></i><%}%></em><%=label%><%if(shortkey){%><span class="muted item-right"><%=shortkey%><%}%></span></a>',
    defaultItem:{
        icon:'',
        label:'',
        shortkey:''
    },
    init : function(data){
        var me = this;
        var $root = this.root($('<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" ></ul>'));

        $.each(data,function(i,v){
            if(v.divider){
                $root.append($('<li class="divider"></li>'));
            }else{
                if(v.data){
                    $('<li class="dropdown-submenu"><a tabindex="-1" href="#">'+ v.label+'</a></li>').appendTo($root).data('submenu-data', v.data);
                }else{
                    $('<li>'+ $.parseTmpl(me.tmpl, $.extend2(v,me.defaultItem,true)) +'</li>').appendTo($root).data('exec', v.exec).data('query', v.query);
                }

            }
        });
        $root.children('li').mouseover(function(){
            var $this = $(this);
            if($this.hasClass('dropdown-submenu')){
                var subdata = $this.data('submenu-data');

                if(subdata){
                    $this.data('submenu-data','').data('submenu',$.eduicontextmenu(subdata).appendTo($root));
                }
                var $submenu = $this.data('submenu');
                $submenu.edui().show($this,'right','position',3,2);
                $root.data('activesubmenu',$submenu);
            }else{
                var sub = $root.data('activesubmenu');
                if(sub)
                    sub.edui().hide();
            }
        });
        me.register('mouseover',$root,function(){
            var sub = $root.data('activesubmenu');
            if(sub){
                sub.edui().hide()
            }
        });
        $root.children('li[class!="disabled divider dropdown-submenu"]').click(function(){
            var $this = $(this);
            $this.data('exec')($this);
        });
        this.on('beforeshow',function(){
            this.root().children('li[class!="divider dropdown-submenu"]').each(function(i,li){
                var query = $(li).data('query');
                $(li)[query && query($(li)) == -1 ?'addClass':'removeClass']('disabled');
            })
        })
    }
},'menu');