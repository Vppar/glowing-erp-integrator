'use strict';

var SubscriptionStorage = require('../storages/SubscriptionStorage');
var IbgeUtil = require('../utils/IbgeUtil');
var GlowingBilletStatus = require('../enum/GlowingBilletStatus');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var IdentityService = require('../services/IdentityService');
var GlowingPaymentType = require('../enum/GlowingPaymentType');
var SubscriptionService = {};

exports = module.exports = SubscriptionService;

SubscriptionService.validateSubscriptionBeforeContinueFlow = function (subscriptionToValidate, callback){
	var messageValidation = [];
	
	if(!subscriptionToValidate){
		messageValidation.push('subscription is empty');
	}else if(!subscriptionToValidate.planType){
		messageValidation.push('subscription.planType is empty');
	}else if(!subscriptionToValidate.subscriptionDate){
		messageValidation.push('subscription.subscriptionDate is empty');		
	}else if(!subscriptionToValidate.consultant) {
		messageValidation.push('subscription.consultant is empty');
	}
	else {	
		var consultant = subscriptionToValidate.consultant;
		
		if(!consultant.uuid){
			messageValidation.push('subscription.uui is empty');
		}
		
		if(consultant.subscriptionExpirationDate && typeof consultant.subscriptionExpirationDate !== 'number'){
			messageValidation.push('subscription.subscriptionExpirationDate is not a number');
		}
		
		if(!consultant.cpf){
			messageValidation.push('subscription.cpf is empty');
		}else if(consultant.cpf.length !== 11){
			messageValidation.push('subscription.cpf is invalid');
		}
	
		if(!consultant.cep){
			messageValidation.push('subscription.cep is empty');
		}else if(!IbgeUtil.codIbge[consultant.cep]){
			messageValidation.push('subscription.cep is invalid');
		}
		
		if(!consultant.address){
			messageValidation.push('subscription.subscriptionToValidate is empty');
		}else{
			if(!consultant.address.street){
				messageValidation.push('subscription.address.street is empty');
			}
			
			if(!consultant.address.neighborhood){
				messageValidation.push('subscription.address.neighborhood is empty');
			}

			if(!consultant.address.city){
				messageValidation.push('subscription.address.city is empty');
			}
			
			if(!consultant.address.number){
				messageValidation.push('subscription.address.number is empty');
			}else if(typeof consultant.address.number !== 'string') {
				messageValidation.push('subscription.address.number is not a string');
			}
			
			if(!consultant.address.state){
				messageValidation.push('subscription.address.state is empty');
			}else if(consultant.address.state.length !== 2  && typeof consultant.address.state !== 'string') {
				messageValidation.push('subscription.address.state is invalid');
			}
		}
	}
	
	if(messageValidation.length > 0){
		callback('[SubscriptionService.validateSubscriptionBeforeContinueFlow][ValidationError: ' + messageValidation + ']');
	}else{
		callback();		
	}
};

SubscriptionService.createSubscriptionInitialValues = function (subscriptionSnapshot) {
  var subscription = {};
  subscription.uuid = IdentityService.generateUUID();
  subscription.status = GlowingSubscriptionStatus.INITIAL;
  subscription.createDate = new Date().getTime();
  subscription.paymentType = subscriptionSnapshot.paymentType;

  if(!subscription.paymentType || GlowingPaymentType.PAYMENT_TYPE_BILLET === subscription.paymentType) {
  	subscription.billet = {};
  	subscription.billet.status = VPSABilletStatus.INICIAL;
  	subscription.paymentType = GlowingPaymentType.PAYMENT_TYPE_BILLET;
  }

  subscription.snapshot = subscriptionSnapshot;
  return subscription;
};

SubscriptionService.saveSubscription = function(subscription, callback){
	SubscriptionStorage.save(subscription, callback);
};

SubscriptionService.updateSubscriptionStatus = function(subscriptionUUID, status, message, callback){
	SubscriptionStorage.updateSubscriptionStatus(subscriptionUUID, status, message, callback);
};

SubscriptionService.pushSubscriptionFailMessage = function(subscription, message, callback){
	SubscriptionStorage.pushSubscriptionFailMessage(subscription, message, callback);
};

SubscriptionService.getPengingUserActionSubscriptions = function (callback) {
 	SubscriptionStorage.getSubscriptions(function(err, subscriptions) {
 		if(err) {
			callback('['+err+']', null);
 		} else {
 			ArrayUtil.filterSubscriptionsByStatus(subscriptions, GlowingSubscriptionStatus.PENDING_USER_ACTION, function (pengingUserActionSubscriptions) {
				callback(null, pengingUserActionSubscriptions);
			});
 		}
 	});		
};

SubscriptionService.verifySubscriptionsAlreadyProcessed = function (subscription, callback) {
	SubscriptionStorage.getSubscriptions(function(err, subscriptions) {
 		if(err) {
			callback('[Subscription: '+subscription.uuid+']['+err+']');
 		} else if(!subscriptions) {
 			callback(null, subscription);
 		}else { 			
 			ArrayUtil.verifySubscriptionsAlreadyProcessed(subscriptions, subscription.uuid, function (err) {
				if(err) {
					callback('[Subscription: '+subscription.uuid+']['+err+']');
				} else {
					callback(null, subscription);
				}
			});		
 		}
 	});	
};

SubscriptionService.updateSubscriptionStatusToFinished = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[SubscriptionService.updateSubscriptionStatusToFinished][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if(subscription.billet.status === 'PAYED' || 
			subscription.billet.status === GlowingBilletStatus.NOT_PAYED || 
			subscription.billet.status === GlowingBilletStatus.INVALID) {
			subscription.status = GlowingSubscriptionStatus.FINISHED;
			SubscriptionStorage.updateSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.FINISHED, null, callback);			
		} else {
			callback(null, 'Not necessary update. Billet Status: '+subscription.billet.status);	
		}
	}
};

SubscriptionService.updateSubscriptionStatusToPayedNotified = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[SubscriptionService.updateSubscriptionStatusToPayedNotified][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if('PAYED' === subscription.billet.status) {
			SubscriptionStorage.updateSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.PAYED_NOTIFIED, null, function(err) {
				if(err) {
					callback(err, null);
				} else {
					subscription.status = GlowingSubscriptionStatus.PAYED_NOTIFIED;
					callback(null, subscription);
				}
			});
		} else {
			callback(null, subscription);
		}
	}
};