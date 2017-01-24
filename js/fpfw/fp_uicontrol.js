var fpUIC =
	{
	_x			: 0,
	_y			: 0,
	mouseDown	: 0,
	mouseOver	: false,
	wheel		: 0,
	keyDown		: false,
	screenWidth	: 0,
	screenHeight: 0,
	preventMM	: false,		// Prevent Mousemove default event
	preventMD	: false,		// Prevent MouseDown default event
	preventMU	: false,		// Prevent MouseUp default event
	preventMC	: false,		// Prevent click default event
	preventTS	: false,		// Prevent Touch Start default event
	preventTE	: false,		// Prevent Touch End default event
	preventTM	: false,		// Prevent Touch Move default event
	touchDevice	: false,
	evt			: window.event,
	started		: false,
	uAgent	: navigator.userAgent.toLowerCase(),


	init: function()
		{
		var el = document.createElement("DIV");
		el.setAttribute('ontouchstart', 'return;');
		this.touchDevice = (typeof el.ontouchstart == 'function') ? true : false;

		this.windowInit = false;
		if(fp.d == null)
			{
			setTimeout("fpUIC.init()", 10);
			return false;
			}
		this.updateResolution();
		if(!this.windowInit)
			{
			this.bindEvent(document, 'touchstart', this.mousedown, false);
			this.bindEvent(document, 'touchend', this.mouseup, false);
			this.bindEvent(document, 'touchmove', this.touchmove, false);
			this.bindEvent(document, 'mousemove', this.mousemove, false);
			this.bindEvent(document, 'mousedown', this.mousedown, false);
			this.bindEvent(document, 'mouseup', this.mouseup, false);
			this.bindEvent(document, 'click', this.mouseClick, false);
			this.bindEvent(document, 'keydown', this.keydown, false);
			this.bindEvent(document, 'keyup', this.keyup, false);
			this.bindEvent(document, 'DOMMouseScroll', this.mouseWheel, false);
			this.bindEvent(document, 'load', this.load, false);
			this.bindEvent(window, 'resize', this.updateResolution, false);
 			}
 		this.windowInit = true;

		if(!fpUIC.started)
			{
			if(document.createEvent)
				{
				var e = document.createEvent('Events');
				e.initEvent('fpUICInit', true, false);
				document.dispatchEvent(e);
				}
			fpUIC.started = true;
			}
		},

	updateResolution: function()
		{
		if (self.innerWidth)
			{
			fpUIC.screenWidth = document.body.clientWidth;
			fpUIC.screenHeight = self.innerHeight;
			}
		else	{
			fpUIC.screenWidth = document.documentElement.clientWidth;
			fpUIC.screenHeight = document.documentElement.clientHeight;
			}
		},

	touchmove: function(evt)
		{
		if(!evt) var evt = window.event;
		if(evt.touches.length == 1)
			{
			var touch = evt.touches[0];
			fpUIC._x = touch.pageX;
			fpUIC._y = touch.pageY;
			}
		if(fpUIC.preventTM) evt.preventDefault();
		},
		
	mousemove: function(evt)
		{
		if(!evt) var evt = window.event;
		if (evt.target) fpUIC.mouseOver = evt.target;
		fpUIC._x = document.all ? window.event.clientX : evt.pageX;
		fpUIC._y = document.all ? window.event.clientY : evt.pageY;
		if(fpUIC.preventMM)
			{
			(evt.preventDefault) ? evt.preventDefault() : evt.returnValue = false;
			}
		},

	mousedown: function(evt)
		{
		fpUIC.mouseDown = true;
		if (!evt) var evt = window.event;
		if (evt.target) fpUIC.mouseOver = evt.target;
		else if (evt.srcElement) fpUIC.mouseOver = evt.srcElement;

		if(evt.touches && evt.touches.length == 1)
			{
			var touch = evt.touches[0];
			fpUIC._x = touch.pageX;
			fpUIC._y = touch.pageY;
			}
		else{
			fpUIC._x = document.all ? window.event.clientX : evt.pageX;
			fpUIC._y = document.all ? window.event.clientY : evt.pageY;
			}
		if(fpUIC.preventMD)
			{
			(evt.preventDefault) ? evt.preventDefault() : evt.returnValue = false;
			}
		},

	mouseup: function(evt)
		{
		if (!evt) var evt = window.event;
		fpUIC.mouseDown = false;
		fpUIC.mouseOver = false;
		if(fpUIC.preventMU)
			{
			(evt.preventDefault) ? evt.preventDefault() : evt.returnValue = false;
			}
		},
	
	keydown: function(evt)
		{
		fpUIC.keyDown = evt.keyCode;
		return fpUIC.keyDown;
//		return fpUIC.keyDown;
		},
	
	keyup: function()
		{
		fpUIC.keyDown = false;
		},
	
	bindEvent: function(controller, evtType, func)
		{
		controller.addEventListener(evtType, func, false);
		if(!controller.bindedEvents) {controller.bindedEvents = []};
		controller.bindedEvents.push([evtType, func]);
		},

	removeEvent: function(controller, evtType, func)
		{
		if(controller.removeEventListener)
			{
			controller.removeEventListener(evtType, func ,false);
			}
		else if(controller.detachEvent)
			{
			controller.detachEvent(evtType, func);
			}
		},
	
	mouseClick: function(e)
		{
		if(!e) var e = window.event;
		var rightclick = false;
		if (e.which) rightclick = (e.which == 3);
		else if (e.button) rightclick = (e.button == 1);
		if (rightclick)
			{
			var clickTarget = (e.target) ? e.target : e.srcElement;
			if(clickTarget.rightClick)
				{
				setTimeout(clickTarget.rightClick, 0);
				e.cancelBubble = true;
				if (e.stopPropagation) e.stopPropagation();
				return false;
				}
			}
		},
	
	load: function(e)
		{
		},

	mouseWheel: function(e)
		{
		if (!e) e = window.event;
		if (e.wheelDelta)
			{
			fpUIC.wheel = e.wheelDelta/120; 
			if (window.opera) fpUIC.wheel*=-1;
			}
		else if (e.detail)
			{
			fpUIC.wheel = -e.detail/3;
			}
		}
	};