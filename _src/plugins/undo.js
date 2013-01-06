///import core
///commands 撤销和重做
///commandsName  Undo,Redo
///commandsTitle  撤销,重做
/**
 * @description 回退
 * @author zhanyi
 */

UE.plugins['undo'] = function() {
    var me = this,
        maxUndoCount = me.options.maxUndoCount || 20,
        maxInputCount = me.options.maxInputCount || 20,
        fillchar = new RegExp(domUtils.fillChar + '|<\/hr>','gi'),// ie会产生多余的</hr>
        //在比较时，需要过滤掉这些属性
        specialAttr = /\b(?:href|src|name)="[^"]*?"/gi;

    function compareAddr(indexA,indexB){
        if(indexA.length != indexB.length)
            return 0;
        for(var i= 0,l=indexA.length;i<l;i++){
            if(indexA[i]!=indexB[i])
                return 0
        }
        return 1;
    }
    function compareRangeAddress(rngAddrA,rngAddrB){
        if(rngAddrA.collapsed != rngAddrB.collapsed){
            return 0;
        }
        if(!compareAddr(rngAddrA.startAddress,rngAddrB.startAddress) || !compareAddr(rngAddrA.endAddress,rngAddrB.endAddress)){
            return 0;
        }
        return 1;
    }

    function UndoManager() {
        this.list = [];
        this.index = 0;
        this.hasUndo = false;
        this.hasRedo = false;
        this.undo = function() {
            if ( this.hasUndo ) {
                var currentScene = this.getScene(),
                    lastScene = this.list[this.index];
                var lastContent = lastScene.content.replace(specialAttr,'')
                        .replace(/([\w\-]*?)\s*=\s*(("([^"]*)")|('([^']*)')|([^\s>]+))/gi,function(a,b,c){
                            return b.toLowerCase() + '=' + c.replace(/['"]/g,'').toLowerCase()})
                        .replace(/(<[\w\-]+)|([\w\-]+>)/gi,function(a,b,c){
                            return (b||c).toLowerCase()
                        }),
                    currentContent = currentScene.content.replace(specialAttr,'')
                        .replace(/([\w\-]*?)\s*=\s*(("([^"]*)")|('([^']*)')|([^\s>]+))/gi,function(a,b,c){return b.toLowerCase() + '=' + c.replace(/['"]/g,'').toLowerCase()})
                        .replace(/(<[\w\-]+)|([\w\-]+>)/gi,function(a,b,c){
                            return (b||c).toLowerCase()
                        });
                if ( lastContent != currentContent ) {
                    this.save();
                }
                if(!this.list[this.index - 1] && this.list.length == 1){
                    this.reset();
                    return;
                }
                while ( this.list[this.index].content == this.list[this.index - 1].content ) {
                    this.index--;
                    if ( this.index == 0 ) {
                        return this.restore( 0 );
                    }
                }
                this.restore( --this.index );
            }
        };
        this.redo = function() {
            if ( this.hasRedo ) {
                while ( this.list[this.index].content == this.list[this.index + 1].content ) {
                    this.index++;
                    if ( this.index == this.list.length - 1 ) {
                        return this.restore( this.index );
                    }
                }
                this.restore( ++this.index );
            }
        };

        this.restore = function() {
            var scene = this.list[this.index];
            //trace:873
            //去掉展位符
            me.document.body.innerHTML = scene.bookcontent.replace(fillchar,'');
            //处理undo后空格不展位的问题
            if(browser.ie){
                for(var i=0,pi,ps = me.document.getElementsByTagName('p');pi = ps[i++];){
                    if(pi.innerHTML == ''){
                        domUtils.fillNode(me.document,pi);
                    }
                }
            }
            var range = new dom.Range( me.document );
            //有可能再save时没有bookmark
            try{
                if(scene.address){
                    range.moveToAddress(scene.address)
                }else{
                    range.moveToBookmark( {
                        start : '_baidu_bookmark_start_',
                        end : '_baidu_bookmark_end_',
                        id : true
                        //去掉true 是为了<b>|</b>，回退后还能在b里
                    } );
                }
                range.select();
                if(!(browser.opera || browser.safari)){
                    setTimeout(function(){
                        range.scrollToView(me.autoHeightEnabled,me.autoHeightEnabled ? domUtils.getXY(me.iframe).y:0);
                    },200);
                }

            }catch(e){}

            this.update();

            this.clearKey();
            //不能把自己reset了
            me.fireEvent('reset',true);
        };

        this.getScene = function() {
            me.fireEvent('beforegetscene');
            var range = me.selection.getRange(),
                cont = me.body.innerHTML.replace(fillchar,'');
            //有可能边界落到了<table>|<tbody>这样的位置，所以缩一下位置
            range.shrinkBoundary();
            browser.ie && (cont = cont.replace(/>&nbsp;</g,'><').replace(/\s*</g,'<').replace(/>\s*/g,'>'));
            var rngAddress = range.createAddress(false,true);
//                bookmark = range.createBookmark( true, true ),
//                bookCont = me.body.innerHTML.replace(fillchar,'');
            me.fireEvent('aftergetscene');
            return {
                address : rngAddress,
                content : cont,
                bookcontent : cont
            }
//            if(browser.opera || browser.safari){
//                return {
//                    address : rngAddress,
//                    content : cont,
//                    bookcontent : cont
//                }
//            }else{
//                bookmark && range.moveToBookmark( bookmark ).select( true );
//                return {
//                    bookcontent : bookCont,
//                    content : cont
//                };
//            }

        };
        this.save = function(notCompareRange) {
            var currentScene = this.getScene(),
                lastScene = this.list[this.index];
            //内容相同位置相同不存
            if ( lastScene && lastScene.content == currentScene.content &&
                (
                    notCompareRange ? 1 :
                        ( lastScene.address ? compareRangeAddress(lastScene.address,currentScene.address) : lastScene.bookcontent == currentScene.bookcontent)
                    )
                ) {
                return;
            }
            this.list = this.list.slice( 0, this.index + 1 );
            this.list.push( currentScene );
            //如果大于最大数量了，就把最前的剔除
            if ( this.list.length > maxUndoCount ) {
                this.list.shift();
            }
            this.index = this.list.length - 1;
            this.clearKey();
            //跟新undo/redo状态
            this.update();
        };
        this.update = function() {
            this.hasRedo = this.list[this.index + 1] ? true : false;
            this.hasUndo = this.list[this.index - 1] || this.list.length == 1 ? true : false;
        };
        this.reset = function() {
            this.list = [];
            this.index = 0;
            this.hasUndo = false;
            this.hasRedo = false;
            this.clearKey();
        };
        this.clearKey = function(){
            keycont = 0;
            lastKeyCode = null;
        };
    }

    me.undoManger = new UndoManager();
    function saveScene() {
        this.undoManger.save();
    }

    me.addListener('saveScene',function(){
        me.undoManger.save();
    });

    me.addListener( 'beforeexeccommand', saveScene );
    me.addListener( 'afterexeccommand', saveScene );

    me.addListener('reset',function(type,exclude){
        if(!exclude){
            me.undoManger.reset();
        }
    });
    me.commands['redo'] = me.commands['undo'] = {
        execCommand : function( cmdName ) {
            me.undoManger[cmdName]();
        },
        queryCommandState : function( cmdName ) {
            return me.undoManger['has' + (cmdName.toLowerCase() == 'undo' ? 'Undo' : 'Redo')] ? 0 : -1;
        },
        notNeedUndo : 1
    };

    var keys = {
            //  /*Backspace*/ 8:1, /*Delete*/ 46:1,
            /*Shift*/ 16:1, /*Ctrl*/ 17:1, /*Alt*/ 18:1,
            37:1, 38:1, 39:1, 40:1,
            13:1 /*enter*/
        },
        keycont = 0,
        lastKeyCode;
    //输入法状态下不计算字符数
    var inputType = false;
    me.addListener('ready',function(){
        domUtils.on(me.body,'compositionstart',function(){
            inputType = true;
        });
        domUtils.on(me.body,'compositionend',function(){
            inputType = false;
        })
    });
    //快捷键
    me.addshortcutkey({
        "Undo" :  "ctrl+90",//undo
        "Redo" : "ctrl+89" //redo

    });
    me.addListener( 'keydown', function( type, evt ) {
        var keyCode = evt.keyCode || evt.which;
        if ( !keys[keyCode] && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey && !evt.altKey ) {
            if(inputType)
                return;
            if ( me.undoManger.list.length == 0 || ((keyCode == 8 ||keyCode == 46) && lastKeyCode != keyCode) ) {

                me.fireEvent('contentchange');

                me.undoManger.save(true);
                lastKeyCode = keyCode;
                return;
            }
            //trace:856
            //修正第一次输入后，回退，再输入要到keycont>maxInputCount才能在回退的问题
            if(me.undoManger.list.length == 2 && me.undoManger.index == 0 && keycont == 0){
                me.undoManger.list.splice(1,1);
                me.undoManger.update();
            }
            lastKeyCode = keyCode;
            keycont++;
            if ( keycont >= maxInputCount ) {
                if(me.selection.getRange().collapsed)
                    me.fireEvent('contentchange');
                me.undoManger.save();

            }
        }
    } );
};
