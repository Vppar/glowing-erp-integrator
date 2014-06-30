'use strict';

var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantUpdate) {
  FirebaseBackend.set(consultantSubscriptionUpdateQueueRef, subscriptionConsultantUpdate, null, function(err, result) {
      if(err) {
        console.log(err);     
      } else {
        console.log(result);
      }
  });
};

var subscriptionConsultantUpdate = '{\'newSubscriptionExpirationDate\':1383066000000, \'consultantUUID\': 3333}';

add(subscriptionConsultantUpdate);