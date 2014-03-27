/**
 * undo redo
 * @file
 * @since 1.2.6.1
 */

/**
 * 撤销上一次执行的命令
 * @command undo
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'undo' );
 * ```
 */

/**
 * 重做上一次执行的命令
 * @command redo
 * @method execCommand
 * @param { String } cmd 命令字符串
 * @example
 * ```javascript
 * editor.execCommand( 'redo' );
 * ```
 */

UE.plugins['undo'] = function () {
    var saveSceneTimer;
    var me = this,
        maxUndoCount = me.options.maxUndoCount || 20,
        maxInputCount = me.options.maxInputCount || 20,
        fillchar = new RegExp(domUtils.fillChar + '|<\/hr>', 'gi');// ie会产生多余的</hr>
    var noNeedFillCharTags = {
        ol:1,ul:1,table:1,tbody:1,tr:1,body:1
    };
    var orgState = me.options.autoClearEmptyNode;
    function compareAddr(indexA, indexB) {
        if (indexA.length != indexB.length)
            return 0;
        for (var i = 0, l = indexA.length; i < l; i++) {
            if (indexA[i] != indexB[i])
                return 0
        }
        return 1;
    }

    function compareRangeAddress(rngAddrA, rngAddrB) {
        if (rngAddrA.collapsed != rngAddrB.collapsed) {
            return 0;
        }
        if (!compareAddr(rngAddrA.startAddress, rngAddrB.startAddress) || !compareAddr(rngAddrA.endAddress, rngAddrB.endAddress)) {
            return 0;
        }
        return 1;
    }

    function UndoManager() {
        this.list = [];
        this.index = 0;
        this.hasUndo = false;
        this.hasRedo = false;
        this.undo = function () {
            if (this.hasUndo) {
                if (!this.list[this.index - 1] && this.list.length == 1) {
                    this.reset();
                    return;
                }
                while (this.list[this.index].content == this.list[this.index - 1].content) {
                    this.index--;
                    if (this.index == 0) {
                        return this.restore(0);
                    }
                }
                this.restore(--this.index);
            }
        };
        this.redo = function () {
            if (this.hasRedo) {
                while (this.list[this.index].content == this.list[this.index + 1].content) {
                    this.index++;
                    if (this.index == this.list.length - 1) {
                        return this.restore(this.index);
                    }
                }
                this.restore(++this.index);
            }
        };

        this.restore = function () {
            var me = this.editor;
            var scene = this.list[this.index];
            var root = UE.htmlparser(scene.content.replace(fillchar, ''));
            me.options.autoClearEmptyNode = false;
            me.filterInputRule(root);
            me.options.autoClearEmptyNode = orgState;
            //trace:873
            //去掉展位符
            me.document.body.innerHTML = root.toHtml();
            me.fireEvent('afterscencerestore');
            //处理undo后空格不展位的问题
            if (browser.ie) {
                utils.each(domUtils.getElementsByTagName(me.document,'td th caption p'),function(node){
                    if(domUtils.isEmptyNode(node)){
                        domUtils.fillNode(me.document, node);
                    }
                })
            }

            try{
                var rng = new dom.Range(me.document).moveToAddress(scene.address);
                rng.select(noNeedFillCharTags[rng.startContainer.nodeName.toLowerCase()]);
            }catch(e){}

            this.update();
            this.clearKey();
            //不能把自己reset了
            me.fireEvent('reset', true);
        };

        this.getScene = function () {
            var me = this.editor;
            var rng = me.selection.getRange(),
                rngAddress = rng.createAddress(false,true);
            me.fireEvent('beforegetscene');
            var root = UE.htmlparser(me.body.innerHTML);
            me.options.autoClearEmptyNode = false;
            me.filterOutputRule(root);
            me.options.autoClearEmptyNode = orgState;
            var cont = root.toHtml();
            //trace:3461
            //这个会引起回退时导致空格丢失的情况
//            browser.ie && (cont = cont.replace(/>&nbsp;</g, '><').replace(/\s*</g, '<').replace(/>\s*/g, '>'));
            me.fireEvent('aftergetscene');

            return {
                address:rngAddress,
                content:cont
            }
        };
        this.save = function (notCompareRange,notSetCursor) {
            clearTimeout(saveSceneTimer);
            var currentScene = this.getScene(notSetCursor),
                lastScene = this.list[this.index];

            if(lastScene && lastScene.content != currentScene.content){
                me.trigger('contentchange')
            }
            //内容相同位置相同不存
            if (lastScene && lastScene.content == currentScene.content &&
                ( notCompareRange ? 1 : compareRangeAddress(lastScene.address, currentScene.address) )
                ) {
                return;
            }
            this.list = this.list.slice(0, this.index + 1);
            this.list.push(currentScene);
            //如果大于最大数量了，就把最前的剔除
            if (this.list.length > maxUndoCount) {
                this.list.shift();
            }
            this.index = this.list.length - 1;
            this.clearKey();
            //跟新undo/redo状态
            this.update();

        };
        this.update = function () {
            this.hasRedo = !!this.list[this.index + 1];
            this.hasUndo = !!this.list[this.index - 1];
        };
        this.reset = function () {
            this.list = [];
            this.index = 0;
            this.hasUndo = false;
            this.hasRedo = false;
            this.clearKey();
        };
        this.clearKey = function () {
            keycont = 0;
            lastKeyCode = null;
        };
    }

    me.undoManger = new UndoManager();
    me.undoManger.editor = me;
    function saveScene() {
        this.undoManger.save();
    }

    me.addListener('saveScene', function () {
        var args = Array.prototype.splice.call(arguments,1);
        this.undoManger.save.apply(this.undoManger,args);
    });

//    me.addListener('beforeexeccommand', saveScene);
//    me.addListener('afterexeccommand', saveScene);

    me.addListener('reset', function (type, exclude) {
        if (!exclude) {
            this.undoManger.reset();
        }
    });
    me.commands['redo'] = me.commands['undo'] = {
        execCommand:function (cmdName) {
            this.undoManger[cmdName]();
        },
        queryCommandState:function (cmdName) {
            return this.undoManger['has' + (cmdName.toLowerCase() == 'undo' ? 'Undo' : 'Redo')] ? 0 : -1;
        },
        notNeedUndo:1
    };

    var keys = {
            //  /*Backspace*/ 8:1, /*Delete*/ 46:1,
            /*Shift*/ 16:1, /*Ctrl*/ 17:1, /*Alt*/ 18:1,
            37:1, 38:1, 39:1, 40:1

        },
        keycont = 0,
        lastKeyCode;
    //输入法状态下不计算字符数
    var inputType = false;
    me.addListener('ready', function () {
        domUtils.on(this.body, 'compositionstart', function () {
            inputType = true;
        });
        domUtils.on(this.body, 'compositionend', function () {
            inputType = false;
        })
    });
    //快捷键
    me.addshortcutkey({
        "Undo":"ctrl+90", //undo
        "Redo":"ctrl+89" //redo

    });
    var isCollapsed = true;
    me.addListener('keydown', function (type, evt) {

        var me = this;
        var keyCode = evt.keyCode || evt.which;
        if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
            if (inputType)
                return;

            if(!me.selection.getRange().collapsed){
                me.undoManger.save(false,true);
                isCollapsed = false;
                return;
            }
            if (me.undoManger.list.length == 0) {
                me.undoManger.save(true);
            }
            clearTimeout(saveSceneTimer);
            function save(cont){
                cont.undoManger.save(false,true);
                cont.fireEvent('selectionchange');
            }
            saveSceneTimer = setTimeout(function(){
                if(inputType){
                    var interalTimer = setInterval(function(){
                        if(!inputType){
                            save(me);
                            clearInterval(interalTimer)
                        }
                    },300)
                    return;
                }
                save(me);
            },200);

            lastKeyCode = keyCode;
            keycont++;
            if (keycont >= maxInputCount ) {
                save(me)
            }
        }
    });
    me.addListener('keyup', function (type, evt) {
        var keyCode = evt.keyCode || evt.which;
        if (!keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey) {
            if (inputType)
                return;
            if(!isCollapsed){
                this.undoManger.save(false,true);
                isCollapsed = true;
            }
        }
    });
    //扩展实例，添加关闭和开启命令undo
    me.stopCmdUndo = function(){
        me.__hasEnterExecCommand = true;
    };
    me.startCmdUndo = function(){
        me.__hasEnterExecCommand = false;
    }
};
