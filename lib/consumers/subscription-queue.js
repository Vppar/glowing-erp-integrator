'use strict';

var config = require('../config');
var FirebaseBackend = require('../backends/firebase');
var subscriptionQueueConsumerRef = FirebaseBackend.refs.base.child(config.subscription.consumer.child);
var subscriptionQueueConsumerRef = FirebaseBackend.refs.base.child(config.consumer.SUBSCRIPTION_CONSULTANT_REQUEST_CHILD);
var BilletRequestController = require('../controllers/billet-request');

var SubscriptionQueue = {};
exports = module.exports = SubscriptionQueue;

SubscriptionQueue.consumer = function () {
	FirebaseBackend.on(config.subscription.consumer.eventType, subscriptionQueueConsumerRef, function(err, subscriptionSnapshot) {
	FirebaseBackend.on(config.firebase.eventType.CHILD_ADDED, subscriptionQueueConsumerRef, function(err, subscriptionSnapshot) {
		if(err) {
			console.log(err);
			return;
		}
		if(subscriptionSnapshot.paymentType === config.subscription.paymentType.billet) {
		if(subscriptionSnapshot.paymentType === config.paymentType.BILLET) {
			BilletRequestController.handleBilletRequest(subscriptionSnapshot, function(err, results) {    	
		    	if(err) {
		    		console.log('[SubscriptionQueue.consumer][Error: '+err+']');
					return;
				} else {
					console.log('[SubscriptionQueue.consumer][Results: '+results+']');
				}
		    });
		}
		else {
			console.log('[SubscriptionQueue.consumer][Error: Payment type '+subscriptionSnapshot.paymentType+' not valid]');
		}	    
	});
};