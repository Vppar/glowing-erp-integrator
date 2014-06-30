'use strinct';
var Https = require('https');
var Config = require('../../config');
var BilletVPSAClient = {};
exports = module.exports = BilletVPSAClient;


var Https = require('https');
var Config = require('../../config');
var BilletVPSAClient = {};



var pathApi = Config.PATH_VPSA + '/boletos';
var token = "?token=" + Config.TOKEN_VPSA;

var encode = 'utf8';
var result = {};
var options = { host: Config.HOSTNAME_VPSA, path: pathApi, method: null, headers: null};

var Https = require('https');
var Config = require('../Config');
var BilletVPSAClient = {};

exports = module.exports = BilletVPSAClient;

exports = module.exports = BilletVPSAClient;

BilletVPSAClient.create = function(newBillet, callback) {	
    if(!newBillet) {
	    console.log("erro newBillet null");
        return callback(null);
    }
    
    options.path += token;
    options.method = 'POST';
    options.headers = { 'Content-Type': 'application/json', 'Content-Length': newBillet.length };
   
    var req = Https.request(options, function(res) {
        res.setEncoding(encode);
        res.on('data', function (body) {		  
            console.log('Response: ' + body);
        });
    }); 
  
    req.on('error', function(e) {
	    console.log('Erro POST: ' + e.message);
    });
  	   
    req.write(newBillet);
    req.end();
	 if(!newBillet) {
    	callback("[BilletVPSAClient.create][Error: newBillet parameter is empty]");        
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
	    	callback("[BilletVPSAClient.create][Error: " + e.message + "]");
	    });	  	   
	    req.write(newBillet);
	    req.end();
	}
};

//BilletRequestVPSAClient.create("{\"idContaReceber\":5, \"idCarteiraCobranca\":1}", function(){});
BilletVPSAClient.create("{\"idContaReceber\":5, \"idCarteiraCobranca\":1}", function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});

BilletVPSAClient.get = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
	}
	
	options.path += "/" + billetId + token;
	options.method = 'GET';
		callback("[BilletVPSAClient.get][Error: billetId parameter is empty]");			
	}else{	
		var options = { 
			host: Config.HOSTNAME_VPSA, 
			path: pathApi + "/" + billetId + token, 
			method: 'GET' 
		};
		
		var req = Https.get(options, function(res) {	
			res.setEncoding(Config.ENCODE);
			res.on('data', function (body) {
				callback(null, body);
			});
		});
			
	var req = Https.get(options, function(res) {	
		res.setEncoding(encode);
		res.on('data', function (body) {
		  console.log('Response: ' + body);		  
		req.on('error', function(e) {
			callback("[BilletVPSAClient.get][Error: " + e.message + "]");
		});
	});
		
	req.on('error', function(e) {
		  console.log('Erro GET: ' + e.message);
	});
	
	req.end();
	
	return callback(result);
		req.end();
	}
};

//BilletRequestVPSAClient.get(2, function(){});
/*BilletVPSAClient.get(2, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/

BilletVPSAClient.getUrlPDF = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
		callback("[BilletVPSAClient.getUrlPDF][Error: billetId parameter is empty]");
	}else{
		callback(null, options.path += "/" + billetId + "/impressao" + token);
	}
	
	result = options.path += "/" + billetId + "/impressao" + token;
		
	return callback(result);
};

//BilletRequestVPSAClient.getUrlPDF(2, function(){});
/*BilletVPSAClient.getUrlPDF(2, function(err, result){
	if(err){ console.log(err); }
	else { console.log(result); }
});*/
