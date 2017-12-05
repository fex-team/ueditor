/**
 * @file xssFilter.js
 * @desc xss过滤器
 * @author robbenmu
 */

UE.plugins.xssFilter = function() {

	var config = UEDITOR_CONFIG;
	var whitList = config.whitList;

	function filter(node) {

		var tagName = node.tagName;
		var attrs = node.attrs;

		if (!whitList.hasOwnProperty(tagName)) {
			node.parentNode.removeChild(node);
			return false;
		}

		UE.utils.each(attrs, function (val, key) {

			if (whitList[tagName].indexOf(key) === -1) {
				node.setAttr(key);
			}
		});
	}

	// 添加inserthtml\paste等操作用的过滤规则
	if (whitList && config.xssFilterRules) {
		this.options.filterRules = function () {

			var result = {};

			UE.utils.each(whitList, function(val, key) {
				result[key] = function (node) {
					return filter(node);
				};
			});

			return result;
		}();
	}

	var tagList = [];

	UE.utils.each(whitList, function (val, key) {
		tagList.push(key);
	});

	// 添加input过滤规则
	//
	if (whitList && config.inputXssFilter) {
		this.addInputRule(function (root) {

			root.traversal(function(node) {
				if (node.type !== 'element') {
					return false;
				}
				filter(node);
			});
		});
	}
	// 添加output过滤规则
	//
	if (whitList && config.outputXssFilter) {
		this.addOutputRule(function (root) {

			root.traversal(function(node) {
				if (node.type !== 'element') {
					return false;
				}
				filter(node);
			});
		});
	}

};
