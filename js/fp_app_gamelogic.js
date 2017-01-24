var unweave = {
	tool			: false,
	routeJoints 	: [],
	circleSize		: 8,
	circleSelectedSize	: 12,
	circleStaticSize	: 4,
	solved			: false,
	moves			: 0,
	editMode		: false,
	gravity 		: 0.5,
	damping			: 0.9,
	traction		: 0.8,
	bounceFactor	: 0.7,
	level			: 1,
	admin			: false,
	options			: {
		'bgrAnimations' : true,
		'soundEffects' : false
		},

	loadSounds : function(){
		fpAudio.loadAudio('unweave', 'mouseup', 'sounds/cowbell.'+fpAudio.support, 1);
		fpAudio.loadAudio('unweave', 'levelcleared', 'sounds/level_clear.'+fpAudio.support, 1);
		},

	colors 			: {
		'fill' : {
			'gray'	: 'rgb(150,138,128)',
			'red'	: 'rgb(231,76,60)',
			'green' : 'rgb(46,204,113)',
			'blue'	: 'rgb(52,152,219)'
			},
		'stroke' : {
			'unweaved': 'rgba(255,255,255,.7)',
			'gray'	: 'rgb(150,138,128)',
			'crossing'	: 'rgba(52,152,219,.5)'
			}
		},
	pixelRatio : (window.devicePixelRatio) ? Math.floor(window.devicePixelRatio) : 1,

// Initialize game
	init: function(params){
		// Set canvas conf
		this.level = params.level;
		this.colorMap = [this.colors.fill.gray, this.colors.fill.green, this.colors.fill.red, this.colors.fill.blue];

		this.drawContainer = document.querySelector('.canvas-container');

		var self = this;

		var gamefieldWidth = this.drawContainer.getBoundingClientRect().width; //window.innerWidth
		var gamefieldHeight = this.drawContainer.getBoundingClientRect().height; //window.innerWidth

		this.canvasContainer = document.createElement("CANVAS");
		this.canvasContainer.width = gamefieldWidth*this.pixelRatio ; //320;
		this.canvasContainer.height = gamefieldHeight*this.pixelRatio; //320;
		this.canvasContainer.style.width = gamefieldWidth+"px";
		this.canvasContainer.style.height = gamefieldHeight+"px";
		this.drawContainer.appendChild(this.canvasContainer);

		this.canvasSize = [gamefieldWidth, gamefieldHeight];

		this.canvasContainer._x = this.canvasContainer.getBoundingClientRect().left;
		this.canvasContainer._y = this.canvasContainer.getBoundingClientRect().top;
		this.canvasPixels = this.canvasContainer.getContext("2d");

//		Add unweave event listener
		this.canvasContainer.addEventListener(globalMouseUp, function(){
			if(this.solved) {
				return;
				}
			this.solve();
			}.bind(this), false);


		this.changeTool({tool: self.tools.move.bind(this), el: document.querySelector('.draw-ui-edit')});

		var restart = document.querySelector('.restart');
		restart.addEventListener(globalClickEvent, function(){
			this.restart({level : this.level});
			}.bind(this), false);

//
		var vent = new CustomEvent("gamefieldready", {detail: {container: this.canvasContainer}});
		document.dispatchEvent(vent);

// Start game
		self.restart(params);
		},


// Background animations
	initBgr: function(params){
		if(!this.options.bgrAnimations) {return};
		var starsCount = 3 + Math.round(Math.random()*5);
		var container = document.querySelector('.bubbles');
		for(var i=0, j=starsCount; i<j; i++){
			var size = 10 + Math.round(Math.random()*30);
			var color = Math.round(Math.random()*4);
			var elem = fpDOM.renderer._DIV({
				cssClass : 'bubble bubble-'+color,
				cssStyle: 'left: '+Math.random()*params.container.getBoundingClientRect().width+'px; top: '+Math.random()*params.container.getBoundingClientRect().height+'px;'+
							'width:'+size+'px; height:'+size+'px; border-radius:'+size+'px'
				});
			container.appendChild(elem);
			}
		fpApp.helpers.wp8tilt({'container': container.parentNode, 'el': container});
		},

// Collapse animation
	collapse: function() {
		// Changes this:
		var jointBounce = new Array(this.routeJoints.length+1).join(1).split('').map(parseFloat);
		var jointBounceEnd = Array(this.routeJoints.length+1).fill(0);

		var iterations = 0;
		var collapseAnimation = setInterval(function(){
			for(var i=0, j=this.routeJoints.length; i<j;i++){
				if(this.routeJoints[i] && !this.routeJoints[i].bounceHistory){
					this.routeJoints[i].bounceHistory = 0;
				}

				if(this.routeJoints[i] &&this.routeJoints[i].bounceHistory < 10){
					this.routeJoints[i][1] = Number(this.routeJoints[i][1])+jointBounce[i];
					jointBounce[i]+=this.gravity;

					if(this.routeJoints[i] && this.routeJoints[i][1] + this.circleSize > (this.canvasContainer.height / this.pixelRatio)) {
						this.routeJoints[i][1] = (this.canvasContainer.height / this.pixelRatio)-this.circleSize;
						jointBounce[i]*= -this.bounceFactor;
						}

						if(Math.round(this.routeJoints[i][1] + this.circleSize) >(this.canvasContainer.height / this.pixelRatio)-0.5) {
							this.routeJoints[i].bounceHistory++;
						}
					}
			    else{
					jointBounceEnd[i] = 1;
			    	}
				var sum = jointBounceEnd.reduce(function(a, b) {return a + b;}, 0);
				if(sum === this.routeJoints.length) {
					clearInterval(collapseAnimation);
					this.level=parseInt(this.level)+1;
					this.restart({level: this.level});
					}
				};

			this.plot({skipTest: true});

			}.bind(this), 1000/60);

		},

// Start new level
	restart: function(params){
		// load level from levels object
		var tempJoints;
		if(this.levels && this.levels[params.level]) {
			tempJoints = JSON.parse(JSON.stringify(this.levels[params.level].routeJoints));  // don't know why this works but it does :|
			this.routeJoints = tempJoints;
			}

		// if level doesn't exist create new randomized level
		else {
			delete this.routeJoints;
			tempJoints = [];
			for(var i=0, j = 13; i<j;i++){
				tempJoints.push([Math.round(Math.random()*320), Math.round(Math.random()*320), Math.round(Math.random()*2)]);
				}
			this.routeJoints = tempJoints;
			}
		// Dispatch restart game event
		var vent = new CustomEvent("restartGame", {
			detail: {
				timerStart: this.timer,
				timerEnd: new Date(),
				level: this.level
				}
			});
		document.dispatchEvent(vent);

		this.routeJoints = this.scaleLevel(tempJoints);
		this.moves = 0;
		this.timer = new Date();
		this.collisionDetected = true;
		this.solved = false;
		this.plot();

		var timercontainer = document.querySelector('.timer');
		var count = 0;
		if(this.timerCounter) {
			clearInterval(this.timerCounter);
			}

		this.timerCounter = setInterval(function(){
			var time = parseFloat(((new Date() - this.timer) / 100)/10).toFixed(1);
			timercontainer.innerHTML = time;
			if(!this.levels[this.level]) {
				this.levels[this.level] = {};
				}
			this.levels[this.level].time = time;
			}.bind(this), 100);
		},

	scaleLevel : function(level) {
		var baseW = 320,
			baseH = 320,
			levelW = this.canvasSize[0]-40,
			levelH = this.canvasSize[1]-40;

		for(var i=0, j=level.length; i<j;i++) {
			level[i][0] = level[i][0]*(levelW/baseW)+20;
			level[i][1] = level[i][1]*(levelH/baseH)+20;
			}
		return level;
		},
// Change tool [Move, add point, delete point]
	changeTool: function( params ) {
			var self = this;
			var tools = document.querySelectorAll('.draw-ui');
			for(var i=0, j=tools.length; i<j;i++){
				tools[i].classList.remove('selected');
				}
			if(params.el){
				params.el.classList.add('selected');
				}
			if(self.tool){
				this.canvasContainer.removeEventListener(globalMouseMove, self.tool, false);
				this.canvasContainer.removeEventListener(globalMouseDown, self.tool, false);
				this.canvasContainer.removeEventListener(globalMouseUp, self.tool, false);
				}

			this.tool = params.tool;
			if(params.init){
				params.init();
				}
			this.canvasContainer.addEventListener(globalMouseMove, self.tool, false);
			this.canvasContainer.addEventListener(globalMouseDown, self.tool, false);
			this.canvasContainer.addEventListener(globalMouseUp, self.tool, false);
		},

// draw current game
	plot: function(params) {
		window.requestAnimationFrame( function () {
			this.canvasPixels.clearRect(0,0, this.canvasContainer.width, this.canvasContainer.height);
			var lines = [];
			var colors = [];
			for(var i=1, j=this.routeJoints.length; i<j; i++){
				lines.push({
							ax: this.routeJoints[i-1][0], ay: this.routeJoints[i-1][1],
							bx: this.routeJoints[i][0], by: this.routeJoints[i][1],
							atype: this.routeJoints[i-1][2], btype: this.routeJoints[i][2]
							});
				}
			this.lines = lines;
			this.collisionDetected = false;

			if(!this.solved) {
				for(var i=0, j=lines.length; i<j; i++) {
					colors[i] = this.colors.stroke.unweaved;
					for(var k=0, l=lines.length; k<l; k++){
						if((lines[i].bx != lines[k].ax) && (lines[i].by != lines[k].ay) && (lines[i].ax != lines[k].bx) && (lines[i].ay != lines[k].by)) {
							var test = intersectLine(lines[i].ax, lines[i].ay, lines[i].bx, lines[i].by, lines[k].ax, lines[k].ay, lines[k].bx, lines[k].by, true); //add true to get collision point
							if(test){
								this.collisionDetected = true;
								colors[i] = this.colors.stroke.crossing;
								colors[k] = this.colors.stroke.crossing;
								}
							}
						}
					}
				}

			for(var i=0, j=lines.length; i<j; i++){
				this.canvasPixels.beginPath();
				this.canvasPixels.moveTo(lines[i].ax*this.pixelRatio, lines[i].ay*this.pixelRatio);
				this.canvasPixels.lineTo(lines[i].bx*this.pixelRatio, lines[i].by*this.pixelRatio);
				this.canvasPixels.strokeStyle = (!this.solved) ? colors[i] : this.colors.stroke.unweaved;
				this.canvasPixels.stroke();
				};

			// z-sort route joints. Moveable on top, unmoveable on bottom
			var routeJoints = this.routeJoints.slice(0).sort(function(a,b) { return (a[2] > b[2]) ? 1 : -1;}); // deep clone and re-arrange
			for(var i=0, j=routeJoints.length; i<j; i++){
				this.canvasPixels.clearArc(routeJoints[i][0]*this.pixelRatio, routeJoints[i][1]*this.pixelRatio ,size*this.pixelRatio, size*this.pixelRatio);
				this.canvasPixels.beginPath();
				this.canvasPixels.fillStyle = this.colorMap[routeJoints[i][2]];
				if(routeJoints[i][2] === 0) {this.canvasPixels.fillStyle = this.colors.fill.gray;}
				var size = this.circleSize;
				this.canvasPixels.arc(routeJoints[i][0]*this.pixelRatio, routeJoints[i][1]*this.pixelRatio ,size*this.pixelRatio, 0, Math.PI*size*this.pixelRatio, false);

				this.canvasPixels.fill();
				}
			}.bind(this));
		},

	solve: function(){
		if(!this.collisionDetected && !this.editMode) {
			this.solved = true;
			this.selectedPoint = -1; // false;
			clearInterval(this.timerCounter);
			var fxEvent = new CustomEvent("playsound", {detail: {soundbank: 'unweave', fx: 'levelcleared'}});
			document.dispatchEvent(fxEvent);
			var vent = new CustomEvent("puzzlesolved", {
				detail: {
					timerStart: this.timer,
					timerEnd: new Date()
					}
				});

			document.dispatchEvent(vent);

			var gameProgress = JSON.parse(localStorage.getItem('unweave')) || {};

			gameProgress[this.level] = {
				'level' : this.level,
				'name'	: this.levels[this.level].name,
				'solved': true,
				'moves' : Number(this.levels[this.level].moves),
				'time' 	: Number(this.levels[this.level].time)
				};

			localStorage.setItem('unweave', JSON.stringify(gameProgress));
			this.collapse.bind(this);
			}
		},


// tools for move, drawing and deleting points
	tools: {
		move: function ( e ) {
			e.preventDefault();
			var winX = -1*this.canvasContainer.getBoundingClientRect().left;
			var winY = -1*this.canvasContainer.getBoundingClientRect().top;

			if(e.type == 'touchstart' || e.type == 'mousedown') {
				document.dispatchEvent(new CustomEvent("playsound", {detail: {soundbank: 'unweave', fx: 'mouseup'}}));

				if(e.touches) e = e.touches[0];

				var vent = new CustomEvent("canvasMouseDown", {detail: {y: (e.pageY+winY), x: (e.pageX+winX)}});
				document.dispatchEvent(vent);

				for(var i=0, j=this.routeJoints.length; i<j; i++){
					if( Math.abs((e.pageX+winX) - this.routeJoints[i][0]) < 16 && Math.abs((e.pageY+winY) - this.routeJoints[i][1]) < 16 && this.routeJoints[i][2] !== 0){
						this.drawing = true;

						// red dot - delete -->
						if(this.routeJoints[i][2] === 2) {
							this.routeJoints.splice(i,1);
							this.plot();
							return;
							}
						// <!-- red dot - delete
						this.selectedPoint = i;
						}
					}
				}

			if(e.type == 'mouseup' || e.type == 'touchend') {
				document.dispatchEvent(new CustomEvent("playsound", {detail: {soundbank: 'unweave', fx: 'mouseup'}}));
				this.selectedPoint = -1; // false;
				if(this.drawing){
					this.moves++;
					this.levels[this.level].moves = this.moves;
					}
				document.querySelector('.moves').innerHTML = this.moves;
				this.drawing = false;
				this.plot();
				}

			if(e.type == 'mousemove' || e.type == 'touchmove') {
				if ( this.drawing && !this.solved) {
					e.preventDefault();
					if(e.touches) e = e.touches[0];

					var xTo = e.pageX+winX;
					var yTo = e.pageY+winY;
					if(xTo-this.circleSize/2 < 0)  xTo = this.circleSize/2;
					if(xTo+this.circleSize/2 > this.canvasSize[0])  xTo = this.canvasSize[0] - this.circleSize/2;
					if(yTo-this.circleSize/2 < 0)  yTo = this.circleSize/2;
					if(yTo+this.circleSize/2 > this.canvasSize[1])  yTo = this.canvasSize[1] - this.circleSize/2;
					this.routeJoints[this.selectedPoint][0] = xTo;
					this.routeJoints[this.selectedPoint][1] = yTo;

					this.plot();
					}
				}
			},

// Remove route joints
		remove: function ( e ) {
			var winX = -1*this.canvasContainer.getBoundingClientRect().left;
			var winY = -1*this.canvasContainer.getBoundingClientRect().top;

			if(e.type == 'touchstart' || e.type == 'mousedown') {
				e.preventDefault();
				if(e.touches) e = e.touches[0];
				for(var i=0, j=this.routeJoints.length; i<j; i++){
					if( Math.abs((e.pageX+winX) - this.routeJoints[i][0]) < 16 && Math.abs((e.pageY+winY) - this.routeJoints[i][1]) < 16){
						this.drawing = true;
						this.selectedPoint = i;
						}
					}
				}

				if(e.type == 'mouseup' || e.type == 'touchend') {
					if ( this.drawing ) {
						this.routeJoints.splice(this.selectedPoint,1);

						this.canvasPixels.clearRect(0,0, this.canvasContainer.width, this.canvasContainer.height);
						this.canvasPixels.beginPath();
						this.canvasPixels.lineWidth = 0.8;
						this.canvasPixels.strokeStyle = "rgb(255,255,255)";

						this.plot();

						}
					this.drawing = false;
					}
			},
		}
	};
/*
http://jsperf.com/line-intersection2/3
*/
var ccw = function (x1, y1, x2, y2, x3, y3) {
	x1 = Number(x1),
	y1 = Number(y1),
	x2 = Number(x2),
	y2 = Number(y2),
	x3 = Number(x3),
	y3 = Number(y3);

	var cw = ((y3 - y1) * (x2 - x1)) - ((y2 - y1) * (x3 - x1));
	return cw > 0 ? true : cw < 0 ? false : true /* colinear */;
	};

function intersectLine(x1, y1, x2, y2, x3, y3, x4, y4, isReturnPosition) {
	if (!isReturnPosition) {
		return ccw(x1, y1, x3, y3, x4, y4) != ccw(x2, y2, x3, y3, x4, y4) && ccw(x1, y1, x2, y2, x3, y3) != ccw(x1, y1, x2, y2, x4, y4);
		}

	var s1_x = x2 - x1,
		s1_y = y2 - y1,
		s2_x = x4 - x3,
		s2_y = y4 - y3;

	var s, t;

	s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
	t = ( s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);


	if (s >= 0 && s <= 1 && t >= 0 && t <= 1){
		// Collision detected
		var atX = x1 + (t * s1_x);
		var atY = y1 + (t * s1_y);
		return { x: atX, y: atY };
		}

	return false; // No collision
	}
