'use strinct';
var Https = require('https');
var Config = require('../../Config');
var BilletVPSAClient = {};
exports = module.exports = BilletVPSAClient;

var pathApi = Config.PATH_VPSA + '/boletos';
var token = '?token=' + Config.TOKEN_VPSA;

BilletVPSAClient.createBillet = function(newBillet, callback) {	
	 if(!newBillet) {
    	callback('[BilletVPSAClient.createBillet][Error: newBillet parameter is empty]');        
     }else{
    	 var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + token, 
			method: 'POST', 
			headers: { 'Content-Type': 'application/json', 'Content-Length': newBillet.length }
		};
	   
	    var req = Https.request(options, function(res) {
	        res.setEncoding(Config.ENCODE);
	        res.on('data', function (body) {		  
	            callback(null, body);
	        });
	    }); 
	  
	    req.on('error', function(e) {
	    	callback('[BilletVPSAClient.createBillet][Error: ' + e.message + ']');
	    });	  	   
	    req.write(newBillet);
	    req.end();
	}
};

BilletVPSAClient.getBilletJSON = function(billetId, callback) {		
	if(!billetId) {
		callback('[BilletVPSAClient.getBilletJSON][Error: billetId parameter is empty]');			
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + billetId + token, 
			method: 'GET' 
		};
		
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				var billet = JSON.parse(body);
				if(billet && billet.id) {
					callback(null, billet);
				} else {
					callback('Billet not found');
				}				
			});
		});
		
		req.end();
	}
};

//TODO: tirar callback
BilletVPSAClient.getBilletUrlPDF = function(billetId, callback) {		
	if(!billetId) {
		callback('[BilletVPSAClient.getBilletUrlPDF][Error: billetId parameter is empty]');
	}else{
		callback(null, pathApi + '/' + billetId + '/impressao' + token);
	}
};