// Simulate Glowing-Catalog adding new subscriptions
// Do not execute in production environment

'use strict';

var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantRequest) {
  FirebaseBackend.push(consultantSubscriptionRequestQueueRef, subscriptionConsultantRequest, null, function(err, result) {
  		if(err) {
  			console.log(err);  		
  		} else {
  			console.log(result);
  		}
  });
};

var address = {};
address.street = 'rua 1';
address.number = '555';

var consultant = {};
consultant.address = address;
consultant.subscriptionExpirationDate = 1383066000000;
consultant.uuid = '9999';
consultant.name = 'Joao da Silva';
consultant.cep = '12122999';
consultant.cpf = '33344433322';
consultant.email = 'ddd@ddd.com';
consultant.cityOrigin = 'Sao Paulo';
consultant.countryOrigin = 'Brasil';
consultant.complement = 'Apto 333';
consultant.phone = '11 3333 4444';
consultant.cellphone = '11 98444 2322';
consultant.emailPrimer = 'dsfsdf@ddd.com';

var subscriptionConsultantRequest = {};
subscriptionConsultantRequest.uuid = 1111;
subscriptionConsultantRequest.planType = 'GLOSS';
subscriptionConsultantRequest.date = 1383066000000;
subscriptionConsultantRequest.consultant = consultant;
add(JSON.stringify(subscriptionConsultantRequest));

subscriptionConsultantRequest.uuid = '2222';
subscriptionConsultantRequest.consultant.uuid = '8888';
add(JSON.stringify(subscriptionConsultantRequest));

subscriptionConsultantRequest.uuid = '3333';
subscriptionConsultantRequest.consultant.uuid = '7777';
add(JSON.stringify(subscriptionConsultantRequest));