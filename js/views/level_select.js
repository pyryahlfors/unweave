/* Homepage view */
fpApp.expand({
	mother: 'layouts',
	view: 'level_select',
	content: function() {
		fpApp.players = (fpApp.players) ? fpApp.players : [];
		var container = document.querySelector('.main-content-container');

		var loadLevelSelector = (function(){
			var spinner = document.createElement("DIV");
			spinner.className = "spinner-container";
			spinner.innerHTML = fpApp.helpers.spinner();
			document.querySelector('.main-content-container').appendChild(spinner);

			var ajaxQuery = new fp.ajax.request({
				file: fpApp.rootPath + '/layouts/level_select.html',

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
							var vent = new CustomEvent("levelSelectReady", {detail: {container: document.querySelector('.level-select')}});
							document.dispatchEvent(vent);
							},
						unwatch: true
						});


					contentContainer.addEventListener(globalMouseDown, function(e){
						if(e.touches) e = e.touches[0];
						var winX = -1*document.querySelector('.level-select').getBoundingClientRect().left;
						var winY = -1*document.querySelector('.level-select').getBoundingClientRect().top;
						var vent = new CustomEvent("levelselectMouseDown", {detail: {y: (e.pageY+winY), x: (e.pageX+winX)}});
						document.dispatchEvent(vent);
						}, true);

					var levelSelectScrollContainer = fpDOM.renderer._DIV({cssClass : 'level-select-container'});

					// get levels length
					var temp = function(obj) {
						var size = 0, key;
						for (key in obj) {
							if (obj.hasOwnProperty(key)) size++;
							};
						return size;
						};

					// Get the size of an object
					var size = temp(unweave.levels);

					var gameProgress = JSON.parse(localStorage.getItem('unweave')) || {};

					var closest = function(num, arr){
				        var curr = 0;
				        var diff = Math.abs (num - arr[0]);
				        for (var val = 0; val < arr.length; val++) {
				            var newdiff = Math.abs (num - arr[val]);
				            if (newdiff < diff) {
				                diff = newdiff;
				                curr = val;
				            }
				        }
				    return curr;
				};


					for(var i=0, j=size; i < j; i++) {
						var levelProgress = gameProgress[i+1];
						var time = (levelProgress) ? levelProgress.time : '-';
						var moves = (levelProgress) ? levelProgress.moves : '-';
						var levelHolder = fpDOM.renderer._DIV({cssClass : 'level'});

						var singleLevel = fpDOM.renderer._ELEM({
							elem: 'A',
							custom : [['href', '#/play/'+(i+1)]],
							cssClass: 'level-select-level',
							content: '<span class="game-level">'+(i+1)+'</span>'+'<span class="separator"></span>'
							});

						var levelScore = unweave.levels[i+1].score;
						var stars = 0;
						if(levelScore){stars = closest(time*moves, levelScore);}

						var levelOverallScore = fpDOM.renderer._DIV({
							cssClass: 'score score-'+stars,
							content: Array(4).join('<span></span>')
							});
						singleLevel.appendChild(levelOverallScore);
						levelHolder.appendChild(singleLevel);
						levelSelectScrollContainer.appendChild(levelHolder);
						};

					document.querySelector('.level-select').appendChild(levelSelectScrollContainer);
					fpApp.routeLinks(document.querySelector('.level-select'));
					}
				});
			});

		var hasContent = container.querySelector('.page');
		if(hasContent) {
			hasContent.classList.add('flipOut');
			fpAnimate.watch({
				el: hasContent,
				execute: function() {
					var mainContainer = document.querySelector('.main-content-container');
					fpApp.helpers.trash(mainContainer);
					loadLevelSelector();
					},
				unwatch: true
				});
			}
		else{
			loadLevelSelector();
			};
		},

	rippleListener: (function(e){
		document.addEventListener('levelselectMouseDown', function(e){
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
		document.addEventListener('levelSelectReady', function(e){
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
