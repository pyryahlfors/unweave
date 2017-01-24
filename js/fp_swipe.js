(function() {
	"use strict";

	var fp_module_swipe = (function() {
		return {
			init: function(params) {
				"use strict";

			// Test for touch event support
				var testTouch = document.createElement("DIV");
				testTouch.setAttribute('ontouchstart', 'return;');
				var isTouchDevice = (typeof testTouch.ontouchstart == 'function') ? true : false;

				var isWebkit = (navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? true : false;

				// Touch or mouse events
				var swipeStart = (isTouchDevice) ? 'touchstart' : 'mousedown',
					swipeMove  = (isTouchDevice) ? 'touchmove' : 'mousemove',
					swipeEnd   = (isTouchDevice) ? 'touchend' : 'mouseup';

				// WP8 touch events
				if (window.navigator.msPointerEnabled) {
					var swipeStart = 'MSPointerDown',
						swipeMove  = 'MSPointerMove',
						swipeEnd   = 'MSPointerUp'
					};

			// Private function
				var mahData = function ( ) {
					return self.getBoundingClientRect();
					};
				
				var updateElementSize = function(){
					};

				if(!params.elem) {return};
				params.elem.fpSwipe = ( function ( params ) {
					// set private variables
					var self = this;
					if(!self) {
						return;
						};
					var params = params;
					
					// Viewport data
					var viewPort = {
						width : (params.viewport) ? params.viewport.offsetWidth : self.parentNode.offsetWidth,
						height : (params.viewport) ? params.viewport.offsetHeight : self.parentNode.offsetHeight,
						};
					
					// Scrollable content element data
					var container = {
						width	: (params.paginate) ? this.scrollWidth : this.offsetWidth,
						height	: (params.paginate) ? this.scrollHeight : this.offsetHeight,
							
						startX	: Number(0),
						startY	: Number(0),
						moveX	: Number(0),
						moveY	: Number(0),
						endX	: Number(0),
						endY	: Number(0),
//						pages	: this.childNodes,
						pages	: this.children,
						pagecount	: this.childNodes.length,
						currentPage : 0,
						freeLock : false
						};

					// Timers and mouse data
					var swipeDiffer = {
						startX	: Number(0),
						startY	: Number(0),
						endX	: Number(0),
						endY	: Number(0),
						moveX	: Number(0),
						moveY	: Number(0),				
						timerStart	: Number(0),
						timerEnd	: Number(0),
						timerInterval : (params.timerInterval) ? params.timerInterval : 250,
						xAxis 	: params.x,
						yAxis 	: params.y,
						differXStart : 0,
						differYStart : 0,
						treshold : (params.treshold) ? params.treshold : 50,
						};
						
					var thisSwipe = {
						xAxis : params.x,
						yAxis : params.y,
						free : params.freeScroll
						};

					
					var onSwipe = false;

				// Private function
					var getTranslateCoords = function ( elem ) {
						if(elem.style[cssEngine+'Transform']) {
							var currentLocation = elem.style[cssEngine+'Transform'].match(/translate3d\((.*?)\)/);
							return [ parseInt( RegExp.$1.split(",")[0] ), parseInt( RegExp.$1.split(",")[1] ) ]
							}
						return [0,0,0];
						};

					var setTranslateCoords = function ( elem, xyz ) {
						elem.style[cssEngine+'Transform']= "translate3d("+xyz[0]+"px,"+xyz[1]+"px,0)";
						};
						
					var updateElementSize = function(el){
						viewPort.width = (params.viewport) ? params.viewport.offsetWidth : el.parentNode.offsetWidth;
						viewPort.height = (params.viewport) ? params.viewport.offsetHeight : el.parentNode.offsetHeight;
/*						viewPort.width = el.parentNode.offsetWidth,
						viewPort.height	= el.parentNode.offsetHeight;*/
						
						

						container.width	= (params.paginate) ? el.scrollWidth : el.offsetWidth,
						container.height = (params.paginate) ? el.scrollHeight : el.offsetHeight;
						};
						
/*
					else {
						var getTranslateCoords = function ( elem ) {
							var currentLocation = elem.style[cssEngine+'Transform'].match(/translate3d\((.*?)\)/);
							if(!currentLocation) return [0,0,0];
							return [ parseInt( RegExp.$1.split(",")[0] ), parseInt( RegExp.$1.split(",")[1] ) ]
							};

						var setTranslateCoords = function ( elem, xyz ) {
							elem.style[cssEngine+'Transform']= "translate3d("+xyz[0]+"px,"+xyz[1]+"px, 0)";
							};
						};
*/


					var cssEngine = ( function ( ) {
						var navUA = navigator.userAgent.toLowerCase();
						if ( navUA.indexOf('webkit') != -1 ) { return 'webkit'; }
						else if ( navUA.indexOf('safari') != -1 ) { return 'webkit'; }
						else if ( navUA.indexOf('opera') != -1) { return 'O'; }
						else if ( navUA.indexOf ('msie') != -1 ) { return 'ms'; }		// < IE 11
						else if ( navUA.indexOf ('iemobile') != -1 ) { return 'ms'; } 	// IE 11
						else if ( navUA.indexOf ('trident') != -1 ) { return 'ms'; } 	// IE 11
						else if ( navUA.indexOf ('mozilla') != -1 ) { return 'Moz'; }
						else { return '';};
						} )( );


				// Swipe end trigger
					var endSwipeTrigger = ( function ( e ) {
						window.removeEventListener(swipeEnd, endSwipeTrigger, false);
						if ( onSwipe ) {
							var coords = getTranslateCoords(self);
							swipeDiffer.endX = e.pageX;
							container.endX = coords[0];

							swipeDiffer.endY = e.pageY;
							container.endY = coords[1];
							
							swipeDiffer.timerEnd = new Date().getTime();
							e.preventDefault(); 

							// self.removeEventListener(swipeStart, initSwipeListener, false);
							window.removeEventListener(swipeMove, initSwipeMoveListener, false);
							window.removeEventListener(swipeEnd, endSwipeTrigger, false);

/* Do this better */

							if(typeof(fpApp) != 'undefined') {setTimeout(function(){fpApp.disableLinks = false;}, 30)};
							if(params.paginate) {
								self.fpSwipe.paginate.call ( self, e );
								}
							else{
								self.fpSwipe.endSwipe.call ( self, e );
								}
							}
						});

					var initSwipeListener = function ( e ) { 
						e.preventDefault();
						updateElementSize(self);
						self.fpSwipe.init.call(self, e);
						window.addEventListener(swipeEnd, endSwipeTrigger, false);
						};
					

					var initSwipeMoveListener = function ( e ) {
						if ( !onSwipe ) return;
						e.preventDefault(); 
						if(e.touches) e = e.touches[0];
						if(Math.abs( swipeDiffer.moveY - e.pageY ) > swipeDiffer.treshold ) {
// Lock Y axis
							if ( !container.lockY  && !container.lockX) {
								if(thisSwipe.free && !container.freeLock) {
									container.freeLock = true;
									container.lockY = true;
									swipeDiffer.differYStart = (e.pageY < swipeDiffer.differY) ? swipeDiffer.treshold : -1*swipeDiffer.treshold;
									}
								else{
									container.lockY = true;
									}
								if (!thisSwipe.free){
									container.lockY = true;
									swipeDiffer.differYStart = (e.pageY < swipeDiffer.moveY) ? swipeDiffer.treshold : -1*swipeDiffer.treshold;
									}
									if(self.bottomReached && e.pageY < swipeDiffer.differY) {self.bottomReached = false;}
								};
							};

// Lock X axis
						if(Math.abs( swipeDiffer.moveX - e.pageX ) > swipeDiffer.treshold ) {
							if ( !container.lockX && !container.lockY) {
								if(thisSwipe.free && !container.freeLock) {
									container.freeLock = true;
									container.lockX = true;
									swipeDiffer.differXStart = (e.pageX < swipeDiffer.moveX) ? swipeDiffer.treshold : -1*swipeDiffer.treshold;
									}
								else{
									container.lockX = true;
									}
								if (!thisSwipe.free){
									container.lockX = true;
									swipeDiffer.differXStart = (e.pageX < swipeDiffer.moveX) ? swipeDiffer.treshold : -1*swipeDiffer.treshold;
									}

								};
							};

						if ( container.lockY || container.lockX ) {
							if(typeof(fpApp) != 'undefined') {fpApp.disableLinks = true;};
							self.fpSwipe.move.call ( self, e );
							}
						};

					this.addEventListener(swipeStart, initSwipeListener, false);

					// set outside accessible variables and functions
					return {
						init: function ( e ) {
							e.preventDefault();
							if(e.touches) e = e.touches[0];

							container.width = (params.paginate) ? self.offsetWidth : self.scrollWidth;
							container.height = (params.paginate) ? self.offsetHeight : self.scrollHeight;
						
							self.style[cssEngine+'Transition']= "all 0ms";
							
							swipeDiffer.timerStart = new Date().getTime();
							var coords = getTranslateCoords(self);
							container.startX = container.moveX = coords[0];
							container.startY = container.moveY = coords[1];

							swipeDiffer.differX = e.pageX - container.startX;
							swipeDiffer.differY = e.pageY - container.startY;

							swipeDiffer.moveX = e.pageX;
							swipeDiffer.moveY = e.pageY;

							onSwipe = true;
							
							window.addEventListener(swipeMove, initSwipeMoveListener, false);
							},

						move: function ( e ) {
							if ( !onSwipe ) return;

							var coords = getTranslateCoords(self);
								if ( new Date( ).getTime( ) - swipeDiffer.timerStart > swipeDiffer.timerInterval && !params.paginate) {
									swipeDiffer.timerStart = new Date().getTime();
									container.startX = coords[0];
									container.startY = coords[1];
									};
/*
// ZOOM - remove e = e.touches= 0 
								*/
								if(e.touches && e.touches.length > 1 && params.zoom) {
									self.style.zoom = e.touches[1].pageX - e.touches[0].pageX + "%";
									}

								if(thisSwipe.free) {
									var x = (thisSwipe.xAxis && (container.lockX || container.lockY)) ? swipeDiffer.differXStart + ((container.moveX - swipeDiffer.moveX) + e.pageX) : coords[0];
									var y = (thisSwipe.yAxis && (container.lockX || container.lockY)) ? swipeDiffer.differYStart + ((container.moveY - swipeDiffer.moveY) + e.pageY) : coords[1];
									}
								else{
									var x = (thisSwipe.xAxis && container.lockX) ? swipeDiffer.differXStart + ((container.moveX - swipeDiffer.moveX) + e.pageX) : coords[0];
									var y = (thisSwipe.yAxis && container.lockY) ? swipeDiffer.differYStart + ((container.moveY - swipeDiffer.moveY) + e.pageY) : coords[1];
									}

								if(!thisSwipe.free){
									self.bottomReached = ( y+100 < viewPort.height - container.height ) ? true : false;
									self.topReached = ( y > 100 ) ? true : false;
									}

								if(params.move){
									params.move({
										x: x,
										y: y
										}, e);
									return;
									};
								
								if(!self.bottomReached && !self.topReached){
									setTranslateCoords(self, [x, y]);
									}
							},
						
						endSwipe: function ( e ) {
							onSwipe = false;
							var timerDiffer = swipeDiffer.timerEnd - swipeDiffer.timerStart;
							// Calculate kinetic scroll on Y axis
							var swipeYdiffer = container.endY - container.startY;
							
							var kineticY = ( ( ( swipeYdiffer < 0 ) ? -1 : 1 ) * swipeYdiffer / timerDiffer * 2 ) * swipeYdiffer;
							var easeEndY = container.endY+kineticY;

							if ( easeEndY > 0 ) { easeEndY = 0; };

// TODO: Make viewport passable as parameter
							if( easeEndY <  viewPort.height - container.height) {
								easeEndY = viewPort.height - container.height;
//								easeEndY = 0;
								};

							// Calculate kinetic scroll on X axis
							var swipeXdiffer = container.endX - container.startX;
							var kineticX = ( ( ( swipeXdiffer < 0 ) ? -1 : 1 ) * swipeXdiffer / timerDiffer * 2 ) * swipeXdiffer;
							
							var easeEndX = container.endX+kineticX;
							if ( easeEndX > 0 ) { easeEndX = 0; };

							if( easeEndX <  viewPort.width - container.width) {
								easeEndX = viewPort.width - container.width;
								};

							container.lockY = container.lockX = this.bottomReached = container.freeLock = false;
							swipeDiffer.differYStart = 0;
							swipeDiffer.differXStart = 0;

							// Call end swipe function if set
							if(params.endSwipe){
								params.endSwipe({
									x: container.endX,
									y: container.endY,
									kineticX: kineticX,
									kineticY: kineticY
									});
								return;
								};

							// else animate element
							var self = this;
							self.style[cssEngine+'Transition']= "all "+timerDiffer+"ms";
							setTranslateCoords( self, [ easeEndX, easeEndY ] );
							},

// Paginate
						paginate: function ( e ) {
							window.removeEventListener(swipeMove, initSwipeMoveListener, false);
							window.removeEventListener(swipeEnd, endSwipeTrigger, false);

							onSwipe = false;
							var timerDiffer = swipeDiffer.timerEnd - swipeDiffer.timerStart;

							var swipeYdiffer = container.endY - container.startY;
							var swipeXdiffer = container.endX - container.startX;
							var direction = (swipeXdiffer > 0) ? -1 : 1;
							
							var self = this;

							// If user moves more than 10% > paginate 
							var exceeded = false;
							if(container.currentPage+direction >= 0 && container.currentPage+direction <= container.pages.length-1 && (Math.abs(swipeXdiffer) > (container.width * .1))) {
								container.currentPage = Math.abs(container.currentPage+direction);
								exceeded = true;
								};
													
							self.style[cssEngine+'Transition']= "all "+((timerDiffer > 300) ? 300 : timerDiffer)+"ms ease-out";
							setTranslateCoords( self, [ ((-1*container.currentPage)*container.width), 0 ] );
							container.lockY = container.lockX = false;

							if(exceeded){
								for (var i =0, j = container.pages.length; i < j; i++) {
									container.pages[i].style.display = (i > container.currentPage-2 && i < container.currentPage+2) ? 'block' : 'none';
									};
								}
							},

						getSize: function ( ) {
							console.log ( this ) 
							},
					
						kill: function() {
							self.removeEventListener(swipeStart, initSwipeListener, false);
							delete self.fpSwipe;
							}
						};
					} ).call( params.elem, params ); // use call to bind actual element as THIS
				}
			};
		})();
	if ( window.fp ) {
		fp.swipe = fp_module_swipe;
		}
	else window.fpSwipe = fp_module_swipe;
	})();