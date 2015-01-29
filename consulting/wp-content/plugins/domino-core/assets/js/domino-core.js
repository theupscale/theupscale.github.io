(function() {
	'use strict';

	var $ = jQuery.noConflict();


	$( document ).ready( function() {

		/*Filtering Thumbnails*/
		$( '.thumbsGridSorting .nav li' ).click( function() {
			$( '.thumbsGridSorting .nav li' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
			var $filter = $( this ).attr( "data-filter" );
			$( '.thumbsGrid li' ).removeClass( 'active' );
			$( '.thumbsGrid li.' + $filter ).addClass( 'active' );
			if ( $filter === "all" ) {
				$( '.thumbsGrid li' ).addClass( 'active' );
			}
		} );

		// Slider activation & settings
		var owl = $( ".owl-carousel" );

		owl.owlCarousel( {
			responsiveClass: true,
			animateOut: 'slideOutDown',
			animateIn: 'flipInX',
			margin: 0,
			loop: true,
			nav: false,
			navText: false,
			dotsContainer: ".customBullet",
			responsive: {
				320: {
					center: true,
					items: 1
				},
				750: {
					center: true,
					items: 1
				},
				1200: {
					center: true,
					items: 1
				}
			}
		} );

		// Custom navigation for slider
		$( ".customNext" ).click( function() {
			owl.trigger( 'next.owl.carousel' );
		} );
		$( ".customPrev" ).click( function() {
			owl.trigger( 'prev.owl.carousel' );
		} );

		$( '.carousel' ).carousel( {
			interval: 9000
		} );

		//Enable Touch / swipe events for carousel
		var bCarousel = $( ".carousel-inner" );
		if ( bCarousel.length ) {
			bCarousel.swipe( {
				//Generic swipe handler for all directions
				swipeRight: function( event, direction, distance, duration, fingerCount ) {
					$( this ).parent().carousel( 'prev' );
				},
				swipeLeft: function() {
					$( this ).parent().carousel( 'next' );
				},
				//Default is 75px, set to 0 for demo so any distance triggers swipe
				threshold: 0
			} );
		}

		/* Initializing Gallery Plugin
		 *******************************************/
		gallery.init();
		Grid.init();

		/**
		 * Init LightGallery on page load and makes it global
		 */
		var lightGallery = $( '.gallery-grid' ).lightGallery( {
			speed: 400,
			caption: true,
			html: true
		} );

		/**
		 * Re-init current Gallery in "Gallery" shortcode. Defined by data-target attribute.
		 * Uses in "Load More" and "Filter" options.
		 *
		 * @param {String} target Current gallery target
		 */
		function domino_gallery_reinit( target ) {
			console.log( [ 'gallery.re-init', target ] );
			// jQuery Shuffle
			$( target ).shuffle( 'appended', $( '.gallery-item' ) );
			setTimeout( function() {
				$( target ).shuffle( 'sort', { randomize: true } );
				// Light Gallery. Destroy current and create a new one
				lightGallery.destroy();
				$( target ).lightGallery( {
					speed: 400,
					caption: true,
					html: true
				} );
			}, 100 );
		}

		/**
		 * Domino Load More
		 */
		$( '.domino-load-more' ).on( 'click', function( e ) {
			e.preventDefault();
			var btn = $( this ),
				target = btn.data( 'dom-lm-target' ),
				type = btn.data( 'dom-lm-type' ),
				exclude = btn.data( 'dom-lm-exclude' ),
				taxonomy = btn.data( 'dom-lm-taxonomy' ),
				data = {
					action: 'domino_load_more',
					nonce: domino.nonce,
					type: type,
					exclude: exclude,
					taxonomy: taxonomy
				};

			var success = function( response ) {
				if ( -1 == response ) {
					alert( 'ajax error!' );
					return false;
				}

				// remove self
				btn.remove();
				// Append to container
				$( target ).append( response );

				// Re-init if gallery post type
				if ( 'dom_gallery' === type ) {
					domino_gallery_reinit( target );
				}
			};

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * Domino load single post: Thumbnail Grid.
		 */
		$( document ).on( 'click', '.domino-load-single-thumbnail-grid.active', function( e ) {
			e.preventDefault();
			var self = $( this ),
				postID = self.data( 'dom-post-id' ),
				category = self.parents( '.thumbsGrid' ).siblings( '.thumbsGridSorting' ).find( 'li.active' ).data( 'filter' );

			if ( 'undefined' === typeof category || category.length === 0 ) {
				category = self.data( 'dom-sn-category' );
			}

			var data = {
				action: 'domino_load_single',
				nonce: domino.nonce,
				post_id: postID,
				category: category,
				type: 'dom_thumbnail_grid'
			};

			var success = function( response ) {
				var content = ( -1 == response || 0 === response.length ) ? 'Sorry, AJAX error occurred' : response;
				var overlay = $( '#thumbsOverlay' ),
					overlayInner = overlay.find( '.thumbsOverlayInner' );

				overlayInner.html( content );
				overlay.addClass( 'overlayOpened' );
				jQuery( 'body' ).css( 'overflow', 'hidden' );
			};

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * Domino load single post
		 */
		$( document ).on( 'click', '.domino-load-single-post', function( e ) {
			e.preventDefault();
			var self = $( this ),
				postID = self.data( 'dom-post-id' ),
				data = {
					action: 'domino_load_single',
					nonce: domino.nonce,
					post_id: postID,
					type: 'post'
				};

			var success = function( response ) {
				var content = ( -1 == response ) ? 'Sorry, AJAX error occurred' : response;
				var overlay = $( '#postOverlay' ),
					overlayInner = overlay.find( '.postContainer' );

				overlay.addClass( 'overlayOpened' );
				overlayInner.html( content );
				$( 'body' ).css( 'overflow', 'hidden' );
			};

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * Domino load single post: Menu.
		 */
		$( document ).on( 'click', '.domino-load-single-menu', function( e ) {
			e.preventDefault();
			var self = $( this ),
				postID = self.data( 'dom-post-id' );

			var data = {
				action: 'domino_load_single',
				nonce: domino.nonce,
				post_id: postID,
				type: 'dom_menu'
			};

			var success = function( response ) {
				var content = ( -1 == response ) ? 'Sorry, AJAX error occured' : response;
				var overlay = $( '#epandOverlay' ),
					overlayInner = overlay.find( '#expander' );

				overlay.addClass( 'overlayOpened' );
				overlayInner.html( content );
				$( 'body' ).css( 'overflow', 'hidden' );
			};

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * Domino load Menu. Load full menu to overlay.
		 */
		$( document ).on( 'click', '.domino-load-menu', function( e ) {
			e.preventDefault();
			var data = {
					nonce: domino.nonce,
					action: 'domino_load_menu'
				},
				success = function( response ) {
					var content = ( -1 == response ) ? 'Sorry, AJAX error occured' : response;
					var overlay = $( '#menuOverlay' ),
						overlayInner = overlay.find( '.fullMenu > .container' );

					overlay.addClass( 'overlayOpened' );
					overlayInner.html( content );
					$( 'body' ).css( 'overflow', 'hidden' );
				};

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * Domino Post Likes
		 */
		$( document ).on( 'click', '.domino-post-likes', function( e ) {
			e.preventDefault();
			var heart = $( this ),
				postID = heart.data( 'dom-post-id' ),
				data = {
					action: 'domino_post_likes',
					nonce: domino.nonce,
					post_id: postID
				};

			$.post( domino.ajaxurl, data, function( response ) {
				if ( -1 == response || response.length === 0 ) {
					console.log( [ 'domino.likes.fail', response ] );
					return false;
				}
				heart.find( 'span' ).text( response );
			} );
		} );

		/**
		 * Because of Disqus, delegate click on comments counter to "Read More" button.
		 * Just prevent action if is single post overlay opened.
		 */
		$( document ).on( 'click', '.comentsQty', function( e ) {
			e.preventDefault();
			var self = $( this );
			if ( self.parents( '.singlePost' ).length ) {
				return;
			}
			self.parents( '.postMeta' ).find( '.domino-load-single-post' ).trigger( 'click' );
		} );

		/**
		 * Sorting Domino Gallery shortcode.
		 * Load all custom posts by category through AJAX, not simply sort preloaded images.
		 */
		$( document ).on( 'click', '.domino-gallery-sort', function( e ) {
			e.preventDefault();
			var self = $( this ),
				term = self.data( 'dom-term' ),
				target = self.data( 'dom-target' );

			var data = {
				action: 'domino_gallery_sort',
				nonce: domino.nonce,
				term: term
			};

			// AJAX success function
			var success = function( response ) {
				// HTML
				$( target ).html( response );
				// Re-init Gallery
				domino_gallery_reinit( target );
			};

			// Switch filter active button
			self.siblings( 'a' ).removeClass( 'active' );
			self.addClass( 'active' );

			// Delete "Load More" button
			$( target ).siblings( '.domino-load-more' ).remove();

			$.post( domino.ajaxurl, data, success, 'html' );
		} );

		/**
		 * AJAXify WP Comments
		 */
		$( document ).on( 'submit', '#commentform', function( e ) {
			e.preventDefault();
			var form = $( this ),
				formurl = form.attr( 'action' ),
				formdata = form.serialize(),
				respondHolder = $( '#respond' );

			$.ajax( {
				type: 'post',
				url: formurl,
				data: formdata,
				error: function( xhr, status, error ) {
					console.log( [ 'domino.comment.error', status, error, xhr.responseText ] );
				},
				success: function( response ) {
					console.log( [ 'domino.comment.success', response ] );
					respondHolder.prepend( '<span class="domino-comment-response">' + response.data + '</span>' );
					setTimeout( function() {
						respondHolder.find( '.domino-comment-response' ).remove();
					}, 5000 );
				}
			} );
		} );

	} );

	var counting = (function() {
		var that = {};
		that.init = function() {

			$( ".qty" ).each( function() {
				var dataNumbers = $( this ).attr( 'data-qty' );

				$( this ).numerator( {
					easing: 'swing', // easing options.
					duration: 2000, // the length of the animation.
					delimiter: '.',
					rounding: 0, // decimal places.
					toValue: dataNumbers // animate to this value.
				} );
			} );
		};

		return that;

	})();

	// Main menu transparency out ant stick to top
	$( '.userCounterBlock' ).waypoint( function( direction ) {
		counting.init() + 'down';
	}, {
		offset: '75%',
		triggerOnce: true
	} );


	var socialHeight = $( '.sotialIconsMain' ).height();
	$( '.sotialIconsMain' ).css( 'margin-top', -socialHeight / 2 );

	$( window ).scroll( function() {
		if ( $( 'body' ).scrollTop() > $( window ).height() ) {
			$( '.sotialIconsMain' ).addClass( 'socialFixed' );
		} else {
			$( '.sotialIconsMain' ).removeClass( 'socialFixed' );
		}
	} );

	/*Gallery Filtering and Responsiveness Function
	 *******************************************/
	var gallery = (function( $ ) {
		'use strict';

		var $grid = $( '.gallery-grid' ),
			$filterOptions = $( '.filters' ),
			$sizer = $grid.find( '.shuffle__sizer' ),
			init = function() {

				// None of these need to be executed synchronously
				setTimeout( function() {
					listen();
					//setupFilters();
				}, 100 );

				$grid.on( 'loading.shuffle done.shuffle shrink.shuffle shrunk.shuffle filter.shuffle filtered.shuffle sorted.shuffle layout.shuffle', function( evt, shuffle ) {
					// Make sure the browser has a console
					if ( window.console && window.console.log && typeof window.console.log === 'function' ) {
						console.log( 'Shuffle:', evt.type );
					}
				} );

				// instantiate the plugin
				$grid.shuffle( {
					itemSelector: '.gallery-item',
					sizer: $sizer
				} );
			},


		// Set up button clicks
			setupFilters = function() {
				var $btns = $filterOptions.children();
				$btns.on( 'click', function( e ) {
					var $this = $( this ),
						isActive = $this.hasClass( 'active' ),
						group = $this.data( 'group' );
					$( '.filters .active' ).removeClass( 'active' );
					$this.addClass( 'active' );

					// Filter elements
					$grid.shuffle( 'shuffle', group );
					e.preventDefault();
				} );

				$btns = null;
			},

			listen = function() {
				var debouncedLayout = $.throttle( 300, function() {
					$grid.shuffle( 'update' );
				} );

				// Get all images inside shuffle
				$grid.find( 'img' ).each( function() {
					var proxyImage;

					// Image already loaded
					if ( this.complete && this.naturalWidth !== undefined ) {
						return;
					}

					// If none of the checks above matched, simulate loading on detached element.
					proxyImage = new Image();
					$( proxyImage ).on( 'load', function() {
						$( this ).off( 'load' );
						debouncedLayout();
					} );

					proxyImage.src = this.src;
				} );

				// Because this method doesn't seem to be perfect.
				setTimeout( function() {
					debouncedLayout();
				}, 500 );
			};

		return {
			init: init
		};
	}( jQuery ));

})();