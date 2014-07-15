'use strinct';

var Https = require('https');
var Config = require('../../Config');
var StringUtils = require('../../utils/StringUtils');
var BilletVPSAClient = {};

var pathApi = Config.PATH_VPSA + '/boletos';
var token = '?token=' + Config.TOKEN_VPSA;

exports = module.exports = BilletVPSAClient;

BilletVPSAClient.createBillet = function(subscriptionUUID, billetToCreate, callback) {	
	 if(!billetToCreate) {
    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: newBillet parameter is empty]');        
     }else{

     	 var billetToCreateJSON = StringUtils.removeAccents(JSON.stringify(billetToCreate));
    	 var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: { 'Content-Type': 'application/json', 'Content-Length': billetToCreateJSON.length }
		};
	   
	    console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Billet: '+billetToCreateJSON+']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {

	        	var bodyObj = null;
				try {
					var bodyObj = JSON.parse(body);					
				} catch (e){
					console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: Unable to parser body][Body: '+ body +']');	
				}
	        	
        		if(bodyObj && bodyObj.codigoMensagem === 0 && bodyObj.idRecurso) {
    	            console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		  
    	            callback(null, bodyObj);
        		} else {
        			console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: Unexpected answer][Body: '+ body +']');		  
    	            callback(body);	        			
        		}
	        });
	    }); 
	  
	    req.on('error', function(e) {
	    	console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');	
	    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
	    });	  	   
	    req.write(billetToCreateJSON);
	    req.end();
	}
};

BilletVPSAClient.getBilletJSON = function(subscriptionUUID, billetId, callback) {		
	if(!billetId) {
		callback('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][Error: billetId parameter is empty]');			
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + billetId + token, 
			method: 'GET' 
		};

		console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+']');
		var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	        	if(body === Config.customer.EMPTY_RESULT){
					console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][Error: billet not found][Body: '+ body +']');		 
				    callback(null, null);
				} else {
					
					var bodyObj = null;
					try {
						var bodyObj = JSON.parse(body);					
					} catch (e){
						console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][Error: Unable to parser body][Body: '+ body +']');	
					}
					
					if(bodyObj && bodyObj.id){
						console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][MessageRS: '+body+']');		 
					    callback(null, bodyObj);
					}else{
						console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][Error: unexpected answer][Body: '+ body +']');	
						callback(body);								
					}
				}
	        });
	    }); 
	  
	    req.on('error', function(e) {
	    	console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');	
	    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
	    });	  	   
	    
	    req.end();
	}
};