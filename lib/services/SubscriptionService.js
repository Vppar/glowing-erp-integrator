'use strict';
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var Config = require('../Config');
var GlowingSubscriptionStatus = require('../enum/GlowingSubscriptionStatus');
var VPSABilletStatus = require('../enum/VPSABilletStatus');
var ArrayUtil = require('../utils/ArrayUtil');
var IdentityService = require('../services/IdentityService');
var SubscriptionService = {};

exports = module.exports = SubscriptionService;

SubscriptionService.createSubscriptionInitialValues = function (subscriptionSnapshot) {
  var subscription = {};
  subscription.uuid = IdentityService.generateUUID();
  subscription.status = GlowingSubscriptionStatus.INITIAL;
  subscription.createDate = new Date().getTime();
  subscription.billet = {};
  subscription.billet.status = VPSABilletStatus.INICIAL;  
  subscription.snapshot = subscriptionSnapshot;
  return subscription;
};

SubscriptionService.saveSubscription = function(subscription, callback){
	SubscriptionStorage.save(subscription, callback);
};

SubscriptionService.updateSubscriptionStatus = function(subscriptionUUID, status, message, callback){
	SubscriptionStorage.updateSubscriptionStatus(subscriptionUUID, status, message, callback);
}

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
			SubscriptionStorage.updateSubscriptionStatus(subscription.uuid, GlowingBilletStatus.FINISHED, callback);
		} else {
			callback(null, 'Not necessary update. Billet Status: '+subscription.billet.status);	
		}
	}
};

SubscriptionService.updateSubscriptionStatusToPayedNotified = function (subscription, callback) {
	if( !subscription || !subscription.uuid || !subscription.billet || !subscription.billet.status) {
		callback('[SubscriptionService.updateSubscriptionStatusToPayedNotified][Subscription: '+subscription.uuid+'][Errors: Invalid parameters to this flow][Subscription: '+JSON.stringify(subscription)+']', null);	
	} else {
		if('PAYED' == subscription.billet.status) {
			SubscriptionStorage.updateSubscriptionStatus(subscription.uuid, GlowingSubscriptionStatus.PAYED_NOTIFIED, callback);
		} else {
			callback(null, subscription);
		}
	}
};