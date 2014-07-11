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

SubscriptionService.updateStatus = function(subscription, callback){
	SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid , subscription.status, function(err, result) {
			if( err ){
				callback(err);
			} else {
				SubscriptionStorage.updateGlowingBilletStatus(subscription.uuid, subscription.billet.status, callback);
			}
		}
	);
};

SubscriptionService.getPengingUserActionSubscriptions = function (callback) {
 	SubscriptionStorage.getSubscriptions(function(err, subscriptions) {
 		if(err) {
			callback('['+err+']');
 		} else {
 			ArrayUtil.filterSubscriptionsByStatus(subscriptions, GlowingSubscriptionStatus.PENDING_USER_ACTION, function (err, pengingUserActionSubscriptions) {
				if(err) {
					callback('['+err+']');
				} else {
					callback(null, pengingUserActionSubscriptions);
				}
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