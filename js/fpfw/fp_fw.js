/*
Fixed Point Framework
Version 0.3
*/

fp ={
	path		: 'lib/fpfw/',
	initStarted	: false,
	d			: document.body,
	head		: document.getElementsByTagName('head')[0],
	build		: [],

	init: function() {
		if(document.createEvent) {
			var e = document.createEvent('Events');
			e.initEvent('fpInit', true, false);
			document.dispatchEvent(e);
			}

		if(document.body == null) {fp.dready = setInterval(fp.checkBody, 10);}
		else {fp.checkBody();};
		},

	checkBody: function() {
		if(document.body != null)
			{
			fp.d = document.body;
			if(document.createEvent)
				{
				var e = document.createEvent('Events');
				e.initEvent('fpBodyReady', true, false);
				document.dispatchEvent(e);
				}
			clearInterval(fp.dready);
			};
		},

	createBuild: function() {
		/*
			parameters
			---------------
			path			: path, must include / at the end
			file			: filename
			init			: Javascript function to run after the script file is loaded
			disableCache	: true/false
			receipe			: true/false : returns true when the file is loaded
		*/

		if(fp.build.length == 0){for(var i=0; i < arguments.length; i++){fp.build.push(arguments[i]);};};
		if(fp.build.length == 0){return false;};
		fp.build[0].confirmLoad = ((fp.build[0].confirmLoad) ? fp.build[0].confirmLoad : 'typeof(fp)');
		if(!fp.build[0].flagged) {
			if(fp.build[0].path && fp.build[0].file){fp.include(fp.build[0]);}
			else{fp.build[0].init()}
			fp.build[0].flagged = true;
			}
		(eval(fp.build[0].confirmLoad) == 'undefined') ? false : fp.build.splice(0,1);
		setTimeout("fp.createBuild()", 10);
		},

	include: function ( inc ) {
		/*
			parameters
			---------------
			path			: path, must include / at the end
			file			: filename
			init			: Javascript function to run after the script file is loaded
			disableCache	: true/false
			receipe			: true/false : returns true when the file is loaded
		*/
		var scriptFile = document.createElement("script");
		scriptFile.src = ((typeof(inc.path) != 'undefined') ? inc.path : fp.path) + inc.file + ((inc.disableCache) ? '?disablecache='+Math.round(Math.random()*9999) : '');
		scriptFile.type = "text/javascript";
		fp.head.appendChild(scriptFile);
		if (scriptFile.readyState) {
			scriptFile.onreadystatechange = function() {
				if (scriptFile.readyState == "loaded" || scriptFile.readyState == "complete") {
					scriptFile.onreadystatechange = null;
					if(inc.init) {
						try			{inc.init();}
						catch(err)	{fp.handleError(err);};
						};
					if(inc.receipe) return true;
					};
				};
			}

		else {
			scriptFile.onload = function() {
				if(inc.init) {
					try			{eval(inc.init());}
					catch(err)	{fp.handleError(err);};
					}
				if(inc.receipe) return true;
				};
			};
		},

// Remove script file from HEAD
	remove: function(fileName) {
		var scripts = document.getElementsByTagName("script");
		for(var i=0; i < scripts.length; i++) {
			(scripts[i].src.indexOf(fileName) != -1) ? fp.head.removeChild(scripts[i]) : false;
			}
		},

	handleError: function ( errorData ) {
		var error = (document.getElementsByClassName("DIV", "errorHandler").length > 0) ? document.getElementsByClassName("DIV", "errorHandler")[0] : document.createElement("DIV");
		while(error.childNodes.length > 0){error.removeChild(error.firstChild);};
		error.className = "errorHandler";
		var errorTitle = document.createElement("H1");
		errorTitle.appendChild(document.createTextNode('Something went wrong'));
		alert(errorData);
		error.appendChild(errorTitle);
		error.appendChild(document.createTextNode(errorData));
		error.ontouchend = function(){fp.d.removeChild(this);}
		error.onclick = function(){fp.d.removeChild(this);}
		if ( fp.d == null ) {
			fp.waitBodyLoad = function() {
				if(fp.d != null) {
					clearInterval(fp.waitBodyLoad);
					document.body.appendChild(error);
					}
				};
			setInterval(fp.waitBodyLoad, 10);
			}
		else {
			document.body.appendChild(error);
			}
		},

	dependence: function(obj, objType){
		return (obj == objType) ? true : false;
		}
	};

fp.init(fp.path);

window.onerror = function(message, url, linenumber) {
//	alert("JavaScript error: " + message + " on line " + linenumber + " for " + url);
}