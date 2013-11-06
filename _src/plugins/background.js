/**
 * 背景插件，为UEditor提供设置背景功能
 * @file
 * @since 1.2.6.1
 */
UE.plugin.register('background', function () {
    var me = this,
        cssRuleId = 'editor_background';

    function stringToObj(str) {
        var obj = {}, styles = str.split(';');
        utils.each(styles, function (v) {
            var index = v.indexOf(':'),
                key = utils.trim(v.substr(0, index));
            key && (obj[key] = utils.trim(v.substr(index + 1) || ''));
        });
        return obj;
    }

    function setBackground(obj) {
        if (obj) {
            var styles = [];
            for (var name in obj) {
                if (obj.hasOwnProperty(name)) {
                    styles.push(name + ":" + obj[name] + '; ');
                }
            }
            utils.cssRule(cssRuleId, styles.length ? ('body{' + styles.join("") + '}') : '', me.document);
        } else {
            utils.cssRule(cssRuleId, '', me.document)
        }
    }

    return {
        bindEvents: {
            'getAllHtml': function (type, headHtml) {
                var body = this.body,
                    su = domUtils.getComputedStyle(body, "background-image"),
                    url = "";
                if (su.indexOf(me.options.imagePath) > 0) {
                    url = su.substring(su.indexOf(me.options.imagePath), su.length - 1).replace(/"|\(|\)/ig, "");
                } else {
                    url = su != "none" ? su.replace(/url\("?|"?\)/ig, "") : "";
                }
                var html = '<style type="text/css">body{';
                var bgObj = {
                    "background-color": domUtils.getComputedStyle(body, "background-color") || "#ffffff",
                    'background-image': url ? 'url(' + url + ')' : '',
                    'background-repeat': domUtils.getComputedStyle(body, "background-repeat") || "",
                    'background-position': browser.ie ? (domUtils.getComputedStyle(body, "background-position-x") + " " + domUtils.getComputedStyle(body, "background-position-y")) : domUtils.getComputedStyle(body, "background-position"),
                    'height': domUtils.getComputedStyle(body, "height")
                };
                for (var name in bgObj) {
                    if (bgObj.hasOwnProperty(name)) {
                        html += name + ":" + bgObj[name] + "; ";
                    }
                }
                html += '}</style> ';
                headHtml.push(html);
            },
            'aftersetcontent': function () {
                setBackground();
            }
        },
        inputRule: function (root) {
            utils.each(root.getNodesByTagName('p'), function (p) {
                var styles = p.getAttr('data-background');
                if (styles) {
                    me.execCommand('background', stringToObj(styles));
                    p.parentNode.removeChild(p);
                }
            })
        },
        outputRule: function (root) {
            var me = this,
                ele = me.document.getElementById(cssRuleId),
                styles = (ele ? ele.innerHTML : '').match(/body[\s]*\{(.*)\}/);
            if (styles) {
                root.appendChild(UE.uNode.createElement('<p style="display:none;" data-background="' + styles[1] + '"><br/></p>'));
            }
        },
        commands: {
            'background': {
                execCommand: function (cmd, obj) {
                    setBackground(obj);
                },
                queryCommandValue: function () {
                    var me = this,
                        ele = me.document.getElementById(cssRuleId),
                        styles = (ele ? ele.innerHTML : '').match(/body[\s]*\{(.*)\}/);
                    return styles ? stringToObj(styles[1]) : null;
                },
                notNeedUndo: true
            }
        }
    }
});