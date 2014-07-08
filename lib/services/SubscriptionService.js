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

SubscriptionService.validateSubscription = function (subscription, callback) {
	var err = null;
	if(err) {
		callback(err, null);
  	} else {
  		callback(null, '[SubscriptionService.validateSubscription][Subscription: '+subscription.uuid+'][Results: OK]');
  	}
};

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
 		ArrayUtil.filter(subscriptions, GlowingSubscriptionStatus.PENDING_USER_ACTION, function (err, pengingUserActionSubscriptions) {
			if(err) {
				callback('[SubscriptionService.getPengingUserActionSubscriptions][Error: No PENDING_USER_ACTION subscription to process]');
			} else {
				callback(null, pengingUserActionSubscriptions);
			}
		});
 	});		
};