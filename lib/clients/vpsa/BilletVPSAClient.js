'use strinct';
var Https = require('https');
var Config = require('../../Config');
var BilletVPSAClient = {};
exports = module.exports = BilletVPSAClient;

var pathApi = Config.PATH_VPSA + '/boletos';
var token = '?token=' + Config.TOKEN_VPSA;

BilletVPSAClient.create = function(newBillet, callback) {	
	 if(!newBillet) {
    	callback('[BilletVPSAClient.create][Error: newBillet parameter is empty]');        
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
	    	callback('[BilletVPSAClient.create][Error: ' + e.message + ']');
	    });	  	   
	    req.write(newBillet);
	    req.end();
	}
};

/*BilletVPSAClient.create('{\'idContaReceber\':5, \'idCarteiraCobranca\':1}', function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

BilletVPSAClient.get = function(billetId, callback) {		
	if(!billetId) {
		callback('[BilletVPSAClient.get][Error: billetId parameter is empty]');			
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + '/' + billetId + token, 
			method: 'GET' 
		};
		
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				callback(null, body);
			});
		});
			
		req.on('error', function(e) {
			callback('[BilletVPSAClient.get][Error: ' + e.message + ']');
		});
		req.end();
	}
};

/*BilletVPSAClient.get(2, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

BilletVPSAClient.getUrlPDF = function(billetId, callback) {		
	if(!billetId) {
		callback('[BilletVPSAClient.getUrlPDF][Error: billetId parameter is empty]');
	}else{
		callback(null, options.path += '/' + billetId + '/impressao' + token);
	}
};

/*BilletVPSAClient.getUrlPDF(2, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/
