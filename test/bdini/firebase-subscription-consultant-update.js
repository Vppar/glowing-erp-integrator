'use strict';

var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var subscriptionConsultantUpdateQueueRef = FirebaseBackend.refs.base.child('pending/subscription-consultant-update-queue');

exports = module.exports = add;

function add(subscriptionConsultantUpdate) {
  FirebaseBackend.set(subscriptionConsultantUpdateQueueRef, subscriptionConsultantUpdate, null, function(err, result) {
      if(err) {
        console.log(err);     
      } else {
        console.log(result);
      }
  });
};

var subscriptionConsultantUpdate = '{\'newSubscriptionExpirationDate\':1383066000000, \'consultantUUID\': 3333}';

add(subscriptionConsultantUpdate);