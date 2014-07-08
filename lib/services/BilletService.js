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
var DateTimeUtil = require('../utils/DateTimeUtil');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

BilletService.createBillet = function (subscription, callback) {
	if(!subscription){
		callback('[BilletService.createBillet][Subscription: '+subscription.uuid+'][Error: newBillet parameter is invalid]');		
	}else if (!subscription.pedidoVendaId){
		callback('[BilletService.createBillet][Subscription: '+subscription.uuid+'][Error: check the following attribute: pedidoVendaId]');		
	}else{
		
		OrderService.get(subscription.uuid, subscription.pedidoVendaId, function(err, result){
			if(err){
				callback(err);
			}else{	
				var pedidoVenda = JSON.parse(result);
				var billet = { idContaReceber: pedidoVenda.parcelas[0].id, idCarteiraCobranca: Config.billet.CARTEIRADECOBRANCA };

				BilletVPSAClient.createBillet(subscription.uuid, JSON.stringify(billet), function(err, result){
					if(err){
						callback(err);
					}else{
						var resultObj = JSON.parse(result);
						
						if(resultObj && resultObj.codigoMensagem == 0 && resultObj.idRecurso){
							subscription.billet.id = resultObj.idRecurso;
							subscription.billet.link = BilletVPSAClient.getBilletUrlPDF(subscription.uuid, resultObj.idRecurso); 
							subscription.billet.status = GlowingBilletStatus.CREATED;
							callback(null, '[BilletService.createBillet][Subscription: '+subscription.uuid+'][Success: billet created with success, id ' + result + ']');
						} else {
							callback(result);
						}
					}
				});
			}
		});
	}	
};

BilletService.updateBillet = function(subscription, callback){
	SubscriptionStorage.updateBillet(subscription.uuid, subscription.billet, callback);
};

BilletService.getBilletJSON = function (subscription, callback) {
	if(!subscription || !subscription.uuid || !subscription.billet || !subscription.billet.id || !subscription.billet.link || typeof subscription.billet.id != 'number'){
		callback('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else{
		BilletVPSAClient.getBilletJSON(subscription.uuid, subscription.billet.id, function(err, billet) {
			if(err) {
				callback('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Errors: '+err+']', null);
			} else {
				if(billet == Config.billet.EMPTY_RESULT) {
					callback('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Errors: Billet not found', null);
				} else {					
					callback(null, subscription, JSON.parse(billet));
				}
			}
		});
	}
};

BilletService.updateGlowingBilletStatus = function (subscription, billet, callback) {

	if( !subscription || !subscription.uuid || !subscription.billet || !billet || !billet.status ) {
		callback('[BilletService.updateGlowingBilletStatus][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+'][Billet: '+JSON.stringify(billet)+']', null);	
	} else {

		var glowingBilletStatus = {};

		if(billet.status === VPSABilletStatus.PAGO) {
			glowingBilletStatus = 'PAYED';		
		} else if(billet.status === VPSABilletStatus.NAO_PAGO) {
			glowingBilletStatus = GlowingBilletStatus.NOT_PAYED;
		} else if(billet.status === VPSABilletStatus.INVALIDO) {
			glowingBilletStatus = GlowingBilletStatus.INVALID;
		} else if(billet.status === VPSABilletStatus.EMITIDO) {
			glowingBilletStatus = GlowingBilletStatus.SHIPPED;
		} else {
			callback ('Unable to define Glowing billet status by VPSA billet status '+ VPSABilletStatus, null);
			return;
		}

		subscription.billet.status = glowingBilletStatus;
		SubscriptionStorage.updateGlowingBilletStatus(subscription.uuid, subscription.billet.status, function(err) {
		  if(err) {
			 console.log('[BilletController.updateGlowingBilletStatus][Subscription: '+subscription.uuid+'][Errors: '+err+']');
	       	 callback(err, null);
		  } else {
			 console.log('[BilletController.updateGlowingBilletStatus][Subscription: '+subscription.uuid+'][Result: Succefully executed]');				 
	         callback(null, subscription);
		  }
		});
	}
};

BilletService.notifyPayedBilletToGlowingRestApi = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status ||
		!subscription.snapshot || 
		!subscription.snapshot.consultant) {
		callback('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']');	
	} else {
		if('PAYED' == subscription.billet.status) {
			var subscriptionConsultantRequest = subscription.snapshot;
			var planType = subscriptionConsultantRequest.planType;
			var addUpMonths = 0;

			if(planType == GlowingSubscriptionPlanType.ONEMONTH.name || planType == GlowingSubscriptionPlanType.GLOSS.name || planType == GlowingSubscriptionPlanType.BLUSH.name){
				addUpMonths = GlowingSubscriptionPlanType[planType].addUpMonths;
			}else{
				callback('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Error updating subscription][Error: Unable to define days to addup for plan type '+planType+']');
				return;
			}

			var actualSubscriptionExpirationDate = subscriptionConsultantRequest.subscriptionExpirationDate;
			var newSubscriptionExpirationDate = {};

			if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > new Date().getTime()) {
				newSubscriptionExpirationDate = DateTimeUtil.addUpMonths(actualSubscriptionExpirationDate, addUpMonths);
			} else {			
				newSubscriptionExpirationDate = DateTimeUtil.addUpMonths(null, addUpMonths);
			}

			subscription.snapshot.consultant.newSubscriptionExpirationDate = newSubscriptionExpirationDate;

			SubscriptionStorage.notifyPayedBilletToGlowingRestApi(subscription, function (err) {
				if(err) {
					callback(err);
				} else {							 
					callback(null, subscription);
				}			
			});
		} else {
			console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Status: '+subscription.billet.status+'][Result: Not necessary notify]');
			callback(null, subscription);
		}
	}	
};

BilletService.markAsNotifiedToGlowing = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[BilletService.markAsNotifiedToGlowing][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if('PAYED' == subscription.billet.status) {
			SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.PAYED_NOTIFIED, function(err) {
			  if(err) {
				 console.log('[BilletService.markAsNotifiedToGlowing][Subscription: '+subscription.uuid+'][Errors: '+err+']');
			   	 callback(err, null);
			  } else {
				 console.log('[BilletService.markAsNotifiedToGlowing][Subscription: '+subscription.uuid+'][Result: Succefully executed]');
			     callback(null, subscription);
			  }
			});
		} else {
			callback(null, subscription);
		}
	}
};

BilletService.updateGlowingSubscriptionStatus = function (subscription, callback) {

	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[BilletService.updateGlowingSubscriptionStatus][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if(subscription.billet.status === 'PAYED' || 
			subscription.billet.status === GlowingBilletStatus.NOT_PAYED || 
			subscription.billet.status === GlowingBilletStatus.INVALID) {
			SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingBilletStatus.FINISHED, function(err) {
			  if(err) {
				 console.log('[BilletController.updateGlowingSubscriptionStatus][Subscription: '+subscription.uuid+'][Errors: '+err+']');
		       	 callback(err, null);
			  } else {
				 console.log('[BilletController.updateGlowingSubscriptionStatus][Subscription: '+subscription.uuid+'][Result: Succefully executed][Status: '+GlowingBilletStatus.FINISHED+']');
		         callback(null, Config.result.OK);
			  }
			});
		} else {
			callback(null, 'Not necessary update. Billet Status: '+subscription.billet.status);	
		}
	}
};