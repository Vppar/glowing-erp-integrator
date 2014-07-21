'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = {};

exports = module.exports = SubscriptionStorage;

SubscriptionStorage.save = function (subscription, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.set(subscriptionRef, subscription, null, callback);
};

SubscriptionStorage.updateBilletStatus = function (subscriptionUUID, billetStatus, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID+'/billet');
  var child = Config.billet.child.STATUS;
  FirebaseBackend.update(subscriptionRef, billetStatus, child, callback);
};

SubscriptionStorage.updateBilletValues = function (subscription, callback) {	
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.update(subscriptionRef, subscription.billet, Config.billet.child.BILLET, callback);
};

SubscriptionStorage.updateSubscriptionStatus = function (subscriptionUUID, subscriptionStatus, message, callback) {
  var subscriptionStatusRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
  FirebaseBackend.update(subscriptionStatusRef, subscriptionStatus, Config.subscription.child.STATUS, function(err) {
	if(err) {
		callback(err);
	} else  {
		if(message) {
			var subscriptionMessageRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
			FirebaseBackend.update(subscriptionMessageRef, message, Config.subscription.child.MESSAGE, callback);
		} else {
			callback();
		}
	}
  }); 
};

SubscriptionStorage.getSubscriptions = function (callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);
  FirebaseBackend.get(subscriptionRef, callback);
};

SubscriptionStorage.notifyPayedBilletToGlowingRestApi = function (subscription, callback) {

	var subscriptionConsultantUpdate = {};
	subscriptionConsultantUpdate.uuid = subscription.snapshot.uuid;
	subscriptionConsultantUpdate.origin = Config.APP_ORIGIN;
	subscriptionConsultantUpdate.consultant = {};
	subscriptionConsultantUpdate.consultant.uuid = subscription.snapshot.consultant.uuid;
	subscriptionConsultantUpdate.consultant.email = subscription.snapshot.consultant.email;
	subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = subscription.snapshot.consultant.newSubscriptionExpirationDate;

	FirebaseBackend.push(FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF), subscriptionConsultantUpdate, callback);
};