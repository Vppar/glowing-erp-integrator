'use strinct';
var Https = require('https');
var Config = require('../../Config');
var BilletVPSAClient = {};
exports = module.exports = BilletVPSAClient;

var pathApi = Config.PATH_VPSA + '/boletos';
var token = '?token=' + Config.TOKEN_VPSA;

BilletVPSAClient.createBillet = function(subscriptionUUID, newBillet, callback) {	
	 if(!newBillet) {
    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: newBillet parameter is empty]');        
     }else{
    	 var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: { 'Content-Type': 'application/json', 'Content-Length': newBillet.length }
		};
	   
	    console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRQ: '+JSON.stringify(options)+'][Billet: '+JSON.stringify(newBillet)+']');
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {
	            console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		  
	            callback(null, body);
	        });
	    }); 
	  
	    req.on('error', function(e) {
	    	console.log('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');	
	    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
	    });	  	   
	    req.write(newBillet);
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
	        	console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(body)+']');		  
	            callback(null, body);
	        });
	    }); 
	  
	    req.on('error', function(e) {
	    	console.log('[BilletVPSAClient.getBilletJSON][Subscription: '+subscriptionUUID+'][MessageRS: '+JSON.stringify(e)+']');	
	    	callback('[BilletVPSAClient.createBillet][Subscription: '+subscriptionUUID+'][Error: ' + e.message + ']');
	    });	  	   
	    
	    req.end();
	}
};


BilletVPSAClient.getBilletUrlPDF = function(subscriptionUUID, billetId) {		
	if(billetId && typeof billetId == 'number'){
		return pathApi + '/' + billetId + '/impressao' + token;
	}
	throw '[BilletVPSAClient.getBilletUrlPDF][Subscription: '+subscriptionUUID+'][Error: BilletId parameter is empty]';
};