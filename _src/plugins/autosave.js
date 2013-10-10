
UE.plugins['autosave'] = function(){

    var me = this,
        lastSaveTime = null,
        //auto save key
        saveKey = me.container.id + "data";

    me.setOpt( {
        //默认启用自动保存
        enableAutoSave: true,
        //默认间隔时间
        saveInterval: 1000*60
    } );

    //存储媒介封装
    var LocalStorage = UE.LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage";

        return {

            saveLocalData: function ( key, data ) {

                if ( storage ) {
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

    if ( !me.options.enableAutoSave ) {
        return;
    }

    //command
    me.commands['clearlocaldata'] = {

        execCommand:function (cmd, name) {
            LocalStorage.removeItem( saveKey );
        },
        notNeedUndo: true

    };

    me.commands['getlocaldata'] = {

        execCommand:function (cmd, name) {
            return LocalStorage.getLocalData( saveKey );
        },
        notNeedUndo: true

    };

    //从草稿箱加载数据
    me.commands['drafts'] = {

        execCommand:function (cmd, name) {
            me.body.innerHTML = LocalStorage.getLocalData( saveKey );
            me.focus(true);
        },
        queryCommandState: function () {
            return LocalStorage.getLocalData( saveKey ) === null ? -1 : 0;
        },
        notNeedUndo: true

    };

    //开始监听
    me.addListener( "contentchange", function () {

        var saveData = null;

        if ( lastSaveTime && ( new Date() - lastSaveTime < me.options.saveInterval ) ) {
            return;
        }

        saveData = me.body.innerHTML;

        if ( me.fireEvent( "autosavebefore", {
            content: saveData
        } ) === false ) {
            return;
        }

        LocalStorage.saveLocalData( saveKey, saveData );

        lastSaveTime = new Date();
        me.fireEvent( "autosaveafter", {
            content: saveData
        } );

    } );

};