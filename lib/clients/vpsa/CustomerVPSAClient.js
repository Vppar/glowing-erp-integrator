'use strinct';
var Https = require('https');
var Config = require('../../Config');
var CustomerVPSAClient = {};
exports = module.exports = CustomerVPSAClient;

var pathApi = Config.PATH_VPSA + '/terceiros';
var token = '?token=' + Config.TOKEN_VPSA;

CustomerVPSAClient.create = function(subscriptionUUID, newCustomer, callback) {	
	if(!newCustomer) {
    	callback('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: NewCustomer parameter is empty]');        
    }else{
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': newCustomer.length}
    	};

    	console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options) +'][Customer: '+ JSON.stringify(newCustomer) +']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	
	        	if(body && typeof body == 'number'){
	        		console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');	  
	        		callback(null, body);
	        	}else{
		        	console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: unexpected answer, body not a number][Body: '+ body +']');	  
		        	callback(body);
	        	}
	        });
	    }); 

	    req.on('error', function(e) {
	    	console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS-Error: '+JSON.stringify(e)+']');
	    	callback('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
	    });

	    req.write(newCustomer);
	    req.end();
    }
};

CustomerVPSAClient.getByDocument = function(subscriptionUUID, customerDocument, callback) {		
	if(!customerDocument) {		
		callback('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][Error: customerDocument parameter is empty]');		
	} else {
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '?documento=' + customerDocument + '&token=' + Config.TOKEN_VPSA, 
			method: 'GET' 
		};

		console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+']');
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				
				if(body === Config.customer.EMPTY_RESULT){
					console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		 
				    callback(null, body);		
				}else{
					try{
						var bodyList = JSON.parse(body);
						
						if(bodyList && bodylist[0] && bodyList[0].id){
							console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		 
						    callback(null, body);							
						}else{
							console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
							callback(body);								
						}
					}catch (e){
						console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
						callback(body);					
					}
				}
			})
		});

		req.on('error', function(e) {
			console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
			callback('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');		  
		});
		req.end();
	}
};

CustomerVPSAClient.update = function(subscriptionUUID, updateCustomer, idUpdateCustomer, callback) {	
	if(!updateCustomer) {
		callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: updateCustomer parameter is empty]');				
	}else if(!idUpdateCustomer){
		callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: idUpdateCustomer parameter is empty]');		
	}else{	
		
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + idUpdateCustomer + token, 
			method: 'PUT', 
			headers: {'Content-Type': 'application/json', 'Content-Length': updateCustomer.length}
		};

		console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Customer: '+ JSON.stringify(updateCustomer) +']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');
	        	callback(null, body);	            
	        });
	    });

	    req.on('error', function(e) {
	    	console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
	    	callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
		});		    
		req.write(updateCustomer);
		req.end();
	}
};