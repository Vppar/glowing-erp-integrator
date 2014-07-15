'use strinct';

var Https = require('https');
var Config = require('../../Config');
var VPSAClientUtils = require('../../utils/VPSAClientUtils');
var StringUtils = require('../../utils/StringUtils');
var CustomerVPSAClient = {};

exports = module.exports = CustomerVPSAClient;

var pathApi = Config.PATH_VPSA + '/terceiros';
var token = '?token=' + Config.TOKEN_VPSA;

CustomerVPSAClient.create = function(subscriptionUUID, customerToCreate, callback) {	
	if(!customerToCreate) {
    	callback('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: NewCustomer parameter is empty]');        
    }else{

    	var customerToCreateJSON = StringUtils.removeAccents(JSON.stringify(customerToCreate));
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': customerToCreateJSON.length}
    	};

    	console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options) +'][Customer: '+ customerToCreateJSON +']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	var bodyAsInt = VPSAClientUtils.verifyValidId(body);
	        	if(bodyAsInt){
	        		console.log('[CustomerVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');	  
	        		callback(null, bodyAsInt);
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

	    req.write(customerToCreateJSON);
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
					console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
				    callback(null, null);		
				}else{
					var bodyObj = null;
					try{
						bodyObj = JSON.parse(body);	
					} catch (e) {
						console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][Error: Unable to parser body][Body: '+ body +']');	
						bodyObj = null;
					}

					if(bodyObj && bodyObj[0] && bodyObj[0].id){
						console.log('[CustomerVPSAClient.getByDocument][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
					    callback(null, bodyObj[0]);							
					}else{
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

CustomerVPSAClient.update = function(subscriptionUUID, customerToUpdate, callback) {	
	if(!customerToUpdate) {
		callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: customerToUpdate parameter is empty]');				
	}else if(!customerToUpdate.id){
		callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: idUpdateCustomer parameter is empty]');		
	}else{	
		
		var customerToUpdateJSON = StringUtils.removeAccents(JSON.stringify(customerToUpdate));
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + customerToUpdate.id + token, 
			method: 'PUT', 
			headers: {'Content-Type': 'application/json', 'Content-Length': customerToUpdateJSON.length}
		};

		console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Customer: '+ customerToUpdateJSON +']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	var bodyAsInt = VPSAClientUtils.verifyValidId(body);
	        	if(bodyAsInt) {
	        		console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');
		        	callback(null, bodyAsInt);
	        	} else {
		        	console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: unexpected answer, body not a number][Body: '+ body +']');	  
		        	callback(body);
	        	}
	        });
	    });

	    req.on('error', function(e) {
	    	console.log('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
	    	callback('[CustomerVPSAClient.update][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
		});		    
		req.write(customerToUpdateJSON);
		req.end();
	}
};

CustomerVPSAClient.getCustomerById = function(subscriptionUUID, customerId, callback) {		
	if(!customerId) {
		callback('[CustomerVPSAClient.getCustomerById][Error: customerId parameter is empty]');
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + customerId + token, 
			method: 'GET'
		};

		console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][CustomerId: '+ customerId +']');
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				
				if(body === Config.customer.EMPTY_RESULT){
					console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
				    callback(null, null);		
				} else {
					var bodyObj = null;
					try {
						bodyObj = JSON.parse(body);					
					} catch (e) {
						console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][Error: Unable to parser body][Body: '+ body +']');	
						bodyObj = null;
					}

					if(bodyObj && bodyObj[0] && bodyObj[0].id){
						console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
					    callback(null, bodyObj[0]);							
					} else {
						console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
						callback(body);								
					}
				}
			});
		});

		req.on('error', function(e) {
			console.log('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
			callback('[CustomerVPSAClient.getCustomerById][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');			
		});		
		req.end();
	}	
};

/*CustomerVPSAClient.getAll = function(callback) {		
	var options = { 
		host: Config.HOSTNAME_VPSA, 
		path: pathApi + token, 
		method: 'GET'
	};

	console.log('[CustomerVPSAClient.getAll][MessageRQ: '+JSON.stringify(options)+']');
	var req = Https.get(options, function(res) {	
		res.setEncoding(Config.ENCODE);
		res.on('data', function (body) {	
			
			if(body === Config.customer.EMPTY_RESULT){
				console.log('[CustomerVPSAClient.getAll][MessageRS: '+JSON.stringify(body)+']');		 
			    callback(null, null);		
			}else{
				try{
					var bodyList = JSON.parse(body);
					
					if(bodyList && bodylist.length > 0) {
						console.log('[CustomerVPSAClient.getAll][MessageRS: '+JSON.stringify(body)+']');		 
					    callback(null, bodyList);							
					}else{
						console.log('[CustomerVPSAClient.getAll][Error: unexpected answer][Body: '+ body +']');	
						callback(body);								
					}
				}catch (e){
					console.log('[CustomerVPSAClient.getAll][Error: unexpected answer][Body: '+ body +']');	
					callback(body);					
				}
			}
		});
	});

	req.on('error', function(e) {	
		console.log('[CustomerVPSAClient.getAll][MessageRS: '+JSON.stringify(e)+']');
		callback('[CustomerVPSAClient.getAll][Error: ' + e.message + ']');
	});	
	req.end();
};*/