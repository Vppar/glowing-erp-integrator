'use strinct';
var Https = require('https');
var Config = require('../../Config');
var VPSAClientUtils = require('../../utils/VPSAClientUtils');
var StringUtils = require('../../utils/StringUtils');
var OrderVPSAClient = {};
exports = module.exports = OrderVPSAClient;

var pathApi = Config.PATH_VPSA + '/pedidos';
var token = '?token=' + Config.TOKEN_VPSA;

OrderVPSAClient.create = function(subscriptionUUID, orderToCreate, callback) {	
   if(!orderToCreate) {
    	callback('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: NewOrder parameter is empty]');
    }else{    

    	var orderToCreateJSON = StringUtils.removeAccents(JSON.stringify(orderToCreate));
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': orderToCreateJSON.length}
		};

		console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Order: '+orderToCreateJSON+']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {	
	        	var bodyAsInt = VPSAClientUtils.verifyValidId(body);
	        	if(bodyAsInt){
	        		console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');
		        	callback(null, bodyAsInt);	     
	        	}else{
		        	console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: unexpected answer, body not a number][Body: '+ body +']');	  
		        	callback(body);
	        	}
	        });
	    }); 

	    req.on('error', function(e) {
	    	console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
		    callback('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][Error:' + e.message + ']');
	    });
	    req.write(orderToCreateJSON);
	    req.end();
	}
};

OrderVPSAClient.get = function(subscriptionUUID, orderId, callback) {		
	if(!orderId) {
		callback('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][Error: orderId parameter is empty]');		
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + orderId + token, 
			method: 'GET'
		};

		console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+']');
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				
				if(body === Config.customer.EMPTY_RESULT){
					console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
				    callback(null, null);		
				}else{
					
					var bodyObj = null;
					try{
						var bodyObj = JSON.parse(body);					
					}catch (e){
						console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][Error: Unable to parser body][Body: '+ body +']');	
					}

					if(bodyObj && bodyObj.id && bodyObj.parcelas[0] && bodyObj.parcelas[0].id){
							console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
						    callback(null, bodyObj);
					}else{
						console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
						callback(body);								
					}
				}
			});
		});

		req.on('error', function(e) {
			console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');
			callback('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
		});
		req.end();
	}
};