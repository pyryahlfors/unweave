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