UE.registerUI('message', function(editor) {

    var uiUtils = baidu.editor.ui.uiUtils;
    var editorui = baidu.editor.ui;
    var Message = editorui.Message;
    var holder;
    var _messageItems = [];
    var me = editor;

    me.addListener('ready', function(){
        holder = document.getElementById(me.ui.id + '_message_holder');
        updateHolderPos();
    });

    me.addListener('showmessage', function(type, opt){
        var message = new Message({
                'timeout': opt.timeout,
                'type': opt.info,
                'title': opt.title,
                'keepshow': opt.keepshow,
                'editor': me
            }),
            mid = opt.id || ('msg_' + (+new Date()).toString(36));
        message.render(holder);
        _messageItems[mid] = message;
        message.reset(opt);
        setTimeout(function(){
            updateHolderPos();
        }, 300);
        return mid;
    });

    me.addListener('updatemessage',function(type, id, opt){
        var message = _messageItems[id];
        message && message.reset(opt);
    });

    me.addListener('hidemessage',function(type, id, opt){
        var message = _messageItems[id];
        message && message.hide();
    });

    function updateHolderPos(){
        var toolbarbox = me.ui.getDom('toolbarbox');
        if (toolbarbox) {
            holder.style.top = toolbarbox.offsetHeight + 3 + 'px';
        }
        holder.style.zIndex = Math.max(me.options.zIndex, me.iframe.style.zIndex) + 1;
    }

});
