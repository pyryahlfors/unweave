/* Homepage view */
fpApp.expand({
	mother: 'layouts',
	view: 'play',
	content: function(params) {
		fpApp.players = (fpApp.players) ? fpApp.players : [];
		var container = document.querySelector('.main-content-container');

		var initGame = (function(){
			var spinner = document.createElement("DIV");
			spinner.className = "spinner-container";
			spinner.innerHTML = fpApp.helpers.spinner();
			document.querySelector('.main-content-container').appendChild(spinner);

			var ajaxQuery = new fp.ajax.request({
				file: fpApp.rootPath + '/layouts/play.html',

				success: function(result) {
					fpApp.helpers.removeSpinner({spinner: spinner});

					var contentFragment = document.createDocumentFragment();
					var contentContainer = document.createElement("DIV");
					contentContainer.className = "page flipIn";
					contentContainer.innerHTML = result;
					contentFragment.appendChild(contentContainer);
					document.querySelector('.main-content-container').appendChild(contentFragment);

					fpAnimate.watch({
						el: contentContainer,
						listen: function(){},
						execute: function() {
							contentContainer.classList.remove('flipIn');
							unweave.init({level: params[0]});
							},
						unwatch: true
						});
					document.querySelector('.game-status .level > SPAN').innerHTML = params[0];
					}
				});
			});

		var hasContent = container.querySelector('.page');
		if(hasContent) {
			hasContent.classList.add('topmost');
			hasContent.classList.add('slideRight');
			fpAnimate.watch({
				el: hasContent,
				execute: function() {
					var mainContainer = document.querySelector('.main-content-container');
					fpApp.helpers.trash(mainContainer);
					initGame();
					},
				unwatch: true
				});
			}
		else{
			initGame();
			};
		},

// Bind level solved listener
	solveListener: (function(e){
		document.addEventListener('puzzlesolved', function(e){
			if(unweave.solved && !unweave.collapsing) {
				setTimeout(function(){

					var solvedIndicator = fpDOM.renderer._DIV({
						cssClass : 'level-cleared fade-in',
						content : 'Unweaved'
						});
					document.querySelector('.scores').appendChild(solvedIndicator);
					var self = solvedIndicator;

					fpAnimate.watch({
						el: solvedIndicator,
						listen: function(){},
						execute: function() {
							self.classList.remove('fade-in');
							setTimeout(function(){self.classList.add('fade');}, 1000);
							setTimeout(function(){self.parentNode.removeChild(self)}, 2000);
							},
						unwatch: true
						});
					var collapse = new CustomEvent("unweaveCollapse", {detail: {}});
					document.dispatchEvent(collapse);

					unweave.collapse();
					}, 300);
				}
			}, false);
		})(),

// Ripple effect listener
	rippleListener: (function(e){
		document.addEventListener('canvasMouseDown', function(e){
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
// Restart level / new level listener
	restart: (function(e){
		document.addEventListener('restartGame', function(e){
				document.querySelector('.moves').innerHTML = 0;
				document.querySelector('.timer').innerHTML = 0;
				document.querySelector('.current-level > SPAN').innerHTML = e.detail.level;
			}, false);

		})(),

// init background animations
	initBgr: (function(e){
		document.addEventListener('gamefieldready', function(e){
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
