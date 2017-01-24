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
			var elem = document;
			};
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
						document.location.hash = this.route
						};
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
			};
		},
		
	
// Parse url; strip master layout and parameters and return those
	parseURL: function( paramsURL ){
		fp.ajax.abortAll();
		var redirect = { };
		var params = new Array( );

		var page = paramsURL.split("/");
		for(var i=1; i < page.length; i++){
			params.push(page[i]);
			};

		redirect.master = page[0];
		redirect.params = params;
		return redirect;
		},


// Redirect to page (template)
	redirect: function( loc ) {
		// Redirect only if master changes
		if(fpApp.location.master ==  loc.master){
			loc.params+=";doUpdate=true";
			};
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

		var par = {}
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
			};

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