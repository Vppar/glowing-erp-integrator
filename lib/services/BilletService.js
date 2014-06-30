'use strict';

var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FireBase = require('../backends/FirebaseBackend');
var config = require('../config');
var ArrayUtil = require('../services/ArrayUtil');
var BilletService = {};

exports = module.exports = BilletService;

BilletService.validateSubscriptionSnapshot = function (subscriptionSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[BilletService.validateBilletRequest OK]');
};

BilletService.requestBilletGenerationToVPSA = function (subscriptionSnapshot, callback) {
	BilletVPSAClient.requestBilletGenerationToVPSA(billetRequestSnapshot, function(err, results) {
	    	if(err) {
				callback(err, null);
			} else {
				callback(null, results);
			}
	    }
	);
};

BilletService.getBilletBytesFromVPSA = function (subscriptionSnapshot, callback) {
	setTimeout(function () {
	    BilletVPSAClient.getBilletBytesFromVPSA(billetRequestSnapshot, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletService.verifyBilletStatus = function (billetRequestSnapshot, callback) {

	FireBase.get( config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD , function (err, result){

		result = ArrayUtil.filter(result, [{
			'field': 'planType',
			'value': 'ANUAL_12X'
		}]);
		
		console.log( JSON.stringify(result) );
		console.log( result.length );
	});

};