//elementpath 类
UE.ui.define('elementpath',{
    tmpl:'<ul class="edui-elementpath"><%for(var i=0,ci;ci=data[i++];){%><li><a href="#"><%=ci.label%></a><%if(data[i]){%><span class="divider">/</span><%}%></li><%}%></ul>',
    default:{
        data:[]
    },
    init : function(options){
        this.root($($.parseTmpl(this.tmpl, options)))
    },
    data : function(path){
        var me = this;
        if(path === undefined){
            return this.me().find('a');
        }else{
            var data = [];
            $.each(path.reverse(),function(i,el){
                var $item = $('<li><a href="#">'+el.tagName+'</a>'+(path.length-1 == i ? '' : '<span class="divider">/</span>')+'</li>');
                $item.find('a').data('ref-element',$(el));
                data.push($item)
            });
            me.root().html('');
            $.each(data,function(i,$el){
                me.root().append($el)
            })

        }
    }
});