UE.plugin.register('autosave', function (){

    var me = this,
        //无限循环保护
        lastSaveTime = new Date(),
        //最小保存间隔时间
        MIN_TIME = 20,
        //auto save key
        saveKey = null;

    //存储媒介封装
    var LocalStorage = UE.LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage";

        return {

            saveLocalData: function ( key, data ) {

                if ( storage && data) {
                    storage.setItem( key, data  );
                    return true;
                }

                return false;

            },

            getLocalData: function ( key ) {

                if ( storage ) {
                    return storage.getItem( key );
                }

                return null;

            },

            removeItem: function ( key ) {

                storage && storage.removeItem( key );

            }

        };

        function getUserData () {

            var container = document.createElement( "div" );
            container.style.display = "none";

            if( !container.addBehavior ) {
                return null;
            }

            container.addBehavior("#default#userdata");

            return {

                getItem: function ( key ) {

                    var result = null;

                    try {
                        document.body.appendChild( container );
                        container.load( LOCAL_FILE );
                        result = container.getAttribute( key );
                        document.body.removeChild( container );
                    } catch ( e ) {
                    }

                    return result;

                },

                setItem: function ( key, value ) {

                    document.body.appendChild( container );
                    container.setAttribute( key, value );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                },
//               暂时没有用到
//                clear: function () {
//
//                    var expiresTime = new Date();
//                    expiresTime.setFullYear( expiresTime.getFullYear() - 1 );
//                    document.body.appendChild( container );
//                    container.expires = expiresTime.toUTCString();
//                    container.save( LOCAL_FILE );
//                    document.body.removeChild( container );
//
//                },

                removeItem: function ( key ) {

                    document.body.appendChild( container );
                    container.removeAttribute( key );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                }

            };

        }

    } )();

    function save ( editor ) {

        var saveData = null;

        if ( new Date() - lastSaveTime < MIN_TIME ) {
            return;
        }

        if ( !editor.hasContents() ) {
            //这里不能调用命令来删除， 会造成事件死循环
            saveKey && LocalStorage.removeItem( saveKey );
            return;
        }

        lastSaveTime = new Date();

        editor._saveFlag = null;

        saveData = me.body.innerHTML;

        if ( editor.fireEvent( "beforeautosave", {
            content: saveData
        } ) === false ) {
            return;
        }

        LocalStorage.saveLocalData( saveKey, saveData );

        editor.fireEvent( "afterautosave", {
            content: saveData
        } );

    }

    return {
        defaultOptions: {
            //默认间隔时间
            saveInterval: 500
        },
        bindEvents:{
            'ready':function(){

                var _suffix = "-drafts-data",
                    key = null;

                if ( me.key ) {
                    key = me.key + _suffix;
                } else {
                    key = ( me.container.parentNode.id || 'ue-common' ) + _suffix;
                }

                //页面地址+编辑器ID 保持唯一
                saveKey = ( location.protocol + location.host + location.pathname ).replace( /[.:\/]/g, '_' ) + key;

            },

            'contentchange': function () {

                if ( !saveKey ) {
                    return;
                }

                if ( me._saveFlag ) {
                    window.clearTimeout( me._saveFlag );
                }

                if ( me.options.saveInterval > 0 ) {

                    me._saveFlag = window.setTimeout( function () {

                        save( me );

                    }, me.options.saveInterval );

                } else {

                    save(me);

                }


            }
        },
        commands:{
            'clearlocaldata':{
                execCommand:function (cmd, name) {
                    if ( saveKey && LocalStorage.getLocalData( saveKey ) ) {
                        LocalStorage.removeItem( saveKey )
                    }
                },
                notNeedUndo: true,
                ignoreContentChange:true
            },

            'getlocaldata':{
                execCommand:function (cmd, name) {
                    return saveKey ? LocalStorage.getLocalData( saveKey ) || '' : '';
                },
                notNeedUndo: true,
                ignoreContentChange:true
            },

            'drafts':{
                execCommand:function (cmd, name) {
                    if ( saveKey ) {
                        me.body.innerHTML = LocalStorage.getLocalData( saveKey ) || '<p>'+(browser.ie ? '&nbsp;' : '<br/>')+'</p>';
                        me.focus(true);
                    }
                },
                queryCommandState: function () {
                    return saveKey ? ( LocalStorage.getLocalData( saveKey ) === null ? -1 : 0 ) : -1;
                },
                notNeedUndo: true,
                ignoreContentChange:true
            }
        }
    }

});