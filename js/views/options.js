/* Homepage view */
fpApp.expand({
	mother: 'layouts', 
	view: 'options', 
	content: function() {
		var container = document.querySelector('.main-content-container');

		var loadOptions = (function(){
			var spinner = document.createElement("DIV");
			spinner.className = "spinner-container";
			spinner.innerHTML = fpApp.helpers.spinner();
			document.querySelector('.main-content-container').appendChild(spinner);

			var ajaxQuery = new fp.ajax.request({
				file: fpApp.rootPath + '/layouts/options.html',
				
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
							}
						});
					var toggleFullScreen = function() {
						if (!document.fullscreenElement &&    // alternative standard method
						!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
							if (document.documentElement.requestFullscreen) {document.documentElement.requestFullscreen();} 
							else if (document.documentElement.msRequestFullscreen) {document.documentElement.msRequestFullscreen();}
							else if (document.documentElement.mozRequestFullScreen) {document.documentElement.mozRequestFullScreen();}
							else if (document.documentElement.webkitRequestFullscreen) {document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);}
							}
						else {
							if (document.exitFullscreen) {document.exitFullscreen();}
							else if (document.msExitFullscreen) {document.msExitFullscreen();}
							else if (document.mozCancelFullScreen) {document.mozCancelFullScreen();}
							else if (document.webkitExitFullscreen) {document.webkitExitFullscreen();}
							}
						}

			
// Toggle sound effects
					var toggleSounds = contentContainer.querySelector('.menu-button.sfx');
					toggleSounds.querySelector('.sfx-status').innerHTML = (unweave.options.soundEffects) ? 'on' : 'off';
					toggleSounds.addEventListener(globalTouchClick, function(){
						unweave.options.soundEffects = !unweave.options.soundEffects;
						toggleSounds.querySelector('.sfx-status').innerHTML = (unweave.options.soundEffects) ? 'on' : 'off';
						if(unweave.options.soundEffects) {
							unweave.loadSounds();
							};
						}, false);

// Toggle background animations
					var togglAnimations = contentContainer.querySelector('.menu-button.animations');
					togglAnimations.querySelector('.animations-status').innerHTML = (unweave.options.bgrAnimations) ? 'on' : 'off';
					togglAnimations.addEventListener(globalTouchClick, function(){
						unweave.options.bgrAnimations = !unweave.options.bgrAnimations;
						togglAnimations.querySelector('.animations-status').innerHTML = (unweave.options.bgrAnimations) ? 'on' : 'off';
						}, false);
						
// Toggle fullscreen 
					var toggleFullscreen = contentContainer.querySelector('.menu-button.fullscreen');
					toggleFullscreen.querySelector('.fullscreen-status').innerHTML = (unweave.options.fullScreen) ? 'on' : 'off';
					toggleFullscreen.addEventListener(globalTouchClick, function(){
						unweave.options.fullScreen = !unweave.options.fullScreen;
						toggleFullscreen.querySelector('.fullscreen-status').innerHTML = (unweave.options.fullScreen) ? 'on' : 'off';
//						if(unweave.options.fullScreen) {
							toggleFullScreen();
//							};
						}, false);

						
					}
				});
			});

		var hasContent = container.querySelector('.page');
		if(hasContent) {
			hasContent.classList.add('topmost');
			hasContent.classList.add('slideLeft');
			fpAnimate.watch({
				el: hasContent, 
				execute: function() {
					var mainContainer = document.querySelector('.main-content-container');
					fpApp.helpers.trash(mainContainer);
					loadOptions();
					}
				});
			}
		else{
			loadOptions();
			};

		}
	});
