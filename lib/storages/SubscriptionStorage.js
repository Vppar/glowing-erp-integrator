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
		} else {
			callback();
		}
	});
};

SubscriptionStorage.updateGlowingBilletStatus = function (subscriptionUUID, billetStatus, callback) {	

  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID+'/billet');
  var child = Config.billet.child.STATUS;
  FirebaseBackend.update(subscriptionRef, billetStatus, child, function(err) {
	if(err) {
		callback(err, null);
	} else {
		callback();
	}
  }); 
};

SubscriptionStorage.updateBillet = function (subscriptionUUID, billet, callback) {	
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
  FirebaseBackend.update(subscriptionRef, billet, Config.billet.child.BILLET, function(err) {
	if(err) {
		callback(err, null);
	} else {
		callback();
	}
  }); 
};

SubscriptionStorage.updateGlowingSubscriptionStatus = function (subscriptionUUID, subscriptionStatus, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
  var child = Config.subscription.child.STATUS;
  FirebaseBackend.update(subscriptionRef, subscriptionStatus, child, function(err) {
	if(err) {
		callback(err, null);
	} else  {
		callback();
	}
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

SubscriptionStorage.notifyPayedBilletToGlowingRestApi = function (subscription, callback) {	
	var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);

	var subscriptionConsultantRequest = subscription.snapshot;

	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.uuid = subscriptionConsultantRequest.uuid;
	subscriptionConsultantUpdate.consultant = {};
	subscriptionConsultantUpdate.consultant.uuid = subscriptionConsultantRequest.consultant.uuid;
	subscriptionConsultantUpdate.consultant.email = subscriptionConsultantRequest.consultant.email;
	subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = subscriptionConsultantRequest.consultant.newSubscriptionExpirationDate;

	FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, JSON.stringify(subscriptionConsultantUpdate), function(err) {
		if(err) {
			callback(err, null);
		} else {
			callback();
		}
	});
};