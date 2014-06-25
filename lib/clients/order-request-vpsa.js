'use strict';

var config = require('../config');
var PaymentBillet = require('../enum/PaymentBillet');
var RequestError = require('../enum/requestError');
var https = require('https');

var OrderRequestVPSA = {};
exports = module.exports = OrderRequestVPSA;

OrderRequestVPSA.create = function(){
	
	var options = {
			
		
			
	};
	
	
};

OrderRequestVPSA.getData = function(){
	var options = {
	  host: url,
	  port: 80,
	  path: '/resource?id=foo&bar=baz',
	  method: 'POST'
	};
	
	var resultJSON = {};
	
	https.request(options, function(res) {	
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	    resultJSON = chunk;
	  });
	}).end();
};

	

		