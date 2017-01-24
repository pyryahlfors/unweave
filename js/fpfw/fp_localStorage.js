fpLS =  {
	supported		: false,
	size			: false,

	init: function() {
		this.supported = this.localStorageSupport();
		if(!this.supported){return false;};
		},
	
	format: function() {
		localStorage.clear();
		},

	write: function(params){
		localStorage.setObject(params.key, params.keydata);
	},

	read: function(params){
		return localStorage.getObject(params.key);
	},

	localStorageSupport: function(){
		try{
			return 'localStorage' in window && window['localStorage'] !== null;
			}
		catch(e){
			return false;
			}
		}
	}

Storage.prototype.setObject = function(key, value, usedb)
	{
	try{
		this.removeItem(key);
		this.setItem(key, JSON.stringify(value));
		}
	catch(e){
		console.log(e);
		}
	};

Storage.prototype.getObject = function(key, usedb) {
	return JSON.parse(this.getItem(key));
	};
	
fpLS.init();