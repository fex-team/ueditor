/**
 * AutoComplete组件
 * @file
 */

( function () {

    //匹配结果最大条数
    var MAX_COUNT = 11;

    var Util = {

        hasChange: function ( newInput, oldInput ) {
            return !(newInput === oldInput);
        },

        /**
         * 根据提供的source文本数组获取匹配searchtext的集合
         */
        getMatchText: function ( searchText, source ) {

            var result = [],
                searchText = searchText.toLowerCase();

            if ( searchText === "" ) {
                return result;
            }

            $.each( source, function ( index, item ) {

                if ( result.length >= MAX_COUNT ) {
                    return false;
                }

                if ( item.toLowerCase().indexOf( searchText ) !== -1 ) {

                    result.push( item );

                }

            } );

            return result;

        },

        escapeRegexp: function ( input ) {

            return input.replace( /[\.\\\/\*\?\+\[\(\)\]\{\}\^\$\|]/g, function ( match ) {
                return '\\' + match;
            } );

        }

    };

    function AutoComplete () {
        this.panel = new Panel();
        this.source = null;

        this._lastInput = "";
        this._inputBox = null;
        this._selectIndex = -1;
        this._matchCount = 0;
        this._inputValue = "";
    }

    $.extend( AutoComplete.prototype, {

        setSource: function ( source ) {
            this.source = source;
        },

        bindInput: function ( inputBox ) {

            var _self = this,
                $inputBox = $( inputBox );

            this._inputBox = $inputBox;
            this.panel.bind( $inputBox );

            this.panel.onselect( function ( index, title ) {

                _self.to( title );

            } );

            $inputBox.on( "oninput" in document.body ? "input" : "keyup", function ( evt ) {

                _self._inputValue = this.value;

                if ( !Util.hasChange( _self._inputValue, _self._lastInput ) ) {
                    return ;
                }

                _self._lastInput = _self._inputValue;

                _self.search( _self._inputValue );

            } ).on( "click", function () {

                return false;

            } ).on( "keydown", function ( evt ) {

                if ( evt.ctrlKey && evt.keyCode === 81 ) {
                    $( document ).trigger( 'togglepanel' );
                    return false;
                }

                if ( evt.keyCode === 13 ) {

                    _self.to( this.value );
                    return;

                }

                if ( !_self.panel.showState ) {
                    return;
                }

                //down
                if ( evt.keyCode === 40 ) {

                    _self._selectIndex = ++_self._selectIndex;

                    //up
                } else if ( evt.keyCode === 38 ) {

                    _self._selectIndex = _self._selectIndex === -1 ?
                        _self._selectIndex + _self._matchCount : _self._selectIndex - 1;

                    //do search
                } else {
                    return;
                }

                _self.select( _self._selectIndex );

                return false;

            } );

        },

        select: function ( index ) {

            this.panel.change( index );

            //设置搜索框值
            if ( index > -1 && index < this._matchCount ) {
                this._inputBox.val( this.panel.getTitle( index ) );
            } else {
                this._inputBox.val( this._inputValue );
                this._selectIndex = -1;
            }

        },

        search: function ( searchText ) {

            this.render( searchText, Util.getMatchText( searchText, this.source ) );

        },

        to: function ( anchor ) {
            anchor && ( location.hash = anchor );
            this.clear();
            this._inputBox.trigger( "close" );
        },

        render: function ( searchText, items ) {

            this._matchCount = items.length;
            this.panel.render( this._getItemHtml( searchText, items ) ).show();

        },

        hide: function () {

            this.panel.hide();

            this._lastInput = "";
            this._selectIndex = -1;
            this._matchCount = 0;

        },

        clear: function () {
            this.hide();
            this.panel.clear();

            this._inputValue = "";
        },

        _getItemHtml: function ( searchText, items ) {

            var htmlStr = [],
                pattern = new RegExp( Util.escapeRegexp( searchText ), 'i' );

            if ( !items.length ) {
                return '<ul><li class="search-nothing">未找到匹配的内容</li></ul>';
            }

            $.each( items, function ( index, item ) {

                htmlStr.push( '<a class="search-result-item" data-index="'+ index +'" href="#'+ item +'">' + item.replace( pattern, function ( match ) {

                    return '<span class="search-keyword">' + match + '</span>';

                } ) + '</a>' );

            } );

            return '<ul><li>'+ htmlStr.join( '</li><li>' ) +'</li></ul>';

        }

    } );

    function Panel () {

        this.showState = false;

        this._input = null;
        this._panel = $( '<div class="search-panel"></div>' );
        this._callbacks = [];

        this.selectStyle = "background: #f0f0f0";

    }

    $.extend( Panel.prototype, {

        bind: function ( $inputBox ) {

            var _self = this;

            this._input = $inputBox;

            $inputBox.parent().append( this._panel );

            this._panel.delegate( ".search-result-item", "click", function () {

                var $this = $( this ),
                    selectIndex = $this.attr( "data-index" ),
                    title = $this.text();

                $.each( _self._callbacks, function ( index, callback ) {

                    callback( selectIndex, title );

                } );

                _self.hide();

                return false;

            } );

            return this;

        },

        render: function ( htmlStr ) {

            this._panel.html( htmlStr );

            return this;

        },

        clear: function () {
            this._panel.html( "" );
            this._input.val( "" );
        },

        change: function ( itemIndex ) {
            var $items = this._panel.find( ".search-result-item" ).css( "background", "" );
            $items[ itemIndex ] && ( $items[ itemIndex ].style.cssText = this.selectStyle );
        },

        onselect: function ( callback ) {

            this._callbacks.push( callback );

        },

        getTitle: function ( itemIndex ) {
            return $( this._panel.find( ".search-result-item" )[ itemIndex ] ).text();
        },

        show: function () {

            this.showState = true;

            this._panel.css( {
                width: this._input.outerWidth(),
                top: this._input.position().top + this._input.innerHeight(),
                left: this._input.position().left
            } );

            this._panel.show();

        },

        hide: function () {

            this.showState = false;
            this._panel.hide();

            return this;

        }

    } );

    window.AutoComplete = AutoComplete;

} )();