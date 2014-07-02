'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = {};

exports = module.exports = SubscriptionStorage;

SubscriptionStorage.save = function (subscription, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.set(subscriptionRef, subscription, null, function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};

SubscriptionStorage.update = function (subscription, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.update(subscriptionRef, subscription, function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};

SubscriptionStorage.getSubscriptions = function (callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);
  FirebaseBackend.get(subscriptionRef, function (err, subscriptions) {
		if(err) {
			callback(err, null);
		} else {
			console.log('[SubscriptionStorage.getSubscriptions][Process complete]');
			callback(null, subscriptions);
		}
	});
};

SubscriptionStorage.updateConsultantExpirationDate = function (subscriptionConsultantUpdate, callback) {
	var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);
	FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, JSON.stringify(subscriptionConsultantUpdate), function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};