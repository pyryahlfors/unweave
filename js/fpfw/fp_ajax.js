/* Ajax */
(function(){
    "use strict";

    var ajaxGateway = (function () {
        if ( window.ActiveXObject ) {
            return new ActiveXObject("Microsoft.XMLHTTP");
			}
        else if ( window.XMLHttpRequest ) {
            return new XMLHttpRequest();
			}
        return false;
		});

    var ajax  = (function(){
        return {
            request: function ( params ) {
				var disableCache,
					parameters = "";
                if ( params.init ) {params.init()};

                var newRequest = ajaxGateway();

				newRequest.id = new Date().getTime();

				fp.ajax.queue.push({request : newRequest});
				
				if(params.parameters){
					parameters = '?'+params.parameters;
					}
				if(params.allowCache) {
					disableCache = '';
					}
				else {
					disableCache = ((params.parameters) ? '&' :  "?")+Math.round(Math.random()*100000);
					};
					
                if(params.method && params.method.toLowerCase() === 'post') {
                    newRequest.open("POST", params.file+parameters+disableCache, true);
                    newRequest.setRequestHeader("Content-Type", ((params.header) ? params.header : "application/x-www-form-urlencoded"));
					}

                else{
                    newRequest.open("GET", params.file+parameters+disableCache, true);
                    newRequest.setRequestHeader("Content-Type", ((params.header) ? params.header : "text/plain;charset=UTF-8"));
					};

                newRequest.send(((params.sendParams) ? params.sendParams : null));

                newRequest.onreadystatechange = function() {
					if ( this.params.load ) {
						this.params.load(this);
						};
                    if ( this.params.onReadyStateChange ) {
                        this.params.onReadyStateChange( this.req );
						};
                    // loading ....
                    if ( this.req.readyState != 4 ) {
                        if ( this.params.load ) {
                            this.params.load( );
							}
						};

                    // Request ready
                    if ( this.req.readyState === 4 ) {
                        if ( this.req.status === 200 && this.params.success ) {
                            this.params.success( this.req.responseText );
							}

                        if ( this.req.status !== 200 && this.params.fail ) {
                            this.params.fail( this.req );
							}
						};
					}.bind({params : params, req : newRequest});


                return newRequest;
            }
        };
    })();
	if(window.fp) {
		fp.ajax = ajax;
		}
	else {
		window.fpaZax = ajax;
		}
})();

var ajax = (window.fp) ? fp.ajax : window.fpaZax;
ajax.queue = [];
ajax.abortAll = function(){
	for(var i in ajax.queue) {
		ajax.queue[i].request.abort();
		delete ajax.queue[i].request;
		ajax.queue.splice(i,1);
		};
};