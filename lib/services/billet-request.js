'use strict';

var BilletRequestService = {};
exports = module.exports = BilletRequestService;

var parameters = require('../middlewares/parameters');
var BilletRequestVPSAClient = require('../clients/billet-request-vpsa');

BilletRequestService.validateBilletRequest = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'BilletRequestService.validateBilletRequest');
	var err = '';

	if(err) {
		console.log('MODULO: '+'BilletRequestService.validateBilletRequest err '+err);
		return callback(err, null);
  	}

  	callback(null, '[BilletRequestService.validateBilletRequest OK]');
};

BilletRequestService.requestBilletGenerationToVPSA = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'BilletRequestService.requestBilletGenerationToVPSA');
	BilletRequestVPSAClient.requestBilletGenerationToVPSA(billetRequestSnapshot, function(err, results) {
		console.log('MODULO: '+'BilletRequestService.requestBilletGenerationToVPSA');
	    	if(err) {
	    		console.log('MODULO: '+'BilletRequestService.requestBilletGenerationToVPSA err '+err);
				callback(err, null);
			} else {
				console.log('MODULO: '+'BilletRequestService.requestBilletGenerationToVPSA success');
				callback(null, results);
			}
	    }
	);
};

BilletRequestService.getBilletBytesFromVPSA = function (billetRequestSnapshot, callback) {
	console.log('MODULO: '+'BilletRequestService.getBilletBytesFromVPSA');
	setTimeout(function () {
		console.log('MODULO: '+'BilletRequestService.getBilletBytesFromVPSA.setTimeout');
	    BilletRequestVPSAClient.getBilletBytesFromVPSA(billetRequestSnapshot, function(err, results) {
	    	console.log('MODULO: '+'BilletRequestService.getBilletBytesFromVPSA');
		    	if(err) {
		    		console.log('MODULO: '+'BilletRequestService.getBilletBytesFromVPSA err '+err);
					callback(err, null);
				} else {
					console.log('MODULO: '+'BilletRequestService.getBilletBytesFromVPSA success');
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletRequestService.verifyBilletStatus = function (billetRequestSnapshot, callback) {
  /*BilletRequestVPSAClient.verifyBilletStatus(billetRequestSnapshot, function(err, results) {
        if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
      }
  );*/
};