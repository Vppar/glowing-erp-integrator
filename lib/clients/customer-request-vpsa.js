'use strinct';
var https = require('https');
var config = require('../config');
var CustomerRequestVPSAClient = {};

var pathApi = config.PATH_VPSA + '/terceiros';
var token = "?token=" + config.TOKEN_VPSA;
var encode = 'utf8';
var result = {};

var options = { 
		host: config.HOSTNAME_VPSA, 
		path: pathApi, 
		method: null, 
		headers: null
	};

CustomerRequestVPSAClient.create = function(newCustomer, callback) {	
    if(!newCustomer) {
	    console.log("erro newCustomer null");
        return callback(null);
    }
    
    options.path += token;
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/json', 'Content-Length': newCustomer.length};
	
    var req = https.request(options, function(res) {
        res.setEncoding(encode);
        res.on('data', function (body) {		  
            console.log('Response: ' + body);
        });
    }); 
  
    req.on('error', function(e) {
	    console.log('Erro POST: ' + e.message);
    });
  	   
    req.write(newCustomer);
    req.end();
};

//CustomerRequestVPSAClient.create("{\"nome\":\"teste created by node 2\",\"documento\":\"590.750.545-13\"}", function(){});

CustomerRequestVPSAClient.get = function(customerId, callback) {		
	if(!customerId) {
		console.log("erro customerId null");
		return callback(null);		
	}
	
	options.path += "/" + customerId + token;
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

//CustomerRequestVPSAClient.get(10, function(){});

CustomerRequestVPSAClient.update = function(updateCustomer, idNewCustomer, callback) {	
	if(!updateCustomer) {
		console.log("erro customerId null");
		return callback(null);		
	}
	
	options.method = 'PUT';
	options.path += "/" + idNewCustomer + token; 
	options.headers = {'Content-Type': 'application/json', 'Content-Length': updateCustomer.length};
				
    var req = https.request(options, function(res) {
        res.setEncoding(encode);
        res.on('data', function (body) {
            console.log('Response: ' + body);
        });
    });
		
    req.on('error', function(e) {
		console.log('Erro PUT: ' + e.message);
	});
	    
	req.write(updateCustomer);
	req.end();
	
	return callback(result);
};

//CustomerRequestVPSAClient.update("{\"nome\":\"xxxxxxxxxxxxx\",\"documento\":\"569.012.119-37\"}", 12, function(){});