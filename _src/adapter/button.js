UE.registerUI('bold italic redo undo source underline strikethrough superscript subscript ' +
    'pagebreak deletetable insertrow deleterow removeformat cleardoc selectall formatmatch pasteplain ' +
    'insertparagraphbeforetable insertrow deleterow insertcol deletecol mergecells mergeright mergedown splittocells ' +
    'splittorows splittocols unlink date time horizontal blockquote indent touppercase tolowercase snapscreen print preview',
    function(name) {
        var me = this;
        var $btn = $.eduibutton({
            icon : name,
            click : function(){
                debugger
                me.execCommand(name)
            }
        });
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState();
            $btn.disabled(state == -1).active(state == 1)
        });

        return $btn;
    }
);

