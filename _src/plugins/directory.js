UE.plugins['directory'] = function () {

    // 目录节点对象
    function Section(option){
        this.tag = '';
        this.level = -1,
        this.dom = null;
        this.nextSection = null;
        this.previousSection = null;
        this.parentSection = null;
        this.startAddress = [];
        this.endAddress = [];
        this.children = [];
    }
    function getSection(option) {
        var section = new Section();
        return utils.extend(section, option);
    }
    function getNodeFromAddress(startAddress, root) {
        var current = root;
        for(var i = 0;i < startAddress.length; i++) {
            if(!current.childNodes) return null;
            current = current.childNodes[startAddress[i]];
        }
        return current;
    }

    var me = this;

    // 监听编辑器操作，触发updateSections事件
    me.addListener('ready drop paste afterexecCommand keydown', function (type, e, cmd) {
        var me= this;

        switch(type){
            // 键盘按下
            case 'keydown':
                var me = this,
                    range = me.selection.getRange();
                if(range.collapsed != true) {
                    me.fireEvent('updateSections');
                } else {
                    var keyCode = e.keyCode || e.which;
                    if(keyCode == 13 || keyCode == 8 || keyCode == 48) {
                        me.fireEvent('updateSections');
                    }
                }
                break;
            // 执行paragraph命令之后
            case 'afterexecCommand':
                if(cmd == 'paragraph') {
                    me.fireEvent('paragraph');
                }
                break;
            // 编辑器加载完成、拖拽和粘贴
            case 'ready':
            case 'drop':
            case 'paste':
                me.fireEvent('updateSections');
                break;
        }

    });

    me.commands['getsection'] = {
        execCommand: function (cmd, levels) {
            var levelFn = levels || ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

            for (var i = 0; i < levelFn.length; i++) {
                if (typeof levelFn[i] == 'string') {
                    levelFn[i] = function(fn){
                        return function(node){
                            return node.tagName == fn.toUpperCase()
                        };
                    }(levelFn[i]);
                } else if (typeof levelFn[i] != 'function') {
                    levelFn[i] = function (node) {
                        return null;
                    }
                }
            }
            function getSectionLevel(node) {
                for (var i = 0; i < levelFn.length; i++) {
                    if (levelFn[i](node)) return i;
                }
                return -1;
            }

            var me = this,
                Directory = getSection({'level':-1, 'title':'root'}),
                previous = Directory;

            function traversal(node, Directory) {
                var level,
                    tmpSection = null,
                    parent,
                    child,
                    children = node.childNodes;
                for (var i = 0, len = children.length; i < len; i++) {
                    child = children[i];
                    level = getSectionLevel(child);
                    if (level >= 0) {
                        var address = me.selection.getRange().selectNode(child).createAddress(true).startAddress,
                            current = getSection({
                                'tag': child.tagName,
                                'title': child.innerHTML,
                                'level': level,
                                'dom': child,
                                'startAddress': utils.clone(address, []),
                                'endAddress': utils.clone(address, []),
                                'children': []
                            });
                        previous.nextSection = current;
                        current.previousSection = previous;
                        parent = previous;
                        while(level <= parent.level){
                            parent = parent.parentSection;
                        }
                        current.parentSection = parent;
                        parent.children.push(current);
                        tmpSection = previous = current;
                    } else {
                        child.nodeType === 1 && traversal(child, Directory);
                        tmpSection && tmpSection.endAddress[tmpSection.endAddress.length - 1] ++;
                    }
                }
            }
            traversal(me.body, Directory);
            return Directory;
        }
    };

    me.commands['movesection'] = {
        execCommand: function (cmd, sourceSection, targetSection, isAfter) {
            var me = this,
                targetAddress = targetSection.startAddress,
                target = getNodeFromAddress(targetAddress, me.body);
            if(!targetAddress || !target || isContainsAddress(sourceSection.startAddress, sourceSection.endAddress, targetAddress)) return false;

            var startNode = getNodeFromAddress(sourceSection.startAddress, me.body),
                endNode = getNodeFromAddress(sourceSection.endAddress, me.body),
                current = startNode,
                nextNode;

            while ( current && !(domUtils.getPosition( current, endNode ) & domUtils.POSITION_FOLLOWING) ) {
                nextNode = current.nextSibling;
                target.parentNode.insertBefore(current, target);
                if(current == endNode) break;
                current = nextNode;
            }

            me.fireEvent('updateSections');

            /* 获取地址的包含关系 */
            function isContainsAddress(startAddress, endAddress, addressTarget){
                var isAfterStartAddress = false,
                    isBeforeEndAddress = false;
                for(var i = 0; i< startAddress.length; i++){
                    if(i >= addressTarget.length) break;
                    if(addressTarget[i] > startAddress[i]) {
                        isAfterStartAddress = true;
                        break;
                    } else if(addressTarget[i] < startAddress[i]) {
                        break;
                    }
                }
                for(var i = 0; i< endAddress.length; i++){
                    if(i >= addressTarget.length) break;
                    if(addressTarget[i] < startAddress[i]) {
                        isBeforeEndAddress = true;
                        break;s
                    } else if(addressTarget[i] > startAddress[i]) {
                        break;
                    }
                }
                return isAfterStartAddress && isBeforeEndAddress;
            }
        }
    };

    me.commands['deletesection'] = {
        execCommand: function (cmd, section, keepChildren) {
            var me = this;

            if(!section) return;

            function getNodeFromAddress(startAddress) {
                var current = me.body;
                for(var i = 0;i < startAddress.length; i++) {
                    if(!current.childNodes) return null;
                    current = current.childNodes[startAddress[i]];
                }
                return current;
            }

            var startNode = getNodeFromAddress(section.startAddress),
                endNode = getNodeFromAddress(section.endAddress),
                current = startNode,
                nextNode;

            if(!keepChildren) {
                while ( current && endNode.parentNode && !(domUtils.getPosition( current, endNode ) & domUtils.POSITION_FOLLOWING) ) {
                    nextNode = current.nextSibling;
                    domUtils.remove(current);
                    current = nextNode;
                }
            } else {
                domUtils.remove(current);
            }

            me.fireEvent('updateSections');
        }
    };

    me.commands['selectsection'] = {
        execCommand: function (cmd, section, noScroll) {
            if(!section && !section.dom) return false;
            var me = this,
                range = me.selection.getRange(),
                address = {
                    'startAddress':utils.clone(section.startAddress, []),
                    'endAddress':utils.clone(section.endAddress, [])
                };
            address.endAddress[address.endAddress.length - 1]++;
            range.moveToAddress(address).select();
            if(!noScroll) range.scrollToView(me.options.autoHeightEnabled ? window:me.window);
            return true;
        }
    };

    me.commands['scrolltosection'] = {
        execCommand: function (cmd, section) {
            if(!section && !section.dom) return false;
            var me = this,
                range = me.selection.getRange(),
                address = {
                    'startAddress':section.startAddress,
                    'endAddress':section.endAddress
                };
            address.endAddress[address.endAddress.length - 1]++;
            range.moveToAddress(address).scrollToView();
            return true;
        }
    };


};