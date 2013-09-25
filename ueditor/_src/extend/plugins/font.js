UE.plugins['font'] = function () {
    var me = this,
        tags = [ 'p', 'h1' , 'h2', 'h3', 'h4', 'h5', 'h6' ],
        cmds = ['bold', 'italic', 'underline', 'forecolor', 'backcolor', 'fontfamily', 'fontsize'],
        className = {'bold':UE.BOLD_FLAG, 'italic':UE.ITALIC_FLAG, 'underline':UE.UNDERLINE_FLAG},
        classSet = {'forecolor': UE.singleColor, 'backcolor': UE.singleBgColor, 'fontfamily': UE.singleFontFamily, 'fontsize': UE.singleFontSize};

    me.ready(function(){
        var styleFore = '', styleBack = '', color, COLORS = (
            'ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0').split(',');
        for(var key in COLORS){
            color = COLORS[key];
            styleFore += '.' + me.options.CLASS_NAME_PREFIX + 'color_' + color + '{color:#' + color + ';}';
            styleBack += '.' + me.options.CLASS_NAME_PREFIX + 'bg-color_' + color + '{background-color:#' + color + ';}';
        }
        utils.cssRule('forecolor',styleFore, me.document);
        utils.cssRule('backcolor',styleBack, me.document);
    });

    for( var key in cmds ){
        var cmdName = cmds[key];
        UE.commands[cmdName] = {
            execCommand: function (cmdName, value) {
                var range = me.selection.getRange(),
                    start = domUtils.findParentByTagName( range.startContainer, tags, true);

                if( !start ) {
                    return;
                }

                if(className[cmdName]){
                    var queryState = me.queryCommandState(cmdName);
                    travel(range, function(node){
                        var classList = node.classList;
                        if(!queryState) {
                            classList.add(className[cmdName]);
                        } else {
                            classList.remove(className[cmdName]);
                        }
                    })
                } else if(classSet[cmdName]) {
                    travel(range, function(node){
                        var classList = node.classList;
                        if(classSet[cmdName]) {
                            for( var key in classSet[cmdName] ) {
                                classList.remove( classSet[cmdName][ key ] );
                            }
                        }
                        if(classSet[cmdName][value]){
                            classList.add(classSet[cmdName][value]);
                        }
                    })
                }

                function travel(range, callback){
                    var current = domUtils.findParentByTagName( range.startContainer, tags, true);

                    if(range.collapsed){
                        callback(current);
                    }else{
                        while (current && domUtils.getPosition(range.endContainer,current)&domUtils.POSITION_FOLLOWING ) {
                            callback(current);
                            next = domUtils.getNextDomNode(current, true, function (node) {
                                return node.nodeType == 1;
                            });
                            current = next;
                        }

                    }
                }
                return true;
            },
            queryCommandValue: function (cmdName) {
                var start = domUtils.findParentByTagName( me.selection.getStart(), tags, true);
                if(start && classSet[cmdName]){
                    for( var key in classSet[cmdName] ){
                        if(domUtils.hasClass(start, classSet[cmdName][key])) {
                            return key;
                        }
                    }
                }
                return  '';
            },
            queryCommandState: function (cmdName) {
                var start = domUtils.findParentByTagName( me.selection.getStart(), tags, true);
                if(start && className[cmdName] && domUtils.hasClass(start, className[cmdName]) ){
                    return 1;
                }
                return  0;
            }
        };
    }
};