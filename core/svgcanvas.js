(function () {
    var current_mode = 'select';
    var current_zoom = 1;
    var paper;
    var selected;
    var started = false;
    var root_sctm, start_x, start_y;


    var SvgCanvas = UG.SvgCanvas = function (opt) {
        var me = this;

        $("#" + opt.containerID).mousedown(me.mouseDown)
            .mousemove(me.mouseMove)
            .click(me.click)
            .dblclick(me.dblClick)
            .mouseup(me.mouseUp);

        paper = Raphael(opt.containerID, opt.initialWidth, opt.initialHeight);

    };

    SvgCanvas.prototype = {
        setMode: function (name) {
            current_mode = name;
        },
        getMode: function () {
            return current_mode;
        },

        mouseDown: function (evt) {
            root_sctm = paper.canvas.getScreenCTM().inverse();

            var pt = UG.Math.transformPoint(evt.pageX, evt.pageY, root_sctm),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom;

            evt.preventDefault();

            var x = mouse_x / current_zoom,
                y = mouse_y / current_zoom;


            switch (current_mode) {
                case "rect":
                    started = true;
                    start_x = x;
                    start_y = y;
                    selected = paper.rect().attr({
                        "x": x,
                        "y": y,
                        "width": 0,
                        "height": 0
                    });

                    break;
            }
        },

        mouseMove: function (evt) {
            if (!started) return;
            var pt = UG.Math.transformPoint(evt.pageX, evt.pageY, root_sctm),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom;

            var x = mouse_x / current_zoom;
            var y = mouse_y / current_zoom;

            evt.preventDefault();

            switch (current_mode) {
                case "rect":
                    var w = Math.abs(x - start_x),
                        h = Math.abs(y - start_y),
                        new_x, new_y;


                    new_x = Math.min(start_x, x);
                    new_y = Math.min(start_y, y);

                    selected.attr({
                        'width': w,
                        'height': h,
                        'x': new_x,
                        'y': new_y
                    });
                    break;
            }
        },

        mouseUp: function (evt) {
            var keep = false;


            started = false;

            switch (current_mode) {
                case "rect":
                    var attrs = selected.attr(["width", "height"]);
                    keep = (attrs.width != 0 || attrs.height != 0) || current_mode === "image";
                    break;
            }

            if (!keep && selected != null) {

            } else if (selected != null) {
                setTimeout(function () {
                }, 1000)
            }
        },

        click: function () {

        },

        dblClick: function () {

        }
    };


})();

