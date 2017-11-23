(function() {
	if ( !window.console ) {
		window.console = {log: function() {}};
		};
	})();

// Initialize kiintopiste framework
(function(){
	var initialized = false;
	// If run from local machine use relative path instead of fixed
	var appRoot = './unweave';

	// FP path
	var fpPath = appRoot + '/js/fpfw/';
	var loadFpfw = document.createElement("script");
	loadFpfw.src = fpPath+'fp_fw.js'+'?disablecache='+Math.round(Math.random()*9999);
	loadFpfw.language = "javascript";
	document.getElementsByTagName("head")[0].appendChild(loadFpfw);

	loadFpfw.onreadystatechange= function() {
		(this.readyState == 'complete' || this.readyState == 'loaded') ? fpInit() : false;
		};

	loadFpfw.onload = function() {
		fpInit();
		};



	var fpInit = function( ) {
	// Prevent double firing
		if(initialized) {
			return;
			};

		initialized = true;

		fp.path = fpPath; // Overwrite the default value
		fp.createBuild(
			{ path: appRoot + '/js/', file: 'fp_poly.js', init: false, confirmLoad: 'typeof(fp.poly)', disableCache: true },			// Polyfills
			{ path: fp.path, file: 'fp_animate.js', init: false, confirmLoad: 'typeof(cssAnimate)', disableCache: true },				// Kiintopiste animate lib
			{ path: fp.path, file: 'fp_ajax.js', init: false, confirmLoad: 'typeof(fp.ajax)', disableCache: true },						// Ajax
			{ path: fp.path, file: 'fp_dom.js', init: false, confirmLoad: 'typeof(fpDOM)', disableCache: true },						// DOM element renderer
			{ path: fp.path, file: 'fp_audio.js', disableCache: true, confirmLoad : 'typeof(fpAudio)' },								// Audio support
			{ path: appRoot + '/js/', file: 'fp_app.js', init: false, confirmLoad: 'typeof(fpApp)', disableCache: true },				// *** Routing ***
			{ path: appRoot + '/js/', file: 'fp_app_helpers.js', init: false, confirmLoad: 'typeof(fpApp.helpers)', disableCache: true },	// *** Helper functions ***
			{ path: appRoot + '/js/', file: 'fp_app_gamelogic.js', init: false, confirmLoad: 'typeof(unweave)', disableCache: true },	// unweave game
			{ path: appRoot + '/js/', file: 'levels.js', init: false, confirmLoad: 'typeof(unweave.levels)', disableCache: true },	// unweave game

/* Views - > */
			{ path: appRoot + '/js/views/', disableCache: true, file: 'options.js', confirmLoad: 'typeof(fpApp.layouts.options)' },
			{ path: appRoot + '/js/views/', disableCache: true, file: 'home.js', confirmLoad: 'typeof(fpApp.layouts.home)' },
			{ path: appRoot + '/js/views/', disableCache: true, file: 'play.js', confirmLoad: 'typeof(fpApp.layouts.play)' },
			{ path: appRoot + '/js/views/', disableCache: true, file: 'level_select.js', confirmLoad: 'typeof(fpApp.layouts.level_select)' },

			{
			// Everything is loaded - Initialize the application
				init: function( ) {
					// handle touch and click events
					var testTouch = document.createElement("DIV");
					testTouch.setAttribute('ontouchstart', 'return;');
					var isTouchDevice = (typeof testTouch.ontouchstart == 'function' && window.screenX === 0) ? true : false;

					window.globalClickEvent = (isTouchDevice) ? 'touchend' : 'click';
					if(isTouchDevice && fpApp.uAgent.match(/Windows Phone/i)) {
						window.globalClickEvent = 'click';
						}
					window.globalMouseDown = (isTouchDevice) ? 'touchstart' : 'mousedown';
					window.globalMouseUp = (isTouchDevice) ? 'touchend' : 'mouseup';
					window.globalMouseMove = (isTouchDevice) ? 'touchmove' : 'mousemove';

					window.globalTouchClick = (isTouchDevice) ? 'touchend' : 'click';

					(function(){
						var bodyStyle = document.createElement("STYLE");
						bodyStyle.setAttribute("type", "text/css");
						bodyStyle.appendChild(document.createTextNode('.main-content-container{'+cssAnimate.cssInnerPrefix+'perspective: '+document.body.clientWidth/2+'px}'));
						document.body.appendChild(bodyStyle);
						})();

					fpApp.start({});
				}
			});
		};
	})();
