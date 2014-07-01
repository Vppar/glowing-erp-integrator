'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = {};

exports = module.exports = SubscriptionStorage;

var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);
var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

SubscriptionStorage.save = function (subscription, callback) {
  FirebaseBackend.set(subscriptionRef+'/'+subscription.uuid, subscription, null, , function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});

SubscriptionStorage.update = function (subscription, callback) {
  FirebaseBackend.update(subscriptionRef+'/'+subscription.uuid, subscription, null, , function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});

SubscriptionStorage.updateConsultantExpirationDate = function (subscriptionConsultantUpdate, callback) {
	FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, JSON.stringify(subscriptionConsultantUpdate), function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};