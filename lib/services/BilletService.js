'use strict';
var SubscriptionStatus = require('../enum/SubscriptionStatus');
var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var GlowingCatalogSubscriptionPlanType = require('../enum/GlowingCatalogSubscriptionPlanType');
var Config = require('../Config');
var VPSAPaymentStatus = require('../enum/VPSAPaymentStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

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

		var subscriptionsPendingUserAction = getBilletStatusFilter();

//TODO verify async for each

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
						if(VPSAPaymentStatus.PAYED = result.status) {	
							notifyGlowingRestApi(subscription, result.status);
						}
						console.log('[BilletService.verifyBilletsStatus][Successfully updating subscription][UUID:'+subscription.uuid+'][Status: '+result.status+']');
					});				
				} else {
					console.log('[BilletService.verifyBilletsStatus][VPSA do not return a valid status][Status: '+result.status+']');
				}
			});	
		});		
	});
	callback(null, '[BilletService.verifyBilletsStatus][Process complete]');
};

function getBilletStatusFilter() {
	return ArrayUtil.filter(results, [{'status': SubscriptionStatus.PENDING_USER_ACTION}]);;
}

function notifyGlowingRestApi(subscription, status) {

	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.newSubscriptionExpirationDate = defineNewExpirationDate(subscription);
	subscriptionConsultantUpdate.consultantUUID = subscription.consultant.uuid;


	SubscriptionStorage.updateConsultantExpirationDate(subscriptionConsultantUpdate, function (err) {
		if(err) {
			console.log('[BilletService.notifyGlowingRestApi][Error '+err+']');
		}
		console.log('[BilletService.notifyGlowingRestApi][Succefully executed]');
	});		
}

function defineNewExpirationDate(subscription) {

	var newSubscriptionExpirationDate = {};
	var actualSubscriptionExpirationDate = subscription.consultant.subscriptionExpirationDate;
	var actualDate = new Date();
	var numberOfDaysToAddUp = getNumberOfDaysToAddUpExpirationDate(subscription);

	if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > actualDate) {
		newSubscriptionExpirationDate = actualSubscriptionExpirationDate + numberOfDaysToAddUp;
	} else {
		newSubscriptionExpirationDate = actualDate + numberOfDaysToAddUp;
	}

	return newSubscriptionExpirationDate;
}

function getNumberOfDaysToAddUpExpirationDate(subscription) {

	var planType = subscription.planType;
	var numberOfDaysToAddUp = 0;

	/*if(GlowingCatalogSubscriptionPlanType.7FREE === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.7FREE.addUpDays;		
	} else if(GlowingCatalogSubscriptionPlanType.GLOSS === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.GLOSS.addUpDays;
	} else if(GlowingCatalogSubscriptionPlanType.BLUSH === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.BLUSH.addUpDays;
	} else {

	}
*/
	return numberOfDaysToAddUp;
}