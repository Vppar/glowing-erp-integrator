'use strinct';
var Https = require('https');
var Config = require('../../Config');
var OrderVPSAClient = {};
exports = module.exports = OrderVPSAClient;

var pathApi = Config.PATH_VPSA + '/pedidos';
var token = '?token=' + Config.TOKEN_VPSA;

OrderVPSAClient.create = function(subscriptionUUID, newOrder, callback) {	
   if(!newOrder) {
    	callback('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][Error: NewOrder parameter is empty]');
    }else{    
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': newOrder.length}
		};

		console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Order: '+JSON.stringify(newOrder)+']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {	
	        	
	        	if(body && typeof body == 'number'){
	        		console.log('[OrderVPSAClient.create][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');
		        	callback(null, body);	     
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
	    req.write(newOrder);
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
					console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		 
				    callback(null, body);		
				}else{
					try{
						var bodyList = JSON.parse(body);
						
						if(bodyList && bodylist[0] && bodyList[0].id && bodyList[0].parcelas[0].id){
							console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		 
						    callback(null, body[0]);							
						}else{
							console.log('[OrderVPSAClient.get][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
							callback(body);								
						}
					}catch (e){
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