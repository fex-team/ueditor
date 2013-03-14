/**
 * <ul>
 * 不存在的标准
 * <li>元素不存在，元素无父节点
 * <li>元素被隐藏了
 * <li>元素的父节点被隐藏
 * <li>存在的标准 - display = 'block' - display = ''
 * 
 * 参数： jquery object
 */
function isShown(o) {
	if (!o || (!o.parentNode && o != document))
		return false;

	if (o instanceof String || 'string' == typeof o)
		o = document.getElementById(o);
	if (o == document.body)
		return true;

	if (o.style && "none" == o.style.display)
		return false;
	if (parseInt(o.style.marginLeft) < -2000 || parseInt(o.style.left) < -2000)
		return false;
	if (parseInt(o.offsetHeight) == 0 || parseInt(o.offsetWidth) == 0)
		return false;
	if (o.parentNode && !isShown(o.parentNode))
		return false;
	return true;
}

var testingElement = {}, te = testingElement;

(function() {
	function mySetup() {
		te.dom = [];
		te.obj = [];
	}

	/**
	 * 添加一个通用接口，用于支持类似dispose等通用方法
	 */
	te.checkUI = {
		eventLength : 0,
		/**
		 * 校验对象的dispose方法，主要是dom和event支持
		 * 
		 * @param ui
		 *            需要调用dispose的ui对象
		 * @param eventLength
		 *            ui启动前在baidu.event._listeners中的事件总数
		 * @param dom 需要确认dom被干掉了
		 * @param callback 回调函数，在dispose之后
		 */
		dispose : function(ui, eventLength, dom, callback) {
			if (!ui.dispose || 'function' != typeof ui.dispose) {
				ok(false, 'ui do not have a dispose function');
				return false;
			}
			var m = ui.getMain();
			ui.dispose();
			ok(ui.disposed === true, 'ui.disposed is true');
			ok(!isShown(m), 'main is not shown');
			if (baidu.event && baidu.event._listeners)
				equals(baidu.event._listeners.length, eventLength
						|| this.eventLength,
						'event all should be un after dispose');
			if (dom)
				ok(!isShown(dom), 'dom not shown');
			callback && callback(ui);
		}
	};

	function myTeardown() {
		if (te) {
			if (te.dom && te.dom.length) {
				for ( var i = 0; i < te.dom.length; i++)
					if (te.dom[i] && te.dom[i].parentNode)
						te.dom[i].parentNode.removeChild(te.dom[i]);
			}
			if (te.obj && te.obj.length) {
				while (te.obj.length > 0)
					try {
						te.obj.shift().dispose();
					} catch (e) {
					}
			}
		}
	}

	var s = QUnit.testStart, e = QUnit.testDone, ms = QUnit.moduleStart, me = QUnit.moduleEnd, d = QUnit.done;
	QUnit.testStart = function() {
		mySetup();
		s.apply(this, arguments);
		;
	};
	QUnit.testDone = function() {
		e.call(this, arguments);
		myTeardown();
	};
	// QUnit.moduleStart = function() {
	// var h = setInterval(function() {
	// if (window && window['baidu'] && window.document && window.document.body)
	// {
	// clearInterval(h);
	// start();
	// }
	// }, 20);
	// stop();
	// ms.apply(this, arguments);;
	// };
	// QUnit.moduleEnd = function() {
	// me.call(this, arguments);
	// };
	// QUnit.done = function(fail,total) {
	// // d.call(this, arguments);
	// d(fail,total);
	// };
})();

// function Include(src) {
// var url = "http://"
// + location.host
// + location.pathname.substring(0, location.pathname.substring(1)
// .indexOf('/') + 1);
// document.write("<script type='text/javascript' src='" + url
// + "/src/Import.php?f=" + src + "'></script>");
// }
