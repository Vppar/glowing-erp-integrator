'use strict';

var FirebaseBackend = require('../backends/FirebaseBackend');
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

SubscriptionService.persistSubscription = function (subscriptionSnapshot, callback) {
	//TODO
	var err = '';
	if(err) {
		return callback(err, null);
  	}
  	callback(null, '[SubscriptionService.validateSubscriptionSnapshot][Results: OK]');
};