var selectorManager;
function SvgCanvas(c) {
    var rectsIntersect = function (r1, r2) {
        return r2.x < (r1.x + r1.width) &&
            (r2.x + r2.width) > r1.x &&
            r2.y < (r1.y + r1.height) &&
            (r2.y + r2.height) > r1.y;
    }

    var BatchCommand = function (text) {
        this.text = text || "Batch Command";
        this.stack = [];

        this.apply = function () {
            var len = this.stack.length;
            for (var i = 0; i < len; ++i) {
                this.stack[i].apply();
            }
        };

        this.unapply = function () {
            for (var i = this.stack.length - 1; i >= 0; i--) {
                this.stack[i].unapply();
            }
        };

        this.elements = function () {
            var elems = [];
            var cmd = this.stack.length;
            while (cmd--) {
                var thisElems = this.stack[cmd].elements();
                var elem = thisElems.length;
                while (elem--) {
                    if (elems.indexOf(thisElems[elem]) == -1) elems.push(thisElems[elem]);
                }
            }
            return elems;
        };

        this.addSubCommand = function (cmd) {
            this.stack.push(cmd);
        };

        this.isEmpty = function () {
            return this.stack.length == 0;
        };
    };

    var cleanupElement = function (element) {
        var handle = svgroot.suspendRedraw(60);
        if (element.getAttribute('fill-opacity') == '1')
            element.removeAttribute('fill-opacity');
        if (element.getAttribute('opacity') == '1')
            element.removeAttribute('opacity');
        if (element.getAttribute('stroke') == 'none')
            element.removeAttribute('stroke');
        if (element.getAttribute('stroke-dasharray') == 'none')
            element.removeAttribute('stroke-dasharray');
        if (element.getAttribute('stroke-opacity') == '1')
            element.removeAttribute('stroke-opacity');
        if (element.getAttribute('stroke-width') == '1')
            element.removeAttribute('stroke-width');
        if (element.getAttribute('rx') == '0')
            element.removeAttribute('rx')
        if (element.getAttribute('ry') == '0')
            element.removeAttribute('ry')
        svgroot.unsuspendRedraw(handle);
    };

    SvgCanvas.addSvgElementFromJson = function (data) {
        return canvas.updateElementFromJson(data)
    };

    this.updateElementFromJson = function (data) {
        var shape = svgdoc.getElementById(data.attr.id);
        if (shape && data.element != shape.tagName) {
            svgroot.removeChild(shape);
            shape = null;
        }
        if (!shape) {
            shape = svgdoc.createElementNS(svgns, data.element);
            svgroot.appendChild(shape);
        }
        utils.assignAttributes(shape, data.attr, 100);
        cleanupElement(shape);
        return shape;
    };

    var canvas = this;
    var container = c;
    var svgns = "http://www.w3.org/2000/svg";

    var idprefix = "svg_";
    var svgdoc = c.ownerDocument;
    var svgroot = svgdoc.createElementNS(svgns, "svg");
    svgroot.setAttribute("width", 640);
    svgroot.setAttribute("height", 480);
    svgroot.setAttribute("id", "svgroot");
    svgroot.setAttribute("xmlns", svgns);
    container.appendChild(svgroot);

    var d_attr = null;
    var started = false;
    var obj_num = 1;
    var start_x = null;
    var start_y = null;
    var current_mode = "select";
    var current_resize_mode = "none";

    var all_properties = {
        shape: {
            fill: "#cfe2f3",
            fill_paint: null,
            fill_opacity: 1,
            stroke: "#000000",
            stroke_paint: null,
            stroke_opacity: 1,
            stroke_width: 5,
            stroke_style: 'none',
            opacity: 1
        }
    };

    all_properties.text = $.extend(true, {}, all_properties.shape);
    $.extend(all_properties.text, {
        fill: "#000000",
        stroke_width: 0,
        font_size: '12pt',
        font_family: 'serif'
    });

    var cur_shape = all_properties.shape;
    var cur_text = all_properties.text;
    var cur_properties = cur_shape;

    var freehand_min_x = null;
    var freehand_max_x = null;
    var freehand_min_y = null;
    var freehand_max_y = null;
    var current_poly = null;
    var current_poly_pts = [];
    var selectedElements = new Array(1);
    var selectedBBoxes = new Array(1);
    selectorManager = new SelectorManager();
    var rubberBox = null;
    var curBBoxes = [];

    var getIntersectionList = function (rect) {
        if (rubberBox == null) {
            return null;
        }

        if (!curBBoxes.length) {
            curBBoxes = canvas.getVisibleElements(true);
        }

        var resultList = null;
        try {
            resultList = svgroot.getIntersectionList(rect, null);
        } catch (e) {
        }

        if (resultList == null || typeof(resultList.item) != "function") {
            resultList = [];

            var rubberBBox = rubberBox.getBBox();
            var i = curBBoxes.length;
            while (i--) {
                if (rectsIntersect(rubberBBox, curBBoxes[i].bbox)) {
                    resultList.push(curBBoxes[i].elem);
                }
            }
        }

        return resultList;
    };

    var getId = function () {
        return idprefix + obj_num;
    };

    var getNextId = function () {
        var id = getId();
        while (svgdoc.getElementById(id)) {
            obj_num++;
            id = getId();
        }
        return id;
    };

    var recalculateAllSelectedDimensions = function () {
        var text = (current_resize_mode == "none" ? "position" : "size");
        var batchCmd = new BatchCommand(text);

        var i = selectedElements.length;
        while (i--) {
            var cmd = recalculateSelectedDimensions(i);
            if (cmd) {
                batchCmd.addSubCommand(cmd);
            }
        }


    };

    var pathMap = [ 0, 'z', 'm', 'm', 'l', 'l', 'c', 'c', 'q', 'q', 'a', 'a',
        'l', 'l', 'l', 'l',
        's', 's', 't', 't' ];

    var recalculateSelectedDimensions = function (i) {
        var selected = selectedElements[i];
        if (selected == null) return null;
        var selectedBBox = selectedBBoxes[i];
        var box = utils.getBBox(selected);

        if (box.x == selectedBBox.x && box.y == selectedBBox.y &&
            box.width == selectedBBox.width && box.height == selectedBBox.height) {
            return null;
        }


        var remap = function (x, y) {
            return {
                'x': parseInt(((x - box.x) / box.width) * selectedBBox.width + selectedBBox.x),
                'y': parseInt(((y - box.y) / box.height) * selectedBBox.height + selectedBBox.y)
            };
        };
        var scalew = function (w) {
            return parseInt(w * selectedBBox.width / box.width);
        }
        var scaleh = function (h) {
            return parseInt(h * selectedBBox.height / box.height);
        }

        var changes = {};

        var angle = utils.getRotationAngle(selected);
        var pointGripContainer = document.getElementById("polypointgrip_container");
        if (angle) {
            // this is our old center upon which we have rotated the shape
            var tr_x = parseInt(box.x + box.width / 2),
                tr_y = parseInt(box.y + box.height / 2);
            var cx = null, cy = null;

            var bFoundScale = false;
            var tlist = selected.transform.baseVal;
            var t = tlist.numberOfItems;
            while (t--) {
                var xform = tlist.getItem(t);
                if (xform.type == 3) {
                    bFoundScale = true;
                    break;
                }
            }

            // if this was a resize, find the new cx,cy
            if (bFoundScale) {
                var alpha = angle * Math.PI / 180.0;

                // rotate new opposite corners of bbox by angle at old center
                var dx = selectedBBox.x - tr_x,
                    dy = selectedBBox.y - tr_y,
                    r = Math.sqrt(dx * dx + dy * dy),
                    theta = Math.atan2(dy, dx) + alpha;
                var left = r * Math.cos(theta) + tr_x,
                    top = r * Math.sin(theta) + tr_y;

                dx += selectedBBox.width;
                dy += selectedBBox.height;
                r = Math.sqrt(dx * dx + dy * dy);
                theta = Math.atan2(dy, dx) + alpha;
                var right = r * Math.cos(theta) + tr_x,
                    bottom = r * Math.sin(theta) + tr_y;

                // now find mid-point of line between top-left and bottom-right to find new center
                cx = parseInt(left + (right - left) / 2);
                cy = parseInt(top + (bottom - top) / 2);

                // now that we know the center and the axis-aligned width/height, calculate the x,y
                selectedBBox.x = parseInt(cx - selectedBBox.width / 2),
                    selectedBBox.y = parseInt(cy - selectedBBox.height / 2);
            }
            // if it was not a resize, then it was a translation only
            else {
                var tx = selectedBBox.x - box.x,
                    ty = selectedBBox.y - box.y;
                cx = tr_x + tx;
                cy = tr_y + ty;
            }

            var rotate = ["rotate(", angle, " ", cx, ",", cy, ")"].join('');
            selected.setAttribute("transform", rotate);
            if (pointGripContainer) {
                pointGripContainer.setAttribute("transform", rotate);
            }
        }
        else {
            // This fixes Firefox 2- behavior - which does not reset values when the attribute has
            // been removed, see https://bugzilla.mozilla.org/show_bug.cgi?id=320622
            selected.setAttribute("transform", "");
            selected.removeAttribute("transform");
            if (pointGripContainer) {
                pointGripContainer.setAttribute("transform", "");
                pointGripContainer.removeAttribute("transform");
            }
        }

        switch (selected.tagName) {
            // NOTE: at the moment, there's no way to create an actual polygon element except by
            // editing source or importing from somewhere else but we'll cover it here anyway
            // polygon is handled just like polyline
            case "polygon":
            case "polyline":
                // extract the points from the polygon/polyline, adjust it and write back the new points
                // but first, save the old points
                changes["points"] = selected.getAttribute("points");
                var list = selected.points;
                var len = list.numberOfItems;
                var newpoints = "";
                for (var i = 0; i < len; ++i) {
                    var pt = list.getItem(i);
                    pt = remap(pt.x, pt.y);
                    newpoints += pt.x + "," + pt.y + " ";
                }
                selected.setAttributeNS(null, "points", newpoints);
                break;
            case "path":
                // extract the x,y from the path, adjust it and write back the new path
                // but first, save the old path
                changes["d"] = selected.getAttribute("d");
                var M = selected.pathSegList.getItem(0);
                var curx = M.x, cury = M.y;
                var pt = remap(curx, cury);
                var newd = "M" + pt.x + "," + pt.y;
                var segList = selected.pathSegList;
                var len = segList.numberOfItems;
                // for all path segments in the path, we first turn them into relative path segments,
                // then we remap the coordinates from the resize
                for (var i = 1; i < len; ++i) {
                    var seg = segList.getItem(i);
                    // if these properties are not in the segment, set them to zero
                    var x = seg.x || 0,
                        y = seg.y || 0,
                        x1 = seg.x1 || 0,
                        y1 = seg.y1 || 0,
                        x2 = seg.x2 || 0,
                        y2 = seg.y2 || 0;

                    var type = seg.pathSegType;
                    switch (type) {
                        case 1: // z,Z closepath (Z/z)
                            newd += "z";
                            continue;
                        // turn this into a relative segment then fall through
                        case 2: // absolute move (M)
                        case 4: // absolute line (L)
                        case 12: // absolute horizontal line (H)
                        case 14: // absolute vertical line (V)
                        case 18: // absolute smooth quad (T)
                            x -= curx;
                            y -= cury;
                        case 3: // relative move (m)
                        case 5: // relative line (l)
                        case 13: // relative horizontal line (h)
                        case 15: // relative vertical line (v)
                        case 19: // relative smooth quad (t)
                            curx += x;
                            cury += y;
                            newd += [" ", pathMap[type], scalew(x), ",", scaleh(y)].join('');
                            break;
                        case 6: // absolute cubic (C)
                            x -= curx;
                            x1 -= curx;
                            x2 -= curx;
                            y -= cury;
                            y1 -= cury;
                            y2 -= cury;
                        case 7: // relative cubic (c)
                            curx += x;
                            cury += y;
                            newd += [" c", scalew(x1), ",", scaleh(y1), " ", scalew(x2), ",", scaleh(y2),
                                " ", scalew(x), ",", scaleh(y)].join('');
                            break;
                        case 8: // absolute quad (Q)
                            x -= curx;
                            x1 -= curx;
                            y -= cury;
                            y1 -= cury;
                        case 9: // relative quad (q)
                            curx += x;
                            cury += y;
                            newd += [" q", scalew(x1), ",", scaleh(y1), " ", scalew(x), ",", scaleh(y)].join('');
                            break;
                        case 10: // absolute elliptical arc (A)
                            x -= curx;
                            y -= cury;
                        case 11: // relative elliptical arc (a)
                            curx += x;
                            cury += y;
                            newd += [ "a", scalew(seg.r1), ",", scaleh(seg.r2), " ", seg.angle, " ",
                                (seg.largeArcFlag ? 1 : 0), " ", (seg.sweepFlag ? 1 : 0), " ",
                                scalew(x), ",", scaleh(y) ].join('')
                            break;
                        case 16: // absolute smooth cubic (S)
                            x -= curx;
                            x2 -= curx;
                            y -= cury;
                            y2 -= cury;
                        case 17: // relative smooth cubic (s)
                            curx += x;
                            cury += y;
                            newd += [" s", scalew(x2), ",", scaleh(y2), " ", scalew(x), ",", scaleh(y)].join('');
                            break;
                    } // switch on path segment type
                } // for each segment
                selected.setAttributeNS(null, "d", newd);
                break;
            case "line":
                changes["x1"] = selected.getAttribute("x1");
                changes["y1"] = selected.getAttribute("y1");
                changes["x2"] = selected.getAttribute("x2");
                changes["y2"] = selected.getAttribute("y2");
                var pt1 = remap(changes["x1"], changes["y1"]),
                    pt2 = remap(changes["x2"], changes["y2"]);
                utils.assignAttributes(selected, {
                    'x1': pt1.x,
                    'y1': pt1.y,
                    'x2': pt2.x,
                    'y2': pt2.y,
                }, 1000);
                break;
            case "circle":
                changes["cx"] = selected.getAttribute("cx");
                changes["cy"] = selected.getAttribute("cy");
                changes["r"] = selected.getAttribute("r");
                var pt = remap(changes["cx"], changes["cy"]);
                utils.assignAttributes(selected, {
                    'cx': pt.x,
                    'cy': pt.y,

                    // take the minimum of the new selected box's dimensions for the new circle radius
                    'r': parseInt(Math.min(selectedBBox.width / 2, selectedBBox.height / 2))
                }, 1000);
                break;
            case "rect":
                changes["x"] = selected.getAttribute("x");
                changes["y"] = selected.getAttribute("y");
                changes["width"] = selected.getAttribute("width");
                changes["height"] = selected.getAttribute("height");
                var pt = remap(changes["x"], changes["y"]);
                utils.assignAttributes(selected, {
                    'x': pt.x,
                    'y': pt.y,
                    'width': scalew(changes["width"]),
                    'height': scaleh(changes["height"])
                }, 1000);
                break;
            default: // rect
                console.log("Unknown shape type: " + selected.tagName);
                break;
        }

    };

    this.clearSelection = function () {
        if (selectedElements[0] == null) {
            return;
        }
        var len = selectedElements.length;
        for (var i = 0; i < len; ++i) {
            var elem = selectedElements[i];
            if (elem == null) break;
            selectorManager.releaseSelector(elem);
            selectedElements[i] = null;
            selectedBBoxes[i] = null;
        }
    };

    this.addToSelection = function (elemsToAdd, showGrips) {
        if (elemsToAdd.length == 0) {
            return;
        }

        var j = 0;
        while (j < selectedElements.length) {
            if (selectedElements[j] == null) {
                break;
            }
            ++j;
        }

        var i = elemsToAdd.length;
        while (i--) {
            var elem = elemsToAdd[i];
            if (elem.id.substr(0, 13) == "selectorGrip_") continue;
            if (selectedElements.indexOf(elem) == -1) {
                selectedElements[j] = elem;
                selectedBBoxes[j++] = utils.getBBox(elem);
                selectorManager.requestSelector(elem);
            }
        }

        if (showGrips) {
            selectorManager.requestSelector(selectedElements[0]).showGrips(true);
        }
    };

    var removeAllPointGripsFromPoly = function () {
        var i = current_poly_pts.length / 2;
        while (i--) {
            document.getElementById("polypointgrip_" + i).setAttribute("display", "none");
        }
        var line = document.getElementById("poly_stretch_line");
        if (line) line.setAttribute("display", "none");
    };

    var addAllPointGripsToPoly = function () {
        var len = current_poly_pts.length;
        for (var i = 0; i < len; i += 2) {
            var grip = document.getElementById("polypointgrip_" + i / 2);
            if (grip) {
                utils.assignAttributes(grip, {
                    'cx': current_poly_pts[i],
                    'cy': current_poly_pts[i + 1],
                    'display': 'inline'
                });
            }
            else {
                addPointGripToPoly(current_poly_pts[i], current_poly_pts[i + 1], i / 2);
            }
        }
        var pointGripContainer = document.getElementById("polypointgrip_container");
        pointGripContainer.setAttribute("transform", current_poly.getAttribute("transform"));
    };

    var addPointGripToPoly = function (x, y, index) {
        var pointGripContainer = document.getElementById("polypointgrip_container");
        if (!pointGripContainer) {
            var parent = document.getElementById("selectorParentGroup");
            pointGripContainer = parent.appendChild(document.createElementNS(svgns, "g"));
            pointGripContainer.id = "polypointgrip_container";
        }

        var pointGrip = document.getElementById("polypointgrip_" + index);
        if (!pointGrip) {
            pointGrip = document.createElementNS(svgns, "circle");
            utils.assignAttributes(pointGrip, {
                'id': "polypointgrip_" + index,
                'display': "none",
                'r': 4,
                'fill': "#0F0",
                'stroke': "#00F",
                'stroke-width': 2,
                'cursor': 'move',
                "pointer-events": "all"
            });
            pointGrip = pointGripContainer.appendChild(pointGrip);

            var grip = $('#polypointgrip_' + index);
            grip.mouseover(function () {
                this.setAttribute("stroke", "#F00");
            });
            grip.mouseout(function () {
                this.setAttribute("stroke", "#00F");
            });
        }

        utils.assignAttributes(pointGrip, {
            'cx': x,
            'cy': y,
            'display': "inline",
        });
    };


    this.clearPoly = function () {
        removeAllPointGripsFromPoly();
        current_poly = null;
        current_poly_pts = [];
    };


    this.setMode = function (name) {
        if (current_mode == "poly" && current_poly_pts.length > 0) {
            var elem = svgdoc.getElementById(getId());
            elem.parentNode.removeChild(elem);
            canvas.clearPoly();
            canvas.clearSelection();
            started = false;
        }

        cur_properties = (selectedElements[0] && selectedElements[0].nodeName == 'text') ? cur_text : cur_shape;
        current_mode = name;
    };


    this.setRotationAngle = function (val) {
        var elem = selectedElements[0];
        var bbox = elem.getBBox();
        var cx = parseInt(bbox.x + bbox.width / 2), cy = parseInt(bbox.y + bbox.height / 2);
        var rotate = "rotate(" + val + " " + cx + "," + cy + ")";
        this.changeSelectedAttributeNoUndo("transform", rotate, selectedElements);
        var pointGripContainer = document.getElementById("polypointgrip_container");
        if (elem.nodeName == "path" && pointGripContainer) {
            pointGripContainer.setAttribute("transform", rotate);
        }
        selectorManager.requestSelector(selectedElements[0]).updateGripCursors(val);
    };

    this.each = function (cb) {
        $(svgroot).children().each(cb);
    };

    this.quickClone = function (elem) {
        if (navigator.userAgent.indexOf('Gecko/') == -1) return elem;
        var clone = elem.cloneNode(true)
        elem.parentNode.insertBefore(clone, elem);
        elem.parentNode.removeChild(elem);
        canvas.clearSelection();
        canvas.addToSelection([clone], true);
        return clone;
    };

    this.changeSelectedAttributeNoUndo = function (attr, newValue, elems) {
        var handle = svgroot.suspendRedraw(1000);
        var elems = elems || selectedElements;
        var i = elems.length;
        while (i--) {
            var elem = elems[i];
            if (elem == null) continue;
            var oldval = attr == "#text" ? elem.textContent : elem.getAttribute(attr);
            if (oldval == null)  oldval = "";
            if (oldval != newValue) {
                if (attr == "#text") {
                    elem.textContent = newValue;
                    elem = canvas.quickClone(elem);
                }
                else elem.setAttribute(attr, newValue);
                selectedBBoxes[i] = utils.getBBox(elem);
                if (elem.nodeName == 'text') {
                    if ((newValue + '').indexOf('url') == 0 || $.inArray(attr, ['font-size', 'font-family', 'x', 'y']) != -1) {
                        elem = canvas.quickClone(elem);
                    }
                }
                setTimeout(function () {
                    selectorManager.requestSelector(elem).resize(selectedBBoxes[i]);
                }, 0);
                var angle = utils.getRotationAngle(elem);
                if (angle && attr != "transform") {
                    var cx = parseInt(selectedBBoxes[i].x + selectedBBoxes[i].width / 2),
                        cy = parseInt(selectedBBoxes[i].y + selectedBBoxes[i].height / 2);
                    var rotate = ["rotate(", angle, " ", cx, ",", cy, ")"].join('');
                    if (rotate != elem.getAttribute("transform")) {
                        elem.setAttribute("transform", rotate);
                    }
                }
            }
        }
        svgroot.unsuspendRedraw(handle);
    };

    this.getVisibleElements = function (includeBBox) {
        var nodes = svgroot.childNodes;
        var i = nodes.length;
        var contentElems = [];

        while (i--) {
            var elem = nodes[i];
            try {
                var box = utils.getBBox(elem);
                if (elem.id != "selectorParentGroup" && box) {
                    var item = includeBBox ? {'elem': elem, 'bbox': box} : elem;
                    contentElems.push(item);
                }
            } catch (e) {
            }
        }
        return contentElems;
    };


    var mouseDown = function (evt) {
        var x = evt.pageX - container.offsetLeft + container.scrollLeft;
        var y = evt.pageY - container.offsetTop + container.scrollTop;

        start_x = x;
        start_y = y;

        if (evt.target.id.indexOf('selectorGrip') != -1) {
            if (evt.target.id.indexOf("rotate") != -1) {
                current_mode = "rotate"
            } else {
                current_resize_mode = evt.target.id.substr(13, evt.target.id.indexOf("_", 13) - 13);
                current_mode = "resize";
            }
        }
        switch (current_mode) {
            case "select":
                started = true;
                current_resize_mode = "none";
                var t = evt.target;
                var nodeName = t.nodeName.toLowerCase();
                if (nodeName != "div" && nodeName != "svg") {
                    if (selectedElements.indexOf(t) == -1) {
                        canvas.clearSelection();
                        canvas.addToSelection([t]);
                        current_poly = null;
                    }
                }
                else {
                    canvas.clearSelection();
                    current_mode = "multiselect";
                    if (rubberBox == null) {
                        rubberBox = selectorManager.getRubberBandBox();
                    }
                    utils.assignAttributes(rubberBox, {
                        'x': start_x,
                        'y': start_y,
                        'width': 0,
                        'height': 0,
                        'display': 'inline'
                    }, 100);
                }
                break;
            case "resize":
                started = true;
                start_x = x;
                start_y = y;
                break;
            case "path":
                started = true;
                start_x = x;
                start_y = y;
                d_attr = x + "," + y + " ";
                var stroke_w = cur_shape.stroke_width == 0 ? 1 : cur_shape.stroke_width;
                SvgCanvas.addSvgElementFromJson({
                    "element": "polyline",
                    "attr": {
                        "points": d_attr,
                        "id": getNextId(),
                        "fill": "none",
                        "stroke": cur_shape.stroke,
                        "stroke-width": stroke_w,
                        "stroke-dasharray": cur_shape.stroke_style,
                        "stroke-opacity": cur_shape.stroke_opacity,
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "opacity": cur_shape.opacity / 2
                    }
                });
                freehand_min_x = x;
                freehand_max_x = x;
                freehand_min_y = y;
                freehand_max_y = y;
                break;
            case "rect":
                started = true;
                start_x = x;
                start_y = y;
                SvgCanvas.addSvgElementFromJson({
                    "element": "rect",
                    "attr": {
                        "x": x,
                        "y": y,
                        "width": 0,
                        "height": 0,
                        "id": getNextId(),
                        "fill": cur_shape.fill,
                        "stroke": cur_shape.stroke,
                        "stroke-width": cur_shape.stroke_width,
                        "stroke-dasharray": cur_shape.stroke_style,
                        "stroke-opacity": cur_shape.stroke_opacity,
                        "fill-opacity": cur_shape.fill_opacity,
                        "opacity": cur_shape.opacity / 2
                    }
                });
                break;
            case "line":
                started = true;
                var stroke_w = cur_shape.stroke_width == 0 ? 1 : cur_shape.stroke_width;
                SvgCanvas.addSvgElementFromJson({
                    "element": "line",
                    "attr": {
                        "x1": x,
                        "y1": y,
                        "x2": x,
                        "y2": y,
                        "id": getNextId(),
                        "stroke": cur_shape.stroke,
                        "stroke-width": stroke_w,
                        "stroke-dasharray": cur_shape.stroke_style,
                        "stroke-opacity": cur_shape.stroke_opacity,
                        "fill": "none",
                        "opacity": cur_shape.opacity / 2
                    }
                });
                break;
            case "circle":
                started = true;
                SvgCanvas.addSvgElementFromJson({
                    "element": "circle",
                    "attr": {
                        "cx": x,
                        "cy": y,
                        "r": 0,
                        "id": getNextId(),
                        "fill": cur_shape.fill,
                        "stroke": cur_shape.stroke,
                        "stroke-width": cur_shape.stroke_width,
                        "stroke-dasharray": cur_shape.stroke_style,
                        "stroke-opacity": cur_shape.stroke_opacity,
                        "fill-opacity": cur_shape.fill_opacity,
                        "opacity": cur_shape.opacity / 2
                    }
                });
                break;
            case "poly":
                started = true;
                break;
            case "rotate":
                started = true;
                break;
            default:
                console.log("Unknown mode in mousedown: " + current_mode);
                break;
        }
    };

    var mouseMove = function (evt) {
        if (!started) return;
        var selected = selectedElements[0];
        var x = evt.pageX - container.offsetLeft + container.scrollLeft;
        var y = evt.pageY - container.offsetTop + container.scrollTop;
        var shape = svgdoc.getElementById(getId());

        switch (current_mode) {
            case "select":
                if (selectedElements[0] != null) {
                    var dx = x - start_x;
                    var dy = y - start_y;

                    if (dx != 0 || dy != 0) {
                        var ts = ["translate(", dx, ",", dy, ")"].join('');
                        var len = selectedElements.length;
                        for (var i = 0; i < len; ++i) {
                            var selected = selectedElements[i];
                            if (selected == null) break;
                            var box = utils.getBBox(selected);
                            selectedBBoxes[i].x = box.x + dx;
                            selectedBBoxes[i].y = box.y + dy;
                            var angle = utils.getRotationAngle(selected);
                            if (angle) {
                                var cx = parseInt(box.x + box.width / 2),
                                    cy = parseInt(box.y + box.height / 2);
                                var xform = ts + [" rotate(", angle, " ", cx, ",", cy, ")"].join('');
                                var r = Math.sqrt(dx * dx + dy * dy);
                                var theta = Math.atan2(dy, dx) - angle * Math.PI / 180.0;
                                selected.setAttribute("transform", xform);
                                box.x += r * Math.cos(theta);
                                box.y += r * Math.sin(theta);
                            }
                            else {
                                selected.setAttribute("transform", ts);
                                box.x += dx;
                                box.y += dy;
                            }
                            selectorManager.requestSelector(selected).resize(box);
                        }
                    }
                }
                break;
            case "multiselect":
                utils.assignAttributes(rubberBox, {
                    'x': Math.min(start_x, x),
                    'y': Math.min(start_y, y),
                    'width': Math.abs(x - start_x),
                    'height': Math.abs(y - start_y)
                }, 100);
                canvas.clearSelection();
                canvas.addToSelection(getIntersectionList());
                break;
            case "resize":
                var box = utils.getBBox(selected), left = box.x, top = box.y, width = box.width,
                    height = box.height, dx = (x - start_x), dy = (y - start_y);

                var angle = utils.getRotationAngle(selected);
                if (angle) {
                    var r = Math.sqrt(dx * dx + dy * dy);
                    var theta = Math.atan2(dy, dx) - angle * Math.PI / 180.0;
                    dx = r * Math.cos(theta);
                    dy = r * Math.sin(theta);
                }

                if (current_resize_mode.indexOf("n") == -1 && current_resize_mode.indexOf("s") == -1) {
                    dy = 0;
                }
                if (current_resize_mode.indexOf("e") == -1 && current_resize_mode.indexOf("w") == -1) {
                    dx = 0;
                }

                var tx = 0, ty = 0;
                var sy = (height + dy) / height, sx = (width + dx) / width;
                if (current_resize_mode.indexOf("n") != -1) {
                    sy = (height - dy) / height;
                    ty = height;
                }

                if (current_resize_mode.indexOf("w") != -1) {
                    sx = (width - dx) / width;
                    tx = width;
                }

                var ts = [" translate(", (left + tx), ",", (top + ty), ") scale(", sx, ",", sy,
                    ") translate(", -(left + tx), ",", -(top + ty), ")"].join('');
                if (angle) {
                    var cx = parseInt(left + width / 2),
                        cy = parseInt(top + height / 2);
                    ts = ["rotate(", angle, " ", cx, ",", cy, ")", ts].join('')
                }
                selected.setAttribute("transform", ts);

                var selectedBBox = selectedBBoxes[0];

                selectedBBox.x = left;
                selectedBBox.y = top;

                if (tx) {
                    selectedBBox.x += dx;
                }
                if (ty) {
                    selectedBBox.y += dy;
                }

                selectedBBox.width = parseInt(width * sx);
                selectedBBox.height = parseInt(height * sy);

                if (selectedBBox.width < 0) {
                    selectedBBox.width *= -1;
                    if (current_resize_mode.indexOf("e") != -1 && sx < 0) {
                        selectedBBox.x = box.x - selectedBBox.width;
                    }
                    else {
                        selectedBBox.x -= selectedBBox.width;
                    }
                }
                if (selectedBBox.height < 0) {
                    selectedBBox.height *= -1;
                    if (current_resize_mode.indexOf("s") != -1 && sy < 0) {
                        selectedBBox.y = box.y - selectedBBox.height;
                    }
                    else {
                        selectedBBox.y -= selectedBBox.height;
                    }
                }


                selectorManager.requestSelector(selected).resize(selectedBBox);
                break;
            case "line":
                var handle = svgroot.suspendRedraw(1000);
                shape.setAttributeNS(null, "x2", x);
                shape.setAttributeNS(null, "y2", y);
                svgroot.unsuspendRedraw(handle);
                break;
            case "rect":
                utils.assignAttributes(shape, {
                    'width': Math.abs(x - start_x),
                    'height': Math.abs(y - start_y),
                    'x': Math.min(start_x, x),
                    'y': Math.min(start_y, y)
                }, 1000);
                break;
            case "circle":
                var cx = shape.getAttributeNS(null, "cx");
                var cy = shape.getAttributeNS(null, "cy");
                var rad = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
                shape.setAttributeNS(null, "r", rad);
                break;
            case "path":
                start_x = x;
                start_y = y;
                d_attr += +x + "," + y + " ";
                shape.setAttributeNS(null, "points", d_attr);
                break;
            case "poly":
                var line = document.getElementById("poly_stretch_line");
                if (line) {
                    line.setAttribute("x2", x);
                    line.setAttribute("y2", y);
                }
                break;
            case "rotate":
                var box = utils.getBBox(selected),
                    cx = parseInt(box.x + box.width / 2),
                    cy = parseInt(box.y + box.height / 2);
                var angle = parseInt(((Math.atan2(cy - y, cx - x) * (180 / Math.PI)) - 90) % 360);
                canvas.setRotationAngle(angle < -180 ? (360 + angle) : angle);
                break;
            default:
                break;
        }
    };

    var mouseUp = function (evt) {
        if (!started) return;

        var x = evt.pageX - container.parentNode.offsetLeft + container.parentNode.scrollLeft;
        var y = evt.pageY - container.parentNode.offsetTop + container.parentNode.scrollTop;

        started = false;
        var element = svgdoc.getElementById(getId());
        var keep = false;
        switch (current_mode) {
            case "resize":
            case "multiselect":
                if (rubberBox != null) {
                    rubberBox.setAttribute("display", "none");
                    curBBoxes = [];
                }
                current_mode = "select";
            case "select":
                if (selectedElements[0] != null) {
                    if (selectedElements[1] == null) {
                        var selected = selectedElements[0];
                        cur_shape.fill = selected.getAttribute("fill");
                        cur_shape.fill_opacity = selected.getAttribute("fill-opacity");
                        cur_shape.stroke = selected.getAttribute("stroke");
                        cur_shape.stroke_opacity = selected.getAttribute("stroke-opacity");
                        cur_shape.stroke_width = selected.getAttribute("stroke-width");
                        cur_shape.stroke_style = selected.getAttribute("stroke-dasharray");

                        selectorManager.requestSelector(selected).showGrips(true);
                    }
                    if (x != start_x || y != start_y) {
                        recalculateAllSelectedDimensions();
                        var len = selectedElements.length;
                        for (var i = 0; i < len; ++i) {
                            if (selectedElements[i] == null) break;
                            selectorManager.requestSelector(selectedElements[i]).resize(selectedBBoxes[i]);
                        }
                    }
                    else {
                        if (selectedElements[0].nodeName == "path" && selectedElements[1] == null) {
                            var t = evt.target;
                            if (current_poly == t) {
                                current_mode = "polyedit";

                                current_poly_pts = [];
                                var segList = t.pathSegList;
                                var curx = segList.getItem(0).x, cury = segList.getItem(0).y;
                                current_poly_pts.push(curx);
                                current_poly_pts.push(cury);
                                var len = segList.numberOfItems;
                                for (var i = 1; i < len; ++i) {
                                    var l = segList.getItem(i);
                                    var x = l.x, y = l.y;
                                    if (l.pathSegType == 1) {
                                        break;
                                    }
                                    var type = l.pathSegType;
                                    if (type == 4) {
                                        curx = x;
                                        cury = y;
                                    }
                                    else if (type == 5) {
                                        curx += x;
                                        cury += y;
                                    }
                                    current_poly_pts.push(curx);
                                    current_poly_pts.push(cury);
                                }
                                canvas.clearSelection();
                                selectedBBoxes[0] = utils.getBBox(current_poly);
                                addAllPointGripsToPoly();
                            }
                            else {
                                current_poly = t;
                            }
                        }
                    }
                }
                return;
                break;
            case "path":
                keep = true;
                break;
            case "line":
                keep = (element.getAttribute('x1') != element.getAttribute('x2') ||
                    element.getAttribute('y1') != element.getAttribute('y2'));
                break;
            case "rect":
                keep = (element.getAttribute('width') != 0 ||
                    element.getAttribute('height') != 0);
                break;
            case "circle":
                keep = (element.getAttribute('r') != 0);
                break;
            case "poly":
                element = null;
                started = true;

                var stretchy = document.getElementById("poly_stretch_line");
                if (!stretchy) {
                    stretchy = document.createElementNS(svgns, "line");
                    utils.assignAttributes(stretchy, {
                        'id': "poly_stretch_line",
                        'stroke': "blue",
                        'stroke-width': "0.5"
                    });
                    stretchy = document.getElementById("selectorParentGroup").appendChild(stretchy);
                }
                stretchy.setAttribute("display", "inline");

                if (current_poly_pts.length == 0) {
                    current_poly_pts.push(x);
                    current_poly_pts.push(y);
                    d_attr = "M" + x + "," + y + " ";
                    SvgCanvas.addSvgElementFromJson({
                        "element": "path",
                        "attr": {
                            "d": d_attr,
                            "id": getNextId(),
                            "fill": cur_shape.fill,
                            "fill-opacity": cur_shape.fill_opacity,
                            "stroke": cur_shape.stroke,
                            "stroke-width": cur_shape.stroke_width,
                            "stroke-dasharray": cur_shape.stroke_style,
                            "stroke-opacity": cur_shape.stroke_opacity,
                            "opacity": cur_shape.opacity / 2
                        }
                    });
                    utils.assignAttributes(stretchy, {
                        'x1': x,
                        'y1': y,
                        'x2': x,
                        'y2': y
                    });
                    addPointGripToPoly(x, y, 0);
                }
                else {
                    var i = current_poly_pts.length;
                    var FUZZ = 6;
                    var clickOnPoint = false;
                    while (i) {
                        i -= 2;
                        var px = current_poly_pts[i], py = current_poly_pts[i + 1];
                        if (x >= (px - FUZZ) && x <= (px + FUZZ) && y >= (py - FUZZ) && y <= (py + FUZZ)) {
                            clickOnPoint = true;
                            break;
                        }
                    }

                    var poly = svgdoc.getElementById(getId());

                    if (clickOnPoint) {
                        if (i == 0 && current_poly_pts.length >= 6) {
                            poly.setAttribute("d", d_attr + "z");
                        }

                        removeAllPointGripsFromPoly();

                        element = poly;
                        current_poly_pts = [];
                        started = false;
                    }
                    else {
                        var len = current_poly_pts.length;
                        var lastx = current_poly_pts[len - 2], lasty = current_poly_pts[len - 1];
                        current_poly_pts.push(x);
                        current_poly_pts.push(y);
                        d_attr += "l" + parseInt(x - lastx) + "," + parseInt(y - lasty) + " ";
                        poly.setAttribute("d", d_attr);

                        utils.assignAttributes(stretchy, {
                            'x1': x,
                            'y1': y,
                            'x2': x,
                            'y2': y
                        });
                        addPointGripToPoly(x, y, (current_poly_pts.length / 2 - 1));
                    }
                    keep = true;
                }
                break;
            case "rotate":
                keep = true;
                element = null;
                current_mode = "select";
                break;
            default:
                console.log("Unknown mode in mouseup: " + current_mode);
                break;
        }
        if (!keep && element != null) {
            element.parentNode.removeChild(element);
            element = null;
        } else if (element != null) {
            canvas.addedNew = true;
            element.setAttribute("opacity", cur_shape.opacity);
            cleanupElement(element);
            selectorManager.update();
            canvas.addToSelection([element], true);
        }
    };

    $(container).mouseup(mouseUp);
    $(container).mousedown(mouseDown);
    $(container).mousemove(mouseMove);
}
