/**
 * 提供API搜索功能
 * @file
 */

jQuery( function ( $ ) {

    'use strict';

    //panle open state
    var PANEL_OPEN_STATE = false,
        isInput = false,
        $searchPanel = $( "#searchPanel" ),
        $searchInput = $( "#searchInput" ),
        $elevator = $( "#elevator" ),
        complete = new AutoComplete();

    //初始化complete
    ( function () {

        complete.setSource( _source );

        complete.bindInput( $searchInput );

    } )();

    $searchInput.on( "close", function () {
        hidePanel();
    } ).on( 'focus', function () {
        isInput = true;
        $( this ).addClass( "focus" );
    } ).on( 'blur', function () {
        isInput = false;
        $( this ).removeClass( "focus" );
    } );

    $( document ).on("keydown", function ( evt ) {

        if ( isInput ) {
            return;
        }

        //ctrl + q
        if ( evt.ctrlKey && evt.keyCode === 81 ) {

            $( document ).trigger( 'togglepanel' );

        //esc close
        } else if ( evt.keyCode === 27 ) {

            hidePanel();

        }


    } ).on( "click", function () {
        complete.hide();
    } ).on( "togglepanel", function () {
        !PANEL_OPEN_STATE ? showPanel() : hidePanel();
    } );

    $( ".search-tip-btn" ).on( "click", function () {

        $( this ).attr( "data-type" ) === 'open' ? showPanel() : hidePanel();
        return false;

    } );

    //api item click
    $(".api-wrap").delegate( ".api-item", "click", function () {

        complete.to( this.href.split("#")[1] );
        return false;

    } );

    //Elevator
    $( document ).on( "scroll", function () {

        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

        if ( scrollTop > 0 ) {

            $elevator.fadeIn();

        } else {

            $elevator.fadeOut();

        }

    } );

    function hidePanel () {
        PANEL_OPEN_STATE = false;
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        $searchPanel.hide();
        $searchInput.blur();
        complete.clear();
    }

    function showPanel () {
        PANEL_OPEN_STATE = true;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        $searchPanel.show();
        $searchInput.focus();
    }

} );
