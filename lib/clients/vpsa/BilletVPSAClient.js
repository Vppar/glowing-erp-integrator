'use strinct';

var Https = require('https');
var Config = require('../../Config');
var BilletVPSAClient = {};

exports = module.exports = BilletVPSAClient;

var pathApi = Config.PATH_VPSA + '/boletos';
var token = "?token=" + Config.TOKEN_VPSA;
var encode = 'utf8';
var result = {};
var options = { host: Config.HOSTNAME_VPSA, path: pathApi, method: null, headers: null};

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
};

//BilletRequestVPSAClient.create("{\"idContaReceber\":5, \"idCarteiraCobranca\":1}", function(){});

BilletVPSAClient.get = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
	}
	
	options.path += "/" + billetId + token;
	options.method = 'GET';
			
	var req = Https.get(options, function(res) {	
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

BilletVPSAClient.getUrlPDF = function(billetId, callback) {		
	if(!billetId) {
		console.log("erro billetId null");
		return callback(null);		
	}
	
	result = options.path += "/" + billetId + "/impressao" + token;
		
	return callback(result);
};

//BilletRequestVPSAClient.getUrlPDF(2, function(){});