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
	//TODO
	var err = '';
	if(err) {
		return callback(err, null);
  	}
  	callback(null, '[SubscriptionService.validateSubscription][Results: OK]');
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
	SubscriptionStorage.updateGlowingSubscriptionStatus(subscription.uuid , subscription.status , 
		function(err, result){
			if( err ){
				callback(err);
			}
			else {
				SubscriptionStorage.updateGlowingBilletStatus(subscription.uuid, subscription.billet.status, callback);
			}
		}
	);
};

SubscriptionService.getSubscriptions = function (callback) {
	SubscriptionStorage.getSubscriptions(function(err, results) {
		if(err) {
			return callback(err, null);
	  	} else {
	  		callback(null, results);
	  	}
	});
};

SubscriptionService.getPengingUserActionSubscriptions = function (subscriptions, callback) {
	ArrayUtil.filter(subscriptions, GlowingSubscriptionStatus.PENDING_USER_ACTION, function (err, pengingUserActionSubscriptions) {
		if(err) {
			callback('No PENDING_USER_ACTION subscription to process');
		} else {
			callback(null, pengingUserActionSubscriptions);
		}
	});	
};