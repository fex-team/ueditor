/**
 * @file fullscreen.js
 * @import adapter/adapter.js
 */
UE.registerEditorui(
    'fullscreen',
    function(editor, name){
        var ui = editor.ui;
        UE.utils.extend(ui, {
            /**
             * @name isFullScreen
             * @desc 获取是否处于全屏状态
             *
             */
            isFullScreen:function () {
                return !! this._fullscreen;
            },

            /**
             * @name setFullScreen
             * @desc 设置编辑器全屏
             * @grammar ui.setFullScreen(true) //true-设置全屏， false-恢复
             */
            setFullScreen:function ( fullscreen ) {

                if ( this._fullscreen != fullscreen ) {
                    this._fullscreen = fullscreen;
                    this.editor.fireEvent( 'beforefullscreenchange', fullscreen );
                    var editor = this.editor;

                    if ( baidu.editor.browser.gecko ) {
                        var bk = editor.selection.getRange().createBookmark();
                    }


                    if ( fullscreen ) {

                        this._bakHtmlOverflow = document.documentElement.style.overflow;
                        this._bakBodyOverflow = document.body.style.overflow;
                        this._bakAutoHeight = this.editor.autoHeightEnabled;
                        this._bakScrollTop = Math.max( document.documentElement.scrollTop, document.body.scrollTop );
                        if ( this._bakAutoHeight ) {
                            //当全屏时不能执行自动长高
                            editor.autoHeightEnabled = false;
                            this.editor.disableAutoHeight();
                        }

                        document.documentElement.style.overflow = 'hidden';
                        document.body.style.overflow = 'hidden';

                        this._bakCssText = this.wrapper.dom.style.cssText;
                        this._bakCssText1 = this.editorHolder.dom.style.cssText;
                        this._updateFullScreen();

                    } else {

                        this.wrapper.dom.style.cssText = this._bakCssText;
                        this.editorHolder.dom.style.cssText = this._bakCssText1;
                        if ( this._bakAutoHeight ) {
                            editor.autoHeightEnabled = true;
                            this.editor.enableAutoHeight();
                        }
                        document.documentElement.style.overflow = this._bakHtmlOverflow;
                        document.body.style.overflow = this._bakBodyOverflow;
                        window.scrollTo( 0, this._bakScrollTop );
                    }
                    if ( baidu.editor.browser.gecko ) {

                        var input = document.createElement( 'input' );

                        document.body.appendChild( input );

                        editor.body.contentEditable = false;
                        setTimeout( function () {

                            input.focus();
                            setTimeout( function () {
                                editor.body.contentEditable = true;
                                editor.selection.getRange().moveToBookmark( bk ).select( true );
                                baidu.editor.dom.domUtils.remove( input );

                                fullscreen && window.scroll( 0, 0 );

                            } )

                        } )
                    }

                    this.editor.fireEvent( 'fullscreenchanged', fullscreen );
                    this.triggerLayout();
                }
            },
            _updateFullScreen:function () {
                if ( this._fullscreen ) {
                    var utils = UE.ui.Utils,
                        vpRect = utils.getViewportRect();
                    this.wrapper.dom.style.cssText = 'border:0;position:absolute;left:0;top:0;width:' + vpRect.width + 'px;height:' + vpRect.height + 'px;z-index:' + (this.wrapper.dom.style.zIndex * 1 + 10);
                    utils.setViewportOffset( this.wrapper.dom, { left:0, top:0 } );
                    this.editor.setHeight( vpRect.height - this.toolbar.dom.offsetHeight - this.statusbar.dom.offsetHeight );

                }
            },
            triggerLayout:function () {
                var dom = this.wrapper.dom;
                if ( dom.style.zoom == '1' ) {
                    dom.style.zoom = '100%';
                } else {
                    dom.style.zoom = '1';
                }
            }
        });

        var btn = new UE.ui.View.Button(name);

        btn.addListener('click', function(){
            ui.setFullScreen( !ui.isFullScreen() );
            btn.reflectState( btn.state=!!ui.isFullScreen() );
        });

        return btn;
    }
);