'use strinct';
var https = require('https');
var config = require('../config');
var BilletRequestVPSAClient = {};

var pathApi = config.PATH_VPSA + '/boletos';
var token = "?token=" + config.TOKEN_VPSA;
var encode = 'utf8';
var result = {};

var options = { 
		host: config.HOSTNAME_VPSA, 
		path: pathApi, 
		method: null, 
		headers: null
	};

BilletRequestVPSAClient.create = function(newBillet, callback) {	
    if(!newBillet) {
	    console.log("erro newBillet null");
        return callback(null);
    }
    
    options.path += token;
    options.method = 'POST';
    options.headers = { 'Content-Type': 'application/json', 'Content-Length': newBillet.length };
   
    var req = https.request(options, function(res) {
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
};

//BilletRequestVPSAClient.create("{\"idContaReceber\":5, \"idCarteiraCobranca\":1}", function(){});

BilletRequestVPSAClient.get = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
	}
	
	options.path += "/" + billetId + token;
	options.method = 'GET';
			
	var req = https.get(options, function(res) {	
		res.setEncoding(encode);
		res.on('data', function (body) {
		  console.log('Response: ' + body);		  
		});
	});
		
	req.on('error', function(e) {
		  console.log('Erro GET: ' + e.message);
	});
	
	req.end();
	
	return callback(result);
};

//BilletRequestVPSAClient.get(2, function(){});

BilletRequestVPSAClient.getUrlPDF = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
	}
	
	result = options.path += "/" + billetId + "/impressao" + token;
		
	return callback(result);
};

//BilletRequestVPSAClient.getUrlPDF(2, function(){});