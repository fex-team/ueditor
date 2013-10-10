
UE.plugins['autosave'] = function(){

    var me = this,
        lastSaveTime = null;

    me.setOpt( {
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

            }

        };

        function getUserData () {

            var container = document.createElement( "div" );
            container.style.display = "none";

            if( !container.addBehavior ) {
                return null;
            }

            document.body.appendChild( container );
            container.addBehavior("#default#userdata");

            return {

                getItem: function ( key ) {

                    try {
                        container.load( LOCAL_FILE );
                        return container.getAttribute( key );
                    } catch ( e ) {
                        return null;
                    }

                },

                setItem: function ( key, value ) {

                    container.setAttribute( key, value );
                    container.save( LOCAL_FILE );

                }

            };

        }

    } )();

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