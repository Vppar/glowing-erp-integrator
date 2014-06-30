'use strict';

var FirebaseBackend = require('../backends/firebase');
var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.consultantSubscriptionRequestQueueRef);
var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

exports = module.exports = add;

function add(subscriptionConsultantRequest) {
  FirebaseBackend.set(consultantSubscriptionRequestQueueRef, subscriptionConsultantRequest, null, function(err, result) {
  FirebaseBackend.push(consultantSubscriptionRequestQueueRef, subscriptionConsultantRequest, null, function(err, result) {
  		if(err) {
  			console.log(err);  		
  		} else {
  			console.log(result);
  		}
  });
};

var subscriptionConsultantRequest = '{\'uuid\':\'1111134234234\', \'planType\':\'ANUAL_12X\', \'date\': 1383066000000, \'status\': \'PENDING\','+ 
								'\'consultant\':{\'uuid\':\'234234\', \'subscriptionExpirationDate\':1383066000000, \'name\':\'Joao da Silva\', \'cep\':\'12122333\','+
                                '\'address\':{\'street\': \'rua\', \'number\': 555},\'cpf\':\'33344433322\','+
                                '\'email\':\'ddd@ddd.com\',\'cityOrigin\':\'sao paulo\',\'countryOrigin\':\'brasil\','+
                                '\'complement\':\'apto 333\',\'phone\':\'11 3333 4444\','+
                                '\'cellphone\':\'11 98444 2322\',\'emailPrimer\':\'dsfsdf@ddd.com\'} '+
                    '}';
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

add(subscriptionConsultantRequest);
var subscriptionConsultantRequest = {};
subscriptionConsultantRequest.uuid = 1111;
subscriptionConsultantRequest.status = 'PENDING';
subscriptionConsultantRequest.planType = 'ANUAL_12X';
subscriptionConsultantRequest.date = 1383066000000;
subscriptionConsultantRequest.consultant = consultant;

add(JSON.stringify(subscriptionConsultantRequest));

subscriptionConsultantRequest.uuid = '2222';
subscriptionConsultantRequest.consultant.uuid = '8888';
add(JSON.stringify(subscriptionConsultantRequest));

subscriptionConsultantRequest.uuid = '3333';
subscriptionConsultantRequest.consultant.uuid = '7777';
add(JSON.stringify(subscriptionConsultantRequest));