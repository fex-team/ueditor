/**
 * Created by JetBrains PhpStorm.
 * User: dongyancen
 * Date: 12-9-19
 * Time: 下午4:19
 * To change this template use File | Settings | File Templates.
 */
module('plugins.contextmenu');

test('基本右键菜单', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        ua.contextmenu(editor.body);
        var lang = editor.getLang("contextMenu");
        equal(document.getElementsByClassName("edui-menu-body").length, 3, '默认3个menu,一个主的，一个段落格式，一个表格');
        var menuBody = document.getElementsByClassName("edui-menu-body")[0];
        equal(menuBody.parentNode.parentNode.parentNode.style.display, '', '第一个menu显示');
        equal(menuBody.childNodes.length, 11, '第一个menu8个items3个分隔线');
//    var space = browser.webkit||ua.browser.ie==9?"\n":'';
        var innerText = lang['selectall'] + lang.cleardoc + lang.paragraph + lang.table + lang.insertparagraphbefore + lang.insertparagraphafter + lang['copy'] + lang['paste'];
        if (browser.gecko) {
            equal(menuBody.textContent, innerText, '检查menu显示的字符');
        }
        else {
            equal(menuBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
        }
        ok(menuBody.childNodes[0].className.indexOf("edui-for-selectall") > -1, '检查menu样式');
        var menuparagraphBody = document.getElementsByClassName("edui-menu-body")[1];
        equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display, 'none', '第二个menu隐藏');
        var menutableBody = document.getElementsByClassName("edui-menu-body")[2];
        if (ua.browser.ie) {
            ua.mouseenter(menuBody.childNodes[3]);
        } else {
            ua.mouseover(menuBody.childNodes[3]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            equal(menuparagraphBody.parentNode.parentNode.parentNode.style.display, 'none', '显示submenu,检查submenu的display值:""');
            equal(menuparagraphBody.childNodes.length, 4, '检查submenu的menuitems数量');
            equal(menutableBody.parentNode.parentNode.parentNode.style.display, 'none', '显示table submenu,检查submenu的display值:""');
            /*trace 3038*/
            if (ua.browser.ie && ua.browser.ie < 9) {
                equal(menutableBody.childNodes.length, 2, 'ie有一条分隔线');
            } else {
                equal(menutableBody.childNodes.length, 1, '只有插入表格选项');
            }
            innerText = lang["justifyleft" ] + lang["justifyright" ] + lang["justifycenter" ] + lang[ "justifyjustify" ];
            if (browser.gecko) {
                equal(menuparagraphBody.textContent, innerText, '检查menu显示的字符');
                equal(menutableBody.textContent, lang["inserttable" ], '检查table menu显示的字符');
            }
            else {
                equal(menuparagraphBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
                equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), lang["inserttable" ], '检查table menu显示的字符');
            }
            ua.click(menuparagraphBody.childNodes[1]);
            equal(editor.body.firstChild.style.textAlign, 'right', '文本右对齐');
            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                UE.delEditor('ue');
                start();
            }, 500);
        }, 200);
    });
});

test('表格右键菜单', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.setContent('<table width="100%" border="1" bordercolor="#000000"><tbody><tr><td style="width:50%;"><br /></td><td style="width:50%;"><br /></td></tr><tr><td style="width:50%;"></td><td style="width:50%;"><br /></td></tr></tbody></table>');
        setTimeout(function () {
            range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild.firstChild, 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild.firstChild.firstChild);
            equal(document.getElementsByClassName("edui-menu-body").length, 5, '获得edui-menu-body名称的class个数5');
            var menuBody = document.getElementsByClassName("edui-menu-body")[0];
            equal(menuBody.childNodes.length, 13, '第一个menu11个items2个分隔线');
            var innerText = lang.selectall + lang.cleardoc + lang.table + "表格排序" + "边框底纹" + lang.aligntd + lang.aligntable + lang.insertparagraphbefore + lang.insertparagraphafter + lang['copy'] + lang['paste'];
            if (browser.gecko) {
                equal(menuBody.textContent, innerText, '检查menu显示的字符');
            }
            else {
                equal(menuBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
            }
//
            var menutableBody = document.getElementsByClassName("edui-menu-body")[1];
            var forTable = document.getElementsByClassName('edui-for-table');

            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {
                lang = editor.getLang("contextMenu");
                equal(menutableBody.parentNode.parentNode.parentNode.style.display, 'none', '显示submenu,检查submenu的display值:""');
                equal(menutableBody.childNodes.length, 15, '11个items4个分隔线');
                var innerText = lang.deletetable + lang.insertcol + lang.insertcolnext + lang.insertrow + lang.insertrownext + lang.insertcaption + lang.inserttitle + lang.mergeright + lang.mergedown + lang.edittd + lang.edittable;
                if (browser.gecko) {
                    equal(menutableBody.textContent, innerText, '检查menu显示的字符');
                }
                else {
                    equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
                }
                ua.click(menutableBody.childNodes[0]);
                equal(editor.body.getElementsByTagName('table').length, 0, '删除表格');
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 200);
        }, 100);

    });
});

test('右键全选', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        editor.setContent('asdfg');
        ua.contextmenu(editor.body);
        var lang = editor.getLang("contextMenu");
        var menuBody = document.getElementsByClassName("edui-menu-body")[0];
        equal(editor.selection.getRange().collapsed, true, '检查选区--闭合');
        ua.click(menuBody.childNodes[0]);
        setTimeout(function () {
            equal(editor.selection.getRange().collapsed, false, '检查选区--非闭合');
            document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
            UE.delEditor('ue');
            start();
        }, 50);
    });
});

/*trace 3216*/
test('trace 3216：前插入行', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        var tds = editor.body.getElementsByTagName('td');
        tds[0].innerHTML = 'asd';
        range.setStart(tds[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[1];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[4]);
            equal(editor.body.getElementsByTagName('tr').length, 6, '前插入行后有6行');
            equal(ua.getChildHTML(editor.body.getElementsByTagName('td')[5]), 'asd', '原单元格中文本未改变');
            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                UE.delEditor('ue');
                start();
            }, 200);
        }, 200);
    });
});

/*trace 3044*/
test('trace 3044：表格名称中右键', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutableBody = document.getElementsByClassName("edui-menu-body")[1];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutableBody.childNodes[7]);
            var caption = editor.body.getElementsByTagName('caption');
            equal(caption.length, 1, '插入表格名称');
            range.setStart(caption[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild.firstChild);
            forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {
                lang = editor.getLang("contextMenu");
                menutableBody = document.getElementsByClassName("edui-menu-body")[1];
                if (ua.browser.ie == 8) {
                    equal(menutableBody.childNodes.length, 7, '7个子项目,其中有2条分隔线');
                } else {
                    equal(menutableBody.childNodes.length, 5, '5个子项目');
                }
                var innerText = lang.deletetable + lang.deletecaption + lang.inserttitle + lang.edittd + lang.edittable;
                if (browser.gecko) {
                    equal(menutableBody.textContent, innerText, '检查menu显示的字符');
                } else {
                    equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
                }
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 200);
        }, 200);
    });
});

/*trace 3045*/
/*trace 3098*/
/*trace 3410*/
/*trace 3448*/
test('检查表格属性', function () {
    if (ua.browser.ie )return;//todo 1.2.6.1  #3448
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        editor.execCommand('insertcaption');
        setTimeout(function () {
            range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild.firstChild);
            var menutable = document.getElementsByClassName("edui-menu-body")[1];
            var forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
                ua.click(menutable.childNodes[6]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
                ua.click(menutable.childNodes[4]);
            }
            lang = editor.getLang("contextMenu");
            var iframe = document.getElementsByTagName('iframe');
            setTimeout(function () {
                var iframe1;
                for (var i = 0; i < iframe.length; i++) {
                    if (iframe[i].id.indexOf('edui') != -1) {
                        iframe1 = iframe[i];
                        break;
                    }
                }
                equal(iframe1.contentDocument.getElementById('J_tone').value, '#DDDDDD', '默认边框颜色');
                equal(iframe1.contentDocument.getElementById('J_title').checked, false, '无标题行');
                equal(iframe1.contentDocument.getElementById('J_caption').checked, true, '有名称');
                equal(iframe1.contentDocument.getElementById('J_autoSizePage').checked, true, '页面自适应');
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 300);
        }, 500);
    });
});

/*trace 3315*/
/*trace 3411*/
test('trace 3315：表格隔行变色', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutableBody = document.getElementsByClassName("edui-menu-body")[3];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            equal(menutableBody.childNodes.length, 1, '1个子项目');
            if (browser.gecko) {
                equal(menutableBody.textContent, '表格隔行变色', '检查menu显示的字符');
            }
            else {
                equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), '表格隔行变色', '检查menu显示的字符');
            }
            ua.click(menutableBody.childNodes[0]);
            //        equal(editor.body.getElementsByTagName('table')[0].interlaced,'enabled','表格隔行变色');
            var trs = editor.body.getElementsByTagName('tr');
            for (var i = 0; i < trs.length; i++) {
                if (i % 2 == 0) {
                    equal(trs[i].className, 'ue-table-interlace-color-single', '第' + i + '行：浅色行');
                } else {
                    equal(trs[i].className, 'ue-table-interlace-color-double', '第' + i + '行：深色行');
                }
            }
            range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            menutableBody = document.getElementsByClassName("edui-menu-body")[3];
            forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {
                lang = editor.getLang("contextMenu");
                equal(menutableBody.childNodes.length, 1, '2个子项目');
                if (browser.gecko) {
                    equal(menutableBody.textContent, '取消表格隔行变色', '检查menu显示的字符');
                }
                else {
                    equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), '取消表格隔行变色', '检查menu显示的字符');
                }
                ua.click(menutableBody.childNodes[0]);
                //            equal(editor.body.getElementsByTagName('table')[0].interlaced,'disabled','取消表格隔行变色');
                equal(editor.body.getElementsByTagName('tr')[0].className, '', '取消表格隔行变色');
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 200);
        }, 200);
        stop();
    });
});

test('选区背景隔行', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        var trs = editor.body.firstChild.getElementsByTagName('tr');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[1]);
        ut.setSelected(cellsRange);
        range.setStart(trs[0].cells[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutableBody = document.getElementsByClassName("edui-menu-body")[3];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            equal(menutableBody.childNodes.length, 4, '4个子项目');
            if (browser.gecko) {
                equal(menutableBody.textContent, '表格隔行变色选区背景隔行红蓝相间三色渐变', '检查menu显示的字符');
            }
            else {
                equal(menutableBody.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), '表格隔行变色选区背景隔行红蓝相间三色渐变', '检查menu显示的字符');
            }
            ua.click(menutableBody.childNodes[1]);
            ut.clearSelected();
            trs = editor.body.getElementsByTagName('tr');
            if (ua.browser.ie == 8) {
                equal(trs[0].cells[0].style.backgroundColor, '#bbb', '第一行');
                equal(trs[1].cells[1].style.backgroundColor, '#ccc', '第二行');
            } else {
                equal(trs[0].cells[0].style.backgroundColor, 'rgb(187, 187, 187)', '第一行');
                equal(trs[1].cells[1].style.backgroundColor, 'rgb(204, 204, 204)', '第二行');
            }
            cellsRange = ut.getCellsRange(trs[0].cells[2], trs[1].cells[3]);
            ut.setSelected(cellsRange);
            range.setStart(trs[0].cells[2], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            menutableBody = document.getElementsByClassName("edui-menu-body")[3];
            forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {
                lang = editor.getLang("contextMenu");
                equal(menutableBody.childNodes.length, 4, '4个子项目');
                ua.click(menutableBody.childNodes[2]);
                ut.clearSelected();
                trs = editor.body.getElementsByTagName('tr');
                equal(trs[0].cells[2].style.backgroundColor, 'red', '第一行');
                equal(trs[1].cells[3].style.backgroundColor, 'blue', '第二行');
                ut = editor.getUETable(editor.body.firstChild);
                cellsRange = ut.getCellsRange(trs[0].cells[0], trs[1].cells[3]);
                ut.setSelected(cellsRange);
                range.setStart(trs[0].cells[0], 0).collapse(true).select();
                ua.contextmenu(editor.body.firstChild);
                menutableBody = document.getElementsByClassName("edui-menu-body")[3];
                forTable = document.getElementsByClassName('edui-for-table');
                if (ua.browser.ie) {
                    ua.mouseenter(forTable[forTable.length - 1]);
                } else {
                    ua.mouseover(forTable[forTable.length - 1]);
                }
                setTimeout(function () {
                    lang = editor.getLang("contextMenu");
                    ua.click(menutableBody.childNodes[2]);
                    trs = editor.body.getElementsByTagName('tr');
                    equal(trs[1].cells[2].style.backgroundColor, '', '取消背景隔行');
                    setTimeout(function () {
                        document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                        UE.delEditor('ue');
                        start();
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    });
});

test('三色渐变', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        var tds = editor.body.getElementsByTagName('td');
        var ut = editor.getUETable(editor.body.firstChild);
        var cellsRange = ut.getCellsRange(tds[0], tds[16]);
        ut.setSelected(cellsRange);
        range.setStart(tds[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[3];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        ua.click(menutable.childNodes[3]);
        ut.clearSelected();
        tds = editor.body.getElementsByTagName('td');
        if (ua.browser.ie == 8) {
            equal(tds[0].style.backgroundColor, '#aaa', '第一行');
            equal(tds[6].style.backgroundColor, '#bbb', '第二行');
            equal(tds[11].style.backgroundColor, '#ccc', '第二行');
        } else {
            equal(tds[0].style.backgroundColor, 'rgb(170, 170, 170)', '第一行');
            equal(tds[6].style.backgroundColor, 'rgb(187, 187, 187)', '第二行');
            equal(tds[11].style.backgroundColor, 'rgb(204, 204, 204)', '第二行');
        }
        setTimeout(function () {
            document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
            UE.delEditor('ue');
            start();
        }, 20);
    });
});

test('表格逆序当前', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
        editor.setContent(html);
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[2];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        editor.ready(function () {
            lang = editor.getLang("contextMenu");
            equal(menutable.childNodes.length, 5, '5个子项目');
            if (browser.gecko) {
                equal(menutable.textContent, '逆序当前按ASCII字符升序按ASCII字符降序按数值大小升序按数值大小降序', '检查menu显示的字符');
            }
            else {
                equal(menutable.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), '逆序当前按ASCII字符升序按ASCII字符降序按数值大小升序按数值大小降序', '检查menu显示的字符');
            }
            ua.click(menutable.childNodes[0]);
            equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '表格内容逆序-选区闭合');
            var tds = editor.body.getElementsByTagName('td');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(tds[0], tds[6]);
            ut.setSelected(cellsRange);
            range.setStart(tds[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            menutable = document.getElementsByClassName("edui-menu-body")[2];
            forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            editor.ready(function () {
                lang = editor.getLang("contextMenu");
                ua.click(menutable.childNodes[0]);
                equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td class=\" selecttdclass\">ackson</td><td>4</td><td>承祜</td></tr><tr><td class=\" selecttdclass\">{}</td><td>2</td><td>胤礼</td></tr><tr><td class=\" selecttdclass\">&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '表格内容逆序-选区不闭合');
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 20);
            });
        });
    });
});

test('按ASCII字符排序', function () {
    if(ua.browser.ie||ua.browser.gecko)return;////todo 1.2.6.1 #3316
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
        editor.setContent(html);
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[2];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[1]);
            equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '选区闭合');
            var tds = editor.body.getElementsByTagName('td');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(tds[0], tds[6]);
            ut.setSelected(cellsRange);
            range.setStart(tds[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            menutable = document.getElementsByClassName("edui-menu-body")[2];
            forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {
                lang = editor.getLang("contextMenu");
                ua.click(menutable.childNodes[2]);
                equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td class=\" selecttdclass\">ackson</td><td>4</td><td>承祜</td></tr><tr><td class=\" selecttdclass\">{}</td><td>2</td><td>胤礼</td></tr><tr><td class=\" selecttdclass\">&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>michael</td><td>1</td><td>康熙</td></tr></tbody></table>', '表格内容逆序-选区不闭合');
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 200);
        }, 200);
    });
});
test('按数值大小排序', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
        editor.setContent(html);
        range.setStart(editor.body.getElementsByTagName('td')[1], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[2];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[3]);
            equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td>michael</td><td>1</td><td>康熙</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区闭合');

            setTimeout(function () {
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                UE.delEditor('ue');
                start();
            }, 200);
        }, 200);
    });
});
test('trace 3384：按数值大小排序', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        var html = '<table><tbody><tr><td>Michael</td><td>1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr></tbody></table>';
        editor.setContent(html);
        range.setStart(editor.body.getElementsByTagName('td')[1], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[2];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[3]);
            equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td>michael</td><td>1</td><td>康熙</td></tr><tr><td>{}</td><td>2</td><td>胤礼</td></tr><tr><td>&amp;*</td><td>3</td><td>襄嫔</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区闭合');
            var tds = editor.body.getElementsByTagName('td');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(tds[1], tds[7]);
            ut.setSelected(cellsRange);
            range.setStart(tds[1], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            menutable = document.getElementsByClassName("edui-menu-body")[2];
            forTable = document.getElementsByClassName('edui-for-table');

            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            setTimeout(function () {

                lang = editor.getLang("contextMenu");
                ua.click(menutable.childNodes[4]);
                // todo 1.2.6.1 trace 3510
                if(!ua.browser.gecko){
                    equal(ua.getChildHTML(editor.body), '<table><tbody><tr><td>&amp;*</td><td class=\" selecttdclass\">3</td><td>襄嫔</td></tr><tr><td>{}</td><td class=\" selecttdclass\">2</td><td>胤礼</td></tr><tr><td>michael</td><td class=\" selecttdclass\">1</td><td>康熙</td></tr><tr><td>ackson</td><td>4</td><td>承祜</td></tr></tbody></table>', '选区不闭合');
                }
                setTimeout(function () {
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    UE.delEditor('ue');
                    start();
                }, 200);
            }, 200);
        }, 200);
    });
});

/*trace 3088*/
test('trace 3088：检查表格属性', function () {
    if (ua.browser.ie >8)return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        editor.execCommand('inserttitle');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        editor.execCommand('insertcaption');
        range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
        editor.execCommand('deletetitle');
        setTimeout(function () {
            range.setStart(editor.body.getElementsByTagName('caption')[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild.firstChild);
            setTimeout(function () {
            var menutable = document.getElementsByClassName("edui-menu-body")[1];
            var forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
                ua.click(menutable.childNodes[6]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
                ua.click(menutable.childNodes[4]);
            }
            lang = editor.getLang("contextMenu");
            setTimeout(function () {
                var iframe = document.getElementsByTagName('iframe');
                var iframe1  ;
                for (var i = 0; i <iframe.length; i++) {
                    if (iframe[i].id && iframe[i].id.indexOf('edui') != -1) {
                        iframe1 = iframe[i];
                        break;
                    }
                }
                equal(iframe1.contentDocument.getElementById('J_title').checked, false, '无标题行');
                equal(iframe1.contentDocument.getElementById('J_caption').checked, true, '有名称');
                range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
                ua.contextmenu(editor.body.firstChild);
                menutable = document.getElementsByClassName("edui-menu-body")[1];
                forTable = document.getElementsByClassName('edui-for-table');
                if (ua.browser.ie) {
                    ua.mouseenter(forTable[forTable.length - 1]);
                } else {
                    ua.mouseover(forTable[forTable.length - 1]);
                }
                lang = editor.getLang("contextMenu");
                ua.click(menutable.childNodes[14]);

                setTimeout(function () {
                    iframe = document.getElementsByTagName('iframe');
                    i = iframe.length - 1;
                    iframe1 = null;
                    for (var i = iframe.length - 1; i > -1; i--) {
                        if (iframe[i].id && iframe[i].id.indexOf('edui') != -1) {
                            iframe1 = iframe[i];
                            break;
                        }
                    }
                    equal(iframe1.contentDocument.getElementById('J_title').checked, false, '无标题行');
                    equal(iframe1.contentDocument.getElementById('J_caption').checked, true, '有名称');
                    setTimeout(function () {
                        document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                        UE.delEditor('ue');
                        start();
                    }, 20);
                }, 200);
            }, 200);
            }, 500);
        }, 500);
    });
});

/*trace 3099*/
test('trace 3099：清除边框颜色', function () {
    if (ua.browser.ie >8 )return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        setTimeout(function () {
            range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            var menutable = document.getElementsByClassName("edui-menu-body")[1];
            var forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[14]);
            var iframe = document.getElementsByTagName('iframe');
            setTimeout(function () {
                var i = iframe.length - 1;
                for (var iframe1 in iframe) {
                    if (iframe[i].id.indexOf('edui') != -1) {
                        iframe1 = iframe[i];
                        break;
                    } else {
                        i--;
                    }
                }
                iframe1.contentDocument.getElementById('J_tone').value = '#ff0000';
                var buttonBody = document.getElementsByClassName('edui-dialog edui-for-edittable edui-default edui-state-centered')[0].firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                ua.click(buttonBody);
                var tds = editor.body.getElementsByTagName('td');
                if (ua.browser.ie == 8)
                    equal(tds[0].style.borderColor, '#ff0000', '边框颜色设置为红色');
                else {
                    equal(tds[0].style.borderColor, 'rgb(255, 0, 0)', '边框颜色设置为红色');
                }

                range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
                ua.contextmenu(editor.body.firstChild);
                menutable = document.getElementsByClassName("edui-menu-body")[1];
                forTable = document.getElementsByClassName('edui-for-table');
                if (ua.browser.ie) {
                    ua.mouseenter(forTable[forTable.length - 1]);
                } else {
                    ua.mouseover(forTable[forTable.length - 1]);
                }
                lang = editor.getLang("contextMenu");
                ua.click(menutable.childNodes[14]);

                iframe = document.getElementsByTagName('iframe');
                setTimeout(function () {
                    i = iframe.length - 1;
                    for (var iframe1 in iframe) {
                        if (iframe[i].id.indexOf('edui') != -1) {
                            iframe1 = iframe[i];
                            break;
                        } else {
                            i--;
                        }
                    }
                    ua.click(iframe1.contentDocument.getElementById('J_tone'));
                    var div_nocolor = document.getElementsByClassName('edui-colorpicker-nocolor');
                    ua.click(div_nocolor[0]);
                    var buttonBody = document.getElementsByClassName('edui-dialog edui-for-edittable edui-default edui-state-centered')[1].firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                    ua.click(buttonBody);
                    tds = editor.body.getElementsByTagName('td');
                    equal(tds[0].style.borderColor, '', '边框颜色被清除');
                    setTimeout(function () {
                        UE.delEditor('ue');
                        document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                        start();
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    });
});

test('标题行中右插入列', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        range.setStart(editor.body.getElementsByTagName('td')[0], 0).collapse(true).select();
        editor.execCommand('inserttitle');
        range.setStart(editor.body.getElementsByTagName('th')[0], 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutable = document.getElementsByClassName("edui-menu-body")[1];
        var forTable = document.getElementsByClassName('edui-for-table');
        if (ua.browser.ie) {
            ua.mouseenter(forTable[forTable.length - 1]);
        } else {
            ua.mouseover(forTable[forTable.length - 1]);
        }
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            equal(menutable.childNodes.length, 12, '12个子项目');
            /*trace 3197：没有后插行选项*/
            var innerText = lang.deletetable + lang.insertcol + lang.insertcolnext + lang.insertcaption + lang.deletetitle + lang.mergeright + lang.edittd + lang.edittable;
            if (browser.gecko) {
                equal(menutable.textContent, innerText, '检查menu显示的字符');
            } else {
                equal(menutable.innerText.replace(/[\r\n\t\u200b\ufeff]/g, ''), innerText, '检查menu显示的字符');
            }
            ua.click(menutable.childNodes[3]);
            equal(editor.body.getElementsByTagName('tr')[0].cells.length, 6, '左插入列后有6列');
            setTimeout(function () {
                UE.delEditor('ue');
                document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                start();
            }, 200);
        });
    });
});

/*trace 3060*/
test('trace 3060：单元格对齐方式', function () {
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var range = new baidu.editor.dom.Range(editor.document);
        var lang = editor.getLang("contextMenu");
        editor.execCommand('cleardoc');
        editor.execCommand('inserttable');
        editor.body.getElementsByTagName('td')[0].innerHTML = 'asd';
        range.setStart(editor.body.firstChild.firstChild.firstChild.firstChild, 0).collapse(true).select();
        ua.contextmenu(editor.body.firstChild);
        var menutableBody = document.getElementsByClassName("edui-for-aligntd")[0];
        setTimeout(function () {
            lang = editor.getLang("contextMenu");
            ua.click(menutableBody.childNodes[0]);
            var div = document.getElementsByClassName('edui-cellalignpicker-body')[0];
            equal(div.childNodes[0].getElementsByTagName('td').length, 9, '9种单元格对齐方式');
            ua.click(div.childNodes[0].childNodes[0].childNodes[1].childNodes[2].firstChild);
            setTimeout(function () {
                var tds = editor.body.getElementsByTagName('td');
                equal(tds[0].align, 'right', '水平居右');
                equal(tds[0].vAlign, 'middle', '垂直居中');
                equal(editor.selection.getRange().startContainer.parentNode.tagName.toLowerCase(), 'td', '光标位于单元格中');
                setTimeout(function () {
                    UE.delEditor('ue');
                    document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                    start();
                }, 20);
            }, 200);
        }, 200);
    });
});

/*trace 3210*/
test('trace 3210：添加单元格背景色', function () {
    if (ua.browser.ie > 8)return;
    var div = document.body.appendChild(document.createElement('div'));
    div.id = 'ue';
    var editor = UE.getEditor('ue');
    stop();
    editor.ready(function () {
        var lang = editor.getLang("contextMenu");
        var range = new baidu.editor.dom.Range(editor.document);
        setTimeout(function () {
            editor.execCommand('cleardoc');
            editor.execCommand('inserttable');
            stop();
            var tds = editor.body.getElementsByTagName('td');
            var ut = editor.getUETable(editor.body.firstChild);
            var cellsRange = ut.getCellsRange(tds[0], tds[6]);
            ut.setSelected(cellsRange);
            range.setStart(tds[0], 0).collapse(true).select();
            ua.contextmenu(editor.body.firstChild);
            var menutable = document.getElementsByClassName("edui-menu-body")[1];
            var forTable = document.getElementsByClassName('edui-for-table');
            if (ua.browser.ie) {
                ua.mouseenter(forTable[forTable.length - 1]);
            } else {
                ua.mouseover(forTable[forTable.length - 1]);
            }
            lang = editor.getLang("contextMenu");
            ua.click(menutable.childNodes[12]);
            var iframe = document.getElementsByTagName('iframe');
            var i = iframe.length - 1;
            for (var iframe1 in iframe) {
                if (iframe[i].id.indexOf('edui') != -1) {
                    iframe1 = iframe[i];
                    break;
                } else {
                    i--;
                }
            }
            setTimeout(function () {
                iframe1.contentDocument.getElementById('J_tone').value = '#ff0000';
                var buttonBody = document.getElementsByClassName('edui-dialog edui-for-edittd edui-default edui-state-centered')[0].firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.firstChild;
                ua.click(buttonBody);
                equal(tds[2].style.backgroundColor, '', '背景色不变');
                if (ua.browser.ie == 8) {
                    equal(tds[0].style.backgroundColor, '#ff0000', '背景色不变');
                    equal(tds[6].style.backgroundColor, '#ff0000', '背景色不变');
                } else {
                    equal(tds[0].style.backgroundColor, 'rgb(255, 0, 0)', '背景色不变');
                    equal(tds[6].style.backgroundColor, 'rgb(255, 0, 0)', '背景色不变');
                }
                setTimeout(function () {
                    editor.execCommand('source');
                    setTimeout(function () {
                        editor.execCommand('source');
                        equal(tds[2].style.backgroundColor, '', '背景色不变');
                        if (ua.browser.ie == 8) {
                            equal(tds[0].style.backgroundColor, '#ff0000', '背景色不变');
                            equal(tds[6].style.backgroundColor, '#ff0000', '背景色不变');
                        } else {
                            equal(tds[0].style.backgroundColor, 'rgb(255, 0, 0)', '背景色不变');
                            equal(tds[6].style.backgroundColor, 'rgb(255, 0, 0)', '背景色不变');
                        }
                        setTimeout(function () {
                            UE.delEditor('ue');
                            document.getElementById('edui_fixedlayer').parentNode.removeChild(document.getElementById('edui_fixedlayer'));
                            start();
                        }, 20);
                    }, 100);
                }, 100);
            }, 500);
        }, 100);
    });
});