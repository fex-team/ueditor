(function(){
    var current_mode = 'select';
    var current_zoom=1;
    var svgcontent;
    var selectedElements=[];
    var started=false;
    var root_sctm,start_x,start_y;

    var selectOnly  = function(elems, showGrips) {
        clearSelection(true);
        addToSelection(elems, showGrips);
    };

    var clearSelection = this.clearSelection = function(noCall) {
        if (selectedElements[0] != null) {
            var len = selectedElements.length;
            for (var i = 0; i < len; ++i) {
                var elem = selectedElements[i];
                if (elem == null) break;
                selectorManager.releaseSelector(elem);
                selectedElements[i] = null;
            }
        }
        if(!noCall) call("selected", selectedElements);
    };

    var addToSelection = this.addToSelection = function(elemsToAdd, showGrips) {
        if (elemsToAdd.length == 0) { return; }
        // find the first null in our selectedElements array
        var j = 0;

        while (j < selectedElements.length) {
            if (selectedElements[j] == null) {
                break;
            }
            ++j;
        }

        // now add each element consecutively
        var i = elemsToAdd.length;
        while (i--) {
            var elem = elemsToAdd[i];
            if (!elem || !svgedit.utilities.getBBox(elem)) continue;

            if(elem.tagName === 'a' && elem.childNodes.length === 1) {
                // Make "a" element's child be the selected element
                elem = elem.firstChild;
            }

            // if it's not already there, add it
            if (selectedElements.indexOf(elem) == -1) {

                selectedElements[j] = elem;

                // only the first selectedBBoxes element is ever used in the codebase these days
//			if (j == 0) selectedBBoxes[0] = svgedit.utilities.getBBox(elem);
                j++;
                var sel = selectorManager.requestSelector(elem);

                if (selectedElements.length > 1) {
                    sel.showGrips(false);
                }
            }
        }
        call("selected", selectedElements);

        if (showGrips || selectedElements.length == 1) {
            selectorManager.requestSelector(selectedElements[0]).showGrips(true);
        }
        else {
            selectorManager.requestSelector(selectedElements[0]).showGrips(false);
        }

        // make sure the elements are in the correct order
        // See: http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition

        selectedElements.sort(function(a,b) {
            if(a && b && a.compareDocumentPosition) {
                return 3 - (b.compareDocumentPosition(a) & 6);
            } else if(a == null) {
                return 1;
            }
        });

        // Make sure first elements are not null
        while(selectedElements[0] == null) selectedElements.shift(0);
    };

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

            var pt = UG.Math.transformPoint(evt.pageX, evt.pageY, root_sctm),
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

        mouseMove: function (evt) {
            if (!started) return;
            var selected = selectedElements[0],
                pt = UG.Math.transformPoint( evt.pageX, evt.pageY, root_sctm ),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom,
                shape = selected;

            var real_x = x = mouse_x / current_zoom;
            var real_y = y = mouse_y / current_zoom;

            evt.preventDefault();

            switch(current_mode){
                case "rect":
                    var square = (current_mode == 'square') || evt.shiftKey,
                        w = Math.abs(x - start_x),
                        h = Math.abs(y - start_y),
                        new_x, new_y;

                    if(square) {
                        w = h = Math.max(w, h);
                        new_x = start_x < x ? start_x : start_x - w;
                        new_y = start_y < y ? start_y : start_y - h;
                    } else {
                        new_x = Math.min(start_x,x);
                        new_y = Math.min(start_y,y);
                    }

                    shape.attr({
                        'width': w,
                        'height': h,
                        'x': new_x,
                        'y': new_y
                    });
                    break;
            }
        },

        mouseUp: function (evt) {
            var pt = UG.Math.transformPoint( evt.pageX, evt.pageY, root_sctm ),
                mouse_x = pt.x * current_zoom,
                mouse_y = pt.y * current_zoom,
                x = mouse_x / current_zoom,
                y = mouse_y / current_zoom,
                element = selectedElements[0],
                keep = false;

            var real_x = x;
            var real_y = y;

            var useUnit = false; // (curConfig.baseUnit !== 'px');
            started = false;

            switch (current_mode){
                case "rect":
                    var attrs =element.attr(["width", "height"]);
                    keep = (attrs.width != 0 || attrs.height != 0) || current_mode === "image";
                    break;
            }

            if(!keep && element != null){

            }else if(element!=null){
                setTimeout(function(){
                    selectOnly([element],true);
                },1000)
            }
        },

        click: function () {

        },

        dblClick: function () {

        }
    };


})();

