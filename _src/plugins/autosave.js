
UE.plugins['autosave'] = function(){

    var me = this,
        lastSaveTime = null;

    me.setOpt( {
        //默认启用自动保存
        enableAutoSave: true,
        //默认间隔时间
        saveInterval: 1000*60
    } );

    //存储媒介封装
    var LocalStorage = UE.LocalStorage = ( function () {

        var storage = window.localStorage || getUserData() || null,
            LOCAL_FILE = "localStorage",
            saveKey = "ueditor-localdata";

        return {

            saveLocalData: function ( data ) {

                if ( storage ) {

                    storage.setItem( saveKey, data  );
                    return true;

                }

                return false;

            },

            getLocalData: function () {

                if ( storage ) {
                    return storage.getItem( saveKey ) || "";
                }

                return "";

            },

            clear: function () {

                storage && storage.clear();

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
            LocalStorage.clear();
        }

    };

    me.commands['getlocaldata'] = {

        execCommand:function (cmd, name) {
            return LocalStorage.getLocalData();
        }

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

        LocalStorage.saveLocalData( saveData );

        lastSaveTime = new Date();
        me.fireEvent( "autosaveafter", {
            content: saveData
        } );

    } );

    //自动记录
    me.ready( function () {

        me.body.innerHTML = LocalStorage.getLocalData() || "";

    } );

};