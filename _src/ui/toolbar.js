//toolbar 类
(function () {
    UE.ui.define('toolbar', {
        tpl: '<div class="toolbar"><div class="text-toolbar">' +
            '<div class="navbar-inner">' +
            '<ul class="nav nav-pills">' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '<div class="btn-toolbar"></div></div>'
          ,
        textmenutpl: '<li class="dropdown"><a href="#" class="dropdown-toggle"><%=label%></a></li>',
        btngrouptpl:'<div class="btn-group"></div>',
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$txtToolbar', $root.find('.nav-pills'))
                .data('$btnToolbar', $root.find('.btn-toolbar'))

        },
        createTextItem : function(label){

            return $($.parseTmpl(this.textmenutpl,{'label':label})).click(function(){
                $(this).trigger('wrapclick')
            })
        },
        appendToTextmenu : function($item){
           this.data('$txtToolbar').append($item);
            return $item;
        },
        appendToBtnmenu : function(data){
            var me = this,$cont = me.data('$btnToolbar');
            var $groupcont = $(me.btngrouptpl);
            if(!$.isArray(data)){
                data = [data];
            }
            $.each(data,function(i,$btn){
                $groupcont.append($btn)
            });
            $cont.append($groupcont)
        }
    });
})();
