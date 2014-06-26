'use strict';

var BilletRequestService = {};
exports = module.exports = BilletRequestService;

var parameters = require('../middlewares/parameters');
var BilletRequestVPSAClient = require('../clients/billet-request-vpsa');

BilletRequestService.validateSubscriptionSnapshot = function (subscriptionSnapshot, callback) {
	var err = '';

	if(err) {
		return callback(err, null);
  	}

  	callback(null, '[BilletRequestService.validateBilletRequest OK]');
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

BilletRequestService.verifyBilletStatus = function (billetRequestSnapshot, callback) {
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