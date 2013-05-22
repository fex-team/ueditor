/*tooltip 类*/
UE.ui.define('tooltip', {
    tpl: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    default: {
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options || {})));
    },
    setContent: function () {
        var me = this;
        var $obj = me.root().data("target");
        if (!me.root().data("title")) {
            me.root().data("title", $obj.attr("data-original-title"));
        }

        me.root().find('.tooltip-inner')['text'](me.root().data("title"))
    },
    setPos: function () {
        var me = this;
        var $obj = me.root().data("target");

        me.root().css($.extend({display: 'block'}, $obj ? {
            top: $obj.offset().top + $obj.outerHeight(),
            left: $obj.offset().left + (($obj.outerWidth() - me.root().outerWidth()) / 2)
        } : {}))
    },
    show: function () {
        var me = this;
        me.setContent();
        me.setPos();
        me.root().addClass("in bottom")
    },
    hide: function () {
        var me = this;
        me.root().removeClass("in bottom")
    },
    attachTo: function ($obj) {
        var me = this;

        if (!$obj.data('tooltip')) {
            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo(document.body);
            }

            $obj.each(function () {
                this.data('tooltip', me.root());
                this.on('mouseenter', $.proxy(this.show, this))
                    .on('mouseleave', $.proxy(this.hide, this));

                me.root().data("target", $obj);
            });

        }

        if($.type($obj) === "string"){
            $obj = $($obj);

            $obj.each(function () {
                this.data('tooltip', me.root());
                this.on('mouseenter', $.proxy(this.show, this))
                    .on('mouseleave', $.proxy(this.hide, this));

                me.root().data("target", param);
            });
        }

    }
});
