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

BilletService.createBillet = function (newBillet, callback) {
	if(!newBillet){
		callback('[BilletService.createBillet][Error: newBillet parameter is invalid]');		
	}else if (!newBillet.idContaReceber || typeof newBillet.idContaReceber != 'number'){
		callback('[BilletService.createBillet][Error: check the following attribute: idContaReceber]');		
	}else if (newBillet.idCarteiraCobranca != Config.billet.CARTEIRADECOBRANCA){
		callback('[BilletService.createBillet][Error: check the following attribute: idCarteiraCobranca]');
	}else{
		BilletVPSAClient.createBillet(JSON.stringify(newBillet), function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
			}
		});
	}
};

BilletService.getBilletUrlPDF = function (billetId, callback) {
	if(!billetId || typeof billetId != 'number'){
		callback('[BilletService.getBilletUrlPDF][Error: billetId parameter is invalid]');
	}else{
		BilletVPSAClient.getBilletUrlPDF(billetId, callback);
	}
};

BilletService.getBilletJSON = function (billetId, callback) {
	if(!billetId || typeof billetId != 'number'){
		callback('[BilletService.getBilletJSON][Error: billetId parameter is invalid]');
	}else{
		BilletVPSAClient.getBilletJSON(billetId, callback);
	}
};

BilletService.verifyBilletsStatus = function (subscription, callback) {	
	FirebaseBackend.get(subscriptionRef, function (err, results) {
		if(err) {
			callback(err, null);
		} 
			
		console.log('results>>>>>'+results);

		var subscriptionsPendingUserAction = ArrayUtil.filter(results, [{'status': SubscriptionStatus.PENDING_USER_ACTION}]);

		subscriptionsPendingUserAction.forEach(function(subscription) {
			BilletVPSAClient.getBilletJSON( subscription.billetUUID, function(err, result){
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