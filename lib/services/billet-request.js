'use strict';

var BilletRequestService = {};
exports = module.exports = BilletRequestService;

var BilletRequestVPSAClient = require('../clients/billet-request-vpsa');

BilletRequestService.validateBilletRequest = function (billetRequestSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(null, err);
  	}
};

BilletRequestService.requestBilletGenerationToVPSA = function (billetRequestSnapshot, callback) {
	BilletRequestVPSAClient.requestBilletGenerationToVPSA(billetRequestSnapshot, function(err, results) {
	    	if(err) {
				callback(err, null);
			} else {
				callback(null, results);
			}
	    }
	);
};

BilletRequestService.getBilletBytesFromVPSA = function (billetRequestSnapshot, callback) {
	setTimeout(function () {
	    BilletRequestVPSAClient.getBilletBytesFromVPSA(billetRequestSnapshot, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};