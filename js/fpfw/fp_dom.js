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