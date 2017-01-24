/* Homepage view */
fpApp.expand({
	mother: 'layouts', 
	view: 'home', 
	content: function() {
		fpApp.players = (fpApp.players) ? fpApp.players : [];
		var container = document.querySelector('.main-content-container');
		
		var loadHomePage = (function(){
			var spinner = document.createElement("DIV");
			spinner.className = "spinner-container";
			spinner.innerHTML = fpApp.helpers.spinner();
			document.querySelector('.main-content-container').appendChild(spinner);

			var ajaxQuery = new fp.ajax.request({						
				file: fpApp.rootPath + '/layouts/home.html',
				
				success: function(result) {
					fpApp.helpers.removeSpinner({spinner: spinner});

					var contentFragment = document.createDocumentFragment();
					var contentContainer = document.createElement("DIV");
					contentContainer.className = "page fade-in";
					contentContainer.innerHTML = result;
					contentFragment.appendChild(contentContainer);
					document.querySelector('.main-content-container').appendChild(contentFragment);

					fpAnimate.watch({
						el: contentContainer, 
						listen: function(){}, 
						execute: function() {
							contentContainer.classList.remove('fade-in');
							var vent = new CustomEvent("homepageready", {detail: {container: document.querySelector('.menu-screen')}});
							document.dispatchEvent(vent);
							},
						unwatch: true
						});
					
					contentContainer.addEventListener(globalMouseDown, function(e){
						if(e.touches) e = e.touches[0];
						var winX = -1*document.querySelector('.menu-screen').getBoundingClientRect().left;
						var winY = -1*document.querySelector('.menu-screen').getBoundingClientRect().top;
						var vent = new CustomEvent("homepageMouseDown", {detail: {y: (e.pageY+winY), x: (e.pageX+winX)}});
						document.dispatchEvent(vent);
						}, true);

					}
				});
			});

		var hasContent = container.querySelector('.page');
		if(hasContent) {
			hasContent.classList.add('slideRight');
			fpAnimate.watch({
				el: hasContent, 
				execute: function() {
					var mainContainer = document.querySelector('.main-content-container');
					fpApp.helpers.trash(mainContainer);
					
					loadHomePage();
					},
				unwatch: true
				});
			}
		else{
			loadHomePage();
			};
		},

	rippleListener: (function(e){
		document.addEventListener('homepageMouseDown', function(e){
			if(unweave.options.bgrAnimations) {
				var ripple = fpDOM.renderer._DIV({
					cssClass : 'touch-point ripple',
					cssStyle: 'top: '+e.detail.y+'px; left: '+e.detail.x+'px;'
					});
				document.querySelector('.ripples').appendChild(ripple);

				fpAnimate.watch({
					el: ripple, 
					listen: function(){}, 
					execute: function() {
						ripple.parentNode.removeChild(ripple);
						},
					unwatch: true
					});
				}

			}, false);	
		})(),

// init background animations
	initBgr: (function(e){
		document.addEventListener('homepageready', function(e){
			var container = e.detail.container;
			if(!unweave.options.bgrAnimations) {return};
			var starsCount = 3 + Math.round(Math.random()*5);
			var container = document.querySelector('.bubbles');
			for(var i=0, j=starsCount; i<j; i++){
				var size = 10 + Math.round(Math.random()*30);
				var color = Math.round(Math.random()*4);
				var elem = fpDOM.renderer._DIV({
					cssClass : 'bubble bubble-'+color,
					cssStyle: 'left: '+Math.random()*container.getBoundingClientRect().width+'px; top: '+Math.random()*container.getBoundingClientRect().height+'px;'+
								'width:'+size+'px; height:'+size+'px; border-radius:'+size+'px'
					});
				container.appendChild(elem);
				}
			fpApp.helpers.wp8tilt({'container': container.parentNode, 'el': container});
			}, false);
		})()
	});
