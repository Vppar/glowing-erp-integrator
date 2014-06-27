'use strict';

var Config = require('../Config');
var FirebaseBackend = require('../backends/FirebaseBackend');
var BilletController = require('../controllers/BilletController');
var SubscriptionConsultantRequestConsumer = {};

exports = module.exports = SubscriptionConsultantRequestConsumer;

var subscriptionQueueConsumerRef = FirebaseBackend.refs.base.child(Config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD);

SubscriptionConsultantRequestConsumer.consumer = function () {
	/*FirebaseBackend.on(Config.subscription.consumer.eventType, subscriptionQueueConsumerRef, function(err, subscriptionSnapshot) {
	FirebaseBackend.on(Config.firebase.eventType.CHILD_ADDED, subscriptionQueueConsumerRef, function(err, subscriptionSnapshot) {
		if(err) {
			console.log(err);
			return;
		}
		if(subscriptionSnapshot.paymentType === Config.subscription.paymentType.billet) {
		if(subscriptionSnapshot.paymentType === Config.paymentType.BILLET) {
			BilletRequestController.handleBilletRequest(subscriptionSnapshot, function(err, results) {    	
		    	if(err) {
		    		console.log('[SubscriptionQueueConsumer.consumer][Error: '+err+']');
					return;
				} else {
					console.log('[SubscriptionQueueConsumer.consumer][Results: '+results+']');
				}
		    });
		}
		else {
			console.log('[SubscriptionQueueConsumer.consumer][Error: Payment type '+subscriptionSnapshot.paymentType+' not valid]');
		}	    */
};