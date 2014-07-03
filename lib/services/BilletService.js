'use strict';

var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var FirebaseBackend = require('../backends/FirebaseBackend');
var OrderService = require('../services/OrderService');
var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var GlowinSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var Config = require('../Config');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

BilletService.createBillet = function (subscription, callback) {
	if(!subscription){
		callback('[BilletService.createBillet][Error: newBillet parameter is invalid]');		
	}else if (!subscription.pedidoVendaId){
		callback('[BilletService.createBillet][Error: check the following attribute: idContaReceber]');		
	}else{
		OrderService.get(subscription.pedidoVendaId, function(err, result){
			if(err){
				callback(err);
			}else{			
				var pedidoVenda = JSON.parse(result);
				var billet = { idContaReceber: pedidoVenda.parcelas[0].id, idCarteiraCobranca: Config.billet.CARTEIRADECOBRANCA };
				
				BilletVPSAClient.createBillet(JSON.stringify(billet), function(err, result){
					if(err){
						callback(err);
					}else{
						subscription.billet.link = BilletVPSAClient.getBilletUrlPDF(Number(result)); 
						subscription.billet.status = VPSABilletStatus.GERADO;
						
						callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
					}
				});
			}
		});
	}	
};

BilletService.getBilletJSON = function (subscription, callback) {		
	subscription.billetId = 1;
	if(!subscription || !subscription.billetId || typeof subscription.billetId != 'number'){
		callback('[BilletService.getBilletJSON][Error: BilletId parameter is invalid]', null);
	} else{
		BilletVPSAClient.getBilletJSON(subscription.billetId, function(err, billet) {
			if(err) {
				callback('SubscriptionUUID: '+subscription.uuid+'. '+err, null);
			} else {
				callback(null, billet);
			}
		});
	}
};

BilletService.updateGlowingBilletStatus = function (subscription, billet, callback) {
				
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
				 console.log('[BilletController.updateGlowingBilletStatus][Errors: '+err+']');
	          	 callback(err, null);
		      } else {
				 console.log('[BilletController.updateGlowingBilletStatus][Result: Succefully executed]');
	             callback(null, subscription, billet);
		      }
		});					
	} else {
		callback('[BilletService.updateGlowingBilletStatus][Error updating subscription][UUID:'+subscriptionUUID+'][Status: '+glowingBilletStatus+'][Error: unable to define billet status]', null);	
	}
};

BilletService.notifyPayedBilletToGlowingRestApi = function (subscription, billet, callback) {
			
	if(GlowingBilletStatus.PAYED = billet.status) {

		var subscriptionConsultantRequest = subscription.snapshot;
		var planType = subscriptionConsultantRequest.planType;
		var numberOfDaysToAddUp = 0;

		if(GlowingSubscriptionPlanType.SevenFREE.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.SevenFREE.addUp;		
		} else if(GlowingSubscriptionPlanType.GLOSS.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.GLOSS.addUp;
		} else if(GlowingSubscriptionPlanType.BLUSH.name === planType) {
			numberOfDaysToAddUp = GlowingSubscriptionPlanType.BLUSH.addUp;
		} else {
			callback('[BilletService.notifyPayedBilletToGlowingRestApi][Error updating subscription][Error: Unable to define days to addup for plan type '+planType+']', null);	
		}

		var actualDate = new Date();
		var actualSubscriptionExpirationDate = subscriptionConsultantRequest.subscriptionExpirationDate;
		var newSubscriptionExpirationDate = {};
		
		if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > actualDate) {
			newSubscriptionExpirationDate = actualSubscriptionExpirationDate + numberOfDaysToAddUp;
		} else {
			newSubscriptionExpirationDate = actualDate + numberOfDaysToAddUp;
		}

		SubscriptionStorage.notifyPayedBilletToGlowingRestApi(subscription, newSubscriptionExpirationDate, function (err) {
			if(err) {
				console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Error: '+err+']');
				callback(err, null);
			} else {
				console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Result: Succefully executed]');
				callback(null, subscription, billet);
			}			
		});
	} else {
		callback('[BilletService.notifyPayedBilletToGlowingRestApi][Status: '+billet.status+'][Error: not necessary notify]', null);	
	}
};

BilletService.updateGlowingSubscriptionStatus = function (subscription, billet, callback) {
	if(billet.status === VPSABilletStatus.PAGO || billet.status === VPSABilletStatus.NAO_PAGO || billet.status === VPSABilletStatus.INVALIDO) {
		SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingBilletStatus.FINISHED, function(err) {
		  if(err) {
			 console.log('[BilletController.updateGlowingSubscriptionStatus][Errors: '+err+']');
	       	 callback(err, null);
		  } else {
			 console.log('[BilletController.updateGlowingSubscriptionStatus][Result: Succefully executed]');
	         callback(null, subscription, billet);
		  }
		});
	} else {
		callback('[BilletService.updateGlowingSubscriptionStatus][Status: '+billet.status+'][Error: Not necessary update]', null);	
	}
};

BilletService.updateBillet = function(subscription, callback){
	SubscriptionStorage.updateBillet(subscription.uuid, subscription.billet, callback);
};
