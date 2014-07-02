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

SubscriptionStorage.update = function (subscription, billet, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.update(subscriptionRef, subscription, function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};

SubscriptionStorage.updateGlowingBilletStatus = function (subscriptionUUID, billetStatus, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID+'/billet');
  var child = Config.billet.child.STATUS;
  FirebaseBackend.update(subscriptionRef, billetStatus, child, function(err) {
	if(err) {
		callback(err, null);
	}
	callback();
  }); 
};

SubscriptionStorage.updateGlowingSubscriptionStatus = function (subscriptionUUID, subscriptionStatus, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
  var child = config.subscription.child.STATUS;
  FirebaseBackend.update(subscriptionRef, subscriptionStatus, child, function(err) {
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

SubscriptionStorage.updateConsultantExpirationDate = function (subscription, newSubscriptionExpirationDate, callback) {	
	var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);

	var subscriptionConsultantRequest = subscription['subscription-consultant-request-queue'];

	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.uuid = subscriptionConsultantRequest.uuid;
	subscriptionConsultantUpdate.consultant = {};
	subscriptionConsultantUpdate.consultant.uuid = subscriptionConsultantRequest.consultant.uuid;
	subscriptionConsultantUpdate.consultant.email = subscriptionConsultantRequest.consultant.email;
	subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = newSubscriptionExpirationDate;

	FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, JSON.stringify(subscriptionConsultantUpdate), function(err) {
		if(err) {
			callback(err, null);
		}
		callback();
	});
};