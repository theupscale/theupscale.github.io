(function() {
    'use strict';

    var $ = jQuery.noConflict();

    $( window ).on( 'load', function() {
        $( '.toValign' ).css( 'height', $( window ).height() - 135 );

        $( '#status' ).fadeOut(); // will first fade out the loading animation
        $( '#preloader' ).delay( 350 ).fadeOut( 'slow' ); // will fade out the white DIV that covers the website.
        $( 'body' ).delay( 350 ).css( {
            'overflow': 'visible'
        } );

        $( ".header" ).waypoint( 'sticky' );
    } );

    $( window ).on( 'resize', function() {
        $( '.toValign' ).css( 'height', $( window ).height() - 135 );
    } );

    $(document).ready(function() {

        $( '.loginOverBtn' ).click( function( event ) {
            event.preventDefault();
            $( '#loginOverlay' ).addClass( 'overlayOpened' );
            $( 'body' ).css( 'overflow', 'hidden' );
        } );

        $( '.messageOverlayBtn' ).click( function( event ) {
            event.preventDefault();
            $( '#messageOverlay' ).addClass( 'overlayOpened' );
            $( 'body' ).css( 'overflow', 'hidden' );
        } );

        $( document ).on( 'click', '.overlayClose', function() {
            $( '.overlayDiv' ).removeClass( 'overlayOpened' );
            $( 'body' ).css( 'overflow', 'visible' );
        } );

        $( document ).keyup( function( e ) {

            if ( e.keyCode == 27 ) {
                $( '.overlayDiv' ).removeClass( 'overlayOpened' );
                $( 'body' ).css( 'overflow', 'visible' );
            } // esc

        } );

        // Menu mobile view button
        $( 'div.menu' ).click( function() {
            $( this ).toggleClass( 'close' );
        } );

        $( window ).on( 'load', function() {
            /*Checking if it's touch device we disable parallax feature due to inconsistency*/
            if ( Modernizr.touch ) {
                $( 'body' ).removeClass( 'parallax' );
            }
            $( '.parallax' ).stellar( {
                horizontalScrolling: false,
                responsive: true
            } );
        } );


        // Post Image Slider
        $( '.owl-carousel-post' ).owlCarousel( {
            responsiveClass: true,
            margin: 30,
            loop: true,
            nav: false,
            center: true,
            responsive: {
                320: {
                    center: true,
                    items: 1
                },
                768: {
                    center: true,
                    items: 2
                },
                960: {
                    center: true,
                    items: 3
                },
                1200: {
                    center: true,
                    items: 3
                }
            }
        } );

        ////////////////////////////////////////////////////////////
        //INTERNAL ANCHOR LINKS SCROLLING (NAVIGATION)

        /* Scroll down to content */
        $( '.down-arrow > a.scroll' ).on( 'click', function( e ) {
            e.preventDefault();
            var container = $( '#main' ).find( 'main' ),
                first = container.children().first();

            $( 'html, body' ).animate( {
                scrollTop: first.offset().top - 40
            }, 1000 );
            return false;
        } );

        $( ".scroll" ).click( function( event ) {
            $( 'html, body' ).animate( { scrollTop: $( this.hash ).offset().top - 40 }, 600 );
            event.preventDefault();
        } );

        /*Scroll Up*/
        $( '.scroll-up' ).click( function() {
            $( "html, body" ).animate( {
                scrollTop: 0
            }, 1000 );
            return false;
        } );


        //SCROLL-SPY
        // Cache selectors
        var lastId,
            topMenu = $( ".navbar-collapse" ),
            topMenuHeight = topMenu.outerHeight(),
        // All list items
            menuItems = topMenu.find( "a" ),
        // Anchors corresponding to menu items
            scrollItems = menuItems.map( function() {
                var item = $( $( this ).attr( "href" ) );
                if ( item.length ) {
                    return item;
                }
            } );

        // Bind to scroll
        $( window ).scroll( function() {
            // Get container scroll position
            var fromTop = $( this ).scrollTop() + topMenuHeight + 200;

            // Get id of current scroll item
            var cur = scrollItems.map( function() {
                if ( $( this ).offset().top < fromTop )
                    return this;
            } );
            // Get the id of the current element
            cur = cur[ cur.length - 1 ];
            var id = cur && cur.length ? cur[ 0 ].id : "";

            if ( lastId !== id ) {
                lastId = id;
                // Set/remove active class
                menuItems
                    .parent().removeClass( "active" )
                    .end().filter( "[href=#" + id + "]" ).parent().addClass( "active" );
            }
        } );

    });

})();