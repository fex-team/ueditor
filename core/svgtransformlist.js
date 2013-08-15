(function () {
    var TransformList = UG.TransformList = {
        getTransformList: function (elem) {
            if (!UG.browser.supportsNativeTransformLists()) {
                var id = elem.id;
                if (!id) {
                    // Get unique ID for temporary element
                    id = 'temp';
                }
                var t = listMap_[id];
                if (!t || id == 'temp') {
                    listMap_[id] = new UG.TransformList.SVGTransformList(elem);
                    listMap_[id]._init();
                    t = listMap_[id];
                }
                return t;
            }
            else if (elem.transform) {
                return elem.transform.baseVal;
            }
            else if (elem.gradientTransform) {
                return elem.gradientTransform.baseVal;
            }
            else if (elem.patternTransform) {
                return elem.patternTransform.baseVal;
            }

            return null;
        },
        SVGTransformList: function (elem) {
            this._elem = elem || null;
            this._xforms = [];
            // TODO: how do we capture the undo-ability in the changed transform list?
            this._update = function () {
                var tstr = "";
                var concatMatrix = svgroot.createSVGMatrix();
                for (var i = 0; i < this.numberOfItems; ++i) {
                    var xform = this._list.getItem(i);
                    tstr += transformToString(xform) + " ";
                }
                this._elem.setAttribute("transform", tstr);
            }
        }
    };

})();
