'use strinct';
var Https = require('https');
var Config = require('../../Config');
var OrderVPSAClient = {};
exports = module.exports = OrderVPSAClient;

var pathApi = Config.PATH_VPSA + '/pedidos';
var token = '?token=' + Config.TOKEN_VPSA;

OrderVPSAClient.create = function(newOrder, callback) {	
   if(!newOrder) {
    	callback('[OrderVPSAClient.create][Error: newOrder parameter is empty]');
    }else{    
    	var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: {'Content-Type': 'application/json', 'Content-Length': newOrder.length}
		};

	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {	
	        	callback(null, body);	            
	        });
	    }); 

	    req.on('error', function(e) {
		    callback('[OrderVPSAClient.create][Error:' + e.message + ']');
	    });
	    req.write(newOrder);
	    req.end();
	}
};

OrderVPSAClient.get = function(orderId, callback) {		
	if(!orderId) {
		callback('[OrderVPSAClient.get][Error: orderId parameter is empty]');		
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + orderId + token, 
			method: 'GET'
		};

		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
			  callback(null, body);		  
			});
		});

		req.on('error', function(e) {
			callback('[OrderVPSAClient.get][Error: ' + e.message + ']');
		});
		req.end();
	}
};