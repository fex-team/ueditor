(function(){
    var Editor=UG.Editor=function(id,wt,ht){
        var me=this;
        me.options={};
        me.options={
            containerID:id,
            initialWidth:wt,
            initialHeight:ht
        };
        me.init();
    };
    Editor.prototype={
        init:function(){
            var me=this;
            var opt=me.options;
            var svgCanvas=new UG.SvgCanvas(opt);


            $("#toolbar").click(function(e){
                var tgt= e.target;
                var mode=$(tgt).attr("data-type");
                svgCanvas.setMode(mode);
            });

        }
    };
})();
