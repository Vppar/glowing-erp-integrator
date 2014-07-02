// Simulate Glowing-ERP-Integrator requesting consultant update with new expiration date
// Do not execute in production environment

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
        console.log(result);
      }
  });
};

var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '223324324234';
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '3333';
subscriptionConsultantUpdate.consultant.email = 'teste@test.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1383066000000;

add(JSON.stringify(subscriptionConsultantUpdate));

var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '888824324234';
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '2222';
subscriptionConsultantUpdate.consultant.email = 'bbbb@test.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1383066000000;

add(JSON.stringify(subscriptionConsultantUpdate));

var subscriptionConsultantUpdate = {};
subscriptionConsultantUpdate.uuid = '999924324234';
subscriptionConsultantUpdate.consultant = {};
subscriptionConsultantUpdate.consultant.uuid = '7777';
subscriptionConsultantUpdate.consultant.email = 'aaaa@test.com';
subscriptionConsultantUpdate.consultant.newSubscriptionExpirationDate = 1383066000000;

add(JSON.stringify(subscriptionConsultantUpdate));