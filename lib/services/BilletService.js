'use strict';
var SubscriptionStatus = require('../enum/SubscriptionStatus');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');

var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var GlowingCatalogSubscriptionPlanType = require('../enum/GlowingCatalogSubscriptionPlanType');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var Config = require('../Config');
var VPSAPaymentStatus = require('../enum/VPSAPaymentStatus');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

BilletService.createBillet = function (newBillet, callback) {
	if(!newBillet){
		callback('[BilletService.createBillet][Error: newBillet parameter is invalid]');		
	}else if (!newBillet.idContaReceber || typeof newBillet.idContaReceber != 'number'){
	}else if (!newBillet.pedidoVendaId){
		callback('[BilletService.createBillet][Error: check the following attribute: idContaReceber]');		
	}else if (newBillet.idCarteiraCobranca != Config.billet.CARTEIRADECOBRANCA){
		callback('[BilletService.createBillet][Error: check the following attribute: idCarteiraCobranca]');
	}else{
		BilletVPSAClient.createBillet(JSON.stringify(newBillet), function(err, result){
		OrderService.get(newBillet.pedidoVendaId, function(err, result){
			if(err){
				callback(err);
			}else{			
				callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
				console.log(err);
			}else{
				var pedidoVenda = JSON.parse(result);
				var billet = { idContaReceber: pedidoVenda.parcelas[0].id, idCarteiraCobranca: Config.billet.CARTEIRADECOBRANCA };
				
				BilletVPSAClient.createBillet(JSON.stringify(billet), function(err, result){
					if(err){
						callback(err);
					}else{			
						callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
					}
				});
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
BilletService.getBilletJSON = function (subscription, callback) {		
	subscription.billetId = 1;
	if(!subscription || !subscription.billetId || typeof subscription.billetId != 'number'){
		callback('[BilletService.getBilletJSON][Error: BilletId parameter is invalid]', null);
		callback('SubscriptionUUID: '+subscription.uuid+'. BilletId parameter is invalid', null);
	} else{
		BilletVPSAClient.getBilletJSON(subscription.billetId, callback);
		BilletVPSAClient.getBilletJSON(subscription.billetId, function(err, billet) {
			if(err) {
				callback('SubscriptionUUID: '+subscription.uuid+'. '+err, null);
			} else {
				callback(null, billet);
			}
		});
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
	if( billet && billet.status ) {

		var glowingBilletStatus = {};

		if(billet.status === VPSABilletStatus.PAGO) {
			glowingBilletStatus = GlowingBilletStatus.PAYED;		
		} else if(billet.status === VPSABilletStatus.NAO_PAGO) {
			glowingBilletStatus = GlowingBilletStatus.NOT_PAYED;
		} else if(billet.status === VPSABilletStatus.INVALIDO) {
			glowingBilletStatus = GlowingBilletStatus.INVALID;
		} else if(billet.status === VPSABilletStatus.EMITIDO) {
			glowingBilletStatus = GlowingBilletStatus.SHIPPED;
		} else {
			callback ('Unable to define Glowing billet status by VPSA billet status '+ VPSABilletStatus, null);
		}


		SubscriptionStorage.updateGlowingBilletStatus(subscription.uuid, glowingBilletStatus, function(err) {
			  if(err) {
				 console.log('[BilletController.updateBilletStatus][Errors: '+err+']');
	          	 callback(err, null);
		      } else {
				 console.log('[BilletController.updateBilletStatus][Result: Succefully executed]');
	             callback(null, subscription, billet);
		      }
		})					
	} else {
		return callback('[BilletService.updateBilletStatus][Error updating subscription][UUID:'+subscription.uuid+'][Status: '+billet.status+'][Error: unable to define billet status]', null);	
		callback('[BilletService.updateBilletStatus][Error updating subscription][UUID:'+subscriptionUUID+'][Status: '+glowingBilletStatus+'][Error: unable to define billet status]', null);	
	}
};

BilletService.notifyPayedBilletToGlowingRestApi = function (subscription, billet, callback) {
	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.newSubscriptionExpirationDate = defineNewExpirationDate(subscription);
	subscriptionConsultantUpdate.consultantUUID = subscription.consultant.uuid;
	if(GlowingBilletStatus.PAYED = billet.status) {
		var planType = subscription['subscription-consultant-request-queue'].planType;
		var numberOfDaysToAddUp = 0;

	SubscriptionStorage.updateConsultantExpirationDate(subscriptionConsultantUpdate, function (err) {
		if(err) {
			callback('[BilletService.notifyPayedBilletToGlowingRestApi][Error: '+err+']', null);
		if(GlowingSubscriptionPlanType.SevenFREE.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.SevenFREE.addUp;		
		} else if(GlowingSubscriptionPlanType.GLOSS.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.GLOSS.addUp;
		} else if(GlowingSubscriptionPlanType.BLUSH.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.BLUSH.addUp;
		} else {
			callback(null, '[BilletService.notifyPayedBilletToGlowingRestApi][Result: Succefully executed]', billet);
			callback('[BilletService.notifyPayedBilletToGlowingRestApi][Error updating subscription][Error: Unable to define days to addup for plan type '+planType+']', null);	
		}
	});
};

function defineNewExpirationDate(subscription) {

	var newSubscriptionExpirationDate = {};
	var actualSubscriptionExpirationDate = subscription.consultant.subscriptionExpirationDate;
	var actualDate = new Date();
	var numberOfDaysToAddUp = getNumberOfDaysToAddUpExpirationDate(subscription);
		var newSubscriptionExpirationDate = {};
		var actualSubscriptionExpirationDate = {};
		var actualDate = new Date();

	if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > actualDate) {
		newSubscriptionExpirationDate = actualSubscriptionExpirationDate + numberOfDaysToAddUp;
	} else {
		newSubscriptionExpirationDate = actualDate + numberOfDaysToAddUp;
	}
		if(subscription && subscription.consultant && subscription.consultant.subscriptionExpirationDate) {
			actualSubscriptionExpirationDate = subscription.consultant.subscriptionExpirationDate;
		}

	return newSubscriptionExpirationDate;
}
		if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > actualDate) {
			newSubscriptionExpirationDate = actualSubscriptionExpirationDate + numberOfDaysToAddUp;
		} else {
			newSubscriptionExpirationDate = actualDate + numberOfDaysToAddUp;
		}

function getNumberOfDaysToAddUpExpirationDate(subscription) {
		SubscriptionStorage.updateConsultantExpirationDate(subscription, newSubscriptionExpirationDate, function (err) {
			if(err) {
				console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Error: '+err+']');
				callback(err, null);
			} else {
				console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Result: Succefully executed]');
				callback(null, subscription, billet);
			}
		});		
	} 	
};

	var planType = subscription.planType;
	var numberOfDaysToAddUp = 0;

	if(GlowingCatalogSubscriptionPlanType.SevenFREE.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.SevenFREE.addUp;		
	} else if(GlowingCatalogSubscriptionPlanType.GLOSS.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.GLOSS.addUp;
	} else if(GlowingCatalogSubscriptionPlanType.BLUSH.name === planType) {
		numberOfDaysToAddUp = GlowingCatalogSubscriptionPlanType.BLUSH.addUp;
	} else {

BilletService.updateSubscriptionStatus = function (subscription, billet, callback) {
	if(billet.status === VPSABilletStatus.PAGO || billet.status === VPSABilletStatus.NAO_PAGO || billet.status === VPSABilletStatus.INVALIDO) {
		SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingBilletStatus.FINISHED, function(err) {
		  if(err) {
			 console.log('[BilletController.updateSubscriptionStatus][Errors: '+err+']');
	       	 callback(err, null);
		  } else {
			 console.log('[BilletController.updateSubscriptionStatus][Result: Succefully executed]');
	         callback(null, subscription, billet);
		  }
		});
	}

	return numberOfDaysToAddUp;
}
};