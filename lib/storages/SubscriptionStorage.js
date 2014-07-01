'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = {};

exports = module.exports = SubscriptionStorage;

SubscriptionStorage.save = function (subscription, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.set(subscriptionRef, subscription, null, callback);
};

SubscriptionStorage.update = function (subscription, callback) {
  var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF+'/'+subscription.uuid);
  FirebaseBackend.update(subscriptionRef, subscription, null, callback);
};