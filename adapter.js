function init() {
    var svgCanvas = new SvgCanvas(document.getElementById("canvas"));

    var clickSelect = function () {
        svgCanvas.setMode('select');
    };

    var clickPath = function () {
        svgCanvas.setMode('path');
    };

    var clickLine = function () {
        svgCanvas.setMode('line');
    };

    var clickSquare = function () {
        svgCanvas.setMode('rect');
    };

    var clickCircle = function () {
        svgCanvas.setMode('circle');
    };

    var clickPoly = function () {
        svgCanvas.setMode('poly');
    };

    $('#tool_select').click(clickSelect);
    $('#tool_path').click(clickPath);
    $('#tool_line').click(clickLine);
    $('#tool_poly').click(clickPoly);
    $('#tools_rect').click(clickSquare);
    $('#tools_ellipse').click(clickCircle);

    return svgCanvas;
}

$(function () {
    svgCanvas = init();
});
