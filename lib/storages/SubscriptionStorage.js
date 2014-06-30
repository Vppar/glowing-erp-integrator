'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var SubscriptionStorage = {};

exports = module.exports = SubscriptionStorage;

var subscriptionRef = FirebaseBackend.refs.base.child(Config.SUBSCRIPTION_REF);

SubscriptionStorage.save = function (subscriptionSnapshot, callback) {
   var subscription = JSON.parse(subscriptionSnapshot);
   //billetid
   //subscription -> gerar
   
  subscription.status = 'INITIAL';

  FirebaseBackend.set(subscriptionRef, subscription, null, callback);
};