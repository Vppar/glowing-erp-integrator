(function () {

'use strict';

// Simulate Glowing-ERP-Integrator requesting consultant update with new expiration date
// by adding a message on reference queue Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF

var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionUpdateQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantUpdate) {
  FirebaseBackend.push(consultantSubscriptionUpdateQueueRef, subscriptionConsultantUpdate, function(err, result) {
      if(err) {
        console.log(err);    
      } else {
        console.log('OK');
      }
  });
  return true;
}

/*
var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '223324324234';
subscriptionConsultantUpdate.origin = Config.APP_ORIGIN;
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '3333';
subscriptionConsultantUpdate.consultant.email = 'teste@test.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1383066000000;
add(subscriptionConsultantUpdate);

var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '888824324234';
subscriptionConsultantUpdate.origin = Config.APP_ORIGIN;
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '2222';
subscriptionConsultantUpdate.consultant.email = 'bbbb@test.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1383066000000;
add(subscriptionConsultantUpdate);
*/

var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '3ba3f5e0-2c7e-11e4-8469-0b000e000001';
subscriptionConsultantUpdate.origin = Config.APP_ORIGIN;
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '3ba3f5e0-2c7e-11e4-8469-0b000e000001';
subscriptionConsultantUpdate.consultant.email = 'rennan.nogarotto@tuntscorp.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1409667071000;

// 1409494271000   -> 31/8/1014

// 1397102400000   -> 10/4/2014

// 1409580671000   -. 1/9/2014


// 1409667071000   -> 2/9/2014

// 1409148671000   -> 27/8/2014

add(subscriptionConsultantUpdate);

})();