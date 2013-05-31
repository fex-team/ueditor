UE.registerUI('elementpath',
    function() {
        var me = this,$elementpath = $.eduielementpath();
        $elementpath.delegate('a','click',function(){
            var rng = me.selection.getRange();
            rng.selectNode($(this).data('ref-element')[0]).select()
        });
        me.addListener('selectionchange',function(){
            var path = me.selection.getStartElementPath();
            $elementpath.edui().data(path)
        });
        return $elementpath;
    }
);

