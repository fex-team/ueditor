/**
 * @file contextmenu.js
 * @import ui.js
 */
    UE.registerEditorWidget('contextmenu', function(){
        var editor = this,
            lang =  editor.getLang( "contextMenu"),
            domutils = UE.dom.domUtils,
            context = editor.options.contextMenu || [
            {label:lang['delete'], cmdName:'delete'},
            {label:lang['selectall'], cmdName:'selectall'},
            {
                label:lang.deletecode,
                cmdName:'highlightcode'
            },
            {
                label:lang.cleardoc,
                cmdName:'cleardoc',
                exec:function () {
                    if ( confirm( lang.confirmclear ) ) {
                        this.execCommand( 'cleardoc' ); //exec中的this代表editor
                    }
                }
            },
            {
                label:lang.unlink,
                cmdName:'unlink'
            },
            '-',
            {
                group:lang.paragraph,
                icon:'justifyjustify',
                subMenu:[
                    {
                        label:this.getLang( "justifyleft" ),
                        cmdName:'justify',
                        value:'left'
                    },
                    {
                        label:this.getLang( "justifyright" ),
                        cmdName:'justify',
                        value:'right'
                    },
                    {
                        label:this.getLang( "justifycenter" ),
                        cmdName:'justify',
                        value:'center'
                    },
                    {
                        label:this.getLang( "justify" ),
                        cmdName:'justify',
                        value:'justify'
                    }
                ]
            },
            '-',
            {
                label:lang.edittable,
                cmdName:'edittable',
                exec:function () {
                    UE.getDialog(this).open("inserttable");
                }
            },
            {
                label:lang.edittd,
                cmdName:'edittd',
                exec:function () {
                    UE.getDialog(this).open("edittd");
                }
            },
            {
                group:lang.table,
                icon:'table',
                subMenu:[
                    {
                        label:lang.deletetable,
                        cmdName:'deletetable'
                    },
                    {
                        label:lang.insertparagraphbeforetable,
                        cmdName:'insertparagraphbeforetable'
                    },
                    '-',
                    {
                        label:lang.deleterow,
                        cmdName:'deleterow'
                    },
                    {
                        label:lang.deletecol,
                        cmdName:'deletecol'
                    },
                    '-',
                    {
                        label:lang.insertrow,
                        cmdName:'insertrow'
                    },
                    {
                        label:lang.insertcol,
                        cmdName:'insertcol'
                    },
                    '-',
                    {
                        label:lang.mergeright,
                        cmdName:'mergeright'
                    },
                    {
                        label:lang.mergedown,
                        cmdName:'mergedown'
                    },
                    '-',
                    {
                        label:lang.splittorows,
                        cmdName:'splittorows'
                    },
                    {
                        label:lang.splittocols,
                        cmdName:'splittocols'
                    },
                    {
                        label:lang.mergecells,
                        cmdName:'mergecells'
                    },
                    {
                        label:lang.splittocells,
                        cmdName:'splittocells'
                    }
                ]
            },
            {
                label:lang['copy'],
                cmdName:'copy',
                exec:function () {
                    alert( lang.copymsg );
                },
                query:function () {
                    return 0;
                }
            },
            {
                label:lang['paste'],
                cmdName:'paste',
                exec:function () {
                    alert( lang.pastemsg );
                },
                query:function () {
                    return 0;
                }
            }
        ];

        function createMenu(items){
            var i= 0,
                contextitems=[],
                len=items.length,
                tmp,
                valid=0;//标识数据项是否有意义，避免根据length判断出现都是'-'的情况
            for(; i<len;){
                tmp = items[i++];
                if(tmp === '-'){
                    contextitems.push('-');
                }else if( tmp.hasOwnProperty("group") ){
                    var submenu = arguments.callee(tmp.subMenu);
                    if(submenu){
                        contextitems.push({
                            submenu:submenu,
                            label:tmp.group || editor.getLang( "contextMenu." + tmp.cmdName ),
                            className:'edui-menu-' + (tmp.icon ? tmp.icon : tmp.cmdName + (tmp.value || ''))
                        });
                    }
                }else if ( (editor.commands[tmp.cmdName] || UE.commands[tmp.cmdName] || tmp.query) &&
                    (tmp.query ? tmp.query() : editor.queryCommandState( tmp.cmdName )) > -1 ) {
                    //highlight todo
                    if ( tmp.cmdName == 'highlightcode' && editor.queryCommandState( tmp.cmdName ) == 0 ) {
                        continue;
                    }
                    contextitems.push( {
                        label:tmp.label || editor.getLang( "contextMenu." + tmp.cmdName ),
                        className:'edui-menu-' + (tmp.icon ? tmp.icon : tmp.cmdName + (tmp.value || '')),
                        onclick: function (tmp) {
                            return function(){
                                tmp.exec ? tmp.exec.call( editor ) : editor.execCommand( tmp.cmdName, tmp.value )
                            };
                        }(tmp)
                    } );
                    valid=1;
                }
            }

            return valid ? new UE.ui.View.Context(contextitems) : null;
        }

        if(context&&context.length>0){
            var topmenu;
            editor.addListener('contextmenu', function(t, evt){
                topmenu && topmenu.dispose();
                editor.fireEvent( 'beforeselectionchange' );

                topmenu = createMenu(context);
                topmenu.show(evt);
                function hideContext(evt){
                    domutils.un(window, 'scroll', hideContext);
                    domutils.un(document, 'mousedown', hideContext);
                    editor.removeListener('click', hideContext);
                    topmenu.dispose();
                }
                domutils.on(window, 'scroll', hideContext);
                domutils.on(document, 'mousedown', hideContext);
                editor.addListener('click', hideContext);

                domutils.preventDefault( evt );
                if ( browser.ie ) {
                    var ieRange;
                    try {
                        ieRange = editor.selection.getNative().createRange();
                    } catch ( e ) {
                        return;
                    }
                    if ( ieRange.item ) {
                        var range = new dom.Range( editor.document );
                        range.selectNode( ieRange.item( 0 ) ).select( true, true );
                    }
                }
            });
        }
    });

