'use strinct';
var Https = require('https');
var Config = require('../../Config');
var CustomerVPSAClient = {};
exports = module.exports = CustomerVPSAClient;

var pathApi = Config.PATH_VPSA + '/terceiros';
var token = "?token=" + Config.TOKEN_VPSA;

CustomerVPSAClient.create = function(newCustomer, callback) {	
	if(!newCustomer) {
    	callback("[CustomerVPSAClient.create][Error: newCustomer parameter is empty]");        
    }else{
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': newCustomer.length}
    	};

	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {		  
	        	callback(null, body);
	        });
	    }); 

	    req.on('error', function(e) {
	    	callback("[CustomerVPSAClient.create][Error: " + e.message + "]");
	    });

	    req.write(newCustomer);
	    req.end();
    }
};

/*CustomerVPSAClient.create("{\"nome\":\"teste created by node 3\",\"documento\":\"738.881.736-04\"}", function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

CustomerVPSAClient.getById = function(customerId, callback) {		
	if(!customerId) {
		callback("[CustomerVPSAClient.getById][Error: customerId parameter is empty]");
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + "/" + customerId + token, 
			method: 'GET'
		};

		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				callback(null, body);
			});
		});

		req.on('error', function(e) {
			callback("[CustomerVPSAClient.getById][Error: " + e.message + "]");			
		});		
		req.end();
	}	
};

/*CustomerVPSAClient.getById(4, function(err, result){
	if(err){ console.log(err); }
	else{ console.log(result); }	
});*/

CustomerVPSAClient.getAll = function(callback) {		
	var options = { 
		host: Config.HOSTNAME_VPSA, 
		path: pathApi + token, 
		method: 'GET'
	};

	var req = Https.get(options, function(res) {	
		res.setEncoding(Config.ENCODE);
		res.on('data', function (body) {		  
		  callback(null, body);
		});
	});

	req.on('error', function(e) {		
		callback("[CustomerVPSAClient.getAll][Error: " + e.message + "]");
	});	
	req.end();
};

/*CustomerVPSAClient.getAll(function(err, result){
	if(err){ console.log(err); }
	else{ console.log(result); }	
});*/

CustomerVPSAClient.getByDocument = function(customerDocument, callback) {		
	if(!customerDocument) {		
		callback("[CustomerVPSAClient.getByDocument][Error: customerDocument parameter is empty]");		
	} else {
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + "?documento=" + customerDocument + "&token=" + Config.TOKEN_VPSA, 
			method: 'GET' 
		};

		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {			 
			  callback(null, body);			  
			});
		});

		req.on('error', function(e) {
			callback("[CustomerVPSAClient.getByDocument][Error: " + e.message + "]");		  
		});
		req.end();
	}
};

/*CustomerVPSAClient.getByDocument("738.881.736-04", function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

CustomerVPSAClient.update = function(updateCustomer, idUpdateCustomer, callback) {	
	if(!updateCustomer) {
		callback("[CustomerVPSAClient.update][Error: updateCustomer parameter is empty]");				
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + "/" + idUpdateCustomer + token, 
			method: 'PUT', 
			headers: {'Content-Type': 'application/json', 'Content-Length': updateCustomer.length}
		};

	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	callback(null, body);	            
	        });
	    });

	    req.on('error', function(e) {
	    	callback("[CustomerVPSAClient.update][Error: " + e.message + "]");
		});		    
		req.write(updateCustomer);
		req.end();
	}
};

/*CustomerVPSAClient.update("{\"nome\":\"xxxxxxxxxxxxx\",\"documento\":\"738.881.736-04\"}", 14,  function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/