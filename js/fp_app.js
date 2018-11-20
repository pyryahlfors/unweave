fpApp = {
	location	: false,	// holds information about application location
	layouts		: {},
	home		: 'home',				// Default home
	html5pushHistory: {},				// Push state history stack
	usePushState	: false,			// If set to false application will use hash instead; .../home  ->  ...#/home
	rootPath		: '.',				// Root path for includes
	isOnLine		: navigator.onLine,	// is user online or offline
	uAgent			: navigator.userAgent,

	start: function( params ) {
		var animateSplash = (params.splash) ? true: false;
		this.removeSplash({animate: true});
		this.init();
		var vent = new CustomEvent("fpAppStarted", {
			detail: {
				timestamp: new Date().getTime()
				}
			});
		document.dispatchEvent(vent);
		},
// Initiliaze routing
	init: function( params ) {
		var content = this.handleURL( ),
			tempLoc = ( content === "" || !content ) ? this.parseURL( fpApp.home ) : this.parseURL( content );
		var vent = new CustomEvent("routeChange", {
			detail: {
				current: fpApp.location,
				route: tempLoc,
				time: new Date()
				}
			});
		document.dispatchEvent(vent);

		fpApp.redirect( tempLoc );
		},

	expand: function(params){
		fpApp[params.mother][params.view] = params.content;
		if(params.init){
			params.init();
			};
		},

	handleURL: function( ) {
		if ( this.usePushState ) {
			return window.location.pathname.slice( 1 );
			}
		else return window.location.hash.slice( 2 );
		},

	routeLinks: function( elem ) {
		if(!elem) {
			elem = document;
			}
		var links = elem.getElementsByTagName("A");
		for(var i=0, j=links.length; i<j; i++) {
			if(links[i].getAttribute("href") && links[i].getAttribute("href").indexOf('javascript:') == -1 && !links[i].classList.contains('do-not-route')) {
				links[i].route = links[i].getAttribute( "href" );
				links[i].removeAttribute( "href" );
				links[i].addEventListener( window.globalClickEvent, function( e ){
					if( fpApp.usePushState ) {
						history.pushState( fpApp.html5pushHistory, this.route, this.route );
						fpApp.init();
						return;
						}
					else{
						document.location.hash = this.route;
						}
					return;
					}, false);
				}
			}
		},

	// sets the current location
	route: function( path ) {
		if( fpApp.usePushState ) {
			history.pushState( fpApp.html5pushHistory, path,path );
			}
		else{
			document.location.hash = path;
			}
		},


// Parse url; strip master layout and parameters and return those
	parseURL: function( paramsURL ){
		fp.ajax.abortAll();
		var redirect = { };
		var params = new Array( );

		var page = paramsURL.split("/");
		for(var i=1; i < page.length; i++){
			params.push(page[i]);
			}

		redirect.master = page[0];
		redirect.params = params;
		return redirect;
		},


// Redirect to page (template)
	redirect: function( loc ) {
		// Redirect only if master changes
		if(fpApp.location.master ==  loc.master){
			loc.params+=";doUpdate=true";
			}
		if(typeof(fpApp.layouts[loc.master]) == 'function'){
			fpApp.location = loc;
			fpApp.layouts[loc.master](loc.params);
			}

		var vent = new CustomEvent("routeend", {
			detail: {}
			});
		document.dispatchEvent(vent);

		},

	stringToParameters: function(str, s,vs) {
		var sep = "&";
		var valsep = "=";
		if(s) {
			sep = s;
			valsep = vs;
			}

		var par = {};
		var prop = String(str).split(sep);

		for(var i=0;i<prop.length;i++) {
			var cprop = prop[i].split(valsep);
			if(cprop.length>=2)
				{
				var param = cprop.shift();
				par[param] = cprop.join("=");
				}
			}
		return par;
		},

	removeSplash: function(params){
		var splashScreen = document.querySelector('.splash-screen');
		if(!splashScreen) {
			window.scrollTo(0,0);
			return;
			}

		splashScreen.parentNode.removeChild(splashScreen);
		},

	handleError: function(message, url, linenumber){
		console.log(message + " | " + url + " | " + linenumber);
		return;
		}
	};


fpApp.usePushState = false; // (typeof(window.onpopstate) == 'undefined') ? false : true;

if(fpApp.usePushState){window.onpopstate = function(event){fpApp.init();};}
else{
	window.onhashchange = function(){fpApp.init();};
	};

window.onerror = function(message, url, linenumber) {
	return fpApp.handleError(message, url, linenumber);
	};

// Helpers
fpApp.helpers = {
	// Spinner
	spinner: function( ){
		return '<div class="spinner spinner-animation gray"></div>';
		},

	// Remove spinner(s)
	removeSpinner: function ( params ) {
		if(!params.spinner.length){var spinner = [params.spinner];}
		else{
			var spinner = [];
			for(var i = 0, j = params.spinner.length; i < j; i++) {
				spinner.push(params.spinner[i]);
				}
			}


		spinner.forEach(function(a){
			fpAnimate.watch({
				el: a,
				listen: function(){},
				execute: function() {
					a.parentNode.removeChild(a);
					fpApp.helpers.trash(a);
					},
				iterate: function(){
					}
				});

			a.classList.add('fade');

			}, this);
		},

	trash: function(el){
		if(!el) return;
		while(el.hasChildNodes()){
			for(var i in el.childNodes[0]){
				delete el.childNodes[0][i];

				};
			delete el.childNodes[0];
			el.removeChild(el.childNodes[0]);
			};
		},

	wp8tilt: function ( params ) {
		var elem = params.el;

		elem.elemBounding = params.container.getBoundingClientRect();
		elem.perspective = params.container.getBoundingClientRect().height;

		elem.width = elem.elemBounding.width;
		elem.height = elem.elemBounding.height;
		elem.top = elem.elemBounding.top;
		elem.left = elem.elemBounding.left;
		elem.mouseDown = false;


		params.container.addEventListener(globalMouseDown, function(e){
//			e.preventDefault();
			elem.mouseDown = true;
				if(e.touches) e = e.touches[0];
				var rotaX = (20/elem.width) * (elem.width/2 -(e.pageX -elem.left));
				var rotaY = (20/elem.height) * (elem.height/2 -(e.pageY -elem.top));
				elem.style.cssText = cssAnimate.cssInnerPrefix+'transition-duration: 500ms;'+
						cssAnimate.cssInnerPrefix+'transform: perspective('+elem.perspective+'px) rotateY('+(-1*rotaX)+'deg) rotateX('+(rotaY)+'deg)';
			}, true);

		params.container.addEventListener(globalMouseMove, function(e){
			e.preventDefault();

			if(elem.mouseDown) {
				if(e.touches) e = e.touches[0];

				var rotaX = (20/elem.width) * (elem.width/2 -(e.pageX -elem.left));
				var rotaY = (20/elem.height) * (elem.height/2 -(e.pageY -elem.top));
				elem.style.cssText = cssAnimate.cssInnerPrefix+'transition-duration: 0ms;'+
						cssAnimate.cssInnerPrefix+'transform: perspective('+elem.perspective+'px) rotateY('+(-1*rotaX)+'deg) rotateX('+(rotaY)+'deg)';
				}
			}, false);

		document.addEventListener(globalMouseUp, function(e){
			elem.mouseDown = false;
			elem.style.cssText = cssAnimate.cssInnerPrefix+'transition-duration: 500ms;'+
				cssAnimate.cssInnerPrefix+'transform: perspective('+elem.perspective+'px) rotateY(0deg)';
			}, true);
		},

	bindAnimations: function(el){
		var toggleButtons = el.querySelectorAll('.curtain-title');
		for (var i=0, j = toggleButtons.length; i < j; i++) {
			toggleButtons[i].addEventListener(globalClickEvent, function (e) {
				this.classList.toggle('closed');
				this.parentNode.querySelector('.curtain-content').classList.toggle('not-visible');
				});
			}
		},

	bindFunctions: function(el){
		if(!el) return;

		var closeButtons = el.querySelector('.close-button');
		if(!closeButtons){
			return;
			};
		closeButtons.addEventListener(globalClickEvent, function (e) {
			var anim = (this.getAttribute("data-animation")) ? (this.getAttribute("data-animation")) : false;
			var target = document.querySelector(this.getAttribute("data-target"));

			if(target) {
				fpAnimate.watch({
					el: target,
					listen: function(){},
					execute: function() {
						history.go(-1);
						}
					});

				target.classList.remove('flipIn');
				if(anim) {target.classList.add(anim)};
				};
			}, false);
		},

	formatDate: function(params){
		/* usage
			formatDate({
				dateString: 1399890145,
				dateFormat : 'dd.mm.yyyy'
				});
		*/
		if(!params.dateString) return;

		var dateString = new Date(params.dateString),
			dateFormat = (params.dateFormat) ? params.dateFormat : 'mm.dd.yyyy';

		var json = {
			dd : dateString.getDate(),
			yyyy : dateString.getFullYear(),
			mm : dateString.getMonth()+1
			};

		for(var i in json) {
			var patt=new RegExp(i ,'gm');
			if(dateFormat.match(patt) != null){
				dateFormat =    dateFormat.replace(patt, json[i]);
				};
			};
		return dateFormat;
		},

	secondsToMinutes: function(time){
		var minutes = Math.floor(time / 60);
		var seconds = time - minutes * 60;
		if(seconds < 10) seconds = "0"+seconds;
		return minutes+":"+seconds;
		}
	};
