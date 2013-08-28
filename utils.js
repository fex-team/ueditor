var utils=utils||{};

utils.getRotationAngle = function (elem) {
    var selected = elem || selectedElements[0];
    var tlist = selected.transform.baseVal;
    var t = tlist.numberOfItems;
    while (t--) {
        var xform = tlist.getItem(t);
        if (xform.type == 4) {
            return xform.angle;
        }
    }
    return 0;
};

utils.getBBox = function (elem) {
    var selected = elem || selectedElements[0];

    if (elem.nodeName == 'text' && selected.textContent == '') {
        selected.textContent = 'a';
        var ret = selected.getBBox();
        selected.textContent = '';
    } else {
        var ret = selected.getBBox();
    }

    return ret;
};

utils.assignAttributes = function (node, attrs, suspendLength) {
    if (!suspendLength) suspendLength = 0;

    for (var i in attrs) {
        node.setAttributeNS(null, i, attrs[i]);
    }
};

