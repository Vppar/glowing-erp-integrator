// Simulate Glowing-ERP-Integrator requesting consultant update with new expiration date
// by adding a message on reference queue Config.CONSULTANT_SUBSCRIPTION_UPDATE_QUEUE_REF

'use strict';

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
};

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
subscriptionConsultantUpdate.uuid = 'be7d8de3-0241-4bc8-9972-00fa37b775bd';
subscriptionConsultantUpdate.origin = Config.APP_ORIGIN;
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '9cc58a70-0ec7-11e4-ac00-01000e000001';
subscriptionConsultantUpdate.consultant.email = 'lucas.andrade@tuntscorp.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1397102400000;

add(subscriptionConsultantUpdate);