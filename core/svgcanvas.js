(function(){
    var Math=UG.Math;
    var current_mode = 'select';
    var current_zoom=1;
    var svgcontent;
    var selectedElements=[];
    var started=false;
    var root_sctm;

    var SvgCanvas = UG.SvgCanvas = function (opt) {
        var me=this;

        $("#"+opt.containerID).mousedown(me.mouseDown)
            .mousemove(me.mouseMove)
            .click(me.click)
            .dblclick(me.dblClick)
            .mouseup(me.mouseUp);

        svgcontent=Raphael(opt.containerID,opt.initialWidth,opt.initialHeight);

    };

    SvgCanvas.prototype = {
        setMode: function (name) {
            current_mode = name;
        },
        getMode: function () {
            return current_mode;
        },

        mouseDown: function (evt) {
            root_sctm=svgcontent.canvas.getScreenCTM().inverse();

            var pt = Math.transformPoint(evt.pageX, evt.pageY, root_sctm),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom;

            evt.preventDefault();

            var x = mouse_x / current_zoom,
                y = mouse_y / current_zoom,
                mouse_target=evt.target;


            switch (current_mode){
                case "rect":
                    started = true;
                    start_x = x;
                    start_y = y;
                    var ele=svgcontent.rect().attr({
                        "x": x,
                        "y": y,
                        "width": 0,
                        "height": 0
                    });
                    selectedElements.push(ele);

                    break;
            }
        },

        mouseMove: function () {
            if (!started) return;
            var selected = selectedElements[0],
                pt = transformPoint( evt.pageX, evt.pageY, root_sctm ),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom,
                shape = selected;

            var real_x = x = mouse_x / current_zoom;
            var real_y = y = mouse_y / current_zoom;
        },

        mouseUp: function () {

        },

        click: function () {

        },

        dblClick: function () {

        }
    };
})();

