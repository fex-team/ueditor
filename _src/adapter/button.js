UE.registerUI('bold italic redo undo source underline strikethrough superscript subscript ' +
    'pagebreak deletetable insertrow deleterow removeformat cleardoc selectall formatmatch pasteplain ' +
    'insertparagraphbeforetable insertrow deleterow insertcol deletecol mergecells mergeright mergedown splittocells ' +
    'splittorows splittocols unlink date time horizontal blockquote indent touppercase tolowercase snapscreen print preview justifyleft justifycenter justifyright justifyjustify',
    function(name) {

        var me = this;
        var $btn = $.eduibutton({
            icon : name,
            click : function(){
                //排版定制
                if(/^justify/.test(name)){
                    var para = name.replace(/^justify/);
                    name = 'justify'
                }
                me.execCommand(name,para)
            },
            title: this.getLang('labelMap')[name] || ''
        });

        this.addListener('selectionchange',function(){
            //排版定制
            if(/^justify/.test(name)){
                var para = name.replace(/^justify/);
                name = 'justify'
            }
            var state = this.queryCommandState(name,para);
            $btn.edui().disabled(state == -1).active(state == 1)
        });
        return $btn;
    }
);

