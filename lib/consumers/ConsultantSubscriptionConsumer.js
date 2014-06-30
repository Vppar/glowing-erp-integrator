'use strict';

var async = require('async');
var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var BilletController = require('../controllers/BilletController');
var SubscriptionController = require('../controllers/SubscriptionController');
var ConsultantSubscriptionConsumer = {};

exports = module.exports = ConsultantSubscriptionConsumer;

var consultantSubscriptionRequestQueueRef = FirebaseBackend.refs.base.child(Config.CONSULTANT_SUBSCRIPTION_REQUEST_QUEUE_REF);

ConsultantSubscriptionConsumer.verifyNewSubscriptions = function () {	
	FirebaseBackend.on(Config.firebase.eventType.VALUE, consultantSubscriptionRequestQueueRef, function(err, subscriptionSnapshot) {
		console.log('\n[ConsultantSubscriptionConsumer.consumer][Starting service...]'+subscriptionSnapshot);
		if(err) {
			console.log('\n[ConsultantSubscriptionConsumer.consumer][Error: '+err+']');
			return;
		}

		async.series([
			function(callback) {
	    		SubscriptionController.handleSubscription(subscriptionSnapshot, callback)
	  		},
	        function(callback) {
	        	BilletController.handleBillet(subscriptionSnapshot, callback)
	      	}  		
		], function(err, results) {
			if(err) {
				console.log('\n[ConsultantSubscriptionConsumer.verifyNewSubscriptions][Consumer flow executed with errors: '+ err+']');
			} else {
				console.log(null, '\n[ConsultantSubscriptionConsumer.verifyNewSubscriptions][Consumer flow executed successfully: '+ results+']');
			}  		
		}); 		
	});			
};


/*
Firebase URL: https://voppwishlist.firebaseio.com/pending/subscription-consultant-request-queue
{
    "{'uuid':'1111134234234', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'}}"
}
/*Firebase URL: https://voppwishlist.firebaseio.com/pending/subscription-consultant-request-queue
{
    "{'uuid':'1111134234234', 'planType':'ANUAL_12X', 'date': 1383066000000, 'status': 'PENDING','consultant':{'uuid':'234234', 'subscriptionExpirationDate':1383066000000, 'name':'Joao da Silva', 'cep':'12122333','address':{'street': 'rua', 'number': 555},'cpf':'33344433322','email':'ddd@ddd.com','cityOrigin':'sao paulo','countryOrigin':'brasil','complement':'apto 333','phone':'11 3333 4444','cellphone':'11 98444 2322','emailPrimer':'dsfsdf@ddd.com'}}"
}*/