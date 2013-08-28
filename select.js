function Selector(id, elem) {
    this.id = id;
    this.selectedElement = elem;
    this.locked = true;

    this.selectorGroup = SvgCanvas.addSvgElementFromJson({ "element": "g",
        "attr": {"id": ("selectorGroup" + this.id)}
    });
    this.selectorRect = this.selectorGroup.appendChild(SvgCanvas.addSvgElementFromJson({
        "element": "rect",
        "attr": {
            "id": ("selectedBox" + this.id),
            "fill": "none",
            "stroke": "#5da2ff",
            "stroke-width": "1",
            "width": 1,
            "height": 1,
            "style": "pointer-events:none"
        }
    }));
    this.selectorGrips = {    "nw": null,
        "n": null,
        "ne": null,
        "e": null,
        "se": null,
        "s": null,
        "sw": null,
        "w": null
    };
    this.rotateGripConnector = this.selectorGroup.appendChild(SvgCanvas.addSvgElementFromJson({
        "element": "line",
        "attr": {
            "id": ("selectorGrip_rotate_connector_" + this.id),
            "stroke": "#5da2ff",
            "stroke-width": "1"
        }
    }));
    this.rotateGrip = this.selectorGroup.appendChild(SvgCanvas.addSvgElementFromJson({
        "element": "circle",
        "attr": {
            "id": ("selectorGrip_rotate_" + this.id),
            "fill": "#5da2ff",
            "r": 4,
            "stroke": "#fff",
            "stroke-width": 2
        }
    }));


    this.initGrips();
    this.reset(elem);
}
Selector.prototype = {
    reset: function (e) {
        this.locked = true;
        this.selectedElement = e;
        this.resize();
        selectorManager.update();
        this.selectorGroup.setAttribute("display", "inline");
    },

    initGrips: function () {
        for (dir in this.selectorGrips) {
            this.selectorGrips[dir] = this.selectorGroup.appendChild(
                SvgCanvas.addSvgElementFromJson({
                    "element": "rect",
                    "attr": {
                        "id": ("selectorGrip_" + dir + "_" + this.id),
                        "fill": "#5da2ff",
                        'stroke': '#fff',
                        "width": 6,
                        "height": 6,
                        "style": ("cursor:" + dir + "-resize"),
                        "stroke-width": 2,
                        "pointer-events": "all",
                        "display": "none"
                    }
                }));
        }
    },

    showGrips: function (show) {
        var bShow = show ? "inline" : "none";
        this.rotateGrip.setAttribute("display", bShow);
        this.rotateGripConnector.setAttribute("display", bShow);
        var elem = this.selectedElement;
        if (elem && elem.tagName == "text") bShow = "none";
        for (dir in this.selectorGrips) {
            this.selectorGrips[dir].setAttribute("display", bShow);
        }
        if (elem) this.updateGripCursors(utils.getRotationAngle(elem));
    },

    updateGripCursors: function (angle) {
        var dir_arr = [];
        var steps = Math.round(angle / 45);
        if (steps < 0) steps += 8;
        for (dir in this.selectorGrips) {
            dir_arr.push(dir);
        }
        while (steps > 0) {
            dir_arr.push(dir_arr.shift());
            steps--;
        }
        var i = 0;
        for (dir in this.selectorGrips) {
            this.selectorGrips[dir].setAttribute('style', ("cursor:" + dir_arr[i] + "-resize"));
            i++;
        }
    },

    resize: function (cur_bbox) {
        var selectedBox = this.selectorRect;
        var selectedGrips = this.selectorGrips;
        var selected = this.selectedElement;
        var sw = parseInt(selected.getAttribute("stroke-width"));
        var offset = 1;
        if (!isNaN(sw)) {
            offset += sw / 2;
        }
        var oldbox = utils.getBBox(this.selectedElement);
        var bbox = cur_bbox || oldbox;
        var l = bbox.x - offset, t = bbox.y - offset, w = bbox.width + (offset << 1), h = bbox.height + (offset << 1);
        var sr_handle = svgroot.suspendRedraw(100);
        utils.assignAttributes(selectedBox, {
            'x': l,
            'y': t,
            'width': w,
            'height': h
        });

        var gripCoords = {
            nw: [l - 3, t - 3],
            ne: [l + w - 3, t - 3],
            sw: [l - 3, t + h - 3],
            se: [l + w - 3, t + h - 3],
            n: [l + w / 2 - 3, t - 3],
            w: [l - 3, t + h / 2 - 3],
            e: [l + w - 3, t + h / 2 - 3],
            s: [l + w / 2 - 3, t + h - 3]
        };
        $.each(gripCoords, function (dir, coords) {
            utils.assignAttributes(selectedGrips[dir], {
                x: coords[0], y: coords[1]
            });
        });

        utils.assignAttributes(this.rotateGripConnector, { x1: l + w / 2, y1: t - 20, x2: l + w / 2, y2: t });
        utils.assignAttributes(this.rotateGrip, { cx: l + w / 2, cy: t - 20 });

        this.selectorGroup.setAttribute("transform", "");
        this.selectorGroup.removeAttribute("transform");

        var elem = this.selectedElement;
        var transform = elem.getAttribute("transform");
        var angle = utils.getRotationAngle(elem);
        if (angle) {
            var cx = parseInt(oldbox.x + oldbox.width / 2)
            cy = parseInt(oldbox.y + oldbox.height / 2);
            this.selectorGroup.setAttribute("transform", "rotate(" + angle + " " + cx + "," + cy + ")");
        }
        svgroot.unsuspendRedraw(sr_handle);
    }
};

function SelectorManager() {

    this.selectorParentGroup = null;

    this.rubberBandBox = null;

    this.selectors = [];

    this.selectorMap = {};


    this.initGroup();
}
SelectorManager.prototype = {
    initGroup: function () {
        var me = this;
        me.selectorParentGroup = SvgCanvas.addSvgElementFromJson({
            "element": "g",
            "attr": {"id": "selectorParentGroup"}
        });
        me.selectorMap = {};
        me.selectors = [];
        me.rubberBandBox = null;
    },

    requestSelector: function (elem) {
        if (elem == null) return null;
        var N = this.selectors.length;
        if (typeof(this.selectorMap[elem.id]) == "object") {
            this.selectorMap[elem.id].locked = true;
            return this.selectorMap[elem.id];
        }

        for (var i = 0; i < N; ++i) {
            if (this.selectors[i] && !this.selectors[i].locked) {
                this.selectors[i].locked = true;
                this.selectors[i].reset(elem);
                this.selectorMap[elem.id] = this.selectors[i];
                return this.selectors[i];
            }
        }
        this.selectors[N] = new Selector(N, elem);
        this.selectorParentGroup.appendChild(this.selectors[N].selectorGroup);
        this.selectorMap[elem.id] = this.selectors[N];
        return this.selectors[N];
    },

    releaseSelector: function (elem) {
        if (elem == null) return;
        var N = this.selectors.length;
        var sel = this.selectorMap[elem.id];
        for (var i = 0; i < N; ++i) {
            if (this.selectors[i] && this.selectors[i] == sel) {
                if (sel.locked == false) {
                    console.log("WARNING! selector was released but was already unlocked");
                }
                delete this.selectorMap[elem.id];
                sel.locked = false;
                sel.selectedElement = null;
                sel.showGrips(false);

                try {
                    sel.selectorGroup.setAttribute("display", "none");
                } catch (e) {
                }

                break;
            }
        }
    },

    update: function () {
        this.selectorParentGroup = svgroot.appendChild(this.selectorParentGroup);
    },

    getRubberBandBox: function () {
        if (this.rubberBandBox == null) {
            this.rubberBandBox = this.selectorParentGroup.appendChild(
                SvgCanvas.addSvgElementFromJson({ "element": "rect",
                    "attr": {
                        "id": "selectorRubberBand",
                        "fill": "blue",
                        "fill-opacity": 0.15,
                        "stroke": "blue",
                        "stroke-width": 0.5,
                        "display": "none",
                        "style": "pointer-events:none"
                    }
                }));
        }
        return this.rubberBandBox;
    }
};
