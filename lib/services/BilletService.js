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

BilletService.getBilletJSON = function (subscription, callback) {	
	if(!subscription || !subscription.billetId || typeof subscription.billetId != 'number'){
		callback('[BilletService.getBilletJSON][Error: BilletId parameter is invalid]', null);
	} else{
		BilletVPSAClient.getBilletJSON(subscription.billetId, callback);
	}
};

BilletService.updateBilletStatus = function (subscription, billet, callback) {
	if( billet && billet.status ){
		SubscriptionStorage.update(subscription.uuid, billet.status, function(err) {
			if(err) {
				return callback('[BilletService.updateBilletStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+billet.status+'][Error: '+err+']', null);					
			} else {
				console.log('[BilletService.updateBilletStatus][Successfully updating subscription][UUID:'+subscription.uuid+'][Status: '+billet.status+']');
			 	callback(null, billet);
			}										
		});				
	} else {
		return callback('[BilletService.updateBilletStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+billet.status+'][Error: unable to define billet status]', null);	
	}
};

BilletService.notifyPayedBilletToGlowingRestApi = function (subscription, billet, callback) {
	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.newSubscriptionExpirationDate = defineNewExpirationDate(subscription);
	subscriptionConsultantUpdate.consultantUUID = subscription.consultant.uuid;

	SubscriptionStorage.updateConsultantExpirationDate(subscriptionConsultantUpdate, function (err) {
		if(err) {
			callback('[BilletService.notifyPayedBilletToGlowingRestApi][Error: '+err+']', null);
		} else {
			callback(null, '[BilletService.notifyPayedBilletToGlowingRestApi][Result: Succefully executed]', billet);
		}
	});
};

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

	if(GlowingCatalogSubscriptionPlanType.SevenFREE.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.SevenFREE.addUp;		
	} else if(GlowingCatalogSubscriptionPlanType.GLOSS.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.GLOSS.addUp;
	} else if(GlowingCatalogSubscriptionPlanType.BLUSH.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.BLUSH.addUp;
	} else {

	}

	return numberOfDaysToAddUp;
}