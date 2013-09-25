///import core
///import plugins\inserthtml.js
///commands 插入图片，操作图片的对齐方式
///commandsName  InsertImage,ImageNone,ImageLeft,ImageRight,ImageCenter
///commandsTitle  图片,默认,居左,居右,居中
///commandsDialog  dialogs\image
/**
 * Created by .
 * User: zhanyi
 * for image
 */

UE.commands['imagefloat'] = {
    execCommand: function (cmd, align) {
        var me = this,
            range = me.selection.getRange(),
            classSet = UE.singleImageFloat,
            img = range.getClosedNode();
        if (!range.collapsed && img && img.tagName == 'IMG') {
            var start = domUtils.findParentByTagName(me.selection.getStart(), ['p'], true);
            if (start) {
                for (var key in classSet) {
                    start.classList.remove(classSet[ key ]);
                }
                if (classSet[align]) start.classList.add(classSet[align]);
            }
        }
    },
    queryCommandValue: function () {
        var range = this.selection.getRange(),
            classSet = UE.singleImageFloat,
            img = range.getClosedNode();
        if (!range.collapsed && img && img.tagName == 'IMG') {
            var start = domUtils.findParentByTagName(this.selection.getStart(), ['p'], true);
            if (start) {
                for (var key in classSet) {
                    if (domUtils.hasClass(start, classSet[key])) {
                        return key;
                    }
                }
            }
        }
        return 'none';
    },
    queryCommandState: function () {
        var range = this.selection.getRange(),
            startNode,
            closeNode = range.getClosedNode();

        if (range.collapsed)  return -1;
        var parNode = domUtils.findParentByTagName(this.selection.getStart(), ['p'], true);
        if (parNode && domUtils.hasClass(parNode, UE.PICNOTE_FLAG)) return -1;
        if (closeNode && closeNode.getAttribute('data-remark')) return -1;

        startNode = range.getClosedNode();
        if (startNode && startNode.nodeType == 1 && startNode.tagName == 'IMG') {
            return 0;
        }
        return -1;
    }
};

UE.commands['insertimage'] = {
    execCommand: function (cmd, opt, flag) {

        opt = utils.isArray(opt) ? opt : [opt];
        if (!opt.length) {
            return;
        }
        var me = this,
            range = me.selection.getRange(),
            img = range.getClosedNode(),
            tags = [ 'p', 'h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ];


        var key, html = [], str, ci, parNode = domUtils.findParentByTagName(range.startContainer, tags, true);
        if (parNode) {
            range.setStartBefore(parNode).setCursor(false, true);
            parNode.classList.remove(UE.PICNOTE_FLAG);
            for (key in UE.singleImageFloat) {
                parNode.classList.remove(UE.singleImageFloat[key]);
            }
        }

        for (key in opt) {
            ci = opt[key];
            str = '<img ' + (flag ? 'flag="' + ((flag=='float'&&!ci.imageFloat) ? 'single':flag) + '"' : '') + ' ' +
                'src="' + ci.src + '" ' +
                (ci._src ? ' _src="' + ci._src + '" ' : '') +
                (ci.width ? 'width="' + ci.width + '" ' : '') +
                (ci.height ? ' height="' + ci.height + '" ' : '') +
                (ci.title && ci.title != "" ? ' title="' + ci.title + '"' : '') +
                (ci.border && ci.border != "0" ? ' border="' + ci.border + '"' : '') +
                (ci.alt && ci.alt != "" ? ' alt="' + ci.alt + '"' : '') +
                (ci.hspace && ci.hspace != "0" ? ' hspace = "' + ci.hspace + '"' : '') +
                (ci.vspace && ci.vspace != "0" ? ' vspace = "' + ci.vspace + '"' : '') + '/>';

            switch (flag) {
                case 'float':
                    var imageClass = UE.singleImageFloat[ci.imageFloat],
                        imageText = ci.imageFloatText || '';

                    if (imageClass) {
                        if (!imageText && parNode) {
                            imageText = parNode.innerText || parNode.textContent;
                            domUtils.remove(parNode);
                        }
                        str = '<p class="' + parNode.className + ' ' + (imageClass ? imageClass : '') + '">' +
                            str +
                            '<span>' + imageText + '</span>'
                        '</p>';
                    } else {
                        str = '<p class="' + parNode.className + '">' + str + '</p>';
                    }
                    break;
                case 'cover':
                    str = '<h2>' + str + '</h2>';
                    break;
                case 'note':
                    var imageClass = UE.PICNOTE_FLAG,
                        imageText = ci.legendText || '',
                        notePosClass = UE.singlePicNotePos[ci.legendPosition] || '',
                        noteDirClass = UE.singlePicNoteDir[ci.legendDirection] || '';

                    if (!imageText && parNode) {
                        imageText = parNode.innerText || parNode.textContent;
                        domUtils.remove(parNode);
                    }
                    if (imageClass) {
                        str = '<p class="' + parNode.className + ' ' + (imageClass ? imageClass : '') + '">' +
                            (notePosClass == UE.PICNOTE_TOP_FLAG ? '<span class="' + notePosClass + ' ' + noteDirClass + '">' + imageText + '</span>' + str :
                                str + '<span class="' + notePosClass + ' ' + noteDirClass + '">' + imageText + '</span>') +
                            '</p>';
                    }
                    break;
                default:
                    str = '<p>' + str + '</p>';
                    break;
            }

            html.push(str);
            flag = 'single';
        }
        if (img && /img/i.test(img.tagName) && parNode.parentNode) domUtils.remove(parNode);
        me.execCommand('insertHtml', html.join(''));

//        }
    }
};