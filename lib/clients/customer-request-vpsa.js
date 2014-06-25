'use strinct';

var https = require('https');
var config = require('../config');
var CustomerRequestVPSAClient = {};
exports = module.exports = BilletRequestVPSAClient; 

var api = '/terceiros';

CustomerRequestVPSAClient.create = function(){
	
};


CustomerRequestVPSAClient.get = function(customerId, res, callback){
		
	if(!customerId) {
		return callback(null);		
	}
	
	var result = {};
	var method = 'GET';
	var completePath = config.PATH_VPSA + api + '/' + customerId + '?token=' + config.TOKEN_VPSA;
  	
	var options = {
		hostname: config.HOSTNAME_VPSA,
		path: completePath,
		method: method		
	};
	
	var req = https.get(options, function(res) {	
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
		    console.log('BODY: ' + chunk);
		    result = chunk;
		  });
	});
	
	req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
	});
	
	req.end();
	
	return callback(result);
};

CustomerRequestVPSAClient.del = function(){
	
		
};

CustomerRequestVPSAClient.upadte = function(){
	
	
	
};

CustomerRequestVPSAClient.getCompletePath = function(api){
	
	if(!api) {
		console.log('erro');
	}
	
	var tokenVPSA = 'f41c778c11a3fdc14a4ce560e309a283301b3b70137d59cd608177de82e3eeed';
	var path = 'https://www.vpsa.com.br/apps/api';	
	var completePath = path + "/"+ api + "/?token=" + tokenVPSA;
	
	return completePath;	
};