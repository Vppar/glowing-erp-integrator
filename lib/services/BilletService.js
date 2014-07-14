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
						
						if(resultObj && resultObj.idRecurso){
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
		BilletVPSAClient.getBilletJSON(subscription.uuid, subscription.billet.id, callback);
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
					callback(null, subscription);
				}			
			});
		} else {
			console.log('[BilletService.notifyPayedBilletToGlowingRestApi][Subscription: '+subscription.uuid+'][Status: '+subscription.billet.status+'][Result: Not necessary notify]');
			callback(null, subscription);
		}
	}	
};