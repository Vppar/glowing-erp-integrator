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
		callback('[BilletService.createBillet][Error: newBillet parameter is invalid]');		
	}else if (!subscription.pedidoVendaId){
		callback('[BilletService.createBillet][Error: check the following attribute: pedidoVendaId]');		
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
						console.log('Boleto criado com sucesso');
						
						var resultObj = JSON.parse(result);
						
						if( resultObj && resultObj.codigoMensagem == 0 && resultObj.idRecurso ){
							subscription.billet.id = resultObj.idRecurso;
							subscription.billet.link = BilletVPSAClient.getBilletUrlPDF(resultObj.idRecurso); 
							subscription.billet.status = VPSABilletStatus.GERADO;
							
							callback(null, '[BilletService.createBillet][Success: billet created with success, id ' + result + ']');
						} else {
							callback(result);
						}
					}
				});
			}
		});
	}	
};

BilletService.getBilletJSON = function (subscription, callback) {
	if(!subscription || !subscription.uuid || !subscription.billet || !subscription.billet.id || !subscription.billet.link || typeof subscription.billet.id != 'number'){
		callback('[BilletService.getBilletJSON][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else{
		BilletVPSAClient.getBilletJSON(subscription.billet.id, function(err, billet) {
			if(err) {
				callback('SubscriptionUUID: '+subscription.uuid+'. '+err, null);
			} else {
				if(billet == '[]') {
					callback('SubscriptionUUID: '+subscription.uuid+'. Billet not found', null);
				} else {					
					callback(null, subscription, JSON.parse(billet));
				}
			}
		});
	}
};

BilletService.updateGlowingBilletStatus = function (subscription, billet, callback) {

	if( !subscription || !subscription.uuid || !subscription.billet || !billet || !billet.status ) {
		callback('[BilletService.updateGlowingBilletStatus][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+'][Billet: '+JSON.stringify(billet)+']', null);	
	} else {

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

		subscription.billet.status = glowingBilletStatus;

		SubscriptionStorage.updateGlowingBilletStatus(subscription, function(err) {
			  if(err) {
				 console.log('[BilletController.updateGlowingBilletStatus][Errors: '+err+']');
	          	 callback(err, null);
		      } else {
				 console.log('[BilletController.updateGlowingBilletStatus][Result: Succefully executed]');				 
	             callback(null, subscription);
		      }
		});
	}
};

BilletService.notifyPayedBilletToGlowingRestApi = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status ||
		!subscription['subscription-consultant-request-queue'] || 
		!subscription['subscription-consultant-request-queue'].consultant) {
		callback('[BilletService.notifyPayedBilletToGlowingRestApi][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if(GlowingBilletStatus.PAYED = subscription.billet.status) {

			var subscriptionConsultantRequest = subscription['subscription-consultant-request-queue'];
			var planType = subscriptionConsultantRequest.planType;
			var addUpMonths = 0;

			if(GlowingSubscriptionPlanType.ONEMONTH.name === planType) {
				addUpMonths = GlowingSubscriptionPlanType.ONEMONTH.addUp;		
			} else if(GlowingSubscriptionPlanType.GLOSS.name === planType) {
				addUpMonths = GlowingSubscriptionPlanType.GLOSS.addUp;
			} else if(GlowingSubscriptionPlanType.BLUSH.name === planType) {
				addUpMonths = GlowingSubscriptionPlanType.BLUSH.addUp;
			} else {
				callback('[BilletService.notifyPayedBilletToGlowingRestApi][Error updating subscription][Error: Unable to define days to addup for plan type '+planType+']', null);	
			}

			var actualSubscriptionExpirationDate = subscriptionConsultantRequest.subscriptionExpirationDate;
			var newSubscriptionExpirationDate = {};
			
			if(actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > new Date()) {
				newSubscriptionExpirationDate = DateTimeUtil.addUpMonths(actualSubscriptionExpirationDate, addUpMonths);
			} else {			
				newSubscriptionExpirationDate = DateTimeUtil.addUpMonths(null, addUpMonths);
			}

			subscription['subscription-consultant-request-queue'].consultant.newSubscriptionExpirationDate = newSubscriptionExpirationDate;

				SubscriptionStorage.notifyPayedBilletToGlowingRestApi(subscription, function (err) {
					if(err) {
						console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Error: '+err+']');
						callback(err, null);
					} else {							 
						console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Result: Succefully executed]');
						callback(null, subscription);
					}			
				});
			} else {
				console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Status: '+subscription.billet.status+'][Result: Not necessary notify]', null);
				callback(null, subscription);
			}
	}	
};

BilletService.markAsNotifiedToGlowingCatalgog = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[BilletService.markAsNotifiedToGlowingCatalgog][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if(GlowingBilletStatus.PAYED = subscription.billet.status) {
			SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.PAYED_NOTIFIED, function(err) {
			  if(err) {
				 console.log('[BilletService.markAsNotified][Errors: '+err+']');
			   	 callback(err, null);
			  } else {
				 console.log('[BilletService.markAsNotified][Result: Succefully executed]');
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
		callback('[BilletService.updateGlowingSubscriptionStatus][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if(subscription.billet.status === 'PAYED' || 
			subscription.billet.status === GlowingBilletStatus.NOT_PAYED || 
			subscription.billet.status === GlowingBilletStatus.INVALID) {
			SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid, GlowingBilletStatus.FINISHED, function(err) {
			  if(err) {
				 console.log('[BilletController.updateGlowingSubscriptionStatus][Errors: '+err+']');
		       	 callback(err, null);
			  } else {
				 console.log('[BilletController.updateGlowingSubscriptionStatus][Result: Succefully executed][Status: '+GlowingBilletStatus.FINISHED+']');
		         callback(null, Config.result.OK);
			  }
			});
		} else {
			callback(null, 'Not necessary update. Billet Status: '+subscription.billet.status);	
		}
	}
};