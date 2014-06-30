'use strict';

var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = require('../storages/SubscriptionStorage');
var Config = require('../Config');
var ArrayUtil = require('../utils/ArrayUtil');
var SubscriptionService = {};

exports = module.exports = SubscriptionService;

SubscriptionService.validateSubscriptionSnapshot = function (subscriptionSnapshot, callback) {
	//TODO
	var err = '';
	if(err) {
		return callback(err, null);
  	}
  	callback(null, '[SubscriptionService.validateSubscriptionSnapshot][Results: OK]');
};

SubscriptionService.save = function (subscriptionSnapshot, callback) {
	SubscriptionStorage.save(subscriptionSnapshot, function(err, results) {
		if(err) {
			return callback(err, null);
	  	}
	  	callback(null, '[SubscriptionService.validateSubscriptionSnapshot][Results: OK]');
	});
};