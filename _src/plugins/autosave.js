UE.plugin.register('autosave', function (){

    var me = this,
        lastSaveTime = null,
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

                clear: function () {

                    var expiresTime = new Date();
                    expiresTime.setFullYear( expiresTime.getFullYear() - 1 );
                    document.body.appendChild( container );
                    container.expires = expiresTime.toUTCString();
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                },

                removeItem: function ( key ) {

                    document.body.appendChild( container );
                    container.removeAttribute( key );
                    container.save( LOCAL_FILE );
                    document.body.removeChild( container );

                }

            };

        }

    } )();

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

                var saveData = null;

                if ( !saveKey ) {
                    return;
                }

                if ( me._saveFlag ) {
                    window.clearTimeout( me._saveFlag );
                }

                me._saveFlag = window.setTimeout( function () {

                    me._saveFlag = null;

                    if ( !me.hasContents() ) {
                        //这里不能调用命令来删除， 会造成事件死循环
                        saveKey && LocalStorage.removeItem( saveKey );
                        return;
                    }

                    saveData = me.body.innerHTML;

                    if ( me.fireEvent( "beforeautosave", {
                        content: saveData
                    } ) === false ) {
                        return;
                    }

                    LocalStorage.saveLocalData( saveKey, saveData );

                    lastSaveTime = new Date();
                    me.fireEvent( "afterautosave", {
                        content: saveData
                    } );

                }, me.options.saveInterval );

            }
        },
        commands:{
            'clearlocaldata':{
                execCommand:function (cmd, name) {
                    if ( saveKey && LocalStorage.getLocalData( saveKey ) ) {
                        LocalStorage.removeItem( saveKey )
                    }
                },
                notNeedUndo: true
            },

            'getlocaldata':{
                execCommand:function (cmd, name) {
                    return saveKey ? LocalStorage.getLocalData( saveKey ) : null;
                },
                notNeedUndo: true
            },

            'drafts':{
                execCommand:function (cmd, name) {
                    if ( saveKey ) {
                        me.body.innerHTML = LocalStorage.getLocalData( saveKey );
                        me.focus(true);
                    }
                },
                queryCommandState: function () {
                    return saveKey ? ( LocalStorage.getLocalData( saveKey ) === null ? -1 : 0 ) : -1;
                },
                notNeedUndo: true
            }
        }
    }

});