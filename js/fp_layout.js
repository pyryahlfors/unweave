fpLayout = {
	set: function(data, json) {
		// Attach JSON data. e.g. {title}
		data = this.attachJSON(data, json);
		
		data = this.nestedTemplates(data);
		/* Evaluate javascript 
			e.g. {[Math.round(Math.random()*100])} 
		*/
		data = this.evaluate(data, json);

		/* Remove unused mustache */
		data = this.removeEmpty(data);
		return data;
		},

	evaluate: function(data) {
		var patt=new RegExp(/{\[(.*?)\]}/gm);
		var results=data.match(patt);
		for (var i in results) {
			data  = data.replace(results[i], function(){return eval(results[i])});
			}
		return data;
		},
	
	attachJSON: function(data, json) {
		if(!json) return data;
		for(var i in json) {
			var patt=new RegExp('{'+i+'}','gm');
			if(data.match(patt) != null) {
				data = data.replace(patt, json[i]);
				}
			}
		return data;
		},
	
	nestedTemplates: function(data){
		var patt=new RegExp(/\{template\/(.*?)\}/gm);
		var results=data.match(patt);
		for (var i in results){
			console.log(results);
			var layout = results[i];
			var templateData = layout.toString().replace(/(\{|\})/g,"").split("/");
			var template = templateData[1];
			var params = templateData[2];
			}
		return data;
		},

// Remove empty brackets
	removeEmpty: function(data) {
		var patt=new RegExp(/\{(.*?)\}/gm);
		if(data.match(patt) != null) {
			return data.replace(patt, '');
			}
		return data;
		}
	}