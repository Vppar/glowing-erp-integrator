'use strict';

var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var Config = require('../Config');
var SubscriptionStatus = require('../enum/SubscriptionStatus');
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

SubscriptionService.createSubscriptionInitialValues = function (subscriptionObj, callback) {

  var subscription = {};
  subscription.uuid = IdentityService.generateUUID();
  subscription.status = SubscriptionStatus.INITIAL;
  subscription.createDate = new Date();
  subscription['subscription-consultant-request-queue'] = subscriptionObj;  

  SubscriptionStorage.save(subscription, function(err, results) {
		if(err) {
			return callback(err);
	  	}
	  	callback(null, '[SubscriptionService.saveSubscriptionSnapshot][Results: OK]');
	});
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
	ArrayUtil.filter(subscriptions, SubscriptionStatus.PENDING_USER_ACTION, function (err, pengingUserActionSubscriptions) {
		if(err) {
			callback('[SubscriptionService.getPengingUserActionSubscriptions][No PENDING_USER_ACTION subscription to process]');
		} else {
			callback(null, pengingUserActionSubscriptions);
		}
	});	
};