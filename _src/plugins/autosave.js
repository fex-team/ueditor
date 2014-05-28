UE.plugin.register('autosave', function (){

    var me = this,
        //无限循环保护
        lastSaveTime = new Date(),
        //最小保存间隔时间
        MIN_TIME = 20,
        //auto save key
        saveKey = null;

    function save ( editor ) {

        var saveData;

        if ( new Date() - lastSaveTime < MIN_TIME ) {
            return;
        }

        if ( !editor.hasContents() ) {
            //这里不能调用命令来删除， 会造成事件死循环
            saveKey && me.removePreferences( saveKey );
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

        me.setPreferences( saveKey, saveData );

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
                    if ( saveKey && me.getPreferences( saveKey ) ) {
                        me.removePreferences( saveKey )
                    }
                },
                notNeedUndo: true,
                ignoreContentChange:true
            },

            'getlocaldata':{
                execCommand:function (cmd, name) {
                    return saveKey ? me.getPreferences( saveKey ) || '' : '';
                },
                notNeedUndo: true,
                ignoreContentChange:true
            },

            'drafts':{
                execCommand:function (cmd, name) {
                    if ( saveKey ) {
                        me.body.innerHTML = me.getPreferences( saveKey ) || '<p>'+domUtils.fillHtml+'</p>';
                        me.focus(true);
                    }
                },
                queryCommandState: function () {
                    return saveKey ? ( me.getPreferences( saveKey ) === null ? -1 : 0 ) : -1;
                },
                notNeedUndo: true,
                ignoreContentChange:true
            }
        }
    }

});