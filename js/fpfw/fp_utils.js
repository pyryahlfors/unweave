/* Ajax */
(function(){
    "use strict";

    var ajaxGateway = (function () {
        if ( window.ActiveXObject ) {
            return new ActiveXObject("Microsoft.XMLHTTP");
			}
        else if ( window.XMLHttpRequest ) {
            return new XMLHttpRequest();
			}
        return false;
		});

    var ajax  = (function(){
        return {
            request: function ( params ) {
				var disableCache,
					parameters = "";
                if ( params.init ) {params.init()};

                var newRequest = ajaxGateway();

				newRequest.id = new Date().getTime();

				fp.ajax.queue.push({request : newRequest});

				if(params.parameters){
					parameters = '?'+params.parameters;
					}
				if(params.allowCache) {
					disableCache = '';
					}
				else {
					disableCache = ((params.parameters) ? '&' :  "?")+Math.round(Math.random()*100000);
					};

                if(params.method && params.method.toLowerCase() === 'post') {
                    newRequest.open("POST", params.file+parameters+disableCache, true);
                    newRequest.setRequestHeader("Content-Type", ((params.header) ? params.header : "application/x-www-form-urlencoded"));
					}

                else{
                    newRequest.open("GET", params.file+parameters+disableCache, true);
                    newRequest.setRequestHeader("Content-Type", ((params.header) ? params.header : "text/plain;charset=UTF-8"));
					};

                newRequest.send(((params.sendParams) ? params.sendParams : null));

                newRequest.onreadystatechange = function() {
					if ( this.params.load ) {
						this.params.load(this);
						};
                    if ( this.params.onReadyStateChange ) {
                        this.params.onReadyStateChange( this.req );
						};
                    // loading ....
                    if ( this.req.readyState != 4 ) {
                        if ( this.params.load ) {
                            this.params.load( );
							}
						};

                    // Request ready
                    if ( this.req.readyState === 4 ) {
                        if ( this.req.status === 200 && this.params.success ) {
                            this.params.success( this.req.responseText );
							}

                        if ( this.req.status !== 200 && this.params.fail ) {
                            this.params.fail( this.req );
							}
						};
					}.bind({params : params, req : newRequest});


                return newRequest;
            }
        };
    })();
	if(window.fp) {
		fp.ajax = ajax;
		}
	else {
		window.fpaZax = ajax;
		}
})();

var ajax = (window.fp) ? fp.ajax : window.fpaZax;
ajax.queue = [];
ajax.abortAll = function(){
	for(var i in ajax.queue) {
		ajax.queue[i].request.abort();
		delete ajax.queue[i].request;
		ajax.queue.splice(i,1);
		};
};

cssAnimate = {
	cssPrefix	: false,
	userAgent	: navigator.userAgent.toLowerCase(),

	init: function() {
		if(this.userAgent.indexOf('webkit') != -1) {
			this.cssPrefix = 'webkit';
			this.cssInnerPrefix = '-webkit-';
			}
		else if(this.userAgent.indexOf('opera') != -1) {
			this.cssPrefix = 'O';
			this.cssInnerPrefix = '-o-';
			}

		else if(this.userAgent.indexOf('msie') != -1) {
			this.cssPrefix = 'ms';
			this.cssInnerPrefix = '-ms-';
			}

		else if(this.userAgent.indexOf('trident') != -1){
			this.cssPrefix = 'ms';
			this.cssInnerPrefix = '-ms-';
			}

		else if(this.userAgent.indexOf('mozilla') != -1){
			this.cssPrefix = 'Moz';
			this.cssInnerPrefix = '-moz-';
			}

		else {
			this.cssPrefix = 'Moz';
			this.cssInnerPrefix = '-moz-';
			}
		},

	applyTransform: function(params) {
		var applyStyle = "";
		// If exist but not changed - use existing
		var rotate = (params.rotate) ? 'rotate('+params.rotate+'deg) ' : '';
		var translate = (params.translate) ? this.translate(params.translate) : '';

		return translate+rotate;
		},

	translate: function(params) {
		switch (this.cssPrefix)
			{
			case 'webkit':
			return 'translate3d('+params[0]+'px, '+params[1]+'px,0) ';
			break;

			default:
			return 'translate('+params[0]+'px, '+params[1]+'px) ';
			}
		}
	}

cssAnimate.init();

var fpAnimate = {
	init: function(){
	},

	watch: function( params ){
		if (!params.el) {return;};
		if (!params.execute) {params.execute = function(){}};
		if (!params.listen) {params.listen = function(){}};
		if( !params.iterate ) {params.iterate = function(){};};

// Animation start - listen
		var listen = function(){
			params.listen();
			}

		if(params.unwatch) {
			listen = function(){
				params.listen();
				params.el.removeEventListener("animationstart", listen);
				params.el.removeEventListener("webkitAnimationStart", listen);
				}
			}

// Animation iterate
		var iterate = function(){
			params.iterate();
			}

		if(params.unwatch) {
			iterate = function(){
				params.iterate();
				params.el.removeEventListener("animationiteration", iterate);
				params.el.removeEventListener("webkitAnimationIteration", iterate);
				}
			}

// Execute
		var execute = function(){
			params.execute();
			}

		if(params.unwatch) {
			execute = function(){
				params.execute();
				params.el.removeEventListener("animationend", execute);
				params.el.removeEventListener("webkitAnimationEnd", execute);
				}
			}


		params.el.addEventListener("animationstart", listen, false);
		params.el.addEventListener("animationend", execute, false);
		params.el.addEventListener("animationiteration", iterate, false);

		params.el.addEventListener("webkitAnimationStart", listen, false);
		params.el.addEventListener("webkitAnimationEnd", execute, false);
		params.el.addEventListener("webkitAnimationIteration", iterate, false);
	}
};

fpDOM = {
	init: function() {
		fpDOM.renderer = new fpDOM.templateEngine();
		},

	templateEngine: function() {
		}
	}

fpDOM.templateEngine.prototype = {
	_DIV: function ( params ) {
		var div = document.createElement("DIV");
		if(arguments.length > 0) {
			if(params.cssStyle) div.style.cssText = params.cssStyle;
			if(params.cssClass) div.className=params.cssClass;
			if(params.id) div.id=params.id;
			if(params.content) div.innerHTML=params.content;
			if(params.custom) this.returnCustom(params.custom, div);
			}
		return div;
		},

	_SPAN: function ( params ) {
		var span = document.createElement("SPAN");
		if(arguments.length > 0) {
			if(params.cssStyle) span.style.cssText = params.cssStyle;
			if(params.cssClass) span.className=params.cssClass;
			if(params.id) span.id=params.id;
			if(params.content) span.innerHTML=params.content;
			if(params.text) span.appendChild(document.createTextNode(params.text));
			if(params.custom) this.returnCustom(params.custom);
			}
		return span;
		},



	_H: function ( params ) {
		var titleElement = document.createElement("H"+params.type);
		if(params.cssStyle) titleElement.style.cssText = params.cssStyle;
		if(params.cssClass) titleElement.className = params.cssClass;
		titleElement.innerHTML = params.content;
		return titleElement;
		},

	_IMG: function ( params ) {
		var image = document.createElement("IMG");
		if(params.cssStyle) image.style.cssText = params.cssStyle;
		if(params.cssClass) image.className = params.cssClass;
		if(params.width) image.style.width = params.width;
		if(params.height) image.style.height = params.height;
		image.src = params.source;

		if(params.onload){
			image.vent = eval(params.onload);
			var self = image;
			image.onload = function(){
				self.confirmLoaded = setInterval(function(){
					if(self.complete){
						clearInterval(self.confirmLoaded);
						self.vent();
						}
					else {
						}
					}, 100, image);
				};
			}

		if(params.custom) this.returnCustom(params.custom, image);
		return image;
		},

	_P: function() {
		var paragraph = document.createElement("P");
		if(arguments[0].cssStyle) paragraph.style.cssText = arguments[0].cssStyle;
		if(arguments[0].cssClass) paragraph.className = arguments[0].cssClass;

		paragraph.innerHTML = arguments[0].content;

		return paragraph;
		},

	_ELEM: function ( params ) {
		var elem = document.createElement(params.elem);
		if(params.cssStyle) elem.style.cssText = params.cssStyle;
		if(params.cssClass) elem.className = params.cssClass;
		if(params.custom) this.returnCustom(params.custom, elem);
		if(params.content) elem.innerHTML=params.content;
		return elem;
		},

	returnCustom: function(params, elem) {
		for(var i=0, j=params.length; i<j; i++) {
			elem.setAttribute(params[i][0], params[i][1]);
			}
		}
	};

fpDOM.init();

fpDOM.templateEngine.prototype = {
	template: function() {
		}
	}

	fpAudio = {
		support: false,
		soundBanks : {},

		init: {},

		loadAudio: function(soundBank, sound, url, vol){
			var audio = new Audio();
			audio.src = url;
			audio.preload = "auto";
			audio.volume = vol;

			if(!fpAudio.soundBanks[soundBank]) {fpAudio.soundBanks[soundBank] = {};};
			fpAudio.soundBanks[soundBank][sound] = audio;

			audio.addEventListener("loadeddata", function(){
				fpAudio.soundBanks[soundBank][sound] = audio;
				fpAudio.soundBanks[soundBank][sound].channel = 0;
				fpAudio.soundBanks[soundBank][sound].channels = [];
				for( var i = 0; i <8; i++ ) {
					fpAudio.soundBanks[soundBank][sound].channels.push(audio.cloneNode(true) );
					};
				}, false);
			},

		playAudio: function(audioDetails){
			var soundBank = audioDetails.soundbank,
				sound = audioDetails.fx;
			if(!fpAudio.soundBanks[audioDetails.soundbank]) return;

			var channel = fpAudio.soundBanks[soundBank][sound].channel;
			channel+=1;
			if(channel >= 7) {channel = 0};
			fpAudio.soundBanks[soundBank][sound].channel = channel;
			fpAudio.soundBanks[soundBank][sound].channels[channel].pause();
			fpAudio.soundBanks[soundBank][sound].channels[channel].currentTime = 0;
			fpAudio.soundBanks[soundBank][sound].channels[channel].play();
			}
		};


	(function(){
		var myAudio = document.createElement('audio');
	    if (myAudio.canPlayType) {
			this.support = (function(){
				if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/mpeg')){
					return 'mp3';
				}
				if(!!myAudio.canPlayType && "" != myAudio.canPlayType('audio/ogg; codecs="vorbis"')){
					return 'ogg';
					}
			})();
			}
		}).call(fpAudio);

	document.addEventListener('playsound', function(e){
		fpAudio.playAudio(e.detail);
		}, false);
