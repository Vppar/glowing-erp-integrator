'use strict';

var BilletVPSAClient = require('../clients/vpsa/BilletVPSAClient');
var OrderService = require('../services/OrderService');
var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var GlowingSubscriptionPlanType = require('../enum/GlowingSubscriptionPlanType');
var Config = require('../Config');
var DateTimeUtil = require('../utils/DateTimeUtil');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var async = require('async');

var BilletService = {};
exports = module.exports = BilletService;

BilletService.createBillet = function (subscription, callback) {
	if(!subscription){
		callback('[BilletService.createBillet][Subscription: '+subscription.uuid+'][Error: newBillet parameter is invalid]');		
	}else if (!subscription.orderId){
		callback('[BilletService.createBillet][Subscription: '+subscription.uuid+'][Error: check the following attribute: orderId]');		
	}else{
		OrderService.get(subscription.uuid, subscription.orderId, function(err, order){
			if(err) {
				callback(err);
			} else {
				if(!order) {
					callback('[BilletService.createBillet][Subscription: '+subscription.uuid+'][Error: Fail to create order]');
				} else {
					var billet = { idContaReceber: order.parcelas[0].id, idCarteiraCobranca: Config.billet.CARTEIRADECOBRANCA };

					BilletVPSAClient.createBillet(subscription.uuid, billet, function(err, billetObj){
						if(err){
							callback(err);
						}else{				
							subscription.billet.id = billetObj.idRecurso;
							subscription.billet.link = getBilletUrlPDF(subscription.uuid, billetObj.idRecurso); 
							subscription.billet.status = GlowingBilletStatus.CREATED;
							callback(null, '[BilletService.createBillet][Subscription: '+subscription.uuid+'][Success: billet created with success, id ' + billetObj.idRecurso + ']');
						}
					});
				}				
			}
		});
	}	
};

BilletService.updateBilletValues = function(subscription, callback){
	SubscriptionStorage.updateBilletValues(subscription, callback);
};

BilletService.updateBilletStatus = function(subscriptionUUID, billetStatus, callback){
	SubscriptionStorage.updateBilletStatus(subscriptionUUID, billetStatus, callback);
};

BilletService.getBilletJSON = function (subscription, callback) {
	if(!subscription || !subscription.uuid || !subscription.billet || !subscription.billet.id || !subscription.billet.link || typeof subscription.billet.id != 'number'){
		callback('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']');	
	} else{
		BilletVPSAClient.getBilletJSON(subscription.uuid, subscription.billet.id, function(err, billetJSON) {
			if(err) {
				console.log('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Error: '+err+'][BilletJSON: '+billetJSON+']');				 
				callback(err, null);
			} else {
				if(!billetJSON) {
					console.log('[BilletService.getBilletJSON][Subscription: '+subscription.uuid+'][Error: BilletJSON returned null]');
					callback(err, null);
				} else {
					callback(null, subscription, billetJSON);
				}
			}
		});
	}
};

BilletService.updateBilletStatusByVPSABillet = function (subscription, billet, callback) {

	if( !subscription || !subscription.uuid || !subscription.billet || !billet || !billet.status ) {
		callback('[BilletService.updateBilletStatusByVPSABillet][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+'][Billet: '+JSON.stringify(billet)+']', null);	
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
			callback('[BilletService.updateBilletStatusByVPSABillet][Subscription: '+subscription.uuid+'][Errors: Unable to define Glowing billet status by VPSA billet status]');
			return;
		}

		subscription.billet.status = glowingBilletStatus;
		SubscriptionStorage.updateBilletStatus(subscription.uuid, subscription.billet.status, function(err) {
		  if(err) {
			 console.log('[BilletService.updateBilletStatusByVPSABillet][Subscription: '+subscription.uuid+'][Errors: '+err+']');
	       	 callback(err);
		  } else {
			 console.log('[BilletService.updateBilletStatusByVPSABillet][Subscription: '+subscription.uuid+'][Result: Succefully executed]');				 
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

			newSubscriptionExpirationDate = ((actualSubscriptionExpirationDate && actualSubscriptionExpirationDate > new Date().getTime())
											? DateTimeUtil.addUpMonths(actualSubscriptionExpirationDate, addUpMonths)
											: DateTimeUtil.addUpMonths(null, addUpMonths));
			
			subscription.snapshot.consultant.newSubscriptionExpirationDate = newSubscriptionExpirationDate;

			SubscriptionStorage.notifyPayedBilletToGlowingRestApi(subscription, function (err) {
				if(err) {
					callback(err);
				} else {	
					console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Notified Glowing-Catalgog to replace subscriptionExpirationDate from '+actualSubscriptionExpirationDate+' to '+newSubscriptionExpirationDate+']');
					callback(null, subscription);
				}			
			});
		} else {
			console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Status: '+subscription.billet.status+'][Result: Not necessary notify]');
			callback(null, subscription);
		}
	}	
};

function getBilletUrlPDF(subscriptionUUID, billetId) {	

	if(billetId && typeof billetId == 'number'){
		return Config.PATH_VPSA_BOLETOS + billetId + Config.PATH_VPSA_BOLETOS_IMPRESSAO;
	}
	throw '[BilletService.getBilletUrlPDF][Subscription: '+subscriptionUUID+'][Error: BilletId parameter is empty]';
};