/*modal 类*/
UE.ui.define('modal', {
    default: {
        lang_title: "",
        lang_hideButton:"",
        lang_okButton:"",

        url: "",
        nook: false,
        backdrop: true,
        keyboard: true,
        show: false
    },
    init: function (options) {
        var me = this;

        me.root($(templates['modal'](options||{})));

        me.data("options", options);

        me.root().delegate('[data-hide="modal"]', 'click', $.proxy(me.hide, me));
        me.root().delegate('[data-ok="modal"]', 'click', $.proxy(me.ok, me));
    },
    toggle: function () {
        var me = this;
        return me[!me.data("isShown") ? 'show' : 'hide']();
    },
    show: function () {
        var me = this;

        me.trigger("show");

        if (me.data("isShown")) return;

        me.data("isShown", true);

        me.escape();

        me.backdrop(function () {
            me.root().show();
            me.root().addClass('in');
            me.root().focus().trigger('shown');
        })
    },
    hide: function () {
        var me = this;

        me.trigger("hide");

        if (!me.data("isShown")) return;

        me.data("isShown", false);

        me.escape();

        me.root().removeClass('in');

        me.hideModal();
    },
    escape: function () {
        var me = this;
        if (me.data("isShown") && me.data("options").keyboard) {
            me.root().on('keyup', function (e) {
                e.which == 27 && me.hide();
            })
        } else if (!me.data("isShown")) {
            me.root().off('keyup');
        }
    },
    hideModal: function () {
        var me = this;
        me.root().hide();
        me.backdrop(function () {
            me.removeBackdrop();
            me.trigger('hidden');
        })
    },
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    },
    backdrop: function (callback) {
        var me = this;
        if (me.data("isShown") && me.data("options").backdrop) {
            me.$backdrop = $('<div class="modal-backdrop" />')
                .appendTo(document.body);

            me.$backdrop.click(
                me.data("options").backdrop == 'static' ?
                    $.proxy(me.root()[0].focus, me.root()[0])
                    : $.proxy(me.hide, me)
            )

            me.$backdrop.addClass('in');

        } else if (!me.data("isShown") && me.$backdrop) {
            me.$backdrop.removeClass('in');
        }

        callback && callback();

    },
    attachTo: function ($obj) {
        var me = this
        if(!$obj.data('$mergeObj')){
            if(!$.contains(document.body,me.root()[0])){
                me.root().appendTo($obj);
            }
            $obj.data('$mergeObj',me.root());
            $obj.on('click',function(){
                me.toggle($obj)
            });
            me.data('$mergeObj',$obj)
        }
    },
    ok: function () {
        var me = this;
        me.trigger("ok");
        me.hide();
    }
});

