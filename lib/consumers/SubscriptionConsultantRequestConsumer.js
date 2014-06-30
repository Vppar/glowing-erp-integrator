'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var BilletController = require('../controllers/BilletController');
var SubscriptionConsultantRequestConsumer = {};

exports = module.exports = SubscriptionConsultantRequestConsumer;

var subscriptionQueueConsumerRef = FirebaseBackend.refs.base.child(Config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD);
var subscriptionConsultantRequestChildRef = FirebaseBackend.refs.base.child(Config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD);

SubscriptionConsultantRequestConsumer.consumer = function () {
	FirebaseBackend.on(Config.firebase.eventType.VALUE, subscriptionConsultantRequestChildRef, function(err, subscriptionSnapshot) {
		console.log('subscriptionSnapshot>>>>> '+subscriptionSnapshot);
		if(err) {
			console.log(err);
			return;
		}
    	
		BilletController.handleBilletRequest(subscriptionSnapshot, function(err, results) {    	
	    	if(err) {
	    		console.log('[SubscriptionQueueConsumer.consumer][Error: '+err+']');
				return;
			} else {
				console.log('[SubscriptionQueueConsumer.consumer][Results: '+results+']');
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