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
            return $($.parseTmpl(this.textmenutpl,{'label':label}))
        },
        appendToTextmenu : function($item){
           this.data('$txtToolbar').append($item);
            return $item;
        },
        appendToTxt: function (label, menu) {
            var data = [];
            if ($.type(label) == 'string') {
                data.push({
                    'label': label,
                    'menu': menu
                })
            } else {
                data = label;
            }
            var me = this;
            $.each(data, function (i, obj) {
                var $label = $($.parseTmpl(me.textmenutpl, obj));
                obj.menu.eduidropmenu('attachTo', $label.find('a'));
                me.data('txtToolbar').append($label);
            })
        },
        delFromTxt: function() {

        },
        appendToBtn: function(data) {
            var me = this,$cont = me.data('btnToolbar');
            if($.isArray(data)){
                $.each(data,function(i,group){
                    var $groupcont = $(me.btngrouptpl);
                    $.each(group,function(i,btn){
                        if(btn.edui().widgetName == 'button'){
                            $groupcont.append(btn)
                        }else{
                            $groupcont = btn;
                            return false;
                        }
                    });
                    $cont.append($groupcont)
                })
            }else{
                if(data.edui().widgetName == 'button'){
                    data = $(me.btngrouptpl).append(data)
                }
                $cont.append(data)
            }
        },
        appendToState: function () {

        }
    });
})();
