'use strict';

var FirebaseBackend = require('../backends/firebase');
var subscriptionConsultantRequestQueueRef = FirebaseBackend.refs.base.child('pending/subscription-consultant-request-queue');
var Config = require('../../lib/Config');
var FirebaseBackend = require('../../lib/backends/FirebaseBackend');
var subscriptionConsultantRequestChildRef = FirebaseBackend.refs.base.child(Config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD);

exports = module.exports = add;

function add(subscriptionConsultantRequest) {
  FirebaseBackend.set(subscriptionConsultantRequestQueueRef, subscriptionConsultantRequest, null, function(err, result) {
  FirebaseBackend.set(subscriptionConsultantRequestChildRef, subscriptionConsultantRequest, null, function(err, result) {
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


add(subscriptionConsultantRequest);