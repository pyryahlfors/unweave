// Off the canvas
(function(){
	// Find all OTC toggle buttons and bind open/close toggle function
	var toggleMenuButtons = document.querySelectorAll(".show-otc");
	var toggleMenuButtonsButtons = new Array();
	for (var i = 0, j = toggleMenuButtons.length; i < j;  i ++ ){ toggleMenuButtonsButtons.push( toggleMenuButtons[i] ); };
	
	toggleMenuButtonsButtons.forEach(function ( a ){ 
		a.addEventListener('click', function( e ){
			toggleOTC ( this );
			e.preventDefault();
			}, this); 
		});
		
	var toggleOTC = function ( otc ) {
		// If OTC element has data
		var scrolltoTop = otc.getAttribute("data-scrolltop");
		
		// check is the screen element is visible
		var test = document.querySelector("BODY.off-the-canvas-visible-" + otc.getAttribute("data-otc") );
		if(typeof(document.createElement("DIV").classList) != 'undefined'){
			if(!test){
				if(scrolltoTop) window.scrollTo(0,0);
				document.querySelector("BODY").classList.add('off-the-canvas-visible-' + otc.getAttribute("data-otc"));
				}
			else{
				document.querySelector("BODY").classList.remove('off-the-canvas-visible-' + otc.getAttribute("data-otc"));
				};
			}
		else {
			if(!test){
				document.querySelector("BODY").className += ('off-the-canvas-visible-' + otc.getAttribute("data-otc"));
				}
			else{
				var removeClass = 'off-the-canvas-visible-' + otc.getAttribute("data-otc");
				var bodyClass = document.body.className; 
				bodyClass = bodyClass.replace(new RegExp('(\\s|^)'+removeClass+'(\\s|$)') , '' );
				
				}
			};
		};
	})();