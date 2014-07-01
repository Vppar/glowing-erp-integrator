'use strict';

var SubscriptionStatus = require('../enum/SubscriptionStatus');
var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var ConsultantSubscriptionUpdateGenerator = require('../workers/ConsultantSubscriptionUpdateGenerator'); 
var Config = require('../Config');
var VPSAPaymentStatus = require('../enum/VPSAPaymentStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');
var BilletService = {};

exports = module.exports = BilletService;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

BilletService.requestBilletGenerationToVPSA = function (subscription, callback) {
	BilletVPSAClient.requestBilletGenerationToVPSA(subscription, function(err, results) {
	    	if(err) {
				callback(err, null);
			} else {
				callback(null, results);
			}
	    }
	);
};

BilletService.getBilletBytesFromVPSA = function (subscription, callback) {
	setTimeout(function () {
	    BilletVPSAClient.getBilletBytesFromVPSA(subscription, function(err, results) {
		    	if(err) {
					callback(err, null);
				} else {
					callback(null, results);
				}
		    }
		);
	}, 5000);
};

BilletService.verifyBilletsStatus = function (subscription, callback) {	
	FirebaseBackend.get(subscriptionRef, function (err, results) {
		if(err) {
			callback(err, null);
		} 
			
		console.log('results>>>>>'+results);
		
		var subscriptionsPendingUserAction = ArrayUtil.filter(results, [{'status': SubscriptionStatus.PENDING_USER_ACTION}]);
		
		subscriptionsPendingUserAction.forEach(function(subscription) {
			BilletVPSAClient.get( subscription.billetUUID, function(err, result){
				console.log('result>>>>>'+result);
				if(err){
					callback(err);
				}

				if( result && result.status ){
					SubscriptionStorage.update(subscription.uuid, result.status, function(err) {
						if(err) {
							console.log('[BilletService.verifyBilletsStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+result.status+'][Erro: '+err+']');
						}
					});

					if(VPSAPaymentStatus.PAYED = result.status) {	
						var consultantUUID = defineNewExpirationDate(subscription);
						var newSubscriptionExpirationDate = getConsultantUUID(subscription);
						ConsultantSubscriptionUpdateGenerator.updateConsultantExpirationDate(consultantUUID, newSubscriptionExpirationDate);		
					}
				}
			});			
		});		
	});
	callback(null, '[BilletService.verifyBilletsStatus][Process complete]');
};

function defineNewExpirationDate(subscription) {
	return '';
}

function getConsultantUUID(subscription) {
	return '';
}


// COMMIT + PUSH  + VERIFY PAYMENT STATUS BILLET FLOW