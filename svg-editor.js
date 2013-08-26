function svg_edit_setup() {
	var svgCanvas = new SvgCanvas(document.getElementById("svgcanvas"));

	var setSelectMode = function() {
		svgCanvas.setMode('select');
	};

	var flyoutspeed = 1250;
	var selectedElement = null;
	var multiselected = false;


	var selectedChanged = function(window,elems) {
		selectedElement = (elems.length == 1 || elems[1] == null ? elems[0] : null);
		multiselected = (elems.length >= 2 && elems[1] != null);
		if (selectedElement != null) {
			if (svgCanvas.getMode() != "multiselect") {
				setSelectMode();
			}
		}

		updateContextPanel();
	};

	var elementChanged = function(window,elems) {
		for (var i = 0; i < elems.length; ++i) {
			var elem = elems[i];
			if (elem && elem.tagName == "svg") {
				changeResolution(parseInt(elem.getAttribute("width")),
								 parseInt(elem.getAttribute("height")));
			}
		}

		updateContextPanel();
	};

	var updateContextPanel = function() {
		var elem = selectedElement;

		// No need to update anything else in rotate mode
		if (svgCanvas.getMode() == 'rotate' && elem != null) {
			$('#angle').val(svgCanvas.getRotationAngle(elem));
			return;
		}


		if (elem != null) {
			$('#angle').val(svgCanvas.getRotationAngle(elem));
			$('#selected_panel').show();

			// update contextual tools here
			var panels = {
				rect: ['radius','x','y','width','height'],
				circle: ['cx','cy','r'],
				ellipse: ['cx','cy','rx','ry'],
				line: ['x1','y1','x2','y2'],
				text: ['x','y']
			};

			var el_name = elem.tagName;

			if(panels[el_name]) {

				var cur_panel = panels[el_name];


				$('#' + el_name + '_panel').show();

				$.each(cur_panel, function(i, item) {
					$('#' + el_name + '_' + item).val(elem.getAttribute(item) || 0);
				});

				if(el_name == 'text') {
					$('#text_panel').css("display", "inline");
					if (svgCanvas.getItalic()) {
						$('#tool_italic').addClass('tool_button_current');
					}
					else {
						$('#tool_italic').removeClass('tool_button_current');
					}
					if (svgCanvas.getBold()) {
						$('#tool_bold').addClass('tool_button_current');
					}
					else {
						$('#tool_bold').removeClass('tool_button_current');
					}
					$('#font_family').val(elem.getAttribute("font-family"));
					$('#font_size').val(elem.getAttribute("font-size"));
					$('#text').val(elem.textContent);
					if (svgCanvas.addedNew) {
						$('#text').focus().select();
					}
				}
			}
		} // if (elem != null)
		else if (multiselected) {
			$('#multiselected_panel').show();
		}

		svgCanvas.addedNew = false;
	};


	svgCanvas.bind("selected", selectedChanged);
	svgCanvas.bind("changed", elementChanged);

	$('select').change(function(){$(this).blur();});

	var toolButtonClick = function(button, fadeFlyouts) {
		if ($(button).hasClass('tool_button_disabled')) return false;
		var fadeFlyouts = fadeFlyouts || 'normal';
		$('.tools_flyout').fadeOut(fadeFlyouts);
		$('#styleoverrides').text('');
		$('.tool_button_current').removeClass('tool_button_current').addClass('tool_button');
		$(button).addClass('tool_button_current');
		// when a tool is selected, we should deselect any currently selected elements
		svgCanvas.clearSelection();
		return true;
	};

	var clickSelect = function() {
		if (toolButtonClick('#tool_select')) {
			svgCanvas.setMode('select');
			$('#styleoverrides').text('#svgcanvas svg *{cursor:move;pointer-events:all}, #svgcanvas svg{cursor:default}');
		}
	};

	var clickPath = function() {
		if (toolButtonClick('#tool_path')) {
			svgCanvas.setMode('path');
		}
	};

	var clickLine = function() {
		if (toolButtonClick('#tool_line')) {
			svgCanvas.setMode('line');
		}
	};

	var clickSquare = function(){
		if (toolButtonClick('#tools_rect_show', flyoutspeed)) {
			flyoutspeed = 'normal';
			svgCanvas.setMode('square');
		}
		$('#tools_rect_show').attr('src', 'images/square.png');
	};

	var clickCircle = function(){
		if (toolButtonClick('#tools_ellipse_show', flyoutspeed)) {
			flyoutspeed = 'normal';
			svgCanvas.setMode('circle');
		}
		$('#tools_ellipse_show').attr('src', 'images/circle.png');
	};

	var clickPoly = function(){
		toolButtonClick('#tool_poly');
		svgCanvas.setMode('poly');
	};
	
	$('#tool_select').click(clickSelect);
	$('#tool_path').click(clickPath);
	$('#tool_line').click(clickLine);
	$('#tool_poly').click(clickPoly);
	$('#tools_rect_show').click(clickSquare);
	$('#tools_ellipse_show').click(clickCircle);

	function changeResolution(x,y) {
		var new_res = x+'x'+y;
		var found = false;
		$('#resolution option').each(function() {
			if($(this).text() == new_res) {
				$('#resolution').val(x+'x'+y);
				found = true;
			}
		});
		if(!found) $('#resolution').val('Custom');

		$('#svgcanvas').css( { 'width': x, 'height': y } );
	}


	return svgCanvas;
}

$(function() {
	svgCanvas = svg_edit_setup();
});
