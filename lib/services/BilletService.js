'use strict';

var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
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
	BilletVPSAClient.requestBilletGenerationToVPSA(subscriptionSnapshot, function(err, results) {
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
	    BilletVPSAClient.getBilletBytesFromVPSA(subscriptionSnapshot, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletService.verifyBilletStatus = function (subscriptionSnapshot, callback) {
	//https://testerennan.firebaseio.com/subscriptions  get com filtro

  /*BilletRequestVPSAClient.verifyBilletStatus(billetRequestSnapshot, function(err, results) {
        if(err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
      }
  );*/
};