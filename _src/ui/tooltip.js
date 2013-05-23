/*tooltip 类*/
UE.ui.define('tooltip', {
    tpl: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options || {})));
    },
    content: function (e) {
        var me = this,
            title = $(e.currentTarget).attr("data-original-title");

        me.root().find('.tooltip-inner')['text'](title);
    },
    position: function (e) {
        var me = this,
            $obj = $(e.currentTarget);

        me.root().css($.extend({display: 'block'}, $obj ? {
            top: $obj.offset().top + $obj.outerHeight(),
            left: $obj.offset().left + (($obj.outerWidth() - me.root().outerWidth()) / 2)
        } : {}))
    },
    show: function (e) {
        var me = this;
        me.content(e);
        me.position(e);
        me.root().addClass("in bottom")
    },
    hide: function () {
        var me = this;
        me.root().removeClass("in bottom")
    },
    attachTo: function ($obj) {
        var me = this;

        function tmp($obj) {
            var me = this;

            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo(document.body);
            }

            me.data('tooltip', me.root());

            $obj.each(function () {
                if ($(this).attr("data-original-title")) {
                    $(this).on('mouseenter', $.proxy(me.show, me))
                        .on('mouseleave', $.proxy(me.hide, me));
                }
            });

        }

        if ($.type($obj) === "undefined") {
            $obj = $("button[data-original-title]");
            tmp.call(me, $obj);
        } else {
            if (!$obj.data('tooltip')) {
                tmp.call(me, $obj);
            }
        }
    }
});
