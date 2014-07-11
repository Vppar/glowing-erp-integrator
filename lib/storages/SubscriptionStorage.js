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
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscriptionUUID);
  var childStatus = Config.subscription.child.STATUS;
  var childMessage = Config.subscription.child.MESSAGE;
  FirebaseBackend.update(subscriptionRef, subscriptionStatus, childStatus, function(err) {
	if(err) {
		callback(err, null);
	} else  {
		callback();
	}
  }); 
};

SubscriptionStorage.getSubscriptions = function (callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);
  FirebaseBackend.get(subscriptionRef, callback);
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

	FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, JSON.stringify(subscriptionConsultantUpdate), callback);
};