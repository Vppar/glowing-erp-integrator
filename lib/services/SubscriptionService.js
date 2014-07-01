'use strict';

var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var Config = require('../Config');
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

SubscriptionService.saveSubscription = function (subscriptionObj, callback) {

  var subscription = {};
  subscription.UUID = IdentityService.generateUUID();
  subscription.status = 'INITIAL';
  subscription.createDate = new Date();
  subscription.billetUUID = '234234234'; //TODO REMOVE ME
  subscription['subscription-consultant-request-queue'] = subscriptionObj;  

  SubscriptionStorage.save(subscription, function(err, results) {
		if(err) {
			return callback(err, null);
	  	}
	  	callback(null, '[SubscriptionService.saveSubscriptionSnapshot][Results: OK]');
	});
};