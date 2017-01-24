/* Homepage view */
fpApp.expand({
	mother: 'layouts', 
	view: 'round', 
	content: function() {
		var players = (fpApp.players) ? fpApp.players : ['noname'];
		var container = document.querySelector('.page-content');

		var spinner = document.createElement("DIV");
		spinner.className = "spinner-container";
		spinner.innerHTML = fpApp.helpers.spinner();
		document.querySelector('.page').appendChild(spinner);

		var ajaxQuery = new fp.ajax.request({
			file: fpApp.rootPath + '/dummy.json',

			success: function(result) {
				fpApp.helpers.trash(container);
				fpApp.helpers.removeSpinner({spinner: spinner});
				
/* Load course data and attach templates to body */
				var courseData = JSON.parse(result);
				var contentFragment = document.createDocumentFragment();
				contentFragment.innerHTML = "";
// fill in hole templates
				for(var i=0, j=courseData.routes.length; i<j; i++){
					var temp = fpLayout.set(routeData(i), {
						count: i*100,
						hole : courseData.routes[i]['hole'],
						length : courseData.routes[i]['length'],
						par : courseData.routes[i]['par']
						});
					contentFragment.innerHTML += temp;
					};

				var pageContainer = fpDOM.renderer._DIV({
					cssClass: 'page-round',
					content: contentFragment.innerHTML
					});

				document.querySelector('.page-content').appendChild(pageContainer);
				document.body.classList.add('footer-visible');
				var footer = fpDOM.renderer._ELEM({
					elem: 'NAV',
					cssClass : 'footer-navigation'
					});
				
				document.querySelector('.page-content').appendChild(footer);
// fill in players templates
				for(var i=0, j=courseData.routes.length; i<j; i++){
					for(var k=0, l=players.length; k<l;k++){
						var contentFragment = document.createDocumentFragment();
						contentFragment.innerHTML = "";
							var temp = fpLayout.set(player(k), {
								name: players[k],
								hole: courseData.routes[i]['hole'],
								par : courseData.routes[i]['par']
								});
							document.querySelectorAll('.players')[i].innerHTML+= temp;
							};
						};

						
				var swipe = (window.fp && window.fp.swipe) ? fp.swipe : fpSwipe;
				swipe.init({
					elem : document.querySelector('.page-round'),
					viewport: document.querySelector('.page'),
					y : false,
					x : true,
					treshold : 50,
					paginate : true
					});

				var footerNavigation = document.querySelector('.footer-navigation');
				fpApp.helpers.trash(footerNavigation);

				var pagePrev = fpDOM.renderer._DIV({
					cssClass : 'tab prev',
					content : '<span class="icon-prev"></span>'
					});

				var menu = fpDOM.renderer._DIV({
					cssClass : 'tab menu',
					content : '<span class="icon-menu-large"></span>'
					});

				var pageNext = fpDOM.renderer._DIV({
					cssClass : 'tab next',
					content : '<span class="icon-next"></span>'
					});

				footerNavigation.appendChild(pagePrev);
				footerNavigation.appendChild(menu);
				footerNavigation.appendChild(pageNext);
			
				var paginateContainer = document.querySelector('.page-round');
				pageNext.addEventListener(globalTouchClick, function(){paginateContainer.fpSwipe.changePage.call(paginateContainer, 1, document.querySelector('.page-round'))}, false);
				pagePrev.addEventListener(globalTouchClick, function(){paginateContainer.fpSwipe.changePage.call(paginateContainer, -1)}, false);

				menu.addEventListener(globalTouchClick, function(){
					var scores = [];
					for(var i=0, j=players.length; i<j;i++){
						var scoreInputs = document.querySelectorAll('.page-round INPUT[data-player="'+players[i]+'"]');
						var tempArray = [players[i]];
						for(var k=0, l=scoreInputs.length; k<l;k++){
							tempArray.push(Number(scoreInputs[k].value));
							}
						scores.push(tempArray);
						}
					console.log(scores);
					}, false);

// Counters				
				(function(){
					var addButtons = document.querySelectorAll('BUTTON.counter');
					for(var i=0, j=addButtons.length; i<j;i++){
						addButtons[i].addEventListener(globalClickEvent, function(){
							var inputContainer = this.parentNode.querySelector('INPUT');
							var result = Number(inputContainer.value) + Number(this.getAttribute('data-count'));
							
							if(result < inputContainer.getAttribute('data-min')) {
								result = inputContainer.getAttribute('data-min');
								};
								
							inputContainer.value = result;
							inputContainer.className = "";
							if(result > inputContainer.getAttribute('data-par')) {inputContainer.className = "over"};
							if(result < inputContainer.getAttribute('data-par')) {inputContainer.className = "under"};
							}, false);
						}
					})();

/* Add Players */
				
				}
			});
		
		var player = function(){
		return	'<div class="row-container">'+
				'<div class="name col">{name}</div>'+
				'<div class="counter col">'+
					'<div class="counter-container">'+
						'<button class="counter minus" data-count="-1"><span class="icon-minus"></span></button>'+
						'<input type="text" class="holescore" data-hole="{hole}" data-player="{name}" data-playerid="{playerid} maxlength="2" value="{par}" disabled data-par="{par}" data-min="1" />'+
						'<button class="counter plus" data-count="+1"><span class="icon-plus"></span></button>'+
					'</div>'+
				'</div>'+
			'</div>';
			};
			
		var routeData = function(i){
			return '<div class="swipe-pages" style="left: {count}%;">'+
						'<div class="fairway-info">'+
							'<b>Väylä {hole}</b> - {length}m Par <span>{par}</span>'+
						'</div>'+
						'<div class="players">'+
						'</div>'+
					'</div>';
			};		
		}
	});
