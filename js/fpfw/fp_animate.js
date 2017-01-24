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